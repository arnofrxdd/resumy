import { useState, useLayoutEffect, useRef } from 'react';

export const useSurgicalPagination = (data, layoutState, config = {}) => {
    const templateConfig = config.templateConfig || {};
    const actualConfig = templateConfig.config || templateConfig;
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

    // Configurable padding
    const PADDING_TOP = config.paddingTop || 40;
    const DEFAULT_PADDING_BOTTOM = config.paddingBottom || 40;
    const PADDING_BOTTOM = DEFAULT_PADDING_BOTTOM + bottomGap;
    // Increase safety buffer to 45px to be absolutely sure browser rendering has room
    const CONTENT_HEIGHT = PAGE_HEIGHT - PADDING_TOP - PADDING_BOTTOM - 45;

    // Helper to get full height including margins
    const getElementHeight = (el) => {
        if (!el) return 0;
        const style = window.getComputedStyle(el);
        const marginTop = parseFloat(style.marginTop) || 0;
        const marginBottom = parseFloat(style.marginBottom) || 0;
        return el.offsetHeight + marginTop + marginBottom;
    };

    useLayoutEffect(() => {
        if (!containerRef.current) return;

        const measure = () => {
            const regionNames = Object.keys(layoutState);
            const regionPages = {};

            console.log("[Pagination] Starting measurement for regions:", regionNames);

            regionNames.forEach(regionName => {
                const sections = layoutState[regionName] || [];
                const calculatedPages = [];

                let currentPage = { items: [] };
                let currentHeight = 0;

                const pushPage = () => {
                    console.log(`[Pagination] Pushing page ${calculatedPages.length + 1} for ${regionName}. Height was ${currentHeight}`);
                    calculatedPages.push(currentPage);
                    currentPage = { items: [] };
                    currentHeight = 0;
                };

                const SECTION_SPACING = 5; // Reduced buffer to prevent aggressive breaking

                sections.forEach((sectionId, sectionIdx) => {
                    const MEASURE_CONTAINER = containerRef.current;
                    if (!MEASURE_CONTAINER) return;

                    const headerEl = MEASURE_CONTAINER.querySelector(`#measure-header-${sectionId}`);
                    // Use getElementHeight to include the margin (which was ~10px) layout was missing
                    const headerHeight = getElementHeight(headerEl) || 35;

                    // Add spacing between sections if not at top of page
                    let spacing = (currentHeight > 0) ? SECTION_SPACING : 0;

                    // Check if header alone fits
                    if (currentHeight + spacing + headerHeight > CONTENT_HEIGHT) {
                        pushPage();
                        spacing = 0; // Reset spacing for new page
                    }

                    let currentSection = {
                        sectionId,
                        subItems: [],
                        subItemRanges: {},
                        header: true,
                        isContinuation: false
                    };
                    currentPage.items.push(currentSection);
                    currentHeight += spacing + headerHeight; // No extra constant, margins included

                    const sectionData = data[sectionId];
                    if (Array.isArray(sectionData)) {
                        sectionData.forEach((item, itemIdx) => {
                            const itemEl = MEASURE_CONTAINER.querySelector(`#section-${sectionId}-item-${itemIdx}`);
                            if (!itemEl) {
                                console.warn(`[Pagination] El not found for ${sectionId} index ${itemIdx}`);
                            }
                            const itemHeight = getElementHeight(itemEl) || 50;

                            if (currentHeight + itemHeight <= CONTENT_HEIGHT) {
                                currentSection.subItems.push(itemIdx);
                                currentHeight += itemHeight; // No extra constant
                            }
                            else {
                                const itemWrapper = MEASURE_CONTAINER.querySelector(`#section-${sectionId}-item-${itemIdx}`);
                                const subItems = itemWrapper ? Array.from(itemWrapper.querySelectorAll(`[id^="section-${sectionId}-item-${itemIdx}-subitem-"]`)) : [];

                                if (subItems.length > 0) {
                                    let remainingIndices = subItems.map((_, i) => i);
                                    let firstPart = true;

                                    while (remainingIndices.length > 0) {
                                        let itemsForThisPage = [];
                                        let pageSubHeight = 0;

                                        // Measure the continuation header dynamically
                                        const contHeaderEl = MEASURE_CONTAINER.querySelector(`#measure-cont-header-${sectionId}`);
                                        // Since it is hidden/absolute in MeasurementLayer, we might need to rely on its offsetHeight directly 
                                        // or ensure it has layout. We updated MeasurementLayer to display:block but visibility:hidden.
                                        // However, it's absolute, so it doesn't affect flow, but we can measure it.
                                        const contHeaderHeightRaw = contHeaderEl ? contHeaderEl.offsetHeight : 35;
                                        // Add some margin buffer for continuation header if not measured
                                        const contHeaderHeight = firstPart ? 0 : (contHeaderHeightRaw + 12);

                                        for (const subIdx of remainingIndices) {
                                            const subEl = subItems[subIdx];
                                            const subHeight = getElementHeight(subEl) || 20;

                                            if (currentHeight + contHeaderHeight + pageSubHeight + subHeight <= CONTENT_HEIGHT) {
                                                itemsForThisPage.push(subIdx);
                                                pageSubHeight += subHeight;
                                            } else {
                                                break;
                                            }
                                        }

                                        if (itemsForThisPage.length > 0) {
                                            if (!firstPart) {
                                                currentSection = {
                                                    sectionId,
                                                    subItems: [itemIdx],
                                                    subItemRanges: { [itemIdx]: { start: itemsForThisPage[0], end: itemsForThisPage[itemsForThisPage.length - 1] } },
                                                    header: false,
                                                    isContinuation: true
                                                };
                                                currentPage.items.push(currentSection);
                                                currentHeight += contHeaderHeight + pageSubHeight;
                                            } else {
                                                currentSection.subItems.push(itemIdx);
                                                currentSection.subItemRanges[itemIdx] = { start: itemsForThisPage[0], end: itemsForThisPage[itemsForThisPage.length - 1] };
                                                currentHeight += pageSubHeight;
                                            }

                                            remainingIndices = remainingIndices.slice(itemsForThisPage.length);
                                            firstPart = false;
                                        } else if (firstPart) {
                                            if (currentHeight > 0) {
                                                pushPage();
                                                continue;
                                            } else {
                                                // Item too big for empty page, forced.
                                                itemsForThisPage = [remainingIndices[0]];
                                                remainingIndices = remainingIndices.slice(1);

                                                currentSection.subItems.push(itemIdx);
                                                currentSection.subItemRanges[itemIdx] = { start: itemsForThisPage[0], end: itemsForThisPage[itemsForThisPage.length - 1] };
                                                const forcedSubEl = subItems[itemsForThisPage[0]];
                                                currentHeight += getElementHeight(forcedSubEl);
                                                firstPart = false;
                                            }
                                        } else {
                                            // Handle case where itemsForThisPage is empty but NOT firstPart
                                            // This means even one bullet on a new page doesn't fit?
                                            // Should not happen, but prevents infinite loop.
                                            pushPage();
                                        }

                                        if (remainingIndices.length > 0) {
                                            pushPage();
                                        }
                                    }
                                } else {
                                    if (currentHeight > 0) {
                                        pushPage();
                                    }
                                    currentSection = {
                                        sectionId,
                                        subItems: [itemIdx],
                                        subItemRanges: {},
                                        header: false,
                                        isContinuation: true
                                    };
                                    currentPage.items.push(currentSection);
                                    currentHeight += itemHeight;
                                }
                            }
                        });
                    } else if (sectionId === 'summary') {
                        const summaryEl = MEASURE_CONTAINER.querySelector(`#section-summary-content`);
                        const contentHeight = getElementHeight(summaryEl) || 120; // Use getElementHeight

                        if (currentHeight + contentHeight > CONTENT_HEIGHT) {
                            const paragraphs = Array.from(MEASURE_CONTAINER.querySelectorAll(`[id^="section-summary-item-"]`));
                            if (paragraphs.length > 0) {
                                let remainingIndices = paragraphs.map((_, i) => i);
                                let firstPart = true;

                                while (remainingIndices.length > 0) {
                                    let itemsForThisPage = [];
                                    let pageSubHeight = 0;

                                    const contHeaderEl = MEASURE_CONTAINER.querySelector(`#measure-cont-header-${sectionId}`);
                                    const contHeaderHeightRaw = contHeaderEl ? contHeaderEl.offsetHeight : 35;
                                    const contHeaderHeight = firstPart ? 0 : (contHeaderHeightRaw + 10);

                                    for (const subIdx of remainingIndices) {
                                        const subEl = paragraphs[subIdx];
                                        const subHeight = getElementHeight(subEl) || 20; // Use getElementHeight

                                        if (currentHeight + contHeaderHeight + pageSubHeight + subHeight <= CONTENT_HEIGHT) {
                                            itemsForThisPage.push(subIdx);
                                            pageSubHeight += subHeight;
                                        } else {
                                            break;
                                        }
                                    }

                                    if (itemsForThisPage.length > 0) {
                                        if (!firstPart) {
                                            currentSection = {
                                                sectionId,
                                                subItems: null,
                                                subItemRanges: { ['summary']: { start: itemsForThisPage[0], end: itemsForThisPage[itemsForThisPage.length - 1] } },
                                                header: false,
                                                isContinuation: true
                                            };
                                            currentPage.items.push(currentSection);
                                            currentHeight += contHeaderHeight + pageSubHeight;
                                        } else {
                                            currentSection.subItemRanges['summary'] = { start: itemsForThisPage[0], end: itemsForThisPage[itemsForThisPage.length - 1] };
                                            currentHeight += pageSubHeight;
                                        }
                                        remainingIndices = remainingIndices.slice(itemsForThisPage.length);
                                        firstPart = false;
                                    } else if (firstPart) {
                                        pushPage();
                                        continue;
                                    }

                                    if (remainingIndices.length > 0) {
                                        pushPage();
                                    }
                                }
                            } else {
                                // Fallback for summary
                                pushPage();
                                currentHeight += contentHeight;
                            }
                        } else {
                            currentHeight += contentHeight;
                        }
                    } else {
                        // Generic/Text Sections
                        const contentEl = MEASURE_CONTAINER.querySelector(`#section-${sectionId}-content`);
                        const contentHeight = getElementHeight(contentEl) || 60; // Use getElementHeight
                        if (currentHeight + contentHeight > CONTENT_HEIGHT) {
                            pushPage();
                        }

                        if (currentPage.items.length === 0 || currentPage.items[currentPage.items.length - 1].sectionId !== sectionId) {
                            currentPage.items.push({
                                sectionId,
                                header: true,
                                isContinuation: calculatedPages.length > 0 && calculatedPages.some(p => p.items.some(it => it.sectionId === sectionId))
                            });
                            // If we pushed a new page (line 222), currentHeight was reset to 0. 
                            // But here we are adding a header? 
                            // Wait, logic flaw in original code:
                            // If pushPage() happened, currentHeight is 0. 
                            // We aren't adding headerHeight to currentHeight here?
                            // Original code didn't either for this block.
                            // We should probably measure header too, similar to above.

                            // For generic sections, we assumed Header + Content is one block in MeasurementLayer
                            // But in our new MeasurementLayer, we separated Header and Content.
                            // So we need to add Header Height if we are adding a header.

                            const headerEl = MEASURE_CONTAINER.querySelector(`#measure-header-${sectionId}`);
                            const headerHeight = getElementHeight(headerEl) || 35;
                            currentHeight += headerHeight;
                        }
                        currentHeight += contentHeight;
                    }
                });

                if (currentPage.items.length > 0) {
                    calculatedPages.push(currentPage);
                }
                regionPages[regionName] = calculatedPages;
                console.log(`[Pagination] Finished ${regionName}. Created ${calculatedPages.length} pages.`);
            });

            let maxPagesAcrossRegions = 0;
            regionNames.forEach(r => maxPagesAcrossRegions = Math.max(maxPagesAcrossRegions, regionPages[r].length));

            console.log(`[Pagination] Unified Max Pages: ${maxPagesAcrossRegions}`);

            const unifiedPages = [];
            for (let i = 0; i < maxPagesAcrossRegions; i++) {
                const pageContent = {};
                regionNames.forEach(r => {
                    pageContent[r] = regionPages[r][i] ? regionPages[r][i].items : [];
                });
                unifiedPages.push({ regions: pageContent });
            }

            setPages(unifiedPages);
            setIsMeasuring(false);
        };

        const t = setTimeout(measure, 400); // Increased delay for DnD/DOM settle
        return () => clearTimeout(t);

    }, [data, layoutState, pageSize, bottomGap, config.paddingTop, config.paddingBottom]);

    return { pages, isMeasuring, containerRef };
};
