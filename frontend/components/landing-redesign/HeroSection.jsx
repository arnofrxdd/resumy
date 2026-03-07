"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Play, FileCheck, Target, Users, BarChart3, Fingerprint, Sparkles, FileText } from 'lucide-react'
import Link from 'next/link'
import HeroResumeEvolution from './HeroResumeEvolution'
import { UnderlineDoodle, SparkleDoodle, ScribbleDoodle, BridgeDoodle, ComparisonDoodle, CircleDoodle, ArrowDoodle, ZigZagDoodle, CurvyArrowDoodle, HeartDoodle, BoxDoodle, StarDoodle, HighlightDoodle } from './DoodleAnimations'
import { useIsMobile } from '@/hooks/useIsMobile'

const HeroSection = ({ isAuthenticated }) => {
    const isMobile = useIsMobile()

    return (
        <section className="relative pt-24 pb-12 md:pt-14 md:pb-16 lg:pt-20 lg:pb-20 overflow-hidden bg-white will-change-transform">
            {/* Personality Background Elements - Reduced on mobile */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[100%] bg-emerald-200/40 blur-[60px] rounded-full pointer-events-none" />
            {!isMobile && (
                <>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[80%] bg-orange-100/60 blur-[60px] rounded-full pointer-events-none" />
                    <div className="absolute top-[30%] left-[20%] w-[20%] h-[20%] bg-rose-100/50 blur-[40px] rounded-full pointer-events-none" />
                </>
            )}

            {/* Doodles & Decorations - Scaled for bigger screens */}
            <div className="absolute top-24 left-10 opacity-60 hidden xl:block animate-pulse-slow 2xl:scale-125 2xl:top-32 2xl:left-20">
                <SparkleDoodle color="#10B981" className="w-12 h-12" />
            </div>
            <div className="absolute bottom-32 right-[45%] opacity-40 hidden xl:block 2xl:scale-125 2xl:bottom-48 2xl:right-[48%]">
                <StarDoodle color="#F59E0B" className="w-8 h-8" />
            </div>
            <div className="absolute top-40 right-10 opacity-30 hidden xl:block 2xl:scale-125 2xl:top-48 2xl:right-20">
                <BoxDoodle color="#10B981" className="w-16 h-16 rotate-12" />
            </div>

            {/* Grid Pattern with a twist - Optimized for mobile */}
            <div className="absolute inset-0 opacity-[0.08] md:opacity-[0.12] pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, #10B981 1px, transparent 1px)',
                    backgroundSize: isMobile ? '40px 40px' : '28px 28px'
                }}
            />


            <div className="w-full max-w-7xl mx-auto px-4 md:px-6 relative z-10">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-8 xl:gap-12 items-center">

                    {/* Left: Content */}
                    <div className="text-center lg:text-left relative">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 bg-violet-600/5 text-violet-700 rounded-lg text-[8.5px] sm:text-[10px] font-black uppercase tracking-widest mb-4 lg:mb-6 border border-violet-200/60 shadow-sm text-center max-w-[95%] mx-auto lg:mx-0"
                        >
                            <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                            <span>Your career's best friend is here</span>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="relative mt-2 lg:mt-0"
                        >
                            <h1 className="text-[11.5vw] sm:text-6xl md:text-6xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black tracking-tighter leading-[0.9] sm:leading-[0.85] mb-8 lg:mb-10 text-stone-900">
                                <span className="block italic font-serif font-normal text-violet-600 mb-4 lg:mb-5 relative w-fit mx-auto lg:mx-0 z-10">
                                    Build
                                    {/* Highlight effect behind 'Build' */}
                                    <span className="absolute -inset-x-4 top-1/2 -translate-y-1/2 h-[120%] -z-10 opacity-30 skew-x-[-10deg] scale-110">
                                        <HighlightDoodle color="#8B5CF6" className="w-full h-full" />
                                    </span>
                                </span>
                                <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 leading-none whitespace-nowrap">
                                    The Perfect.
                                    {/* Jagged scribble under 'The Perfect' */}
                                    <ScribbleDoodle color="#8B5CF6" className="absolute -bottom-4 sm:-bottom-6 lg:-bottom-8 right-0 w-[110%] h-4 sm:h-6 lg:h-8 opacity-80 rotate-[-2deg] 2xl:scale-110" />
                                </span>
                                <span className="block mt-8 sm:mt-6 lg:mt-8 relative text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-rose-500 leading-none w-fit mx-auto lg:mx-0">
                                    Bridge.
                                    {/* Bold underline for 'Bridge' */}
                                    <UnderlineDoodle color="#F97316" className="absolute -bottom-4 md:-bottom-6 left-0 w-full h-6 md:h-10 z-0 opacity-90 2xl:scale-110" />
                                </span>
                            </h1>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-[14px] sm:text-base md:text-lg lg:text-xl text-stone-500 leading-[1.6] sm:leading-relaxed max-w-[320px] sm:max-w-lg lg:max-w-xl 2xl:max-w-2xl mx-auto lg:mx-0 mb-8 lg:mb-10 font-medium"
                        >
                            Ever wonder why your resume goes into a black hole? It's usually just <span className="inline-block text-violet-600 font-bold bg-violet-50 border border-violet-100 shadow-sm px-1.5 py-px rounded-md mx-0.5 transform -rotate-1">one or two</span> tiny things missing. We find them for you.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="hidden lg:flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center lg:justify-start"
                        >
                            <Link
                                href={isAuthenticated ? "/skill-gap" : "/register"}
                                className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-3.5 2xl:px-10 2xl:py-4 bg-stone-900 text-white rounded-xl font-black text-sm sm:text-base 2xl:text-lg hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 group relative overflow-hidden"
                            >
                                <span className="relative z-10">Scan My Resume</span>
                                <ArrowRight className="w-5 h-5 2xl:w-6 2xl:h-6 transition-transform group-hover:translate-x-1 relative z-10" />
                            </Link>

                            <Link
                                href={isAuthenticated ? "/resume-creator" : "/register"}
                                className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-3.5 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] text-stone-700 rounded-xl font-black text-sm sm:text-base hover:bg-stone-50 transition-all border border-stone-200/60 flex items-center justify-center gap-3 group hover:border-emerald-200/60"
                            >
                                <FileText className="w-4 h-4 text-emerald-600 fill-current" />
                                Create your resume now
                            </Link>
                        </motion.div>

                        {/* Personality Stats - Adjusted layout */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="mt-8 lg:mt-12 hidden lg:flex flex-wrap items-center justify-center lg:justify-start gap-4 lg:gap-8"
                        >
                            {/* Floating Mini Widget */}
                            <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-white rounded-full border border-stone-100 shadow-sm">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                                            <img src={`https://i.pravatar.cc/100?u=${i + 10}`} alt="user" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                                <span className="text-[10px] font-extrabold text-stone-500 uppercase tracking-widest">
                                    <span className="text-stone-900">2k+</span> Hired
                                </span>
                            </div>

                            <div className="flex flex-col gap-0.5 text-center lg:text-left">
                                <div className="text-xl lg:text-2xl 2xl:text-3xl font-black text-stone-900 tabular-nums leading-none">12,000+</div>
                                <div className="text-[9px] 2xl:text-[11px] text-stone-400 font-black uppercase tracking-widest italic">Success Stories</div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: The Evolution Visual - NOW VISIBLE ON MOBILE */}
                    <div className="relative w-full flex justify-center lg:justify-end mt-4 sm:mt-8 lg:mt-0">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="relative z-10 w-full lg:-mr-10 xl:-mr-10 origin-center lg:origin-right"
                        >
                            <HeroResumeEvolution />
                        </motion.div>

                        {/* Hand-drawn Arrow with Personality */}
                        <div className="absolute -top-6 right-12 opacity-40 hidden xl:block rotate-[160deg] animate-pulse">
                            <CurvyArrowDoodle color="#10B981" className="w-20 h-20" />
                            <div className="absolute top-0 -left-20 rotate-[-160deg] text-emerald-600 font-serif italic text-sm whitespace-nowrap bg-white/80 backdrop-blur-sm px-2 rounded-lg border border-emerald-100/50">
                                The "Magic" happens here
                            </div>
                        </div>

                        {/* Additional Doodles */}
                        <div className="absolute -bottom-10 -left-10 opacity-30 hidden xl:block">
                            <ZigZagDoodle color="#F97316" className="w-28 h-6" />
                        </div>
                    </div>

                    {/* MOBILE ONLY: CTA & Stats Below Visual */}
                    <div className="flex lg:hidden flex-col items-center gap-6 -mt-16 sm:-mt-8 mb-8 relative z-30 w-full px-4">
                        <motion.div
                            initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            animate={isMobile ? { opacity: 1, y: 0 } : undefined}
                            whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="flex flex-col w-full sm:w-auto gap-4 items-center justify-center"
                        >
                            <Link
                                href={isAuthenticated ? "/skill-gap" : "/register"}
                                className="w-full sm:w-auto px-8 py-5 bg-stone-900 text-white rounded-xl font-black text-base hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 group relative overflow-hidden"
                            >
                                <span className="relative z-10 tracking-widest uppercase text-xs">Scan My Resume</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 relative z-10" />
                            </Link>

                            <Link
                                href={isAuthenticated ? "/resume-creator" : "/register"}
                                className="w-full sm:w-auto px-8 py-4 bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] text-stone-700 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-stone-50 transition-all border border-stone-200/60 flex items-center justify-center gap-3 group hover:border-emerald-200/60"
                            >
                                <FileText className="w-4 h-4 text-emerald-600 fill-current" />
                                Create your resume now
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={isMobile ? { opacity: 1 } : { opacity: 0 }}
                            animate={isMobile ? { opacity: 1 } : undefined}
                            whileInView={isMobile ? undefined : { opacity: 1 }}
                            viewport={{ once: true }}
                            className="flex flex-col gap-1 text-center mt-2"
                        >
                            <div className="text-2xl font-black text-stone-900 tabular-nums leading-none">12,000+</div>
                            <div className="text-[10px] text-stone-400 font-black uppercase tracking-[0.2em] italic">Success Stories</div>
                        </motion.div>
                    </div>

                </div>
            </div>

            {/* Bottom transition gradient */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
        </section>
    )
}

export default HeroSection

