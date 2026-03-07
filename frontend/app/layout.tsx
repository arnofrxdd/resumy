import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/authContext'
import { AnalyticsProvider } from '@/lib/analytics'
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'

const jakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    variable: '--font-jakarta',
    display: 'swap',
})

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
})

export const metadata: Metadata = {
    title: 'Resume Builder',
    description: 'AI-powered resume builder',
    icons: {
        icon: '/logo-icon.png',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${jakarta.variable} ${inter.variable}`}>
            <body className="min-h-screen flex flex-col bg-white text-slate-900 antialiased font-sans">
                <AuthProvider>
                    <AnalyticsProvider>
                        <div className="flex-1">{children}</div>
                    </AnalyticsProvider>
                </AuthProvider>
            </body>
        </html>
    )
}