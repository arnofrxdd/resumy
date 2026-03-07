"use client"

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { FileText, Wand2, RefreshCw } from 'lucide-react'
import { useIsMobile } from '@/hooks/useIsMobile'

const ResumeScanner = () => {
    const isMobile = useIsMobile()
    const [step, setStep] = useState(0) // 0: Dirty, 1: Scanning, 2: Fixing, 3: Clean

    // Mouse Interaction for 3D Tilt
    const ref = useRef(null)
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const mouseXSpring = useSpring(x)
    const mouseYSpring = useSpring(y)

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"])
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"])

    const handleMouseMove = (e) => {
        if (!ref.current) return
        const rect = ref.current.getBoundingClientRect()
        const width = rect.width
        const height = rect.height
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        const xPct = mouseX / width - 0.5
        const yPct = mouseY / height - 0.5
        x.set(xPct)
        y.set(yPct)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    useEffect(() => {
        const loop = async () => {
            while (true) {
                setStep(0)
                await new Promise(r => setTimeout(r, 2000))
                setStep(1) // Scan
                await new Promise(r => setTimeout(r, 2000))
                setStep(2) // Fix
                await new Promise(r => setTimeout(r, 1500))
                setStep(3) // Result
                await new Promise(r => setTimeout(r, 4000))
            }
        }
        loop()
    }, [])

    return (
        <section className="py-24 bg-slate-50 overflow-hidden" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} ref={ref}>
            <div className="container max-w-6xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Left: Content */}
                    <div className="lg:w-1/2 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-bold uppercase tracking-wider">
                            <Wand2 className="w-4 h-4" />
                            AI Resume Rewrite
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-heading font-bold text-[#0a2540] leading-tight">
                            Turn "Rejection" into <br />
                            <span className="text-stripe-blurple">"Interview".</span>
                        </h2>
                        <p className="text-lg text-slate-500 leading-relaxed">
                            Stop sending the same weak resume. <br />
                            Our AI detects vague bullet points and rewrites them into powerful, metric-driven achievements that recruiters love.
                        </p>
                    </div>

                    {/* Right: Realistic Interactive Paper Visualization */}
                    <div className="lg:w-1/2 w-full flex justify-center perspective-1000">
                        <div className="relative group">

                            {/* The Paper Sheet - Follows Mouse Tilt */}
                            <motion.div
                                className="relative w-[340px] md:w-[400px] aspect-[1/1.414] bg-white rounded-sm shadow-2xl overflow-hidden origin-center"
                                style={{ rotateX, rotateY }}
                                initial={{ rotateX: 5 }}
                            >
                                {/* Paper Texture/Grain */}
                                <div className="absolute inset-0 bg-slate-50 opactiy-20 pointer-events-none mix-blend-multiply" />

                                {/* Header */}
                                <div className="p-8 pb-4 border-b border-slate-100">
                                    <div className="h-6 bg-slate-800 w-1/2 mb-2" />
                                    <div className="h-3 bg-slate-200 w-1/3" />
                                </div>

                                {/* Body */}
                                <div className="p-8 space-y-8 font-serif text-sm leading-relaxed text-slate-700">

                                    {/* Role Block */}
                                    <div>
                                        <div className="flex justify-between items-baseline mb-2">
                                            <span className="font-bold text-slate-900">Frontend Developer</span>
                                            <span className="text-slate-400 text-xs">2023 - Present</span>
                                        </div>

                                        <ul className="list-disc pl-4 space-y-3">

                                            {/* Bullet 1 - Morphing */}
                                            <li className="relative group">
                                                <AnimatePresence mode="wait">
                                                    {step < 2 ? (
                                                        <motion.span
                                                            key="weak1"
                                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }}
                                                            className={step === 1 ? "bg-red-100 text-red-800 transition-colors duration-300" : ""}
                                                        >
                                                            Used React to build web pages.
                                                        </motion.span>
                                                    ) : (
                                                        <motion.span
                                                            key="strong1"
                                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                                            className="font-medium text-slate-900 bg-green-50"
                                                        >
                                                            Architected scalable React components, reducing load time by 40%.
                                                        </motion.span>
                                                    )}
                                                </AnimatePresence>
                                                {/* Edit Pen Icon */}
                                                {step === 2 && (
                                                    <motion.div layoutId="cursor" className="absolute -right-6 top-0 text-stripe-blurple">
                                                        <Wand2 className="w-4 h-4" />
                                                    </motion.div>
                                                )}
                                            </li>

                                            {/* Bullet 2 - Morphing */}
                                            <li className="relative">
                                                <AnimatePresence mode="wait">
                                                    {step < 2 ? (
                                                        <motion.span
                                                            key="weak2"
                                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -10 }}
                                                            className={step === 1 ? "bg-red-100 text-red-800 transition-colors duration-300" : ""}
                                                        >
                                                            Did testing for the backend API.
                                                        </motion.span>
                                                    ) : (
                                                        <motion.span
                                                            key="strong2"
                                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                                            className="font-medium text-slate-900 bg-green-50"
                                                        >
                                                            Implemented automated CI/CD pipelines, increasing deployment reliability to 99%.
                                                        </motion.span>
                                                    )}
                                                </AnimatePresence>
                                            </li>

                                        </ul>
                                    </div>

                                </div>

                                {/* Scanner Beam */}
                                <motion.div
                                    className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent blur-sm z-20 pointer-events-none"
                                    animate={{ top: step === 1 ? "100%" : "0%" }}
                                    transition={{ duration: 2, ease: "linear" }}
                                    style={{ opacity: step === 1 ? 1 : 0 }}
                                />

                                {/* Verified Stamp */}
                                <AnimatePresence>
                                    {step === 3 && (
                                        <motion.div
                                            initial={{ scale: 2, opacity: 0, rotate: -20 }}
                                            animate={{ scale: 1, opacity: 1, rotate: -15 }}
                                            className="absolute bottom-10 right-10 border-4 border-green-600 text-green-600 font-black text-4xl p-2 rounded-lg opacity-80 uppercase tracking-widest pointer-events-none mix-blend-multiply"
                                        >
                                            Top 1%
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                            </motion.div>

                            {/* Floating Stats Card - Parallax Effect */}
                            <motion.div
                                className="absolute top-10 -right-12 bg-white p-4 rounded-xl shadow-xl border border-slate-100 z-30 w-32"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                style={{
                                    x: useTransform(mouseXSpring, [-0.5, 0.5], [10, -10]),
                                    y: useTransform(mouseYSpring, [-0.5, 0.5], [10, -10])
                                }}
                            >
                                <div className="text-xs text-slate-500 mb-1 font-bold uppercase">ATS Score</div>
                                <div className="text-3xl font-black text-stripe-blurple flex items-baseline">
                                    {step < 3 ? "42" : "94"}
                                    <span className="text-sm text-slate-400 ml-1 font-normal">/100</span>
                                </div>
                            </motion.div>

                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default ResumeScanner
