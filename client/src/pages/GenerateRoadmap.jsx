import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Sparkles, ArrowRight, Loader2, Brain, Target, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const GenerateRoadmap = () => {
    const [formData, setFormData] = useState({
        goal: '',
        skillLevel: 'Beginner',
        interests: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/roadmaps/generate', formData);
            navigate(`/roadmap/${res.data._id}`);
        } catch (err) {
            console.error(err);
            alert('Failed to generate roadmap. Check console.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center mb-12"
            >
                <div className="w-20 h-20 bg-blue-600/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-blue-500/30">
                    <Sparkles className="text-blue-500 w-10 h-10" />
                </div>
                <h1 className="text-4xl font-bold mb-4">Start Your Journey</h1>
                <p className="text-slate-400 text-lg">Tell us your goals and our AI will build a custom path for you.</p>
            </motion.div>

            <form onSubmit={handleSubmit} className="glass-card p-10 space-y-8 shadow-2xl relative overflow-hidden">
                <div className="space-y-6">
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3 ml-1">
                            <Target size={16} className="text-blue-500" />
                            What is your career goal?
                        </label>
                        <input 
                            type="text"
                            required
                            placeholder="e.g. Full Stack Developer, Data Scientist..."
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-4 px-5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all text-lg"
                            value={formData.goal}
                            onChange={(e) => setFormData({...formData, goal: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3 ml-1">
                            <Star size={16} className="text-yellow-500" />
                            Current Skill Level
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                                <button
                                    key={level}
                                    type="button"
                                    onClick={() => setFormData({...formData, skillLevel: level})}
                                    className={`py-3 rounded-xl border font-medium transition-all ${
                                        formData.skillLevel === level 
                                        ? 'bg-blue-600 border-blue-500 text-white' 
                                        : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                    }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-3 ml-1">
                            <Brain size={16} className="text-purple-500" />
                            Interests / Specializations (Optional)
                        </label>
                        <textarea 
                            placeholder="e.g. React, Python, Web3, FinTech..."
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-4 px-5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all min-h-[100px]"
                            value={formData.interests}
                            onChange={(e) => setFormData({...formData, interests: e.target.value})}
                        />
                    </div>
                </div>

                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-5 rounded-2xl transition-all shadow-xl shadow-blue-500/25 flex items-center justify-center gap-3 text-xl group"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin" size={24} />
                            Generating your path...
                        </>
                    ) : (
                        <>
                            Generate Roadmap <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>

                {loading && (
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center z-10">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                        <h3 className="text-2xl font-bold mb-2">Analyzing Data...</h3>
                        <p className="text-slate-400">Our AI is researching local resources and structuring your perfect learning path.</p>
                    </div>
                )}
            </form>
        </div>
    );
};

export default GenerateRoadmap;
