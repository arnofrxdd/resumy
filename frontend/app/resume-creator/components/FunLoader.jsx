"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Sparkles, Layout, Palette, PenTool } from 'lucide-react'

const FunLoader = ({ text }) => {
    const [subText, setSubText] = useState("Making everything perfect...")
    const [templateType, setTemplateType] = useState('modern')

    useEffect(() => {
        const simplePhrases = [
            "Making it look great...",
            "Polishing the design...",
            "Cleaning up the layout...",
            "Organizing your info...",
            "Adding the finishing touches...",
            "Almost ready for you..."
        ]
        const templates = ['modern', 'classic', 'creative', 'executive']
        let i = 0
        const interval = setInterval(() => {
            setSubText(simplePhrases[i % simplePhrases.length])
            setTemplateType(templates[i % templates.length])
            i++
        }, 2500)
        return () => clearInterval(interval)
    }, [])

    const getThemeColor = () => {
        switch (templateType) {
            case 'creative': return '#059669'
            case 'modern': return '#1e293b'
            case 'executive': return '#0f172a'
            default: return '#444'
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100000] bg-white/95 backdrop-blur-2xl flex flex-col items-center justify-center overflow-hidden"
        >
            {/* Soft Ambient Background Glows */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-50/50 blur-[120px] rounded-full" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-emerald-50/50 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 flex flex-col items-center max-w-sm w-full px-8">
                {/* Hero-Art Style Visualization - Perfectly Swapping Templates */}
                <div className="relative w-36 aspect-[1/1.414] mb-12" style={{ perspective: '1200px' }}>
                    
                    {/* Main Resume Sheet */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={templateType}
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.05, y: -10 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            className="absolute inset-0 bg-white shadow-[0_15px_40px_rgba(0,0,0,0.08)] border border-stone-200 flex flex-col p-4 overflow-hidden rounded-md"
                        >
                            {/* Executive Header Bar */}
                            {templateType === 'executive' && (
                                <div className="absolute top-0 left-0 w-full h-8 bg-slate-900" />
                            )}

                            <div className="relative z-10 space-y-3">
                                {/* Skeleton Header */}
                                <div className={`space-y-1.5 pt-1 ${templateType === 'classic' ? 'text-center border-b pb-3' : ''}`}>
                                    <div className={`h-2.5 w-2/3 rounded-full ${templateType === 'executive' ? 'bg-white/20' : 'bg-stone-200'} ${templateType === 'classic' ? 'mx-auto' : ''}`} />
                                    <div className={`h-1 w-1/3 rounded-full ${templateType === 'executive' ? 'bg-white/10' : 'bg-stone-100'} ${templateType === 'classic' ? 'mx-auto' : ''}`} />
                                </div>

                                {/* Body Content */}
                                <div className="space-y-4 pt-2">
                                    <div className="space-y-1.5">
                                        <div className="h-[1px] w-full bg-stone-100" />
                                        <div className="space-y-1">
                                            <div className="h-1 w-full bg-stone-50 rounded-full" />
                                            <div className="h-1 w-full bg-stone-50 rounded-full" />
                                            <div className="h-1 w-3/4 bg-stone-50 rounded-full" />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="h-[1px] w-full bg-stone-100" />
                                        <div className="space-y-1">
                                            <div className="h-1 w-full bg-stone-50 rounded-full" />
                                            <div className="h-1 w-[80%] bg-stone-50 rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Indicator */}
                            {(templateType === 'creative' || templateType === 'modern') && (
                                <div className={`absolute top-0 right-0 w-12 h-full p-2.5 space-y-4 ${templateType === 'creative' ? 'bg-emerald-600' : 'bg-slate-800'}`}>
                                    <div className="w-5 h-5 bg-white/10" />
                                    <div className="space-y-1.5">
                                        <div className="h-1 w-full bg-white/20 rounded-full" />
                                        <div className="h-1 w-full bg-white/20 rounded-full" />
                                        <div className="h-1 w-full bg-white/20 rounded-full" />
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Floating Editor Box */}
                    <motion.div
                        className="absolute -bottom-4 -right-10 w-28 z-20"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="bg-white shadow-[0_15px_30px_rgba(0,0,0,0.12)] border border-stone-100 flex flex-col overflow-hidden rounded-sm">
                            <div className="px-2 py-1.5 border-b border-stone-50 flex items-center justify-between" style={{ background: `${getThemeColor()}08` }}>
                                <span className="font-black text-[6px] uppercase tracking-widest" style={{ color: getThemeColor() }}>EDITOR</span>
                                <div className="w-1 h-1 rounded-full animate-pulse" style={{ background: getThemeColor() }} />
                            </div>
                            <div className="p-2 space-y-1.5 bg-white">
                                <div className="h-2.5 bg-stone-50 border border-stone-100 flex items-center px-1.5">
                                    <div className="h-0.5 w-1/2 bg-stone-200" />
                                </div>
                                <div className="h-2.5 bg-stone-50 border border-stone-100 flex items-center px-1.5">
                                    <div className="h-0.5 w-3/4 bg-stone-200" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                    
                    {/* Subtle Pulsing Shadow */}
                    <motion.div 
                        animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-20 h-4 bg-stone-900/10 blur-lg rounded-full -z-10"
                    />
                </div>

                {/* Typography: Professional & Clean */}
                <div className="text-center space-y-3">
                    <h2 className="text-2xl font-black text-stone-900 tracking-tight leading-tight">
                        {text || "Getting Started"}
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

            {/* Mobile Footer Message (Subtle) */}
            <div className="absolute bottom-12 left-0 w-full text-center px-6">
                <p className="text-[10px] text-stone-400 font-medium tracking-wide">
                    This usually takes a few seconds
                </p>
            </div>
        </motion.div>
    )
}

export default FunLoader
