const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    title: String,
    url: String,
    type: { type: String, enum: ['video', 'article', 'course', 'documentation'] }
});

const stepSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    resources: [resourceSchema],
    isCompleted: { type: Boolean, default: false }
});

const roadmapSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    description: String,
    goal: String,
    skillLevel: String,
    steps: [stepSchema],
    progress: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Roadmap', roadmapSchema);
