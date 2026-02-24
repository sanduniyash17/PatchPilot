import { BugDetectorAgent } from './bugDetector.js';
import { TestGeneratorAgent } from './testGenerator.js';
import { DocGeneratorAgent } from './docGenerator.js';
import { OptimizationAgent } from './optimization.js';

export class AgentOrchestrator {
  constructor() {
    try {
      this.agents = {
        bugDetector: new BugDetectorAgent(),
        testGenerator: new TestGeneratorAgent(),
        docGenerator: new DocGeneratorAgent(),
        optimization: new OptimizationAgent(),
      };
      console.log('✅ All agents initialized successfully');
    } catch (error) {
      console.error('⚠️  Warning: Agents initialized but OpenAI may not be configured:', error.message);
      // Continue anyway - will show errors when used
      this.agents = {
        bugDetector: new BugDetectorAgent(),
        testGenerator: new TestGeneratorAgent(),
        docGenerator: new DocGeneratorAgent(),
        optimization: new OptimizationAgent(),
      };
    }
  }

  async analyzeCode(code, selectedAgents = ['all']) {
    console.log('🎯 Orchestrator: Analyzing code with agents...');
    const results = {};

    try {
      if (selectedAgents.includes('all') || selectedAgents.includes('bugDetector')) {
        results.bugs = await this.agents.bugDetector.analyze(code);
      }

      if (selectedAgents.includes('all') || selectedAgents.includes('testGenerator')) {
        results.tests = await this.agents.testGenerator.generate(code);
      }

      if (selectedAgents.includes('all') || selectedAgents.includes('docGenerator')) {
        results.documentation = await this.agents.docGenerator.generate(code);
      }

      if (selectedAgents.includes('all') || selectedAgents.includes('optimization')) {
        results.optimizations = await this.agents.optimization.analyze(code);
      }

      return {
        success: true,
        results,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Orchestrator Error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
