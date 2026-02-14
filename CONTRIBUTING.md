# Contributing to a11y-ci

Thank you for your interest in contributing to a11y-ci! This document provides guidelines for contributing to the project.

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Your environment (OS, Node.js version, browser)

### Suggesting Features

Feature suggestions are welcome! Please open an issue with:
- Clear description of the feature
- Use case and benefits
- Example implementation (if applicable)

### Submitting Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Ensure tests pass (`npm test`)
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/a11y-ci.git
cd a11y-ci

# Install dependencies
npm install

# Install browsers
npm run install:browsers

# Run tests
npm test

# Generate report
npm run report
```

## Code Style

- Use clear, descriptive variable names
- Add comments for complex logic
- Follow existing code patterns
- Keep functions focused and small

## Testing

- All new features should include tests
- Ensure existing tests pass before submitting PR
- Test edge cases

## Documentation

- Update README.md if adding new features
- Update INTEGRATION.md for integration changes
- Add JSDoc comments to functions
- Include examples where helpful

## Questions?

Feel free to open an issue for questions or discussion!
