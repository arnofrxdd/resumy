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
 * ExecutiveBlue Layout
 * Header: Full width Blue Background
 * Body: Left Main (65%), Right Sidebar (35%)
 */
const ExecutiveBlue = ({ data, onSectionClick, onReorder, scale = 1, isSpellCheckActive, onSpellCheckIgnore, onSpellCheckReplace, layoutConfig, showPageBreaks }) => {
    const containerRef = useRef(null);
    if (!data) return null;

    const sectionVariants = {
        experience: 'classic',
        education: 'classic',
        skills: 'tags', // or 'bars' depending on preference, image shows dots/bars but tags is safe default
        languages: 'bars' // The image shows dots for languages
    };

    const isInteractive = !!onSectionClick && !isSpellCheckActive;
    const canReorder = !!onReorder && !isSpellCheckActive;
    const { personal, websites } = data;

    const SORTABLE_KEY = "{{SORTABLE}}";

    // Default Layout
    const defaultLayout = {
        main: [SORTABLE_KEY],
        sidebar: [SORTABLE_KEY]
    };

    const layout = layoutConfig?.layout || defaultLayout;
    const containerKeys = ['main', 'sidebar'];

    const hasSectionData = (sectionId) => {
        const sectionData = data[sectionId];
        if (!sectionData) return false;
        if (Array.isArray(sectionData)) return sectionData.length > 0;
        if (typeof sectionData === 'string') return sectionData.trim().length > 0;
        if (sectionId === 'custom') return data.customSection && data.customSection.isVisible;
        if (sectionId === 'websites') return websites && websites.filter(w => !w.addToHeader).length > 0;
        return true;
    };

    // --- ORDERING LOGIC ---
    const allKnownSections = [
        'summary', 'experience', 'education', 'skills', 'projects', 'languages',
        'certifications', 'interests', 'websites', 'software', 'affiliations',
        'strengths', 'additionalSkills', 'keyAchievements', 'accomplishments', 'additionalInfo', 'custom'
    ];

    const templateId = layoutConfig?.id || 'executive-blue';
    const templateSpecificLayout = data.templateLayouts?.[templateId] || {};

    const currentOrders = {};
    const fixedSectionsAll = [];

    containerKeys.forEach(ckey => {
        const orderKey = `${ckey}SectionsOrder`;
        const defaultOrderForContainer = (layout[ckey] || []).filter(id => id !== SORTABLE_KEY);
        currentOrders[ckey] = [...(templateSpecificLayout[orderKey] || data[orderKey] || defaultOrderForContainer)];
        const fixedInConfig = (layout[ckey] || []).filter(item => item !== SORTABLE_KEY);
        fixedSectionsAll.push(...fixedInConfig);
    });

    allKnownSections.forEach(sid => {
        const isInAnyOrder = containerKeys.some(ckey => currentOrders[ckey].includes(sid));
        const isFixed = fixedSectionsAll.includes(sid);
        if (!isInAnyOrder && !isFixed && hasSectionData(sid)) {
            // Default new sections to Main unless specific logic applies
            currentOrders['main'].push(sid);
        }
    });

    // Ensure reorder sync
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

    const dndContainers = {};
    containerKeys.forEach(ckey => {
        dndContainers[ckey] = currentOrders[ckey].filter(sid => !fixedSectionsAll.includes(sid)).filter(hasSectionData);
    });

    const { dndContextProps, activeId, dragStartContainerId } = useResumeDragAndDrop({
        data, onReorder, scale, containers: dndContainers
    });

    const pages = useAutoPagination({
        columns: dndContainers,
        data,
        enabled: showPageBreaks,
        containerRef
    });

    const getZoneContext = (zoneId) => {
        const isSidebar = zoneId.startsWith('sidebar');
        // Colors from image
        // Header Blue: #004c8c (approx)
        // Headings Blue: #004c8c
        // Text: #333
        // Sidebar BG: Transparent/White based on image, but maybe light gray?
        // Image shows Sidebar on right, seems to have white background same as main, 
        // OR it's a 2-column grid on white.
        // Let's assume white background for both, but distinct typography.

        return {
            "--section-title-color": "#004c8c", // Dark Blue
            "--section-title-border": "none", // No border under titles in image example, but maybe line separator?
            "--section-title-border-bottom": "1px solid #e0e0e0", // Thin gray line
            "--section-title-size": "18px",
            "--section-title-weight": "700",

            "--item-title-color": "#333",
            "--item-title-size": "14px",
            "--item-title-weight": "700",

            "--item-subtitle-color": "#555",
            "--item-subtitle-style": "italic",

            "--item-date-color": "#333",
            "--item-date-weight": "700", // Dates are bold in example

            "--section-item-gap": "15px",

            // Adjustments for Sidebar
            ...(isSidebar ? {
                "--section-title-size": "16px",
                "--item-base-size": "12px",
                "--section-item-gap": "10px",
            } : {})
        };
    };

    const renderHeader = () => (
        <div style={{
            background: "#005a9c", // Stronger Blue
            color: "white",
            padding: "30px 40px",
            marginBottom: "30px"
        }}>
            <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Header">
                <h1 style={{ margin: "0 0 5px 0", fontSize: "32px", fontWeight: "800", textTransform: "uppercase" }}>
                    <SpellCheckHighlighter text={personal?.name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'name', val)} />
                </h1>
                <div style={{ fontSize: "18px", fontWeight: "400", opacity: 0.9 }}>
                    <SpellCheckHighlighter text={personal?.profession} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'profession', val)} />
                </div>
            </SectionWrapper>
        </div>
    );

    const renderPersonalDetails = () => (
        <div style={{ marginBottom: "30px", fontSize: "13px", lineHeight: "1.6" }}>
            <ZonalSectionHeader title="Personal Info" style={{ color: "#004c8c", borderBottom: "1px solid #ddd", paddingBottom: "5px", marginBottom: "10px", fontSize: "16px", fontWeight: "bold" }} />

            <div style={{ marginBottom: "15px" }}>
                <div style={{ fontWeight: "bold", color: "#333" }}>Address</div>
                <div style={{ color: "#555" }}>
                    <SpellCheckHighlighter text={[personal?.address, personal?.city, personal?.state, personal?.pincode].filter(Boolean).join(", ")} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'address', val)} />
                </div>
            </div>

            {personal?.phone && (
                <div style={{ marginBottom: "15px" }}>
                    <div style={{ fontWeight: "bold", color: "#333" }}>Phone</div>
                    <div style={{ color: "#555" }}>
                        <SpellCheckHighlighter text={personal.phone} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'phone', val)} />
                    </div>
                </div>
            )}

            {personal?.email && (
                <div style={{ marginBottom: "15px" }}>
                    <div style={{ fontWeight: "bold", color: "#333" }}>E-mail</div>
                    <div style={{ color: "#555", wordBreak: "break-all" }}>
                        <SpellCheckHighlighter text={personal.email} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'email', val)} />
                    </div>
                </div>
            )}

            {personal?.linkedin && (
                <div style={{ marginBottom: "15px" }}>
                    <div style={{ fontWeight: "bold", color: "#333" }}>LinkedIn</div>
                    <div style={{ color: "#555", wordBreak: "break-all" }}>
                        <SpellCheckHighlighter text={personal.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'linkedin', val)} />
                    </div>
                </div>
            )}

            {/* Dynamic Personal Info fields if any */}
        </div>
    );

    // Sidebar Photo
    const renderPhoto = () => (
        personal?.photo ? (
            <div style={{ marginBottom: "20px", width: "100%", aspectRatio: "1", overflow: "hidden", borderRadius: "4px" }}>
                <img src={personal.photo} alt={personal.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
        ) : null
    );

    const renderZone = (zoneId, paginatedSections = null) => {
        const rawZoneId = zoneId.replace(/-p\d+$/, '');
        const items = paginatedSections || dndContainers[rawZoneId] || [];
        const zoneContext = getZoneContext(rawZoneId);

        // Custom renderer for sidebar start to include Photo & Personal Info
        // But only on First Page (p0) if paginated, or always if not
        const isSidebar = rawZoneId === 'sidebar';
        const isFirstPage = !paginatedSections || zoneId.endsWith('-p0');

        return (
            <DroppableZone id={zoneId} style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px", ...zoneContext }}>
                {isSidebar && isFirstPage && (
                    <>
                        {renderPhoto()}
                        {renderPersonalDetails()}
                    </>
                )}

                {paginatedSections ? (
                    // Paginated Mode
                    paginatedSections.filter(ps => ps.id !== 'header-spacer').map((ps, idx) => (
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
                    ))
                ) : (
                    // Full Mode
                    items.map(sid => (
                        <DraggableSection key={sid} id={sid} isEnabled={canReorder}>
                            <SortableContext items={items} strategy={verticalListSortingStrategy} id={zoneId}>
                                <SectionRenderer
                                    sectionId={sid}
                                    data={data}
                                    onSectionClick={onSectionClick}
                                    isSpellCheckActive={isSpellCheckActive}
                                    onSpellCheckIgnore={onSpellCheckIgnore}
                                    onSpellCheckReplace={onSpellCheckReplace}
                                    variants={sectionVariants}
                                />
                            </SortableContext>
                        </DraggableSection>
                    ))
                )}
            </DroppableZone>
        );
    };

    const frameStyle = {
        background: "white",
        width: "100%",
        minHeight: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column"
    };

    const fullLayout = (
        <div style={frameStyle}>
            {renderHeader()}
            <div style={{ display: "flex", padding: "0 40px 40px 40px", flex: 1, gap: "40px" }}>
                <div style={{ flex: "0 0 65%", display: "flex", flexDirection: "column" }}>
                    {renderZone('main')}
                </div>
                <div style={{ flex: "0 0 30%", display: "flex", flexDirection: "column" }}>
                    {renderZone('sidebar')}
                </div>
            </div>
        </div>
    );

    // For pagination, we need to replicate the structure per page
    const paginatedLayout = pages ? (
        <div className="paginated-resume-container" style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            <SortableContext items={dndContainers.main.concat(dndContainers.sidebar)} strategy={verticalListSortingStrategy}>
                {pages.map((page, pageIdx) => (
                    <div key={pageIdx} className="resume-page" style={{
                        width: "210mm", height: "297mm",
                        background: "white",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                        position: "relative",
                        overflow: "hidden",
                        padding: "0",
                        display: "flex", flexDirection: "column"
                    }}>
                        {pageIdx === 0 && renderHeader()}
                        <div style={{
                            display: "flex",
                            padding: pageIdx === 0 ? "0 40px 40px 40px" : "40px",
                            flex: 1,
                            gap: "40px",
                            height: "100%"
                        }}>
                            <div style={{ flex: "0 0 65%", display: "flex", flexDirection: "column" }}>
                                {renderZone(`main-p${pageIdx}`, page.main)}
                            </div>
                            <div style={{ flex: "0 0 30%", display: "flex", flexDirection: "column" }}>
                                {renderZone(`sidebar-p${pageIdx}`, page.sidebar)}
                            </div>
                        </div>
                        <div style={{ position: "absolute", bottom: "15px", left: "40px", fontSize: "10px", opacity: 0.5 }}>Page {pageIdx + 1} of {pages.length}</div>
                    </div>
                ))}
            </SortableContext>
        </div>
    ) : null;

    // Measurer for pagination
    const Measurer = () => (
        <div className="resume-measurer" style={{ position: "absolute", top: -10000, left: -10000, width: "210mm", visibility: "hidden" }}>
            <div className="page-height-marker" style={{ height: "calc(297mm - 30px)", width: "100%", position: "absolute", top: 15 }}></div>
            <div style={frameStyle}>
                {renderHeader()}
                <div style={{ display: "flex", padding: "0 40px 40px 40px", gap: "40px" }}>
                    <div className="main-column-measurer" data-column-id="main" style={{ flex: "0 0 65%", paddingTop: "40px" }}>
                        <div data-section-id="header-spacer" style={{ height: "110px" }}></div>
                        {renderZone('main')}
                    </div>
                    <div className="sidebar-column-measurer" data-column-id="sidebar" style={{ flex: "0 0 30%", paddingTop: "40px" }}>
                        <div data-section-id="header-spacer" style={{ height: "110px" }}></div>
                        {renderZone('sidebar')}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div ref={containerRef} className="executive-blue-root">
            <Measurer />
            <DndContext {...dndContextProps}>
                {showPageBreaks && pages ? paginatedLayout : fullLayout}
                <StableResumeDragOverlay activeId={activeId} dragStartContainerId={dragStartContainerId} scale={scale} renderSection={(id) => (
                    <div style={{ background: "white", padding: "15px", border: "1px solid #ccc", boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}>
                        <SectionRenderer sectionId={id} data={data} />
                    </div>
                )} />
            </DndContext>
        </div>
    );
};

export default ExecutiveBlue;
