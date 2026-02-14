const fs = require('fs');
const path = require('path');

class ResultsCollector {
  constructor(resultsDir = 'results') {
    this.resultsDir = resultsDir;
    this.historyFile = path.join(resultsDir, 'history.json');
    this.latestFile = path.join(resultsDir, 'latest.json');
    
    // Ensure results directory exists
    if (!fs.existsSync(resultsDir)) {
      fs.mkdirSync(resultsDir, { recursive: true });
    }
  }

  /**
   * Save test results and update history
   */
  saveResults(results) {
    const timestamp = new Date().toISOString();
    const runId = `run-${Date.now()}`;

    // Create summary
    const summary = {
      runId,
      timestamp,
      totalPages: results.length,
      totalViolations: results.reduce((sum, r) => sum + r.violationCount, 0),
      passedPages: results.filter(r => r.passed).length,
      failedPages: results.filter(r => !r.passed).length,
      results
    };

    // Save latest results
    fs.writeFileSync(
      this.latestFile,
      JSON.stringify(summary, null, 2)
    );

    // Update history
    this.updateHistory(summary);

    return summary;
  }

  /**
   * Update history file with new results
   */
  updateHistory(summary) {
    let history = [];
    
    // Load existing history
    if (fs.existsSync(this.historyFile)) {
      const content = fs.readFileSync(this.historyFile, 'utf-8');
      history = JSON.parse(content);
    }

    // Add new entry (keep last 50 runs)
    history.unshift({
      runId: summary.runId,
      timestamp: summary.timestamp,
      totalPages: summary.totalPages,
      totalViolations: summary.totalViolations,
      passedPages: summary.passedPages,
      failedPages: summary.failedPages
    });

    // Keep only last 50 runs
    if (history.length > 50) {
      history = history.slice(0, 50);
    }

    // Save updated history
    fs.writeFileSync(
      this.historyFile,
      JSON.stringify(history, null, 2)
    );
  }

  /**
   * Get history data
   */
  getHistory() {
    if (!fs.existsSync(this.historyFile)) {
      return [];
    }
    const content = fs.readFileSync(this.historyFile, 'utf-8');
    return JSON.parse(content);
  }

  /**
   * Get latest results
   */
  getLatest() {
    if (!fs.existsSync(this.latestFile)) {
      return null;
    }
    const content = fs.readFileSync(this.latestFile, 'utf-8');
    return JSON.parse(content);
  }

  /**
   * Calculate trend data
   */
  getTrends() {
    const history = this.getHistory();
    if (history.length === 0) return null;

    const current = history[0];
    const previous = history[1];

    if (!previous) {
      return {
        current,
        change: null,
        trend: 'stable'
      };
    }

    const change = {
      violations: current.totalViolations - previous.totalViolations,
      passedPages: current.passedPages - previous.passedPages,
      failedPages: current.failedPages - previous.failedPages
    };

    const trend = change.violations < 0 ? 'improving' : 
                  change.violations > 0 ? 'declining' : 'stable';

    return {
      current,
      previous,
      change,
      trend
    };
  }
}

module.exports = ResultsCollector;
