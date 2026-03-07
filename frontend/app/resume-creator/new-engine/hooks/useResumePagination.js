import { useState, useLayoutEffect, useRef } from 'react';

export const useResumePagination = (data, layoutState, config = {}) => {

    // config: { pageSize: 'A4', bottomGap: 50, templateConfig: { ... } }
    const templateConfig = config.templateConfig || {};
    const actualConfig = templateConfig.config || templateConfig; // Unwrap
    const regions = actualConfig.regions || {};

    const bottomGap = config.bottomGap || 0;
    const pageSize = config.pageSize || 'A4';

    const [pages, setPages] = useState([]);
    const [isMeasuring, setIsMeasuring] = useState(true);
    const containerRef = useRef(null);

    // Constants
    const A4_HEIGHT_PX = 1122;
    const LETTER_HEIGHT_PX = 1056;
    const PAGE_HEIGHT = pageSize === 'LETTER' ? LETTER_HEIGHT_PX : A4_HEIGHT_PX;
    const PADDING_TOP = 40;
    const DEFAULT_PADDING_BOTTOM = 40;
    const PADDING_BOTTOM = DEFAULT_PADDING_BOTTOM + bottomGap;
    const CONTENT_HEIGHT = PAGE_HEIGHT - PADDING_TOP - PADDING_BOTTOM;

    useLayoutEffect(() => {
        if (!containerRef.current) return;

        const measure = () => {
            const regionNames = Object.keys(regions); // Use Template Regions as source of truth
            const regionPages = {}; // { sidebar: [Page1, Page2], main: [Page1, Page2] }

            // 1. Process each region independently
            regionNames.forEach(regionName => {
                const sections = layoutState[regionName] || []; // Graceful fallback if data missing for region
                const calculatedPages = [];

                let currentPage = { items: [] }; // items: [{ sectionId, subItems: [], ... }]
                let currentHeight = 0;

                const pushPage = () => {
                    calculatedPages.push(currentPage);
                    currentPage = { items: [] };
                    currentHeight = 0;
                };

                sections.forEach(sectionId => {
                    const MEASURE_CONTAINER = containerRef.current;
                    // Look inside the region wrapper in measurement layer
                    // ID uniqueness? We used `measure-header-${sectionId}`. 
                    // Assuming section IDs are unique globally across resume (they should be)

                    const headerEl = MEASURE_CONTAINER.querySelector(`#measure-header-${sectionId}`);
                    const headerHeight = headerEl ? headerEl.offsetHeight + 15 : 40;

                    // Determine List or Block
                    const firstItem = MEASURE_CONTAINER.querySelector(`#section-${sectionId}-item-0`);

                    if (firstItem) {
                        // LIST Logic
                        if (currentHeight + headerHeight > CONTENT_HEIGHT) pushPage();

                        let currentSection = { sectionId, subItems: [], header: true, isContinuation: false };
                        currentPage.items.push(currentSection);
                        currentHeight += headerHeight;

                        let idx = 0;
                        while (true) {
                            const itemEl = MEASURE_CONTAINER.querySelector(`#section-${sectionId}-item-${idx}`);
                            if (!itemEl) break;
                            const itemHeight = itemEl.offsetHeight + 10;

                            if (currentHeight + itemHeight > CONTENT_HEIGHT) {
                                pushPage();
                                currentSection = { sectionId, subItems: [], header: false, isContinuation: true };
                                currentPage.items.push(currentSection);
                                currentHeight += 30; // Continuation headers
                            }

                            currentSection.subItems.push(idx);
                            currentHeight += itemHeight;
                            idx++;
                        }
                    } else {
                        // BLOCK Logic
                        const contentEl = MEASURE_CONTAINER.querySelector(`#section-${sectionId}-content`);
                        if (contentEl) {
                            const totalHeight = contentEl.offsetHeight + headerHeight;
                            if (currentHeight + totalHeight > CONTENT_HEIGHT) {
                                // Simple split: entire block moves
                                // Ideally we split text, but for now Move Block
                                pushPage();
                            }
                            currentPage.items.push({ sectionId, header: true, isContinuation: false, isBlock: true });
                            currentHeight += totalHeight;
                        }
                    }
                });

                if (currentPage.items.length > 0) calculatedPages.push(currentPage);
                regionPages[regionName] = calculatedPages;
            });

            // 2. Merge independent streams into Unified Pages
            // Find max number of pages needed
            let maxPages = 0;
            regionNames.forEach(r => maxPages = Math.max(maxPages, regionPages[r].length));

            const unifiedPages = [];
            for (let i = 0; i < maxPages; i++) {
                const pageContent = {};
                regionNames.forEach(r => {
                    // Get content for this page/region, or empty if exhausted
                    pageContent[r] = regionPages[r][i] ? regionPages[r][i].items : [];
                });
                unifiedPages.push({ regions: pageContent });
            }

            setPages(unifiedPages);
            setIsMeasuring(false);
        };

        const t = setTimeout(measure, 100);
        return () => clearTimeout(t);

    }, [data, layoutState, pageSize, bottomGap]); // Config dependency

    return { pages, isMeasuring, containerRef };
};
