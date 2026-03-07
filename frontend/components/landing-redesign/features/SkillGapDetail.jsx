"use client"

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Target, ArrowRight, ShieldCheck, Zap, FileText, Magnet, Sparkles, AlertCircle, Plus } from 'lucide-react'
import {
    CircleDoodle,
    SparkleDoodle,
    ZigZagDoodle,
    BridgeDoodle,
    ArrowDoodle,
    UnderlineDoodle,
    ScribbleDoodle
} from '../DoodleAnimations'
import { useIsMobile } from '@/hooks/useIsMobile'

const Typewriter = ({ text }) => {
    const isMobile = useIsMobile()
    const [displayText, setDisplayText] = React.useState('')
    const [isStarted, setIsStarted] = React.useState(false)
    const ref = React.useRef(null)

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsStarted(true)
                }
            },
            { threshold: 0.1 }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])

    React.useEffect(() => {
        if (!isStarted) return
        let i = 0
        const skip = isMobile ? 3 : 1
        const interval = setInterval(() => {
            setDisplayText(text.slice(0, i))
            i += skip
            if (i > text.length + skip) {
                setDisplayText(text)
                clearInterval(interval)
            }
        }, 50)
        return () => clearInterval(interval)
    }, [isStarted, text, isMobile])

    return <span ref={ref} className={!isMobile ? 'will-change-[contents]' : ''}>{displayText}</span>
}

const SkillGapDetail = ({ isAuthenticated }) => {
    const isMobile = useIsMobile()
    return (
        <section className="py-24 bg-white overflow-hidden relative border-t border-stone-100">
            {/* Artistic Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[5%] left-[-10%] w-[60%] h-[60%] bg-violet-200/40 blur-[150px] rounded-full" />
                <div className="absolute bottom-[5%] right-[-10%] w-[60%] h-[60%] bg-orange-200/40 blur-[150px] rounded-full" />
                <div className="absolute inset-0 opacity-[0.05]"
                    style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '40px 40px' }} />
            </div>

            <div className="container max-w-7xl mx-auto px-6 relative z-10">
                {/* Header Section - Side by Side High Clarity */}
                <motion.div
                    initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    animate={isMobile ? { opacity: 1, y: 0 } : undefined}
                    whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-12 mb-20 relative z-20"
                >
                    <div className="text-center lg:text-left max-w-2xl">
                        <motion.div
                            initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                            animate={isMobile ? { opacity: 1, y: 0 } : undefined}
                            whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-stone-950 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.3em] mb-8 lg:rotate-[-1deg] shadow-[6px_6px_0px_rgba(139,92,246,0.2)] border border-stone-800"
                        >
                            <Magnet className="w-4 h-4 text-violet-400" />
                            Talent Alignment
                        </motion.div>

                        <h2 className="text-5xl md:text-5xl lg:text-6xl font-black text-stone-900 tracking-tighter leading-[0.85] flex flex-col">
                            <span>Build A </span>
                            <span className="relative inline-block mt-3">
                                <span className="relative z-10 font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-rose-500 font-normal">Bridge</span>
                                <UnderlineDoodle color="#8B5CF6" className="absolute -bottom-3 left-0 w-full h-8 opacity-40" />
                            </span>
                            <span className="mt-3">Not A Wall.</span>
                        </h2>
                    </div>

                    <div className="lg:max-w-md text-center lg:text-right relative">
                        <div className="p-8 bg-white border-2 border-stone-900 rounded-[2.5rem] shadow-[12px_12px_0px_rgba(0,0,0,1)] relative z-10 overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 via-indigo-500 to-rose-500" />
                            <p className="text-lg md:text-xl text-stone-900 font-bold italic leading-tight tracking-tight relative z-10">
                                "Your career <span className="text-violet-600">isn't blocked</span> by a wall; <br />
                                it's just missing a <span className="relative">
                                    few planks.
                                    <ScribbleDoodle color="#F97316" className="absolute -bottom-2 lg:left-0 left-1/2 -translate-x-1/2 lg:translate-x-0 w-full h-4 opacity-30" />
                                </span>"
                            </p>
                            <div className="mt-4 text-[9px] font-black text-stone-400 uppercase tracking-[0.3em]">Structural Bridge Theory</div>
                        </div>
                        <SparkleDoodle color="#F97316" className="absolute -top-12 lg:-left-12 left-0 w-16 h-16 opacity-40 animate-pulse" />
                    </div>
                </motion.div>

                <div className="flex flex-col lg:flex-row items-start gap-16 lg:gap-24">
                    {/* LEFT: THE STORY */}
                    <div className="w-full lg:w-[45%] space-y-12">
                        {/* Interactive Steps - Reimagined as "Bridging Phases" */}
                        <div className="space-y-4">
                            {[
                                {
                                    label: "Deconstruct Your Reality",
                                    sub: "We break your resume into its atomic skill components.",
                                    icon: <FileText className="w-5 h-5" />,
                                    color: "bg-violet-500"
                                },
                                {
                                    label: "Map The Landscape",
                                    sub: "We analyze thousands of job listings to identify the ideal candidate matrix.",
                                    icon: <Target className="w-5 h-5" />,
                                    color: "bg-orange-500"
                                },
                                {
                                    label: "Deploy The Bridge",
                                    sub: "A custom roadmap of the 2-3 missing skills that will change everything.",
                                    icon: <Sparkles className="w-5 h-5" />,
                                    color: "bg-emerald-500"
                                }
                            ].map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={isMobile ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                                    animate={isMobile ? { opacity: 1, x: 0 } : undefined}
                                    whileInView={isMobile ? undefined : { opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group flex gap-6 p-6 rounded-3xl hover:bg-stone-50 transition-all cursor-default border-2 border-transparent hover:border-stone-900/5 hover:shadow-xl"
                                >
                                    <div className={`w-14 h-14 rounded-2xl ${step.color} shadow-lg flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                                        {step.icon}
                                    </div>
                                    <div className="space-y-1.5 pt-1">
                                        <div className="text-base font-black text-stone-900 uppercase tracking-widest">{step.label}</div>
                                        <div className="text-sm text-stone-500 font-bold leading-relaxed">{step.sub}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="pt-6">
                            <Link href={isAuthenticated ? "/skill-gap" : "/register"} className="block w-full sm:w-auto sm:inline-block">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group w-full sm:w-auto px-8 py-5 bg-stone-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-4 hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)] transition-all border-b-[6px] border-stone-950 active:border-b-0"
                                >
                                    Analyze My Gap <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT: THE VISUAL METAPHOR - Artistic Bridge (Hidden on Mobile) */}
                    <div className="hidden lg:flex w-full lg:w-[55%] relative flex-col items-center">
                        <div className="relative aspect-square max-w-[550px] w-full mx-auto scale-[0.75] sm:scale-90 lg:scale-100 origin-center">
                            {/* The "Bridge" Concept Art */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                {/* Background Circles - Surgical Decor */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 rounded-full border border-stone-100"
                                />
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-[15%] rounded-full border border-dashed border-stone-200"
                                />
                                <CircleDoodle color="#e2e8f0" className="absolute inset-[-10%] opacity-40 rotate-[15deg]" />

                                {/* THE EMPTY SPACE FILLER: Floating Skill Planks & Analysis Radar */}
                                <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-full h-[30%] z-30 pointer-events-none">
                                    {/* Diagnostic Grid Lines */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-[1px] h-full bg-violet-100/50" />
                                        <div className="w-full h-[1px] bg-violet-100/50" />
                                    </div>

                                    {/* Floating Skill Planks being "calculated" */}
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="absolute left-[15%] top-0 p-3 bg-white border-2 border-stone-900 rounded-xl shadow-[8px_8px_0px_rgba(139,92,246,0.1)] flex items-center gap-3 rotate-[-6deg]"
                                    >
                                        <div className="w-6 h-6 rounded bg-violet-600 flex items-center justify-center text-white"><Plus size={14} strokeWidth={3} /></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-stone-900">Python Mastery</span>
                                    </motion.div>

                                    <motion.div
                                        animate={{ y: [0, 10, 0] }}
                                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                        className="absolute right-[10%] top-12 p-3 bg-white border-2 border-stone-900 rounded-xl shadow-[8px_8px_0px_rgba(249,115,22,0.1)] flex items-center gap-3 rotate-[8deg]"
                                    >
                                        <div className="w-6 h-6 rounded bg-orange-500 flex items-center justify-center text-white"><Plus size={14} strokeWidth={3} /></div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-stone-900">System Design</span>
                                    </motion.div>

                                    {/* Center Radar Scanner */}
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-4 border-violet-100/50"
                                    />
                                </div>

                                {/* THE BRIDGE VISUALIZATION */}
                                <div className="relative w-full h-full flex items-center justify-center p-8">
                                    {/* Left Island: Current State - The "Broken" Resume */}
                                    <motion.div
                                        initial={{ x: -100, opacity: 0 }}
                                        whileInView={{ x: 0, opacity: 1 }}
                                        className="absolute left-0 lg:left-[-20px] top-1/2 -translate-y-1/2 z-20 group"
                                    >
                                        <div className="relative">
                                            {/* THE DUMMY RESUME CARD */}
                                            <div className="w-[180px] h-[240px] bg-white border-2 border-stone-200 rounded-xl shadow-2xl p-4 flex flex-col gap-3 rotate-[-4deg] group-hover:rotate-0 transition-transform duration-500 overflow-hidden relative">
                                                {/* Header Mockup */}
                                                <div className="space-y-1.5 border-b-2 border-stone-100 pb-3">
                                                    <div className="w-1/2 h-2.5 bg-stone-900/10 rounded-full" />
                                                    <div className="w-1/3 h-1.5 bg-stone-900/5 rounded-full" />
                                                </div>

                                                {/* Redacted Lines */}
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <div key={i} className="space-y-1">
                                                        <div className={`h-1 bg-stone-900/5 rounded-full ${i % 2 === 0 ? 'w-full' : 'w-4/5'}`} />
                                                        <div className={`h-1 bg-stone-900/5 rounded-full ${i % 3 === 0 ? 'w-2/3' : 'w-3/4'}`} />
                                                    </div>
                                                ))}

                                                {/* THE "GAP" INDICATOR */}
                                                <div className="absolute top-[45%] left-0 w-full h-[30%] bg-violet-600/5 backdrop-blur-[1px] border-y border-violet-500/20 flex items-center justify-center">
                                                    <div className="px-2 py-1 bg-violet-600 text-white text-[8px] font-black uppercase tracking-widest rounded shadow-lg">Missing Logic</div>
                                                </div>

                                                {/* Bottom Shadow Overlay */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-stone-50/50 to-transparent pointer-events-none" />
                                            </div>

                                            {/* Status Badge */}
                                            <div className="absolute -bottom-4 -right-4 p-4 bg-white border-2 border-stone-900 rounded-2xl shadow-[10px_10px_0px_#1c1917] flex flex-col items-center gap-2 z-10">
                                                <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center text-stone-900 border border-stone-200 shadow-inner">
                                                    <FileText className="w-5 h-5 text-stone-400" />
                                                </div>
                                                <div className="text-[9px] font-black text-stone-900 uppercase tracking-widest">Low Signal</div>
                                                <ScribbleDoodle color="#EF4444" className="absolute -bottom-1 w-12 h-4 opacity-40" />
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Right Island: Target State */}
                                    <motion.div
                                        initial={{ x: 100, opacity: 0 }}
                                        whileInView={{ x: 0, opacity: 1 }}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 z-20"
                                    >
                                        <div className="p-8 bg-stone-900 border-4 border-violet-500 rounded-[2.5rem] shadow-[20px_20px_0px_rgba(139,92,246,0.3)] flex flex-col items-center gap-4 relative group overflow-hidden">
                                            <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-xl">
                                                <Target className="w-8 h-8" />
                                            </div>
                                            <div className="text-xs font-black text-white uppercase tracking-widest italic tracking-tighter">SUCCESS.</div>
                                            <SparkleDoodle color="#10B981" className="absolute -left-4 -top-4 w-12 h-12" />
                                        </div>
                                    </motion.div>

                                    {/* THE BRIDGE ITSELF */}
                                    <div className="absolute inset-x-28 top-1/2 -translate-y-1/2 h-20 flex items-center justify-center">
                                        <BridgeDoodle color="#8B5CF6" className="w-full h-48 opacity-100 drop-shadow-[0_0_15px_rgba(139,92,246,0.2)]" />

                                        {/* Floating Icons on the bridge */}
                                        <motion.div
                                            animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
                                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                            className="absolute left-1/4 top-0 p-3 bg-stone-950 rounded-xl shadow-2xl border-2 border-violet-500 text-violet-400 z-30"
                                        >
                                            <Zap className="w-6 h-6 fill-violet-500" />
                                        </motion.div>

                                        <motion.div
                                            animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                            className="absolute right-1/4 bottom-0 p-3 bg-stone-950 rounded-xl shadow-2xl border-2 border-emerald-500 text-emerald-400 z-30"
                                        >
                                            <ShieldCheck className="w-6 h-6 fill-emerald-500" />
                                        </motion.div>
                                    </div>

                                    {/* Atmospheric Decorations */}
                                    <ArrowDoodle color="#f1f5f9" className="absolute top-0 right-0 w-32 h-32 rotate-[-45deg] opacity-60" />
                                    <ZigZagDoodle color="#8B5CF6" className="absolute bottom-10 left-10 w-24 h-6 opacity-20" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SkillGapDetail
