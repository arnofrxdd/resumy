"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Wand2, PenTool, User, Briefcase, FileText, ArrowRight } from 'lucide-react'
import {
    UnderlineDoodle,
    SparkleDoodle,
    CurvyArrowDoodle,
    StatusDoodle,
    StarDoodle,
    CrownDoodle,
    CircleDoodle,
    ScribbleDoodle,
    ZigZagDoodle,
    BridgeDoodle
} from '../DoodleAnimations'
import { useIsMobile } from '@/hooks/useIsMobile'
import ProfileImg from '../profile_alex.png'

// Mock Data to "Type"
const USER_DATA = {
    firstName: "ALEX",
    lastName: "DEV",
    role: "Senior Product Manager",
    email: "alex.dev@gaplytiq.com",
    city: "San Francisco, CA",
    phone: "+1 (555) 0123-4567",
    website: "alexdev.design",
    summary: "Strategic Product Manager with 5+ years of experience leading cross-functional teams to build scalable SaaS products. Expert in Agile methodologies, data-driven decision making, and user-centric design. Successfully launched 3 flagship products in the Fintech space, driving $2M+ in ARR. Passionate about bridging the gap between technical constraints and user needs.",
    experience: [
        {
            role: "Product Lead",
            company: "TechFlow Inc.",
            date: "2020 — PRES",
            location: "San Francisco",
            details: "Led a team of 15 engineers and designers. Increased user retention by 25% through iterative feature releases and A/B testing frameworks. Managed a $500k annual budget and defined the technical roadmap for the next 4 quarters."
        },
        {
            role: "Associate PM",
            company: "ScaleGrid Systems",
            date: "2018 — 2020",
            location: "Palo Alto",
            details: "Collaborated on the redesign of the core dashboard, reducing churn by 12%. Defined 40+ user stories and led sprint planning for 3 engineering pods. Improved team velocity by 18%."
        }
    ],
    education: [
        { degree: "MBA, Product Strategy", school: "Stanford University", date: "2018" },
        { degree: "B.S. Computer Science", school: "UC Berkeley", date: "2016" }
    ],
    skills: ["Product Strategy", "SQL & Analytics", "Stakeholder Mgmt", "UX Research", "System Design", "Agile/Scrum", "Go-to-Market", "API Design"],
    languages: ["English (Native)", "Spanish (Fluent)", "German (Basic)"],
    achievements: [
        "Product of the Year 2022",
        "Top 10 PMs to watch in Fintech"
    ]
}

const ResumeTemplate = ({ type, formValues, i, phase, isTop }) => {
    const isClassic = type === 'classic'
    const isCreative = type === 'creative'
    const isExecutive = type === 'executive'
    const isModern = type === 'modern'

    return (
        <div className={`w-full h-full bg-white rounded shadow-[0_20px_50px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] flex flex-col relative overflow-hidden text-stone-900 ${isClassic ? 'font-serif' : 'font-sans'}`}>

            {/* EXECUTIVE HEADER ACCENT */}
            {isExecutive && (
                <div className="absolute top-0 left-0 w-full h-[120px] bg-slate-900" />
            )}

            <div className="flex flex-1 relative z-10 h-full">

                {/* COLORED SIDEBARS */}
                {(isCreative || isModern) && (
                    <div className={`w-[160px] flex flex-col p-8 space-y-10 ${isCreative ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-100'
                        }`}>
                        {/* Profile Image - Full Color */}
                        <div className="w-24 h-24 rounded-xl bg-white/10 overflow-hidden ring-2 ring-white/20 shadow-lg">
                            <img
                                src={ProfileImg.src}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="space-y-8">
                            <section className="space-y-2.5">
                                <h4 className={`text-[9px] font-black uppercase tracking-widest ${isCreative ? 'text-emerald-200' : 'text-slate-400'}`}>Contact</h4>
                                <div className="space-y-1.5 text-[8.5px] font-bold leading-tight break-all">
                                    <div className="opacity-90">{USER_DATA.email}</div>
                                    <div className="opacity-90">{USER_DATA.phone}</div>
                                    <div className="opacity-90">{USER_DATA.city}</div>
                                </div>
                            </section>

                            <section className="space-y-2.5">
                                <h4 className={`text-[9px] font-black uppercase tracking-widest ${isCreative ? 'text-emerald-200' : 'text-slate-400'}`}>Expertise</h4>
                                <div className="space-y-2 text-[9px] font-bold">
                                    {USER_DATA.skills.slice(0, 6).map((s, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                                            {s}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                )}

                {/* MAIN BODY */}
                <div className={`flex-1 p-10 flex flex-col ${isClassic ? 'items-center text-center' : ''}`}>

                    {/* Header Section */}
                    <header className={`mb-8 w-full ${isExecutive ? 'text-white' : ''} ${isClassic ? 'border-b-2 border-slate-900 pb-5' : ''}`}>
                        <h1 className={`font-black uppercase tracking-tighter mb-1.5 ${isExecutive ? 'text-4xl' :
                            isClassic ? 'text-[42px] tracking-[0.1em]' :
                                'text-4xl'
                            }`}>
                            <span className={isExecutive ? 'text-white' : 'text-slate-900'}>
                                {formValues.firstName || "ALEX"}
                            </span>{" "}
                            <span className={
                                isModern ? 'text-slate-900' :
                                    isCreative ? 'text-emerald-900' :
                                        isExecutive ? 'text-emerald-400' :
                                            'text-slate-900'
                            }>{formValues.lastName || "DEV"}</span>
                        </h1>
                        <p className={`text-[12px] font-black uppercase tracking-[0.3em] ${isExecutive ? 'text-slate-300' :
                            isModern ? 'text-slate-500' :
                                isCreative ? 'text-emerald-700 font-black' :
                                    'text-slate-500'
                            }`}>
                            {formValues.role || "Senior Product Manager"}
                        </p>

                        {/* Classic/Executive Contact Row */}
                        {(isClassic || isExecutive) && (
                            <div className={`flex justify-center flex-wrap gap-x-4 mt-4 text-[9px] font-bold uppercase tracking-widest ${isExecutive ? 'text-slate-300 opacity-80' : 'text-slate-500 opacity-60'
                                }`}>
                                <span>{USER_DATA.email}</span>
                                <span className="opacity-40">•</span>
                                <span>{USER_DATA.phone}</span>
                                <span className="opacity-40">•</span>
                                <span>{USER_DATA.city}</span>
                            </div>
                        )}
                    </header>

                    {/* Content */}
                    <div className="space-y-7 w-full text-left">
                        {/* Summary */}
                        {formValues.summary && (
                            <section>
                                <h3 className={`text-[11px] font-black uppercase tracking-widest mb-2 border-b-2 pb-1 ${isModern ? 'border-slate-800 text-slate-800' :
                                    isCreative ? 'border-emerald-700 text-emerald-700' :
                                        'border-slate-900'
                                    }`}>Profile</h3>
                                <p className="text-[10.5px] leading-relaxed text-slate-600 font-bold">
                                    {formValues.summary}
                                </p>
                            </section>
                        )}

                        {/* Experience */}
                        <section>
                            <h3 className={`text-[11px] font-black uppercase tracking-widest mb-4 border-b-2 pb-1 ${isModern ? 'border-slate-800 text-slate-800' :
                                isCreative ? 'border-emerald-700 text-emerald-700' :
                                    'border-slate-900'
                                }`}>Professional Experience</h3>
                            <div className="space-y-6">
                                {USER_DATA.experience.map((job, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <span className="text-[12px] font-black text-slate-900 uppercase">{job.role}</span>
                                            <span className="text-[10px] font-bold text-slate-400">{job.date}</span>
                                        </div>
                                        <div className={`text-[10px] font-bold uppercase tracking-wide mb-1.5 opacity-95 ${isCreative ? 'text-emerald-600' : 'text-slate-500'
                                            }`}>{job.company} — {job.location}</div>
                                        <p className="text-[10.5px] text-slate-600 leading-relaxed font-bold">
                                            {job.details}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Education Footer */}
                        <section className="pt-5 border-t-2 border-slate-100 flex justify-between items-start">
                            <div className="space-y-3">
                                <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400">Education</h4>
                                {USER_DATA.education.slice(0, 1).map((e, idx) => (
                                    <div key={idx}>
                                        <div className="text-[11px] font-black text-slate-900 uppercase">{e.degree}</div>
                                        <div className="text-[9px] font-bold text-slate-500 uppercase">{e.school}</div>
                                    </div>
                                ))}
                            </div>

                            {/* Skills for Non-Sidebar templates */}
                            {!(isCreative || isModern) && (
                                <div className="text-right space-y-3">
                                    <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400">Key Expertise</h4>
                                    <div className="flex flex-wrap justify-end gap-x-2.5 gap-y-1.5 max-w-[200px]">
                                        {USER_DATA.skills.slice(0, 5).map((s, idx) => (
                                            <span key={idx} className="text-[9px] font-bold text-slate-600 uppercase bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">{s}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </div>

            {/* Subtile ID */}
            <div className={`absolute bottom-5 right-8 opacity-[0.05] pointer-events-none text-[8px] font-black uppercase tracking-[0.5em] ${isExecutive ? 'text-white' : 'text-black'}`}>
                QUALIFIED BLUEPRINT 2026
            </div>
        </div>
    )
}

const ResumeCreatorDemo = ({ isAuthenticated }) => {
    const isMobile = useIsMobile()
    const [phase, setPhase] = useState('input') // input, filling, complete, scoring
    const [stack, setStack] = useState(['modern', 'classic', 'creative', 'executive'])
    const template = stack[0]

    // Form State (Animated)
    const [formValues, setFormValues] = useState({
        firstName: "",
        lastName: "",
        role: "",
        summary: ""
    })

    const rotateStack = () => {
        setStack(prev => {
            const last = prev[prev.length - 1]
            return [last, ...prev.slice(0, prev.length - 1)]
        })
    }

    const setTopTemplate = (type) => {
        setStack(prev => {
            if (prev[0] === type) return prev
            const index = prev.indexOf(type)
            if (index === -1) return prev
            const newStack = [...prev]
            const [item] = newStack.splice(index, 1)
            return [item, ...newStack]
        })
    }

    // Typing Logic
    useEffect(() => {
        let isCancelled = false

        const runSimulation = async () => {
            while (!isCancelled) {
                // RESET
                setPhase('input')
                setStack(['modern', 'classic', 'creative', 'executive'])
                setFormValues({ firstName: "", lastName: "", role: "", summary: "" })
                await new Promise(r => setTimeout(r, 1500))

                // TYPE: First Name
                for (let i = 0; i <= USER_DATA.firstName.length; i++) {
                    if (isCancelled) return
                    setFormValues(prev => ({ ...prev, firstName: USER_DATA.firstName.slice(0, i) }))
                    await new Promise(r => setTimeout(r, isMobile ? 60 : 30))
                }

                // TYPE: Last Name
                for (let i = 0; i <= USER_DATA.lastName.length; i++) {
                    if (isCancelled) return
                    setFormValues(prev => ({ ...prev, lastName: USER_DATA.lastName.slice(0, i) }))
                    await new Promise(r => setTimeout(r, isMobile ? 60 : 30))
                }

                // TYPE: Role
                for (let i = 0; i <= USER_DATA.role.length; i++) {
                    if (isCancelled) return
                    setFormValues(prev => ({ ...prev, role: USER_DATA.role.slice(0, i) }))
                    await new Promise(r => setTimeout(r, isMobile ? 40 : 20))
                }

                await new Promise(r => setTimeout(r, 600))
                if (isCancelled) return
                setTopTemplate('creative')

                // TYPE: Summary (Faster, chunked on mobile)
                const chunkSize = isMobile ? 6 : 1;
                for (let i = 0; i <= USER_DATA.summary.length; i += chunkSize) {
                    if (isCancelled) return
                    const currentSummary = USER_DATA.summary.slice(0, i)
                    setFormValues(prev => ({ ...prev, summary: currentSummary }))

                    if (i === Math.floor(USER_DATA.summary.length / 3)) setTopTemplate('classic')
                    if (i === Math.floor(USER_DATA.summary.length * 2 / 3)) setTopTemplate('executive')

                    await new Promise(r => setTimeout(r, isMobile ? 20 : 5))
                }

                // PHASE: Complete / Scanning
                setPhase('scoring')

                // Switch Templates during scoring (The Final Polish)
                // Reduced rotations on mobile to save memory
                const rotations = isMobile ? 2 : 4;
                for (let i = 0; i < rotations; i++) {
                    if (isCancelled) return
                    rotateStack()
                    await new Promise(r => setTimeout(r, 2000))
                }

                // Loop (Hold on last template for a bit)
                if (isCancelled) return
                setTopTemplate('modern')
                await new Promise(r => setTimeout(r, 5000))
            }
        }

        runSimulation()

        return () => { isCancelled = true }
    }, [isMobile])

    return (
        <section className="pt-16 pb-0 lg:py-16 bg-white overflow-hidden relative border-t border-stone-100">
            {/* Background Texture & Color Blobs - Personality Infusion */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
                <div className="absolute top-[30%] left-[-5%] w-[40%] h-[40%] bg-orange-50/40 blur-[100px] rounded-full" />
                <div className="absolute bottom-[30%] right-[-5%] w-[40%] h-[40%] bg-violet-100/40 blur-[100px] rounded-full animate-pulse-slow" />
            </div>

            <div className="container max-w-7xl mx-auto px-6 relative z-10">

                {/* Header Text - Enhanced Magnitude */}
                <div className="text-center max-w-4xl mx-auto mb-12 md:mb-20 space-y-4 md:space-y-6">
                    <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-violet-600/5 text-violet-600 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] border border-violet-100 shadow-sm rounded-full mb-2">
                        <Wand2 className="w-4 h-4 text-violet-600" />
                        The Magic Builder
                    </div>
                    <h2 className="text-[12vw] sm:text-6xl md:text-6xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black text-stone-900 leading-[0.9] sm:leading-[0.85] tracking-[-0.04em] relative">
                        You Type. <br />
                        <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-rose-500 to-orange-500 font-normal">We Make It Shine.</span>
                        <UnderlineDoodle color="#8B5CF6" className="absolute -bottom-2 lg:-bottom-4 left-1/4 w-1/2 h-6 lg:h-4 opacity-40" />
                    </h2>
                    <p className="text-sm md:text-lg text-stone-600 font-bold max-w-2xl mx-auto leading-relaxed italic px-4">
                        Transform your raw ideas into a professional masterpiece <br className="hidden md:block" /> with the precision of a master architect.
                    </p>
                </div>

                {/* Floating Side Elements - Personality & Context */}
                <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none hidden xl:block overflow-hidden">
                    {/* LEFT SIDE DOODLES */}
                    <div className="absolute top-[40%] left-[2%] w-40 h-20 opacity-10">
                        <CircleDoodle color="#D946EF" className="w-full h-full" />
                    </div>
                    <div className="absolute bottom-[25%] left-[8%] w-24 h-24 opacity-20">
                        <StarDoodle color="#F59E0B" className="w-full h-full animate-pulse" />
                    </div>
                    <div className="absolute bottom-[10%] left-[12%] w-48 h-12 opacity-10">
                        <ScribbleDoodle color="#6366F1" className="w-full h-full" />
                    </div>

                    {/* RIGHT SIDE DOODLES */}
                    <div className="absolute top-[15%] right-[8%] w-24 h-24 opacity-20">
                        <SparkleDoodle color="#8B5CF6" className="w-full h-full" />
                    </div>
                    <div className="absolute top-[45%] right-[3%] w-28 h-28 opacity-20">
                        <CrownDoodle color="#F59E0B" className="w-full h-full rotate-12" />
                    </div>
                    <div className="absolute bottom-[30%] right-[6%] w-20 h-20 opacity-20">
                        <StatusDoodle color="#10B981" className="w-full h-full" />
                    </div>
                    <div className="absolute bottom-[15%] right-[10%] w-32 h-16 opacity-10">
                        <ZigZagDoodle color="#F43F5E" className="w-full h-full" />
                    </div>
                    <div className="absolute top-[10%] left-[25%] w-32 h-12 opacity-10">
                        <BridgeDoodle color="#8B5CF6" className="w-full h-full" />
                    </div>

                    {/* BRAINSTORM: Concept Trail - Visualizing 'Ideas to Professional Data' */}
                    <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[400px]">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: -20, scale: 0 }}
                                animate={{
                                    opacity: [0, 0.4, 0],
                                    y: [0, 150 + (i * 20), 200 + (i * 30)],
                                    x: [0, (i % 2 === 0 ? 50 : -50) * Math.sin(i), (i % 2 === 0 ? 30 : -30)],
                                    scale: [0.5, 1, 0.5]
                                }}
                                transition={{
                                    duration: 4 + (i * 0.5),
                                    repeat: Infinity,
                                    delay: i * 0.8,
                                    ease: "easeInOut"
                                }}
                                style={{ willChange: "transform, opacity" }}
                                className={`hidden md:block absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full 
                                    ${i % 3 === 0 ? 'bg-violet-400' : i % 3 === 1 ? 'bg-rose-400' : 'bg-orange-400'} shadow-lg blur-[1px]`}
                            />
                        ))}
                        {/* Hidden architectural bridge trail */}
                        <svg className="hidden md:block absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" style={{ willChange: "transform" }}>
                            <motion.path
                                d="M 600,0 C 600,100 450,150 400,300"
                                fill="none"
                                stroke="black"
                                strokeWidth="2"
                                strokeDasharray="10 10"
                                animate={{ strokeDashoffset: [0, -20] }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            />
                        </svg>
                    </div>
                </div>

                {/* Split Screen Demo - Responsive Layout */}
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 lg:h-[800px] items-center lg:items-end justify-center relative">

                    {/* LEFT SIDE WRAPPER: Editor + Button */}
                    <div className="absolute lg:relative z-40 lg:z-30 flex flex-col gap-6 w-[360px] lg:-translate-x-8 bottom-[150px] sm:bottom-[180px] lg:bottom-auto -left-4 sm:left-4 lg:left-auto scale-[0.6] sm:scale-[0.75] lg:scale-100 origin-bottom-left pointer-events-none lg:pointer-events-auto">
                        {/* THE SIMPLE EDITOR */}
                        <div className="bg-white rounded-[2rem] lg:rounded-3xl shadow-[0_40px_100px_-10px_rgba(0,0,0,0.3)] lg:shadow-[0_30px_80px_-10px_rgba(0,0,0,0.1)] border-2 lg:border-2 border-stone-200 overflow-hidden flex flex-col h-[400px] md:h-[500px] relative pointer-events-auto">
                            {/* Brainstorm Overlay: Subtle Floating Thought */}
                            <motion.div
                                animate={{ y: [0, -10, 0], opacity: [0.1, 0.3, 0.1] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute -top-12 -left-6 w-20 h-16 pointer-events-none grayscale brightness-150"
                            >
                                <CircleDoodle color="#8B5CF6" className="w-full h-full" />
                            </motion.div>

                            {/* Minimal Header */}
                            <div className="px-6 py-5 border-b border-stone-100 bg-white/50 backdrop-blur-sm relative z-10 flex items-center justify-between">
                                <span className="font-black text-[10px] uppercase tracking-[0.3em] text-stone-900">Editor — Page 01</span>
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            </div>

                            {/* Actual Form UI - Clean & Professional */}
                            <div className="p-6 space-y-6 flex-1 overflow-y-auto bg-white custom-scrollbar relative z-10">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">First Name</label>
                                        <div className="h-12 px-4 bg-white border border-stone-200 rounded-xl flex items-center text-[14px] text-stone-900 font-bold shadow-sm focus-within:border-violet-500 transition-all cursor-text relative group/input">
                                            {formValues.firstName}<span className="animate-pulse text-violet-600 ml-0.5 font-bold">|</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">Last Name</label>
                                        <div className="h-12 px-4 bg-white border border-stone-200 rounded-xl flex items-center text-[14px] text-stone-900 font-bold shadow-sm opacity-60">
                                            {formValues.lastName}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">Target Role</label>
                                    <div className="h-12 px-4 bg-white border border-stone-200 rounded-xl flex items-center text-[14px] text-stone-900 font-bold shadow-sm">
                                        {formValues.role || "E.g. Senior Product Manager"}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">Your Story</label>
                                    <div className="h-40 p-4 bg-white border border-stone-200 rounded-xl text-[13px] text-stone-700 leading-relaxed font-bold relative shadow-sm overflow-hidden">
                                        {formValues.summary || "Strategizing your next career move..."}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* DESKTOP PROFESSIONAL CTA */}
                        <div className="hidden lg:flex flex-col relative">
                            <Link href={isAuthenticated ? "/resume-creator" : "/register"} passHref>
                                <motion.button
                                    whileHover={{ scale: 1.05, y: -4 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group/btn relative w-full px-8 py-7 bg-stone-950 text-white rounded-2xl flex items-center justify-between overflow-hidden shadow-[0_20px_40px_-5px_rgba(0,0,0,0.3)] transition-all border border-stone-800"
                                >
                                    {/* Subtle Professional Underglow */}
                                    <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-violet-600 via-indigo-600 to-rose-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />

                                    <span className="text-[13px] font-black uppercase tracking-[0.25em] relative z-10 text-left">
                                        Craft Your Masterpiece
                                    </span>

                                    <div className="relative z-10 bg-white/10 p-2 rounded-lg">
                                        <ArrowRight className="w-5 h-5 text-white group-hover/btn:translate-x-1 transition-transform duration-300" />
                                    </div>

                                    {/* Professional Hover Overlay */}
                                    <div className="absolute inset-0 bg-white/[0.03] opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none" />
                                </motion.button>
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT: DESKTOP: 3D Stacked Cards Animation */}
                    <div className="hidden lg:flex w-full lg:w-[750px] lg:h-full flex-col items-center justify-center relative group/resume scale-[0.6] sm:scale-[0.75] lg:scale-[0.85] xl:scale-100 origin-center" style={{ perspective: '2000px' }}>

                        {/* THE DESK SURFACE - Subtle & Professional */}
                        <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[140%] h-[400px] bg-gradient-to-b from-stone-50/50 to-stone-100/50 border-t border-stone-200/40 rounded-[4rem] z-0 origin-bottom hidden sm:block"
                            style={{ transform: 'rotateX(60deg)' }} />

                        {/* DESK SHADOW */}
                        <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 w-[90%] h-12 bg-stone-900/[0.04] blur-[60px] rounded-full" />

                        {/* THE STACK OF TEMPLATES */}
                        <div className="relative w-full h-full flex items-center justify-center pt-10" style={{ transformStyle: 'preserve-3d' }}>
                            <AnimatePresence mode="popLayout">
                                {[...stack].reverse().map((t) => {
                                    const i = stack.indexOf(t);
                                    return (
                                        <motion.div
                                            key={t}
                                            initial={false}
                                            animate={{
                                                y: i === 0 ? [null, -40, i * 16] : i * 16,
                                                x: i === 0 ? [null, 600, 0] : i * 14,
                                                rotate: i === 0 ? [null, 12, 0] : -i * 3,
                                                rotateX: -4,
                                                scale: i === 0 ? [null, 1.15, 1] : 1 - (i * 0.04),
                                                opacity: i > 3 ? 0 : 1,
                                                zIndex: i === 0 ? 100 : stack.length - i,
                                                z: i === 0 ? [null, 250, 0] : -i * 60
                                            }}
                                            transition={{
                                                x: {
                                                    duration: i === 0 ? 1.1 : 0.7,
                                                    ease: [0.23, 1, 0.32, 1], // Custom Elite Bezier
                                                    times: [0, 0.5, 1]
                                                },
                                                y: {
                                                    duration: i === 0 ? 1.1 : 0.7,
                                                    ease: [0.23, 1, 0.32, 1],
                                                    times: [0, 0.5, 1]
                                                },
                                                z: {
                                                    duration: i === 0 ? 1.1 : 0.7,
                                                    times: [0, 0.5, 1]
                                                },
                                                rotate: {
                                                    duration: i === 0 ? 1.1 : 0.7,
                                                    ease: "anticipate"
                                                },
                                                scale: {
                                                    duration: i === 0 ? 1.1 : 0.7,
                                                    ease: "easeOut"
                                                },
                                                opacity: { duration: 0.4 },
                                                default: {
                                                    type: "spring",
                                                    stiffness: 80,
                                                    damping: 18
                                                }
                                            }}
                                            style={{ transformStyle: 'preserve-3d', transformOrigin: 'center center' }}
                                            className="absolute w-full max-w-[520px] aspect-[1/1.414]"
                                        >
                                            <ResumeTemplate
                                                type={t}
                                                formValues={formValues}
                                                i={i}
                                                phase={phase}
                                                isTop={i === 0}
                                            />
                                        </motion.div>
                                    )
                                })}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* RIGHT: MOBILE: Simple Flat Fade-In Preview */}
                    <div className="flex lg:hidden w-full h-[480px] sm:h-[550px] flex-col items-center justify-center relative overflow-hidden -my-2 lg:my-0">
                        <div className="relative w-full h-full flex items-center justify-center scale-[0.65] sm:scale-[0.75] origin-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={stack[0]}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="absolute w-[520px] aspect-[1/1.414] shadow-2xl border border-stone-200"
                                >
                                    <ResumeTemplate
                                        type={stack[0]}
                                        formValues={formValues}
                                        i={0}
                                        phase={phase}
                                        isTop={true}
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* MOBILE PROFESSIONAL CTA */}
                    <div className="flex lg:hidden flex-col relative w-full pb-2 pt-12 sm:pt-16 mt-6 px-6 sm:px-12 z-50 items-center">
                        <Link href={isAuthenticated ? "/resume-creator" : "/register"} passHref className="w-full max-w-sm">
                            <motion.button
                                whileHover={{ scale: 1.05, y: -4 }}
                                whileTap={{ scale: 0.98 }}
                                className="group/btn relative w-full px-5 py-4 sm:px-8 sm:py-5 bg-stone-950 text-white rounded-xl sm:rounded-2xl flex items-center justify-between overflow-hidden shadow-[0_10px_30px_-5px_rgba(0,0,0,0.3)] transition-all border border-stone-800"
                            >
                                {/* Subtle Professional Underglow */}
                                <div className="absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-violet-600 via-indigo-600 to-rose-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />

                                <span className="text-[10px] sm:text-[12px] font-black uppercase tracking-widest sm:tracking-[0.2em] relative z-10 text-left">
                                    Craft Your Masterpiece
                                </span>

                                <div className="relative z-10 bg-white/10 p-1.5 sm:p-2 rounded-lg">
                                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover/btn:translate-x-1 transition-transform duration-300" />
                                </div>

                                {/* Professional Hover Overlay */}
                                <div className="absolute inset-0 bg-white/[0.03] opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none" />
                            </motion.button>
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ResumeCreatorDemo;
