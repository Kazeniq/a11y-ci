const { test, expect } = require('@playwright/test');
const { runAccessibilityTest } = require('../src/accessibility-tester');
const ResultsCollector = require('../src/results-collector');

// Initialize results collector
const collector = new ResultsCollector();
const allResults = [];

test.describe('Your Accessibility Tests', () => {
  
  // Example: Test your homepage
  test('Homepage accessibility', async ({ page }) => {
    const results = await runAccessibilityTest(page, { 
      url: 'https://your-site.com',
      skipFailures: true  // Set to false to fail test on violations
    });
    
    allResults.push(results);
    console.log(`✓ Tested: ${results.url} - Violations: ${results.violationCount}`);
  });

  // Example: Test another page
  test('About page accessibility', async ({ page }) => {
    const results = await runAccessibilityTest(page, { 
      url: 'https://your-site.com/about',
      skipFailures: true
    });
    
    allResults.push(results);
    console.log(`✓ Tested: ${results.url} - Violations: ${results.violationCount}`);
  });

  // Add more tests for your pages...

  // Save results after all tests
  test.afterAll(async () => {
    if (allResults.length > 0) {
      collector.saveResults(allResults);
      console.log('\n✓ Test results saved');
      console.log('Run "npm run report" to generate HTML report');
    }
  });
});
