import React from 'react';
import SectionRenderer from './SectionRenderer';

const MeasurementLayer = ({ containerRef, data, layoutState, templateConfig, pageSize }) => {
    // Hidden style
    const hiddenStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        visibility: 'hidden',
        zIndex: -1000,
        // Ensure width matches the target page width exactly
        width: pageSize === 'LETTER' ? '215.9mm' : '210mm',
        display: 'flex',
        flexDirection: 'row',
        pointerEvents: 'none',
        // Critical: Match font styles of the actual page
        fontFamily: templateConfig.styles?.fontFamily || "'Inter', sans-serif",
        fontSize: '14px',
        lineHeight: '1.5',
        color: '#333'
    };

    const regionNames = Object.keys(layoutState);

    return (
        <div ref={containerRef} style={hiddenStyle}>
            {regionNames.map(regionName => {
                const regionConfig = templateConfig.regions[regionName] || {};
                const width = regionConfig.width || '100%';
                const sectionIds = layoutState[regionName] || [];

                return (
                    <div key={regionName} style={{ width, padding: regionConfig.styles?.padding || '20px', boxSizing: 'border-box' }}>
                        {sectionIds.map(sectionId => (
                            <div key={sectionId} style={{ marginBottom: '0' }}>
                                {/* Header */}
                                <div id={`measure-header-${sectionId}`} style={{ marginBottom: '10px' }}>
                                    <h3 style={{
                                        fontSize: '1.2rem',
                                        fontWeight: 'bold',
                                        borderBottom: '2px solid #ccc',
                                        paddingBottom: '5px',
                                        marginBottom: '10px',
                                        color: regionName === 'sidebar' ? '#fff' : '#333'
                                    }}>
                                        {sectionId.toUpperCase()}
                                    </h3>
                                </div>

                                {/* Continuation Header (for measurement) */}
                                <div id={`measure-cont-header-${sectionId}`} style={{
                                    marginBottom: '10px',
                                    fontSize: '0.9rem',
                                    fontWeight: 'bold',
                                    color: '#666',
                                    fontStyle: 'italic'
                                }}>
                                    {sectionId.toUpperCase()} (Continued)
                                </div>

                                {/* Content */}
                                <div id={`measure-content-${sectionId}`}>
                                    <SectionRenderer
                                        sectionId={sectionId}
                                        data={data}
                                        isMeasurement={true}
                                        templateConfig={templateConfig}
                                    />
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
