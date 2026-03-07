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
 * SaanviClassic Template
 *
 * Exact reproduction of reference image layout:
 *
 * ┌─────────────────────────────────────────────────────────┐
 * │  [sidebar 33% - dark charcoal]  │  [main 67% - white]  │
 * │  ┌──────────────────────────┐   │  ┌─────────────────┐  │
 * │  │  light-blue accent band  │   │  │  light-blue band│  │
 * │  │  (with circular photo    │   │  │  NAME + TITLE   │  │
 * │  │   overlapping bottom)    │   │  └─────────────────┘  │
 * │  └──────────────────────────┘   │                       │
 * │                                  │  PROFESSIONAL SUMMARY │
 * │  @ email (centered)             │  SKILLS (2-col list)  │
 * │  📞 phone                       │  WORK HISTORY         │
 * │  📍 location                    │                       │
 * │  ─────── divider ───────        │                       │
 * │  EDUCATION                      │                       │
 * │    Diploma, ...                 │                       │
 * │    Oxford...                    │                       │
 * └──────────────────────────────────────────────────────────┘
 */
const DarkEdge = ({
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

    // ── LAYOUT ──────────────────────────────────────────────
    const templateId = 'dark-edge';
    const initialLayout = getSavedLayout(data, templateId, {
        main: ['summary', 'skills', 'experience', 'projects', 'additionalInfo', 'custom', 'awards', 'volunteering', 'publications', 'affiliations'],
        sidebar: ['contact', 'websites', 'education', 'languages', 'certifications', 'strengths', 'additionalSkills', 'software', 'interests', 'personalDetails']
    });

    const completeLayout = getCompleteLayout(data, initialLayout, 'main');
    const activeMainSections = completeLayout.main || [];
    const activeSidebarSections = completeLayout.sidebar || [];

    // ── DND ─────────────────────────────────────────────────
    const { dndContextProps, activeId } = useResumeDragAndDrop({
        data, onReorder, scale,
        containers: { main: activeMainSections, sidebar: activeSidebarSections }
    });

    // ── PAGINATION ──────────────────────────────────────────
    const pages = useAutoPagination({
        columns: { main: activeMainSections, sidebar: activeSidebarSections },
        data, enabled: showPageBreaks, containerRef, scale
    });

    // ── DESIGN TOKENS ────────────────────────────────────────
    const ACCENT = "var(--theme-color, #b8d4e8)";
    const SIDEBAR_BG = "#2d2d2d";
    const SIDEBAR_TEXT = "#e0e0e0";
    const SIDEBAR_MUTED = "#999999";
    const SIDEBAR_WHITE = "#ffffff";
    const PHOTO_D = "100px";
    const BAND_H = "130px";

    // ── STYLES ───────────────────────────────────────────────
    const S = {
        page: {
            width: "210mm",
            height: "297mm",
            background: "white",
            boxSizing: "border-box",
            position: "relative",
            margin: "0 auto 30px auto",
            display: "flex",
            flexDirection: "row",
            fontFamily: "var(--theme-font, 'Arial', 'Helvetica Neue', sans-serif)",
            color: "#333",
            overflow: "hidden",
        },

        /* ── SIDEBAR ── */
        sidebar: {
            width: "33%",
            minWidth: "33%",
            background: SIDEBAR_BG,
            display: "flex",
            flexDirection: "column",
            position: "relative",
            color: SIDEBAR_TEXT,
            "--theme-text-primary": SIDEBAR_WHITE,
            "--theme-text-muted": SIDEBAR_TEXT,
            "--theme-text-dim": SIDEBAR_MUTED,
            "--theme-border-color": "rgba(255,255,255,0.1)",
        },
        sidebarBand: {
            background: ACCENT,
            height: BAND_H,
            width: "100%",
            flexShrink: 0,
            position: "relative",
        },
        photoWrap: {
            position: "absolute",
            bottom: `calc(-${PHOTO_D} / 2)`,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 3,
        },
        photo: {
            width: PHOTO_D,
            height: PHOTO_D,
            borderRadius: "50%",
            objectFit: "cover",
            border: "4px solid white",
            display: "block",
        },
        photoPlaceholder: {
            width: PHOTO_D,
            height: PHOTO_D,
            borderRadius: "50%",
            background: "#888",
            border: "4px solid white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        sidebarBody: {
            display: "flex",
            flexDirection: "column",
            paddingTop: `calc(${PHOTO_D} / 2 + 18px)`,
        },
        contactZone: {
            textAlign: "left",
            padding: "0 16px 8px 16px",
        },
        contactRow: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "10px",
            marginBottom: "calc(6px * var(--theme-paragraph-margin, 1))",
        },
        contactIcon: {
            color: SIDEBAR_MUTED,
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "16px",
        },
        contactTxt: {
            color: SIDEBAR_TEXT,
            fontSize: "calc(11.5px * var(--theme-font-scale, 1))",
            wordBreak: "break-all",
            overflowWrap: "break-word",
            lineHeight: "1.4",
        },
        divider: {
            height: "1px",
            background: "rgba(255,255,255,0.08)",
            margin: "8px 16px 16px 16px",
        },
        sidebarSections: {
            padding: "0 16px",
            display: "flex",
            flexDirection: "column",
            gap: "calc(18px * var(--theme-section-margin, 1))",
        },
        sbTitle: {
            fontSize: "calc(10.5px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: SIDEBAR_WHITE,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            marginBottom: "8px",
        },
        sbText: {
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            color: SIDEBAR_TEXT,
            lineHeight: "1.45",
        },
        sbBold: {
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: SIDEBAR_WHITE,
            lineHeight: "1.45",
        },
        sbMuted: {
            fontSize: "calc(11px * var(--theme-font-scale, 1))",
            color: SIDEBAR_MUTED,
            marginTop: "1px",
        },

        /* ── BODY ── */
        body: {
            display: "flex",
            flexDirection: "row",
            flex: 1,
            minHeight: 0,
        },

        main: {
            width: "67%",
            display: "flex",
            flexDirection: "column",
        },
        mainBand: {
            background: ACCENT,
            height: BAND_H,
            padding: "0 36px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flexShrink: 0,
        },
        name: {
            fontSize: "calc(30px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: "#1a1a1a",
            margin: 0,
            lineHeight: 1.1,
            letterSpacing: "2px",
            textTransform: "uppercase",
        },
        profession: {
            fontSize: "calc(12.5px * var(--theme-font-scale, 1))",
            fontWeight: "400",
            color: "var(--theme-text-muted, #444)",
            marginTop: "5px",
            letterSpacing: "0.3px",
        },
        mainContent: {
            padding: "24px var(--theme-page-margin, 36px) var(--theme-page-margin, 36px) var(--theme-page-margin, 36px)",
            display: "flex",
            flexDirection: "column",
            gap: "calc(20px * var(--theme-section-margin, 1))",
        },
        secTitle: {
            fontSize: "calc(12.5px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: "#111",
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            borderBottom: "1px solid #c8c8c8",
            paddingBottom: "5px",
            marginBottom: "13px",
        },
        skillGrid: {
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3px 16px",
        },
        skillItem: {
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            color: "var(--theme-text-muted, #333)",
            lineHeight: "1.9",
            display: "flex",
            alignItems: "center",
            gap: "6px",
        },
        expDate: {
            fontSize: "calc(11.5px * var(--theme-font-scale, 1))",
            color: "var(--theme-text-muted, #555)",
            marginBottom: "2px",
        },
        expTitle: {
            fontSize: "calc(13px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: "var(--theme-text-primary, #111)",
            display: "inline",
        },
        expCompany: {
            fontSize: "calc(12.5px * var(--theme-font-scale, 1))",
            color: "var(--theme-text-muted, #555)",
            display: "inline",
        },
        expBlock: {
            marginBottom: "calc(18px * var(--theme-paragraph-margin, 1))",
        },
    };

    // ── SVG ICONS ────────────────────────────────────────────
    const IconEmail = () => (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
        </svg>
    );
    const IconPhone = () => (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 1.28h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
    );
    const IconLocation = () => (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    );
    const IconPerson = () => (
        <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );

    // ── SECTION TITLE HELPERS ────────────────────────────────
    const SectionTitle = ({ title, zoneId }) => {
        const { isContinued } = useSectionContext();
        const isSidebar = zoneId?.toLowerCase().includes('sidebar');
        return isSidebar ? <SbTitle title={title} /> : <MainTitle title={title} />;
    };

    const MainTitle = ({ title }) => {
        const { isContinued } = useSectionContext();
        return <h3 style={S.secTitle}>{isContinued ? `${title} (Cont.)` : title}</h3>;
    };

    const SbTitle = ({ title }) => {
        const { isContinued } = useSectionContext();
        return <h3 style={S.sbTitle}>{isContinued ? `${title} (Cont.)` : title}</h3>;
    };

    // ── CUSTOM RENDERERS ─────────────────────────────────────
    const customRenderers = {

        summary: ({ isContinued, subItemRanges, zoneId }) => (
            <SectionWrapper sectionId="summary" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Summary">
                <div>
                    <SectionTitle title="Professional Summary" zoneId={zoneId} />
                    <div className="resume-rich-text" style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", lineHeight: "var(--theme-line-height, 1.65)", marginTop: "2px", color: zoneId?.toLowerCase().includes('sidebar') ? SIDEBAR_TEXT : "#333" }}>
                        <SplittableRichText html={data.summary} range={subItemRanges?.summary} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('summary', 'summary', val)} />
                    </div>
                </div>
            </SectionWrapper>
        ),

        skills: ({ itemIndices, isContinued, zoneId }) => {
            const isSidebar = zoneId?.toLowerCase().includes('sidebar');
            const items = itemIndices ? itemIndices.map(idx => data.skills?.[idx]).filter(Boolean) : (data.skills || []);
            const hasDesc = data.skillsDescription && data.skillsDescription.trim();

            if (items.length > 0) {
                return (
                    <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Skills">
                        <div>
                            <SectionTitle title="Skills" zoneId={zoneId} />
                            <div style={isSidebar ? {} : S.skillGrid}>
                                {items.map((skill, i) => {
                                    const originalIdx = itemIndices ? itemIndices[i] : i;
                                    return (
                                        <div key={originalIdx} data-item-index={originalIdx}
                                            style={isSidebar ? { ...S.sbText, marginBottom: "5px", display: "flex", alignItems: "center", gap: "5px" } : S.skillItem}>
                                            <span style={{ color: isSidebar ? SIDEBAR_MUTED : "#555", flexShrink: 0 }}>•</span>
                                            <RichTextSpellCheck html={typeof skill === 'object' ? skill.name : skill} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('skills', originalIdx, val, 'name')} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </SectionWrapper>
                );
            }
            if (hasDesc) {
                return (
                    <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Skills">
                        <div>
                            <SectionTitle title="Skills" zoneId={zoneId} />
                            <div className="resume-rich-text" style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", color: isSidebar ? SIDEBAR_TEXT : "#333" }}>
                                <SplittableRichText html={data.skillsDescription} range={subItemRanges?.skillsDescription} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('skills', 'skillsDescription', val)} />
                            </div>
                        </div>
                    </SectionWrapper>
                );
            }
            return null;
        },

        strengths: ({ itemIndices, isContinued, zoneId }) => {
            const isSidebar = zoneId?.toLowerCase().includes('sidebar');
            const items = itemIndices ? itemIndices.map(idx => data.strengths?.[idx]).filter(Boolean) : (data.strengths || []);
            if (!items.length) return null;
            return (
                <SectionWrapper sectionId="strengths" navigationId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Key Strengths">
                    <div>
                        <SectionTitle title="Key Strengths" zoneId={zoneId} />
                        <ul style={{ paddingLeft: isSidebar ? "0" : "15px", margin: 0, listStyle: isSidebar ? "none" : "disc" }}>
                            {items.map((skill, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <li key={originalIdx} data-item-index={originalIdx} style={{ marginBottom: "5px", fontSize: "calc(12px * var(--theme-font-scale, 1))", color: isSidebar ? SIDEBAR_TEXT : "#333", display: isSidebar ? "flex" : undefined, alignItems: isSidebar ? "center" : undefined, gap: isSidebar ? "5px" : undefined }}>
                                        {isSidebar && <span style={{ color: SIDEBAR_MUTED }}>•</span>}
                                        <RichTextSpellCheck html={typeof skill === 'object' ? skill.name : skill} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('strengths', originalIdx, val, 'name')} />
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </SectionWrapper>
            );
        },

        additionalSkills: ({ itemIndices, isContinued, zoneId }) => {
            const isSidebar = zoneId?.toLowerCase().includes('sidebar');
            const items = itemIndices ? itemIndices.map(idx => data.additionalSkills?.[idx]).filter(Boolean) : (data.additionalSkills || []);
            if (!items.length) return null;
            return (
                <SectionWrapper sectionId="additionalSkills" navigationId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Additional Skills">
                    <div>
                        <SectionTitle title="Additional Skills" zoneId={zoneId} />
                        <ul style={{ paddingLeft: isSidebar ? "0" : "15px", margin: 0, listStyle: isSidebar ? "none" : "disc" }}>
                            {items.map((skill, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <li key={originalIdx} data-item-index={originalIdx} style={{ marginBottom: "5px", fontSize: "calc(12px * var(--theme-font-scale, 1))", color: isSidebar ? SIDEBAR_TEXT : "#333", display: isSidebar ? "flex" : undefined, alignItems: isSidebar ? "center" : undefined, gap: isSidebar ? "5px" : undefined }}>
                                        {isSidebar && <span style={{ color: SIDEBAR_MUTED }}>•</span>}
                                        <RichTextSpellCheck html={typeof skill === 'object' ? skill.name : skill} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('additionalSkills', originalIdx, val, 'name')} />
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </SectionWrapper>
            );
        },

        experience: ({ itemIndices, isContinued, subItemRanges, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.experience?.[idx]) : data.experience;
            if (!items || !items.length) return null;
            return (
                <SectionWrapper sectionId="experience" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Experience">
                    <div>
                        <SectionTitle title="Work History" zoneId={zoneId} />
                        {items.map((exp, i) => {
                            if (!exp) return null;
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const dateStr = exp.year || exp.date || (exp.startYear ? `${exp.startYear} - ${exp.isCurrent ? "Current" : exp.endYear}` : "");
                            const coStr = [exp.company, exp.location].filter(Boolean).join(", ");
                            return (
                                <div key={i} data-item-index={originalIdx} style={S.expBlock}>
                                    <div style={S.expDate}>
                                        <RichTextSpellCheck html={dateStr} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'date')} />
                                    </div>
                                    <div>
                                        <span style={S.expTitle}>
                                            <RichTextSpellCheck html={exp.title || exp.role || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'title')} />
                                        </span>
                                        {coStr && <>
                                            <span style={{ ...S.expCompany }}> - </span>
                                            <span style={S.expCompany}>
                                                <RichTextSpellCheck html={coStr} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'company')} />
                                                {exp.isRemote && <span style={{ color: "#888" }}> • Remote</span>}
                                            </span>
                                        </>}
                                    </div>
                                    <div className="resume-rich-text" style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", lineHeight: "var(--theme-line-height, 1.65)", marginTop: "5px", color: zoneId?.toLowerCase().includes('sidebar') ? SIDEBAR_TEXT : "#333" }}>
                                        <SplittableRichText html={exp.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'description')} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        education: ({ itemIndices, isContinued, zoneId }) => {
            const isSidebar = zoneId?.toLowerCase().includes('sidebar');
            const items = itemIndices ? itemIndices.map(idx => data.education?.[idx]) : data.education;
            if (!items || !items.length) return null;
            return (
                <SectionWrapper sectionId="education" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Education">
                    <div>
                        <SectionTitle title="Education" zoneId={zoneId} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "calc(13px * var(--theme-paragraph-margin, 1))" }}>
                            {items.map((edu, i) => {
                                if (!edu) return null;
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                const yr = edu.year || edu.date || edu.endYear || "";
                                const school = [edu.institution || edu.school, edu.location].filter(Boolean).join(", ");
                                return (
                                    <div key={i} data-item-index={originalIdx}>
                                        <div style={isSidebar ? S.sbText : { fontSize: "calc(12px * var(--theme-font-scale, 1))", color: "#555", lineHeight: "1.4" }}>
                                            <RichTextSpellCheck html={edu.degree} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'degree')} />
                                        </div>
                                        <div style={isSidebar ? S.sbBold : { fontWeight: "700", fontSize: "calc(12px * var(--theme-font-scale, 1))", color: "#1a1a1a", lineHeight: "1.4", marginTop: "2px" }}>
                                            <RichTextSpellCheck html={school} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'institution')} />
                                        </div>
                                        {yr && <div style={isSidebar ? S.sbMuted : { fontSize: "calc(11px * var(--theme-font-scale, 1))", color: "#777", marginTop: "1px" }}>
                                            <RichTextSpellCheck html={yr} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'year')} />
                                        </div>}
                                        {edu.grade && <div style={isSidebar ? S.sbMuted : { fontSize: "calc(11px * var(--theme-font-scale, 1))", color: "#777" }}>GPA: {edu.grade}</div>}
                                        {!isSidebar && edu.description && (
                                            <div className="resume-rich-text" style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", lineHeight: "1.6", marginTop: "6px" }}>
                                                <SplittableRichText html={edu.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'description')} />
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

        projects: ({ itemIndices, isContinued, subItemRanges, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.projects?.[idx]) : data.projects;
            if (!items || !items.length) return null;
            return (
                <SectionWrapper sectionId="projects" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Projects">
                    <div>
                        <SectionTitle title="Projects" zoneId={zoneId} />
                        {items.map((proj, i) => {
                            if (!proj) return null;
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const ds = proj.year || (proj.startYear && `${proj.startYear} - ${proj.isCurrent ? 'Present' : (proj.endYear || 'Present')}`);
                            return (
                                <div key={i} data-item-index={originalIdx} style={S.expBlock}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "3px" }}>
                                        <div style={S.expTitle}>
                                            <RichTextSpellCheck html={proj.title} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('projects', originalIdx, val, 'title')} />
                                        </div>
                                        {ds && <span style={{ fontSize: "calc(11px * var(--theme-font-scale, 1))", color: "#777" }}><SpellCheckText text={ds} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('projects', originalIdx, val, proj.year ? 'year' : 'date')} /></span>}
                                    </div>
                                    {proj.link && <div style={{ fontSize: "calc(11.5px * var(--theme-font-scale, 1))", color: "#555", marginBottom: "5px" }}><ResumeLink href={proj.link}><RichTextSpellCheck html={proj.link} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('projects', originalIdx, val, 'link')} /></ResumeLink></div>}
                                    {proj.technologies?.length > 0 && (
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "5px" }}>
                                            {proj.technologies.map((t, ti) => <span key={ti} style={{ fontSize: "calc(10.5px * var(--theme-font-scale, 1))", padding: "1px 6px", background: "#f0f0f0", borderRadius: "10px", color: "#555" }}>{t}</span>)}
                                        </div>
                                    )}
                                    <div className="resume-rich-text" style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", lineHeight: "var(--theme-line-height, 1.65)", color: zoneId?.toLowerCase().includes('sidebar') ? SIDEBAR_TEXT : "#333" }}>
                                        <SplittableRichText html={proj.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('projects', originalIdx, val, 'description')} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        contact: ({ zoneId }) => {
            const locStr = [personal?.city, personal?.state, personal?.zipCode, personal?.country].filter(Boolean).join(", ");
            const extraLinks = [
                { label: 'LinkedIn', value: personal?.linkedin, type: 'personal', field: 'linkedin' },
                { label: 'GitHub', value: personal?.github, type: 'personal', field: 'github' },
                { label: 'Website', value: personal?.website, type: 'personal', field: 'website' },
                ...(data.websites || []).map((l, idx) => ({ ...l, originalIdx: idx })).filter(l => l.addToHeader && l.url).map(l => ({ label: l.label || 'Website', value: l.url, type: 'websites', field: 'url', idx: l.originalIdx }))
            ];
            return (
                <SectionWrapper sectionId="contact" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Contact">
                    <div style={S.contactZone}>
                        {personal?.email && (
                            <div style={S.contactRow}>
                                <span style={S.contactIcon}><IconEmail /></span>
                                <ResumeLink href={personal.email}>
                                    <span style={S.contactTxt}><SpellCheckText text={personal.email} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'email', val)} /></span>
                                </ResumeLink>
                            </div>
                        )}
                        {personal?.phone && (
                            <div style={S.contactRow}>
                                <span style={S.contactIcon}><IconPhone /></span>
                                <ResumeLink href={personal.phone}>
                                    <span style={S.contactTxt}><SpellCheckText text={personal.phone} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'phone', val)} /></span>
                                </ResumeLink>
                            </div>
                        )}
                        {locStr && (
                            <div style={S.contactRow}>
                                <span style={S.contactIcon}><IconLocation /></span>
                                <span style={S.contactTxt}><SpellCheckText text={locStr} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'city', val)} /></span>
                            </div>
                        )}
                        {extraLinks.map((link, i) => link.value && (
                            <div key={i} style={S.contactRow}>
                                <span style={{ ...S.contactTxt, fontSize: "calc(10px * var(--theme-font-scale, 1))", color: SIDEBAR_MUTED, fontWeight: "600" }}>{link.label}</span>
                                <ResumeLink href={link.value}>
                                    <span style={S.contactTxt}><SpellCheckText text={link.value} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace(link.type, link.type === 'personal' ? link.field : link.idx, val, link.type === 'websites' ? 'url' : null)} /></span>
                                </ResumeLink>
                            </div>
                        ))}
                    </div>
                </SectionWrapper>
            );
        },

        websites: ({ itemIndices, zoneId }) => {
            const isSidebar = zoneId?.toLowerCase().includes('sidebar');
            const items = itemIndices ? itemIndices.map(idx => data.websites?.[idx]) : data.websites;
            const links = (items || []).map((l, idx) => ({ ...l, originalIdx: itemIndices ? itemIndices[idx] : idx })).filter(l => !l.addToHeader && l.url);
            if (!links.length) return null;
            return (
                <SectionWrapper sectionId="websites" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Websites & Portfolios">
                    <div>
                        <SectionTitle title="Websites & Portfolios" zoneId={zoneId} />
                        {links.map((site, i) => (
                            <div key={i} style={{ marginBottom: "7px" }}>
                                <div style={{ fontSize: "calc(10.5px * var(--theme-font-scale, 1))", color: SIDEBAR_MUTED }}>{site.label || 'Portfolio'}</div>
                                <ResumeLink href={site.url}><span style={S.contactTxt}><SpellCheckText text={site.url} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('websites', site.originalIdx, val, 'url')} /></span></ResumeLink>
                            </div>
                        ))}
                    </div>
                </SectionWrapper>
            );
        },

        languages: ({ itemIndices, isContinued, zoneId }) => {
            const isSidebar = zoneId?.toLowerCase().includes('sidebar');
            const items = itemIndices ? itemIndices.map(idx => data.languages?.[idx]) : data.languages;
            if (!items || !items.length) return null;
            return (
                <SectionWrapper sectionId="languages" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Languages">
                    <div>
                        <SectionTitle title="Languages" zoneId={zoneId} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {items.map((lang, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return <LanguageItem key={i} item={lang} index={originalIdx} isSpellCheckActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onSpellCheckReplace={(field, val) => onSpellCheckReplace('languages', originalIdx, val, field)} />;
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        certifications: ({ itemIndices, isContinued, zoneId, subItemRanges: rSIR }) => {
            const isSidebar = zoneId?.toLowerCase().includes('sidebar');
            const items = itemIndices ? itemIndices.map(idx => data.certifications?.[idx]) : data.certifications;
            if (!items || !items.length) return null;
            return (
                <SectionWrapper sectionId="certifications" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Certifications">
                    <div>
                        <SectionTitle title="Certifications" zoneId={zoneId} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "calc(7px * var(--theme-paragraph-margin, 1))" }}>
                            {items.map((cert, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return <CertificationItem key={i} item={cert} index={originalIdx} isSpellCheckActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onSpellCheckReplace={(field, val) => onSpellCheckReplace('certifications', originalIdx, val, field)} variant="compact" subItemRange={rSIR?.[originalIdx]} />;
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        software: ({ itemIndices, isContinued, zoneId, subItemRanges: rSIR }) => {
            const isSidebar = zoneId?.toLowerCase().includes('sidebar');
            const items = itemIndices ? itemIndices.map(idx => data.software?.[idx]) : data.software;
            if (!items || !items.length) return null;
            return (
                <SectionWrapper sectionId="software" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Software">
                    <div>
                        <SectionTitle title="Software" zoneId={zoneId} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "calc(7px * var(--theme-paragraph-margin, 1))" }}>
                            {items.map((item, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return <SoftwareItem key={i} item={item} index={originalIdx} isSpellCheckActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onSpellCheckReplace={(field, val) => onSpellCheckReplace('software', originalIdx, val, field)} variant="compact" subItemRange={rSIR?.[originalIdx]} />;
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        interests: ({ itemIndices, zoneId }) => {
            const isSidebar = zoneId?.toLowerCase().includes('sidebar');
            const items = itemIndices ? itemIndices.map(idx => data.interests?.[idx]) : data.interests;
            if (!items || !items.length) return null;
            return (
                <SectionWrapper sectionId="interests" navigationId="interests" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Interests">
                    <div>
                        <SectionTitle title="Interests" zoneId={zoneId} />
                        <ul style={{ paddingLeft: isSidebar ? "0" : "15px", margin: 0, listStyle: isSidebar ? "none" : "disc" }}>
                            {items.map((item, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <li key={i} data-item-index={originalIdx}
                                        style={{ marginBottom: "4px", fontSize: "calc(12px * var(--theme-font-scale, 1))", color: isSidebar ? SIDEBAR_TEXT : "#333", display: isSidebar ? "flex" : undefined, alignItems: isSidebar ? "center" : undefined, gap: isSidebar ? "5px" : undefined }}>
                                        {isSidebar && <span style={{ color: SIDEBAR_MUTED }}>•</span>}
                                        <RichTextSpellCheck html={typeof item === 'object' ? item.name : item} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('interests', originalIdx, val, 'name')} />
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </SectionWrapper>
            );
        },

        awards: ({ itemIndices, zoneId }) => {
            const isSidebar = zoneId?.toLowerCase().includes('sidebar');
            const items = itemIndices ? itemIndices.map(idx => data.awards?.[idx]) : data.awards;
            if (!items || !items.length) return null;
            return (
                <SectionWrapper sectionId="awards" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Awards">
                    <div>
                        <SectionTitle title="Awards" zoneId={zoneId} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "calc(9px * var(--theme-paragraph-margin, 1))" }}>
                            {items.map((award, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <div key={i}>
                                        <div style={{ fontWeight: "700", fontSize: "calc(12px * var(--theme-font-scale, 1))", color: isSidebar ? SIDEBAR_WHITE : "#1a1a1a" }}>
                                            <RichTextSpellCheck html={award.title} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('awards', originalIdx, val, 'title')} />
                                        </div>
                                        <div style={{ fontSize: "calc(11.5px * var(--theme-font-scale, 1))", color: isSidebar ? SIDEBAR_MUTED : "#777" }}>
                                            <RichTextSpellCheck html={award.issuer} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('awards', originalIdx, val, 'issuer')} />
                                            {award.year && <span> • {award.year}</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        volunteering: ({ itemIndices, zoneId }) => {
            const isSidebar = zoneId?.toLowerCase().includes('sidebar');
            const items = itemIndices ? itemIndices.map(idx => data.volunteer?.[idx]) : data.volunteer;
            if (!items || !items.length) return null;
            return (
                <SectionWrapper sectionId="volunteer" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Volunteer">
                    <div>
                        <SectionTitle title="Volunteer" zoneId={zoneId} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "calc(11px * var(--theme-paragraph-margin, 1))" }}>
                            {items.map((item, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <div key={i}>
                                        <div style={{ fontWeight: "700", fontSize: "calc(12px * var(--theme-font-scale, 1))", color: isSidebar ? SIDEBAR_WHITE : "#1a1a1a" }}><RichTextSpellCheck html={item.organization} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('volunteer', originalIdx, val, 'organization')} /></div>
                                        <div style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", color: isSidebar ? SIDEBAR_TEXT : "#555" }}><RichTextSpellCheck html={item.role} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('volunteer', originalIdx, val, 'role')} /></div>
                                        <div style={{ fontSize: "calc(11px * var(--theme-font-scale, 1))", color: isSidebar ? SIDEBAR_MUTED : "#888" }}>{item.startDate} - {item.isCurrent ? "Present" : item.endDate}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        publications: ({ itemIndices, zoneId }) => {
            const isSidebar = zoneId?.toLowerCase().includes('sidebar');
            const items = itemIndices ? itemIndices.map(idx => data.publications?.[idx]) : data.publications;
            if (!items || !items.length) return null;
            return (
                <SectionWrapper sectionId="publications" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Publications">
                    <div>
                        <SectionTitle title="Publications" zoneId={zoneId} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "calc(9px * var(--theme-paragraph-margin, 1))" }}>
                            {items.map((pub, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <div key={i}>
                                        <div style={{ fontWeight: "700", fontSize: "calc(12px * var(--theme-font-scale, 1))", color: isSidebar ? SIDEBAR_WHITE : "#1a1a1a" }}><RichTextSpellCheck html={pub.name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('publications', originalIdx, val, 'name')} /></div>
                                        <div style={{ fontSize: "calc(11.5px * var(--theme-font-scale, 1))", color: isSidebar ? SIDEBAR_MUTED : "#777" }}><RichTextSpellCheck html={pub.publisher} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('publications', originalIdx, val, 'publisher')} />{pub.releaseDate && <span> • {pub.releaseDate}</span>}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },


        affiliations: ({ itemIndices, zoneId }) => {
            const isSidebar = zoneId?.toLowerCase().includes('sidebar');
            const items = itemIndices ? itemIndices.map(idx => data.affiliations?.[idx]).filter(Boolean) : (data.affiliations || []);
            if (!items.length) return null;
            return (
                <SectionWrapper sectionId="affiliations" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Affiliations">
                    <div>
                        <SectionTitle title="Professional Affiliations" zoneId={zoneId} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            {items.map((aff, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <div key={i} data-item-index={originalIdx}>
                                        <div style={{ fontWeight: "700", fontSize: "calc(12px * var(--theme-font-scale, 1))", color: isSidebar ? SIDEBAR_WHITE : "#1a1a1a" }}>
                                            <RichTextSpellCheck html={aff.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('affiliations', originalIdx, val, 'name')} />
                                        </div>
                                        {aff.description && (
                                            <div className="resume-rich-text" style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", color: isSidebar ? SIDEBAR_TEXT : "#555", marginTop: "2px" }}>
                                                <RichTextSpellCheck html={aff.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('affiliations', originalIdx, val, 'description')} />
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

        additionalInfo: ({ isContinued, subItemRanges, zoneId }) => {
            const html = data.additionalInfo || "";
            if (!html || html.trim() === "" || html === "<p><br></p>") return null;
            return (
                <SectionWrapper sectionId="additionalInfo" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Additional Information">
                    <div>
                        <SectionTitle title="Additional Information" zoneId={zoneId} />
                        <div className="resume-rich-text" style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", lineHeight: "1.65" }}>
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
                        <SectionTitle title={title} zoneId={zoneId} />
                        <div className="resume-rich-text" style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", lineHeight: "1.65" }}>
                            <SplittableRichText html={content} range={subItemRanges?.custom} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('customSection', 'content', val)} />
                        </div>
                    </div>
                </SectionWrapper>
            );
        },
        personalDetails: ({ zoneId }) => {
            const p = personal || {};
            const isSidebar = zoneId?.toLowerCase().includes('sidebar');
            const details = [
                { label: 'Date of Birth', value: p.dob || p.dateOfBirth || p.birthDate, id: 'dob' },
                { label: 'Nationality', value: p.nationality, id: 'nationality' },
                { label: 'Marital Status', value: p.maritalStatus || p.marital_status, id: 'maritalStatus' },
                { label: 'Gender', value: p.gender, id: 'gender' },
                { label: 'Religion', value: p.religion, id: 'religion' },
                { label: 'Visa Status', value: p.visaStatus || p.visa_status, id: 'visaStatus' },
                { label: 'Passport', value: p.passport || p.passportNumber, id: 'passport' },
                { label: 'Place of Birth', value: p.placeOfBirth, id: 'placeOfBirth' },
                { label: 'Driving License', value: p.drivingLicense, id: 'drivingLicense' },
                { label: 'City', value: p.city, id: 'city' },
                { label: 'State', value: p.state, id: 'state' },
                { label: 'Country', value: p.country, id: 'country' },
                { label: 'Zip Code', value: p.zipCode, id: 'zipCode' },
                { label: 'Other', value: p.otherPersonal || p.otherInformation, id: 'otherPersonal' }
            ].filter(d => d.value);

            if (!details.length) return null;

            return (
                <SectionWrapper sectionId="personalDetails" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Personal Details">
                    <div>
                        {isSidebar ? <SbTitle title="Personal Details" /> : <MainTitle title="Personal Information" zoneId={zoneId} />}
                        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                            {details.map((d, i) => (
                                <div key={i} style={{ fontSize: "calc(11.5px * var(--theme-font-scale, 1))", color: isSidebar ? SIDEBAR_TEXT : "#333" }}>
                                    <span style={{ fontWeight: "700", color: isSidebar ? SIDEBAR_WHITE : "#111", marginRight: "5px" }}>{d.label}:</span>
                                    <SpellCheckText text={d.value} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', d.id, val)} />
                                </div>
                            ))}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },
    };

    // ── STRUCTURAL COMPONENTS ────────────────────────────────
    const HeaderSidebar = () => (
        <div style={S.sidebarBand} onClick={() => onSectionClick?.('personal')}>
            <div style={S.photoWrap}>
                {personal?.photo
                    ? <img src={personal.photo} style={S.photo} alt="profile" />
                    : <div style={S.photoPlaceholder}><IconPerson /></div>
                }
            </div>
        </div>
    );

    const HeaderMain = () => (
        <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Header">
            <div style={S.mainBand}>
                <h1 style={S.name}>
                    <SpellCheckText text={personal?.name || "YOUR NAME"} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'name', val)} />
                </h1>
                {personal?.profession && (
                    <div style={S.profession}>
                        <SpellCheckText text={personal.profession} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'profession', val)} />
                    </div>
                )}
            </div>
        </SectionWrapper>
    );

    // ── ZONE RENDERER ────────────────────────────────────────
    const renderZone = (id, items, columnStyle) => (
        <DroppableZone id={id} style={columnStyle}>
            {items.map((sid, idx) => {
                const isContinued = typeof sid === 'object' && sid.isContinued;
                const sId = typeof sid === 'string' ? sid : sid.id;
                const dragId = isContinued ? `${id}-cont-${sId}-${idx}` : sId;
                return (
                    <DraggableSection key={dragId} id={dragId} isEnabled={canReorder && !isContinued}>
                        <div style={{ paddingBottom: "1px" }}>
                            <SectionRenderer
                                sectionId={sId}
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

    // ── MEASURER ─────────────────────────────────────────────
    const Measurer = () => (
        <div className="resume-measurer" style={{ position: "absolute", top: -10000, left: -10000, width: "210mm", visibility: "hidden" }}>
            <div className="page-height-marker" style={{ height: "297mm", width: "1px", position: "absolute", left: 0, top: 0 }} />
            <div style={{ ...S.page, height: "auto", overflow: "visible" }}>
                <div style={S.body}>
                    <div style={S.sidebar}>
                        <HeaderSidebar />
                        <div style={{ ...S.sidebarBody, paddingTop: `calc(${PHOTO_D} / 2 + 25px)` }}>
                            <div data-column-id="sidebar" style={S.sidebarSections}>
                                {activeSidebarSections.map(sid => (
                                    <div key={sid} style={{ paddingBottom: "1px" }}>
                                        <SectionRenderer sectionId={sid} data={data} customRenderers={customRenderers} zoneId="sidebar" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div style={S.main}>
                        <HeaderMain />
                        <div data-column-id="main" style={S.mainContent}>
                            {activeMainSections.map(sid => (
                                <div key={sid} style={{ paddingBottom: "1px" }}>
                                    <SectionRenderer key={sid} sectionId={sid} data={data} customRenderers={customRenderers} zoneId="main" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // ── FULL PAGE RENDER ─────────────────────────────────────
    const renderPage = (pageMain, pageSidebar, i, isMultiPage) => {
        return (
            <div key={i} style={{ ...S.page, height: "297mm", minHeight: "unset", overflow: "hidden" }}>
                <div className="page-height-marker" style={{ height: "297mm", width: "1px", position: "absolute", left: 0, top: 0 }} />

                <div style={S.body}>
                    {/* ── SIDEBAR ── */}
                    <div style={S.sidebar}>
                        {i === 0 && <HeaderSidebar />}
                        <div style={{ ...S.sidebarBody, paddingTop: i === 0 ? `calc(${PHOTO_D} / 2 + 25px)` : "30px" }}>
                            {renderZone(`sidebar-p${i}`, pageSidebar, S.sidebarSections)}
                        </div>
                    </div>

                    {/* ── MAIN ── */}
                    <div style={S.main}>
                        {i === 0 && <HeaderMain />}
                        {renderZone(`main-p${i}`, pageMain, S.mainContent)}
                    </div>
                </div>

                {isMultiPage && (
                    <div style={{ position: "absolute", bottom: "8px", right: "12px", fontSize: "9px", color: "#aaa" }}>
                        {i + 1}
                    </div>
                )}
            </div>
        );
    };

    // ── ROOT ─────────────────────────────────────────────────
    return (
        <div ref={containerRef} className="dark-edge-root">
            <Measurer />
            <DndContext {...dndContextProps}>
                <SortableContext items={[...activeMainSections, ...activeSidebarSections]} strategy={verticalListSortingStrategy}>
                    {showPageBreaks && pages
                        ? pages.map((page, i) => renderPage(page.main, page.sidebar, i, true))
                        : renderPage(activeMainSections, activeSidebarSections, 0, false)
                    }
                </SortableContext>
                <StableResumeDragOverlay
                    activeId={activeId}
                    scale={scale}
                    renderSection={(id) => (
                        <div style={{ background: "white", padding: "10px", border: "1px solid #ddd", width: "240px" }}>
                            <SectionRenderer sectionId={id} data={data} customRenderers={customRenderers} />
                        </div>
                    )}
                />
            </DndContext>
        </div>
    );
};

export default DarkEdge;
