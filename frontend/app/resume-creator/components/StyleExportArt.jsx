"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Layout, Sparkles, MousePointer2, FileText, Check, Share2, Mail, MapPin, Briefcase, GraduationCap } from 'lucide-react'

const StyleExportArt = () => {
    const [template, setTemplate] = useState('modern') // 'modern' | 'minimal' | 'executive'
    const [isExporting, setIsExporting] = useState(false)
    const [exportProgress, setExportProgress] = useState(0)

    useEffect(() => {
        let isCancelled = false
        const runSimulation = async () => {
            while (!isCancelled) {
                // PHASE 1: TEMPLATE SWITCHING
                await new Promise(r => setTimeout(r, 1500))
                setTemplate('minimal')
                await new Promise(r => setTimeout(r, 1800))
                setTemplate('executive')
                await new Promise(r => setTimeout(r, 1800))
                setTemplate('modern')
                await new Promise(r => setTimeout(r, 1500))

                // PHASE 2: EXPORT TRIGGER
                setIsExporting(true)
                setExportProgress(0)

                // Progress simulation
                for (let i = 0; i <= 100; i += 5) {
                    if (isCancelled) return
                    setExportProgress(i)
                    await new Promise(r => setTimeout(r, 45))
                }

                await new Promise(r => setTimeout(r, 1200))
                setIsExporting(false)
                await new Promise(r => setTimeout(r, 3500))
            }
        }
        runSimulation()
        return () => { isCancelled = true }
    }, [])

    return (
        <div className="relative w-full h-[600px] flex items-center justify-center bg-transparent scale-[0.7] lg:scale-[0.85] transition-transform duration-700">
            {/* AMBIENT GLOW */}
            <div className="absolute inset-0 bg-orange-400/5 blur-[120px] rounded-full" />

            <div className="relative flex flex-col items-center gap-10 w-full max-w-2xl px-8">

                {/* 1. TEMPLATE SELECTOR HUD */}
                <motion.div
                    className="flex items-center gap-4 bg-white border border-stone-100 shadow-2xl px-6 py-4 rounded-2xl z-50 overflow-hidden"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    <div className="flex items-center gap-2 pr-5 border-r border-stone-100">
                        <Layout className="text-stone-900" size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-stone-900">Template Engine</span>
                    </div>

                    <div className="flex gap-2">
                        {['modern', 'minimal', 'executive'].map(t => (
                            <div
                                key={t}
                                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2
                                    ${template === t ? 'bg-orange-500 text-white shadow-[0_10px_20px_-5px_rgba(249,115,22,0.4)]' : 'bg-stone-50 text-stone-400 border border-stone-100'}`}
                            >
                                {template === t && <Check size={10} />} {t}
                            </div>
                        ))}
                    </div>

                    {template === 'modern' && !isExporting && (
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="absolute -right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                        >
                            <MousePointer2 className="w-6 h-6 text-stone-900 fill-white" />
                        </motion.div>
                    )}
                </motion.div>

                {/* 2. THE HIGH-FIDELITY RESUME PREVIEW */}
                <div className="relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={template}
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -30 }}
                            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                            className={`relative w-[500px] h-[620px] border border-stone-100 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.15)] rounded-sm flex flex-col z-10 overflow-hidden bg-white`}
                        >
                            {/* MODERN TEMPLATE (ACCENT HEADER) */}
                            {template === 'modern' && (
                                <div className="flex flex-col h-full font-sans">
                                    <div className="p-10 bg-stone-900 text-white relative">
                                        <div className="absolute right-10 top-10 flex gap-2">
                                            <div className="w-2 h-2 rounded-full bg-orange-500" />
                                            <div className="w-2 h-2 rounded-full bg-orange-500/30" />
                                        </div>
                                        <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">Alex Daniel</h1>
                                        <p className="text-[10px] font-black tracking-[0.3em] text-orange-400">SENIOR PRODUCT ARCHITECT</p>
                                        <div className="flex gap-6 mt-8 opacity-60">
                                            <div className="flex items-center gap-2 text-[9px] font-bold"><Mail size={12} /> alex@resumy.io</div>
                                            <div className="flex items-center gap-2 text-[9px] font-bold"><MapPin size={12} /> Silicon Valley, CA</div>
                                        </div>
                                    </div>
                                    <div className="p-10 flex-1 flex flex-col gap-10">
                                        <section className="space-y-4">
                                            <h3 className="text-[11px] font-black uppercase tracking-widest text-stone-900 flex items-center gap-3">
                                                Professional Summary <div className="flex-1 h-[1px] bg-stone-100" />
                                            </h3>
                                            <p className="text-[10px] text-stone-500 font-medium leading-relaxed italic pr-10">
                                                Results-oriented engineer with deep expertise in cloud architecture and distributed systems.
                                                Passionate about building scalable solutions that drive enterprise growth.
                                            </p>
                                        </section>
                                        <section className="space-y-4">
                                            <h3 className="text-[11px] font-black uppercase tracking-widest text-stone-900 flex items-center gap-3">
                                                Core Experience <div className="flex-1 h-[1px] bg-stone-100" />
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-baseline font-black uppercase tracking-tight">
                                                    <span className="text-[11px] text-stone-900">Lead Systems Engineer @ TechFlow</span>
                                                    <span className="text-[9px] text-stone-400">2021 — NOW</span>
                                                </div>
                                                <ul className="space-y-3 pl-2">
                                                    <li className="flex items-start gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1" />
                                                        <span className="text-[9px] text-stone-500 font-medium uppercase tracking-wider">Modernized global payment gateway pipeline</span>
                                                    </li>
                                                    <li className="flex items-start gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1" />
                                                        <span className="text-[9px] text-stone-500 font-medium uppercase tracking-wider">Architected multi-region serverless deployment</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            )}

                            {/* MINIMAL TEMPLATE (SERIF / ELEGANT) */}
                            {template === 'minimal' && (
                                <div className="flex flex-col h-full items-center p-16 font-serif">
                                    <div className="w-16 h-[1.5px] bg-stone-900 mb-10" />
                                    <h1 className="text-3xl font-light italic text-stone-900 mb-4">Alex Daniel</h1>
                                    <p className="font-sans text-[10px] font-black tracking-[0.4em] text-stone-400 uppercase mb-12">Digital Design & Strategy</p>

                                    <div className="w-full space-y-12 text-left font-sans">
                                        <div className="space-y-4 px-10">
                                            <h4 className="text-[10px] font-black text-stone-300 uppercase tracking-widest text-center italic">Selected Works</h4>
                                            <div className="space-y-4 pt-4 border-t border-stone-50">
                                                <div className="flex justify-between text-stone-900 font-black uppercase text-[10px]">
                                                    <span>Principal Consultant</span>
                                                    <span className="text-stone-300">2019 — 2021</span>
                                                </div>
                                                <p className="text-[10px] text-stone-400 leading-relaxed font-medium capitalize">Directed brand evolution for $500M tech portfolio including interface systems and visual language.</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4 px-10 pt-10 border-t border-stone-50">
                                            <h4 className="text-[10px] font-black text-stone-300 uppercase tracking-widest text-center italic">Academic Foundation</h4>
                                            <div className="text-center space-y-1">
                                                <div className="text-stone-900 font-black uppercase text-[11px]">B.S. Computational Design</div>
                                                <div className="text-stone-400 font-bold uppercase text-[9px] tracking-wider">Stanford University</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* EXECUTIVE TEMPLATE (SIDEBAR / BOLD) */}
                            {template === 'executive' && (
                                <div className="flex h-full font-sans">
                                    <div className="w-[180px] bg-stone-50 p-10 flex flex-col gap-12 border-r border-stone-100">
                                        <div className="w-16 h-16 bg-white border border-stone-200 rounded-2xl flex items-center justify-center">
                                            <Sparkles className="text-stone-100 w-10 h-10" />
                                        </div>
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <h4 className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Expertise</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {['Golang', 'Kubernetes', 'AWS', 'React'].map(s => (
                                                        <span key={s} className="bg-white border border-stone-200 px-2 py-1 rounded text-[8px] font-black text-stone-900">{s}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <h4 className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Languages</h4>
                                                <div className="space-y-2 text-[8px] font-bold text-stone-900">
                                                    <div className="flex justify-between"><span>English</span><span className="text-stone-300">NTV</span></div>
                                                    <div className="flex justify-between"><span>German</span><span className="text-stone-300">FLT</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 p-10 flex flex-col">
                                        <div className="mb-12">
                                            <h1 className="text-4xl font-black uppercase tracking-tighter text-stone-900 leading-none">Alex Daniel</h1>
                                            <div className="h-4 w-20 bg-stone-900 mt-4" />
                                        </div>
                                        <section className="space-y-8">
                                            <div className="space-y-4">
                                                <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-300 border-b border-stone-50 pb-2">Experience Portfolio</h3>
                                                <div className="space-y-2">
                                                    <span className="text-[11px] font-black text-stone-900 uppercase">Head of Infrastructure</span>
                                                    <p className="text-[10px] text-stone-500 font-medium leading-relaxed pr-6 lowercase tracking-tight">Managing global devops operations for cloud-native ecosystems with 99.99% uptime compliance.</p>
                                                </div>
                                            </div>
                                            <div className="space-y-4 pt-4">
                                                <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-300 border-b border-stone-50 pb-2">Academic Record</h3>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-stone-50 border border-stone-100 flex items-center justify-center"><GraduationCap size={14} className="text-stone-300" /></div>
                                                    <div>
                                                        <div className="text-[10px] font-black text-stone-900 uppercase">Master of Comp Sci</div>
                                                        <div className="text-[8px] font-bold text-stone-400">MIT • 2020</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            )}

                            {/* EXPORT OVERLAY */}
                            <AnimatePresence>
                                {isExporting && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-white/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center p-12 text-center"
                                    >
                                        <motion.div
                                            initial={{ scale: 0.5, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            className="relative"
                                        >
                                            <div className="w-40 h-40 border-8 border-stone-50 rounded-full flex items-center justify-center relative">
                                                <svg className="absolute inset-0 w-full h-full -rotate-90">
                                                    <circle
                                                        cx="80" cy="80" r="72"
                                                        fill="none"
                                                        stroke="rgba(249, 115, 22, 1)"
                                                        strokeWidth="16"
                                                        strokeDasharray="452"
                                                        strokeDashoffset={452 * (1 - exportProgress / 100)}
                                                        strokeLinecap="round"
                                                        className="transition-all duration-100 ease-linear"
                                                    />
                                                </svg>
                                                {exportProgress < 100 ? (
                                                    <FileText className="text-orange-500 w-12 h-12" />
                                                ) : (
                                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                                        <Check className="text-emerald-500 w-16 h-16" />
                                                    </motion.div>
                                                )}
                                            </div>
                                            <motion.div
                                                animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
                                                transition={{ repeat: Infinity, duration: 2 }}
                                                className="absolute -top-6 -right-6"
                                            >
                                                <Sparkles className="text-amber-400 w-10 h-10" />
                                            </motion.div>
                                        </motion.div>

                                        <div className="mt-12 space-y-3">
                                            <h3 className="text-2xl font-black text-stone-900 tracking-tighter uppercase leading-none">
                                                {exportProgress < 100 ? "Compiling Executive PDF" : "Resume Ready for Launch"}
                                            </h3>
                                            <p className="text-[10px] text-stone-400 font-black uppercase tracking-[0.2em] italic">
                                                {exportProgress < 100 ? `Pixel-Perfect Rendering... ${exportProgress}%` : "ATS Optimized & Verified"}
                                            </p>
                                        </div>

                                        {exportProgress === 100 && (
                                            <motion.div
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                className="mt-12 flex gap-4"
                                            >
                                                <div className="flex items-center gap-3 bg-stone-900 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-2xl">
                                                    <Download size={16} /> Get PDF
                                                </div>
                                                <div className="flex items-center gap-3 border border-stone-100 bg-white text-stone-900 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg">
                                                    <Share2 size={16} /> Link
                                                </div>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </AnimatePresence>

                    {/* STACKED PAPERS EFFECT */}
                    <div className="absolute -left-12 top-10 w-[500px] h-[620px] bg-white border border-stone-50 shadow-2xl rounded-sm -z-10 rotate-[-4deg] opacity-30" />
                    <div className="absolute -right-12 top-10 w-[500px] h-[620px] bg-white border border-stone-50 shadow-2xl rounded-sm -z-10 rotate-[4deg] opacity-30" />
                </div>

                {/* THE MASTER BUTTON HUD */}
                <motion.div
                    className={`flex items-center gap-5 bg-white border border-stone-100 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] px-10 py-6 rounded-[2.5rem] z-50
                        ${isExporting ? 'opacity-20 blur-sm pointer-events-none' : ''}`}
                >
                    <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-600/30 rotate-3 transition-transform hover:rotate-0">
                        <Download size={24} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-black text-stone-900 uppercase tracking-widest">Finalize & Export</span>
                        <span className="text-[9px] font-bold text-stone-400 uppercase tracking-[0.3em]">Commercial Print Quality</span>
                    </div>
                    <div className="ml-8 px-5 py-2 bg-stone-900 text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg">
                        v4.0
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default StyleExportArt
