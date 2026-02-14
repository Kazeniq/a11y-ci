const { test, expect } = require('@playwright/test');
const { runAccessibilityTest } = require('../src/accessibility-tester');
const ResultsCollector = require('../src/results-collector');

// Initialize results collector
const collector = new ResultsCollector();
const allResults = [];

test.describe('Accessibility Tests', () => {
  
  test('Example: Test a simple HTML page', async ({ page }) => {
    // Create a simple test page
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Accessible Test Page</title>
      </head>
      <body>
        <header>
          <h1>Welcome to Our Accessible Site</h1>
          <nav aria-label="Main navigation">
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </nav>
        </header>
        
        <main>
          <article>
            <h2>Main Content</h2>
            <p>This is an example of an accessible web page.</p>
            
            <form>
              <label for="name">Name:</label>
              <input type="text" id="name" name="name" required>
              
              <label for="email">Email:</label>
              <input type="email" id="email" name="email" required>
              
              <button type="submit">Submit</button>
            </form>
          </article>
        </main>
        
        <footer>
          <p>&copy; 2024 Accessible Example</p>
        </footer>
      </body>
      </html>
    `;
    
    await page.setContent(html);
    
    // Run accessibility test (with skipFailures to collect results)
    const results = await runAccessibilityTest(page, { 
      skipFailures: true
    });
    
    // Override URL for reporting purposes
    results.url = 'test://accessible-page';
    
    allResults.push(results);
    
    console.log(`✓ Tested: ${results.url}`);
    console.log(`  Violations: ${results.violationCount}`);
  });

  test('Example: Test page with accessibility issues', async ({ page }) => {
    // Create a page with intentional accessibility issues
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Page with Issues</title>
      </head>
      <body>
        <div onclick="alert('clicked')">Click me</div>
        <img src="test.jpg">
        <input type="text" placeholder="Enter name">
        <div style="color: #ccc; background: white;">Low contrast text</div>
      </body>
      </html>
    `;
    
    await page.setContent(html);
    
    // Run accessibility test (with skipFailures to collect results)
    const results = await runAccessibilityTest(page, { 
      skipFailures: true
    });
    
    // Override URL for reporting purposes
    results.url = 'test://page-with-issues';
    
    allResults.push(results);
    
    console.log(`✓ Tested: ${results.url}`);
    console.log(`  Violations: ${results.violationCount}`);
  });

  // After all tests, save results
  test.afterAll(async () => {
    if (allResults.length > 0) {
      collector.saveResults(allResults);
      console.log('\n✓ Test results saved to results/latest.json');
      console.log('✓ History updated in results/history.json');
      console.log('\nRun "npm run report" to generate HTML report');
    }
  });
});
