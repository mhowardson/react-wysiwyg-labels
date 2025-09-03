// src/core/LabelDesignerContext.js - Core context and state management
import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { ELEMENT_TYPES, BARCODE_TYPES, DEFAULT_LABEL_SIZE } from './constants';
import { generateZPL, generateEPL } from './codeGenerators';
import { processVariables } from './variableManager';
import { saveTemplate, loadTemplate } from './templateManager';

const LabelDesignerContext = createContext();

const initialState = {
  elements: [],
  selectedElement: null,
  labelSize: DEFAULT_LABEL_SIZE,
  isDragging: false,
  dragOffset: { x: 0, y: 0 },
  showCode: false,
  outputFormat: 'ZPL',
  templates: [],
  variables: {},
  history: [],
  historyIndex: -1,
  clipboard: null,
  showGrid: true,
  showRulers: true,
  gridSize: 10,
  enableSnap: true,
  zoom: 1,
  panOffset: { x: 0, y: 0 },
  isLoading: false,
  error: null
};

const actionTypes = {
  // Element actions
  ADD_ELEMENT: 'ADD_ELEMENT',
  UPDATE_ELEMENT: 'UPDATE_ELEMENT',
  DELETE_ELEMENT: 'DELETE_ELEMENT',
  SELECT_ELEMENT: 'SELECT_ELEMENT',
  DUPLICATE_ELEMENT: 'DUPLICATE_ELEMENT',
  MOVE_ELEMENT: 'MOVE_ELEMENT',
  RESIZE_ELEMENT: 'RESIZE_ELEMENT',
  
  // Clipboard actions
  COPY_ELEMENT: 'COPY_ELEMENT',
  PASTE_ELEMENT: 'PASTE_ELEMENT',
  CUT_ELEMENT: 'CUT_ELEMENT',
  
  // UI state
  SET_DRAGGING: 'SET_DRAGGING',
  SET_DRAG_OFFSET: 'SET_DRAG_OFFSET',
  TOGGLE_CODE_VIEW: 'TOGGLE_CODE_VIEW',
  SET_OUTPUT_FORMAT: 'SET_OUTPUT_FORMAT',
  SET_LABEL_SIZE: 'SET_LABEL_SIZE',
  SET_ZOOM: 'SET_ZOOM',
  SET_PAN_OFFSET: 'SET_PAN_OFFSET',
  TOGGLE_GRID: 'TOGGLE_GRID',
  TOGGLE_RULERS: 'TOGGLE_RULERS',
  SET_GRID_SIZE: 'SET_GRID_SIZE',
  TOGGLE_SNAP: 'TOGGLE_SNAP',
  
  // History actions
  PUSH_HISTORY: 'PUSH_HISTORY',
  UNDO: 'UNDO',
  REDO: 'REDO',
  
  // Template actions
  SAVE_TEMPLATE: 'SAVE_TEMPLATE',
  LOAD_TEMPLATE: 'LOAD_TEMPLATE',
  DELETE_TEMPLATE: 'DELETE_TEMPLATE',
  SET_TEMPLATES: 'SET_TEMPLATES',
  
  // Variable actions
  SET_VARIABLES: 'SET_VARIABLES',
  UPDATE_VARIABLE: 'UPDATE_VARIABLE',
  
  // State management
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  RESET_STATE: 'RESET_STATE'
};

const labelDesignerReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.ADD_ELEMENT: {
      const newElement = {
        id: Date.now(),
        type: action.elementType,
        x: action.x || 50,
        y: action.y || 50,
        width: action.width || getDefaultSize(action.elementType).width,
        height: action.height || getDefaultSize(action.elementType).height,
        rotation: 0,
        properties: getDefaultProperties(action.elementType),
        zIndex: state.elements.length
      };
      return {
        ...state,
        elements: [...state.elements, newElement],
        selectedElement: newElement.id
      };
    }

    case actionTypes.UPDATE_ELEMENT: {
      return {
        ...state,
        elements: state.elements.map(el => 
          el.id === action.elementId 
            ? { ...el, ...action.updates }
            : el
        )
      };
    }

    case actionTypes.DELETE_ELEMENT: {
      return {
        ...state,
        elements: state.elements.filter(el => el.id !== action.elementId),
        selectedElement: state.selectedElement === action.elementId ? null : state.selectedElement
      };
    }

    case actionTypes.SELECT_ELEMENT: {
      return {
        ...state,
        selectedElement: action.elementId
      };
    }

    case actionTypes.DUPLICATE_ELEMENT: {
      const element = state.elements.find(el => el.id === action.elementId);
      if (!element) return state;
      
      const newElement = {
        ...element,
        id: Date.now(),
        x: element.x + 20,
        y: element.y + 20,
        zIndex: state.elements.length
      };
      
      return {
        ...state,
        elements: [...state.elements, newElement],
        selectedElement: newElement.id
      };
    }

    case actionTypes.COPY_ELEMENT: {
      const element = state.elements.find(el => el.id === action.elementId);
      return {
        ...state,
        clipboard: element ? { ...element } : null
      };
    }

    case actionTypes.PASTE_ELEMENT: {
      if (!state.clipboard) return state;
      
      const newElement = {
        ...state.clipboard,
        id: Date.now(),
        x: state.clipboard.x + 20,
        y: state.clipboard.y + 20,
        zIndex: state.elements.length
      };
      
      return {
        ...state,
        elements: [...state.elements, newElement],
        selectedElement: newElement.id
      };
    }

    case actionTypes.SET_DRAGGING: {
      return {
        ...state,
        isDragging: action.isDragging
      };
    }

    case actionTypes.SET_DRAG_OFFSET: {
      return {
        ...state,
        dragOffset: action.offset
      };
    }

    case actionTypes.SET_LABEL_SIZE: {
      return {
        ...state,
        labelSize: action.size
      };
    }

    case actionTypes.SET_OUTPUT_FORMAT: {
      return {
        ...state,
        outputFormat: action.format
      };
    }

    case actionTypes.TOGGLE_CODE_VIEW: {
      return {
        ...state,
        showCode: !state.showCode
      };
    }

    case actionTypes.SET_ZOOM: {
      return {
        ...state,
        zoom: Math.max(0.1, Math.min(5, action.zoom))
      };
    }

    case actionTypes.TOGGLE_GRID: {
      return {
        ...state,
        showGrid: !state.showGrid
      };
    }

    case actionTypes.PUSH_HISTORY: {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({
        elements: [...state.elements],
        timestamp: Date.now()
      });
      
      return {
        ...state,
        history: newHistory.slice(-50), // Keep last 50 states
        historyIndex: newHistory.length - 1
      };
    }

    case actionTypes.UNDO: {
      if (state.historyIndex > 0) {
        const previousState = state.history[state.historyIndex - 1];
        return {
          ...state,
          elements: [...previousState.elements],
          historyIndex: state.historyIndex - 1,
          selectedElement: null
        };
      }
      return state;
    }

    case actionTypes.REDO: {
      if (state.historyIndex < state.history.length - 1) {
        const nextState = state.history[state.historyIndex + 1];
        return {
          ...state,
          elements: [...nextState.elements],
          historyIndex: state.historyIndex + 1,
          selectedElement: null
        };
      }
      return state;
    }

    case actionTypes.SAVE_TEMPLATE: {
      return {
        ...state,
        templates: [...state.templates, action.template]
      };
    }

    case actionTypes.LOAD_TEMPLATE: {
      return {
        ...state,
        elements: [...action.template.elements],
        labelSize: action.template.labelSize || state.labelSize,
        selectedElement: null
      };
    }

    case actionTypes.SET_VARIABLES: {
      return {
        ...state,
        variables: { ...action.variables }
      };
    }

    case actionTypes.SET_LOADING: {
      return {
        ...state,
        isLoading: action.isLoading
      };
    }

    case actionTypes.SET_ERROR: {
      return {
        ...state,
        error: action.error
      };
    }

    case actionTypes.RESET_STATE: {
      return {
        ...initialState,
        templates: state.templates
      };
    }

    default:
      return state;
  }
};

// Helper functions
const getDefaultSize = (elementType) => {
  switch (elementType) {
    case ELEMENT_TYPES.TEXT:
      return { width: 120, height: 20 };
    case ELEMENT_TYPES.LINE:
      return { width: 100, height: 2 };
    case ELEMENT_TYPES.BOX:
      return { width: 100, height: 80 };
    case ELEMENT_TYPES.CIRCLE:
      return { width: 60, height: 60 };
    case ELEMENT_TYPES.IMAGE:
      return { width: 100, height: 100 };
    case ELEMENT_TYPES.BARCODE:
      return { width: 120, height: 60 };
    default:
      return { width: 100, height: 80 };
  }
};

const getDefaultProperties = (elementType) => {
  switch (elementType) {
    case ELEMENT_TYPES.TEXT:
      return {
        text: 'Sample Text',
        fontSize: 12,
        fontWeight: 'normal',
        color: '#000000',
        alignment: 'left',
        fontFamily: 'Arial',
        variables: []
      };
    case ELEMENT_TYPES.LINE:
      return {
        thickness: 2,
        color: '#000000',
        style: 'solid'
      };
    case ELEMENT_TYPES.BOX:
      return {
        borderWidth: 2,
        borderColor: '#000000',
        fillColor: 'transparent',
        cornerRadius: 0
      };
    case ELEMENT_TYPES.CIRCLE:
      return {
        borderWidth: 2,
        borderColor: '#000000',
        fillColor: 'transparent'
      };
    case ELEMENT_TYPES.IMAGE:
      return {
        src: '',
        alt: 'Image',
        fit: 'contain',
        opacity: 1
      };
    case ELEMENT_TYPES.BARCODE:
      return {
        data: '123456789',
        type: 'CODE128',
        showText: true,
        textPosition: 'bottom',
        variables: []
      };
    default:
      return {};
  }
};

// Context Provider
export const LabelDesignerProvider = ({ 
  children, 
  config, 
  onSave, 
  onLoad, 
  onExport, 
  onVariableChange,
  initialData 
}) => {
  const [state, dispatch] = useReducer(labelDesignerReducer, {
    ...initialState,
    ...initialData,
    labelSize: initialData?.labelSize || config.labelSize || DEFAULT_LABEL_SIZE
  });

  // Auto-save to history on element changes
  useEffect(() => {
    if (state.elements.length > 0) {
      const timer = setTimeout(() => {
        dispatch({ type: actionTypes.PUSH_HISTORY });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state.elements]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!config.enableShortcuts) return;
      
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case 'z':
            e.preventDefault();
            dispatch({ type: actionTypes.UNDO });
            break;
          case 'y':
            e.preventDefault();
            dispatch({ type: actionTypes.REDO });
            break;
          case 'c':
            if (state.selectedElement) {
              e.preventDefault();
              dispatch({ type: actionTypes.COPY_ELEMENT, elementId: state.selectedElement });
            }
            break;
          case 'v':
            if (state.clipboard) {
              e.preventDefault();
              dispatch({ type: actionTypes.PASTE_ELEMENT });
            }
            break;
          case 'd':
            if (state.selectedElement) {
              e.preventDefault();
              dispatch({ type: actionTypes.DUPLICATE_ELEMENT, elementId: state.selectedElement });
            }
            break;
        }
      }
      
      if (e.key === 'Delete' && state.selectedElement) {
        dispatch({ type: actionTypes.DELETE_ELEMENT, elementId: state.selectedElement });
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [state.selectedElement, state.clipboard, config.enableShortcuts]);

  // Action creators
  const actions = {
    addElement: (elementType, x, y, width, height) => 
      dispatch({ type: actionTypes.ADD_ELEMENT, elementType, x, y, width, height }),
    
    updateElement: (elementId, updates) => 
      dispatch({ type: actionTypes.UPDATE_ELEMENT, elementId, updates }),
    
    deleteElement: (elementId) => 
      dispatch({ type: actionTypes.DELETE_ELEMENT, elementId }),
    
    selectElement: (elementId) => 
      dispatch({ type: actionTypes.SELECT_ELEMENT, elementId }),
    
    duplicateElement: (elementId) => 
      dispatch({ type: actionTypes.DUPLICATE_ELEMENT, elementId }),
    
    copyElement: (elementId) => 
      dispatch({ type: actionTypes.COPY_ELEMENT, elementId }),
    
    pasteElement: () => 
      dispatch({ type: actionTypes.PASTE_ELEMENT }),
    
    setDragging: (isDragging) => 
      dispatch({ type: actionTypes.SET_DRAGGING, isDragging }),
    
    setDragOffset: (offset) => 
      dispatch({ type: actionTypes.SET_DRAG_OFFSET, offset }),
    
    setLabelSize: (size) => 
      dispatch({ type: actionTypes.SET_LABEL_SIZE, size }),
    
    setOutputFormat: (format) => 
      dispatch({ type: actionTypes.SET_OUTPUT_FORMAT, format }),
    
    toggleCodeView: () => 
      dispatch({ type: actionTypes.TOGGLE_CODE_VIEW }),
    
    setZoom: (zoom) => 
      dispatch({ type: actionTypes.SET_ZOOM, zoom }),
    
    toggleGrid: () => 
      dispatch({ type: actionTypes.TOGGLE_GRID }),
    
    undo: () => 
      dispatch({ type: actionTypes.UNDO }),
    
    redo: () => 
      dispatch({ type: actionTypes.REDO }),
    
    saveTemplate: (template) => 
      dispatch({ type: actionTypes.SAVE_TEMPLATE, template }),
    
    loadTemplate: (template) => 
      dispatch({ type: actionTypes.LOAD_TEMPLATE, template }),
    
    setVariables: (variables) => 
      dispatch({ type: actionTypes.SET_VARIABLES, variables }),
    
    resetState: () => 
      dispatch({ type: actionTypes.RESET_STATE }),

    // Utility methods
    generateCode: (format = state.outputFormat) => {
      const processedElements = processVariables(state.elements, state.variables);
      return format === 'ZPL' 
        ? generateZPL(processedElements, state.labelSize)
        : generateEPL(processedElements, state.labelSize);
    },

    exportCode: async (format = state.outputFormat) => {
      const code = actions.generateCode(format);
      if (onExport) {
        await onExport(code, format, state);
      }
      return code;
    },

    saveCurrentTemplate: async (name, description) => {
      const template = {
        id: Date.now(),
        name,
        description,
        elements: [...state.elements],
        labelSize: { ...state.labelSize },
        createdAt: new Date().toISOString(),
        version: '1.0.0'
      };
      
      if (onSave) {
        await onSave(template);
      }
      
      actions.saveTemplate(template);
      return template;
    },

    loadTemplateById: async (templateId) => {
      let template = state.templates.find(t => t.id === templateId);
      
      if (!template && onLoad) {
        template = await onLoad(templateId);
      }
      
      if (template) {
        actions.loadTemplate(template);
      }
      
      return template;
    }
  };

  const contextValue = {
    state,
    actions,
    config
  };

  return (
    <LabelDesignerContext.Provider value={contextValue}>
      {children}
    </LabelDesignerContext.Provider>
  );
};

export const useLabelDesigner = () => {
  const context = useContext(LabelDesignerContext);
  if (!context) {
    throw new Error('useLabelDesigner must be used within a LabelDesignerProvider');
  }
  return context;
};

export default LabelDesignerContext;