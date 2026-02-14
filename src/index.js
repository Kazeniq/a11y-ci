const { runAccessibilityTest, testPageAccessibility } = require('./accessibility-tester');
const ResultsCollector = require('./results-collector');
const generateHTMLReport = require('./generate-report');

module.exports = {
  runAccessibilityTest,
  testPageAccessibility,
  ResultsCollector,
  generateHTMLReport
};
