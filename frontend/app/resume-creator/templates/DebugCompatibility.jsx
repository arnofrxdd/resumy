import React from 'react';

/**
 * Debug Template for Compatibility Warnings
 * 
 * This template INTENTIONALLY supports NOTHING.
 * It is used to verify that the CompatibilityWarning system correctly
 * identifies EVERY field as unsupported.
 */
export default function DebugCompatibility({ data, font, fontSize }) {
    // INTENTIONALLY accessing nothing from 'data'

    return (
        <div
            id="resume-content"
            style={{
                fontFamily: font || 'Arial',
                fontSize: `${fontSize || 12}pt`,
                padding: '40px',
                color: '#000',
                background: '#fff',
                minHeight: '100%',
                boxSizing: 'border-box',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center'
            }}
        >
            <div style={{ border: '2px dashed red', padding: '40px' }}>
                <h1 style={{ color: 'red', fontSize: '24pt', margin: 0 }}>EMPTY DEBUG TEMPLATE</h1>
                <p style={{ color: '#666', marginTop: '20px' }}>
                    This template accesses <strong>ZERO</strong> fields.
                    <br />
                    You should see compatibility warnings (⚠️) on <strong>EVERY SINGLE FIELD</strong> in the editor.
                </p>
            </div>
        </div>
    );
}
