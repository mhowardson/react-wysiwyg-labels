// src/core/constants.js - Constants and type definitions

export const ELEMENT_TYPES = {
  TEXT: 'text',
  LINE: 'line',
  BOX: 'box',
  CIRCLE: 'circle',
  IMAGE: 'image',
  BARCODE: 'barcode'
};

export const BARCODE_TYPES = {
  CODE128: { name: 'Code 128', zpl: '^BC', epl: '1' },
  CODE39: { name: 'Code 39', zpl: '^B3', epl: '3' },
  EAN13: { name: 'EAN-13', zpl: '^BE', epl: 'E' },
  EAN8: { name: 'EAN-8', zpl: '^B8', epl: 'E8' },
  UPC_A: { name: 'UPC-A', zpl: '^BU', epl: 'UA' },
  UPC_E: { name: 'UPC-E', zpl: '^B9', epl: 'UE' },
  CODABAR: { name: 'Codabar', zpl: '^BK', epl: 'K' },
  CODE93: { name: 'Code 93', zpl: '^BA', epl: 'A' },
  CODE11: { name: 'Code 11', zpl: '^B1', epl: '1' },
  MSI: { name: 'MSI', zpl: '^BM', epl: 'M' },
  POSTNET: { name: 'POSTNET', zpl: '^BP', epl: 'P' },
  QR: { name: 'QR Code', zpl: '^BQ', epl: 'Q' },
  DATAMATRIX: { name: 'Data Matrix', zpl: '^BX', epl: 'X' },
  PDF417: { name: 'PDF417', zpl: '^B7', epl: '7' },
  MAXICODE: { name: 'MaxiCode', zpl: '^BD', epl: 'D' },
  AZTEC: { name: 'Aztec', zpl: '^BO', epl: 'O' }
};

export const FONT_FAMILIES = [
  'Arial',
  'Helvetica',
  'Times New Roman',
  'Courier New',
  'Verdana',
  'Georgia',
  'Impact',
  'Trebuchet MS',
  'Comic Sans MS',
  'Palatino'
];

export const FONT_WEIGHTS = [
  { value: 'normal', label: 'Normal' },
  { value: 'bold', label: 'Bold' },
  { value: '100', label: 'Thin' },
  { value: '200', label: 'Extra Light' },
  { value: '300', label: 'Light' },
  { value: '400', label: 'Regular' },
  { value: '500', label: 'Medium' },
  { value: '600', label: 'Semi Bold' },
  { value: '700', label: 'Bold' },
  { value: '800', label: 'Extra Bold' },
  { value: '900', label: 'Black' }
];

export const TEXT_ALIGNMENTS = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
  { value: 'justify', label: 'Justify' }
];

export const LINE_STYLES = [
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dotted', label: 'Dotted' }
];

export const IMAGE_FIT_OPTIONS = [
  { value: 'contain', label: 'Contain' },
  { value: 'cover', label: 'Cover' },
  { value: 'fill', label: 'Fill' },
  { value: 'scale-down', label: 'Scale Down' },
  { value: 'none', label: 'None' }
];

export const VARIABLE_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  DATE: 'date',
  BOOLEAN: 'boolean',
  BARCODE: 'barcode',
  IMAGE: 'image'
};

export const DATE_FORMATS = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
  { value: 'MMM DD, YYYY', label: 'MMM DD, YYYY' },
  { value: 'DD MMM YYYY', label: 'DD MMM YYYY' },
  { value: 'MMMM DD, YYYY', label: 'MMMM DD, YYYY' }
];

export const DEFAULT_LABEL_SIZE = {
  width: 400,
  height: 300
};

export const COMMON_LABEL_SIZES = {
  '2x1': { width: 200, height: 100, name: '2" x 1"' },
  '3x1': { width: 300, height: 100, name: '3" x 1"' },
  '4x2': { width: 400, height: 200, name: '4" x 2"' },
  '4x3': { width: 400, height: 300, name: '4" x 3"' },
  '4x6': { width: 400, height: 600, name: '4" x 6"' },
  '6x4': { width: 600, height: 400, name: '6" x 4"' },
  'custom': { width: 400, height: 300, name: 'Custom' }
};

export const PRINTER_TYPES = {
  ZEBRA: {
    name: 'Zebra',
    dpi: [203, 300, 600],
    formats: ['ZPL'],
    maxWidth: 832, // 4" at 208 DPI
    features: ['barcode', 'graphics', 'fonts']
  },
  ELTRON: {
    name: 'Eltron',
    dpi: [203, 300],
    formats: ['EPL'],
    maxWidth: 832,
    features: ['barcode', 'graphics']
  },
  DATAMAX: {
    name: 'Datamax',
    dpi: [203, 300, 600],
    formats: ['DPL'],
    maxWidth: 832,
    features: ['barcode', 'graphics', 'fonts']
  }
};

export const UNITS = {
  PX: { name: 'Pixels', abbr: 'px', factor: 1 },
  MM: { name: 'Millimeters', abbr: 'mm', factor: 3.779528 }, // 96 DPI
  IN: { name: 'Inches', abbr: 'in', factor: 96 }, // 96 DPI
  PT: { name: 'Points', abbr: 'pt', factor: 1.333333 }
};

export const GRID_SIZES = [5, 10, 15, 20, 25, 50];

export const ZOOM_LEVELS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 3, 4, 5];

export const KEYBOARD_SHORTCUTS = {
  UNDO: { key: 'z', ctrl: true, description: 'Undo last action' },
  REDO: { key: 'y', ctrl: true, description: 'Redo last action' },
  COPY: { key: 'c', ctrl: true, description: 'Copy selected element' },
  PASTE: { key: 'v', ctrl: true, description: 'Paste element' },
  DUPLICATE: { key: 'd', ctrl: true, description: 'Duplicate selected element' },
  DELETE: { key: 'Delete', description: 'Delete selected element' },
  SELECT_ALL: { key: 'a', ctrl: true, description: 'Select all elements' },
  SAVE: { key: 's', ctrl: true, description: 'Save template' },
  OPEN: { key: 'o', ctrl: true, description: 'Open template' },
  NEW: { key: 'n', ctrl: true, description: 'New label' },
  ZOOM_IN: { key: '=', ctrl: true, description: 'Zoom in' },
  ZOOM_OUT: { key: '-', ctrl: true, description: 'Zoom out' },
  ZOOM_FIT: { key: '0', ctrl: true, description: 'Fit to screen' },
  TOGGLE_GRID: { key: 'g', ctrl: true, description: 'Toggle grid' },
  TOGGLE_RULERS: { key: 'r', ctrl: true, description: 'Toggle rulers' }
};

export const ERROR_MESSAGES = {
  INVALID_BARCODE_DATA: 'Invalid barcode data format',
  IMAGE_LOAD_FAILED: 'Failed to load image',
  TEMPLATE_SAVE_FAILED: 'Failed to save template',
  TEMPLATE_LOAD_FAILED: 'Failed to load template',
  INVALID_LABEL_SIZE: 'Invalid label size',
  EXPORT_FAILED: 'Failed to export code',
  VARIABLE_NOT_FOUND: 'Variable not found',
  INVALID_VARIABLE_TYPE: 'Invalid variable type'
};

export const SUCCESS_MESSAGES = {
  TEMPLATE_SAVED: 'Template saved successfully',
  TEMPLATE_LOADED: 'Template loaded successfully',
  CODE_EXPORTED: 'Code exported successfully',
  ELEMENT_COPIED: 'Element copied to clipboard',
  ELEMENT_PASTED: 'Element pasted successfully'
};

// UI Framework specific constants
export const UI_FRAMEWORKS = {
  TAILWIND: 'tailwind',
  MATERIAL: 'material',
  BOOTSTRAP: 'bootstrap',
  ANT: 'ant',
  CUSTOM: 'custom'
};

export const THEME_COLORS = {
  PRIMARY: '#3b82f6',
  SECONDARY: '#6b7280',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#06b6d4'
};

// Default configurations for different UI frameworks
export const DEFAULT_CONFIGS = {
  [UI_FRAMEWORKS.TAILWIND]: {
    theme: {
      primary: 'bg-blue-500',
      secondary: 'bg-gray-500',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      error: 'bg-red-500'
    }
  },
  [UI_FRAMEWORKS.MATERIAL]: {
    theme: {
      palette: {
        primary: { main: '#1976d2' },
        secondary: { main: '#dc004e' }
      }
    }
  },
  [UI_FRAMEWORKS.BOOTSTRAP]: {
    theme: {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      success: 'btn-success',
      warning: 'btn-warning',
      danger: 'btn-danger'
    }
  },
  [UI_FRAMEWORKS.ANT]: {
    theme: {
      token: {
        colorPrimary: '#1890ff',
        colorSuccess: '#52c41a',
        colorWarning: '#faad14',
        colorError: '#f5222d'
      }
    }
  }
};

export const ELEMENT_ICONS = {
  [ELEMENT_TYPES.TEXT]: 'Type',
  [ELEMENT_TYPES.LINE]: 'Minus',
  [ELEMENT_TYPES.BOX]: 'Square',
  [ELEMENT_TYPES.CIRCLE]: 'Circle',
  [ELEMENT_TYPES.IMAGE]: 'ImageIcon',
  [ELEMENT_TYPES.BARCODE]: 'BarChart3'
};

// Export validation patterns
export const VALIDATION_PATTERNS = {
  BARCODE_CODE128: /^[\x00-\x7F]+$/, // ASCII characters
  BARCODE_CODE39: /^[A-Z0-9\-\.\$\/\+\%\s]*$/, // Code 39 valid chars
  BARCODE_EAN13: /^\d{12,13}$/, // 12-13 digits
  BARCODE_UPC: /^\d{11,12}$/, // 11-12 digits
  VARIABLE_NAME: /^[a-zA-Z][a-zA-Z0-9_]*$/, // Valid variable name
  HEX_COLOR: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, // Hex color
  URL: /^https?:\/\/.+/i // Basic URL validation
};