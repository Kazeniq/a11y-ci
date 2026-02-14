# Quick Start Guide

Get started with a11y-ci in 5 minutes!

## Prerequisites

- Node.js 16+ installed
- Git

## Step 1: Clone and Install

```bash
git clone https://github.com/Kazeniq/a11y-ci.git
cd a11y-ci
npm install
npm run install:browsers
```

## Step 2: Run Example Tests

```bash
npm test
```

You should see output like:
```
Running 2 tests using 1 worker
✓ Tested: test://accessible-page
  Violations: 0
✓ Tested: test://page-with-issues
  Violations: 6

✓ Test results saved to results/latest.json
✓ History updated in results/history.json

  2 passed (1.7s)
```

## Step 3: Generate HTML Report

```bash
npm run report
```

This creates `results/report.html`. Open it in your browser to see:
- Summary cards with metrics
- Detailed violation reports
- Historical trends

## Step 4: Customize for Your Site

Edit `tests/example.spec.js` or create a new test file:

```javascript
const { test } = require('@playwright/test');
const { runAccessibilityTest } = require('../src/accessibility-tester');
const ResultsCollector = require('../src/results-collector');

const collector = new ResultsCollector();
const allResults = [];

test.describe('My Website Accessibility', () => {
  
  test('Test my homepage', async ({ page }) => {
    const results = await runAccessibilityTest(page, { 
      url: 'https://your-website.com',
      skipFailures: true
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

## Step 5: Run Your Tests

```bash
npm test
npm run report
```

## Next Steps

### Enable GitHub Actions

The repository includes a GitHub Actions workflow that:
- Runs tests automatically on push and PR
- Generates reports
- Comments on PRs with results
- Publishes to GitHub Pages (optional)

Just push to GitHub and the workflow will run automatically!

### Understand the Results

The HTML report shows:
- **Critical/Serious**: Fix these first - major accessibility barriers
- **Moderate**: Important issues that should be addressed
- **Minor**: Nice to have fixes

Each violation includes:
- Description of the issue
- Help text for fixing
- Links to documentation
- Affected HTML elements

### Track Progress

Run tests regularly to:
- See trends over time
- Monitor improvements
- Catch new violations early

The history tracking shows your progress with visual indicators.

## Common Use Cases

### Test Multiple Pages

```javascript
const pages = [
  'https://example.com',
  'https://example.com/about',
  'https://example.com/contact'
];

pages.forEach((url, index) => {
  test(`Page ${index + 1}`, async ({ page }) => {
    const results = await runAccessibilityTest(page, { url, skipFailures: true });
    allResults.push(results);
  });
});
```

### Test After User Actions

```javascript
test('Form after submission', async ({ page }) => {
  await page.goto('https://example.com/form');
  await page.fill('#email', 'test@example.com');
  await page.click('button[type="submit"]');
  
  const results = await runAccessibilityTest(page, { skipFailures: true });
  allResults.push(results);
});
```

### Test Specific WCAG Levels

```javascript
const results = await runAccessibilityTest(page, {
  url: 'https://example.com',
  axeOptions: {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa'] // Only test WCAG 2.0 Level A & AA
    }
  }
});
```

## Tips

1. **Start with skipFailures: true** - See all issues without failing tests
2. **Fix incrementally** - Start with critical/serious issues
3. **Run regularly** - Catch issues early in development
4. **Review reports** - Understand the context of each violation
5. **Use CI/CD** - Automate testing in your workflow

## Getting Help

- 📖 Read the [README](README.md) for detailed documentation
- 🔧 Check [INTEGRATION.md](INTEGRATION.md) for integration guides
- 🐛 Open an [issue](https://github.com/Kazeniq/a11y-ci/issues) for bugs
- 💬 Start a [discussion](https://github.com/Kazeniq/a11y-ci/discussions) for questions

## What's Next?

- Add tests for your site's pages
- Set up scheduled runs in GitHub Actions
- Share results with your team
- Track improvements over time
- Make the web more accessible! 🎉
