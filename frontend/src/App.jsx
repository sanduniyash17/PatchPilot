import React, { useState } from 'react';
import axios from 'axios';
import CodeEditor from './components/CodeEditor';
import ResultsPanel from './components/ResultsPanel';

function App() {
  const [code, setCode] = useState('// Paste your code here\nfunction example() {\n  return "Hello";\n}');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedAgents, setSelectedAgents] = useState(['all']);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/code/analyze', {
        code,
        agents: selectedAgents,
      });
      setResults(response.data);
    } catch (error) {
      console.error('Error:', error);
      setResults({
        success: false,
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setCode('');
    setResults(null);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🎯 Multi-Agent Code Assistant</h1>
        <p>Analyze your code with AI-powered agents for bugs, tests, docs & optimizations</p>
      </div>

      <div className="main-content">
        <CodeEditor
          code={code}
          setCode={setCode}
          onAnalyze={handleAnalyze}
          onClear={handleClear}
          loading={loading}
          selectedAgents={selectedAgents}
          setSelectedAgents={setSelectedAgents}
        />

        <ResultsPanel results={results} loading={loading} />
      </div>
    </div>
  );
}

export default App;
