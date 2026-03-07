'use client'

import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { supabaseClient } from './supabaseClient'
import { usePathname } from 'next/navigation'
import { useAuth } from './authContext'

interface TrackEventOptions {
    feature_module?: string
    funnel_stage?: string
    is_aha?: boolean
    is_premium_intent?: boolean
    is_referral?: boolean
    metadata?: any
}

interface AnalyticsContextType {
    trackEvent: (eventName: string, actionDetail?: string, options?: TrackEventOptions) => Promise<void>
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined)

const getUUID = () => {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.randomUUID) {
        return window.crypto.randomUUID();
    }
    // Fallback for non-secure contexts (HTTP)
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const { userId, userEmail } = useAuth()
    const [userName, setUserName] = useState<string | null>(null)

    const deviceIdRef = useRef<string>(
        typeof window !== 'undefined'
            ? (localStorage.getItem('gaplytiq_device_id') || getUUID())
            : ''
    )

    const sessionIdRef = useRef<string>(
        typeof window !== 'undefined'
            ? (sessionStorage.getItem('gaplytiq_session_id') || getUUID())
            : ''
    )

    // Tracking Session Start for TTV
    const sessionStartTimeRef = useRef<number>(
        typeof window !== 'undefined'
            ? parseInt(sessionStorage.getItem('gaplytiq_session_start') || Date.now().toString())
            : Date.now()
    )

    const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null)
    const currentPageStartTimeRef = useRef<number>(Date.now())
    const lastTrackedPathRef = useRef<string>('')

    // Feature-specific start times for TTV calculations
    const featureStartTimesRef = useRef<Record<string, number>>({})

    // Identification Logic: Primary key is the User ID if logged in, otherwise persistent Device ID
    const recordId = userId || deviceIdRef.current

    // Fetch user profile name once if logged in
    useEffect(() => {
        const fetchProfile = async () => {
            if (userId) {
                const { data } = await supabaseClient.from('profiles').select('full_name').eq('id', userId).single()
                if (data) setUserName(data.full_name)
            }
        }
        fetchProfile()
    }, [userId])

    // Save session data to persist across refreshes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (!localStorage.getItem('gaplytiq_device_id')) {
                localStorage.setItem('gaplytiq_device_id', deviceIdRef.current)
            }
            if (!sessionStorage.getItem('gaplytiq_session_id')) {
                sessionStorage.setItem('gaplytiq_session_id', sessionIdRef.current)
            }
            if (!sessionStorage.getItem('gaplytiq_session_start')) {
                sessionStorage.setItem('gaplytiq_session_start', sessionStartTimeRef.current.toString())
            }
        }
    }, [])

    const trackEvent = async (eventName: string, actionDetail?: string, options: TrackEventOptions = {}) => {
        try {
            const {
                feature_module,
                funnel_stage,
                is_aha,
                is_premium_intent,
                is_referral,
                metadata = {}
            } = options

            // 1. Fetch current lifetime state for this session
            const { data: currentData } = await supabaseClient
                .from('user_activity_analytics')
                .select('*')
                .eq('id', recordId)
                .maybeSingle()

            const newAction = {
                event: eventName,
                label: actionDetail,
                time: new Date().toISOString(),
                feature_module,
                funnel_stage,
                ...metadata
            }

            // 2. Merge Page History
            const page_history = currentData?.page_history || []
            if (!page_history.includes(pathname)) {
                page_history.push(pathname)
            }

            // 3. Merge Actions
            const actions = currentData?.actions || []
            if (eventName !== 'page_view') {
                actions.push(newAction)
            }

            // 4. Merge Page Timing
            const time_per_page = currentData?.time_per_page || {}
            if (eventName === 'page_view' && lastTrackedPathRef.current) {
                const secondsOnPrevPage = Math.floor((Date.now() - currentPageStartTimeRef.current) / 1000)
                if (secondsOnPrevPage > 0) {
                    time_per_page[lastTrackedPathRef.current] = (time_per_page[lastTrackedPathRef.current] || 0) + secondsOnPrevPage
                }
                currentPageStartTimeRef.current = Date.now()
            }

            // 5. Metric Calculations
            const isFirstSession = typeof window !== 'undefined'
                ? !localStorage.getItem('gaplytiq_returning_user')
                : false

            if (isFirstSession && typeof window !== 'undefined') {
                localStorage.setItem('gaplytiq_returning_user', 'true')
            }

            // TTV Calculation: If this is an AHA moment, calculate seconds since session start
            let ttv_seconds = currentData?.ttv_seconds || null
            if (is_aha && !ttv_seconds) {
                ttv_seconds = Math.floor((Date.now() - sessionStartTimeRef.current) / 1000)
            }

            // 6. Consolidated Upsert
            await supabaseClient
                .from('user_activity_analytics')
                .upsert({
                    id: recordId,
                    user_id: userId,
                    user_email: userEmail,
                    user_name: userName,
                    session_id: sessionIdRef.current,
                    is_first_session: isFirstSession,
                    page_history,
                    time_per_page,
                    actions,
                    total_time_spent_sec: currentData?.total_time_spent_sec || 0,
                    feature_module: feature_module || currentData?.feature_module,
                    max_funnel_stage: funnel_stage || currentData?.max_funnel_stage,
                    core_action_performed: is_aha || currentData?.core_action_performed,
                    ttv_seconds,
                    referral_count: (currentData?.referral_count || 0) + (is_referral ? 1 : 0),
                    premium_intent_count: (currentData?.premium_intent_count || 0) + (is_premium_intent ? 1 : 0),
                    browser_info: {
                        browser: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
                        platform: typeof navigator !== 'undefined' ? navigator.platform : 'unknown'
                    },
                    last_active_at: new Date().toISOString()
                })
        } catch (err) {
            console.error("Analytics Error:", err)
        }
    }

    const trackHeartbeat = async () => {
        try {
            const { data: currentData } = await supabaseClient
                .from('user_activity_analytics')
                .select('total_time_spent_sec, time_per_page')
                .eq('id', recordId)
                .maybeSingle()

            const secondsSinceLastTick = Math.floor((Date.now() - currentPageStartTimeRef.current) / 1000)
            if (secondsSinceLastTick < 1) return

            const tpp = currentData?.time_per_page || {}
            tpp[pathname] = (tpp[pathname] || 0) + secondsSinceLastTick

            const newTotalTime = (currentData?.total_time_spent_sec || 0) + secondsSinceLastTick
            currentPageStartTimeRef.current = Date.now()

            await supabaseClient
                .from('user_activity_analytics')
                .update({
                    total_time_spent_sec: newTotalTime,
                    time_per_page: tpp,
                    user_id: userId,
                    user_email: userEmail,
                    user_name: userName,
                    last_active_at: new Date().toISOString()
                })
                .eq('id', recordId)
        } catch (err) { }
    }

    // Handle Page Views
    useEffect(() => {
        if (pathname !== lastTrackedPathRef.current) {
            trackEvent('page_view')
            lastTrackedPathRef.current = pathname
        }
    }, [pathname])

    // Handle Heartbeat every 30s
    useEffect(() => {
        if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current)
        trackHeartbeat()
        heartbeatTimerRef.current = setInterval(trackHeartbeat, 30000)
        return () => {
            if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current)
        }
    }, [pathname, userId, userName])

    return (
        <AnalyticsContext.Provider value={{ trackEvent }}>
            {children}
        </AnalyticsContext.Provider>
    )
}

export function useAnalytics() {
    const context = useContext(AnalyticsContext)
    if (context === undefined) {
        throw new Error('useAnalytics must be used within AnalyticsProvider')
    }
    return context
}

