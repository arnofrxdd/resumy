'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabaseClient } from '@/lib/supabaseClient'

interface PlacementStudent {
    id: string
    name: string
    email: string
    section: string
    job_id: string
    account_activated: boolean
}

interface UsePlacementStudentReturn {
    student: PlacementStudent | null
    studentName: string
    isLoading: boolean
    isPlacementDrive: boolean
    jobId: string | null
}

/**
 * usePlacementStudent
 * 
 * Fetches the current logged-in student's profile from the `students` table
 * using their auth_user_id and the jobId from the URL.
 * 
 * Returns the student's name to use for personalised greetings
 * across all placement drive pages.
 */
export function usePlacementStudent(): UsePlacementStudentReturn {
    const searchParams = useSearchParams()
    const jobId = searchParams.get('jobId')

    const [student, setStudent] = useState<PlacementStudent | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!jobId) return

        const fetchStudent = async () => {
            setIsLoading(true)
            try {
                const { data: { user } } = await supabaseClient.auth.getUser()
                if (!user) return

                const { data, error } = await supabaseClient
                    .from('students')
                    .select('id, name, email, section, job_id, account_activated')
                    .eq('auth_user_id', user.id)
                    .eq('job_id', jobId)
                    .single()

                if (!error && data) {
                    setStudent(data)
                }
            } catch (err) {
                // Silently fail — page will gracefully fall back to auth metadata name
                console.warn('[usePlacementStudent] Could not fetch student profile:', err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchStudent()
    }, [jobId])

    // Derive a clean first name for greetings
    const studentName = student?.name
        ? student.name.split(' ')[0] // Use first name only
        : ''

    return {
        student,
        studentName,
        isLoading,
        isPlacementDrive: !!jobId,
        jobId,
    }
}
