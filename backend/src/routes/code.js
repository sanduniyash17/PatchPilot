import express from 'express';
import { AgentOrchestrator } from '../agents/orchestrator.js';

const router = express.Router();
const orchestrator = new AgentOrchestrator();

// Analyze code with all agents
router.post('/analyze', async (req, res) => {
  try {
    const { code, agents } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Code is required' });
    }

    const results = await orchestrator.analyzeCode(code, agents || ['all']);
    res.json(results);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get analysis history
router.get('/history', async (req, res) => {
  try {
    res.json({
      message: 'Analysis history retrieved',
      count: 0,
      analyses: [],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as codeRoutes };
