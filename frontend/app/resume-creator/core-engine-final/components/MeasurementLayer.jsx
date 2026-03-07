import React from 'react';
import SectionRegistry from '../SectionRegistry';

const MeasurementLayer = ({ containerRef, data, layoutState, templateConfig = {} }) => {
    const regions = templateConfig.regions || {};
    const containerStyles = templateConfig.containerStyles || { display: 'flex', flexDirection: 'row' };

    return (
        <div
            ref={containerRef}
            className="measurement-layer"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '210mm', // A4 Width
                boxSizing: 'border-box',
                padding: templateConfig.padding || '40px',
                visibility: 'hidden',
                zIndex: -1000,
                pointerEvents: 'none',
                // Theme variables should be passed via container or inherited
                ...templateConfig.rootStyles
            }}
        >
            {/* Continuation Header Measurer */}
            <div className="continuation-header-measurer" style={{ position: 'absolute', visibility: 'hidden' }}>
                <div className="section-header-continuation" style={{ fontStyle: 'italic', fontSize: '14px', color: '#888', marginBottom: '10px' }}>
                    CONTINUED SECTION (Continued)
                </div>
            </div>

            <div style={containerStyles}>
                {Object.keys(layoutState).map(regionId => {
                    const regionConfig = regions[regionId] || {};
                    return (
                        <div
                            key={regionId}
                            style={{
                                width: regionConfig.width || '100%',
                                ...regionConfig.styles
                            }}
                        >
                            {layoutState[regionId].map(sectionId => {
                                const Component = SectionRegistry[sectionId];
                                return (
                                    <div key={sectionId} className="measure-section">
                                        <div id={`header-${regionId}-${sectionId}`} className="section-header" style={{ fontWeight: 'bold', fontSize: '18px', borderBottom: '2px solid #333', marginBottom: '10px', marginTop: '10px' }}>
                                            {sectionId.toUpperCase()}
                                        </div>
                                        <div id={`content-${regionId}-${sectionId}`}>
                                            {Component && (
                                                <Component
                                                    items={Array.isArray(data[sectionId]) ? data[sectionId] : []}
                                                    content={typeof data[sectionId] === 'string' ? data[sectionId] : ''}
                                                    sectionId={sectionId}
                                                />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MeasurementLayer;
