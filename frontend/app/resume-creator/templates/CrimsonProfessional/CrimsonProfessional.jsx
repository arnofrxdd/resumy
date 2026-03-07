import React, { useRef } from "react";
import { DndContext } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SectionWrapper from "../../components/SectionWrapper";
import { useResumeDragAndDrop, DroppableZone, StableResumeDragOverlay } from "../../hooks/useResumeDragAndDrop";
import DraggableSection from "../../components/dnd/DraggableSection";
import SectionRenderer from "../common/SectionRenderer";
import { useSectionContext } from "../common/SectionContext";
import { useAutoPagination } from "../../hooks/useAutoPagination";
import { SpellCheckText, SplittableRichText, RichTextSpellCheck, ResumeLink, SoftwareItem } from "../common/BaseComponents";
import { getCompleteLayout, getSavedLayout } from "../common/TemplateUtils";

/**
 * CrimsonProfessional Template
 * Matches the "Marvin Waltz" design:
 * - Full-width coral/red header with square photo, large bold uppercase name,
 *   colored profession subtitle, inline contact row
 * - Body: left sidebar (~32%) | thin vertical divider | main column (~68%)
 * - Both columns white background, no sidebar shading
 * - Section titles: coral/red italic serif font ("Summary", "Skills", "Employment History", etc.)
 * - Sidebar: justified small text, simple bullet lists
 * - Main: job entries with bold "Title – Company (dates)" + bullets below
 * - Education: plain stacked text lines (no dates column needed)
 */
const CrimsonProfessional = ({
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
    if (!data) return null;

    const { personal } = data;
    const isInteractive = !!onSectionClick && !isSpellCheckActive;
    const canReorder = !!onReorder && !isSpellCheckActive;

    // --- LAYOUT ---
    const templateId = 'crimson-professional';
    const initialLayout = getSavedLayout(data, templateId, {
        main: ['experience', 'education', 'projects', 'certifications', 'awards', 'accomplishments', 'keyAchievements', 'volunteering', 'publications', 'affiliations', 'additionalInfo', 'custom'],
        sidebar: ['summary', 'skills', 'strengths', 'additionalSkills', 'languages', 'software', 'interests', 'references', 'personalDetails', 'websites']
    });

    const completeLayout = getCompleteLayout(data, initialLayout, 'main');
    const activeMainSections = completeLayout.main || [];
    const activeSidebarSections = completeLayout.sidebar || [];

    const { dndContextProps, activeId } = useResumeDragAndDrop({
        data, onReorder, scale,
        containers: { main: activeMainSections, sidebar: activeSidebarSections }
    });

    const pages = useAutoPagination({
        columns: { main: activeMainSections, sidebar: activeSidebarSections },
        data, enabled: showPageBreaks, containerRef, scale
    });

    // --- THEME ---
    const accent = "var(--theme-color, #e8464a)";
    const darkText = "#2a2a2a";
    const bodyText = "#3a3a3a";
    const lightText = "#555555";
    const sidebarW = "31%";
    const mainW = "69%";

    // --- SECTION TITLE: italic serif in red ---
    const SectionTitle = ({ title, inSidebar = false }) => {
        const { isContinued } = useSectionContext();
        const display = isContinued ? `${title} (cont.)` : title;
        return (
            <div style={{
                fontSize: `calc(${inSidebar ? "17px" : "20px"} * var(--theme-font-scale, 1))`,
                fontWeight: "400",
                fontStyle: "italic",
                color: accent,
                fontFamily: "var(--theme-font, 'Georgia', 'Times New Roman', serif)",
                marginBottom: "calc(10px * var(--theme-paragraph-margin, 1))",
                lineHeight: "1.2",
            }}>
                {display}
            </div>
        );
    };

    // --- STYLES ---
    const styles = {
        page: {
            width: "210mm",
            height: "297mm",
            background: "white",
            padding: "var(--theme-page-margin, 30px) var(--theme-page-margin, 30px) var(--theme-page-margin, 30px) var(--theme-page-margin, 30px)",
            boxSizing: "border-box",
            position: "relative",
            margin: "0 auto 30px auto",
            color: darkText,
            fontFamily: "var(--theme-font, 'Georgia', 'Times New Roman', serif)",
            letterSpacing: "var(--theme-letter-spacing, 0px)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
        },
        // HEADER
        header: {
            background: accent,
            padding: "18px 24px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            minHeight: "100px",
        },
        headerPhoto: {
            width: "80px",
            height: "80px",
            objectFit: "cover",
            flexShrink: 0,
            border: "2px solid rgba(255,255,255,0.4)",
        },
        headerPhotoPlaceholder: {
            width: "80px",
            height: "80px",
            background: "rgba(255,255,255,0.2)",
            flexShrink: 0,
            border: "2px solid rgba(255,255,255,0.4)",
        },
        headerText: {
            flex: 1,
        },
        name: {
            fontSize: "calc(30px * var(--theme-font-scale, 1))",
            fontWeight: "900",
            textTransform: "uppercase",
            letterSpacing: "2px",
            color: "white",
            lineHeight: "1.1",
            fontFamily: "'Arial Black', 'Arial', sans-serif",
            marginBottom: "3px",
        },
        profession: {
            fontSize: "calc(14px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            textTransform: "uppercase",
            letterSpacing: "2px",
            color: "rgba(255,255,255,0.85)",
            fontFamily: "'Arial', sans-serif",
            marginBottom: "6px",
        },
        contactRow: {
            fontSize: "calc(11px * var(--theme-font-scale, 1))",
            color: "rgba(255,255,255,0.9)",
            fontFamily: "'Arial', sans-serif",
            display: "flex",
            flexWrap: "wrap",
            gap: "0",
        },
        // BODY
        body: {
            display: "flex",
            flex: 1,
            minHeight: 0,
        },
        sidebar: {
            width: sidebarW,
            padding: "22px 18px var(--theme-page-margin, 30px) 20px",
            boxSizing: "border-box",
            flexShrink: 0,
            borderRight: "1px solid #ddd",
        },
        main: {
            flex: 1,
            padding: "22px 24px var(--theme-page-margin, 30px) 22px",
            boxSizing: "border-box",
        },
        // Sidebar text
        sidebarText: {
            fontSize: "calc(11px * var(--theme-font-scale, 1))",
            color: bodyText,
            lineHeight: "var(--theme-line-height, 1.6)",
            textAlign: "justify",
        },
        sidebarLabel: {
            fontSize: "calc(10.5px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: darkText,
            fontFamily: "'Arial', sans-serif",
            marginBottom: "1px",
            textTransform: "uppercase",
            letterSpacing: "0.3px",
        },
        sidebarValue: {
            fontSize: "calc(11px * var(--theme-font-scale, 1))",
            color: bodyText,
            marginBottom: "calc(8px * var(--theme-paragraph-margin, 1))",
            wordBreak: "break-all",
        },
        sectionGap: {
            // marginBottom removed — spacing handled by column gap
        },
        // Main column styles
        jobHeading: {
            fontSize: "calc(13px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: darkText,
            fontFamily: "'Arial', sans-serif",
            marginBottom: "calc(6px * var(--theme-paragraph-margin, 1))",
            lineHeight: "1.4",
        },
        mainText: {
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            color: bodyText,
            lineHeight: "var(--theme-line-height, 1.55)",
            textAlign: "justify",
        },
        bulletItem: {
            display: "flex",
            alignItems: "flex-start",
            gap: "6px",
            marginBottom: "calc(3px * var(--theme-paragraph-margin, 1))",
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            color: bodyText,
            lineHeight: "var(--theme-line-height, 1.5)",
        },
        bulletDot: {
            flexShrink: 0,
            marginTop: "4px",
            fontSize: "8px",
            color: darkText,
        },
    };

    // --- HEADER ---
    const Header = () => {
        const contactParts = [];
        if (personal?.phone) contactParts.push(personal.phone);
        if (personal?.email) contactParts.push(personal.email);
        if (personal?.city || personal?.state || personal?.country) contactParts.push([personal.city, personal.state, personal.country].filter(Boolean).join(", "));
        if (personal?.linkedin) contactParts.push(personal.linkedin);
        if (personal?.github) contactParts.push(personal.github);
        if (personal?.website) contactParts.push(personal.website);
        (data.websites || []).forEach(s => s.url && contactParts.push(s.label || s.url));

        return (
            <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Header">
                <div style={styles.header}>
                    {/* Square photo */}
                    {personal?.photo ? (
                        <img src={personal.photo} alt="Profile" style={styles.headerPhoto} />
                    ) : (
                        <div style={styles.headerPhotoPlaceholder} />
                    )}
                    {/* Name / profession / contact */}
                    <div style={styles.headerText}>
                        <div style={styles.name}>
                            <SpellCheckText text={personal?.name || "YOUR NAME"} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'name', val)} />
                        </div>
                        {personal?.profession && (
                            <div style={styles.profession}>
                                <SpellCheckText text={personal.profession} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'profession', val)} />
                            </div>
                        )}
                        {contactParts.length > 0 && (
                            <div style={styles.contactRow}>
                                {contactParts.map((part, i) => (
                                    <React.Fragment key={i}>
                                        <span>{part}</span>
                                        {i < contactParts.length - 1 && <span style={{ margin: "0 8px", opacity: 0.7 }}>|</span>}
                                    </React.Fragment>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </SectionWrapper>
        );
    };

    // --- CUSTOM RENDERERS ---
    const customRenderers = {
        // SIDEBAR
        summary: ({ subItemRanges, zoneId }) => {
            if (!data.summary) return null;
            const inSidebar = !zoneId || zoneId.includes('sidebar');
            return (
                <SectionWrapper sectionId="summary" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Summary">
                    <div style={styles.sectionGap}>
                        <SectionTitle title="Summary" inSidebar={inSidebar} />
                        <div className="resume-rich-text" style={styles.sidebarText}>
                            <SplittableRichText html={data.summary} range={subItemRanges?.summary} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('summary', 'summary', val)} />
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        skills: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.skills?.[idx]).filter(Boolean) : (data.skills || []);
            if (items.length === 0 && !data.skillsDescription) return null;
            const inSidebar = !zoneId || zoneId.includes('sidebar');
            return (
                <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Skills">
                    <div style={styles.sectionGap}>
                        <SectionTitle title="Skills" inSidebar={inSidebar} />
                        {items.length > 0 ? (
                            <div style={inSidebar ? {} : { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                                {items.map((skill, i) => {
                                    const originalIndex = itemIndices ? itemIndices[i] : i;
                                    const name = typeof skill === 'object' ? skill.name : skill;
                                    return (
                                        <div key={originalIndex} data-item-index={originalIndex} style={{
                                            fontSize: `calc(${inSidebar ? "11px" : "12px"} * var(--theme-font-scale, 1))`,
                                            color: bodyText,
                                            marginBottom: "calc(2px * var(--theme-paragraph-margin, 1))",
                                            lineHeight: "1.5",
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: "6px"
                                        }}>
                                            <span style={{ fontSize: "8px", marginTop: "4px" }}>•</span>
                                            <RichTextSpellCheck html={name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('skills', originalIndex, val, 'name')} />
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="resume-rich-text" style={inSidebar ? styles.sidebarText : styles.mainText}>
                                <SplittableRichText html={data.skillsDescription} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('skills', 'skillsDescription', val)} />
                            </div>
                        )}
                    </div>
                </SectionWrapper>
            );
        },

        strengths: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.strengths?.[idx]).filter(Boolean) : (data.strengths || []);
            if (items.length === 0) return null;
            const inSidebar = !zoneId || zoneId.includes('sidebar');
            return (
                <SectionWrapper sectionId="strengths" navigationId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Key Strengths">
                    <div style={styles.sectionGap}>
                        <SectionTitle title="Key Strengths" inSidebar={inSidebar} />
                        <ul style={{ margin: 0, paddingLeft: "14px" }}>
                            {items.map((s, i) => {
                                const originalIndex = itemIndices ? itemIndices[i] : i;
                                return (
                                    <li key={originalIndex} data-item-index={originalIndex} style={{ fontSize: "calc(11px * var(--theme-font-scale, 1))", color: bodyText, marginBottom: "calc(2px * var(--theme-paragraph-margin, 1))", lineHeight: "1.5" }}>
                                        <RichTextSpellCheck html={typeof s === 'object' ? s.name : s} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('strengths', originalIndex, val, 'name')} />
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </SectionWrapper>
            );
        },

        additionalSkills: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.additionalSkills?.[idx]).filter(Boolean) : (data.additionalSkills || []);
            if (items.length === 0) return null;
            const inSidebar = !zoneId || zoneId.includes('sidebar');
            return (
                <SectionWrapper sectionId="additionalSkills" navigationId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Additional Skills">
                    <div style={styles.sectionGap}>
                        <SectionTitle title="Additional Skills" inSidebar={inSidebar} />
                        <ul style={{ margin: 0, paddingLeft: "14px" }}>
                            {items.map((s, i) => {
                                const originalIndex = itemIndices ? itemIndices[i] : i;
                                return (
                                    <li key={originalIndex} data-item-index={originalIndex} style={{ fontSize: "calc(11px * var(--theme-font-scale, 1))", color: bodyText, marginBottom: "calc(2px * var(--theme-paragraph-margin, 1))", lineHeight: "1.5" }}>
                                        <RichTextSpellCheck html={typeof s === 'object' ? s.name : s} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('additionalSkills', originalIndex, val, 'name')} />
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </SectionWrapper>
            );
        },

        languages: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.languages?.[idx]).filter(Boolean) : (data.languages || []);
            if (items.length === 0) return null;
            const inSidebar = !zoneId || zoneId.includes('sidebar');
            return (
                <SectionWrapper sectionId="languages" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Languages">
                    <div style={styles.sectionGap}>
                        <SectionTitle title="Languages" inSidebar={inSidebar} />
                        {items.map((lang, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={originalIdx} style={{ marginBottom: "calc(5px * var(--theme-paragraph-margin, 1))" }}>
                                    <div style={{ ...styles.sidebarLabel, fontFamily: "var(--theme-font, 'Georgia', serif)" }}>
                                        <RichTextSpellCheck html={lang.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('languages', originalIdx, val, 'name')} />
                                    </div>
                                    {lang.level && <div style={{ ...styles.sidebarText, textAlign: "left" }}><RichTextSpellCheck html={lang.level} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('languages', originalIdx, val, 'level')} /></div>}
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        software: ({ itemIndices, zoneId, subItemRanges }) => {
            const items = itemIndices ? itemIndices.map(idx => data.software?.[idx]).filter(Boolean) : (data.software || []);
            if (items.length === 0) return null;
            const inSidebar = !zoneId || zoneId.includes('sidebar');
            return (
                <SectionWrapper sectionId="software" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Software">
                    <div style={styles.sectionGap}>
                        <SectionTitle title="Software" inSidebar={inSidebar} />
                        <div style={inSidebar ? { display: "flex", flexDirection: "column", gap: "4px" } : { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
                            {items.map((item, i) => {
                                const originalIndex = itemIndices ? itemIndices[i] : i;
                                return (
                                    <div key={i} data-item-index={originalIndex}>
                                        <SoftwareItem
                                            item={item}
                                            index={originalIndex}
                                            isSpellCheckActive={isSpellCheckActive}
                                            onIgnore={onSpellCheckIgnore}
                                            onSpellCheckReplace={(field, val) => onSpellCheckReplace('software', originalIndex, val, field)}
                                            variant={inSidebar ? 'compact' : undefined}
                                            subItemRange={subItemRanges?.[originalIndex]}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        interests: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.interests?.[idx]).filter(Boolean) : (data.interests || []);
            if (items.length === 0) return null;
            const inSidebar = !zoneId || zoneId.includes('sidebar');
            return (
                <SectionWrapper sectionId="interests" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Interests">
                    <div style={styles.sectionGap}>
                        <SectionTitle title="Interests" inSidebar={inSidebar} />
                        <ul style={{ margin: 0, paddingLeft: "14px" }}>
                            {items.map((item, i) => {
                                const originalIndex = itemIndices ? itemIndices[i] : i;
                                return (
                                    <li key={i} data-item-index={originalIndex} style={{ fontSize: "calc(11px * var(--theme-font-scale, 1))", color: bodyText, marginBottom: "calc(2px * var(--theme-paragraph-margin, 1))", lineHeight: "1.5" }}>
                                        <RichTextSpellCheck html={typeof item === 'object' ? item.name : item} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('interests', originalIndex, val, 'name')} />
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </SectionWrapper>
            );
        },

        references: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.references?.[idx]).filter(Boolean) : (data.references || []);
            if (items.length === 0) return null;
            const inSidebar = !zoneId || zoneId.includes('sidebar');
            return (
                <SectionWrapper sectionId="references" onSectionClick={onSectionClick} isInteractive={isInteractive} label="References">
                    <div style={styles.sectionGap}>
                        <SectionTitle title="References" inSidebar={inSidebar} />
                        {items.map((ref, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={originalIdx} style={{ marginBottom: "calc(8px * var(--theme-paragraph-margin, 1))" }}>
                                    <div style={{ fontWeight: "700", fontSize: "calc(11px * var(--theme-font-scale, 1))", color: darkText, fontFamily: "'Arial', sans-serif" }}>
                                        <RichTextSpellCheck html={ref.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('references', originalIdx, val, 'name')} />
                                    </div>
                                    {ref.title && <div style={{ ...styles.sidebarText, fontStyle: "italic" }}><RichTextSpellCheck html={ref.title} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('references', originalIdx, val, 'title')} /></div>}
                                    {ref.contact && <div style={styles.sidebarText}><RichTextSpellCheck html={ref.contact} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('references', originalIdx, val, 'contact')} /></div>}
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        personalDetails: ({ zoneId }) => {
            if (!data.personalDetails) return null;
            const details = Object.entries(data.personalDetails).filter(([_, val]) => val);
            if (details.length === 0) return null;
            const inSidebar = !zoneId || zoneId.includes('sidebar');
            return (
                <SectionWrapper sectionId="personalDetails" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Personal Details">
                    <div style={styles.sectionGap}>
                        <SectionTitle title="Personal Details" inSidebar={inSidebar} />
                        {details.map(([key, value], i) => (
                            <div key={i} style={{ marginBottom: "calc(5px * var(--theme-paragraph-margin, 1))" }}>
                                <div style={styles.sidebarLabel}>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}</div>
                                <div style={styles.sidebarText}><SpellCheckText text={value} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personalDetails', key, val)} /></div>
                            </div>
                        ))}
                    </div>
                </SectionWrapper>
            );
        },

        websites: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.websites?.[idx]).filter(Boolean) : (data.websites || []);
            const filtered = items.filter(s => s.url);
            if (filtered.length === 0) return null;
            const inSidebar = !zoneId || zoneId.includes('sidebar');
            return (
                <SectionWrapper sectionId="websites" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Links">
                    <div style={styles.sectionGap}>
                        <SectionTitle title="Links" inSidebar={inSidebar} />
                        {filtered.map((site, i) => (
                            <div key={i} style={{ marginBottom: "calc(4px * var(--theme-paragraph-margin, 1))" }}>
                                <div style={styles.sidebarLabel}>{site.label || 'Website'}</div>
                                <div style={{ ...styles.sidebarText, wordBreak: "break-all" }}><ResumeLink href={site.url}><SpellCheckText text={site.url} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('websites', itemIndices ? itemIndices[i] : i, val, 'url')} /></ResumeLink></div>
                            </div>
                        ))}
                    </div>
                </SectionWrapper>
            );
        },

        // MAIN column sections
        experience: ({ itemIndices, subItemRanges, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.experience?.[idx]).filter(Boolean) : (data.experience || []);
            if (items.length === 0) return null;
            const inSidebar = zoneId?.toLowerCase().includes('sidebar');
            return (
                <SectionWrapper sectionId="experience" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Employment History">
                    <div style={styles.sectionGap}>
                        <SectionTitle title="Employment History" inSidebar={inSidebar} />
                        {items.map((exp, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const dates = exp.year || exp.date || (exp.startYear ? `${exp.startYear}–${exp.isCurrent ? "Present" : (exp.endYear || "")}` : "");
                            const locationStr = [exp.location, exp.isRemote ? "(Remote)" : null].filter(Boolean).join(" ");

                            if (inSidebar) {
                                return (
                                    <div key={i} data-item-index={originalIdx} style={{ marginBottom: "calc(12px * var(--theme-paragraph-margin, 1))" }}>
                                        <div style={{ ...styles.sidebarLabel, color: accent, textTransform: "none", fontSize: "calc(11.5px * var(--theme-font-scale, 1))" }}>
                                            <RichTextSpellCheck html={exp.title || exp.role || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'title')} />
                                        </div>
                                        <div style={{ ...styles.sidebarLabel, marginTop: "2px" }}>
                                            <RichTextSpellCheck html={[exp.company, locationStr].filter(Boolean).join(", ")} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'company')} />
                                        </div>
                                        {dates && <div style={{ ...styles.sidebarText, fontSize: "calc(10px * var(--theme-font-scale, 1))", opacity: 0.8 }}>{dates}</div>}
                                        {exp.description && (
                                            <div className="resume-rich-text" style={{ ...styles.sidebarText, marginTop: "4px" }}>
                                                <SplittableRichText html={exp.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'description')} />
                                            </div>
                                        )}
                                    </div>
                                );
                            }

                            const parts = [];
                            if (exp.title || exp.role) parts.push(exp.title || exp.role);
                            const companyParts = [exp.company, locationStr].filter(Boolean).join(", ");
                            if (companyParts) parts.push(companyParts);
                            const heading = parts.join(" – ") + (dates ? ` (${dates})` : "");
                            return (
                                <div key={i} data-item-index={originalIdx} style={{ marginBottom: "calc(14px * var(--theme-paragraph-margin, 1))" }}>
                                    <div style={styles.jobHeading}>
                                        <RichTextSpellCheck html={heading} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'title')} />
                                    </div>
                                    {exp.description && (
                                        <div className="resume-rich-text" style={styles.mainText}>
                                            <SplittableRichText html={exp.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'description')} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        education: ({ itemIndices, subItemRanges, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.education?.[idx]).filter(Boolean) : (data.education || []);
            if (items.length === 0) return null;
            const inSidebar = zoneId?.toLowerCase().includes('sidebar');
            return (
                <SectionWrapper sectionId="education" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Education">
                    <div style={styles.sectionGap}>
                        <SectionTitle title="Education" inSidebar={inSidebar} />
                        {items.map((edu, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const degreeStr = [edu.degree, edu.field].filter(Boolean).join(", ");
                            const schoolStr = [edu.institution || edu.school, edu.city].filter(Boolean).join(" – ");
                            const dates = edu.year || edu.date || (edu.endYear ? `${edu.startYear ? edu.startYear + "–" : ""}${edu.endYear}` : edu.startYear || "");

                            if (inSidebar) {
                                return (
                                    <div key={i} data-item-index={originalIdx} style={{ marginBottom: "calc(10px * var(--theme-paragraph-margin, 1))" }}>
                                        <div style={{ ...styles.sidebarLabel, color: accent }}>
                                            <RichTextSpellCheck html={degreeStr || edu.degree || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'degree')} />
                                        </div>
                                        <div style={styles.sidebarLabel}>
                                            <RichTextSpellCheck html={schoolStr} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'institution')} />
                                        </div>
                                        {dates && <div style={styles.sidebarText}>{dates}</div>}
                                        {edu.description && (
                                            <div className="resume-rich-text" style={{ ...styles.sidebarText, marginTop: "3px" }}>
                                                <SplittableRichText html={edu.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'description')} />
                                            </div>
                                        )}
                                    </div>
                                );
                            }

                            return (
                                <div key={i} data-item-index={originalIdx} style={{ marginBottom: "calc(8px * var(--theme-paragraph-margin, 1))" }}>
                                    {degreeStr && (
                                        <div style={{ ...styles.mainText, color: darkText }}>
                                            <RichTextSpellCheck html={[degreeStr, schoolStr].filter(Boolean).join(" – ")} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'degree')} />
                                        </div>
                                    )}
                                    {!degreeStr && schoolStr && (
                                        <div style={styles.mainText}><RichTextSpellCheck html={schoolStr} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'institution')} /></div>
                                    )}
                                    {dates && <div style={{ ...styles.mainText, color: lightText, fontSize: "calc(11px * var(--theme-font-scale, 1))" }}>{dates}</div>}
                                    {edu.grade && <div style={{ ...styles.mainText, fontSize: "calc(11px * var(--theme-font-scale, 1))" }}>GPA: {edu.grade}</div>}
                                    {edu.description && (
                                        <div className="resume-rich-text" style={{ ...styles.mainText, marginTop: "3px" }}>
                                            <SplittableRichText html={edu.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'description')} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        projects: ({ itemIndices, subItemRanges, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.projects?.[idx]).filter(Boolean) : (data.projects || []);
            if (items.length === 0) return null;
            const inSidebar = zoneId?.includes('sidebar');
            return (
                <SectionWrapper sectionId="projects" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Projects">
                    <div style={styles.sectionGap}>
                        <SectionTitle title="Projects" inSidebar={!!inSidebar} />
                        {items.map((proj, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const dates = proj.year || (proj.startYear ? `${proj.startYear}–${proj.isCurrent ? 'Present' : (proj.endYear || '')}` : "");
                            return (
                                <div key={i} data-item-index={originalIdx} style={{ marginBottom: "calc(12px * var(--theme-paragraph-margin, 1))" }}>
                                    <div style={styles.jobHeading}>
                                        <RichTextSpellCheck html={[proj.title, dates ? `(${dates})` : ""].filter(Boolean).join(" ")} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('projects', originalIdx, val, 'title')} />
                                    </div>
                                    {proj.link && <div style={{ fontSize: "calc(11px * var(--theme-font-scale, 1))", color: lightText, marginBottom: "3px" }}><ResumeLink href={proj.link}><RichTextSpellCheck html={proj.link} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('projects', originalIdx, val, 'link')} /></ResumeLink></div>}
                                    {proj.technologies?.length > 0 && <div style={{ ...styles.mainText, marginBottom: "3px", fontSize: "calc(11px * var(--theme-font-scale, 1))" }}><strong>Technologies:</strong> {proj.technologies.join(" · ")}</div>}
                                    {proj.description && <div className="resume-rich-text" style={styles.mainText}><SplittableRichText html={proj.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('projects', originalIdx, val, 'description')} /></div>}
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        certifications: ({ itemIndices, subItemRanges, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.certifications?.[idx]).filter(Boolean) : (data.certifications || []);
            if (items.length === 0) return null;
            const inSidebar = zoneId?.includes('sidebar');
            return (
                <SectionWrapper sectionId="certifications" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Certifications">
                    <div style={styles.sectionGap}>
                        <SectionTitle title="Certifications" inSidebar={!!inSidebar} />
                        {items.map((cert, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={originalIdx} style={{ marginBottom: "calc(8px * var(--theme-paragraph-margin, 1))" }}>
                                    <div style={styles.jobHeading}><RichTextSpellCheck html={cert.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('certifications', originalIdx, val, 'name')} /></div>
                                    {cert.issuer && <div style={styles.mainText}><RichTextSpellCheck html={[cert.issuer, cert.date || cert.year].filter(Boolean).join(" · ")} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('certifications', originalIdx, val, 'issuer')} /></div>}
                                    {cert.description && <div className="resume-rich-text" style={{ ...styles.mainText, marginTop: "3px" }}><SplittableRichText html={cert.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('certifications', originalIdx, val, 'description')} /></div>}
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        awards: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.awards?.[idx]).filter(Boolean) : (data.awards || []);
            if (items.length === 0) return null;
            const inSidebar = zoneId?.includes('sidebar');
            return (
                <SectionWrapper sectionId="awards" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Awards">
                    <div style={styles.sectionGap}>
                        <SectionTitle title="Honors & Awards" inSidebar={!!inSidebar} />
                        {items.map((award, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={originalIdx} style={{ marginBottom: "calc(8px * var(--theme-paragraph-margin, 1))" }}>
                                    <div style={styles.jobHeading}><RichTextSpellCheck html={[award.name, award.date].filter(Boolean).join(" · ")} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('awards', originalIdx, val, 'name')} /></div>
                                    {award.issuer && <div style={styles.mainText}><RichTextSpellCheck html={award.issuer} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('awards', originalIdx, val, 'issuer')} /></div>}
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        accomplishments: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.accomplishments?.[idx]).filter(Boolean) : (data.accomplishments || []);
            if (items.length === 0) return null;
            const inSidebar = zoneId?.includes('sidebar');
            return (
                <SectionWrapper sectionId="accomplishments" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Accomplishments">
                    <div style={styles.sectionGap}>
                        <SectionTitle title="Accomplishments" inSidebar={!!inSidebar} />
                        {items.map((item, i) => {
                            const originalIndex = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={originalIndex} style={styles.bulletItem}>
                                    <span style={styles.bulletDot}>•</span>
                                    <div>
                                        {item.name && <strong><RichTextSpellCheck html={item.name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('accomplishments', originalIndex, val, 'name')} /></strong>}
                                        {item.description && <span><RichTextSpellCheck html={item.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('accomplishments', originalIndex, val, 'description')} /></span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        keyAchievements: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.keyAchievements?.[idx]).filter(Boolean) : (data.keyAchievements || []);
            if (items.length === 0) return null;
            const inSidebar = zoneId?.includes('sidebar');
            return (
                <SectionWrapper sectionId="keyAchievements" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Key Achievements">
                    <div style={styles.sectionGap}>
                        <SectionTitle title="Key Achievements" inSidebar={!!inSidebar} />
                        {items.map((item, i) => {
                            const originalIndex = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={originalIndex} style={styles.bulletItem}>
                                    <span style={styles.bulletDot}>•</span>
                                    <div>
                                        {item.name && <strong><RichTextSpellCheck html={item.name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('keyAchievements', originalIndex, val, 'name')} /></strong>}
                                        {item.description && <span><RichTextSpellCheck html={item.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('keyAchievements', originalIndex, val, 'description')} /></span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        volunteering: ({ itemIndices, subItemRanges, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.volunteering?.[idx]).filter(Boolean) : (data.volunteering || []);
            if (items.length === 0) return null;
            const inSidebar = zoneId?.includes('sidebar');
            return (
                <SectionWrapper sectionId="volunteering" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Volunteering">
                    <div style={styles.sectionGap}>
                        <SectionTitle title="Community & Volunteering" inSidebar={!!inSidebar} />
                        {items.map((vol, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const dates = vol.year || vol.date || (vol.startYear ? `${vol.startYear}–${vol.isCurrent ? "Present" : (vol.endYear || "")}` : "");
                            const org = vol.organization || vol.company || "";
                            const role = vol.cause || vol.title || "";
                            const heading = [role, org].filter(Boolean).join(" – ") + (dates ? ` (${dates})` : "");
                            return (
                                <div key={i} data-item-index={originalIdx} style={{ marginBottom: "calc(12px * var(--theme-paragraph-margin, 1))" }}>
                                    <div style={styles.jobHeading}><RichTextSpellCheck html={heading} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('volunteering', originalIdx, val, 'organization')} /></div>
                                    {vol.description && <div className="resume-rich-text" style={styles.mainText}><SplittableRichText html={vol.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('volunteering', originalIdx, val, 'description')} /></div>}
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        publications: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.publications?.[idx]).filter(Boolean) : (data.publications || []);
            if (items.length === 0) return null;
            const inSidebar = zoneId?.includes('sidebar');
            return (
                <SectionWrapper sectionId="publications" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Publications">
                    <div style={styles.sectionGap}>
                        <SectionTitle title="Publications" inSidebar={!!inSidebar} />
                        {items.map((pub, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={originalIdx} style={{ marginBottom: "calc(8px * var(--theme-paragraph-margin, 1))" }}>
                                    <div style={styles.jobHeading}><RichTextSpellCheck html={pub.title || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('publications', originalIdx, val, 'title')} /></div>
                                    {pub.publisher && <div style={styles.mainText}><RichTextSpellCheck html={[pub.publisher, pub.date].filter(Boolean).join(" · ")} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('publications', originalIdx, val, 'publisher')} /></div>}
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        affiliations: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.affiliations?.[idx]).filter(Boolean) : (data.affiliations || []);
            if (items.length === 0) return null;
            const inSidebar = zoneId?.includes('sidebar');
            return (
                <SectionWrapper sectionId="affiliations" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Affiliations">
                    <div style={styles.sectionGap}>
                        <SectionTitle title="Professional Affiliations" inSidebar={!!inSidebar} />
                        {items.map((aff, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.bulletItem}>
                                    <span style={styles.bulletDot}>•</span>
                                    <div>
                                        <div style={{ fontWeight: "700" }}><RichTextSpellCheck html={aff.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('affiliations', originalIdx, val, 'name')} /></div>
                                        {aff.description && <div><RichTextSpellCheck html={aff.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('affiliations', originalIdx, val, 'description')} /></div>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        additionalInfo: ({ subItemRanges, zoneId }) => {
            if (!data.additionalInfo) return null;
            const inSidebar = zoneId?.includes('sidebar');
            return (
                <SectionWrapper sectionId="additionalInfo" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Additional Information">
                    <div style={styles.sectionGap}>
                        <SectionTitle title="Additional Information" inSidebar={!!inSidebar} />
                        <div className="resume-rich-text" style={inSidebar ? styles.sidebarText : styles.mainText}>
                            <SplittableRichText html={data.additionalInfo} range={subItemRanges?.additionalInfo} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('additionalInfo', 'additionalInfo', val)} />
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        custom: ({ subItemRanges, zoneId }) => {
            if (!data.customSection?.isVisible || !data.customSection?.content) return null;
            const title = data.customSection.title || "Additional Information";
            const inSidebar = zoneId?.includes('sidebar');
            return (
                <SectionWrapper sectionId="custom" onSectionClick={onSectionClick} isInteractive={isInteractive} label={title}>
                    <div style={styles.sectionGap}>
                        <SectionTitle title={title} inSidebar={!!inSidebar} />
                        <div className="resume-rich-text" style={inSidebar ? styles.sidebarText : styles.mainText}>
                            <SplittableRichText html={data.customSection.content} range={subItemRanges?.custom} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('customSection', 'content', val)} />
                        </div>
                    </div>
                </SectionWrapper>
            );
        },
    };

    // --- RENDER ZONE ---
    const renderZone = (id, items, columnStyle = {}) => (
        <DroppableZone id={id} style={{ flex: 1, display: "flex", flexDirection: "column", gap: "calc(18px * var(--theme-section-margin, 1))", minHeight: '100px', ...columnStyle }}>
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
                            customRenderers={customRenderers}
                            zoneId={getZoneBaseId(id)}
                        />
                    </DraggableSection>
                );
            })}
        </DroppableZone>
    );

    function getZoneBaseId(id) {
        if (id.startsWith('main')) return 'main';
        if (id.startsWith('sidebar')) return 'sidebar';
        return id;
    }

    const Measurer = () => (
        <div className="resume-measurer" style={{ position: "absolute", top: -10000, left: -10000, width: "210mm", visibility: "hidden" }}>
            <div className="page-height-marker" style={{ height: "297mm", width: "1px", position: "absolute", left: 0, top: 0 }} />
            <div style={{ ...styles.page, height: "auto", overflow: "visible" }}>
                <Header />
                <div style={{ display: "flex", flex: 1 }}>
                    <div data-column-id="sidebar" style={{ ...styles.sidebar, display: "flex", flexDirection: "column", gap: "calc(18px * var(--theme-section-margin, 1))" }}>
                        {activeSidebarSections.map(sid => (
                            <SectionRenderer key={sid} sectionId={sid} data={data} customRenderers={customRenderers} zoneId="sidebar" />
                        ))}
                    </div>
                    <div data-column-id="main" style={{ ...styles.main, display: "flex", flexDirection: "column", gap: "calc(18px * var(--theme-section-margin, 1))" }}>
                        {activeMainSections.map(sid => (
                            <SectionRenderer key={sid} sectionId={sid} data={data} customRenderers={customRenderers} zoneId="main" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const PageBody = ({ pageIndex, mainItems, sidebarItems }) => (
        <div style={{ display: "flex", flex: 1 }}>
            <div style={styles.sidebar}>
                {renderZone(showPageBreaks ? `sidebar-p${pageIndex}` : 'sidebar', sidebarItems)}
            </div>
            <div style={styles.main}>
                {renderZone(showPageBreaks ? `main-p${pageIndex}` : 'main', mainItems)}
            </div>
        </div>
    );

    return (
        <div ref={containerRef} className="crimson-professional-root">
            <Measurer />
            <DndContext {...dndContextProps}>
                <SortableContext items={[...activeMainSections, ...activeSidebarSections]} strategy={verticalListSortingStrategy}>
                    {showPageBreaks && pages ? (
                        pages.map((page, i) => (
                            <div key={i} style={styles.page}>
                                {i === 0 && <Header />}
                                <PageBody pageIndex={i} mainItems={page.main} sidebarItems={page.sidebar} />
                                <div style={{ position: "absolute", bottom: "12px", right: "20px", fontSize: "10px", opacity: 0.4, fontFamily: "sans-serif" }}>Page {i + 1}</div>
                            </div>
                        ))
                    ) : (
                        <div style={{ ...styles.page, height: "auto", minHeight: "100%" }}>
                            <Header />
                            <PageBody pageIndex={0} mainItems={activeMainSections} sidebarItems={activeSidebarSections} />
                        </div>
                    )}
                </SortableContext>
                <StableResumeDragOverlay activeId={activeId} scale={scale} renderSection={(id) => (
                    <div style={{ background: "white", padding: "10px", border: "1px solid #ddd", width: "280px" }}>
                        <SectionRenderer sectionId={id} data={data} customRenderers={customRenderers} />
                    </div>
                )} />
            </DndContext>
        </div>
    );
};

export default CrimsonProfessional;
