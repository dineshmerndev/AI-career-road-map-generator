import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, LayoutDashboard, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="border-b border-white/10 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20">
                        <Compass className="text-white w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Path<span className="text-blue-500">Forge</span></span>
                </Link>

                <div className="flex items-center gap-6">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                                <LayoutDashboard size={18} />
                                <span className="hidden md:inline">Dashboard</span>
                            </Link>
                            <Link to="/generate" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-blue-500/20">
                                Create Roadmap
                            </Link>
                            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                                <span className="text-sm font-medium text-slate-300 hidden sm:inline">{user.name}</span>
                                <button 
                                    onClick={handleLogout}
                                    className="p-2 text-slate-400 hover:text-red-400 transition-colors hover:bg-red-400/10 rounded-lg"
                                    title="Logout"
                                >
                                    <LogOut size={20} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-slate-400 hover:text-white transition-colors">Login</Link>
                            <Link to="/register" className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg font-medium transition-all">Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
