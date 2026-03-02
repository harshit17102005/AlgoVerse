import React from 'react';


interface AuthLayoutProps {
    children: React.ReactNode;
    testimonialText?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
    children,
    testimonialText = "Search and find your dream job is now easier than ever. Just browse a job and apply if you need to."
}) => {
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 font-inter relative z-10">
            {/* Main Glass Container */}
            <div className="flex w-full max-w-6xl h-[700px] bg-black/30 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] overflow-hidden border border-white/10">

                {/* Left Side (Form) */}
                <div className="w-1/2 p-12 flex flex-col justify-center relative">
                    <div className="absolute top-12 left-12 flex items-center gap-2">
                        <div className="flex items-center text-white">
                            <span className="w-2 h-8 bg-orange-500 rounded-full mr-1 rotate-12"></span>
                            <span className="w-2 h-8 bg-white rounded-full -rotate-12"></span>
                        </div>
                    </div>
                    <div className="max-w-md w-full mx-auto text-white mt-12">
                        {children}
                    </div>
                </div>

                {/* Right Side (Platform Info Block) */}
                <div className="w-1/2 p-4 hidden md:block">
                    <div className="w-full h-full bg-white/5 border border-white/10 rounded-[2rem] p-12 flex flex-col justify-between relative overflow-hidden backdrop-blur-md">
                        {/* Ambient glows inside dark box */}
                        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/30 rounded-full blur-[100px]"></div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px]"></div>

                        <div className="relative z-10 text-white mt-8 flex flex-col h-full justify-center">
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.3)]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M12 5l7 7-7 7-7-7 7-7z" /><path d="M12 22V12" /></svg>
                                </div>
                                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400">AlgoVerse</h2>
                            </div>

                            <h1 className="text-5xl font-semibold leading-tight mb-8 tracking-tight">
                                Visualize your<br />code execution.
                            </h1>

                            <p className="text-lg text-gray-300 mb-12 max-w-md leading-relaxed">
                                {testimonialText}
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-gray-300">
                                    <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400">✓</div>
                                    <span>Interactive 3D Visualizations</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400">✓</div>
                                    <span>Step-by-step Execution</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">✓</div>
                                    <span>AI-Powered Explanations</span>
                                </div>
                            </div>
                        </div>

                        {/* Starburst icon decor */}
                        <div className="absolute bottom-12 right-12 text-indigo-400/40">
                            <svg width="180" height="180" viewBox="0 0 100 100" className="animate-pulse duration-3000">
                                <path d="M50 0 L55 45 L100 50 L55 55 L50 100 L45 55 L0 50 L45 45 Z" fill="currentColor" />
                                <path d="M15 15 L45 45 M85 15 L55 45 M85 85 L55 55 M15 85 L45 55" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
