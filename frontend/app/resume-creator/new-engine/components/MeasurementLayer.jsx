import React from 'react';
import SectionRenderer from './SectionRenderer';
import SectionContinuationHeader from './SectionContinuationHeader';

// We need to render the sections inside containers that mimic their target region width
const MeasurementLayer = ({ containerRef, data, layoutState, templateConfig, pageSize }) => {
    // Page Dimensions
    const A4_HEIGHT_PX = 1122;
    const LETTER_HEIGHT_PX = 1056;
    const PAGE_HEIGHT = pageSize === 'LETTER' ? LETTER_HEIGHT_PX : A4_HEIGHT_PX;

    // Config Extraction
    const actualConfig = templateConfig?.config || templateConfig || {};
    const regions = actualConfig.regions || {};

    // Support ALL regions in layoutState
    const regionNames = Object.keys(layoutState);

    return (
        <div
            ref={containerRef}
            className="measurement-layer"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                visibility: 'hidden',
                zIndex: -1000,
                width: pageSize === 'LETTER' ? '215.9mm' : '210mm',
                display: 'flex',
                flexDirection: 'row', // Regions are side-by-side in measurement too
                pointerEvents: 'none',
                fontFamily: "Inter, sans-serif", // CRITICAL: Match Page font
                fontSize: '16px',
                lineHeight: '1.5', // Match Template and index.css
                color: '#333'
            }}
        >
            {regionNames.map(regionName => {
                const regionSections = layoutState[regionName] || [];
                const regionConfig = regions[regionName] || {};
                const regionWidth = regionConfig.width || (100 / regionNames.length) + '%';

                // Extract theme styles from config or use defaults matching SectionRenderer
                const themeStyles = templateConfig?.styles || {
                    header: { borderBottom: '1px solid #333', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '10px' },
                    text: { fontSize: '0.9rem' }
                };

                return (
                    <div key={regionName} className={`measure-region-${regionName}`} style={{ width: regionWidth, boxSizing: 'border-box', padding: '0' }}>
                        {regionSections.map(sectionId => (
                            <div key={sectionId} style={{ marginBottom: '10px' }}>
                                {/* Header Measurement Wrapper - NOW USING REAL STYLES */}
                                <div id={`measure-header-${sectionId}`} style={{ display: 'inline-block', width: '100%' }}>
                                    {sectionId === 'personal' ? (
                                        <div style={{
                                            marginBottom: '20px',
                                            textAlign: themeStyles.header?.textAlign || 'left',
                                            color: themeStyles.header?.color || 'inherit'
                                        }}>
                                            <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, lineHeight: 1.1 }}>{data[sectionId]?.name || 'Name'}</h1>
                                            <div style={{ fontSize: '1.3rem', opacity: 0.9, marginBottom: '8px', color: 'var(--theme-color)' }}>{data[sectionId]?.profession || 'Profession'}</div>
                                            <div style={{ fontSize: '0.95rem', opacity: 0.8 }}>
                                                Contact Info Placeholder
                                            </div>
                                        </div>
                                    ) : (
                                        <h3 style={themeStyles.header}>
                                            {sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}
                                        </h3>
                                    )}
                                </div>

                                {/* Content Measurement */}
                                <SectionRenderer
                                    sectionId={sectionId}
                                    data={data}
                                    hasHeader={false} // We measure header above
                                    config={{ ...templateConfig, templateStyles: themeStyles }} // Pass full config
                                />

                                {/* Continuation Header Measurement Mock - NOW RENDERING REAL COMPONENT */}
                                <div id={`measure-cont-header-${sectionId}`} style={{ display: 'block', visibility: 'hidden', height: 'auto', position: 'absolute' }}>
                                    <SectionContinuationHeader sectionId={sectionId} styles={themeStyles} />
                                </div>
                            </div>
                        ))}
                    </div>
                );
            })}
        </div>
    );
};

export default MeasurementLayer;
