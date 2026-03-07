"use client"

import { useEffect, useState, useRef, useCallback } from 'react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldAlert, Info, AlertTriangle, Lock } from 'lucide-react'
import { supabaseClient } from '@/lib/supabaseClient'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type ViolationType =
    | 'TAB_SWITCH'
    | 'FOCUS_LOSS'
    | 'FULLSCREEN_EXIT'
    | 'COPY_ATTEMPT'
    | 'PASTE_ATTEMPT'
    | 'CUT_ATTEMPT'
    | 'KEYBOARD_SHORTCUT'
    | 'CONTEXT_MENU'
    | 'SELECTION_ATTEMPT'
    | 'WINDOW_RESIZE'
    | 'SYSTEM_TERMINATED'

type ViolationSeverity = 'info' | 'warning' | 'critical'

interface LogViolationParams {
    violationType: ViolationType
    severity: ViolationSeverity
    strikeNumber?: number
    isTerminating?: boolean
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const MAX_VIOLATIONS = 5

export default function PlacementDriveGuard() {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()
    const jobId = searchParams.get('jobId')

    // Safe pages — proctoring disabled on these routes
    const isSafePage = pathname === '/skill-gap' || pathname?.startsWith('/resume-creator')

    // ---------------------------------------------------------------------------
    // State
    // ---------------------------------------------------------------------------
    const [warning, setWarning] = useState<string | null>(null)
    const [tabSwitchCount, setTabSwitchCount] = useState(0)
    const [isDisqualified, setIsDisqualified] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(true)
    const [isFinalize, setIsFinalize] = useState(false)

    // ---------------------------------------------------------------------------
    // Refs — avoid stale closures & prevent double-counting
    // ---------------------------------------------------------------------------
    const lastViolationRef = useRef<number>(0)
    const authUserIdRef = useRef<string | null>(null)
    const studentIdRef = useRef<string | null>(null)
    const wasInFullscreenRef = useRef<boolean>(false)   // track if user ever entered fullscreen
    const isDisqualifiedRef = useRef<boolean>(false)    // sync ref for use inside async callbacks
    const terminationLoggedRef = useRef<boolean>(false) // prevent duplicate termination rows

    // ---------------------------------------------------------------------------
    // 1. Fetch auth identity + student profile (needed for DB logging)
    // ---------------------------------------------------------------------------
    useEffect(() => {
        if (!jobId) return

        const fetchIdentity = async () => {
            try {
                const { data: { user } } = await supabaseClient.auth.getUser()
                if (!user) return
                authUserIdRef.current = user.id

                const { data: student } = await supabaseClient
                    .from('students')
                    .select('id')
                    .eq('auth_user_id', user.id)
                    .eq('job_id', jobId)
                    .single()

                if (student) {
                    studentIdRef.current = student.id
                }
            } catch (err) {
                console.warn('[PlacementDriveGuard] Could not fetch identity for logging:', err)
            }
        }

        fetchIdentity()
    }, [jobId])

    // ---------------------------------------------------------------------------
    // 2. Core violation logger — fire-and-forget INSERT to Supabase
    // ---------------------------------------------------------------------------
    const logViolation = useCallback(async ({
        violationType,
        severity,
    }: LogViolationParams) => {
        if (!jobId || !authUserIdRef.current) return

        try {
            // Using the "Smart JSON" RPC function to aggregate violations into a single row per student
            await supabaseClient.rpc('log_placement_violation', {
                p_job_id: jobId,
                p_violation_type: violationType,
                p_severity: severity,
                p_page_path: typeof window !== 'undefined' ? window.location.pathname : null
            })
        } catch (err) {
            // Never crash the UI due to a logging failure
            console.warn('[PlacementDriveGuard] Failed to log violation to DB via RPC:', err)
        }
    }, [jobId])

    // ---------------------------------------------------------------------------
    // 3. Load persisted state from localStorage (per jobId scope)
    // ---------------------------------------------------------------------------
    useEffect(() => {
        // [DISABLED] Clean up legacy unscoped key from older code versions
        // localStorage.removeItem('placement_strikes')

        if (!jobId) return

        // [DISABLED] Loading from localStorage
        /*
        const storedCount = localStorage.getItem(`placement_strikes_${jobId}`)
        const storedDisqualified = localStorage.getItem(`placement_disqualified_${jobId}`)

        if (storedCount) setTabSwitchCount(parseInt(storedCount))
        else setTabSwitchCount(0)

        if (storedDisqualified === 'true') {
            setIsDisqualified(true)
            isDisqualifiedRef.current = true
            document.documentElement.setAttribute('data-placement-violation', 'true')
        } else {
            setIsDisqualified(false)
            isDisqualifiedRef.current = false
            document.documentElement.removeAttribute('data-placement-violation')
        }
        */

        // Initializing with zero state when localStorage is disabled
        setTabSwitchCount(0)
        setIsDisqualified(false)
        isDisqualifiedRef.current = false
        document.documentElement.removeAttribute('data-placement-violation')

    }, [jobId])

    // ---------------------------------------------------------------------------
    // 4. Sync state changes to localStorage + DOM attribute
    // ---------------------------------------------------------------------------
    useEffect(() => {
        if (!jobId) return

        // [DISABLED] Saving to localStorage
        /*
        localStorage.setItem(`placement_strikes_${jobId}`, tabSwitchCount.toString())
        if (isDisqualified) {
            localStorage.setItem(`placement_disqualified_${jobId}`, 'true')
            isDisqualifiedRef.current = true
        }
        */

        // Only manage global attributes when localStorage is disabled
        if (isDisqualified) {
            document.documentElement.setAttribute('data-placement-violation', 'true')
            isDisqualifiedRef.current = true
        } else {
            document.documentElement.removeAttribute('data-placement-violation')
            isDisqualifiedRef.current = false
        }
    }, [tabSwitchCount, isDisqualified, jobId])

    // ---------------------------------------------------------------------------
    // 5. Main proctoring event listeners
    // ---------------------------------------------------------------------------
    useEffect(() => {
        if (!jobId || isSafePage) return

        // --- 5a. Warn before page reload/close ---
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDisqualifiedRef.current) return
            e.preventDefault()
            e.returnValue = ''
            return 'Warning: Leaving this page may invalidate your Placement Drive progress. Are you sure?'
        }

        // --- 5b. Tab switch / Focus loss (count toward strike limit) ---
        const handleStrikeViolation = (type: ViolationType, label: string) => {
            const now = Date.now()
            // Debounce: visibilitychange + blur can fire in the same interaction
            if (now - lastViolationRef.current < 1000) return
            lastViolationRef.current = now

            setTabSwitchCount(prev => {
                const newCount = prev + 1
                const isTerminating = newCount >= MAX_VIOLATIONS

                // 🗄️ Log to DB
                logViolation({
                    violationType: type,
                    severity: isTerminating ? 'critical' : 'warning',
                    strikeNumber: newCount,
                    isTerminating,
                })

                if (isTerminating) {
                    setIsDisqualified(true)
                    setWarning('CRITICAL SECURITY BREACH: Assessment terminated due to multiple violations. Your activity has been logged.')
                    document.documentElement.setAttribute('data-placement-violation', 'true')
                } else {
                    setWarning(`${label}: Full focus required. Strike ${newCount}/${MAX_VIOLATIONS}.`)
                }

                return newCount
            })

            setTimeout(() => setWarning(null), 5000)
        }

        const handleVisibilityChange = () => {
            if (document.hidden && !isSafePage) handleStrikeViolation('TAB_SWITCH', 'TAB SWITCH DETECTED')
        }

        const handleBlur = () => {
            if (!isSafePage) handleStrikeViolation('FOCUS_LOSS', 'WINDOW FOCUS LOST')
        }

        // --- 5c. Blocked actions (info-level; logged but no strike) ---
        const showBlockedWarning = (msg: string) => {
            setWarning(`SECURITY ALERT: ${msg}`)
            setTimeout(() => setWarning(null), 3000)
        }

        const handleContextMenu = (e: Event) => {
            if (isSafePage) return
            e.preventDefault()
            logViolation({ violationType: 'CONTEXT_MENU', severity: 'info' })
            showBlockedWarning('Right-click is disabled during the assessment.')
            return false
        }

        const handleSelectStart = (e: Event) => {
            if (isSafePage) return
            e.preventDefault()
            logViolation({ violationType: 'SELECTION_ATTEMPT', severity: 'info' })
            // No warning toast for this one — too noisy
            return false
        }

        const handleCopy = (e: Event) => {
            if (isSafePage) return
            e.preventDefault()
            logViolation({ violationType: 'COPY_ATTEMPT', severity: 'info' })
            showBlockedWarning('Copying content is not allowed during the assessment.')
            return false
        }

        const handleCut = (e: Event) => {
            if (isSafePage) return
            e.preventDefault()
            logViolation({ violationType: 'CUT_ATTEMPT', severity: 'info' })
            showBlockedWarning('Cutting content is not allowed during the assessment.')
            return false
        }

        const handlePaste = (e: Event) => {
            if (isSafePage) return
            e.preventDefault()
            logViolation({ violationType: 'PASTE_ATTEMPT', severity: 'info' })
            showBlockedWarning('Pasting content is not allowed during the assessment.')
            return false
        }

        // --- 5d. Keyboard shortcut blocking ---
        const handleKeydown = (e: KeyboardEvent) => {
            if (isSafePage) return

            // DevTools / Source / Print / Save
            const isForbiddenFunctionKey = e.key.startsWith('F') && e.key.length <= 3
            const isDevTools = e.ctrlKey && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)
            const isBrowserAction = e.ctrlKey && ['U', 'u', 'P', 'p', 'S', 's'].includes(e.key)

            // Copy / Paste / Cut shortcuts are handled by clipboard events above,
            // but block them here too so the keydown is also cancelled
            const isCopyPaste = e.ctrlKey && ['C', 'c', 'V', 'v', 'X', 'x'].includes(e.key)

            // Alt key combos (Alt+Tab, Alt+F4 etc.)
            const isAltCombo = e.altKey

            if (isForbiddenFunctionKey || isDevTools || isBrowserAction || isCopyPaste || isAltCombo) {
                e.preventDefault()

                // Only log keyboard shortcuts that aren't already covered by clipboard events
                if (!isCopyPaste) {
                    logViolation({ violationType: 'KEYBOARD_SHORTCUT', severity: 'info' })
                    showBlockedWarning('This keyboard shortcut is disabled during proctoring.')
                }

                return false
            }
        }

        const handleResize = () => {
            if (isSafePage || isDisqualifiedRef.current) return
            // Log as info to avoid being too aggressive with strikes for layout shifts
            logViolation({ violationType: 'WINDOW_RESIZE', severity: 'info' })
        }

        // Attach all listeners
        window.addEventListener('beforeunload', handleBeforeUnload)
        document.addEventListener('visibilitychange', handleVisibilityChange)
        window.addEventListener('blur', handleBlur)
        document.addEventListener('contextmenu', handleContextMenu)
        document.addEventListener('selectstart', handleSelectStart)
        document.addEventListener('copy', handleCopy)
        document.addEventListener('cut', handleCut)
        document.addEventListener('paste', handlePaste)
        window.addEventListener('resize', handleResize)
        window.addEventListener('keydown', handleKeydown)

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
            document.removeEventListener('visibilitychange', handleVisibilityChange)
            window.removeEventListener('blur', handleBlur)
            document.removeEventListener('contextmenu', handleContextMenu)
            document.removeEventListener('selectstart', handleSelectStart)
            document.removeEventListener('copy', handleCopy)
            document.removeEventListener('cut', handleCut)
            document.removeEventListener('paste', handlePaste)
            window.removeEventListener('resize', handleResize)
            window.removeEventListener('keydown', handleKeydown)
        }
    }, [jobId, isSafePage, logViolation])

    // ---------------------------------------------------------------------------
    // 6. Finalize observer (hide banner after quiz/interview completes)
    // ---------------------------------------------------------------------------
    useEffect(() => {
        const checkFinalize = () => {
            setIsFinalize(document.documentElement.getAttribute('data-placement-finalize') === 'true')
        }
        checkFinalize()
        const observer = new MutationObserver(checkFinalize)
        observer.observe(document.documentElement, { attributes: true })
        return () => observer.disconnect()
    }, [])

    // ---------------------------------------------------------------------------
    // 7. Push body content down when banner is active
    // ---------------------------------------------------------------------------
    useEffect(() => {
        if (jobId && !isFinalize) {
            document.documentElement.setAttribute('data-placement-active', 'true')
        } else {
            document.documentElement.removeAttribute('data-placement-active')
        }
        return () => document.documentElement.removeAttribute('data-placement-active')
    }, [jobId, isFinalize])

    // ---------------------------------------------------------------------------
    // 8. Fullscreen enforcement + logging on exit
    // ---------------------------------------------------------------------------
    useEffect(() => {
        if (!jobId || isSafePage || isDisqualified) return

        const checkFullscreen = () => {
            const fs = !!(
                document.fullscreenElement ||
                (document as any).webkitFullscreenElement ||
                (document as any).mozFullScreenElement ||
                (document as any).msFullscreenElement
            )
            setIsFullscreen(fs)
        }

        checkFullscreen()
        const t1 = setTimeout(checkFullscreen, 100)
        const t2 = setTimeout(checkFullscreen, 500)

        document.addEventListener('fullscreenchange', checkFullscreen)
        document.addEventListener('webkitfullscreenchange', checkFullscreen)
        document.addEventListener('mozfullscreenchange', checkFullscreen)
        document.addEventListener('MSFullscreenChange', checkFullscreen)

        return () => {
            document.removeEventListener('fullscreenchange', checkFullscreen)
            document.removeEventListener('webkitfullscreenchange', checkFullscreen)
            document.removeEventListener('mozfullscreenchange', checkFullscreen)
            document.removeEventListener('MSFullscreenChange', checkFullscreen)
            clearTimeout(t1)
            clearTimeout(t2)
        }
    }, [jobId, isSafePage, isDisqualified])

    // Log fullscreen EXIT event (only after the student has actually been in fullscreen)
    useEffect(() => {
        if (isFullscreen) {
            wasInFullscreenRef.current = true
            return
        }
        // Only log exit — not the initial "wasn't fullscreen yet" state
        if (wasInFullscreenRef.current && jobId && !isSafePage && !isDisqualified) {
            logViolation({ violationType: 'FULLSCREEN_EXIT', severity: 'info' })
        }
    }, [isFullscreen, jobId, isSafePage, isDisqualified, logViolation])

    // ---------------------------------------------------------------------------
    // 9. Log SYSTEM_TERMINATED when disqualification is triggered
    //    (separate from the last strike row — this is the explicit "game over" log)
    // ---------------------------------------------------------------------------
    useEffect(() => {
        if (isDisqualified && !terminationLoggedRef.current) {
            terminationLoggedRef.current = true
            logViolation({
                violationType: 'SYSTEM_TERMINATED',
                severity: 'critical',
                isTerminating: true,
            })
        }
    }, [isDisqualified, logViolation])

    // ---------------------------------------------------------------------------
    // 10. Fullscreen request helper
    // ---------------------------------------------------------------------------
    const enterFullscreen = () => {
        const docElm = document.documentElement
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen()
        } else if ((docElm as any).webkitRequestFullscreen) {
            (docElm as any).webkitRequestFullscreen()
        } else if ((docElm as any).mozRequestFullScreen) {
            (docElm as any).mozRequestFullScreen()
        } else if ((docElm as any).msRequestFullscreen) {
            (docElm as any).msRequestFullscreen()
        }
    }

    // ---------------------------------------------------------------------------
    // Render — nothing to show if not in a placement drive or drive is finalized
    // ---------------------------------------------------------------------------
    if (!jobId || isFinalize) return null

    return (
        <>
            <style jsx global>{`
                html[data-placement-active="true"] body {
                    padding-top: 40px !important;
                    user-select: ${isSafePage ? 'auto' : 'none'} !important;
                    -webkit-user-select: ${isSafePage ? 'auto' : 'none'} !important;
                    -moz-user-select: ${isSafePage ? 'auto' : 'none'} !important;
                    -ms-user-select: ${isSafePage ? 'auto' : 'none'} !important;
                }
                /* Shift all top-level fixed elements down */
                html[data-placement-active="true"] .fixed:not([data-placement-banner="true"]),
                html[data-placement-active="true"] .sticky {
                    transform: translateY(40px) !important;
                }
                /* Reset transform for nested sticky elements inside already-shifted fixed containers */
                html[data-placement-active="true"] .fixed:not([data-placement-banner="true"]) .sticky {
                    transform: translateY(0) !important;
                    top: 0 !important;
                }
                /* Ensure the banner itself is never transformed and stays interactive */
                [data-placement-banner="true"] {
                    transform: none !important;
                    user-select: auto !important;
                    pointer-events: auto !important;
                }
            `}</style>

            {/* ── Global Placement Drive Header ── */}
            <div
                className="fixed top-0 left-0 right-0 z-[10000] h-[40px]"
                data-placement-banner="true"
            >
                <div className="w-full h-full flex items-center">
                    <motion.div
                        initial={{ y: -40 }}
                        animate={{ y: 0 }}
                        className="bg-emerald-600 text-white h-full w-full px-4 shadow-xl flex items-center justify-center gap-3 border-b border-white/10 backdrop-blur-md"
                    >
                        <div className="flex items-center gap-2 px-3 py-0.5 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/30">
                            <Lock className="w-3 h-3" />
                            Verified Mode
                        </div>
                        <div className="hidden lg:flex items-center gap-4">
                            <div className="h-4 w-px bg-white/20" />
                            <div className="flex items-center gap-1.5 opacity-80">
                                <ShieldAlert className="w-3 h-3" />
                                <span className="text-[9px] font-bold uppercase tracking-wider text-white">Identity Confirmed</span>
                            </div>
                            <div className="flex items-center gap-1.5 opacity-80">
                                <Info className="w-3 h-3" />
                                <span className="text-[9px] font-bold uppercase tracking-wider text-white">Secure Connection</span>
                            </div>
                        </div>
                        <div className="h-4 w-px bg-white/20 hidden lg:block" />
                        <span className="text-xs font-black uppercase tracking-[0.1em] hidden md:inline text-white">
                            Placement Drive Assessment Protocol
                        </span>
                        <div className="h-4 w-px bg-white/20 hidden md:block" />
                        <span className="text-[10px] font-bold text-white/90">
                            Monitoring active. DO NOT leave this tab.
                        </span>
                    </motion.div>
                </div>
            </div>

            {/* ── Disqualification Overlay ── */}
            <AnimatePresence>
                {isDisqualified && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-[12000] bg-stone-950 flex items-center justify-center p-6 text-center"
                    >
                        <div className="max-w-md w-full space-y-8">
                            <div className="w-24 h-24 bg-rose-600/20 rounded-full flex items-center justify-center mx-auto border-4 border-rose-600 shadow-[0_0_50px_rgba(225,29,72,0.3)]">
                                <ShieldAlert className="w-12 h-12 text-rose-600" />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-3xl font-black text-white tracking-tight uppercase">Access Terminated</h2>
                                <p className="text-stone-400 font-medium leading-relaxed">
                                    Multiple security violations detected. This assessment has been permanently terminated and your activity has been logged for the recruiting team.
                                </p>
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600/10 border border-rose-600/30 rounded-xl">
                                    <div className="w-2 h-2 rounded-full bg-rose-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-rose-400">
                                        {tabSwitchCount} violation{tabSwitchCount !== 1 ? 's' : ''} recorded
                                    </span>
                                </div>
                            </div>
                            <div className="pt-8">
                                <button
                                    onClick={() => router.push('/')}
                                    className="px-10 py-4 bg-stone-800 hover:bg-stone-700 text-white font-black rounded-2xl transition-all"
                                >
                                    Return Home
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Fullscreen Enforcement Overlay ── */}
            <AnimatePresence>
                {(!isFullscreen && !isSafePage && !isDisqualified) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[11000] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-6"
                    >
                        <div className="max-w-md w-full bg-white rounded-[3rem] p-10 shadow-2xl text-center border-t-8 border-emerald-500">
                            <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
                                <Lock className="w-10 h-10 text-emerald-600" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight uppercase">Enter Secure Mode</h2>
                            <p className="text-slate-500 font-bold mb-10 leading-relaxed italic">
                                To ensure assessment integrity, this Placement Drive requires Fullscreen Mode.
                                Exiting fullscreen is logged as a security event.
                            </p>
                            <button
                                onClick={enterFullscreen}
                                className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-2xl shadow-xl shadow-emerald-200 transition-all transform hover:-translate-y-1 uppercase tracking-widest text-sm"
                            >
                                Activate Secure Session
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Violation Warning Toast ── */}
            <AnimatePresence>
                {warning && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[10000] w-full max-w-md px-6 pointer-events-none"
                    >
                        <div className="bg-rose-600 text-white p-6 rounded-[2rem] shadow-2xl border-4 border-rose-500 flex flex-col items-center text-center gap-4 pointer-events-auto">
                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                                <AlertTriangle className="w-8 h-8 animate-pulse" />
                            </div>
                            <div>
                                <h4 className="text-lg font-black uppercase tracking-tight mb-1">Proctoring Alert</h4>
                                <p className="text-sm font-bold opacity-90 leading-tight">
                                    {warning}
                                </p>
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest opacity-60">
                                Violations Logged: {tabSwitchCount} / {MAX_VIOLATIONS}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
