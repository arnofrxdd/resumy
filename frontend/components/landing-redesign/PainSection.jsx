"use client"

import React, { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, FileX, Check, Search, AlertCircle, XCircle, Skull, Zap, Plus } from 'lucide-react'
import { UnderlineDoodle, SparkleDoodle, CircleDoodle, ScribbleDoodle, ArrowDoodle, ZigZagDoodle, CrossDoodle, BoxDoodle, GaplyAvatar } from './DoodleAnimations'
import { useIsMobile } from '@/hooks/useIsMobile'

// --- DIAGNOSTIC VISUALS ---

const ATSVisual = React.memo(({ isHovered }) => {
    const isMobile = useIsMobile()
    return (
        <div className="relative w-full h-full flex items-center justify-center pt-8 will-change-transform">
            <div className="relative z-10 w-full px-12">
                <div className="bg-white rounded-xl shadow-2xl border border-stone-100 overflow-hidden relative">
                    <div className="bg-rose-50 px-5 py-3 border-b border-rose-100 flex justify-between items-center">
                        <span className="text-xs font-black text-rose-600 uppercase tracking-widest">ATS Diagnostic</span>
                        <Skull className="w-4 h-4 text-rose-500" />
                    </div>
                    <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between group/line">
                            <div className="h-2.5 w-32 bg-stone-100 rounded-full overflow-hidden relative">
                                <motion.div
                                    initial={{ width: "30%" }}
                                    animate={(isHovered || isMobile) ? { width: ["30%", "100%", "30%"] } : { width: "30%" }}
                                    transition={(isHovered || isMobile) ? { duration: isMobile ? 5 : 3, repeat: Infinity } : {}}
                                    className="h-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
                                />
                            </div>
                            <span className="text-xs font-black text-rose-600">30% Match</span>
                        </div>
                        <div className="space-y-1.5 opacity-60">
                            {['Architecture', 'Scalability', 'Infrastructure'].map((tag, i) => (
                                <div key={tag} className="flex items-center gap-2.5">
                                    <XCircle className="w-3 h-3 text-rose-400" />
                                    <span className={`text-[11px] font-bold text-stone-500 ${(isHovered || isMobile) && i === 1 ? 'text-rose-600 line-through' : ''}`}>{tag} missing</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {(isHovered || isMobile) && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute -right-2 top-0 bg-stone-900 text-white text-[8px] font-black px-2 py-1 rounded shadow-xl rotate-6 border border-stone-700 uppercase"
                    >
                        Filtered
                    </motion.div>
                )}
                {(isHovered || isMobile) && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60 pointer-events-none">
                        <CrossDoodle color="#f43f5e" className="w-48 h-48" />
                    </div>
                )}
            </div>

            {/* Animated Falling Resumes for ATS metaphor - Disabled on mobile to save memory */}
            {!isMobile && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ y: -100, opacity: 0, rotate: 0 }}
                            animate={isHovered ? {
                                y: [0, 200],
                                opacity: [0, 1, 0],
                                rotate: [0, 45]
                            } : {}}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: i * 1,
                                ease: "linear"
                            }}
                            className="absolute left-1/2 -translate-x-1/2 w-8 h-10 bg-white/40 border border-white/20 rounded shadow-sm"
                        />
                    ))}
                </div>
            )}
        </div>
    )
})

const SkillsVisual = React.memo(({ isHovered }) => {
    const isMobile = useIsMobile()
    return (
        <div className="relative w-full h-full flex items-center justify-center pt-8 will-change-transform">
            <div className="relative z-10 grid grid-cols-4 gap-1.5 bg-white p-4 rounded-2xl shadow-2xl border border-stone-50 rotate-[-4deg]">
                {[...Array(12)].map((_, i) => {
                    const isMissing = i === 4 || i === 7 || i === 9;
                    return (
                        <motion.div
                            key={i}
                            initial={false}
                            animate={(isHovered || isMobile) && isMissing ? {
                                backgroundColor: ["#fef2f2", "#fee2e2", "#fef2f2"],
                                borderColor: ["#fecaca", "#fca5a5", "#fecaca"],
                                scale: [1, 0.9, 1]
                            } : {
                                backgroundColor: isMissing ? "#f9fafb" : "#f0fdf4",
                                borderColor: isMissing ? "#f3f4f6" : "#dcfce7"
                            }}
                            transition={isMissing ? { duration: isMobile ? 4 : 2, repeat: Infinity } : {}}
                            className="w-8 h-8 rounded-lg border-2 flex items-center justify-center"
                        >
                            {isMissing ? (
                                <AlertCircle className={`w-3.5 h-3.5 ${(isHovered || isMobile) ? 'text-rose-500' : 'text-stone-300'}`} />
                            ) : (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                            )}
                        </motion.div>
                    )
                })}
                <motion.div
                    className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-4 flex items-center justify-between"
                    animate={(isHovered || isMobile) ? {
                        opacity: [0.2, 0.5, 0.2]
                    } : { opacity: 0.8 }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <div className="w-1/3 h-full bg-rose-200 rounded-full blur-[2px]" />
                    <div className="w-1/3 h-full bg-rose-200 rounded-full blur-[2px]" />
                </motion.div>
                {(isHovered || isMobile) && (
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-[8px] font-black px-3 py-1 rounded-full whitespace-nowrap shadow-lg">
                        CRITICAL GAP DETECTED
                    </div>
                )}
            </div>
        </div>
    )
})

const ProofVisual = React.memo(({ isHovered }) => {
    const isMobile = useIsMobile()
    return (
        <div className="relative w-full h-full flex items-center justify-center pt-8 will-change-transform">
            <div className="relative z-10 w-full px-10">
                <div className="bg-stone-900 rounded-xl shadow-2xl overflow-hidden border border-stone-800">
                    <div className="h-6 bg-stone-800 flex items-center gap-1.5 px-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <div className="p-5 font-mono text-[11px] space-y-3">
                        <div className="text-stone-400 flex justify-between">
                            <span>$ query --repo "ProjectX"</span>
                            <span className="text-rose-500 font-bold">FAILED</span>
                        </div>
                        <div className="h-px bg-stone-800" />
                        <div className={`${(isHovered || isMobile) ? 'text-white' : 'text-stone-500'} transition-colors leading-relaxed`}>
                            {"> Verifying scalability claims..."} <br />
                            {(isHovered || isMobile) && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-rose-400 font-black"
                                >
                                    [ERR] No deployment traces found.
                                </motion.span>
                            )}
                        </div>
                    </div>
                </div>
                {(isHovered || isMobile) && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md rounded-full p-2 border border-white/20">
                        <Search className="w-6 h-6 text-white animate-pulse" />
                    </div>
                )}
            </div>
        </div>
    )
})


const Typewriter = ({ text }) => {
    const isMobile = useIsMobile()
    const [displayText, setDisplayText] = useState('')
    const [isStarted, setIsStarted] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsStarted(true)
                } else {
                    setIsStarted(false)
                    setDisplayText('')
                }
            },
            { threshold: 0.2 }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!isStarted) return
        let i = 0
        const interval = setInterval(() => {
            // Speed up typing on mobile by chunking, but it's a small string so let's just make it faster
            const skip = isMobile ? 3 : 1;
            setDisplayText(text.slice(0, i))
            i += skip
            if (i > text.length) {
                setDisplayText(text)
                clearInterval(interval)
            }
        }, isMobile ? 40 : 60)
        return () => clearInterval(interval)
    }, [isStarted, text, isMobile])


    return (
        <span ref={ref} className="relative inline-block isolate max-w-full">
            <span className="opacity-0 italic font-serif leading-none select-none" aria-hidden="true">{text}</span>
            <span className="absolute inset-0 italic font-serif leading-none text-center md:text-left">
                {displayText}
                {isStarted && displayText.length < text.length && (
                    <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ repeat: Infinity, duration: 0.5 }}
                        className="inline-block w-1.5 h-[1em] bg-violet-400 ml-1 align-middle"
                    />
                )}
            </span>
        </span>
    )
}

const PainCard = ({ title, subtext, desc, type, color, delay }) => {
    const [isHovered, setIsHovered] = useState(false)
    const isMobile = useIsMobile()

    return (
        <motion.div
            initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            animate={isMobile ? { opacity: 1, y: 0 } : undefined}
            whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative overflow-hidden rounded-[2rem] p-5 sm:p-6 lg:p-10 min-h-[400px] lg:min-h-[520px] border flex flex-col transition-all duration-700 bg-[#0f0f11] border-white/5 hover:border-violet-500/40 shadow-2xl hover:shadow-violet-500/20 cursor-default hover:-translate-y-2 will-change-transform"
        >
            <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

            <div className="h-44 sm:h-56 mb-8 sm:mb-12 relative scale-[0.9] sm:scale-100 origin-center">
                <div className="relative z-10 h-full">
                    {type === 'ats' && <ATSVisual isHovered={isHovered} />}
                    {type === 'skills' && <SkillsVisual isHovered={isHovered} />}
                    {type === 'proof' && <ProofVisual isHovered={isHovered} />}
                </div>
            </div>

            <div className="mt-auto space-y-5 relative z-10">
                <div className="flex items-center gap-3">
                    <div className={`w-2 h-8 rounded-full ${color} shadow-[0_0_15px_rgba(139,92,246,0.3)]`} />
                    <span className="text-[12px] font-black uppercase tracking-[0.3em] text-white/40">{subtext}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight group-hover:text-violet-400 transition-colors">
                    {title}
                </h3>
                <p className="text-stone-400 text-sm lg:text-base leading-relaxed font-bold group-hover:text-stone-300 transition-colors">
                    {desc}
                </p>

                <div className="pt-4 flex items-center gap-2">
                    <div className={`h-1.5 w-0 group-hover:w-16 transition-all duration-700 rounded-full ${color}`} />
                    <span className="text-[10px] font-black text-white uppercase opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap tracking-widest">See how it works</span>
                </div>
            </div>

            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </motion.div>
    )
}

const PainSection = () => {
    const [isHovered, setIsHovered] = useState(false)
    const isMobile = useIsMobile()

    return (
        <section className="py-20 lg:py-32 bg-[#0a0a0b] relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full opacity-60 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[70%] h-[70%] bg-violet-600/10 blur-[80px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-rose-600/5 blur-[80px] rounded-full" />
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
            </div>

            <div className="container max-w-7xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    animate={isMobile ? { opacity: 1, y: 0 } : undefined}
                    whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-10 lg:gap-12 mb-16 lg:mb-24 relative z-20 px-0 lg:px-4"
                >
                    <div className="text-center lg:text-left max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 lg:px-4 py-1.5 lg:py-2 rounded-xl bg-violet-600/10 text-violet-400 border border-violet-500/20 shadow-[0_0_20px_rgba(139,92,246,0.1)] mb-6 lg:mb-8 lg:rotate-[-1deg] uppercase text-[10px] lg:text-xs font-black tracking-[0.3em]">
                            <AlertCircle className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                            THE REALITY CHECK
                        </div>

                        <h2 className="text-[12vw] sm:text-5xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black text-white tracking-tighter leading-[0.9] sm:leading-[0.85] flex flex-col">
                            <span>Why <span className="font-serif italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-rose-400 to-violet-400 px-2 lg:px-3 relative inline-block">
                                75%
                                <CircleDoodle color="#8B5CF6" className="absolute -inset-2 lg:-inset-4 w-[110%] lg:w-[130%] h-[110%] lg:h-[130%] opacity-100 shrink-0 brightness-125 saturate-150" />
                            </span></span>
                            <span className="mt-4 sm:mt-2">Never Get Hired</span>
                        </h2>
                    </div>

                    <div className="lg:max-w-sm text-center lg:text-right relative mt-6 lg:mt-0 px-4 lg:px-0">
                        <p className="text-lg md:text-2xl text-stone-400 font-bold leading-[1.3] lg:leading-[1.2] tracking-tight italic relative z-10">
                            "It's not about your talent. <br className="hidden lg:block" />
                            It's about how the world <br className="hidden lg:block" />
                            <span className="text-white font-black underline decoration-violet-500 decoration-[4px] lg:decoration-[6px] underline-offset-[6px] lg:underline-offset-[8px]">filters you out</span> <br />
                            before you ever get a chance."
                        </p>
                        <SparkleDoodle color="#F97316" className="absolute -top-6 lg:-top-8 lg:-left-8 left-4 w-10 h-10 lg:w-12 lg:h-12 opacity-40 animate-pulse" />
                        <div className="mt-4 lg:mt-3 text-[9px] font-black text-stone-500 uppercase tracking-[0.3em] lg:text-right">Structural Barrier Detection</div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                    <PainCard
                        title="The ATS Black Hole"
                        subtext="The Machine Filter"
                        desc="75% of resumes are rejected by software before a human even sees them. We show you exactly where the 'bots' are flagging your profile."
                        type="ats"
                        color="bg-rose-500"
                        delay={0.1}
                    />
                    <PainCard
                        title="The Invisible Skill Gap"
                        subtext="The Hidden Barrier"
                        desc="You might have the skills, but if you don't have the specific 'Proof of Proof' companies want in 2024, you're invisible to recruiters."
                        type="skills"
                        color="bg-orange-500"
                        delay={0.2}
                    />
                    <PainCard
                        title="The Trust Deficit"
                        subtext="The Proof Problem"
                        desc="Generic projects don't work anymore. We help you build the 'Industry Grade' evidence that makes hiring managers trust your ability instantly."
                        type="proof"
                        color="bg-violet-500"
                        delay={0.3}
                    />
                </div>

                <div className="mt-16 lg:mt-24 p-6 lg:p-12 bg-white rounded-[3rem] relative overflow-hidden group shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-stone-100 flex flex-col items-center text-center">
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#8b5cf6 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                    <div className="absolute top-0 right-0 w-96 h-96 bg-violet-100 blur-[60px] group-hover:bg-violet-200 transition-colors duration-1000" />

                    <div className="relative z-10 max-w-3xl">
                        <div className="inline-flex items-center gap-2 mb-6 bg-violet-50 px-4 py-2 rounded-xl border border-violet-100 shadow-sm">
                            <SparkleDoodle color="#8B5CF6" className="w-5 h-5" />
                            <span className="text-[10px] lg:text-[12px] font-black text-violet-600 uppercase tracking-widest">Confidence Boost</span>
                        </div>

                        <h3 className="text-[10vw] sm:text-5xl lg:text-6xl font-black text-stone-900 mb-8 tracking-tighter leading-[1]">
                            Stop guessing. <br />
                            <span className="font-serif italic text-violet-600 font-normal block mt-2">
                                <Typewriter text="Start landing interviews." />
                            </span>
                        </h3>

                        <p className="text-stone-500 text-sm sm:text-xl font-bold leading-relaxed italic max-w-xl mx-auto px-4">
                            Join thousands of students who stopped sending resumes into a black hole and started getting real responses.
                        </p>

                        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
                            <motion.button
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                whileHover={{ scale: 1.05, y: -4 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full sm:w-auto px-10 py-5 bg-violet-600 text-white rounded-2xl font-black text-base shadow-[0_20px_50px_rgba(139,92,246,0.3)] flex items-center justify-center gap-3 transition-all border-b-[6px] border-violet-800 active:border-b-0 hover:bg-violet-700 tracking-wider"
                            >
                                Show Me My Gaps
                                <ArrowRight className="w-6 h-6" />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-20">
                <ZigZagDoodle color="#8B5CF6" className="w-56 h-10" />
            </div>
        </section>
    )
}

export default PainSection
