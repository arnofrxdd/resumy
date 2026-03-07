"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Volume2, Sparkles, User, Bot, ArrowRight, Zap, Target, Star } from 'lucide-react'
import {
    SparkleDoodle,
    StarDoodle,
    ZigZagDoodle,
    ScribbleDoodle,
    CircleDoodle,
    ArrowDoodle
} from '../DoodleAnimations'
import { useIsMobile } from '@/hooks/useIsMobile'

const InterviewSimulator = ({ isAuthenticated }) => {
    const isMobile = useIsMobile()
    const [speaking, setSpeaking] = useState('user') // 'user' | 'ai'
    const [transcript, setTranscript] = useState("")

    useEffect(() => {
        const loop = async () => {
            while (true) {
                // AI Asks
                setSpeaking('ai')
                setTranscript("Tell me about a challenge you faced.")
                await new Promise(r => setTimeout(r, 2000))

                // User Answers
                setSpeaking('user')
                setTranscript("In my last project, the API latency was high...")
                await new Promise(r => setTimeout(r, 3000))

                // Feedback
                setSpeaking('feedback')
                await new Promise(r => setTimeout(r, 2000))
            }
        }
        loop()
    }, [])

    return (
        <section className="pt-12 pb-16 lg:py-16 bg-white overflow-hidden relative text-stone-900 border-t border-stone-100">
            {/* Background Gradients - More Vibrant */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-violet-400/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-fuchsia-400/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-orange-300/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="container max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

                    {/* Left: Content */}
                    <div className="lg:w-1/2 space-y-10 text-center lg:text-left">
                        <div className="space-y-6 flex flex-col text-center lg:text-left items-center lg:items-start">
                            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-xl bg-orange-50 text-orange-600 border border-orange-100 shadow-sm">
                                <Mic className="w-5 h-5" />
                                <span className="text-[11px] font-black uppercase tracking-[0.2em]">The Practice Room</span>
                            </div>
                            <h2 className="text-[15vw] sm:text-7xl lg:text-6xl xl:text-7xl font-black text-stone-900 leading-[0.9] sm:leading-[0.85] tracking-[-0.04em]">
                                Talk To Us. <br />
                                <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">Get The Job.</span>
                            </h2>
                            <p className="text-sm md:text-xl text-stone-500 leading-relaxed font-bold max-w-xl italic px-2 sm:px-0">
                                Get your jitters out by practicing with our AI coach. It’ll tell you exactly what to say to <span className="text-stone-900 underline decoration-violet-500/20 decoration-4 underline-offset-8">impress your future boss.</span>
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                            <div className="px-6 py-3 bg-stone-50 border border-stone-100 rounded-xl flex items-center gap-4 shadow-inner">
                                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                                <span className="text-[10px] font-black text-stone-900 uppercase tracking-widest">Practice Zone Active</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {[
                                { title: "Zero Judgment", desc: "Practicing in private is the only way to perfect your delivery." },
                                { title: "Immediate Feedback", desc: "Know exactly what hit the mark and what missed before the call." },
                                { title: "Custom Scenarios", desc: "Mock interviews built for your specific target role and company." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-5 group items-start">
                                    <div className="w-1.5 h-12 bg-stone-100 rounded-full overflow-hidden shrink-0 mt-1">
                                        <div className="w-full h-1/2 bg-stone-900 group-hover:h-full transition-all duration-500" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-[12px] font-black uppercase tracking-widest text-stone-900 mb-0.5">{item.title}</div>
                                        <div className="text-[13px] text-stone-500 font-bold leading-relaxed">{item.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 sm:pt-8 w-full hidden lg:flex">
                            <Link href={isAuthenticated ? "/ai-interview" : "/register"} passHref>
                                <motion.button
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group w-full sm:w-auto px-6 sm:px-10 py-5 bg-stone-950 text-white rounded-2xl font-black text-[12px] sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] flex items-center justify-center gap-4 mx-auto lg:mx-0 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all border-b-[6px] border-stone-800 active:border-b-0"
                                >
                                    Start Live Practice Session
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </Link>
                        </div>
                    </div>

                    {/* Right: Visualization - Enhanced with Vibe Check (NOW VISIBLE ON MOBILE) */}
                    <div className="flex lg:w-1/2 w-full justify-center relative h-[380px] sm:h-[480px] lg:h-auto overflow-visible -mb-16 sm:-mb-12 lg:mb-0 mt-6 sm:mt-10 lg:mt-0 z-20">
                        <div className="relative w-full h-[600px] lg:h-[550px] flex items-center justify-center scale-[0.65] sm:scale-[0.8] lg:scale-100 origin-top lg:origin-center -mt-16 sm:-mt-8 lg:mt-[10px]">

                            <div className="relative w-[380px] sm:w-[400px] h-[500px] bg-stone-950 backdrop-blur-2xl border-2 border-stone-800 rounded-3xl shadow-[0_30px_80px_-15px_rgba(0,0,0,0.5)] lg:shadow-[0_40px_100px_-15px_rgba(0,0,0,0.6)] overflow-visible flex flex-col group transition-all duration-500 hover:scale-[1.02]">

                                {/* GenZ Floating Tags */}
                                <motion.div
                                    animate={{ y: [0, -10, 0], rotate: [-5, 5, -5] }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                    className="absolute -top-6 -right-6 z-30 px-4 py-2 bg-fuchsia-500 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-fuchsia-200 rotate-[10deg] border-2 border-white break-keep whitespace-nowrap"
                                >
                                    Vibe Check: Passed
                                </motion.div>

                                <motion.div
                                    animate={{ y: [0, 10, 0], rotate: [5, -5, 5] }}
                                    transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                                    className="absolute -bottom-4 -left-4 z-30 px-4 py-2 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-200 rotate-[-8deg] border-2 border-white break-keep whitespace-nowrap"
                                >
                                    No Jitters Allowed
                                </motion.div>

                                {/* Header */}
                                <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                                    <div className="flex items-center gap-4">
                                        <div className="w-3.5 h-3.5 bg-violet-500 rounded-full animate-pulse shadow-[0_0_20px_#8B5CF6]" />
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest font-sans italic">Hiring Manager Simulation</span>
                                            <span className="text-[8px] font-bold text-violet-400/60 uppercase tracking-[0.2em]">Model: Career-Coach-v4</span>
                                        </div>
                                    </div>
                                    <div className="p-2.5 bg-white/5 rounded-2xl border border-white/5">
                                        <Volume2 className="w-4 h-4 text-stone-300" />
                                    </div>
                                </div>

                                {/* Main Chat Area */}
                                <div className="flex-1 p-8 flex flex-col justify-center items-center relative overflow-hidden">
                                    <SparkleDoodle color="#8B5CF6" className="absolute top-4 left-4 w-12 h-12 opacity-20" />
                                    <StarDoodle color="#F97316" className="absolute bottom-10 right-4 w-16 h-16 opacity-10 rotate-[15deg]" />
                                    <ZigZagDoodle color="#D946EF" className="absolute top-1/2 -left-8 w-24 h-6 opacity-20 rotate-90" />

                                    {/* AI Avatar - More Vibrant */}
                                    <motion.div
                                        animate={{
                                            scale: speaking === 'ai' ? 1.15 : 1,
                                            boxShadow: speaking === 'ai' ? "0 0 100px rgba(139, 92, 246, 0.6)" : "0 0 30px rgba(255,255,255,0.05)"
                                        }}
                                        className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-orange-400 flex items-center justify-center mb-12 relative z-10 rotate-3 transition-all duration-500 shadow-2xl"
                                    >
                                        <Bot className="w-14 h-14 text-white" />
                                        <div className="absolute inset-x-[-20%] top-[-20%] h-4 bg-white/20 blur-xl rounded-full opacity-50 transition-opacity" />
                                    </motion.div>

                                    {/* Waveform Visual */}
                                    <div className="h-16 flex items-center gap-3 mb-12 relative">
                                        {[...Array(isMobile ? 6 : 12)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                animate={{ height: speaking === 'user' ? [12, 60, 12] : speaking === 'ai' ? [8, 24, 8] : 8 }}
                                                transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.05 }}
                                                className={`w-2.5 rounded-full transition-colors duration-500 ${speaking === 'user' ? 'bg-emerald-400' : speaking === 'ai' ? 'bg-violet-500' : 'bg-stone-800'} ${!isMobile ? 'will-change-[height]' : ''}`}
                                            />
                                        ))}
                                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[8px] font-black text-stone-500 uppercase tracking-[0.2em] whitespace-nowrap">Audio Signal Active</div>
                                    </div>

                                    {/* Transcript Bubble */}
                                    <div className={`bg-white/[0.03] backdrop-blur-xl p-8 rounded-3xl w-full border border-white/10 text-center min-h-[140px] flex items-center justify-center relative group ${!isMobile ? 'will-change-transform' : ''}`}>
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-stone-900 border border-white/10 px-3 py-1 rounded-full text-[8px] font-black text-stone-500 uppercase tracking-widest">Transcript</div>
                                        <p className="text-stone-50 text-lg font-black leading-tight italic transition-all group-hover:text-white tracking-tight">"{transcript}"</p>
                                    </div>

                                    {/* Feedback Overlay - More Energetic */}
                                    <AnimatePresence>
                                        {speaking === 'feedback' && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 40, rotate: -2 }}
                                                animate={{ opacity: 1, y: 0, rotate: 0 }}
                                                exit={{ opacity: 0, scale: 0.8, rotate: 2 }}
                                                className={`absolute inset-x-6 bottom-6 top-auto bg-stone-950/95 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] border-2 border-emerald-500 rounded-3xl p-8 z-20 ${!isMobile ? 'will-change-transform' : ''}`}
                                            >
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="flex items-center gap-3 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                                        <Sparkles className="w-5 h-5" /> Main Character Energy
                                                    </div>
                                                    <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[9px] font-black">LEGENDARY</div>
                                                </div>
                                                <div className="space-y-5">
                                                    <div className="flex justify-between text-[11px] font-black text-stone-300 uppercase tracking-[0.2em]">
                                                        <span>Crushing it</span>
                                                        <span className="text-emerald-400 tracking-tighter">100% Vibing</span>
                                                    </div>
                                                    <div className="w-full bg-stone-900 h-3 rounded-full overflow-hidden border border-white/5">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: "95%" }}
                                                            className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-cyan-400 rounded-full shadow-[0_0_30px_#10b981]"
                                                        />
                                                    </div>
                                                    <p className="text-[14px] text-stone-200 leading-snug font-bold italic">
                                                        "That answer was elite! Keep that same energy and you've basically already got the desk."
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                </div>

                                {/* User Controls */}
                                <div className="p-8 pt-0 flex justify-center">
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className={`w-20 h-20 rounded-full bg-stone-900 shadow-2xl flex items-center justify-center border-2 border-white/10 group cursor-pointer hover:bg-violet-600 transition-all duration-300 relative ${!isMobile ? 'will-change-transform' : ''}`}
                                    >
                                        <Mic className={`w-8 h-8 ${speaking === 'user' ? 'text-emerald-400' : 'text-stone-400 group-hover:text-white'}`} />
                                        {speaking === 'user' && (
                                            <motion.div
                                                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="absolute inset-0 rounded-full border-4 border-emerald-400"
                                            />
                                        )}
                                    </motion.div>
                                </div>


                            </div>
                        </div>
                    </div>

                    {/* MOBILE ONLY: Button Below Art */}
                    <div className="flex lg:hidden pt-4 pb-0 w-full z-30">
                        <Link href={isAuthenticated ? "/ai-interview" : "/register"} passHref className="w-full">
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="group w-full px-6 py-5 bg-stone-950 text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.15em] flex items-center justify-center gap-4 mx-auto hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all border-b-[6px] border-stone-800 active:border-b-0"
                            >
                                Start Live Practice Session
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default InterviewSimulator
