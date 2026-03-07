"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Loader2, CheckCircle2, ArrowRight } from 'lucide-react'
import { useIsMobile } from '@/hooks/useIsMobile'

const InteractiveDemo = () => {
    const [role, setRole] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [result, setResult] = useState(null)
    const isMobile = useIsMobile()

    const handleSearch = () => {
        if (!role) return
        setIsSearching(true)
        setResult(null)

        // Mock API lag
        setTimeout(() => {
            setIsSearching(false)
            setResult({
                salary: "₹18.5 LPA",
                match: 64,
                skills: ["System Design", "Kubernetes", "Redis", "TDD"]
            })
        }, 2000)
    }

    return (
        <section className="py-32 bg-stone-50 relative overflow-hidden">
            <div className="container max-w-5xl mx-auto px-6 relative z-10">

                <div className="text-center mb-20 space-y-6">
                    <motion.div
                        initial={isMobile ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                        animate={isMobile ? { opacity: 1, scale: 1 } : undefined}
                        whileInView={isMobile ? undefined : { opacity: 1, scale: 1 }}
                        className="inline-flex px-5 py-2 bg-violet-600/5 text-violet-600 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] mb-2 border border-violet-100 shadow-sm"
                    >
                        THE SALARY SCANNER
                    </motion.div>
                    <h2 className="text-6xl md:text-8xl font-black text-stone-900 tracking-tighter leading-[0.85]">
                        See What <br /><span className="font-serif italic text-violet-600 font-normal">You're Worth.</span>
                    </h2>
                </div>

                <div className="bg-stone-900 rounded-[3rem] shadow-[0_40px_100px_rgba(28,25,23,0.3)] overflow-hidden border border-stone-800 transition-all duration-500 hover:border-violet-500/30">
                    {/* Header / Input Area */}
                    <div className="p-12 border-b border-white/5 bg-white/5">
                        <div className="flex flex-col md:flex-row items-center gap-10 justify-between">
                            <div className="flex-1 w-full text-center md:text-left">
                                <label className="block text-[10px] font-black text-stone-500 mb-3 uppercase tracking-widest leading-none italic">
                                    What do you want to be?
                                </label>
                                <div className="relative flex items-center group">
                                    <input
                                        type="text"
                                        placeholder="e.g. Senior Frontend Developer"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                        className="w-full text-2xl md:text-4xl font-black bg-transparent border-none p-0 focus:ring-0 placeholder:text-stone-700 text-white selection:bg-violet-500/30 tracking-tight"
                                    />
                                </div>
                            </div>
                            <button
                                onClick={handleSearch}
                                disabled={!role || isSearching}
                                className="w-full md:w-auto px-12 py-6 bg-violet-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-violet-500 transition-all disabled:opacity-30 flex items-center justify-center gap-4 shadow-[0_0_30px_rgba(139,92,246,0.3)] group"
                            >
                                {isSearching ? <Loader2 className="animate-spin w-5 h-5" /> : (
                                    <>
                                        Check My Stats
                                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Dashboard Area */}
                    <div className="p-12 min-h-[400px] relative bg-[radial-gradient(circle_at_center,_#292524_0%,_#1c1917_100%)]">
                        <AnimatePresence mode="wait">
                            {!result && !isSearching && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="h-[400px] flex flex-col items-center justify-center text-center space-y-8"
                                >
                                    <div className="w-24 h-24 rounded-full border border-stone-800 flex items-center justify-center text-stone-700">
                                        <Search className="w-10 h-10 opacity-20" />
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-stone-500 font-black uppercase tracking-[0.2em] text-[10px] italic">Type your dream job above</p>
                                        <p className="text-stone-600 text-base max-w-sm mx-auto font-medium">We'll check thousands of jobs to see what's actually missing in your profile.</p>
                                    </div>
                                </motion.div>
                            )}

                            {isSearching && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center h-[400px] gap-8 text-violet-500"
                                >
                                    <div className="relative">
                                        <Loader2 className="w-20 h-20 animate-spin opacity-20" />
                                        <motion.div
                                            className="absolute inset-0 flex items-center justify-center"
                                            animate={{ scale: [1, 1.3, 1] }}
                                            transition={{ duration: 1, repeat: Infinity }}
                                        >
                                            <Search className="w-8 h-8" />
                                        </motion.div>
                                    </div>
                                    <div className="flex flex-col items-center gap-3">
                                        <span className="font-black text-base uppercase tracking-[0.4em]">Scanning Market...</span>
                                        <div className="flex gap-2 font-mono text-[10px] text-stone-600">
                                            <span className="animate-pulse">FINDING_SALARIES...</span>
                                            <span className="delay-75 animate-pulse">CHECKING_SKILLS...</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {result && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                >
                                    {/* Stat 1: Salary */}
                                    <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/10 flex flex-col justify-between group hover:border-violet-500/30 transition-all">
                                        <div className="flex items-center justify-between mb-6">
                                            <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest leading-none">Average Salary</span>
                                            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_15px_#10b981]" />
                                        </div>
                                        <div>
                                            <div className="text-5xl font-black text-white mb-2 leading-none tracking-tighter">{result.salary}</div>
                                            <div className="text-[11px] text-emerald-400 font-bold uppercase tracking-widest">+12% vs Average</div>
                                        </div>
                                    </div>

                                    {/* Stat 2: Match */}
                                    <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/10 flex flex-col justify-between relative overflow-hidden group hover:border-violet-500/30 transition-all">
                                        <div className="flex items-center justify-between mb-6">
                                            <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest leading-none">Your Readiness</span>
                                            <span className="text-[10px] font-bold text-orange-500 italic uppercase">Gap Found</span>
                                        </div>
                                        <div className="relative z-10">
                                            <div className="text-6xl font-black text-violet-500 mb-4 leading-none tracking-tighter">{result.match}%</div>
                                            <div className="w-full bg-stone-800 rounded-full h-2.5 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${result.match}%` }}
                                                    className="h-full bg-violet-600 shadow-[0_0_20px_#8B5CF6]"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stat 3: Skills */}
                                    <div className="md:col-span-2 lg:col-span-1 bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/10 flex flex-col group hover:border-violet-500/30 transition-all">
                                        <div className="flex items-center justify-between mb-6">
                                            <span className="text-[10px] font-black text-stone-500 uppercase tracking-widest leading-none">What's missing</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2.5">
                                            {result.skills.map(s => (
                                                <span key={s} className="bg-stone-800 text-white border border-stone-700 px-5 py-2 rounded-full text-[11px] font-black flex items-center gap-3 transition-colors hover:border-violet-500/50">
                                                    <div className="w-2 h-2 bg-violet-500 rounded-full shadow-[0_0_8px_#8B5CF6]" />
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Footer CTA */}
                                    <div className="col-span-full pt-6">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                            className="flex flex-col md:flex-row items-center justify-between gap-8 bg-violet-600 p-10 rounded-[2.5rem] shadow-2xl border border-white/10 relative overflow-hidden group"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-orange-500 opacity-0 group-hover:opacity-20 transition-opacity duration-700" />
                                            <div className="flex items-center gap-6 relative z-10">
                                                <div className="w-16 h-16 rounded-3xl bg-white/20 flex items-center justify-center border border-white/30">
                                                    <CheckCircle2 className="w-8 h-8 text-white" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-white font-black text-2xl leading-none mb-2 tracking-tight">Found some gaps!</p>
                                                    <p className="text-white/70 text-sm font-bold">Ready to bridge the {100 - result.match}%? We have your personal map ready.</p>
                                                </div>
                                            </div>
                                            <button className="w-full md:w-auto px-10 py-5 bg-white text-violet-600 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform flex items-center justify-center gap-3 relative z-10 shadow-xl">
                                                Fix It Now
                                                <ArrowRight className="w-5 h-5" />
                                            </button>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default InteractiveDemo
