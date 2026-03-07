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
 * ClassicExecutive Template
 * A clean, minimal, black-and-white executive resume.
 * Large serif name, education tagline, keyword pipes, thin separators,
 * justified text, and simple underline section headers.
 */
const ClassicExecutive = ({
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

    const templateId = "classic-executive";
    const initialLayout = getSavedLayout(data, templateId, {
        main: ["summary", "experience", "education", "skills", "strengths", "additionalSkills", "keyAchievements", "accomplishments", "projects", "certifications", "languages", "software", "interests", "affiliations", "personalDetails", "additionalInfo", "custom"]
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

    // --- COLORS / THEMING ---
    const accentColor = "var(--theme-color, #333333)";
    const darkText = "#1a1a1a";
    const mediumText = "#333333";
    const lightText = "#555555";
    const lineColor = "#2a2a2a";

    const styles = {
        page: {
            width: "210mm", height: "297mm", background: "white",
            padding: "var(--theme-page-margin, 40px) var(--theme-page-margin, 40px) var(--theme-page-margin, 40px) var(--theme-page-margin, 40px)",
            boxSizing: "border-box", position: "relative",
            margin: "0 auto 30px auto", color: darkText,
            fontFamily: "var(--theme-font, 'Georgia', 'Times New Roman', serif)",
            letterSpacing: "var(--theme-letter-spacing, 0px)",
            overflow: "hidden", display: "flex", flexDirection: "column",
        },
        // --- HEADER ---
        name: {
            fontSize: "calc(32px * var(--theme-font-scale, 1))",
            fontWeight: "400", color: darkText, lineHeight: "1.15",
            marginBottom: "4px", letterSpacing: "0.5px",
        },
        educationLine: {
            marginBottom: "2px",
        },
        educationDegree: {
            fontSize: "calc(14px * var(--theme-font-scale, 1))",
            fontWeight: "700", color: darkText, lineHeight: "1.4",
        },
        educationInstitution: {
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            fontStyle: "italic", color: mediumText, lineHeight: "1.4",
        },
        tagline: {
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            color: lightText, lineHeight: "1.5",
            marginBottom: "8px",
        },
        thinLine: {
            width: "100%", height: "1px", background: lineColor,
            margin: "8px 0",
        },
        contactRow: {
            display: "flex", flexWrap: "wrap", alignItems: "center",
            gap: "0px",
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            color: accentColor, fontWeight: "600",
            marginBottom: "0px",
        },
        contactSep: {
            margin: "0 10px", color: lineColor, fontWeight: "700",
            fontSize: "calc(14px * var(--theme-font-scale, 1))",
        },
        headerWrap: {
            marginBottom: "calc(14px * var(--theme-section-margin, 1))",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
        },
        photo: {
            width: "100px",
            height: "100px",
            borderRadius: "4px",
            objectFit: "cover",
            marginBottom: "15px",
            border: `1px solid ${lineColor}`,
            padding: "2px",
        },
        // --- SECTION HEADING ---
        sectionHeading: {
            fontSize: "calc(18px * var(--theme-font-scale, 1))",
            fontWeight: "400", color: darkText,
            paddingBottom: "4px",
            borderBottom: `1.5px solid ${lineColor}`,
            marginBottom: "calc(12px * var(--theme-paragraph-margin, 1))",
            lineHeight: "1.3",
        },
        // --- CONTENT ---
        contentWrapper: {
            // marginBottom removed — spacing handled by column gap
        },
        itemSpacing: {
            marginBottom: "calc(14px * var(--theme-paragraph-margin, 1))",
        },
        richText: {
            fontSize: "calc(12.5px * var(--theme-font-scale, 1))",
            lineHeight: "var(--theme-line-height, 1.5)", color: mediumText,
            textAlign: "justify",
        },
        infoLabel: { fontWeight: "700", color: darkText, marginRight: "6px" },
        // --- EXPERIENCE ---
        jobHeader: {
            marginBottom: "calc(4px * var(--theme-paragraph-margin, 1))",
        },
        jobTitleLine: {
            display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "8px",
            marginBottom: "2px",
        },
        jobTitle: {
            fontSize: "calc(13.5px * var(--theme-font-scale, 1))",
            fontWeight: "700", color: darkText,
        },
        jobCompany: {
            fontSize: "calc(13.5px * var(--theme-font-scale, 1))",
            fontWeight: "700", color: darkText,
        },
        jobMeta: {
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            color: lightText, fontStyle: "italic",
        },
        jobDates: {
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            fontWeight: "700", fontStyle: "italic", color: darkText,
            marginBottom: "calc(4px * var(--theme-paragraph-margin, 1))",
        },
        // --- EDUCATION ---
        eduRow: {
            marginBottom: "calc(10px * var(--theme-paragraph-margin, 1))",
        },
        eduDegree: {
            fontSize: "calc(13px * var(--theme-font-scale, 1))",
            fontWeight: "700", color: darkText,
        },
        eduSchool: {
            fontSize: "calc(12.5px * var(--theme-font-scale, 1))",
            color: mediumText, fontStyle: "italic",
        },
        eduDates: {
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            color: lightText,
        },
        // --- HISTORY ROW ---
        historyRow: {
            display: "grid", gridTemplateColumns: "1.4fr 1fr 0.6fr",
            alignItems: "baseline", gap: "12px",
            marginBottom: "calc(4px * var(--theme-paragraph-margin, 1))",
        },
        // --- SEPARATOR ---
        sectionSep: {
            width: "100%", height: "1px", background: lineColor,
            marginTop: "calc(4px * var(--theme-section-margin, 1))",
        },
        bullet: { marginRight: "8px", color: darkText },
    };

    // --- HEADER ---
    const Header = () => {
        // Pick the first education for the header tagline (degree + institution)
        const firstEdu = data.education?.[0];
        // Build keywords/tagline from strengths or skills
        const keywords = (data.strengths || []).map(s => typeof s === 'object' ? s.name : s).filter(Boolean);
        // Contact parts
        const contactParts = [];
        if (personal?.city || personal?.state || personal?.country || personal?.zipCode) {
            contactParts.push({ value: [personal.city, personal.state, personal.country, personal.zipCode].filter(Boolean).join(", "), isLink: false });
        }
        if (personal?.phone) contactParts.push({ value: personal.phone, isLink: true });
        if (personal?.email) contactParts.push({ value: personal.email, isLink: true });
        if (personal?.linkedin) contactParts.push({ value: personal.linkedin, isLink: true, field: 'linkedin' });
        if (personal?.github) contactParts.push({ value: personal.github, isLink: true, field: 'github' });
        if (personal?.website) contactParts.push({ value: personal.website, isLink: true, field: 'website' });

        (data.websites || []).forEach((site, idx) => {
            if (site.addToHeader && site.url) {
                contactParts.push({ value: site.url, isLink: true, type: 'websites', idx });
            }
        });

        return (
            <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Header">
                <div style={styles.headerWrap}>
                    {personal?.photo && <img src={personal.photo} alt="Profile" style={styles.photo} />}
                    {/* NAME */}
                    <h1 style={styles.name}>
                        <SpellCheckText text={personal?.name || "YOUR NAME"} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'name', val)} />
                    </h1>

                    {/* EDUCATION TAGLINE (degree + institution under name) */}
                    {firstEdu && (
                        <div style={styles.educationLine}>
                            {(firstEdu.degree || firstEdu.field) && (
                                <span style={styles.educationDegree}>
                                    {[firstEdu.degree, firstEdu.field].filter(Boolean).join(": ")}
                                </span>
                            )}
                            {(firstEdu.institution || firstEdu.school) && (
                                <>
                                    <br />
                                    <span style={styles.educationInstitution}>
                                        {[firstEdu.institution || firstEdu.school, firstEdu.city].filter(Boolean).join(" - ")}
                                    </span>
                                </>
                            )}
                        </div>
                    )}

                    {/* PROFESSION / KEYWORDS */}
                    {(personal?.profession || keywords.length > 0) && (
                        <div style={styles.tagline}>
                            {personal?.profession && (
                                <SpellCheckText text={personal.profession} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'profession', val)} />
                            )}
                            {keywords.length > 0 && (
                                <div>{keywords.join("  |  ")}</div>
                            )}
                        </div>
                    )}

                    {/* SEPARATOR LINE */}
                    <div style={styles.thinLine} />

                    {/* CONTACT ROW */}
                    {contactParts.length > 0 && (
                        <div style={styles.contactRow}>
                            {contactParts.map((part, i) => (
                                <React.Fragment key={i}>
                                    {part.isLink ? (
                                        <ResumeLink href={part.value}>
                                            <SpellCheckText
                                                text={part.value}
                                                isActive={isSpellCheckActive}
                                                onIgnore={onSpellCheckIgnore}
                                                onReplace={(val) => onSpellCheckReplace(part.type || 'personal', part.type === 'websites' ? part.idx : (part.field || 'city'), val, part.type === 'websites' ? 'url' : null)}
                                            />
                                        </ResumeLink>
                                    ) : (
                                        <SpellCheckText
                                            text={part.value}
                                            isActive={isSpellCheckActive}
                                            onIgnore={onSpellCheckIgnore}
                                            onReplace={(val) => onSpellCheckReplace('personal', part.field || 'city', val)}
                                        />
                                    )}
                                    {i < contactParts.length - 1 && <span style={styles.contactSep}>│</span>}
                                </React.Fragment>
                            ))}
                        </div>
                    )}

                    {/* BOTTOM SEPARATOR */}
                    <div style={styles.thinLine} />
                </div>
            </SectionWrapper>
        );
    };

    // --- SECTION HEADER ---
    const SectionHeader = ({ title }) => {
        const { isContinued } = useSectionContext();
        return (
            <div style={styles.sectionHeading}>
                {isContinued ? `${title} (cont.)` : title}
            </div>
        );
    };

    // --- CUSTOM RENDERERS ---
    const customRenderers = {
        summary: ({ isContinued, subItemRanges }) => (
            <SectionWrapper sectionId="summary" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Professional Summary">
                <div style={styles.contentWrapper}>
                    <SectionHeader title="Professional Summary" />
                    <div className="resume-rich-text" style={styles.richText}>
                        <SplittableRichText html={data.summary} range={subItemRanges?.summary} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('summary', 'summary', val)} />
                    </div>
                </div>
            </SectionWrapper>
        ),
        experience: ({ itemIndices, subItemRanges }) => {
            const items = itemIndices ? itemIndices.map(idx => data.experience?.[idx]).filter(Boolean) : (data.experience || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="experience" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Work History">
                    <div style={styles.contentWrapper}>
                        <SectionHeader title="Work History" />
                        {items.map((exp, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const dates = exp.year || exp.date || (exp.startYear ? `${exp.startYear} - ${exp.isCurrent ? "Present" : (exp.endYear || "")}` : "");
                            const locationStr = [exp.location, exp.isRemote ? "(Remote)" : null].filter(Boolean).join(" ");
                            // Build title line: "Title – Company | Location  (Reporting to ...)"
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.itemSpacing}>
                                    <div style={styles.jobHeader}>
                                        <div style={styles.jobTitleLine}>
                                            <span style={styles.jobTitle}>
                                                <RichTextSpellCheck html={exp.title || exp.role || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'title')} />
                                            </span>
                                            {exp.company && (
                                                <>
                                                    <span style={{ color: lightText }}>–</span>
                                                    <span style={styles.jobCompany}>
                                                        <RichTextSpellCheck html={exp.company} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'company')} />
                                                    </span>
                                                </>
                                            )}
                                            {locationStr && (
                                                <span style={styles.jobMeta}>
                                                    {locationStr}
                                                </span>
                                            )}
                                        </div>
                                        {dates && (
                                            <div style={styles.jobDates}>
                                                <RichTextSpellCheck html={dates} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'year')} />
                                            </div>
                                        )}
                                    </div>
                                    {exp.description && (
                                        <div className="resume-rich-text" style={styles.richText}>
                                            <SplittableRichText html={exp.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'description')} />
                                        </div>
                                    )}
                                    {/* separator line between entries */}
                                    {i < items.length - 1 && <div style={{ ...styles.thinLine, marginTop: "calc(10px * var(--theme-paragraph-margin, 1))" }} />}
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },
        education: ({ itemIndices, subItemRanges }) => {
            const items = itemIndices ? itemIndices.map(idx => data.education?.[idx]).filter(Boolean) : (data.education || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="education" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Education">
                    <div style={styles.contentWrapper}>
                        <SectionHeader title="Education" />
                        {items.map((edu, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const dates = edu.year || edu.date || (edu.endYear ? `${edu.startYear ? edu.startYear + " - " : ""}${edu.endYear}` : "");
                            const degreeStr = [edu.degree, edu.field].filter(Boolean).join(" — ");
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.eduRow}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "8px" }}>
                                        <div>
                                            {degreeStr && <div style={styles.eduDegree}><RichTextSpellCheck html={degreeStr} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'degree')} /></div>}
                                            <div style={styles.eduSchool}>
                                                <RichTextSpellCheck html={[edu.institution || edu.school || "", edu.city].filter(Boolean).join(", ")} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'institution')} />
                                            </div>
                                        </div>
                                        {dates && <div style={styles.eduDates}>{dates}</div>}
                                    </div>
                                    {edu.grade && (
                                        <div style={{ ...styles.richText, marginTop: "2px" }}>
                                            <span style={styles.infoLabel}>GPA / Grade:</span>
                                            <SpellCheckText text={edu.grade} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'grade')} />
                                        </div>
                                    )}
                                    {edu.description && (
                                        <div className="resume-rich-text" style={{ ...styles.richText, marginTop: "4px" }}>
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
        skills: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(idx => data.skills?.[idx]).filter(Boolean) : (data.skills || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Key Skills">
                    <div style={styles.contentWrapper}>
                        <SectionHeader title="Key Skills" />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 30px" }}>
                            {items.map((skill, i) => {
                                const originalIndex = itemIndices ? itemIndices[i] : i;
                                const name = typeof skill === 'object' ? skill.name : skill;
                                const lvl = typeof skill === 'object' ? (skill.level ?? skill.rating) : null;
                                return (
                                    <div key={originalIndex} data-item-index={originalIndex} style={{ display: "flex", alignItems: "flex-start", fontSize: "calc(12.5px * var(--theme-font-scale, 1))", marginBottom: "calc(3px * var(--theme-paragraph-margin, 1))" }}>
                                        <span style={styles.bullet}>•</span>
                                        <RichTextSpellCheck html={name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('skills', originalIndex, val, 'name')} />
                                        {lvl > 0 && <span style={{ display: "flex", gap: "3px", marginLeft: "auto", paddingLeft: "8px" }}>{[...Array(5)].map((_, di) => <div key={di} style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: di < lvl ? "var(--theme-color, #1a365d)" : "rgba(120,120,120,0.15)" }} />)}</span>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },
        strengths: ({ itemIndices }) => {
            const strengths = itemIndices ? itemIndices.map(idx => data.strengths?.[idx]).filter(Boolean) : (data.strengths || []);
            if (strengths.length === 0) return null;
            return (
                <SectionWrapper sectionId="strengths" navigationId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Key Strengths">
                    <div style={styles.contentWrapper}>
                        <SectionHeader title="Key Strengths" />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 30px" }}>
                            {strengths.map((s, i) => {
                                const originalIndex = itemIndices ? itemIndices[i] : i;
                                const lvl = typeof s === 'object' ? (s.level ?? s.rating) : null;
                                return (
                                    <div key={originalIndex} data-item-index={originalIndex} style={{ display: "flex", alignItems: "flex-start", fontSize: "calc(12.5px * var(--theme-font-scale, 1))" }}>
                                        <span style={styles.bullet}>•</span>
                                        <RichTextSpellCheck html={typeof s === 'object' ? s.name : s} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('strengths', originalIndex, val, 'name')} />
                                        {lvl > 0 && <span style={{ display: "flex", gap: "3px", marginLeft: "auto", paddingLeft: "8px" }}>{[...Array(5)].map((_, di) => <div key={di} style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: di < lvl ? "var(--theme-color, #1a365d)" : "rgba(120,120,120,0.15)" }} />)}</span>}
                                    </div>
                                );
                            })}
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
                    <div style={styles.contentWrapper}>
                        <SectionHeader title="Additional Skills" />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 30px" }}>
                            {items.map((s, i) => {
                                const originalIndex = itemIndices ? itemIndices[i] : i;
                                const lvl = typeof s === 'object' ? (s.level ?? s.rating) : null;
                                return (
                                    <div key={originalIndex} data-item-index={originalIndex} style={{ display: "flex", alignItems: "flex-start", fontSize: "calc(12.5px * var(--theme-font-scale, 1))" }}>
                                        <span style={styles.bullet}>•</span>
                                        <RichTextSpellCheck html={typeof s === 'object' ? s.name : s} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('additionalSkills', originalIndex, val, 'name')} />
                                        {lvl > 0 && <span style={{ display: "flex", gap: "3px", marginLeft: "auto", paddingLeft: "8px" }}>{[...Array(5)].map((_, di) => <div key={di} style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: di < lvl ? "var(--theme-color, #1a365d)" : "rgba(120,120,120,0.15)" }} />)}</span>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },
        keyAchievements: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(idx => data.keyAchievements?.[idx]).filter(Boolean) : (data.keyAchievements || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="keyAchievements" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Key Achievements">
                    <div style={styles.contentWrapper}>
                        <SectionHeader title="Key Achievements" />
                        {items.map((item, i) => {
                            const originalIndex = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={originalIndex} style={{ ...styles.itemSpacing, display: "flex", alignItems: "flex-start" }}>
                                    <span style={styles.bullet}>•</span>
                                    <div>
                                        {item.name && <div style={{ fontWeight: "700", color: darkText, marginBottom: "2px", fontSize: "calc(12.5px * var(--theme-font-scale, 1))" }}><RichTextSpellCheck html={item.name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('keyAchievements', originalIndex, val, 'name')} /></div>}
                                        {item.description && <div className="resume-rich-text" style={styles.richText}><RichTextSpellCheck html={item.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('keyAchievements', originalIndex, val, 'description')} /></div>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },
        accomplishments: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(idx => data.accomplishments?.[idx]).filter(Boolean) : (data.accomplishments || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="accomplishments" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Accomplishments">
                    <div style={styles.contentWrapper}>
                        <SectionHeader title="Accomplishments" />
                        {items.map((item, i) => {
                            const originalIndex = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={originalIndex} style={{ ...styles.itemSpacing, display: "flex", alignItems: "flex-start" }}>
                                    <span style={styles.bullet}>•</span>
                                    <div>
                                        {item.name && <div style={{ fontWeight: "700", color: darkText, marginBottom: "2px", fontSize: "calc(12.5px * var(--theme-font-scale, 1))" }}><RichTextSpellCheck html={item.name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('accomplishments', originalIndex, val, 'name')} /></div>}
                                        {item.description && <div className="resume-rich-text" style={styles.richText}><RichTextSpellCheck html={item.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('accomplishments', originalIndex, val, 'description')} /></div>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },
        projects: ({ itemIndices, subItemRanges }) => {
            const items = itemIndices ? itemIndices.map(idx => data.projects?.[idx]).filter(Boolean) : (data.projects || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="projects" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Projects">
                    <div style={styles.contentWrapper}>
                        <SectionHeader title="Projects" />
                        {items.map((proj, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const dates = proj.year || (proj.startYear && `${proj.startYear} - ${proj.isCurrent ? 'Present' : (proj.endYear || '')}`);
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.itemSpacing}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "8px" }}>
                                        <div style={{ fontWeight: "700", fontSize: "calc(13px * var(--theme-font-scale, 1))", color: darkText }}>
                                            <RichTextSpellCheck html={proj.title || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('projects', originalIdx, val, 'title')} />
                                        </div>
                                        {dates && <div style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", color: lightText }}>{dates}</div>}
                                    </div>
                                    {proj.link && (
                                        <div style={{ fontSize: "calc(11px * var(--theme-font-scale, 1))", color: lightText, marginBottom: "2px" }}>
                                            <ResumeLink href={proj.link}>
                                                <RichTextSpellCheck html={proj.link} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('projects', originalIdx, val, 'link')} />
                                            </ResumeLink>
                                        </div>
                                    )}
                                    {proj.technologies && proj.technologies.length > 0 && <div style={{ ...styles.richText, marginBottom: "4px" }}><span style={styles.infoLabel}>Technologies:</span>{proj.technologies.join(" · ")}</div>}
                                    {proj.description && <div className="resume-rich-text" style={styles.richText}><SplittableRichText html={proj.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('projects', originalIdx, val, 'description')} /></div>}
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
                    <div style={styles.contentWrapper}>
                        <SectionHeader title="Certifications" />
                        {items.map((cert, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.itemSpacing}>
                                    <div style={styles.historyRow}>
                                        <div style={{ fontWeight: "700", fontSize: "calc(12.5px * var(--theme-font-scale, 1))" }}>
                                            <span style={styles.bullet}>•</span>
                                            <RichTextSpellCheck html={cert.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('certifications', originalIdx, val, 'name')} />
                                        </div>
                                        <div style={{ textAlign: "center", fontSize: "calc(12px * var(--theme-font-scale, 1))", color: mediumText }}>
                                            <RichTextSpellCheck html={cert.issuer || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('certifications', originalIdx, val, 'issuer')} />
                                        </div>
                                        <div style={{ textAlign: "right", fontSize: "calc(12px * var(--theme-font-scale, 1))", color: lightText }}>
                                            <RichTextSpellCheck html={cert.date || cert.year || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('certifications', originalIdx, val, 'date')} />
                                        </div>
                                    </div>
                                    {cert.description && <div className="resume-rich-text" style={{ ...styles.richText, marginLeft: "18px" }}><RichTextSpellCheck html={cert.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('certifications', originalIdx, val, 'description')} /></div>}
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
                    <div style={styles.contentWrapper}>
                        <SectionHeader title="Languages" />
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
                            {items.map((lang, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <div key={i} data-item-index={originalIdx} style={{ fontSize: "calc(12.5px * var(--theme-font-scale, 1))" }}>
                                        <span style={styles.infoLabel}>
                                            <RichTextSpellCheck html={lang.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('languages', originalIdx, val, 'name')} />:
                                        </span>
                                        <RichTextSpellCheck html={lang.level || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('languages', originalIdx, val, 'level')} />
                                    </div>
                                );
                            })}
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
                    <div style={styles.contentWrapper}>
                        <SectionHeader title="Software Proficiency" />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 30px" }}>
                            {items.map((item, i) => {
                                const originalIndex = itemIndices ? itemIndices[i] : i;
                                return (
                                    <div key={i} data-item-index={originalIndex} style={{ fontSize: "calc(12.5px * var(--theme-font-scale, 1))" }}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                            <div style={{ display: "flex", alignItems: "center" }}>
                                                <span style={styles.bullet}>•</span>
                                                <RichTextSpellCheck html={item.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('software', originalIndex, val, 'name')} />
                                            </div>
                                            {item.rating > 0 && <span style={{ color: lightText, fontSize: "calc(11px * var(--theme-font-scale, 1))", fontStyle: "italic" }}>{ratingLabels[item.rating] || ""}</span>}
                                        </div>
                                        {item.description && <div className="resume-rich-text" style={{ ...styles.richText, marginLeft: "18px", fontSize: "calc(11.5px * var(--theme-font-scale, 1))" }}><RichTextSpellCheck html={item.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('software', originalIndex, val, 'description')} /></div>}
                                    </div>
                                );
                            })}
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
                    <div style={styles.contentWrapper}>
                        <SectionHeader title="Interests" />
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", fontSize: "calc(12.5px * var(--theme-font-scale, 1))" }}>
                            {items.map((item, i) => {
                                const originalIndex = itemIndices ? itemIndices[i] : i;
                                return (
                                    <div key={i} data-item-index={originalIndex} style={{ display: "flex", alignItems: "center" }}>
                                        <span style={styles.bullet}>•</span>
                                        <RichTextSpellCheck html={typeof item === 'object' ? item.name : item} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('interests', originalIndex, val, 'name')} />
                                    </div>
                                );
                            })}
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
                    <div style={styles.contentWrapper}>
                        <SectionHeader title="Honors & Awards" />
                        {items.map((award, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.itemSpacing}>
                                    <div style={styles.historyRow}>
                                        <div style={{ fontWeight: "700", fontSize: "calc(12.5px * var(--theme-font-scale, 1))" }}>
                                            <span style={styles.bullet}>•</span>
                                            <RichTextSpellCheck html={award.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('awards', originalIdx, val, 'name')} />
                                        </div>
                                        <div style={{ textAlign: "center", fontSize: "calc(12px * var(--theme-font-scale, 1))", color: mediumText }}>
                                            <RichTextSpellCheck html={award.issuer || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('awards', originalIdx, val, 'issuer')} />
                                        </div>
                                        <div style={{ textAlign: "right", fontSize: "calc(12px * var(--theme-font-scale, 1))", color: lightText }}>
                                            <RichTextSpellCheck html={award.date || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('awards', originalIdx, val, 'date')} />
                                        </div>
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
                    <div style={styles.contentWrapper}>
                        <SectionHeader title="Community & Volunteering" />
                        {items.map((vol, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const dates = vol.year || vol.date || (vol.startYear ? `${vol.startYear} - ${vol.isCurrent ? "Present" : (vol.endYear || "")}` : "");
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.itemSpacing}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
                                        <div>
                                            <span style={{ fontWeight: "700", fontSize: "calc(13px * var(--theme-font-scale, 1))", marginRight: "8px" }}>
                                                <RichTextSpellCheck html={vol.organization || vol.company || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('volunteering', originalIdx, val, 'organization')} />
                                            </span>
                                            <span style={{ fontSize: "calc(12.5px * var(--theme-font-scale, 1))", color: mediumText }}>
                                                <RichTextSpellCheck html={vol.cause || vol.title || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('volunteering', originalIdx, val, 'title')} />
                                            </span>
                                        </div>
                                        {dates && <div style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", color: lightText, fontStyle: "italic" }}>{dates}</div>}
                                    </div>
                                    {vol.description && <div className="resume-rich-text" style={{ ...styles.richText, marginTop: "4px" }}><SplittableRichText html={vol.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('volunteering', originalIdx, val, 'description')} /></div>}
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
                    <div style={styles.contentWrapper}>
                        <SectionHeader title="Publications" />
                        {items.map((pub, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.itemSpacing}>
                                    <div style={styles.historyRow}>
                                        <div style={{ fontWeight: "700", fontSize: "calc(12.5px * var(--theme-font-scale, 1))" }}>
                                            <span style={styles.bullet}>•</span>
                                            <RichTextSpellCheck html={pub.title || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('publications', originalIdx, val, 'title')} />
                                        </div>
                                        <div style={{ textAlign: "center", fontSize: "calc(12px * var(--theme-font-scale, 1))", color: mediumText }}>
                                            <RichTextSpellCheck html={pub.publisher || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('publications', originalIdx, val, 'publisher')} />
                                        </div>
                                        <div style={{ textAlign: "right", fontSize: "calc(12px * var(--theme-font-scale, 1))", color: lightText }}>
                                            <RichTextSpellCheck html={pub.date || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('publications', originalIdx, val, 'date')} />
                                        </div>
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
                    <div style={styles.contentWrapper}>
                        <SectionHeader title="References" />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                            {items.map((ref, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <div key={i} data-item-index={originalIdx} style={{ fontSize: "calc(12.5px * var(--theme-font-scale, 1))" }}>
                                        <div style={{ fontWeight: "700", color: darkText }}><RichTextSpellCheck html={ref.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('references', originalIdx, val, 'name')} /></div>
                                        <div style={{ color: mediumText, fontStyle: "italic" }}><RichTextSpellCheck html={ref.title || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('references', originalIdx, val, 'title')} /></div>
                                        <div style={{ color: lightText }}><RichTextSpellCheck html={ref.contact || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('references', originalIdx, val, 'contact')} /></div>
                                    </div>
                                );
                            })}
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
                    <div style={styles.contentWrapper}>
                        <SectionHeader title="Professional Affiliations" />
                        {items.map((aff, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.itemSpacing}>
                                    <div style={{ display: "flex", alignItems: "flex-start" }}>
                                        <span style={styles.bullet}>•</span>
                                        <div>
                                            <div style={{ fontWeight: "700", color: darkText, fontSize: "calc(12.5px * var(--theme-font-scale, 1))" }}><RichTextSpellCheck html={aff.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('affiliations', originalIdx, val, 'name')} /></div>
                                            {aff.description && <div className="resume-rich-text" style={styles.richText}><RichTextSpellCheck html={aff.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('affiliations', originalIdx, val, 'description')} /></div>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },
        personalDetails: () => {
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
                { label: 'City', value: p.city },
                { label: 'State', value: p.state },
                { label: 'Country', value: p.country },
                { label: 'Zip Code', value: p.zipCode },
                { label: 'Other', value: p.otherPersonal || p.otherInformation }
            ].filter(d => d.value);
            if (!details.length) return null;
            return (
                <SectionWrapper sectionId="personalDetails" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Personal Details">
                    <div style={styles.contentWrapper}>
                        <SectionHeader title="Personal Information" />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 30px" }}>
                            {details.map((d, i) => (
                                <div key={i} style={{ fontSize: "calc(12.5px * var(--theme-font-scale, 1))" }}>
                                    <span style={styles.infoLabel}>{d.label}:</span>
                                    <SpellCheckText text={d.value} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', d.label.toLowerCase().replace(/ /g, ''), val)} />
                                </div>
                            ))}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },
        additionalInfo: ({ subItemRanges }) => {
            if (!data.additionalInfo) return null;
            return (
                <SectionWrapper sectionId="additionalInfo" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Additional Information">
                    <div style={styles.contentWrapper}>
                        <SectionHeader title="Additional Information" />
                        <div className="resume-rich-text" style={styles.richText}><SplittableRichText html={data.additionalInfo} range={subItemRanges?.additionalInfo} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('additionalInfo', 'additionalInfo', val)} /></div>
                    </div>
                </SectionWrapper>
            );
        },
        custom: ({ subItemRanges }) => {
            if (!data.customSection?.isVisible || !data.customSection?.content) return null;
            const title = data.customSection.title || "Additional Information";
            return (
                <SectionWrapper sectionId="custom" onSectionClick={onSectionClick} isInteractive={isInteractive} label={title}>
                    <div style={styles.contentWrapper}>
                        <SectionHeader title={title} />
                        <div className="resume-rich-text" style={styles.richText}><SplittableRichText html={data.customSection.content} range={subItemRanges?.custom} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('customSection', 'content', val)} /></div>
                    </div>
                </SectionWrapper>
            );
        }
    };

    // --- RENDER ZONE ---
    const renderZone = (id, items, columnStyle = {}) => (
        <DroppableZone id={id} style={{ flex: 1, display: "flex", flexDirection: "column", gap: "calc(20px * var(--theme-section-margin, 1))", minHeight: '100px', ...columnStyle }}>
            {items.map((sid, idx) => {
                const isContinued = typeof sid === 'object' && sid.isContinued;
                const sectionId = typeof sid === 'string' ? sid : sid.id;
                const dragId = isContinued ? `${id}-cont-${sectionId}-${idx}` : sectionId;
                return (
                    <DraggableSection key={dragId} id={dragId} isEnabled={canReorder && !isContinued}>
                        <SectionRenderer sectionId={sectionId} data={data} onSectionClick={onSectionClick} isContinued={isContinued} itemIndices={typeof sid === 'object' ? sid.itemIndices : undefined} subItemRanges={typeof sid === 'object' ? sid.subItemRanges : undefined} customRenderers={customRenderers} zoneId={id} />
                    </DraggableSection>
                );
            })}
        </DroppableZone>
    );

    const Measurer = () => (
        <div className="resume-measurer" style={{ position: "absolute", top: -10000, left: -10000, width: "210mm", visibility: "hidden" }}>
            <div className="page-height-marker" style={{ height: "297mm", width: "1px", position: "absolute", left: 0, top: 0 }} />
            <div style={{ ...styles.page, height: "auto" }}>
                <Header />
                <div data-column-id="main" style={{ display: "flex", flexDirection: "column", gap: "calc(20px * var(--theme-section-margin, 1))" }}>
                    {activeSections.map(sid => (
                        <SectionRenderer key={sid} sectionId={sid} data={data} customRenderers={customRenderers} zoneId="main" />
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div ref={containerRef} className="classic-executive-root">
            <Measurer />
            <DndContext {...dndContextProps}>
                <SortableContext items={activeSections} strategy={verticalListSortingStrategy}>
                    {showPageBreaks && pages ? (
                        pages.map((page, i) => (
                            <div key={i} style={styles.page}>
                                {i === 0 && <Header />}
                                {renderZone(`main-p${i}`, page.main, { flex: 1 })}
                                <div style={{ position: "absolute", bottom: "15px", right: "40px", fontSize: "10px", opacity: 0.4, fontFamily: "sans-serif" }}>Page {i + 1}</div>
                            </div>
                        ))
                    ) : (
                        <div style={{ ...styles.page, height: "auto", minHeight: "100%" }}>
                            <Header />
                            {renderZone('main', activeSections, { flex: 1 })}
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

export default ClassicExecutive;
