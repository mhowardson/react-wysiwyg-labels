export const generateId = () => {
  return `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const px2mm = (px, dpi = 203) => {
  return (px * 25.4) / dpi;
};

export const mm2px = (mm, dpi = 203) => {
  return (mm * dpi) / 25.4;
};

export const in2px = (inches, dpi = 203) => {
  return inches * dpi;
};

export const px2in = (px, dpi = 203) => {
  return px / dpi;
};

export const snapToGrid = (value, gridSize) => {
  if (!gridSize || gridSize === 0) return value;
  return Math.round(value / gridSize) * gridSize;
};

export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

export const downloadFile = (content, filename, mimeType = 'text/plain') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const loadFile = (accept = '.json') => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) {
        reject(new Error('No file selected'));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          resolve(content);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    };
    
    input.click();
  });
};

export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (obj instanceof Object) {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const formatDate = (date, format = 'MM/DD/YYYY') => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

export const parseVariableFormat = (variableString) => {
  const match = variableString.match(/{{(.+?)(\|(.+?))?}}/);
  if (!match) return null;
  
  return {
    name: match[1],
    format: match[3] || null
  };
};

export const replaceVariables = (text, variables) => {
  return text.replace(/{{(.+?)(\|(.+?))?}}/g, (match, varName, _, format) => {
    const variable = variables.find(v => v.name === varName);
    if (!variable) return match;
    
    let value = variable.value;
    
    if (variable.type === 'date' && format) {
      value = formatDate(value, format);
    } else if (variable.type === 'number' && format) {
      const decimals = parseInt(format);
      if (!isNaN(decimals)) {
        value = Number(value).toFixed(decimals);
      }
    }
    
    return value;
  });
};

export const getElementBounds = (element) => {
  const { x = 0, y = 0, width = 0, height = 0 } = element;
  
  return {
    left: x,
    top: y,
    right: x + width,
    bottom: y + height,
    width,
    height
  };
};

export const isElementInBounds = (element, bounds) => {
  const elementBounds = getElementBounds(element);
  
  return (
    elementBounds.left >= bounds.left &&
    elementBounds.top >= bounds.top &&
    elementBounds.right <= bounds.right &&
    elementBounds.bottom <= bounds.bottom
  );
};

export const getContrastColor = (hexColor) => {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? '#000000' : '#ffffff';
};