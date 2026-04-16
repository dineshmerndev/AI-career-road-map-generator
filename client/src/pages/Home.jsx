import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Target, Zap, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center pt-12 text-center">
            {/* Hero Section */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl px-4"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                    <Zap size={14} />
                    <span>AI-Powered Career Guidance</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight">
                    Forge Your <span className="gradient-text">Dream Career</span> with Precision
                </h1>
                <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Stop feeling overwhelmed. Generate a personalized, step-by-step roadmap to your career goals with curated resources and progress tracking.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/generate" className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-xl shadow-blue-500/25">
                        Get Started for Free <ArrowRight size={20} />
                    </Link>
                    <Link to="/register" className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all backdrop-blur-sm">
                        Create Account
                    </Link>
                </div>
            </motion.div>

            {/* Features Section */}
            <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-4">
                <FeatureCard 
                    icon={<Compass className="text-blue-500" />}
                    title="Personalized Paths"
                    description="AI-generated roadmaps tailored specifically to your current level and unique career goals."
                />
                <FeatureCard 
                    icon={<Target className="text-purple-500" />}
                    title="Curated Resources"
                    description="The best YouTube videos, documentation, and courses for every single step of your journey."
                />
                <FeatureCard 
                    icon={<CheckCircle className="text-emerald-500" />}
                    title="Track Progress"
                    description="Stay motivated by checking off completed steps and visualizing your growth in real-time."
                />
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="glass-card p-8 flex flex-col items-center text-center hover:translate-y-[-5px] transition-transform duration-300">
        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
);

export default Home;
