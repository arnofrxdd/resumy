"use client"

import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { useIsMobile } from '@/hooks/useIsMobile'

// Social Proof Section - Trusted by thousands
const reviews = [
    {
        title: "wooow wellahi its cool",
        text: "wooow wellahi its cool",
        author: "Ibrahim Muliye",
        time: "8 hours ago"
    },
    {
        title: "Awesome and good on...",
        text: "Awesome and good one to use",
        author: "Abdul Rahman...",
        time: "20 hours ago"
    },
    {
        title: "Great interface",
        text: "Great interface, easy handling",
        author: "FF",
        time: "1 day ago"
    },
    {
        title: "Very good tool",
        text: "Very good tool. I have used it several times.",
        author: "Itziar Murillo Cruz",
        time: "1 day ago"
    },
    {
        title: "The experience was gr...",
        text: "The experience was great and very easy to create a...",
        author: "Posie",
        time: "2 days ago"
    }
]

const TrustpilotStar = () => (
    <div className="bg-[#00b67a] p-0.5 rounded-[1px] flex items-center justify-center">
        <Star className="w-3 h-3 text-white fill-current" />
    </div>
)

const SocialProof = () => {
    const scrollRef = useRef(null);
    const isMobile = useIsMobile()

    return (
        <section className="py-16 bg-white border-y border-stone-100 font-sans overflow-hidden">
            <div className="container max-w-7xl mx-auto px-6">

                <div className="relative group/carousel">
                    {/* Navigation Arrows */}
                    <div className="absolute top-1/2 -left-4 -translate-y-1/2 z-10 hidden xl:block">
                        <button
                            onClick={() => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
                            className="w-10 h-10 rounded-full border border-stone-200 bg-white flex items-center justify-center hover:bg-stone-50 transition-colors shadow-sm text-stone-300"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="absolute top-1/2 -right-4 -translate-y-1/2 z-10 hidden xl:block">
                        <button
                            onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
                            className="w-10 h-10 rounded-full border-2 border-stone-800 bg-white flex items-center justify-center hover:bg-stone-50 transition-shadow shadow-lg text-stone-900"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>

                    <div
                        ref={scrollRef}
                        className="flex gap-4 overflow-x-auto pb-8 no-scrollbar scroll-smooth snap-x"
                    >
                        {reviews.map((review, i) => (
                            <motion.div
                                key={i}
                                initial={isMobile ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                                animate={isMobile ? { opacity: 1, y: 0 } : undefined}
                                whileInView={isMobile ? undefined : { opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="min-w-[280px] md:min-w-[320px] bg-[#f8f8f8] p-8 rounded-sm flex flex-col gap-4 text-left snap-start"
                            >
                                <div className="flex items-center gap-1">
                                    <div className="flex gap-0.5 mr-2">
                                        {[...Array(5)].map((_, j) => <TrustpilotStar key={j} />)}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-3.5 h-3.5 rounded-full bg-stone-500 flex items-center justify-center">
                                            <Check className="w-2 h-2 text-white stroke-[3]" />
                                        </div>
                                        <span className="text-[10px] font-medium text-stone-500 underline underline-offset-2">Invited</span>
                                    </div>
                                </div>

                                <h4 className="font-extrabold text-stone-900 text-[15px] leading-tight">
                                    {review.title}
                                </h4>

                                <p className="text-[13px] text-stone-600 leading-relaxed line-clamp-3">
                                    {review.text}
                                </p>

                                <div className="mt-auto pt-4 text-[12px] text-stone-500 font-medium">
                                    <span className="font-extrabold text-stone-800">{review.author}</span>, {review.time}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Summary / Branding Footer */}
                <div className="mt-4 flex flex-col items-center gap-2">
                    <p className="text-[13px] text-stone-600 font-medium tracking-tight">
                        Rated <span className="font-black text-stone-900">4.2</span> / 5 based on <span className="underline cursor-pointer font-bold decoration-stone-300">11,724 reviews</span>. Showing our 4 & 5 star reviews.
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                        <div className="relative">
                            <Star className="w-5 h-5 text-[#00b67a] fill-[#00b67a]" />
                        </div>
                        <span className="text-xl font-black tracking-tighter text-stone-900">Trustpilot</span>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    )
}

export default SocialProof
