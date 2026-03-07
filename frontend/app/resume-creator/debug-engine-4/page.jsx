"use client";

import React, { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { STRESS_TEST_DATA } from '../core-engine-final/data/stressData';
import { useSurgicalPagination } from '../core-engine-final/hooks/useSurgicalPagination';
import MeasurementLayer from '../core-engine-final/components/MeasurementLayer';
import Page from '../core-engine-final/components/Page';

export default function DebugEngine4() {
    const [data, setData] = useState(STRESS_TEST_DATA);
    const [layoutState, setLayoutState] = useState({
        main: ["summary", "experience", "education"],
        sidebar: ["skills", "languages"]
    });

    const { pages, isMeasuring, containerRef } = useSurgicalPagination(data, layoutState);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setLayoutState((prev) => {
                const activeRegion = Object.keys(prev).find(key => prev[key].includes(active.id));
                const overRegion = Object.keys(prev).find(key => prev[key].includes(over.id));

                if (activeRegion === overRegion) {
                    const oldIndex = prev[activeRegion].indexOf(active.id);
                    const newIndex = prev[activeRegion].indexOf(over.id);
                    return {
                        ...prev,
                        [activeRegion]: arrayMove(prev[activeRegion], oldIndex, newIndex)
                    };
                } else {
                    // Moving between regions
                    const activeItems = [...prev[activeRegion]];
                    const overItems = [...prev[overRegion]];
                    const activeIdx = activeItems.indexOf(active.id);
                    const overIdx = overItems.indexOf(over.id);

                    activeItems.splice(activeIdx, 1);
                    overItems.splice(overIdx, 0, active.id);

                    return {
                        ...prev,
                        [activeRegion]: activeItems,
                        [overRegion]: overItems
                    };
                }
            });
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f0f2f5', padding: '40px' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '24px', color: '#1a1a1b' }}>Debug Engine 4.0: Surgical Flow</h1>
                        <p style={{ margin: '5px 0 0 0', color: '#666' }}>Testing multi-page bullet splitting and recursive pagination logic.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <div style={{
                            padding: '8px 16px',
                            background: isMeasuring ? '#fff3cd' : '#d4edda',
                            color: isMeasuring ? '#856404' : '#155724',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            border: '1px solid currentColor'
                        }}>
                            {isMeasuring ? 'Engine Calculating...' : `${pages.length} Pages Generated`}
                        </div>
                        <button
                            onClick={() => setData({ ...data })}
                            style={{ padding: '8px 16px', background: '#666', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            Force Recalculate
                        </button>
                        <button
                            onClick={() => window.print()}
                            style={{ padding: '8px 16px', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            Print to PDF
                        </button>
                    </div>
                </header>

                {/* Measurement Layer (Hidden) */}
                <MeasurementLayer
                    containerRef={containerRef}
                    data={data}
                    layoutState={layoutState}
                />

                {/* Rendering Area */}
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {isMeasuring ? (
                            <div style={{ padding: '100px', textAlign: 'center' }}>
                                <div className="spinner"></div>
                                <p>Re-calculating surgical page breaks...</p>
                            </div>
                        ) : (
                            pages.map((pageData, idx) => (
                                <SortableContext
                                    key={idx}
                                    items={[...layoutState.main, ...layoutState.sidebar]}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <Page
                                        pageIndex={idx}
                                        pageData={pageData}
                                        data={data}
                                    />
                                </SortableContext>
                            ))
                        )}
                    </div>
                </DndContext>
            </div>

            <style jsx>{`
                .spinner {
                    border: 4px solid rgba(0, 0, 0, 0.1);
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    border-left-color: #09f;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @media print {
                    header, button, .Spinner { display: none !important; }
                    body { background: white !important; padding: 0 !important; }
                    .paginated-page { margin-bottom: 0 !important; box-shadow: none !important; }
                }
            `}</style>
        </div>
    );
}
