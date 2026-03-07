import React, { useState } from "react";
import { ArrowLeft, Trash2, Plus, Info } from "lucide-react";
import "./form.css";
// import "./education.css"; // Reuse general workspace styles from form.css instead of education specific

import CompatibilityWarning from "./CompatibilityWarning";

export default function Websites({ data, setData, onBack, onNext, isQuickEdit, onReturnToDashboard, isFieldSupported, currentTemplateName, isMobile }) {
    // Initialize with existing data or one empty field
    const [links, setLinks] = useState(data.websites && data.websites.length > 0 ? data.websites : [{ label: '', url: '', addToHeader: false }]);
    const [errors, setErrors] = useState({});

    const updateLink = (index, field, value) => {
        if (errors[index]) setErrors(prev => ({ ...prev, [index]: null }));
        const newLinks = [...links];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setLinks(newLinks);
        // Sync with global data
        setData(prev => ({ ...prev, websites: newLinks }));
    };

    const addLink = () => {
        const newLinks = [...links, { label: '', url: '', addToHeader: false }];
        setLinks(newLinks);
        setData(prev => ({ ...prev, websites: newLinks }));
    };

    const removeLink = (index) => {
        const newLinks = links.filter((_, i) => i !== index);
        setLinks(newLinks);
        setData(prev => ({ ...prev, websites: newLinks }));
    };

    const handleNext = () => {
        let newErrors = {};
        const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

        links.forEach((link, index) => {
            if (!link.url?.trim()) {
                newErrors[index] = "URL is required.";
            } else if (!urlRegex.test(link.url)) {
                newErrors[index] = "Invalid URL format.";
            }

            if (!link.label?.trim()) {
                newErrors[index] = newErrors[index] ? newErrors[index] + " Label is also required." : "Label is required.";
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
            {/* Header Section */}
            <div className={`ai-header ${isMobile ? 'mobile-mode' : ''}`} style={{ marginBottom: isMobile ? '24px' : '40px', padding: isMobile ? '0 16px' : '0' }}>
                <button className="back-link" onClick={onBack} style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '13px', fontWeight: 500 }}>
                    <ArrowLeft size={14} /> Back to Sections
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <h1 className="form-title" style={{ fontSize: isMobile ? '24px' : '28px', margin: 0 }}>Websites & Portfolios</h1>
                    <CompatibilityWarning isSupported={isFieldSupported('websites')} templateName={currentTemplateName} />
                </div>

                {/* Pro Tip - Minimal Style */}
                <div style={{ background: '#f8fafc', padding: isMobile ? '12px' : '16px', borderRadius: '12px', display: 'flex', gap: '12px', marginTop: '20px', border: '1px solid #eef2ff' }}>
                    <Info size={18} color="#635bff" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                        <span style={{ fontWeight: 700, fontSize: '12px', color: '#1e293b', display: 'block', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pro Tip</span>
                        <p style={{ fontSize: isMobile ? '13px' : '14px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
                            We recommend adding social networks like LinkedIn to your header to help employers find you.
                        </p>
                    </div>
                </div>
            </div>

            {/* Websites List */}
            <div className="websites-list" style={{ padding: isMobile ? '0 16px' : '0' }}>
                {links.map((link, idx) => (
                    <div key={idx} style={{ marginBottom: '24px', background: '#fff', padding: isMobile ? '16px' : '20px', borderRadius: '16px', border: '1px solid #f1f5f9', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', margin: 0, letterSpacing: '0.05em' }}>Link #{idx + 1}</h3>
                            {links.length > 1 && (
                                <button onClick={() => removeLink(idx)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600 }}>
                                    <Trash2 size={14} /> Remove
                                </button>
                            )}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '16px' : '20px' }}>
                            <div className="zety-input-wrap" style={{ marginBottom: '0' }}>
                                <label className="zety-label">Label <span style={{ color: '#ef4444' }}>*</span></label>
                                <div className="input-container">
                                    <input
                                        className="zety-input-field"
                                        style={errors[idx]?.includes("Label") ? { borderColor: '#ef4444', background: '#fef2f2' } : {}}
                                        value={link.label || ''}
                                        onChange={(e) => updateLink(idx, 'label', e.target.value)}
                                        placeholder="e.g. Portfolio, GitHub, Blog"
                                    />
                                </div>
                            </div>

                            <div className="zety-input-wrap" style={{ marginBottom: '0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <label className="zety-label">URL <span style={{ color: '#ef4444' }}>*</span></label>
                                </div>
                                <div className="input-container">
                                    <input
                                        className="zety-input-field"
                                        style={errors[idx]?.includes("URL") ? { borderColor: '#ef4444', background: '#fef2f2' } : {}}
                                        value={link.url || ''}
                                        onChange={(e) => updateLink(idx, 'url', e.target.value)}
                                        placeholder="e.g. linkedin.com/in/username"
                                    />
                                </div>
                            </div>
                        </div>

                        {errors[idx] && <p className="input-error-text" style={{ marginTop: '12px', color: '#ef4444', fontSize: '12px', fontWeight: 500 }}>{errors[idx]}</p>}

                        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-start' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}>
                                <input
                                    type="checkbox"
                                    checked={link.addToHeader}
                                    onChange={(e) => updateLink(idx, 'addToHeader', e.target.checked)}
                                    style={{ accentColor: '#635bff', cursor: 'pointer', width: '18px', height: '18px' }}
                                />
                                <span style={{ fontSize: '13px', color: '#475569', fontWeight: 500 }}>Show in resume header</span>
                            </label>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ padding: isMobile ? '0 16px' : '0' }}>
                <button
                    onClick={addLink}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        color: '#635bff', fontWeight: 600, fontSize: '13px',
                        background: '#f8faff', border: '1.5px dashed #635bff', borderRadius: '12px',
                        cursor: 'pointer', padding: '14px', width: '100%', justifyContent: 'center',
                        marginTop: '8px', transition: 'all 0.2s'
                    }}
                >
                    <Plus size={18} /> Add another link or profile
                </button>
            </div>

            <div className="form-footer" style={{
                marginTop: '50px',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'flex-end',
                gap: '12px',
                padding: isMobile ? '16px' : '0'
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
