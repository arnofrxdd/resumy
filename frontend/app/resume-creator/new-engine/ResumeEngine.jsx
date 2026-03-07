import React, { useState, useEffect } from 'react';
import { DndContext, pointerWithin, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import Page from './components/Page';
import MeasurementLayer from './components/MeasurementLayer';
import { useSurgicalPagination } from './hooks/useSurgicalPagination';

const ResumeEngine = ({ data, config }) => {
    // 1. Local state for layout (Region -> [SectionIDs])
    // Fallback to data.layout or a default single column
    const [layoutState, setLayoutState] = useState(data.layout || { main: data.sectionOrder || [] });

    // 2. Pagination Logic
    // Must pass the layout configuration (region definitions) AND the current content (layoutState)
    // config.templateConfig contains region definitions (width, etc.)

    // Effect: Sync layoutState when template changes if regions mismatch
    useEffect(() => {
        const templateConfig = config.templateConfig || {};
        const actualConfig = templateConfig.config || templateConfig;

        if (templateConfig.defaultLayout) {
            const templateRegions = Object.keys(actualConfig.regions || {});
            const currentRegions = Object.keys(layoutState);

            const isMismatch =
                templateRegions.length !== currentRegions.length ||
                !templateRegions.every(r => currentRegions.includes(r));

            if (isMismatch) {
                console.log("Template mismatch detected, resetting layout to:", templateConfig.defaultLayout);
                setLayoutState(templateConfig.defaultLayout);
            }
        }
    }, [config.templateConfig]);

    const { pages, isMeasuring, containerRef } = useSurgicalPagination(
        data,
        layoutState,
        {
            pageSize: config.pageSize,
            bottomGap: config.bottomGap,
            templateConfig: config.templateConfig || mockTemplateConfig // fallback
        }
    );

    // 3. DnD Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Require 5px movement before drag starts
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const [activeId, setActiveId] = useState(null);

    // DnD Handlers (Multi-Container)
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

        // Moving between containers
        setLayoutState((prev) => {
            const activeItems = prev[activeContainer];
            const overItems = prev[overContainer];
            const activeIndex = activeItems.indexOf(active.id);
            const overIndex = overItems.indexOf(overId);

            let newIndex;
            if (overId in prev) {
                newIndex = overItems.length + 1;
            } else {
                const isBelowOverItem =
                    over &&
                    active.rect.current.translated &&
                    active.rect.current.translated.top > over.rect.top + over.rect.height;

                const modifier = isBelowOverItem ? 1 : 0;
                newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            }

            return {
                ...prev,
                [activeContainer]: [
                    ...prev[activeContainer].filter((item) => item !== active.id)
                ],
                [overContainer]: [
                    ...prev[overContainer].slice(0, newIndex),
                    active.id,
                    ...prev[overContainer].slice(newIndex, prev[overContainer].length)
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

    return (
        <div className="resume-engine-root" style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>

            {/* Hidden Measurement Layer - now needs to measure per region */}
            <MeasurementLayer
                containerRef={containerRef}
                data={data}
                layoutState={layoutState}
                templateConfig={config.templateConfig}
            />

            <DndContext
                sensors={sensors}
                collisionDetection={pointerWithin}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                {/* 
                   We don't Wrap everything in one SortableContext anymore.
                   The Page component will declare SortableContexts for each region 
                */}

                {isMeasuring ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>Calculating Multi-Layout...</div>
                ) : (
                    pages.map((pageData, pageIndex) => (
                        <Page
                            key={pageIndex}
                            pageIndex={pageIndex}
                            pageData={pageData}
                            data={data}
                            templateConfig={config.templateConfig}
                            variants={config.variants}
                        />
                    ))
                )}

                <DragOverlay>
                    {activeId ? (
                        <div style={{ padding: '15px', background: 'rgba(59, 130, 246, 0.9)', color: 'white', borderRadius: '4px', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
                            Moving Section...
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};

// Helper for Mock Config
const mockTemplateConfig = {
    regions: {
        sidebar: { width: '30%', styles: { background: '#f1f5f9', padding: '15px' } },
        main: { width: '70%', styles: { padding: '15px' } }
    },
    containerStyles: { display: 'flex', flexDirection: 'row' }
};

export default ResumeEngine;
