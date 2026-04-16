import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ChevronLeft, CheckCircle2, Circle, ExternalLink, Video, FileText, Globe, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const RoadmapView = () => {
    const { id } = useParams();
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchRoadmap = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/roadmaps/${id}`);
            setRoadmap(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoadmap();
    }, [id]);

    const toggleStep = async (index, isCompleted) => {
        try {
            const res = await axios.patch('http://localhost:5000/api/roadmaps/progress', {
                roadmapId: id,
                stepIndex: index,
                isCompleted: !isCompleted
            });
            setRoadmap(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400">Loading your roadmap...</p>
        </div>
    );

    if (!roadmap) return (
        <div className="max-w-4xl mx-auto py-20 text-center">
            <h2 className="text-2xl font-bold mb-4">Roadmap not found</h2>
            <Link to="/dashboard" className="text-blue-500 hover:underline">Return to Dashboard</Link>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors group">
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Back to Dashboard
            </Link>

            <div className="glass-card p-10 mb-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Trophy size={120} className="text-yellow-500" />
                </div>
                <div className="relative z-10">
                    <h1 className="text-4xl font-bold mb-4">{roadmap.title}</h1>
                    <p className="text-slate-400 text-lg mb-8 max-w-2xl">{roadmap.description}</p>
                    
                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                        <div className="flex-grow w-full">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-bold text-slate-300">Overall Progress</span>
                                <span className="font-bold text-blue-500">{roadmap.progress}%</span>
                            </div>
                            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${roadmap.progress}%` }}
                                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-500"
                                ></motion.div>
                            </div>
                        </div>
                        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                            <span className="text-slate-400 text-sm block">Target</span>
                            <span className="font-bold">{roadmap.goal}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {roadmap.steps.map((step, index) => (
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        key={index}
                        className={`glass-card p-6 border-l-4 transition-all ${
                            step.isCompleted ? 'border-l-emerald-500 opacity-80' : 'border-l-blue-600'
                        }`}
                    >
                        <div className="flex items-start gap-5">
                            <button 
                                onClick={() => toggleStep(index, step.isCompleted)}
                                className={`mt-1 transition-colors ${step.isCompleted ? 'text-emerald-500' : 'text-slate-600 hover:text-blue-500'}`}
                            >
                                {step.isCompleted ? <CheckCircle2 size={28} /> : <Circle size={28} />}
                            </button>
                            
                            <div className="flex-grow">
                                <h3 className={`text-xl font-bold mb-2 ${step.isCompleted ? 'line-through text-slate-500' : ''}`}>
                                    {step.title}
                                </h3>
                                <p className="text-slate-400 mb-6 leading-relaxed">{step.description}</p>
                                
                                {step.resources && step.resources.length > 0 && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {step.resources.map((res, ridx) => (
                                            <a 
                                                key={ridx}
                                                href={res.url.startsWith('http') ? res.url : `https://www.google.com/search?q=${res.title}+${roadmap.goal}+learning`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 p-3 rounded-lg border border-white/5 transition-all group"
                                            >
                                                <div className="text-blue-400">
                                                    {res.type === 'video' ? <Video size={18} /> : 
                                                     res.type === 'documentation' ? <FileText size={18} /> : 
                                                     <Globe size={18} />}
                                                </div>
                                                <span className="text-sm font-medium truncate flex-grow">{res.title}</span>
                                                <ExternalLink size={14} className="text-slate-600 group-hover:text-white transition-colors" />
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default RoadmapView;
