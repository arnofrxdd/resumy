"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
    Sparkles,
    CheckCircle2,
    ShieldCheck,
    Crown,
    Zap,
    Target,
    Award,
    Rocket,
    Puzzle,
    MessageSquare,
    Star,
    Heart,
    Trophy,
    Briefcase
} from 'lucide-react'

// --- Premium Skill Token ---
const SkillToken = ({ icon: Icon, color, delay, x, y, label }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0, x: 100, y: 50, rotate: 45 }}
        animate={{ opacity: 1, scale: 1, x, y, rotate: 0 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{
            delay,
            type: "spring",
            stiffness: 120,
            damping: 15,
            duration: 0.8
        }}
        className="absolute z-40 group cursor-default"
    >
        <div className={`
            relative p-3 rounded-2xl bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] 
            border border-slate-100 flex items-center gap-3 backdrop-blur-sm
            hover:translate-y-[-4px] transition-transform duration-300
        `}>
            <div className={`p-2 rounded-xl bg-gradient-to-br ${color} text-white shadow-lg`}>
                <Icon className="w-4 h-4" />
            </div>
            <div className="flex flex-col pr-2">
                <span className="text-[10px] font-bold text-slate-800 tracking-tight">{label}</span>
                <div className="flex gap-0.5 mt-0.5">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-2 h-0.5 rounded-full bg-emerald-400" />
                    ))}
                </div>
            </div>

            {/* Subtle Pulse */}
            <div className="absolute inset-0 rounded-2xl ring-2 ring-emerald-400/20 animate-pulse" />
        </div>
    </motion.div>
)

// --- Empty Slot (Silhouette) ---
const EmptySlot = ({ x, y, label }) => (
    <motion.div
        className="absolute border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center bg-slate-50/50"
        style={{ left: x, top: y, width: 120, height: 48 }}
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
    >
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-tight text-center px-2">{label}</span>
    </motion.div>
)

const HeroResumeNexus = () => {
    // Phases: 'seed' -> 'discovering' -> 'building' -> 'masterpiece'
    const [phase, setPhase] = useState('seed')

    // Cycle through phases automatically for a dynamic hero
    useEffect(() => {
        const loop = async () => {
            while (true) {
                setPhase('seed')
                await new Promise(r => setTimeout(r, 2000))

                setPhase('discovering')
                await new Promise(r => setTimeout(r, 2500))

                setPhase('building')
                await new Promise(r => setTimeout(r, 3500))

                setPhase('masterpiece')
                await new Promise(r => setTimeout(r, 6000))
            }
        }
        loop()
    }, [])

    // 3D Tilt Logic
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const rotateX = useTransform(y, [-100, 100], [8, -8])
    const rotateY = useTransform(x, [-100, 100], [-8, 8])

    const springRotateX = useSpring(rotateX, { damping: 25, stiffness: 150 })
    const springRotateY = useSpring(rotateY, { damping: 25, stiffness: 150 })

    function handleMouseMove(event) {
        const rect = event.currentTarget.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        x.set(event.clientX - centerX)
        y.set(event.clientY - centerY)
    }

    function handleMouseLeave() {
        x.set(0)
        y.set(0)
    }

    return (
        <div
            className="relative w-full h-[650px] flex items-center justify-center perspective-1000 select-none"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Ambient Animated Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle_at_center,_var(--stripe-blurple)_0%,_transparent_70%)] opacity-[0.03]" />
                <div className="absolute top-[20%] right-[10%] w-64 h-64 bg-teal-400/5 blur-[100px] rounded-full animate-pulse" />
                <div className="absolute bottom-[20%] left-[10%] w-64 h-64 bg-indigo-400/5 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* --- ANCHOR WRAPPER --- */}
            <div className="relative w-[400px] h-[580px]">

                {/* --- FLOATING ELEMENTS --- */}
                <AnimatePresence>
                    {phase === 'building' && (
                        <>
                            <SkillToken
                                icon={Zap}
                                color="from-blue-500 to-indigo-600"
                                label="Execution"
                                x={-180} y={80} delay={0.2}
                            />
                            <SkillToken
                                icon={Rocket}
                                color="from-orange-500 to-amber-600"
                                label="Strategy"
                                x={240} y={160} delay={0.8}
                            />
                            <SkillToken
                                icon={ShieldCheck}
                                color="from-emerald-500 to-teal-600"
                                label="Reliability"
                                x={-160} y={360} delay={1.4}
                            />
                        </>
                    )}

                    {phase === 'masterpiece' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="absolute -top-16 left-1/2 -translate-x-1/2 z-50"
                        >
                            <div className="bg-white/90 backdrop-blur-xl border border-amber-200 px-6 py-2.5 rounded-full shadow-[0_20px_40px_-10px_rgba(251,191,36,0.3)] flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                                    <Crown className="w-4 h-4 text-amber-600" />
                                </div>
                                <span className="text-xs font-black text-amber-900 uppercase tracking-widest">Mastery Achieved</span>
                                <Sparkles className="w-4 h-4 text-amber-500 animate-spin-slow" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* --- THE RESUME CARD --- */}
                <motion.div
                    style={{
                        rotateX: springRotateX,
                        rotateY: springRotateY,
                        transformStyle: 'preserve-3d'
                    }}
                    animate={{
                        scale: phase === 'masterpiece' ? 1.05 : 1,
                        y: phase === 'masterpiece' ? -10 : 0
                    }}
                    className="relative z-10 w-full h-full cursor-grab active:cursor-grabbing"
                >
                    {/* Shadow Layer */}
                    <motion.div
                        className="absolute inset-0 bg-black/10 blur-3xl rounded-[32px] -z-10"
                        animate={{
                            opacity: phase === 'masterpiece' ? 0.4 : 0.2,
                            scale: phase === 'masterpiece' ? 1.1 : 0.95
                        }}
                    />

                    {/* Main Document */}
                    <div className={`
                        absolute inset-0 rounded-[32px] bg-white border border-slate-200/80 
                        overflow-hidden flex flex-col shadow-2xl transition-all duration-1000
                        ${phase === 'masterpiece' ? 'ring-4 ring-emerald-400/10' : ''}
                    `}>
                        {/* Texture Layer */}
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />

                        {/* 1. Header Section */}
                        <div className="p-8 pb-6 relative z-10 flex justify-between items-start">
                            <div className="space-y-4">
                                <motion.div
                                    className="h-8 w-48 bg-slate-100 rounded-lg relative overflow-hidden"
                                    animate={{ background: phase === 'masterpiece' ? 'transparent' : '#f1f5f9' }}
                                >
                                    <AnimatePresence mode="wait">
                                        {(phase === 'building' || phase === 'masterpiece') ? (
                                            <motion.h2
                                                key="name"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-2xl font-black text-slate-800 tracking-tight"
                                            >
                                                Alex Morgan
                                            </motion.h2>
                                        ) : (
                                            <div className="absolute inset-0 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 animate-shimmer" />
                                        )}
                                    </AnimatePresence>
                                </motion.div>

                                <div className="flex gap-2">
                                    <div className="w-12 h-2 bg-slate-100 rounded-full" />
                                    <div className="w-16 h-2 bg-slate-100 rounded-full" />
                                </div>
                            </div>

                            <motion.div
                                className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden shadow-sm"
                                whileHover={{ scale: 1.1 }}
                            >
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=${phase === 'masterpiece' ? 'b6e3f4' : 'f1f5f9'}`} alt="Avatar" />
                            </motion.div>
                        </div>

                        {/* 2. Main Content Area */}
                        <div className="px-8 flex-1 space-y-10 relative">

                            {/* Discovery Pulse (Scanning) */}
                            <AnimatePresence>
                                {phase === 'discovering' && (
                                    <motion.div
                                        initial={{ top: '0%', opacity: 0 }}
                                        animate={{ top: '100%', opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 2, ease: "linear" }}
                                        className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-emerald-400/10 to-transparent z-20 pointer-events-none"
                                    >
                                        <div className="h-[1px] bg-emerald-400/50 shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Section: Your Story */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Target className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Professional Story</span>
                                </div>
                                <div className="space-y-2">
                                    <motion.div
                                        className="h-3 w-full bg-slate-50 rounded-full relative overflow-hidden"
                                        animate={{ width: phase === 'masterpiece' ? '100%' : '80%' }}
                                    >
                                        {phase === 'masterpiece' && <motion.div className="absolute inset-0 bg-emerald-500/5" initial={{ x: '-100%' }} animate={{ x: '0%' }} />}
                                    </motion.div>
                                    <motion.div
                                        className="h-3 w-5/6 bg-slate-50 rounded-full"
                                        animate={{ width: phase === 'masterpiece' ? '90%' : '60%' }}
                                    />
                                </div>
                            </div>

                            {/* Section: Missing Pieces / Mastered Skills */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Puzzle className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Essential Capabilities</span>
                                    </div>
                                    <AnimatePresence>
                                        {phase === 'discovering' && (
                                            <motion.span
                                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                className="text-[9px] font-bold text-amber-600 bg-amber-100/50 px-2 py-0.5 rounded-full"
                                            >
                                                Possibilities Found
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="relative h-24 flex flex-wrap gap-4 items-center">
                                    {/* These are the 'targets' that get filled */}
                                    <EmptySlot x={0} y={0} label="Finding..." />
                                    <EmptySlot x={135} y={0} label="Finding..." />
                                    <EmptySlot x={270} y={0} label="Finding..." />

                                    <AnimatePresence>
                                        {(phase === 'building' || phase === 'masterpiece') && (
                                            <div className="absolute inset-0 flex flex-wrap gap-4 z-10 pointer-events-none">
                                                {[
                                                    { icon: Trophy, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Systems' },
                                                    { icon: Award, color: 'text-indigo-600', bg: 'bg-indigo-50', label: 'Leadership' },
                                                    { icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50', label: 'Impact' }
                                                ].map((skill, i) => (
                                                    <motion.div
                                                        key={skill.label}
                                                        initial={{ scale: 0, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        transition={{ delay: i * 0.3 + 0.5, type: "spring" }}
                                                        className={`h-12 px-4 rounded-2xl ${skill.bg} border border-slate-100 flex items-center gap-3 shadow-sm min-w-[120px]`}
                                                    >
                                                        <skill.icon className={`w-4 h-4 ${skill.color}`} />
                                                        <span className="text-[10px] font-bold text-slate-700 whitespace-nowrap">{skill.label}</span>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Section: Experience */}
                            <div className="space-y-4 pt-4">
                                <div className="flex items-center gap-2">
                                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Experience</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    {[1, 2].map(i => (
                                        <div key={i} className="h-16 bg-slate-50/50 rounded-2xl border border-slate-100/50 p-3 space-y-2">
                                            <div className="w-8 h-1.5 bg-slate-200 rounded-full" />
                                            <div className="w-full h-1.5 bg-slate-100 rounded-full" />
                                            <div className="w-2/3 h-1.5 bg-slate-100 rounded-full" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 3. Footer Readiness Score */}
                        <div className="p-8 pt-6 border-t border-slate-100 bg-slate-50/30 flex justify-between items-center relative overflow-hidden">
                            {/* Score Shine Background */}
                            <AnimatePresence>
                                {phase === 'masterpiece' && (
                                    <motion.div
                                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                        className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-transparent"
                                    />
                                )}
                            </AnimatePresence>

                            <div className="space-y-3 relative z-10 w-full">
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Confidence</span>
                                        <div className="flex items-baseline gap-1">
                                            <motion.span
                                                key={phase === 'masterpiece' ? '98' : '42'}
                                                initial={{ y: 10, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                className={`text-4xl font-black ${phase === 'masterpiece' ? 'text-emerald-600' : 'text-slate-400'}`}
                                            >
                                                {phase === 'masterpiece' ? '98' : '42'}
                                            </motion.span>
                                            <span className="text-sm font-bold text-slate-300">/ 100</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-1">
                                        <AnimatePresence mode="wait">
                                            {phase === 'masterpiece' ? (
                                                <motion.div
                                                    key="ready" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                                    className="flex items-center gap-1.5 text-emerald-600"
                                                >
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Job Ready</span>
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </motion.div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-slate-300">
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Tuning...</span>
                                                </div>
                                            )}
                                        </AnimatePresence>
                                        <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                                            <motion.div
                                                className={`h-full bg-gradient-to-r ${phase === 'masterpiece' ? 'from-emerald-400 to-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'from-slate-300 to-slate-400'}`}
                                                animate={{ width: phase === 'masterpiece' ? '98%' : '42%' }}
                                                transition={{ duration: 1.5, ease: "circOut" }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </motion.div>

                {/* --- EXTRA PARTICLES --- */}
                <AnimatePresence>
                    {phase === 'masterpiece' && (
                        <>
                            {[...Array(6)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                                    animate={{
                                        opacity: [0, 1, 0],
                                        scale: [0.5, 1.5, 0.5],
                                        x: (i % 2 === 0 ? 1 : -1) * (150 + Math.random() * 100),
                                        y: (Math.random() - 0.5) * 400
                                    }}
                                    transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                                    className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-emerald-400/30 blur-sm z-0"
                                />
                            ))}
                        </>
                    )}
                </AnimatePresence>

            </div>
        </div>
    )
}

export default HeroResumeNexus
