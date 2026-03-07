
import React from 'react';
import { AlertCircle } from 'lucide-react';

const CompatibilityWarning = ({ isSupported, templateName }) => {
    console.log(`[CompatibilityWarning] Checking ${templateName}: supported=${isSupported}`);
    // If supported (or support status is unknown/undefined), render nothing
    if (isSupported !== false) return null;

    return (
        <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', marginLeft: '6px' }} className="compatibility-warning-icon">
            <AlertCircle size={14} color="#f59e0b" style={{ cursor: 'help' }} />

            {/* Tooltip (CSS Hover would be ideal, but inline simplicity for now) */}
            <div className="warning-tooltip">
                Not displayed in <strong>{templateName}</strong>
            </div>

            <style jsx>{`
                .compatibility-warning-icon:hover .warning-tooltip {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                }
                .warning-tooltip {
                    position: absolute;
                    bottom: 100%;
                    left: 50%;
                    transform: translateY(5px) translateX(-50%);
                    margin-bottom: 8px;
                    background: #1e293b;
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 11px;
                    white-space: nowrap;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.2s;
                    z-index: 100;
                    pointer-events: none;
                }
                .warning-tooltip::after {
                    content: '';
                    position: absolute;
                    top: 100%;
                    left: 50%;
                    margin-left: -4px;
                    border-width: 4px;
                    border-style: solid;
                    border-color: #1e293b transparent transparent transparent;
                }
            `}</style>
        </div>
    );
};

export default CompatibilityWarning;
