# 🔍 a11y-ci - Accessibility Testing Framework

A comprehensive accessibility testing framework using Axe Core, Playwright, and GitHub Actions. Automatically test your web applications for accessibility violations with beautiful HTML reports and historical tracking.

## ✨ Features

- 🎯 **Automated Testing**: Uses Deque Axe Core for comprehensive accessibility scanning
- 🎭 **Playwright Integration**: Test with real browsers using Playwright Test
- 📊 **HTML Dashboard**: Beautiful, interactive reports showing all violations
- 📈 **History Tracking**: Track accessibility improvements over time
- 🔄 **CI/CD Ready**: GitHub Actions workflow included
- 🚀 **Easy Integration**: Simple setup for any project
- 📦 **Zero Config**: Works out of the box with sensible defaults

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/Kazeniq/a11y-ci.git
cd a11y-ci

# Install dependencies
npm install

# Install Playwright browsers
npm run install:browsers
```

### Run Tests

```bash
# Run the example tests
npm test

# Generate HTML report
npm run report
```

Open `results/report.html` in your browser to see the results!

## 📖 Usage

### Basic Test Example

Create a test file in the `tests/` directory:

```javascript
const { test } = require('@playwright/test');
const { runAccessibilityTest } = require('../src/accessibility-tester');
const ResultsCollector = require('../src/results-collector');

const collector = new ResultsCollector();
const allResults = [];

test.describe('Accessibility Tests', () => {
  
  test('Homepage', async ({ page }) => {
    const results = await runAccessibilityTest(page, { 
      url: 'https://your-site.com',
      skipFailures: true  // Set to false to fail test on violations
    });
    
    allResults.push(results);
  });

  test.afterAll(async () => {
    if (allResults.length > 0) {
      collector.saveResults(allResults);
    }
  });
});
```

### Advanced Usage

#### Custom Axe Configuration

```javascript
const results = await runAccessibilityTest(page, {
  url: 'https://your-site.com',
  skipFailures: false,
  axeOptions: {
    rules: {
      // Disable specific rules
      'color-contrast': { enabled: false }
    },
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa']  // Test specific WCAG levels
    }
  }
});
```

#### Test Specific Elements

```javascript
const results = await runAccessibilityTest(page, {
  url: 'https://your-site.com',
  context: 'main',  // Test only the main element
  skipFailures: true
});
```

## 📊 Reports

### HTML Dashboard

The HTML report includes:
- **Summary cards** with key metrics
- **Trend analysis** showing improvement over time
- **Detailed violation reports** with:
  - Impact level (critical, serious, moderate, minor)
  - Description and remediation help
  - Affected HTML elements
  - Links to Axe documentation
- **Historical data** from previous runs

### JSON Results

Results are saved in two formats:
- `results/latest.json` - Latest test run results
- `results/history.json` - Historical data (last 50 runs)

## 🔄 GitHub Actions Integration

The included GitHub Actions workflow automatically:
1. Runs tests on push and pull requests
2. Generates HTML reports
3. Uploads artifacts
4. Comments on PRs with results summary
5. Optionally publishes to GitHub Pages

### Setup

1. The workflow file is already included at `.github/workflows/accessibility-tests.yml`
2. Commit and push to trigger the workflow
3. Results will be available in the Actions tab

### Enable GitHub Pages (Optional)

To publish reports to GitHub Pages:

1. Go to repository Settings → Pages
2. Set source to "GitHub Actions"
3. Reports will be published to `https://[username].github.io/[repo]/accessibility-reports/`

## 📁 Project Structure

```
a11y-ci/
├── src/
│   ├── accessibility-tester.js    # Core testing functions
│   ├── results-collector.js       # Results storage and history
│   ├── generate-report.js         # HTML report generator
│   └── index.js                   # Main exports
├── tests/
│   └── example.spec.js            # Example tests
├── examples/
│   └── custom-tests.spec.js       # Template for your tests
├── results/                       # Generated results (gitignored)
│   ├── latest.json
│   ├── history.json
│   └── report.html
├── .github/
│   └── workflows/
│       └── accessibility-tests.yml # CI workflow
├── playwright.config.js           # Playwright configuration
└── package.json
```

## 🛠️ Configuration

### Playwright Config

Customize `playwright.config.js` to:
- Change browser configurations
- Adjust timeouts and retries
- Configure reporters
- Set base URL

### Results Directory

Change the results directory in your tests:

```javascript
const collector = new ResultsCollector('custom-results-dir');
```

## 📚 API Reference

### `runAccessibilityTest(page, options)`

Run accessibility tests on a page.

**Parameters:**
- `page` (Page) - Playwright page object
- `options` (Object):
  - `url` (string) - URL to test (optional if page already loaded)
  - `context` (string) - CSS selector to test specific element
  - `axeOptions` (Object) - Axe Core configuration
  - `skipFailures` (boolean) - Don't fail test on violations (default: false)

**Returns:** Promise<Object> - Test results with violations

### `ResultsCollector`

Manage test results and history.

**Methods:**
- `saveResults(results)` - Save test results and update history
- `getHistory()` - Get historical data
- `getLatest()` - Get latest test results
- `getTrends()` - Get trend analysis

### `generateHTMLReport()`

Generate HTML dashboard from saved results.

```javascript
const generateHTMLReport = require('./src/generate-report');
generateHTMLReport();
```

## 🎯 Best Practices

1. **Run tests regularly** - Use the scheduled workflow to catch regressions early
2. **Test critical paths** - Focus on user-facing pages and key workflows
3. **Start with warnings** - Use `skipFailures: true` initially, then gradually fix issues
4. **Review trends** - Monitor the historical data to track improvements
5. **Customize rules** - Adjust Axe configuration to match your accessibility requirements
6. **Integrate early** - Add accessibility tests in your development workflow

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Resources

- [Axe Core Documentation](https://github.com/dequelabs/axe-core)
- [Playwright Documentation](https://playwright.dev/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Resources](https://webaim.org/)

## 💡 Examples

Check out the `examples/` directory for more usage examples and the `tests/` directory to see the framework in action.

## 🐛 Troubleshooting

### Tests fail with "browser not found"

Run `npm run install:browsers` to install Playwright browsers.

### No results generated

Make sure to call `collector.saveResults(allResults)` in your test's `afterAll` hook.

### GitHub Actions failing

Ensure your repository has Actions enabled and the workflow file is in `.github/workflows/`.

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

Made with ❤️ for accessible web