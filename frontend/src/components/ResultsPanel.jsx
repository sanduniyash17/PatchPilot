import React from 'react';

function ResultsPanel({ results, loading }) {
  if (loading) {
    return (
      <div className="results-panel">
        <h2>📊 Analysis Results</h2>
        <div className="loading">
          <div className="spinner"></div>
          <p style={{ marginTop: '15px' }}>AI Agents analyzing your code...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="results-panel">
        <h2>📊 Analysis Results</h2>
        <div className="empty-state">
          <p>👈 Paste code and click "Analyze Code" to get started</p>
        </div>
      </div>
    );
  }

  if (!results.success) {
    return (
      <div className="results-panel">
        <h2>📊 Analysis Results</h2>
        <div className="error">Error: {results.error}</div>
      </div>
    );
  }

  const { results: analysisResults } = results;

  return (
    <div className="results-panel">
      <h2>📊 Analysis Results</h2>

      <div className="agent-stats">
        {analysisResults.bugs && (
          <div className="stat-box">
            <h4>🐛 Bugs Found</h4>
            <div className="number">{analysisResults.bugs.count}</div>
          </div>
        )}
        {analysisResults.tests && (
          <div className="stat-box">
            <h4>✅ Tests Generated</h4>
            <div className="number">{analysisResults.tests.count}</div>
          </div>
        )}
        {analysisResults.optimizations && (
          <div className="stat-box">
            <h4>⚡ Optimizations</h4>
            <div className="number">{analysisResults.optimizations.count}</div>
          </div>
        )}
        {analysisResults.documentation && (
          <div className="stat-box">
            <h4>📚 Doc Sections</h4>
            <div className="number">{analysisResults.documentation.sections}</div>
          </div>
        )}
      </div>

      {analysisResults.bugs && (
        <div className="result-section">
          <h3>
            <span className="agent-badge">BugDetector</span>
            🐛 Bugs Found ({analysisResults.bugs.count})
          </h3>
          <ul className="issue-list">
            {analysisResults.bugs.issues.map((issue, idx) => (
              <li key={idx}>{issue}</li>
            ))}
          </ul>
        </div>
      )}

      {analysisResults.tests && (
        <div className="result-section">
          <h3>
            <span className="agent-badge">TestGenerator</span>
            ✅ Generated Tests
          </h3>
          <ul className="test-list">
            {analysisResults.tests.tests.map((test, idx) => (
              <li key={idx} style={{ fontSize: '0.85em', fontFamily: 'monospace', color: '#666' }}>
                {test.substring(0, 60)}...
              </li>
            ))}
          </ul>
        </div>
      )}

      {analysisResults.optimizations && (
        <div className="result-section">
          <h3>
            <span className="agent-badge">OptimizationAgent</span>
            ⚡ Optimization Suggestions
          </h3>
          <ul className="suggestion-list">
            {analysisResults.optimizations.suggestions.map((suggestion, idx) => (
              <li key={idx}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}

      {analysisResults.documentation && (
        <div className="result-section">
          <h3>
            <span className="agent-badge">DocGenerator</span>
            📚 Documentation
          </h3>
          <pre
            style={{
              background: '#f5f5f5',
              padding: '10px',
              borderRadius: '4px',
              fontSize: '0.85em',
              overflow: 'auto',
              maxHeight: '200px',
            }}
          >
            {analysisResults.documentation.documentation.substring(0, 300)}...
          </pre>
        </div>
      )}
    </div>
  );
}

export default ResultsPanel;
