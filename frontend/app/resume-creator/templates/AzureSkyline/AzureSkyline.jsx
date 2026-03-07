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
 * AzureSkyline Template
 * Clean two-column layout with blue accent, small-caps section headers,
 * date column on left, content on right. Matches the "Olivia Martinez" style.
 * Supports circular photo, skill bars, section/paragraph spacing CSS vars.
 */
const AzureSkyline = ({
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

    const templateId = 'azure-skyline';
    const initialLayout = getSavedLayout(data, templateId, {
        main: ['summary', 'education', 'skills', 'experience', 'strengths', 'additionalSkills', 'keyAchievements', 'accomplishments', 'projects', 'certifications', 'languages', 'software', 'interests', 'awards', 'volunteering', 'publications', 'references', 'affiliations', 'personalDetails', 'additionalInfo', 'custom']
    });

    const completeLayout = getCompleteLayout(data, initialLayout, 'main');
    const activeSections = completeLayout.main || [];

    const { dndContextProps, activeId } = useResumeDragAndDrop({
        data, onReorder, scale,
        containers: { main: activeSections }
    });

    const pages = useAutoPagination({
        columns: { main: activeSections },
        data, enabled: showPageBreaks, containerRef, scale
    });

    // --- COLORS ---
    const accent = "var(--theme-color, #1E9FD4)";
    const darkText = "#1a1a1a";
    const mediumText = "#333333";
    const lightText = "#666666";
    const mutedText = "#999999";

    // Left date column width
    const dateColW = "130px";

    const styles = {
        page: {
            width: "210mm",
            height: "297mm",
            background: "white",
            padding: "var(--theme-page-margin, 36px) var(--theme-page-margin, 36px) var(--theme-page-margin, 36px) var(--theme-page-margin, 36px)",
            boxSizing: "border-box",
            position: "relative",
            margin: "0 auto 30px auto",
            color: darkText,
            fontFamily: "var(--theme-font, 'Calibri', 'Segoe UI', Arial, sans-serif)",
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            letterSpacing: "var(--theme-letter-spacing, 0px)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
        },
        // HEADER
        headerWrap: {
            position: "relative",
            textAlign: "center",
            marginBottom: "calc(16px * var(--theme-section-margin, 1))",
            paddingRight: "70px", // offset for photo
        },
        name: {
            fontSize: "calc(30px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: accent,
            letterSpacing: "1px",
            fontVariant: "small-caps",
            lineHeight: "1.2",
            marginBottom: "6px",
        },
        contactRow: {
            fontSize: "calc(11.5px * var(--theme-font-scale, 1))",
            color: mediumText,
            lineHeight: "1.6",
        },
        photoWrap: {
            position: "absolute",
            top: "0px",
            right: "0px",
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            overflow: "hidden",
            border: `2px solid ${accent}`,
        },
        photoImg: {
            width: "100%",
            height: "100%",
            objectFit: "cover",
        },
        // SECTION HEADER ROW: label + line
        sectionHeaderRow: {
            display: "flex",
            alignItems: "center",
            marginBottom: "calc(10px * var(--theme-paragraph-margin, 1))",
        },
        sectionLabel: {
            fontSize: "calc(13px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            fontVariant: "small-caps",
            color: accent,
            whiteSpace: "nowrap",
            marginRight: "10px",
            lineHeight: "1.2",
            minWidth: dateColW, // align with date column
        },
        sectionLine: {
            flex: 1,
            height: "1.5px",
            background: accent,
        },
        // BODY: two-column date + content
        bodyRow: {
            display: "flex",
            marginBottom: "calc(10px * var(--theme-paragraph-margin, 1))",
        },
        dateCol: {
            minWidth: dateColW,
            width: dateColW,
            fontSize: "calc(11px * var(--theme-font-scale, 1))",
            color: mediumText,
            paddingRight: "12px",
            lineHeight: "1.5",
            paddingTop: "1px",
        },
        contentCol: {
            flex: 1,
            minWidth: 0,
        },
        // content text
        richText: {
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            lineHeight: "var(--theme-line-height, 1.5)",
            color: mediumText,
        },
        itemTitle: {
            fontSize: "calc(12.5px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: darkText,
            marginBottom: "2px",
        },
        itemSubtitle: {
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: darkText,
            marginBottom: "1px",
        },
        itemMeta: {
            fontSize: "calc(11.5px * var(--theme-font-scale, 1))",
            color: mediumText,
            marginBottom: "4px",
        },
        bullet: {
            marginRight: "6px",
            color: darkText,
        },
        bulletItem: {
            display: "flex",
            alignItems: "flex-start",
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            color: mediumText,
            marginBottom: "2px",
        },
        // Section wrapper spacing
        sectionWrap: {
            // marginBottom removed — spacing handled by CSS gap on the column container
            // so the paginator cursor is exact (no phantom trailing margin after last section)
        },
        // Skills bar
        skillsGrid: {
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "6px 20px",
        },
        skillName: {
            fontSize: "calc(11.5px * var(--theme-font-scale, 1))",
            color: darkText,
            marginBottom: "3px",
        },
        skillBarTrack: {
            display: "flex",
            gap: "3px",
        },
        // No-date content block (for summary, accomplishments, etc.)
        noDatRow: {
            paddingLeft: dateColW,
        },
    };

    // Build segmented skill bar
    const SkillBar = ({ level = 3, max = 5, segments = 10 }) => {
        // Convert level (1-5) to filled segments out of total
        const filled = Math.round((level / max) * segments);
        return (
            <div style={styles.skillBarTrack}>
                {[...Array(segments)].map((_, i) => (
                    <div key={i} style={{
                        flex: 1,
                        height: "5px",
                        borderRadius: "1px",
                        backgroundColor: i < filled ? accent : "rgba(30,159,212,0.18)",
                    }} />
                ))}
            </div>
        );
    };

    // --- SECTION HEADER ---
    const SectionHeader = ({ title }) => {
        const { isContinued } = useSectionContext();
        return (
            <div style={styles.sectionHeaderRow}>
                <span style={styles.sectionLabel}>{isContinued ? `${title} (cont.)` : title}</span>
                <div style={styles.sectionLine} />
            </div>
        );
    };

    // --- HEADER ---
    const Header = () => {
        const contactParts = [];
        if (personal?.city || personal?.state || personal?.country || personal?.zipCode) {
            contactParts.push([personal.city, personal.state, personal.country, personal.zipCode].filter(Boolean).join(", "));
        }
        if (personal?.phone) contactParts.push(personal.phone);
        if (personal?.email) contactParts.push(personal.email);
        if (personal?.linkedin) contactParts.push(personal.linkedin);
        if (personal?.github) contactParts.push(personal.github);
        if (personal?.website) contactParts.push(personal.website);
        if (data.websites) {
            data.websites.forEach((site) => {
                if (site.addToHeader && site.url) {
                    contactParts.push(site.label || site.url);
                }
            });
        }

        // Build contact lines — split into groups for multi-line display
        const line1Parts = contactParts.slice(0, 2);
        const line2Parts = contactParts.slice(2, 4);
        const line3Parts = contactParts.slice(4);

        return (
            <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Header">
                <div style={styles.headerWrap}>
                    {/* Photo */}
                    {personal?.photo && (
                        <div style={styles.photoWrap}>
                            <img src={personal.photo} alt="Profile" style={styles.photoImg} />
                        </div>
                    )}
                    {/* Name */}
                    <div style={styles.name}>
                        <SpellCheckText text={personal?.name || "YOUR NAME"} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'name', val)} />
                    </div>
                    {/* Profession */}
                    {personal?.profession && (
                        <div style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", color: lightText, marginBottom: "4px" }}>
                            <SpellCheckText text={personal.profession} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'profession', val)} />
                        </div>
                    )}
                    {/* Contact */}
                    <div style={styles.contactRow}>
                        {line1Parts.length > 0 && <div>{line1Parts.join(" - ")}</div>}
                        {line2Parts.length > 0 && <div>{line2Parts.join(" - ")}</div>}
                        {line3Parts.length > 0 && <div>{line3Parts.join(" - ")}</div>}
                    </div>
                </div>
            </SectionWrapper>
        );
    };

    // --- CUSTOM RENDERERS ---
    const customRenderers = {
        summary: ({ isContinued, subItemRanges }) => (
            <SectionWrapper sectionId="summary" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Resume Objective">
                <div style={styles.sectionWrap}>
                    <SectionHeader title="Resume Objective" />
                    <div style={styles.noDatRow}>
                        <div className="resume-rich-text" style={styles.richText}>
                            <SplittableRichText html={data.summary} range={subItemRanges?.summary} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('summary', 'summary', val)} />
                        </div>
                    </div>
                </div>
            </SectionWrapper>
        ),

        education: ({ itemIndices, subItemRanges }) => {
            const items = itemIndices ? itemIndices.map(idx => data.education?.[idx]).filter(Boolean) : (data.education || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="education" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Education">
                    <div style={styles.sectionWrap}>
                        <SectionHeader title="Education" />
                        {items.map((edu, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const dates = edu.year || edu.date || (edu.endYear ? `${edu.startYear ? edu.startYear + " - " : ""}${edu.endYear}` : edu.startYear || "");
                            const degreeStr = [edu.degree, edu.field].filter(Boolean).join(": ");
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.bodyRow}>
                                    <div style={styles.dateCol}>{dates}</div>
                                    <div style={styles.contentCol}>
                                        {degreeStr && (
                                            <div style={styles.itemTitle}>
                                                <RichTextSpellCheck html={degreeStr} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'degree')} />
                                            </div>
                                        )}
                                        <div style={styles.itemMeta}>
                                            <RichTextSpellCheck html={[edu.institution || edu.school || "", edu.city].filter(Boolean).join(" - ")} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'institution')} />
                                        </div>
                                        {edu.grade && (
                                            <div style={{ ...styles.richText, marginTop: "2px" }}>
                                                <span style={{ fontWeight: "700", marginRight: "4px" }}>GPA:</span>
                                                <SpellCheckText text={edu.grade} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'grade')} />
                                            </div>
                                        )}
                                        {edu.description && (
                                            <div className="resume-rich-text" style={{ ...styles.richText, marginTop: "4px" }}>
                                                <SplittableRichText html={edu.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'description')} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        skills: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(idx => data.skills?.[idx]).filter(Boolean) : (data.skills || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Skills">
                    <div style={styles.sectionWrap}>
                        <SectionHeader title="Skills" />
                        <div style={styles.noDatRow}>
                            <div style={styles.skillsGrid}>
                                {items.map((skill, i) => {
                                    const originalIndex = itemIndices ? itemIndices[i] : i;
                                    const name = typeof skill === 'object' ? skill.name : skill;
                                    const lvl = typeof skill === 'object' ? (skill.level ?? skill.rating) : null;
                                    return (
                                        <div key={originalIndex} data-item-index={originalIndex}>
                                            <div style={styles.skillName}>
                                                <RichTextSpellCheck html={name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('skills', originalIndex, val, 'name')} />
                                            </div>
                                            {lvl > 0 ? (
                                                <SkillBar level={lvl} />
                                            ) : (
                                                <SkillBar level={3} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        strengths: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(idx => data.strengths?.[idx]).filter(Boolean) : (data.strengths || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="strengths" navigationId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Key Strengths">
                    <div style={styles.sectionWrap}>
                        <SectionHeader title="Key Strengths" />
                        <div style={styles.noDatRow}>
                            <div style={styles.skillsGrid}>
                                {items.map((s, i) => {
                                    const originalIndex = itemIndices ? itemIndices[i] : i;
                                    const lvl = typeof s === 'object' ? (s.level ?? s.rating) : null;
                                    return (
                                        <div key={originalIndex} data-item-index={originalIndex}>
                                            <div style={styles.skillName}>
                                                <RichTextSpellCheck html={typeof s === 'object' ? s.name : s} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('strengths', originalIndex, val, 'name')} />
                                            </div>
                                            <SkillBar level={lvl || 3} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        additionalSkills: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(idx => data.additionalSkills?.[idx]).filter(Boolean) : (data.additionalSkills || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="additionalSkills" navigationId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Additional Skills">
                    <div style={styles.sectionWrap}>
                        <SectionHeader title="Additional Skills" />
                        <div style={styles.noDatRow}>
                            <div style={styles.skillsGrid}>
                                {items.map((s, i) => {
                                    const originalIndex = itemIndices ? itemIndices[i] : i;
                                    const lvl = typeof s === 'object' ? (s.level ?? s.rating) : null;
                                    return (
                                        <div key={originalIndex} data-item-index={originalIndex}>
                                            <div style={styles.skillName}>
                                                <RichTextSpellCheck html={typeof s === 'object' ? s.name : s} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('additionalSkills', originalIndex, val, 'name')} />
                                            </div>
                                            <SkillBar level={lvl || 3} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        experience: ({ itemIndices, subItemRanges }) => {
            const items = itemIndices ? itemIndices.map(idx => data.experience?.[idx]).filter(Boolean) : (data.experience || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="experience" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Work History">
                    <div style={styles.sectionWrap}>
                        <SectionHeader title="Work History" />
                        {items.map((exp, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const dates = exp.year || exp.date || (exp.startYear ? `${exp.startYear} to ${exp.isCurrent ? "Present" : (exp.endYear || "")}` : "");
                            const locationStr = [exp.location, exp.isRemote ? "(Remote)" : null].filter(Boolean).join(" ");
                            return (
                                <div key={i} data-item-index={originalIdx} style={{ ...styles.bodyRow, marginBottom: "calc(12px * var(--theme-paragraph-margin, 1))" }}>
                                    <div style={styles.dateCol}>{dates}</div>
                                    <div style={styles.contentCol}>
                                        {/* Job title */}
                                        <div style={styles.itemTitle}>
                                            <RichTextSpellCheck html={exp.title || exp.role || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'title')} />
                                        </div>
                                        {/* Company */}
                                        {exp.company && (
                                            <div style={styles.itemSubtitle}>
                                                <RichTextSpellCheck html={[exp.company, locationStr].filter(Boolean).join(" – ")} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'company')} />
                                            </div>
                                        )}
                                        {/* Description */}
                                        {exp.description && (
                                            <div className="resume-rich-text" style={{ ...styles.richText, marginTop: "4px" }}>
                                                <SplittableRichText html={exp.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'description')} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        keyAchievements: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(idx => data.keyAchievements?.[idx]).filter(Boolean) : (data.keyAchievements || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="keyAchievements" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Key Achievements">
                    <div style={styles.sectionWrap}>
                        <SectionHeader title="Key Achievements" />
                        <div style={styles.noDatRow}>
                            {items.map((item, i) => {
                                const originalIndex = itemIndices ? itemIndices[i] : i;
                                return (
                                    <div key={i} data-item-index={originalIndex} style={{ ...styles.bulletItem, marginBottom: "calc(4px * var(--theme-paragraph-margin, 1))" }}>
                                        <span style={styles.bullet}>•</span>
                                        <div>
                                            {item.name && <span style={{ fontWeight: "700" }}><RichTextSpellCheck html={item.name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('keyAchievements', originalIndex, val, 'name')} /></span>}
                                            {item.description && <span style={{ marginLeft: item.name ? " " : "" }}><RichTextSpellCheck html={item.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('keyAchievements', originalIndex, val, 'description')} /></span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        accomplishments: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(idx => data.accomplishments?.[idx]).filter(Boolean) : (data.accomplishments || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="accomplishments" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Accomplishments">
                    <div style={styles.sectionWrap}>
                        <SectionHeader title="Accomplishments" />
                        <div style={styles.noDatRow}>
                            {items.map((item, i) => {
                                const originalIndex = itemIndices ? itemIndices[i] : i;
                                return (
                                    <div key={i} data-item-index={originalIndex} style={{ ...styles.bulletItem, marginBottom: "calc(4px * var(--theme-paragraph-margin, 1))" }}>
                                        <span style={styles.bullet}>•</span>
                                        <div>
                                            {item.name && <span style={{ fontWeight: "700" }}><RichTextSpellCheck html={item.name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('accomplishments', originalIndex, val, 'name')} /></span>}
                                            {item.description && <span><RichTextSpellCheck html={item.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('accomplishments', originalIndex, val, 'description')} /></span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        projects: ({ itemIndices, subItemRanges }) => {
            const items = itemIndices ? itemIndices.map(idx => data.projects?.[idx]).filter(Boolean) : (data.projects || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="projects" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Projects">
                    <div style={styles.sectionWrap}>
                        <SectionHeader title="Projects" />
                        {items.map((proj, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const dates = proj.year || (proj.startYear && `${proj.startYear} - ${proj.isCurrent ? 'Present' : (proj.endYear || '')}`);
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.bodyRow}>
                                    <div style={styles.dateCol}>{dates}</div>
                                    <div style={styles.contentCol}>
                                        <div style={styles.itemTitle}><RichTextSpellCheck html={proj.title || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('projects', originalIdx, val, 'title')} /></div>
                                        {proj.link && <div style={{ fontSize: "calc(11px * var(--theme-font-scale, 1))", color: lightText, marginBottom: "2px" }}><ResumeLink href={proj.link}><RichTextSpellCheck html={proj.link} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('projects', originalIdx, val, 'link')} /></ResumeLink></div>}
                                        {proj.technologies?.length > 0 && <div style={{ ...styles.richText, marginBottom: "4px" }}><span style={{ fontWeight: "700", marginRight: "4px" }}>Technologies:</span>{proj.technologies.join(" · ")}</div>}
                                        {proj.description && <div className="resume-rich-text" style={{ ...styles.richText, marginTop: "2px" }}><SplittableRichText html={proj.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('projects', originalIdx, val, 'description')} /></div>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        certifications: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(idx => data.certifications?.[idx]).filter(Boolean) : (data.certifications || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="certifications" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Certifications">
                    <div style={styles.sectionWrap}>
                        <SectionHeader title="Certifications" />
                        {items.map((cert, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.bodyRow}>
                                    <div style={styles.dateCol}>{cert.date || cert.year || ""}</div>
                                    <div style={styles.contentCol}>
                                        <div style={styles.itemTitle}><RichTextSpellCheck html={cert.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('certifications', originalIdx, val, 'name')} /></div>
                                        {cert.issuer && <div style={styles.itemMeta}><RichTextSpellCheck html={cert.issuer} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('certifications', originalIdx, val, 'issuer')} /></div>}
                                        {cert.description && <div className="resume-rich-text" style={styles.richText}><RichTextSpellCheck html={cert.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('certifications', originalIdx, val, 'description')} /></div>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        languages: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(idx => data.languages?.[idx]).filter(Boolean) : (data.languages || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="languages" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Languages">
                    <div style={styles.sectionWrap}>
                        <SectionHeader title="Languages" />
                        <div style={styles.noDatRow}>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 24px" }}>
                                {items.map((lang, i) => {
                                    const originalIdx = itemIndices ? itemIndices[i] : i;
                                    return (
                                        <div key={i} data-item-index={originalIdx} style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))" }}>
                                            <span style={{ fontWeight: "700", marginRight: "4px" }}><RichTextSpellCheck html={lang.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('languages', originalIdx, val, 'name')} />:</span>
                                            <RichTextSpellCheck html={lang.level || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('languages', originalIdx, val, 'level')} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        software: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(idx => data.software?.[idx]).filter(Boolean) : (data.software || []);
            if (items.length === 0) return null;
            const ratingLabels = ['', 'Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert'];
            return (
                <SectionWrapper sectionId="software" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Software">
                    <div style={styles.sectionWrap}>
                        <SectionHeader title="Software Proficiency" />
                        <div style={styles.noDatRow}>
                            <div style={styles.skillsGrid}>
                                {items.map((item, i) => {
                                    const originalIndex = itemIndices ? itemIndices[i] : i;
                                    return (
                                        <div key={i} data-item-index={originalIndex}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                                <div style={styles.skillName}><RichTextSpellCheck html={item.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('software', originalIndex, val, 'name')} /></div>
                                                {item.rating > 0 && <span style={{ fontSize: "calc(10px * var(--theme-font-scale, 1))", color: lightText, fontStyle: "italic" }}>{ratingLabels[item.rating] || ""}</span>}
                                            </div>
                                            <SkillBar level={item.rating || 3} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        interests: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(idx => data.interests?.[idx]).filter(Boolean) : (data.interests || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="interests" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Interests">
                    <div style={styles.sectionWrap}>
                        <SectionHeader title="Interests" />
                        <div style={styles.noDatRow}>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px", fontSize: "calc(12px * var(--theme-font-scale, 1))" }}>
                                {items.map((item, i) => {
                                    const originalIndex = itemIndices ? itemIndices[i] : i;
                                    return (
                                        <div key={i} data-item-index={originalIndex} style={styles.bulletItem}>
                                            <span style={styles.bullet}>•</span>
                                            <RichTextSpellCheck html={typeof item === 'object' ? item.name : item} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('interests', originalIndex, val, 'name')} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        awards: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(idx => data.awards?.[idx]).filter(Boolean) : (data.awards || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="awards" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Awards">
                    <div style={styles.sectionWrap}>
                        <SectionHeader title="Honors & Awards" />
                        {items.map((award, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.bodyRow}>
                                    <div style={styles.dateCol}>{award.date || ""}</div>
                                    <div style={styles.contentCol}>
                                        <div style={styles.itemTitle}><RichTextSpellCheck html={award.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('awards', originalIdx, val, 'name')} /></div>
                                        {award.issuer && <div style={styles.itemMeta}><RichTextSpellCheck html={award.issuer} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('awards', originalIdx, val, 'issuer')} /></div>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        volunteering: ({ itemIndices, subItemRanges }) => {
            const items = itemIndices ? itemIndices.map(idx => data.volunteering?.[idx]).filter(Boolean) : (data.volunteering || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="volunteering" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Volunteering">
                    <div style={styles.sectionWrap}>
                        <SectionHeader title="Community & Volunteering" />
                        {items.map((vol, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const dates = vol.year || vol.date || (vol.startYear ? `${vol.startYear} - ${vol.isCurrent ? "Present" : (vol.endYear || "")}` : "");
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.bodyRow}>
                                    <div style={styles.dateCol}>{dates}</div>
                                    <div style={styles.contentCol}>
                                        <div style={styles.itemTitle}><RichTextSpellCheck html={vol.organization || vol.company || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('volunteering', originalIdx, val, 'organization')} /></div>
                                        {(vol.cause || vol.title) && <div style={styles.itemMeta}><RichTextSpellCheck html={vol.cause || vol.title || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('volunteering', originalIdx, val, 'title')} /></div>}
                                        {vol.description && <div className="resume-rich-text" style={{ ...styles.richText, marginTop: "2px" }}><SplittableRichText html={vol.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('volunteering', originalIdx, val, 'description')} /></div>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        publications: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(idx => data.publications?.[idx]).filter(Boolean) : (data.publications || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="publications" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Publications">
                    <div style={styles.sectionWrap}>
                        <SectionHeader title="Publications" />
                        {items.map((pub, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.bodyRow}>
                                    <div style={styles.dateCol}>{pub.date || ""}</div>
                                    <div style={styles.contentCol}>
                                        <div style={styles.itemTitle}><RichTextSpellCheck html={pub.title || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('publications', originalIdx, val, 'title')} /></div>
                                        {pub.publisher && <div style={styles.itemMeta}><RichTextSpellCheck html={pub.publisher} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('publications', originalIdx, val, 'publisher')} /></div>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        references: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(idx => data.references?.[idx]).filter(Boolean) : (data.references || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="references" onSectionClick={onSectionClick} isInteractive={isInteractive} label="References">
                    <div style={styles.sectionWrap}>
                        <SectionHeader title="References" />
                        <div style={styles.noDatRow}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                                {items.map((ref, i) => {
                                    const originalIdx = itemIndices ? itemIndices[i] : i;
                                    return (
                                        <div key={i} data-item-index={originalIdx} style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))" }}>
                                            <div style={{ fontWeight: "700", color: darkText }}><RichTextSpellCheck html={ref.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('references', originalIdx, val, 'name')} /></div>
                                            <div style={{ color: mediumText, fontStyle: "italic" }}><RichTextSpellCheck html={ref.title || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('references', originalIdx, val, 'title')} /></div>
                                            <div style={{ color: lightText }}><RichTextSpellCheck html={ref.contact || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('references', originalIdx, val, 'contact')} /></div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        affiliations: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(idx => data.affiliations?.[idx]).filter(Boolean) : (data.affiliations || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="affiliations" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Affiliations">
                    <div style={styles.sectionWrap}>
                        <SectionHeader title="Professional Affiliations" />
                        <div style={styles.noDatRow}>
                            {items.map((aff, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <div key={i} data-item-index={originalIdx} style={{ ...styles.bulletItem, marginBottom: "calc(4px * var(--theme-paragraph-margin, 1))" }}>
                                        <span style={styles.bullet}>•</span>
                                        <div>
                                            <div style={{ fontWeight: "700", color: darkText, fontSize: "calc(12px * var(--theme-font-scale, 1))" }}><RichTextSpellCheck html={aff.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('affiliations', originalIdx, val, 'name')} /></div>
                                            {aff.description && <div className="resume-rich-text" style={styles.richText}><RichTextSpellCheck html={aff.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('affiliations', originalIdx, val, 'description')} /></div>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        personalDetails: () => {
            const { personal: p = {} } = data;
            const details = [
                { label: "Date of Birth", value: p.dob || p.dateOfBirth || p.birthDate },
                { label: "Nationality", value: p.nationality },
                { label: "Marital Status", value: p.maritalStatus || p.marital_status },
                { label: "Gender", value: p.gender },
                { label: "Religion", value: p.religion },
                { label: "Visa Status", value: p.visaStatus || p.visa_status },
                { label: "Passport", value: p.passport || p.passportNumber },
                { label: "Place of Birth", value: p.placeOfBirth },
                { label: "Driving License", value: p.drivingLicense },
                { label: "Other", value: p.otherPersonal || p.otherInformation },
            ].filter((d) => d.value);

            if (details.length === 0) return null;

            return (
                <SectionWrapper sectionId="personalDetails" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Personal Details">
                    <div style={styles.sectionWrap}>
                        <SectionHeader title="Personal Information" />
                        <div style={styles.noDatRow}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 24px" }}>
                                {details.map((d, i) => (
                                    <div key={i} style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))" }}>
                                        <span style={{ fontWeight: "700", marginRight: "4px" }}>{d.label}:</span>
                                        <SpellCheckText
                                            text={d.value}
                                            isActive={isSpellCheckActive}
                                            onIgnore={onSpellCheckIgnore}
                                            onReplace={(val) => onSpellCheckReplace("personal", d.label.toLowerCase().replace(/ /g, ""), val)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        additionalInfo: ({ subItemRanges }) => {
            if (!data.additionalInfo) return null;
            return (
                <SectionWrapper sectionId="additionalInfo" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Additional Information">
                    <div style={styles.sectionWrap}>
                        <SectionHeader title="Additional Information" />
                        <div style={styles.noDatRow}>
                            <div className="resume-rich-text" style={styles.richText}>
                                <SplittableRichText html={data.additionalInfo} range={subItemRanges?.additionalInfo} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('additionalInfo', 'additionalInfo', val)} />
                            </div>
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        custom: ({ subItemRanges }) => {
            if (!data.customSection?.isVisible || !data.customSection?.content) return null;
            const title = data.customSection.title || "Additional Information";
            return (
                <SectionWrapper sectionId="custom" onSectionClick={onSectionClick} isInteractive={isInteractive} label={title}>
                    <div style={styles.sectionWrap}>
                        <SectionHeader title={title} />
                        <div style={styles.noDatRow}>
                            <div className="resume-rich-text" style={styles.richText}>
                                <SplittableRichText html={data.customSection.content} range={subItemRanges?.custom} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('customSection', 'content', val)} />
                            </div>
                        </div>
                    </div>
                </SectionWrapper>
            );
        },
    };

    // --- RENDER ZONE ---
    const renderZone = (id, items, columnStyle = {}) => (
        <DroppableZone id={id} style={{ flex: 1, ...columnStyle }}>
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

    const ZONE_STYLE = { display: "flex", flexDirection: "column", gap: "calc(14px * var(--theme-section-margin, 1))" };

    const Measurer = () => (
        <div className="resume-measurer" style={{ position: "absolute", top: -10000, left: -10000, width: "210mm", visibility: "hidden" }}>
            {/* MANDATORY — DO NOT REMOVE: gives useAutoPagination the real DPI-aware A4 pixel height */}
            <div className="page-height-marker" style={{ height: "297mm", width: "1px", position: "absolute", left: 0, top: 0 }} />
            <div style={{ ...styles.page, height: "auto", overflow: "visible" }}>
                <Header />
                <div data-column-id="main" style={{ display: "flex", flexDirection: "column", gap: "calc(14px * var(--theme-section-margin, 1))" }}>
                    {activeSections.map(sid => (
                        <SectionRenderer key={sid} sectionId={sid} data={data} customRenderers={customRenderers} zoneId="main" />
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div ref={containerRef} className="azure-skyline-root">
            <Measurer />
            <DndContext {...dndContextProps}>
                <SortableContext items={activeSections} strategy={verticalListSortingStrategy}>
                    {showPageBreaks && pages ? (
                        pages.map((page, i) => (
                            <div key={i} style={styles.page}>
                                {i === 0 && <Header />}
                                {renderZone(`main-p${i}`, page.main, ZONE_STYLE)}
                                <div style={{ position: "absolute", bottom: "15px", right: "40px", fontSize: "10px", opacity: 0.4, fontFamily: "sans-serif" }}>
                                    Page {i + 1}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ ...styles.page, height: "auto", minHeight: "100%" }}>
                            <Header />
                            {renderZone('main', activeSections, ZONE_STYLE)}
                        </div>
                    )}
                </SortableContext>
                <StableResumeDragOverlay activeId={activeId} scale={scale} renderSection={(id) => (
                    <div className="dragging-preview" style={{ background: "white", padding: "10px", border: "1px solid #e2e8f0" }}>
                        <SectionRenderer sectionId={id} data={data} customRenderers={customRenderers} />
                    </div>
                )} />
            </DndContext>
        </div>
    );
};

export default AzureSkyline;
