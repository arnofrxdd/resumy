import React, { useState } from "react";
import { ArrowLeft, Plus, Trash2, Star } from "lucide-react";
import { Editor, EditorProvider, Toolbar, BtnBold, BtnItalic, BtnUnderline, BtnBulletList } from 'react-simple-wysiwyg';
import "./form.css";

import CompatibilityWarning from "./CompatibilityWarning";

export default function Software({ data, setData, onBack, onNext, isQuickEdit, onReturnToDashboard, isFieldSupported, currentTemplateName, isMobile }) {

    // 1. Direct Read From Parent
    const softwareSkills =
        Array.isArray(data.software) && data.software.length > 0
            ? data.software
            : [{ name: '', rating: 0, description: '' }];

    // 2. Direct Update (Parent Only)
    const [errors, setErrors] = useState({});

    const updateSkill = (index, field, value) => {
        if (errors[index]) setErrors(prev => ({ ...prev, [index]: null }));
        const updated = softwareSkills.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );

        setData(prev => ({
            ...prev,
            software: updated
        }));
    };

    // 3. Add
    const addSkill = () => {
        setData(prev => ({
            ...prev,
            software: [
                ...(prev.software || []),
                { name: '', rating: 0, description: '' }
            ]
        }));
    };

    // 4. Remove
    const removeSkill = (index) => {
        const filtered = softwareSkills.filter((_, i) => i !== index);

        setData(prev => ({
            ...prev,
            software:
                filtered.length > 0
                    ? filtered
                    : [{ name: '', rating: 0, description: '' }]
        }));
    };

    const handleNext = () => {
        let newErrors = {};

        softwareSkills.forEach((skill, index) => {
            if (!skill.name?.trim()) {
                newErrors[index] = "Software name is required.";
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
        <div className="animate-fade" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className={`ai-header ${isMobile ? 'mobile-mode' : ''}`} style={{ marginBottom: isMobile ? '24px' : '40px', padding: isMobile ? '0 16px' : '0' }}>
                <button className="back-link" onClick={onBack} style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '13px', fontWeight: 500 }}>
                    <ArrowLeft size={14} /> Back to Sections
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <h1 className="form-title" style={{ fontSize: isMobile ? '24px' : '28px', margin: 0 }}>What software skills do you have?</h1>
                    <CompatibilityWarning isSupported={isFieldSupported('software')} templateName={currentTemplateName} />
                </div>
                <p style={{ color: '#64748b', fontSize: isMobile ? '14px' : '15px', margin: 0, lineHeight: 1.5 }}>Add the software tools you use and optionally describe your proficiency or key projects where you used them.</p>
            </div>

            {/* Software List */}
            <div className="software-list" style={{ padding: isMobile ? '0 16px' : '0' }}>
                {softwareSkills.map((skill, idx) => (
                    <div key={idx} style={{
                        marginBottom: isMobile ? '20px' : '32px',
                        background: '#fff',
                        padding: isMobile ? '16px' : '24px',
                        borderRadius: isMobile ? '16px' : '12px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                    }}>
                        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'stretch' : 'center', gap: '16px', marginBottom: '20px' }}>
                            <div className="zety-input-wrap" style={{ flex: 1, marginBottom: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <label className="zety-label">Software / Tool Name <span style={{ color: '#ef4444' }}>*</span></label>
                                    <CompatibilityWarning isSupported={isFieldSupported('software.name')} templateName={currentTemplateName} />
                                </div>
                                <div className="input-container">
                                    <input
                                        className="zety-input-field"
                                        style={errors[idx] ? { borderColor: '#ef4444', background: '#fef2f2' } : {}}
                                        value={skill.name || ''}
                                        onChange={(e) => updateSkill(idx, 'name', e.target.value)}
                                        placeholder="e.g. Microsoft Excel"
                                    />
                                </div>
                                {errors[idx] && <p className="input-error-text" style={{ marginTop: '6px', color: '#ef4444', fontSize: '12px', fontWeight: 500 }}>{errors[idx]}</p>}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label className="zety-label">Rating</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <div className="star-rating" style={{ display: 'flex', gap: '6px', cursor: 'pointer' }}>
                                            {[1, 2, 3, 4, 5].map((level) => (
                                                <div
                                                    key={level}
                                                    onClick={() => updateSkill(idx, 'rating', level)}
                                                    style={{
                                                        width: '14px', height: '14px', borderRadius: '50%',
                                                        backgroundColor: level <= (skill.rating || 0) ? '#635bff' : '#f1f5f9',
                                                        border: level <= (skill.rating || 0) ? '1px solid #635bff' : '1px solid #e2e8f0',
                                                        transition: 'all 0.2s'
                                                    }}
                                                    title={`Rate ${level}/5`}
                                                />
                                            ))}
                                        </div>
                                        <CompatibilityWarning isSupported={isFieldSupported('software.rating')} templateName={currentTemplateName} />
                                    </div>
                                </div>

                                {softwareSkills.length > 1 && (
                                    <button
                                        onClick={() => removeSkill(idx)}
                                        style={{ marginTop: isMobile ? '20px' : '28px', padding: '8px', color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                                        onMouseOver={(e) => e.currentTarget.style.background = '#fef2f2'}
                                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="zety-input-wrap">
                            <label className="zety-label" style={{ marginBottom: '8px', display: 'block' }}>Description / Highlights (Optional)</label>
                            <div className="studio-ws-editor" style={{ height: '400px', display: 'flex', flexDirection: 'column', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                                <div className="studio-editor-canvas" style={{ flex: 1, overflow: 'hidden' }}>
                                    <EditorProvider>
                                        <Editor
                                            value={skill.description || ''}
                                            onChange={(e) => updateSkill(idx, 'description', e.target.value)}
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
            </div>

            <button
                onClick={addSkill}
                style={{
                    marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px',
                    color: '#635bff', fontWeight: 600, fontSize: '14px',
                    background: 'none', border: 'none', cursor: 'pointer', padding: '12px 0'
                }}
            >
                <Plus size={18} /> Add one more software
            </button>

            <div className="form-footer" style={{
                marginTop: '50px',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'flex-end',
                gap: '12px',
                padding: isMobile ? '0 16px 40px' : '0'
            }}>
                {isQuickEdit && (
                    <button className="btn-next outlined" onClick={onReturnToDashboard} style={{ width: '100%' }}>Dashboard</button>
                )}
                <button className="btn-next primary" onClick={handleNext} style={{ width: isMobile ? '100%' : 'auto', minWidth: isMobile ? '0' : '200px' }}>
                    {isQuickEdit ? 'Save & Return' : 'Next Step'}
                </button>
            </div>
        </div>
    );
}