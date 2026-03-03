import React from 'react';
import { ArrowLeft, User, Edit3, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { motion } from 'framer-motion';

export const Profile: React.FC = () => {
    const { user, isAuthenticated, logout, updateProfile } = useAuthStore();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = React.useState(false);
    const [newName, setNewName] = React.useState(user?.name || '');
    const [isSaving, setIsSaving] = React.useState(false);

    const handleSignOut = () => {
        logout();
        navigate('/');
    };

    const handleSave = async () => {
        if (!user?._id || !newName.trim()) return;
        setIsSaving(true);
        try {
            await updateProfile(user._id, newName);
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update profile', error);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="h-screen w-full text-zinc-100 font-inter flex flex-col items-center justify-center p-4 relative z-10 overflow-y-auto custom-scrollbar"
            >
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <User className="w-8 h-8 text-zinc-500" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Guest Access</h2>
                    <p className="text-zinc-400 mb-8 leading-relaxed">You need to be signed in to view and manage your academic profile, view your global ranking, and track your streaks.</p>
                    <div className="flex flex-col sm:flex-row shadow-lg gap-4 justify-center">
                        <Link to="/login" className="px-8 bg-zinc-100 text-black font-semibold py-3 rounded-xl hover:bg-white transition-colors">
                            Sign In
                        </Link>
                        <Link to="/" className="px-8 bg-zinc-900 border border-zinc-800 text-zinc-300 font-semibold py-3 rounded-xl hover:bg-zinc-800 transition-colors">
                            Back to Visualizer
                        </Link>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="h-screen w-full text-zinc-100 font-inter font-sans overflow-y-auto custom-scrollbar pb-12 relative z-10"
        >
            {/* Navigation Header */}
            <header className="sticky top-0 z-50 bg-black/20 backdrop-blur-3xl border-b border-white/5 px-8 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back to Visualizer</span>
                </Link>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-rose-400 p-[2px]">
                        <div className="w-full h-full bg-[#121212] rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-rose-300" />
                        </div>
                    </div>
                    <span className="font-semibold tracking-wide">{user?.name || 'User'}</span>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12 space-y-8 text-sm">

                {/* Top Section - Intro Card */}
                <div className="relative overflow-hidden rounded-[2rem] bg-black/20 border border-white/5 p-8 backdrop-blur-3xl group transition-all">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-purple-500/20 transition-all duration-700"></div>

                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                        <div className="w-32 h-32 shrink-0 rounded-[2rem] bg-gradient-to-br from-indigo-500 via-purple-500 to-rose-400 p-1 shadow-2xl shadow-purple-900/20">
                            <div className="w-full h-full bg-[#1c1c1c] rounded-[1.75rem] flex items-center justify-center overflow-hidden">
                                <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name || 'User'}&backgroundColor=1c1c1c`} alt="avatar" className="w-full h-full object-cover scale-110" />
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex justify-center md:justify-between items-start mb-2">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="text-4xl font-bold tracking-tight text-white mb-2 md:mb-0 bg-white/5 border border-white/20 rounded-lg px-2 py-1 outline-none focus:border-purple-500 w-full md:w-auto"
                                        autoFocus
                                    />
                                ) : (
                                    <h1 className="text-4xl font-bold tracking-tight text-white mb-2 md:mb-0">{user?.name || 'User'}</h1>
                                )}
                                <button
                                    onClick={() => {
                                        if (isEditing) {
                                            handleSave();
                                        } else {
                                            setIsEditing(true);
                                            setNewName(user?.name || '');
                                        }
                                    }}
                                    disabled={isSaving}
                                    className="hidden md:flex p-2 bg-zinc-800/50 hover:bg-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-colors"
                                >
                                    <Edit3 className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-lg text-rose-400 font-medium mb-4">Software Engineer</p>
                            <p className="text-zinc-400 leading-relaxed max-w-2xl mx-auto md:mx-0 text-base">
                                Passionate about algorithms, system design, and creating beautiful user interfaces. Constant learner and open-source contributor.
                            </p>

                            <div className="mt-6 flex justify-center md:justify-start gap-3">
                                <button
                                    onClick={() => {
                                        if (isEditing) {
                                            handleSave();
                                        } else {
                                            setIsEditing(true);
                                            setNewName(user?.name || '');
                                        }
                                    }}
                                    disabled={isSaving}
                                    className="px-8 bg-white text-black font-semibold py-3 flex items-center justify-center rounded-xl shadow-lg hover:bg-zinc-200 transition-colors"
                                >
                                    {isSaving ? 'Saving...' : (isEditing ? 'Save Profile' : 'Edit Profile')}
                                </button>
                                <button onClick={handleSignOut} className="px-6 bg-rose-500/10 text-rose-400 font-semibold py-3 flex items-center justify-center rounded-xl shadow-lg hover:bg-rose-500/20 border border-rose-500/20 transition-colors gap-2">
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>



                {/* History / Activity Panel */}
                <div className="bg-black/20 backdrop-blur-3xl border border-white/5 rounded-[2rem] p-8 lg:p-12">
                    <h3 className="text-2xl font-semibold text-white mb-8 border-b border-white/5 pb-5">Recent Activity</h3>

                    <div className="space-y-8">
                        {[
                            { title: 'Completed Dijkstra\'s Algorithm', time: '2 hours ago', type: 'algo', color: 'emerald' },
                            { title: 'Mastered Binary Search Tree Traversal', time: 'Yesterday', type: 'ds', color: 'purple' },
                            { title: 'Reached 120 days streak!', time: '2 days ago', type: 'achieve', color: 'amber' },
                            { title: 'Reviewed Dynamic Programming Concepts', time: '4 days ago', type: 'study', color: 'blue' }
                        ].map((activity, i) => (
                            <div key={i} className="flex gap-6 group">
                                <div className="flex flex-col items-center">
                                    <div className={`w-4 h-4 rounded-full bg-${activity.color}-400 shadow-[0_0_12px_rgba(0,0,0,0.5)] shadow-${activity.color}-500/50 mt-1 ring-[6px] ring-zinc-950`}></div>
                                    {i !== 3 && <div className="w-[3px] h-full bg-zinc-800 mt-3 group-hover:bg-zinc-700 transition-colors"></div>}
                                </div>
                                <div className="pb-8">
                                    <p className="text-zinc-100 font-semibold text-lg mb-1">{activity.title}</p>
                                    <p className="text-zinc-500 text-sm">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </main>
        </motion.div>
    );
};

