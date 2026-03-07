import React from 'react';

const SectionContinuationHeader = ({ sectionId, styles = {} }) => {
    // Format the title: 'experience' -> 'EXPERIENCE'
    const title = sectionId.toUpperCase();

    const headerStyles = {
        ...styles.header,
        fontSize: '0.75rem',
        opacity: 0.7,
        borderBottom: '1px dashed #ccc',
        marginBottom: '10px',
        paddingBottom: '2px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline'
    };

    return (
        <div style={headerStyles} className="section-continuation-header">
            <span>{title} (CONTINUED)</span>
            <span style={{ fontSize: '0.6rem', fontWeight: 'normal', fontStyle: 'italic' }}>Continued from previous page</span>
        </div>
    );
};

export default SectionContinuationHeader;
