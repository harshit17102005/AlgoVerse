import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/layout/AuthLayout';
import { useAuthStore } from '../store/useAuthStore';

export const Signup: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { signup, isLoading, error, clearError } = useAuthStore();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signup(name, email, password);
            navigate('/profile');
        } catch {
            // Error managed by the store
        }
    };

    return (
        <AuthLayout testimonialText="Algoverse changed the way I understand data structures. Visualizing code execution in real-time is a game changer!">
            <div className="w-full">
                <h2 className="text-4xl font-bold mb-2">Create Account</h2>
                <p className="text-gray-200 mb-6">Join us to master algorithms</p>

                {error && (
                    <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl relative">
                        <p className="text-sm text-rose-300/90 leading-relaxed font-inter">{error}</p>
                        <button onClick={clearError} className="absolute top-2 right-2 text-rose-400 hover:text-rose-200">
                            ×
                        </button>
                    </div>
                )}

                <form onSubmit={handleSignup} className="space-y-5 text-sm">
                    <div>
                        <label className="block text-gray-100 mb-2 ml-1">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-[#1c1c1c]/90 text-white rounded-full px-6 py-4 outline-none focus:ring-2 focus:ring-rose-400 border border-transparent focus:border-white/10 transition-all font-medium placeholder-gray-500 shadow-inner"
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-100 mb-2 ml-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-[#1c1c1c]/90 text-white rounded-full px-6 py-4 outline-none focus:ring-2 focus:ring-rose-400 border border-transparent focus:border-white/10 transition-all font-medium placeholder-gray-500 shadow-inner"
                            placeholder="johndoe@gmail.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-100 mb-2 ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-[#1c1c1c]/90 text-white rounded-full px-6 py-4 outline-none focus:ring-2 focus:ring-rose-400 border border-transparent focus:border-white/10 transition-all font-medium placeholder-gray-500 shadow-inner tracking-widest text-lg"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-rose-400 hover:bg-rose-500 text-black font-semibold rounded-full py-4 mt-8 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50 flex justify-center items-center"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        ) : (
                            "Sign up"
                        )}
                    </button>
                </form>

                <p className="text-center mt-8 text-gray-300">
                    Already have an account? <Link to="/login" className="text-white font-semibold underline decoration-rose-400/50 hover:decoration-rose-300 underline-offset-4">Sign in</Link>
                </p>
            </div>
        </AuthLayout>
    );
};
