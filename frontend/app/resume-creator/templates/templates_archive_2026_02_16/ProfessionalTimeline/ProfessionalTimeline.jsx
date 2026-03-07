import React, { useRef } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SectionWrapper from "../../components/SectionWrapper";
import { useResumeDragAndDrop, DroppableZone, StableResumeDragOverlay } from "../../hooks/useResumeDragAndDrop";
import DraggableSection from "../../components/dnd/DraggableSection";
import SectionRenderer from "../common/SectionRenderer";
import SpellCheckHighlighter from "../../components/SpellCheckHighlighter";
import { useAutoPagination } from "../../hooks/useAutoPagination";
import { Mail, Phone, Linkedin, Globe } from "lucide-react";

/**
 * ProfessionalTimeline Template
 * A sophisticated layout featuring a timeline-style work history, 
 * clean header with distinct contact sections, and premium typography.
 */
const ProfessionalTimeline = ({
    data,
    onSectionClick,
    onReorder,
    scale = 1,
    isSpellCheckActive,
    onSpellCheckIgnore,
    onSpellCheckReplace,
    layoutConfig,
    showPageBreaks
}) => {
    const containerRef = useRef(null);

    // --- 1. DATA PREP ---
    if (!data) return null;
    const { personal } = data;
    const isInteractive = !!onSectionClick && !isSpellCheckActive;
    const canReorder = !!onReorder && !isSpellCheckActive;

    // --- 2. LAYOUT & ORDERING ---
    const templateId = layoutConfig?.id || 'professional-timeline';
    const defaultOrder = [
        'experience', 'education', 'skills', 'languages', 'certifications', 'projects',
        'interests', 'keyAchievements'
    ];

    const currentOrder = data.templateLayouts?.[templateId]?.mainSectionsOrder ||
        data.mainSectionsOrder ||
        defaultOrder;

    const allKnownSections = [
        'experience', 'education', 'skills', 'languages', 'certifications', 'projects',
        'interests', 'keyAchievements', 'accomplishments', 'additionalInfo', 'custom'
    ];

    const hasSectionData = (sid) => {
        if (sid === 'summary') return false; // Summary is in header
        if (sid === 'custom') return !!data.customSection?.isVisible && !!data.customSection?.content;
        const val = data[sid];
        if (!val) return false;
        if (Array.isArray(val)) return val.length > 0;
        if (typeof val === 'string') return val.trim().length > 0;
        return true;
    };

    const activeSections = [
        ...currentOrder.filter(hasSectionData),
        ...allKnownSections.filter(sid => !currentOrder.includes(sid) && hasSectionData(sid))
    ];

    // --- 3. DRAG & DROP HOOK ---
    const { dndContextProps, activeId, dragStartContainerId } = useResumeDragAndDrop({
        data,
        onReorder,
        scale,
        containers: { main: activeSections }
    });

    // --- 4. PAGINATION HOOK ---
    const pages = useAutoPagination({
        columns: { main: activeSections },
        data,
        enabled: showPageBreaks,
        containerRef,
        scale
    });

    // --- 5. STYLES ---
    const styles = {
        page: {
            width: "210mm",
            height: "297mm",
            background: "white",
            padding: "50px 60px",
            boxSizing: "border-box",
            position: "relative",
            margin: "0 auto 30px auto",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            color: "#1e293b",
            fontFamily: "'Inter', sans-serif",
            overflow: "hidden"
        },
        header: {
            marginBottom: "30px"
        },
        topHeader: {
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            paddingBottom: "8px",
            borderBottom: "1.5px solid #cbd5e1",
            marginBottom: "20px"
        },
        profession: {
            fontSize: "13.5px",
            fontWeight: "700",
            letterSpacing: "0.5px",
            color: "#475569",
            textTransform: "uppercase"
        },
        name: {
            fontSize: "48px",
            fontWeight: "900",
            margin: "0 0 15px 0",
            textTransform: "uppercase",
            color: "#1e293b",
            lineHeight: 1
        },
        summary: {
            fontSize: "12px",
            lineHeight: "1.6",
            color: "#475569",
            marginBottom: "25px",
            maxWidth: "90%"
        },
        contactGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "20px",
            borderTop: "1.5px solid #f1f5f9",
            paddingTop: "15px",
            marginBottom: "10px"
        },
        contactItem: {
            display: "flex",
            flexDirection: "column",
            gap: "4px"
        },
        contactLabel: {
            fontSize: "10px",
            fontWeight: "700",
            color: "#94a3b8",
            textTransform: "uppercase",
            letterSpacing: "1px"
        },
        contactValue: {
            fontSize: "12px",
            color: "#1e293b",
            fontWeight: "500",
            wordBreak: "break-all"
        },
        column: {
            display: "flex",
            flexDirection: "column",
            gap: "25px"
        }
    };

    const customThemeVariables = {
        "--theme-color": "#2563eb",
        "--section-title-size": "15px",
        "--section-title-weight": "700",
        "--section-title-border": "none",
        "--section-title-spacing": "0.5px",
        "--item-title-size": "14px",
        "--item-subtitle-size": "11px",
        "--item-base-size": "11.5px",
        "--item-body-color": "#334155",
        "--section-item-gap": "15px"
    };

    const Header = () => {
        return (
            <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Header">
                <div style={styles.header}>
                    <div style={styles.topHeader}>
                        <div style={styles.profession}>
                            <SpellCheckHighlighter
                                text={personal?.profession || "IT PROJECT MANAGER"}
                                isActive={isSpellCheckActive}
                                onIgnore={onSpellCheckIgnore}
                                onReplace={(val) => onSpellCheckReplace('personal', 'profession', val)}
                            />
                        </div>
                    </div>

                    <h1 style={styles.name}>
                        <SpellCheckHighlighter
                            text={personal?.name}
                            isActive={isSpellCheckActive}
                            onIgnore={onSpellCheckIgnore}
                            onReplace={(val) => onSpellCheckReplace('personal', 'name', val)}
                        />
                    </h1>

                    <div style={styles.summary}>
                        <SpellCheckHighlighter
                            text={data.summary}
                            isActive={isSpellCheckActive}
                            onIgnore={onSpellCheckIgnore}
                            onReplace={(val) => onSpellCheckReplace('summary', 'summary', val)}
                        />
                    </div>

                    <div style={styles.contactGrid}>
                        {personal?.email && (
                            <div style={styles.contactItem}>
                                <div style={styles.contactLabel}>Email</div>
                                <div style={styles.contactValue}>
                                    <SpellCheckHighlighter text={personal.email} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'email', val)} />
                                </div>
                            </div>
                        )}
                        {personal?.phone && (
                            <div style={styles.contactItem}>
                                <div style={styles.contactLabel}>Phone</div>
                                <div style={styles.contactValue}>
                                    <SpellCheckHighlighter text={personal.phone} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'phone', val)} />
                                </div>
                            </div>
                        )}
                        {personal?.linkedin && (
                            <div style={styles.contactItem}>
                                <div style={styles.contactLabel}>LinkedIn</div>
                                <div style={styles.contactValue}>
                                    <SpellCheckHighlighter
                                        text={personal.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
                                        isActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onReplace={(val) => onSpellCheckReplace('personal', 'linkedin', val)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </SectionWrapper>
        );
    };

    const renderZone = (id, items) => (
        <DroppableZone id={id} style={styles.column}>
            {items.filter(item => (typeof item === 'string' ? item : item.id) !== 'personal').map((item, idx) => {
                const sectionId = typeof item === 'string' ? item : item.id;
                const isContinued = typeof item === 'object' && item.isContinued;
                const indices = typeof item === 'object' ? item.itemIndices : undefined;
                const ranges = typeof item === 'object' ? item.subItemRanges : undefined;
                const dragId = isContinued ? `${id}-cont-${sectionId}-${idx}` : sectionId;

                return (
                    <DraggableSection key={dragId} id={dragId} isEnabled={canReorder && !isContinued}>
                        <SectionRenderer
                            sectionId={sectionId}
                            data={data}
                            onSectionClick={onSectionClick}
                            isSpellCheckActive={isSpellCheckActive}
                            onSpellCheckIgnore={onSpellCheckIgnore}
                            onSpellCheckReplace={onSpellCheckReplace}
                            isContinued={isContinued}
                            itemIndices={indices}
                            subItemRanges={ranges}
                            variants={{
                                experience: 'timeline',
                                education: 'timeline',
                                skills: 'grid',
                                software: 'grid',
                                languages: 'timeline',
                                certifications: 'timeline',
                                projects: 'modern'
                            }}
                        />
                    </DraggableSection>
                );
            })}
        </DroppableZone>
    );

    const Measurer = () => (
        <div className="resume-measurer" style={{ position: "absolute", top: -10000, left: -10000, width: "210mm", visibility: "hidden" }}>
            <div style={{ ...styles.page, ...customThemeVariables, height: "auto" }}>
                <div data-column-id="main" style={{ ...styles.column, paddingTop: "40px", paddingBottom: "40px" }}>
                    <Header />
                    {activeSections.map(sid => (
                        <SectionRenderer
                            key={sid}
                            sectionId={sid}
                            data={data}
                            variants={{ experience: 'timeline', education: 'timeline', skills: 'list' }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div ref={containerRef} className="professional-timeline-root">
            <Measurer />
            <DndContext {...dndContextProps}>
                <SortableContext items={activeSections} strategy={verticalListSortingStrategy}>
                    {showPageBreaks && pages ? (
                        pages.map((page, i) => (
                            <div key={i} style={{ ...styles.page, ...customThemeVariables }}>
                                {i === 0 && <Header />}
                                {renderZone(`main-p${i}`, page.main)}
                            </div>
                        ))
                    ) : (
                        <div style={{ ...styles.page, ...customThemeVariables, height: "auto", minHeight: "100%" }}>
                            <Header />
                            {renderZone('main', activeSections)}
                        </div>
                    )}
                </SortableContext>

                <StableResumeDragOverlay
                    activeId={activeId}
                    dragStartContainerId={dragStartContainerId}
                    scale={scale}
                    renderSection={(id) => (
                        <div style={{ background: "white", padding: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)", borderRadius: "8px" }}>
                            <SectionRenderer sectionId={id} data={data} variants={{ experience: 'timeline' }} />
                        </div>
                    )}
                />
            </DndContext>

            <style jsx global>{`
                .professional-timeline-root .template-section-title {
                    margin-top: 10px;
                }
                .professional-timeline-root .sub-item-block {
                    margin-bottom: 4px;
                }
                .professional-timeline-root .resume-rich-text ul {
                    padding-left: 15px;
                }
                .professional-timeline-root .resume-rich-text li {
                    margin-bottom: 2px;
                }
            `}</style>
        </div>
    );
};

export default ProfessionalTimeline;
