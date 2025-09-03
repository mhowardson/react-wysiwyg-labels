// src/core/variableManager.js - Variable and placeholder management

import { VARIABLE_TYPES, DATE_FORMATS } from './constants';

/**
 * Process variables in elements, replacing placeholders with actual values
 * @param {Array} elements - Array of label elements
 * @param {Object} variables - Variable values
 * @returns {Array} Elements with processed variables
 */
export const processVariables = (elements, variables = {}) => {
  return elements.map(element => ({
    ...element,
    properties: {
      ...element.properties,
      ...processElementProperties(element.properties, variables)
    }
  }));
};

const processElementProperties = (properties, variables) => {
  const processed = { ...properties };
  
  // Process text content
  if (processed.text) {
    processed.text = replaceVariablePlaceholders(processed.text, variables);
  }
  
  // Process barcode data
  if (processed.data) {
    processed.data = replaceVariablePlaceholders(processed.data, variables);
  }
  
  // Process image source
  if (processed.src) {
    processed.src = replaceVariablePlaceholders(processed.src, variables);
  }
  
  return processed;
};

/**
 * Replace variable placeholders in text with actual values
 * @param {string} text - Text containing placeholders
 * @param {Object} variables - Variable values
 * @returns {string} Text with replaced placeholders
 */
export const replaceVariablePlaceholders = (text, variables) => {
  if (!text || typeof text !== 'string') return text;
  
  // Match placeholders like {{variableName}}, {{variableName|format}}, etc.
  return text.replace(/\{\{([^}]+)\}\}/g, (match, placeholder) => {
    const [variableName, format] = placeholder.split('|').map(s => s.trim());
    const variable = variables[variableName];
    
    if (variable === undefined || variable === null) {
      return match; // Keep placeholder if variable not found
    }
    
    return formatVariableValue(variable, format);
  });
};

/**
 * Format a variable value based on its type and format specifier
 * @param {*} value - Variable value
 * @param {string} format - Format specifier
 * @returns {string} Formatted value
 */
export const formatVariableValue = (value, format) => {
  if (value === null || value === undefined) return '';
  
  // Handle different value types
  if (value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)))) {
    return formatDateValue(value, format);
  }
  
  if (typeof value === 'number') {
    return formatNumberValue(value, format);
  }
  
  if (typeof value === 'boolean') {
    return formatBooleanValue(value, format);
  }
  
  // Handle string formatting
  if (format) {
    return formatStringValue(value.toString(), format);
  }
  
  return value.toString();
};

const formatDateValue = (value, format) => {
  const date = value instanceof Date ? value : new Date(value);
  
  if (isNaN(date.getTime())) return value.toString();
  
  if (!format) format = 'MM/DD/YYYY';
  
  const formatMap = {
    'YYYY': date.getFullYear().toString(),
    'YY': date.getFullYear().toString().slice(-2),
    'MM': (date.getMonth() + 1).toString().padStart(2, '0'),
    'M': (date.getMonth() + 1).toString(),
    'MMM': date.toLocaleDateString('en', { month: 'short' }),
    'MMMM': date.toLocaleDateString('en', { month: 'long' }),
    'DD': date.getDate().toString().padStart(2, '0'),
    'D': date.getDate().toString(),
    'HH': date.getHours().toString().padStart(2, '0'),
    'H': date.getHours().toString(),
    'mm': date.getMinutes().toString().padStart(2, '0'),
    'm': date.getMinutes().toString(),
    'ss': date.getSeconds().toString().padStart(2, '0'),
    's': date.getSeconds().toString()
  };
  
  let formattedDate = format;
  Object.entries(formatMap).forEach(([pattern, replacement]) => {
    formattedDate = formattedDate.replace(new RegExp(pattern, 'g'), replacement);
  });
  
  return formattedDate;
};

const formatNumberValue = (value, format) => {
  if (!format) return value.toString();
  
  const formats = format.split(',').map(f => f.trim());
  
  for (const fmt of formats) {
    if (fmt.startsWith('decimal:')) {
      const decimals = parseInt(fmt.split(':')[1]) || 0;
      return value.toFixed(decimals);
    }
    
    if (fmt === 'currency') {
      return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD' 
      }).format(value);
    }
    
    if (fmt === 'percent') {
      return (value * 100).toFixed(1) + '%';
    }
    
    if (fmt.startsWith('pad:')) {
      const length = parseInt(fmt.split(':')[1]) || 0;
      return value.toString().padStart(length, '0');
    }
  }
  
  return value.toString();
};

const formatBooleanValue = (value, format) => {
  if (!format) return value ? 'true' : 'false';
  
  const [trueValue, falseValue] = format.split('|');
  return value ? (trueValue || 'true') : (falseValue || 'false');
};

const formatStringValue = (value, format) => {
  const formats = format.split(',').map(f => f.trim());
  let result = value;
  
  for (const fmt of formats) {
    switch (fmt) {
      case 'upper':
        result = result.toUpperCase();
        break;
      case 'lower':
        result = result.toLowerCase();
        break;
      case 'title':
        result = result.replace(/\w\S*/g, (txt) => 
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
        break;
      case 'trim':
        result = result.trim();
        break;
      default:
        if (fmt.startsWith('truncate:')) {
          const length = parseInt(fmt.split(':')[1]) || 0;
          if (result.length > length) {
            result = result.substring(0, length) + '...';
          }
        }
        if (fmt.startsWith('pad:')) {
          const length = parseInt(fmt.split(':')[1]) || 0;
          result = result.padEnd(length, ' ');
        }
    }
  }
  
  return result;
};

/**
 * Extract variable references from text
 * @param {string} text - Text to analyze
 * @returns {Array} Array of variable references
 */
export const extractVariableReferences = (text) => {
  if (!text || typeof text !== 'string') return [];
  
  const matches = text.match(/\{\{([^}]+)\}\}/g) || [];
  return matches.map(match => {
    const content = match.slice(2, -2).trim();
    const [name, format] = content.split('|').map(s => s.trim());
    return { name, format, placeholder: match };
  });
};

/**
 * Validate variable name
 * @param {string} name - Variable name to validate
 * @returns {boolean} Is valid
 */
export const validateVariableName = (name) => {
  return /^[a-zA-Z][a-zA-Z0-9_]*$/.test(name);
};

/**
 * Create a new variable definition
 * @param {string} name - Variable name
 * @param {string} type - Variable type
 * @param {*} defaultValue - Default value
 * @param {string} description - Description
 * @param {Object} validation - Validation rules
 * @returns {Object} Variable definition
 */
export const createVariable = (name, type, defaultValue, description, validation = {}) => {
  return {
    name,
    type,
    defaultValue,
    description,
    validation,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

/**
 * Validate variable value against its definition
 * @param {*} value - Value to validate
 * @param {Object} variableDefinition - Variable definition
 * @returns {Object} Validation result
 */
export const validateVariableValue = (value, variableDefinition) => {
  const { type, validation = {} } = variableDefinition;
  const result = { isValid: true, errors: [] };
  
  // Type validation
  switch (type) {
    case VARIABLE_TYPES.TEXT:
      if (typeof value !== 'string') {
        result.isValid = false;
        result.errors.push('Value must be a string');
      }
      break;
    case VARIABLE_TYPES.NUMBER:
      if (typeof value !== 'number' || isNaN(value)) {
        result.isValid = false;
        result.errors.push('Value must be a number');
      }
      break;
    case VARIABLE_TYPES.DATE:
      if (!(value instanceof Date) && isNaN(Date.parse(value))) {
        result.isValid = false;
        result.errors.push('Value must be a valid date');
      }
      break;
    case VARIABLE_TYPES.BOOLEAN:
      if (typeof value !== 'boolean') {
        result.isValid = false;
        result.errors.push('Value must be a boolean');
      }
      break;
  }
  
  // Custom validation rules
  if (result.isValid && validation.required && (value === null || value === undefined || value === '')) {
    result.isValid = false;
    result.errors.push('Value is required');
  }
  
  if (result.isValid && validation.minLength && typeof value === 'string' && value.length < validation.minLength) {
    result.isValid = false;
    result.errors.push(`Minimum length is ${validation.minLength}`);
  }
  
  if (result.isValid && validation.maxLength && typeof value === 'string' && value.length > validation.maxLength) {
    result.isValid = false;
    result.errors.push(`Maximum length is ${validation.maxLength}`);
  }
  
  if (result.isValid && validation.min && typeof value === 'number' && value < validation.min) {
    result.isValid = false;
    result.errors.push(`Minimum value is ${validation.min}`);
  }
  
  if (result.isValid && validation.max && typeof value === 'number' && value > validation.max) {
    result.isValid = false;
    result.errors.push(`Maximum value is ${validation.max}`);
  }
  
  if (result.isValid && validation.pattern && typeof value === 'string' && !new RegExp(validation.pattern).test(value)) {
    result.isValid = false;
    result.errors.push('Value does not match required pattern');
  }
  
  return result;
};

/**
 * Get all variables used in label elements
 * @param {Array} elements - Array of label elements
 * @returns {Array} Array of used variable names
 */
export const getUsedVariables = (elements) => {
  const usedVariables = new Set();
  
  elements.forEach(element => {
    const { properties } = element;
    
    // Check text content
    if (properties.text) {
      const refs = extractVariableReferences(properties.text);
      refs.forEach(ref => usedVariables.add(ref.name));
    }
    
    // Check barcode data
    if (properties.data) {
      const refs = extractVariableReferences(properties.data);
      refs.forEach(ref => usedVariables.add(ref.name));
    }
    
    // Check image source
    if (properties.src) {
      const refs = extractVariableReferences(properties.src);
      refs.forEach(ref => usedVariables.add(ref.name));
    }
    
    // Check element-specific variable arrays
    if (properties.variables && Array.isArray(properties.variables)) {
      properties.variables.forEach(variable => usedVariables.add(variable));
    }
  });
  
  return Array.from(usedVariables);
};

/**
 * Generate sample data for variables
 * @param {Array} variableDefinitions - Array of variable definitions
 * @returns {Object} Sample variable data
 */
export const generateSampleData = (variableDefinitions) => {
  const sampleData = {};
  
  variableDefinitions.forEach(variable => {
    switch (variable.type) {
      case VARIABLE_TYPES.TEXT:
        sampleData[variable.name] = variable.defaultValue || 'Sample Text';
        break;
      case VARIABLE_TYPES.NUMBER:
        sampleData[variable.name] = variable.defaultValue || Math.floor(Math.random() * 1000);
        break;
      case VARIABLE_TYPES.DATE:
        sampleData[variable.name] = variable.defaultValue || new Date();
        break;
      case VARIABLE_TYPES.BOOLEAN:
        sampleData[variable.name] = variable.defaultValue !== undefined ? variable.defaultValue : true;
        break;
      case VARIABLE_TYPES.BARCODE:
        sampleData[variable.name] = variable.defaultValue || '123456789';
        break;
      default:
        sampleData[variable.name] = variable.defaultValue || '';
    }
  });
  
  return sampleData;
};

/**
 * Preset variable collections for common use cases
 */
export const PRESET_VARIABLES = {
  shipping: [
    createVariable('recipientName', VARIABLE_TYPES.TEXT, 'John Doe', 'Recipient full name'),
    createVariable('recipientAddress', VARIABLE_TYPES.TEXT, '123 Main St', 'Recipient address'),
    createVariable('recipientCity', VARIABLE_TYPES.TEXT, 'New York', 'Recipient city'),
    createVariable('recipientZip', VARIABLE_TYPES.TEXT, '10001', 'Recipient ZIP code'),
    createVariable('trackingNumber', VARIABLE_TYPES.BARCODE, 'TRK123456789', 'Package tracking number'),
    createVariable('shipDate', VARIABLE_TYPES.DATE, new Date(), 'Ship date'),
    createVariable('weight', VARIABLE_TYPES.NUMBER, 5.5, 'Package weight in lbs')
  ],
  
  product: [
    createVariable('productName', VARIABLE_TYPES.TEXT, 'Sample Product', 'Product name'),
    createVariable('productSKU', VARIABLE_TYPES.TEXT, 'SKU-12345', 'Product SKU'),
    createVariable('productPrice', VARIABLE_TYPES.NUMBER, 29.99, 'Product price'),
    createVariable('productBarcode', VARIABLE_TYPES.BARCODE, '1234567890123', 'Product barcode'),
    createVariable('productDescription', VARIABLE_TYPES.TEXT, 'Product description', 'Product description'),
    createVariable('manufacturingDate', VARIABLE_TYPES.DATE, new Date(), 'Manufacturing date'),
    createVariable('expiryDate', VARIABLE_TYPES.DATE, new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), 'Expiry date')
  ],
  
  inventory: [
    createVariable('itemCode', VARIABLE_TYPES.TEXT, 'ITM-001', 'Item code'),
    createVariable('itemName', VARIABLE_TYPES.TEXT, 'Inventory Item', 'Item name'),
    createVariable('location', VARIABLE_TYPES.TEXT, 'A1-B2-C3', 'Storage location'),
    createVariable('quantity', VARIABLE_TYPES.NUMBER, 100, 'Item quantity'),
    createVariable('binLocation', VARIABLE_TYPES.TEXT, 'BIN-A001', 'Bin location'),
    createVariable('lastUpdated', VARIABLE_TYPES.DATE, new Date(), 'Last inventory update'),
    createVariable('reorderPoint', VARIABLE_TYPES.NUMBER, 25, 'Reorder point quantity')
  ],
  
  asset: [
    createVariable('assetTag', VARIABLE_TYPES.TEXT, 'ASSET-001', 'Asset tag number'),
    createVariable('assetName', VARIABLE_TYPES.TEXT, 'Equipment Name', 'Asset name'),
    createVariable('serialNumber', VARIABLE_TYPES.TEXT, 'SN123456', 'Serial number'),
    createVariable('purchaseDate', VARIABLE_TYPES.DATE, new Date(), 'Purchase date'),
    createVariable('warrantyExpiry', VARIABLE_TYPES.DATE, new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), 'Warranty expiry'),
    createVariable('department', VARIABLE_TYPES.TEXT, 'IT', 'Department'),
    createVariable('responsible', VARIABLE_TYPES.TEXT, 'John Smith', 'Responsible person')
  ]
};

/**
 * Variable formatting helpers
 */
export const VARIABLE_FORMATTERS = {
  date: {
    'MM/DD/YYYY': 'Month/Day/Year (US)',
    'DD/MM/YYYY': 'Day/Month/Year (EU)',
    'YYYY-MM-DD': 'ISO Date',
    'MMM DD, YYYY': 'Short Month Day, Year',
    'DD MMM YYYY': 'Day Short Month Year',
    'MMMM DD, YYYY': 'Full Month Day, Year'
  },
  
  number: {
    'decimal:0': 'No decimals',
    'decimal:1': '1 decimal place',
    'decimal:2': '2 decimal places',
    'currency': 'Currency format',
    'percent': 'Percentage',
    'pad:4': 'Pad with zeros (4 digits)',
    'pad:6': 'Pad with zeros (6 digits)'
  },
  
  text: {
    'upper': 'UPPERCASE',
    'lower': 'lowercase',
    'title': 'Title Case',
    'trim': 'Remove whitespace',
    'truncate:10': 'Truncate to 10 chars',
    'truncate:20': 'Truncate to 20 chars'
  },
  
  boolean: {
    'Yes|No': 'Yes/No',
    'True|False': 'True/False',
    'Y|N': 'Y/N',
    '✓|✗': 'Checkmark/X',
    'Active|Inactive': 'Active/Inactive'
  }
};