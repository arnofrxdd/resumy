import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Editor, EditorProvider, Toolbar, BtnBold, BtnItalic, BtnUnderline, BtnBulletList } from 'react-simple-wysiwyg';
import "./form.css";
import CompatibilityWarning from "./CompatibilityWarning";

export default function AdditionalInfo({ data, setData, onBack, onNext, isQuickEdit, onReturnToDashboard, isFieldSupported, currentTemplateName, isMobile }) {

    // 1. Direct Read
    const additionalText = data.additionalInfo || "";
    const [error, setError] = useState(null);

    // 2. Direct Update
    const handleEditorChange = (e) => {
        if (error) setError(null);
        setData(prev => ({
            ...prev,
            additionalInfo: e.target.value
        }));
    };

    const handleNext = () => {
        if (!additionalText?.trim()) {
            setError("Additional information is required.");
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
                    <h1 className="form-title" style={{ fontSize: isMobile ? '24px' : '28px', marginBottom: '4px', lineHeight: 1.2 }}>Additional Information</h1>
                    <CompatibilityWarning isSupported={isFieldSupported('additionalInfo')} templateName={currentTemplateName} />
                </div>
                <p className="form-subtitle" style={{ fontSize: isMobile ? '14px' : '16px', color: '#64748b', marginTop: '4px' }}>Add anything else you want employers to know.</p>
            </div>

            {/* Editor Only View (No Sidebar Needed) */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                padding: isMobile ? '0 16px 100px' : '0'
            }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Details
                </div>
                <div className="studio-ws-editor" style={{ height: '400px', display: 'flex', flexDirection: 'column', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', ...(error ? { borderColor: '#ef4444' } : {}) }}>
                    <div className="studio-editor-canvas" style={{ flex: 1, overflow: 'hidden' }}>
                        <EditorProvider>
                            <Editor
                                value={additionalText}
                                onChange={handleEditorChange}
                                containerProps={{
                                    style: {
                                        height: '100%',
                                        border: 'none',
                                        outline: 'none',
                                        overflowY: 'auto'
                                    },
                                    className: "resume-rich-text"
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
                {error && <p className="input-error-text" style={{ marginTop: '8px', color: '#ef4444', fontSize: '13px', fontWeight: 600 }}>{error}</p>}
            </div>

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
                <button className={`btn-next ${isQuickEdit ? 'primary' : 'primary'}`} onClick={handleNext} style={{ width: isMobile ? '100%' : 'auto', minWidth: isMobile ? '0' : '200px' }}>
                    {isQuickEdit ? 'Save & Return' : 'Next'}
                </button>
            </div>
        </div>
    );
}