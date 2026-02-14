# Integration Guide

This guide shows how to integrate a11y-ci into your own project.

## Option 1: Use as a Template

1. Fork or clone this repository
2. Modify the tests in `tests/` to test your own URLs
3. Push to GitHub - Actions will run automatically

## Option 2: Add to Existing Project

### Step 1: Install Dependencies

```bash
npm install --save-dev @playwright/test playwright axe-core axe-playwright
```

### Step 2: Copy Source Files

Copy the `src/` directory to your project:
- `src/accessibility-tester.js`
- `src/results-collector.js`
- `src/generate-report.js`
- `src/index.js`

### Step 3: Copy Configuration

Copy `playwright.config.js` to your project root (or merge with existing config).

### Step 4: Create Tests

Create test files in your test directory. Example:

```javascript
const { test } = require('@playwright/test');
const { runAccessibilityTest } = require('./src/accessibility-tester');
const ResultsCollector = require('./src/results-collector');

const collector = new ResultsCollector();
const allResults = [];

test.describe('My Site Accessibility', () => {
  
  test('Homepage', async ({ page }) => {
    const results = await runAccessibilityTest(page, { 
      url: 'https://my-site.com',
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

### Step 5: Add npm Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "test:a11y": "playwright test",
    "report:a11y": "node src/generate-report.js",
    "install:browsers": "playwright install chromium"
  }
}
```

### Step 6: Setup GitHub Actions

Copy `.github/workflows/accessibility-tests.yml` to your project.

Modify the workflow to fit your needs (e.g., change test commands, adjust schedules).

## Option 3: Use as npm Package (Future)

This repository can be published to npm for easier installation. Stay tuned!

## Testing Different Pages

### Test Multiple Pages

```javascript
const pages = [
  { name: 'Home', url: 'https://example.com' },
  { name: 'About', url: 'https://example.com/about' },
  { name: 'Contact', url: 'https://example.com/contact' }
];

pages.forEach(({ name, url }) => {
  test(`${name} page`, async ({ page }) => {
    const results = await runAccessibilityTest(page, { url, skipFailures: true });
    allResults.push(results);
  });
});
```

### Test Authenticated Pages

```javascript
test.use({ storageState: 'auth.json' }); // Load saved auth

test('Dashboard (authenticated)', async ({ page }) => {
  await page.goto('https://example.com/dashboard');
  const results = await runAccessibilityTest(page, { skipFailures: true });
  allResults.push(results);
});
```

### Test with Different Viewports

```javascript
test('Mobile homepage', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  const results = await runAccessibilityTest(page, { 
    url: 'https://example.com',
    skipFailures: true 
  });
  allResults.push(results);
});
```

## Advanced Configuration

### Custom Axe Rules

```javascript
const results = await runAccessibilityTest(page, {
  url: 'https://example.com',
  axeOptions: {
    rules: {
      'color-contrast': { enabled: false }, // Disable specific rules
      'image-alt': { enabled: true }
    },
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa'] // Only test WCAG 2.0 Level A & AA
    }
  }
});
```

### Test Specific Components

```javascript
const results = await runAccessibilityTest(page, {
  url: 'https://example.com',
  context: '#main-content', // Test only this selector
  skipFailures: true
});
```

## CI/CD Integration

### GitHub Actions (included)

The workflow in `.github/workflows/accessibility-tests.yml` runs:
- On every push to main
- On every pull request
- Daily at 9 AM UTC
- Manually via workflow dispatch

### Other CI Systems

#### Jenkins

```groovy
stage('Accessibility Tests') {
  steps {
    sh 'npm ci'
    sh 'npm run install:browsers'
    sh 'npm run test:a11y'
    sh 'npm run report:a11y'
    publishHTML([
      reportDir: 'results',
      reportFiles: 'report.html',
      reportName: 'Accessibility Report'
    ])
  }
}
```

#### GitLab CI

```yaml
accessibility-tests:
  image: mcr.microsoft.com/playwright:latest
  script:
    - npm ci
    - npm run test:a11y
    - npm run report:a11y
  artifacts:
    paths:
      - results/
    reports:
      junit: results/test-results.json
```

## Best Practices

1. **Start Small**: Begin with key pages, expand gradually
2. **Use skipFailures Initially**: Set `skipFailures: true` to collect all violations without failing tests
3. **Fix Incrementally**: Address violations by priority (critical → serious → moderate → minor)
4. **Monitor Trends**: Use the history data to track improvements
5. **Run Regularly**: Schedule tests to catch new violations early
6. **Review Reports**: Use the HTML dashboard to understand violations
7. **Automate**: Integrate into PR workflow to prevent new violations

## Troubleshooting

### Tests timeout
Increase timeout in playwright.config.js:
```javascript
timeout: 60000 // 60 seconds
```

### Browser not found
Run: `npm run install:browsers`

### Results not saved
Ensure `collector.saveResults(allResults)` is in `test.afterAll()`

### GitHub Actions fails
- Check if Actions are enabled in repository settings
- Verify workflow file is in `.github/workflows/`
- Check workflow logs for specific errors

## Support

For issues and questions, open an issue on GitHub: https://github.com/Kazeniq/a11y-ci/issues
