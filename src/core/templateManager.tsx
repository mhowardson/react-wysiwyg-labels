// src/core/templateManager.js - Template management and persistence

/**
 * Save template to storage
 * @param {Object} template - Template object
 * @param {string} storageType - Storage type ('localStorage', 'indexedDB', 'api')
 * @returns {Promise<Object>} Saved template with ID
 */
export const saveTemplate = async (template, storageType = 'localStorage') => {
  const templateWithMetadata = {
    ...template,
    id: template.id || generateTemplateId(),
    createdAt: template.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: template.version || '1.0.0'
  };

  switch (storageType) {
    case 'localStorage':
      return saveTemplateToLocalStorage(templateWithMetadata);
    case 'indexedDB':
      return saveTemplateToIndexedDB(templateWithMetadata);
    case 'api':
      return saveTemplateToAPI(templateWithMetadata);
    default:
      throw new Error(`Unsupported storage type: ${storageType}`);
  }
};

/**
 * Load template from storage
 * @param {string} templateId - Template ID
 * @param {string} storageType - Storage type
 * @returns {Promise<Object>} Template object
 */
export const loadTemplate = async (templateId, storageType = 'localStorage') => {
  switch (storageType) {
    case 'localStorage':
      return loadTemplateFromLocalStorage(templateId);
    case 'indexedDB':
      return loadTemplateFromIndexedDB(templateId);
    case 'api':
      return loadTemplateFromAPI(templateId);
    default:
      throw new Error(`Unsupported storage type: ${storageType}`);
  }
};

/**
 * List all templates
 * @param {string} storageType - Storage type
 * @returns {Promise<Array>} Array of templates
 */
export const listTemplates = async (storageType = 'localStorage') => {
  switch (storageType) {
    case 'localStorage':
      return listTemplatesFromLocalStorage();
    case 'indexedDB':
      return listTemplatesFromIndexedDB();
    case 'api':
      return listTemplatesFromAPI();
    default:
      throw new Error(`Unsupported storage type: ${storageType}`);
  }
};

/**
 * Delete template
 * @param {string} templateId - Template ID
 * @param {string} storageType - Storage type
 * @returns {Promise<boolean>} Success status
 */
export const deleteTemplate = async (templateId, storageType = 'localStorage') => {
  switch (storageType) {
    case 'localStorage':
      return deleteTemplateFromLocalStorage(templateId);
    case 'indexedDB':
      return deleteTemplateFromIndexedDB(templateId);
    case 'api':
      return deleteTemplateFromAPI(templateId);
    default:
      throw new Error(`Unsupported storage type: ${storageType}`);
  }
};

/**
 * Duplicate template
 * @param {string} templateId - Template ID to duplicate
 * @param {string} newName - New template name
 * @param {string} storageType - Storage type
 * @returns {Promise<Object>} New template
 */
export const duplicateTemplate = async (templateId, newName, storageType = 'localStorage') => {
  const originalTemplate = await loadTemplate(templateId, storageType);
  if (!originalTemplate) {
    throw new Error('Template not found');
  }

  const duplicatedTemplate = {
    ...originalTemplate,
    id: generateTemplateId(),
    name: newName || `${originalTemplate.name} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return saveTemplate(duplicatedTemplate, storageType);
};

// Local Storage Implementation
const saveTemplateToLocalStorage = (template) => {
  try {
    const templates = getTemplatesFromLocalStorage();
    const existingIndex = templates.findIndex(t => t.id === template.id);
    
    if (existingIndex >= 0) {
      templates[existingIndex] = template;
    } else {
      templates.push(template);
    }
    
    localStorage.setItem('labelDesignerTemplates', JSON.stringify(templates));
    return Promise.resolve(template);
  } catch (error) {
    return Promise.reject(new Error(`Failed to save template: ${error.message}`));
  }
};

const loadTemplateFromLocalStorage = (templateId) => {
  try {
    const templates = getTemplatesFromLocalStorage();
    const template = templates.find(t => t.id === templateId);
    return Promise.resolve(template || null);
  } catch (error) {
    return Promise.reject(new Error(`Failed to load template: ${error.message}`));
  }
};

const listTemplatesFromLocalStorage = () => {
  try {
    const templates = getTemplatesFromLocalStorage();
    return Promise.resolve(templates);
  } catch (error) {
    return Promise.reject(new Error(`Failed to list templates: ${error.message}`));
  }
};

const deleteTemplateFromLocalStorage = (templateId) => {
  try {
    const templates = getTemplatesFromLocalStorage();
    const filteredTemplates = templates.filter(t => t.id !== templateId);
    localStorage.setItem('labelDesignerTemplates', JSON.stringify(filteredTemplates));
    return Promise.resolve(true);
  } catch (error) {
    return Promise.reject(new Error(`Failed to delete template: ${error.message}`));
  }
};

const getTemplatesFromLocalStorage = () => {
  try {
    const stored = localStorage.getItem('labelDesignerTemplates');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error parsing templates from localStorage:', error);
    return [];
  }
};

// IndexedDB Implementation
let db = null;

const initIndexedDB = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open('LabelDesignerDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      
      if (!database.objectStoreNames.contains('templates')) {
        const store = database.createObjectStore('templates', { keyPath: 'id' });
        store.createIndex('name', 'name', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
  });
};

const saveTemplateToIndexedDB = async (template) => {
  const database = await initIndexedDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['templates'], 'readwrite');
    const store = transaction.objectStore('templates');
    
    const request = store.put(template);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(template);
  });
};

const loadTemplateFromIndexedDB = async (templateId) => {
  const database = await initIndexedDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['templates'], 'readonly');
    const store = transaction.objectStore('templates');
    
    const request = store.get(templateId);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || null);
  });
};

const listTemplatesFromIndexedDB = async () => {
  const database = await initIndexedDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['templates'], 'readonly');
    const store = transaction.objectStore('templates');
    
    const request = store.getAll();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || []);
  });
};

const deleteTemplateFromIndexedDB = async (templateId) => {
  const database = await initIndexedDB();
  
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(['templates'], 'readwrite');
    const store = transaction.objectStore('templates');
    
    const request = store.delete(templateId);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(true);
  });
};

// API Implementation (placeholder - implement based on your backend)
const saveTemplateToAPI = async (template) => {
  const response = await fetch('/api/templates', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(template)
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return response.json();
};

const loadTemplateFromAPI = async (templateId) => {
  const response = await fetch(`/api/templates/${templateId}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return response.json();
};

const listTemplatesFromAPI = async () => {
  const response = await fetch('/api/templates');
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return response.json();
};

const deleteTemplateFromAPI = async (templateId) => {
  const response = await fetch(`/api/templates/${templateId}`, {
    method: 'DELETE'
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return true;
};

// Utility functions
const generateTemplateId = () => {
  return `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Export template to file
 * @param {Object} template - Template to export
 * @param {string} format - Export format ('json', 'xml')
 * @returns {string} Exported template content
 */
export const exportTemplate = (template, format = 'json') => {
  switch (format.toLowerCase()) {
    case 'json':
      return JSON.stringify(template, null, 2);
    case 'xml':
      return templateToXML(template);
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
};

/**
 * Import template from file content
 * @param {string} content - File content
 * @param {string} format - File format
 * @returns {Object} Imported template
 */
export const importTemplate = (content, format = 'json') => {
  switch (format.toLowerCase()) {
    case 'json':
      return JSON.parse(content);
    case 'xml':
      return xmlToTemplate(content);
    default:
      throw new Error(`Unsupported import format: ${format}`);
  }
};

/**
 * Convert template to XML
 * @param {Object} template - Template object
 * @returns {string} XML string
 */
const templateToXML = (template) => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<template>\n';
  xml += `  <id>${template.id}</id>\n`;
  xml += `  <name><![CDATA[${template.name}]]></name>\n`;
  xml += `  <description><![CDATA[${template.description || ''}]]></description>\n`;
  xml += `  <version>${template.version}</version>\n`;
  xml += `  <createdAt>${template.createdAt}</createdAt>\n`;
  xml += `  <updatedAt>${template.updatedAt}</updatedAt>\n`;
  
  xml += '  <labelSize>\n';
  xml += `    <width>${template.labelSize.width}</width>\n`;
  xml += `    <height>${template.labelSize.height}</height>\n`;
  xml += '  </labelSize>\n';
  
  xml += '  <elements>\n';
  template.elements.forEach(element => {
    xml += '    <element>\n';
    xml += `      <id>${element.id}</id>\n`;
    xml += `      <type>${element.type}</type>\n`;
    xml += `      <x>${element.x}</x>\n`;
    xml += `      <y>${element.y}</y>\n`;
    xml += `      <width>${element.width}</width>\n`;
    xml += `      <height>${element.height}</height>\n`;
    xml += `      <rotation>${element.rotation || 0}</rotation>\n`;
    xml += `      <zIndex>${element.zIndex || 0}</zIndex>\n`;
    
    xml += '      <properties>\n';
    Object.entries(element.properties).forEach(([key, value]) => {
      if (typeof value === 'object') {
        xml += `        <${key}><![CDATA[${JSON.stringify(value)}]]></${key}>\n`;
      } else {
        xml += `        <${key}><![CDATA[${value}]]></${key}>\n`;
      }
    });
    xml += '      </properties>\n';
    
    xml += '    </element>\n';
  });
  xml += '  </elements>\n';
  
  xml += '</template>';
  
  return xml;
};

/**
 * Convert XML to template (basic implementation)
 * @param {string} xml - XML string
 * @returns {Object} Template object
 */
const xmlToTemplate = (xml) => {
  // This is a simplified implementation
  // In a real application, you'd use a proper XML parser
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  
  const template = {
    id: doc.querySelector('id')?.textContent,
    name: doc.querySelector('name')?.textContent,
    description: doc.querySelector('description')?.textContent,
    version: doc.querySelector('version')?.textContent,
    createdAt: doc.querySelector('createdAt')?.textContent,
    updatedAt: doc.querySelector('updatedAt')?.textContent,
    labelSize: {
      width: parseInt(doc.querySelector('labelSize width')?.textContent),
      height: parseInt(doc.querySelector('labelSize height')?.textContent)
    },
    elements: []
  };
  
  const elements = doc.querySelectorAll('element');
  elements.forEach(elementNode => {
    const element = {
      id: elementNode.querySelector('id')?.textContent,
      type: elementNode.querySelector('type')?.textContent,
      x: parseInt(elementNode.querySelector('x')?.textContent),
      y: parseInt(elementNode.querySelector('y')?.textContent),
      width: parseInt(elementNode.querySelector('width')?.textContent),
      height: parseInt(elementNode.querySelector('height')?.textContent),
      rotation: parseInt(elementNode.querySelector('rotation')?.textContent) || 0,
      zIndex: parseInt(elementNode.querySelector('zIndex')?.textContent) || 0,
      properties: {}
    };
    
    const properties = elementNode.querySelector('properties');
    if (properties) {
      Array.from(properties.children).forEach(prop => {
        try {
          element.properties[prop.tagName] = JSON.parse(prop.textContent);
        } catch {
          element.properties[prop.tagName] = prop.textContent;
        }
      });
    }
    
    template.elements.push(element);
  });
  
  return template;
};

/**
 * Validate template structure
 * @param {Object} template - Template to validate
 * @returns {Object} Validation result
 */
export const validateTemplate = (template) => {
  const result = { isValid: true, errors: [] };
  
  // Required fields
  if (!template.name) {
    result.isValid = false;
    result.errors.push('Template name is required');
  }
  
  if (!template.labelSize || !template.labelSize.width || !template.labelSize.height) {
    result.isValid = false;
    result.errors.push('Label size is required');
  }
  
  if (!Array.isArray(template.elements)) {
    result.isValid = false;
    result.errors.push('Elements must be an array');
  }
  
  // Validate elements
  if (template.elements) {
    template.elements.forEach((element, index) => {
      if (!element.type) {
        result.isValid = false;
        result.errors.push(`Element ${index}: type is required`);
      }
      
      if (typeof element.x !== 'number' || typeof element.y !== 'number') {
        result.isValid = false;
        result.errors.push(`Element ${index}: position coordinates must be numbers`);
      }
      
      if (typeof element.width !== 'number' || typeof element.height !== 'number') {
        result.isValid = false;
        result.errors.push(`Element ${index}: dimensions must be numbers`);
      }
    });
  }
  
  return result;
};

/**
 * Get template preview data
 * @param {Object} template - Template object
 * @returns {Object} Preview data
 */
export const getTemplatePreview = (template) => {
  return {
    id: template.id,
    name: template.name,
    description: template.description,
    elementCount: template.elements?.length || 0,
    labelSize: template.labelSize,
    createdAt: template.createdAt,
    updatedAt: template.updatedAt,
    version: template.version,
    thumbnail: generateThumbnail(template) // You'd implement this based on your needs
  };
};

const generateThumbnail = (template) => {
  // Placeholder for thumbnail generation
  // In a real implementation, you might generate an SVG or canvas-based thumbnail
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="100" height="60" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="60" fill="#f3f4f6" stroke="#d1d5db"/>
      <text x="50" y="30" text-anchor="middle" font-size="10" fill="#6b7280">
        ${template.elements?.length || 0} elements
      </text>
    </svg>
  `)}`;
};

// Predefined templates
export const PREDEFINED_TEMPLATES = {
  shipping: {
    name: 'Shipping Label',
    description: 'Standard shipping label with recipient info and tracking',
    labelSize: { width: 400, height: 600 },
    elements: [
      {
        id: 1,
        type: 'text',
        x: 20,
        y: 20,
        width: 200,
        height: 30,
        properties: {
          text: 'SHIP TO:',
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      {
        id: 2,
        type: 'text',
        x: 20,
        y: 60,
        width: 300,
        height: 20,
        properties: {
          text: '{{recipientName}}',
          fontSize: 12
        }
      },
      {
        id: 3,
        type: 'barcode',
        x: 20,
        y: 400,
        width: 300,
        height: 60,
        properties: {
          data: '{{trackingNumber}}',
          type: 'CODE128',
          showText: true
        }
      }
    ]
  },
  
  product: {
    name: 'Product Label',
    description: 'Product label with name, SKU, and barcode',
    labelSize: { width: 300, height: 200 },
    elements: [
      {
        id: 1,
        type: 'text',
        x: 10,
        y: 10,
        width: 280,
        height: 25,
        properties: {
          text: '{{productName}}',
          fontSize: 14,
          fontWeight: 'bold'
        }
      },
      {
        id: 2,
        type: 'text',
        x: 10,
        y: 40,
        width: 200,
        height: 20,
        properties: {
          text: 'SKU: {{productSKU}}',
          fontSize: 10
        }
      },
      {
        id: 3,
        type: 'barcode',
        x: 10,
        y: 100,
        width: 280,
        height: 50,
        properties: {
          data: '{{productBarcode}}',
          type: 'EAN13',
          showText: true
        }
      }
    ]
  }
};