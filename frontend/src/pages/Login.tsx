import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/layout/AuthLayout';
import { useAuthStore } from '../store/useAuthStore';

export const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login, isLoading, error, clearError } = useAuthStore();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/profile');
        } catch {
            // Error is handled by the store and displayed below
        }
    };

    return (
        <AuthLayout>
            <div className="w-full">
                <h2 className="text-4xl font-bold mb-2">Welcome back</h2>
                <p className="text-gray-200 mb-6">Please Enter your Account details</p>

                {error && (
                    <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl relative">
                        <p className="text-sm text-rose-300/90 leading-relaxed font-inter">{error}</p>
                        <button onClick={clearError} className="absolute top-2 right-2 text-rose-400 hover:text-rose-200">
                            ×
                        </button>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6 text-sm">
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

                    <div className="flex items-center justify-between px-2 pt-2 pb-6">
                        <label className="flex items-center text-gray-200 cursor-pointer group">
                            <input type="checkbox" className="hidden" />
                            <div className="w-4 h-4 rounded border border-gray-400 mr-2 flex items-center justify-center group-hover:border-rose-300 transition-colors">
                                <div className="w-2 h-2 rounded-sm bg-rose-400 hidden group-hover:block"></div>
                            </div>
                            <span className="text-sm">Keep me logged in</span>
                        </label>
                        <a href="#" className="text-rose-200 hover:text-white transition-colors underline decoration-rose-300/50 underline-offset-4">Forgot Password</a>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-rose-400 hover:bg-rose-500 text-black font-semibold rounded-full py-4 transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50 flex justify-center items-center"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        ) : (
                            "Sign in"
                        )}
                    </button>
                </form>

                <p className="text-center mt-8 text-gray-300">
                    Don't have an account? <Link to="/signup" className="text-white font-semibold underline decoration-rose-400/50 hover:decoration-rose-300 underline-offset-4">Sign up</Link>
                </p>
            </div>
        </AuthLayout>
    );
};
