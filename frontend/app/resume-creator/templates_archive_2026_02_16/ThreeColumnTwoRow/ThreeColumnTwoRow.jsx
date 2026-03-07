import React from "react";
import { DndContext } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SectionWrapper from "../../components/SectionWrapper";
import { useResumeDragAndDrop, DroppableZone, StableResumeDragOverlay } from "../../hooks/useResumeDragAndDrop";
import DraggableSection from "../../components/dnd/DraggableSection";
import SectionRenderer from "../common/SectionRenderer";
import { ZonalSectionHeader } from "../common/BaseComponents";
import SpellCheckHighlighter from "../../components/SpellCheckHighlighter";
import { MapPin, Phone, Mail, Linkedin, Github, Globe } from "lucide-react";

/**
 * ThreeColumnTwoRow Template
 * Features a full-width header and three columns for content.
 * 2 rows concept: Row 1 = Header (fixed), Row 2 = 3 Columns (draggable)
 */
const ThreeColumnTwoRow = ({ data, onSectionClick, onReorder, scale = 1, isSpellCheckActive, onSpellCheckIgnore, onSpellCheckReplace, layoutConfig }) => {
    if (!data) return null;

    const isInteractive = !!onSectionClick && !isSpellCheckActive;
    const canReorder = !!onReorder && !isSpellCheckActive;

    const { personal, websites } = data;

    // --- DEFAULTS & CONFIG ---
    const defaultLayout = {
        left: ['summary', 'skills', 'languages'],
        center: ['experience', 'projects'],
        right: ['education', 'certifications', 'interests']
    };

    const layout = layoutConfig || defaultLayout;

    const templateId = 'three-column-two-row';
    const templateLayout = data.templateLayouts?.[templateId] || {};

    const leftOrder = templateLayout.leftOrder || defaultLayout.left;
    const centerOrder = templateLayout.centerOrder || defaultLayout.center;
    const rightOrder = templateLayout.rightOrder || defaultLayout.right;

    // Ensure all known sections are present somewhere if not explicitly placed
    const allKnownSections = [
        'summary', 'experience', 'education', 'skills', 'projects', 'languages',
        'certifications', 'interests', 'websites', 'software', 'affiliations',
        'strengths', 'additionalSkills', 'keyAchievements', 'accomplishments', 'additionalInfo', 'custom'
    ];

    const currentSelection = [...leftOrder, ...centerOrder, ...rightOrder];

    // Add missing sections to the left column by default
    const finalLeftOrder = [...leftOrder];
    allKnownSections.forEach(s => {
        if (!currentSelection.includes(s)) {
            finalLeftOrder.push(s);
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

    const activeLeft = finalLeftOrder.filter(hasSectionData);
    const activeCenter = centerOrder.filter(hasSectionData);
    const activeRight = rightOrder.filter(hasSectionData);

    const { dndContextProps, activeId, dragStartContainerId } = useResumeDragAndDrop({
        data,
        onReorder: (newOrder) => {
            if (onReorder) onReorder(newOrder);
        },
        scale,
        containers: {
            left: activeLeft,
            center: activeCenter,
            right: activeRight
        }
    });

    const themeColor = "var(--theme-color, #3b82f6)";
    const themeText = "var(--theme-text, #334155)";

    const columnStyle = {
        display: "flex",
        flexDirection: "column",
        gap: "calc(20px * var(--theme-section-margin, 1))",
        minHeight: "100px"
    };

    return (
        <div style={{
            minHeight: "100%",
            width: "100%",
            fontFamily: "var(--theme-font, 'Inter', sans-serif)",
            background: "var(--theme-background, white)",
            color: "var(--theme-text, #334155)",
            padding: "var(--theme-page-margin, 40px)",
            boxSizing: "border-box"
        }}>
            <DndContext {...dndContextProps}>
                {/* --- ROW 1: FULL WIDTH HEADER --- */}
                <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Header">
                    <div style={{
                        borderBottom: `2px solid ${themeColor}`,
                        paddingBottom: "20px",
                        marginBottom: "30px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end"
                    }}>
                        <div>
                            <h1 style={{
                                fontSize: "calc(2.5em * var(--theme-font-scale, 1))",
                                fontWeight: "800",
                                margin: "0 0 5px 0",
                                color: themeColor,
                                textTransform: "uppercase"
                            }}>
                                <SpellCheckHighlighter
                                    text={personal?.name}
                                    isActive={isSpellCheckActive}
                                    onIgnore={onSpellCheckIgnore}
                                    onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('personal', 'name', val)}
                                />
                            </h1>
                            <p style={{
                                fontSize: "calc(1.2em * var(--theme-font-scale, 1))",
                                fontWeight: "600",
                                margin: 0,
                                opacity: 0.8
                            }}>
                                <SpellCheckHighlighter
                                    text={personal?.profession}
                                    isActive={isSpellCheckActive}
                                    onIgnore={onSpellCheckIgnore}
                                    onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('personal', 'profession', val)}
                                />
                            </p>
                        </div>
                        <div style={{ textAlign: "right", fontSize: "0.9em", display: "flex", flexDirection: "column", gap: "2px" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
                                <span>
                                    <SpellCheckHighlighter
                                        text={personal.email}
                                        isActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('personal', 'email', val)}
                                    />
                                </span>
                                <Mail size={14} color={themeColor} />
                            </div>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
                                <span>
                                    <SpellCheckHighlighter
                                        text={personal.phone}
                                        isActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('personal', 'phone', val)}
                                    />
                                </span>
                                <Phone size={14} color={themeColor} />
                            </div>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px" }}>
                                <span>
                                    <SpellCheckHighlighter
                                        text={[personal.city, personal.state, personal.country].filter(Boolean).join(", ")}
                                        isActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('personal', 'city', val.split(',')[0].trim())}
                                    />
                                </span>
                                <MapPin size={14} color={themeColor} />
                            </div>
                        </div>
                    </div>
                </SectionWrapper>

                {/* --- ROW 2: THREE COLUMNS --- */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "30px" }}>
                    {/* LEFT COLUMN */}
                    <DroppableZone id="left" style={columnStyle}>
                        <SortableContext items={activeLeft} strategy={verticalListSortingStrategy} id="left">
                            {activeLeft.map(sid => (
                                <DraggableSection key={sid} id={sid} isEnabled={canReorder}>
                                    <SectionRenderer
                                        sectionId={sid}
                                        data={data}
                                        onSectionClick={onSectionClick}
                                        isSpellCheckActive={isSpellCheckActive}
                                        onSpellCheckIgnore={onSpellCheckIgnore}
                                        onSpellCheckReplace={onSpellCheckReplace}
                                    />
                                </DraggableSection>
                            ))}
                        </SortableContext>
                    </DroppableZone>

                    {/* CENTER COLUMN */}
                    <DroppableZone id="center" style={columnStyle}>
                        <SortableContext items={activeCenter} strategy={verticalListSortingStrategy} id="center">
                            {activeCenter.map(sid => (
                                <DraggableSection key={sid} id={sid} isEnabled={canReorder}>
                                    <SectionRenderer
                                        sectionId={sid}
                                        data={data}
                                        onSectionClick={onSectionClick}
                                        isSpellCheckActive={isSpellCheckActive}
                                        onSpellCheckIgnore={onSpellCheckIgnore}
                                        onSpellCheckReplace={onSpellCheckReplace}
                                    />
                                </DraggableSection>
                            ))}
                        </SortableContext>
                    </DroppableZone>

                    {/* RIGHT COLUMN */}
                    <DroppableZone id="right" style={columnStyle}>
                        <SortableContext items={activeRight} strategy={verticalListSortingStrategy} id="right">
                            {activeRight.map(sid => (
                                <DraggableSection key={sid} id={sid} isEnabled={canReorder}>
                                    <SectionRenderer
                                        sectionId={sid}
                                        data={data}
                                        onSectionClick={onSectionClick}
                                        isSpellCheckActive={isSpellCheckActive}
                                        onSpellCheckIgnore={onSpellCheckIgnore}
                                        onSpellCheckReplace={onSpellCheckReplace}
                                    />
                                </DraggableSection>
                            ))}
                        </SortableContext>
                    </DroppableZone>
                </div>

                <StableResumeDragOverlay
                    activeId={activeId}
                    dragStartContainerId={dragStartContainerId}
                    scale={scale}
                    renderSection={(id) => (
                        <div style={{
                            width: "240px",
                            background: "white",
                            padding: "15px",
                            borderRadius: "8px",
                            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
                            border: `2px solid ${themeColor}`,
                            opacity: 0.9
                        }}>
                            <SectionRenderer sectionId={id} data={data} />
                        </div>
                    )} />
            </DndContext>
        </div>
    );
};

export default ThreeColumnTwoRow;
