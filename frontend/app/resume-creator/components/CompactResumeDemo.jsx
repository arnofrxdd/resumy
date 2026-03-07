"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProfileImg from '@/components/landing-redesign/Screenshot 2026-02-20 021003.png'

const USER_DATA = {
    firstName: "ALEX",
    lastName: "DEV",
    role: "Senior Product Manager",
    summary: "Strategic Product Manager with 5+ years of experience leading cross-functional teams to build scalable SaaS products. Expert in Agile methodologies, data-driven decision making, and user-centric design.",
}

const ResumeTemplate = ({ type, formValues, isTop }) => {
    const isClassic = type === 'classic'
    const isCreative = type === 'creative'
    const isExecutive = type === 'executive'
    const isModern = type === 'modern'

    return (
        <div className={`w-full h-full bg-white rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)] flex flex-col relative overflow-hidden text-stone-900 ${isClassic ? 'font-serif' : 'font-sans'}`}>
            {isExecutive && <div className="absolute top-0 left-0 w-full h-[30%] bg-stone-900" />}
            <div className="flex flex-1 relative z-10 h-full">
                {(isCreative || isModern) && (
                    <div className={`w-[35%] flex flex-col p-4 space-y-4 ${isCreative ? 'bg-emerald-600 text-white' : 'bg-stone-800 text-stone-100'}`}>
                        <div className="w-10 h-10 rounded-lg bg-white/10 overflow-hidden ring-1 ring-white/20">
                            <img src={ProfileImg.src} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-4 opacity-70">
                            {[1, 2, 3].map(i => <div key={i} className="w-full h-1 bg-current opacity-20 rounded-full" />)}
                        </div>
                    </div>
                )}
                <div className={`flex-1 p-5 flex flex-col ${isClassic ? 'items-center text-center' : ''}`}>
                    <header className={`mb-4 w-full ${isExecutive ? 'text-white' : ''} ${isClassic ? 'border-b border-stone-900 pb-2' : ''}`}>
                        <h2 className="text-[14px] font-black uppercase tracking-tight truncate">
                            {formValues.firstName || "ALEX"} {formValues.lastName || "DEV"}
                        </h2>
                        <p className="text-[8px] font-bold uppercase opacity-60 truncate">
                            {formValues.role || "Product Manager"}
                        </p>
                    </header>
                    <div className="space-y-3 w-full">
                        <section className="space-y-1">
                            <div className="h-1 w-full bg-stone-100 rounded-full" />
                            <div className="h-1 w-5/6 bg-stone-100 rounded-full" />
                            <div className="h-1 w-4/6 bg-stone-100 rounded-full" />
                        </section>
                        <section className="space-y-2 pt-2 border-t border-stone-50">
                            <div className="h-1.5 w-1/3 bg-stone-200 rounded-full" />
                            <div className="space-y-1">
                                <div className="h-1 w-full bg-stone-50 rounded-full" />
                                <div className="h-1 w-5/6 bg-stone-50 rounded-full" />
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}

const CompactResumeDemo = () => {
    const [stack, setStack] = useState(['modern', 'classic', 'creative', 'executive'])
    const [formValues, setFormValues] = useState({ firstName: "", lastName: "", role: "", summary: "" })

    useEffect(() => {
        let isCancelled = false
        const runSimulation = async () => {
            while (!isCancelled) {
                // RESET
                setFormValues({ firstName: "", lastName: "", role: "", summary: "" })
                await new Promise(r => setTimeout(r, 1000))

                // TYPE: First Name
                for (let i = 0; i <= USER_DATA.firstName.length; i++) {
                    if (isCancelled) return
                    setFormValues(prev => ({ ...prev, firstName: USER_DATA.firstName.slice(0, i) }))
                    await new Promise(r => setTimeout(r, 80))
                }

                // TYPE: Role
                for (let i = 0; i <= USER_DATA.role.length; i++) {
                    if (isCancelled) return
                    setFormValues(prev => ({ ...prev, role: USER_DATA.role.slice(0, i) }))
                    await new Promise(r => setTimeout(r, 40))
                }

                await new Promise(r => setTimeout(r, 2000))

                // ROTATE STACK
                for (let j = 0; j < 4; j++) {
                    if (isCancelled) return
                    setStack(prev => {
                        const last = prev[prev.length - 1]
                        return [last, ...prev.slice(0, prev.length - 1)]
                    })
                    await new Promise(r => setTimeout(r, 2500))
                }
            }
        }
        runSimulation()
        return () => { isCancelled = true }
    }, [])

    return (
        <div className="relative w-full flex flex-col items-center gap-8 lg:flex-row lg:items-center lg:justify-center p-4">
            {/* MINI EDITOR */}
            <div className="w-full max-w-[220px] bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden flex flex-col h-[280px] pointer-events-none scale-90 lg:scale-100 origin-center">
                <div className="px-4 py-3 border-b border-stone-100 bg-stone-50/50 flex items-center justify-between">
                    <span className="text-[8px] font-black uppercase tracking-widest text-stone-400">Editor</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="p-4 space-y-4">
                    <div className="space-y-1">
                        <label className="text-[7px] font-black text-stone-300 uppercase">First Name</label>
                        <div className="h-8 px-2 bg-stone-50 border border-stone-100 rounded-lg flex items-center text-[11px] text-stone-900 font-bold">
                            {formValues.firstName}<span className="animate-pulse text-violet-600 ml-0.5">|</span>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[7px] font-black text-stone-300 uppercase">Target Role</label>
                        <div className="h-8 px-2 bg-stone-50 border border-stone-100 rounded-lg flex items-center text-[10px] text-stone-700 font-bold overflow-hidden">
                            {formValues.role}
                        </div>
                    </div>
                    <div className="space-y-1 flex-1">
                        <label className="text-[7px] font-black text-stone-300 uppercase">Summary</label>
                        <div className="h-20 p-2 bg-stone-50 border border-stone-100 rounded-lg text-[9px] text-stone-400 leading-relaxed font-medium">
                            Synthesizing experience...
                        </div>
                    </div>
                </div>
            </div>

            {/* RESUME STACK */}
            <div className="relative w-[240px] aspect-[1/1.414] scale-90 lg:scale-100 origin-center" style={{ perspective: '1200px' }}>
                <AnimatePresence mode="popLayout">
                    {[...stack].reverse().map((t) => {
                        const i = stack.indexOf(t);
                        return (
                            <motion.div
                                key={t}
                                initial={false}
                                animate={{
                                    y: i === 0 ? [null, -20, i * 6] : i * 6,
                                    x: i === 0 ? [null, 150, 0] : i * 4,
                                    rotate: i === 0 ? [null, 8, 0] : -i * 2,
                                    rotateX: -2,
                                    scale: i === 0 ? [null, 1.1, 1] : 1 - (i * 0.03),
                                    opacity: i > 3 ? 0 : 1,
                                    zIndex: 100 - i,
                                    z: -i * 30
                                }}
                                transition={{
                                    x: { duration: 0.8, ease: [0.23, 1, 0.32, 1], times: [0, 0.5, 1] },
                                    y: { duration: 0.8, ease: [0.23, 1, 0.32, 1], times: [0, 0.5, 1] },
                                    scale: { duration: 0.6, ease: "easeOut" },
                                    opacity: { duration: 0.3 },
                                    default: { type: "spring", stiffness: 70, damping: 15 }
                                }}
                                style={{ transformStyle: 'preserve-3d', transformOrigin: 'center center' }}
                                className="absolute inset-0"
                            >
                                <ResumeTemplate type={t} formValues={formValues} isTop={i === 0} />
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
                {/* Shadow */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[110%] h-6 bg-black/[0.03] blur-2xl rounded-full -z-10" />
            </div>
        </div>
    )
}

export default CompactResumeDemo
