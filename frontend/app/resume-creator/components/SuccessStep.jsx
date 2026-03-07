import React, { useEffect, useState } from 'react';
import { ArrowLeft, Check, Download, FileText, ChevronRight, Sparkles, Wand2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './SuccessStep.css';
import ResumeRenderer from '../templates/ResumeRenderer';
import { UnderlineDoodle, SparkleDoodle, ScribbleDoodle, HighlightDoodle, StarDoodle, ZigZagDoodle } from "@/components/landing-redesign/DoodleAnimations";

import { useSearchParams } from 'next/navigation';

export default function SuccessStep({ data, templateId, onBack, onNext }) {
    const searchParams = useSearchParams();
    const jobId = searchParams.get('jobId');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                duration: 0.8
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] }
        }
    };

    return (
        <div className={`success-page-wrapper ${mounted ? 'visible' : ''}`}>
            {/* Background Ambience */}
            <div className="ambient-glow glow-1"></div>
            <div className="ambient-glow glow-2"></div>
            <div className="grid-overlay"></div>

            <motion.div
                className="success-container"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="success-content">
                    <motion.div variants={itemVariants} className="brand-pill bg-emerald-50 text-emerald-700 border border-emerald-100 px-4 py-2 rounded-xl w-fit mb-8 shadow-sm">
                        <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                        <span className="text-[10px] tracking-[0.2em] font-black uppercase">Document Finalized</span>
                    </motion.div>

                    <motion.h1 variants={itemVariants} className="hero-title">
                        <span className="block italic font-serif font-normal text-violet-600 mb-4 relative w-fit z-10 scale-110 origin-left">
                            {jobId ? "Excellent" : "You're"}
                            <span className="absolute -inset-x-4 top-1/2 -translate-y-1/2 h-[130%] -z-10 opacity-30 skew-x-[-12deg] scale-125">
                                <HighlightDoodle color={jobId ? "#10B981" : "#8B5CF6"} className="w-full h-full" />
                            </span>
                        </span>
                        <span className="relative inline-block">
                            {jobId ? "Profile Ready." : "All set."}
                            <ScribbleDoodle color={jobId ? "#10B981" : "#F97316"} className="absolute -bottom-6 right-0 w-[110%] h-4 opacity-80 rotate-[-1deg]" />
                        </span>
                    </motion.h1>

                    <motion.p variants={itemVariants} className="hero-subtitle">
                        {jobId ? (
                            <>
                                <span className="text-emerald-600 font-black">Fantastic work!</span> Your professional profile is looking sharp and is officially registered for the drive. <span className="text-stone-900 font-bold relative px-1">You're ready for the big leagues.<span className="absolute bottom-0 left-0 w-full h-[30%] bg-emerald-200/40 -z-10" /></span> Let's check your skill alignment to give you the winning edge.
                            </>
                        ) : (
                            <>
                                Your professional roadmap is ready. <span className="text-stone-900 font-bold relative px-1">One last review<span className="absolute bottom-0 left-0 w-full h-[30%] bg-violet-200/40 -z-10" /></span> and you're ready to launch.
                            </>
                        )}
                    </motion.p>

                    <motion.div variants={itemVariants} className="action-group-modern">
                        <button className={`sleek-pill-btn ${jobId ? 'btn-emerald' : 'btn-indigo'} group`} onClick={onNext}>
                            <div className="pill-icon shadow-lg bg-white/20">
                                {jobId ? <ArrowRight size={20} /> : <Download size={20} />}
                            </div>
                            <div className="pill-text text-left">
                                <h3 className="font-black tracking-tight text-white m-0">
                                    {jobId ? "Continue to Analysis" : "Finalize & Download"}
                                </h3>
                                <p className="font-bold text-white/70 m-0 text-[11px]">
                                    {jobId ? "Perform Neural Fit Assessment" : "Get your high-quality PDF"}
                                </p>
                            </div>
                            <div className="pill-arrow opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-white">
                                <ChevronRight size={18} />
                            </div>
                        </button>

                        <button className="btn-modern-ghost" onClick={onBack}>
                            <ArrowLeft size={16} />
                            <span>Return to Editor</span>
                        </button>
                    </motion.div>

                    {/* Decorative Sparkle */}
                    <div className="absolute -bottom-20 -left-10 opacity-20 rotate-12">
                        <ZigZagDoodle color="#F97316" className="w-32 h-8" />
                    </div>
                </div>

                <motion.div
                    variants={itemVariants}
                    className="preview-showcase-premium"
                >
                    <div className="showcase-card-floating">
                        <div className="showcase-inner-scale">
                            <ResumeRenderer data={data} templateId={templateId} scale={0.528} />
                        </div>
                        <div className="glass-reflection"></div>

                        {/* Corner Doodles */}
                        <div className="absolute -top-6 -right-6">
                            <SparkleDoodle color="#7C3AED" className="w-12 h-12" />
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
