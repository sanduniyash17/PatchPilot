import mongoose from 'mongoose';

const analysisSchema = new mongoose.Schema({
  code: String,
  results: {
    bugs: [String],
    tests: [String],
    documentation: String,
    optimizations: [String],
  },
  timestamp: { type: Date, default: Date.now },
  userId: String,
});

export const Analysis = mongoose.model('Analysis', analysisSchema);
