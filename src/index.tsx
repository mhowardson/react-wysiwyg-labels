// src/index.js - Main entry point for the Label Designer library
import React from 'react';
import { LabelDesignerProvider } from './core/LabelDesignerContext';
import TailwindDesigner from './ui/tailwind/TailwindLabelDesigner';
import MaterialUIDesigner from './ui/material/MaterialLabelDesigner';
import BootstrapDesigner from './ui/bootstrap/BootstrapLabelDesigner';
import AntDesigner from './ui/ant/AntLabelDesigner';
import CustomDesigner from './ui/custom/CustomLabelDesigner';

/**
 * Main Label Designer Component
 * 
 * @param {Object} props
 * @param {string} props.ui - UI framework to use ('tailwind', 'material', 'bootstrap', 'ant', 'custom')
 * @param {Object} props.config - Configuration object
 * @param {Function} props.onSave - Callback for saving templates
 * @param {Function} props.onLoad - Callback for loading templates
 * @param {Function} props.onExport - Callback for exporting code
 * @param {Function} props.onVariableChange - Callback for variable changes
 * @param {Object} props.initialData - Initial label data
 * @param {Array} props.availableVariables - Available variables for placeholders
 * @param {Object} props.customTheme - Custom theme configuration
 * @param {boolean} props.enableTemplates - Enable template functionality
 * @param {boolean} props.enableVariables - Enable variable functionality
 * @param {boolean} props.enableImageUpload - Enable image upload
 * @param {Array} props.allowedBarcodeTypes - Allowed barcode types
 */
const LabelDesigner = ({
  ui = 'tailwind',
  config = {},
  onSave,
  onLoad,
  onExport,
  onVariableChange,
  initialData = null,
  availableVariables = [],
  customTheme = {},
  enableTemplates = true,
  enableVariables = true,
  enableImageUpload = true,
  allowedBarcodeTypes = null,
  ...props
}) => {
  const designerConfig = {
    ...config,
    ui,
    enableTemplates,
    enableVariables,
    enableImageUpload,
    allowedBarcodeTypes,
    customTheme,
    availableVariables
  };

  const getDesignerComponent = () => {
    switch (ui.toLowerCase()) {
      case 'material':
      case 'mui':
        return MaterialUIDesigner;
      case 'bootstrap':
        return BootstrapDesigner;
      case 'ant':
      case 'antd':
        return AntDesigner;
      case 'custom':
      case 'html':
        return CustomDesigner;
      case 'tailwind':
      default:
        return TailwindDesigner;
    }
  };

  const DesignerComponent = getDesignerComponent();

  return (
    <LabelDesignerProvider 
      config={designerConfig}
      onSave={onSave}
      onLoad={onLoad}
      onExport={onExport}
      onVariableChange={onVariableChange}
      initialData={initialData}
    >
      <DesignerComponent {...props} />
    </LabelDesignerProvider>
  );
};

// Named exports for direct component access
export {
  TailwindDesigner,
  MaterialUIDesigner,
  BootstrapDesigner,
  AntDesigner,
  CustomDesigner,
  LabelDesignerProvider
};

// Default export
export default LabelDesigner;

// Configuration helper
export const createLabelDesignerConfig = (options = {}) => ({
  ui: 'tailwind',
  labelSize: { width: 400, height: 300 },
  units: 'px', // 'px', 'mm', 'in'
  dpi: 203, // for unit conversion
  defaultFont: 'Arial',
  enableGridSnap: true,
  gridSize: 10,
  showRulers: true,
  showGrid: true,
  enableUndo: true,
  maxUndoSteps: 50,
  enableShortcuts: true,
  printerTypes: ['zebra', 'eltron', 'datamax'],
  defaultPrinterType: 'zebra',
  ...options
});

// Template system
export const createTemplate = (name, description, elements, labelSize) => ({
  id: Date.now(),
  name,
  description,
  elements,
  labelSize,
  createdAt: new Date().toISOString(),
  version: '1.0.0'
});

// Variable system
export const createVariable = (name, type, defaultValue, description) => ({
  name,
  type, // 'text', 'number', 'date', 'barcode'
  defaultValue,
  description,
  validation: null // validation rules
});

// Export utilities
export * from './core/constants';
export * from './core/utils';
export * from './core/codeGenerators';
export * from './core/templateManager';
export * from './core/variableManager';