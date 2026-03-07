import React, { useState, useEffect, useMemo } from 'react';
import {
    DndContext,
    pointerWithin,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import Page from './components/Page';
import MeasurementLayer from './components/MeasurementLayer';
import { useSurgicalPagination } from './hooks/useSurgicalPagination';

/**
 * DebugEngine2 - Advanced Resume Word Processor
 * Supports:
 * - Pagination with Surgical Splitting
 * - Any Layout (Dynamic Columns/Rows)
 * - A4 / Letter Support
 * - Drag and Drop (Cross-Page, Cross-Region)
 * - Section Continuation Headers
 */
const DebugEngine2 = ({ data, config = {} }) => {
    // 1. Layout State Management (Region -> [SectionIDs])
    // We derive the initial layout from data.layout or Fallback to a single 'main' column
    const initialLayout = useMemo(() => {
        if (data.layout && Object.keys(data.layout).length > 0) return data.layout;
        if (data.sectionOrder) return { main: data.sectionOrder };
        return { main: Object.keys(data).filter(k => k !== 'personal' && k !== 'layout' && k !== 'sectionOrder') };
    }, [data.layout, data.sectionOrder]);

    const [layoutState, setLayoutState] = useState(initialLayout);
    const [pageSize, setPageSize] = useState(config.pageSize || 'A4');
    const [activeId, setActiveId] = useState(null);

    // Sync layout when data changes (e.g. from form)
    useEffect(() => {
        if (data.layout) setLayoutState(data.layout);
    }, [data.layout]);

    // 2. Pagination Hook
    const { pages, isMeasuring, containerRef } = useSurgicalPagination(
        data,
        layoutState,
        {
            pageSize: pageSize,
            bottomGap: config.bottomGap || 0,
            paddingTop: config.paddingTop || 40,
            paddingBottom: config.paddingBottom || 40,
            templateConfig: config.templateConfig
        }
    );

    // 3. DnD Setup
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const findContainer = (id) => {
        if (id in layoutState) return id;
        return Object.keys(layoutState).find((key) => layoutState[key].includes(id));
    };

    const handleDragStart = (event) => setActiveId(event.active.id);

    const handleDragOver = (event) => {
        const { active, over } = event;
        const overId = over?.id;

        if (!overId || active.id === overId) return;

        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(overId);

        if (!activeContainer || !overContainer || activeContainer === overContainer) return;

        setLayoutState((prev) => {
            const activeItems = prev[activeContainer];
            const overItems = prev[overContainer];
            const activeIndex = activeItems.indexOf(active.id);
            const overIndex = overItems.indexOf(overId);

            let newIndex;
            if (overId in prev) {
                newIndex = overItems.length + 1;
            } else {
                const isBelowOverItem = over && active.rect.current.translated &&
                    active.rect.current.translated.top > over.rect.top + over.rect.height;
                const modifier = isBelowOverItem ? 1 : 0;
                newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            }

            return {
                ...prev,
                [activeContainer]: prev[activeContainer].filter((item) => item !== active.id),
                [overContainer]: [
                    ...prev[overContainer].slice(0, newIndex),
                    active.id,
                    ...prev[overContainer].slice(newIndex)
                ]
            };
        });
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(over?.id);

        if (activeContainer && overContainer && activeContainer === overContainer) {
            const activeIndex = layoutState[activeContainer].indexOf(active.id);
            const overIndex = layoutState[overContainer].indexOf(over.id);

            if (activeIndex !== overIndex) {
                setLayoutState((prev) => ({
                    ...prev,
                    [activeContainer]: arrayMove(prev[activeContainer], activeIndex, overIndex),
                }));
            }
        }
        setActiveId(null);
    };

    const dropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0.5',
                },
            },
        }),
    };

    return (
        <div className="debug-engine-2-root" style={{
            fontFamily: "'Inter', sans-serif",
            background: '#0f172a', // Much darker background (Slate 900)
            minHeight: '100vh',
            padding: '60px 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '50px' // More gap between pages
        }}>
            {/* Control Bar */}
            <div style={{
                width: pageSize === 'LETTER' ? '215.9mm' : '210mm',
                background: '#ffffff',
                padding: '12px 24px',
                borderRadius: '12px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: '20px',
                zIndex: 1000,
                border: '1px solid #1e293b'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>DEBUG ENGINE 2.0</h2>
                    <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>Universal Logic • Surgical Splitting</div>
                </div>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{
                        background: '#3b82f6', // Bright Blue
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '800',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)'
                    }}>
                        <span style={{ width: '8px', height: '8px', background: '#4ade80', borderRadius: '50%', boxShadow: '0 0 8px #4ade80' }}></span>
                        {pages.length} {pages.length === 1 ? 'PAGE' : 'PAGES'} GENERATED
                    </div>
                    <select
                        value={pageSize}
                        onChange={(e) => setPageSize(e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', cursor: 'pointer', background: '#fff' }}
                    >
                        <option value="A4">A4 (210x297mm)</option>
                        <option value="LETTER">Letter (8.5x11in)</option>
                    </select>
                    <button
                        onClick={() => console.log('Current Layout:', layoutState)}
                        style={{ padding: '8px 16px', borderRadius: '6px', background: '#0f172a', color: '#fff', border: 'none', cursor: 'pointer' }}
                    >
                        Export Layout
                    </button>
                </div>
            </div>

            {/* Hidden Measurement Layer - MUST match Page layout exactly */}
            <div style={{ position: 'fixed', top: -10000, left: -10000, pointerEvents: 'none' }}>
                <MeasurementLayer
                    containerRef={containerRef}
                    data={data}
                    layoutState={layoutState}
                    templateConfig={config.templateConfig}
                    pageSize={pageSize}
                />
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={pointerWithin}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                {isMeasuring ? (
                    <div style={{ height: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                        <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                        <span style={{ fontWeight: 500, color: '#64748b' }}>Recalculating Pagination...</span>
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : (
                    <div className="pages-container" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        {pages.map((pageData, pageIndex) => (
                            <Page
                                key={pageIndex}
                                pageIndex={pageIndex}
                                pageData={pageData}
                                data={data}
                                config={{
                                    ...config,
                                    pageSize,
                                    templateConfig: config.templateConfig
                                }}
                            />
                        ))}
                    </div>
                )}

                <DragOverlay dropAnimation={dropAnimation}>
                    {activeId ? (
                        <div style={{
                            padding: '10px 20px',
                            background: '#3b82f6',
                            color: 'white',
                            borderRadius: '6px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                            fontWeight: 'bold',
                            border: '2px solid #2563eb'
                        }}>
                            Moving {activeId}...
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            {/* State Monitor */}
            <div style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                background: 'rgba(15, 23, 42, 0.9)',
                color: '#4ade80',
                padding: '15px',
                borderRadius: '8px',
                fontSize: '0.75rem',
                maxWidth: '300px',
                backdropFilter: 'blur(4px)',
                border: '1px solid #334155'
            }}>
                <div style={{ color: '#94a3b8', borderBottom: '1px solid #334155', paddingBottom: '5px', marginBottom: '8px', fontWeight: 'bold' }}>LAYOUT DATA STREAM</div>
                <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {Object.entries(layoutState).map(([region, items]) => (
                        <div key={region} style={{ marginBottom: '4px' }}>
                            <strong style={{ color: '#3b82f6' }}>{region}:</strong> {items.join(', ')}
                        </div>
                    ))}
                </div>
                <div style={{ marginTop: '10px', color: '#f59e0b' }}>
                    PAGES: {pages.length} | SIZE: {pageSize}
                </div>
            </div>
        </div>
    );
};

export default DebugEngine2;
