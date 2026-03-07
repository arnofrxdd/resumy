/**
 * Auth and Pricing Context
 * Provides user authentication and subscription plan information
 */

'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabaseClient } from '@/lib/supabaseClient'
import { PlanType } from '@/lib/featureLimits'

export interface AuthContextType {
    userId: string | null
    userEmail: string | null
    userPlan: PlanType
    isLoading: boolean
    isAuthenticated: boolean
    refreshPlan: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Provider component
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [userId, setUserId] = useState<string | null>(null)
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const [userPlan, setUserPlan] = useState<PlanType>('free')
    const [isLoading, setIsLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    // Fetch user subscription plan from backend
    const fetchUserPlan = async (uid: string, token: string) => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

            if (!apiUrl) {
                throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined");
            }

            const response = await fetch(`${apiUrl}/api/user/subscription-status`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })

            if (response.ok) {
                const data = await response.json()
                const plan = (data.plan || 'free').toLowerCase() as PlanType
                setUserPlan(plan)
                return plan
            } else if (response.status !== 401) {
                // Only log non-401 errors (401 is expected when token is invalid/expired)
                console.error(`Failed to fetch user plan: ${response.status}`)
            }
            // Default to free if can't fetch plan
            setUserPlan('free')
            return 'free'
        } catch (error) {
            // Network errors - silently continue
            setUserPlan('free')
            return 'free'
        }
    }

    // Check auth status on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data: { session } } = await supabaseClient.auth.getSession()

                if (session?.user) {
                    setUserId(session.user.id)
                    setUserEmail(session.user.email || null)
                    setIsAuthenticated(true)

                    // Fetch user's plan
                    await fetchUserPlan(session.user.id, session.access_token)
                } else {
                    setUserId(null)
                    setUserEmail(null)
                    setUserPlan('free')
                    setIsAuthenticated(false)
                }
            } catch (error) {
                console.error('Error checking auth:', error)
                setUserPlan('free')
            } finally {
                setIsLoading(false)
            }
        }

        checkAuth()

        // Listen for auth changes
        const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
            async (event, session) => {
                if (session?.user) {
                    setUserId(session.user.id)
                    setUserEmail(session.user.email || null)
                    setIsAuthenticated(true)
                    await fetchUserPlan(session.user.id, session.access_token)
                } else {
                    setUserId(null)
                    setUserEmail(null)
                    setUserPlan('free')
                    setIsAuthenticated(false)
                }
            }
        )

        return () => {
            subscription?.unsubscribe()
        }
    }, [])

    const refreshPlan = async () => {
        if (userId) {
            try {
                const { data: { session } } = await supabaseClient.auth.getSession()
                if (session?.access_token) {
                    await fetchUserPlan(userId, session.access_token)
                }
            } catch (error) {
                console.error('Error refreshing plan:', error)
            }
        }
    }

    return (
        <AuthContext.Provider
            value={{
                userId,
                userEmail,
                userPlan,
                isLoading,
                isAuthenticated,
                refreshPlan,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

/**
 * Hook to use auth context
 */
export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}
