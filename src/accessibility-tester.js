const { test, expect } = require('@playwright/test');
const { injectAxe, checkA11y, getViolations } = require('axe-playwright');

/**
 * Runs accessibility checks on a page using Axe Core
 * @param {Object} page - Playwright page object
 * @param {Object} options - Options for accessibility checking
 * @returns {Promise<Object>} - Axe results with violations
 */
async function runAccessibilityTest(page, options = {}) {
  const {
    url,
    context = null,
    axeOptions = {},
    skipFailures = false
  } = options;

  // Navigate to URL if provided
  if (url) {
    await page.goto(url, { waitUntil: 'networkidle' });
  }

  // Inject Axe Core
  await injectAxe(page);

  // Run Axe checks
  const violations = await getViolations(page, context, axeOptions);

  // Format results
  const results = {
    url: url || page.url(),
    timestamp: new Date().toISOString(),
    violations: violations.map(violation => ({
      id: violation.id,
      impact: violation.impact,
      description: violation.description,
      help: violation.help,
      helpUrl: violation.helpUrl,
      tags: violation.tags,
      nodes: violation.nodes.map(node => ({
        html: node.html,
        target: node.target,
        failureSummary: node.failureSummary
      }))
    })),
    violationCount: violations.length,
    passed: violations.length === 0
  };

  // Fail test if violations found (unless skipFailures is true)
  if (!skipFailures && violations.length > 0) {
    const summary = violations.map(v => 
      `${v.id} (${v.impact}): ${v.description} - ${v.nodes.length} node(s)`
    ).join('\n');
    
    throw new Error(`Found ${violations.length} accessibility violations:\n${summary}`);
  }

  return results;
}

/**
 * Test helper to check accessibility of a page
 */
async function testPageAccessibility(page, pageName, url, options = {}) {
  await test.step(`Check accessibility for ${pageName}`, async () => {
    const results = await runAccessibilityTest(page, { url, ...options });
    
    // Attach results to test report
    await test.info().attach(`a11y-results-${pageName}`, {
      body: JSON.stringify(results, null, 2),
      contentType: 'application/json'
    });

    return results;
  });
}

module.exports = {
  runAccessibilityTest,
  testPageAccessibility
};
