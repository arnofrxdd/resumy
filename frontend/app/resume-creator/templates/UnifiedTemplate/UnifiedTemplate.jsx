import React from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SectionWrapper from "../../components/SectionWrapper";
import { useResumeDragAndDrop, DroppableZone, StableResumeDragOverlay } from "../../hooks/useResumeDragAndDrop";
import DraggableSection from "../../components/dnd/DraggableSection";
import SectionRenderer from "../common/SectionRenderer";
import { ZonalSectionHeader } from "../common/BaseComponents";
import SpellCheckHighlighter from "../../components/SpellCheckHighlighter";
import { MapPin, Phone, Mail, Linkedin, Github, Globe } from "lucide-react";

/**
 * UnifiedTemplate
 * A modular template that supports Drag & Drop using the new hook and renderer.
 */
const UnifiedTemplate = ({ data, onSectionClick, onReorder, scale = 1, isSpellCheckActive, onSpellCheckIgnore, onSpellCheckReplace, layoutConfig }) => {
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

    const layout = layoutConfig || defaultLayout;

    // --- ORDERING LOGIC ---
    const defaultMainOrder = [
        'summary', 'experience', 'projects', 'education',
        'certifications', 'keyAchievements', 'accomplishments',
        'software', 'affiliations', 'additionalInfo', 'custom', 'websites'
    ];
    const defaultSidebarOrder = [
        'skills', 'strengths', 'additionalSkills', 'languages', 'interests'
    ];

    // Priority 1: Template-specific order
    // Priority 2: Global order (legacy)
    // Priority 3: Defaults
    const templateSpecificLayout = data.templateLayouts?.['unified-template'] || {};

    let mainOrder = [...(templateSpecificLayout.mainSectionsOrder || data.mainSectionsOrder || defaultMainOrder)];
    let sidebarOrder = [...(templateSpecificLayout.sidebarSectionsOrder || data.sidebarSectionsOrder || defaultSidebarOrder)];

    // Ensure all known sections are in the list (Auto-add logic)
    const allKnownSections = [
        'summary', 'experience', 'education', 'skills', 'projects', 'languages',
        'certifications', 'interests', 'websites', 'software', 'affiliations',
        'strengths', 'additionalSkills', 'keyAchievements', 'accomplishments', 'additionalInfo', 'custom'
    ];

    // Identify Fixed Sections involved in this layout
    // We must exclude these from the "Sortable" lists to avoid duplicating them
    const fixedSectionsMain = (layout.main || []).filter(item => item !== SORTABLE_KEY);
    const fixedSectionsSidebar = (layout.sidebar || []).filter(item => item !== SORTABLE_KEY);
    const allFixedSections = [...fixedSectionsMain, ...fixedSectionsSidebar];

    allKnownSections.forEach(sid => {
        // Only add to 'sortable' pool if NOT fixed and NOT already in a list
        if (!mainOrder.includes(sid) && !sidebarOrder.includes(sid) && !allFixedSections.includes(sid)) {
            if (data[sid] && (Array.isArray(data[sid]) ? data[sid].length > 0 : true)) {
                mainOrder.push(sid);
            }
        }
    });

    // --- SYNC ORDERS BACK TO PARENT ---
    // Only sync if we've added new discovery sections or if this template doesn't have a specific record yet
    React.useEffect(() => {
        const hasTemplateRecord = !!data.templateLayouts?.['unified-template'];
        if (!hasTemplateRecord && onReorder) {
            onReorder({
                mainSectionsOrder: mainOrder,
                sidebarSectionsOrder: sidebarOrder
            });
        }
    }, [onReorder]); // Add onReorder to deps

    // --- DATA VISIBILITY CHECK ---
    const hasSectionData = (sectionId) => {
        const sectionData = data[sectionId];
        if (!sectionData) return false;

        if (Array.isArray(sectionData)) return sectionData.length > 0;
        if (typeof sectionData === 'string') return sectionData.trim().length > 0;

        // Special cases
        if (sectionId === 'custom') return data.customSection && data.customSection.isVisible;
        if (sectionId === 'websites') {
            return websites && websites.filter(w => !w.addToHeader).length > 0;
        }

        return true;
    };

    // --- PREPARE SORTABLE LISTS ---
    // Remove Fixed sections from the sortable arrays
    const sortableMainOrder = mainOrder.filter(sid => !allFixedSections.includes(sid)).filter(hasSectionData);
    const sortableSidebarOrder = sidebarOrder.filter(sid => !allFixedSections.includes(sid)).filter(hasSectionData);

    const { dndContextProps, activeId, dragStartContainerId } = useResumeDragAndDrop({
        data,
        onReorder,
        scale,
        containers: {
            main: sortableMainOrder,
            sidebar: sortableSidebarOrder
        }
    });

    // --- STYLING CONTEXTS ---
    const sidebarContext = {
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
        "--zonal-header-margin": "0 -20px calc(15px * var(--theme-section-margin, 1)) -20px",
    };

    const mainContext = {
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
        "--zonal-header-margin": "0 -40px calc(15px * var(--theme-section-margin, 1)) -40px",
    };

    const layoutStyles = {
        sidebar: sidebarContext,
        main: mainContext
    };

    // --- HELPER TO RENDER A ZONE ---
    const renderZone = (zoneId, layoutArray, sortableItems) => {
        return (
            <DroppableZone id={zoneId} style={{ flex: 1, display: "flex", flexDirection: "column", gap: "calc(20px * var(--theme-section-margin, 1))", minHeight: "100px" }}>
                {layoutArray.map((item, idx) => {
                    // CASE 1: Sortable List Placeholder
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

                    // CASE 2: Fixed Section
                    // Only render if it has data (using same check as sortable ones for consistency)
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

    return (
        <div
            style={{
                display: "flex",
                minHeight: "100%",
                width: "100%",
                fontFamily: "var(--theme-font, 'Inter', sans-serif)",
                background: "var(--theme-background, white)",
                color: "var(--theme-text, #334155)",
                fontSize: "calc(14px * var(--theme-font-scale, 1))",
                lineHeight: "var(--theme-line-height, 1.5)"
            }}
        >
            <DndContext {...dndContextProps}>

                {/* --- SIDEBAR --- */}
                <div
                    style={{
                        width: "32%",
                        background: "var(--theme-sidebar-bg, #0a2540)",
                        color: "var(--theme-sidebar-text, #ffffff)",
                        padding: "var(--theme-page-margin, 30px) calc(var(--theme-page-margin, 40px) * 0.5)",
                        boxSizing: "border-box",
                        display: "flex",
                        flexDirection: "column",
                        gap: "calc(25px * var(--theme-section-margin, 1))",
                        ...sidebarContext
                    }}
                >
                    {/* Fixed Header (Personal, Contact) - Kept separate for now as it's complex layout */}
                    <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Header">
                        {personal?.photo && (
                            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                                <img src={personal.photo} alt={personal.name} style={{ width: "140px", height: "140px", borderRadius: "50%", objectFit: "cover", border: "4px solid rgba(255,255,255,0.1)" }} />
                            </div>
                        )}
                        <div style={{ textAlign: "center", marginBottom: "30px" }}>
                            <h1 style={{ fontSize: "2.5em", fontWeight: "800", margin: "0 0 8px 0", color: "var(--theme-sidebar-text, #ffffff)", textTransform: "uppercase", lineHeight: 1.2 }}>
                                <SpellCheckHighlighter
                                    text={personal?.name}
                                    isActive={isSpellCheckActive}
                                    onIgnore={onSpellCheckIgnore}
                                    onReplace={(val) => onSpellCheckReplace('personal', 'name', val)}
                                />
                            </h1>
                            <div style={{ fontSize: "1.1em", color: "var(--theme-sidebar-text, #ffffff)", opacity: 0.8, fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>
                                <SpellCheckHighlighter
                                    text={personal?.profession}
                                    isActive={isSpellCheckActive}
                                    onIgnore={onSpellCheckIgnore}
                                    onReplace={(val) => onSpellCheckReplace('personal', 'profession', val)}
                                />
                            </div>
                        </div>
                        <div>
                            <ZonalSectionHeader title="Contact" />
                            <div style={{ display: "flex", flexDirection: "column", gap: "calc(12px * var(--theme-paragraph-margin, 1))", fontSize: "0.95em" }}>
                                {personal?.email && (<div style={{ display: "flex", alignItems: "center", gap: "10px" }}><Mail size={14} color="var(--theme-color, #635bff)" /> <span style={{ wordBreak: 'break-all' }}>
                                    <SpellCheckHighlighter
                                        text={personal.email}
                                        isActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onReplace={(val) => onSpellCheckReplace('personal', 'email', val)}
                                    />
                                </span></div>)}
                                {personal?.phone && (<div style={{ display: "flex", alignItems: "center", gap: "10px" }}><Phone size={14} color="var(--theme-color, #635bff)" /> <span>
                                    <SpellCheckHighlighter
                                        text={personal.phone}
                                        isActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onReplace={(val) => onSpellCheckReplace('personal', 'phone', val)}
                                    />
                                </span></div>)}
                                {(personal?.city || personal?.state || personal?.country || personal?.pincode) && (<div style={{ display: "flex", alignItems: "start", gap: "10px" }}><MapPin size={14} color="var(--theme-color, #635bff)" /> <span>
                                    <SpellCheckHighlighter
                                        text={[personal.city, personal.state, personal.country, (personal.zipCode || personal.pincode)].filter(Boolean).join(", ")}
                                        isActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onReplace={(val) => {
                                            // This is a join of multiple fields, tricky to replace perfectly.
                                            // Let's assume they replace city if it was first.
                                            onSpellCheckReplace('personal', 'city', val.split(',')[0]);
                                        }}
                                    />
                                </span></div>)}
                                {personal?.linkedin && (<div style={{ display: "flex", alignItems: "center", gap: "10px" }}><Linkedin size={14} color="var(--theme-color, #635bff)" /><span style={{ wordBreak: 'break-all' }}>
                                    <SpellCheckHighlighter
                                        text={personal.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
                                        isActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onReplace={(val) => onSpellCheckReplace('personal', 'linkedin', val)}
                                    />
                                </span></div>)}
                                {personal?.github && (<div style={{ display: "flex", alignItems: "center", gap: "10px" }}><Github size={14} color="var(--theme-color, #635bff)" /><span style={{ wordBreak: 'break-all' }}>
                                    <SpellCheckHighlighter
                                        text={personal.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
                                        isActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onReplace={(val) => onSpellCheckReplace('personal', 'github', val)}
                                    />
                                </span></div>)}
                                {personal?.website && (<div style={{ display: "flex", alignItems: "center", gap: "10px" }}><Globe size={14} color="var(--theme-color, #635bff)" /><span style={{ wordBreak: 'break-all' }}>
                                    <SpellCheckHighlighter
                                        text={personal.website.replace(/^https?:\/\//, '')}
                                        isActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onReplace={(val) => onSpellCheckReplace('personal', 'website', val)}
                                    />
                                </span></div>)}
                                {websites?.map((site, originalIdx) => {
                                    if (!site.addToHeader) return null;
                                    return (
                                        <div key={originalIdx} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <div style={{ width: "14px", height: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: "14px", lineHeight: 1 }}>🌐</span></div>
                                            <span style={{ wordBreak: 'break-all' }}>
                                                <SpellCheckHighlighter
                                                    text={site.url}
                                                    isActive={isSpellCheckActive}
                                                    onIgnore={onSpellCheckIgnore}
                                                    onReplace={(val) => onSpellCheckReplace('websites', originalIdx, val, 'url')}
                                                />
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </SectionWrapper>
                    {(personal?.dob || personal?.nationality || personal?.gender || personal?.maritalStatus || personal?.visaStatus || personal?.passport || personal?.religion) && (
                        <SectionWrapper sectionId="personalDetails" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Personal Details">
                            <div style={{ marginTop: "20px" }}>
                                <ZonalSectionHeader title="Personal Details" />
                                <div style={{ display: "flex", flexDirection: "column", gap: "calc(8px * var(--theme-paragraph-margin, 1))", fontSize: "0.95em" }}>
                                    {[
                                        { key: 'dob', label: 'DOB', value: personal.dob },
                                        { key: 'nationality', label: 'Nationality', value: personal.nationality },
                                        { key: 'gender', label: 'Gender', value: personal.gender },
                                        { key: 'maritalStatus', label: 'Marital Status', value: personal.maritalStatus },
                                        { key: 'religion', label: 'Religion', value: personal.religion },
                                        { key: 'visaStatus', label: 'Visa', value: personal.visaStatus },
                                        { key: 'passport', label: 'Passport', value: personal.passport },
                                    ].map((item, idx) => item.value && (
                                        <div key={idx} style={{ display: "flex", justifyContent: "space-between" }}>
                                            <span style={{ opacity: 0.7 }}>{item.label}</span>
                                            <span>
                                                <SpellCheckHighlighter
                                                    text={item.value}
                                                    isActive={isSpellCheckActive}
                                                    onIgnore={onSpellCheckIgnore}
                                                    onReplace={(val) => onSpellCheckReplace('personal', item.key, val)}
                                                />
                                            </span>
                                        </div>
                                    ))}
                                    {personal.otherPersonal && (<div style={{ marginTop: "4px" }}><span style={{ opacity: 0.7, display: "block", marginBottom: "2px" }}>Other:</span><span>
                                        <SpellCheckHighlighter
                                            text={personal.otherPersonal}
                                            isActive={isSpellCheckActive}
                                            onIgnore={onSpellCheckIgnore}
                                            onReplace={(val) => onSpellCheckReplace('personal', 'otherPersonal', val)}
                                        />
                                    </span></div>)}
                                </div>
                            </div>
                        </SectionWrapper>
                    )}

                    {/* RENDER SIDEBAR ZONE */}
                    {renderZone("sidebar", layout.sidebar || [SORTABLE_KEY], sortableSidebarOrder)}
                </div>

                {/* --- MAIN CONTENT --- */}
                <div style={{
                    flex: 1,
                    padding: "var(--theme-page-margin, 40px)",
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "column",
                    gap: "calc(25px * var(--theme-section-margin, 1))",
                    ...mainContext
                }}>
                    {/* RENDER MAIN ZONE */}
                    {renderZone("main", layout.main || [SORTABLE_KEY], sortableMainOrder)}
                </div>

                {/* Drag Overlay */}
                <StableResumeDragOverlay
                    activeId={activeId}
                    dragStartContainerId={dragStartContainerId}
                    scale={scale}
                    renderSection={(id, startContainer) => (
                        <div style={{
                            width: '100%', opacity: 0.9,
                            ...(layoutStyles[startContainer] || {})
                        }}>
                            <div style={{
                                backgroundColor: startContainer === 'sidebar' ? 'var(--theme-sidebar-bg, #0a2540)' : 'var(--theme-background, white)',
                                color: startContainer === 'sidebar' ? 'white' : 'inherit',
                                padding: '15px', borderRadius: '8px',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.3)', border: '2px solid #3b82f6',
                                width: startContainer === 'sidebar' ? "280px" : "500px",
                            }}>
                                <SectionRenderer sectionId={id} data={data} onSectionClick={null} isSpellCheckActive={false} />
                            </div>
                        </div>
                    )} />

            </DndContext>
        </div>
    );
};

export default UnifiedTemplate;
