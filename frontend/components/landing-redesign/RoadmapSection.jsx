"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Search, Hammer, Wand2, Mic, ArrowRight, Star } from 'lucide-react'
import {
    UnderlineDoodle,
    SparkleDoodle,
    ZigZagDoodle,
    CurvyArrowDoodle,
    CircleDoodle,
    BridgeDoodle,
    ScribbleDoodle as ConfusedScribble
} from './DoodleAnimations'
import { useIsMobile } from '@/hooks/useIsMobile'

const ConfusedCandidate = () => (
    <div className="absolute right-0 top-0 w-80 h-96 hidden lg:flex items-center justify-center pointer-events-none z-10 select-none">
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
        >
            {/* Visual Question Marks */}
            <motion.div
                animate={{
                    y: [-10, 10, -10],
                    rotate: [-5, 5, -5]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-12 -left-8 text-4xl font-serif italic text-stone-200 rotate-[-12deg]"
            >
                ?
            </motion.div>
            <motion.div
                animate={{
                    y: [10, -10, 10],
                    rotate: [5, -5, 5]
                }}
                transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                className="absolute -top-4 -right-2 text-3xl font-serif italic text-stone-100 rotate-[15deg]"
            >
                ?
            </motion.div>

            {/* The Avatar */}
            <svg width="240" height="320" viewBox="0 0 240 320" fill="none" className="drop-shadow-2xl">
                {/* Torso */}
                <path d="M40 280 C40 230 80 210 120 210 C160 210 200 230 200 280 L200 320 L40 320 Z" fill="#1c1917" />

                {/* Head - Looking Down */}
                <motion.g
                    animate={{ rotate: [2, 5, 2] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    style={{ originX: '120px', originY: '150px' }}
                >
                    <circle cx="120" cy="150" r="55" fill="#f5f5f4" stroke="#1c1917" strokeWidth="4" />
                    {/* Hair - Messy Design */}
                    <path d="M65 140 C65 100 90 85 120 85 C150 85 175 100 175 140 C175 120 160 100 120 100 C80 100 65 120 65 140 Z" fill="#1c1917" />

                    {/* Confused Eyes - Looking Down & Sideways */}
                    <circle cx="100" cy="165" r="3.5" fill="#1c1917" opacity="0.8" />
                    <circle cx="130" cy="165" r="3.5" fill="#1c1917" opacity="0.8" />

                    {/* Mouth - Simple neutral/confused line */}
                    <path d="M105 185 Q115 188 125 185" stroke="#1c1917" strokeWidth="3" strokeLinecap="round" />

                    {/* Thinking Hand / Scribble */}
                    <ConfusedScribble color="#d1d5db" className="absolute top-20 left-10 w-8 h-8 opacity-40" />
                </motion.g>

                {/* Hand Holding Low-Signal Resume */}
                <motion.g
                    animate={{
                        rotate: [-3, 0, -3],
                        y: [0, 5, 0]
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <rect x="20" y="200" width="70" height="95" rx="4" fill="white" stroke="#e7e5e4" strokeWidth="2" />
                    {/* Messy Resume Lines */}
                    <rect x="35" y="215" width="40" height="2" rx="1" fill="#fee2e2" />
                    <rect x="35" y="225" width="40" height="2" rx="1" fill="#f5f5f4" />
                    <rect x="35" y="235" width="25" height="2" rx="1" fill="#f1f5f9" />

                    {/* Red Marks on Resume */}
                    <circle cx="75" cy="265" r="6" fill="#f43f5e" opacity="0.2" />
                    <path d="M72 262 L78 268 M78 262 L72 268" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" />

                    {/* Hand grasping it */}
                    <rect x="75" y="240" width="18" height="14" rx="7" fill="#f5f5f4" stroke="#1c1917" strokeWidth="2" />
                </motion.g>
            </svg>

            {/* Quote Bubble - Subtle */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -right-24 top-24 bg-white px-5 py-3 rounded-2xl shadow-xl border border-stone-100 rotate-[8deg]"
            >
                <span className="text-[11px] font-black italic text-stone-400 uppercase tracking-widest">Where do <br /> I start?</span>
            </motion.div>
        </motion.div>
    </div>
)

const DiagnosisArt = React.memo(() => {
    const isMobile = useIsMobile()
    return (
        <div className="w-full h-48 relative bg-stone-50 rounded-2xl border border-stone-200 overflow-hidden group/art will-change-transform">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-violet-100/10 to-transparent" />
            <motion.div
                animate={isMobile ? { y: [0, 192] } : { y: [0, 192, 0] }}
                transition={{ duration: isMobile ? 6 : 4, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 right-0 h-[1.5px] bg-violet-500 shadow-[0_0_10px_#8b5cf6] z-10"
            />
            <div className={`absolute inset-0 flex items-center justify-center p-4 ${!isMobile ? 'will-change-transform' : ''}`}>
                <div className="w-20 h-28 bg-white rounded shadow-sm border border-stone-100 flex flex-col p-3 gap-2 rotate-[-5deg]">
                    <div className="h-1.5 w-full bg-stone-100 rounded" />
                    <div className="h-1.5 w-2/3 bg-stone-100 rounded" />
                    <div className="h-1.5 w-full bg-stone-100 rounded" />
                    <div className="h-1.5 w-1/2 bg-violet-200 rounded animate-pulse" />
                    <div className="h-1.5 w-full bg-stone-100 rounded" />
                </div>
                <div className="w-20 h-28 bg-white rounded shadow-lg border-2 border-stone-200 flex flex-col p-3 gap-2 translate-x-3 z-20">
                    <div className="h-2 w-full bg-blue-600 rounded" />
                    <div className="h-1.5 w-2/3 bg-stone-200 rounded" />
                    <div className="h-1.5 w-full bg-stone-100 rounded" />
                    <div className="h-1.5 w-4/5 bg-stone-100 rounded" />
                    <div className="h-1.5 w-full bg-stone-100 rounded" />
                </div>
            </div>
        </div>
    )
})

const BridgeArt = React.memo(() => {
    const isMobile = useIsMobile()
    return (
        <div className="w-full h-48 relative bg-stone-50 rounded-2xl border border-stone-200 overflow-hidden group/art will-change-transform">
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #f97316 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
            </div>
            <div className={`absolute inset-0 flex items-center justify-center gap-3 ${!isMobile ? 'will-change-transform' : ''}`}>
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        animate={isMobile ? (i === 1 ? { height: [60, 90, 60] } : undefined) : {
                            height: i === 1 ? [60, 90, 60] : [40, 70, 40],
                            backgroundColor: i === 1 ? ["#f97316", "#fb923c", "#f97316"] : ["#cbd5e1", "#94a3b8", "#cbd5e1"]
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                        className={`w-10 rounded-xl shadow-sm ${i !== 1 && isMobile ? 'bg-stone-300 h-[55px]' : ''}`}
                    />
                ))}
                <div className="absolute inset-0 flex items-center justify-center">
                    <BridgeDoodle color="#f97316" className="w-32 h-16 opacity-40 rotate-12" />
                </div>
            </div>
        </div>
    )
})

const PolishArt = React.memo(() => {
    const isMobile = useIsMobile()
    return (
        <div className="w-full h-48 relative bg-stone-50 rounded-2xl border border-stone-200 overflow-hidden group/art will-change-transform">
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-50 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                    animate={isMobile ? undefined : {
                        rotateY: [0, 15, 0],
                        boxShadow: ["0 20px 40px rgba(0,0,0,0.05)", "0 30px 60px rgba(16,185,129,0.1)", "0 20px 40px rgba(0,0,0,0.05)"]
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                    className={`w-32 h-32 bg-white rounded-[2rem] shadow-xl border-4 border-stone-900 flex flex-col p-6 gap-3 relative overflow-hidden ${!isMobile ? 'will-change-transform' : ''}`}
                >
                    <div className="absolute top-0 right-0 w-10 h-10 bg-emerald-500 rounded-bl-3xl flex items-center justify-center">
                        <Star className="w-5 h-5 text-white fill-white" />
                    </div>
                    <div className="h-3 w-full bg-stone-900 rounded" />
                    <div className="h-2 w-2/3 bg-stone-100 rounded" />
                    <div className="h-2 w-full bg-stone-100 rounded" />
                    <div className="h-2 w-4/5 bg-stone-100 rounded" />
                    <div className="h-2 w-full bg-emerald-50 rounded" />
                </motion.div>
            </div>
        </div>
    )
})

const SimulationArt = React.memo(() => {
    const isMobile = useIsMobile()
    return (
        <div className="w-full h-48 relative bg-stone-900 rounded-2xl overflow-hidden group/art will-change-transform">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_30%,_#f43f5e_0%,_transparent_50%)]" />
            <div className={`absolute inset-0 flex items-center justify-between px-10 ${!isMobile ? 'will-change-transform' : ''}`}>
                <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center relative">
                    <div className="w-8 h-8 rounded-full bg-white" />
                    <motion.div
                        animate={isMobile ? { scale: [1, 1.1, 1] } : { scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 rounded-full border-4 border-rose-500"
                    />
                </div>
                <div className="flex-1 max-w-[80px] flex flex-col gap-2">
                    {[1, 2, 3].map(i => (
                        <motion.div
                            key={i}
                            animate={isMobile ? undefined : { width: ["100%", "70%", "100%"] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                            className={`h-1.5 bg-white/20 rounded-full ${isMobile ? 'w-full' : ''}`}
                        />
                    ))}
                </div>
                <div className="w-16 h-16 rounded-2xl bg-rose-500 flex items-center justify-center shadow-xl">
                    <Mic className="w-8 h-8 text-white" />
                </div>
            </div>
        </div>
    )
})


const roadmapSteps = [
    {
        number: "01",
        title: "The Diagnosis",
        status: "Gap Discovery",
        desc: "Our AI master architect scans your foundation to find the missing planks in your career bridge.",
        icon: <Search className="w-6 h-6" />,
        art: <DiagnosisArt />,
        color: "violet",
        accent: "bg-violet-500"
    },
    {
        number: "02",
        title: "The Bridge",
        status: "Proof Building",
        desc: "We don't just tell you what's wrong—we build targeted, high-signal projects to fill every single gap.",
        icon: <Hammer className="w-6 h-6" />,
        art: <BridgeArt />,
        color: "orange",
        accent: "bg-orange-500"
    },
    {
        number: "03",
        title: "The Polish",
        status: "Masterpiece Mode",
        desc: "Transform your raw data into a professional masterpiece with AI-guided architect precision.",
        icon: <Wand2 className="w-6 h-6" />,
        art: <PolishArt />,
        color: "emerald",
        accent: "bg-emerald-500"
    },
    {
        number: "04",
        title: "The Simulation",
        status: "Main Character",
        desc: "Practice with our AI hiring managers until you walk into the real interview with zero jitters.",
        icon: <Mic className="w-6 h-6" />,
        art: <SimulationArt />,
        color: "rose",
        accent: "bg-rose-500"
    }
]

const RoadmapSection = () => {
    const isMobile = useIsMobile()
    return (
        <section className="py-16 lg:py-24 bg-white overflow-hidden relative text-stone-900 border-t border-stone-100">
            {/* Background Texture - Clean & Professional */}
            <div className="absolute inset-0 opacity-[0.4] pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[60%] bg-violet-50/50 blur-[60px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[60%] bg-orange-50/50 blur-[60px] rounded-full" />
            </div>

            <div className="container max-w-7xl mx-auto px-6 relative z-10">
                {/* Header Text */}
                <div className="flex flex-col lg:flex-row items-start justify-between relative mb-16 lg:mb-24">
                    <div className="max-w-3xl relative text-center lg:text-left mx-auto lg:mx-0">
                        <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-stone-950 text-white shadow-xl mb-6 lg:mb-8 relative group cursor-default">
                            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400 animate-spin-slow" />
                            <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-[0.2em] break-keep whitespace-nowrap">The Blueprint to Hireability</span>
                            <SparkleDoodle color="#F97316" className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-8 h-8 sm:w-10 sm:h-10 opacity-60" />
                        </div>

                        <h2 className="text-[15vw] sm:text-7xl lg:text-6xl xl:text-7xl font-black text-stone-950 leading-[0.9] sm:leading-[0.85] tracking-[-0.04em] mb-6 lg:mb-8 relative">
                            One Path. <br />
                            <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-rose-500 to-orange-500 font-normal">Zero Guesswork.</span>
                        </h2>

                        <p className="text-sm md:text-xl text-stone-500 font-bold max-w-2xl italic leading-relaxed px-4 lg:px-0 mx-auto">
                            Stop throwing spaghetti at the wall. Follow the architect's roadmap from <span className="text-stone-950 underline decoration-violet-500/20 decoration-4 underline-offset-8">Low Signal to Hired.</span>
                        </p>
                    </div>

                    {/* CONFUSED CANDIDATE AVATAR */}
                    <ConfusedCandidate />
                </div>

                {/* HORIZONTAL STORYLINE ROADMAP */}
                <div className="relative">
                    {/* Connection Arrows (Visible on Desktop) */}
                    <div className="absolute top-[20%] left-0 w-full h-20 pointer-events-none hidden lg:block">
                        <CurvyArrowDoodle color="#D1D5DB" className="absolute left-[22%] top-0 w-24 h-12 rotate-[-10deg] opacity-60" />
                        <CurvyArrowDoodle color="#D1D5DB" className="absolute left-[47%] top-10 w-24 h-12 rotate-[15deg] opacity-60 scale-y-[-1]" />
                        <CurvyArrowDoodle color="#D1D5DB" className="absolute left-[72%] top-0 w-24 h-12 rotate-[-10deg] opacity-60" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative">
                        {roadmapSteps.map((step, i) => (
                            <motion.div
                                key={i}
                                initial={isMobile ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.9, y: 30 }}
                                animate={isMobile ? { opacity: 1, scale: 1, y: 0 } : undefined}
                                whileInView={isMobile ? undefined : { opacity: 1, scale: 1, y: 0 }}
                                transition={{ delay: i * 0.15, duration: 0.6 }}
                                className="group relative"
                            >
                                {/* Step Number - Floating */}
                                <div className="absolute -top-3 -left-3 lg:-top-4 lg:-left-4 w-10 h-10 lg:w-12 lg:h-12 bg-white border border-stone-200 shadow-lg rounded-[1rem] lg:rounded-2xl flex items-center justify-center z-20 group-hover:bg-stone-950 group-hover:text-white transition-all duration-500">
                                    <span className="text-[11px] lg:text-[12px] font-black">{step.number}</span>
                                </div>

                                {/* Main Card */}
                                <div className="relative flex flex-col h-full p-6 sm:p-8 lg:p-10 bg-white border-2 border-stone-100 rounded-3xl lg:rounded-[2.5rem] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.12)] hover:border-violet-500/20 transition-all duration-700 overflow-hidden group/card">

                                    {/* Hover Vibe Accent */}
                                    <div className={`absolute -bottom-12 -right-12 w-32 h-32 ${step.accent} opacity-0 group-hover/card:opacity-10 blur-[30px] transition-opacity duration-700`} />
                                    <div className={`absolute top-0 left-0 w-full h-1 ${step.accent} scale-x-0 group-hover/card:scale-x-100 transition-transform duration-700 origin-left`} />

                                    <div className="mb-6 lg:mb-8 relative overflow-hidden rounded-2xl">
                                        <div className="mb-5 lg:mb-6 scale-[0.85] lg:scale-100 origin-top">
                                            {step.art}
                                        </div>
                                        <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-stone-50 flex items-center justify-center text-stone-950 transition-all duration-500 group-hover/card:scale-110 group-hover/card:bg-stone-950 group-hover/card:text-white group-hover/card:rotate-6 ring-4 ring-transparent group-hover/card:ring-stone-50 absolute -bottom-2 lg:-bottom-4 right-2 lg:right-4 z-20 shadow-lg`}>
                                            <div className="scale-[0.8] lg:scale-100">{step.icon}</div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 lg:space-y-4 mb-8 lg:mb-10">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${step.accent} animate-pulse`} />
                                            <span className="text-[9px] lg:text-[10px] font-black text-stone-400 uppercase tracking-[0.25em]">{step.status}</span>
                                        </div>
                                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-stone-950 tracking-tighter leading-none">{step.title}</h3>
                                        <p className="text-[13px] lg:text-[14px] font-bold text-stone-500 leading-relaxed italic pr-2 lg:pr-4">
                                            {step.desc}
                                        </p>
                                    </div>

                                    <div className="mt-auto pt-5 lg:pt-6 flex items-center justify-between border-t border-stone-50">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-stone-300">Phase Active</span>
                                        <div className="w-10 h-10 rounded-full border border-stone-100 flex items-center justify-center group-hover/card:bg-stone-950 transition-colors">
                                            <ArrowRight className="w-4 h-4 text-stone-300 group-hover/card:text-white group-hover/card:translate-x-0.5 transition-all text-stone-300" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    )
}

export default RoadmapSection
