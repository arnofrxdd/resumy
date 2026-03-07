import React, { useRef } from "react";
import { DndContext } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SectionWrapper from "../../components/SectionWrapper";
import { useResumeDragAndDrop, DroppableZone, StableResumeDragOverlay } from "../../hooks/useResumeDragAndDrop";
import DraggableSection from "../../components/dnd/DraggableSection";
import SectionRenderer from "../common/SectionRenderer";
import { useSectionContext } from "../common/SectionContext";
import { useAutoPagination } from "../../hooks/useAutoPagination";
import { Mail, Phone, MapPin, Linkedin, Github, Globe, Briefcase } from "lucide-react";
import { SpellCheckText, RichTextSpellCheck, ResumeLink } from "../common/BaseComponents";
import { getCompleteLayout, getSavedLayout } from "../common/TemplateUtils";

/**
 * ModernSidebar Skeleton (2-Column)
 * A clean 2-column skeleton kernel with side-panel logic.
 */
const ModernSidebar = ({
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
    const templateId = layoutConfig?.id || 'modern-sidebar';
    const initialLayout = getSavedLayout(data, templateId, {
        main: ['summary', 'experience', 'projects', 'education', 'keyAchievements', 'accomplishments', 'custom'],
        sidebar: ['skills', 'software', 'languages', 'certifications', 'interests', 'additionalSkills', 'strengths', 'websites', 'affiliations', 'additionalInfo']
    });

    // Auto-complete the layout with any "orphaned" sections (e.g. Certifications, Languages)
    const completeLayout = getCompleteLayout(data, initialLayout, 'sidebar');
    const activeMainSections = completeLayout.main || [];
    const activeSidebarSections = completeLayout.sidebar || [];

    // --- 3. DRAG & DROP HOOK ---
    const { dndContextProps, activeId } = useResumeDragAndDrop({
        data,
        onReorder,
        scale,
        containers: { main: activeMainSections, sidebar: activeSidebarSections }
    });

    // --- 4. PAGINATION HOOK ---
    const pages = useAutoPagination({
        columns: { main: activeMainSections, sidebar: activeSidebarSections },
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
            color: "var(--theme-text-primary, #1e293b)",
            fontFamily: "var(--theme-font, 'Inter', sans-serif)",
            overflow: "visible",
            display: "flex",
            flexDirection: "column",
            gap: "var(--theme-section-margin, 25px)"
        },
        header: {
            paddingBottom: "20px",
            borderBottom: "1px solid var(--theme-border-color, #f1f5f9)"
        },
        layoutBody: {
            display: "flex",
            flex: 1,
            minHeight: 0
        },
        mainColumn: {
            width: "65%",
            minWidth: "65%",
            maxWidth: "65%",
            display: "flex",
            flexDirection: "column",
            gap: "var(--theme-section-margin, 25px)",
            paddingRight: "25px", // Interior gap
            borderRight: "1px solid var(--theme-border-color, #f1f5f9)"
        },
        sidebarColumn: {
            width: "35%",
            minWidth: "35%",
            maxWidth: "35%",
            display: "flex",
            flexDirection: "column",
            gap: "var(--theme-section-margin, 25px)",
            paddingLeft: "25px" // Interior gap
        },
        name: {
            fontSize: "calc(32px * var(--theme-font-scale, 1))",
            fontWeight: "900",
            color: "var(--theme-color, #1e293b)",
            margin: "0 0 4px 0",
            textTransform: "uppercase",
            letterSpacing: "-0.5px"
        },
        profession: {
            fontSize: "calc(14px * var(--theme-font-scale, 1))",
            fontWeight: "600",
            color: "var(--theme-text-muted, #64748b)",
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "12px"
        },
        contactGrid: {
            display: "flex",
            flexWrap: "wrap",
            gap: "12px 20px",
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
            strokeWidth: 2.5
        },
        photo: {
            width: "60px",
            height: "60px",
            borderRadius: "8px", // Clean square-ish for sidebar
            objectFit: "cover",
            border: "1px solid var(--theme-border-color, #f1f5f9)"
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
                <div style={{ ...styles.header, display: "flex", gap: "20px", alignItems: "flex-start" }}>
                    {personal?.photo && <img src={personal.photo} alt={personal.name} style={styles.photo} />}
                    <div style={{ flex: 1 }}>
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
                        <div style={styles.contactGrid}>
                            {renderContactItem(Mail, personal?.email, 'email')}
                            {renderContactItem(Phone, personal?.phone, 'phone')}
                            {renderContactItem(MapPin, locationStr, 'location')}

                            {/* Social & Extra Header Links */}
                            {[
                                { icon: Linkedin, field: 'linkedin', value: personal?.linkedin, type: 'personal' },
                                { icon: Github, field: 'github', value: personal?.github, type: 'personal' },
                                { icon: Globe, field: 'website', value: personal?.website, type: 'personal' },
                                ...(data.websites || [])
                                    .map((link, idx) => ({ ...link, idx }))
                                    .filter(link => link.addToHeader && link.url)
                                    .map(link => ({ icon: Globe, field: 'url', value: link.url, type: 'websites', idx: link.idx }))
                            ].map((link, j) => {
                                if (!link.value) return null;
                                const Icon = link.icon;
                                return (
                                    <div key={j} style={styles.contactItem}>
                                        <Icon size={12} style={styles.icon} />
                                        <ResumeLink href={link.value}>
                                            <RichTextSpellCheck
                                                html={link.value}
                                                isActive={isSpellCheckActive}
                                                onIgnore={onSpellCheckIgnore}
                                                onReplace={(val) => onSpellCheckReplace(link.type, link.type === 'personal' ? link.field : link.idx, val, link.type === 'websites' ? 'url' : null)}
                                            />
                                        </ResumeLink>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </SectionWrapper>
        );
    };

    const renderZone = (id, items, columnStyle) => (
        <DroppableZone id={id} style={{ ...columnStyle }}>
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
                    <div data-column-id="main" style={styles.mainColumn}>
                        {activeMainSections.map(sid => <SectionRenderer key={sid} sectionId={sid} data={data} variants={{ experience: 'modern', education: 'minimal' }} />)}
                    </div>
                    <div data-column-id="sidebar" style={styles.sidebarColumn}>
                        {activeSidebarSections.map(sid => <SectionRenderer key={sid} sectionId={sid} data={data} variants={{ experience: 'modern', education: 'minimal' }} />)}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div ref={containerRef} className="skeleton-2col-root">
            <Measurer />
            <DndContext {...dndContextProps}>
                <SortableContext items={[...activeMainSections, ...activeSidebarSections]} strategy={verticalListSortingStrategy}>
                    {showPageBreaks && pages ? (
                        pages.map((page, i) => (
                            <div key={i} style={styles.page}>
                                {i === 0 && <Header />}
                                <div style={styles.layoutBody}>
                                    {renderZone(`main-p${i}`, page.main, styles.mainColumn)}
                                    {renderZone(`sidebar-p${i}`, page.sidebar, styles.sidebarColumn)}
                                </div>
                                <div style={{ position: "absolute", bottom: "15px", right: "20px", fontSize: "10px", opacity: 0.5 }}>Page {i + 1}</div>
                            </div>
                        ))
                    ) : (
                        <div style={{ ...styles.page, height: "auto", minHeight: "100%" }}>
                            <Header />
                            <div style={styles.layoutBody}>
                                {renderZone('main', activeMainSections, styles.mainColumn)}
                                {renderZone('sidebar', activeSidebarSections, styles.sidebarColumn)}
                            </div>
                        </div>
                    )}
                </SortableContext>
                <StableResumeDragOverlay activeId={activeId} scale={scale} renderSection={(id) => <SectionRenderer sectionId={id} data={data} />} />
            </DndContext>
        </div>
    );
};

export default ModernSidebar;
