import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AgentOrchestrator } from './agents/orchestrator.js';
import { connectDB } from './db/connection.js';
import { codeRoutes } from './routes/code.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/code', codeRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server running', agents: ['BugDetector', 'TestGenerator', 'DocGenerator', 'OptimizationAgent'] });
});

// Start server
app.listen(PORT, () => {
  
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('📊 Multi-Agent Code Assistant Backend');
});

export { AgentOrchestrator };
