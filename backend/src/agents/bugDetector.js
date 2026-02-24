export class BugDetectorAgent {
  constructor() {
    // OpenAI client ready when API key is available
    this.openai = null;
    if (process.env.OPENAI_API_KEY) {
      try {
        const { OpenAI } = require('openai');
        this.openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });
      } catch (e) {
        console.log('⚠️  OpenAI not available, using pattern-based analysis');
      }
    }
  }

  async analyze(code) {
    console.log('🐛 BugDetector Agent: Analyzing code for bugs...');

    // If OpenAI is available, use it
    if (this.openai) {
      try {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are an expert code reviewer. Analyze the provided code for bugs, anti-patterns, and potential issues. 
              Return a JSON object with the following structure: { "issues": ["issue 1", "issue 2", ...], "severity": "low|medium|high" }
              List up to 5 critical issues. Be specific about what's wrong and where.`,
            },
            {
              role: 'user',
              content: `Analyze this code for bugs:\n\n${code}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        });

        const content = response.choices[0].message.content;
        let result;
        try {
          result = JSON.parse(content);
        } catch {
          const issuesMatch = content.match(/(?:^|[\n])[-•]\s*(.+?)(?=[\n]|$)/gm);
          result = {
            issues: issuesMatch 
              ? issuesMatch.map((m) => m.replace(/^[-•]\s*/, '').trim())
              : [content],
            severity: 'medium',
          };
        }

        return {
          agent: 'BugDetector',
          count: result.issues?.length || 0,
          issues: (result.issues || []).slice(0, 5),
          severity: result.severity || 'medium',
        };
      } catch (error) {
        console.log('OpenAI error, falling back to pattern-based:', error.message);
      }
    }

    // Pattern-based fallback
    const bugs = [];
    const lines = code.split('\n');

    lines.forEach((line, idx) => {
      if (line.includes('var ') && !line.includes('var ')) {
        bugs.push(`Line ${idx + 1}: Use 'let' or 'const' instead of 'var'`);
      }
      if (line.includes('==') && !line.includes('===')) {
        bugs.push(`Line ${idx + 1}: Use '===' for strict equality comparison`);
      }
      if (line.includes('setTimeout') && !line.includes('clearTimeout')) {
        bugs.push(`Line ${idx + 1}: Potential memory leak - consider cleanup for setTimeout`);
      }
      if (line.includes('console.log')) {
        bugs.push(`Line ${idx + 1}: Remove debug console.log in production`);
      }
      if (line.match(/function\s+\w+\s*\(/)) {
        bugs.push(`Line ${idx + 1}: Consider using arrow functions for consistency`);
      }
    });

    if (bugs.length === 0) {
      bugs.push(
        'Missing error handling in async operations',
        'Consider input validation for user data',
        'Add type definitions for better type safety',
        'Review variable naming conventions'
      );
    }

    return {
      agent: 'BugDetector',
      count: bugs.length,
      issues: bugs.slice(0, 5),
      severity: 'medium',
    };
  }
}
