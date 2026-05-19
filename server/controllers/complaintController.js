const Complaint = require('../models/Complaint');

exports.createComplaint = async (req, res) => {
  try {
    const { name, email, title, description, category, location, aiAnalysis } = req.body;
    const complaint = await Complaint.create({
      name,
      email,
      title,
      description,
      category,
      location,
      aiAnalysis,
      user: req.user.id
    });
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    const { category } = req.query;
    const query = {};
    if (category) {
      query.category = category;
    }
    // If not admin, only show user's own complaints
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }
    const complaints = await Complaint.find(query).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.searchComplaints = async (req, res) => {
  try {
    const { location } = req.query;
    const query = {};
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (req.user.role !== 'admin') {
      query.user = req.user.id;
    }
    const complaints = await Complaint.find(query).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateComplaint = async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.json({ message: 'Complaint deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.analyzeComplaint = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({ message: 'OpenRouter API key not configured' });
    }

    const prompt = `
      Analyze the following complaint:
      Title: ${title}
      Description: ${description}
      
      Provide a JSON response with exactly the following fields (no markdown formatting, just plain JSON):
      {
        "urgency": "High/Medium/Low",
        "priority": "High/Medium/Low",
        "department": "Suggested Department (e.g. Water, Electricity, Sanitation, Road, etc.)",
        "summary": "1 sentence summary",
        "suggestedResponse": "A polite auto-response acknowledging the issue"
      }
    `;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "google/gemini-2.5-flash",
        "messages": [
          {"role": "user", "content": prompt}
        ]
      })
    });

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from AI');
    }

    let text = data.choices[0].message.content;
    // remove markdown block if present
    if (text.startsWith('\`\`\`json')) {
       text = text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '');
    } else if (text.startsWith('\`\`\`')) {
       text = text.replace(/\`\`\`/g, '');
    }
    const analysis = JSON.parse(text.trim());
    
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
