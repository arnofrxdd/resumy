import React, { useState, useEffect } from "react";
import { ArrowLeft, Check, Plus, Trash2, Cpu, Award, Info, Users, Heart, Globe, Briefcase, Layout, Star, Code, BookOpen, User } from "lucide-react";
import "./form.css";
import "./education.css";
import "./extrasections.css";

export default function ExtraSections({ data, setData, onBack, onNext, isQuickEdit, onReturnToDashboard, onPreview, isMobile }) {
    const hasSelections = () => {
        // If they have explicitly saved selections with ANY of them true, consider it selected.
        // We must check if they actually interacted with the ExtraSections array rather than just having empty defaults
        if (data.selectedExtraSections && Object.keys(data.selectedExtraSections).length > 0) {
            return Object.values(data.selectedExtraSections).some(Boolean);
        }

        // Auto-detect if there are existing entries from older data formats
        if (data.languages && data.languages.length > 0) return true;
        if (data.certifications && data.certifications.length > 0) return true;
        if (data.websites && data.websites.length > 0) return true;
        if (data.personal && (data.personal.gender || data.personal.dob || data.personal.nationality || data.personal.maritalStatus)) return true;
        if (data.customSection && data.customSection.isVisible) return true;

        return false;
    };

    const [view, setView] = useState(() => {
        if (isQuickEdit) return 'workspace';
        if (hasSelections()) return 'workspace';
        return 'intro';
    });

    // Exact IDs from original to preserve logic
    const predefinedSections = [
        { id: 'personalDetails', label: 'Personal Details', icon: <User size={20} />, desc: 'Date of birth, nationality, or marital status.' },
        { id: 'websites', label: 'Websites & Portfolios', icon: <Globe size={20} />, desc: 'LinkedIn, GitHub, or personal site.' },
        { id: 'projects', label: 'Projects', icon: <Briefcase size={20} />, desc: 'Notable work or academic projects.' },
        { id: 'certifications', label: 'Certifications', icon: <Award size={20} />, desc: 'Professional licenses and certificates.' },
        { id: 'keyAchievements', label: 'Key Achievements', icon: <Star size={20} />, desc: 'Awards, honors, and recognitions.' },
        { id: 'software', label: 'Software', icon: <Code size={20} />, desc: 'Specific tools or platforms.' },
        { id: 'accomplishments', label: 'Accomplishments', icon: <Award size={20} />, desc: 'Major milestones and successes.' },
        { id: 'affiliations', label: 'Affiliations', icon: <Users size={20} />, desc: 'Memberships in professional bodies.' },
        { id: 'interests', label: 'Interests', icon: <Heart size={20} />, desc: 'Hobbies and personal passions.' },
        { id: 'languages', label: 'Languages', icon: <Globe size={20} />, desc: 'Fluency levels in different languages.' },
        { id: 'additionalInfo', label: 'Additional Information', icon: <Info size={20} />, desc: 'Anything else relevant to the role.' },
        { id: 'custom', label: 'Custom Section', icon: <Layout size={20} />, desc: 'Add unique details specific to your career.' },
    ];

    const [activeSections, setActiveSections] = useState(() => {
        console.log("[ExtraSections] Initializing activeSections. Current data.selectedExtraSections:", data.selectedExtraSections);
        if (data.selectedExtraSections && Object.keys(data.selectedExtraSections).length > 0) {
            return data.selectedExtraSections;
        }

        // Initialize based on existing data if no previous selection saved
        const active = {};
        if (data.languages && data.languages.length > 0) active.languages = true;
        if (data.certifications && data.certifications.length > 0) active.certifications = true;
        if (data.websites && data.websites.length > 0) active.websites = true;
        // Check for personal details (any field filled)
        if (data.personal && (data.personal.gender || data.personal.dob || data.personal.nationality || data.personal.maritalStatus)) {
            active.personalDetails = true;
        }
        if (data.customSection && data.customSection.isVisible) {
            active.custom = true;
        }
        console.log("[ExtraSections] Falling back to auto-detected active sections:", active);
        return active;
    });

    // Sync local state when DB data loads asynchronously 
    useEffect(() => {
        // Only update if the data is actually different to avoid infinite loops
        if (data.selectedExtraSections && JSON.stringify(data.selectedExtraSections) !== JSON.stringify(activeSections)) {
            console.log("[ExtraSections] External data changed, syncing to local state");
            setActiveSections(data.selectedExtraSections);
        }
    }, [data.selectedExtraSections]);

    // Global autosync (consistent with other sections)
    useEffect(() => {
        // Only sync back if local state is different from parent to avoid infinite loops
        if (JSON.stringify(activeSections) !== JSON.stringify(data.selectedExtraSections)) {
            console.log("[ExtraSections] Local state changed, syncing to parent");
            setData(prev => ({
                ...prev,
                selectedExtraSections: activeSections
            }));
        }
    }, [activeSections, data.selectedExtraSections, setData]);

    const toggleSection = (id) => {
        const newActive = { ...activeSections, [id]: !activeSections[id] };
        setActiveSections(newActive);

        // Sync immediately to parent to avoid race conditions during navigation
        setData(prev => ({
            ...prev,
            selectedExtraSections: newActive
        }));
    };

    const handleNext = () => {
        console.log("[ExtraSections] handleNext called. isQuickEdit:", isQuickEdit);
        if (isQuickEdit && onReturnToDashboard) {
            onReturnToDashboard();
        } else {
            onNext();
        }
    };

    const goToPrev = () => {
        if (view === 'intro') {
            onBack();
        } else if (view === 'workspace') {
            setView('intro');
        }
    };


    if (view === 'intro') {
        return (
            <div className={`animate-fade education-intro-container ${isMobile ? 'mobile-mode' : ''}`} style={{
                justifyContent: 'center',
                maxWidth: '800px',
                margin: '0 auto',
                padding: isMobile ? '20px' : '0'
            }}>
                <div className="edu-intro-left" style={{
                    flex: 'none',
                    width: '100%',
                    maxWidth: '600px',
                    textAlign: isMobile ? 'center' : 'left'
                }}>
                    {!isMobile && (
                        <button className="back-link" onClick={goToPrev}>
                            <ArrowLeft size={16} /> Go Back
                        </button>
                    )}

                    <div className="intro-text-content">
                        <h1 className="form-title" style={{ fontSize: isMobile ? '28px' : '36px' }}>Enhance Your Profile</h1>
                        <div className="education-intro-text">
                            <p className="intro-label">Why this matters:</p>
                            <p className="intro-body">Add optional sections to showcase your unique qualifications, such as languages, certifications, or custom details.</p>
                        </div>
                    </div>

                    <div className="form-footer" style={{
                        marginTop: 'auto',
                        paddingBottom: '20px',
                        flexDirection: isMobile ? 'column' : 'row',
                        gap: isMobile ? '16px' : '12px'
                    }}>
                        <div style={{ display: 'flex', gap: '12px', width: isMobile ? '100%' : 'auto', flexDirection: isMobile ? 'column' : 'row' }}>
                            {isQuickEdit && (
                                <button className="btn-next outlined" onClick={onReturnToDashboard}>Dashboard</button>
                            )}
                            <button className="btn-next primary" onClick={() => setView('workspace')} style={{ width: isMobile ? '100%' : 'auto' }}>
                                {isMobile ? "Let's Add Sections" : 'Continue'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade education-container" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div className="ai-header" style={{ marginBottom: isMobile ? '24px' : '40px' }}>
                <button className="back-link" onClick={goToPrev} style={{ marginBottom: '16px' }}>
                    <ArrowLeft size={14} /> Go Back
                </button>
                <div className="extra-sections-header">
                    <div>
                        <h1 className="form-title" style={{ fontSize: isMobile ? '24px' : '28px', marginBottom: '8px' }}>Select Extra Sections</h1>
                        <p className="form-subtitle">Choose the optional sections you want to include in your resume.</p>
                    </div>
                    {Object.values(activeSections).filter(Boolean).length > 0 && (
                        <div className="active-count-badge">
                            {Object.values(activeSections).filter(Boolean).length} Selected
                        </div>
                    )}
                </div>
            </div>

            {/* Premium Section Grid */}
            <div className={`extra-sections-grid ${isMobile ? 'mobile' : ''}`}>
                {predefinedSections.map(section => (
                    <div
                        key={section.id}
                        className={`extra-section-card ${activeSections[section.id] ? 'selected' : ''}`}
                        onClick={() => toggleSection(section.id)}
                    >
                        <div className="section-icon-box">
                            {section.icon}
                        </div>
                        <div className="section-info">
                            <div className="section-label">{section.label}</div>
                            {!isMobile && <div className="section-desc">{section.desc}</div>}
                        </div>
                        <div className="section-check">
                            <Check className="check-icon" size={12} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="form-footer" style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end', width: '100%', gap: '15px' }}>
                {isQuickEdit && (
                    <button className="btn-next outlined" onClick={onReturnToDashboard}>Back to Dashboard</button>
                )}
                <button className="btn-next primary" onClick={handleNext}>
                    {isQuickEdit ? 'Save & Return' : (hasSelections() ? 'Continue to Sections' : 'Finalize Resume')}
                </button>
            </div>
        </div>
    );
}