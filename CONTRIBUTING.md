# Contributing to React Label Designer

Thank you for your interest in contributing to React Label Designer! We welcome contributions from the community and are excited to see what you'll build.

## 🤝 How to Contribute

### Reporting Issues
- **Bug Reports**: Use the [issue tracker](https://github.com/mhowardson/react-wysiwyg-labels/issues) to report bugs
- **Feature Requests**: Submit feature requests with detailed descriptions
- **Questions**: Use [Discussions](https://github.com/mhowardson/react-wysiwyg-labels/discussions) for questions

### Development Workflow

1. **Fork the Repository**
   ```bash
   gh repo fork mhowardson/react-wysiwyg-labels --clone
   cd react-wysiwyg-labels
   ```

2. **Set Up Development Environment**
   ```bash
   # Ensure you have Node.js 24+ installed
   npm install
   
   # Start development server
   npm run dev
   
   # Run tests
   npm run test
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

4. **Make Your Changes**
   - Write clean, well-documented code
   - Follow the existing code style and patterns
   - Add tests for new functionality
   - Ensure TypeScript types are properly defined

5. **Test Your Changes**
   ```bash
   # Run all tests
   npm run test
   
   # Type checking
   npm run typecheck
   
   # Linting
   npm run lint
   
   # Build library
   npm run build:lib
   ```

6. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add new awesome feature"
   ```
   
   Follow [Conventional Commits](https://conventionalcommits.org/) format:
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `style:` for formatting changes
   - `refactor:` for code refactoring
   - `test:` for adding tests
   - `chore:` for maintenance tasks

7. **Push and Create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   gh pr create --title "feat: add new awesome feature" --body "Description of changes"
   ```

## 🏗️ Development Guidelines

### Code Style
- **TypeScript**: Use strict TypeScript with proper type definitions
- **ESLint**: Follow the established ESLint configuration
- **Prettier**: Code formatting is handled automatically
- **Naming**: Use descriptive variable and function names

### Architecture Principles
- **Modular Design**: Keep components and utilities modular and reusable
- **Type Safety**: Maintain strict TypeScript typing throughout
- **Performance**: Consider performance implications of changes
- **Accessibility**: Ensure UI components are accessible

### Testing
- Write unit tests for new utilities and core logic
- Add integration tests for complex features
- Ensure UI components render correctly
- Test TypeScript type definitions

### Documentation
- Update README.md for new features
- Add inline code comments for complex logic
- Include JSDoc comments for public APIs
- Update examples when adding new functionality

## 🎨 Adding New UI Frameworks

We welcome support for additional UI frameworks! Here's how to add one:

### 1. Create Framework Directory
```bash
mkdir src/ui/your-framework
```

### 2. Implement Core Components
Create these essential components:
- `YourFrameworkLabelDesigner.tsx` - Main designer component
- `components/PropertiesPanel.tsx` - Element property editor
- `components/TemplateManager.tsx` - Template management
- `components/VariableManager.tsx` - Variable system
- `components/CodePreview.tsx` - Code generation preview
- `components/ImageUploader.tsx` - Image upload functionality

### 3. Follow Existing Patterns
- Look at `src/ui/tailwind/` as a reference implementation
- Maintain consistent prop interfaces across frameworks
- Use the same core logic from `src/core/`
- Follow the established component structure

### 4. Update Main Export
Add your framework to `src/index.tsx`:
```tsx
export { default as YourFrameworkDesigner } from './ui/your-framework/YourFrameworkLabelDesigner';
```

### 5. Add Documentation
- Update README.md with usage example
- Include framework-specific installation instructions
- Document any framework-specific configuration options

## 🔧 Adding New Element Types

To add support for new label element types:

### 1. Update Constants
Add your element type to `src/core/constants.tsx`:
```tsx
export const ELEMENT_TYPES = {
  // ... existing types
  YOUR_ELEMENT: 'your-element'
};
```

### 2. Implement Rendering
Add rendering logic in UI framework components:
```tsx
// In TailwindLabelDesigner.tsx or other framework files
case ELEMENT_TYPES.YOUR_ELEMENT:
  return <YourElementRenderer element={element} {...props} />;
```

### 3. Add Code Generation
Implement code generation in `src/core/codeGenerators.tsx`:
```tsx
const generateYourElementZPL = (element) => {
  // ZPL generation logic
  return zplCode;
};
```

### 4. Create Property Panel
Add property editing in `PropertiesPanel.tsx`:
```tsx
{element.type === ELEMENT_TYPES.YOUR_ELEMENT && (
  <YourElementProperties element={element} onChange={onChange} />
)}
```

### 5. Add Tests
Create tests for your new element type:
```tsx
// tests/elements/YourElement.test.tsx
describe('YourElement', () => {
  // Test rendering, properties, and code generation
});
```

## 📦 Release Process

### Semantic Versioning
We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist
- [ ] All tests pass
- [ ] TypeScript compiles without errors
- [ ] Documentation is updated
- [ ] CHANGELOG.md is updated
- [ ] Version is bumped in package.json
- [ ] Git tag matches package.json version

## 🐛 Debugging

### Common Issues
1. **TypeScript Errors**: Run `npm run typecheck` to identify type issues
2. **Build Failures**: Check `npm run build:lib` output
3. **Test Failures**: Run `npm run test` with `--verbose` flag
4. **Linting Issues**: Run `npm run lint:fix` to auto-fix issues

### Development Tools
- **Hot Reload**: `npm run dev` provides instant feedback
- **Test Watch**: `npm run test:watch` for continuous testing
- **Storybook**: `npm run storybook` for component development
- **TypeScript**: Use VS Code with TypeScript extension

## 🌟 Recognition

Contributors will be recognized in:
- README.md contributors section
- GitHub contributors page
- Release notes for significant contributions

## 📞 Getting Help

- **Discord**: Join our community discussions
- **GitHub Discussions**: Ask questions and share ideas
- **Issues**: Report bugs and request features
- **Email**: Contact maintainers for private discussions

## 📄 Code of Conduct

Please be respectful and professional in all interactions. We're building an inclusive community where everyone can contribute and learn.

---

Thank you for contributing to React Label Designer! Your contributions help make label design more accessible and powerful for everyone. 🎉