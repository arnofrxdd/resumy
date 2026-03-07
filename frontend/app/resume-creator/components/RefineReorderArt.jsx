"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GripVertical, Sparkles, MousePointer2, Palette, Space, Mail, Phone, MapPin, Globe, Wand2, CheckCircle2 } from 'lucide-react'

const RefineReorderArt = () => {
    const [sections, setSections] = useState(['summary', 'experience', 'education'])
    const [activeSection, setActiveSection] = useState(null)
    const [accentColor, setAccentColor] = useState('#7C3AED') // Violet
    const [spacing, setSpacing] = useState(24)
    const [phase, setPhase] = useState('reorder') // 'reorder' | 'style'
    const [showStyleMenu, setShowStyleMenu] = useState(false)

    useEffect(() => {
        let isCancelled = false
        const runSimulation = async () => {
            while (!isCancelled) {
                // PHASE 1: REORDER (DRAGGING IN RESUME)
                setPhase('reorder')
                setShowStyleMenu(false)
                setSections(['summary', 'experience', 'education'])
                setSpacing(24)
                await new Promise(r => setTimeout(r, 1000))

                // Drag Experience to Top
                setActiveSection('experience')
                await new Promise(r => setTimeout(r, 800))
                setSections(['experience', 'summary', 'education'])
                await new Promise(r => setTimeout(r, 1200))
                setActiveSection(null)

                // Drag Education to Middle
                await new Promise(r => setTimeout(r, 800))
                setActiveSection('education')
                await new Promise(r => setTimeout(r, 800))
                setSections(['experience', 'education', 'summary'])
                await new Promise(r => setTimeout(r, 1200))
                setActiveSection(null)

                // PHASE 2: MAGIC STYLES
                await new Promise(r => setTimeout(r, 800))
                setPhase('style')
                await new Promise(r => setTimeout(r, 500))
                setShowStyleMenu(true)

                // Cycle Colors
                await new Promise(r => setTimeout(r, 1200))
                setAccentColor('#10B981') // Emerald
                await new Promise(r => setTimeout(r, 1200))
                setAccentColor('#F59E0B') // Amber

                // Adjust Spacing
                await new Promise(r => setTimeout(r, 1200))
                setSpacing(40)
                await new Promise(r => setTimeout(r, 1200))
                setSpacing(24)

                await new Promise(r => setTimeout(r, 3000))
            }
        }
        runSimulation()
        return () => { isCancelled = true }
    }, [])

    return (
        <div className="relative w-full h-[600px] flex items-center justify-center bg-transparent scale-[0.7] lg:scale-[0.85] transition-transform duration-700">
            {/* AMBIENT GLOW */}
            <div className="absolute inset-0 bg-violet-400/5 blur-[120px] rounded-full" />

            <div className="relative flex flex-col items-center gap-8 w-full max-w-2xl px-8">

                {/* 1. THE ACTION HUD */}
                <motion.div
                    className="flex items-center gap-6 bg-white border border-stone-100 shadow-xl px-6 py-4 rounded-2xl z-50"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    <div className="flex items-center gap-2 pr-6 border-r border-stone-100">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${phase === 'reorder' ? 'bg-stone-900 text-white' : 'bg-stone-50 text-stone-300'}`}>
                            <GripVertical size={16} />
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${phase === 'reorder' ? 'text-stone-900' : 'text-stone-300'}`}>Rearrange</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${phase === 'style' ? 'bg-violet-600 text-white' : 'bg-stone-50 text-stone-300'}`}>
                            <Palette size={16} />
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${phase === 'style' ? 'text-stone-900' : 'text-stone-300'}`}>Live Styling</span>
                    </div>
                </motion.div>

                {/* 2. THE INTERACTIVE RESUME AREA */}
                <div className="relative">
                    {/* STYLE APPLET */}
                    <AnimatePresence>
                        {showStyleMenu && (
                            <motion.div
                                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 50, scale: 0.9 }}
                                className="absolute -right-[200px] top-0 w-[240px] bg-white border border-stone-100 shadow-2xl rounded-2xl p-6 z-[60] flex flex-col gap-6"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-stone-900">Theme</span>
                                        <Palette size={14} className="text-stone-300" />
                                    </div>
                                    <div className="flex gap-3">
                                        {['#7C3AED', '#10B981', '#F59E0B'].map(c => (
                                            <div key={c} className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${accentColor === c ? 'scale-110 border-stone-900 ring-4 ring-stone-50' : 'border-transparent opacity-60'}`} style={{ backgroundColor: c }} />
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4 pt-5 border-t border-stone-50">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-stone-900">Layout Spacing</span>
                                        <Space size={14} className="text-stone-300" />
                                    </div>
                                    <div className="h-1.5 w-full bg-stone-100 rounded-full relative">
                                        <motion.div
                                            className="absolute top-1/2 -translate-y-1/2 h-5 w-5 bg-white border border-stone-200 shadow-md rounded-full"
                                            animate={{ left: spacing === 24 ? '25%' : '75%' }}
                                        />
                                    </div>
                                </div>

                                <div className="mt-2 flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 py-2.5 rounded-xl border border-emerald-100">
                                    <Sparkles size={12} className="animate-pulse" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Aesthetics Applied</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ACTUAL DETAILED RESUME */}
                    <motion.div
                        className="relative w-[500px] h-[600px] bg-white border border-stone-100 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] rounded-sm overflow-hidden flex flex-col z-10"
                    >
                        {/* EXECUTIVE HEADER */}
                        <div className="relative p-10 bg-stone-900 text-white overflow-hidden">
                            {/* Accent indicator */}
                            <motion.div
                                className="absolute left-0 top-0 bottom-0 w-2"
                                animate={{ backgroundColor: accentColor }}
                            />

                            <div className="flex justify-between items-start relative z-10">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Alex Daniel</h1>
                                    <div className="flex items-center gap-3">
                                        <div className="h-[1px] w-8 bg-white/20" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Principal Engineer</p>
                                    </div>
                                </div>
                                <div className="p-3 bg-white/5 rounded-none border border-white/10">
                                    <Sparkles className="w-6 h-6 text-white/20" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/5 opacity-60">
                                <div className="flex items-center gap-2 text-[9px] font-bold">
                                    <Mail size={12} /> alex@resumy.io
                                </div>
                                <div className="flex items-center gap-2 text-[9px] font-bold">
                                    <MapPin size={12} /> San Francisco, CA
                                </div>
                            </div>
                        </div>

                        {/* CONTENT AREA WITH REORDERABLE SECTIONS */}
                        <div className="flex-1 bg-white p-10 overflow-hidden">
                            <motion.div className="flex flex-col relative" style={{ gap: spacing }}>
                                {sections.map((sectionId) => (
                                    <motion.section
                                        key={sectionId}
                                        layout
                                        transition={{
                                            layout: { duration: 0.8, ease: [0.23, 1, 0.32, 1] },
                                            scale: { duration: 0.3 },
                                            boxShadow: { duration: 0.3 }
                                        }}
                                        initial={false}
                                        animate={{
                                            scale: activeSection === sectionId ? 1.05 : 1,
                                            borderColor: activeSection === sectionId ? accentColor : 'rgba(0,0,0,0.02)',
                                            borderWidth: 2,
                                            backgroundColor: activeSection === sectionId ? 'white' : 'transparent',
                                            zIndex: activeSection === sectionId ? 20 : 1,
                                            boxShadow: activeSection === sectionId ? '0 25px 50px -12px rgba(124, 58, 237, 0.15)' : '0 0 0 rgba(0,0,0,0)',
                                            y: activeSection === sectionId ? -5 : 0
                                        }}
                                        className="relative p-5 border rounded-2xl bg-white shadow-sm cursor-grab active:cursor-grabbing"
                                    >
                                        {/* GRAB INTERACTION */}
                                        {activeSection === sectionId && (
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="absolute -left-14 top-1/2 -translate-y-1/2 flex items-center gap-3"
                                            >
                                                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                                                    <MousePointer2 className="w-8 h-8 text-stone-900 fill-white drop-shadow-2xl" />
                                                </motion.div>
                                                <GripVertical className="text-stone-300" size={24} />
                                            </motion.div>
                                        )}

                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-1.5 h-4 rounded-full" style={{ backgroundColor: accentColor }} />
                                            <h3 className="text-xs font-black uppercase tracking-widest text-stone-900">
                                                {sectionId === 'summary' ? 'Professional Narrative' : sectionId === 'experience' ? 'Career Milestones' : 'Academic Foundation'}
                                            </h3>
                                        </div>

                                        {sectionId === 'summary' && (
                                            <p className="text-[10px] text-stone-500 font-medium leading-relaxed italic pr-6 border-l-2 border-stone-50 pl-4">
                                                "Highly analytical tech lead with 8+ years experience in distributed systems. Delivering excellence through architectural precision."
                                            </p>
                                        )}

                                        {sectionId === 'experience' && (
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-baseline">
                                                    <span className="text-[11px] font-black text-stone-900 uppercase">Lead Engineer @ FlowState</span>
                                                    <span className="text-[9px] font-bold text-stone-300 italic">2021 — NOW</span>
                                                </div>
                                                <div className="space-y-1.5 pr-10">
                                                    <div className="w-full h-1.5 bg-stone-50 rounded-full" />
                                                    <div className="w-[85%] h-1.5 bg-stone-50 rounded-full" />
                                                </div>
                                            </div>
                                        )}

                                        {sectionId === 'education' && (
                                            <div className="flex justify-between items-center py-1">
                                                <div>
                                                    <span className="text-[11px] font-black text-stone-900 uppercase">M.S. Computer Science</span>
                                                    <p className="text-[9px] font-bold text-stone-400 mt-0.5">Stanford University</p>
                                                </div>
                                                <span className="text-[9px] font-bold text-stone-300 pr-4">Class of 2018</span>
                                            </div>
                                        )}
                                    </motion.section>
                                ))}
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* FOOTER TIP */}
                <div className="flex items-center gap-4 bg-white border border-stone-100 shadow-xl px-6 py-3 rounded-full">
                    <Wand2 size={16} className="text-emerald-500" />
                    <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Advanced Layout Orchestrator</span>
                </div>
            </div>
        </div>
    )
}

export default RefineReorderArt
