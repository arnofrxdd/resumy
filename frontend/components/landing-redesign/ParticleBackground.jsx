"use client"

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const ParticleBackground = () => {
    // Generate static random positions on mount only to prevent hydration mismatch
    const [particles, setParticles] = useState([])

    useEffect(() => {
        // Render fewer particles on mobile
        const count = window.innerWidth > 768 ? 20 : 8
        const p = Array.from({ length: count }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 4 + 1,
            duration: Math.random() * 20 + 10,
            delay: Math.random() * 5
        }))
        setParticles(p)
    }, [])

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full bg-stripe-blurple/10"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                        willChange: "transform, opacity"
                    }}
                    animate={{
                        y: [0, -100, 0],
                        opacity: [0, 0.5, 0],
                        scale: [1, 1.5, 1]
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: p.delay
                    }}
                />
            ))}
        </div>
    )
}

export default ParticleBackground
