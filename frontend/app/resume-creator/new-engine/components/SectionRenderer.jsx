import React from 'react';
import SectionContinuationHeader from './SectionContinuationHeader';

// Sub-renderers w/ granular IDs for surgical splitting
const SummaryRenderer = ({ data, styles, subItemRange, isContinuation }) => {
    // If we have a range, we split by paragraphs/newlines
    const blocks = data.split(/<\/p>|<br\s*\/?>|\n/).filter(b => b.trim().length > 0);

    return (
        <div style={{ marginBottom: '10px' }}>
            {isContinuation ? (
                <SectionContinuationHeader sectionId="summary" styles={styles} />
            ) : (
                <h3 style={styles.header}>Summary</h3>
            )}
            <div style={styles.text}>
                {blocks.map((block, i) => {
                    if (subItemRange && (i < subItemRange.start || i > subItemRange.end)) return null;
                    return (
                        <div key={i} id={`section-summary-item-${i}`} dangerouslySetInnerHTML={{ __html: block }} />
                    );
                })}
            </div>
        </div>
    );
};

const ExperienceItem = ({ item, styles, subItemRange, itemIndex, sectionId }) => {
    // SSR safe parsing of bullet points
    const description = item.description || '';
    const bullets = description.includes('<li>')
        ? description.split(/<\/li>|<li>/).map(b => b.replace(/<[^>]*>?/gm, '').trim()).filter(b => b.length > 0)
        : description.split(/\. |\n/).filter(b => b.trim().length > 0);

    const hasBullets = bullets.length > 0;

    return (
        <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: styles.text.fontSize || '0.9rem' }}>
                <span>{item.title}</span>
                <span>{item.startYear} - {item.endYear || 'Present'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontStyle: 'italic', fontSize: '0.85rem', marginBottom: '4px', opacity: 0.8 }}>
                <span>{item.company}</span>
                <span>{item.location}</span>
            </div>
            <div style={styles.text}>
                {hasBullets ? (
                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                        {bullets.map((bullet, i) => {
                            if (subItemRange && (i < subItemRange.start || i > subItemRange.end)) return null;
                            return (
                                <li
                                    key={i}
                                    id={`section-${sectionId}-item-${itemIndex}-subitem-${i}`}
                                >
                                    {bullet}
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div dangerouslySetInnerHTML={{ __html: item.description }} />
                )}
            </div>
        </div>
    );
};

const ProjectItem = ({ item, styles, subItemRange, itemIndex, sectionId }) => {
    const description = item.description || '';
    const blocks = description.includes('<li>')
        ? description.split(/<\/li>|<li>/).map(b => b.replace(/<[^>]*>?/gm, '').trim()).filter(b => b.length > 0)
        : description.split(/\. |\n/).filter(b => b.trim().length > 0);

    return (
        <div style={{ marginBottom: '10px' }}>
            <div style={{ fontWeight: 'bold', fontSize: styles.text.fontSize }}>{item.title}</div>
            {item.link && <div style={{ fontSize: '0.8rem', color: '#3b82f6' }}>{item.link}</div>}
            <div style={{ ...styles.text, marginTop: '4px' }}>
                {blocks.map((block, i) => {
                    if (subItemRange && (i < subItemRange.start || i > subItemRange.end)) return null;
                    const cleanBlock = block.replace(/<[^>]*>?/gm, '').trim();
                    if (!cleanBlock) return null;

                    return (
                        <div
                            key={i}
                            id={`section-${sectionId}-item-${itemIndex}-subitem-${i}`}
                            style={{ marginBottom: '2px' }}
                        >
                            {cleanBlock}{cleanBlock.endsWith('.') ? '' : '.'}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const SectionRenderer = ({ sectionId, data, contentOverride, subItemRanges = {}, isContinuation = false, hasHeader = true, config = {} }) => {
    const sectionData = data[sectionId];
    if (!sectionData) return null;

    // Extract Theme Styles
    const themeStyles = config.templateStyles || {
        header: { borderBottom: '1px solid #333', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '10px' },
        text: { fontSize: '0.9rem' }
    };

    let itemsToRender = sectionData;
    if (Array.isArray(contentOverride)) {
        itemsToRender = contentOverride.map(idx => sectionData[idx]);
    }

    const renderHeader = () => {
        if (!hasHeader) return null;
        if (isContinuation) {
            return <SectionContinuationHeader sectionId={sectionId} styles={themeStyles} />;
        }
        return <h3 style={themeStyles.header}>{sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}</h3>;
    };

    if (sectionId === 'summary') {
        const subItemRange = subItemRanges['summary'] || null;
        return (
            <div id={`section-${sectionId}-content`}>
                <SummaryRenderer data={sectionData} styles={themeStyles} subItemRange={subItemRange} isContinuation={isContinuation && hasHeader} />
            </div>
        );
    }

    if (sectionId === 'personal') {
        return (
            <div style={{
                marginBottom: '20px',
                textAlign: themeStyles.header.textAlign || 'left',
                color: themeStyles.header.color || 'inherit'
            }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, lineHeight: 1.1 }}>{sectionData.name}</h1>
                <div style={{ fontSize: '1.3rem', opacity: 0.9, marginBottom: '8px', color: 'var(--theme-color)' }}>{sectionData.profession}</div>
                <div style={{ fontSize: '0.95rem', opacity: 0.8 }}>
                    {sectionData.email} • {sectionData.phone} • {sectionData.city}
                    {sectionData.websites && sectionData.websites.length > 0 && (
                        <span> • {sectionData.websites.map(w => w.url).join(' • ')}</span>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div id={`section-${sectionId}-content`} className={`section-${sectionId}`} style={{ display: 'flow-root' }}>
            {renderHeader()}

            {Array.isArray(itemsToRender) ? (
                itemsToRender.map((item, idx) => {
                    const originalIdx = Array.isArray(contentOverride) ? contentOverride[idx] : idx;
                    const subItemRange = subItemRanges[originalIdx] || null;

                    if (sectionId === 'experience') {
                        return (
                            <div key={originalIdx} id={`section-${sectionId}-item-${originalIdx}`} style={{ display: 'flow-root' }}>
                                <ExperienceItem item={item} styles={themeStyles} subItemRange={subItemRange} itemIndex={originalIdx} sectionId={sectionId} />
                            </div>
                        );
                    }
                    if (sectionId === 'projects') {
                        return (
                            <div key={originalIdx} id={`section-${sectionId}-item-${originalIdx}`} style={{ display: 'flow-root' }}>
                                <ProjectItem item={item} styles={themeStyles} subItemRange={subItemRange} itemIndex={originalIdx} sectionId={sectionId} />
                            </div>
                        );
                    }
                    if (sectionId === 'education') {
                        return (
                            <div key={originalIdx} id={`section-${sectionId}-item-${originalIdx}`} style={{ marginBottom: '10px', display: 'flow-root' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                    <span>{item.school}</span>
                                    <span>{item.startYear} - {item.endYear}</span>
                                </div>
                                <div style={{ fontStyle: 'italic', fontSize: '0.85rem' }}>{item.degree}</div>
                            </div>
                        );
                    }

                    // Generic List
                    return (
                        <div key={originalIdx} id={`section-${sectionId}-item-${originalIdx}`} style={{ marginBottom: '5px', display: 'flow-root' }}>
                            <div style={themeStyles.text}>• {item.name || item.title || (typeof item === 'string' ? item : JSON.stringify(item))}</div>
                        </div>
                    );
                })
            ) : (
                <div style={themeStyles.text}>{JSON.stringify(sectionData)}</div>
            )}
        </div>
    );
};

export default SectionRenderer;
