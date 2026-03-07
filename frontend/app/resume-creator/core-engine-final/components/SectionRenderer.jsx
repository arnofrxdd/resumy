import React from 'react';
import SectionRegistry from '../SectionRegistry';

const SectionRenderer = ({ sectionId, data, pageItem, variants = {} }) => {
    const Component = SectionRegistry[sectionId];
    if (!Component) return null;

    const fullItems = Array.isArray(data[sectionId]) ? data[sectionId] : [];
    const fullContent = typeof data[sectionId] === 'string' ? data[sectionId] : '';

    // If partial, filter based on indices and ranges
    let displayItems = fullItems;
    let displayContent = fullContent;

    if (pageItem.type === 'PARTIAL' && pageItem.visibleIndices) {
        displayItems = pageItem.visibleIndices.map(idx => {
            const item = { ...fullItems[idx] };
            if (!item.description) return item;

            // If there's a nested range, we need to surgically slice the HTML/bullets
            if (pageItem.nestedRange && pageItem.nestedRange.start !== undefined) {
                const bulletMatches = item.description.match(/<li[^>]*>([\s\S]*?)<\/li>/gi) || [];
                const slicedBullets = bulletMatches.slice(pageItem.nestedRange.start, pageItem.nestedRange.end + 1);
                const wrapper = item.description.includes('<ol') ? 'ol' : 'ul';
                item.description = `<${wrapper}>${slicedBullets.join('')}</${wrapper}>`;
            }
            return item;
        });
        displayContent = "";
    }

    return (
        <div className={`paginated-section ${pageItem.isContinuation ? 'is-continuation' : ''}`} style={{ width: '100%' }}>
            {pageItem.hasHeader && (
                <div className="section-header" style={{
                    fontWeight: 'bold',
                    fontSize: 'var(--section-header-size, 18px)',
                    borderBottom: 'var(--section-header-border, 2px solid #333)',
                    color: 'var(--section-header-color, inherit)',
                    marginBottom: '10px',
                    marginTop: '10px'
                }}>
                    {sectionId.toUpperCase()}
                </div>
            )}
            {!pageItem.hasHeader && pageItem.isContinuation && (
                <div className="section-header-continuation" style={{
                    fontStyle: 'italic',
                    fontSize: 'var(--continuation-text-size, 14px)',
                    color: 'var(--continuation-text-color, #888)',
                    marginBottom: '10px'
                }}>
                    {sectionId.toUpperCase()} (Continued)
                </div>
            )}
            <Component
                items={displayItems}
                content={displayContent}
                isContinuation={pageItem.isContinuation}
                sectionId={sectionId}
                variant={variants[sectionId]}
            />
        </div>
    );
};

export default SectionRenderer;
