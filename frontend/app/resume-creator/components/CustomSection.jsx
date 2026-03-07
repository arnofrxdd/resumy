import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Editor, EditorProvider, Toolbar, BtnBold, BtnItalic, BtnUnderline, BtnBulletList } from 'react-simple-wysiwyg';
import "./form.css";
import "./education.css"; // Reuse Studio Styles
import "./summary.css";
import CompatibilityWarning from "./CompatibilityWarning";

export default function CustomSection({ data, setData, onBack, onNext, isQuickEdit, onReturnToDashboard, isFieldSupported, currentTemplateName, isMobile }) {

    // 1. Direct Read: Prioritize data.customSection struct, fallback to legacy title
    const title = data.customSection?.title !== undefined ? data.customSection.title : (data.customSectionTitle || "");
    const content = data.customSection?.content || "";

    const isHtmlEmpty = (html) => {
        if (!html) return true;
        // Strip tags and &nbsp; to check if there's actual text
        const stripped = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
        return stripped.length === 0;
    };

    // 2. Direct Updates (Preserving both fields explicitly)
    const [errors, setErrors] = useState({});

    const handleContentChange = (e) => {
        const newContent = e.target.value;
        if (errors.content) setErrors(prev => ({ ...prev, content: null }));

        setData(prev => ({
            ...prev,
            customSection: {
                title: title, // Use the current resolved title instead of defaulting
                content: newContent,
                isVisible: true
            }
        }));
    };

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        if (errors.title) setErrors(prev => ({ ...prev, title: null }));

        setData(prev => ({
            ...prev,
            customSection: {
                title: newTitle,
                content: prev.customSection?.content || "",
                isVisible: true
            },
            customSectionTitle: newTitle
        }));
    };

    const handleNext = () => {
        let newErrors = {};
        const contentEmpty = isHtmlEmpty(content);

        if (!title.trim()) newErrors.title = "Section title is required.";
        if (contentEmpty) newErrors.content = "Section content is required.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            if (isMobile) {
                setTimeout(() => {
                    const firstError = document.querySelector('.input-error-text, .error');
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
        <div className="animate-fade education-container" style={{ padding: isMobile ? '0 16px' : '0' }}>
            <div className="ai-header" style={{ marginBottom: isMobile ? '24px' : '40px' }}>
                <button className="back-link" onClick={onBack} style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '13px', fontWeight: 500 }}>
                    <ArrowLeft size={14} /> Back to Sections
                </button>
                <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'center', gap: '12px', flexDirection: isMobile ? 'column' : 'row' }}>
                    <h1 className="form-title" style={{ fontSize: isMobile ? '24px' : '28px', marginBottom: '4px', lineHeight: 1.2 }}>{title || "Custom Section"}</h1>
                    <CompatibilityWarning isSupported={isFieldSupported('customSection')} templateName={currentTemplateName} />
                </div>
                <div className="form-subtitle" style={{ fontSize: isMobile ? '14px' : '16px', color: '#64748b', marginTop: '4px' }}>Add unique details specific to your career.</div>
            </div>

            <div className="custom-section-content" style={{ padding: isMobile ? '0 16px' : '0' }}>
                {/* Section Title Input Card */}
                <div style={{
                    background: 'white',
                    padding: isMobile ? '20px' : '24px',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    marginBottom: '24px',
                }}>
                    <label style={{ fontWeight: 800, fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>
                        Section Title <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                        className="zety-input"
                        value={title}
                        onChange={handleTitleChange}
                        placeholder="e.g. Voluntary Work, Publications"
                        style={{
                            padding: '12px 0',
                            fontSize: isMobile ? '18px' : '20px',
                            fontWeight: 700,
                            border: 'none',
                            borderBottom: '2px solid #e2e8f0',
                            width: '100%',
                            background: 'transparent',
                            outline: 'none',
                            ...(errors.title ? { borderBottomColor: '#ef4444' } : {})
                        }}
                    />
                    {errors.title && <p style={{ color: '#ef4444', fontSize: '12px', fontWeight: 600, marginTop: '8px' }}>{errors.title}</p>}
                </div>

                {/* Editor Workstation */}
                <div className="studio-workstation" style={{ marginBottom: isMobile ? '100px' : '0' }}>
                    <div className="studio-ws-editor" style={{ height: '440px', display: 'flex', flexDirection: 'column', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
                        <div className="studio-ws-editor-header" style={{ padding: '16px 24px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                            <label style={{ fontWeight: 800, fontSize: '12px', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                                CONTENT <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                        </div>

                        <div className="studio-editor-canvas" style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                            <EditorProvider>
                                <Editor
                                    value={content}
                                    onChange={handleContentChange}
                                    containerProps={{
                                        style: {
                                            height: '100%',
                                            border: 'none',
                                            outline: 'none',
                                            padding: '0'
                                        },
                                        className: "resume-rich-text"
                                    }}
                                >
                                    <Toolbar>
                                        <BtnBold /><BtnItalic /><BtnUnderline /><BtnBulletList />
                                    </Toolbar>
                                </Editor>
                            </EditorProvider>
                        </div>
                        {errors.content && <div style={{ padding: '12px 24px', background: '#fef2f2' }}><p style={{ color: '#ef4444', fontSize: '12px', fontWeight: 600, margin: 0 }}>{errors.content}</p></div>}
                    </div>
                </div>
            </div>

            <div className="form-footer" style={{
                marginTop: isMobile ? '30px' : '50px',
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'flex-end',
                gap: '12px',
                paddingBottom: isMobile ? '100px' : '0'
            }}>
                {isQuickEdit && (
                    <button className="btn-next outlined" onClick={onReturnToDashboard} style={{ width: isMobile ? '100%' : 'auto' }}>Back to Dashboard</button>
                )}
                <button className="btn-next primary" onClick={handleNext} style={{ width: isMobile ? '100%' : 'auto', minWidth: isMobile ? '0' : '200px' }}>
                    {isQuickEdit ? 'Save & Return' : 'Next: Finalize'}
                </button>
            </div>
        </div>
    );
}