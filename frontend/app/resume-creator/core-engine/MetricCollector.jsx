import React, { useLayoutEffect, useRef } from 'react';
import SectionRenderer from '../templates/common/SectionRenderer';
import { createRoot } from 'react-dom/client';

/**
 * MetricCollector
 * 
 * Renders the entire resume content into an invisible container to measure 
 * the exact pixel height of every section and item.
 * 
 * @param {Object} props
 * @param {Object} props.data - The resume data
 * @param {Object} props.config - Template configuration (fonts, spacing, etc.)
 * @param {Function} props.onMetricsReady - Callback with the measured metrics
 * @param {string} props.width - Width of the column to measure (e.g. "210mm")
 */
const MetricCollector = ({ data, config, onMetricsReady, width = "210mm" }) => {
    const containerRef = useRef(null);

    // Render all possible sections
    const allSections = [
        'summary', 'experience', 'education', 'skills', 'projects', 'languages',
        'certifications', 'interests', 'websites', 'software', 'affiliations',
        'strengths', 'additionalSkills', 'keyAchievements', 'accomplishments',
        'additionalInfo', 'custom'
    ];

    useLayoutEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;

        // Helper: Convert "14px" to 14
        const parsePx = (val) => parseFloat(val) || 0;

        const measure = () => {
            const metrics = {};

            allSections.forEach(sectionId => {
                const sectionEl = container.querySelector(`[data-section-id="${sectionId}"]`);
                if (!sectionEl) return;

                // 1. Total Height of the Section Wrapper
                const totalHeight = sectionEl.offsetHeight;
                const computedStyle = window.getComputedStyle(sectionEl);
                const sectionMarginBottom = parsePx(computedStyle.marginBottom);
                const sectionMarginTop = parsePx(computedStyle.marginTop);

                // 2. Find Items and Group by Visual Row
                const itemElements = Array.from(sectionEl.querySelectorAll('[data-item-index]'));
                const rawItems = itemElements.map(el => {
                    const style = window.getComputedStyle(el);
                    const itemIndex = parseInt(el.getAttribute('data-item-index'));

                    // Measure Sub-Items (Bullets)
                    const subItemElements = Array.from(el.querySelectorAll('[data-sub-item-index]'));
                    const subItems = subItemElements.map(subEl => ({
                        index: parseInt(subEl.getAttribute('data-sub-item-index')),
                        height: subEl.offsetHeight,
                        offsetTop: subEl.offsetTop, // Relative to the item container
                        marginBottom: parsePx(window.getComputedStyle(subEl).marginBottom),
                        marginTop: parsePx(window.getComputedStyle(subEl).marginTop)
                    }));

                    return {
                        index: itemIndex,
                        height: el.offsetHeight,
                        offsetTop: el.offsetTop,
                        marginBottom: parsePx(style.marginBottom),
                        marginTop: parsePx(style.marginTop),
                        subItems // New: Detailed line-by-line metrics
                    };
                });

                // Group Layout Logic (Row Groups)
                const items = [];
                if (rawItems.length > 0) {
                    let currentRow = {
                        indices: [rawItems[0].index],
                        height: rawItems[0].height,
                        offsetTop: rawItems[0].offsetTop,
                        marginBottom: rawItems[0].marginBottom,
                        marginTop: rawItems[0].marginTop,
                        subItems: rawItems[0].subItems, // Sub-items for the first item in row
                        isRowGroup: true
                    };

                    for (let i = 1; i < rawItems.length; i++) {
                        const item = rawItems[i];
                        const isSameRow = Math.abs(item.offsetTop - currentRow.offsetTop) < 10;

                        if (isSameRow) {
                            currentRow.indices.push(item.index);
                            currentRow.height = Math.max(currentRow.height, item.height);
                            currentRow.marginBottom = Math.max(currentRow.marginBottom, item.marginBottom);
                            currentRow.marginTop = Math.max(currentRow.marginTop, item.marginTop);
                            // Merge sub-items? Usually flex rows (Skills) don't have splittable descriptions.
                        } else {
                            items.push(currentRow);
                            currentRow = {
                                indices: [item.index],
                                height: item.height,
                                offsetTop: item.offsetTop,
                                marginBottom: item.marginBottom,
                                marginTop: item.marginTop,
                                subItems: item.subItems,
                                isRowGroup: true
                            };
                        }
                    }
                    items.push(currentRow);
                }

                // 3. Calculate Header Metrics
                // We treat the Header as a "Block" that comes before items.
                let headerHeight = 0;
                let headerMarginTop = 0;
                let headerMarginBottom = 0;
                let type = 'text';

                if (items.length > 0) {
                    type = 'list';
                    // The space before the first item corresponds to the Header area.
                    // However, using offsetTop is tricky if we want exact block dimensions.
                    // Better to find the Title element explicitly.
                    const titleEl = sectionEl.querySelector('.template-section-title');
                    if (titleEl) {
                        const style = window.getComputedStyle(titleEl);
                        headerHeight = titleEl.offsetHeight;
                        headerMarginTop = parsePx(style.marginTop);
                        headerMarginBottom = parsePx(style.marginBottom);
                    } else {
                        // Fallback: Use offset of first item as roughly the header area
                        // But this includes the margin collapse result. 
                        // Let's assume header is roughly just the top gap.
                        headerHeight = items[0].offsetTop;
                        // If we use offsetTop, it effectively "bakes in" the collapse.
                        // To allow our allocator to redo the collapse, we need raw values.
                        // But without a title element, we can't get raw values.
                        // We'll stick to 0 margins and baked height for this edge case.
                    }
                } else {
                    // Text section (Summary, etc.)
                    headerHeight = totalHeight; // Default to full height
                    const titleEl = sectionEl.querySelector('.template-section-title');
                    if (titleEl) {
                        const style = window.getComputedStyle(titleEl);
                        headerHeight = titleEl.offsetHeight; // Raw
                        headerMarginTop = parsePx(style.marginTop);
                        headerMarginBottom = parsePx(style.marginBottom);

                        // Remainder (Content)
                        // Content starts where? 
                        // To facilitate splitting "Text" sections later (future proof), we could measure the rich text div.
                        // For now, we still treat Text sections as atomic blocks (Header + Content together).
                        // So we just use totalHeight for the whole block? 
                        // No, we want to split Header from Content if possible (e.g. Header on P1, Content on P2).
                        // But for 'text' type sections, we usually don't support continuation yet (as per prev conversation).
                        // So let's keep it simple: Text Sections are ONE block.
                        headerHeight = totalHeight;
                        headerMarginTop = sectionMarginTop; // Approximate
                        headerMarginBottom = sectionMarginBottom;
                    }
                }

                metrics[sectionId] = {
                    id: sectionId,
                    totalHeight,
                    sectionMarginBottom,
                    sectionMarginTop,
                    headerHeight, // Raw height
                    headerMarginTop,
                    headerMarginBottom,
                    items,
                    type
                };
            });

            // Send metrics up
            onMetricsReady(metrics);
        };

        // Initial measurement
        measure();

        // Observe resizing (e.g. Font Loads, Dragging causing layout shifts)
        const observer = new ResizeObserver(() => {
            // Debounce slightly if needed, but for now direct call
            measure();
        });

        // Observe all children (sections)
        allSections.forEach(sectionId => {
            const sectionEl = container.querySelector(`[data-section-id="${sectionId}"]`);
            if (sectionEl) observer.observe(sectionEl);
        });

        return () => observer.disconnect();

    }, [data, config]);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                visibility: 'hidden',
                pointerEvents: 'none',
                zIndex: -9999,
                width: width,
                // Apply theme variables to match the real render
                '--theme-color': config?.themeColor || '#3b82f6',
                '--theme-font-scale': config?.designSettings?.fontSize || 1,
                '--theme-section-margin': config?.designSettings?.sectionSpacing || 1,
                '--theme-paragraph-margin': config?.designSettings?.paragraphSpacing || 1,
                '--theme-line-height': config?.designSettings?.lineHeight || 1.5,
                // Add other variables as needed (copied from ResumeRenderer)
                ...config?.themeStyles,
                // CRITICAL: Match the real page's padding to ensure text wrapping is identical
                padding: '40px',
                boxSizing: 'border-box'
            }}
            className="metric-collector-sandbox"
        >
            {/* Render all sections linearly to measure them */}
            {allSections.map(sid => (
                <div key={sid} data-section-wrapper={sid}>
                    <SectionRenderer
                        sectionId={sid}
                        data={data}
                        isSpellCheckActive={false}
                    // We pass no itemIndices to render ALL items
                    />
                </div>
            ))}
        </div>
    );
};

export default MetricCollector;
