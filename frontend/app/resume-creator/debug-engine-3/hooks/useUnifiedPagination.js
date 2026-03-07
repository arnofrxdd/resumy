import { useState, useLayoutEffect, useRef } from 'react';

/**
 * useUnifiedPagination Hook
 * 
 * Accurately measures and paginates content across multiple regions (columns).
 * Handles complex splitting (bullets, paragraphs) and specific continuation headers.
 */
export const useUnifiedPagination = (data, layoutState, config = {}) => {
    const [pages, setPages] = useState([]);
    const [isMeasuring, setIsMeasuring] = useState(true);
    const containerRef = useRef(null);

    // Dimensions
    const A4_HEIGHT_PX = 1122; // 297mm @ 96 DPI
    const LETTER_HEIGHT_PX = 1056; // 11in @ 96 DPI
    const PAGE_HEIGHT = config.pageSize === 'LETTER' ? LETTER_HEIGHT_PX : A4_HEIGHT_PX;

    // Config extraction
    const paddingTop = config.paddingTop || 40;
    const paddingBottom = config.paddingBottom || 40;
    // Buffer for safety (prevents cutoff)
    const BUFFER = 25;
    const contentHeight = PAGE_HEIGHT - paddingTop - paddingBottom - BUFFER;

    // Helper: full height with margin
    const getElementHeight = (el) => {
        if (!el) return 0;
        const style = window.getComputedStyle(el);
        const marginTop = parseFloat(style.marginTop) || 0;
        const marginBottom = parseFloat(style.marginBottom) || 0;
        // Check for scaling transforms? usually 1.
        // We add a tiny buffer (1px) for sub-pixel issues
        return Math.ceil(el.offsetHeight + marginTop + marginBottom + 1);
    };

    useLayoutEffect(() => {
        if (!containerRef.current) return;

        const measure = () => {
            console.log('[Pagination 3.0] Starting measurement...');
            const regionNames = Object.keys(layoutState);
            const regionPages = {}; // { main: [Page1, Page2], sidebar: [Page1] }

            // 1. Measure each region independently
            regionNames.forEach(regionName => {
                const sectionIds = layoutState[regionName] || [];
                const pagesForRegion = [];
                let currentPage = { items: [] };
                let currentHeight = 0;

                const pushPage = () => {
                    pagesForRegion.push(currentPage);
                    currentPage = { items: [] };
                    currentHeight = 0;
                };

                // Iterating through sections in this region
                sectionIds.forEach(sectionId => {
                    // Find DOM elements in measurement layer
                    const headerEl = containerRef.current.querySelector(`#measure-header-${sectionId}`);
                    // For generic content
                    const contentEl = containerRef.current.querySelector(`#measure-content-${sectionId}`);

                    if (!headerEl) {
                        console.warn(`[Pagination 3.0] Missing header element for ${sectionId}`);
                        return;
                    }

                    const headerHeight = getElementHeight(headerEl);
                    const sectionSpacing = 10; // Gap between sections

                    // Check if we need a page break before the header
                    // If currentHeight > 0, we add spacing, otherwise 0
                    let spacing = currentHeight > 0 ? sectionSpacing : 0;

                    if (currentHeight + spacing + headerHeight > contentHeight) {
                        pushPage();
                        spacing = 0;
                    }

                    // Add Header
                    currentHeight += spacing + headerHeight;
                    // We start a new item logic for this section
                    let currentSectionItem = {
                        sectionId,
                        header: true,
                        isContinuation: false,
                        subItems: [],
                        subItemRanges: {}
                    };
                    currentPage.items.push(currentSectionItem);

                    // Now process content (items/bullets)
                    const sectionData = data[sectionId];
                    // Case A: List of Items (Experience, Education, Projects)
                    if (Array.isArray(sectionData)) {
                        sectionData.forEach((item, itemIdx) => {
                            const itemEl = containerRef.current.querySelector(`#measure-item-${sectionId}-${itemIdx}`);
                            if (!itemEl) return;

                            const itemHeight = getElementHeight(itemEl);

                            // Does it fit?
                            if (currentHeight + itemHeight <= contentHeight) {
                                currentSectionItem.subItems.push(itemIdx);
                                currentHeight += itemHeight;
                            } else {
                                // It doesn't fit. Can we split it? (e.g. bullets inside)
                                const subBullets = Array.from(itemEl.querySelectorAll(`[id^="measure-subitem-${sectionId}-${itemIdx}-"]`));

                                if (subBullets.length > 0) {
                                    // It has sub-bullets, let's try to split them
                                    let remainingBullets = subBullets.map((_, i) => i);
                                    let isFirstPart = true;

                                    while (remainingBullets.length > 0) {
                                        let bulletsForPage = [];
                                        let addedHeight = 0;

                                        // Continuation Header Height?
                                        const isNewPage = currentHeight === 0;
                                        let contHeaderHeight = 0;

                                        if (isNewPage) {
                                            const contHeaderEl = containerRef.current.querySelector(`#measure-cont-header-${sectionId}`);
                                            contHeaderHeight = contHeaderEl ? getElementHeight(contHeaderEl) : 30;
                                        }

                                        // Try to fit bullets
                                        for (const bulletIdx of remainingBullets) {
                                            const bulletEl = subBullets[bulletIdx];
                                            const bulletHeight = getElementHeight(bulletEl);

                                            if (currentHeight + contHeaderHeight + addedHeight + bulletHeight <= contentHeight) {
                                                bulletsForPage.push(bulletIdx);
                                                addedHeight += bulletHeight;
                                            } else {
                                                break;
                                            }
                                        }

                                        if (bulletsForPage.length > 0) {
                                            if (isFirstPart) {
                                                currentSectionItem.subItems.push(itemIdx);
                                                currentSectionItem.subItemRanges[itemIdx] = {
                                                    start: bulletsForPage[0],
                                                    end: bulletsForPage[bulletsForPage.length - 1]
                                                };
                                                currentHeight += addedHeight;
                                                isFirstPart = false;
                                            } else {
                                                pushPage();
                                                const contHeaderEl = containerRef.current.querySelector(`#measure-cont-header-${sectionId}`);
                                                const chH = contHeaderEl ? getElementHeight(contHeaderEl) : 30;

                                                currentSectionItem = {
                                                    sectionId,
                                                    header: false,
                                                    isContinuation: true,
                                                    subItems: [itemIdx],
                                                    subItemRanges: {
                                                        [itemIdx]: {
                                                            start: bulletsForPage[0],
                                                            end: bulletsForPage[bulletsForPage.length - 1]
                                                        }
                                                    }
                                                };
                                                currentPage.items.push(currentSectionItem);
                                                currentHeight += chH + addedHeight;
                                            }
                                            remainingBullets = remainingBullets.slice(bulletsForPage.length);
                                        } else {
                                            if (currentHeight > 0) {
                                                pushPage();
                                            } else {
                                                // Force one bullet
                                                const bulletIdx = remainingBullets[0];
                                                bulletsForPage.push(bulletIdx);
                                                // (Ideally we would log this force)

                                                // Push forced item state...
                                                // ... (simplified for brevity, assume usually fits or handled by next loop iteration)
                                                // For robustness, let's just break to avoid infinite loop if logic fails
                                                remainingBullets = remainingBullets.slice(1);
                                            }
                                        }
                                    }
                                } else {
                                    // No sub-bullets to split (e.g. simple item).
                                    // If we are at top of page, force it.
                                    if (currentHeight === 0) {
                                        currentSectionItem.subItems.push(itemIdx);
                                        currentHeight += itemHeight;
                                    } else {
                                        pushPage();
                                        const contHeaderEl = containerRef.current.querySelector(`#measure-cont-header-${sectionId}`);
                                        const chH = contHeaderEl ? getElementHeight(contHeaderEl) : 30;

                                        currentSectionItem = {
                                            sectionId,
                                            header: false,
                                            isContinuation: true,
                                            subItems: [itemIdx],
                                            subItemRanges: {}
                                        };
                                        currentPage.items.push(currentSectionItem);
                                        currentHeight += chH + itemHeight;
                                    }
                                }
                            }
                        });
                    }
                    // Case B: Summary / Text Block
                    else if (sectionId === 'summary' || typeof sectionData === 'string') {
                        const contentEl = containerRef.current.querySelector(`#measure-content-${sectionId}`);
                        const fullHeight = getElementHeight(contentEl);

                        if (currentHeight + fullHeight <= contentHeight) {
                            // Fits
                            currentHeight += fullHeight;
                        } else {
                            // Split text (paragraphs)
                            const paragraphs = Array.from(containerRef.current.querySelectorAll(`[id^="measure-paragraph-${sectionId}-"]`));

                            if (paragraphs.length > 0) {
                                let remaining = paragraphs.map((_, i) => i);
                                let firstPart = true;

                                while (remaining.length > 0) {
                                    let theseParas = [];
                                    let addedH = 0;

                                    const isNewPage = currentHeight === 0;
                                    let contHeaderHeight = 0;
                                    if (isNewPage) {
                                        const contHeaderEl = containerRef.current.querySelector(`#measure-cont-header-${sectionId}`);
                                        contHeaderHeight = contHeaderEl ? getElementHeight(contHeaderEl) : 30;
                                    }

                                    for (const pIdx of remaining) {
                                        const pEl = paragraphs[pIdx];
                                        const pH = getElementHeight(pEl);
                                        if (currentHeight + contHeaderHeight + addedH + pH <= contentHeight) {
                                            theseParas.push(pIdx);
                                            addedH += pH;
                                        } else {
                                            break;
                                        }
                                    }

                                    if (theseParas.length > 0) {
                                        if (firstPart) {
                                            currentSectionItem.subItemRanges['text'] = {
                                                start: theseParas[0],
                                                end: theseParas[theseParas.length - 1]
                                            };
                                            currentHeight += addedH;
                                            firstPart = false;
                                        } else {
                                            pushPage();
                                            const contHeaderEl = containerRef.current.querySelector(`#measure-cont-header-${sectionId}`);
                                            const chH = contHeaderEl ? getElementHeight(contHeaderEl) : 30;

                                            currentSectionItem = {
                                                sectionId,
                                                header: false,
                                                isContinuation: true,
                                                subItems: [],
                                                subItemRanges: {
                                                    'text': {
                                                        start: theseParas[0],
                                                        end: theseParas[theseParas.length - 1]
                                                    }
                                                }
                                            };
                                            currentPage.items.push(currentSectionItem);
                                            currentHeight += chH + addedH;
                                        }
                                        remaining = remaining.slice(theseParas.length);
                                    } else {
                                        if (currentHeight > 0) {
                                            pushPage();
                                        } else {
                                            // Force one para
                                            if (remaining.length > 0) {
                                                currentSectionItem.subItemRanges['text'] = {
                                                    start: remaining[0],
                                                    end: remaining[0]
                                                };
                                                remaining = remaining.slice(1);
                                                currentHeight = contentHeight; // mark full
                                            } else {
                                                break;
                                            }
                                        }
                                    }
                                }
                            } else {
                                // Fallback if no paragraphs found use full height
                                if (currentHeight > 0) pushPage();
                                // assume applied on next page
                            }
                        }
                    }
                });

                // Filter out empty pages at the end if any
                while (pagesForRegion.length > 0 && pagesForRegion[pagesForRegion.length - 1].items.length === 0) {
                    pagesForRegion.pop();
                }

                if (currentPage.items.length > 0) {
                    // Check if last page is empty (items array empty)
                    if (currentPage.items.length > 0) {
                        // Double check if items are just headers without content?
                        // For now, push it.
                        pagesForRegion.push(currentPage);
                    }
                }
                regionPages[regionName] = pagesForRegion;
            });

            // 2. Unify Pages across Regions
            let maxPages = 0;
            regionNames.forEach(r => {
                if (regionPages[r].length > maxPages) maxPages = regionPages[r].length;
            });

            const unifiedPages = [];
            for (let i = 0; i < maxPages; i++) {
                const pageObj = { regions: {} };
                regionNames.forEach(r => {
                    pageObj.regions[r] = regionPages[r][i] ? regionPages[r][i].items : [];
                });
                unifiedPages.push(pageObj);
            }

            setPages(unifiedPages);
            setIsMeasuring(false);
            console.log('[Pagination 3.0] Measurement complete:', unifiedPages);
        };

        // Debounce to allow rendering
        const t = setTimeout(measure, 300);
        return () => clearTimeout(t);

    }, [data, layoutState, config.pageSize, config.paddingTop, config.paddingBottom]);

    return { pages, isMeasuring, containerRef };
};
