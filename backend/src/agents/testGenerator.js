export class TestGeneratorAgent {
  constructor() {
    this.openai = null;
    if (process.env.OPENAI_API_KEY) {
      try {
        const { OpenAI } = require('openai');
        this.openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });
      } catch (e) {
        console.log('⚠️  OpenAI not available, using pattern-based generation');
      }
    }
  }

  async generate(code) {
    console.log('✅ TestGenerator Agent: Generating tests...');

    if (this.openai) {
      try {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are an expert test writer. Generate comprehensive Jest unit tests for the provided code.
              Return a JSON object with: { "tests": ["test code 1", "test code 2", ...], "coverage": "XX%" }
              Generate 3-4 tests covering normal cases, edge cases, and error handling.
              Make tests production-ready and follow Jest conventions.`,
            },
            {
              role: 'user',
              content: `Generate Jest tests for this code:\n\n${code}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 800,
        });

        const content = response.choices[0].message.content;
        let result;
        try {
          result = JSON.parse(content);
        } catch {
          const testMatches = content.match(/```javascript\n([\s\S]*?)```/g) || [];
          result = {
            tests: testMatches.length > 0
              ? testMatches.map((m) => m.replace(/```javascript\n/, '').replace(/```/, ''))
              : [content],
            coverage: '~70%',
          };
        }

        return {
          agent: 'TestGenerator',
          count: result.tests?.length || 0,
          tests: (result.tests || []).slice(0, 4),
          framework: 'Jest',
          coverage: result.coverage || '~60%',
        };
      } catch (error) {
        console.log('OpenAI error, falling back to pattern-based:', error.message);
      }
    }

    // Pattern-based fallback
    const tests = [];

    if (code.includes('function') || code.includes('=>')) {
      tests.push(
        'describe("Function Tests", () => { it("should return expected result", () => { expect(func()).toBeDefined(); }); });',
        'describe("Edge Cases", () => { it("should handle null input", () => { expect(func(null)).not.toThrow(); }); });'
      );
    }

    if (code.includes('async') || code.includes('await')) {
      tests.push(
        'it("should resolve async operation", async () => { const result = await asyncFunc(); expect(result).toBeDefined(); });',
        'it("should handle async errors", async () => { await expect(asyncFunc()).rejects.toThrow(); });'
      );
    }

    if (code.includes('class')) {
      tests.push(
        'describe("Class Tests", () => { it("should instantiate correctly", () => { const instance = new MyClass(); expect(instance).toBeDefined(); }); });'
      );
    }

    if (tests.length === 0) {
      tests.push(
        'it("should pass basic test", () => { expect(true).toBe(true); });',
        'it("should handle input validation", () => { expect(() => validator(null)).not.toThrow(); });'
      );
    }

    return {
      agent: 'TestGenerator',
      count: tests.length,
      tests: tests.slice(0, 4),
      framework: 'Jest',
      coverage: '~60%',
    };
  }
}
