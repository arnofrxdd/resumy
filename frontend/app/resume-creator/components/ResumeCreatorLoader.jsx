"use client";

import React, { useState, useEffect } from 'react';
import ResumyLogo from './Logo';
import { motion, AnimatePresence } from 'framer-motion';
import { SparkleDoodle, CurvyArrowDoodle, ScribbleDoodle, StarDoodle } from '@/components/landing-redesign/DoodleAnimations';
import Image from 'next/image';

const ResumeCreatorLoader = () => {
    const [name, setName] = useState('');
    const [phase, setPhase] = useState(0); // 0: Name, 1: Formatting

    const full_name = "ALEX DEV";

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        let nameIdx = 0;
        const typeName = setInterval(() => {
            if (nameIdx <= full_name.length) {
                setName(full_name.slice(0, nameIdx));
                nameIdx++;
            } else {
                clearInterval(typeName);
                setTimeout(() => setPhase(1), 500);
            }
        }, 100);
        return () => clearInterval(typeName);
    }, []);

    if (isMobile) {
        return (
            <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center font-sans">
                <div className="relative flex flex-col items-center gap-12 text-center p-8 w-full max-w-xs">
                    {/* Simplified Mobile Icon */}
                    <motion.div
                        animate={{
                            scale: [1, 1.05, 1],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100/50 shadow-sm relative"
                    >
                        <ResumyLogo size={32} showText={false} />
                        <div className="absolute -top-1 -right-1">
                            <SparkleDoodle color="#4f46e5" className="w-5 h-5 opacity-40" />
                        </div>
                    </motion.div>

                    <div className="space-y-4 w-full">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
                            Resume <span className="text-indigo-500 italic font-serif">Creator</span>
                        </h2>

                        <div className="relative w-full h-1.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                            <motion.div
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-400 to-violet-500"
                            />
                        </div>

                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">
                            {phase === 0 ? 'Getting things ready...' : 'Applying final touches...'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center overflow-hidden font-sans">
            {/* AMBIENT BACKGROUND */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-emerald-200 blur-[80px] rounded-full" />
                <div className="absolute bottom-1/4 left-1/4 w-[250px] h-[250px] bg-teal-200 blur-[80px] rounded-full" />
            </div>

            <div className="relative flex flex-col items-center justify-center gap-16 z-10 w-full max-w-sm">

                {/* MINI COMPACT STAGE */}
                <div className="relative w-[300px] h-[320px] flex items-center justify-center">

                    {/* Background Doodles */}
                    <div className="absolute top-4 right-0 opacity-40 rotate-12 scale-125">
                        <StarDoodle color="#10B981" className="w-16 h-16" />
                    </div>
                    <div className="absolute top-1/2 -left-8 opacity-30 -rotate-12">
                        <SparkleDoodle color="#14B8A6" className="w-16 h-16" />
                    </div>

                    {/* 1. THE MINI RESUME SHEET */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative w-[220px] h-[280px] bg-white border border-slate-100 shadow-[0_20px_40px_-15px_rgba(16,185,129,0.1)] flex flex-col p-6 overflow-hidden rounded-none"
                    >
                        {/* Skeleton Header */}
                        <div className="flex flex-col gap-2">
                            <span className="text-[16px] font-black tracking-tighter text-slate-900 leading-none">
                                {name || (phase === 0 ? '' : 'ALEX DEV')}
                                {phase === 0 && <span className="w-[2px] h-3.5 bg-emerald-500 ml-1 inline-block align-middle animate-pulse rounded-none" />}
                            </span>
                            <div className="h-1 bg-slate-100 w-1/2 rounded-none" />
                        </div>

                        {/* Skeleton Body */}
                        <div className="mt-8 flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <div className="h-1.5 bg-slate-50 w-full rounded-none" />
                                <div className="h-1.5 bg-slate-50 w-[90%] rounded-none" />
                                <div className="h-1.5 bg-slate-50 w-[95%] rounded-none" />
                            </div>

                            <div className="mt-4 flex flex-col gap-2.5">
                                <div className="h-[2px] bg-emerald-100/80 w-1/3 rounded-none" />
                                <div className="h-1.5 bg-slate-50 w-full rounded-none" />
                                <div className="h-1.5 bg-slate-50 w-[85%] rounded-none" />
                            </div>
                        </div>

                        {/* Scanner Beam (Subtle Version) */}
                        {phase === 1 && (
                            <motion.div
                                animate={{ top: ['-10%', '110%', '-10%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute left-0 w-full h-8 bg-gradient-to-b from-transparent via-emerald-400/10 to-transparent z-20 pointer-events-none"
                            />
                        )}
                    </motion.div>

                    {/* 2. THE MINI EDITOR OVERLAY */}
                    <motion.div
                        initial={{ opacity: 0, x: 20, y: 10 }}
                        animate={{ opacity: 1, x: 0, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="absolute bottom-6 right-[-10px] w-[140px] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 z-20 p-4 flex flex-col gap-3 rounded-none"
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 bg-indigo-500 rounded-none animate-ping" />
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Resumy Core</span>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="h-6 bg-slate-50 border border-slate-100 rounded-none flex items-center px-3">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                                    {phase === 0 ? name : 'ALEX DEV'}
                                </span>
                            </div>
                            <div className="flex gap-1.5">
                                <div className="h-1 bg-emerald-400 flex-1 rounded-none" />
                                <div className="h-1 bg-slate-200 flex-1 rounded-none" />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* STATUS TYPOGRAPHY - MATCHING LANDING PAGE */}
                <div className="text-center flex flex-col items-center gap-4">
                    <div className="flex flex-col gap-1 relative">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
                            Resume <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500 italic font-serif relative inline-block capitalize">
                                Creator
                                <ScribbleDoodle color="#4f46e5" className="absolute -bottom-2 left-0 w-full h-4 opacity-40 rotate-[1deg]" />
                            </span>
                        </h2>

                        <div className="flex items-center justify-center gap-3 mt-4">
                            <div className="h-px bg-slate-200 flex-1 w-8" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">
                                {phase === 0 ? 'Preparing your workspace' : 'Polishing designs'}
                            </span>
                            <div className="h-px bg-slate-200 flex-1 w-8" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default ResumeCreatorLoader;
