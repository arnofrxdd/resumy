import React, { useRef } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SectionWrapper from "../../components/SectionWrapper";
import { useResumeDragAndDrop, DroppableZone, StableResumeDragOverlay } from "../../hooks/useResumeDragAndDrop";
import DraggableSection from "../../components/dnd/DraggableSection";
import SectionRenderer from "../common/SectionRenderer";
import { ZonalSectionHeader } from "../common/BaseComponents";
import SpellCheckHighlighter from "../../components/SpellCheckHighlighter";
import { MapPin, Phone, Mail, Linkedin, Github, Globe } from "lucide-react";
import { useAutoPagination } from "../../hooks/useAutoPagination";

/**
 * UnifiedTemplate
 * A modular template that supports Drag & Drop using the new hook and renderer.
 */
const UnifiedTemplate = ({ data, onSectionClick, onReorder, scale = 1, isSpellCheckActive, onSpellCheckIgnore, onSpellCheckReplace, layoutConfig, showPageBreaks }) => {
    const containerRef = useRef(null);
    if (!data) return null;

    const sectionVariants = {
        experience: 'classic',
        education: 'classic',
        skills: 'tags'
    };

    const isInteractive = !!onSectionClick && !isSpellCheckActive;
    const canReorder = !!onReorder && !isSpellCheckActive;

    const { personal, websites } = data;

    // --- DEFAULTS ---
    const SORTABLE_KEY = "{{SORTABLE}}";

    // Default Layout if none provided (Matches original behavior)
    const defaultLayout = {
        main: [SORTABLE_KEY],
        sidebar: [SORTABLE_KEY]
    };

    const layout = layoutConfig?.layout || defaultLayout;
    const containerKeys = Object.keys(layout); // ['main', 'sidebar'] or ['left', 'center', 'right']

    const hasSectionData = (sectionId) => {
        const sectionData = data[sectionId];
        if (!sectionData) return false;
        if (Array.isArray(sectionData)) return sectionData.length > 0;
        if (typeof sectionData === 'string') return sectionData.trim().length > 0;
        if (sectionId === 'custom') return data.customSection && data.customSection.isVisible;
        if (sectionId === 'websites') {
            return websites && websites.filter(w => !w.addToHeader).length > 0;
        }
        return true;
    };

    // --- ORDERING LOGIC ---
    const allKnownSections = [
        'summary', 'experience', 'education', 'skills', 'projects', 'languages',
        'certifications', 'interests', 'websites', 'software', 'affiliations',
        'strengths', 'additionalSkills', 'keyAchievements', 'accomplishments', 'additionalInfo', 'custom'
    ];

    const templateId = layoutConfig?.id || 'unified-template';
    const templateSpecificLayout = data.templateLayouts?.[templateId] || {};

    // Generate current orders for all containers in layout
    const currentOrders = {};
    const fixedSectionsAll = [];

    containerKeys.forEach(ckey => {
        const orderKey = `${ckey}SectionsOrder`;
        // Prioritize: Template Specific Order > Global Data Order > Template Config Default Order
        const defaultOrderForContainer = (layout[ckey] || []).filter(id => id !== SORTABLE_KEY);
        currentOrders[ckey] = [...(templateSpecificLayout[orderKey] || data[orderKey] || defaultOrderForContainer)];

        // Track which sections are "Fixed" (non-sortable) in the config
        const fixedInConfig = (layout[ckey] || []).filter(item => item !== SORTABLE_KEY);
        fixedSectionsAll.push(...fixedInConfig);
    });

    // Auto-discovery: If a section has data but isn't in any order, put it in the first container's list
    allKnownSections.forEach(sid => {
        const isInAnyOrder = containerKeys.some(ckey => currentOrders[ckey].includes(sid));
        const isFixed = fixedSectionsAll.includes(sid);

        if (!isInAnyOrder && !isFixed && hasSectionData(sid)) {
            const firstContainer = containerKeys[0];
            currentOrders[firstContainer].push(sid);
        }
    });

    React.useEffect(() => {
        const hasTemplateRecord = !!data.templateLayouts?.[templateId];
        if (!hasTemplateRecord && onReorder) {
            const initialReorder = {};
            containerKeys.forEach(ckey => {
                initialReorder[`${ckey}SectionsOrder`] = currentOrders[ckey];
            });
            onReorder(initialReorder);
        }
    }, [onReorder]);

    // Compute final items for Hooks
    const dndContainers = {};
    containerKeys.forEach(ckey => {
        dndContainers[ckey] = currentOrders[ckey]
            .filter(sid => !fixedSectionsAll.includes(sid))
            .filter(hasSectionData);
    });

    const { dndContextProps, activeId, dragStartContainerId } = useResumeDragAndDrop({
        data,
        onReorder,
        scale,
        containers: dndContainers
    });

    // --- PAGINATION HOOK ---
    const pages = useAutoPagination({
        columns: dndContainers,
        data,
        enabled: showPageBreaks,
        containerRef,
        scale
    });

    // Generic Layout Style based on container keys
    const getWidthInfo = (ckey) => {
        if (layout.widths?.[ckey]) return layout.widths[ckey];
        if (ckey === 'sidebar' || ckey === 'left' || ckey === 'right') return '32%';
        return 'flex';
    };

    const headerContainer = layoutConfig?.headerContainer || (containerKeys.includes('sidebar') ? 'sidebar' : (containerKeys.includes('left') ? 'left' : containerKeys[0]));

    const isSidebarLike = (ckey) => {
        const width = getWidthInfo(ckey);
        return ckey === 'sidebar' || ckey === 'left' || (width !== 'flex' && parseInt(width) < 40);
    };

    // --- STYLING CONTEXTS (Unified into one layout generator) ---
    const getZoneContext = (zoneId) => {
        const isNarrow = isSidebarLike(zoneId);

        if (isNarrow) {
            return {
                "--section-title-color": "var(--theme-sidebar-text, #ffffff)",
                "--section-title-border": "1px solid rgba(255,255,255,0.1)",
                "--section-title-size": "var(--sidebar-title-size, 13px)",
                "--item-title-color": "var(--theme-sidebar-text, #ffffff)",
                "--item-title-size": "var(--sidebar-title-size, 13px)",
                "--item-subtitle-color": "var(--sidebar-text-muted, #cbd5e1)",
                "--item-subtitle-size": "var(--sidebar-base-size, 12px)",
                "--item-body-color": "var(--sidebar-text-muted, #cbd5e1)",
                "--item-base-size": "var(--sidebar-base-size, 12px)",
                "--item-date-color": "var(--sidebar-text-dim, #94a3b8)",
                "--item-date-size": "var(--sidebar-date-size, 11px)",
                "--item-location-color": "var(--sidebar-text-dim, #94a3b8)",
                "--item-location-size": "var(--sidebar-date-size, 11px)",
                "--section-flex-direction": "column",
                "--section-item-gap": "4px",
                "--section-date-width": "100%",
                "--header-bg": "rgba(255,255,255,0.05)",
                "--drag-handle-right": "5px",
                "--drag-handle-color": "#ffffff",
                "--drag-handle-bg": "rgba(59, 130, 246, 1)",
                "--drag-handle-border": "#2563eb",
                "--zonal-header-margin": "0 calc(var(--theme-page-margin, 40px) * -0.5) calc(15px * var(--theme-section-margin, 1)) calc(var(--theme-page-margin, 40px) * -0.5)",
            };
        }
        return {
            "--section-title-color": "var(--main-text-primary, var(--theme-color, #1e293b))",
            "--section-title-border": "2px solid var(--theme-color, #e2e8f0)",
            "--section-title-size": "calc(var(--main-title-size, 14px) * var(--theme-font-scale, 1))",
            "--item-title-color": "var(--main-text-primary, #334155)",
            "--item-title-size": "calc(var(--main-title-size, 15px) * var(--theme-font-scale, 1))",
            "--item-subtitle-color": "var(--main-text-muted, #64748b)",
            "--item-subtitle-size": "calc(var(--main-subtitle-size, 13px) * var(--theme-font-scale, 1))",
            "--item-body-color": "var(--main-text-muted, #475569)",
            "--item-base-size": "calc(var(--main-base-size, 13px) * var(--theme-font-scale, 1))",
            "--item-date-color": "var(--main-text-dim, #64748b)",
            "--item-date-size": "calc(var(--main-date-size, 13px) * var(--theme-font-scale, 1))",
            "--item-location-color": "var(--main-text-dim, #64748b)",
            "--item-location-size": "calc(var(--main-date-size, 13px) * var(--theme-font-scale, 1))",
            "--section-flex-direction": "row",
            "--section-item-gap": "20px",
            "--section-date-width": "100px",
            "--header-bg": "transparent",
            "--drag-handle-right": "-40px",
            "--drag-handle-color": "#1e293b",
            "--drag-handle-bg": "#ffffff",
            "--drag-handle-border": "#cbd5e1",
            "--zonal-header-margin": "0 calc(var(--theme-page-margin, 40px) * -1) calc(15px * var(--theme-section-margin, 1)) calc(var(--theme-page-margin, 40px) * -1)",
        };
    };

    // --- HELPER TO RENDER A ZONE ---
    const renderZone = (zoneId, paginatedSections = null) => {
        const zoneLayout = layout[zoneId.replace(/-p\d+$/, '')] || [SORTABLE_KEY];
        const sortableItems = dndContainers[zoneId.replace(/-p\d+$/, '')] || [];
        const zoneContext = getZoneContext(zoneId.replace(/-p\d+$/, ''));

        // If paginatedSections is provided, we ignore layoutArray and render exactly what's chosen for this page
        if (paginatedSections) {
            return (
                <DroppableZone id={zoneId} style={{ flex: 1, display: "flex", flexDirection: "column", gap: "calc(20px * var(--theme-section-margin, 1))", ...zoneContext }}>
                    {paginatedSections.map((ps, idx) => (
                        <DraggableSection
                            key={`${ps.id}-${idx}`}
                            id={ps.isContinued ? `${zoneId}-cont-${ps.id}-${idx}` : ps.id}
                            isEnabled={canReorder && !ps.isContinued}
                        >
                            <SectionRenderer
                                sectionId={ps.id}
                                data={data}
                                onSectionClick={onSectionClick}
                                isSpellCheckActive={isSpellCheckActive}
                                onSpellCheckIgnore={onSpellCheckIgnore}
                                onSpellCheckReplace={onSpellCheckReplace}
                                variants={sectionVariants}
                                itemIndices={ps.itemIndices}
                                isContinued={ps.isContinued}
                            />
                        </DraggableSection>
                    ))}
                </DroppableZone>
            );
        }

        return (
            <DroppableZone id={zoneId} style={{ flex: 1, display: "flex", flexDirection: "column", gap: "calc(20px * var(--theme-section-margin, 1))", minHeight: "100px", ...zoneContext }}>
                {zoneLayout.map((item, idx) => {
                    if (item === SORTABLE_KEY) {
                        return (
                            <SortableContext key={`sortable-${zoneId}`} items={sortableItems} strategy={verticalListSortingStrategy} id={zoneId}>
                                {sortableItems.map(sid => (
                                    <DraggableSection key={sid} id={sid} isEnabled={canReorder}>
                                        <SectionRenderer
                                            sectionId={sid}
                                            data={data}
                                            onSectionClick={onSectionClick}
                                            isSpellCheckActive={isSpellCheckActive}
                                            onSpellCheckIgnore={onSpellCheckIgnore}
                                            onSpellCheckReplace={onSpellCheckReplace}
                                            variants={sectionVariants}
                                        />
                                    </DraggableSection>
                                ))}
                            </SortableContext>
                        );
                    }

                    if (hasSectionData(item)) {
                        return (
                            <SectionRenderer
                                key={item}
                                sectionId={item}
                                data={data}
                                onSectionClick={onSectionClick}
                                isSpellCheckActive={isSpellCheckActive}
                                onSpellCheckIgnore={onSpellCheckIgnore}
                                onSpellCheckReplace={onSpellCheckReplace}
                                variants={sectionVariants}
                            />
                        );
                    }
                    return null;
                })}
            </DroppableZone>
        );
    };

    const renderHeader = (isSidebar) => (
        <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Header">
            {personal?.photo && isSidebar && (
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                    <img src={personal.photo} alt={personal.name} style={{ width: "140px", height: "140px", borderRadius: "50%", objectFit: "cover", border: "4px solid rgba(255,255,255,0.1)" }} />
                </div>
            )}
            <div style={{ textAlign: isSidebar ? "center" : "left", marginBottom: "30px" }}>
                <h1 style={{ fontSize: isSidebar ? "2.5em" : "3.2em", fontWeight: "800", margin: "0 0 8px 0", color: isSidebar ? "var(--theme-sidebar-text, #ffffff)" : "var(--theme-color)", textTransform: "uppercase", lineHeight: 1.2 }}>
                    <SpellCheckHighlighter
                        text={personal?.name}
                        isActive={isSpellCheckActive}
                        onIgnore={onSpellCheckIgnore}
                        onReplace={(val) => onSpellCheckReplace('personal', 'name', val)}
                    />
                </h1>
                <div style={{ fontSize: "1.1em", color: isSidebar ? "var(--theme-sidebar-text, #ffffff)" : "var(--main-text-muted)", opacity: 0.8, fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>
                    <SpellCheckHighlighter
                        text={personal?.profession}
                        isActive={isSpellCheckActive}
                        onIgnore={onSpellCheckIgnore}
                        onReplace={(val) => onSpellCheckReplace('personal', 'profession', val)}
                    />
                </div>
            </div>
            {isSidebar && (
                <div>
                    <ZonalSectionHeader title="Contact" />
                    <div style={{ display: "flex", flexDirection: "column", gap: "calc(12px * var(--theme-paragraph-margin, 1))", fontSize: "0.95em" }}>
                        {personal?.email && (<div style={{ display: "flex", alignItems: "center", gap: "10px" }}><Mail size={14} color="var(--theme-color, #635bff)" /> <span style={{ wordBreak: 'break-all' }}><SpellCheckHighlighter text={personal.email} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'email', val)} /></span></div>)}
                        {personal?.phone && (<div style={{ display: "flex", alignItems: "center", gap: "10px" }}><Phone size={14} color="var(--theme-color, #635bff)" /> <span><SpellCheckHighlighter text={personal.phone} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'phone', val)} /></span></div>)}
                        {(personal?.city || personal?.state || personal?.country || personal?.pincode) && (<div style={{ display: "flex", alignItems: "start", gap: "10px" }}><MapPin size={14} color="var(--theme-color, #635bff)" /> <span><SpellCheckHighlighter text={[personal.city, personal.state, personal.country, (personal.zipCode || personal.pincode)].filter(Boolean).join(", ")} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'city', val.split(',')[0])} /></span></div>)}
                        {personal?.linkedin && (<div style={{ display: "flex", alignItems: "center", gap: "10px" }}><Linkedin size={14} color="var(--theme-color, #635bff)" /><span style={{ wordBreak: 'break-all' }}><SpellCheckHighlighter text={personal.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'linkedin', val)} /></span></div>)}
                    </div>
                </div>
            )}
        </SectionWrapper>
    );

    const frameStyle = {
        padding: "15px", // The White Border
        background: "white",
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        display: "flex"
    };

    const fullResumeLayout = (
        <div style={{ ...frameStyle, minHeight: "100%" }}>
            {containerKeys.map((ckey) => {
                const width = getWidthInfo(ckey);
                const isNarrow = isSidebarLike(ckey);
                return (
                    <div key={ckey} style={{
                        width: width === 'flex' ? 'auto' : width,
                        flex: width === 'flex' ? 1 : 'none',
                        minHeight: "100%",
                        background: isNarrow ? "var(--theme-sidebar-bg, #0a2540)" : "transparent",
                        color: isNarrow ? "var(--theme-sidebar-text, #ffffff)" : "inherit",
                        padding: "var(--theme-page-margin, 40px) calc(var(--theme-page-margin, 40px) * 0.5)",
                        boxSizing: "border-box",
                        display: "flex",
                        flexDirection: "column",
                        gap: "calc(25px * var(--theme-section-margin, 1))"
                    }}>
                        {ckey === headerContainer && renderHeader(isNarrow)}
                        {renderZone(ckey)}
                    </div>
                );
            })}
        </div>
    );

    const allSortableItems = containerKeys.flatMap(ckey => dndContainers[ckey]);

    const paginatedLayout = pages ? (
        <div className="paginated-resume-container" style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            <SortableContext items={allSortableItems} strategy={verticalListSortingStrategy}>
                {pages.map((page, pageIdx) => (
                    <div key={pageIdx} className="resume-page" style={{
                        width: "210mm", height: "297mm",
                        background: "white",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                        position: "relative",
                        overflow: "hidden",
                        padding: "15px", // White Border Frame
                        boxSizing: "border-box"
                    }}>
                        <div style={{ display: "flex", width: "100%", height: "100%", background: "var(--theme-background, white)", position: "relative" }}>
                            {containerKeys.map((ckey) => {
                                const width = getWidthInfo(ckey);
                                const isNarrow = isSidebarLike(ckey);
                                return (
                                    <div key={ckey} style={{
                                        width: width === 'flex' ? 'auto' : width,
                                        flex: width === 'flex' ? 1 : 'none',
                                        height: "100%",
                                        maxHeight: "100%",
                                        background: isNarrow ? "var(--theme-sidebar-bg, #0a2540)" : "transparent",
                                        color: isNarrow ? "var(--theme-sidebar-text, #ffffff)" : "inherit",
                                        padding: "var(--theme-page-margin, 40px) calc(var(--theme-page-margin, 40px) * 0.5)",
                                        boxSizing: "border-box",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "calc(25px * var(--theme-section-margin, 1))",
                                        overflow: "hidden"
                                    }}>
                                        {pageIdx === 0 && ckey === headerContainer && renderHeader(isNarrow)}
                                        {renderZone(`${ckey}-p${pageIdx}`, page[ckey])}
                                    </div>
                                );
                            })}
                        </div>
                        {/* Page Number Overlay */}
                        <div style={{ position: "absolute", bottom: "15px", right: "20px", fontSize: "10px", opacity: 0.5 }}>Page {pageIdx + 1} of {pages.length}</div>
                    </div>
                ))}
            </SortableContext>
        </div>
    ) : (
        <div style={{ textAlign: "center", padding: "100px", color: "#94a3b8" }}>
            Calculating Page Breaks...
        </div>
    );

    // --- MEASUREMENT LAYER (Always rendered hidden for hook) ---
    const Measurer = () => (
        <div className="resume-measurer" style={{ position: "absolute", top: -10000, left: -10000, width: "210mm", visibility: "hidden", pointerEvents: "none" }}>
            <div className="page-height-marker" style={{ height: "calc(297mm - 30px)", width: "100%", position: "absolute", top: 15 }}></div>
            <div style={{ ...frameStyle }}>
                {containerKeys.map((ckey) => {
                    const width = getWidthInfo(ckey);
                    return (
                        <div key={ckey} className={`${ckey}-column-measurer`} data-column-id={ckey} style={{
                            width: width === 'flex' ? 'auto' : width,
                            flex: width === 'flex' ? 1 : 'none',
                            padding: "var(--theme-page-margin, 40px) calc(var(--theme-page-margin, 40px) * 0.5)",
                            boxSizing: "border-box",
                            display: "flex",
                            flexDirection: "column",
                            gap: "calc(25px * var(--theme-section-margin, 1))",
                            position: "relative"
                        }}>
                            {ckey === headerContainer && renderHeader(isSidebarLike(ckey))}
                            {renderZone(ckey)}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const layoutStyles = containerKeys.reduce((acc, ckey) => {
        acc[ckey] = getZoneContext(ckey);
        return acc;
    }, {});

    return (
        <div ref={containerRef} className="unified-template-root">
            <Measurer />
            <DndContext {...dndContextProps}>
                {showPageBreaks ? paginatedLayout : fullResumeLayout}
                <StableResumeDragOverlay
                    activeId={activeId}
                    dragStartContainerId={dragStartContainerId}
                    scale={scale}
                    renderSection={(id, startContainer) => {
                        const isNarrow = isSidebarLike(startContainer);
                        return (
                            <div style={{ width: '100%', opacity: 0.9, ...(layoutStyles[startContainer] || {}) }}>
                                <div style={{
                                    backgroundColor: isNarrow ? 'var(--theme-sidebar-bg, #0a2540)' : 'var(--theme-background, white)',
                                    color: isNarrow ? 'white' : 'inherit',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                                    border: '2px solid #3b82f6',
                                    width: isNarrow ? "280px" : "500px"
                                }}>
                                    <SectionRenderer sectionId={id} data={data} onSectionClick={null} isSpellCheckActive={false} />
                                </div>
                            </div>
                        );
                    }} />
            </DndContext>
        </div>
    );
};

export default UnifiedTemplate;
