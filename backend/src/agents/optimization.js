export class OptimizationAgent {
  constructor() {
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
    console.log('⚡ OptimizationAgent: Analyzing optimizations...');

    if (this.openai) {
      try {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are an expert performance engineer. Analyze the provided code for optimization opportunities.
              Return a JSON object with: { "suggestions": ["optimization 1", "optimization 2", ...], "potentialGain": "XX% improvement" }
              Focus on: algorithmic improvements, memory efficiency, code reusability, and modern patterns.
              List up to 5 actionable suggestions with specific techniques.`,
            },
            {
              role: 'user',
              content: `Analyze this code for performance optimizations:\n\n${code}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 600,
        });

        const content = response.choices[0].message.content;
        let result;
        try {
          result = JSON.parse(content);
        } catch {
          const suggestionMatches = content.match(/(?:^|[\n])[-•]\s*(.+?)(?=[\n]|$)/gm);
          result = {
            suggestions: suggestionMatches
              ? suggestionMatches.map((m) => m.replace(/^[-•]\s*/, '').trim())
              : [content],
            potentialGain: '15-30% improvement',
          };
        }

        return {
          agent: 'OptimizationAgent',
          count: result.suggestions?.length || 0,
          suggestions: (result.suggestions || []).slice(0, 5),
          potentialGain: result.potentialGain || '20-40% improvement',
        };
      } catch (error) {
        console.log('OpenAI error, falling back to pattern-based:', error.message);
      }
    }

    // Pattern-based fallback
    const optimizations = [];

    if (code.includes('for') || code.includes('forEach')) {
      optimizations.push('Consider using .map() or .filter() for better functional patterns');
    }

    if (code.includes('let ') || code.includes('var ')) {
      optimizations.push('Use const by default, let only when reassignment is needed');
    }

    if (code.includes('JSON.parse') || code.includes('JSON.stringify')) {
      optimizations.push('Consider memoizing JSON operations for repeated calls');
    }

    if (!code.includes('async') && !code.includes('await')) {
      optimizations.push('Identify I/O operations that could benefit from async/await');
    }

    if (code.length > 1000) {
      optimizations.push('Break down into smaller, reusable functions');
    }

    if (!code.includes('cache') && !code.includes('memo')) {
      optimizations.push('Implement caching for expensive computations');
    }

    if (code.includes('setTimeout') && !code.includes('debounce')) {
      optimizations.push('Consider debouncing for repeated timeout calls');
    }

    return {
      agent: 'OptimizationAgent',
      count: optimizations.length,
      suggestions: optimizations.slice(0, 5),
      potentialGain: '20-40% improvement',
    };
  }
}
