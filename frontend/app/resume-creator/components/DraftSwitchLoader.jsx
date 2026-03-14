"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Files, RefreshCcw, Layers } from 'lucide-react'

const DraftSwitchLoader = ({ text }) => {
    const [subText, setSubText] = useState("Switching projects...")

    useEffect(() => {
        const phrases = [
            "Switching projects...",
            "Loading your data...",
            "Updating the builder...",
            "Preparing the draft...",
            "Syncing changes..."
        ]
        let i = 0
        const interval = setInterval(() => {
            setSubText(phrases[i % phrases.length])
            i++
        }, 2000)
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
                {/* Paper Shuffling Animation */}
                <div className="relative w-24 h-32 mb-16">
                    {/* Bottom Sheet */}
                    <motion.div 
                        animate={{ 
                            y: [0, 5, 0],
                            rotateZ: [-2, -2, -2],
                            opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute inset-x-2 inset-y-0 bg-stone-100 border border-stone-200 rounded-lg shadow-sm"
                    />
                    
                    {/* Middle Sheet */}
                    <motion.div 
                        animate={{ 
                            y: [0, -3, 0],
                            rotateZ: [2, 2, 2],
                            opacity: [0.6, 0.8, 0.6]
                        }}
                        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                        className="absolute inset-x-1 inset-y-1 bg-stone-50 border border-stone-100 rounded-lg shadow-sm"
                    />

                    {/* Top Sheet (The one that "switches") */}
                    <motion.div
                        animate={{ 
                            y: [0, -15, 0],
                            x: [0, 10, 0],
                            rotateZ: [0, 5, 0]
                        }}
                        transition={{ 
                            duration: 2.5, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                        }}
                        className="absolute inset-0 bg-white border border-stone-200 rounded-lg shadow-xl flex items-center justify-center"
                    >
                        <RefreshCcw size={24} className="text-stone-300 animate-spin" style={{ animationDuration: '3s' }} />
                    </motion.div>

                    {/* Mini Floating Badges */}
                    <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-4 -right-4 w-10 h-10 bg-indigo-600 rounded-xl shadow-lg flex items-center justify-center text-white"
                    >
                        <Files size={18} />
                    </motion.div>
                </div>

                {/* Typography */}
                <div className="text-center space-y-3">
                    <h2 className="text-2xl font-black text-stone-900 tracking-tight leading-tight">
                        {text || "Loading Draft"}
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

                {/* Infinite Pulse Indicator */}
                <div className="mt-10 flex gap-1.5">
                    {[0, 1, 2].map(i => (
                        <motion.div
                            key={i}
                            animate={{ 
                                scale: [1, 1.5, 1],
                                opacity: [0.3, 1, 0.3]
                            }}
                            transition={{ 
                                duration: 1, 
                                repeat: Infinity, 
                                delay: i * 0.2 
                            }}
                            className="w-2 h-2 bg-stone-900 rounded-full"
                        />
                    ))}
                </div>
            </div>

            {/* Subtle Footer */}
            <div className="absolute bottom-12 left-0 w-full text-center px-6">
                <p className="text-[10px] text-stone-400 font-medium tracking-wide">
                    Almost there...
                </p>
            </div>
        </motion.div>
    )
}

export default DraftSwitchLoader
