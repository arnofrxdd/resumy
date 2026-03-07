import React, { useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import "./form.css";
import CompatibilityWarning from "./CompatibilityWarning";

export default function Interests({ data, setData, onBack, onNext, isQuickEdit, onReturnToDashboard, isFieldSupported, currentTemplateName, isMobile }) {

    // 1. Direct Read
    const interests = Array.isArray(data.interests) && data.interests.length > 0
        ? data.interests
        : [""];

    const [errors, setErrors] = useState({});

    // 2. Direct Updates
    const updateInterest = (index, value) => {
        if (errors[index]) setErrors(prev => ({ ...prev, [index]: null }));
        const updated = interests.map((item, i) =>
            i === index ? value : item
        );

        setData(prev => ({
            ...prev,
            interests: updated
        }));
    };

    const addInterest = () => {
        setData(prev => ({
            ...prev,
            interests: [...(prev.interests || []), ""]
        }));
    };

    const removeInterest = (index) => {
        const filtered = interests.filter((_, i) => i !== index);

        // Fallback to at least one empty input if the last one is deleted
        setData(prev => ({
            ...prev,
            interests: filtered.length > 0 ? filtered : [""]
        }));
    };

    const handleNext = () => {
        let newErrors = {};

        interests.forEach((item, index) => {
            if (!item?.trim()) {
                newErrors[index] = "Interest name is required.";
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
            <div className="ai-header" style={{ marginBottom: isMobile ? '24px' : '40px', padding: isMobile ? '0 16px' : '0' }}>
                <button className="back-link" onClick={onBack} style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '13px', fontWeight: 500 }}>
                    <ArrowLeft size={14} /> Back to Sections
                </button>
                <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', gap: '12px', flexDirection: isMobile ? 'column' : 'row' }}>
                    <h1 className="form-title" style={{ fontSize: isMobile ? '24px' : '28px', marginBottom: '4px', lineHeight: 1.2 }}>What interests do you have?</h1>
                    <CompatibilityWarning isSupported={isFieldSupported('interests')} templateName={currentTemplateName} />
                </div>
                <p className="form-subtitle" style={{ fontSize: isMobile ? '14px' : '16px', color: '#64748b', marginTop: '4px' }}>Share your hobbies and what you enjoy doing in your free time.</p>
            </div>

            {/* List */}
            <div className="interests-list" style={{ padding: isMobile ? '0 16px' : '0' }}>
                {interests.map((interest, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div className="zety-input-wrap" style={{ flex: 1, marginBottom: 0 }}>
                            <div className="input-container">
                                <input
                                    className="zety-input-field"
                                    style={{
                                        padding: '12px 16px',
                                        fontSize: '15px',
                                        borderRadius: '10px',
                                        border: '1px solid #e2e8f0',
                                        width: '100%',
                                        ...(errors[idx] ? { borderColor: '#ef4444', background: '#fef2f2' } : {})
                                    }}
                                    value={interest || ""}
                                    onChange={(e) => updateInterest(idx, e.target.value)}
                                    placeholder="e.g. Photography, Travelling, Coding"
                                />
                            </div>
                            {errors[idx] && <p className="input-error-text" style={{ marginTop: '6px', color: '#ef4444', fontSize: '12px', fontWeight: 600 }}>{errors[idx]}</p>}
                        </div>
                        {interests.length > 1 && (
                            <button
                                onClick={() => removeInterest(idx)}
                                style={{
                                    padding: '10px',
                                    color: '#ef4444',
                                    background: '#fef2f2',
                                    border: 'none',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    flexShrink: 0
                                }}
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <button
                onClick={addInterest}
                style={{
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#635bff',
                    fontWeight: 700,
                    fontSize: '14px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: isMobile ? '8px 16px' : '8px 0'
                }}
            >
                <Plus size={18} /> Add one more
            </button>

            {/* Footer */}
            <div className="form-footer" style={{
                marginTop: isMobile ? '30px' : '50px',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'flex-end',
                gap: '12px',
                padding: isMobile ? '0 16px 100px' : '0'
            }}>
                {isQuickEdit && (
                    <button className="btn-next outlined" onClick={onReturnToDashboard} style={{ width: isMobile ? '100%' : 'auto' }}>Back to Dashboard</button>
                )}
                <button className="btn-next primary" onClick={handleNext} style={{ width: isMobile ? '100%' : 'auto', minWidth: isMobile ? '0' : '200px' }}>
                    {isQuickEdit ? 'Save & Return' : 'Next'}
                </button>
            </div>
        </div>
    );
}