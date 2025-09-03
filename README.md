# React Label Designer

A powerful, modular, and open-source WYSIWYG label designer for React applications with support for multiple UI frameworks and ZPL/EPL code generation.

[![React](https://img.shields.io/badge/React-19.0+-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6+-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0+-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

## 🎨 Features

### Multi-Framework UI Support
- **Tailwind CSS** - Clean, utility-first styling
- **Material-UI** - Google's Material Design
- **Bootstrap** - Popular CSS framework  
- **Ant Design** - Enterprise-class design language
- **Custom HTML/CSS** - Full customization control

### 🏷️ Label Elements
- **Text** with fonts, sizes, colors, and alignment
- **Shapes** (lines, boxes, circles) with styling
- **Images** with fit options and upload support
- **Barcodes** supporting 15+ formats including:
  - Code 128, Code 39, EAN-13, UPC-A
  - QR Code, Data Matrix, PDF417, Aztec
  - And more...

### 🔧 Advanced Features
- **Variable System** - Dynamic placeholders (`{{name}}`, `{{date|MM/DD/YYYY}}`)
- **Template Management** - Save, load, and share label templates
- **Multi-format Export** - ZPL, EPL, and DPL code generation
- **Drag & Drop Interface** - Intuitive visual editing
- **Undo/Redo** - Full history management
- **Zoom & Grid** - Precision positioning
- **Image Upload** - Local and URL-based images

### 🔌 Developer Friendly
- **React 19** compatible with latest features
- **TypeScript** support with full type safety
- **Modular Architecture** - Use only what you need
- **Event Callbacks** - Integrate with your workflow
- **Extensible** - Add custom elements and exporters
- **Modern Tooling** - Vite, ESLint 9, Vitest

## 🚀 Quick Start

### Installation

```bash
npm install react-label-designer
# or
yarn add react-label-designer
# or
pnpm add react-label-designer
```

### Basic Usage

```tsx
import React from 'react';
import { LabelDesigner } from 'react-label-designer';

const App = () => {
  const handleSave = (template) => {
    console.log('Template saved:', template);
  };

  const handleExport = (code, format) => {
    console.log(`${format} code:`, code);
  };

  return (
    <LabelDesigner
      ui="tailwind"
      onSave={handleSave}
      onExport={handleExport}
      enableTemplates={true}
      enableVariables={true}
      enableImageUpload={true}
    />
  );
};

export default App;
```

### Framework-Specific Usage

#### Tailwind CSS
```tsx
import { TailwindDesigner } from 'react-label-designer';

<TailwindDesigner 
  config={{ showGrid: true, enableShortcuts: true }}
/>
```

#### Material-UI
```tsx
import { MaterialUIDesigner } from 'react-label-designer';

<MaterialUIDesigner 
  customTheme={{ palette: { primary: { main: '#1976d2' } } }}
/>
```

## 🛠️ Development

### Prerequisites

- Node.js 24+
- npm, yarn, or pnpm

### Setup

```bash
git clone https://github.com/mhowardson/react-wysiwyg-labels.git
cd react-wysiwyg-labels
npm install
```

### Development Scripts

```bash
# Start development server
npm run dev

# Build library
npm run build:lib

# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Type checking
npm run typecheck

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Start Storybook
npm run storybook
```

### Project Structure

```
react-label-designer/
├── src/
│   ├── index.tsx                # Main entry point
│   ├── core/                    # Core functionality
│   │   ├── LabelDesignerContext.tsx  # State management
│   │   ├── constants.tsx        # Constants and types
│   │   ├── codeGenerators.tsx   # ZPL/EPL generation
│   │   ├── variableManager.tsx  # Variable processing
│   │   ├── templateManager.tsx  # Template persistence
│   │   └── utils.tsx           # Utility functions
│   ├── ui/                     # UI implementations
│   │   ├── tailwind/           # Tailwind CSS version
│   │   │   ├── TailwindLabelDesigner.tsx
│   │   │   └── components/
│   │   │       ├── PropertiesPanel.tsx
│   │   │       ├── TemplateManager.tsx
│   │   │       ├── VariableManager.tsx
│   │   │       ├── CodePreview.tsx
│   │   │       └── ImageUploader.tsx
│   │   ├── material/           # Material-UI version
│   │   ├── bootstrap/          # Bootstrap version
│   │   ├── ant/               # Ant Design version
│   │   └── custom/            # Custom HTML/CSS version
│   └── types/                 # TypeScript definitions
├── docs/                      # Documentation
├── examples/                  # Example implementations
├── stories/                   # Storybook stories
└── tests/                     # Test files
```

## 📚 API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `ui` | `string` | `'tailwind'` | UI framework (`'tailwind'`, `'material'`, `'bootstrap'`, `'ant'`, `'custom'`) |
| `config` | `object` | `{}` | Configuration options |
| `onSave` | `function` | - | Callback when template is saved |
| `onLoad` | `function` | - | Callback when template is loaded |
| `onExport` | `function` | - | Callback when code is exported |
| `onVariableChange` | `function` | - | Callback when variables change |
| `initialData` | `object` | `null` | Initial label data |
| `availableVariables` | `array` | `[]` | Available variables for placeholders |
| `customTheme` | `object` | `{}` | Custom theme configuration |
| `enableTemplates` | `boolean` | `true` | Enable template functionality |
| `enableVariables` | `boolean` | `true` | Enable variable system |
| `enableImageUpload` | `boolean` | `true` | Enable image upload |
| `allowedBarcodeTypes` | `array` | `null` | Restrict barcode types |

### Configuration

```tsx
import { createLabelDesignerConfig } from 'react-label-designer';

const config = createLabelDesignerConfig({
  ui: 'tailwind',
  labelSize: { width: 400, height: 300 },
  units: 'px', // 'px', 'mm', 'in'
  dpi: 203,
  enableGridSnap: true,
  gridSize: 10,
  showRulers: true,
  enableShortcuts: true
});
```

### Variables

```tsx
import { createVariable, VARIABLE_TYPES } from 'react-label-designer';

const variables = [
  createVariable('customerName', VARIABLE_TYPES.TEXT, 'John Doe', 'Customer name'),
  createVariable('orderDate', VARIABLE_TYPES.DATE, new Date(), 'Order date'),
  createVariable('price', VARIABLE_TYPES.NUMBER, 29.99, 'Product price'),
  createVariable('trackingCode', VARIABLE_TYPES.BARCODE, '1234567890', 'Tracking barcode')
];
```

Use variables in text: `"Hello {{customerName}}, your order from {{orderDate|MM/DD/YYYY}} is ready!"`

## 🏷️ Code Generation

### ZPL (Zebra Programming Language)
```tsx
const zplCode = generateZPL(elements, labelSize, {
  dpi: 203,
  printSpeed: 4,
  density: 8
});
```

### EPL (Eltron Programming Language)
```tsx
const eplCode = generateEPL(elements, labelSize, {
  speed: 4,
  density: 1,
  copies: 1
});
```

## 📋 Examples

### Shipping Label
```tsx
const shippingTemplate = {
  name: 'Shipping Label',
  labelSize: { width: 400, height: 600 },
  elements: [
    {
      type: 'text',
      x: 20, y: 20,
      properties: { 
        text: 'Ship To: {{recipientName}}',
        fontSize: 14,
        fontWeight: 'bold'
      }
    },
    {
      type: 'barcode',
      x: 20, y: 400,
      properties: {
        data: '{{trackingNumber}}',
        type: 'CODE128',
        showText: true
      }
    }
  ]
};
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/mhowardson/react-wysiwyg-labels.git
cd react-wysiwyg-labels
npm install
npm run dev
```

### Adding a New UI Framework

1. Create a new directory in `src/ui/`
2. Implement the main designer component
3. Create framework-specific components
4. Add to the main export in `src/index.tsx`
5. Update documentation

### Adding New Element Types

1. Add the element type to `constants.tsx`
2. Implement rendering in UI components
3. Add code generation logic
4. Create property panels
5. Add tests

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🗺️ Roadmap

- [ ] **Advanced Shapes** - Polygons, curved lines
- [ ] **Print Preview** - Actual size preview
- [ ] **Batch Processing** - Multiple labels at once
- [ ] **Plugin System** - Custom element types
- [ ] **Cloud Templates** - Shared template library
- [ ] **Mobile Support** - Touch-friendly interface
- [ ] **Real-time Collaboration** - Multiple editors
- [ ] **Advanced Variables** - Formulas and calculations

## 💬 Support

- 📖 [Documentation](https://react-label-designer.docs.com)
- 🐛 [Issue Tracker](https://github.com/mhowardson/react-wysiwyg-labels/issues)
- 💬 [Discussions](https://github.com/mhowardson/react-wysiwyg-labels/discussions)

---

Made with ❤️ for the React community