"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, FileText, Search, Cpu, Database, Check } from 'lucide-react'
import { StarDoodle, SparkleDoodle, ScribbleDoodle, BoxDoodle, UnderlineDoodle } from '@/components/landing-redesign/DoodleAnimations'

const FunLoader = ({ text }) => {
    const [subText, setSubText] = useState("Initializing AI Engine...")

    useEffect(() => {
        const subTexts = [
            "Deconstructing PDF layers...",
            "Mapping professional nodes...",
            "Identifying hidden strengths...",
            "Optimizing semantic structure...",
            "Finalizing digital twin...",
            "Polishing experience tokens..."
        ]
        let i = 0
        const interval = setInterval(() => {
            setSubText(subTexts[i % subTexts.length])
            i++
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-white/90 backdrop-blur-xl flex flex-col items-center justify-center overflow-hidden"
        >
            {/* Background Doodles */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-1/4 left-1/4 opacity-10"
                >
                    <StarDoodle color="#8B5CF6" className="w-32 h-32" />
                </motion.div>
                <motion.div
                    animate={{ y: [0, -20, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-1/4 right-1/4 opacity-10"
                >
                    <BoxDoodle color="#10B981" className="w-40 h-40" />
                </motion.div>
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 right-1/3 opacity-10"
                >
                    <SparkleDoodle color="#F59E0B" className="w-24 h-24" />
                </motion.div>
            </div>

            {/* Central Animation */}
            <div className="relative z-10 flex flex-col items-center">
                {/* Resume Icon with Scanning Effect */}
                <div className="relative w-32 h-44 mb-12">
                    {/* The "Resume" Card */}
                    <motion.div
                        animate={{
                            y: [0, -10, 0],
                            rotateZ: [-1, 1, -1]
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="w-full h-full bg-stone-900 rounded-xl shadow-2xl flex flex-col p-4 relative overflow-hidden"
                    >
                        {/* Mock Content */}
                        <div className="w-12 h-2 bg-stone-700 rounded-full mb-3" />
                        <div className="space-y-2">
                            <div className="w-full h-1.5 bg-stone-800 rounded-full" />
                            <div className="w-4/5 h-1.5 bg-stone-800 rounded-full" />
                            <div className="w-full h-1.5 bg-stone-800 rounded-full" />
                        </div>
                        <div className="mt-8 space-y-2">
                            <div className="w-full h-1.5 bg-stone-800 rounded-full" />
                            <div className="w-3/4 h-1.5 bg-stone-800 rounded-full" />
                        </div>

                        {/* Scanner Bar */}
                        <motion.div
                            animate={{ top: ['-10%', '110%'] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-violet-400 to-transparent shadow-[0_0_15px_rgba(139,92,246,0.8)] z-20"
                        />

                        {/* Glow effect behind scanner */}
                        <motion.div
                            animate={{ opacity: [0, 0.5, 0] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 bg-violet-500/10 z-10"
                        />
                    </motion.div>

                    {/* Surrounding Floating Icons */}
                    <motion.div
                        animate={{ x: [0, 15, 0], y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute -top-6 -right-6 w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 rotate-12"
                    >
                        <Cpu size={20} />
                    </motion.div>
                    <motion.div
                        animate={{ x: [0, -15, 0], y: [0, 10, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute -bottom-4 -left-8 w-14 h-14 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-rose-200 -rotate-12"
                    >
                        <Database size={24} />
                    </motion.div>
                </div>

                {/* Text Content */}
                <div className="text-center space-y-4 px-6 max-w-md">
                    <motion.div
                        key={text}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative inline-block"
                    >
                        <h2 className="text-3xl font-black text-stone-900 tracking-tighter mb-2">
                            {text}
                        </h2>
                        <motion.div
                            className="absolute -bottom-1 left-0 w-full h-3 -z-10 opacity-30"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 1 }}
                        >
                            <UnderlineDoodle color="#8B5CF6" className="w-full h-full" />
                        </motion.div>
                    </motion.div>

                    <AnimatePresence mode="wait">
                        <motion.p
                            key={subText}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="text-stone-500 font-bold tracking-wide text-sm uppercase flex items-center justify-center gap-2"
                        >
                            <Sparkles size={14} className="text-amber-400 animate-pulse" />
                            {subText}
                        </motion.p>
                    </AnimatePresence>
                </div>

                {/* Fun Scribble below everything */}
                <div className="mt-12 opacity-40">
                    <ScribbleDoodle color="#10B981" className="w-24 h-6" />
                </div>
            </div>

            {/* Bottom Progress Bar (Visual only) */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-64 h-2 bg-stone-100 rounded-full overflow-hidden">
                <motion.div
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-1/2 h-full bg-gradient-to-r from-transparent via-violet-600 to-transparent"
                />
            </div>
        </motion.div>
    )
}

export default FunLoader
