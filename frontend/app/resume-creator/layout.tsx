import type { Viewport } from 'next'

// Disable browser pinch-to-zoom for this route so we can
// implement our own pinch-to-zoom on the resume canvas
export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    minimumScale: 1,
    userScalable: false,
}

export default function ResumeCreatorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
