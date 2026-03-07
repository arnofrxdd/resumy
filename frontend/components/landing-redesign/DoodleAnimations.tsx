"use client"

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useIsMobile } from '@/hooks/useIsMobile'

export const CircleDoodle = React.memo(({ color = "currentColor", className = "" }: { color?: string, className?: string }) => {
    const isMobile = useIsMobile()
    return (
        <svg viewBox="0 0 200 100" fill="none" className={`${className} ${!isMobile ? 'will-change-transform' : ''}`} preserveAspectRatio="none">
            {/* Double circle for "sketch" effect */}
            <motion.ellipse
                cx="100" cy="50" rx="90" ry="40"
                stroke={color}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={isMobile ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                animate={isMobile ? { pathLength: 1, opacity: 1 } : undefined}
                whileInView={isMobile ? undefined : { pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            />
            <motion.ellipse
                cx="100" cy="50" rx="94" ry="44"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={isMobile ? { pathLength: 1, opacity: 0.5 } : { pathLength: 0, opacity: 0 }}
                animate={isMobile ? { pathLength: 1, opacity: 0.5 } : undefined}
                whileInView={isMobile ? undefined : { pathLength: 1, opacity: 0.5 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            />
        </svg>
    )
})

export const UnderlineDoodle = React.memo(({ color = "currentColor", className = "" }: { color?: string, className?: string }) => {
    const isMobile = useIsMobile()
    return (
        <svg viewBox="0 0 300 30" fill="none" className={`${className} ${!isMobile ? 'will-change-transform' : ''}`} preserveAspectRatio="none">
            <motion.path
                d="M5 15Q80 25 150 15T295 15"
                stroke={color}
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={isMobile ? { pathLength: 1, opacity: 0.8 } : { pathLength: 0, opacity: 0 }}
                animate={isMobile ? { pathLength: 1, opacity: 0.8 } : undefined}
                whileInView={isMobile ? undefined : { pathLength: 1, opacity: 0.8 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            />
        </svg>
    )
})

export const BridgeDoodle = React.memo(({ color = "currentColor", className = "" }: { color?: string, className?: string }) => {
    const isMobile = useIsMobile()
    return (
        <svg viewBox="0 0 100 40" fill="none" className={className}>
            <motion.path
                d="M5 35C5 35 25 5 50 5C75 5 95 35 95 35M15 35V30M35 15V10M65 15V10M85 35V30"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={isMobile ? { pathLength: 1 } : { pathLength: 0 }}
                whileInView={isMobile ? undefined : { pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
            />
            <motion.path
                d="M5 35H95"
                stroke={color}
                strokeWidth="2"
                strokeDasharray="4 4"
                initial={isMobile ? { opacity: 0.3 } : { opacity: 0 }}
                whileInView={isMobile ? undefined : { opacity: 0.3 }}
            />
        </svg>
    )
})

export const ComparisonDoodle = React.memo(({ color = "currentColor", className = "" }: { color?: string, className?: string }) => {
    const isMobile = useIsMobile()
    return (
        <svg viewBox="0 0 60 40" fill="none" className={className}>
            <motion.rect
                x="5" y="10" width="20" height="25" rx="2"
                stroke={color} strokeWidth="2"
                initial={isMobile ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                animate={isMobile ? { y: 0, opacity: 1 } : undefined}
                whileInView={isMobile ? undefined : { y: 0, opacity: 1 }}
            />
            <motion.rect
                x="35" y="5" width="20" height="30" rx="2"
                stroke={color} strokeWidth="2"
                initial={isMobile ? { y: 0, opacity: 1 } : { y: -20, opacity: 0 }}
                animate={isMobile ? { y: 0, opacity: 1 } : undefined}
                whileInView={isMobile ? undefined : { y: 0, opacity: 1 }}
            />
            <motion.path
                d="M28 20H32"
                stroke={color} strokeWidth="2" strokeLinecap="round"
                initial={isMobile ? { scaleX: 1 } : { scaleX: 0 }}
                animate={isMobile ? { scaleX: 1 } : undefined}
                whileInView={isMobile ? undefined : { scaleX: 1 }}
            />
        </svg>
    )
})

export const StatusDoodle = React.memo(({ color = "currentColor", className = "" }: { color?: string, className?: string }) => {
    const isMobile = useIsMobile()
    return (
        <svg viewBox="0 0 40 40" fill="none" className={className}>
            <motion.circle
                cx="20" cy="20" r="15"
                stroke={color} strokeWidth="2"
                strokeDasharray="4 4"
                animate={isMobile ? undefined : { rotate: 360 }}
                transition={isMobile ? undefined : { duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <motion.path
                d="M12 20L18 26L28 16"
                stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                initial={isMobile ? { pathLength: 1 } : { pathLength: 0 }}
                animate={isMobile ? { pathLength: 1 } : undefined}
                whileInView={isMobile ? undefined : { pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
            />
        </svg>
    )
})

export const ArrowDoodle = React.memo(({ color = "currentColor", className = "" }: { color?: string, className?: string }) => {
    const isMobile = useIsMobile()
    return (
        <svg viewBox="0 0 100 100" fill="none" className={className}>
            <motion.path
                d="M10 80C30 80 50 20 90 20M90 20L75 10M90 20L80 35"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={isMobile ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                animate={isMobile ? { pathLength: 1, opacity: 1 } : undefined}
                whileInView={isMobile ? undefined : { pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
            />
        </svg>
    )
})

export const SparkleDoodle = React.memo(({ color = "currentColor", className = "" }: { color?: string, className?: string }) => {
    const isMobile = useIsMobile()
    return (
        <svg viewBox="0 0 40 40" fill="none" className={className}>
            <motion.path
                d="M20 5L22 18L35 20L22 22L20 35L18 22L5 20L18 18L20 5Z"
                fill={color}
                initial={isMobile ? { scale: 1, rotate: 0, opacity: 0.2 } : { scale: 0, rotate: -45, opacity: 0 }}
                animate={isMobile ? { scale: 1, rotate: 0, opacity: 0.2 } : undefined}
                whileInView={isMobile ? undefined : { scale: 1, rotate: 0, opacity: 0.2 }}
                transition={{ duration: 0.6 }}
            />
            <motion.path
                d="M20 12V28M12 20H28"
                stroke={color} strokeWidth="2" strokeLinecap="round"
                initial={isMobile ? { scale: 1 } : { scale: 0 }}
                animate={isMobile ? { scale: 1 } : undefined}
                whileInView={isMobile ? undefined : { scale: 1 }}
                transition={{ delay: 0.3 }}
            />
        </svg>
    )
})

export const ScribbleDoodle = React.memo(({ color = "currentColor", className = "" }: { color?: string, className?: string }) => {
    const isMobile = useIsMobile()
    return (
        <svg viewBox="0 0 120 40" fill="none" className={className} preserveAspectRatio="none">
            <motion.path
                d="M10 30 Q20 10 30 30 T50 30 T70 30 T90 30 T110 30"
                stroke={color}
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={isMobile ? { pathLength: 1 } : { pathLength: 0 }}
                animate={isMobile ? { pathLength: 1 } : undefined}
                whileInView={isMobile ? undefined : { pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
            />
        </svg>
    )
})
export const HighlightDoodle = React.memo(({ color = "currentColor", className = "" }: { color?: string, className?: string }) => {
    const isMobile = useIsMobile()
    return (
        <svg viewBox="0 0 200 60" fill="none" className={className} preserveAspectRatio="none">
            <motion.path
                d="M10 30C50 10 150 10 190 30C150 50 50 50 10 30"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={isMobile ? { pathLength: 1, opacity: 0.4 } : { pathLength: 0, opacity: 0 }}
                animate={isMobile ? { pathLength: 1, opacity: 0.4 } : undefined}
                whileInView={isMobile ? undefined : { pathLength: 1, opacity: 0.4 }}
                transition={{ duration: 1, ease: "easeInOut" }}
            />
        </svg>
    )
})

export const ZigZagDoodle = React.memo(({ color = "currentColor", className = "" }: { color?: string, className?: string }) => {
    const isMobile = useIsMobile()
    return (
        <svg viewBox="0 0 100 20" fill="none" className={className} preserveAspectRatio="none">
            <motion.path
                d="M0 15L10 5L20 15L30 5L40 15L50 5L60 15L70 5L80 15L90 5L100 15"
                stroke={color} strokeWidth="2" strokeLinecap="round"
                initial={isMobile ? { pathLength: 1 } : { pathLength: 0 }}
                animate={isMobile ? { pathLength: 1 } : undefined}
                whileInView={isMobile ? undefined : { pathLength: 1 }}
                transition={{ duration: 1.2, ease: "easeInOut" }}
            />
        </svg>
    )
})

export const CurvyArrowDoodle = React.memo(({ color = "currentColor", className = "" }: { color?: string, className?: string }) => {
    const isMobile = useIsMobile()
    return (
        <svg viewBox="0 0 100 80" fill="none" className={className}>
            <motion.path
                d="M20 70 Q 50 10 80 20"
                stroke={color}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={isMobile ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                animate={isMobile ? { pathLength: 1, opacity: 1 } : undefined}
                whileInView={isMobile ? undefined : { pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
            />
            <motion.path
                d="M80 20 L 70 25 M 80 20 L 75 10"
                stroke={color}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={isMobile ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                animate={isMobile ? { pathLength: 1, opacity: 1 } : undefined}
                whileInView={isMobile ? undefined : { pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.7 }}
            />
        </svg>
    )
})

export const BoxDoodle = React.memo(({ color = "currentColor", className = "" }: { color?: string, className?: string }) => {
    const isMobile = useIsMobile()
    return (
        <svg viewBox="0 0 100 100" fill="none" className={className}>
            <motion.path
                d="M10 10H90V90H10V10Z"
                stroke={color} strokeWidth="2" strokeLinecap="round"
                initial={isMobile ? { pathLength: 1 } : { pathLength: 0 }}
                animate={isMobile ? { pathLength: 1 } : undefined}
                whileInView={isMobile ? undefined : { pathLength: 1 }}
                transition={{ duration: 2, ease: "linear" }}
            />
        </svg>
    )
})

export const CrossDoodle = React.memo(({ color = "currentColor", className = "" }: { color?: string, className?: string }) => {
    const isMobile = useIsMobile()
    return (
        <svg viewBox="0 0 40 40" fill="none" className={className}>
            <motion.path
                d="M10 10L30 30M30 10L10 30"
                stroke={color} strokeWidth="3" strokeLinecap="round"
                initial={isMobile ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                animate={isMobile ? { pathLength: 1, opacity: 1 } : undefined}
                whileInView={isMobile ? undefined : { pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            />
        </svg>
    )
})

export const HeartDoodle = React.memo(({ color = "currentColor", className = "" }: { color?: string, className?: string }) => {
    const isMobile = useIsMobile()
    return (
        <svg viewBox="0 0 40 40" fill="none" className={className}>
            <motion.path
                d="M20 35C20 35 35 25 35 15C35 5 25 5 20 10C15 5 5 5 5 15C5 25 20 35 20 35Z"
                stroke={color} strokeWidth="2" fill="none"
                initial={isMobile ? { pathLength: 1, opacity: 0.2 } : { pathLength: 0, opacity: 0 }}
                animate={isMobile ? { pathLength: 1, opacity: 0.2 } : undefined}
                whileInView={isMobile ? undefined : { pathLength: 1, opacity: 0.2 }}
                transition={{ duration: 1.5 }}
            />
        </svg>
    )
})


export const StarDoodle = React.memo(({ color = "currentColor", className = "" }: { color?: string, className?: string }) => {
    const isMobile = useIsMobile()
    return (
        <svg viewBox="0 0 40 40" fill="none" className={className}>
            <motion.path
                d="M20 2L24 14L38 14L26 22L30 36L20 28L10 36L14 22L2 14L16 14L20 2Z"
                stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                initial={isMobile ? { pathLength: 1, opacity: 1, scale: 1 } : { pathLength: 0, opacity: 0, scale: 0 }}
                animate={isMobile ? { pathLength: 1, opacity: 1, scale: 1 } : undefined}
                whileInView={isMobile ? undefined : { pathLength: 1, opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, type: "spring" }}
            />
        </svg>
    )
})

export const CrownDoodle = React.memo(({ color = "currentColor", className = "" }: { color?: string, className?: string }) => {
    const isMobile = useIsMobile()
    return (
        <svg viewBox="0 0 40 40" fill="none" className={className}>
            <motion.path
                d="M5 30L5 15L12 22L20 10L28 22L35 15L35 30H5Z"
                stroke={color} strokeWidth="2" strokeLinecap="round"
                initial={isMobile ? { pathLength: 1 } : { pathLength: 0 }}
                animate={isMobile ? { pathLength: 1 } : undefined}
                whileInView={isMobile ? undefined : { pathLength: 1 }}
                transition={{ duration: 1.2 }}
            />
            <motion.circle cx="5" cy="12" r="2" fill={color} initial={isMobile ? { scale: 1 } : { scale: 0 }} animate={isMobile ? { scale: 1 } : undefined} whileInView={isMobile ? undefined : { scale: 1 }} transition={{ delay: 0.5 }} />
            <motion.circle cx="20" cy="7" r="2" fill={color} initial={isMobile ? { scale: 1 } : { scale: 0 }} animate={isMobile ? { scale: 1 } : undefined} whileInView={isMobile ? undefined : { scale: 1 }} transition={{ delay: 0.7 }} />
            <motion.circle cx="35" cy="12" r="2" fill={color} initial={isMobile ? { scale: 1 } : { scale: 0 }} animate={isMobile ? { scale: 1 } : undefined} whileInView={isMobile ? undefined : { scale: 1 }} transition={{ delay: 0.9 }} />
        </svg>
    )
})

export const GaplyAvatar = React.memo(({ color = "#8B5CF6", className = "", pose = "neutral" }: { color?: string, className?: string, pose?: string }) => {
    const isMobile = useIsMobile()
    return (
        <motion.svg
            viewBox="0 0 100 100"
            fill="none"
            className={className}
            initial="hidden"
            whileInView="visible"
            animate={isMobile ? "neutral" : pose}
        >
            {/* The Body - A squishy bean */}
            <motion.path
                d="M30 40C30 20 70 20 70 40V70C70 90 30 90 30 70V40Z"
                fill={color}
                variants={{
                    neutral: { scaleY: 1, scaleX: 1 },
                    excited: { scaleY: [1, 1.1, 0.9, 1], scaleX: [1, 0.9, 1.1, 1] },
                    peeking: { y: [20, 0, 0, 20], rotate: [0, -10, 10, 0] }
                }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
            />

            {/* Simple Eyes */}
            <motion.circle
                cx="45" cy="45" r="3"
                fill="white"
                variants={{
                    neutral: { scaleY: 1 },
                    excited: { scale: 1.2 }
                }}
            />
            <motion.circle
                cx="65" cy="45" r="3"
                fill="white"
                variants={{
                    neutral: { scaleY: 1 },
                    excited: { scale: 1.2 }
                }}
            />

            {!isMobile && (
                <>
                    {/* Blinking Animation */}
                    <motion.rect
                        x="42" y="44" width="6" height="2"
                        fill={color}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
                    />
                    <motion.rect
                        x="62" y="44" width="6" height="2"
                        fill={color}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
                    />
                </>
            )}

            {/* Little Hands/Arms if excited and not mobile */}
            {pose === 'excited' && !isMobile && (
                <>
                    <motion.path
                        d="M30 60Q20 55 15 65"
                        stroke={color} strokeWidth="3" strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1, rotate: [0, 20, -20, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                    />
                    <motion.path
                        d="M70 60Q80 55 85 65"
                        stroke={color} strokeWidth="3" strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1, rotate: [0, -20, 20, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                    />
                </>
            )}
        </motion.svg>
    )
})

export const BurstDoodle = React.memo(({ color = "currentColor", size = 100, className = "" }: { color?: string, size?: number, className?: string }) => {
    return (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <motion.line
                    key={i}
                    x1="50" y1="50"
                    x2={50 + 35 * Math.cos((angle * Math.PI) / 180)}
                    y2={50 + 35 * Math.sin((angle * Math.PI) / 180)}
                    stroke={color}
                    strokeWidth="4"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.6 }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                />
            ))}
        </svg>
    )
})

