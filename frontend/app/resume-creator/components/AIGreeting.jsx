import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Trophy, Lightbulb, ArrowRight, Star, Info, Sparkles, Target } from 'lucide-react';

const AIGreeting = ({ data, onContinue }) => {
    const [step, setStep] = useState(1);
    const {
        personal = {},
        skills = [],
        initial_analysis = { sections_found: [], strengths: [], improvements: [], score: 0 }
    } = data;

    // Use AI generated analysis if available, otherwise fallback to basic logic
    const isAiGenerated = initial_analysis.sections_found?.length > 0 || initial_analysis.improvements?.length > 0;

    React.useEffect(() => {
        console.log("🤖 [AIGreeting] Analysis Data Status:", isAiGenerated ? "AI GENERATED" : "HARDCODED FALLBACK");
        if (isAiGenerated) {
            console.log("📊 [AIGreeting] AI Analysis:", initial_analysis);
        }
    }, [isAiGenerated, initial_analysis]);

    const sectionsFound = isAiGenerated
        ? initial_analysis.sections_found.map(label => ({ label, icon: <CheckCircle size={18} className="text-emerald-500" /> }))
        : [
            { label: "You have all sections employers look for on a resume.", icon: <CheckCircle size={18} className="text-emerald-500" /> },
            { label: `Employers expect at least six skills. Great job listing ${skills.length}!`, icon: <CheckCircle size={18} className="text-emerald-500" /> }
        ];

    const improvements = isAiGenerated
        ? (initial_analysis.improvements || []).map(label => ({ label, icon: <Target size={16} className="text-rose-500" /> }))
        : [
            ...(!personal.email ? [{ label: "Include multiple ways for employers to get in touch with you. Add your Email.", icon: <Target size={16} className="text-rose-500" /> }] : []),
            ...(data.education?.length === 0 || !data.education?.[0]?.degree ? [{ label: "Add these education details: Degree", icon: <Target size={16} className="text-rose-500" /> }] : []),
            { label: "Most employers seek specific section titles. We'll help you create the ones they want.", icon: <Target size={16} className="text-rose-500" /> }
        ];

    // Add strengths to sections found if they exist
    if (initial_analysis.strengths?.length > 0) {
        initial_analysis.strengths.forEach(label => {
            if (!sectionsFound.find(s => s.label === label)) {
                sectionsFound.push({ label, icon: <Trophy size={18} className="text-amber-500" /> });
            }
        });
    }

    // Help normalize messy profession strings (all-caps or pipes)
    const formatProfession = (prof) => {
        if (!prof) return 'Expert';
        // If it's all caps or has pipes, let's clean it up
        let p = prof.trim();
        if (p.includes('|')) p = p.split('|')[0].trim();
        // Capitalize words nicely
        return p.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
        exit: { opacity: 0, scale: 0.95, transition: { duration: 0.4 } }
    };

    return (
        <div className="w-full max-w-5xl mx-auto px-6 py-12 relative">
            <AnimatePresence mode="wait">
                {step === 1 ? (
                    <motion.div
                        key="greeting"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center text-center lg:text-left"
                    >
                        <div className="flex-1 relative order-2 lg:order-1">
                            <div className="relative z-10 rounded overflow-hidden border border-slate-200 shadow-sm bg-slate-50 flex items-center justify-center p-8">
                                <Trophy size={80} className="text-slate-300" />
                            </div>
                        </div>

                        <div className="flex-[1.5] order-1 lg:order-2">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-bold uppercase tracking-widest mb-8 border border-indigo-100 shadow-sm mx-auto lg:mx-0">
                                <Sparkles className="w-3 h-3 flex-shrink-0" />
                                <span>Profile Analysis Complete</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-8">
                                <span className="block text-indigo-600 mb-2">
                                    Welcome,
                                </span>
                                <span>
                                    {personal.name?.split(' ')[0] || 'Professional'}
                                </span>
                            </h1>

                            <div className="text-lg text-slate-600 font-medium leading-[1.6] space-y-6 max-w-2xl mx-auto lg:mx-0">
                                <p>
                                    Your experience as a <span className="text-slate-900 font-bold">
                                        {formatProfession(personal.profession)}
                                    </span> provides a strong foundation.
                                </p>
                                <p>
                                    We've identified <span className="text-indigo-600 font-bold">{sectionsFound.length} key strengths</span> and a few areas for improvement to make your resume stand out to employers.
                                </p>
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                className="group mt-12 px-8 py-3 bg-indigo-600 text-white rounded font-bold text-sm hover:bg-indigo-700 transition-all flex items-center justify-center lg:justify-start gap-3 w-full lg:w-fit mx-auto lg:mx-0 shadow-sm"
                            >
                                View Results
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="analysis"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start"
                    >
                        <div className="flex-1 sticky top-12">
                            <div className="relative">
                                <div className="bg-white p-8 rounded border border-slate-200 shadow-sm text-center space-y-6">
                                    <div className="w-16 h-16 bg-slate-50 rounded mx-auto flex items-center justify-center p-4">
                                        <Trophy className="w-full h-full text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">Resume Score</h3>
                                        <p className="text-slate-500 text-xs mt-1 uppercase tracking-wider font-semibold">Baseline Assessment</p>
                                    </div>
                                    <div className="text-4xl font-black text-slate-900">
                                        {initial_analysis.score || (sectionsFound.length * 12 + 40)}
                                        <span className="text-lg text-slate-400 font-medium ml-1">/ 100</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex-[1.5] w-full">
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-slate-900 mb-3">
                                    Analysis Results
                                </h2>
                                <p className="text-slate-600">
                                    We've benchmarked your profile against industry standards. Review the feedback below.
                                </p>
                            </div>

                            <div className="space-y-6 mb-12">
                                {/* Success Cards */}
                                <div className="bg-white border border-slate-200 rounded p-6">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-4 flex items-center gap-2">
                                        <CheckCircle size={14} /> Established Strengths
                                    </h3>
                                    <div className="space-y-4">
                                        {sectionsFound.map((item, i) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                key={i}
                                                className="flex items-start gap-3"
                                            >
                                                <div className="mt-0.5">{item.icon}</div>
                                                <span className="text-sm text-slate-700 font-medium leading-relaxed">{item.label}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Improvement Cards */}
                                <div className="bg-white border border-slate-200 rounded p-6">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-rose-600 mb-4 flex items-center gap-2">
                                        <Target size={14} /> Action Items
                                    </h3>
                                    <div className="space-y-4">
                                        {improvements.map((item, i) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.3 + i * 0.1 }}
                                                key={i}
                                                className="flex items-start gap-3"
                                            >
                                                <div className="mt-0.5">{item.icon}</div>
                                                <span className="text-sm text-slate-700 font-medium leading-relaxed">{item.label}</span>
                                            </motion.div>
                                        ))}
                                        {improvements.length === 0 && (
                                            <div className="text-slate-500 text-sm">Profile meets all foundational requirements.</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={onContinue}
                                className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white rounded font-bold text-sm hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-sm"
                            >
                                Continue to Builder
                                <ArrowRight className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AIGreeting;
