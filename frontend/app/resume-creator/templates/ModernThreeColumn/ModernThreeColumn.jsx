import React, { useRef } from "react";
import { DndContext } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SectionWrapper from "../../components/SectionWrapper";
import { useResumeDragAndDrop, DroppableZone, StableResumeDragOverlay } from "../../hooks/useResumeDragAndDrop";
import DraggableSection from "../../components/dnd/DraggableSection";
import SectionRenderer from "../common/SectionRenderer";
import { useSectionContext } from "../common/SectionContext";
import { useAutoPagination } from "../../hooks/useAutoPagination";
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";
import { SpellCheckText, RichTextSpellCheck, ResumeLink } from "../common/BaseComponents";
import { getCompleteLayout, getSavedLayout } from "../common/TemplateUtils";

/**
 * ModernThreeColumn Skeleton (3-Column)
 * A clean 3-column skeleton kernel for high-density resumes.
 */
const ModernThreeColumn = ({
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

    // --- 2. DYNAMIC LAYOUT ENGINE ---
    const templateId = layoutConfig?.id || 'modern-three-column';
    const initialLayout = getSavedLayout(data, templateId, {
        left: ['skills', 'software', 'strengths'],
        main: ['summary', 'experience', 'projects', 'keyAchievements', 'accomplishments', 'custom'],
        right: ['education', 'languages', 'certifications', 'interests', 'additionalSkills', 'websites', 'affiliations', 'additionalInfo']
    });

    // Auto-complete the layout with any "orphaned" sections (e.g. Certifications, Languages)
    const completeLayout = getCompleteLayout(data, initialLayout, 'right');
    const activeLeft = completeLayout.left || [];
    const activeMain = completeLayout.main || [];
    const activeRight = completeLayout.right || [];

    // --- 3. DRAG & DROP HOOK ---
    const { dndContextProps, activeId } = useResumeDragAndDrop({
        data,
        onReorder,
        scale,
        containers: { left: activeLeft, main: activeMain, right: activeRight }
    });

    // --- 4. PAGINATION HOOK ---
    const pages = useAutoPagination({
        columns: { left: activeLeft, main: activeMain, right: activeRight },
        data,
        enabled: showPageBreaks,
        containerRef,
        scale
    });

    // --- 5. STYLES (Dynamic Panel Support) ---
    const styles = {
        page: {
            width: "210mm",
            height: "297mm",
            background: "white",
            padding: "var(--theme-page-margin, 40px)",
            boxSizing: "border-box",
            position: "relative",
            margin: "0 auto 30px auto",
            color: "#1e293b",
            fontFamily: "var(--theme-font, 'Inter', sans-serif)",
            overflow: "visible",
            display: "flex",
            flexDirection: "column",
            gap: "var(--theme-section-margin, 25px)"
        },
        header: {
            paddingBottom: "25px",
            textAlign: "center",
            borderBottom: "1px solid var(--theme-border-color, #f1f5f9)"
        },
        layoutBody: {
            display: "flex",
            flex: 1,
            minHeight: 0
        },
        column: {
            display: "flex",
            flexDirection: "column",
            gap: "var(--theme-section-margin, 25px)",
            padding: "0 15px" // Internal padding for all columns
        },
        sideColumn: {
            width: "25%",
            minWidth: "25%",
            maxWidth: "25%",
            paddingLeft: 0, // First column doesn't need left padding
            paddingRight: "15px"
        },
        rightColumn: {
            width: "25%",
            minWidth: "25%",
            maxWidth: "25%",
            paddingRight: 0, // Last column doesn't need right padding
            paddingLeft: "15px"
        },
        mainColumn: {
            width: "50%",
            minWidth: "50%",
            maxWidth: "50%",
            borderLeft: "1px solid var(--theme-border-color, #f1f5f9)",
            borderRight: "1px solid var(--theme-border-color, #f1f5f9)",
            padding: "0 20px"
        },
        name: {
            fontSize: "calc(32px * var(--theme-font-scale, 1))",
            fontWeight: "900",
            color: "var(--theme-color, #1e293b)",
            margin: "0 0 5px 0",
            textTransform: "uppercase"
        },
        profession: {
            fontSize: "calc(16px * var(--theme-font-scale, 1))",
            color: "var(--theme-text-muted, #64748b)",
            fontWeight: "600",
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "12px"
        },
        contact: {
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "8px 20px",
            marginTop: "10px",
            fontSize: "calc(11px * var(--theme-font-scale, 1))",
            color: "var(--theme-text-muted, #475569)"
        },
        contactItem: {
            display: "flex",
            alignItems: "center",
            gap: "6px"
        },
        icon: {
            color: "var(--theme-color, #1e293b)",
            strokeWidth: 2
        },
        photo: {
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: "12px",
            border: "2px solid var(--theme-border-color, #f1f5f9)"
        }
    };

    const Header = () => {
        const locationStr = [personal?.city, personal?.state, personal?.zipCode, personal?.country].filter(Boolean).join(", ");

        const renderContactItem = (Icon, text, field) => {
            if (!text) return null;
            return (
                <div style={styles.contactItem}>
                    <Icon size={12} style={styles.icon} />
                    <ResumeLink href={field === 'location' ? null : text}>
                        <RichTextSpellCheck
                            html={text}
                            isActive={isSpellCheckActive}
                            onIgnore={onSpellCheckIgnore}
                            onReplace={(val) => onSpellCheckReplace('personal', field, val)}
                        />
                    </ResumeLink>
                </div>
            );
        };

        return (
            <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Header">
                <div style={styles.header}>
                    {personal?.photo && (
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            <img src={personal.photo} alt={personal.name} style={styles.photo} />
                        </div>
                    )}
                    <h1 style={styles.name}>
                        <RichTextSpellCheck
                            html={personal?.name || "YOUR NAME"}
                            isActive={isSpellCheckActive}
                            onIgnore={onSpellCheckIgnore}
                            onReplace={(val) => onSpellCheckReplace('personal', 'name', val)}
                        />
                    </h1>
                    {personal?.profession && (
                        <div style={styles.profession}>
                            <RichTextSpellCheck
                                html={personal.profession}
                                isActive={isSpellCheckActive}
                                onIgnore={onSpellCheckIgnore}
                                onReplace={(val) => onSpellCheckReplace('personal', 'profession', val)}
                            />
                        </div>
                    )}
                    <div style={styles.contact}>
                        {renderContactItem(Mail, personal?.email, 'email')}
                        {renderContactItem(Phone, personal?.phone, 'phone')}
                        {renderContactItem(MapPin, locationStr, 'location')}
                        {renderContactItem(Linkedin, personal?.linkedin, 'linkedin')}
                        {renderContactItem(Github, personal?.github, 'github')}
                        {renderContactItem(Globe, personal?.website, 'website')}
                    </div>
                </div>
            </SectionWrapper>
        );
    };

    const renderZone = (id, items, extraStyle = {}) => (
        <DroppableZone id={id} style={{ ...styles.column, ...extraStyle }}>
            {items.map((sid, idx) => {
                const isContinued = typeof sid === 'object' && sid.isContinued;
                const sectionId = typeof sid === 'string' ? sid : sid.id;
                const dragId = isContinued ? `${id}-cont-${sectionId}-${idx}` : sectionId;

                return (
                    <DraggableSection key={dragId} id={dragId} isEnabled={canReorder && !isContinued}>
                        <SectionRenderer
                            sectionId={sectionId}
                            data={data}
                            onSectionClick={onSectionClick}
                            isContinued={isContinued}
                            itemIndices={typeof sid === 'object' ? sid.itemIndices : undefined}
                            subItemRanges={typeof sid === 'object' ? sid.subItemRanges : undefined}
                            variants={{ experience: 'modern', education: 'minimal' }}
                        />
                    </DraggableSection>
                );
            })}
        </DroppableZone>
    );

    const Measurer = () => (
        <div className="resume-measurer" style={{ position: "absolute", top: -10000, left: -10000, width: "210mm", visibility: "hidden" }}>
            <div className="page-height-marker" style={{ height: "297mm", width: "1px", position: "absolute", left: 0, top: 0 }}></div>
            <div style={{ ...styles.page, height: "auto" }}>
                <Header />
                <div style={styles.layoutBody}>
                    <div data-column-id="left" style={{ ...styles.column, ...styles.sideColumn, paddingLeft: 0 }}>
                        {activeLeft.map(sid => <SectionRenderer key={sid} sectionId={sid} data={data} variants={{ experience: 'modern', education: 'minimal' }} />)}
                    </div>
                    <div data-column-id="main" style={{ ...styles.column, ...styles.mainColumn }}>
                        {activeMain.map(sid => <SectionRenderer key={sid} sectionId={sid} data={data} variants={{ experience: 'modern', education: 'minimal' }} />)}
                    </div>
                    <div data-column-id="right" style={{ ...styles.column, ...styles.rightColumn, paddingRight: 0 }}>
                        {activeRight.map(sid => <SectionRenderer key={sid} sectionId={sid} data={data} variants={{ experience: 'modern', education: 'minimal' }} />)}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div ref={containerRef} className="skeleton-3col-root">
            <Measurer />
            <DndContext {...dndContextProps}>
                <SortableContext items={[...activeLeft, ...activeMain, ...activeRight]} strategy={verticalListSortingStrategy}>
                    {showPageBreaks && pages ? (
                        pages.map((page, i) => (
                            <div key={i} style={styles.page}>
                                {i === 0 && <Header />}
                                <div style={styles.layoutBody}>
                                    {renderZone(`left-p${i}`, page.left, { ...styles.sideColumn, paddingLeft: 0 })}
                                    {renderZone(`main-p${i}`, page.main, styles.mainColumn)}
                                    {renderZone(`right-p${i}`, page.right, { ...styles.rightColumn, paddingRight: 0 })}
                                </div>
                                <div style={{ position: "absolute", bottom: "15px", right: "20px", fontSize: "10px", opacity: 0.5 }}>Page {i + 1}</div>
                            </div>
                        ))
                    ) : (
                        <div style={{ ...styles.page, height: "auto", minHeight: "100%" }}>
                            <Header />
                            <div style={styles.layoutBody}>
                                {renderZone('left', activeLeft, { ...styles.sideColumn, paddingLeft: 0 })}
                                {renderZone('main', activeMain, styles.mainColumn)}
                                {renderZone('right', activeRight, { ...styles.rightColumn, paddingRight: 0 })}
                            </div>
                        </div>
                    )}
                </SortableContext>
                <StableResumeDragOverlay activeId={activeId} scale={scale} renderSection={(id) => <SectionRenderer sectionId={id} data={data} />} />
            </DndContext>
        </div>
    );
};

export default ModernThreeColumn;
