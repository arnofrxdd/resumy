"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PenTool, Sparkles, User, Briefcase, GraduationCap, MousePointer2, Check, Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react'

const InputStoryArt = () => {
    const [activeSection, setActiveSection] = useState('header') // 'header' | 'experience' | 'education'
    const [name, setName] = useState('')
    const [degree, setDegree] = useState('')
    const [company, setCompany] = useState('')
    const [isTyping, setIsTyping] = useState(false)

    useEffect(() => {
        let isCancelled = false
        const runSimulation = async () => {
            while (!isCancelled) {
                // PHASE 1: SELECT HEADER PILL
                setActiveSection('header')
                setName('')
                setDegree('')
                setCompany('')
                await new Promise(r => setTimeout(r, 1200))

                setIsTyping(true)
                const fullName = "ALEX DANIEL"
                for (let i = 0; i <= fullName.length; i++) {
                    if (isCancelled) return
                    setName(fullName.slice(0, i))
                    await new Promise(r => setTimeout(r, 70))
                }
                setIsTyping(false)
                await new Promise(r => setTimeout(r, 1500))

                // PHASE 2: SELECT EXPERIENCE PILL
                setActiveSection('experience')
                await new Promise(r => setTimeout(r, 1000))

                setIsTyping(true)
                const fullCompany = "TechFlow Systems"
                for (let i = 0; i <= fullCompany.length; i++) {
                    if (isCancelled) return
                    setCompany(fullCompany.slice(0, i))
                    await new Promise(r => setTimeout(r, 60))
                }
                setIsTyping(false)
                await new Promise(r => setTimeout(r, 1500))

                // PHASE 3: SELECT EDUCATION PILL
                setActiveSection('education')
                await new Promise(r => setTimeout(r, 1000))

                setIsTyping(true)
                const fullDegree = "Bachelor of Science"
                for (let i = 0; i <= fullDegree.length; i++) {
                    if (isCancelled) return
                    setDegree(fullDegree.slice(0, i))
                    await new Promise(r => setTimeout(r, 60))
                }
                setIsTyping(false)
                await new Promise(r => setTimeout(r, 2500))
            }
        }
        runSimulation()
        return () => { isCancelled = true }
    }, [])

    return (
        <div className="relative w-full h-[550px] flex items-center justify-center bg-transparent scale-[0.75] lg:scale-90 transition-transform duration-700">
            {/* AMBIENT GLOW */}
            <div className="absolute inset-0 bg-violet-400/5 blur-[120px] rounded-full" />

            <div className="relative flex flex-col items-center gap-6 w-full max-w-3xl px-8">

                {/* 1. THE FORM CONTROL PANEL */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="w-full max-w-lg bg-white border border-stone-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] p-6 rounded-2xl flex flex-col gap-6 z-40"
                >
                    {/* SECTION SELECTOR */}
                    <div className="flex gap-2 p-1.5 bg-stone-50 border border-stone-100 rounded-xl relative">
                        <AnimatePresence>
                            <motion.div
                                key={activeSection}
                                initial={{ x: 0, opacity: 0 }}
                                animate={{
                                    x: activeSection === 'header' ? 0 : activeSection === 'experience' ? 144 : 310,
                                    opacity: 1
                                }}
                                transition={{ duration: 0.6, ease: "circOut" }}
                                className="absolute z-50 pointer-events-none mt-4 -ml-4"
                            >
                                <div className="relative">
                                    <MousePointer2 className="w-6 h-6 text-stone-900 fill-white" />
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: [0, 1.8, 0] }}
                                        transition={{ duration: 0.4 }}
                                        className="absolute -inset-2 bg-violet-400/40 rounded-full"
                                    />
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        <button className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeSection === 'header' ? 'bg-white shadow-sm ring-1 ring-stone-200 text-stone-900' : 'text-stone-400'}`}>
                            <User size={14} /> <span>Header</span>
                        </button>
                        <button className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeSection === 'experience' ? 'bg-white shadow-sm ring-1 ring-stone-200 text-stone-900' : 'text-stone-400'}`}>
                            <Briefcase size={14} /> <span>Work Exp</span>
                        </button>
                        <button className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeSection === 'education' ? 'bg-white shadow-sm ring-1 ring-stone-200 text-stone-900' : 'text-stone-400'}`}>
                            <GraduationCap size={14} /> <span>Education</span>
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-stone-400">
                                {activeSection === 'header' ? 'Enter Full Name' : activeSection === 'experience' ? 'Company Name' : 'Degree / Qualification'}
                            </label>
                            {isTyping && (
                                <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md">
                                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-ping" />
                                    <span className="text-[8px] font-bold uppercase tracking-widest">Typing...</span>
                                </div>
                            )}
                        </div>
                        <div className="relative h-14 bg-stone-50 border border-stone-100 rounded-xl px-4 flex items-center overflow-hidden">
                            <span className="text-stone-900 font-bold text-lg">
                                {activeSection === 'header' ? name : activeSection === 'experience' ? company : degree}
                            </span>
                            <motion.div
                                animate={{ opacity: [1, 0] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                                className="w-[2px] h-6 bg-violet-600 ml-1"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* 2. THE ACTUAL RESUME PREVIEW */}
                <motion.div
                    className="relative w-[480px] h-[580px] bg-white border border-stone-100 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] rounded-sm overflow-hidden flex flex-col z-10"
                >
                    {/* RESUME TOP BAR (AESTHETIC) */}
                    <div className="h-1 w-full bg-stone-900" />

                    <div className="flex-1 overflow-hidden flex flex-col">
                        {/* HEADER SECTION */}
                        <div className={`p-10 pb-8 transition-all duration-500 ${activeSection === 'header' ? 'bg-violet-50/50' : ''}`}>
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-black uppercase tracking-tighter text-stone-900 leading-tight">
                                        {name || "ALEX DANIEL"}
                                    </h1>
                                    <div className="flex items-center gap-3 text-[10px] font-bold text-violet-600 uppercase tracking-widest">
                                        <span>Senior Software Engineer</span>
                                        <div className="w-1 h-1 bg-stone-300 rounded-full" />
                                        <span>Full-Stack Lead</span>
                                    </div>
                                </div>
                                <div className="w-16 h-16 bg-stone-50 border border-stone-100 rounded-none flex items-center justify-center">
                                    <User className="text-stone-200 w-8 h-8" />
                                </div>
                            </div>

                            {/* Contact Info Row */}
                            <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-stone-100">
                                <div className="flex items-center gap-1.5 text-[9px] font-bold text-stone-500">
                                    <Mail size={12} className="text-stone-400" /> alex@resumy.io
                                </div>
                                <div className="flex items-center gap-1.5 text-[9px] font-bold text-stone-500">
                                    <Phone size={12} className="text-stone-400" /> +1 (555) 0123
                                </div>
                                <div className="flex items-center gap-1.5 text-[9px] font-bold text-stone-500">
                                    <MapPin size={12} className="text-stone-400" /> San Francisco, CA
                                </div>
                                <div className="flex items-center gap-1.5 text-[9px] font-bold text-stone-500">
                                    <Linkedin size={12} className="text-stone-400" /> linkedin.com/in/alex
                                </div>
                            </div>
                        </div>

                        {/* CONTENT BODY */}
                        <div className="px-10 pb-10 grid grid-cols-[1fr_260px] gap-10">
                            {/* LEFT COLUMN: MAIN CONTENT */}
                            <div className="space-y-8">
                                {/* SUMMARY */}
                                <section className="space-y-3">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-900 flex items-center gap-2">
                                        Professional Summary <div className="flex-1 h-[1px] bg-stone-100" />
                                    </h3>
                                    <p className="text-[10px] text-stone-600 leading-relaxed font-medium">
                                        Innovative software architect with 8+ years of experience in AI-driven platforms and distributed systems. Expert in React, Node.js, and scaling high-traffic applications.
                                    </p>
                                </section>

                                {/* EXPERIENCE */}
                                <section className={`space-y-6 transition-all duration-500 p-3 -m-3 rounded-xl ${activeSection === 'experience' ? 'bg-violet-50 ring-1 ring-violet-200' : ''}`}>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-900 flex items-center gap-2">
                                        Work Experience <div className="flex-1 h-[1px] bg-stone-100" />
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-baseline">
                                                <h4 className="text-[11px] font-black text-stone-900 uppercase">Principal Software Engineer</h4>
                                                <span className="text-[9px] font-bold text-stone-300">2021 — PRES</span>
                                            </div>
                                            <div className="text-[10px] font-black text-violet-600 uppercase h-4">
                                                {company || "TechFlow Systems"}
                                            </div>
                                            <ul className="space-y-1.5 list-disc pl-3">
                                                <li className="text-[9px] text-stone-500 font-medium">Led modernization of core payment infrastructure.</li>
                                                <li className="text-[9px] text-stone-500 font-medium">Mentored a team of 12 full-stack developers.</li>
                                            </ul>
                                        </div>

                                        <div className="space-y-2 opacity-50">
                                            <div className="flex justify-between items-baseline">
                                                <h4 className="text-[11px] font-black text-stone-900 uppercase">Senior Full Stack Developer</h4>
                                                <span className="text-[9px] font-bold text-stone-300">2018 — 2021</span>
                                            </div>
                                            <div className="text-[10px] font-black text-stone-400 uppercase">CloudScale Solutions</div>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* RIGHT COLUMN: SIDEBAR */}
                            <div className="space-y-8 border-l border-stone-50 pl-8">
                                {/* CORE SKILLS */}
                                <section className="space-y-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-900">Expertise</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {['TypeScript', 'React', 'GraphQL', 'AWS', 'Docker', 'AI Models'].map(skill => (
                                            <span key={skill} className="text-[8px] font-black text-stone-400 border border-stone-100 px-2 py-1 rounded-sm">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </section>

                                {/* EDUCATION */}
                                <section className={`space-y-4 transition-all duration-500 p-3 -m-3 rounded-xl ${activeSection === 'education' ? 'bg-violet-50 ring-1 ring-violet-200' : ''}`}>
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-900">Education</h3>
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <div className="text-[10px] font-black text-stone-900 uppercase leading-snug min-h-[25px]">
                                                {degree || "Master of Computer Science"}
                                            </div>
                                            <div className="text-[9px] font-bold text-stone-400">Stanford University</div>
                                            <div className="text-[8px] font-bold text-stone-300 italic">Distinction in AI</div>
                                        </div>
                                    </div>
                                </section>

                                {/* LANGUAGES */}
                                <section className="space-y-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-900">Communication</h3>
                                    <div className="space-y-2 text-[9px] font-bold text-stone-500">
                                        <div className="flex justify-between"><span>English</span><span className="text-stone-300">Native</span></div>
                                        <div className="flex justify-between"><span>German</span><span className="text-stone-300">Fluent</span></div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>

                    {/* STATUS BAR FOOTER */}
                    <div className="h-4 bg-stone-50 border-t border-stone-100 flex items-center justify-center">
                        <span className="text-[7px] font-black text-stone-300 uppercase tracking-[0.5em]">RESUMY PROFESSIONAL SUITE PREVIEW</span>
                    </div>

                    {/* Magic Sparkle overlay when updating */}
                    <AnimatePresence>
                        {isTyping && (
                            <motion.div
                                initial={{ scale: 0, x: 20 }}
                                animate={{ scale: 1, x: 0 }}
                                exit={{ scale: 0 }}
                                className="absolute z-50 pointer-events-none"
                                style={{
                                    top: activeSection === 'header' ? '60px' : activeSection === 'experience' ? '300px' : '400px',
                                    right: '60px'
                                }}
                            >
                                <Sparkles className="text-amber-400 fill-amber-400 w-8 h-8 animate-pulse" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* VISUAL DATA SYNC BEAMS */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
                    <motion.path
                        d="M 350 240 L 350 280"
                        stroke="rgba(124, 58, 237, 0.4)"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        fill="none"
                        animate={{ strokeDashoffset: [0, -8] }}
                        transition={{ repeat: Infinity, duration: 0.5, ease: "linear" }}
                    />
                </svg>
            </div>
        </div>
    )
}

export default InputStoryArt
