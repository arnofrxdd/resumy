import React, { useState, useEffect } from "react";
import { ArrowLeft, Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Search, Loader2 } from "lucide-react";
import { Editor, EditorProvider, Toolbar, BtnBold, BtnItalic, BtnUnderline, BtnBulletList } from 'react-simple-wysiwyg';
import "./form.css";
import CompatibilityWarning from "./CompatibilityWarning";

export default function Affiliations({ data, setData, onBack, onNext, isQuickEdit, onReturnToDashboard, isFieldSupported, currentTemplateName, isMobile }) {

    // 1. Direct Read & Migration (No State)
    const getAffiliations = () => {
        if (!data.affiliations) return [{ name: "", description: "" }];

        if (Array.isArray(data.affiliations) && data.affiliations.length > 0) {
            return data.affiliations.map(aff =>
                typeof aff === 'string' ? { name: aff, description: "" } : aff
            );
        }

        // Legacy string format fallback
        if (typeof data.affiliations === 'string' && data.affiliations.trim() !== "") {
            const isHTML = /<[a-z][\s\S]*>/i.test(data.affiliations);
            if (isHTML || data.affiliations.length > 100) {
                return [{ name: "Organization", description: data.affiliations }];
            }
            return [{ name: data.affiliations, description: "" }];
        }

        return [{ name: "", description: "" }];
    };

    const affiliations = getAffiliations();

    // Local UI State only (Does not affect parent data directly until action is taken)
    const [aiSearchTerm, setAiSearchTerm] = useState(data.personal?.profession || "");
    const [aiSuggestions, setAiSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (aiSearchTerm && aiSuggestions.length === 0) {
            handleSearch(aiSearchTerm);
        }
    }, []);

    const handleSearch = async (term) => {
        if (!term) return;
        setIsLoading(true);
        try {
            // Mock Data for Affiliations
            setTimeout(() => {
                setAiSuggestions([
                    "Society of Human Resource Management",
                    "International Association of Administrative Professionals",
                    "American Institute of Certified Public Accountants",
                    "Association for Computing Machinery",
                    "Freemason",
                    "Rotary International",
                    "Project Management Institute",
                    "Jaycees",
                    "APICS - Association for Supply Chain Management",
                    "American Society of Safety Professionals"
                ]);
                setIsLoading(false);
            }, 800);
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    // 2. Direct Updates to Parent Data
    const handleAddSuggestion = (text) => {
        setData(prev => ({
            ...prev,
            affiliations: [...affiliations, { name: text, description: "" }]
        }));
    };

    const addAffiliation = () => {
        setData(prev => ({
            ...prev,
            affiliations: [...affiliations, { name: "", description: "" }]
        }));
    };

    const updateAffiliation = (index, field, value) => {
        if (errors[index]) setErrors(prev => ({ ...prev, [index]: null }));
        const updated = affiliations.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        setData(prev => ({ ...prev, affiliations: updated }));
    };

    const removeAffiliation = (index) => {
        const updated = affiliations.filter((_, i) => i !== index);
        setData(prev => ({
            ...prev,
            affiliations: updated.length > 0 ? updated : [{ name: "", description: "" }]
        }));
    };

    const moveAffiliation = (index, direction) => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === affiliations.length - 1) return;

        const newIndex = direction === 'up' ? index - 1 : index + 1;
        const updated = [...affiliations];
        const [moved] = updated.splice(index, 1);
        updated.splice(newIndex, 0, moved);

        setData(prev => ({ ...prev, affiliations: updated }));
    };

    const handleNext = () => {
        let newErrors = {};

        affiliations.forEach((aff, index) => {
            if (!aff.name?.trim()) {
                newErrors[index] = "Organization name is required.";
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (isQuickEdit && onReturnToDashboard) {
            onReturnToDashboard();
        } else {
            onNext();
        }
    };

    return (
        <div className="animate-fade" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div className="ai-header" style={{ marginBottom: isMobile ? '24px' : '40px', padding: isMobile ? '0 16px' : '0' }}>
                <button className="back-link" onClick={onBack} style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '13px', fontWeight: 500 }}>
                    <ArrowLeft size={14} /> Back to Sections
                </button>
                <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', gap: '12px', flexDirection: isMobile ? 'column' : 'row' }}>
                    <h1 className="form-title" style={{ fontSize: isMobile ? '24px' : '28px', marginBottom: '4px', lineHeight: 1.2 }}>What are your affiliations?</h1>
                    <CompatibilityWarning isSupported={isFieldSupported('affiliations')} templateName={currentTemplateName} />
                </div>
                <p className="form-subtitle" style={{ fontSize: isMobile ? '14px' : '16px', color: '#64748b', marginTop: '4px' }}>List professional memberships and organizations you belong to.</p>
            </div>

            {/* Workstation Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '350px 1fr',
                gap: isMobile ? '24px' : '40px',
                alignItems: 'start',
                padding: isMobile ? '0 16px 100px' : '0'
            }}>

                {/* AI Sidebar */}
                <div style={{
                    background: '#f8fafc',
                    padding: isMobile ? '20px' : '24px',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    height: 'auto',
                    minHeight: isMobile ? 'auto' : '600px',
                    display: 'flex',
                    flexDirection: 'column',
                    order: isMobile ? 2 : 1
                }}>
                    <div style={{ marginBottom: '24px', flexShrink: 0 }}>
                        <label className="zety-label" style={{ marginBottom: '8px', display: 'block', fontWeight: 600, color: '#475569' }}>Search by job title</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                                type="text"
                                style={{ flex: 1, padding: '10px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none' }}
                                placeholder="e.g. Accountant"
                                value={aiSearchTerm}
                                onChange={(e) => setAiSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch(aiSearchTerm)}
                            />
                            <button
                                onClick={() => handleSearch(aiSearchTerm)}
                                style={{ padding: '10px', background: '#635bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <Search size={18} />
                            </button>
                        </div>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', paddingRight: '8px' }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
                            Smart Suggestions
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {isLoading ? (
                                <div style={{ textAlign: 'center', padding: '40px' }}><Loader2 size={32} className="spin" style={{ color: '#635bff' }} /></div>
                            ) : (
                                aiSuggestions.map((text, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAddSuggestion(text)}
                                        style={{
                                            textAlign: 'left', padding: '14px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px',
                                            color: '#334155', fontSize: '13px', lineHeight: '1.5', cursor: 'pointer', transition: 'all 0.2s', position: 'relative',
                                            paddingLeft: '38px'
                                        }}
                                        onMouseOver={(e) => { e.currentTarget.style.borderColor = '#635bff'; e.currentTarget.style.backgroundColor = '#f8faff'; }}
                                        onMouseOut={(e) => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.backgroundColor = 'white'; }}
                                    >
                                        <div style={{ position: 'absolute', left: '12px', top: '16px', color: '#635bff' }}><Plus size={16} /></div>
                                        {text}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Editor Pane */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', order: isMobile ? 1 : 2 }}>
                    {affiliations.map((aff, index) => (
                        <div key={index} className="form-section-card" style={{
                            padding: isMobile ? '20px' : '28px',
                            background: 'white',
                            borderRadius: '16px',
                            border: '1px solid #e2e8f0',
                            position: 'relative',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                        }}>
                            {!isMobile && (
                                <div style={{ position: 'absolute', left: '-40px', top: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <button onClick={() => moveAffiliation(index, 'up')} disabled={index === 0} style={{ opacity: index === 0 ? 0.3 : 1, color: '#94a3b8', background: 'none', border: 'none', cursor: index === 0 ? 'default' : 'pointer' }}><ChevronUp size={20} /></button>
                                    <button onClick={() => moveAffiliation(index, 'down')} disabled={index === affiliations.length - 1} style={{ opacity: index === affiliations.length - 1 ? 0.3 : 1, color: '#94a3b8', background: 'none', border: 'none', cursor: index === affiliations.length - 1 ? 'default' : 'pointer' }}><ChevronDown size={20} /></button>
                                </div>
                            )}

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', gap: '12px' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                        <label className="label" style={{ margin: 0, fontWeight: 700, fontSize: '14px', color: '#1e293b' }}>Organization Name <span style={{ color: '#ef4444' }}>*</span></label>
                                        <CompatibilityWarning isSupported={isFieldSupported('affiliations.name')} templateName={currentTemplateName} />
                                    </div>
                                    <input
                                        className="zety-input"
                                        value={aff.name || ''}
                                        onChange={(e) => updateAffiliation(index, 'name', e.target.value)}
                                        placeholder="e.g. Rotary International"
                                        style={{
                                            width: '100%',
                                            padding: '12px 16px',
                                            borderRadius: '10px',
                                            border: '1px solid #e2e8f0',
                                            fontSize: '15px',
                                            ...(errors[index] ? { borderColor: '#ef4444', background: '#fef2f2' } : {})
                                        }}
                                    />
                                    {errors[index] && <p className="input-error-text" style={{ marginTop: '6px', color: '#ef4444', fontSize: '12px', fontWeight: 600 }}>{errors[index]}</p>}
                                </div>
                                <button
                                    onClick={() => removeAffiliation(index)}
                                    style={{
                                        padding: '10px',
                                        color: '#ef4444',
                                        background: '#fef2f2',
                                        border: 'none',
                                        borderRadius: '10px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        marginTop: '28px'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = '#fee2e2'}
                                    onMouseOut={(e) => e.currentTarget.style.background = '#fef2f2'}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <label className="label" style={{ margin: 0, fontWeight: 600 }}>Description / Role (Optional)</label>
                                    <CompatibilityWarning isSupported={isFieldSupported('affiliations.description')} templateName={currentTemplateName} />
                                </div>
                                <div className="studio-ws-editor" style={{ height: '400px', display: 'flex', flexDirection: 'column', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                                    <div className="studio-editor-canvas" style={{ flex: 1, overflow: 'hidden' }}>
                                        <EditorProvider>
                                            <Editor
                                                value={aff.description || ''}
                                                onChange={(e) => updateAffiliation(index, 'description', e.target.value)}
                                                containerProps={{
                                                    style: {
                                                        height: '100%',
                                                        border: 'none',
                                                        outline: 'none',
                                                        overflowY: 'auto'
                                                    }
                                                }}
                                            >
                                                <Toolbar>
                                                    <BtnBold />
                                                    <BtnItalic />
                                                    <BtnUnderline />
                                                    <BtnBulletList />
                                                </Toolbar>
                                            </Editor>
                                        </EditorProvider>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        className="btn-add-info"
                        onClick={addAffiliation}
                        style={{ justifyContent: 'center', padding: '16px', borderStyle: 'dashed', background: '#f8fafc', color: '#635bff', fontWeight: 600 }}
                    >
                        <Plus size={18} /> Add Another Affiliation
                    </button>

                    <div className="form-footer" style={{
                        marginTop: '40px',
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