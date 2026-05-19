const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  aiAnalysis: {
    urgency: String,
    priority: String,
    department: String,
    summary: String,
    suggestedResponse: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
