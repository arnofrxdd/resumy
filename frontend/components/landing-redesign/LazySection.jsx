"use client"

import React, { useRef } from 'react'
import { useInView } from 'framer-motion'
import { useIsMobile } from '@/hooks/useIsMobile'

export default function LazySection({ children, height = "100vh" }) {
    const ref = useRef(null)
    const isMobile = useIsMobile()

    // On mobile, we want to start loading earlier to avoid whitespace while scrolling
    // but on desktop we can be more precise
    const margin = isMobile ? "600px 0px" : "400px 0px"
    const isInView = useInView(ref, {
        once: true,
        margin: margin,
        amount: 0.1 // threshold
    })

    return (
        <div
            ref={ref}
            style={{
                minHeight: isInView ? 'auto' : height,
                containIntrinsicSize: `auto ${height}` // Browser optimization
            }}
            className="w-full relative z-10"
        >
            {isInView ? (
                <div style={{ animation: "fadeIn 0.5s ease-out forwards" }} className="w-full h-full">
                    {children}
                </div>
            ) : (
                // Low-performance placeholder for mobile
                <div style={{ height }} className="w-full bg-transparent pointer-events-none" />
            )}
        </div>
    )
}

