import React, { useState, useMemo, useEffect } from 'react';
import {
    DndContext,
    pointerWithin,
    DragOverlay,
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import Page from './components/Page';
import MeasurementLayer from './components/MeasurementLayer';
import { useUnifiedPagination } from './hooks/useUnifiedPagination';

const DebugEngine3 = ({ data, templateConfig }) => {
    // --- Layout State ---
    // Initial layout from template config or data
    const initialLayout = useMemo(() => {
        // If data has a saved layout, use it?
        // Otherwise use template defaults
        return templateConfig.layout || { main: [] };
    }, [templateConfig]);


    // Dynamic Font Loading
    useEffect(() => {
        const fontLink = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap";
        const link = document.createElement('link');
        link.href = fontLink;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        return () => {
            // Keep it to be safe or remove
            // document.head.removeChild(link);
        };
    }, []);

    const [layoutState, setLayoutState] = useState(initialLayout);
    const [pageSize, setPageSize] = useState('A4');
    const [activeId, setActiveId] = useState(null);

    // --- Pagination Hook ---
    const { pages, isMeasuring, containerRef } = useUnifiedPagination(
        data,
        layoutState,
        {
            pageSize,
            paddingTop: 40,
            paddingBottom: 40,
            templateConfig
        }
    );

    // --- DnD Sensors ---
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // --- DnD Handlers ---
    const findContainer = (id) => {
        const rawId = id.split('__')[0]; // Handle suffix if we use unique IDs like 'experience__p1'
        if (rawId in layoutState) return rawId;
        return Object.keys(layoutState).find(key => layoutState[key].includes(rawId));
    };

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragOver = (event) => {
        const { active, over } = event;
        const overId = over?.id;

        if (!overId || active.id === overId) return;

        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(overId);

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            // Sorting within same container
            return;
        }

        // Moving between regions (Columns)
        const activeRawId = active.id.split('__')[0];
        const overRawId = overId.split('__')[0];

        setLayoutState(prev => {
            const activeItems = prev[activeContainer];
            const overItems = prev[overContainer];

            const activeIndex = activeItems.indexOf(activeRawId);
            const overIndex = overItems.indexOf(overRawId);

            let newIndex;
            if (overRawId in prev) {
                // Determine if over is a container (empty region drop)
                newIndex = overItems.length + 1;
            } else {
                const isBelowOverItem = over && active.rect.current.translated &&
                    active.rect.current.translated.top > over.rect.top + over.rect.height;
                const modifier = isBelowOverItem ? 1 : 0;
                newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            }

            return {
                ...prev,
                [activeContainer]: prev[activeContainer].filter(item => item !== activeRawId),
                [overContainer]: [
                    ...prev[overContainer].slice(0, newIndex),
                    activeRawId,
                    ...prev[overContainer].slice(newIndex, overItems.length)
                ]
            };
        });
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(over?.id);

        if (activeContainer && overContainer && activeContainer === overContainer) {
            const activeRawId = active.id.split('__')[0];
            const overRawId = over.id.split('__')[0];

            const activeIndex = layoutState[activeContainer].indexOf(activeRawId);
            const overIndex = layoutState[overContainer].indexOf(overRawId);

            if (activeIndex !== overIndex) {
                setLayoutState((prev) => ({
                    ...prev,
                    [activeContainer]: arrayMove(prev[activeContainer], activeIndex, overIndex),
                }));
            }
        }
        setActiveId(null);
    };


    return (
        <div style={{ fontFamily: 'sans-serif', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {/* Controls */}
            <div style={{
                position: 'fixed', top: 20, zIndex: 1000,
                background: 'white', padding: '10px 20px', borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', gap: '20px'
            }}>
                <strong>Debug Engine 3.0</strong>
                <select value={pageSize} onChange={e => setPageSize(e.target.value)} style={{ padding: '5px' }}>
                    <option value="A4">A4</option>
                    <option value="LETTER">Letter</option>
                </select>
                <div style={{ color: isMeasuring ? 'orange' : 'green' }}>
                    {isMeasuring ? 'Calc Layout...' : `${pages.length} Pages`}
                </div>
            </div>

            {/* Measurement Layer (Hidden) */}
            <MeasurementLayer
                containerRef={containerRef}
                data={data}
                layoutState={layoutState} // Dynamic Layout
                templateConfig={templateConfig}
                pageSize={pageSize}
            />

            {/* Render Pages */}
            <div style={{ marginTop: '60px' }}>
                <DndContext
                    sensors={sensors}
                    collisionDetection={pointerWithin}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    {isMeasuring ? (
                        <div style={{ marginTop: '100px', color: '#fff' }}>Processing Layout Logic...</div>
                    ) : (
                        pages.map((pageData, idx) => (
                            <Page
                                key={idx}
                                pageIndex={idx}
                                pageData={pageData}
                                data={data}
                                templateConfig={templateConfig}
                                pageSize={pageSize}
                            />
                        ))
                    )}

                    <DragOverlay>
                        {/* Simple overlay for dragging */}
                        {activeId ? (
                            <div style={{
                                padding: '20px',
                                background: 'rgba(59, 130, 246, 0.9)',
                                color: 'white',
                                borderRadius: '8px',
                                width: '300px'
                            }}>
                                Moving Section...
                            </div>
                        ) : null}
                    </DragOverlay>
                </DndContext>
            </div>
        </div>
    );
};

export default DebugEngine3;
