'use client';
import React, { useState } from 'react';
import ResumeEngine from '../new-engine/ResumeEngine';
import { mockResumeData } from '../new-engine/utils/mockData';
import { TEMPLATE_REGISTRY } from '../new-engine/utils/templates';

const DebugPage = () => {
    // Simplified state: Only Page Size and Debug Mode
    const [pageSize, setPageSize] = useState('A4'); // 'A4' | 'LETTER'
    const [debugMode, setDebugMode] = useState(true);
    const [bottomGap, setBottomGap] = useState(50); // Default 50px

    // Hardcoded to the single clean template
    const selectedTemplateId = 'unified-working-template';
    const currentTemplate = TEMPLATE_REGISTRY[selectedTemplateId];

    return (
        <div className="debug-dashboard" style={{
            display: 'flex',
            height: '100vh',
            width: '100vw',
            background: '#f1f5f9',
            fontFamily: 'Inter, sans-serif'
        }}>
            {/* Simplified Sidebar Controls */}
            <div className="controls-sidebar" style={{
                width: '300px',
                background: 'white',
                borderRight: '1px solid #e2e8f0',
                padding: '30px',
                overflowY: 'auto',
                boxShadow: '4px 0 15px rgba(0,0,0,0.05)'
            }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '30px', color: '#1e293b' }}>Engine 1 Debug</h2>

                <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600', fontSize: '0.9rem', color: '#64748b' }}>PAGE SIZE</label>
                    <select
                        value={pageSize}
                        onChange={(e) => setPageSize(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                    >
                        <option value="A4">A4 (210mm x 297mm)</option>
                        <option value="LETTER">Letter (8.5in x 11in)</option>
                    </select>
                </div>

                <div style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '10px', background: '#f8fafc', borderRadius: '6px' }}>
                        <input
                            type="checkbox"
                            checked={debugMode}
                            onChange={(e) => setDebugMode(e.target.checked)}
                            style={{ width: '18px', height: '18px' }}
                        />
                        <span style={{ fontWeight: '600', fontSize: '0.9rem', color: '#475569' }}>Show Debug Outlines</span>
                    </label>
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', fontSize: '0.9rem', color: '#64748b' }}>BOTTOM SAFETY GAP: {bottomGap}px</label>
                    <input
                        type="range"
                        min="0"
                        max="200"
                        step="5"
                        value={bottomGap}
                        onChange={(e) => setBottomGap(Number(e.target.value))}
                        style={{ width: '100%', cursor: 'pointer' }}
                    />
                </div>

                <div style={{ padding: '20px', background: '#ecfdf5', borderRadius: '8px', border: '1px solid #10b981', color: '#065f46' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: '1.5' }}>
                        <strong>Active Template:</strong> {currentTemplate?.name}<br />
                        <em>(All legacy templates removed for stability)</em>
                    </p>
                </div>
            </div>

            {/* Main Preview Area */}
            <div className="preview-area" style={{
                flex: 1,
                padding: '50px',
                overflow: 'auto',
                display: 'flex',
                justifyContent: 'center',
                background: '#f1f5f9'
            }}>
                <ResumeEngine
                    data={mockResumeData}
                    config={{
                        pageSize,
                        debugMode,
                        bottomGap,
                        templateConfig: currentTemplate
                    }}
                />
            </div>
        </div>
    );
};

export default DebugPage;
