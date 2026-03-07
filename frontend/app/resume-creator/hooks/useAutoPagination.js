import { useState, useLayoutEffect, useCallback, useRef } from 'react';

/**
 * useAutoPagination v3 — Complete Rewrite
 *
 * ─────────────────────────────────────────────────
 * HOW IT WORKS
 * ─────────────────────────────────────────────────
 * 1. Templates render a hidden "Measurer" at position:-10000px.
 *    Every section has [data-section-id], items have [data-item-index],
 *    and rich-text blocks may have [data-sub-item-index].
 *
 * 2. This hook walks the Measurer and records absolute Y-offsets for every
 *    section (and every item *inside* each section). All offsets are in
 *    **unscaled px** — i.e. DOM rect values divided by `scale`.
 *
 * 3. We compute usable page height once:
 *        PAGE_CONTENT_HEIGHT = A4_HEIGHT − topMargin − bottomMargin
 *    and then sweep each column's sections, fitting items one by one,
 *    opening new pages whenever the cursor exceeds the budget.
 *
 * WHY THE OLD VERSION BROKE
 * ─────────────────────────────────────────────────
 * • It mixed *relative* offsets (section ↔ column), *absolute* offsets,
 *   CSS computed padding, and a magic -15px PDF buffer — each measured
 *   differently → the budget drifted.
 * • `gap` between sections was hard-coded at 20px instead of measured.
 * • `headerHeight` was estimated from the first item's offset, which was
 *   wrong when items had margins, or the section had no items (Summary).
 *
 * V3 STRATEGY
 * ─────────────────────────────────────────────────
 * We don't track a running "y cursor" in unscaled px. Instead:
 *   – Every measurement is an **absolute Y** from the column's top.
 *   – Each page has a Y-budget: page0 content zone starts at 0 and
 *     extends to (A4_HEIGHT - bottomMargin - page0_topOffset).
 *     Subsequent pages have the full (A4_HEIGHT - topMargin - bottomMargin).
 *   – We walk items and check: does the item's BOTTOM fit in the page?
 *     If yes, include it. If not, start a new page.
 *
 * This is *exactly* how professional builders (Resumake, FlowCV, Canva)
 * implement pagination.
 */

// ── Constants ──────────────────────────────────────────────
const A4_MM = 297;
const MM_TO_PX = 3.7795275591; // 1mm ≈ 3.78px at 96dpi
const DEFAULT_BOTTOM_MARGIN = 40; // px
const DEFAULT_TOP_MARGIN = 40;    // px
const PDF_BLEED_BUFFER = 10;      // Extra safety to avoid rasterisation clipping
const CONTINUATION_HEADER_HEIGHT = 42; // approx height for "(Continued)" title in px

export const useAutoPagination = ({
    columns = {},
    data,
    enabled = true,
    containerRef,
    scale = 1
}) => {
    const [pages, setPages] = useState(null);
    const prevResultRef = useRef(null);

    // ── Helpers ──────────────────────────────────────────

    /** Unscaled bounding rect. All values are in CSS px at scale=1. */
    const unscaledRect = (el) => {
        if (!el) return { top: 0, bottom: 0, height: 0 };
        const r = el.getBoundingClientRect();
        return {
            top: r.top / scale,
            bottom: r.bottom / scale,
            height: r.height / scale,
            left: r.left / scale,
            width: r.width / scale
        };
    };

    /** Parse an integer CSS value (px) from computed style. */
    const cssPx = (el, prop) => {
        if (!el) return 0;
        return parseFloat(window.getComputedStyle(el).getPropertyValue(prop)) || 0;
    };

    // ── Core Paginator ──────────────────────────────────

    const paginate = useCallback(() => {
        if (!enabled || !containerRef?.current) return;

        const root = containerRef.current;

        // ── Step 1: Measure A4 height ──────────────────────
        // Templates provide a <div class="page-height-marker" style="height:297mm">
        const marker = root.querySelector('.page-height-marker');
        const A4_HEIGHT = marker
            ? (marker.getBoundingClientRect().height / scale)
            : (A4_MM * MM_TO_PX);

        // ── Step 2: Read the theme's page margin (used for top AND bottom) ──
        // The ResumeRenderer sets --theme-page-margin on .resume-theme-provider
        const themeProvider = root.closest('.resume-theme-provider') || root.querySelector('.resume-theme-provider') || root;
        const themePageMargin = cssPx(themeProvider, '--theme-page-margin') || DEFAULT_BOTTOM_MARGIN;

        // Top and bottom margins for every subsequent page
        const topMargin = themePageMargin;
        const bottomMargin = themePageMargin + PDF_BLEED_BUFFER;

        // ── Step 3: Process each column ────────────────────

        const columnIds = Object.keys(columns);
        const paginatedColumns = {};
        let maxPageCount = 0;

        columnIds.forEach(columnId => {
            const columnEl = root.querySelector(`[data-column-id="${columnId}"]`);
            if (!columnEl) {
                paginatedColumns[columnId] = [{ sections: [] }];
                return;
            }

            // ── 3a: Gather metrics for every section in this column ──
            const columnRect = unscaledRect(columnEl);
            const sectionEls = Array.from(
                columnEl.querySelectorAll('[data-section-id]')
            ).filter(el => el.closest('[data-column-id]') === columnEl);

            const sectionMetrics = sectionEls.map(el => {
                const sectionId = el.getAttribute('data-section-id');
                const secRect = unscaledRect(el);

                // Items inside the section (direct children only — avoid nested sections)
                let itemEls = Array.from(el.querySelectorAll('[data-item-index]'))
                    .filter(itEl => itEl.closest('[data-section-id]') === el);

                let useSubItems = false;
                if (itemEls.length === 0) {
                    itemEls = Array.from(el.querySelectorAll('[data-sub-item-index]'))
                        .filter(itEl => itEl.closest('[data-section-id]') === el);
                    useSubItems = itemEls.length > 0;
                }

                const items = itemEls.map(itEl => {
                    const itRect = unscaledRect(itEl);
                    return {
                        index: parseInt(itEl.getAttribute(useSubItems ? 'data-sub-item-index' : 'data-item-index')),
                        // Store positions RELATIVE to the section's top
                        relTop: itRect.top - secRect.top,
                        relBottom: itRect.bottom - secRect.top,
                        height: itRect.height,
                        isSubItem: useSubItems
                    };
                });

                // The section's "header height" = space BEFORE the first item
                // (includes section title, section gap/padding, etc.)
                const headerHeight = items.length > 0
                    ? items[0].relTop
                    : secRect.height; // no items → entire section is the "header"

                return {
                    id: sectionId,
                    // Position relative to column top
                    top: secRect.top - columnRect.top,
                    bottom: secRect.bottom - columnRect.top,
                    height: secRect.height,
                    headerHeight,
                    items,
                    hasItems: items.length > 0,
                    useSubItems
                };
            });

            // ── 3b: Measure real gap between consecutive sections ──
            let measuredGap = 20; // sensible fallback
            if (sectionMetrics.length >= 2) {
                const g = sectionMetrics[1].top - sectionMetrics[0].bottom;
                if (g > 0 && g < 200) measuredGap = g;
            }

            // ── 3c: Find the column's starting Y offset on Page 1 ──
            // This accounts for the header (personal info) taking up space
            // above the column.
            const pageContainer = root.querySelector('[style*="height: auto"]') ||
                root.querySelector('.resume-page') || root.firstChild;
            const pageRect = unscaledRect(pageContainer);
            const page1_columnStartY = columnRect.top - pageRect.top;

            // ── 3d: Compute per-page budgets ──
            // Page 1 budget: A4 minus column's start offset minus bottom margin
            const page1Budget = A4_HEIGHT - page1_columnStartY - bottomMargin;
            // Pages 2+: A4 minus top and bottom margins
            const subsequentBudget = A4_HEIGHT - topMargin - bottomMargin;

            // ── 3e: Walk sections and split into pages ──
            const resultPages = [];
            let currentPage = { sections: [] };
            let cursor = 0; // Y position consumed on current page (relative to page's content zone start)
            let currentBudget = page1Budget;

            sectionMetrics.forEach((section) => {
                const gapBefore = currentPage.sections.length > 0 ? measuredGap : 0;

                // ── Case A: Whole section fits ──
                if (cursor + gapBefore + section.height <= currentBudget) {
                    currentPage.sections.push({
                        id: section.id,
                        itemIndices: null,
                        isContinued: false
                    });
                    cursor += gapBefore + section.height;
                    return;
                }

                // ── Case B: Section needs splitting (has items) ──
                if (section.hasItems) {
                    let remainingItems = [...section.items];
                    let isFirstPart = true;
                    // Tracks whether this section actually committed items to a page
                    // BEFORE a page-break occurred. Only when this is true should
                    // the next chunk be labelled isContinued.
                    let committedToAPreviousPage = false;

                    // Measure the gap between consecutive items
                    let itemGap = 0;
                    if (section.items.length >= 2) {
                        itemGap = Math.max(0, section.items[1].relTop - section.items[0].relBottom);
                    }

                    while (remainingItems.length > 0) {
                        const gapBeforePart = currentPage.sections.length > 0 ? measuredGap : 0;

                        // Header for this part:
                        // Only show the continuation header height when this section
                        // ACTUALLY appeared on the previous page. If it's starting
                        // fresh on this page (isFirstPart OR nothing was committed
                        // before the last page break) use the real section header.
                        const partHeaderHeight = (isFirstPart || !committedToAPreviousPage)
                            ? section.headerHeight
                            : CONTINUATION_HEADER_HEIGHT;

                        // Remaining Y space on the current page for items
                        const spaceForItems = currentBudget - cursor - gapBeforePart - partHeaderHeight;

                        // Greedily fit as many items as possible
                        const itemsForPage = [];
                        let itemsCumulativeHeight = 0;

                        for (let i = 0; i < remainingItems.length; i++) {
                            const item = remainingItems[i];
                            const gapBeforeItem = itemsForPage.length > 0 ? itemGap : 0;
                            const candidateHeight = itemsCumulativeHeight + gapBeforeItem + item.height;

                            if (candidateHeight <= spaceForItems) {
                                itemsForPage.push(item);
                                itemsCumulativeHeight = candidateHeight;
                            } else {
                                break;
                            }
                        }

                        if (itemsForPage.length > 0) {
                            // Register this part on the current page
                            const isSubItem = section.useSubItems;
                            const indices = itemsForPage.map(it => it.index);

                            // isContinued is true ONLY if this section actually
                            // committed items to a prior page before the page break.
                            const markAsContinued = !isFirstPart && committedToAPreviousPage;

                            currentPage.sections.push({
                                id: section.id,
                                itemIndices: isSubItem ? null : indices,
                                subItemRanges: isSubItem ? {
                                    [section.id]: {
                                        start: indices[0],
                                        end: indices[indices.length - 1]
                                    }
                                } : null,
                                isContinued: markAsContinued
                            });

                            cursor += gapBeforePart + partHeaderHeight + itemsCumulativeHeight;
                            isFirstPart = false;

                            // Remove placed items
                            remainingItems = remainingItems.slice(itemsForPage.length);
                        }

                        // Start a new page if items remain
                        if (remainingItems.length > 0) {
                            if (itemsForPage.length === 0) {
                                // Nothing fit on the current page at all (e.g. section came
                                // after page 1 was already full). Push this page and restart
                                // the while loop on a fresh page — this lets the greedy fill
                                // run from scratch with full budget and cursor=0, packing ALL
                                // remaining items into ONE section entry with the correct
                                // isContinued value. Do NOT force-place a single item here
                                // because that causes a spurious second entry (and wrong
                                // "(Cont.)" label) on the same new page.
                                resultPages.push(currentPage);
                                currentPage = { sections: [] };
                                cursor = 0;
                                currentBudget = subsequentBudget;
                                // committedToAPreviousPage stays unchanged — this section had
                                // ZERO items on the page we just pushed, so it is NOT a
                                // genuine continuation on the next page.
                                continue; // restart while loop on the fresh page
                            } else {
                                // Normal page break — items WERE placed on current page,
                                // so the next chunk is a genuine continuation.
                                committedToAPreviousPage = true;
                                resultPages.push(currentPage);
                                currentPage = { sections: [] };
                                cursor = 0;
                                currentBudget = subsequentBudget;
                            }
                        }
                    }

                    return; // done with this section
                }

                // ── Case C: Section has no items and doesn't fit → move to next page ──
                if (cursor > 0) {
                    resultPages.push(currentPage);
                    currentPage = { sections: [] };
                    cursor = 0;
                    currentBudget = subsequentBudget;
                }

                currentPage.sections.push({
                    id: section.id,
                    itemIndices: null,
                    isContinued: false
                });
                cursor = section.height;

                // If this single section exceeds the page budget, push it out
                if (cursor > currentBudget) {
                    resultPages.push(currentPage);
                    currentPage = { sections: [] };
                    cursor = 0;
                    currentBudget = subsequentBudget;
                }
            });

            // Flush final page
            if (currentPage.sections.length > 0) {
                resultPages.push(currentPage);
            }

            paginatedColumns[columnId] = resultPages.length > 0 ? resultPages : [{ sections: [] }];
            maxPageCount = Math.max(maxPageCount, paginatedColumns[columnId].length);
        });

        // ── Step 4: Merge columns into unified pages ──────
        const finalPages = [];
        for (let i = 0; i < maxPageCount; i++) {
            const pageObj = {};
            columnIds.forEach(cid => {
                pageObj[cid] = paginatedColumns[cid][i]?.sections || [];
            });
            finalPages.push(pageObj);
        }

        // ── Step 5: Avoid no-op re-renders ───────────────
        const serialised = JSON.stringify(finalPages);
        if (serialised !== prevResultRef.current) {
            prevResultRef.current = serialised;
            setPages(finalPages);
        }

    }, [enabled, JSON.stringify(columns), data, scale]);

    // ── Run paginator after layout paint ────────────────
    useLayoutEffect(() => {
        if (!enabled) {
            setPages(null);
            prevResultRef.current = null; // Clear cache so re-enabling always triggers a fresh update
            return;
        }

        // Small delay lets the browser settle (font loading, CSS calc, etc.)
        const timer = setTimeout(paginate, 120);
        return () => clearTimeout(timer);
    }, [paginate, enabled, data]);

    return pages;
};
