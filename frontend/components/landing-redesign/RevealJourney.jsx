"use client"

import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Upload, Search, ListChecks, Check, FileText, Target, Zap, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { UnderlineDoodle, SparkleDoodle, BridgeDoodle, CircleDoodle, ScribbleDoodle } from './DoodleAnimations'

const steps = [
    {
        id: "diagnostic",
        icon: <Upload className="w-5 h-5" />,
        title: "Scan Your Foundation",
        metric: "Diagnostic Scan",
        desc: "Upload your current resume. Our diagnostic engine deep-scans for ATS compliance and identifies exactly what's holding you back.",
        visual: "upload"
    },
    {
        id: "gaps",
        icon: <ListChecks className="w-5 h-5" />,
        title: "Identify the Gaps",
        metric: "Gap Mapping",
        desc: "We cross-reference your profile with 10k+ successful hires to show you the missing 10% skills that recruiters are looking for.",
        visual: "analysis"
    },
    {
        id: "bridge",
        icon: <Target className="w-5 h-5" />,
        title: "Bridge the Void",
        metric: "Skill Bridging",
        desc: "Instead of generic courses, we build you a surgical roadmap. Learn exactly what's missing, build a project that proves it, and get certified.",
        visual: "roadmap"
    },
    {
        id: "noteworthy",
        icon: <ShieldCheck className="w-5 h-5" />,
        title: "Get Noticed Instantly",
        metric: "Proof of Ability",
        desc: "Your new resume isn't just words—it's backed by Gaplytiq proof. We highlight your bridged skills directly to hiring partners.",
        visual: "hired"
    }
]

const RevealJourney = () => {
    const [activeIndex, setActiveIndex] = useState(0)
    const [isMobile, setIsMobile] = useState(false)
    const containerRef = useRef(null)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })

    // Map scroll progress to active index (0, 1, 2, 3)
    const activeIdx = useTransform(scrollYProgress, [0, 0.2, 0.45, 0.7, 1], [0, 0, 1, 2, 3])

    useEffect(() => {
        return activeIdx.on("change", (latest) => {
            const rounded = Math.round(latest)
            if (rounded !== activeIndex) {
                setActiveIndex(rounded)
            }
        })
    }, [activeIndex, activeIdx])

    return (
        <section ref={containerRef} className="relative lg:h-[400vh] bg-white">
            <div className="lg:sticky top-0 lg:h-screen w-full flex flex-col justify-center overflow-hidden py-16 lg:py-0">
                {/* Background Aesthetics */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                    <div className="absolute top-[10%] left-[-5%] w-[40%] h-[40%] bg-violet-50/50 blur-[120px] rounded-full" />
                    <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-rose-50/50 blur-[120px] rounded-full" />
                </div>

                <div className="container max-w-6xl mx-auto px-6 relative z-10">
                    {/* Header Section */}
                    <motion.div
                        style={{
                            opacity: useTransform(scrollYProgress, [0, 0.05], [1, 0.98]),
                            scale: useTransform(scrollYProgress, [0, 0.05], [1, 0.99])
                        }}
                        className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-12 mb-20 relative z-20 px-4"
                    >
                        <div className="text-center lg:text-left max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-950 text-white shadow-[6px_6px_0px_rgba(139,92,246,0.3)] border border-stone-800 mb-8 lg:rotate-[-1deg]">
                                <Zap className="w-4 h-4 text-violet-400 fill-violet-400" />
                                <span className="text-[11px] font-black uppercase tracking-[0.3em]">The Execution Plan</span>
                            </div>

                            <h2 className="text-[13vw] sm:text-6xl md:text-6xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black text-stone-900 tracking-tighter leading-[0.9] sm:leading-[0.85] flex flex-col">
                                <span>How We Get</span>
                                <span className="relative inline-block mt-2 lg:mt-1">
                                    <span className="relative z-10 font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-500 to-rose-500 font-normal">You Hired.</span>
                                    <UnderlineDoodle color="#8B5CF6" className="absolute -bottom-1 lg:-bottom-2 left-0 w-full h-8 lg:h-6 opacity-40" />
                                </span>
                            </h2>
                        </div>

                        <div className="lg:max-w-sm text-center lg:text-right relative">
                            <p className="text-xl md:text-2xl text-stone-800 font-bold italic leading-[1.2] tracking-tight relative z-10">
                                "I didn't need a <br className="hidden lg:block" /> 3-month course. <br />
                                I just needed to know <br className="hidden lg:block" /> <span className="text-violet-600 relative">
                                    which 3 things
                                    <ScribbleDoodle color="#8B5CF6" className="absolute -bottom-2 left-0 w-full h-3 opacity-30" />
                                </span> to learn."
                            </p>
                            <SparkleDoodle color="#F97316" className="absolute -top-8 lg:-left-8 left-0 w-12 h-12 opacity-40 animate-pulse" />
                            <div className="mt-3 text-[9px] font-black text-stone-300 uppercase tracking-[0.3em]">Real Testimonial</div>
                        </div>
                    </motion.div>

                    {/* Main Split Layout */}
                    <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center justify-between">
                        {/* Artwork side - Hidden entirely on Mobile */}
                        <div className="hidden lg:flex lg:w-[45%] w-full justify-center scale-[0.7] sm:scale-90 lg:scale-100 origin-center">
                            <div className="relative w-full max-w-[450px] aspect-[4/5] lg:aspect-[3/4] flex items-center justify-center p-1 bg-white rounded-[4rem] border border-stone-200 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.15)] overflow-hidden">
                                <AnimatePresence mode="wait">
                                    {!isMobile && (
                                        <motion.div
                                            key={activeIndex}
                                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: -30 }}
                                            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                                            className="w-full h-full"
                                        >
                                            <VisualCard type={steps[activeIndex].visual} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Text Side (Right) - More compact and sleek */}
                        <div className="lg:w-[55%] w-full space-y-4 lg:space-y-3">
                            {steps.map((step, idx) => (
                                <div
                                    key={step.id}
                                    className={`relative group flex flex-col lg:flex-row gap-3 lg:gap-5 p-4 sm:p-5 lg:p-6 rounded-2xl lg:rounded-[2.2rem] transition-all duration-500 border-2
                                        ${activeIndex === idx ? 'lg:bg-white lg:border-stone-950 lg:shadow-[12px_12px_0px_rgba(0,0,0,0.08)] lg:scale-[1.03] lg:z-20 lg:opacity-100 lg:grayscale-0' : 'lg:bg-transparent lg:border-transparent lg:opacity-15 lg:grayscale lg:scale-[0.95]'}
                                        bg-white border-stone-200 shadow-[4px_4px_0px_rgba(0,0,0,0.05)] opacity-100 grayscale-0 scale-100
                                    `}
                                >
                                    {/* --- MOBILE HEADER: Icon + Title --- */}
                                    <div className="flex lg:hidden flex-row gap-3 items-center mb-1">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border-2 bg-stone-950 text-white border-stone-950 shadow-[2px_2px_0px_rgba(37,99,235,0.3)] relative z-10">
                                            {React.cloneElement(step.icon, { className: "w-4 h-4" })}
                                        </div>
                                        <div className="flex flex-col gap-0.5">
                                            <div className="flex items-center">
                                                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-stone-950 shadow-[1px_1px_0px_rgba(0,0,0,1)] text-white ${idx === 0 || idx === 1 ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                                                    {step.metric}
                                                </span>
                                            </div>
                                            <h3 className="text-[17px] sm:text-xl font-black text-stone-950 tracking-tight leading-none mt-1">
                                                {step.title}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* --- DESKTOP ICON --- */}
                                    <div className={`hidden lg:flex mt-0.5 w-14 h-14 rounded-[1.2rem] items-center justify-center shrink-0 transition-all duration-500 border-2 relative z-10
                                        ${activeIndex === idx ? 'bg-stone-950 text-white border-stone-950 shadow-[5px_5px_0px_rgba(37,99,235,0.4)] lg:rotate-0' : 'bg-stone-100 text-stone-400 border-stone-200 lg:rotate-[-8deg]'}
                                    `}>
                                        {React.cloneElement(step.icon, { className: "w-6 h-6" })}
                                    </div>

                                    <div className="flex-1 space-y-0 lg:space-y-2 relative z-10 w-full">

                                        {/* --- DESKTOP HEADER --- */}
                                        <div className="hidden lg:flex items-center gap-2">
                                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-md border-2
                                                ${activeIndex === idx
                                                    ? (idx === 0 || idx === 1 ? 'bg-blue-600 border-stone-950 shadow-[2px_2px_0px_rgba(0,0,0,1)]' : 'bg-emerald-600 border-stone-950 shadow-[2px_2px_0px_rgba(0,0,0,1)]') + ' text-white'
                                                    : 'bg-stone-50 text-stone-400 border-stone-200'}
                                            `}>
                                                {step.metric}
                                            </span>
                                        </div>
                                        <h3 className={`hidden lg:block text-3xl font-black transition-colors duration-500 
                                            ${activeIndex === idx ? 'text-stone-950 tracking-tight' : 'text-stone-400'}
                                        `}>
                                            {step.title}
                                        </h3>

                                        {/* --- MOBILE ART WORK (Injected inside text flow) --- */}
                                        <div className="flex lg:hidden w-[105%] -ml-[2.5%] h-[320px] sm:h-[380px] relative items-center justify-center mt-2 -mb-2 overflow-hidden mx-auto bg-stone-50/20 rounded-xl border border-stone-100/30">
                                            <div className="absolute w-[380px] h-[480px] flex items-center justify-center scale-[0.75] sm:scale-[0.85] origin-center pointer-events-none">
                                                {isMobile && <VisualCard type={step.visual} />}
                                            </div>
                                        </div>

                                        <div className={`overflow-hidden transition-all duration-500 
                                            ${activeIndex === idx ? 'lg:max-h-[200px] lg:opacity-100 lg:mt-3' : 'lg:max-h-0 lg:opacity-0 lg:mt-0'}
                                            max-h-[300px] opacity-100 mt-2 sm:mt-3
                                        `}>
                                            <p className="text-stone-600 lg:text-stone-700 font-bold leading-relaxed text-[13px] md:text-base">
                                                {step.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="absolute -left-16 top-1/2 -translate-y-1/2 hidden xl:flex flex-col items-center gap-4">
                        <div className="w-[4px] h-64 bg-stone-100 relative rounded-full overflow-hidden border border-stone-200">
                            <motion.div
                                style={{ height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
                                className="w-full bg-stone-950"
                            />
                        </div>
                        <span className="[writing-mode:vertical-lr] text-xs font-black uppercase text-stone-900 tracking-[0.5em] rotate-180">Progress</span>
                    </div>
                </div>
            </div>
        </section>
    )
}

const VisualCard = React.memo(({ type }) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center will-change-transform">
            {type === 'upload' && (


                <div className="w-full h-full relative lg:p-4 flex flex-col lg:bg-white">
                    {/* Diagnostic Engine Frame */}
                    <div className="flex-1 relative lg:bg-stone-50 lg:rounded-[2.5rem] lg:border border-stone-200 lg:shadow-sm overflow-hidden group">

                        {/* The scanning environment */}
                        <div className="absolute inset-0 flex items-center justify-center p-8">
                            {/* The Main Resume being processed */}
                            <motion.div
                                initial={{ y: 100, opacity: 0 }}
                                animate={{
                                    y: 0,
                                    opacity: 1,
                                    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] }
                                }}
                                className="relative w-full aspect-[1/1.414] max-w-[285px] bg-white rounded-lg shadow-[0_25px_60px_rgba(0,0,0,0.12)] border border-stone-200 z-10 overflow-hidden flex"
                            >
                                {/* Solid Blue Sidebar */}
                                <div className="w-12 bg-blue-600 shrink-0 flex flex-col items-center py-6 gap-3">
                                    <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20" />
                                    <div className="space-y-1.5 opacity-20">
                                        <div className="w-5 h-0.5 bg-white rounded-full" />
                                        <div className="w-5 h-0.5 bg-white rounded-full" />
                                        <div className="w-3 h-0.5 bg-white rounded-full" />
                                    </div>
                                </div>

                                {/* Resume Content - Detailed but Clean */}
                                <div className="flex-1 p-5 space-y-4">
                                    {/* Header with Name & Contact - More Color */}
                                    <div className="border-b-2 border-stone-100 pb-4 text-center">
                                        <div className="text-[11px] font-black text-blue-600 tracking-tight mb-1 uppercase">Alex Thompson</div>
                                        <div className="flex justify-center gap-2 opacity-100">
                                            <div className="text-[6px] font-bold text-stone-500 uppercase">New York, NY</div>
                                            <div className="text-[6px] font-black text-blue-400">•</div>
                                            <div className="text-[6px] font-bold text-stone-950">alex.t@email.com</div>
                                        </div>
                                    </div>

                                    {/* Experience Section - Realistic Text */}
                                    <div className="space-y-3">
                                        <div className="text-[7px] font-black text-stone-950 uppercase tracking-widest border-b border-stone-100 pb-1">Experience</div>
                                        {[1, 2].map(i => (
                                            <div key={i} className="space-y-1">
                                                <div className="flex justify-between items-start">
                                                    <div className="text-[6px] font-bold text-stone-900">{i === 1 ? "Senior Product Designer" : "UI/UX Designer"}</div>
                                                    <div className="text-[5px] text-stone-500 font-bold">{i === 1 ? "2021 - Present" : "2018 - 2021"}</div>
                                                </div>
                                                <div className="text-[5.5px] font-bold text-blue-700 mb-1">{i === 1 ? "TechFlow Solutions" : "Creative Edge Agency"}</div>
                                                <div className="space-y-1 pl-1">
                                                    <div className="flex items-start gap-1">
                                                        <div className="w-1 h-1 rounded-full bg-stone-300 mt-1" />
                                                        <div className="text-[5.5px] text-stone-800 font-medium leading-tight">Led design systems for enterprise-scale applications.</div>
                                                    </div>
                                                    <div className="flex items-start gap-1">
                                                        <div className="w-1 h-1 rounded-full bg-stone-300 mt-1" />
                                                        <div className="text-[5.5px] text-stone-800 font-medium leading-tight">Collaborated with cross-functional teams to ship features.</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Education Section */}
                                    <div className="space-y-2">
                                        <div className="text-[7px] font-black text-stone-950 uppercase tracking-widest border-b border-stone-100 pb-1">Education</div>
                                        <div className="flex justify-between items-center">
                                            <div className="text-[6px] font-bold text-stone-800">B.S. in Interaction Design</div>
                                            <div className="text-[5px] text-stone-400">NYU</div>
                                        </div>
                                    </div>

                                    {/* Skills Section - Actual Words */}
                                    <div className="space-y-2">
                                        <div className="text-[7px] font-black text-stone-950 uppercase tracking-widest border-b border-stone-100 pb-1">Technical Skills</div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {["React", "Figma", "Node.js", "Python", "Tailwind"].map(skill => (
                                                <div key={skill} className="px-2 py-0.5 bg-stone-900 border border-stone-800 rounded-[3px] text-[6px] font-black text-white uppercase tracking-tighter">
                                                    {skill}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>



                                {/* Active Analysis Indicators On the Resume */}
                                <motion.div
                                    animate={{
                                        top: ["-20%", "120%"],
                                    }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="absolute left-0 right-0 h-24 bg-gradient-to-b from-transparent via-violet-500/10 to-transparent pointer-events-none"
                                />

                                {/* Data Extraction Bubbles - Repositioned for Vertical */}
                                <AnimatePresence>
                                    {[1, 2, 3].map(i => (
                                        <motion.div
                                            key={i}
                                            initial={{ scale: 0, opacity: 0, x: 0, y: 0 }}
                                            animate={{
                                                scale: [0, 1, 0],
                                                opacity: [0, 1, 0],
                                                x: i === 1 ? -40 : i === 2 ? 40 : 0,
                                                y: i === 3 ? -60 : -40
                                            }}
                                            transition={{
                                                duration: 2.5,
                                                repeat: Infinity,
                                                delay: i * 0.8,
                                                ease: "easeOut"
                                            }}
                                            className="absolute top-1/2 left-1/2 -translate-x-1/2 p-1.5 bg-stone-900 text-white rounded-md shadow-xl z-20 flex items-center gap-1.5 whitespace-nowrap border border-stone-800"
                                        >
                                            <div className="w-1 h-1 rounded-full bg-violet-400 animate-pulse" />
                                            <span className="text-[7px] font-black tracking-widest uppercase">
                                                {i === 1 ? "Keywords" : i === 2 ? "ATS Check" : "Grammar"}
                                            </span>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        </div>

                        {/* High-Precision Scanning Beam */}
                        <div className="absolute inset-0 z-20 pointer-events-none px-8">
                            <div className="relative w-full h-full max-w-[280px] mx-auto">
                                <motion.div
                                    animate={{ top: ["5%", "95%", "5%"] }}
                                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute left-[-10px] right-[-10px] h-[2px] z-30"
                                >
                                    <div className="absolute inset-0 bg-violet-500 shadow-[0_0_15px_#8b5cf6]" />
                                    <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-violet-500/20 to-transparent -translate-y-full" />

                                    {/* Scan Line Detail */}
                                    <div className="absolute -left-1 -right-1 top-1/2 -translate-y-1/2 flex justify-between">
                                        <div className="w-1 h-4 bg-violet-500 rounded-full" />
                                        <div className="w-1 h-4 bg-violet-500 rounded-full" />
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Status HUD - Cleaned Up */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-stone-200 shadow-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[8px] font-black text-stone-600 tracking-widest uppercase">Deep Scan in Progress</span>
                        </div>
                    </div>
                </div>
            )}
            {type === 'analysis' && (
                <div className="h-full w-full relative lg:p-6 flex flex-col gap-6 overflow-hidden">
                    {/* Neural Background Grid with Ambient Glow - Warmed Up */}
                    <div className="absolute inset-0 pointer-events-none opacity-40">
                        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #8B5CF6 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                        <motion.div
                            animate={{
                                opacity: [0.2, 0.4, 0.2],
                            }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute inset-0 bg-gradient-to-t from-blue-500/10 via-amber-50/10 to-orange-500/5"
                        />
                    </div>


                    <div className="flex-1 grid grid-cols-2 gap-6 relative z-10">
                        {/* Resume Side */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="bg-white/95 backdrop-blur-sm rounded-3xl border border-stone-100 shadow-xl relative overflow-hidden flex"
                        >
                            {/* Professional Blue Sidebar - Solid Color */}
                            <div className="w-16 bg-blue-600 flex flex-col items-center py-6 gap-4">
                                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20" />
                                <div className="space-y-1">
                                    <div className="w-6 h-0.5 bg-white/20 rounded-full" />
                                    <div className="w-6 h-0.5 bg-white/20 rounded-full" />
                                    <div className="w-4 h-0.5 bg-white/20 rounded-full" />
                                </div>
                            </div>

                            <div className="flex-1 p-6">
                                <div className="text-[10px] font-black text-blue-600/60 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-blue-100 border border-blue-200" />
                                    Your Profile
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { name: "React / Next.js", match: 100 },
                                        { name: "TypeScript", match: 100 },
                                        { name: "System Design", match: 40 },
                                        { name: "Cloud Arch", match: 0 },
                                        { name: "UI/UX Design", match: 100 }
                                    ].map((skill, i) => (
                                        <div key={i} className="space-y-1.5">
                                            <div className="flex justify-between text-[9px] font-bold text-stone-600">
                                                <span>{skill.name}</span>
                                                <span className={skill.match < 100 ? "text-orange-500" : "text-emerald-500"}>{skill.match}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-stone-50 rounded-full overflow-hidden border border-stone-100 relative">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${skill.match}%` }}
                                                    transition={{ duration: 1, delay: i * 0.1 + 0.5 }}
                                                    className={`h-full relative ${skill.match < 100 ? "bg-gradient-to-r from-rose-400 to-orange-400" : "bg-gradient-to-r from-emerald-400 to-teal-400"}`}
                                                >

                                                </motion.div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Market Side - Cozier Colors */}
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="bg-orange-50/40 backdrop-blur-sm rounded-3xl p-6 border border-orange-100 shadow-sm relative overflow-hidden"
                        >
                            <div className="text-[10px] font-black text-orange-600/60 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-orange-100 border border-orange-200" />
                                Market Requirements
                            </div>
                            <div className="space-y-4">
                                {[
                                    "Enterprise Architecture",
                                    "AWS Solution Design",
                                    "Scalable Microservices",
                                    "Team Leadership",
                                    "Performance Tuning"
                                ].map((req, i) => (
                                    <div key={i} className={`flex items-center gap-3 p-2 bg-white/80 rounded-xl border transition-all duration-500 ${i < 2 ? "border-orange-200 shadow-[0_4px_12px_rgba(249,115,22,0.08)]" : "border-stone-100 shadow-sm"}`}>
                                        <motion.div
                                            animate={i < 2 ? {
                                                scale: [1, 1.2, 1],
                                                backgroundColor: ["#f97316", "#fb923c", "#f97316"]
                                            } : {}}
                                            transition={{ duration: 2, repeat: Infinity }}
                                            className={`w-2 h-2 rounded-full ${i < 2 ? "bg-orange-500" : "bg-stone-200"}`}
                                        />
                                        <span className="text-[9px] font-bold text-stone-700">{req}</span>
                                        {i < 2 && (
                                            <motion.div
                                                animate={{ opacity: [0.5, 1, 0.5] }}
                                                transition={{ duration: 1.5, repeat: Infinity }}
                                                className="ml-auto text-[8px] font-black text-orange-600 uppercase tracking-tighter bg-orange-100/50 px-1.5 py-0.5 rounded border border-orange-200"
                                            >
                                                GAP_FOUND
                                            </motion.div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Connection Lines (Visual Bridge) */}
                        <div className="absolute inset-0 pointer-events-none z-10">
                            <svg className="w-full h-full" viewBox="0 0 400 300">
                                {[0, 1, 2, 3, 4].map(i => (
                                    <React.Fragment key={i}>
                                        <motion.path
                                            d={`M 180 ${70 + i * 35} L 220 ${70 + i * 35}`}
                                            stroke={i < 2 ? "#f43f5e" : "#10b981"}
                                            strokeWidth="1.5"
                                            strokeDasharray="4 4"
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={{
                                                pathLength: 1,
                                                opacity: 0.3,
                                                strokeDashoffset: [0, -10]
                                            }}
                                            transition={{
                                                pathLength: { duration: 1, delay: 1 },
                                                opacity: { duration: 0.5, delay: 1 },
                                                strokeDashoffset: { duration: 1, repeat: Infinity, ease: "linear" }
                                            }}
                                        />
                                        {/* Particle flow on bridge */}
                                        <motion.circle
                                            r="2"
                                            fill={i < 2 ? "#f43f5e" : "#10b981"}
                                            initial={{ opacity: 0 }}
                                            animate={{
                                                offsetDistance: ["0%", "100%"],
                                                opacity: [0, 1, 0]
                                            }}
                                            transition={{
                                                duration: 1.5,
                                                repeat: Infinity,
                                                delay: i * 0.3 + 1,
                                                ease: "linear"
                                            }}
                                            style={{
                                                offsetPath: `path("M 180 ${70 + i * 35} L 220 ${70 + i * 35}")`
                                            }}
                                        />
                                    </React.Fragment>
                                ))}
                            </svg>
                        </div>

                    </div>

                    {/* Footer - Final Verdict */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="bg-gradient-to-r from-violet-600 via-rose-500 to-orange-500 p-5 rounded-3xl flex items-center justify-between shadow-lg shadow-violet-200/50 relative overflow-hidden"
                    >


                        <div className="flex items-center gap-4 relative z-10">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 5, repeat: Infinity }}
                                className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 shadow-inner"
                            >
                                <Target size={24} />
                            </motion.div>
                            <div>
                                <div className="text-[10px] font-black text-stone-100 uppercase tracking-[0.2em] opacity-80 mb-0.5">Overall Alignment</div>
                                <motion.div
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="text-2xl font-black text-white leading-none"
                                >
                                    68.4%
                                </motion.div>
                            </div>
                        </div>
                        <div className="space-y-1.5 flex flex-col items-end relative z-10">
                            <div className="flex gap-1.5">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <motion.div
                                        key={i}
                                        animate={{
                                            scaleY: i <= 3 ? [0.6, 1.2, 0.6] : [0.3, 0.5, 0.3],
                                            opacity: i <= 3 ? [0.6, 1, 0.6] : 0.2
                                        }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                                        className="w-1.5 h-6 bg-white rounded-full origin-bottom"
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
            {type === 'roadmap' && (
                <div className="h-full w-full flex flex-col gap-6 lg:p-8 lg:bg-white relative overflow-hidden">
                    {/* Architectural Underlay - Sharper Grid */}
                    <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#000 1.5px, transparent 1.5px), linear-gradient(90deg, #000 1.5px, transparent 1.5px)', backgroundSize: '30px 30px' }} />

                    <div className="flex-1 relative z-10 flex flex-col items-center justify-center gap-8 py-4">
                        {/* THE SURGICAL PATHWAY */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-1 bg-stone-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: "100%" }}
                                transition={{ duration: 2, ease: "easeInOut" }}
                                className="w-full bg-gradient-to-b from-blue-500 via-violet-500 to-emerald-500"
                            />
                        </div>

                        {/* Roadmap Steps - Reimagined as "Surgical Plan" */}
                        <div className="w-full space-y-10 relative">
                            {[
                                {
                                    id: "step-1",
                                    label: "Identify Missing 10%",
                                    sub: "Surgical Gap Analysis",
                                    icon: <Search className="w-5 h-5" />,
                                    color: "blue",
                                    side: "right",
                                    delay: 0.5
                                },
                                {
                                    id: "step-2",
                                    label: "Build Proof Project",
                                    sub: "Bridge the Execution Gap",
                                    icon: <Zap className="w-5 h-5" />,
                                    color: "violet",
                                    side: "left",
                                    delay: 1.0
                                },
                                {
                                    id: "step-3",
                                    label: "Deploy Certification",
                                    sub: "Verified Authority",
                                    icon: <ShieldCheck className="w-5 h-5" />,
                                    color: "emerald",
                                    side: "right",
                                    delay: 1.5
                                }
                            ].map((step, idx) => (
                                <motion.div
                                    key={step.id}
                                    initial={{ opacity: 0, x: step.side === 'left' ? -30 : 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: step.delay, duration: 0.8 }}
                                    className={`relative flex items-center gap-6 ${step.side === 'left' ? 'flex-row-reverse text-right' : 'text-left'}`}
                                >
                                    {/* Connection Line to main path */}
                                    <div className="absolute left-1/2 -translate-x-1/2 w-4 h-[2px] bg-stone-200" />

                                    {/* The Node Card - Neo-Brutalist Style */}
                                    <div className={`w-[180px] p-4 bg-white border-2 border-stone-900 rounded-2xl shadow-[6px_6px_0px_rgba(0,0,0,0.1)] hover:shadow-[8px_8px_0px_rgba(0,0,0,0.15)] transition-all group`}>
                                        <div className={`w-10 h-10 rounded-xl bg-${step.color}-500 text-white flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                                            {step.icon}
                                        </div>
                                        <div className="space-y-0.5">
                                            <div className={`text-[9px] font-black text-${step.color}-600 uppercase tracking-widest leading-none`}>{step.sub}</div>
                                            <div className="text-xs font-black text-stone-900 tracking-tight leading-tight">{step.label}</div>
                                        </div>
                                    </div>

                                    {/* Central Indicator */}
                                    <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: step.delay + 0.3, type: "spring" }}
                                            className={`w-4 h-4 rounded-full border-2 border-white bg-${step.color}-500 shadow-lg z-20`}
                                        />
                                        <motion.div
                                            animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity, delay: step.delay }}
                                            className={`absolute w-4 h-4 rounded-full bg-${step.color}-400 -z-10`}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Footer - Surgical Construction Metrics */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2.2 }}
                        className="bg-stone-950 border-2 border-stone-900 p-5 rounded-3xl flex items-center justify-between shadow-xl"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-violet-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                                <Target size={24} className="animate-pulse" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-violet-400 uppercase tracking-[0.2em] mb-0.5">Construction Status</div>
                                <div className="text-sm font-black text-white tracking-tight">Surgical Roadmap Deployed</div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                            <div className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Bridging Complete</div>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: [8, 16, 8] }}
                                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.1 }}
                                        className="w-1.5 bg-emerald-500 rounded-full"
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
            {type === 'hired' && (
                <div className="h-full w-full flex flex-col items-center justify-center p-12 bg-white relative overflow-hidden">
                    {/* Atmospheric Success Glow */}
                    <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-emerald-50 to-transparent opacity-60" />

                    <div className="relative w-full max-w-md h-[400px] flex items-center justify-center">
                        {/* The Success Avatar Group */}
                        <div className="relative">
                            {/* Background Radial Glow */}
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute inset-[-100px] bg-emerald-400 rounded-full blur-[100px]"
                            />

                            {/* Person/Avatar - Stylized SVG Construction */}
                            <motion.div
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                                className="relative z-20"
                            >
                                <svg width="240" height="320" viewBox="0 0 240 320" fill="none">
                                    {/* Shoulders/Torso */}
                                    <path d="M40 280 C40 240 80 220 120 220 C160 220 200 240 200 280 L200 320 L40 320 Z" fill="#1c1917" />

                                    {/* Head */}
                                    <circle cx="120" cy="160" r="50" fill="#f5f5f4" stroke="#1c1917" strokeWidth="4" />

                                    {/* Hair/Cap - Professional Sleek */}
                                    <path d="M70 160 C70 120 100 100 120 100 C140 100 170 120 170 160 C170 140 160 120 120 120 C80 120 70 140 70 160 Z" fill="#1c1917" />

                                    {/* Eyes/Face (Simple Dots) */}
                                    <circle cx="105" cy="165" r="3" fill="#1c1917" />
                                    <circle cx="135" cy="165" r="3" fill="#1c1917" />
                                    <path d="M110 185 Q120 195 130 185" stroke="#1c1917" strokeWidth="3" strokeLinecap="round" />

                                    {/* Left Hand Holding Resume */}
                                    <motion.g
                                        animate={{ rotate: [-2, 2, -2] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <rect x="10" y="170" width="80" height="110" rx="4" fill="white" stroke="#e7e5e4" strokeWidth="2" />
                                        <rect x="25" y="185" width="50" height="2" rx="1" fill="#e7e5e4" />
                                        <rect x="25" y="195" width="50" height="2" rx="1" fill="#e7e5e4" />
                                        <rect x="25" y="205" width="30" height="2" rx="1" fill="#e7e5e4" />

                                        {/* Certification Seal on held resume */}
                                        <circle cx="65" cy="245" r="12" fill="#10b981" />
                                        <path d="M60 245 L63 248 L70 241" stroke="white" strokeWidth="2" strokeLinecap="round" />

                                        {/* Fingers holding it */}
                                        <rect x="75" y="210" width="20" height="15" rx="7.5" fill="#f5f5f4" stroke="#1c1917" strokeWidth="2" />
                                    </motion.g>

                                    {/* Right Arm Giving Thumbs Up */}
                                    <motion.g
                                        initial={{ x: 200, y: 240, scale: 0 }}
                                        animate={{ x: 180, y: 190, scale: 1 }}
                                        transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                                    >
                                        {/* Hand Circle */}
                                        <circle cx="0" cy="0" r="22" fill="#f5f5f4" stroke="#1c1917" strokeWidth="4" />
                                        {/* Thumb Up */}
                                        <path d="M-5 -25 C-5 -35 5 -40 10 -35 L12 -15 Z" fill="#f5f5f4" stroke="#1c1917" strokeWidth="4" />
                                    </motion.g>
                                </svg>
                            </motion.div>

                            {/* Floating "HIRED" Badge */}
                            <motion.div
                                initial={{ scale: 0, rotate: -20 }}
                                animate={{ scale: 1, rotate: 12 }}
                                transition={{ delay: 1.2, type: "spring" }}
                                className="absolute -top-10 -right-20 bg-emerald-500 text-white px-8 py-3 rounded-2xl font-black text-2xl shadow-[0_20px_40px_rgba(16,185,129,0.3)] border-4 border-white z-30"
                            >
                                HIRED!
                            </motion.div>
                        </div>
                    </div>

                    {/* Final CTA/Success text */}
                    <div className="flex flex-col items-center gap-4 relative z-10 -mt-10">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-stone-100 flex items-center justify-center">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                </div>
                            ))}
                        </div>
                        <div className="text-sm font-black text-stone-900 tracking-tight text-center">
                            The 10% Gap is Bridged. <br />
                            <span className="text-emerald-600 font-black">Alex Thompson is ready for hire.</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
})

export default RevealJourney
