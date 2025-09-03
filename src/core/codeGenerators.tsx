// src/core/codeGenerators.js - ZPL and EPL code generation

import { ELEMENT_TYPES, BARCODE_TYPES } from './constants';

/**
 * Generate ZPL (Zebra Programming Language) code
 * @param {Array} elements - Array of label elements
 * @param {Object} labelSize - Label dimensions
 * @param {Object} options - Generation options
 * @returns {string} ZPL code
 */
export const generateZPL = (elements, labelSize, options = {}) => {
  const {
    dpi = 203,
    units = 'dots',
    density = 8,
    printSpeed = 4,
    tearOff = 0
  } = options;

  let zpl = '^XA\n'; // Start format
  
  // Label configuration
  zpl += `^PW${Math.round(labelSize.width)}\n`; // Print width
  zpl += `^LL${Math.round(labelSize.height)}\n`; // Label length
  zpl += `^PR${printSpeed}\n`; // Print rate
  zpl += `^MD${density}\n`; // Media darkness
  
  if (tearOff !== 0) {
    zpl += `^TO${tearOff}\n`; // Tear off adjustment
  }

  // Sort elements by z-index
  const sortedElements = [...elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

  // Process each element
  sortedElements.forEach(element => {
    zpl += generateZPLElement(element, dpi);
  });

  zpl += '^XZ\n'; // End format
  
  return zpl;
};

/**
 * Generate ZPL code for a single element
 */
const generateZPLElement = (element, dpi = 203) => {
  const { type, x, y, width, height, rotation = 0, properties } = element;
  let zplCode = '';

  // Apply rotation if needed
  const rotationCode = rotation ? `^FWN` : '';

  switch (type) {
    case ELEMENT_TYPES.TEXT:
      zplCode += generateZPLText(element, dpi);
      break;
    case ELEMENT_TYPES.LINE:
      zplCode += generateZPLLine(element);
      break;
    case ELEMENT_TYPES.BOX:
      zplCode += generateZPLBox(element);
      break;
    case ELEMENT_TYPES.CIRCLE:
      zplCode += generateZPLCircle(element);
      break;
    case ELEMENT_TYPES.IMAGE:
      zplCode += generateZPLImage(element);
      break;
    case ELEMENT_TYPES.BARCODE:
      zplCode += generateZPLBarcode(element);
      break;
  }

  return zplCode;
};

const generateZPLText = (element, dpi) => {
  const { x, y, properties } = element;
  const { 
    text, 
    fontSize, 
    fontWeight, 
    fontFamily, 
    alignment = 'left',
    rotation = 0
  } = properties;

  // Map font size to ZPL font
  let zplFont = 'A'; // Default font
  let fontHeight = Math.max(10, Math.round(fontSize * 1.2));
  let fontWidth = Math.max(8, Math.round(fontSize));

  // ZPL font mapping
  if (fontSize <= 8) zplFont = '0';
  else if (fontSize <= 12) zplFont = 'A';
  else if (fontSize <= 16) zplFont = 'B';
  else if (fontSize <= 24) zplFont = 'D';
  else zplFont = 'E';

  // Font orientation
  const orientationMap = { 0: 'N', 90: 'R', 180: 'I', 270: 'B' };
  const orientation = orientationMap[rotation] || 'N';

  let zpl = `^FO${Math.round(x)},${Math.round(y)}`;
  zpl += `^A${zplFont}${orientation},${fontHeight},${fontWidth}`;
  
  // Text alignment
  if (alignment === 'center') {
    zpl += '^FB200,1,0,C,0';
  } else if (alignment === 'right') {
    zpl += '^FB200,1,0,R,0';
  }
  
  zpl += `^FD${text}^FS\n`;
  
  return zpl;
};

const generateZPLLine = (element) => {
  const { x, y, width, height, properties } = element;
  const { thickness = 2, color = '#000000' } = properties;
  
  // ZPL uses black/white only, so convert colors
  const zplColor = color === '#FFFFFF' || color === 'white' ? 'W' : 'B';
  
  return `^FO${Math.round(x)},${Math.round(y)}^GB${Math.round(width)},${Math.round(thickness)},${Math.round(thickness)},${zplColor}^FS\n`;
};

const generateZPLBox = (element) => {
  const { x, y, width, height, properties } = element;
  const { 
    borderWidth = 2, 
    borderColor = '#000000', 
    fillColor = 'transparent',
    cornerRadius = 0 
  } = properties;
  
  const zplBorderColor = borderColor === '#FFFFFF' || borderColor === 'white' ? 'W' : 'B';
  const fillSuffix = fillColor !== 'transparent' && fillColor !== '' ? ',B' : '';
  
  let zpl = `^FO${Math.round(x)},${Math.round(y)}^GB${Math.round(width)},${Math.round(height)},${Math.round(borderWidth)},${zplBorderColor}${fillSuffix}^FS\n`;
  
  // ZPL doesn't natively support rounded corners, so we approximate with multiple rectangles
  if (cornerRadius > 0) {
    // This is a simplified approach - real rounded corners would need more complex geometry
    zpl += `^FO${Math.round(x + cornerRadius)},${Math.round(y)}^GB${Math.round(width - 2 * cornerRadius)},${Math.round(borderWidth)},${Math.round(borderWidth)},${zplBorderColor}^FS\n`;
  }
  
  return zpl;
};

const generateZPLCircle = (element) => {
  const { x, y, width, height, properties } = element;
  const { borderWidth = 2, borderColor = '#000000' } = properties;
  
  const radius = Math.min(width, height) / 2;
  const centerX = Math.round(x + radius);
  const centerY = Math.round(y + radius);
  
  return `^FO${centerX},${centerY}^GC${Math.round(radius)},${Math.round(borderWidth)},B^FS\n`;
};

const generateZPLBarcode = (element) => {
  const { x, y, width, height, properties } = element;
  const { 
    data, 
    type = 'CODE128', 
    showText = true,
    textPosition = 'bottom',
    rotation = 0 
  } = properties;
  
  const barcodeInfo = BARCODE_TYPES[type];
  if (!barcodeInfo) return '';
  
  const orientationMap = { 0: 'N', 90: 'R', 180: 'I', 270: 'B' };
  const orientation = orientationMap[rotation] || 'N';
  
  let zpl = `^FO${Math.round(x)},${Math.round(y)}`;
  zpl += `${barcodeInfo.zpl}${orientation},${Math.round(height)}`;
  
  if (type === 'QR' || type === 'DATAMATRIX') {
    // 2D barcodes have different parameters
    zpl += `,Q,7,A,0,0`;
  } else {
    // Linear barcodes
    zpl += `,${showText ? 'Y' : 'N'}`;
  }
  
  zpl += `^FD${data}^FS\n`;
  
  return zpl;
};

const generateZPLImage = (element) => {
  const { x, y, width, height, properties } = element;
  const { src } = properties;
  
  if (!src) return '';
  
  // For actual implementation, you'd need to convert the image to ZPL-compatible format
  // This is a placeholder showing the structure
  return `^FO${Math.round(x)},${Math.round(y)}^GFA,${Math.round(width * height)},${Math.round(width * height)},${Math.round(width / 8)},<IMAGE_DATA>^FS\n`;
};

/**
 * Generate EPL (Eltron Programming Language) code
 * @param {Array} elements - Array of label elements
 * @param {Object} labelSize - Label dimensions
 * @param {Object} options - Generation options
 * @returns {string} EPL code
 */
export const generateEPL = (elements, labelSize, options = {}) => {
  const {
    speed = 4,
    density = 1,
    copies = 1
  } = options;

  let epl = '';
  
  // EPL header
  epl += 'N\n'; // Clear image buffer
  epl += `S${speed}\n`; // Set speed
  epl += `D${density}\n`; // Set density
  epl += 'ZT\n'; // Print orientation (top)
  epl += `q${Math.round(labelSize.width)}\n`; // Set label width
  epl += `Q${Math.round(labelSize.height)},26\n`; // Set label length and gap
  
  // Sort elements by z-index
  const sortedElements = [...elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

  // Process each element
  sortedElements.forEach(element => {
    epl += generateEPLElement(element);
  });

  epl += `P${copies}\n`; // Print command
  
  return epl;
};

/**
 * Generate EPL code for a single element
 */
const generateEPLElement = (element) => {
  const { type } = element;

  switch (type) {
    case ELEMENT_TYPES.TEXT:
      return generateEPLText(element);
    case ELEMENT_TYPES.LINE:
      return generateEPLLine(element);
    case ELEMENT_TYPES.BOX:
      return generateEPLBox(element);
    case ELEMENT_TYPES.BARCODE:
      return generateEPLBarcode(element);
    case ELEMENT_TYPES.IMAGE:
      return generateEPLImage(element);
    default:
      return '';
  }
};

const generateEPLText = (element) => {
  const { x, y, properties } = element;
  const { text, fontSize = 12, rotation = 0 } = properties;
  
  // EPL font size mapping
  let fontsize = 1;
  if (fontSize >= 8) fontsize = 1;
  if (fontSize >= 10) fontsize = 2;
  if (fontSize >= 12) fontsize = 3;
  if (fontSize >= 16) fontsize = 4;
  if (fontSize >= 20) fontsize = 5;
  
  const rotationCode = Math.floor(rotation / 90) % 4;
  
  return `A${Math.round(x)},${Math.round(y)},${rotationCode},${fontsize},1,1,N,"${text}"\n`;
};

const generateEPLLine = (element) => {
  const { x, y, width, height, properties } = element;
  const { thickness = 1 } = properties;
  
  // EPL line command: LO x,y,width,height
  const lineHeight = Math.max(thickness, 1);
  return `LO${Math.round(x)},${Math.round(y)},${Math.round(width)},${lineHeight}\n`;
};

const generateEPLBox = (element) => {
  const { x, y, width, height, properties } = element;
  const { borderWidth = 1 } = properties;
  
  // EPL box command: X x1,y1,thickness,x2,y2
  return `X${Math.round(x)},${Math.round(y)},${Math.round(borderWidth)},${Math.round(x + width)},${Math.round(y + height)}\n`;
};

const generateEPLBarcode = (element) => {
  const { x, y, width, height, properties } = element;
  const { 
    data, 
    type = 'CODE128', 
    showText = true,
    rotation = 0 
  } = properties;
  
  const barcodeInfo = BARCODE_TYPES[type];
  if (!barcodeInfo) return '';
  
  const rotationCode = Math.floor(rotation / 90) % 4;
  const eplType = barcodeInfo.epl || '1';
  const textFlag = showText ? 'B' : 'N';
  
  // EPL barcode command: B x,y,rotation,code,narrow,wide,height,human_readable,"data"
  return `B${Math.round(x)},${Math.round(y)},${rotationCode},${eplType},2,6,${Math.round(height)},${textFlag},"${data}"\n`;
};

const generateEPLImage = (element) => {
  const { x, y, width, height } = element;
  
  // EPL image placeholder - actual implementation would require image processing
  return `GW${Math.round(x)},${Math.round(y)},${Math.round(width / 8)},${Math.round(height)},<IMAGE_DATA>\n`;
};

/**
 * Generate DPL (Datamax Programming Language) code
 * @param {Array} elements - Array of label elements
 * @param {Object} labelSize - Label dimensions
 * @returns {string} DPL code
 */
export const generateDPL = (elements, labelSize) => {
  let dpl = '';
  
  // DPL header
  dpl += '\x02L\n'; // Start label format
  dpl += `H${Math.round(labelSize.height)}\n`; // Set label height
  dpl += `W${Math.round(labelSize.width)}\n`; // Set label width
  dpl += 'Q1\n'; // Quantity
  
  // Process elements
  elements.forEach(element => {
    dpl += generateDPLElement(element);
  });
  
  dpl += 'E\n'; // End and print
  
  return dpl;
};

const generateDPLElement = (element) => {
  const { type, x, y, properties } = element;
  
  switch (type) {
    case ELEMENT_TYPES.TEXT:
      return `1911A0100000000${Math.round(x).toString().padStart(4, '0')}${Math.round(y).toString().padStart(4, '0')}${properties.text}\n`;
    case ELEMENT_TYPES.BARCODE:
      const barcodeHeight = Math.round(element.height).toString().padStart(4, '0');
      return `1231100000000${Math.round(x).toString().padStart(4, '0')}${Math.round(y).toString().padStart(4, '0')}${barcodeHeight}${properties.data}\n`;
    default:
      return '';
  }
};

/**
 * Utility functions for code generation
 */

export const validateBarcodeData = (data, type) => {
  if (!data) return false;
  
  switch (type) {
    case 'CODE128':
      return /^[\x00-\x7F]+$/.test(data);
    case 'CODE39':
      return /^[A-Z0-9\-\.\$\/\+\%\s]*$/.test(data);
    case 'EAN13':
      return /^\d{12,13}$/.test(data);
    case 'UPC_A':
      return /^\d{11,12}$/.test(data);
    case 'QR':
      return data.length <= 2953; // Max QR code capacity
    default:
      return true;
  }
};

export const calculateBarcodeChecksum = (data, type) => {
  switch (type) {
    case 'EAN13':
      if (data.length === 12) {
        let sum = 0;
        for (let i = 0; i < 12; i++) {
          sum += parseInt(data[i]) * (i % 2 === 0 ? 1 : 3);
        }
        return (10 - (sum % 10)) % 10;
      }
      break;
    case 'UPC_A':
      if (data.length === 11) {
        let sum = 0;
        for (let i = 0; i < 11; i++) {
          sum += parseInt(data[i]) * (i % 2 === 0 ? 3 : 1);
        }
        return (10 - (sum % 10)) % 10;
      }
      break;
  }
  return null;
};

export const convertUnits = (value, fromUnit, toUnit, dpi = 203) => {
  // Convert to pixels first
  let pixels;
  switch (fromUnit) {
    case 'mm':
      pixels = (value * dpi) / 25.4;
      break;
    case 'in':
      pixels = value * dpi;
      break;
    case 'pt':
      pixels = (value * dpi) / 72;
      break;
    default:
      pixels = value;
  }
  
  // Convert from pixels to target unit
  switch (toUnit) {
    case 'mm':
      return (pixels * 25.4) / dpi;
    case 'in':
      return pixels / dpi;
    case 'pt':
      return (pixels * 72) / dpi;
    default:
      return pixels;
  }
};

export const optimizeCode = (code, format) => {
  // Basic code optimization
  let optimized = code;
  
  // Remove duplicate field origins that are identical
  optimized = optimized.replace(/(\^FO\d+,\d+)\n\1/g, '$1');
  
  // Combine adjacent text fields where possible
  if (format === 'ZPL') {
    // Add more ZPL-specific optimizations
    optimized = optimized.replace(/\^FS\n\^FO(\d+),(\d+)\^A/g, '^FS^FO$1,$2^A');
  }
  
  return optimized;
};