"use client"

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, CheckCircle2, Heart, Zap } from 'lucide-react'
import {
    UnderlineDoodle,
    SparkleDoodle,
    ScribbleDoodle,
    BridgeDoodle,
    CircleDoodle,
    ZigZagDoodle,
    HeartDoodle,
    GaplyAvatar,
    StarDoodle
} from './DoodleAnimations'
import { useIsMobile } from '@/hooks/useIsMobile'

const FinalCTA = ({ isAuthenticated }) => {
    const isMobile = useIsMobile()
    return (
        <section className="py-16 md:py-24 lg:py-48 bg-stone-950 relative overflow-hidden">
            {/* Artistic Background Layers - Dark Mode */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[80%] bg-violet-600/10 blur-[120px] rounded-full animate-pulse-slow" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[70%] bg-rose-600/5 blur-[120px] rounded-full" />
                <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(#8B5CF6 2px, transparent 2px)', backgroundSize: '40px 40px' }} />
            </div>

            {/* Realistic Peekaboo Resume 1 (Creative Modern) */}
            <motion.div
                initial={isMobile ? { x: -80, rotate: -12, opacity: 0.25 } : { x: -200, rotate: -30, opacity: 0 }}
                animate={isMobile ? { x: -80, rotate: -12, opacity: 0.25 } : undefined}
                whileInView={isMobile ? undefined : { x: -80, rotate: -12, opacity: 0.25 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="absolute top-10 -left-10 w-[320px] h-[450px] bg-white rounded-2xl shadow-[40px_40px_80px_-20px_rgba(0,0,0,0.4)] hidden xl:block pointer-events-none origin-right border border-stone-100 overflow-hidden"
            >
                <div className="flex h-full font-sans text-left">
                    {/* Sidebar */}
                    <div className="w-1/3 bg-stone-900 p-6 flex flex-col gap-6 text-white/90">
                        <div className="w-20 h-20 rounded-2xl bg-white/10 overflow-hidden border border-white/20">
                            <img src="https://i.pravatar.cc/100?u=88" alt="Sarah" className="w-full h-full object-cover grayscale opacity-80" />
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <div className="text-[7px] font-black uppercase tracking-widest text-emerald-400">Contact</div>
                                <div className="w-full h-1 bg-white/20 rounded-full" />
                                <div className="w-4/5 h-1 bg-white/20 rounded-full" />
                            </div>
                            <div className="space-y-1.5">
                                <div className="text-[7px] font-black uppercase tracking-widest text-emerald-400">Expertise</div>
                                <div className="space-y-2">
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} className="flex flex-col gap-1">
                                            <div className="w-full h-1 bg-white/10 rounded-full" />
                                            <div className="w-full h-1 bg-emerald-500/30 rounded-full overflow-hidden">
                                                <div className="w-3/4 h-full bg-emerald-500" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Main Content */}
                    <div className="flex-1 p-8 bg-white space-y-6">
                        <div className="pb-4 border-b border-stone-100">
                            <div className="text-xl font-black text-stone-900 tracking-tighter leading-none mb-1">SARAH JENKINS</div>
                            <div className="text-[8px] font-bold text-emerald-600 uppercase tracking-[0.2em]">Product Designer</div>
                        </div>
                        <div className="space-y-3">
                            <div className="text-[7px] font-black uppercase tracking-widest text-stone-400">Experience</div>
                            <div className="space-y-4">
                                {[1, 2].map(i => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <div className="w-1/2 h-2 bg-stone-800 rounded-full" />
                                            <div className="w-1/4 h-1.5 bg-stone-100 rounded-full" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="w-full h-1 bg-stone-100 rounded-full" />
                                            <div className="w-full h-1 bg-stone-100 rounded-full" />
                                            <div className="w-2/3 h-1 bg-stone-100 rounded-full" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Realistic Peekaboo Resume 2 (Elite Executive) */}
            <motion.div
                initial={isMobile ? { x: 80, rotate: 15, opacity: 0.15 } : { x: 200, rotate: 30, opacity: 0 }}
                animate={isMobile ? { x: 80, rotate: 15, opacity: 0.15 } : undefined}
                whileInView={isMobile ? undefined : { x: 80, rotate: 15, opacity: 0.15 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                className="absolute bottom-10 -right-10 w-[350px] h-[500px] bg-white rounded-3xl shadow-[-40px_40px_80px_-20px_rgba(0,0,0,0.5)] hidden xl:block pointer-events-none origin-left border border-white overflow-hidden"
            >
                <div className="flex flex-col h-full font-serif text-left">
                    <div className="h-32 bg-stone-950 p-10 flex flex-col justify-end gap-2 relative">
                        <div className="absolute top-6 right-6 w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 italic text-white font-serif text-lg">M</div>
                        <div className="text-2xl font-black text-white tracking-wide leading-none">MARCUS VANE</div>
                        <div className="text-[9px] font-bold text-violet-400 uppercase tracking-[0.3em]">Chief Operations Officer</div>
                    </div>
                    <div className="p-10 space-y-10">
                        <section className="space-y-4">
                            <div className="text-[8px] font-bold text-stone-900 border-b border-stone-200 pb-1 uppercase tracking-widest">Core Competencies</div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-violet-600" />
                                        <div className="w-full h-1.5 bg-stone-100 rounded-full" />
                                    </div>
                                ))}
                            </div>
                        </section>
                        <section className="space-y-6">
                            <div className="text-[8px] font-bold text-stone-900 border-b border-stone-200 pb-1 uppercase tracking-widest">Professional History</div>
                            {[1, 2].map(i => (
                                <div key={i} className="space-y-3">
                                    <div className="w-2/3 h-3 bg-stone-900 rounded-sm" />
                                    <div className="space-y-1.5">
                                        <div className="w-full h-1.5 bg-stone-100 rounded-full" />
                                        <div className="w-full h-1.5 bg-stone-100 rounded-full" />
                                        <div className="w-5/6 h-1.5 bg-stone-100 rounded-full" />
                                    </div>
                                </div>
                            ))}
                        </section>
                    </div>
                </div>
            </motion.div>

            {/* Floating Art Bits */}
            <div className="absolute top-40 left-[15%] opacity-20 hidden xl:block animate-bounce-slow">
                <BridgeDoodle color="#8B5CF6" className="w-48 h-20" />
            </div>
            <div className="absolute bottom-40 right-[20%] opacity-20 hidden xl:block rotate-12">
                <ZigZagDoodle color="#F97316" className="w-40 h-10" />
            </div>
            <div className="absolute top-1/2 right-10 -translate-y-1/2 opacity-15 hidden 2xl:block">
                <GaplyAvatar pose="excited" color="#8B5CF6" className="w-64 h-64" />
            </div>

            <div className="container max-w-7xl mx-auto px-6 relative z-10 text-center">
                <div className="max-w-4xl mx-auto flex flex-col items-center">

                    {/* The "Victory" Badge */}
                    <motion.div
                        initial={isMobile ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 20 }}
                        animate={isMobile ? { opacity: 1, scale: 1, y: 0 } : undefined}
                        whileInView={isMobile ? undefined : { opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`inline-flex items-center gap-1.5 sm:gap-2.5 px-4 sm:px-5 py-2 sm:py-2.5 bg-white text-stone-900 rounded-2xl shadow-[8px_8px_0_rgba(139,92,246,0.2)] md:shadow-[12px_12px_0_rgba(139,92,246,0.2)] border border-white/10 mb-8 md:mb-12 rotate-[-1deg] ${!isMobile ? 'will-change-transform' : ''}`}
                    >
                        <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-violet-600 fill-violet-600" />
                        <span className="text-[9px] sm:text-[11px] font-black uppercase tracking-[0.3em]">Join the Top 1%</span>
                    </motion.div>

                    <h2 className="text-[13vw] sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl font-black text-white mb-8 md:mb-12 tracking-tighter leading-[0.9] sm:leading-[0.85] relative">
                        Bridge the Gap. <br />
                        <span className="relative inline-block mt-2 sm:mt-3">
                            <span className="relative z-10 font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-indigo-400 to-rose-300 font-normal">Claim Your Future.</span>
                            <UnderlineDoodle color="#F97316" className="absolute -bottom-2 sm:-bottom-4 left-0 w-full h-6 sm:h-8 opacity-40" />
                        </span>
                    </h2>

                    {/* Reimagined Testimonial "Art Card" - DARK Version */}
                    <motion.div
                        initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        animate={isMobile ? { opacity: 1, y: 0 } : undefined}
                        whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`relative w-full max-w-3xl mb-12 sm:mb-16 px-6 sm:px-8 py-8 sm:py-12 bg-stone-900/50 backdrop-blur-xl rounded-[2rem] sm:rounded-[3rem] border border-white/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] group ${!isMobile ? 'will-change-transform' : ''}`}
                    >
                        <div className="absolute -top-6 sm:-top-10 left-1/2 -translate-x-1/2 w-12 h-12 sm:w-20 sm:h-20 bg-white rounded-2xl sm:rounded-3xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500 shadow-xl">
                            <Heart className="w-6 h-6 sm:w-10 sm:h-10 text-rose-500 fill-rose-500" />
                        </div>

                        <div className="relative pt-4 sm:pt-4">
                            <SparkleDoodle color="#8B5CF6" className="absolute -top-4 -right-4 w-8 h-8 sm:w-12 sm:h-12 opacity-40" />
                            <p className="text-xl sm:text-2xl md:text-3xl text-stone-200 font-bold italic leading-tight tracking-tight mb-6">
                                "I used to apply blindly. <br className="hidden md:block" /> Now I apply with confidence. <br className="hidden md:block" />
                                <span className="text-violet-400 relative block sm:inline mt-2 sm:mt-0">
                                    Gaplytiq was the missing piece.
                                    <ScribbleDoodle color="#8B5CF6" className="absolute -bottom-2 md:-bottom-4 left-0 w-full h-4 opacity-40" />
                                </span>"
                            </p>

                            <div className="flex items-center justify-center gap-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-stone-800 overflow-hidden border-2 border-stone-700">
                                    <img src="https://i.pravatar.cc/100?u=42" alt="Sarah" className="w-full h-full object-cover" />
                                </div>
                                <div className="text-left">
                                    <div className="text-[10px] sm:text-xs font-black text-white uppercase tracking-widest leading-none">Sarah Jenkins</div>
                                    <div className="text-[8px] sm:text-[10px] font-bold text-stone-500 uppercase tracking-widest mt-0.5 sm:mt-1 italic">Hired at Google</div>
                                </div>
                            </div>
                        </div>

                        {/* Background Scribbles for Card */}
                        <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 opacity-30 rotate-[-15deg]">
                            <StarDoodle color="#F59E0B" className="w-10 h-10 sm:w-16 sm:h-16 animate-pulse" />
                        </div>
                    </motion.div>

                    <div className="flex flex-col items-center gap-6 sm:gap-8 w-full">
                        <Link
                            href={isAuthenticated ? "/skill-gap" : "/register"}
                            className="group relative w-full max-w-md px-6 py-4 sm:px-10 sm:py-6 bg-white text-stone-900 rounded-2xl font-black text-lg sm:text-xl transition-all hover:bg-violet-600 hover:text-white hover:shadow-[0_30px_70px_rgba(139,92,246,0.5)] hover:-translate-y-1 sm:hover:-translate-y-2 active:translate-y-0"
                        >
                            <div className="flex items-center justify-center gap-3 sm:gap-4 relative z-10">
                                Start My Free Scan <ArrowRight className="w-5 h-5 sm:w-7 sm:h-7 transition-transform group-hover:translate-x-2 sm:group-hover:translate-x-3" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-stone-900/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        </Link>

                        {/* Success Feed / Social Proof */}
                        <div className="flex flex-col items-center gap-4 sm:gap-6">
                            <div className="flex -space-x-2 sm:-space-x-3">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <motion.div
                                        key={i}
                                        initial={isMobile ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                                        animate={isMobile ? { opacity: 1, x: 0 } : undefined}
                                        whileInView={isMobile ? undefined : { opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 sm:border-4 border-stone-900 bg-slate-800 overflow-hidden shadow-lg hover:-translate-y-1 sm:hover:-translate-y-2 transition-transform duration-300"
                                    >
                                        <img src={`https://i.pravatar.cc/100?u=${i + 60}`} alt="user" className="w-full h-full object-cover" />
                                    </motion.div>
                                ))}
                                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 sm:border-4 border-stone-900 bg-violet-600 flex items-center justify-center text-white text-[9px] sm:text-xs font-black shadow-lg">
                                    +1k
                                </div>
                            </div>

                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="flex items-center gap-3 sm:gap-4 px-4 py-2 sm:px-6 sm:py-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-inner"
                            >
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-[8px] sm:text-[10px] font-black text-white uppercase tracking-[0.2em]">1,200+ students started today</span>
                                </div>
                                <HeartDoodle color="#F43F5E" className="w-3 h-3 sm:w-4 sm:h-4 animate-bounce" />
                            </motion.div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom transition gradient */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-stone-950 to-transparent pointer-events-none" />
        </section>
    )
}

export default FinalCTA
