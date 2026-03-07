import React from 'react';

const SectionRenderer = ({ sectionId, data, isMeasurement, templateConfig, contentOverride, subItemRanges, isContinuation, hasHeader }) => {
    const sectionData = data[sectionId];

    // Safety check
    if (!sectionData) return null;

    // Helper: Style extraction
    const regionName = Object.keys(templateConfig.layout).find(r => templateConfig.layout[r].includes(sectionId)) || 'main';
    const regionStyles = templateConfig.regions[regionName]?.styles || {};
    const globalStyles = templateConfig.styles || {};

    const baseTextStyle = {
        fontSize: '14px',
        lineHeight: '1.5',
        color: regionStyles.color || '#333',
        marginBottom: '8px',
        fontFamily: globalStyles.fontFamily
    };

    const titleStyle = {
        fontWeight: 'bold',
        fontSize: '16px',
        color: regionStyles.headingColor || '#000',
        marginBottom: '4px'
    };

    const subTitleStyle = {
        fontSize: '14px',
        fontStyle: 'italic',
        color: regionStyles.subHeadingColor || '#555',
        marginBottom: '4px'
    };

    // --- RENDER LOGIC ---

    // 1. HEADER (Only if hasHeader is true)
    const renderHeader = () => {
        if (!hasHeader) return null;
        const titleText = isContinuation ? `${sectionId} (Continued)` : sectionId;
        return (
            <div style={{
                fontSize: '18px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                borderBottom: `2px solid ${regionStyles.borderColor || '#ccc'}`,
                marginBottom: '10px',
                paddingBottom: '5px',
                color: regionStyles.headingColor || '#333'
            }}>
                {titleText}
            </div>
        );
    };

    // 2. LIST SECTION (Experience, Education, Projects)
    if (Array.isArray(sectionData)) {
        // Determine which items to render
        // If contentOverride is present (from pagination), use those indices
        const itemsToRender = contentOverride || sectionData.map((_, i) => i);

        return (
            <div className={`section-${sectionId}`}>
                {renderHeader()}
                {itemsToRender.map((itemIdx) => {
                    const item = sectionData[itemIdx];
                    // Measurement IDs
                    const itemId = isMeasurement ? `measure-item-${sectionId}-${itemIdx}` : undefined;

                    // Styles
                    const itemStyle = {
                        marginBottom: '15px',
                        breakInside: 'avoid' // Hint to browser but we handle it manually
                    };

                    // Sub-item handling (bullets)
                    const bullets = item.bullets || item.description ? [item.description, ...(item.bullets || [])].filter(Boolean) : [];

                    // Pagination Splitting for Sub-items
                    let bulletsToRender = bullets;
                    let bulletStartIndex = 0;

                    if (subItemRanges && subItemRanges[itemIdx]) {
                        const range = subItemRanges[itemIdx];
                        bulletsToRender = bullets.slice(range.start, range.end + 1);
                        bulletStartIndex = range.start;
                    }

                    return (
                        <div key={itemIdx} id={itemId} style={itemStyle}>
                            <div style={titleStyle}>{item.title || item.role || item.degree || item.name}</div>
                            <div style={subTitleStyle}>
                                {item.company || item.school || item.institution || item.organization}
                                {item.date || item.duration || item.year ? ` | ${item.date || item.duration || item.year}` : ''}
                            </div>

                            {bulletsToRender.length > 0 && (
                                <ul style={{ paddingLeft: '20px', margin: '5px 0' }}>
                                    {bulletsToRender.map((bullet, relativeIdx) => {
                                        const actualIdx = bulletStartIndex + relativeIdx;
                                        const bulletId = isMeasurement ? `measure-subitem-${sectionId}-${itemIdx}-${actualIdx}` : undefined;

                                        return (
                                            <li key={actualIdx} id={bulletId} style={baseTextStyle}>
                                                {bullet}
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    }

    // 3. TEXT SECTION (Summary)
    if (sectionId === 'summary' || typeof sectionData === 'string') {
        const text = typeof sectionData === 'string' ? sectionData : (sectionData.summary || sectionData.content);
        // Naive breakdown into paragraphs by newline, or just one block if no newlines
        // Ideally we should process the text to be array of paragraphs if we want granular splitting
        // For now, let's treat it as a single block or simple split
        const content = text || "";

        // If we want to support splitting summary, we need to treat it as sentences or paragraphs
        // Let's assume content is just a string for now.
        // Pagination logic for text was complex in hook (generic text). 
        // We'll simplify: just render the block. 
        // If we implement paragraph splitting, we'd need to parse `content` into <p> tags with IDs.

        const paragraphId = isMeasurement ? `measure-paragraph-${sectionId}-0` : undefined;

        return (
            <div className={`section-${sectionId}`} style={{ marginBottom: '20px' }}>
                {renderHeader()}
                <p id={paragraphId} style={baseTextStyle}>
                    {content}
                </p>
            </div>
        );
    }

    // 4. PERSONAL / CUSTOM (Special handling)
    if (sectionId === 'personal') {
        return (
            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 5px 0' }}>{sectionData.name}</h1>
                <div style={{ fontSize: '16px', color: '#666' }}>{sectionData.role || sectionData.profession}</div>
                <div style={{ fontSize: '12px', marginTop: '5px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <span>{sectionData.email}</span>
                    <span>{sectionData.phone}</span>
                    <span>{sectionData.location || sectionData.city}</span>
                </div>
            </div>
        );
    }

    return null;
};

export default SectionRenderer;
