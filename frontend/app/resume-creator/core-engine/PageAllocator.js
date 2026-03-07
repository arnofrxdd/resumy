/**
 * Dummy PageAllocator.js to fix build errors.
 * The original file was missing.
 */
export const allocatePages = (metrics, sectionsOrder, effectiveHeight) => {
    console.warn("Using Dummy PageAllocator");
    // Return all sections in a single page to avoid crash
    return [{
        sections: sectionsOrder.map(id => ({
            id,
            items: [], // Dummy items
            subItemRanges: [],
            isContinued: false
        }))
    }];
};
