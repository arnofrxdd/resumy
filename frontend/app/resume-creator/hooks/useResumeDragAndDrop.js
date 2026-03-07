import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
    useSensor,
    useSensors,
    PointerSensor,
    TouchSensor,
    KeyboardSensor,
    DragOverlay,
    MeasuringStrategy,
    useDroppable,
    pointerWithin,
    rectIntersection,
    closestCenter,
    defaultCoordinatesGetter
} from '@dnd-kit/core';
import {
    sortableKeyboardCoordinates,
    arrayMove,
} from '@dnd-kit/sortable';

/**
 * useResumeDragAndDrop
 * Rebuilt for high-performance resume section reordering.
 * Fixes "Ghost Drift" by ensuring stable component references and 
 * using a more robust collision detection strategy.
 */
export const useResumeDragAndDrop = ({
    data,
    onReorder,
    scale = 1,
    containers = {} // Expects { containerId: itemsArray, ... }
}) => {
    const [activeId, setActiveId] = useState(null);
    const [dragStartContainerId, setDragStartContainerId] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 15 },
        }),
        useSensor(TouchSensor, {
            // High tolerance is key for scaled mobile screens to avoid jitter-cancel
            activationConstraint: { delay: 250, tolerance: 25 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Map actual container ID to logical container key (e.g. 'main-p1' -> 'main')
    const getLogicalContainer = useCallback((cid) => {
        if (!cid) return null;
        // Strip pagination suffix strictly if it exists (-p0, -p1, etc)
        // This allows any name like 'center', 'right', 'footer' to work
        return cid.replace(/-p\d+$/, '');
    }, []);

    // Find which container holds a specific item ID
    const findContainer = useCallback((id) => {
        if (!id) return null;
        // If it's one of the known containers directly
        if (id in containers) return id;

        // If it's a prefixed container ID (e.g. 'main-p0')
        const logical = getLogicalContainer(id);
        if (logical in containers) return logical;

        // If it's an item ID, find which container holds it
        const logicalKey = Object.keys(containers).find((key) => containers[key].includes(id));
        if (logicalKey) return logicalKey;

        return null;
    }, [containers, getLogicalContainer]);

    const handleDragStart = useCallback((event) => {
        const { active } = event;
        setActiveId(active.id);
        setDragStartContainerId(findContainer(active.id));
    }, [findContainer]);

    const handleDragOver = useCallback((event) => {
        const { active, over } = event;
        if (!over || !active) return;

        const activeId = active.id;
        const overId = over.id;

        const activeContainer = findContainer(activeId);
        const overContainerRaw = (overId in containers || findContainer(overId)) ? (overId in containers ? overId : findContainer(overId)) : null;
        const overContainer = getLogicalContainer(overContainerRaw);

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return;
        }

        // --- CROSS-CONTAINER LOGIC ---
        const activeItems = containers[activeContainer];
        const overItems = containers[overContainer];

        if (!activeItems || !overItems) return;

        const overIndex = overItems.indexOf(overId);

        let newIndex;
        // Correct check for "over the container itself" (either raw or paginated version)
        const isOverContainer = (overId === overContainer) ||
            (typeof overId === 'string' && overId.startsWith(`${overContainer}-p`));

        if (isOverContainer) {
            // Over the empty container itself
            newIndex = overItems.length;
        } else {
            // Over another item
            const isBelowLastItem = overIndex === overItems.length - 1;
            const modifier = isBelowLastItem ? 1 : 0;
            newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length;
        }

        // Construct the new structure
        const nextState = {
            ...containers,
            [activeContainer]: activeItems.filter((item) => item !== activeId),
            [overContainer]: [
                ...overItems.slice(0, newIndex),
                activeId,
                ...overItems.slice(newIndex)
            ]
        };

        // DE-DUPLICATION
        nextState[activeContainer] = [...new Set(nextState[activeContainer])];
        nextState[overContainer] = [...new Set(nextState[overContainer])];

        const reorderData = {};
        Object.keys(nextState).forEach(key => {
            // Use the key directly to match the containers provided
            reorderData[key] = nextState[key];
        });

        onReorder(reorderData);
    }, [containers, findContainer, getLogicalContainer, onReorder]);

    const handleDragEnd = useCallback((event) => {
        const { active, over } = event;
        setActiveId(null);
        setDragStartContainerId(null);

        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        const activeContainer = findContainer(activeId);
        const overContainerRaw = (overId in containers || findContainer(overId)) ? (overId in containers ? overId : findContainer(overId)) : null;
        const overContainer = getLogicalContainer(overContainerRaw);

        if (!activeContainer || !overContainer || activeContainer !== overContainer) {
            return;
        }

        const activeIndex = containers[activeContainer].indexOf(activeId);
        let overIndex = containers[overContainer].indexOf(overId);

        // If dropping on the container itself (empty bottom space), move to end
        if (overIndex === -1 && activeContainer === overContainer) {
            overIndex = containers[activeContainer].length - 1;
        }

        if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
            const newItems = arrayMove(containers[activeContainer], activeIndex, overIndex);

            const reorderData = {
                ...containers,
                [activeContainer]: newItems
            };

            onReorder(reorderData);
        }
    }, [containers, findContainer, getLogicalContainer, onReorder]);

    // Optimize collision detection for snappy reordering
    const collisionDetectionStrategy = useCallback((args) => {
        // closestCenter is the most reliable for reordering lists where elements slide
        return closestCenter(args);
    }, []);

    // Return stable props for the context
    const dndContextProps = useMemo(() => ({
        sensors,
        collisionDetection: collisionDetectionStrategy,
        onDragStart: handleDragStart,
        onDragOver: handleDragOver,
        onDragEnd: handleDragEnd,
        measuring: {
            droppable: { strategy: MeasuringStrategy.Always },
        },
    }), [sensors, collisionDetectionStrategy, handleDragStart, handleDragOver, handleDragEnd]);

    return {
        activeId,
        dragStartContainerId,
        dndContextProps
    };
};

/**
 * StableResumeDragOverlay
 * A separate component to prevent remounting issues during drag.
 * Handles portals and scaling internally.
 */
export const StableResumeDragOverlay = ({ activeId, dragStartContainerId, scale = 1, renderSection }) => {
    // We use a portal to document.body to escape any overflow:hidden or scaled containers
    // BUT we must re-apply the scale to the content inside the overlay so it matches visually.

    if (typeof document === 'undefined' || !activeId) return null;

    return createPortal(
        <DragOverlay
            dropAnimation={{
                duration: 200,
                easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
            }}
            // Use zIndex to ensure it's above the sidebar/modals
            zIndex={10000}
        >
            <div style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
                pointerEvents: 'none', // Critical: overlay shouldn't block pointer events for collision
                opacity: 0.9,
            }}>
                {renderSection ? renderSection(activeId, dragStartContainerId) : null}
            </div>
        </DragOverlay>,
        document.body
    );
};

export const DroppableZone = ({ id, children, style = {} }) => {
    const { setNodeRef } = useDroppable({ id });
    // minHeight ensures the zone is "hittable" even when empty.
    // NOTE: Do NOT set height:'100%' here — it caused Measurer columns to bloat
    // to the full parent height, corrupting the paginator's budget calculation.
    return (
        <div
            ref={setNodeRef}
            style={{
                minHeight: '100px',
                ...style
            }}
        >
            {children}
        </div>
    );
};

