const Roadmap = require('../models/Roadmap');
const axios = require('axios');

const generateRoadmap = async (req, res) => {
    try {
        const { goal, skillLevel, interests } = req.body;
        const userId = req.userId;

        const prompt = `
        Generate a detailed career roadmap for a person who wants to become a ${goal}.
        Skill Level: ${skillLevel}
        Interests: ${interests}
        
        For EACH step, you MUST provide:
        1. A relevant YouTube search or video link.
        2. A high-quality documentation or educational website link (like MDN, Official Docs, W3Schools, etc.).
        
        Provide the response in JSON format with the following structure:
        {
          "title": "Roadmap Title",
          "description": "Short overview",
          "steps": [
            {
              "title": "Step Name",
              "description": "What to learn and why",
              "resources": [
                { "title": "Watch Tutorial", "url": "https://www.youtube.com/results?search_query=...", "type": "video" },
                { "title": "Read Documentation", "url": "https://...", "type": "documentation" }
              ]
            }
          ]
        }
        Limit to 5-7 key steps. Ensure the resources are highly relevant and accurate.
        `;

        // Using Gemini API
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text: prompt }] }]
            }
        );

        if (!response.data || !response.data.candidates || !response.data.candidates[0].content) {
            console.error('Invalid Gemini Response Structure:', response.data);
            return res.status(500).json({ message: 'AI failed to generate content' });
        }

        let roadmapData;
        try {
            const rawContent = response.data.candidates[0].content.parts[0].text;
            // Extract JSON from the markdown response if necessary
            const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
            roadmapData = JSON.parse(jsonMatch ? jsonMatch[0] : rawContent);
        } catch (parseError) {
            console.error('AI JSON Parse Error:', parseError);
            return res.status(500).json({ message: 'Failed to parse AI response' });
        }

        if (!roadmapData.title || !roadmapData.steps) {
            return res.status(500).json({ message: 'AI response missing required fields' });
        }

        const newRoadmap = new Roadmap({
            userId,
            title: roadmapData.title,
            description: roadmapData.description || '',
            goal,
            skillLevel,
            steps: roadmapData.steps.map(step => ({
                ...step,
                isCompleted: false
            })),
            progress: 0
        });

        await newRoadmap.save();
        res.status(201).json(newRoadmap);

    } catch (err) {
        console.error('Roadmap Generation Error:', err.response?.data || err.message);
        const errorMessage = err.response?.data?.error?.message || err.message;
        res.status(500).json({ message: 'Failed to generate roadmap', error: errorMessage });
    }
};

const getRoadmaps = async (req, res) => {
    try {
        const roadmaps = await Roadmap.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json(roadmaps);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getRoadmapById = async (req, res) => {
    try {
        const roadmap = await Roadmap.findOne({ _id: req.params.id, userId: req.userId });
        if (!roadmap) return res.status(404).json({ message: 'Roadmap not found' });
        res.json(roadmap);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateProgress = async (req, res) => {
    try {
        const { roadmapId, stepIndex, isCompleted } = req.body;
        const roadmap = await Roadmap.findOne({ _id: roadmapId, userId: req.userId });
        if (!roadmap) return res.status(404).json({ message: 'Roadmap not found' });

        roadmap.steps[stepIndex].isCompleted = isCompleted;
        
        // Calculate total progress
        const completedSteps = roadmap.steps.filter(s => s.isCompleted).length;
        roadmap.progress = Math.round((completedSteps / roadmap.steps.length) * 100);

        await roadmap.save();
        res.json(roadmap);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { generateRoadmap, getRoadmaps, getRoadmapById, updateProgress };
