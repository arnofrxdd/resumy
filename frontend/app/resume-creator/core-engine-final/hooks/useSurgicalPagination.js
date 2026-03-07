import { useState, useLayoutEffect, useRef } from 'react';

/**
 * useSurgicalPagination
 * 
 * A high-precision rendering hook that recursively splits content
 * across A4 pages. Supporting multi-region (column) layouts.
 */
export const useSurgicalPagination = (data, layoutState, config = {}) => {
    const [pages, setPages] = useState([]);
    const [isMeasuring, setIsMeasuring] = useState(true);
    const containerRef = useRef(null);

    const A4_HEIGHT = config.pageSize?.height || 1122; // px at 96dpi
    const PADDING = config.padding || 40;
    const SAFETY_BUFFER = config.safetyBuffer || 30;
    const MAX_CONTENT_HEIGHT = A4_HEIGHT - (PADDING * 2) - SAFETY_BUFFER;

    console.log("SURGICAL ENGINE: MAX_CONTENT_HEIGHT =", MAX_CONTENT_HEIGHT);

    const getFullHeight = (el) => {
        if (!el) return 0;
        const style = window.getComputedStyle(el);
        const margin = parseFloat(style.marginTop) + parseFloat(style.marginBottom);
        return el.offsetHeight + margin;
    };

    useLayoutEffect(() => {
        if (!containerRef.current) return;

        const measureAndPaginate = () => {
            console.log("SURGICAL ENGINE: Starting calculation...");
            const regions = Object.keys(layoutState);
            const regionPages = {}; // { main: [Page1_Items, Page2_Items], sidebar: [...] }

            regions.forEach(regionId => {
                const sectionIds = layoutState[regionId] || [];
                const localPages = [];
                let currentPageItems = [];
                let currentHeight = 0;

                const pushPage = () => {
                    localPages.push(currentPageItems);
                    currentPageItems = [];
                    currentHeight = 0;
                };

                sectionIds.forEach(sectionId => {
                    const headerEl = containerRef.current.querySelector(`#header-${regionId}-${sectionId}`);
                    const contentEl = containerRef.current.querySelector(`#content-${regionId}-${sectionId}`);

                    if (!headerEl || !contentEl) return;

                    const headerH = getFullHeight(headerEl);
                    const totalSectionH = headerH + getFullHeight(contentEl);

                    // 1. Check if entire section fits
                    if (currentHeight + totalSectionH <= MAX_CONTENT_HEIGHT) {
                        currentPageItems.push({
                            sectionId,
                            type: 'FULL',
                            hasHeader: true
                        });
                        currentHeight += totalSectionH;
                    } else {
                        // 2. Surgical Split - Try to fit Header + Some Items
                        if (currentHeight + headerH > MAX_CONTENT_HEIGHT) {
                            pushPage();
                        }

                        currentPageItems.push({
                            sectionId,
                            type: 'PARTIAL',
                            hasHeader: true,
                            isContinuation: false,
                            visibleIndices: [] // To be filled
                        });
                        currentHeight += headerH;

                        // Measure individual items within the content
                        const itemEls = Array.from(contentEl.children);
                        itemEls.forEach((itemEl, idx) => {
                            const itemH = getFullHeight(itemEl);

                            if (currentHeight + itemH <= MAX_CONTENT_HEIGHT) {
                                // Fit item
                                const lastItem = currentPageItems[currentPageItems.length - 1];
                                if (!lastItem.visibleIndices) lastItem.visibleIndices = [];
                                lastItem.visibleIndices.push(idx);
                                currentHeight += itemH;
                            } else {
                                // 3. Even Deeper Split - Can we split bullets/paragraphs?
                                // Target <li> inside <ul> or direct children if it's just <p>s
                                const nestedChildren = Array.from(itemEl.querySelectorAll('.description > ul > li, .description > p, .description > ol > li'));
                                console.log(`[Nested Split] Item ${idx} has ${nestedChildren.length} children`);

                                if (nestedChildren.length > 1) {
                                    // Split nested content
                                    let handledNestedIdx = 0;
                                    while (handledNestedIdx < nestedChildren.length) {
                                        // Try to fit bullets
                                        let addedOnThisPage = 0;
                                        for (let n = handledNestedIdx; n < nestedChildren.length; n++) {
                                            const entryH = getFullHeight(nestedChildren[n]);
                                            if (currentHeight + entryH <= MAX_CONTENT_HEIGHT) {
                                                currentHeight += entryH;
                                                addedOnThisPage++;
                                            } else {
                                                break;
                                            }
                                        }

                                        if (addedOnThisPage > 0) {
                                            // Start/Continue current item on this page
                                            const lastItem = currentPageItems[currentPageItems.length - 1];

                                            // Ensure we are working on the right object
                                            let targetItem = lastItem;
                                            if (targetItem.sectionId !== sectionId) {
                                                // Should not happen if logic is correct, but let's be safe
                                                targetItem = {
                                                    sectionId,
                                                    type: 'PARTIAL',
                                                    hasHeader: false,
                                                    isContinuation: true,
                                                    visibleIndices: [idx]
                                                };
                                                currentPageItems.push(targetItem);
                                            }

                                            targetItem.nestedRange = {
                                                start: handledNestedIdx,
                                                end: handledNestedIdx + addedOnThisPage - 1
                                            };

                                            handledNestedIdx += addedOnThisPage;

                                            if (handledNestedIdx < nestedChildren.length) {
                                                pushPage();
                                                // Immediately prepare for next part on next page
                                                currentPageItems.push({
                                                    sectionId,
                                                    type: 'PARTIAL',
                                                    hasHeader: false,
                                                    isContinuation: true, // Show "(Continued)"
                                                    visibleIndices: [idx]
                                                });
                                                const contHeaderEl = containerRef.current.querySelector(`.continuation-header-measurer`);
                                                const contHeaderH = getFullHeight(contHeaderEl) || 40;
                                                currentHeight += contHeaderH;
                                            }
                                        } else {
                                            // Force it if page is empty or push page
                                            if (currentHeight > 40) { // arbitrary small height
                                                pushPage();
                                            } else {
                                                // Force one line
                                                const lastItem = currentPageItems[currentPageItems.length - 1];
                                                lastItem.nestedRange.end = handledNestedIdx;
                                                currentHeight = MAX_CONTENT_HEIGHT; // Force break
                                                handledNestedIdx++;
                                            }
                                        }
                                    }
                                } else {
                                    // Can't split item further, move to next page
                                    pushPage();
                                    currentPageItems.push({
                                        sectionId,
                                        type: 'PARTIAL',
                                        hasHeader: false,
                                        isContinuation: true,
                                        visibleIndices: [idx]
                                    });
                                    const contHeaderEl = containerRef.current.querySelector(`.continuation-header-measurer`);
                                    const contHeaderH = getFullHeight(contHeaderEl) || 30;
                                    currentHeight += contHeaderH + itemH;
                                }
                            }
                        });
                    }
                });

                if (currentPageItems.length > 0) localPages.push(currentPageItems);
                regionPages[regionId] = localPages;
            });

            // Unify pages (standardize across regions)
            const maxPages = Math.max(...Object.values(regionPages).map(p => p.length));
            const unified = [];
            for (let i = 0; i < maxPages; i++) {
                const pageData = { regions: {} };
                regions.forEach(rid => {
                    pageData.regions[rid] = regionPages[rid][i] || [];
                });
                unified.push(pageData);
            }

            setPages(unified);
            setIsMeasuring(false);
        };

        const timer = setTimeout(measureAndPaginate, 500);
        return () => clearTimeout(timer);
    }, [data, layoutState]);

    return { pages, isMeasuring, containerRef };
};
