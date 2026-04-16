import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, BookOpen, Clock, ChevronRight, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const [roadmaps, setRoadmaps] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchRoadmaps = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/roadmaps');
                setRoadmaps(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRoadmaps();
    }, []);

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                <div>
                    <h1 className="text-4xl font-bold mb-2">My Roadmaps</h1>
                    <p className="text-slate-400">Welcome back, {user?.name}! Trace your progress and continue learning.</p>
                </div>
                <Link to="/generate" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20">
                    <Plus size={20} />
                    New Roadmap
                </Link>
            </header>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-64 glass-card animate-pulse"></div>)}
                </div>
            ) : roadmaps.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roadmaps.map((roadmap) => (
                        <RoadmapCard key={roadmap._id} roadmap={roadmap} />
                    ))}
                </div>
            ) : (
                <div className="glass-card p-20 text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                        <BookOpen size={40} className="text-slate-600" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">No Roadmaps Yet</h3>
                    <p className="text-slate-400 mb-8 max-w-sm">Start by generating your first career roadmap using AI guidance.</p>
                    <Link to="/generate" className="text-blue-500 font-bold flex items-center gap-1 hover:gap-2 transition-all">
                        Create your first roadmap <ChevronRight size={20} />
                    </Link>
                </div>
            )}
        </div>
    );
};

const RoadmapCard = ({ roadmap }) => (
    <motion.div 
        whileHover={{ y: -5 }}
        className="glass-card p-6 flex flex-col h-full hover:border-blue-500/50 transition-colors"
    >
        <div className="flex justify-between items-start mb-6">
            <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                roadmap.skillLevel === 'Beginner' ? 'bg-emerald-500/10 text-emerald-500' :
                roadmap.skillLevel === 'Intermediate' ? 'bg-blue-500/10 text-blue-500' :
                'bg-purple-500/10 text-purple-500'
            }`}>
                {roadmap.skillLevel}
            </div>
            <div className="flex items-center gap-1 text-slate-500 text-sm">
                <Clock size={14} />
                <span>{new Date(roadmap.createdAt).toLocaleDateString()}</span>
            </div>
        </div>

        <h3 className="text-xl font-bold mb-2 line-clamp-1">{roadmap.title}</h3>
        <p className="text-slate-400 text-sm mb-6 line-clamp-2 flex-grow">{roadmap.description}</p>

        <div className="space-y-4">
            <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300 font-medium flex items-center gap-1">
                    <BarChart3 size={14} className="text-blue-500" /> Progress
                </span>
                <span className="text-blue-400 font-bold">{roadmap.progress}%</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-500" 
                    style={{ width: `${roadmap.progress}%` }}
                ></div>
            </div>
            
            <Link 
                to={`/roadmap/${roadmap._id}`}
                className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/5 py-3 rounded-lg font-bold transition-all mt-4"
            >
                View Details <ChevronRight size={18} />
            </Link>
        </div>
    </motion.div>
);

export default Dashboard;
