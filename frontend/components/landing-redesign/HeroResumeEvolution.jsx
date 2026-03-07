"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
    CheckCircle2,
    Target,
    PenLine,
    MapPin,
    Mail,
    Phone,
    Globe,
    Linkedin,
    Github,
    Sparkles,
    Crown
} from 'lucide-react'
import { SparkleDoodle, ArrowDoodle, ScribbleDoodle, UnderlineDoodle, CrownDoodle, StarDoodle, ZigZagDoodle, BridgeDoodle } from './DoodleAnimations'
import { useIsMobile } from '@/hooks/useIsMobile'
import avatarImg from './Screenshot 2026-02-19 223339.png'

const USER_DATA = {
    name: "Evelyn Vane",
    avatar: avatarImg.src || avatarImg,
    role: "Senior Product Designer | Design Systems Lead | UX Researcher",
    email: "evelyn.vane@design.io",
    phone: "+1 (555) 012-3456",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/evelynvane",
    website: "evelyn-designs.co",
    summary: "Crafting intuitive digital experiences for global scale. Specializing in design systems and user-centric product architecture with a focus on accessibility and motion design. Proven track record of leading design teams from concept to supporting millions of users.",
    skills: [
        { name: "Figma & Design Systems", level: 5 },
        { name: "UX Research & Testing", level: 5 },
        { name: "Prototyping & Motion", level: 5 },
        { name: "React & Tailwind CSS", level: 5 },
        { name: "Product Strategy", level: 5 },
        { name: "Visual Identity", level: 4 },
        { name: "Accessibility (WCAG)", level: 4 },
        { name: "Team Leadership", level: 4 }
    ],
    experience: [
        {
            role: "Principal Product Designer",
            company: "PixelPerfect Labs",
            location: "San Francisco, CA",
            period: "2021 — PRESENT",
            points: [
                "Led the overhaul of the global design system, reducing design-to-development handoff time by 50% across 4 cross-functional squads.",
                "Spearheaded user research for core product features, resulting in a 25% increase in day-30 user retention.",
                "Established accessibility guidelines that brought the platform into full WCAG 2.1 AA compliance."
            ]
        },
        {
            role: "Senior UX Designer",
            company: "CreativeFlow Studio",
            location: "San Francisco, CA",
            period: "2018 — 2021",
            points: [
                "Designed and launched a new e-commerce mobile app that reached 1M+ downloads within the first 6 months.",
                "Conducted 50+ usability testing sessions to iterate on high-fidelity prototypes, improving checkout conversion by 15%.",
                "Mentored 3 junior designers and introduced a centralized component library."
            ]
        }
    ],
    education: {
        school: "Stanford University",
        degree: "MS in Computer Science",
        year: "2018"
    }
}

const HeroResumeEvolution = () => {
    const isMobile = useIsMobile()
    const containerRef = useRef(null)
    const isInView = useInView(containerRef, { amount: 0.1 })
    const [formValues, setFormValues] = useState({ name: "", role: "", summary: "", skills: [], email: "" })
    const [progress, setProgress] = useState(0)
    const [phase, setPhase] = useState('typing') // typing, holding, backspacing
    const [randomBits, setRandomBits] = useState([])

    useEffect(() => {
        // Generate random bits only on the client to avoid hydration mismatch
        const bits = [...Array(isMobile ? 3 : 6)].map((_, i) => ({
            id: i,
            width: Math.random() * 8 + 4,
            height: Math.random() * 8 + 4,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            duration: 3 + i,
            delay: i * 0.5
        }))
        setRandomBits(bits)
    }, [isMobile])

    useEffect(() => {
        if (!isInView) return // Optimization: Stop loops when not visible

        let isCancelled = false

        const runCycle = async () => {
            while (!isCancelled) {
                setPhase('typing')
                setFormValues({ name: "", role: "", summary: "", skills: [], email: "" })
                setProgress(0)
                await new Promise(r => setTimeout(r, 1000))

                // Type Name
                for (let i = 0; i <= USER_DATA.name.length; i++) {
                    if (isCancelled) return
                    setFormValues(prev => ({ ...prev, name: USER_DATA.name.slice(0, i) }))
                    setProgress(Math.floor((i / USER_DATA.name.length) * 10))
                    await new Promise(r => setTimeout(r, isMobile ? 80 : 40)) // Slower on mobile
                }

                if (isCancelled) return
                setFormValues(prev => ({ ...prev, email: USER_DATA.email, role: USER_DATA.role }))
                await new Promise(r => setTimeout(r, 600))

                // Type Summary - Chunked characters to dramatically reduce React re-renders!
                const chunkSize = isMobile ? 12 : 6;
                for (let i = 0; i <= USER_DATA.summary.length; i += chunkSize) {
                    if (isCancelled) return
                    let currentVal = USER_DATA.summary.slice(0, Math.min(i + chunkSize, USER_DATA.summary.length));
                    setFormValues(prev => ({ ...prev, summary: currentVal }))
                    setProgress(20 + Math.floor((currentVal.length / USER_DATA.summary.length) * 40))
                    await new Promise(r => setTimeout(r, isMobile ? 60 : 30))
                }

                // Type Skills
                for (let i = 0; i < USER_DATA.skills.length; i++) {
                    if (isCancelled) return
                    setFormValues(prev => ({ ...prev, skills: [...prev.skills, USER_DATA.skills[i]] }))
                    setProgress(60 + Math.floor(((i + 1) / USER_DATA.skills.length) * 40))
                    await new Promise(r => setTimeout(r, isMobile ? 400 : 200))
                }

                if (isCancelled) return
                setProgress(100)
                setPhase('holding')
                await new Promise(r => setTimeout(r, 6000)) // Hold longer

                if (isCancelled) return
                setPhase('backspacing')
                setFormValues({ name: "", role: "", summary: "", skills: [], email: "" })
                setProgress(0)
                await new Promise(r => setTimeout(r, 2000))
            }
        }

        runCycle()
        return () => { isCancelled = true }
    }, [isMobile, isInView]) // Re-run if mobile status or visibility changes


    return (
        <div ref={containerRef} className="relative w-full max-w-[800px] flex items-center justify-center py-6 lg:py-16 px-4 md:px-6 scale-[0.85] sm:scale-[0.9] md:scale-[0.75] lg:scale-[0.55] xl:scale-[0.77] 2xl:scale-100 origin-top lg:origin-center transition-transform duration-500 -mt-10 sm:-mt-6 lg:mt-0 mb-[-40px] md:mb-[-60px] lg:mb-0">
            {/* Backdrop Blur */}
            <div className="absolute inset-0 z-0 text-emerald-500">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/[0.02] blur-[100px] rounded-full" />
            </div>

            <div className="relative">
                {/* 1. COMPACT BUILDER FORM (Floating Bottom Left) */}
                <motion.div
                    initial={{ x: -10, y: 20, opacity: 0 }}
                    animate={{ x: -10, y: 15, opacity: 1 }}
                    className="absolute -left-6 sm:-left-24 bottom-4 sm:bottom-12 z-40 flex flex-col w-[170px] sm:w-[260px] bg-white rounded-xl sm:rounded-2xl shadow-[0_20px_50px_rgba(16,185,129,0.15)] border border-emerald-100 p-3 sm:p-5 space-y-2.5 sm:space-y-4 ring-2 sm:ring-4 ring-emerald-500/5 transition-all"
                >
                    <div className="flex items-center gap-1.5 sm:gap-2.5">
                        <div className="p-1 sm:p-1.5 bg-emerald-100 rounded-lg">
                            <PenLine className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600" />
                        </div>
                        <div className="text-[8px] sm:text-[10px] font-black text-stone-900 uppercase tracking-widest text-emerald-800">Live Optimization</div>
                    </div>

                    <div className="space-y-3">
                        <FormInput
                            label="FullName"
                            value={formValues.name}
                            active={phase === 'typing' && formValues.name.length < USER_DATA.name.length}
                            accentColor="emerald"
                        />
                        <FormInput
                            label="Career Summary"
                            value={formValues.summary}
                            active={phase === 'typing' && formValues.name.length === USER_DATA.name.length && formValues.summary.length < USER_DATA.summary.length}
                            className="h-16 sm:h-24"
                            accentColor="emerald"
                        />
                    </div>

                    <div className="pt-2 sm:pt-3 border-t border-stone-100 flex justify-between items-center text-[7.5px] sm:text-[9px] font-black uppercase tracking-wider">
                        <span className="text-stone-400">ATS Match</span>
                        <span className="text-emerald-600 font-bold">{progress}%</span>
                    </div>

                    {/* Decorative Doodle */}
                    <div className="absolute -top-6 -right-6 rotate-12 opacity-50">
                        <ScribbleDoodle color="#10B981" className="w-12 h-12" />
                    </div>

                    {/* Animated Pulse Dot */}
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-emerald-500/20 animate-ping" />
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 rounded-full bg-emerald-500/40" />
                </motion.div>

                {/* Glibberish / Decorative Elements in between */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute top-[20%] left-[-15%] opacity-20 rotate-[-15deg]">
                        <ZigZagDoodle color="#10B981" className="w-32 h-8" />
                    </div>
                    <div className="absolute bottom-[30%] left-[-20%] opacity-15">
                        <SparkleDoodle color="#F59E0B" className="w-16 h-16 animate-pulse" />
                    </div>
                    <div className="absolute top-[10%] right-[-10%] opacity-10">
                        <BridgeDoodle color="#10B981" className="w-40 h-20" />
                    </div>
                    <div className="absolute bottom-0 right-[-15%] opacity-10 rotate-12">
                        <CrownDoodle color="#F59E0B" className="w-20 h-20" />
                    </div>

                    {/* Abstract Floating Bits - Disabled on mobile to save memory */}
                    <div className="hidden sm:block">
                        {randomBits.map((bit) => (
                            <motion.div
                                key={bit.id}
                                animate={{
                                    y: [0, -20, 0],
                                    rotate: [0, 45, 0],
                                    opacity: [0.1, 0.3, 0.1]
                                }}
                                transition={{
                                    duration: bit.duration,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: bit.delay
                                }}
                                className="absolute bg-emerald-500 rounded-full"
                                style={{
                                    width: bit.width,
                                    height: bit.height,
                                    left: bit.left,
                                    top: bit.top,
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* 2. THE MODERN SPLIT RESUME (Template Style) */}
                <motion.div
                    className="relative z-10 w-[280px] sm:w-[520px] h-[400px] sm:h-[750px] bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col rounded-lg border border-stone-200 transition-all font-inter"
                >
                    {/* Full Width Header (Emerald Accent) */}
                    <div className="w-full bg-[#10B981] p-4 sm:p-8 text-white flex items-center gap-4 sm:gap-6">
                        {/* Profile Picture */}
                        <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-full border-2 sm:border-4 border-white/20 overflow-hidden shadow-xl bg-white/10 shrink-0">
                            <img src={USER_DATA.avatar} alt="profile" className="w-full h-full object-cover" />
                        </div>

                        <div className="flex-1">
                            <motion.h1
                                className="text-xl sm:text-3xl font-black tracking-tight leading-none mb-1 sm:mb-3"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                {formValues.name || "EVELYN VANE"}
                            </motion.h1>
                            <div className="flex items-center flex-wrap gap-x-2 sm:gap-x-3 gap-y-1 text-[7px] sm:text-[10px] font-semibold opacity-90 uppercase tracking-wider">
                                {USER_DATA.role.split('|').map((part, i) => (
                                    <React.Fragment key={i}>
                                        <span>{part.trim()}</span>
                                        {i < USER_DATA.role.split('|').length - 1 && <span className="w-1 h-3 bg-white/40 rounded-full" />}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex overflow-hidden">
                        {/* Main Content (Left Wide) */}
                        <div className="flex-1 p-4 sm:p-8 flex flex-col gap-4 sm:gap-6 bg-white overflow-y-auto custom-scrollbar">
                            {/* Summary */}
                            <section>
                                <h2 className="text-[10px] sm:text-[12px] font-black text-emerald-600 uppercase tracking-widest mb-2 sm:mb-3 pb-1 border-b border-stone-100">
                                    Professional Summary
                                </h2>
                                <p className="text-[8px] sm:text-[10px] text-stone-600 leading-relaxed font-medium">
                                    {formValues.summary}
                                    {phase === 'typing' && progress > 10 && progress < 60 && <span className="inline-block w-1 h-2.5 bg-emerald-500 ml-0.5 animate-pulse" />}
                                </p>
                            </section>

                            {/* Work History */}
                            <section className="flex-1">
                                <h2 className="text-[10px] sm:text-[12px] font-black text-emerald-600 uppercase tracking-widest mb-3 sm:mb-4 pb-1 border-b border-stone-100">
                                    Work History
                                </h2>
                                <div className="space-y-4 sm:space-y-6">
                                    {USER_DATA.experience.map((exp, i) => (
                                        <div key={i} className="grid grid-cols-[60px_1fr] sm:grid-cols-[100px_1fr] gap-2 sm:gap-4">
                                            <div className="text-[8px] sm:text-[10px] font-bold text-stone-500">{exp.period}</div>
                                            <div>
                                                <h3 className="text-[9px] sm:text-[11px] font-black text-stone-900 mb-0.5">{exp.role}</h3>
                                                <div className="text-[8px] sm:text-[10px] font-bold text-emerald-500 italic mb-2 uppercase tracking-tight">{exp.company}, {exp.location}</div>
                                                <div className="space-y-1 sm:space-y-1.5">
                                                    {exp.points.map((pt, j) => (
                                                        <div key={j} className="text-[7px] sm:text-[9px] text-stone-600 leading-snug flex gap-2">
                                                            <span className="text-emerald-500 mt-0.5">•</span>
                                                            {pt}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Sidebar (Right Narrow) */}
                        <div className="w-[35%] sm:w-[30%] bg-stone-50/50 border-l border-stone-100 p-4 sm:p-6 flex flex-col gap-4 sm:gap-8">
                            {/* Contact Section */}
                            <section>
                                <h2 className="text-[9px] sm:text-[11px] font-black text-emerald-600 uppercase tracking-widest mb-3 sm:mb-4 pb-1 border-b border-stone-200">
                                    Contact
                                </h2>
                                <div className="space-y-3 sm:space-y-4">
                                    <ContactItem label="LOCATION" value={USER_DATA.location} icon={<MapPin className="w-3 h-3" />} />
                                    <ContactItem label="PHONE" value={USER_DATA.phone} icon={<Phone className="w-3 h-3" />} />
                                    <ContactItem label="E-MAIL" value={USER_DATA.email} icon={<Mail className="w-3 h-3" />} />
                                    <ContactItem label="LINKEDIN" value={USER_DATA.linkedin} icon={<Linkedin className="w-3 h-3" />} />
                                    <ContactItem label="WEBSITE" value={USER_DATA.website} icon={<Globe className="w-3 h-3" />} />
                                </div>
                            </section>

                            {/* Skills Section */}
                            <section>
                                <h2 className="text-[9px] sm:text-[11px] font-black text-emerald-600 uppercase tracking-widest mb-3 sm:mb-4 pb-1 border-b border-stone-200">
                                    Skills
                                </h2>
                                <div className="space-y-2 sm:space-y-3">
                                    <AnimatePresence>
                                        {/* Show animated skills as they are "typed" or matched */}
                                        {USER_DATA.skills.map((skill, i) => {
                                            const isVisible = formValues.skills.some(s => s.name === skill.name) || phase === 'holding';
                                            if (!isVisible) return null;
                                            return (
                                                <motion.div
                                                    key={skill.name}
                                                    initial={{ opacity: 0, x: 10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="space-y-1"
                                                >
                                                    <div className="text-[7px] sm:text-[9px] font-bold text-stone-700 leading-tight">{skill.name}</div>
                                                    <div className="flex gap-1">
                                                        {[1, 2, 3, 4, 5].map(dot => (
                                                            <div
                                                                key={dot}
                                                                className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${dot <= skill.level ? 'bg-emerald-500' : 'bg-stone-200'}`}
                                                            />
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )
                                        })}
                                    </AnimatePresence>
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Subtle Overlay */}
                    <div className="absolute inset-0 pointer-events-none border-[6px] sm:border-[12px] border-white/10 mix-blend-overlay" />
                </motion.div>

                {/* 3. AUDIT STATUS (Floating Bottom Right) */}
                <motion.div
                    initial={{ x: 30, y: 30, opacity: 0 }}
                    animate={{ x: 20, y: 20, opacity: 1 }}
                    className="absolute -right-6 sm:-right-28 bottom-8 sm:bottom-12 z-50 bg-[#0d0d0e] px-3 sm:px-5 py-2.5 sm:py-4 rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.3)] flex items-center gap-2.5 sm:gap-4 border border-emerald-900 ring-1 ring-white/10 transition-all"
                >
                    <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <CheckCircle2 className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                        <div className="text-[6.5px] sm:text-[9px] font-black text-stone-500 uppercase tracking-widest leading-none mb-0.5 sm:mb-1">ATS Optimization</div>
                        <div className="flex items-baseline gap-1 sm:gap-1.5">
                            <span className="text-lg sm:text-2xl font-black text-white italic font-serif leading-none">
                                {Math.min(99.4, (progress / 100) * 99.4 + 0.4).toFixed(1)}%
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

const ContactItem = ({ label, value, icon }) => (
    <div className="space-y-0.5">
        <div className="text-[8px] font-black text-stone-400 uppercase tracking-wider flex items-center gap-1">
            {label}
        </div>
        <div className="text-[9px] font-bold text-stone-700 break-words leading-tight">
            {value}
        </div>
    </div>
)

const FormInput = ({ label, value, active, className = "", accentColor = "violet" }) => (
    <div className="space-y-0.5 sm:space-y-1">
        <div className={`text-[7px] sm:text-[8px] font-black flex items-center gap-1 sm:gap-1.5 uppercase tracking-widest ${active ? 'text-emerald-600' : 'text-stone-400'}`}>
            <div className={`w-1 h-1 rounded-full ${active ? 'bg-emerald-500 shadow-[0_0_10px_#10B981]' : 'bg-stone-200'}`} />
            {label}
        </div>
        <div className={`px-2 py-1.5 sm:px-3 sm:py-2.5 rounded-md sm:rounded-lg text-[8px] sm:text-[10px] font-bold border transition-all duration-300 min-h-[26px] sm:min-h-[34px] flex items-start leading-tight bg-stone-50 border-stone-100 text-stone-800 ${active ? 'border-emerald-200 ring-2 sm:ring-4 ring-emerald-500/5 shadow-inner' : ''} ${className}`}>
            <span className="break-words w-full">
                {value}
                {active && <span className="inline-block w-1 h-2 sm:h-2.5 ml-0.5 animate-pulse bg-emerald-400" />}
            </span>
        </div>
    </div>
)

export default HeroResumeEvolution
