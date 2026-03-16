"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileUp, Search, CheckCircle2, Sparkles } from 'lucide-react'

const ResumeImportLoader = ({ text }) => {
    const [subText, setSubText] = useState("Reading your document...")

    useEffect(() => {
        const phrases = [
            "Reading your document...",
            "Organizing your experience...",
            "Finding your best skills...",
            "Preparing your analysis...",
            "Almost ready..."
        ]
        let i = 0
        const interval = setInterval(() => {
            setSubText(phrases[i % phrases.length])
            i++
        }, 2500)
        return () => clearInterval(interval)
    }, [])

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100000] bg-white/95 backdrop-blur-2xl flex flex-col items-center justify-center overflow-hidden"
        >
            <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-8">
                {/* scanning Document Visualization */}
                <div className="relative mb-16">
                    {/* The Document */}
                    <motion.div
                        animate={{ 
                            y: [0, -5, 0],
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="w-28 h-36 bg-white border border-stone-200 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.06)] flex flex-col p-5 relative overflow-hidden"
                    >
                        {/* Mock content lines */}
                        <div className="w-10 h-2 bg-stone-100 rounded-full mb-6" />
                        <div className="space-y-3">
                            <div className="w-full h-1.5 bg-stone-50 rounded-full" />
                            <div className="w-full h-1.5 bg-stone-50 rounded-full" />
                            <div className="w-3/4 h-1.5 bg-stone-50 rounded-full" />
                        </div>
                        <div className="mt-8 space-y-3">
                            <div className="w-full h-1.5 bg-stone-50 rounded-full" />
                            <div className="w-1/2 h-1.5 bg-stone-50 rounded-full" />
                        </div>

                        {/* Professional Horizontal Scanner Line */}
                        <motion.div 
                            animate={{ 
                                top: ['0%', '100%'],
                                opacity: [0, 1, 1, 0]
                            }}
                            transition={{ 
                                duration: 3, 
                                repeat: Infinity, 
                                ease: "linear"
                            }}
                            className="absolute left-0 w-full h-[2px] bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] z-20"
                        />
                        
                        {/* Soft Glow behind scanner */}
                        <motion.div 
                            animate={{ 
                                top: ['0%', '100%'],
                                height: ['0%', '20%', '0%']
                            }}
                            transition={{ 
                                duration: 3, 
                                repeat: Infinity, 
                                ease: "linear"
                            }}
                            className="absolute left-0 w-full bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none"
                        />
                    </motion.div>

                    {/* Status Icon */}
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-stone-100"
                    >
                        <FileUp size={20} className="text-indigo-600" />
                    </motion.div>
                </div>

                {/* Typography */}
                <div className="text-center space-y-3">
                    <h2 className="text-2xl font-black text-stone-900 tracking-tight leading-tight">
                        {text || "Importing Resume"}
                    </h2>
                    
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={subText}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            className="flex items-center justify-center gap-2"
                        >
                            <span className="text-stone-400 font-bold uppercase tracking-[0.2em] text-[10px]">
                                {subText}
                            </span>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Clean Infinite Loader - Perfectly Smooth Rotation */}
                <div className="mt-10 relative">
                    <motion.svg 
                        className="w-10 h-10"
                        animate={{ rotate: 360 }}
                        transition={{ 
                            duration: 1, 
                            repeat: Infinity, 
                            ease: "linear" 
                        }}
                        style={{ willChange: "transform" }}
                    >
                        <circle
                            cx="20"
                            cy="20"
                            r="16"
                            stroke="currentColor"
                            strokeWidth="3.5"
                            fill="transparent"
                            className="text-stone-100"
                        />
                        <circle
                            cx="20"
                            cy="20"
                            r="16"
                            stroke="currentColor"
                            strokeWidth="3.5"
                            fill="transparent"
                            strokeDasharray="100.5"
                            strokeDashoffset="75"
                            strokeLinecap="round"
                            className="text-stone-900"
                        />
                    </motion.svg>
                </div>
            </div>

            {/* Subtle Footer */}
            <div className="absolute bottom-12 left-0 w-full text-center px-6">
                <p className="text-[10px] text-stone-400 font-medium tracking-wide">
                    Making your resume look great
                </p>
            </div>
        </motion.div>
    )
}

export default ResumeImportLoader
