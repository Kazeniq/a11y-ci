const fs = require('fs');
const path = require('path');
const ResultsCollector = require('./results-collector');

function generateHTMLReport() {
  const collector = new ResultsCollector();
  const latest = collector.getLatest();
  const history = collector.getHistory();
  const trends = collector.getTrends();

  if (!latest) {
    console.log('No test results found. Run tests first.');
    return;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Accessibility Test Results - ${latest.timestamp}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      padding: 20px;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    h1 {
      color: #1a1a1a;
      margin-bottom: 10px;
      font-size: 2em;
    }
    
    h2 {
      color: #2a2a2a;
      margin-top: 30px;
      margin-bottom: 15px;
      font-size: 1.5em;
      border-bottom: 2px solid #007bff;
      padding-bottom: 10px;
    }
    
    h3 {
      color: #3a3a3a;
      margin-top: 20px;
      margin-bottom: 10px;
      font-size: 1.2em;
    }
    
    .timestamp {
      color: #666;
      font-size: 0.9em;
      margin-bottom: 20px;
    }
    
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .stat-card.success {
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
    }
    
    .stat-card.warning {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }
    
    .stat-card.info {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }
    
    .stat-value {
      font-size: 2.5em;
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .stat-label {
      font-size: 0.9em;
      opacity: 0.9;
    }
    
    .trend {
      margin: 20px 0;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 6px;
      border-left: 4px solid #007bff;
    }
    
    .trend.improving {
      border-left-color: #28a745;
      background: #d4edda;
    }
    
    .trend.declining {
      border-left-color: #dc3545;
      background: #f8d7da;
    }
    
    .page-result {
      margin: 20px 0;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 6px;
      border-left: 4px solid #007bff;
    }
    
    .page-result.passed {
      border-left-color: #28a745;
      background: #d4edda;
    }
    
    .page-result.failed {
      border-left-color: #dc3545;
      background: #f8d7da;
    }
    
    .page-url {
      font-weight: bold;
      color: #007bff;
      margin-bottom: 10px;
      word-break: break-all;
    }
    
    .violation {
      margin: 15px 0;
      padding: 15px;
      background: white;
      border-radius: 4px;
      border-left: 3px solid #ffc107;
    }
    
    .violation.critical {
      border-left-color: #dc3545;
    }
    
    .violation.serious {
      border-left-color: #fd7e14;
    }
    
    .violation.moderate {
      border-left-color: #ffc107;
    }
    
    .violation.minor {
      border-left-color: #17a2b8;
    }
    
    .violation-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .violation-id {
      font-weight: bold;
      color: #333;
    }
    
    .impact-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8em;
      font-weight: bold;
      text-transform: uppercase;
    }
    
    .impact-badge.critical {
      background: #dc3545;
      color: white;
    }
    
    .impact-badge.serious {
      background: #fd7e14;
      color: white;
    }
    
    .impact-badge.moderate {
      background: #ffc107;
      color: #333;
    }
    
    .impact-badge.minor {
      background: #17a2b8;
      color: white;
    }
    
    .violation-description {
      margin: 10px 0;
      color: #555;
    }
    
    .violation-help {
      margin: 10px 0;
      padding: 10px;
      background: #e9ecef;
      border-radius: 4px;
    }
    
    .violation-help a {
      color: #007bff;
      text-decoration: none;
    }
    
    .violation-help a:hover {
      text-decoration: underline;
    }
    
    .node {
      margin: 10px 0;
      padding: 10px;
      background: #f8f9fa;
      border-radius: 4px;
      font-size: 0.9em;
    }
    
    .node-target {
      font-family: 'Courier New', monospace;
      color: #d63384;
      margin-bottom: 5px;
    }
    
    .node-html {
      font-family: 'Courier New', monospace;
      background: white;
      padding: 8px;
      border-radius: 3px;
      overflow-x: auto;
      margin: 5px 0;
      border: 1px solid #dee2e6;
    }
    
    .history-chart {
      margin: 20px 0;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 6px;
    }
    
    .history-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    
    .history-table th,
    .history-table td {
      padding: 10px;
      text-align: left;
      border-bottom: 1px solid #dee2e6;
    }
    
    .history-table th {
      background: #007bff;
      color: white;
      font-weight: bold;
    }
    
    .history-table tr:hover {
      background: #f8f9fa;
    }
    
    .tags {
      margin: 10px 0;
    }
    
    .tag {
      display: inline-block;
      padding: 3px 8px;
      margin: 2px;
      background: #e9ecef;
      border-radius: 3px;
      font-size: 0.8em;
      color: #495057;
    }
    
    .no-violations {
      text-align: center;
      padding: 40px;
      color: #28a745;
      font-size: 1.2em;
    }
    
    .no-violations::before {
      content: '✓';
      display: block;
      font-size: 3em;
      margin-bottom: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🔍 Accessibility Test Results</h1>
    <div class="timestamp">Run: ${new Date(latest.timestamp).toLocaleString()}</div>
    
    <div class="summary">
      <div class="stat-card info">
        <div class="stat-value">${latest.totalPages}</div>
        <div class="stat-label">Total Pages Tested</div>
      </div>
      <div class="stat-card ${latest.totalViolations === 0 ? 'success' : 'warning'}">
        <div class="stat-value">${latest.totalViolations}</div>
        <div class="stat-label">Total Violations</div>
      </div>
      <div class="stat-card success">
        <div class="stat-value">${latest.passedPages}</div>
        <div class="stat-label">Passed Pages</div>
      </div>
      <div class="stat-card ${latest.failedPages > 0 ? 'warning' : 'success'}">
        <div class="stat-value">${latest.failedPages}</div>
        <div class="stat-label">Failed Pages</div>
      </div>
    </div>
    
    ${trends && trends.change ? `
    <div class="trend ${trends.trend}">
      <strong>Trend: ${trends.trend.toUpperCase()}</strong><br>
      Violations: ${trends.change.violations > 0 ? '+' : ''}${trends.change.violations} 
      (${trends.previous.totalViolations} → ${trends.current.totalViolations})
    </div>
    ` : ''}
    
    <h2>Test Results by Page</h2>
    ${latest.results.map(result => `
      <div class="page-result ${result.passed ? 'passed' : 'failed'}">
        <div class="page-url">${result.url}</div>
        <div>Violations: <strong>${result.violationCount}</strong></div>
        <div>Status: <strong>${result.passed ? '✓ PASSED' : '✗ FAILED'}</strong></div>
        
        ${result.violations.length > 0 ? `
          <h3>Violations Found:</h3>
          ${result.violations.map(violation => `
            <div class="violation ${violation.impact}">
              <div class="violation-header">
                <span class="violation-id">${violation.id}</span>
                <span class="impact-badge ${violation.impact}">${violation.impact}</span>
              </div>
              <div class="violation-description">${violation.description}</div>
              <div class="violation-help">
                <strong>Help:</strong> ${violation.help}<br>
                <a href="${violation.helpUrl}" target="_blank">Learn more →</a>
              </div>
              <div class="tags">
                ${violation.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
              </div>
              <div><strong>Affected elements (${violation.nodes.length}):</strong></div>
              ${violation.nodes.map(node => `
                <div class="node">
                  <div class="node-target">Target: ${JSON.stringify(node.target)}</div>
                  <div class="node-html">${escapeHtml(node.html)}</div>
                </div>
              `).join('')}
            </div>
          `).join('')}
        ` : '<div class="no-violations">No accessibility violations found!</div>'}
      </div>
    `).join('')}
    
    ${history.length > 1 ? `
      <h2>📊 History</h2>
      <div class="history-chart">
        <table class="history-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Pages</th>
              <th>Violations</th>
              <th>Passed</th>
              <th>Failed</th>
            </tr>
          </thead>
          <tbody>
            ${history.slice(0, 10).map(run => `
              <tr>
                <td>${new Date(run.timestamp).toLocaleString()}</td>
                <td>${run.totalPages}</td>
                <td>${run.totalViolations}</td>
                <td>${run.passedPages}</td>
                <td>${run.failedPages}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    ` : ''}
  </div>
</body>
</html>`;

  // Save report
  const reportPath = path.join('results', 'report.html');
  fs.writeFileSync(reportPath, html);
  console.log(`✓ HTML report generated: ${reportPath}`);
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Run if called directly
if (require.main === module) {
  generateHTMLReport();
}

module.exports = generateHTMLReport;
