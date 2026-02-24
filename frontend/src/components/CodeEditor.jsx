import React from 'react';

function CodeEditor({ code, setCode, onAnalyze, onClear, loading, selectedAgents, setSelectedAgents }) {
  const agents = ['bugDetector', 'testGenerator', 'docGenerator', 'optimization'];

  const toggleAgent = (agent) => {
    if (selectedAgents.includes('all')) {
      setSelectedAgents([agent]);
    } else if (selectedAgents.includes(agent)) {
      const newAgents = selectedAgents.filter((a) => a !== agent);
      setSelectedAgents(newAgents.length > 0 ? newAgents : ['all']);
    } else {
      setSelectedAgents([...selectedAgents, agent]);
    }
  };

  return (
    <div className="editor-panel">
      <h2>📝 Code Editor</h2>

      <div style={{ marginBottom: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={selectedAgents.includes('all')}
            onChange={() => setSelectedAgents(['all'])}
          />
          All Agents
        </label>
        {agents.map((agent) => (
          <label key={agent} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={selectedAgents.includes(agent)}
              onChange={() => toggleAgent(agent)}
              disabled={selectedAgents.includes('all')}
            />
            {agent === 'bugDetector'
              ? '🐛 Bugs'
              : agent === 'testGenerator'
                ? '✅ Tests'
                : agent === 'docGenerator'
                  ? '📚 Docs'
                  : '⚡ Optimize'}
          </label>
        ))}
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your code here..."
        disabled={loading}
      />

      <div className="controls">
        <button className="btn-primary" onClick={onAnalyze} disabled={loading || !code.trim()}>
          {loading ? (
            <>
              <span className="spinner"></span> Analyzing...
            </>
          ) : (
            '🚀 Analyze Code'
          )}
        </button>
        <button className="btn-secondary" onClick={onClear} disabled={loading}>
          Clear
        </button>
      </div>
    </div>
  );
}

export default CodeEditor;
