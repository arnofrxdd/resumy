import React, { useRef } from 'react';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- ENGINE IMPORTS ---
import SectionRenderer from '../common/SectionRenderer';
import { useResumeDragAndDrop, DroppableZone, StableResumeDragOverlay } from '../../hooks/useResumeDragAndDrop';
import { useAutoPagination } from '../../hooks/useAutoPagination';

// --- STYLES ---
import './SimpleColumn.css';

// --- SORTABLE WRAPPER ---
// Wraps each section to make it draggable
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
        opacity: isDragging ? 0.4 : 1,
        position: 'relative',
        touchAction: 'none'
    };

    return (
        <div ref={setNodeRef} style={style} className="sortable-section-wrapper">
            {/* Drag Handle - Only visible on hover in editor */}
            <div className="section-drag-handle" {...attributes} {...listeners}>
                ⋮⋮
            </div>
            {children}
        </div>
    );
};

// --- MAIN COMPONENT ---
const SimpleColumn = ({
    data,
    onSectionClick,
    onReorder,
    scale,
    isSpellCheckActive,
    onSpellCheckIgnore,
    onSpellCheckReplace,
    layoutConfig, // e.g. { main: [...] }
    showPageBreaks
}) => {
    const containerRef = useRef(null);

    // 1. Setup Drag and Drop
    const { dndContextProps, activeId, dragStartContainerId } = useResumeDragAndDrop({
        data,
        onReorder,
        scale,
        containers: {
            // "main" is our logical ID. The hook handles -p0, -p1 mapping if needed,
            // but for the source of truth, we pass the raw list from data/layout.
            "main": data.sectionsOrder || layoutConfig.main || []
        }
    });

    // 2. Setup Pagination
    // We pass the *ordered* lists so pagination knows what to render
    const pages = useAutoPagination({
        data,
        columns: {
            "main": data.sectionsOrder || layoutConfig.main || []
        },
        enabled: true, // Always paginate for A4 compliance
        scale,
        containerRef
    });

    // 3. Render Helper
    const renderSection = (sectionId, index, isContinued = false, itemIndices = null, subItemRanges = {}) => {
        if (!sectionId) return null;
        return (
            <SectionRenderer
                key={`${sectionId}-${index}-${isContinued ? 'cont' : 'start'}`}
                sectionId={sectionId}
                data={data}
                onSectionClick={onSectionClick}
                isSpellCheckActive={isSpellCheckActive}
                onSpellCheckIgnore={onSpellCheckIgnore}
                onSpellCheckReplace={onSpellCheckReplace}
                isContinued={isContinued}
                itemIndices={itemIndices}
                subItemRanges={subItemRanges}
            />
        );
    };

    return (
        <DndContext {...dndContextProps}>
            <div
                className="resume-template simple-column"
                ref={containerRef}
                style={{
                    minHeight: '297mm', // A4 min height
                    padding: 'var(--theme-page-margin, 40px)', // Uses theme var
                    position: 'relative'
                }}
            >
                {/* --- HEADER (Fixed at top of Page 1 usually, or repeated if needed) --- 
                    For this simple template, let's put it on Page 1 only.
                */}


                {/* --- MEASUREMENT LAYER --- 
                    Critically important: This renders ALL contents invisibly first.
                    useAutoPagination measures these elements to decide how to split them.
                */}
                <div
                    className="measurement-layer"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        padding: 'var(--theme-page-margin, 40px)', // Must match page padding
                        visibility: 'hidden',
                        zIndex: -1,
                        pointerEvents: 'none'
                    }}
                >
                    <div data-column-id="main">
                        {(data.sectionsOrder || layoutConfig.main || []).map((sectionId, index) => (
                            <SectionRenderer
                                key={sectionId}
                                sectionId={sectionId}
                                data={data}
                                onSectionClick={onSectionClick}
                                // Pass full content for measurement
                                isSpellCheckActive={false}
                            />
                        ))}
                    </div>
                </div>

                {/* --- RENDER PAGES --- */}
                {pages && pages.map((page, pageIndex) => (
                    <div
                        key={pageIndex}
                        className="resume-page"
                        data-page-number={pageIndex + 1}
                        style={{
                            position: 'relative',
                            height: '297mm', // Exact A4
                            // If it's not the first page, we might adding margin-top for visualization in continuous view
                            // but usually the renderer handles the wrapper spacing.
                        }}
                    >

                        {/* PERSONAL HEADER - RENDERS ONLY ON PAGE 1 */}
                        {pageIndex === 0 && (
                            <div className="simple-header" style={{ marginBottom: '30px', textAlign: 'center' }}>
                                <h1 style={{
                                    margin: '0 0 10px 0',
                                    fontSize: '32px',
                                    fontWeight: '800',
                                    textTransform: 'uppercase',
                                    color: 'var(--theme-color)', // Uses interactive theme color
                                    letterSpacing: '1px'
                                }}>
                                    {data.personal?.name || "Your Name"}
                                </h1>
                                <div style={{
                                    fontSize: '14px',
                                    color: '#64748b',
                                    display: 'flex',
                                    gap: '12px',
                                    justifyContent: 'center',
                                    flexWrap: 'wrap'
                                }}>
                                    {data.personal?.email && <span>{data.personal.email}</span>}
                                    {data.personal?.phone && <span>{data.personal.phone}</span>}
                                    {data.personal?.city && <span>{data.personal.city}{data.personal?.country && `, ${data.personal.country}`}</span>}
                                    {data.personal?.linkedin && <span>LinkedIn</span>}
                                    {data.personal?.website && <span>Portfolio</span>}
                                </div>
                            </div>
                        )}

                        {/* COLUMN CONTENT */}
                        <SortableContext
                            id={`main-p${pageIndex}`} // Unique ID per page column
                            items={page.main || []} // The sections on this page
                            strategy={verticalListSortingStrategy}
                        >
                            <DroppableZone
                                id={`main-p${pageIndex}`}
                                style={{
                                    minHeight: '50px',
                                    height: '100%',
                                    // Visual debug for droppable area if needed
                                }}
                                data-column-id="main"
                            >
                                {(page.main || []).map((section, sectionIndex) => (
                                    <SortableSection key={section.id} id={section.id}>
                                        {renderSection(
                                            section.id,
                                            sectionIndex,
                                            section.isContinued,
                                            section.itemIndices
                                        )}
                                    </SortableSection>
                                ))}
                            </DroppableZone>
                        </SortableContext>
                    </div>
                ))}
            </div>

            {/* --- DRAG OVERLAY --- */}
            {/* Prevents ghosting/drifting by rendering active item in a portal */}
            <StableResumeDragOverlay
                activeId={activeId}
                dragStartContainerId={dragStartContainerId}
                scale={scale}
                renderSection={(id) => (
                    <div style={{ background: 'white', padding: '10px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                        {renderSection(id, 0)}
                    </div>
                )}
            />
        </DndContext>
    );
};

export default SimpleColumn;
