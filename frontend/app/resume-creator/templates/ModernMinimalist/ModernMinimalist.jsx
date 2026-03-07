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
 * ModernMinimalist Skeleton (1-Column)
 * A clean, robust structural kernel for single-column resumes.
 */
const ModernMinimalist = ({
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
    const templateId = layoutConfig?.id || 'modern-minimalist';
    const initialLayout = getSavedLayout(data, templateId, {
        main: ['summary', 'experience', 'education', 'skills', 'software', 'projects', 'keyAchievements', 'accomplishments', 'languages', 'certifications', 'interests', 'websites', 'affiliations', 'additionalInfo', 'strengths', 'additionalSkills', 'custom']
    });

    // Auto-complete the layout with any "orphaned" sections (e.g. Certifications, Languages)
    const completeLayout = getCompleteLayout(data, initialLayout, 'main');
    const activeSections = completeLayout.main || [];

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
            flexDirection: "column"
        },
        header: {
            textAlign: "center",
            marginBottom: "var(--theme-section-margin, 25px)",
            paddingBottom: "15px",
            borderBottom: "1px solid var(--theme-border-color, #f1f5f9)"
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
            textTransform: "uppercase"
        },
        contact: {
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "8px 20px",
            marginTop: "12px",
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
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: "15px",
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
            </SectionWrapper>
        );
    };

    const renderZone = (id, items) => (
        <DroppableZone id={id} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--theme-section-margin, 25px)' }}>
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
                <div data-column-id="main" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--theme-section-margin, 25px)' }}>
                    {activeSections.map(sid => (
                        <SectionRenderer
                            key={sid}
                            sectionId={sid}
                            data={data}
                            variants={{ experience: 'modern', education: 'minimal' }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div ref={containerRef} className="skeleton-1col-root">
            <Measurer />
            <DndContext {...dndContextProps}>
                <SortableContext items={activeSections} strategy={verticalListSortingStrategy}>
                    {showPageBreaks && pages ? (
                        pages.map((page, i) => (
                            <div key={i} style={styles.page}>
                                {i === 0 && <Header />}
                                {renderZone(`main-p${i}`, page.main)}
                                <div style={{ position: "absolute", bottom: "15px", right: "20px", fontSize: "10px", opacity: 0.5 }}>Page {i + 1}</div>
                            </div>
                        ))
                    ) : (
                        <div style={{ ...styles.page, height: "auto", minHeight: "100%" }}>
                            <Header />
                            {renderZone('main', activeSections)}
                        </div>
                    )}
                </SortableContext>
                <StableResumeDragOverlay activeId={activeId} scale={scale} renderSection={(id) => <SectionRenderer sectionId={id} data={data} />} />
            </DndContext>
        </div>
    );
};

export default ModernMinimalist;
