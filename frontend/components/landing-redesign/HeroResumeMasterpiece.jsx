"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
    Sparkles,
    CheckCircle2,
    Target,
    ArrowUpRight,
    Search,
    Lightbulb,
    Zap,
    GraduationCap,
    Trophy
} from 'lucide-react'

/**
 * HeroResumeMasterpiece
 * 
 * Concept: A "Living Resume" that identifies its own gaps and builds a bridge to the future.
 * Non-techy, professional, and visually narrative.
 */

// --- The "Soul" of the Resume (Floating Milestones) ---
const Milestone = ({ x, y, delay, icon: Icon, color, isActive }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{
            opacity: isActive ? 1 : 0.4,
            scale: isActive ? 1.3 : 0.9,
            x, y,
            rotate: isActive ? [0, 10, -10, 0] : 0
        }}
        transition={{
            delay,
            duration: 1.5,
            type: "spring",
            rotate: { repeat: Infinity, duration: 5, ease: "easeInOut" }
        }}
        className="absolute z-30"
    >
        <div className={`
            p-5 rounded-2xl bg-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100/50
            flex items-center justify-center backdrop-blur-md
            ${isActive ? 'ring-2 ring-blue-500/30' : ''}
        `}>
            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${color} text-white shadow-lg`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
        {isActive && (
            <motion.div
                className="absolute inset-0 rounded-2xl bg-blue-500/20 blur-2xl -z-10"
                animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
            />
        )}
    </motion.div>
)

const HeroResumeMasterpiece = () => {
    const [step, setStep] = useState(0) // 0: Start, 1: Scanning, 2: Bridging, 3: Success

    useEffect(() => {
        const loop = async () => {
            while (true) {
                setStep(0)
                await new Promise(r => setTimeout(r, 2000))
                setStep(1)
                await new Promise(r => setTimeout(r, 3000))
                setStep(2)
                await new Promise(r => setTimeout(r, 4000))
                setStep(3)
                await new Promise(r => setTimeout(r, 6000))
            }
        }
        loop()
    }, [])

    // 3D Tilt Logic
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const rotateX = useTransform(mouseY, [-200, 200], [12, -12])
    const rotateY = useTransform(mouseX, [-200, 200], [-12, 12])
    const springX = useSpring(rotateX, { damping: 40, stiffness: 150 })
    const springY = useSpring(rotateY, { damping: 40, stiffness: 150 })

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        mouseX.set(e.clientX - (rect.left + rect.width / 2))
        mouseY.set(e.clientY - (rect.top + rect.height / 2))
    }

    const handleMouseLeave = () => {
        mouseX.set(0)
        mouseY.set(0)
    }

    return (
        <div
            className="relative w-full h-[650px] flex items-center justify-center perspective-2500"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Ambient Animated Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] bg-blue-50/40 rounded-full blur-[120px] mix-blend-multiply" />
                <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] bg-purple-50/40 rounded-full blur-[120px] mix-blend-multiply" />
            </div>

            <div className="relative w-[420px] h-[580px]">

                {/* --- FLOATING CATALYSTS --- */}
                <Milestone
                    icon={Target}
                    color="from-sky-400 to-blue-600"
                    x={-280} y={60}
                    delay={0.2}
                    isActive={step >= 2}
                />
                <Milestone
                    icon={Zap}
                    color="from-amber-400 to-orange-500"
                    x={320} y={180}
                    delay={0.6}
                    isActive={step >= 2}
                />
                <Milestone
                    icon={Trophy}
                    color="from-emerald-400 to-teal-600"
                    x={-240} y={400}
                    delay={1}
                    isActive={step === 3}
                />

                {/* --- THE RESUME --- */}
                <motion.div
                    style={{
                        rotateX: springX,
                        rotateY: springY,
                        transformStyle: 'preserve-3d'
                    }}
                    animate={{
                        z: step === 3 ? 100 : 0,
                        y: step === 3 ? -20 : 0
                    }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="relative z-20 w-full h-full"
                >
                    {/* Dynamic Shadow */}
                    <motion.div
                        className="absolute inset-0 bg-[#0a2540]/5 blur-[60px] rounded-lg -z-10"
                        animate={{
                            scale: step === 3 ? 1.2 : 0.95,
                            opacity: step === 3 ? 0.4 : 0.15,
                            y: step === 3 ? 40 : 10
                        }}
                    />

                    {/* Main Paper Sheet */}
                    <div className={`
                        absolute inset-0 bg-white border border-slate-200/60
                        shadow-[0_45px_100px_-20px_rgba(10,37,64,0.15)] overflow-hidden
                        flex flex-col transition-all duration-1500 ease-in-out
                        ${step === 3 ? 'border-blue-200 shadow-[0_45px_100px_-20px_rgba(59,130,246,0.25)]' : ''}
                    `}>
                        {/* Paper Texture Overlay */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-[0.2] pointer-events-none" />

                        {/* Professional Layout Header */}
                        <div className="p-12 pb-8 border-b border-slate-50 relative">
                            <div className="flex justify-between items-start">
                                <div className="space-y-6 flex-1">
                                    <motion.div
                                        className="h-9 w-48 bg-slate-100 relative overflow-hidden"
                                        animate={{ background: step >= 2 ? 'transparent' : '#f1f5f9' }}
                                    >
                                        {step >= 2 && (
                                            <motion.h2
                                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                                className="text-3xl font-bold text-[#0a2540] tracking-tight"
                                            >
                                                The Graduate
                                            </motion.h2>
                                        )}
                                    </motion.div>
                                    <div className="flex gap-4">
                                        <div className="w-24 h-2 bg-slate-50" />
                                        <div className="w-16 h-2 bg-slate-50" />
                                    </div>
                                </div>
                                <div className="w-20 h-20 bg-slate-50 border border-slate-100 flex items-center justify-center">
                                    <Search className="w-8 h-8 text-slate-100" />
                                </div>
                            </div>
                        </div>

                        {/* Body Content */}
                        <div className="p-12 space-y-16 flex-1 relative">

                            {/* Cinematic Scanner */}
                            <AnimatePresence>
                                {step === 1 && (
                                    <motion.div
                                        initial={{ top: '0%', opacity: 0 }}
                                        animate={{ top: '100%', opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 3, ease: "linear" }}
                                        className="absolute inset-x-0 h-48 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent z-10 pointer-events-none"
                                    >
                                        <div className="h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_40px_rgba(59,130,246,0.6)]" />
                                        <motion.div
                                            className="absolute top-0 right-12 bg-blue-500 text-[9px] font-black text-white px-2 py-0.5 tracking-widest uppercase"
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        >
                                            Analyzing Gaps
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Section: Your Story */}
                            <div className="space-y-6">
                                <div className="h-2 w-32 bg-slate-100" />
                                <div className="space-y-3">
                                    <div className="w-full h-2.5 bg-slate-50" />
                                    <div className="w-11/12 h-2.5 bg-slate-50" />
                                    <div className="w-4/5 h-2.5 bg-slate-50" />
                                </div>
                            </div>

                            {/* Section: MISSING PIECES (The Heart of the Art) */}
                            <div className="space-y-8 relative">
                                <div className="flex justify-between items-end">
                                    <div className="h-2 w-48 bg-slate-100" />
                                </div>

                                <div className="grid grid-cols-2 gap-6 pb-4">
                                    {/* Physical Gap Slots */}
                                    {[0, 1].map((i) => (
                                        <div key={i} className="relative h-20 border-2 border-dashed border-slate-100 bg-[#fbfcfd] flex items-center justify-center group overflow-hidden">
                                            <AnimatePresence>
                                                {step >= 2 && (
                                                    <motion.div
                                                        initial={{ y: 40, opacity: 0, filter: 'blur(10px)' }}
                                                        animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                                                        className="absolute inset-0 bg-white shadow-xl flex flex-col p-4 gap-2 z-10 border-l-[6px] border-blue-500"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                                            <div className="w-24 h-2 bg-slate-100" />
                                                        </div>
                                                        <div className="w-full h-2 bg-slate-50" />
                                                        <div className="w-2/3 h-2 bg-slate-50" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* Empty Placeholder Text (Cinematic) */}
                                            {step < 2 && (
                                                <motion.span
                                                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                    className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]"
                                                >
                                                    Missing Piece
                                                </motion.span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* Status Bar / Success Meter */}
                        <div className="p-12 pt-8 bg-[#fbfcfd] border-t border-slate-100 flex items-center justify-between mt-auto">
                            <div className="space-y-4">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Hiring Readiness</span>
                                <div className="flex items-center gap-6">
                                    <motion.span
                                        key={step}
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className={`text-6xl font-black italic tracking-tighter ${step === 3 ? 'text-[#0a2540]' : 'text-slate-200'}`}
                                    >
                                        {step === 0 ? '42' : step === 1 ? '74' : step === 2 ? '89' : '98'}
                                    </motion.span>
                                    <div className="w-40 h-2 bg-slate-100 relative overflow-hidden rounded-full">
                                        <motion.div
                                            animate={{ width: step === 0 ? '42%' : step === 1 ? '74%' : step === 2 ? '89%' : '100%' }}
                                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* --- THE MASTERPIECE ROADMAP (The "Bridge") --- */}
                <AnimatePresence>
                    {step >= 2 && (
                        <motion.div
                            initial={{ opacity: 0, y: 100, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute -bottom-12 left-1/2 -translate-x-1/2 z-30 w-full max-w-[280px]"
                        >
                            <div className="bg-white/80 backdrop-blur-xl border border-blue-100 p-4 shadow-2xl flex flex-col gap-3">
                                <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-blue-600" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">Your Action Path</span>
                                </div>
                                <div className="space-y-2">
                                    {[1, 2].map(i => (
                                        <motion.div
                                            key={i}
                                            initial={{ x: -10, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: i * 0.2 }}
                                            className="flex items-center justify-between p-2 bg-blue-50/50 border border-blue-50 text-[10px] font-bold text-blue-700"
                                        >
                                            <span>Milestone {i}</span>
                                            <ArrowUpRight className="w-3 h-3" />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* --- SUCCESS OVERLAY --- */}
                <AnimatePresence>
                    {step === 3 && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute -top-10 -right-10 z-50 bg-white p-4 shadow-2xl border border-emerald-100 rounded-xl"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 text-emerald-600" />
                                </div>
                                <div>
                                    <div className="text-[10px] font-black text-slate-800 uppercase tracking-tight">Outcome</div>
                                    <div className="text-sm font-bold text-emerald-700">Ready for Interview</div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    )
}

export default HeroResumeMasterpiece
