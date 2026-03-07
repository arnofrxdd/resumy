import React, { useRef } from "react";
import { DndContext } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SectionWrapper from "../../components/SectionWrapper";
import { useResumeDragAndDrop, DroppableZone, StableResumeDragOverlay } from "../../hooks/useResumeDragAndDrop";
import DraggableSection from "../../components/dnd/DraggableSection";
import SectionRenderer from "../common/SectionRenderer";
import { useSectionContext } from "../common/SectionContext";
import { useAutoPagination } from "../../hooks/useAutoPagination";
import {
    SpellCheckText,
    SplittableRichText,
    RichTextSpellCheck,
    LanguageItem,
    CertificationItem,
    SoftwareItem,
    ResumeLink
} from "../common/BaseComponents";
import { getCompleteLayout, getSavedLayout } from "../common/TemplateUtils";

/**
 * NudeHarmony Template
 * Inspired by the soft pink/beige aesthetic resume design.
 * Features:
 * - Left sidebar with circular photo, contact, language, skills (with bars)
 * - Right main column with colored section header bars, education & experience
 * - Full pagination, section-breaking, drag-and-drop, spell-check support
 * - All spacing: section margin, paragraph spacing, font scale, line height
 */
const NudeHarmony = ({
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

    // --- THEME COLORS ---
    const accentColor = "var(--theme-color, #c4a99a)";
    const sidebarBg = "#f5ede8";
    const mainBg = "#fdf8f6";
    const sectionBarBg = "var(--theme-color, #c4a99a)";
    const textDark = "#3d2b24";
    const textMid = "#7a5a52";
    const textLight = "#a0786e";

    // --- LAYOUT ENGINE ---
    const templateId = 'nude-harmony';
    const savedLayout = data.templateLayouts?.[templateId] || {};
    const initialLayout = {
        sidebar: savedLayout.sidebar || savedLayout.left || ['contact', 'websites', 'languages', 'skills', 'strengths', 'additionalSkills', 'certifications', 'interests'],
        main: savedLayout.main || savedLayout.right || ['summary', 'education', 'experience', 'projects', 'awards', 'volunteer', 'publications', 'software', 'custom', 'additionalInfo']
    };

    const completeLayout = getCompleteLayout(data, initialLayout, 'main');
    const activeSidebarSections = completeLayout.sidebar || [];
    const activeMainSections = completeLayout.main || [];

    // --- DRAG & DROP ---
    const { dndContextProps, activeId } = useResumeDragAndDrop({
        data,
        onReorder,
        scale,
        containers: { sidebar: activeSidebarSections, main: activeMainSections }
    });

    // --- PAGINATION ---
    const pages = useAutoPagination({
        columns: { sidebar: activeSidebarSections, main: activeMainSections },
        data,
        enabled: showPageBreaks,
        containerRef,
        scale
    });

    // --- STYLES ---
    const styles = {
        page: {
            width: "210mm",
            height: "297mm",
            background: mainBg,
            boxSizing: "border-box",
            position: "relative",
            margin: "0 auto 30px auto",
            fontFamily: "var(--theme-font, 'Georgia', 'Times New Roman', serif)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "row",
            color: textDark,
        },
        // Sidebar
        sidebarColumn: {
            width: "35%",
            background: sidebarBg,
            padding: "var(--theme-page-margin, 40px) 24px",
            display: "flex",
            flexDirection: "column",
            gap: "calc(22px * var(--theme-section-margin, 1))",
            minHeight: "100%",
            boxSizing: "border-box",
        },
        // Main column
        mainColumn: {
            width: "65%",
            padding: "var(--theme-page-margin, 40px) 30px var(--theme-page-margin, 40px) 26px",
            display: "flex",
            flexDirection: "column",
            gap: "calc(22px * var(--theme-section-margin, 1))",
            flex: 1,
            boxSizing: "border-box",
        },
        // Photo (circular)
        photoWrap: {
            display: "flex",
            justifyContent: "center",
            marginBottom: "8px",
        },
        photo: {
            width: "110px",
            height: "110px",
            borderRadius: "50%",
            objectFit: "cover",
            border: `4px solid white`,
            boxShadow: "0 2px 12px rgba(196,169,154,0.25)",
        },
        // Name block (top of main)
        nameBlock: {
            background: sectionBarBg,
            padding: "28px 30px 22px 26px",
            marginBottom: "0",
        },
        name: {
            fontSize: "calc(34px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: "white",
            letterSpacing: "3px",
            margin: 0,
            textTransform: "uppercase",
            lineHeight: 1.1,
        },
        profession: {
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            fontWeight: "400",
            color: "rgba(255,255,255,0.88)",
            letterSpacing: "4px",
            marginTop: "7px",
            textTransform: "uppercase",
        },
        // Sidebar section title
        sidebarSectionTitle: {
            fontSize: "calc(13px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: accentColor,
            textTransform: "uppercase",
            letterSpacing: "2px",
            marginBottom: "12px",
            display: "block",
        },
        // Main section title (with bar highlight)
        mainSectionTitle: {
            fontSize: "calc(16px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: "white",
            background: sectionBarBg,
            padding: "5px 14px",
            marginBottom: "16px",
            display: "inline-block",
            letterSpacing: "0.5px",
        },
        // Contact item
        contactItem: {
            marginBottom: "calc(10px * var(--theme-paragraph-margin, 1))",
        },
        contactLabel: {
            fontWeight: "700",
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            color: textDark,
            display: "block",
            marginBottom: "2px",
        },
        contactValue: {
            fontSize: "calc(11.5px * var(--theme-font-scale, 1))",
            color: textMid,
            display: "block",
            wordBreak: "break-all",
        },
        // Sidebar skill bar
        skillRow: {
            marginBottom: "calc(10px * var(--theme-paragraph-margin, 1))",
        },
        skillName: {
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            color: textDark,
            marginBottom: "4px",
            display: "block",
        },
        skillBarBg: {
            width: "100%",
            height: "5px",
            background: "rgba(196,169,154,0.22)",
            borderRadius: "3px",
            overflow: "hidden",
        },
        // Main column experience / education item
        itemTitle: {
            fontWeight: "700",
            fontSize: "calc(14px * var(--theme-font-scale, 1))",
            color: textDark,
            marginBottom: "2px",
        },
        itemSubtitle: {
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            color: textLight,
            fontStyle: "italic",
            marginBottom: "6px",
        },
        itemBody: {
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            color: textMid,
            lineHeight: "var(--theme-line-height, 1.55)",
        },
        itemEntry: {
            marginBottom: "calc(14px * var(--theme-paragraph-margin, 1))",
        },
    };

    // --- SUB-COMPONENTS ---

    const Header = () => (
        <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Header">
            <div style={styles.nameBlock}>
                <h1 style={styles.name}>
                    <SpellCheckText
                        text={personal?.name || "YOUR NAME"}
                        isActive={isSpellCheckActive}
                        onIgnore={onSpellCheckIgnore}
                        onReplace={(val) => onSpellCheckReplace('personal', 'name', val)}
                    />
                </h1>
                {personal?.profession && (
                    <div style={styles.profession}>
                        <SpellCheckText
                            text={personal.profession}
                            isActive={isSpellCheckActive}
                            onIgnore={onSpellCheckIgnore}
                            onReplace={(val) => onSpellCheckReplace('personal', 'profession', val)}
                        />
                    </div>
                )}
            </div>
        </SectionWrapper>
    );

    const SidebarTitle = ({ title }) => {
        const { isContinued } = useSectionContext();
        return (
            <span style={styles.sidebarSectionTitle}>
                {isContinued ? `${title} (Cont.)` : title}
            </span>
        );
    };

    const MainTitle = ({ title, zoneId }) => {
        const { isContinued } = useSectionContext();
        const display = isContinued ? `${title} (Cont.)` : title;
        const inSidebar = zoneId?.includes('sidebar');

        if (inSidebar) {
            return <span style={styles.sidebarSectionTitle}>{display}</span>;
        }

        return (
            <div style={styles.mainSectionTitle}>
                {display}
            </div>
        );
    };

    // Skill bar renderer
    const SkillBar = ({ level }) => {
        const pct = level ? Math.min(100, (level / 5) * 100) : 60;
        return (
            <div style={styles.skillBarBg}>
                <div style={{
                    width: `${pct}%`,
                    height: "100%",
                    background: accentColor,
                    borderRadius: "3px",
                    transition: "width 0.3s ease",
                }} />
            </div>
        );
    };

    // --- CUSTOM RENDERERS ---
    const customRenderers = {
        summary: ({ isContinued, subItemRanges, zoneId }) => (
            <SectionWrapper sectionId="summary" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Summary">
                <div>
                    <MainTitle title="About Me" zoneId={zoneId} />
                    <div style={styles.itemBody}>
                        <SplittableRichText
                            html={data.summary}
                            range={subItemRanges?.summary}
                            isActive={isSpellCheckActive}
                            onIgnore={onSpellCheckIgnore}
                            onReplace={(val) => onSpellCheckReplace('summary', 'summary', val)}
                        />
                    </div>
                </div>
            </SectionWrapper>
        ),

        experience: ({ itemIndices, isContinued, subItemRanges, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.experience?.[idx]) : data.experience;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="experience" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Experience">
                    <div>
                        <MainTitle title="Experience" zoneId={zoneId} />
                        {items.map((exp, i) => {
                            if (!exp) return null;
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const dateStr = exp.year || exp.date || (exp.startYear ? `${exp.startYear} - ${exp.isCurrent ? "Present" : exp.endYear}` : "");
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.itemEntry}>
                                    <div style={styles.itemTitle}>
                                        <RichTextSpellCheck html={exp.title || exp.role || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'title')} />
                                    </div>
                                    <div style={styles.itemSubtitle}>
                                        <RichTextSpellCheck html={`${exp.company || ""}${exp.location ? `, ${exp.location}` : ""}${dateStr ? ` • ${dateStr}` : ""}`} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'company')} />
                                    </div>
                                    <div className="resume-rich-text" style={styles.itemBody}>
                                        <SplittableRichText
                                            html={exp.description}
                                            range={subItemRanges?.[originalIdx]}
                                            isActive={isSpellCheckActive}
                                            onIgnore={onSpellCheckIgnore}
                                            onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'description')}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        education: ({ itemIndices, isContinued, subItemRanges, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.education?.[idx]) : data.education;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="education" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Education">
                    <div>
                        <MainTitle title="Education" zoneId={zoneId} />
                        {items.map((edu, i) => {
                            if (!edu) return null;
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const dateStr = edu.year || edu.date || edu.endYear || "";
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.itemEntry}>
                                    <div style={styles.itemTitle}>
                                        <RichTextSpellCheck html={edu.degree} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'degree')} />
                                    </div>
                                    <div style={styles.itemSubtitle}>
                                        <RichTextSpellCheck html={`${edu.institution || edu.school || ""}${edu.location ? `, ${edu.location}` : ""}${dateStr ? ` • ${dateStr}` : ""}`} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'institution')} />
                                    </div>
                                    {edu.grade && <div style={{ fontSize: "calc(11px * var(--theme-font-scale, 1))", color: textLight, marginBottom: "4px" }}>GPA: {edu.grade}</div>}
                                    {edu.description && (
                                        <div className="resume-rich-text" style={styles.itemBody}>
                                            <SplittableRichText
                                                html={edu.description}
                                                range={subItemRanges?.[originalIdx]}
                                                isActive={isSpellCheckActive}
                                                onIgnore={onSpellCheckIgnore}
                                                onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'description')}
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        projects: ({ itemIndices, isContinued, subItemRanges, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.projects?.[idx]) : data.projects;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="projects" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Projects">
                    <div>
                        <MainTitle title="Projects" zoneId={zoneId} />
                        {items.map((proj, i) => {
                            if (!proj) return null;
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const dateStr = proj.year || (proj.startYear && `${proj.startYear} - ${proj.isCurrent ? 'Present' : (proj.endYear || 'Present')}`);
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.itemEntry}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                        <div style={styles.itemTitle}>
                                            <RichTextSpellCheck html={proj.title} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('projects', originalIdx, val, 'title')} />
                                        </div>
                                        {dateStr && <span style={{ fontSize: "calc(11px * var(--theme-font-scale, 1))", color: textLight }}>{dateStr}</span>}
                                    </div>
                                    {proj.link && (
                                        <div style={{ fontSize: "calc(11px * var(--theme-font-scale, 1))", color: accentColor, marginBottom: "5px" }}>
                                            <ResumeLink href={proj.link}>
                                                <RichTextSpellCheck html={proj.link} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('projects', originalIdx, val, 'link')} />
                                            </ResumeLink>
                                        </div>
                                    )}
                                    {proj.technologies && proj.technologies.length > 0 && (
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "6px" }}>
                                            {proj.technologies.map((tech, tIdx) => (
                                                <div key={tIdx} style={{ fontSize: "calc(10px * var(--theme-font-scale, 1))", padding: "2px 8px", background: "rgba(196,169,154,0.18)", borderRadius: "10px", color: textMid }}>
                                                    <RichTextSpellCheck html={tech} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => { const u = [...proj.technologies]; u[tIdx] = val; onSpellCheckReplace('projects', originalIdx, u, 'technologies'); }} />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="resume-rich-text" style={styles.itemBody}>
                                        <SplittableRichText html={proj.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('projects', originalIdx, val, 'description')} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        awards: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.awards?.[idx]) : data.awards;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="awards" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Awards">
                    <div>
                        <MainTitle title="Awards" zoneId={zoneId} />
                        {items.map((award, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.itemEntry}>
                                    <div style={styles.itemTitle}><RichTextSpellCheck html={award.title} isActive={isSpellCheckActive} onIgnore={onSectionClick ? onSpellCheckIgnore : null} onReplace={(val) => onSpellCheckReplace('awards', originalIdx, val, 'title')} /></div>
                                    <div style={styles.itemSubtitle}>
                                        <RichTextSpellCheck html={award.issuer} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('awards', originalIdx, val, 'issuer')} />
                                        {award.year && <span> • {award.year}</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        volunteer: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.volunteer?.[idx]) : data.volunteer;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="volunteer" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Volunteer">
                    <div>
                        <MainTitle title="Volunteer" zoneId={zoneId} />
                        {items.map((item, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.itemEntry}>
                                    <div style={styles.itemTitle}><RichTextSpellCheck html={item.organization} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('volunteer', originalIdx, val, 'organization')} /></div>
                                    <div style={styles.itemSubtitle}><RichTextSpellCheck html={item.role} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('volunteer', originalIdx, val, 'role')} /></div>
                                    <div style={{ fontSize: "calc(11px * var(--theme-font-scale, 1))", color: textLight }}>{item.startDate} - {item.isCurrent ? "Present" : item.endDate}</div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        publications: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.publications?.[idx]) : data.publications;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="publications" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Publications">
                    <div>
                        <MainTitle title="Publications" zoneId={zoneId} />
                        {items.map((pub, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.itemEntry}>
                                    <div style={styles.itemTitle}><RichTextSpellCheck html={pub.name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('publications', originalIdx, val, 'name')} /></div>
                                    <div style={styles.itemSubtitle}>
                                        <RichTextSpellCheck html={pub.publisher} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('publications', originalIdx, val, 'publisher')} />
                                        {pub.releaseDate && <span> • {pub.releaseDate}</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        additionalInfo: ({ isContinued, subItemRanges, zoneId }) => {
            const html = data.additionalInfo || "";
            if (!html || html.trim() === "" || html === "<p><br></p>") return null;
            return (
                <SectionWrapper sectionId="additionalInfo" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Additional Information">
                    <div>
                        <MainTitle title="Additional Information" zoneId={zoneId} />
                        <div className="resume-rich-text" style={styles.itemBody}>
                            <SplittableRichText html={html} range={subItemRanges?.additionalInfo} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('additionalInfo', 'additionalInfo', val)} />
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        custom: ({ isContinued, subItemRanges, zoneId }) => {
            if (!data.customSection?.isVisible || !data.customSection?.content) return null;
            const content = data.customSection.content;
            if (!content || content.trim() === "" || content === "<p><br></p>") return null;
            const title = data.customSection.title || "Additional Information";
            return (
                <SectionWrapper sectionId="custom" onSectionClick={onSectionClick} isInteractive={isInteractive} label={title}>
                    <div>
                        <MainTitle title={title} zoneId={zoneId} />
                        <div className="resume-rich-text" style={styles.itemBody}>
                            <SplittableRichText html={content} range={subItemRanges?.custom} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('customSection', 'content', val)} />
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        software: ({ itemIndices, zoneId, subItemRanges }) => {
            const items = itemIndices ? itemIndices.map(idx => data.software?.[idx]) : data.software;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="software" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Software">
                    <div>
                        <MainTitle title="Software" zoneId={zoneId} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "calc(10px * var(--theme-paragraph-margin, 1))" }}>
                            {items.map((item, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <SoftwareItem key={i} item={item} index={originalIdx} isSpellCheckActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onSpellCheckReplace={(field, val) => onSpellCheckReplace('software', originalIdx, val, field)} subItemRange={subItemRanges?.[originalIdx]} />
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        // SIDEBAR SECTIONS
        contact: ({ zoneId }) => {
            const isSidebar = zoneId?.includes('sidebar');
            const websiteItems = data.websites || [];
            const contactLinks = [
                { label: 'LinkedIn', value: personal?.linkedin, field: 'linkedin' },
                { label: 'GitHub', value: personal?.github, field: 'github' },
                { label: 'Website', value: personal?.website, field: 'website' },
                ...websiteItems.filter(l => l.addToHeader && l.url).map((l, idx) => ({ label: l.label || 'Website', value: l.url, field: 'url', isWebsite: true, idx }))
            ].filter(l => l.value);

            return (
                <SectionWrapper sectionId="contact" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Contact">
                    <div>
                        <MainTitle title="Contact Us" zoneId={zoneId} />
                        <div style={isSidebar ? {} : { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px 20px" }}>
                            {personal?.phone && (
                                <div style={styles.contactItem}>
                                    <span style={styles.contactLabel}>Phone</span>
                                    <span style={styles.contactValue}>
                                        <ResumeLink href={personal.phone}>
                                            <SpellCheckText text={personal.phone} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'phone', val)} />
                                        </ResumeLink>
                                    </span>
                                </div>
                            )}
                            {personal?.website && (
                                <div style={styles.contactItem}>
                                    <span style={styles.contactLabel}>Website</span>
                                    <span style={styles.contactValue}>
                                        <ResumeLink href={personal.website}>
                                            <SpellCheckText text={personal.website} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'website', val)} />
                                        </ResumeLink>
                                    </span>
                                </div>
                            )}
                            {personal?.email && (
                                <div style={styles.contactItem}>
                                    <span style={styles.contactLabel}>Email</span>
                                    <span style={styles.contactValue}>
                                        <ResumeLink href={personal.email}>
                                            <SpellCheckText text={personal.email} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'email', val)} />
                                        </ResumeLink>
                                    </span>
                                </div>
                            )}
                            {(personal?.city || personal?.country) && (
                                <div style={styles.contactItem}>
                                    <span style={styles.contactLabel}>Address</span>
                                    <span style={styles.contactValue}>
                                        <SpellCheckText text={[personal?.city, personal?.state, personal?.zipCode, personal?.country].filter(Boolean).join(", ")} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'city', val)} />
                                    </span>
                                </div>
                            )}
                            {contactLinks.map((link, i) => (
                                <div key={i} style={styles.contactItem}>
                                    <span style={styles.contactLabel}>{link.label}</span>
                                    <span style={styles.contactValue}>
                                        <ResumeLink href={link.value}>
                                            <SpellCheckText text={link.value} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', link.field, val)} />
                                        </ResumeLink>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        websites: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.websites?.[idx]) : data.websites;
            const portfolioLinks = (items || []).map((l, idx) => ({ ...l, originalIdx: itemIndices ? itemIndices[idx] : idx })).filter(l => !l.addToHeader && l.url);
            if (portfolioLinks.length === 0) return null;
            return (
                <SectionWrapper sectionId="websites" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Websites & Portfolios">
                    <div>
                        <SidebarTitle title="Websites & Portfolios" />
                        {portfolioLinks.map((site, i) => (
                            <div key={i} style={styles.contactItem}>
                                <span style={styles.contactLabel}>{site.label || 'Portfolio'}</span>
                                <span style={styles.contactValue}>
                                    <ResumeLink href={site.url}>
                                        <SpellCheckText text={site.url} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('websites', site.originalIdx, val, 'url')} />
                                    </ResumeLink>
                                </span>
                            </div>
                        ))}
                    </div>
                </SectionWrapper>
            );
        },

        languages: ({ itemIndices, isContinued, zoneId }) => {
            const isSidebar = zoneId?.includes('sidebar');
            const items = itemIndices ? itemIndices.map(idx => data.languages?.[idx]) : data.languages;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="languages" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Language">
                    <div>
                        <MainTitle title="Language" zoneId={zoneId} />
                        <ul style={{ paddingLeft: "14px", margin: 0, listStyle: "disc", display: isSidebar ? "block" : "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: isSidebar ? "0" : "5px 20px" }}>
                            {items.map((lang, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                const name = typeof lang === 'object' ? lang.name : lang;
                                return (
                                    <li key={i} data-item-index={originalIdx} style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", color: textDark, marginBottom: "calc(5px * var(--theme-paragraph-margin, 1))" }}>
                                        <RichTextSpellCheck html={name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('languages', originalIdx, val, 'name')} />
                                        {typeof lang === 'object' && lang.level && (
                                            <span style={{ color: textLight, fontSize: "calc(11px * var(--theme-font-scale, 1))", marginLeft: "4px" }}>• {lang.level}</span>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </SectionWrapper>
            );
        },

        skills: ({ itemIndices, isContinued, zoneId }) => {
            const isSidebar = zoneId?.includes('sidebar');
            const items = itemIndices ? itemIndices.map(idx => data.skills?.[idx]).filter(Boolean) : (data.skills || []);
            const hasDescription = data.skillsDescription && data.skillsDescription.trim();

            if (items.length > 0) {
                return (
                    <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Skills">
                        <div style={{ marginBottom: "5px" }}>
                            <MainTitle title="Skills" zoneId={zoneId} />
                            {isSidebar ? (
                                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                    {items.map((skill, i) => {
                                        const originalIdx = itemIndices ? itemIndices[i] : i;
                                        const name = typeof skill === 'object' ? skill.name : skill;
                                        const level = typeof skill === 'object' ? (skill.level || 3) : 3;
                                        return (
                                            <div key={i} data-item-index={originalIdx} style={styles.skillRow}>
                                                <span style={styles.skillName}>
                                                    <RichTextSpellCheck html={name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('skills', originalIdx, val, 'name')} />
                                                </span>
                                                <SkillBar level={level} />
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <ul className="resume-rich-text" style={{ paddingLeft: "16px", margin: 0, listStyle: "disc", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "5px 20px" }}>
                                    {items.map((skill, i) => {
                                        const originalIdx = itemIndices ? itemIndices[i] : i;
                                        const name = typeof skill === 'object' ? skill.name : skill;
                                        return (
                                            <li key={i} data-item-index={originalIdx} style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", color: textDark, marginBottom: "calc(6px * var(--theme-paragraph-margin, 1))" }}>
                                                <RichTextSpellCheck html={name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('skills', originalIdx, val, 'name')} />
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    </SectionWrapper>
                );
            }

            if (hasDescription) {
                return (
                    <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Skill">
                        <div>
                            <MainTitle title="Skill" zoneId={zoneId} />
                            <div className="resume-rich-text" style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", color: textMid }}>
                                <SplittableRichText html={data.skillsDescription} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('skills', 'skillsDescription', val)} />
                            </div>
                        </div>
                    </SectionWrapper>
                );
            }

            return null;
        },

        strengths: ({ itemIndices, isContinued, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.strengths?.[idx]).filter(Boolean) : (data.strengths || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="strengths" navigationId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Key Strengths">
                    <div style={{ marginBottom: "5px" }}>
                        <SidebarTitle title="Key Strengths" />
                        <ul className="resume-rich-text" style={{ paddingLeft: "16px", margin: 0, listStyle: "disc" }}>
                            {items.map((skill, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                const name = typeof skill === 'object' ? skill.name : skill;
                                return (
                                    <li key={i} data-item-index={originalIdx} style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", color: textDark, marginBottom: "calc(6px * var(--theme-paragraph-margin, 1))" }}>
                                        <RichTextSpellCheck html={name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('strengths', originalIdx, val, 'name')} />
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </SectionWrapper>
            );
        },

        additionalSkills: ({ itemIndices, isContinued, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.additionalSkills?.[idx]).filter(Boolean) : (data.additionalSkills || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="additionalSkills" navigationId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Additional Skills">
                    <div style={{ marginBottom: "5px" }}>
                        <SidebarTitle title="Additional Skills" />
                        <ul className="resume-rich-text" style={{ paddingLeft: "16px", margin: 0, listStyle: "disc" }}>
                            {items.map((skill, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                const name = typeof skill === 'object' ? skill.name : skill;
                                return (
                                    <li key={i} data-item-index={originalIdx} style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", color: textDark, marginBottom: "calc(6px * var(--theme-paragraph-margin, 1))" }}>
                                        <RichTextSpellCheck html={name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('additionalSkills', originalIdx, val, 'name')} />
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </SectionWrapper>
            );
        },

        certifications: ({ itemIndices, isContinued, zoneId, subItemRanges }) => {
            const items = itemIndices ? itemIndices.map(idx => data.certifications?.[idx]) : data.certifications;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="certifications" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Certifications">
                    <div>
                        <SidebarTitle title="Certifications" />
                        <div style={{ display: "flex", flexDirection: "column", gap: "calc(8px * var(--theme-paragraph-margin, 1))" }}>
                            {items.map((cert, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <CertificationItem key={i} item={cert} index={originalIdx} isSpellCheckActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onSpellCheckReplace={(field, val) => onSpellCheckReplace('certifications', originalIdx, val, field)} variant="compact" subItemRange={subItemRanges?.[originalIdx]} />
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        interests: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.interests?.[idx]) : data.interests;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="interests" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Interests">
                    <div>
                        <MainTitle title="Interests" zoneId={zoneId} />
                        <ul style={{ paddingLeft: "14px", margin: 0, listStyle: "disc" }}>
                            {items.map((item, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <li key={i} data-item-index={originalIdx} style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", color: textDark, marginBottom: "calc(4px * var(--theme-paragraph-margin, 1))" }}>
                                        <RichTextSpellCheck html={typeof item === 'object' ? item.name : item} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('interests', originalIdx, val, 'name')} />
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </SectionWrapper>
            );
        },

        keyAchievements: ({ itemIndices, zoneId, subItemRanges }) => {
            const items = itemIndices ? itemIndices.map(idx => data.keyAchievements?.[idx]) : data.keyAchievements;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="keyAchievements" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Key Achievements">
                    <div>
                        <MainTitle title="Key Achievements" zoneId={zoneId} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "calc(10px * var(--theme-paragraph-margin, 1))" }}>
                            {items.map((item, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <div key={i} data-item-index={originalIdx} style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", color: textMid }}>
                                        <div style={{ fontWeight: "700", color: textDark }}>
                                            <RichTextSpellCheck html={item.title} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('keyAchievements', originalIdx, val, 'title')} />
                                        </div>
                                        <div className="resume-rich-text">
                                            <SplittableRichText html={item.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('keyAchievements', originalIdx, val, 'description')} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        accomplishments: ({ itemIndices, zoneId, subItemRanges }) => {
            const items = itemIndices ? itemIndices.map(idx => data.accomplishments?.[idx]) : data.accomplishments;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="accomplishments" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Accomplishments">
                    <div>
                        <MainTitle title="Accomplishments" zoneId={zoneId} />
                        <ul style={{ paddingLeft: "14px", margin: 0, listStyle: "disc" }}>
                            {items.map((item, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <li key={i} data-item-index={originalIdx} style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", color: textMid, marginBottom: "calc(6px * var(--theme-paragraph-margin, 1))" }}>
                                        <RichTextSpellCheck html={typeof item === 'object' ? item.name : item} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('accomplishments', originalIdx, val, 'name')} />
                                        {item.description && <div className="resume-rich-text" style={{ marginTop: "2px" }}>
                                            <SplittableRichText html={item.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('accomplishments', originalIdx, val, 'description')} />
                                        </div>}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </SectionWrapper>
            );
        },

        affiliations: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.affiliations?.[idx]) : data.affiliations;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="affiliations" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Affiliations">
                    <div>
                        <MainTitle title="Affiliations" zoneId={zoneId} />
                        {items.map((item, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.itemEntry}>
                                    <div style={styles.itemTitle}><RichTextSpellCheck html={item.organization} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('affiliations', originalIdx, val, 'organization')} /></div>
                                    <div style={styles.itemSubtitle}><RichTextSpellCheck html={item.role} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('affiliations', originalIdx, val, 'role')} /></div>
                                    {item.date && <div style={{ fontSize: "calc(11px * var(--theme-font-scale, 1))", color: textLight }}>{item.date}</div>}
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        personalDetails: ({ zoneId }) => {
            const fields = [
                { label: 'Date of Birth', value: personal?.dob, field: 'dob' },
                { label: 'Nationality', value: personal?.nationality, field: 'nationality' },
                { label: 'Marital Status', value: personal?.maritalStatus, field: 'maritalStatus' },
                { label: 'Gender', value: personal?.gender, field: 'gender' },
                { label: 'Visa Status', value: personal?.visaStatus, field: 'visaStatus' },
                { label: 'Religion', value: personal?.religion, field: 'religion' },
                { label: 'Passport', value: personal?.passport, field: 'passport' },
                { label: 'Place of Birth', value: personal?.placeOfBirth, field: 'placeOfBirth' },
                { label: 'Driving License', value: personal?.drivingLicense, field: 'drivingLicense' },
                { label: 'Other Info', value: personal?.otherPersonal, field: 'otherPersonal' }
            ].filter(f => f.value);
            if (fields.length === 0) return null;
            return (
                <SectionWrapper sectionId="personalDetails" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Personal Details">
                    <div>
                        <SidebarTitle title="Personal Details" zoneId={zoneId} />
                        {fields.map((f, i) => (
                            <div key={i} style={styles.contactItem}>
                                <span style={styles.contactLabel}>{f.label}</span>
                                <span style={styles.contactValue}><SpellCheckText text={f.value} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', f.field, val)} /></span>
                            </div>
                        ))}
                    </div>
                </SectionWrapper>
            );
        },
    };

    // --- RENDER ZONE ---
    const renderZone = (id, items, columnStyle) => (
        <DroppableZone id={id} style={{ ...columnStyle, flex: 1 }}>
            {items.map((sid, idx) => {
                const isContinued = typeof sid === 'object' && sid.isContinued;
                const sectionId = typeof sid === 'string' ? sid : sid.id;
                const dragId = isContinued ? `${id}-cont-${sectionId}-${idx}` : sectionId;
                return (
                    <DraggableSection key={dragId} id={dragId} isEnabled={canReorder && !isContinued}>
                        <div style={{ paddingBottom: "1px" }}>
                            <SectionRenderer
                                sectionId={sectionId}
                                data={data}
                                onSectionClick={onSectionClick}
                                isContinued={isContinued}
                                itemIndices={typeof sid === 'object' ? sid.itemIndices : undefined}
                                subItemRanges={typeof sid === 'object' ? sid.subItemRanges : undefined}
                                customRenderers={customRenderers}
                                zoneId={id}
                            />
                        </div>
                    </DraggableSection>
                );
            })}
        </DroppableZone>
    );

    // --- MEASURER (for pagination) ---
    const Measurer = () => (
        <div className="resume-measurer" style={{ position: "absolute", top: -10000, left: -10000, width: "210mm", visibility: "hidden" }}>
            <div className="page-height-marker" style={{ height: "297mm", width: "1px", position: "absolute", left: 0, top: 0 }}></div>
            <div style={{ ...styles.page, height: "auto" }}>
                <div data-column-id="sidebar" style={styles.sidebarColumn}>
                    {personal?.photo && (
                        <div style={styles.photoWrap}>
                            <img src={personal.photo} style={styles.photo} alt="profile" />
                        </div>
                    )}
                    <div style={{ display: "flex", flexDirection: "column", gap: "calc(22px * var(--theme-section-margin, 1))", flex: 1 }}>
                        {activeSidebarSections.map(sid => (
                            <div key={sid} style={{ paddingBottom: "1px" }}>
                                <SectionRenderer sectionId={sid} data={data} customRenderers={customRenderers} zoneId="sidebar" />
                            </div>
                        ))}
                    </div>
                </div>
                <div data-column-id="main" style={styles.mainColumn}>
                    <Header />
                    <div style={{ display: "flex", flexDirection: "column", gap: "calc(22px * var(--theme-section-margin, 1))", flex: 1 }}>
                        {activeMainSections.map(sid => (
                            <div key={sid} style={{ paddingBottom: "1px" }}>
                                <SectionRenderer key={sid} sectionId={sid} data={data} customRenderers={customRenderers} zoneId="main" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div ref={containerRef} className="nude-harmony-root">
            <Measurer />
            <DndContext {...dndContextProps}>
                <SortableContext items={[...activeSidebarSections, ...activeMainSections]} strategy={verticalListSortingStrategy}>
                    {showPageBreaks && pages ? (
                        pages.map((page, i) => (
                            <div key={i} style={styles.page}>
                                {/* Sidebar */}
                                <div data-column-id="sidebar" style={styles.sidebarColumn}>
                                    {i === 0 && personal?.photo && (
                                        <div style={styles.photoWrap}>
                                            <img src={personal.photo} style={styles.photo} alt="profile" />
                                        </div>
                                    )}
                                    {renderZone(`sidebar-p${i}`, page.sidebar, {
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "calc(22px * var(--theme-section-margin, 1))"
                                    })}
                                </div>
                                {/* Main */}
                                <div data-column-id="main" style={styles.mainColumn}>
                                    {i === 0 && <Header />}
                                    {renderZone(`main-p${i}`, page.main, {
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "calc(22px * var(--theme-section-margin, 1))"
                                    })}
                                </div>
                                <div style={{ position: "absolute", bottom: "12px", right: "18px", fontSize: "9px", opacity: 0.4, color: textLight }}>Page {i + 1}</div>
                            </div>
                        ))
                    ) : (
                        <div style={{ ...styles.page, height: "auto", minHeight: "100%" }}>
                            {/* Sidebar */}
                            <div data-column-id="sidebar" style={styles.sidebarColumn}>
                                {personal?.photo && (
                                    <div style={styles.photoWrap}>
                                        <img src={personal.photo} style={styles.photo} alt="profile" />
                                    </div>
                                )}
                                {renderZone('sidebar', activeSidebarSections, {
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "calc(22px * var(--theme-section-margin, 1))"
                                })}
                            </div>
                            {/* Main */}
                            <div data-column-id="main" style={styles.mainColumn}>
                                <Header />
                                {renderZone('main', activeMainSections, {
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "calc(22px * var(--theme-section-margin, 1))"
                                })}
                            </div>
                        </div>
                    )}
                </SortableContext>
                <StableResumeDragOverlay activeId={activeId} scale={scale} renderSection={(id) => (
                    <div style={{ background: "white", padding: "10px", border: "1px solid #e2e8f0", width: "280px", borderRadius: "4px" }}>
                        <SectionRenderer sectionId={id} data={data} customRenderers={customRenderers} />
                    </div>
                )} />
            </DndContext>
        </div>
    );
};

export default NudeHarmony;