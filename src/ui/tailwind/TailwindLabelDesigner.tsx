// src/ui/tailwind/TailwindLabelDesigner.js - Tailwind CSS implementation

import React, { useRef, useCallback, useEffect, useState } from 'react';
import { 
  HiArrowDownTray as Download,
  HiPlus as Plus,
  HiOutlineType as Type,
  HiMinus as Minus,
  HiStop as Square,
  HiOutlineEllipsisHorizontal as Circle,
  HiPhoto as ImageIcon,
  HiChartBar as BarChart3,
  HiCodeBracket as Code,
  HiCog8Tooth as Settings,
  HiTrash as Trash2,
  HiClipboard as Copy,
  HiArrowUturnLeft as Undo2,
  HiArrowUturnRight as Redo2,
  HiArchiveBox as Save,
  HiFolderOpen as FolderOpen,
  HiViewColumns as Grid3x3,
  HiOutlineRectangleGroup as Ruler,
  HiMagnifyingGlassPlus as ZoomIn,
  HiMagnifyingGlassMinus as ZoomOut,
  HiArrowPath as RotateCw,
  HiArrowUpTray as Upload,
  HiEye as Eye,
  HiEyeSlash as EyeOff,
  HiRectangleStack as Layers,
  HiCursorArrowRays as MousePointer
} from 'react-icons/hi2';

import { useLabelDesigner } from '../../core/LabelDesignerContext';
import { ELEMENT_TYPES, BARCODE_TYPES, COMMON_LABEL_SIZES } from '../../core/constants';
import TemplateManager from './components/TemplateManager';
import VariableManager from './components/VariableManager';
import PropertiesPanel from './components/PropertiesPanel';
import CodePreview from './components/CodePreview';
import ImageUploader from './components/ImageUploader';

const TailwindLabelDesigner = () => {
  const { state, actions, config } = useLabelDesigner();
  const canvasRef = useRef(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showVariables, setShowVariables] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);
  const [dragState, setDragState] = useState({
    isDragging: false,
    dragOffset: { x: 0, y: 0 },
    resizing: false,
    resizeHandle: null
  });

  // Mouse event handlers
  const handleMouseDown = useCallback((e, elementId) => {
    if (e.target.closest('.resize-handle')) {
      const handle = e.target.closest('.resize-handle').dataset.handle;
      setDragState({
        isDragging: false,
        resizing: true,
        resizeHandle: handle,
        dragOffset: { x: 0, y: 0 }
      });
      return;
    }
    
    const element = state.elements.find(el => el.id === elementId);
    if (!element) return;

    actions.selectElement(elementId);
    
    const rect = canvasRef.current.getBoundingClientRect();
    const offsetX = (e.clientX - rect.left) / state.zoom - element.x;
    const offsetY = (e.clientY - rect.top) / state.zoom - element.y;
    
    setDragState({
      isDragging: true,
      dragOffset: { x: offsetX, y: offsetY },
      resizing: false,
      resizeHandle: null
    });
    
    e.preventDefault();
  }, [state.elements, state.zoom, actions]);

  const handleMouseMove = useCallback((e) => {
    if (!dragState.isDragging && !dragState.resizing) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = (e.clientX - rect.left) / state.zoom;
    const clientY = (e.clientY - rect.top) / state.zoom;

    if (dragState.isDragging && state.selectedElement) {
      const newX = Math.max(0, Math.min(
        state.labelSize.width - 20, 
        clientX - dragState.dragOffset.x
      ));
      const newY = Math.max(0, Math.min(
        state.labelSize.height - 20, 
        clientY - dragState.dragOffset.y
      ));

      actions.updateElement(state.selectedElement, { x: newX, y: newY });
    } else if (dragState.resizing && state.selectedElement) {
      const element = state.elements.find(el => el.id === state.selectedElement);
      if (element) {
        const newWidth = Math.max(10, clientX - element.x);
        const newHeight = Math.max(10, clientY - element.y);
        actions.updateElement(state.selectedElement, { width: newWidth, height: newHeight });
      }
    }
  }, [dragState, state.selectedElement, state.elements, state.labelSize, state.zoom, actions]);

  const handleMouseUp = useCallback(() => {
    setDragState({
      isDragging: false,
      dragOffset: { x: 0, y: 0 },
      resizing: false,
      resizeHandle: null
    });
  }, []);

  useEffect(() => {
    if (dragState.isDragging || dragState.resizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState.isDragging, dragState.resizing, handleMouseMove, handleMouseUp]);

  // Canvas click handler
  const handleCanvasClick = useCallback((e) => {
    if (e.target === canvasRef.current) {
      actions.selectElement(null);
    }
  }, [actions]);

  // Add element functions
  const addElement = (type) => {
    const centerX = state.labelSize.width / 2 - 60;
    const centerY = state.labelSize.height / 2 - 30;
    actions.addElement(type, centerX, centerY);
  };

  // Render element function
  const renderElement = (element) => {
    const { id, type, x, y, width, height, properties } = element;
    const isSelected = state.selectedElement === id;
    
    const baseStyle = {
      position: 'absolute',
      left: x,
      top: y,
      width,
      height,
      cursor: dragState.isDragging ? 'grabbing' : 'grab',
      zIndex: element.zIndex || 0
    };

    const selectionStyle = isSelected ? 'ring-2 ring-blue-500 ring-offset-1' : '';

    let elementContent;

    switch (type) {
      case ELEMENT_TYPES.TEXT:
        elementContent = (
          <div
            className={`flex items-center justify-start px-2 py-1 bg-white bg-opacity-80 text-black border border-gray-300 ${selectionStyle}`}
            style={{
              ...baseStyle,
              fontSize: properties.fontSize || 12,
              fontWeight: properties.fontWeight || 'normal',
              fontFamily: properties.fontFamily || 'Arial',
              color: properties.color || '#000000',
              textAlign: properties.alignment || 'left'
            }}
          >
            {properties.text || 'Sample Text'}
          </div>
        );
        break;

      case ELEMENT_TYPES.LINE:
        elementContent = (
          <div
            className={`${selectionStyle}`}
            style={{
              ...baseStyle,
              backgroundColor: properties.color || '#000000',
              height: properties.thickness || 2
            }}
          />
        );
        break;

      case ELEMENT_TYPES.BOX:
        elementContent = (
          <div
            className={`${selectionStyle}`}
            style={{
              ...baseStyle,
              border: `${properties.borderWidth || 2}px solid ${properties.borderColor || '#000000'}`,
              backgroundColor: properties.fillColor === 'transparent' ? 'transparent' : properties.fillColor,
              borderRadius: properties.cornerRadius || 0
            }}
          />
        );
        break;

      case ELEMENT_TYPES.CIRCLE:
        elementContent = (
          <div
            className={`rounded-full ${selectionStyle}`}
            style={{
              ...baseStyle,
              border: `${properties.borderWidth || 2}px solid ${properties.borderColor || '#000000'}`,
              backgroundColor: properties.fillColor === 'transparent' ? 'transparent' : properties.fillColor
            }}
          />
        );
        break;

      case ELEMENT_TYPES.IMAGE:
        elementContent = (
          <div
            className={`flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 ${selectionStyle}`}
            style={baseStyle}
          >
            {properties.src ? (
              <img 
                src={properties.src} 
                alt={properties.alt || 'Image'} 
                className="max-w-full max-h-full object-contain"
                style={{ objectFit: properties.fit || 'contain' }}
              />
            ) : (
              <div className="text-center text-gray-500">
                <ImageIcon size={Math.min(width / 2, height / 2, 32)} />
                <div className="text-xs mt-1">Image</div>
              </div>
            )}
          </div>
        );
        break;

      case ELEMENT_TYPES.BARCODE:
        elementContent = (
          <div
            className={`flex flex-col items-center justify-center bg-white border border-gray-300 ${selectionStyle}`}
            style={baseStyle}
          >
            <div className="flex items-center justify-center flex-1">
              <BarChart3 size={Math.min(width - 8, height - (properties.showText ? 20 : 8))} />
            </div>
            {properties.showText && (
              <div className="text-xs font-mono text-center px-1">
                {properties.data || '123456789'}
              </div>
            )}
            <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-1 rounded-bl">
              {BARCODE_TYPES[properties.type]?.name || properties.type}
            </div>
          </div>
        );
        break;

      default:
        elementContent = <div style={baseStyle} />;
    }

    return (
      <div key={id} onMouseDown={(e) => handleMouseDown(e, id)}>
        {elementContent}
        {isSelected && (
          <div
            className="absolute w-3 h-3 bg-blue-500 border border-white cursor-se-resize resize-handle"
            style={{
              left: x + width - 6,
              top: y + height - 6
            }}
            data-handle="se"
          />
        )}
      </div>
    );
  };

  const selectedElementData = state.elements.find(el => el.id === state.selectedElement);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Toolbar */}
      <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-2 shadow-sm">
        <div className="space-y-1">
          <button
            onClick={() => addElement(ELEMENT_TYPES.TEXT)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors tooltip"
            title="Add Text"
          >
            <Type size={20} className="text-gray-700" />
          </button>
          <button
            onClick={() => addElement(ELEMENT_TYPES.LINE)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Add Line"
          >
            <Minus size={20} className="text-gray-700" />
          </button>
          <button
            onClick={() => addElement(ELEMENT_TYPES.BOX)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Add Box"
          >
            <Square size={20} className="text-gray-700" />
          </button>
          <button
            onClick={() => addElement(ELEMENT_TYPES.CIRCLE)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Add Circle"
          >
            <Circle size={20} className="text-gray-700" />
          </button>
          <button
            onClick={() => setShowImageUploader(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Add Image"
          >
            <ImageIcon size={20} className="text-gray-700" />
          </button>
          <button
            onClick={() => addElement(ELEMENT_TYPES.BARCODE)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Add Barcode"
          >
            <BarChart3 size={20} className="text-gray-700" />
          </button>
        </div>

        <div className="border-t border-gray-200 w-full pt-2"></div>

        <div className="space-y-1">
          <button
            onClick={actions.undo}
            disabled={state.historyIndex <= 0}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo"
          >
            <Undo2 size={20} className="text-gray-700" />
          </button>
          <button
            onClick={actions.redo}
            disabled={state.historyIndex >= state.history.length - 1}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Redo"
          >
            <Redo2 size={20} className="text-gray-700" />
          </button>
        </div>

        <div className="border-t border-gray-200 w-full pt-2"></div>

        <div className="space-y-1">
          <button
            onClick={() => setShowTemplates(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Templates"
          >
            <FolderOpen size={20} className="text-gray-700" />
          </button>
          {config.enableVariables && (
            <button
              onClick={() => setShowVariables(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Variables"
            >
              <Code size={20} className="text-gray-700" />
            </button>
          )}
          <button
            onClick={actions.toggleGrid}
            className={`p-2 rounded-lg transition-colors ${
              state.showGrid ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-700'
            }`}
            title="Toggle Grid"
          >
            <Grid3x3 size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-gray-700">Label Size:</label>
              <select
                value={Object.keys(COMMON_LABEL_SIZES).find(key => {
                  const size = COMMON_LABEL_SIZES[key];
                  return size.width === state.labelSize.width && size.height === state.labelSize.height;
                }) || 'custom'}
                onChange={(e) => {
                  if (e.target.value !== 'custom') {
                    const size = COMMON_LABEL_SIZES[e.target.value];
                    actions.setLabelSize({ width: size.width, height: size.height });
                  }
                }}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Object.entries(COMMON_LABEL_SIZES).map(([key, size]) => (
                  <option key={key} value={key}>{size.name}</option>
                ))}
              </select>
              <input
                type="number"
                value={state.labelSize.width}
                onChange={(e) => actions.setLabelSize({ 
                  ...state.labelSize, 
                  width: parseInt(e.target.value) || 400 
                })}
                className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Width"
              />
              <span className="text-gray-500">×</span>
              <input
                type="number"
                value={state.labelSize.height}
                onChange={(e) => actions.setLabelSize({ 
                  ...state.labelSize, 
                  height: parseInt(e.target.value) || 300 
                })}
                className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Height"
              />
            </div>

            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-gray-700">Format:</label>
              <select
                value={state.outputFormat}
                onChange={(e) => actions.setOutputFormat(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ZPL">ZPL</option>
                <option value="EPL">EPL</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => actions.setZoom(state.zoom - 0.1)}
                disabled={state.zoom <= 0.2}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                title="Zoom Out"
              >
                <ZoomOut size={16} />
              </button>
              <span className="text-sm font-mono w-12 text-center">
                {Math.round(state.zoom * 100)}%
              </span>
              <button
                onClick={() => actions.setZoom(state.zoom + 0.1)}
                disabled={state.zoom >= 3}
                className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                title="Zoom In"
              >
                <ZoomIn size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {state.selectedElement && (
              <>
                <button
                  onClick={() => actions.copyElement(state.selectedElement)}
                  className="px-3 py-1.5 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-1"
                >
                  <Copy size={14} />
                  <span>Copy</span>
                </button>
                <button
                  onClick={() => actions.duplicateElement(state.selectedElement)}
                  className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-1"
                >
                  <Copy size={14} />
                  <span>Duplicate</span>
                </button>
                <button
                  onClick={() => actions.deleteElement(state.selectedElement)}
                  className="px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-1"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </>
            )}
            
            <button
              onClick={actions.toggleCodeView}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center space-x-1 ${
                state.showCode 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Code size={14} />
              <span>Preview</span>
            </button>

            <button
              onClick={() => actions.exportCode()}
              className="px-3 py-1.5 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-1"
            >
              <Download size={14} />
              <span>Export {state.outputFormat}</span>
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Canvas */}
          <div className="flex-1 p-6 overflow-auto bg-gray-100">
            <div className="flex justify-center">
              <div className="relative">
                {/* Grid background */}
                {state.showGrid && (
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `
                        radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0),
                        linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
                      `,
                      backgroundSize: `${state.gridSize}px ${state.gridSize}px`
                    }}
                  />
                )}
                
                {/* Canvas */}
                <div
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  className="relative bg-white shadow-lg border border-gray-300 overflow-hidden"
                  style={{
                    width: state.labelSize.width * state.zoom,
                    height: state.labelSize.height * state.zoom,
                    transform: `scale(${state.zoom})`,
                    transformOrigin: '0 0'
                  }}
                >
                  {state.elements.map(renderElement)}
                </div>
              </div>
            </div>
          </div>

          {/* Properties Panel */}
          {selectedElementData && (
            <PropertiesPanel element={selectedElementData} />
          )}
        </div>
      </div>

      {/* Modals */}
      {showTemplates && (
        <TemplateManager
          onClose={() => setShowTemplates(false)}
          onLoad={(template) => {
            actions.loadTemplate(template);
            setShowTemplates(false);
          }}
          onSave={actions.saveCurrentTemplate}
        />
      )}

      {showVariables && (
        <VariableManager
          onClose={() => setShowVariables(false)}
          variables={state.variables}
          onVariablesChange={actions.setVariables}
          usedVariables={[]} // You'd implement getUsedVariables here
        />
      )}

      {showImageUploader && (
        <ImageUploader
          onClose={() => setShowImageUploader(false)}
          onImageSelect={(imageData) => {
            actions.addElement(ELEMENT_TYPES.IMAGE, 50, 50, 100, 100);
            const newElement = state.elements[state.elements.length - 1];
            actions.updateElement(newElement.id, {
              properties: { ...newElement.properties, src: imageData }
            });
            setShowImageUploader(false);
          }}
        />
      )}

      {state.showCode && (
        <CodePreview
          code={actions.generateCode()}
          format={state.outputFormat}
          onClose={actions.toggleCodeView}
          onExport={actions.exportCode}
        />
      )}
    </div>
  );
};

export default TailwindLabelDesigner;