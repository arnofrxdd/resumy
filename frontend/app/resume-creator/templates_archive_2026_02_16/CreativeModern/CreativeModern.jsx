import React from "react";
import { DndContext } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SectionWrapper from "../../components/SectionWrapper";
import { useResumeDragAndDrop, DroppableZone, StableResumeDragOverlay } from "../../hooks/useResumeDragAndDrop";
import DraggableSection from "../../components/dnd/DraggableSection";
import SectionRenderer from "../common/SectionRenderer";
import { SpellCheckText, RichTextSpellCheck, SectionTitle } from "../common/BaseComponents";
import SpellCheckHighlighter from "../../components/SpellCheckHighlighter";
import { MapPin, Phone, Mail, Linkedin, Github, Globe } from "lucide-react";

/**
 * CreativeModern Template
 * A bold two-column layout with a distinct sidebar and modern typography.
 */
const CreativeModern = ({ data, onSectionClick, onReorder, scale = 1, isSpellCheckActive, onSpellCheckIgnore, onSpellCheckReplace, layoutConfig }) => {
    if (!data) return null;

    const isInteractive = !!onSectionClick && !isSpellCheckActive;
    const canReorder = !!onReorder && !isSpellCheckActive;

    const { personal, websites } = data;

    // --- DEFAULTS & CONFIG ---
    const SORTABLE_KEY = "{{SORTABLE}}";

    // Define default sections for sidebar and main if not provided
    const defaultLayout = {
        main: ['summary', 'experience', 'education', 'projects', 'certifications'],
        sidebar: ['skills', 'languages', 'interests', 'affiliations', 'websites']
    };

    // Merge/Use provided layout or fallbacks
    // We need to ensure we don't lose sections. 
    // For this template, we might want to FORCE certain sections to specific columns to maintain the "look", 
    // OR we allow full DND. Let's allow DND but initialize with a good split.
    const layout = layoutConfig || defaultLayout;

    // If layoutConfig is just "main: [ALL]", we need to split it for this template to look good initially.
    // However, the system passes `layout` based on `TemplateManager` config. 
    // We will configure `TemplateManager` to have specific main/sidebar split for this ID.

    const mainSections = layout.main || [];
    const sidebarSections = layout.sidebar || [];

    // Filter out {{SORTABLE}} and replace with actual sections if needed, 
    // but usually the parent component handles the "pool" of sections.
    // For now, let's assume `data.mainSectionsOrder` and `data.sidebarSectionsOrder` might be used if available,
    // or we derive them. 

    // SIMPLIFICATION:
    // To ensure it works with the existing DND hook, we'll define two droppable zones.
    // We need to know WHICH sections are in Main vs Sidebar.
    // The `useResumeDragAndDrop` hook helps manage this if we pass multiple containers.

    // Let's use the data.templateLayouts['creative-modern'] if it exists, otherwise default split.
    const templateLayout = data.templateLayouts?.['creative-modern'] || {};
    const mainOrder = templateLayout.mainSectionsOrder || defaultLayout.main;
    const sidebarOrder = templateLayout.sidebarSectionsOrder || defaultLayout.sidebar;

    // Ensure all known sections are present somewhere
    const allKnownSections = [
        'summary', 'experience', 'education', 'skills', 'projects', 'languages',
        'certifications', 'interests', 'websites', 'software', 'affiliations',
        'strengths', 'additionalSkills', 'keyAchievements', 'accomplishments', 'additionalInfo', 'custom'
    ];

    // naive accumulation of missing sections into sidebar for now
    allKnownSections.forEach(s => {
        if (!mainOrder.includes(s) && !sidebarOrder.includes(s)) {
            sidebarOrder.push(s);
        }
    });

    const hasSectionData = (sid) => {
        const sData = data[sid];
        if (!sData) return false;
        if (Array.isArray(sData)) return sData.length > 0;
        if (typeof sData === 'string') return sData.trim().length > 0;
        if (sid === 'custom') return data.customSection && data.customSection.isVisible;
        if (sid === 'websites') return websites && websites.length > 0;
        return true;
    };

    const activeMainSections = mainOrder.filter(hasSectionData);
    const activeSidebarSections = sidebarOrder.filter(hasSectionData);

    const { dndContextProps, activeId, dragStartContainerId } = useResumeDragAndDrop({
        data,
        onReorder: (newOrder) => {
            if (onReorder) onReorder(newOrder, 'creative-modern');
        },
        scale,
        containers: {
            main: activeMainSections,
            sidebar: activeSidebarSections
        }
    });

    // --- LAYOUT CONSTANTS ---
    const themeColor = "var(--theme-color, #3b82f6)"; // Default to a nice blue if not set
    const themeText = "var(--theme-text, #334155)";

    return (
        <div style={{
            minHeight: "100%",
            width: "100%",
            fontFamily: "var(--theme-font, 'Poppins', sans-serif)",
            background: "white",
            color: themeText,
            padding: "20px", // External padding
            boxSizing: "border-box"
        }}>
            {/* --- DASHED BORDER FRAME --- */}
            {/* --- MAIN CONTENT WRAPPER --- */}
            <div style={{
                height: "100%",
                minHeight: "1000px",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden"
            }}>
                <DndContext {...dndContextProps}>

                    {/* --- HEADER (Full Width, Blue Background) --- */}
                    <div style={{
                        backgroundColor: themeColor,
                        color: "white",
                        padding: "30px 40px",
                        textAlign: "left"
                    }}>
                        <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Header">
                            <h1 style={{
                                fontSize: "calc(2.5em * var(--theme-font-scale, 1))",
                                fontWeight: "800",
                                margin: "0 0 5px 0",
                                textTransform: "uppercase",
                                letterSpacing: "1px"
                            }}>
                                <SpellCheckHighlighter
                                    text={personal?.name}
                                    isActive={isSpellCheckActive}
                                    onIgnore={onSpellCheckIgnore}
                                    onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('personal', 'name', val)}
                                />
                            </h1>
                            <p style={{
                                fontSize: "calc(1.1em * var(--theme-font-scale, 1))",
                                opacity: 0.9,
                                fontWeight: "400",
                                margin: 0
                            }}>
                                <SpellCheckHighlighter
                                    text={personal?.profession}
                                    isActive={isSpellCheckActive}
                                    onIgnore={onSpellCheckIgnore}
                                    onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('personal', 'profession', val)}
                                />
                            </p>
                        </SectionWrapper>
                    </div>

                    {/* --- TWO COLUMN CONTENT --- */}
                    <div style={{ display: "flex", flex: 1 }}>

                        {/* --- LEFT COLUMN (MAIN - 65%) --- */}
                        <div style={{
                            width: "65%",
                            padding: "30px 30px 30px 40px",
                            borderRight: "1px solid #e2e8f0" // Optional separator
                        }}>
                            {/* SUMMARY (If present in main) */}
                            {/* We let the DND handle the content */}
                            <DroppableZone id="main" style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                                <SortableContext items={activeMainSections} strategy={verticalListSortingStrategy} id="main">
                                    {activeMainSections.map(sid => (
                                        <DraggableSection key={sid} id={sid} isEnabled={canReorder}>
                                            <SectionRenderer
                                                sectionId={sid}
                                                data={data}
                                                onSectionClick={onSectionClick}
                                                isSpellCheckActive={isSpellCheckActive}
                                                onSpellCheckIgnore={onSpellCheckIgnore}
                                                onSpellCheckReplace={onSpellCheckReplace}
                                                variants={{
                                                    experience: 'modern',
                                                    education: 'modern',
                                                    summary: 'modern'
                                                }}
                                            />
                                        </DraggableSection>
                                    ))}
                                </SortableContext>
                            </DroppableZone>
                        </div>

                        {/* --- RIGHT COLUMN (SIDEBAR - 35%) --- */}
                        <div style={{
                            width: "35%",
                            padding: "30px 40px 30px 30px",
                            backgroundColor: "#f8fafc" // Light gray background for sidebar as per some modern styles, or keep white
                        }}>
                            {/* PHOTO & CONTACT */}
                            <div style={{ marginBottom: "30px" }}>
                                {personal.photo && (
                                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                                        <img
                                            src={personal.photo}
                                            alt="Profile"
                                            style={{
                                                width: "150px",
                                                height: "150px",
                                                borderRadius: "4px", // Rounded rect as per image often
                                                objectFit: "cover",
                                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                                            }}
                                        />
                                    </div>
                                )}

                                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                    <SectionTitle title="Contact" style={{ color: themeColor, fontSize: "1.2em", borderBottom: `2px solid ${themeColor}`, paddingBottom: "5px", marginBottom: "10px" }} />

                                    {personal?.city && (
                                        <div style={{ fontSize: "0.9em", display: "flex", flexDirection: "column" }}>
                                            <span style={{ fontWeight: 700, color: themeText }}>Address</span>
                                            <span>
                                                <SpellCheckHighlighter
                                                    text={`${personal.city}${personal.country ? ', ' + personal.country : ''}`}
                                                    isActive={isSpellCheckActive}
                                                    onIgnore={onSpellCheckIgnore}
                                                    onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('personal', 'city', val.split(',')[0].trim())}
                                                />
                                            </span>
                                        </div>
                                    )}
                                    {personal?.phone && (
                                        <div style={{ fontSize: "0.9em", display: "flex", flexDirection: "column" }}>
                                            <span style={{ fontWeight: 700, color: themeText }}>Phone</span>
                                            <span>
                                                <SpellCheckHighlighter
                                                    text={personal.phone}
                                                    isActive={isSpellCheckActive}
                                                    onIgnore={onSpellCheckIgnore}
                                                    onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('personal', 'phone', val)}
                                                />
                                            </span>
                                        </div>
                                    )}
                                    {personal?.email && (
                                        <div style={{ fontSize: "0.9em", display: "flex", flexDirection: "column" }}>
                                            <span style={{ fontWeight: 700, color: themeText }}>Email</span>
                                            <span style={{ wordBreak: "break-all" }}>
                                                <SpellCheckHighlighter
                                                    text={personal.email}
                                                    isActive={isSpellCheckActive}
                                                    onIgnore={onSpellCheckIgnore}
                                                    onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('personal', 'email', val)}
                                                />
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <DroppableZone id="sidebar" style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
                                <SortableContext items={activeSidebarSections} strategy={verticalListSortingStrategy} id="sidebar">
                                    {activeSidebarSections.map(sid => (
                                        <DraggableSection key={sid} id={sid} isEnabled={canReorder}>
                                            <SectionRenderer
                                                sectionId={sid}
                                                data={data}
                                                onSectionClick={onSectionClick}
                                                isSpellCheckActive={isSpellCheckActive}
                                                onSpellCheckIgnore={onSpellCheckIgnore}
                                                onSpellCheckReplace={onSpellCheckReplace}
                                                variants={{
                                                    skills: 'list', // List view usually looks better in narrow columns
                                                    languages: 'list'
                                                }}
                                            />
                                        </DraggableSection>
                                    ))}
                                </SortableContext>
                            </DroppableZone>
                        </div>

                    </div>

                    {/* Drag Overlay */}
                    <StableResumeDragOverlay
                        activeId={activeId}
                        dragStartContainerId={dragStartContainerId}
                        scale={scale}
                        renderSection={(id) => (
                            <div style={{
                                width: "100%",
                                background: "white",
                                padding: "15px",
                                borderRadius: "4px",
                                boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                                border: `1px solid ${themeColor}`
                            }}>
                                <SectionRenderer sectionId={id} data={data} />
                            </div>
                        )} />

                </DndContext>
            </div>
        </div>
    );
};

export default CreativeModern;
