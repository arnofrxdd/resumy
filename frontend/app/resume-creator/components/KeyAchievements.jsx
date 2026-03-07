import React, { useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Editor, EditorProvider, Toolbar, BtnBold, BtnItalic, BtnUnderline, BtnBulletList } from 'react-simple-wysiwyg';
import "./form.css";
import CompatibilityWarning from "./CompatibilityWarning";

export default function KeyAchievements({ data, setData, onBack, onNext, isQuickEdit, onReturnToDashboard, isFieldSupported, currentTemplateName, isMobile }) {

    const achievements = Array.isArray(data.keyAchievements) && data.keyAchievements.length > 0
        ? data.keyAchievements
        : [{ name: '', description: '' }];

    const [errors, setErrors] = useState({});

    // 2. Direct updates to parent state
    const updateAchievement = (index, field, value) => {
        if (errors[index]) setErrors(prev => ({ ...prev, [index]: null }));
        const updated = achievements.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );

        setData(prev => ({
            ...prev,
            keyAchievements: updated
        }));
    };

    const addAchievement = () => {
        setData(prev => ({
            ...prev,
            keyAchievements: [
                ...(prev.keyAchievements || []),
                { name: '', description: '' }
            ]
        }));
    };

    const removeAchievement = (index) => {
        const filtered = achievements.filter((_, i) => i !== index);

        setData(prev => ({
            ...prev,
            keyAchievements:
                filtered.length > 0
                    ? filtered
                    : [{ name: '', description: '' }]
        }));
    };

    const handleNext = () => {
        let newErrors = {};
        let isValid = true;

        achievements.forEach((item, index) => {
            if (!item.name?.trim()) {
                newErrors[index] = "Achievement name is required.";
                isValid = false;
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
            {/* Header */}
            <div className={`ai-header ${isMobile ? 'mobile-mode' : ''}`} style={{ marginBottom: isMobile ? '24px' : '40px', padding: isMobile ? '0 16px' : '0' }}>
                <button className="back-link" onClick={onBack} style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '13px', fontWeight: 500 }}>
                    <ArrowLeft size={14} /> Back to Sections
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: '8px' }}>
                    <h1 className="form-title" style={{ fontSize: isMobile ? '24px' : '28px', margin: 0 }}>Key Achievements</h1>
                    <CompatibilityWarning isSupported={isFieldSupported('keyAchievements')} templateName={currentTemplateName} />
                </div>
                <p className="form-subtitle" style={{ fontSize: isMobile ? '14px' : '15px', color: '#64748b', lineHeight: 1.5 }}>Highlight your most impactful career wins (e.g., "Increased sales by 20%").</p>
            </div>

            {/* Achievements List */}
            <div className="achievements-list" style={{ padding: isMobile ? '0 16px' : '0' }}>
                {achievements.map((item, idx) => (
                    <div key={idx} style={{
                        marginBottom: isMobile ? '20px' : '32px',
                        background: '#fff',
                        padding: isMobile ? '16px' : '24px',
                        borderRadius: isMobile ? '16px' : '12px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: '20px' }}>
                            <div className="zety-input-wrap" style={{ flex: 1, marginBottom: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <label className="zety-label">Achievement / Award Name <span style={{ color: '#ef4444' }}>*</span></label>
                                    <CompatibilityWarning isSupported={isFieldSupported('keyAchievements.name')} templateName={currentTemplateName} />
                                </div>
                                <div className="input-container">
                                    <input
                                        className="zety-input-field"
                                        style={errors[idx] ? { borderColor: '#ef4444', background: '#fef2f2' } : {}}
                                        value={item.name || ''}
                                        onChange={(e) => updateAchievement(idx, 'name', e.target.value)}
                                        placeholder="e.g. Employee of the Month"
                                    />
                                </div>
                                {errors[idx] && <p className="input-error-text" style={{ marginTop: '6px', color: '#ef4444', fontSize: '12px', fontWeight: 500 }}>{errors[idx]}</p>}
                            </div>

                            {achievements.length > 1 && (
                                <button
                                    onClick={() => removeAchievement(idx)}
                                    style={{ marginTop: '28px', padding: '8px', color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', flexShrink: 0 }}
                                >
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>

                        <div className="zety-input-wrap">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <label className="zety-label">Description / Details</label>
                                <CompatibilityWarning isSupported={isFieldSupported('keyAchievements.description')} templateName={currentTemplateName} />
                            </div>
                            <div className="studio-ws-editor" style={{ height: '400px', display: 'flex', flexDirection: 'column', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
                                <div className="studio-editor-canvas" style={{ flex: 1, overflow: 'hidden' }}>
                                    <EditorProvider>
                                        <Editor
                                            value={item.description || ''}
                                            onChange={(e) => updateAchievement(idx, 'description', e.target.value)}
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
                onClick={addAchievement}
                style={{
                    marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px',
                    color: '#635bff', fontWeight: 600, fontSize: '13px',
                    background: 'none', border: 'none', cursor: 'pointer', padding: '8px 0'
                }}
            >
                <Plus size={16} /> Add one more achievement
            </button>

            {/* Footer */}
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