import React, { useRef } from "react";

import { DndContext } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SectionWrapper from "../../components/SectionWrapper";
import {
    useResumeDragAndDrop,
    DroppableZone,
    StableResumeDragOverlay,
} from "../../hooks/useResumeDragAndDrop";
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
    ResumeLink,
} from "../common/BaseComponents";
import { getCompleteLayout } from "../common/TemplateUtils";

/**
 * ClassicMinimal Template
 * A high-fidelity reconstruction of the attached image.
 * Features:
 *  - Centered header with mixed-weight large name + thin ruled divider + inline contact row
 *  - Two-column body: left sidebar (~33%) and right main (~67%), both on white
 *  - ALL CAPS section titles with a full-width bottom border rule
 *  - Categorized skills list, dated education entries, pipe-separated experience headers
 *  - Fully monochromatic — no color accents (or user-themed accent via --theme-color)
 */
const AcademicTwoColumn = ({
    data,
    onSectionClick,
    onReorder,
    scale = 1,
    isSpellCheckActive,
    onSpellCheckIgnore,
    onSpellCheckReplace,
    layoutConfig,
    showPageBreaks,
}) => {
    const containerRef = useRef(null);

    if (!data) return null;
    const { personal } = data;
    const isInteractive = !!onSectionClick && !isSpellCheckActive;
    const canReorder = !!onReorder && !isSpellCheckActive;

    // ─── LAYOUT ENGINE ────────────────────────────────────────────────────────
    const templateId = "academic-two-column";
    const savedLayout = data.templateLayouts?.[templateId] || {};
    const initialLayout = {
        sidebar:
            savedLayout.sidebar ||
            savedLayout.left || [
                "personalDetails",
                "education",
                "coursework",
                "skills",
                "strengths",
                "additionalSkills",
                "languages",
                "certifications",
                "software",
                "interests",
                "affiliations",
                "references",
            ],
        main:
            savedLayout.main ||
            savedLayout.right || [
                "summary",
                "experience",
                "projects",
                "awards",
                "volunteering",
                "publications",
                "websites",
                "additionalInfo",
                "custom",
            ],
    };

    const completeLayout = getCompleteLayout(data, initialLayout, "sidebar");
    const activeSidebarSections = completeLayout.sidebar || [];
    const activeMainSections = completeLayout.main || [];

    // ─── DRAG & DROP ──────────────────────────────────────────────────────────
    const { dndContextProps, activeId } = useResumeDragAndDrop({
        data,
        onReorder,
        scale,
        containers: { sidebar: activeSidebarSections, main: activeMainSections },
    });

    // ─── PAGINATION ───────────────────────────────────────────────────────────
    const pages = useAutoPagination({
        columns: { sidebar: activeSidebarSections, main: activeMainSections },
        data,
        enabled: showPageBreaks,
        containerRef,
        scale,
    });

    // ─── DESIGN TOKENS ────────────────────────────────────────────────────────
    const accent = "var(--theme-color, #1a1a1a)";
    const bodyText = "#2d2d2d";
    const mutedText = "#555555";
    const ruleColor = "#c8c8c8";
    const fontFamily = "var(--theme-font, 'Georgia', 'Times New Roman', serif)";
    const sansFont = "'Helvetica Neue', 'Arial', sans-serif";

    // ─── GLOBAL STYLES ────────────────────────────────────────────────────────
    const styles = {
        page: {
            width: "210mm",
            height: "297mm",
            background: "white",
            boxSizing: "border-box",
            position: "relative",
            margin: "0 auto 30px auto",
            color: bodyText,
            fontFamily: fontFamily,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
        },
        // ── Header ──
        headerWrap: {
            padding:
                "calc(var(--theme-page-margin, 36px) * 0.9) calc(var(--theme-page-margin, 50px) * 1.1) 0",
            textAlign: "center",
        },
        nameLine: {
            display: "flex",
            justifyContent: "center",
            alignItems: "baseline",
            gap: "10px",
            marginBottom: "6px",
            flexWrap: "wrap",
        },
        nameFirst: {
            fontSize: "calc(44px * var(--theme-font-scale, 1))",
            fontWeight: "300",
            letterSpacing: "2px",
            color: "#1a1a1a",
            fontFamily: fontFamily,
            lineHeight: "1",
        },
        nameLast: {
            fontSize: "calc(44px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            letterSpacing: "2px",
            color: "#1a1a1a",
            fontFamily: fontFamily,
            lineHeight: "1",
        },
        headerRule: {
            border: "none",
            borderTop: `1px solid ${ruleColor}`,
            margin: "10px 0 8px",
        },
        contactRow: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "6px",
            flexWrap: "wrap",
            fontSize: "calc(11.5px * var(--theme-font-scale, 1))",
            color: mutedText,
            fontFamily: sansFont,
            paddingBottom: "14px",
        },
        contactSep: {
            color: ruleColor,
            userSelect: "none",
        },
        // ── Body ──
        body: {
            display: "flex",
            flex: 1,
        },
        sidebar: {
            width: "33%",
            padding:
                "20px calc(var(--theme-page-margin, 50px) * 0.55) 20px calc(var(--theme-page-margin, 50px) * 1.05)",
            borderRight: `1px solid ${ruleColor}`,
            display: "flex",
            flexDirection: "column",
            gap: "calc(22px * var(--theme-section-margin, 1))",
            boxSizing: "border-box",
        },
        main: {
            width: "67%",
            padding:
                "20px calc(var(--theme-page-margin, 50px) * 1.05) 20px calc(var(--theme-page-margin, 50px) * 0.6)",
            display: "flex",
            flexDirection: "column",
            gap: "calc(22px * var(--theme-section-margin, 1))",
            boxSizing: "border-box",
        },
        // ── Section Title ──
        sectionTitle: {
            fontSize: "calc(10px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            letterSpacing: "1.8px",
            textTransform: "uppercase",
            color: "#1a1a1a",
            fontFamily: sansFont,
            borderBottom: `1.5px solid #1a1a1a`,
            paddingBottom: "4px",
            marginBottom: "12px",
        },
        // ── Education ──
        eduInstitution: {
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: "#1a1a1a",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            lineHeight: "1.3",
        },
        eduDegree: {
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            fontWeight: "400",
            color: bodyText,
            lineHeight: "1.4",
            marginTop: "2px",
        },
        eduMeta: {
            fontSize: "calc(11px * var(--theme-font-scale, 1))",
            color: mutedText,
            marginTop: "2px",
            lineHeight: "1.4",
        },
        eduBlock: {
            marginBottom: "calc(14px * var(--theme-paragraph-margin, 1))",
            pageBreakInside: "avoid",
        },
        // ── Skills ──
        skillCategory: {
            fontSize: "calc(11px * var(--theme-font-scale, 1))",
            fontWeight: "600",
            color: bodyText,
            marginBottom: "4px",
            fontFamily: sansFont,
        },
        skillList: {
            paddingLeft: "14px",
            margin: "0 0 calc(10px * var(--theme-paragraph-margin, 1)) 0",
        },
        skillItem: {
            fontSize: "calc(11.5px * var(--theme-font-scale, 1))",
            color: bodyText,
            lineHeight: "1.55",
            pageBreakInside: "avoid",
        },
        // ── Experience ──
        expHeader: {
            display: "flex",
            flexDirection: "column",
            marginBottom: "4px",
        },
        expTitleRow: {
            display: "flex",
            alignItems: "baseline",
            gap: "6px",
            flexWrap: "wrap",
        },
        expCompany: {
            fontSize: "calc(13.5px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: "#1a1a1a",
            textTransform: "uppercase",
            letterSpacing: "0.4px",
        },
        expPipe: {
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            color: mutedText,
        },
        expRole: {
            fontSize: "calc(12.5px * var(--theme-font-scale, 1))",
            fontWeight: "600",
            color: bodyText,
            textTransform: "uppercase",
            letterSpacing: "0.3px",
        },
        expMeta: {
            fontSize: "calc(11px * var(--theme-font-scale, 1))",
            color: mutedText,
            marginTop: "1px",
            fontStyle: "italic",
        },
        expDesc: {
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            lineHeight: "var(--theme-line-height, 1.6)",
            color: bodyText,
            marginTop: "4px",
        },
        expBlock: {
            marginBottom: "calc(18px * var(--theme-paragraph-margin, 1))",
            pageBreakInside: "avoid",
        },
        // ── Projects ──
        projTitleRow: {
            display: "flex",
            alignItems: "baseline",
            gap: "6px",
            flexWrap: "wrap",
            marginBottom: "3px",
        },
        projName: {
            fontSize: "calc(13px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: "#1a1a1a",
            textTransform: "uppercase",
            letterSpacing: "0.4px",
        },
        projTech: {
            fontSize: "calc(11px * var(--theme-font-scale, 1))",
            color: mutedText,
            fontStyle: "italic",
        },
        projDesc: {
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            lineHeight: "var(--theme-line-height, 1.6)",
            color: bodyText,
        },
        projBlock: {
            marginBottom: "calc(16px * var(--theme-paragraph-margin, 1))",
            pageBreakInside: "avoid",
        },
        // ── Awards ──
        awardsTable: {
            width: "100%",
            borderCollapse: "collapse",
        },
        awardRow: {
            display: "grid",
            gridTemplateColumns: "60px 1fr 1fr",
            gap: "8px",
            alignItems: "baseline",
            marginBottom: "calc(5px * var(--theme-paragraph-margin, 1))",
            pageBreakInside: "avoid",
        },
        awardYear: {
            fontSize: "calc(11.5px * var(--theme-font-scale, 1))",
            color: mutedText,
            fontWeight: "600",
        },
        awardTitle: {
            fontSize: "calc(11.5px * var(--theme-font-scale, 1))",
            color: bodyText,
            fontWeight: "400",
        },
        awardIssuer: {
            fontSize: "calc(11.5px * var(--theme-font-scale, 1))",
            color: bodyText,
            textAlign: "right",
        },
        // ── Contact / Personal ──
        contactLabel: {
            fontSize: "calc(10px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            letterSpacing: "1px",
            textTransform: "uppercase",
            color: "#1a1a1a",
            fontFamily: sansFont,
            marginBottom: "2px",
        },
        contactValue: {
            fontSize: "calc(11.5px * var(--theme-font-scale, 1))",
            color: mutedText,
            marginBottom: "calc(8px * var(--theme-paragraph-margin, 1))",
            wordBreak: "break-all",
        },
        // ── Languages ──
        langItem: {
            display: "flex",
            justifyContent: "space-between",
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            color: bodyText,
            marginBottom: "6px",
        },
        langLevel: {
            color: mutedText,
            fontStyle: "italic",
        },
        // ── Misc list ──
        genericList: {
            paddingLeft: "14px",
            margin: 0,
        },
        genericItem: {
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            color: bodyText,
            lineHeight: "1.6",
            marginBottom: "4px",
        },
    };

    // ─── SECTION TITLE COMPONENT ──────────────────────────────────────────────
    const SectionTitle = ({ title }) => {
        const { isContinued } = useSectionContext?.() || {};
        return (
            <div style={styles.sectionTitle}>
                {isContinued ? `${title} (cont.)` : title}
            </div>
        );
    };

    // ─── HEADER ───────────────────────────────────────────────────────────────
    const Header = () => {
        const nameParts = (personal?.name || "YOUR NAME").trim().split(/\s+/);
        const lastName = nameParts.pop() || "";
        const firstName = nameParts.join(" ");

        const contactItems = [
            personal?.email,
            personal?.linkedin ? "LinkedIn" : null,
            personal?.github ? "GitHub" : null,
            personal?.website ? "Portfolio" : null,
            personal?.phone,
        ].filter(Boolean);

        return (
            <SectionWrapper
                sectionId="personal"
                onSectionClick={onSectionClick}
                isInteractive={isInteractive}
                label="Header"
            >
                <div style={styles.headerWrap}>
                    <div style={styles.nameLine}>
                        <span style={styles.nameFirst}>
                            <SpellCheckText
                                text={firstName}
                                isActive={isSpellCheckActive}
                                onIgnore={onSpellCheckIgnore}
                                onReplace={(val) =>
                                    onSpellCheckReplace?.("personal", "name", val)
                                }
                            />
                        </span>
                        <span style={styles.nameLast}>
                            <SpellCheckText
                                text={lastName}
                                isActive={isSpellCheckActive}
                                onIgnore={onSpellCheckIgnore}
                                onReplace={(val) =>
                                    onSpellCheckReplace?.("personal", "name", val)
                                }
                            />
                        </span>
                    </div>
                    <hr style={styles.headerRule} />
                    <div style={styles.contactRow}>
                        {contactItems.map((item, i) => (
                            <React.Fragment key={i}>
                                {i > 0 && <span style={styles.contactSep}>|</span>}
                                <span>{item}</span>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </SectionWrapper>
        );
    };

    // ─── CUSTOM RENDERERS ─────────────────────────────────────────────────────
    const customRenderers = {
        // ── Summary ──────────────────────────────────────────────────────────
        summary: ({ subItemRanges, zoneId }) => {
            if (!data.summary || data.summary === "<p><br></p>") return null;
            return (
                <SectionWrapper
                    sectionId="summary"
                    onSectionClick={onSectionClick}
                    isInteractive={isInteractive}
                    label="Summary"
                >
                    <div>
                        <SectionTitle title="Professional Summary" />
                        <div
                            className="resume-rich-text"
                            style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", lineHeight: "var(--theme-line-height, 1.6)" }}
                        >
                            <SplittableRichText
                                html={data.summary}
                                range={subItemRanges?.summary}
                                isActive={isSpellCheckActive}
                                onIgnore={onSpellCheckIgnore}
                                onReplace={(val) =>
                                    onSpellCheckReplace?.("summary", "summary", val)
                                }
                            />
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        // ── Experience ────────────────────────────────────────────────────────
        experience: ({ itemIndices, subItemRanges, zoneId }) => {
            const items = itemIndices
                ? itemIndices.map((idx) => data.experience?.[idx])
                : data.experience;
            if (!items || items.length === 0) return null;

            return (
                <SectionWrapper
                    sectionId="experience"
                    onSectionClick={onSectionClick}
                    isInteractive={isInteractive}
                    label="Experience"
                >
                    <div>
                        <SectionTitle title="Experience" />
                        {items.map((exp, i) => {
                            if (!exp) return null;
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const isContinuedItem = subItemRanges?.[originalIdx]?.start > 0;
                            const dateStr =
                                exp.year ||
                                exp.date ||
                                (exp.startYear
                                    ? `${exp.startYear} – ${exp.isCurrent ? "Present" : exp.endYear || "Present"}`
                                    : "");

                            return (
                                <div
                                    key={i}
                                    data-item-index={originalIdx}
                                    style={styles.expBlock}
                                >
                                    {!isContinuedItem && (
                                        <div style={styles.expHeader}>
                                            <div style={styles.expTitleRow}>
                                                <span style={styles.expCompany}>
                                                    <RichTextSpellCheck
                                                        html={exp.company || ""}
                                                        isActive={isSpellCheckActive}
                                                        onIgnore={onSpellCheckIgnore}
                                                        onReplace={(val) =>
                                                            onSpellCheckReplace?.("experience", originalIdx, val, "company")
                                                        }
                                                    />
                                                </span>
                                                {(exp.title || exp.role) && (
                                                    <>
                                                        <span style={styles.expPipe}>|</span>
                                                        <span style={styles.expRole}>
                                                            <RichTextSpellCheck
                                                                html={exp.title || exp.role || ""}
                                                                isActive={isSpellCheckActive}
                                                                onIgnore={onSpellCheckIgnore}
                                                                onReplace={(val) =>
                                                                    onSpellCheckReplace?.("experience", originalIdx, val, "title")
                                                                }
                                                            />
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                            <div style={styles.expMeta}>
                                                {dateStr && <span>{dateStr}</span>}
                                                {exp.location && (
                                                    <span>
                                                        {dateStr ? " | " : ""}
                                                        {exp.location}
                                                        {exp.isRemote ? " · Remote" : ""}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    <div
                                        className="resume-rich-text"
                                        style={styles.expDesc}
                                    >
                                        <SplittableRichText
                                            html={exp.description}
                                            range={subItemRanges?.[originalIdx]}
                                            isActive={isSpellCheckActive}
                                            onIgnore={onSpellCheckIgnore}
                                            onReplace={(val) =>
                                                onSpellCheckReplace?.("experience", originalIdx, val, "description")
                                            }
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        // ── Education ─────────────────────────────────────────────────────────
        education: ({ itemIndices, subItemRanges, zoneId }) => {
            const items = itemIndices
                ? itemIndices.map((idx) => data.education?.[idx])
                : data.education;
            if (!items || items.length === 0) return null;

            return (
                <SectionWrapper
                    sectionId="education"
                    onSectionClick={onSectionClick}
                    isInteractive={isInteractive}
                    label="Education"
                >
                    <div>
                        <SectionTitle title="Education" />
                        {items.map((edu, i) => {
                            if (!edu) return null;
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const isContinuedItem = subItemRanges?.[originalIdx]?.start > 0;
                            const yearStr =
                                edu.year ||
                                edu.date ||
                                edu.endYear ||
                                (edu.startYear
                                    ? `${edu.startYear}–${edu.isCurrent ? "Present" : edu.endYear || ""}`
                                    : "");
                            const metaParts = [yearStr, edu.location].filter(Boolean);

                            return (
                                <div
                                    key={i}
                                    data-item-index={originalIdx}
                                    style={styles.eduBlock}
                                >
                                    {!isContinuedItem && (
                                        <>
                                            <div style={styles.eduInstitution}>
                                                <RichTextSpellCheck
                                                    html={edu.institution || edu.school || ""}
                                                    isActive={isSpellCheckActive}
                                                    onIgnore={onSpellCheckIgnore}
                                                    onReplace={(val) =>
                                                        onSpellCheckReplace?.("education", originalIdx, val, "institution")
                                                    }
                                                />
                                            </div>
                                            {edu.degree && (
                                                <div style={styles.eduDegree}>
                                                    <RichTextSpellCheck
                                                        html={edu.degree}
                                                        isActive={isSpellCheckActive}
                                                        onIgnore={onSpellCheckIgnore}
                                                        onReplace={(val) =>
                                                            onSpellCheckReplace?.("education", originalIdx, val, "degree")
                                                        }
                                                    />
                                                </div>
                                            )}
                                            <div style={styles.eduMeta}>
                                                {metaParts.join(" | ")}
                                                {edu.grade ? ` | CGPA: ${edu.grade}` : ""}
                                            </div>
                                        </>
                                    )}
                                    {edu.description && (
                                        <div
                                            className="resume-rich-text"
                                            style={{ ...styles.expDesc, marginTop: isContinuedItem ? 0 : "4px" }}
                                        >
                                            <SplittableRichText
                                                html={edu.description}
                                                range={subItemRanges?.[originalIdx]}
                                                isActive={isSpellCheckActive}
                                                onIgnore={onSpellCheckIgnore}
                                                onReplace={(val) =>
                                                    onSpellCheckReplace?.("education", originalIdx, val, "description")
                                                }
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

        // ── Skills ────────────────────────────────────────────────────────────
        skills: ({ itemIndices, zoneId }) => {
            const items = itemIndices
                ? itemIndices.map((idx) => data.skills?.[idx]).filter(Boolean)
                : data.skills || [];
            const hasDesc = data.skillsDescription?.trim();

            if (items.length > 0) {
                // Group items by category if they have one
                const grouped = {};
                const ungrouped = [];
                items.forEach((skill) => {
                    const name = typeof skill === "object" ? skill.name : skill;
                    const cat = typeof skill === "object" ? skill.category : null;
                    if (cat) {
                        if (!grouped[cat]) grouped[cat] = [];
                        grouped[cat].push(name);
                    } else {
                        ungrouped.push(name);
                    }
                });

                const hasGroups = Object.keys(grouped).length > 0;

                return (
                    <SectionWrapper
                        sectionId="skills"
                        onSectionClick={onSectionClick}
                        isInteractive={isInteractive}
                        label="Skills"
                    >
                        <div>
                            <SectionTitle title="Skills" />
                            {hasGroups
                                ? Object.entries(grouped).map(([cat, names], gi) => (
                                    <div key={gi} style={{ marginBottom: "8px" }}>
                                        <div style={styles.skillCategory}>{cat}</div>
                                        <ul style={styles.skillList}>
                                            {names.map((n, ni) => (
                                                <li key={ni} style={styles.skillItem}>
                                                    <RichTextSpellCheck
                                                        html={n}
                                                        isActive={isSpellCheckActive}
                                                        onIgnore={onSpellCheckIgnore}
                                                        onReplace={(val) =>
                                                            onSpellCheckReplace?.("skills", ni, val, "name")
                                                        }
                                                    />
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))
                                : null}
                            {ungrouped.length > 0 && (
                                <ul style={styles.skillList}>
                                    {ungrouped.map((n, ni) => (
                                        <li key={ni} style={styles.skillItem}>
                                            <RichTextSpellCheck
                                                html={n}
                                                isActive={isSpellCheckActive}
                                                onIgnore={onSpellCheckIgnore}
                                                onReplace={(val) =>
                                                    onSpellCheckReplace?.("skills", ni, val, "name")
                                                }
                                            />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </SectionWrapper>
                );
            }

            if (hasDesc) {
                return (
                    <SectionWrapper
                        sectionId="skills"
                        onSectionClick={onSectionClick}
                        isInteractive={isInteractive}
                        label="Skills"
                    >
                        <div>
                            <SectionTitle title="Skills" />
                            <div
                                className="resume-rich-text"
                                style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))" }}
                            >
                                <SplittableRichText
                                    html={data.skillsDescription}
                                    isActive={isSpellCheckActive}
                                    onIgnore={onSpellCheckIgnore}
                                    onReplace={(val) =>
                                        onSpellCheckReplace?.("skills", "skillsDescription", val)
                                    }
                                />
                            </div>
                        </div>
                    </SectionWrapper>
                );
            }

            return null;
        },

        // ── Strengths / Additional Skills ─────────────────────────────────────
        strengths: ({ itemIndices, zoneId }) => {
            const items = itemIndices
                ? itemIndices.map((idx) => data.strengths?.[idx]).filter(Boolean)
                : data.strengths || [];
            if (items.length === 0) return null;
            return (
                <SectionWrapper
                    sectionId="strengths"
                    navigationId="skills"
                    onSectionClick={onSectionClick}
                    isInteractive={isInteractive}
                    label="Key Strengths"
                >
                    <div>
                        <SectionTitle title="Key Strengths" />
                        <ul style={styles.skillList}>
                            {items.map((s, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <li key={i} data-item-index={originalIdx} style={styles.skillItem}>
                                        <RichTextSpellCheck
                                            html={typeof s === "object" ? s.name : s}
                                            isActive={isSpellCheckActive}
                                            onIgnore={onSpellCheckIgnore}
                                            onReplace={(val) =>
                                                onSpellCheckReplace?.("strengths", originalIdx, val, "name")
                                            }
                                        />
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </SectionWrapper>
            );
        },

        additionalSkills: ({ itemIndices, zoneId }) => {
            const items = itemIndices
                ? itemIndices.map((idx) => data.additionalSkills?.[idx]).filter(Boolean)
                : data.additionalSkills || [];
            if (items.length === 0) return null;
            return (
                <SectionWrapper
                    sectionId="additionalSkills"
                    navigationId="skills"
                    onSectionClick={onSectionClick}
                    isInteractive={isInteractive}
                    label="Additional Skills"
                >
                    <div>
                        <SectionTitle title="Additional Skills" />
                        <ul style={styles.skillList}>
                            {items.map((s, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <li key={i} data-item-index={originalIdx} style={styles.skillItem}>
                                        <RichTextSpellCheck
                                            html={typeof s === "object" ? s.name : s}
                                            isActive={isSpellCheckActive}
                                            onIgnore={onSpellCheckIgnore}
                                            onReplace={(val) =>
                                                onSpellCheckReplace?.("additionalSkills", originalIdx, val, "name")
                                            }
                                        />
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </SectionWrapper>
            );
        },

        // ── Projects ──────────────────────────────────────────────────────────
        projects: ({ itemIndices, subItemRanges, zoneId }) => {
            const items = itemIndices
                ? itemIndices.map((idx) => data.projects?.[idx])
                : data.projects;
            if (!items || items.length === 0) return null;

            return (
                <SectionWrapper
                    sectionId="projects"
                    onSectionClick={onSectionClick}
                    isInteractive={isInteractive}
                    label="Projects"
                >
                    <div>
                        <SectionTitle title="Project" />
                        {items.map((proj, i) => {
                            if (!proj) return null;
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const isContinuedItem = subItemRanges?.[originalIdx]?.start > 0;
                            const techStr =
                                proj.technologies?.length > 0
                                    ? proj.technologies.join(" | ")
                                    : null;

                            return (
                                <div
                                    key={i}
                                    data-item-index={originalIdx}
                                    style={styles.projBlock}
                                >
                                    {!isContinuedItem && (
                                        <div style={styles.projTitleRow}>
                                            <span style={styles.projName}>
                                                <RichTextSpellCheck
                                                    html={proj.title || ""}
                                                    isActive={isSpellCheckActive}
                                                    onIgnore={onSpellCheckIgnore}
                                                    onReplace={(val) =>
                                                        onSpellCheckReplace?.("projects", originalIdx, val, "title")
                                                    }
                                                />
                                            </span>
                                            {techStr && (
                                                <>
                                                    <span style={styles.expPipe}>|</span>
                                                    <span style={styles.projTech}>{techStr}</span>
                                                </>
                                            )}
                                        </div>
                                    )}
                                    <div className="resume-rich-text" style={styles.projDesc}>
                                        <SplittableRichText
                                            html={proj.description}
                                            range={subItemRanges?.[originalIdx]}
                                            isActive={isSpellCheckActive}
                                            onIgnore={onSpellCheckIgnore}
                                            onReplace={(val) =>
                                                onSpellCheckReplace?.("projects", originalIdx, val, "description")
                                            }
                                        />
                                    </div>
                                    {proj.link && (
                                        <div
                                            style={{
                                                fontSize: "calc(11px * var(--theme-font-scale, 1))",
                                                color: mutedText,
                                                marginTop: "3px",
                                            }}
                                        >
                                            <ResumeLink href={proj.link}>{proj.link}</ResumeLink>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        // ── Awards ────────────────────────────────────────────────────────────
        awards: ({ itemIndices, zoneId }) => {
            const items = itemIndices
                ? itemIndices.map((idx) => data.awards?.[idx])
                : data.awards;
            if (!items || items.length === 0) return null;

            return (
                <SectionWrapper
                    sectionId="awards"
                    onSectionClick={onSectionClick}
                    isInteractive={isInteractive}
                    label="Awards"
                >
                    <div>
                        <SectionTitle title="Awards" />
                        {items.map((award, i) => (
                            <div key={i} style={styles.awardRow}>
                                <span style={styles.awardYear}>
                                    <RichTextSpellCheck
                                        html={award.year || award.date || ""}
                                        isActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onReplace={(val) =>
                                            onSpellCheckReplace?.("awards", itemIndices ? itemIndices[i] : i, val, "year")
                                        }
                                    />
                                </span>
                                <span style={styles.awardTitle}>
                                    <RichTextSpellCheck
                                        html={award.title || ""}
                                        isActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onReplace={(val) =>
                                            onSpellCheckReplace?.("awards", itemIndices ? itemIndices[i] : i, val, "title")
                                        }
                                    />
                                </span>
                                <span style={styles.awardIssuer}>
                                    <RichTextSpellCheck
                                        html={award.issuer || ""}
                                        isActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onReplace={(val) =>
                                            onSpellCheckReplace?.("awards", itemIndices ? itemIndices[i] : i, val, "issuer")
                                        }
                                    />
                                </span>
                            </div>
                        ))}
                    </div>
                </SectionWrapper>
            );
        },

        // ── Languages ─────────────────────────────────────────────────────────
        languages: ({ itemIndices, zoneId }) => {
            const items = itemIndices
                ? itemIndices.map((idx) => data.languages?.[idx])
                : data.languages;
            if (!items || items.length === 0) return null;

            return (
                <SectionWrapper
                    sectionId="languages"
                    onSectionClick={onSectionClick}
                    isInteractive={isInteractive}
                    label="Languages"
                >
                    <div>
                        <SectionTitle title="Languages" />
                        {items.map((lang, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            return (
                                <LanguageItem
                                    key={i}
                                    item={lang}
                                    index={originalIdx}
                                    isSpellCheckActive={isSpellCheckActive}
                                    onIgnore={onSpellCheckIgnore}
                                    onSpellCheckReplace={(field, val) =>
                                        onSpellCheckReplace?.("languages", originalIdx, val, field)
                                    }
                                />
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        // ── Certifications ────────────────────────────────────────────────────
        certifications: ({ itemIndices, subItemRanges, zoneId }) => {
            const items = itemIndices
                ? itemIndices.map((idx) => data.certifications?.[idx])
                : data.certifications;
            if (!items || items.length === 0) return null;

            return (
                <SectionWrapper
                    sectionId="certifications"
                    onSectionClick={onSectionClick}
                    isInteractive={isInteractive}
                    label="Certifications"
                >
                    <div>
                        <SectionTitle title="Certifications" />
                        {items.map((cert, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            return (
                                <CertificationItem
                                    key={i}
                                    item={cert}
                                    index={originalIdx}
                                    isSpellCheckActive={isSpellCheckActive}
                                    onIgnore={onSpellCheckIgnore}
                                    onSpellCheckReplace={(field, val) =>
                                        onSpellCheckReplace?.("certifications", originalIdx, val, field)
                                    }
                                    variant="compact"
                                    subItemRange={subItemRanges?.[originalIdx]}
                                />
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        // ── Software ──────────────────────────────────────────────────────────
        software: ({ itemIndices, subItemRanges, zoneId }) => {
            const items = itemIndices
                ? itemIndices.map((idx) => data.software?.[idx])
                : data.software;
            if (!items || items.length === 0) return null;

            return (
                <SectionWrapper
                    sectionId="software"
                    onSectionClick={onSectionClick}
                    isInteractive={isInteractive}
                    label="Software"
                >
                    <div>
                        <SectionTitle title="Software" />
                        {items.map((item, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            return (
                                <SoftwareItem
                                    key={i}
                                    item={item}
                                    index={originalIdx}
                                    isSpellCheckActive={isSpellCheckActive}
                                    onIgnore={onSpellCheckIgnore}
                                    onSpellCheckReplace={(field, val) =>
                                        onSpellCheckReplace?.("software", originalIdx, val, field)
                                    }
                                    variant="compact"
                                    subItemRange={subItemRanges?.[originalIdx]}
                                />
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        // ── Contact ───────────────────────────────────────────────────────────
        contact: ({ zoneId }) => {
            const hasContact =
                personal?.phone || personal?.email || personal?.city;
            if (!hasContact) return null;

            return (
                <SectionWrapper
                    sectionId="contact"
                    onSectionClick={onSectionClick}
                    isInteractive={isInteractive}
                    label="Contact"
                >
                    <div>
                        <SectionTitle title="Contact" />
                        {personal?.city && (
                            <>
                                <div style={styles.contactLabel}>Location</div>
                                <div style={styles.contactValue}>
                                    <SpellCheckText
                                        text={[personal.city, personal.state, personal.country].filter(Boolean).join(", ")}
                                        isActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onReplace={(val) => onSpellCheckReplace?.("personal", "city", val)}
                                    />
                                </div>
                            </>
                        )}
                        {personal?.phone && (
                            <>
                                <div style={styles.contactLabel}>Phone</div>
                                <div style={styles.contactValue}>
                                    <ResumeLink href={personal.phone}>
                                        <SpellCheckText
                                            text={personal.phone}
                                            isActive={isSpellCheckActive}
                                            onIgnore={onSpellCheckIgnore}
                                            onReplace={(val) => onSpellCheckReplace?.("personal", "phone", val)}
                                        />
                                    </ResumeLink>
                                </div>
                            </>
                        )}
                        {personal?.email && (
                            <>
                                <div style={styles.contactLabel}>Email</div>
                                <div style={styles.contactValue}>
                                    <ResumeLink href={personal.email}>
                                        <SpellCheckText
                                            text={personal.email}
                                            isActive={isSpellCheckActive}
                                            onIgnore={onSpellCheckIgnore}
                                            onReplace={(val) => onSpellCheckReplace?.("personal", "email", val)}
                                        />
                                    </ResumeLink>
                                </div>
                            </>
                        )}
                        {personal?.linkedin && (
                            <>
                                <div style={styles.contactLabel}>LinkedIn</div>
                                <div style={styles.contactValue}>
                                    <ResumeLink href={personal.linkedin}>
                                        <SpellCheckText
                                            text={personal.linkedin}
                                            isActive={isSpellCheckActive}
                                            onIgnore={onSpellCheckIgnore}
                                            onReplace={(val) => onSpellCheckReplace?.("personal", "linkedin", val)}
                                        />
                                    </ResumeLink>
                                </div>
                            </>
                        )}
                        {personal?.github && (
                            <>
                                <div style={styles.contactLabel}>GitHub</div>
                                <div style={styles.contactValue}>
                                    <ResumeLink href={personal.github}>
                                        <SpellCheckText
                                            text={personal.github}
                                            isActive={isSpellCheckActive}
                                            onIgnore={onSpellCheckIgnore}
                                            onReplace={(val) => onSpellCheckReplace?.("personal", "github", val)}
                                        />
                                    </ResumeLink>
                                </div>
                            </>
                        )}
                        {personal?.website && (
                            <>
                                <div style={styles.contactLabel}>Portfolio</div>
                                <div style={styles.contactValue}>
                                    <ResumeLink href={personal.website}>
                                        <SpellCheckText
                                            text={personal.website}
                                            isActive={isSpellCheckActive}
                                            onIgnore={onSpellCheckIgnore}
                                            onReplace={(val) => onSpellCheckReplace?.("personal", "website", val)}
                                        />
                                    </ResumeLink>
                                </div>
                            </>
                        )}
                    </div>
                </SectionWrapper>
            );
        },

        // ── Personal Details ──────────────────────────────────────────────────
        personalDetails: ({ zoneId }) => {
            const details = [
                { label: "Born", value: personal?.dob, field: "dob" },
                { label: "Nationality", value: personal?.nationality, field: "nationality" },
                { label: "Gender", value: personal?.gender, field: "gender" },
                { label: "Marital Status", value: personal?.maritalStatus, field: "maritalStatus" },
                { label: "Visa Status", value: personal?.visaStatus, field: "visaStatus" },
                { label: "Driving License", value: personal?.drivingLicense, field: "drivingLicense" },
                { label: "Other", value: personal?.otherPersonal, field: "otherPersonal" },
            ].filter((d) => d.value);

            if (details.length === 0) return null;
            return (
                <SectionWrapper
                    sectionId="personalDetails"
                    onSectionClick={onSectionClick}
                    isInteractive={isInteractive}
                    label="Personal Details"
                >
                    <div>
                        <SectionTitle title="Personal Details" />
                        {details.map((d, i) => (
                            <React.Fragment key={i}>
                                <div style={styles.contactLabel}>{d.label}</div>
                                <div style={styles.contactValue}>
                                    <SpellCheckText
                                        text={d.value}
                                        isActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onReplace={(val) => onSpellCheckReplace?.("personal", d.field, val)}
                                    />
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </SectionWrapper>
            );
        },

        // ── Websites & Portfolios ─────────────────────────────────────────────
        websites: ({ itemIndices, zoneId }) => {
            const items = itemIndices
                ? itemIndices.map((idx) => data.websites?.[idx])
                : data.websites;
            const links = (items || [])
                .map((l, i) => ({ ...l, originalIdx: itemIndices ? itemIndices[i] : i }))
                .filter((l) => l.url);

            if (links.length === 0) return null;
            return (
                <SectionWrapper
                    sectionId="websites"
                    onSectionClick={onSectionClick}
                    isInteractive={isInteractive}
                    label="Websites & Portfolios"
                >
                    <div>
                        <SectionTitle title="Websites & Portfolios" />
                        {links.map((site, i) => (
                            <React.Fragment key={i}>
                                <div style={styles.contactLabel}>{site.label || "Portfolio"}</div>
                                <div style={styles.contactValue}>
                                    <ResumeLink href={site.url}>
                                        <SpellCheckText
                                            text={site.url}
                                            isActive={isSpellCheckActive}
                                            onIgnore={onSpellCheckIgnore}
                                            onReplace={(val) =>
                                                onSpellCheckReplace?.("websites", site.originalIdx, val, "url")
                                            }
                                        />
                                    </ResumeLink>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </SectionWrapper>
            );
        },

        // ── Interests ─────────────────────────────────────────────────────────
        interests: ({ itemIndices, zoneId }) => {
            const items = itemIndices
                ? itemIndices.map((idx) => data.interests?.[idx])
                : data.interests;
            if (!items || items.length === 0) return null;

            return (
                <SectionWrapper
                    sectionId="interests"
                    onSectionClick={onSectionClick}
                    isInteractive={isInteractive}
                    label="Interests"
                >
                    <div>
                        <SectionTitle title="Interests" />
                        <ul style={styles.genericList}>
                            {items.map((item, i) => (
                                <li key={i} style={styles.genericItem}>
                                    <RichTextSpellCheck
                                        html={typeof item === "object" ? item.name : item}
                                        isActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onReplace={(val) =>
                                            onSpellCheckReplace?.("interests", itemIndices ? itemIndices[i] : i, val, "name")
                                        }
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </SectionWrapper>
            );
        },

        // ── Volunteering ──────────────────────────────────────────────────────
        volunteering: ({ itemIndices, subItemRanges, zoneId }) => {
            const items = itemIndices
                ? itemIndices.map((idx) => data.volunteering?.[idx] || data.volunteer?.[idx])
                : data.volunteering || data.volunteer;
            if (!items || items.length === 0) return null;

            return (
                <SectionWrapper
                    sectionId="volunteering"
                    onSectionClick={onSectionClick}
                    isInteractive={isInteractive}
                    label="Volunteering"
                >
                    <div>
                        <SectionTitle title="Volunteering" />
                        {items.map((item, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.expBlock}>
                                    <div style={styles.expTitleRow}>
                                        <span style={styles.expCompany}>
                                            <RichTextSpellCheck
                                                html={item.organization || item.company || ""}
                                                isActive={isSpellCheckActive}
                                                onIgnore={onSpellCheckIgnore}
                                                onReplace={(val) =>
                                                    onSpellCheckReplace?.("volunteering", originalIdx, val, "organization")
                                                }
                                            />
                                        </span>
                                        {(item.role || item.title) && (
                                            <>
                                                <span style={styles.expPipe}>|</span>
                                                <span style={styles.expRole}>
                                                    <RichTextSpellCheck
                                                        html={item.role || item.title || ""}
                                                        isActive={isSpellCheckActive}
                                                        onIgnore={onSpellCheckIgnore}
                                                        onReplace={(val) =>
                                                            onSpellCheckReplace?.("volunteering", originalIdx, val, "role")
                                                        }
                                                    />
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    <div style={styles.expMeta}>
                                        {[item.startDate, item.isCurrent ? "Present" : item.endDate].filter(Boolean).join(" – ")}
                                        {item.location && ` | ${item.location}`}
                                    </div>
                                    {item.description && (
                                        <div className="resume-rich-text" style={styles.expDesc}>
                                            <SplittableRichText
                                                html={item.description}
                                                range={subItemRanges?.[originalIdx]}
                                                isActive={isSpellCheckActive}
                                                onIgnore={onSpellCheckIgnore}
                                                onReplace={(val) =>
                                                    onSpellCheckReplace?.("volunteering", originalIdx, val, "description")
                                                }
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

        // ── Publications ──────────────────────────────────────────────────────
        publications: ({ itemIndices, zoneId }) => {
            const items = itemIndices
                ? itemIndices.map((idx) => data.publications?.[idx])
                : data.publications;
            if (!items || items.length === 0) return null;

            return (
                <SectionWrapper
                    sectionId="publications"
                    onSectionClick={onSectionClick}
                    isInteractive={isInteractive}
                    label="Publications"
                >
                    <div>
                        <SectionTitle title="Publications" />
                        {items.map((pub, i) => (
                            <div key={i} style={{ marginBottom: "10px", pageBreakInside: "avoid" }}>
                                <div style={{ fontWeight: "700", fontSize: "calc(12.5px * var(--theme-font-scale, 1))", color: "#1a1a1a" }}>
                                    <RichTextSpellCheck
                                        html={pub.name || pub.title || ""}
                                        isActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onReplace={(val) =>
                                            onSpellCheckReplace?.("publications", itemIndices ? itemIndices[i] : i, val, "name")
                                        }
                                    />
                                </div>
                                <div style={{ fontSize: "calc(11.5px * var(--theme-font-scale, 1))", color: mutedText, fontStyle: "italic" }}>
                                    <RichTextSpellCheck
                                        html={pub.publisher || ""}
                                        isActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onReplace={(val) =>
                                            onSpellCheckReplace?.("publications", itemIndices ? itemIndices[i] : i, val, "publisher")
                                        }
                                    />
                                    {pub.releaseDate && <span> · {pub.releaseDate}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionWrapper>
            );
        },

        // ── References ────────────────────────────────────────────────────────
        references: ({ itemIndices, zoneId }) => {
            const items = itemIndices
                ? itemIndices.map((idx) => data.references?.[idx])
                : data.references;
            if (!items || items.length === 0) return null;

            return (
                <SectionWrapper
                    sectionId="references"
                    onSectionClick={onSectionClick}
                    isInteractive={isInteractive}
                    label="References"
                >
                    <div>
                        <SectionTitle title="References" />
                        {items.map((ref, i) => (
                            <div key={i} style={{ marginBottom: "12px", pageBreakInside: "avoid" }}>
                                <div style={{ fontWeight: "700", fontSize: "calc(12.5px * var(--theme-font-scale, 1))", color: "#1a1a1a" }}>
                                    <RichTextSpellCheck
                                        html={ref.name || ""}
                                        isActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onReplace={(val) =>
                                            onSpellCheckReplace?.("references", itemIndices ? itemIndices[i] : i, val, "name")
                                        }
                                    />
                                </div>
                                <div style={{ fontSize: "calc(11.5px * var(--theme-font-scale, 1))", color: mutedText }}>
                                    <RichTextSpellCheck
                                        html={ref.company || ref.title || ""}
                                        isActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onReplace={(val) =>
                                            onSpellCheckReplace?.("references", itemIndices ? itemIndices[i] : i, val, "company")
                                        }
                                    />
                                </div>
                                {ref.contact && (
                                    <div style={{ fontSize: "calc(11px * var(--theme-font-scale, 1))", color: mutedText }}>
                                        <RichTextSpellCheck
                                            html={ref.contact}
                                            isActive={isSpellCheckActive}
                                            onIgnore={onSpellCheckIgnore}
                                            onReplace={(val) =>
                                                onSpellCheckReplace?.("references", itemIndices ? itemIndices[i] : i, val, "contact")
                                            }
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </SectionWrapper>
            );
        },

        // ── Affiliations ──────────────────────────────────────────────────────
        affiliations: ({ itemIndices, zoneId }) => {
            const items = itemIndices
                ? itemIndices.map((idx) => data.affiliations?.[idx])
                : data.affiliations;
            if (!items || items.length === 0) return null;

            return (
                <SectionWrapper
                    sectionId="affiliations"
                    onSectionClick={onSectionClick}
                    isInteractive={isInteractive}
                    label="Affiliations"
                >
                    <div>
                        <SectionTitle title="Affiliations" />
                        {items.map((aff, i) => (
                            <div key={i} style={{ marginBottom: "10px", pageBreakInside: "avoid" }}>
                                <div style={{ fontWeight: "700", fontSize: "calc(12.5px * var(--theme-font-scale, 1))", color: "#1a1a1a" }}>
                                    <RichTextSpellCheck
                                        html={aff.name || ""}
                                        isActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onReplace={(val) =>
                                            onSpellCheckReplace?.("affiliations", itemIndices ? itemIndices[i] : i, val, "name")
                                        }
                                    />
                                </div>
                                <div style={{ fontSize: "calc(11.5px * var(--theme-font-scale, 1))", color: mutedText }}>
                                    <RichTextSpellCheck
                                        html={aff.role || aff.description || ""}
                                        isActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onReplace={(val) =>
                                            onSpellCheckReplace?.("affiliations", itemIndices ? itemIndices[i] : i, val, "role")
                                        }
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionWrapper>
            );
        },

        // ── Additional Info ───────────────────────────────────────────────────
        additionalInfo: ({ subItemRanges, zoneId }) => {
            const html = data.additionalInfo || "";
            if (!html || html.trim() === "" || html === "<p><br></p>") return null;

            return (
                <SectionWrapper
                    sectionId="additionalInfo"
                    onSectionClick={onSectionClick}
                    isInteractive={isInteractive}
                    label="Additional Information"
                >
                    <div>
                        <SectionTitle title="Additional Information" />
                        <div
                            className="resume-rich-text"
                            style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", lineHeight: "1.6" }}
                        >
                            <SplittableRichText
                                html={html}
                                range={subItemRanges?.additionalInfo}
                                isActive={isSpellCheckActive}
                                onIgnore={onSpellCheckIgnore}
                                onReplace={(val) =>
                                    onSpellCheckReplace?.("additionalInfo", "additionalInfo", val)
                                }
                            />
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        // ── Custom Section ────────────────────────────────────────────────────
        custom: ({ subItemRanges, zoneId }) => {
            if (!data.customSection?.isVisible || !data.customSection?.content) return null;
            const content = data.customSection.content;
            if (!content || content.trim() === "" || content === "<p><br></p>") return null;
            const title = data.customSection.title || "Additional Information";

            return (
                <SectionWrapper
                    sectionId="custom"
                    onSectionClick={onSectionClick}
                    isInteractive={isInteractive}
                    label={title}
                >
                    <div>
                        <SectionTitle title={title} />
                        <div
                            className="resume-rich-text"
                            style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", lineHeight: "1.6" }}
                        >
                            <SplittableRichText
                                html={content}
                                range={subItemRanges?.custom}
                                isActive={isSpellCheckActive}
                                onIgnore={onSpellCheckIgnore}
                                onReplace={(val) =>
                                    onSpellCheckReplace?.("customSection", "content", val)
                                }
                            />
                        </div>
                    </div>
                </SectionWrapper>
            );
        },
    };

    // ─── RENDER ZONE ──────────────────────────────────────────────────────────
    const renderZone = (id, items, columnStyle) => (
        <DroppableZone id={id} style={columnStyle}>
            {items.map((sid, idx) => {
                const isContinued = typeof sid === "object" && sid.isContinued;
                const sectionId = typeof sid === "string" ? sid : sid.id;
                const dragId = isContinued
                    ? `${id}-cont-${sectionId}-${idx}`
                    : sectionId;

                return (
                    <DraggableSection
                        key={dragId}
                        id={dragId}
                        isEnabled={canReorder && !isContinued}
                    >
                        <div style={{ paddingBottom: "1px" }}>
                            <SectionRenderer
                                sectionId={sectionId}
                                data={data}
                                onSectionClick={onSectionClick}
                                isContinued={isContinued}
                                itemIndices={typeof sid === "object" ? sid.itemIndices : undefined}
                                subItemRanges={typeof sid === "object" ? sid.subItemRanges : undefined}
                                customRenderers={customRenderers}
                                zoneId={id}
                            />
                        </div>
                    </DraggableSection>
                );
            })}
        </DroppableZone>
    );

    // ─── MEASURER (for pagination) ────────────────────────────────────────────
    const Measurer = () => (
        <div
            className="resume-measurer"
            style={{
                position: "absolute",
                top: -10000,
                left: -10000,
                width: "210mm",
                visibility: "hidden",
            }}
        >
            <div
                className="page-height-marker"
                style={{ height: "297mm", width: "1px", position: "absolute", left: 0, top: 0 }}
            />
            <div style={{ ...styles.page, height: "auto" }}>
                <Header />
                <div style={styles.body}>
                    <div data-column-id="sidebar" style={styles.sidebar}>
                        {activeSidebarSections.map((sid) => (
                            <SectionRenderer
                                key={sid}
                                sectionId={sid}
                                data={data}
                                customRenderers={customRenderers}
                            />
                        ))}
                    </div>
                    <div data-column-id="main" style={styles.main}>
                        {activeMainSections.map((sid) => (
                            <SectionRenderer
                                key={sid}
                                sectionId={sid}
                                data={data}
                                customRenderers={customRenderers}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    // ─── RENDER ───────────────────────────────────────────────────────────────
    return (
        <div ref={containerRef} className="academic-two-column-root">
            <Measurer />
            <DndContext {...dndContextProps}>
                <SortableContext
                    items={[...activeSidebarSections, ...activeMainSections]}
                    strategy={verticalListSortingStrategy}
                >
                    {showPageBreaks && pages ? (
                        pages.map((page, i) => (
                            <div key={i} style={styles.page}>
                                {i === 0 && <Header />}
                                <div style={{ ...styles.body, flex: 1 }}>
                                    <div style={styles.sidebar}>
                                        {renderZone(`sidebar-p${i}`, page.sidebar, {
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "calc(22px * var(--theme-section-margin, 1))",
                                        })}
                                    </div>
                                    <div style={styles.main}>
                                        {renderZone(`main-p${i}`, page.main, {
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "calc(22px * var(--theme-section-margin, 1))",
                                        })}
                                    </div>
                                </div>
                                <div
                                    style={{
                                        position: "absolute",
                                        bottom: "12px",
                                        right: "18px",
                                        fontSize: "9px",
                                        color: "#aaa",
                                        fontFamily: sansFont,
                                    }}
                                >
                                    Page {i + 1}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ ...styles.page, height: "auto", minHeight: "297mm" }}>
                            <Header />
                            <div style={styles.body}>
                                <div style={styles.sidebar}>
                                    {renderZone("sidebar", activeSidebarSections, {
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "calc(22px * var(--theme-section-margin, 1))",
                                    })}
                                </div>
                                <div style={styles.main}>
                                    {renderZone("main", activeMainSections, {
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "calc(22px * var(--theme-section-margin, 1))",
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </SortableContext>
                <StableResumeDragOverlay
                    activeId={activeId}
                    scale={scale}
                    renderSection={(id) => (
                        <div
                            style={{
                                background: "white",
                                padding: "10px 14px",
                                border: "1px solid #e5e5e5",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                width: "280px",
                            }}
                        >
                            <SectionRenderer
                                sectionId={id}
                                data={data}
                                customRenderers={customRenderers}
                            />
                        </div>
                    )}
                />
            </DndContext>
        </div>
    );
};

export default AcademicTwoColumn;