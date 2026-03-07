import React, { useMemo, useState, useEffect, useLayoutEffect, useRef } from 'react';
import SectionRenderer from '../templates/common/SectionRenderer';
import { ZonalSectionHeader } from '../templates/common/BaseComponents';
import MetricCollector from './MetricCollector';
import { allocatePages } from './PageAllocator';

// DnD Imports
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, KeyboardSensor } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useResumeDragAndDrop, StableResumeDragOverlay } from '../hooks/useResumeDragAndDrop';

/**
 * SortableSection
 * Wrapper for sections that are sortable handles.
 */
const SortableSection = ({ id, children }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.0 : 1, // Hide original when dragging (classic look)
        position: 'relative'
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="sortable-section-wrapper">
            {/* Drag Handle Indicator */}
            <div className="section-drag-handle-indicator" style={{
                position: 'absolute',
                left: '-20px',
                top: '0',
                bottom: '0',
                width: '20px',
                cursor: 'grab',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                transition: 'opacity 0.2s',
                color: '#cbd5e1'
            }}>
                ⋮⋮
            </div>

            <div style={{ pointerEvents: isDragging ? 'none' : 'auto' }}>
                {children}
            </div>

            <style jsx>{`
                .sortable-section-wrapper:hover .section-drag-handle-indicator {
                    opacity: 1;
                }
            `}</style>
        </div>
    );
};

/**
 * PaginatedCanvas
 * 
 * The main component that orchestrates the "Measure -> Distribute -> Render" cycle.
 * Features:
 * 1. MetricCollector (Draft Mode) measures content.
 * 2. PageAllocator distributes content.
 * 3. Self-Healing: Checks for overflow and re-allocates if needed.
 */
const PaginatedCanvas = ({
    data,
    width = "210mm",
    pageHeight = "297mm",
    config = {},
    sectionsOrder,
    onReorder
}) => {
    const [metrics, setMetrics] = useState(null);
    const [pages, setPages] = useState([]);

    // Safety Buffer State: Can be adjusted by Self-Healing
    // Start optimistic (1040px) to minimize gaps.
    // If overflow detected, we lower this value.
    const [safetyBuffer, setSafetyBuffer] = useState(0);
    const MAX_PAGE_HEIGHT_PX = 1080; // Absolute max A4 content height (297mm - 40px - 40px pads)

    // Page Refs for Overflow Detection
    const pageRefs = useRef([]);

    // --- DnD Setup ---
    const isDndEnabled = !!onReorder;
    const { dndContextProps, activeId, dragStartContainerId } = useResumeDragAndDrop({
        data,
        onReorder,
        containers: { main: sectionsOrder || [] }
    });

    // 1. Receive Metrics from Draft Mode
    const handleMetricsReady = (newMetrics) => {
        // Only update if metrics actually changed (deep comparison/hash could maximize performance)
        // For now, we trust the collector.
        setMetrics(newMetrics);
    };

    // 2. Allocator Effect
    useLayoutEffect(() => {
        if (metrics && sectionsOrder) {
            // Effective Height = Max - Buffer
            const effectiveHeight = MAX_PAGE_HEIGHT_PX - safetyBuffer;

            const allocated = allocatePages(metrics, sectionsOrder, effectiveHeight);
            setPages(allocated);
        }
    }, [metrics, sectionsOrder, safetyBuffer]);

    // 3. Self-Healing Effect (Overflow Check)
    useLayoutEffect(() => {
        if (pages.length === 0) return;

        // Check each page for overflow
        let maxOverflow = 0;

        pageRefs.current.forEach((pageEl) => {
            if (!pageEl) return;
            // ScrollHeight > ClientHeight means content is clipped
            const overflow = pageEl.scrollHeight - pageEl.clientHeight;
            if (overflow > 1) { // 1px tolerance
                maxOverflow = Math.max(maxOverflow, overflow);
            }
        });

        if (maxOverflow > 0) {
            console.warn(`[Pagination] Overflow detected: ${maxOverflow}px. Increasing safety buffer.`);
            // Increase buffer and trigger re-render
            setSafetyBuffer(prev => prev + maxOverflow + 10); // Add overflow + extra 10px padding
        } else {
            // If we have a huge buffer and NO overflow, maybe we can relax it? 
            // (Optional: "Healing Up" - risky, could cause oscillation. Let's stick to "Healing Down" to fix cutoffs.)
        }

    }, [pages]); // Run after every page render

    if (!metrics) {
        return (
            <>
                <div className="pagination-loading">Processing Layout...</div>
                <MetricCollector
                    data={data}
                    config={config}
                    onMetricsReady={handleMetricsReady}
                />
            </>
        );
    }

    const renderContent = () => (
        <div className="paginated-canvas-root">
            {/* 
                Keep Collector mounted to detect font loads / resizes.
                It's hidden but active.
             */}
            <MetricCollector
                data={data}
                config={config}
                onMetricsReady={handleMetricsReady}
            />

            <SortableContext
                items={sectionsOrder || []}
                strategy={verticalListSortingStrategy}
            >
                {pages.map((page, pageIndex) => (
                    <div
                        key={pageIndex}
                        ref={el => pageRefs.current[pageIndex] = el}
                        className="resume-page-sheet"
                        style={{
                            width: width,
                            height: pageHeight,
                            background: 'white',
                            marginBottom: '20px',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                            padding: '40px', // Fixed Page Padding
                            boxSizing: 'border-box',
                            position: 'relative',
                            overflow: 'hidden', // Clip content so we can detect scrollHeight > clientHeight
                            // Theme Variables
                            '--theme-color': config?.themeColor,
                            ...config?.themeStyles
                        }}
                    >
                        {/* Page Content */}
                        {page.sections.map((section, sIdx) => {
                            if (section.isContinued) {
                                return (
                                    <div key={`${section.id}-continued`} className="page-section-block continued" style={{ opacity: 0.8 }}>
                                        <SectionRenderer
                                            sectionId={section.id}
                                            data={data}
                                            itemIndices={section.items} // Array of indices (flattened by allocator)
                                            isContinued={true}
                                            subItemRanges={section.subItemRanges}
                                            variants={config?.variants}
                                        />
                                    </div>
                                );
                            } else {
                                return (
                                    <div key={section.id} className="page-section-block">
                                        {/* Only wrap head of section in Sortable if needed */}
                                        <SortableSection id={section.id}>
                                            <SectionRenderer
                                                sectionId={section.id}
                                                data={data}
                                                itemIndices={section.items}
                                                isContinued={false}
                                                subItemRanges={section.subItemRanges}
                                                variants={config?.variants}
                                            />
                                        </SortableSection>
                                    </div>
                                );
                            }
                        })}

                        <div className="page-number" style={{
                            position: 'absolute',
                            bottom: '15px',
                            right: '25px',
                            fontSize: '10px',
                            color: '#cbd5e1'
                        }}>
                            Page {pageIndex + 1} of {pages.length}
                        </div>
                    </div>
                ))}
            </SortableContext>

            <StableResumeDragOverlay
                activeId={activeId}
                dragStartContainerId="main"
                renderSection={(id) => (
                    <div style={{ background: 'white', padding: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                        <SectionRenderer
                            sectionId={id}
                            data={data}
                            isSpellCheckActive={false}
                        />
                    </div>
                )}
            />
        </div>
    );

    if (!isDndEnabled) {
        return renderContent();
    }

    return (
        <DndContext {...dndContextProps}>
            {renderContent()}
        </DndContext>
    );
};

export default PaginatedCanvas;
