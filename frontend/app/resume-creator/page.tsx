'use client'

import { useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/authContext'
import App from './App'
import ResumeCreatorLoader from './components/ResumeCreatorLoader'
import PlacementDriveGuard from '@/components/PlacementDriveGuard'
import './App.css'
import './index.css'

export default function ResumeCreatorPage() {
    const { isAuthenticated, isLoading } = useAuth()
    const router = useRouter()

    if (isLoading) {
        return <ResumeCreatorLoader />
    }

    return (
        <Suspense fallback={<ResumeCreatorLoader />}>
            <PlacementDriveGuard />
            <App />
        </Suspense>
    )
}
