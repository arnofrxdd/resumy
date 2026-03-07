"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useIsMobile } from '@/hooks/useIsMobile'
import ProfileImg from '../profile_alex.png'

const USER_DATA = {
    firstName: "ALEX",
    lastName: "DEV",
    role: "Senior Product Manager",
    email: "alex.dev@gaplytiq.com",
    phone: "+1 (555) 0123-4567",
    location: "San Francisco, CA",
    summary: "Strategic Product Manager with 5+ years of experience leading cross-functional teams to build scalable SaaS products. Expert in Agile methodologies, data-driven decision making, and user-centric design. Passionate about bridging the gap between technical constraints and user needs.",
    experience: [
        {
            role: "Product Lead",
            company: "TechFlow Inc.",
            date: "2020 — PRES",
            location: "SF",
            details: "Led a team of 15 engineers and designers. Increased user retention by 25% through iterative feature releases and A/B testing frameworks. Managed a $500k annual budget and defined the technical roadmap."
        },
        {
            role: "Associate PM",
            company: "ScaleGrid Systems",
            date: "2018 — 2020",
            location: "PA",
            details: "Collaborated on the redesign of the core dashboard, reducing churn by 12%. Defined 40+ user stories and led sprint planning for 3 engineering pods. Improved team velocity by 18%."
        }
    ],
    education: [
        { degree: "MBA, Product Strategy", school: "Stanford University", date: "2018" },
        { degree: "B.S. Computer Science", school: "UC Berkeley", date: "2016" }
    ],
    skills: ["Product Strategy", "SQL & Analytics", "Stakeholder Mgmt", "UX Research", "System Design", "Agile/Scrum"],
}

const ResumeTemplate = ({ type, formValues }) => {
    const isClassic = type === 'classic'
    const isCreative = type === 'creative'
    const isExecutive = type === 'executive'
    const isModern = type === 'modern'

    return (
        <div className={`w-full h-full bg-white rounded-none shadow-[0_30px_70px_rgba(0,0,0,0.2)] flex flex-col relative overflow-hidden text-stone-900 ${isClassic ? 'font-serif' : 'font-sans'}`}>
            {isExecutive && <div className="absolute top-0 left-0 w-full h-[100px] bg-slate-900" />}
            <div className="flex flex-1 relative z-10 h-full">
                {/* BODY */}
                <div className={`flex-1 p-8 flex flex-col ${isClassic ? 'items-center text-center' : ''}`}>
                    <header className={`mb-6 w-full ${isExecutive ? 'text-white' : ''} ${isClassic ? 'border-b-2 border-slate-900 pb-4' : ''}`}>
                        <h1 className="font-black uppercase tracking-tighter mb-1 text-2xl">
                            <span className={isExecutive ? 'text-white' : 'text-slate-900'}>{formValues.firstName || "ALEX"}</span>{" "}
                            <span className={isCreative ? 'text-emerald-900' : isExecutive ? 'text-emerald-400' : 'text-slate-900'}>{formValues.lastName || "DEV"}</span>
                        </h1>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">
                            {formValues.role || "Senior Product Manager"}
                        </p>
                    </header>

                    <div className="space-y-6 w-full text-left">
                        {formValues.summary && (
                            <section>
                                <h3 className={`text-[9px] font-black uppercase tracking-widest mb-1.5 border-b pb-1 ${isCreative ? 'border-emerald-100 text-emerald-800' : 'border-stone-100'}`}>Profile</h3>
                                <p className="text-[9px] leading-relaxed text-slate-600 font-bold line-clamp-3 italic">
                                    "{formValues.summary}"
                                </p>
                            </section>
                        )}

                        <section>
                            <h3 className={`text-[9px] font-black uppercase tracking-widest mb-2 border-b pb-1 ${isCreative ? 'border-emerald-100 text-emerald-800' : 'border-stone-100'}`}>Experience</h3>
                            <div className="space-y-4">
                                {USER_DATA.experience.map((job, idx) => (
                                    <div key={idx} className="relative pl-3 border-l-2 border-stone-50">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{job.role}</span>
                                            <span className="text-[8px] font-bold text-stone-300">{job.date}</span>
                                        </div>
                                        <div className="text-[8px] font-bold text-stone-400 mb-1.5 uppercase tracking-widest">{job.company}</div>
                                        <p className="text-[9.5px] text-slate-500 leading-relaxed font-bold line-clamp-3">
                                            {job.details}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section>
                            <h3 className={`text-[9px] font-black uppercase tracking-widest mb-2 border-b pb-1 ${isCreative ? 'border-emerald-100 text-emerald-800' : 'border-stone-100'}`}>Education</h3>
                            <div className="space-y-2">
                                {USER_DATA.education.map((edu, idx) => (
                                    <div key={idx} className="flex justify-between items-baseline">
                                        <div>
                                            <div className="text-[9px] font-black text-stone-900 uppercase tracking-tight">{edu.degree}</div>
                                            <div className="text-[8px] font-bold text-stone-400 uppercase tracking-wider">{edu.school}</div>
                                        </div>
                                        <span className="text-[8px] font-black text-stone-300">{edu.date}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>

                {/* SIDEBAR ON THE RIGHT */}
                {(isCreative || isModern) && (
                    <div className={`w-[130px] flex flex-col p-6 space-y-8 ${isCreative ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-100'}`}>
                        <div className="w-16 h-16 rounded-none bg-white/10 overflow-hidden ring-2 ring-white/20 shadow-lg">
                            <img src={ProfileImg.src} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <div className="space-y-6 text-[8px] font-bold">
                            <section className="space-y-2">
                                <h4 className="opacity-40 uppercase tracking-widest text-[7px] font-black">Contact</h4>
                                <div className="break-all opacity-90">{USER_DATA.email}</div>
                                <div className="opacity-90">{USER_DATA.phone}</div>
                                <div className="opacity-60">{USER_DATA.location}</div>
                            </section>
                            <section className="space-y-2.5">
                                <h4 className="opacity-40 uppercase tracking-widest text-[7px] font-black">Expertise</h4>
                                <div className="space-y-2">
                                    {USER_DATA.skills.map((s, idx) => (
                                        <div key={idx} className="flex items-center gap-2 bg-white/5 py-1 px-1.5 rounded-sm">
                                            <div className="w-1 h-1 rounded-full bg-white/30" />
                                            {s}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                )}
            </div>
            <div className={`absolute bottom-3 right-5 opacity-[0.05] pointer-events-none text-[6px] font-black uppercase tracking-[0.8em] ${isExecutive ? 'text-white' : 'text-black'}`}>
                ARCHITECT CORE SYST 2.0
            </div>
        </div>
    )
}

const ResumeCreatorArt = () => {
    const isMobile = useIsMobile()
    const [stack, setStack] = useState(['modern', 'classic', 'creative', 'executive'])
    const [formValues, setFormValues] = useState({ firstName: "", lastName: "", role: "", summary: "" })
    const currentTemplate = stack[0]

    // Theme colors based on current template
    const themeColor = currentTemplate === 'creative' ? '#059669' :
        currentTemplate === 'modern' ? '#1e293b' :
            currentTemplate === 'executive' ? '#0f172a' : '#444';

    const rotateStack = () => setStack(prev => [prev[prev.length - 1], ...prev.slice(0, prev.length - 1)])
    const setTopTemplate = (type) => setStack(prev => {
        const index = prev.indexOf(type);
        if (index === -1 || index === 0) return prev;
        const newStack = [...prev];
        const [item] = newStack.splice(index, 1);
        return [item, ...newStack];
    })

    useEffect(() => {
        let isCancelled = false
        const runSimulation = async () => {
            while (!isCancelled) {
                setStack(['modern', 'classic', 'creative', 'executive'])
                setFormValues({ firstName: "", lastName: "", role: "", summary: "" })
                await new Promise(r => setTimeout(r, 1500))

                for (let i = 0; i <= USER_DATA.firstName.length; i++) {
                    if (isCancelled) return
                    setFormValues(prev => ({ ...prev, firstName: USER_DATA.firstName.slice(0, i) }))
                    await new Promise(r => setTimeout(r, 40))
                }
                for (let i = 0; i <= USER_DATA.lastName.length; i++) {
                    if (isCancelled) return
                    setFormValues(prev => ({ ...prev, lastName: USER_DATA.lastName.slice(0, i) }))
                    await new Promise(r => setTimeout(r, 40))
                }
                for (let i = 0; i <= USER_DATA.role.length; i++) {
                    if (isCancelled) return
                    setFormValues(prev => ({ ...prev, role: USER_DATA.role.slice(0, i) }))
                    await new Promise(r => setTimeout(r, 30))
                }
                await new Promise(r => setTimeout(r, 600))
                if (isCancelled) return
                setTopTemplate('creative')

                for (let i = 0; i <= USER_DATA.summary.length; i += (isMobile ? 8 : 4)) {
                    if (isCancelled) return
                    setFormValues(prev => ({ ...prev, summary: USER_DATA.summary.slice(0, i) }))
                    if (i === Math.floor(USER_DATA.summary.length / 3)) setTopTemplate('classic')
                    if (i === Math.floor(USER_DATA.summary.length * 2 / 3)) setTopTemplate('executive')
                    await new Promise(r => setTimeout(r, 20))
                }

                for (let i = 0; i < (isMobile ? 2 : 4); i++) {
                    if (isCancelled) return
                    rotateStack()
                    await new Promise(r => setTimeout(r, 2000))
                }
                if (isCancelled) return
                setTopTemplate('modern')
                await new Promise(r => setTimeout(r, 4000))
            }
        }
        runSimulation()
        return () => { isCancelled = true }
    }, [isMobile])

    return (
        <div className="flex flex-col items-center justify-center relative w-full h-full max-h-[550px] scale-[0.8] lg:scale-95">
            {/* RESUME STACK */}
            <div className="relative w-[380px] aspect-[1/1.414] flex items-center justify-center" style={{ perspective: '1200px' }}>
                <AnimatePresence mode="popLayout">
                    {stack.slice(0, 1).map((t) => (
                        <motion.div
                            key={t}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            className="absolute w-full h-full"
                        >
                            <ResumeTemplate type={t} formValues={formValues} />
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* FLOATING FORM - POSITIONED BOTTOM RIGHT */}
                <motion.div
                    className="absolute -bottom-12 -right-16 w-[280px] z-50 pointer-events-none"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1 }}
                >
                    <div className="bg-white rounded-none shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] border border-stone-100 overflow-hidden flex flex-col h-[340px] scale-[0.9]">
                        <div className="px-5 py-3.5 border-b border-stone-50 flex items-center justify-between" style={{ background: `${themeColor}08` }}>
                            <span className="font-black text-[9px] uppercase tracking-[0.25em]" style={{ color: themeColor }}>EDITOR — AI CORE</span>
                            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: themeColor }} />
                        </div>
                        <div className="p-5 space-y-4 flex-1 bg-white">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[8px] font-black text-stone-300 uppercase tracking-widest">Entry</label>
                                    <div className="h-9 px-3 bg-stone-50/50 border border-stone-100 rounded-none flex items-center text-[11px] text-stone-900 font-bold">
                                        {formValues.firstName}<span className="animate-pulse ml-0.5" style={{ color: themeColor }}>|</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[8px] font-black text-stone-300 uppercase tracking-widest">Surname</label>
                                    <div className="h-9 px-3 bg-stone-50/50 border border-stone-100 rounded-none flex items-center text-[11px] text-stone-900 font-bold opacity-30">
                                        {formValues.lastName}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[8px] font-black text-stone-300 uppercase tracking-widest">Target Role</label>
                                <div className="h-9 px-3 bg-stone-50/50 border border-stone-100 rounded-none flex items-center text-[11px] text-stone-900 font-bold">
                                    {formValues.role}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[8px] font-black text-stone-300 uppercase tracking-widest">AI Refined Summary</label>
                                <div className="h-28 p-3 bg-stone-50/50 border border-stone-100 rounded-none text-[10px] text-stone-700 font-bold leading-relaxed line-clamp-5">
                                    {formValues.summary}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 w-[110%] h-12 bg-black/[0.06] blur-[50px] rounded-full -z-10" />
            </div>
        </div>
    )
}

export default ResumeCreatorArt;
