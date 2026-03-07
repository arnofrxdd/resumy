
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
 * ExecutiveTeal Template
 * A premium executive resume with a distinct teal color scheme, 
 * sidebar for skills/education, and a visual career timeline.
 */

const Icons = {
    User: () => "👤",
    Briefcase: () => "💼",
    GraduationCap: () => "🎓",
    Rocket: () => "🚀",
    Target: () => "🎯",
    Diamond: () => "💎",
    LinkedIn: ({ size = 16 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#0077b5">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
    ),
    Phone: () => "📞",
    Email: () => "📧",
    Location: () => "📍",
    Website: () => "🌐",
    Tools: () => "🛠️",
    Building: () => "🏢",
    Globe: () => "🌍",
    BookOpen: () => "📚",
    Medal: () => "🏅",
    Star: () => "🌟",
    Link: () => "🔗",
    Award: () => "🏆",
    Sparkles: () => "✨",
    HandShake: () => "🤝",
    Palette: () => "🎨",
    FileText: () => "📝",
    TrendingUp: () => "📈"
};
const ExecutiveTeal = ({
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

    const templateId = 'executive-teal';
    const initialLayout = getSavedLayout(data, templateId, {
        left: [
            'education', 'skills', 'strengths', 'additionalSkills', 'certifications', 'affiliations', 'languages', 'software', 'volunteering', 'interests'
        ],
        right: [
            'summary', 'keyAchievements', 'careerTimeline', 'experience', 'projects', 'accomplishments', 'awards', 'publications', 'references', 'additionalInfo', 'custom'
        ]
    });

    const completeLayout = getCompleteLayout(data, initialLayout, 'left', 'right');
    // Filter out personalDetails as it resides in the footer
    const leftSections = completeLayout.left.filter(s => (typeof s === 'string' ? s : s.id) !== 'personalDetails');
    const rightSections = completeLayout.right.filter(s => (typeof s === 'string' ? s : s.id) !== 'personalDetails');

    const { dndContextProps, activeId } = useResumeDragAndDrop({
        data, onReorder, scale,
        containers: { left: leftSections, right: rightSections }
    });

    const pages = useAutoPagination({
        columns: { left: leftSections, right: rightSections },
        data, enabled: showPageBreaks, containerRef, scale
    });

    // --- COLORS ---
    const themeColor = "var(--theme-color, #17a2b8)"; // Teal
    const darkBg = "#2c3e50"; // Dark Grey/Blue for Contact Bar
    const darkText = "#333333";
    const mediumText = "#555555";
    const lightText = "#666666";
    const white = "#ffffff";

    const styles = {
        page: {
            width: "210mm",
            height: "297mm",
            background: "white",
            padding: "0",
            boxSizing: "border-box",
            position: "relative",
            margin: "0 auto 30px auto",
            color: darkText,
            fontFamily: "var(--theme-font, 'Roboto', sans-serif)",
            lineHeight: "var(--theme-line-height, 1.5)",
            letterSpacing: "var(--theme-letter-spacing, 0px)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
        },
        headerContainer: {
            padding: "calc(30px * var(--theme-section-margin, 1)) 40px 10px 40px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        },
        photo: {
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            objectFit: "cover",
            border: `2px solid ${themeColor}`,
            marginBottom: "15px",
        },
        name: {
            fontSize: "calc(36px * var(--theme-font-scale, 1))",
            fontWeight: "bold",
            color: darkText,
            marginBottom: "5px",
            letterSpacing: "1px",
        },
        role: {
            fontSize: "calc(14px * var(--theme-font-scale, 1))",
            textTransform: "uppercase",
            color: lightText,
            letterSpacing: "3px",
            marginBottom: "20px",
            fontWeight: "500",
        },
        headerDivider: {
            height: "1px",
            background: "#e0e0e0",
            width: "100%",
            marginBottom: "0",
        },
        contactBar: {
            background: darkBg,
            color: white,
            padding: "12px 40px",
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            fontSize: "calc(11px * var(--theme-font-scale, 1))",
            alignItems: "center",
            flexWrap: "wrap",
        },
        contactItem: {
            display: "flex",
            alignItems: "center",
            gap: "8px",
        },
        mainContent: {
            display: "flex",
            flex: 1,
            padding: "var(--theme-page-margin, 30px) 40px",
            gap: "30px",
        },
        leftCol: {
            width: "32%",
            // gap: "calc(20px * var(--theme-section-margin, 1))", // Handled by ZONE_STYLE
            borderRight: "1px solid #eee",
            paddingRight: "10px",
        },
        rightCol: {
            width: "68%",
            // gap: "calc(25px * var(--theme-section-margin, 1))", // Handled by ZONE_STYLE
        },
        sectionTitle: {
            fontSize: "calc(16px * var(--theme-font-scale, 1))",
            color: themeColor,
            fontWeight: "bold",
            borderBottom: `2px solid ${themeColor}`,
            paddingBottom: "5px",
            marginBottom: "calc(15px * var(--theme-paragraph-margin, 1))",
            display: "flex",
            alignItems: "center",
            gap: "8px",
        },
        ribbonSkill: {
            background: themeColor,
            color: white,
            padding: "8px 12px",
            marginBottom: "calc(8px * var(--theme-paragraph-margin, 1))",
            position: "relative",
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            fontWeight: "500",
            textAlign: "center",
            borderRadius: "2px",
            clipPath: "polygon(0 0, 100% 0, 95% 50%, 100% 100%, 0 100%)",
        },
        careerTimelineContainer: {
            display: "flex",
            alignItems: "center",
            gap: "5px",
            overflow: "hidden",
            marginBottom: "calc(20px * var(--theme-paragraph-margin, 1))",
            flexWrap: "wrap",
        },
        careerBox: {
            background: "#f0f4f8",
            border: "1px solid #d1d9e6",
            borderRadius: "4px",
            padding: "6px 10px",
            fontSize: "calc(10px * var(--theme-font-scale, 1))",
            textAlign: "center",
            minWidth: "80px",
            position: "relative",
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
        },
        careerArrow: {
            color: "#ccc",
            fontSize: "12px",
        },
        footer: {
            background: "#128C9F",
            color: white,
            padding: "20px 40px",
            width: "100%",
            boxSizing: "border-box",
        }
    };

    const SectionHeader = ({ title, icon }) => {
        const { isContinued } = useSectionContext();
        return (
            <div style={styles.sectionTitle}>
                {icon && <span>{icon}</span>}
                <span>{isContinued ? `${title} (Continued)` : title}</span>
            </div>
        );
    };

    const SidebarHeader = ({ title, icon }) => {
        const { isContinued } = useSectionContext();
        return (
            <div style={{ ...styles.sectionTitle, fontSize: "calc(14px * var(--theme-font-scale, 1))", borderBottom: `2px solid ${themeColor}` }}>
                {icon && <span>{icon}</span>}
                <span>{isContinued ? `${title} (Cont.)` : title}</span>
            </div>
        );
    };

    // --- CUSTOM RENDERERS ---
    const customRenderers = {
        summary: ({ isContinued, subItemRanges }) => (
            <SectionWrapper sectionId="summary" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Profile Summary">
                <div style={{ paddingBottom: "1px" }}>
                    <SectionHeader title="Profile Summary" icon={<Icons.User />} />
                    <div className="resume-rich-text" style={{ fontSize: "calc(13px * var(--theme-font-scale, 1))", textAlign: "justify" }}>
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

        skills: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(idx => data.skills?.[idx]).filter(Boolean) : (data.skills || []);
            const hasDescription = !!data.skillsDescription;
            if (items.length === 0 && !hasDescription) return null;

            return (
                <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Core Competencies">
                    <div style={{ marginBottom: "calc(20px * var(--theme-section-margin, 1))", paddingBottom: "1px" }}>
                        <SidebarHeader title="Core Competencies" icon={<Icons.Target />} />
                        {items.length > 0 ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                {items.map((skill, i) => {
                                    const originalIdx = itemIndices ? itemIndices[i] : i;
                                    const name = typeof skill === 'object' ? skill.name : skill;
                                    return (
                                        <div key={i} style={styles.ribbonSkill} data-item-index={originalIdx}>
                                            <RichTextSpellCheck html={name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('skills', originalIdx, val, 'name')} />
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="resume-rich-text" style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))" }}>
                                <RichTextSpellCheck html={data.skillsDescription} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('skills', 'skillsDescription', val)} />
                            </div>
                        )}
                    </div>
                </SectionWrapper>
            );
        },

        strengths: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(idx => data.strengths?.[idx]).filter(Boolean) : (data.strengths || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="strengths" navigationId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Key Strengths">
                    <div style={{ marginBottom: "calc(20px * var(--theme-section-margin, 1))", paddingBottom: "1px" }}>
                        <SidebarHeader title="Key Strengths" icon={<Icons.Diamond />} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            {items.map((skill, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                const name = typeof skill === 'object' ? skill.name : skill;
                                return (
                                    <div key={i} style={styles.ribbonSkill} data-item-index={originalIdx}>
                                        <RichTextSpellCheck html={name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('strengths', originalIdx, val, 'name')} />
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
                    <div style={{ marginBottom: "calc(20px * var(--theme-section-margin, 1))", paddingBottom: "1px" }}>
                        <SidebarHeader title="Additional Skills" icon={<Icons.Tools />} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            {items.map((skill, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                const name = typeof skill === 'object' ? skill.name : skill;
                                return (
                                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "calc(12px * var(--theme-font-scale, 1))", color: darkText }} data-item-index={originalIdx}>
                                        <span style={{ color: themeColor, fontSize: "14px" }}>⦿</span>
                                        <RichTextSpellCheck html={name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('additionalSkills', originalIdx, val, 'name')} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        experience: ({ itemIndices, subItemRanges }) => {
            const items = itemIndices ? itemIndices.map(idx => data.experience?.[idx]).filter(Boolean) : (data.experience || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="experience" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Work Experience">
                    <div style={{ paddingBottom: "1px" }}>
                        <SectionHeader title="Work Experience" icon={<Icons.Briefcase />} />
                        {items.map((exp, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} style={{ marginBottom: "calc(20px * var(--theme-section-margin, 1))" }} data-item-index={originalIdx}>
                                    <div style={{ background: "#e0f7fa", padding: "8px 12px", borderLeft: `4px solid ${themeColor}`, marginBottom: "calc(8px * var(--theme-paragraph-margin, 1))" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "calc(13px * var(--theme-font-scale, 1))", alignItems: "baseline" }}>
                                            <span style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                                                <RichTextSpellCheck html={exp.company} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'company')} />
                                                {"|"}
                                                <span style={{ color: themeColor }}>
                                                    <RichTextSpellCheck html={exp.title || exp.role} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'title')} />
                                                </span>
                                                {(exp.location || exp.isRemote) && (
                                                    <span style={{ fontWeight: "normal", color: lightText, fontSize: "0.9em" }}>
                                                        ({exp.location}{exp.isRemote ? " - Remote" : ""})
                                                    </span>
                                                )}
                                            </span>
                                            <span style={{ fontSize: "0.9em", color: mediumText, whiteSpace: "nowrap" }}>
                                                {exp.startYear || exp.startDate} - {exp.isCurrent ? "Present" : (exp.endYear || exp.endDate)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="resume-rich-text" style={{ fontSize: "calc(13px * var(--theme-font-scale, 1))" }}>
                                        {exp.description && (
                                            <SplittableRichText html={exp.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'description')} />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        projects: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(idx => data.projects?.[idx]).filter(Boolean) : (data.projects || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="projects" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Projects">
                    <div style={{ marginBottom: "calc(20px * var(--theme-section-margin, 1))", paddingBottom: "1px" }}>
                        <SectionHeader title="Projects" icon={<Icons.Rocket />} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            {items.map((item, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <div key={i} data-item-index={originalIdx} style={{ borderBottom: "1px solid #f0f0f0", paddingBottom: "8px" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                            <div style={{ fontWeight: "bold", fontSize: "calc(14px * var(--theme-font-scale, 1))", color: themeColor }}>
                                                <RichTextSpellCheck html={item.title} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('projects', originalIdx, val, 'title')} />
                                                {item.link && (
                                                    <ResumeLink href={item.link} style={{ fontWeight: "normal", fontSize: "0.8em", marginLeft: "10px", color: lightText, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                                                        <Icons.Link /> {item.link}
                                                    </ResumeLink>
                                                )}
                                            </div>
                                            <div style={{ fontSize: "calc(11px * var(--theme-font-scale, 1))", color: lightText, fontStyle: "italic" }}>
                                                {(item.startYear || item.startDate)} - {(item.isCurrent ? "Present" : (item.endYear || item.endDate))}
                                            </div>
                                        </div>
                                        {item.technologies && item.technologies.length > 0 && (
                                            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", margin: "5px 0" }}>
                                                {item.technologies.map((tech, ti) => (
                                                    <span key={ti} style={{ fontSize: "calc(10px * var(--theme-font-scale, 1))", background: "#f0f0f0", padding: "2px 6px", borderRadius: "3px" }}>{tech}</span>
                                                ))}
                                            </div>
                                        )}
                                        {item.description && (
                                            <div className="resume-rich-text" style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", color: darkText }}>
                                                <RichTextSpellCheck html={item.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('projects', originalIdx, val, 'description')} />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        certifications: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(idx => data.certifications?.[idx]).filter(Boolean) : (data.certifications || []);
            if (items.length === 0) return null;

            const MedalIcon = () => (
                <svg width="45" height="45" viewBox="0 0 100 100" style={{ position: "absolute", left: "-20px", top: "5px", zIndex: 2 }}>
                    {/* Ribbon */}
                    <path d="M30,50 L40,95 L50,85 L60,95 L70,50" fill="#d4af37" stroke="#b8860b" strokeWidth="2" />
                    {/* Medal Circle */}
                    <circle cx="50" cy="40" r="32" fill="#d4af37" stroke="#b8860b" strokeWidth="2" />
                    <circle cx="50" cy="40" r="26" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3,2" />
                    {/* Inner Star */}
                    <path d="M50,22 L56,34 L69,36 L59,45 L62,58 L50,52 L38,58 L41,45 L31,36 L44,34 Z" fill="#ffffff" />
                </svg>
            );

            return (
                <SectionWrapper sectionId="certifications" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Certifications" >
                    <div style={{ marginBottom: "calc(20px * var(--theme-section-margin, 1))", paddingBottom: "1px" }}>
                        <SidebarHeader title="Certifications" icon={<Icons.Award />} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "15px", paddingLeft: "15px" }}>
                            {items.map((cert, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                const yearSuffix = cert.year || cert.date ? ` (${cert.year || cert.date})` : "";
                                return (
                                    <div key={i} style={{ position: "relative", marginBottom: "5px", minHeight: "55px" }} data-item-index={originalIdx}>
                                        <MedalIcon />
                                        <div style={{
                                            border: `1.5px solid ${themeColor}`,
                                            borderRadius: "6px",
                                            padding: "10px 10px 10px 32px",
                                            background: "white",
                                            display: "flex",
                                            alignItems: "center",
                                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                            marginLeft: "5px"
                                        }}>
                                            <div style={{
                                                fontWeight: "bold",
                                                fontSize: "calc(13px * var(--theme-font-scale, 1))",
                                                lineHeight: "1.3",
                                                color: "#000"
                                            }}>
                                                <RichTextSpellCheck html={cert.name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('certifications', originalIdx, val, 'name')} />
                                                {cert.issuer && (
                                                    <>
                                                        {" from "}
                                                        <RichTextSpellCheck html={cert.issuer} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('certifications', originalIdx, val, 'issuer')} />
                                                    </>
                                                )}
                                                {yearSuffix}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper >
            );
        },

        accomplishments: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(idx => data.accomplishments?.[idx]).filter(Boolean) : (data.accomplishments || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="accomplishments" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Accomplishments">
                    <div style={{ marginBottom: "calc(20px * var(--theme-section-margin, 1))", paddingBottom: "1px" }}>
                        <SectionHeader title="Accomplishments" icon={<Icons.Sparkles />} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {items.map((item, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "calc(13px * var(--theme-font-scale, 1))" }} data-item-index={originalIdx}>
                                        <div style={{ marginTop: "4px", width: "8px", height: "8px", borderRadius: "50%", backgroundColor: themeColor, flexShrink: 0 }}></div>
                                        <RichTextSpellCheck html={item.name || item.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('accomplishments', originalIdx, val, 'name')} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        volunteering: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(idx => data.volunteering?.[idx]).filter(Boolean) : (data.volunteering || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="volunteering" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Volunteering">
                    <div style={{ marginBottom: "calc(20px * var(--theme-section-margin, 1))", paddingBottom: "1px" }}>
                        <SidebarHeader title="Volunteering" icon={<Icons.HandShake />} />
                        {items.map((item, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} style={{ marginBottom: "10px" }} data-item-index={originalIdx}>
                                    <div style={{ fontWeight: "bold", fontSize: "calc(12px * var(--theme-font-scale, 1))", color: themeColor }}>
                                        <RichTextSpellCheck html={item.role || item.title} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('volunteering', originalIdx, val, 'role')} />
                                    </div>
                                    <div style={{ fontSize: "calc(11px * var(--theme-font-scale, 1))", color: lightText }}>
                                        <RichTextSpellCheck html={item.organization || item.company} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('volunteering', originalIdx, val, 'organization')} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        interests: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(idx => data.interests?.[idx]).filter(Boolean) : (data.interests || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="interests" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Interests">
                    <div style={{ marginBottom: "calc(20px * var(--theme-section-margin, 1))", paddingBottom: "1px" }}>
                        <SidebarHeader title="Interests" icon={<Icons.Palette />} />
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                            {items.map((item, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                const name = typeof item === 'object' ? item.name : item;
                                return (
                                    <div key={i} style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", color: mediumText }} data-item-index={originalIdx}>
                                        <RichTextSpellCheck html={name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('interests', originalIdx, val, 'name')} />
                                        {i < items.length - 1 && <span style={{ marginLeft: "10px", color: "#ccc" }}>|</span>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        additionalInfo: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(idx => data.additionalInfo?.[idx]).filter(Boolean) : (data.additionalInfo || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="additionalInfo" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Additional Info">
                    <div style={{ marginBottom: "calc(20px * var(--theme-section-margin, 1))", paddingBottom: "1px" }}>
                        <SectionHeader title="Additional Info" icon={<Icons.FileText />} />
                        {items.map((item, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} className="resume-rich-text" style={{ fontSize: "calc(13px * var(--theme-font-scale, 1))" }} data-item-index={originalIdx}>
                                    <RichTextSpellCheck html={item.description || item.name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('additionalInfo', originalIdx, val, 'description')} />
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
                <SectionWrapper sectionId="keyAchievements" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Achievements">
                    <div style={{ marginBottom: "calc(20px * var(--theme-section-margin, 1))", paddingBottom: "1px" }}>
                        <SectionHeader title="Achievements" icon={<Icons.Award />} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {items.map((item, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "calc(13px * var(--theme-font-scale, 1))" }} data-item-index={originalIdx}>
                                        <div style={{ marginTop: "4px", width: "8px", height: "8px", borderRadius: "50%", backgroundColor: themeColor, flexShrink: 0 }}></div>
                                        <RichTextSpellCheck html={item.name || item.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('keyAchievements', originalIdx, val, 'name')} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        education: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(idx => data.education?.[idx]).filter(Boolean) : (data.education || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="education" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Education">
                    <div style={{ marginBottom: "calc(20px * var(--theme-section-margin, 1))", paddingBottom: "1px" }}>
                        <SidebarHeader title="Education" icon={<Icons.GraduationCap />} />
                        <div style={{ borderLeft: "2px solid #eee", marginLeft: "6px", paddingLeft: "15px" }}>
                            {items.map((edu, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <div key={i} style={{ marginBottom: "calc(15px * var(--theme-paragraph-margin, 1))", position: "relative" }} data-item-index={originalIdx}>
                                        <div style={{ position: "absolute", left: "-22px", top: "4px", width: "10px", height: "10px", borderRadius: "50%", background: "white", border: `3px solid ${themeColor}` }}></div>
                                        {/* Year */}
                                        <div style={{ fontWeight: "700", fontSize: "calc(12px * var(--theme-font-scale, 1))", color: themeColor, marginBottom: "4px" }}>
                                            {edu.year || edu.date || (edu.startYear ? `${edu.startYear} - ${edu.endYear}` : "")}
                                        </div>
                                        {/* Degree */}
                                        <div style={{ fontWeight: "700", color: darkText, fontSize: "calc(13px * var(--theme-font-scale, 1))", marginBottom: "4px", display: "flex", flexWrap: "wrap", alignItems: "baseline", columnGap: "4px" }}>
                                            <RichTextSpellCheck html={edu.degree} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'degree')} />
                                            {edu.field && (
                                                <>
                                                    <span style={{ fontWeight: "normal", color: "#666" }}>in</span>
                                                    <RichTextSpellCheck html={edu.field} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'field')} />
                                                </>
                                            )}
                                        </div>
                                        {/* College / Institution */}
                                        <div style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", color: mediumText, display: "flex", flexWrap: "wrap", alignItems: "baseline" }}>
                                            <RichTextSpellCheck html={edu.institution || edu.school} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'institution')} />
                                            {edu.city && <span>,&nbsp;{edu.city}</span>}
                                            {edu.grade && <span style={{ marginLeft: "8px", fontWeight: "600", color: lightText, opacity: 0.8 }}> • Grade: {edu.grade}</span>}
                                        </div>
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
                    <div style={{ marginBottom: "calc(20px * var(--theme-section-margin, 1))", paddingBottom: "1px" }}>
                        <SidebarHeader title="Professional Affiliations" icon={<Icons.Building />} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {items.map((item, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <div key={i} style={{ padding: "8px", borderLeft: `3px solid ${themeColor}`, background: "#f8f9fa" }} data-item-index={originalIdx}>
                                        <div style={{ fontWeight: "bold", fontSize: "calc(12px * var(--theme-font-scale, 1))", color: themeColor }}>
                                            <RichTextSpellCheck html={item.role} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('affiliations', originalIdx, val, 'role')} />
                                        </div>
                                        <div style={{ fontWeight: "600", fontSize: "calc(11px * var(--theme-font-scale, 1))", color: darkText }}>
                                            <RichTextSpellCheck html={item.organization || item.name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('affiliations', originalIdx, val, 'organization')} />
                                        </div>
                                        {(item.startDate || item.endDate) && (
                                            <div style={{ fontSize: "calc(10px * var(--theme-font-scale, 1))", color: lightText, fontStyle: "italic" }}>
                                                {item.startDate} - {item.isCurrent ? "Present" : item.endDate}
                                            </div>
                                        )}
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
            return (
                <SectionWrapper sectionId="software" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Software">
                    <div style={{ marginBottom: "calc(20px * var(--theme-section-margin, 1))", paddingBottom: "1px" }}>
                        <SidebarHeader title="Software" icon={<Icons.Tools />} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {items.map((s, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <div key={i} style={{ display: "flex", flexDirection: "column", gap: "2px" }} data-item-index={originalIdx}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <div style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", color: darkText, fontWeight: "600" }}>
                                                <RichTextSpellCheck html={s.name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('software', originalIdx, val, 'name')} />
                                            </div>
                                            {s.rating && (
                                                <div style={{ display: "flex", gap: "2px" }}>
                                                    {[...Array(5)].map((_, starI) => (
                                                        <div key={starI} style={{ width: "8px", height: "8px", borderRadius: "50%", background: starI < s.rating ? themeColor : "#ddd" }}></div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        {s.description && (
                                            <div style={{ fontSize: "calc(10px * var(--theme-font-scale, 1))", color: lightText }}>
                                                <RichTextSpellCheck html={s.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('software', originalIdx, val, 'description')} />
                                            </div>
                                        )}
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
                    <div style={{ marginBottom: "calc(20px * var(--theme-section-margin, 1))", paddingBottom: "1px" }}>
                        <SectionHeader title="Awards & Recognition" icon={<Icons.Medal />} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {items.map((item, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <div key={i} style={{ padding: "10px", borderLeft: `3px solid ${themeColor}`, background: "#fcfcfc" }} data-item-index={originalIdx}>
                                        <div style={{ fontWeight: "bold", fontSize: "calc(13px * var(--theme-font-scale, 1))", color: themeColor }}>
                                            <RichTextSpellCheck html={item.name || item.title} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('awards', originalIdx, val, 'name')} />
                                        </div>
                                        <div style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", color: darkText }}>
                                            <RichTextSpellCheck html={item.issuer || item.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('awards', originalIdx, val, 'issuer')} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        publications: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(idx => data.publications?.[idx]).filter(Boolean) : (data.publications || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="publications" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Publications">
                    <div style={{ marginBottom: "calc(20px * var(--theme-section-margin, 1))", paddingBottom: "1px" }}>
                        <SectionHeader title="Publications" icon={<Icons.BookOpen />} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {items.map((item, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <div key={i} style={{ marginBottom: "8px" }} data-item-index={originalIdx}>
                                        <div style={{ fontWeight: "bold", fontSize: "calc(13px * var(--theme-font-scale, 1))" }}>
                                            <RichTextSpellCheck html={item.title} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('publications', originalIdx, val, 'title')} />
                                        </div>
                                        <div style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", color: mediumText, fontStyle: "italic" }}>
                                            <RichTextSpellCheck html={item.publisher || item.journal} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('publications', originalIdx, val, 'publisher')} />
                                            {item.date && <span> • {item.date}</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        references: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(idx => data.references?.[idx]).filter(Boolean) : (data.references || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="references" onSectionClick={onSectionClick} isInteractive={isInteractive} label="References">
                    <div style={{ marginBottom: "calc(20px * var(--theme-section-margin, 1))", paddingBottom: "1px" }}>
                        <SectionHeader title="References" icon={<Icons.User />} />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                            {items.map((ref, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <div key={i} style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))" }} data-item-index={originalIdx}>
                                        <div style={{ fontWeight: "bold", color: themeColor }}>
                                            <RichTextSpellCheck html={ref.name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('references', originalIdx, val, 'name')} />
                                        </div>
                                        <div style={{ fontWeight: "600" }}>
                                            <RichTextSpellCheck html={ref.position} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('references', originalIdx, val, 'position')} />
                                        </div>
                                        <div>
                                            <RichTextSpellCheck html={ref.company} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('references', originalIdx, val, 'company')} />
                                        </div>
                                        {ref.email && <div style={{ color: lightText }}>{ref.email}</div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        custom: () => {
            if (!data.customSection?.isVisible || !data.customSection?.content) return null;
            return (
                <SectionWrapper sectionId="custom" onSectionClick={onSectionClick} isInteractive={isInteractive} label={data.customSection.title || "Custom Section"}>
                    <div style={{ marginBottom: "calc(20px * var(--theme-section-margin, 1))", paddingBottom: "1px" }}>
                        <SectionHeader title={data.customSection.title || "Custom Section"} icon={<Icons.Star />} />
                        <div className="resume-rich-text" style={{ fontSize: "calc(13px * var(--theme-font-scale, 1))" }}>
                            <RichTextSpellCheck html={data.customSection.content} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('customSection', 'content', val)} />
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        careerTimeline: () => {
            const items = data.experience || [];
            if (items.length === 0) return null;
            const timelineItems = [...items].reverse();

            return (
                <SectionWrapper sectionId="careerTimeline" navigationId="experience" label="Career Timeline" onSectionClick={onSectionClick} isInteractive={isInteractive}>
                    <div style={{ marginBottom: "calc(20px * var(--theme-section-margin, 1))", paddingBottom: "1px" }}>
                        <SectionHeader title="Career Timeline" icon={<Icons.TrendingUp />} />
                        <div style={styles.careerTimelineContainer}>
                            {timelineItems.map((exp, i) => (
                                <React.Fragment key={i}>
                                    <div style={styles.careerBox}>
                                        <div style={{ fontWeight: "bold", color: themeColor }}>{exp.company}</div>
                                        <div style={{ fontSize: "calc(9px * var(--theme-font-scale, 1))", color: "#666" }}>
                                            {exp.startYear || exp.startDate} - {exp.isCurrent ? "Present" : (exp.endYear || exp.endDate)}
                                        </div>
                                    </div>
                                    {i < timelineItems.length - 1 && <div style={styles.careerArrow}>➜</div>}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        personalDetails: () => {
            const { personal: p = {} } = data;
            const details = [
                { label: 'Name', value: p.name },
                { label: 'DOB', value: p.dob || p.dateOfBirth },
                { label: 'Nationality', value: p.nationality },
                { label: 'Gender', value: p.gender },
                { label: 'Marital Status', value: p.maritalStatus || p.marital_status },
                { label: 'Visa', value: p.visaStatus || p.visa_status },
                { label: 'Religion', value: p.religion },
                { label: 'Passport', value: p.passport || p.passportNumber },
                { label: 'Place of Birth', value: p.placeOfBirth },
                { label: 'Driving License', value: p.drivingLicense },
                { label: 'City', value: p.city },
                { label: 'State', value: p.state },
                { label: 'Country', value: p.country },
                { label: 'Zip Code', value: p.zipCode },
            ].filter(d => d.value);

            if (!details.length && !isInteractive) return null;

            return (
                <SectionWrapper sectionId="personalDetails" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Personal Details">
                    <div style={{ flex: 1, minWidth: "200px" }}>
                        <div style={{ fontWeight: "bold", fontSize: "calc(16px * var(--theme-font-scale, 1))", marginBottom: "8px", color: themeColor }}>Personal Details</div>
                        <div style={{ fontSize: "calc(11px * var(--theme-font-scale, 1))", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px 20px" }}>
                            {details.map((d, i) => (
                                <div key={i}><strong>{d.label}:</strong> <SpellCheckText text={d.value} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', d.label.toLowerCase().replace(/ /g, ''), val)} /></div>
                            ))}
                            {(p.otherInformation || p.otherPersonal) && <div style={{ gridColumn: "1 / -1" }}><strong>Other Information:</strong> <SpellCheckText text={p.otherInformation || p.otherPersonal} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'otherInformation', val)} /></div>}
                            {!details.length && isInteractive && (
                                <div style={{ gridColumn: "1 / -1", color: "rgba(0,0,0,0.5)", fontStyle: "italic", cursor: "pointer" }}>
                                    Click to add personal details...
                                </div>
                            )}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        languages: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(idx => data.languages?.[idx]).filter(Boolean) : (data.languages || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="languages" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Languages">
                    <div style={{ minWidth: "150px" }}>
                        <div style={{ fontWeight: "bold", fontSize: "calc(16px * var(--theme-font-scale, 1))", marginBottom: "8px", color: themeColor }}>Languages</div>
                        <div style={{ fontSize: "calc(11px * var(--theme-font-scale, 1))", display: "flex", flexWrap: "wrap", gap: "5px 15px" }}>
                            {items.map((l, idx) => {
                                const originalIdx = itemIndices ? itemIndices[idx] : idx;
                                return (
                                    <div key={idx} data-item-index={originalIdx}>
                                        <RichTextSpellCheck html={l.name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('languages', originalIdx, val, 'name')} />
                                        {l.level ? ` (${l.level}/5)` : ""}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        }
    };

    const renderHeader = () => (
        <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Header">
            <div style={styles.headerContainer}>
                {personal?.photo && (
                    <img src={personal.photo} alt="Profile" style={styles.photo} />
                )}
                <div style={styles.name}>
                    <SpellCheckText text={personal?.name || "YOUR NAME"} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'name', val)} />
                </div>
                <div style={styles.role}>
                    <SpellCheckText text={personal?.profession || "PROFESSIONAL ROLE"} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'profession', val)} />
                </div>
                <div style={styles.headerDivider}></div>
            </div>
        </SectionWrapper>
    );

    const renderContactBar = () => (
        <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Contact Info">
            <div style={styles.contactBar}>
                {personal?.phone && <div style={styles.contactItem}><Icons.Phone /><ResumeLink href={personal.phone}>{personal.phone}</ResumeLink></div>}
                {personal?.email && <div style={styles.contactItem}><Icons.Email /><ResumeLink href={personal.email}>{personal.email}</ResumeLink></div>}
                {personal?.linkedin && <div style={styles.contactItem}><Icons.LinkedIn /><ResumeLink href={personal.linkedin}>{personal.linkedin}</ResumeLink></div>}
                {personal?.github && <div style={styles.contactItem}><Icons.Website /><ResumeLink href={personal.github}>{personal.github}</ResumeLink></div>}
                {(personal?.city || personal?.state || personal?.country || personal?.zipCode) &&
                    <div style={styles.contactItem}><Icons.Location />{[personal?.city, personal?.state, personal?.country, personal?.zipCode].filter(Boolean).join(", ")}</div>}
                {data.websites?.filter(s => s.addToHeader).map((site, i) => {
                    const isLinkedIn = site.url?.toLowerCase().includes('linkedin') || site.label?.toLowerCase().includes('linkedin');
                    return (
                        <div key={i} style={styles.contactItem}>
                            {isLinkedIn ? <Icons.LinkedIn /> : <Icons.Website />}
                            <ResumeLink href={site.url}>{site.label || site.url}</ResumeLink>
                        </div>
                    );
                })}
            </div>
        </SectionWrapper>
    );

    const renderZone = (zoneId, sections = null, columnStyle = {}) => {
        const activeSections = sections || (zoneId === 'left' ? leftSections : rightSections);
        return (
            <DroppableZone id={zoneId} style={{ ...columnStyle }}>
                {activeSections.map((sid, idx) => {
                    const isContinued = typeof sid === 'object' && sid.isContinued;
                    const sectionId = typeof sid === 'string' ? sid : sid.id;
                    const dragId = isContinued ? `${zoneId}-cont-${sectionId}-${idx}` : sectionId;
                    return (
                        <DraggableSection key={dragId} id={dragId} isEnabled={canReorder && !isContinued}>
                            <SectionRenderer sectionId={sectionId} data={data} layoutConfig={layoutConfig} customRenderers={customRenderers} onSectionClick={onSectionClick} isContinued={isContinued} itemIndices={typeof sid === 'object' ? sid.itemIndices : undefined} subItemRanges={typeof sid === 'object' ? sid.subItemRanges : undefined} zoneId={zoneId} />
                        </DraggableSection>
                    );
                })}
            </DroppableZone>
        );
    };

    const ZONE_STYLE_LEFT = {
        display: "flex",
        flexDirection: "column",
        gap: "calc(20px * var(--theme-section-margin, 1))",
        minHeight: '100px',
        flex: 1
    };

    const ZONE_STYLE_RIGHT = {
        display: "flex",
        flexDirection: "column",
        gap: "calc(25px * var(--theme-section-margin, 1))",
        minHeight: '100px',
        flex: 1
    };

    const Measurer = () => (
        <div className="resume-measurer" style={{ position: "absolute", top: -10000, left: -10000, width: "210mm", visibility: "hidden" }}>
            <div className="page-height-marker" style={{ height: "297mm", width: "1px", position: "absolute", left: 0, top: 0 }} />
            <div style={{ ...styles.page, height: "auto", overflow: "visible" }}>
                {renderHeader()}
                {renderContactBar()}
                <div style={styles.mainContent}>
                    <div style={{ ...styles.leftCol, ...ZONE_STYLE_LEFT }} data-column-id="left">
                        {leftSections.map(sid => <SectionRenderer key={sid} sectionId={sid} data={data} customRenderers={customRenderers} zoneId="left" />)}
                    </div>
                    <div style={{ ...styles.rightCol, ...ZONE_STYLE_RIGHT }} data-column-id="right">
                        {rightSections.map(sid => <SectionRenderer key={sid} sectionId={sid} data={data} customRenderers={customRenderers} zoneId="right" />)}
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );

    const Footer = ({ isTeleported = false }) => (
        <div style={{
            ...styles.footer,
            ...(isTeleported ? { position: "absolute", bottom: 0, left: 0, right: 0 } : { marginTop: "auto" })
        }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "15px" }}>
                <SectionRenderer sectionId="personalDetails" data={data} customRenderers={customRenderers} />
                <SectionRenderer sectionId="languages" data={data} customRenderers={customRenderers} />
                <div style={{ flex: 1, display: "flex", justifyContent: "flex-end", alignSelf: "flex-end", opacity: 0.8, fontSize: "10px" }}>Page {pages.length}</div>
            </div>
        </div>
    );

    return (
        <div ref={containerRef} className="executive-teal-root">
            <Measurer />
            <DndContext {...dndContextProps}>
                <SortableContext items={[...leftSections, ...rightSections]} strategy={verticalListSortingStrategy}>
                    {showPageBreaks && pages ? (
                        pages.map((page, i) => (
                            <div key={i} style={{ ...styles.page, height: "297mm", minHeight: "unset", overflow: "hidden" }}>
                                {i === 0 && renderHeader()}
                                {i === 0 && renderContactBar()}
                                <div style={styles.mainContent}>
                                    <div style={{ ...styles.leftCol, display: "flex", flexDirection: "column" }}>{renderZone(`left-p${i}`, page.left, ZONE_STYLE_LEFT)}</div>
                                    <div style={{ ...styles.rightCol, display: "flex", flexDirection: "column" }}>{renderZone(`right-p${i}`, page.right, ZONE_STYLE_RIGHT)}</div>
                                </div>
                                {i === pages.length - 1 && <Footer isTeleported={true} />}
                                {i < pages.length - 1 && <div style={{ position: "absolute", bottom: "10px", right: "20px", fontSize: "10px", opacity: 0.5 }}>Page {i + 1} of {pages.length}</div>}
                            </div>
                        ))
                    ) : (
                        <div style={{ ...styles.page, height: "auto", minHeight: "297mm", overflow: "visible" }}>
                            {renderHeader()}
                            {renderContactBar()}
                            <div style={styles.mainContent}>
                                <div style={{ ...styles.leftCol, display: "flex", flexDirection: "column" }}>{renderZone('left', null, ZONE_STYLE_LEFT)}</div>
                                <div style={{ ...styles.rightCol, display: "flex", flexDirection: "column" }}>{renderZone('right', null, ZONE_STYLE_RIGHT)}</div>
                            </div>
                            <Footer />
                        </div>
                    )}
                </SortableContext>
                <StableResumeDragOverlay activeId={activeId} scale={scale} renderSection={(id) => (
                    <div style={{ background: "white", padding: "15px", border: "1px solid #ddd", width: "250px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}>
                        <SectionRenderer sectionId={id} data={data} customRenderers={customRenderers} />
                    </div>
                )} />
            </DndContext>
        </div>
    );
};

export default ExecutiveTeal;
