import React, { useRef } from "react";
import { DndContext } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SectionWrapper from "../../components/SectionWrapper";
import { useResumeDragAndDrop, DroppableZone, StableResumeDragOverlay } from "../../hooks/useResumeDragAndDrop";
import DraggableSection from "../../components/dnd/DraggableSection";
import SectionRenderer from "../common/SectionRenderer";
import { useSectionContext } from "../common/SectionContext";
import { useAutoPagination } from "../../hooks/useAutoPagination";
import { SpellCheckText, SplittableRichText, RichTextSpellCheck, ResumeLink } from "../common/BaseComponents";
import { getCompleteLayout, getSavedLayout } from "../common/TemplateUtils";

/**
 * EmeraldPrestige Template
 * Matches the "Zoey Walker" Enhancv-style design:
 * - White header: large teal name, pipe-separated profession, icon contact row, circular photo
 * - Body: left main ~62% | right sidebar ~38%
 * - Sidebar section titles: dark teal filled band with white uppercase text
 * - Main section titles: teal text with thin bottom border
 * - Experience: title + date on same line, company in teal + location, bullet description
 * - Languages: name + level label + segmented teal bar
 * - Interests: 2-col card layout with icon + title + text
 * - Key Achievements: icon bullet + bold title + description
 * - Skills: inline pipe-separated list
 * - Education: degree bold, school teal, dates + location
 */
const EmeraldPrestige = ({
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
    const templateId = 'emerald-prestige';
    const initialLayout = getSavedLayout(data, templateId, {
        main: ['summary', 'experience', 'education', 'projects', 'languages', 'interests', 'affiliations', 'volunteering', 'additionalInfo', 'custom'],
        sidebar: ['keyAchievements', 'accomplishments', 'education', 'skills', 'strengths', 'additionalSkills', 'certifications', 'software', 'languages', 'references', 'awards', 'publications', 'personalDetails', 'websites']
    });

    // Smart defaults: keep education only in one column; keyAchievements in sidebar
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
    const emerald = "#055052"; // Deep emerald for sidebar
    const teal = "var(--theme-color, #0e7c7b)";
    const darkText = "#333333";
    const bodyText = "#4a5568";
    const lightText = "#718096";
    const professionTeal = "#4fb3b0";

    // --- SIDEBAR SECTION TITLE: dark teal filled band ---
    const SidebarSectionTitle = ({ title }) => {
        const { isContinued } = useSectionContext();
        const display = isContinued ? `${title} (CONT.)` : title;
        return (
            <div style={{
                color: "white",
                fontSize: "calc(11.5px * var(--theme-font-scale, 1))",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "1.2px",
                paddingBottom: "5px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.3)",
                marginBottom: "calc(12px * var(--theme-paragraph-margin, 1))",
                fontFamily: "'Arial', sans-serif",
            }}>
                {display}
            </div>
        );
    };

    // --- MAIN SECTION TITLE: teal text + underline ---
    const MainSectionTitle = ({ title }) => {
        const { isContinued } = useSectionContext();
        const display = isContinued ? `${title} (cont.)` : title;
        return (
            <div style={{
                fontSize: "calc(14px * var(--theme-font-scale, 1))",
                fontWeight: "700",
                color: darkText,
                textTransform: "uppercase",
                letterSpacing: "1px",
                paddingBottom: "5px",
                borderBottom: `1.5px solid ${teal}`,
                marginBottom: "calc(12px * var(--theme-paragraph-margin, 1))",
                fontFamily: "'Arial', sans-serif",
            }}>
                {display}
            </div>
        );
    };

    // Auto section title based on zone
    const SectionTitle = ({ title, zoneId }) => {
        const inSidebar = zoneId?.includes('sidebar');
        return inSidebar ? <SidebarSectionTitle title={title} /> : <MainSectionTitle title={title} />;
    };

    // Language segmented bar (small teal segments)
    const LangBar = ({ level = 3, max = 5, segments = 5 }) => {
        const filled = Math.round((level / max) * segments);
        return (
            <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
                {[...Array(segments)].map((_, i) => (
                    <div key={i} style={{
                        width: "20px",
                        height: "4px",
                        borderRadius: "2px",
                        backgroundColor: i < filled ? teal : "rgba(14,124,123,0.2)",
                    }} />
                ))}
            </div>
        );
    };

    // Level name map
    const levelName = (lvl) => {
        const map = { 1: "Elementary", 2: "Limited Working", 3: "Proficient", 4: "Advanced", 5: "Native" };
        return map[lvl] || "";
    };

    const styles = {
        page: {
            width: "210mm",
            height: "297mm",
            background: "white",
            boxSizing: "border-box",
            position: "relative",
            margin: "0 auto 30px auto",
            color: darkText,
            fontFamily: "var(--theme-font, 'Arial', 'Helvetica', sans-serif)",
            letterSpacing: "var(--theme-letter-spacing, 0px)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
        },
        // HEADER
        header: {
            display: "flex",
            width: "100%",
            borderBottom: "1px solid #e2e8f0",
            position: "relative",
            background: "transparent",
        },
        name: {
            fontSize: "calc(28px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: darkText,
            lineHeight: "1.1",
            marginBottom: "3px",
            letterSpacing: "0.5px",
            fontFamily: "'Arial Black', 'Arial', sans-serif",
        },
        profession: {
            fontSize: "calc(11px * var(--theme-font-scale, 1))",
            color: professionTeal,
            fontWeight: "600",
            marginBottom: "8px",
            letterSpacing: "0.3px",
        },
        contactRow: {
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: "0",
            fontSize: "calc(10.5px * var(--theme-font-scale, 1))",
            color: bodyText,
        },
        contactItem: {
            display: "flex",
            alignItems: "center",
            gap: "3px",
            marginRight: "14px",
            marginBottom: "2px",
        },
        contactIcon: {
            color: lightText,
            fontSize: "10px",
            marginRight: "2px",
        },
        headerPhoto: {
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            objectFit: "cover",
            border: `3px solid rgba(255, 255, 255, 0.4)`,
        },
        headerPhotoPlaceholder: {
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.15)",
            border: `3px solid rgba(255, 255, 255, 0.4)`,
        },
        // BODY
        body: {
            display: "flex",
            flex: 1,
            minHeight: 0,
        },
        // MAIN (left, larger)
        mainCol: {
            flex: "0 0 62%",
            width: "62%",
            padding: "16px 18px var(--theme-page-margin, 24px) 24px",
            boxSizing: "border-box",
            background: "white",
        },
        // SIDEBAR (right, narrower)
        sidebarCol: {
            flex: "0 0 38%",
            width: "38%",
            padding: "16px 20px var(--theme-page-margin, 24px) 16px",
            boxSizing: "border-box",
            background: emerald,
            color: "white",
        },
        sectionWrap: {
            marginBottom: "calc(16px * var(--theme-section-margin, 1))",
        },
        // Experience item
        expTitleRow: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "1px",
        },
        expTitle: {
            fontSize: "calc(13px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: darkText,
            lineHeight: "1.3",
        },
        expDate: {
            fontSize: "calc(11px * var(--theme-font-scale, 1))",
            color: lightText,
            whiteSpace: "nowrap",
            marginLeft: "8px",
        },
        expCompanyRow: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "5px",
        },
        expCompany: {
            fontSize: "calc(11.5px * var(--theme-font-scale, 1))",
            color: teal,
            fontWeight: "600",
        },
        expLocation: {
            fontSize: "calc(11px * var(--theme-font-scale, 1))",
            color: lightText,
        },
        expDesc: {
            fontSize: "calc(11px * var(--theme-font-scale, 1))",
            color: bodyText,
            lineHeight: "var(--theme-line-height, 1.55)",
        },
        itemSpacing: {
            marginBottom: "calc(12px * var(--theme-paragraph-margin, 1))",
        },
        // Sidebar achievement item
        achieveItem: {
            display: "flex",
            gap: "8px",
            marginBottom: "calc(10px * var(--theme-paragraph-margin, 1))",
            alignItems: "flex-start",
        },
        achieveIcon: {
            width: "18px",
            height: "18px",
            flexShrink: 0,
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            fontWeight: "700",
            marginTop: "2px",
        },
        achieveTitle: {
            fontSize: "calc(11.5px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: "white",
            marginBottom: "2px",
        },
        achieveDesc: {
            fontSize: "calc(10.5px * var(--theme-font-scale, 1))",
            color: "rgba(255, 255, 255, 0.9)",
            lineHeight: "var(--theme-line-height, 1.5)",
        },
        // Sidebar education
        eduDegree: {
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: "white",
            lineHeight: "1.3",
            marginBottom: "1px",
        },
        eduSchool: {
            fontSize: "calc(11px * var(--theme-font-scale, 1))",
            color: "white",
            fontWeight: "600",
            marginBottom: "2px",
        },
        eduMeta: {
            display: "flex",
            justifyContent: "space-between",
            fontSize: "calc(10.5px * var(--theme-font-scale, 1))",
            color: "rgba(255, 255, 255, 0.7)",
        },
        // Skills: inline tags
        skillsWrap: {
            fontSize: "calc(11px * var(--theme-font-scale, 1))",
            color: "white",
            lineHeight: "1.7",
        },
        // Language item
        langRow: {
            marginBottom: "calc(8px * var(--theme-paragraph-margin, 1))",
        },
        langName: {
            fontSize: "calc(11.5px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: darkText,
            marginBottom: "2px",
        },
        langMeta: {
            display: "flex",
            alignItems: "center",
            gap: "8px",
        },
        langLevel: {
            fontSize: "calc(10px * var(--theme-font-scale, 1))",
            color: lightText,
        },
        // Interests: 2-col cards
        interestsGrid: {
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "8px",
        },
        interestCard: {
            display: "flex",
            gap: "8px",
            alignItems: "flex-start",
        },
        interestIcon: {
            fontSize: "14px",
            color: teal,
            flexShrink: 0,
            marginTop: "1px",
        },
        interestTitle: {
            fontSize: "calc(11px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: darkText,
            marginBottom: "2px",
        },
        interestDesc: {
            fontSize: "calc(10px * var(--theme-font-scale, 1))",
            color: bodyText,
            lineHeight: "1.45",
        },
        // Sidebar text
        sidebarText: {
            fontSize: "calc(11px * var(--theme-font-scale, 1))",
            color: bodyText,
            lineHeight: "var(--theme-line-height, 1.5)",
        },
    };

    // --- HEADER ---
    const Header = () => {
        const profParts = personal?.profession ? personal.profession.split(/[|,]/).map(s => s.trim()).filter(Boolean) : [];

        return (
            <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Header">
                <div style={styles.header}>
                    {/* Left: Name & Contact */}
                    <div style={{ ...styles.mainCol, borderBottom: "none", paddingBottom: "10px" }}>
                        <div style={styles.name}>
                            <SpellCheckText text={personal?.name || "YOUR NAME"} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'name', val)} />
                        </div>
                        {/* Profession */}
                        {personal?.profession && (
                            <div style={styles.profession}>
                                <SpellCheckText text={profParts.join("  |  ") || personal.profession} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'profession', val)} />
                            </div>
                        )}
                        {/* Contact row with icons */}
                        <div style={styles.contactRow}>
                            {personal?.email && (
                                <div style={styles.contactItem}>
                                    <span style={styles.contactIcon}>✉</span>
                                    <ResumeLink href={personal.email}>
                                        <SpellCheckText text={personal.email} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'email', val)} />
                                    </ResumeLink>
                                </div>
                            )}
                            {personal?.linkedin && (
                                <div style={styles.contactItem}>
                                    <span style={styles.contactIcon}>in</span>
                                    <ResumeLink href={personal.linkedin}>
                                        <SpellCheckText text={personal.linkedin} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'linkedin', val)} />
                                    </ResumeLink>
                                </div>
                            )}
                            {personal?.github && (
                                <div style={styles.contactItem}>
                                    <span style={styles.contactIcon}>git</span>
                                    <ResumeLink href={personal.github}>
                                        <SpellCheckText text={personal.github} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'github', val)} />
                                    </ResumeLink>
                                </div>
                            )}
                            {personal?.website && (
                                <div style={styles.contactItem}>
                                    <span style={styles.contactIcon}>🌐</span>
                                    <ResumeLink href={personal.website}>
                                        <SpellCheckText text={personal.website} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'website', val)} />
                                    </ResumeLink>
                                </div>
                            )}
                            {(data.websites || []).filter(w => w.addToHeader).map((site, i) => (
                                <div key={i} style={styles.contactItem}>
                                    <span style={styles.contactIcon}>🔗</span>
                                    <ResumeLink href={site.url}>
                                        <SpellCheckText text={site.url} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('websites', i, val, 'url')} />
                                    </ResumeLink>
                                </div>
                            ))}
                            {personal?.phone && (
                                <div style={styles.contactItem}>
                                    <span style={styles.contactIcon}>☎</span>
                                    <ResumeLink href={personal.phone}>
                                        <SpellCheckText text={personal.phone} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'phone', val)} />
                                    </ResumeLink>
                                </div>
                            )}
                            {(personal?.city || personal?.state || personal?.country || personal?.zipCode || personal?.zip) && (
                                <div style={styles.contactItem}>
                                    <span style={styles.contactIcon}>⌖</span>
                                    <SpellCheckText text={[personal.city, personal.state, personal.country, personal.zipCode || personal.zip].filter(Boolean).join(", ")} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'city', val)} />
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Right: Photo (in emerald zone) */}
                    <div style={{ ...styles.sidebarCol, paddingBottom: "10px", display: "flex", justifyContent: "center", alignItems: "center", background: emerald }}>
                        {personal?.photo ? (
                            <img src={personal.photo} alt="Profile" style={styles.headerPhoto} />
                        ) : (
                            <div style={styles.headerPhotoPlaceholder} />
                        )}
                    </div>
                </div>
            </SectionWrapper>
        );
    };

    // Achievement icons cycle
    const achieveIcons = ["★", "◈", "✦", "◉", "▲", "◆", "◇", "⬟"];

    // --- CUSTOM RENDERERS ---
    const customRenderers = {
        // MAIN sections
        summary: ({ subItemRanges, zoneId }) => {
            if (!data.summary) return null;
            const inSidebar = zoneId?.toLowerCase().includes('sidebar');
            return (
                <SectionWrapper sectionId="summary" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Summary">
                    <div style={styles.sectionWrap}>
                        <SectionTitle title="Summary" zoneId={zoneId} />
                        <div className="resume-rich-text" style={inSidebar ? { ...styles.sidebarText, color: "rgba(255,255,255,0.9)", textAlign: "justify" } : { fontSize: "calc(11.5px * var(--theme-font-scale, 1))", color: bodyText, lineHeight: "var(--theme-line-height, 1.6)", textAlign: "justify" }}>
                            <SplittableRichText html={data.summary} range={subItemRanges?.summary} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('summary', 'summary', val)} />
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        experience: ({ itemIndices, subItemRanges, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.experience?.[idx]).filter(Boolean) : (data.experience || []);
            if (items.length === 0) return null;
            const inSidebar = zoneId?.toLowerCase().includes('sidebar');
            return (
                <SectionWrapper sectionId="experience" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Experience">
                    <div style={styles.sectionWrap}>
                        <SectionTitle title="Experience" zoneId={zoneId} />
                        {items.map((exp, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const dates = exp.year || exp.date || (exp.startYear ? `${exp.startYear} - ${exp.isCurrent ? "Present" : (exp.endYear || "")}` : "");
                            const locationStr = [exp.location, exp.isRemote ? "Remote" : null].filter(Boolean).join(", ");

                            if (inSidebar) {
                                return (
                                    <div key={i} data-item-index={originalIdx} style={styles.itemSpacing}>
                                        <div style={{ ...styles.expTitle, color: "white" }}>
                                            <RichTextSpellCheck html={exp.title || exp.role || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'title')} />
                                        </div>
                                        <div style={{ ...styles.expCompany, color: professionTeal, fontSize: "calc(11px * var(--theme-font-scale, 1))" }}>
                                            <RichTextSpellCheck html={exp.company || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'company')} />
                                        </div>
                                        <div style={{ ...styles.expDate, color: "rgba(255,255,255,0.7)", marginLeft: 0, marginTop: "2px" }}>{dates}</div>
                                        {exp.description && (
                                            <div className="resume-rich-text" style={{ ...styles.expDesc, color: "rgba(255,255,255,0.9)", marginTop: "4px" }}>
                                                <SplittableRichText html={exp.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'description')} />
                                            </div>
                                        )}
                                    </div>
                                );
                            }

                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.itemSpacing}>
                                    <div style={styles.expTitleRow}>
                                        <div style={styles.expTitle}>
                                            <RichTextSpellCheck html={exp.title || exp.role || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'title')} />
                                        </div>
                                        <div style={styles.expDate}>{dates}</div>
                                    </div>
                                    <div style={styles.expCompanyRow}>
                                        <div style={styles.expCompany}>
                                            <RichTextSpellCheck html={exp.company || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'company')} />
                                        </div>
                                        {locationStr && <div style={styles.expLocation}>{locationStr}</div>}
                                    </div>
                                    {exp.description && (
                                        <div className="resume-rich-text" style={styles.expDesc}>
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

        // Languages in MAIN: 2-col with bars
        languages: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.languages?.[idx]).filter(Boolean) : (data.languages || []);
            if (items.length === 0) return null;
            const inSidebar = zoneId?.includes('sidebar');
            return (
                <SectionWrapper sectionId="languages" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Languages">
                    <div style={styles.sectionWrap}>
                        <SectionTitle title="Languages" zoneId={zoneId} />
                        <div style={{ display: "grid", gridTemplateColumns: inSidebar ? "1fr" : "1fr 1fr", gap: "6px 20px" }}>
                            {items.map((lang, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                const lvl = lang.level_num ?? lang.levelNum ?? null;
                                // Try to derive numeric level from text
                                const levelMap = { native: 5, fluent: 4, advanced: 4, proficient: 3, intermediate: 3, "limited working": 2, elementary: 1, beginner: 1 };
                                const numLvl = lvl || (typeof lang.level === 'string' ? (levelMap[lang.level.toLowerCase()] || 3) : 3);
                                return (
                                    <div key={i} data-item-index={originalIdx} style={styles.langRow}>
                                        <div style={styles.langName}>
                                            <RichTextSpellCheck html={lang.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('languages', originalIdx, val, 'name')} />
                                        </div>
                                        <div style={styles.langMeta}>
                                            <LangBar level={numLvl} />
                                            <span style={styles.langLevel}>
                                                <RichTextSpellCheck html={lang.level || levelName(numLvl)} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('languages', originalIdx, val, 'level')} />
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        // Interests in MAIN: 2-col card grid
        interests: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.interests?.[idx]).filter(Boolean) : (data.interests || []);
            if (items.length === 0) return null;
            const inSidebar = zoneId?.includes('sidebar');
            const icons = ["◈", "◉", "★", "▲", "◆", "✦", "⬟", "◇"];
            return (
                <SectionWrapper sectionId="interests" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Interests">
                    <div style={styles.sectionWrap}>
                        <SectionTitle title="Interests" zoneId={zoneId} />
                        <div style={{ display: "grid", gridTemplateColumns: inSidebar ? "1fr" : "1fr 1fr", gap: "10px 16px" }}>
                            {items.map((item, i) => {
                                const originalIndex = itemIndices ? itemIndices[i] : i;
                                const name = typeof item === 'object' ? item.name : item;
                                const desc = typeof item === 'object' ? item.description : null;
                                return (
                                    <div key={i} data-item-index={originalIndex} style={styles.interestCard}>
                                        <div style={styles.interestIcon}>{icons[i % icons.length]}</div>
                                        <div>
                                            <div style={styles.interestTitle}>
                                                <RichTextSpellCheck html={name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('interests', originalIndex, val, 'name')} />
                                            </div>
                                            {desc && (
                                                <div style={styles.interestDesc}>
                                                    <RichTextSpellCheck html={desc} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('interests', originalIndex, val, 'description')} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
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
                    <div style={styles.sectionWrap}>
                        <SectionTitle title="Education" zoneId={zoneId} />
                        {items.map((edu, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const degreeStr = [edu.degree, edu.field].filter(Boolean).join(" in ");
                            const displayDates = edu.year || edu.date || (edu.startYear && edu.endYear ? `${edu.startYear} - ${edu.endYear}` : edu.startYear || edu.endYear || "");
                            const locationStr = [edu.city, edu.country].filter(Boolean).join(", ");

                            if (inSidebar) {
                                return (
                                    <div key={i} data-item-index={originalIdx} style={styles.itemSpacing}>
                                        <div style={styles.eduDegree}>
                                            <RichTextSpellCheck html={degreeStr || edu.degree || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'degree')} />
                                        </div>
                                        <div style={styles.eduSchool}>
                                            <RichTextSpellCheck html={edu.institution || edu.school || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'institution')} />
                                        </div>
                                        <div style={styles.eduMeta}>
                                            <span>{displayDates}</span>
                                            {locationStr && <span>{locationStr}</span>}
                                        </div>
                                        {edu.grade && <div style={{ fontSize: "calc(10.5px * var(--theme-font-scale, 1))", color: "rgba(255,255,255,0.7)", marginTop: "2px" }}>GPA: {edu.grade}</div>}
                                        {edu.description && (
                                            <div className="resume-rich-text" style={{ ...styles.sidebarText, color: "rgba(255,255,255,0.9)", marginTop: "4px" }}>
                                                <SplittableRichText html={edu.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'description')} />
                                            </div>
                                        )}
                                    </div>
                                );
                            }

                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.itemSpacing}>
                                    <div style={styles.eduDegree}>
                                        <RichTextSpellCheck html={degreeStr || edu.degree || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'degree')} />
                                    </div>
                                    <div style={{ ...styles.eduSchool, color: teal }}>
                                        <RichTextSpellCheck html={edu.institution || edu.school || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'institution')} />
                                    </div>
                                    <div style={styles.eduMeta}>
                                        <span>{displayDates}</span>
                                        {locationStr && <span>{locationStr}</span>}
                                    </div>
                                    {edu.grade && <div style={{ fontSize: "calc(10.5px * var(--theme-font-scale, 1))", color: lightText, marginTop: "2px" }}>GPA: {edu.grade}</div>}
                                    {edu.description && (
                                        <div className="resume-rich-text" style={{ fontSize: "calc(11px * var(--theme-font-scale, 1))", color: bodyText, marginTop: "4px" }}>
                                            <SplittableRichText html={edu.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSectionClick ? onSpellCheckReplace('education', originalIdx, val, 'description') : null} />
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
            const inSidebar = zoneId?.toLowerCase().includes('sidebar');
            return (
                <SectionWrapper sectionId="projects" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Projects">
                    <div style={styles.sectionWrap}>
                        <SectionTitle title="Projects" zoneId={zoneId} />
                        {items.map((proj, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const dates = proj.year || (proj.startYear ? `${proj.startYear} - ${proj.isCurrent ? 'Present' : (proj.endYear || '')}` : "");
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.itemSpacing}>
                                    <div style={styles.expTitleRow}>
                                        <div style={{ ...styles.expTitle, color: inSidebar ? "white" : darkText }}>
                                            <RichTextSpellCheck html={proj.title || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('projects', originalIdx, val, 'title')} />
                                        </div>
                                        {dates && <div style={{ ...styles.expDate, color: inSidebar ? "rgba(255,255,255,0.7)" : lightText }}>{dates}</div>}
                                    </div>
                                    {proj.link && <div style={{ fontSize: "calc(10.5px * var(--theme-font-scale, 1))", color: professionTeal, marginBottom: "3px" }}><ResumeLink href={proj.link}><RichTextSpellCheck html={proj.link} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('projects', originalIdx, val, 'link')} /></ResumeLink></div>}
                                    {proj.technologies?.length > 0 && <div style={{ fontSize: "calc(10px * var(--theme-font-scale, 1))", color: inSidebar ? "rgba(255,255,255,0.6)" : lightText, marginBottom: "3px" }}>{proj.technologies.join(" · ")}</div>}
                                    {proj.description && <div className="resume-rich-text" style={{ ...styles.expDesc, color: inSidebar ? "rgba(255,255,255,0.9)" : bodyText }}><SplittableRichText html={proj.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('projects', originalIdx, val, 'description')} /></div>}
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
            const inSidebar = zoneId?.toLowerCase().includes('sidebar');
            return (
                <SectionWrapper sectionId="volunteering" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Volunteering">
                    <div style={styles.sectionWrap}>
                        <SectionTitle title="Volunteering" zoneId={zoneId} />
                        {items.map((vol, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const dates = vol.year || vol.date || (vol.startYear ? `${vol.startYear} - ${vol.isCurrent ? "Present" : (vol.endYear || "")}` : "");
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.itemSpacing}>
                                    <div style={styles.expTitleRow}>
                                        <div style={{ ...styles.expTitle, color: inSidebar ? "white" : darkText }}><RichTextSpellCheck html={vol.organization || vol.company || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('volunteering', originalIdx, val, 'organization')} /></div>
                                        {dates && <div style={{ ...styles.expDate, color: inSidebar ? "rgba(255,255,255,0.7)" : lightText }}>{dates}</div>}
                                    </div>
                                    {(vol.cause || vol.title) && <div style={{ ...styles.expCompany, color: inSidebar ? professionTeal : teal }}><RichTextSpellCheck html={vol.cause || vol.title || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('volunteering', originalIdx, val, 'title')} /></div>}
                                    {vol.description && <div className="resume-rich-text" style={{ ...styles.expDesc, color: inSidebar ? "rgba(255,255,255,0.9)" : bodyText, marginTop: "4px" }}><SplittableRichText html={vol.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('volunteering', originalIdx, val, 'description')} /></div>}
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
            const inSidebar = zoneId?.toLowerCase().includes('sidebar');
            return (
                <SectionWrapper sectionId="affiliations" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Affiliations">
                    <div style={styles.sectionWrap}>
                        <SectionTitle title="Professional Affiliations" zoneId={zoneId} />
                        {items.map((aff, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={originalIdx} style={{ ...styles.itemSpacing, display: "flex", gap: "6px" }}>
                                    <span style={{ color: inSidebar ? "white" : teal, marginTop: "2px" }}>◆</span>
                                    <div>
                                        <div style={{ fontSize: "calc(11.5px * var(--theme-font-scale, 1))", fontWeight: "700", color: inSidebar ? "white" : darkText }}><RichTextSpellCheck html={aff.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('affiliations', originalIdx, val, 'name')} /></div>
                                        {aff.description && <div style={{ ...styles.expDesc, color: inSidebar ? "rgba(255,255,255,0.8)" : bodyText }}><RichTextSpellCheck html={aff.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('affiliations', originalIdx, val, 'description')} /></div>}
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
            return (
                <SectionWrapper sectionId="additionalInfo" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Additional Information">
                    <div style={styles.sectionWrap}>
                        <SectionTitle title="Additional Information" zoneId={zoneId} />
                        <div className="resume-rich-text" style={styles.expDesc}>
                            <SplittableRichText html={data.additionalInfo} range={subItemRanges?.additionalInfo} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('additionalInfo', 'additionalInfo', val)} />
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        custom: ({ subItemRanges, zoneId }) => {
            if (!data.customSection?.isVisible || !data.customSection?.content) return null;
            const title = data.customSection.title || "Additional Information";
            return (
                <SectionWrapper sectionId="custom" onSectionClick={onSectionClick} isInteractive={isInteractive} label={title}>
                    <div style={styles.sectionWrap}>
                        <SectionTitle title={title} zoneId={zoneId} />
                        <div className="resume-rich-text" style={styles.expDesc}>
                            <SplittableRichText html={data.customSection.content} range={subItemRanges?.custom} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('customSection', 'content', val)} />
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        // SIDEBAR sections
        keyAchievements: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.keyAchievements?.[idx]).filter(Boolean) : (data.keyAchievements || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="keyAchievements" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Key Achievements">
                    <div style={styles.sectionWrap}>
                        <SectionTitle title="Key Achievements" zoneId={zoneId} />
                        {items.map((item, i) => {
                            const originalIndex = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={originalIndex} style={styles.achieveItem}>
                                    <div style={styles.achieveIcon}>{achieveIcons[i % achieveIcons.length]}</div>
                                    <div>
                                        {item.name && <div style={styles.achieveTitle}><RichTextSpellCheck html={item.name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('keyAchievements', originalIndex, val, 'name')} /></div>}
                                        {item.description && <div style={styles.achieveDesc}><RichTextSpellCheck html={item.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('keyAchievements', originalIndex, val, 'description')} /></div>}
                                    </div>
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
            return (
                <SectionWrapper sectionId="accomplishments" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Accomplishments">
                    <div style={styles.sectionWrap}>
                        <SectionTitle title="Accomplishments" zoneId={zoneId} />
                        {items.map((item, i) => {
                            const originalIndex = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={originalIndex} style={styles.achieveItem}>
                                    <div style={styles.achieveIcon}>{achieveIcons[i % achieveIcons.length]}</div>
                                    <div>
                                        {item.name && <div style={styles.achieveTitle}><RichTextSpellCheck html={item.name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('accomplishments', originalIndex, val, 'name')} /></div>}
                                        {item.description && <div style={styles.achieveDesc}><RichTextSpellCheck html={item.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('accomplishments', originalIndex, val, 'description')} /></div>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        skills: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.skills?.[idx]).filter(Boolean) : (data.skills || []);
            if (items.length === 0 && !data.skillsDescription) return null;
            const inSidebar = zoneId?.toLowerCase().includes('sidebar');
            return (
                <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Skills">
                    <div style={styles.sectionWrap}>
                        <SectionTitle title="Skills" zoneId={zoneId} />
                        {items.length > 0 ? (
                            <div style={inSidebar ? styles.skillsWrap : { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", fontSize: "calc(11.5px * var(--theme-font-scale, 1))", color: bodyText }}>
                                {items.map((skill, i) => {
                                    const originalIndex = itemIndices ? itemIndices[i] : i;
                                    const name = typeof skill === 'object' ? skill.name : skill;
                                    if (inSidebar) {
                                        return (
                                            <React.Fragment key={originalIndex}>
                                                <span data-item-index={originalIndex}>
                                                    <RichTextSpellCheck html={name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('skills', originalIndex, val, 'name')} />
                                                </span>
                                                {i < items.length - 1 && <span style={{ color: teal, margin: "0 5px" }}>-</span>}
                                            </React.Fragment>
                                        );
                                    }
                                    return (
                                        <div key={originalIndex} data-item-index={originalIndex} style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                                            <span style={{ color: teal, marginTop: "2px", fontWeight: "bold" }}>•</span>
                                            <RichTextSpellCheck html={name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('skills', originalIndex, val, 'name')} />
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="resume-rich-text" style={inSidebar ? styles.sidebarText : { ...styles.expDesc, textAlign: "justify" }}>
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
            const inSidebar = zoneId?.toLowerCase().includes('sidebar');
            return (
                <SectionWrapper sectionId="strengths" navigationId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Key Strengths">
                    <div style={styles.sectionWrap}>
                        <SectionTitle title="Key Strengths" zoneId={zoneId} />
                        <div style={inSidebar ? styles.skillsWrap : { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px", fontSize: "calc(11.5px * var(--theme-font-scale, 1))", color: bodyText }}>
                            {items.map((s, i) => {
                                const originalIndex = itemIndices ? itemIndices[i] : i;
                                const name = typeof s === 'object' ? s.name : s;
                                if (inSidebar) {
                                    return (
                                        <React.Fragment key={originalIndex}>
                                            <span data-item-index={originalIndex}>
                                                <RichTextSpellCheck html={name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('strengths', originalIndex, val, 'name')} />
                                            </span>
                                            {i < items.length - 1 && <span style={{ color: teal, margin: "0 5px" }}>-</span>}
                                        </React.Fragment>
                                    );
                                }
                                return (
                                    <div key={originalIndex} data-item-index={originalIndex} style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                                        <span style={{ color: teal, marginTop: "2px", fontWeight: "bold" }}>◈</span>
                                        <RichTextSpellCheck html={name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('strengths', originalIndex, val, 'name')} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        additionalSkills: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.additionalSkills?.[idx]).filter(Boolean) : (data.additionalSkills || []);
            if (items.length === 0) return null;
            const inSidebar = zoneId?.toLowerCase().includes('sidebar');
            return (
                <SectionWrapper sectionId="additionalSkills" navigationId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Additional Skills">
                    <div style={styles.sectionWrap}>
                        <SectionTitle title="Additional Skills" zoneId={zoneId} />
                        <div style={inSidebar ? styles.skillsWrap : { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", fontSize: "calc(11.5px * var(--theme-font-scale, 1))", color: bodyText }}>
                            {items.map((s, i) => {
                                const originalIndex = itemIndices ? itemIndices[i] : i;
                                const name = typeof s === 'object' ? s.name : s;
                                if (inSidebar) {
                                    return (
                                        <React.Fragment key={originalIndex}>
                                            <span data-item-index={originalIndex}>
                                                <RichTextSpellCheck html={name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('additionalSkills', originalIndex, val, 'name')} />
                                            </span>
                                            {i < items.length - 1 && <span style={{ color: teal, margin: "0 5px" }}>-</span>}
                                        </React.Fragment>
                                    );
                                }
                                return (
                                    <div key={originalIndex} data-item-index={originalIndex} style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                                        <span style={{ color: teal, marginTop: "2px", fontWeight: "bold" }}>•</span>
                                        <RichTextSpellCheck html={name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('additionalSkills', originalIndex, val, 'name')} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        certifications: ({ itemIndices, subItemRanges, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.certifications?.[idx]).filter(Boolean) : (data.certifications || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="certifications" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Training / Courses">
                    <div style={styles.sectionWrap}>
                        <SectionTitle title="Training / Courses" zoneId={zoneId} />
                        {items.map((cert, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.achieveItem}>
                                    <div style={styles.achieveIcon}>{achieveIcons[(i + 3) % achieveIcons.length]}</div>
                                    <div>
                                        <div style={styles.achieveTitle}><RichTextSpellCheck html={cert.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('certifications', originalIdx, val, 'name')} /></div>
                                        {(cert.issuer || cert.date || cert.year) && <div style={{ ...styles.achieveDesc, color: teal }}><RichTextSpellCheck html={[cert.issuer, cert.date || cert.year].filter(Boolean).join(" · ")} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('certifications', originalIdx, val, 'issuer')} /></div>}
                                        {cert.description && <div className="resume-rich-text" style={styles.achieveDesc}><SplittableRichText html={cert.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('certifications', originalIdx, val, 'description')} /></div>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        software: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.software?.[idx]).filter(Boolean) : (data.software || []);
            if (items.length === 0) return null;
            const inSidebar = zoneId?.toLowerCase().includes('sidebar');
            return (
                <SectionWrapper sectionId="software" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Software">
                    <div style={styles.sectionWrap}>
                        <SectionTitle title="Software" zoneId={zoneId} />
                        <div style={inSidebar ? styles.skillsWrap : { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", fontSize: "calc(11.5px * var(--theme-font-scale, 1))", color: bodyText }}>
                            {items.map((item, i) => {
                                const originalIndex = itemIndices ? itemIndices[i] : i;
                                if (inSidebar) {
                                    return (
                                        <React.Fragment key={i}>
                                            <span data-item-index={originalIndex}><RichTextSpellCheck html={item.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('software', originalIndex, val, 'name')} /></span>
                                            {i < items.length - 1 && <span style={{ color: teal, margin: "0 5px" }}>-</span>}
                                        </React.Fragment>
                                    );
                                }
                                return (
                                    <div key={originalIndex} data-item-index={originalIndex} style={{ textAlign: "center", border: `1px solid ${teal}`, borderRadius: "4px", padding: "4px 2px" }}>
                                        <RichTextSpellCheck html={item.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('software', originalIndex, val, 'name')} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        awards: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.awards?.[idx]).filter(Boolean) : (data.awards || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="awards" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Awards">
                    <div style={styles.sectionWrap}>
                        <SectionTitle title="Awards" zoneId={zoneId} />
                        {items.map((award, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.achieveItem}>
                                    <div style={styles.achieveIcon}>★</div>
                                    <div>
                                        <div style={styles.achieveTitle}><RichTextSpellCheck html={award.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('awards', originalIdx, val, 'name')} /></div>
                                        {award.issuer && <div style={{ ...styles.achieveDesc, color: teal }}><RichTextSpellCheck html={[award.issuer, award.date].filter(Boolean).join(" · ")} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('awards', originalIdx, val, 'issuer')} /></div>}
                                    </div>
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
            const inSidebar = zoneId?.toLowerCase().includes('sidebar');
            return (
                <SectionWrapper sectionId="publications" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Publications">
                    <div style={styles.sectionWrap}>
                        <SectionTitle title="Publications" zoneId={zoneId} />
                        {items.map((pub, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.itemSpacing}>
                                    <div style={{ fontSize: "calc(11.5px * var(--theme-font-scale, 1))", fontWeight: "700", color: inSidebar ? "white" : darkText }}><RichTextSpellCheck html={pub.title || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('publications', originalIdx, val, 'title')} /></div>
                                    {pub.publisher && <div style={{ ...styles.sidebarText, color: inSidebar ? professionTeal : teal }}><RichTextSpellCheck html={[pub.publisher, pub.date].filter(Boolean).join(" · ")} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('publications', originalIdx, val, 'publisher')} /></div>}
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        references: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.references?.[idx]).filter(Boolean) : (data.references || []);
            if (items.length === 0) return null;
            const inSidebar = zoneId?.toLowerCase().includes('sidebar');
            return (
                <SectionWrapper sectionId="references" onSectionClick={onSectionClick} isInteractive={isInteractive} label="References">
                    <div style={styles.sectionWrap}>
                        <SectionTitle title="References" zoneId={zoneId} />
                        {items.map((ref, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.itemSpacing}>
                                    <div style={{ fontSize: "calc(11.5px * var(--theme-font-scale, 1))", fontWeight: "700", color: inSidebar ? "white" : darkText }}><RichTextSpellCheck html={ref.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('references', originalIdx, val, 'name')} /></div>
                                    {ref.title && <div style={{ ...(inSidebar ? styles.achieveDesc : styles.sidebarText), fontStyle: "italic" }}><RichTextSpellCheck html={ref.title} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('references', originalIdx, val, 'title')} /></div>}
                                    {ref.contact && <div style={inSidebar ? styles.achieveDesc : styles.sidebarText}><RichTextSpellCheck html={ref.contact} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('references', originalIdx, val, 'contact')} /></div>}
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        personalDetails: ({ zoneId }) => {
            const { personal: p = {} } = data;
            const details = [
                { label: 'Date of Birth', value: p.dob || p.dateOfBirth || p.birthDate },
                { label: 'Nationality', value: p.nationality },
                { label: 'Marital Status', value: p.maritalStatus || p.marital_status },
                { label: 'Gender', value: p.gender },
                { label: 'Religion', value: p.religion },
                { label: 'Visa Status', value: p.visaStatus || p.visa_status },
                { label: 'Passport', value: p.passport || p.passportNumber },
                { label: 'Place of Birth', value: p.placeOfBirth },
                { label: 'Driving License', value: p.drivingLicense },
                { label: 'Other', value: p.otherPersonal || p.otherInformation }
            ].filter(d => d.value);

            if (details.length === 0) return null;

            return (
                <SectionWrapper sectionId="personalDetails" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Personal Details">
                    <div style={styles.sectionWrap}>
                        <SectionTitle title="Personal Details" zoneId={zoneId} />
                        {details.map((d, i) => (
                            <div key={i} style={{ marginBottom: "calc(5px * var(--theme-paragraph-margin, 1))" }}>
                                <div style={{ fontSize: "calc(10px * var(--theme-font-scale, 1))", fontWeight: "700", color: lightText, textTransform: "uppercase", letterSpacing: "0.5px" }}>{d.label}</div>
                                <div style={styles.sidebarText}>
                                    <SpellCheckText
                                        text={d.value}
                                        isActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onReplace={(val) => onSpellCheckReplace('personal', d.label.toLowerCase().replace(/ /g, ''), val)}
                                    />
                                </div>
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
            return (
                <SectionWrapper sectionId="websites" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Links">
                    <div style={styles.sectionWrap}>
                        <SectionTitle title="Links" zoneId={zoneId} />
                        {filtered.map((site, i) => (
                            <div key={i} style={{ marginBottom: "4px" }}>
                                <div style={{ fontSize: "calc(10px * var(--theme-font-scale, 1))", color: lightText, textTransform: "uppercase", letterSpacing: "0.5px" }}>{site.label || 'Website'}</div>
                                <div style={{ fontSize: "calc(10.5px * var(--theme-font-scale, 1))", wordBreak: "break-all" }}><ResumeLink href={site.url}><SpellCheckText text={site.url} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('websites', itemIndices ? itemIndices[i] : i, val, 'url')} /></ResumeLink></div>
                            </div>
                        ))}
                    </div>
                </SectionWrapper>
            );
        },
    };

    // --- RENDER ZONE ---
    const renderZone = (id, items) => (
        <DroppableZone id={id}>
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
                            zoneId={id}
                        />
                    </DraggableSection>
                );
            })}
        </DroppableZone>
    );

    const Measurer = () => (
        <div className="resume-measurer" style={{ position: "absolute", top: -10000, left: -10000, width: "210mm", visibility: "hidden" }}>
            {/* MANDATORY — gives useAutoPagination the real DPI-aware A4 pixel height */}
            <div className="page-height-marker" style={{ height: "297mm", width: "1px", position: "absolute", left: 0, top: 0 }} />
            <div style={{ ...styles.page, height: "auto", overflow: "visible" }}>
                <Header />
                <div style={{ display: "flex", flex: 1 }}>
                    <div data-column-id="main" style={{ ...styles.mainCol, paddingBottom: "1px" }}>
                        {activeMainSections.map(sid => <div key={sid} style={{ paddingBottom: "1px" }}><SectionRenderer sectionId={sid} data={data} customRenderers={customRenderers} zoneId="main" /></div>)}
                    </div>
                    <div data-column-id="sidebar" style={{ ...styles.sidebarCol, paddingBottom: "1px" }}>
                        {activeSidebarSections.map(sid => <div key={sid} style={{ paddingBottom: "1px" }}><SectionRenderer sectionId={sid} data={data} customRenderers={customRenderers} zoneId="sidebar" /></div>)}
                    </div>
                </div>
            </div>
        </div>
    );

    const PageBody = ({ pageIndex, mainItems, sidebarItems }) => (
        <div style={{ display: "flex", flex: 1 }}>
            <div style={styles.mainCol}>
                {renderZone(showPageBreaks ? `main-p${pageIndex}` : 'main', mainItems)}
            </div>
            <div style={styles.sidebarCol}>
                {renderZone(showPageBreaks ? `sidebar-p${pageIndex}` : 'sidebar', sidebarItems)}
            </div>
        </div>
    );

    return (
        <div ref={containerRef} className="emerald-prestige-root">
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

export default EmeraldPrestige;
