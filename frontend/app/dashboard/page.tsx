'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
    Plus, 
    FileText, 
    Download, 
    Trash2, 
    Edit, 
    Search, 
    LogOut, 
    MoreVertical, 
    Clock, 
    Eye,
    Layout,
    CheckCircle2,
    Briefcase,
    Zap,
    TrendingUp
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/authContext'
import { supabaseClient } from '@/lib/supabaseClient'
import axios from 'axios'
import './Dashboard.css'

interface Resume {
    id: string;
    title: string;
    filename: string;
    status: string;
    updated_at: string;
    created_at: string;
    template: string;
}

export default function DashboardPage() {
    const router = useRouter()
    const { userId, userEmail, isAuthenticated, isLoading: authLoading } = useAuth()
    const [resumes, setResumes] = useState<Resume[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || '/resumy';

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/')
        }
    }, [isAuthenticated, authLoading, router])

    useEffect(() => {
        if (isAuthenticated && userId) {
            fetchResumes()
        }
    }, [isAuthenticated, userId])

    const fetchResumes = async () => {
        try {
            setIsLoading(true)
            const { data: { session } } = await supabaseClient.auth.getSession()
            const response = await axios.get(`${API_URL}/api/resumes`, {
                headers: {
                    Authorization: `Bearer ${session?.access_token}`
                }
            })
            if (response.data.success) {
                setResumes(response.data.resumes)
            }
        } catch (error) {
            console.error('Error fetching resumes:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (!confirm('Are you sure you want to delete this resume?')) return

        try {
            setDeletingId(id)
            const { data: { session } } = await supabaseClient.auth.getSession()
            await axios.delete(`${API_URL}/api/resumes/${id}`, {
                headers: {
                    Authorization: `Bearer ${session?.access_token}`
                }
            })
            setResumes(resumes.filter(r => r.id !== id))
        } catch (error) {
            console.error('Error deleting resume:', error)
            alert('Failed to delete resume')
        } finally {
            setDeletingId(null)
        }
    }


    const handleSignOut = async () => {
        await supabaseClient.auth.signOut()
        router.push('/')
    }

    const filteredResumes = resumes.filter(r => 
        (r.title || 'Untitled Resume').toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (authLoading || isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-600 font-medium">Loading your dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="dashboard-container">
            {/* Header */}
            <header className="dashboard-header">
                <div className="welcome-section">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        My Resumes
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        Success starts with a standout resume.
                    </motion.p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            placeholder="Search resumes..." 
                            className="bg-white border border-slate-200 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-64"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="user-menu">
                        <button 
                            className="user-avatar"
                            onClick={() => setShowUserMenu(!showUserMenu)}
                        >
                            {userEmail?.[0].toUpperCase() || 'U'}
                        </button>

                        <AnimatePresence>
                            {showUserMenu && (
                                <motion.div 
                                    className="dropdown-menu"
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                >
                                    <div className="px-4 py-3 border-bottom border-slate-100 mb-2">
                                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Account</p>
                                        <p className="text-sm font-bold text-slate-700 truncate">{userEmail}</p>
                                    </div>
                                    <div className="dropdown-item" onClick={() => router.push('/resume-creator')}>
                                        <Zap className="w-4 h-4" />
                                        <span>Editor</span>
                                    </div>
                                    <div className="dropdown-item danger" onClick={handleSignOut}>
                                        <LogOut className="w-4 h-4" />
                                        <span>Sign Out</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </header>

            {/* Stats */}
            <div className="stats-grid">
                <motion.div 
                    className="stat-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="stat-icon blue">
                        <FileText className="w-6 h-6" />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{resumes.length}</span>
                        <span className="stat-label">Total Resumes</span>
                    </div>
                </motion.div>

                <motion.div 
                    className="stat-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="stat-icon purple">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">Active</span>
                        <span className="stat-label">Profile Status</span>
                    </div>
                </motion.div>

                <motion.div 
                    className="stat-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="stat-icon green">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">100%</span>
                        <span className="stat-label">AI Accuracy</span>
                    </div>
                </motion.div>
            </div>

            {/* Resumes */}
            <div className="resumes-section">
                <div className="section-header">
                    <h2>Recent Projects</h2>
                </div>

                <div className="resumes-grid">
                    {/* Create New Card */}
                    <motion.div 
                        className="create-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => router.push('/resume-creator')}
                    >
                        <div className="create-icon">
                            <Plus className="w-8 h-8" />
                        </div>
                        <h3>Create New</h3>
                        <p>Start from scratch or use AI</p>
                    </motion.div>

                    {/* Resume Cards */}
                    <AnimatePresence mode="popLayout">
                        {filteredResumes.map((resume, index) => (
                            <motion.div 
                                key={resume.id}
                                className="resume-card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.05 + 0.1 }}
                                layout
                            >
                                <div className="resume-preview">
                                    {/* Placeholder for now as we don't have screenshots */}
                                    <div className="flex flex-col items-center justify-center text-slate-300 w-full h-full p-8">
                                        <Layout className="w-20 h-20 mb-4 opacity-20" />
                                        <div className="w-full h-4 bg-slate-200 rounded-full mb-2 opacity-50"></div>
                                        <div className="w-2/3 h-4 bg-slate-200 rounded-full mb-4 opacity-50"></div>
                                        <div className="w-full h-32 border-2 border-slate-200/50 rounded-xl border-dashed"></div>
                                    </div>
                                    
                                    <div className="resume-preview-overlay">
                                        <div className="overlay-actions">
                                            <button 
                                                className="action-btn"
                                                onClick={() => router.push(`/resume-creator?resumeId=${resume.id}`)}
                                                title="Edit Resume"
                                            >
                                                <Edit className="w-6 h-6" />
                                            </button>
                                            <button 
                                                className="action-btn delete"
                                                onClick={(e) => handleDelete(resume.id, e)}
                                                disabled={deletingId === resume.id}
                                                title="Delete Resume"
                                            >
                                                {deletingId === resume.id ? <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div> : <Trash2 className="w-6 h-6" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="resume-info">
                                    <div>
                                        <span className="resume-title">{resume.title || 'Untitled Resume'}</span>
                                        <div className="resume-meta">
                                            <div className="resume-meta-item">
                                                <Clock className="w-3.5 h-3.5" />
                                                <span>{new Date(resume.updated_at || resume.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <div className="resume-meta-item">
                                                <Layout className="w-3.5 h-3.5" />
                                                <span>{resume.template || 'Default'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className={`resume-status ${resume.status === 'completed' ? 'completed' : 'started'}`}>
                                            {resume.status || 'Draft'}
                                        </span>
                                        <div className="flex gap-2">
                                            <button 
                                                className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                                                onClick={() => router.push(`/resume-creator?resumeId=${resume.id}`)}
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredResumes.length === 0 && !isLoading && searchQuery && (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <Search className="w-12 h-12" />
                        </div>
                        <h3>No matches found</h3>
                        <p>We couldn't find any resumes matching "{searchQuery}"</p>
                        <button className="primary-btn" onClick={() => setSearchQuery('')}>
                            Clear Search
                        </button>
                    </div>
                )}

                {resumes.length === 0 && !isLoading && (
                    <div className="empty-state">
                        <div className="empty-icon">
                            <Briefcase className="w-12 h-12" />
                        </div>
                        <h3>No resumes yet</h3>
                        <p>Create your first resume to land your dream job with AI-powered suggestions.</p>
                        <button className="primary-btn" onClick={() => router.push('/resume-creator')}>
                            <Plus className="w-5 h-5" />
                            Create Your First Resume
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
