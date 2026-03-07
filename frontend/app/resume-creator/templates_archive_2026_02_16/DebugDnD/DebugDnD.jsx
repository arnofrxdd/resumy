import React, { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { useResumeDragAndDrop, DroppableZone, StableResumeDragOverlay } from "../../hooks/useResumeDragAndDrop";
import DraggableSection from "../../components/dnd/DraggableSection";

/**
 * DebugDnD Template
 * Specifically designed to test Drag and Drop functionality.
 * Features:
 * - High visibility drop zones
 * - Simplified "Card" rendering for sections (no complex resume content)
 * - Real-time state monitor to see underlying data arrays
 */
const DebugDnD = ({ data, onSectionClick, onReorder, scale = 1, isSpellCheckActive, layoutConfig }) => {
    if (!data) return <div style={{ padding: 20, color: 'red' }}>NO DATA PROPS RECEIVED</div>;

    const canReorder = !!onReorder && !isSpellCheckActive;

    // --- 1. DETERMINE LAYOUT STATE ---
    // Stress test: 5 zones
    const defaultLayout = {
        header: ['personal'],
        sidebarL: ['skills', 'languages', 'websites'],
        main: ['summary', 'experience', 'education', 'projects'],
        sidebarR: ['certifications', 'interests', 'affiliations'],
        footer: ['software', 'additionalInfo']
    };

    // Use template specific layout if available, matching the container keys
    const templateLayout = data.templateLayouts?.['debug-dnd'] || {};

    // Dynamically build the container state for the hook
    const zoneKeys = ['header', 'sidebarL', 'main', 'sidebarR', 'footer'];
    const containers = {};
    zoneKeys.forEach(zone => {
        // Special mapping for 'main' and 'sidebar' to match hook output keys
        let stateKey = `${zone}Order`;
        if (zone === 'main') stateKey = 'mainSectionsOrder';
        if (zone === 'sidebar') stateKey = 'sidebarSectionsOrder';

        containers[zone] = templateLayout[stateKey] || defaultLayout[zone] || [];
    });

    // Ensure all known sections are present somewhere (Safety/Discovery)
    const allKnownSections = [
        'summary', 'experience', 'education', 'skills', 'projects', 'languages',
        'certifications', 'interests', 'websites', 'software', 'affiliations',
        'strengths', 'additionalSkills', 'keyAchievements', 'accomplishments', 'additionalInfo', 'custom'
    ];

    const currentPlacements = Object.values(containers).flat();
    allKnownSections.forEach(sid => {
        if (!currentPlacements.includes(sid)) {
            // Put unplaced sections in 'main' by default for the stress tester
            containers['main'].push(sid);
        }
    });

    // Helper to check if a section has data
    const hasSectionData = (sid) => {
        if (sid === 'personal') return true;
        const sData = data[sid];
        if (!sData) return false;
        if (Array.isArray(sData)) return sData.length > 0;
        if (typeof sData === 'string') return sData.trim().length > 0;
        if (sid === 'custom') return data.customSection && data.customSection.isVisible;
        if (sid === 'websites') return data.websites && data.websites.length > 0;
        return true;
    };

    // Filter active items for each zone
    const activeContainers = {};
    zoneKeys.forEach(zone => {
        activeContainers[zone] = [...new Set(containers[zone].filter(hasSectionData))];
    });

    // --- 2. SETUP DND HOOK ---
    const { dndContextProps, activeId, dragStartContainerId } = useResumeDragAndDrop({
        data,
        onReorder: (newOrders) => {
            console.log("[DebugDnD] Reorder data received:", newOrders);
            if (onReorder) {
                // Pass up the change, parent expects { ...orders, templateId }
                onReorder(newOrders, 'debug-dnd');
            }
        },
        scale,
        containers: activeContainers
    });

    // --- 3. RENDER HELPERS ---
    const DebugCard = ({ sectionId, isOverlay = false, horizontal = false }) => (
        <div style={{
            padding: "12px",
            margin: horizontal ? "0 10px 0 0" : "0 0 10px 0",
            backgroundColor: isOverlay ? "#e0f2fe" : "white",
            border: "2px solid #334155",
            borderRadius: "6px",
            boxShadow: isOverlay ? "0 10px 25px rgba(0,0,0,0.3)" : "0 2px 4px rgba(0,0,0,0.1)",
            cursor: canReorder ? "grab" : "default",
            display: "flex",
            flexDirection: "column",
            minWidth: horizontal ? "150px" : "auto",
            transition: "transform 0.1s ease"
        }}>
            <span style={{ fontWeight: "800", textTransform: "uppercase", fontSize: "14px", color: "#1e293b" }}>{sectionId}</span>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px", opacity: 0.6, fontSize: "10px" }}>
                <span>{horizontal ? "HORIZ" : "VERT"}</span>
                <span>{data[sectionId] ? "DATA" : "EMPTY"}</span>
            </div>
        </div>
    );

    const Zone = ({ id, title, color, horizontal = false }) => (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "150px" }}>
            <h5 style={{ textAlign: 'center', margin: "0 0 5px 0", fontSize: "12px", fontWeight: "bold" }}>{title}</h5>
            <div style={{
                flex: 1,
                backgroundColor: `${color}11`, // transparent version
                border: `2px dashed ${color}`,
                padding: "15px",
                borderRadius: "8px",
                transition: "all 0.2s ease"
            }}>
                <DroppableZone id={id}>
                    <SortableContext
                        items={activeContainers[id]}
                        strategy={horizontal ? horizontalListSortingStrategy : verticalListSortingStrategy}
                        id={id}
                    >
                        <div style={{
                            display: "flex",
                            flexDirection: horizontal ? "row" : "column",
                            flexWrap: horizontal ? "wrap" : "nowrap",
                            height: "100%",
                            minHeight: "50px"
                        }}>
                            {activeContainers[id].length === 0 && (
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: color, opacity: 0.5, fontSize: "12px" }}>
                                    DROP HERE
                                </div>
                            )}
                            {activeContainers[id].map(sid => (
                                <DraggableSection key={sid} id={sid} isEnabled={canReorder}>
                                    <DebugCard sectionId={sid} horizontal={horizontal} />
                                </DraggableSection>
                            ))}
                        </div>
                    </SortableContext>
                </DroppableZone>
            </div>
        </div>
    );

    return (
        <div style={{
            minHeight: "100vh",
            width: "100%",
            fontFamily: "'Inter', system-ui, sans-serif",
            backgroundColor: "#f8fafc",
            padding: "30px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: "25px"
        }}>
            {/* --- TOP BAR --- */}
            <div style={{
                padding: "15px 25px",
                background: "#0f172a",
                color: "#f1f5f9",
                borderRadius: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            }}>
                <div>
                    <strong style={{ fontSize: "18px" }}>🚀 DND STRESS TESTER v2.0</strong>
                    <div style={{ fontSize: "12px", color: "#94a3b8" }}>Move sections across 5 dynamic zones</div>
                </div>
                <div style={{ fontSize: "11px", textAlign: "right", opacity: 0.8 }}>
                    MODE: <strong>{canReorder ? "INTERACTIVE" : "LOCKED"}</strong><br />
                    ENGINE: <strong>DND-KIT + CUSTOM HOOK</strong>
                </div>
            </div>

            <DndContext {...dndContextProps}>

                {/* --- 1. HEADER ZONE (HORIZONTAL) --- */}
                <Zone id="header" title="HEADER ZONE (Horizontal)" color="#6366f1" horizontal={true} />

                {/* --- 2. MIDDLE GRID --- */}
                <div style={{ display: "flex", gap: "20px", flex: 1 }}>
                    <Zone id="sidebarL" title="SIDEBAR LEFT" color="#3b82f6" />
                    <div style={{ flex: 2, display: "flex" }}>
                        <Zone id="main" title="MAIN CONTENT ZONE" color="#ef4444" />
                    </div>
                    <Zone id="sidebarR" title="SIDEBAR RIGHT" color="#8b5cf6" />
                </div>

                {/* --- 3. FOOTER ZONE (HORIZONTAL) --- */}
                <Zone id="footer" title="FOOTER ZONE (Horizontal)" color="#10b981" horizontal={true} />

                <StableResumeDragOverlay
                    activeId={activeId}
                    dragStartContainerId={dragStartContainerId}
                    scale={scale}
                    renderSection={(id) => <DebugCard sectionId={id} isOverlay={true} />}
                />
            </DndContext>

            {/* --- STATE MONITOR --- */}
            <div style={{
                marginTop: "10px",
                padding: "20px",
                backgroundColor: "#0f172a",
                color: "#4ade80",
                borderRadius: "12px",
                fontSize: "13px",
                overflowX: "auto",
                border: "1px solid #1e293b"
            }}>
                <div style={{ marginBottom: "10px", color: "#94a3b8", fontWeight: "bold", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>Data Stream Monitor</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
                    {zoneKeys.map(k => (
                        <div key={k} style={{ padding: "8px", background: "rgba(255,255,255,0.05)", borderRadius: "6px" }}>
                            <span style={{ color: "#60a5fa" }}>{k.padEnd(8)}:</span> {JSON.stringify(activeContainers[k])}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DebugDnD;
