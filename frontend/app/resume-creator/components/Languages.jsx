import React, { useState } from "react";
import { ArrowLeft, Globe, Plus, Trash2, Check } from "lucide-react";
import "./form.css";
import CompatibilityWarning from "./CompatibilityWarning";

const PROFICIENCY_LEVELS = [
    { label: "Beginner", value: 1 },
    { label: "Intermediate", value: 2 },
    { label: "Advanced", value: 3 },
    { label: "Fluent", value: 4 },
    { label: "Native", value: 5 },
];

const PREDEFINED_LANGUAGES = [
    "English", "Hindi", "Tamil", "Telugu", "Marathi", "Kannada", "Malayalam", "Bengali", "Gujarati"
];

export default function Languages({ data, setData, onBack, onNext, isQuickEdit, onReturnToDashboard, isFieldSupported, currentTemplateName, isMobile }) {

    // 1. Direct Read
    const languages = Array.isArray(data.languages) ? data.languages : [];

    // Local UI state for the input field only
    const [customName, setCustomName] = useState("");
    const [errors, setErrors] = useState("");

    // 2. Direct Updates to Parent State
    const addLanguage = (name) => {
        if (!name.trim()) return;
        if (languages.find(l => l.name === name)) {
            setErrors("Language already added.");
            return;
        }
        setErrors("");

        const newLangs = [...languages, { name, level: 4 }];
        setData(prev => ({
            ...prev,
            languages: newLangs
        }));
    };

    const removeLanguage = (index) => {
        const newLangs = languages.filter((_, i) => i !== index);
        setData(prev => ({
            ...prev,
            languages: newLangs
        }));
    };

    const updateLevel = (index, level) => {
        const newLangs = [...languages];
        newLangs[index] = { ...newLangs[index], level };
        setData(prev => ({
            ...prev,
            languages: newLangs
        }));
    };

    const handleNext = () => {
        if (!languages || languages.length === 0) {
            setErrors("Please add at least one language skill.");
            if (isMobile) {
                setTimeout(() => {
                    const firstError = document.querySelector('.zety-input-field, .selected-languages-list');
                    if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
            return;
        }

        if (isQuickEdit && onReturnToDashboard) {
            onReturnToDashboard();
        } else {
            onNext();
        }
    };

    return (
        <div className="animate-fade" style={{ maxWidth: '900px', margin: '0 auto' }}>
            {/* Header */}
            <div className="ai-header" style={{ marginBottom: isMobile ? '24px' : '40px', padding: isMobile ? '0 16px' : '0' }}>
                <button className="back-link" onClick={onBack} style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '13px', fontWeight: 500 }}>
                    <ArrowLeft size={14} /> Back to Sections
                </button>
                <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', gap: '12px', flexDirection: isMobile ? 'column' : 'row' }}>
                    <h1 className="form-title" style={{ fontSize: isMobile ? '24px' : '28px', marginBottom: '4px', lineHeight: 1.2 }}>Add your language skills</h1>
                    <CompatibilityWarning isSupported={isFieldSupported('languages')} templateName={currentTemplateName} />
                </div>
                <p className="form-subtitle" style={{ fontSize: isMobile ? '14px' : '16px', color: '#64748b' }}>Include your native language and additional languages you speak.</p>
            </div>

            {/* Layout: Sidebar Suggestions + List */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'minmax(250px, 300px) 1fr',
                gap: isMobile ? '24px' : '32px',
                alignItems: 'start',
                padding: isMobile ? '0 16px 100px' : '0'
            }}>

                {/* Suggestions Sidebar (Replacing bubbles) */}
                <div style={{
                    background: '#f8fafc',
                    padding: isMobile ? '16px' : '20px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    order: isMobile ? 2 : 1
                }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                        Popular Languages
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {PREDEFINED_LANGUAGES.map(lang => {
                            const isSelected = languages.find(l => l.name === lang);
                            return (
                                <button
                                    key={lang}
                                    onClick={() => !isSelected && addLanguage(lang)}
                                    disabled={isSelected}
                                    style={{
                                        textAlign: 'left', padding: '10px 12px', background: isSelected ? '#f1f5f9' : 'white', border: '1px solid #e2e8f0', borderRadius: '6px',
                                        color: isSelected ? '#94a3b8' : '#334155', fontSize: '13px', fontWeight: 500, cursor: isSelected ? 'default' : 'pointer', transition: 'all 0.2s',
                                        display: 'flex', alignItems: 'center', gap: '8px'
                                    }}
                                    onMouseOver={(e) => { if (!isSelected) { e.currentTarget.style.borderColor = '#635bff'; e.currentTarget.style.color = '#635bff'; } }}
                                    onMouseOut={(e) => { if (!isSelected) { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#334155'; } }}
                                >
                                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {isSelected ? <Check size={14} /> : <Plus size={14} />}
                                    </span>
                                    {lang}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Main List */}
                <div style={{ order: isMobile ? 1 : 2 }}>
                    {/* Add Custom Input */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                        <input
                            className="zety-input-field"
                            placeholder="Add another language..."
                            value={customName}
                            onChange={(e) => {
                                setCustomName(e.target.value);
                                if (errors) setErrors("");
                            }}
                            onKeyDown={(e) => e.key === 'Enter' && customName && (addLanguage(customName) || setCustomName(''))}
                            style={{
                                flex: 1,
                                padding: '12px 16px',
                                fontSize: '15px',
                                borderRadius: '10px',
                                border: '1px solid #e2e8f0',
                                outline: 'none'
                            }}
                        />
                        <button
                            onClick={() => { if (customName) { addLanguage(customName); setCustomName(""); } }}
                            style={{
                                padding: '10px 20px',
                                borderRadius: '10px',
                                background: '#635bff',
                                color: 'white',
                                border: 'none',
                                fontWeight: 700,
                                fontSize: '14px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            Add
                        </button>
                    </div>
                    {errors && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '-16px', marginBottom: '20px', fontWeight: 500 }}>{errors}</p>}

                    <div className="selected-languages-list">
                        {languages.map((lang, idx) => (
                            <div key={idx} style={{
                                marginBottom: '16px',
                                padding: isMobile ? '16px' : '20px',
                                background: 'white',
                                border: '1px solid #e2e8f0',
                                borderRadius: '12px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '16px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 600, fontSize: '15px', color: '#1e293b' }}>{lang.name}</span>
                                    <button onClick={() => removeLanguage(idx)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                    {PROFICIENCY_LEVELS.map(level => (
                                        <button
                                            key={level.value}
                                            onClick={() => updateLevel(idx, level.value)}
                                            style={{
                                                padding: '8px 16px',
                                                borderRadius: '30px',
                                                fontSize: '11px',
                                                border: '1px solid',
                                                borderColor: lang.level === level.value ? '#635bff' : '#e2e8f0',
                                                background: lang.level === level.value ? '#eff6ff' : 'white',
                                                color: lang.level === level.value ? '#635bff' : '#64748b',
                                                cursor: 'pointer',
                                                fontWeight: 600,
                                                transition: 'all 0.2s',
                                                outline: 'none'
                                            }}
                                        >
                                            {level.label}
                                        </button>
                                    ))}
                                    <CompatibilityWarning isSupported={isFieldSupported('languages.level')} templateName={currentTemplateName} />
                                </div>
                            </div>
                        ))}
                        {languages.length === 0 && (
                            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '13px', border: '1px dashed #e2e8f0', borderRadius: '8px' }}>
                                Select a language from the list or add your own.
                            </div>
                        )}
                    </div>

                    <div className="form-footer" style={{
                        marginTop: isMobile ? '30px' : '50px',
                        display: 'flex',
                        flexDirection: isMobile ? 'column' : 'row',
                        justifyContent: 'flex-end',
                        gap: '12px'
                    }}>
                        {isQuickEdit && (
                            <button className="btn-next outlined" onClick={onReturnToDashboard} style={{ width: isMobile ? '100%' : 'auto' }}>Back to Dashboard</button>
                        )}
                        <button className="btn-next primary" onClick={handleNext} style={{ width: isMobile ? '100%' : 'auto', minWidth: isMobile ? '0' : '200px' }}>
                            {isQuickEdit ? 'Save & Return' : 'Next'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}