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
 * AdeeeshModern Template
 * Matches the provided image:
 * - Top header: circular photo left, name+profession center, contact info right
 * - Below: two-column layout, left ~55% (summary, experience, education),
 *   right ~45% (key skills as pill tags, career timeline two-col, projects, languages)
 * - Gold (#c9a227) accent color for section icons, titles, date highlights, left-border bars
 * - Work experience items have a shaded role title banner
 * - Full pagination, section breaking, drag/drop, spell check support
 */
const OchreExecutive = ({
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

    // --- THEME ---
    const GOLD = "var(--theme-color, #c9a227)";
    const DARK = "#1a1a2e";
    const TEXT = "#2d2d2d";
    const TEXT_LIGHT = "#555";
    const BORDER = "#e0e0e0";
    const SECTION_BG = "transparent";

    // --- LAYOUT ---
    const templateId = 'ochre-executive';
    const savedLayout = data.templateLayouts?.[templateId] || {};
    const initialLayout = {
        left: savedLayout.left || savedLayout.main || ['summary', 'experience', 'education', 'additionalInfo', 'custom'],
        right: savedLayout.right || savedLayout.sidebar || ['skills', 'strengths', 'additionalSkills', 'careerTimeline', 'projects', 'languages', 'certifications', 'software', 'interests', 'websites', 'contact']
    };

    const completeLayout = getCompleteLayout(data, initialLayout, 'left');
    const activeLeftSections = completeLayout.left || [];
    const activeRightSections = completeLayout.right || [];

    // --- DRAG & DROP ---
    const { dndContextProps, activeId } = useResumeDragAndDrop({
        data,
        onReorder,
        scale,
        containers: { left: activeLeftSections, right: activeRightSections }
    });

    // --- PAGINATION ---
    const pages = useAutoPagination({
        columns: { left: activeLeftSections, right: activeRightSections },
        data,
        enabled: showPageBreaks,
        containerRef,
        scale
    });

    // --- SECTION ICONS (SVG inline) ---
    const icons = {
        summary: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill={GOLD}><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" /></svg>
        ),
        experience: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill={GOLD}><path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8-2h4v2h-4V4zM4 20V8h16v12H4z" /></svg>
        ),
        education: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill={GOLD}><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" /></svg>
        ),
        skills: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill={GOLD}><path d="M7 5h2v14H7V5zm4 0h2v14h-2V5zm4 0h2v14h-2V5z" /></svg>
        ),
        timeline: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill={GOLD}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" /></svg>
        ),
        projects: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill={GOLD}><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V7h10v2z" /></svg>
        ),
        language: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill={GOLD}><path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" /></svg>
        ),
        certifications: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill={GOLD}><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l6 2.67V11c0 3.9-2.63 7.54-6 8.93-3.37-1.39-6-5.03-6-8.93V7.67L12 5z" /></svg>
        ),
        interests: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill={GOLD}><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
        ),
        contact: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill={GOLD}><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
        ),
        software: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill={GOLD}><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" /></svg>
        ),
        websites: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill={GOLD}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93s3.06-7.44 7-7.93v15.86zm2 0V4.07c3.94.49 7 3.85 7 7.93s-3.06 7.44-7 7.93z" /></svg>
        ),
        github: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill={GOLD}><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
        ),
        personalDetails: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill={GOLD}><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
        ),
    };

    // --- STYLES ---
    const styles = {
        page: {
            width: "210mm",
            height: "297mm",
            background: "white",
            boxSizing: "border-box",
            position: "relative",
            margin: "0 auto 30px auto",
            color: TEXT,
            fontFamily: "var(--theme-font, 'Arial', sans-serif)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
        },
        // TOP HEADER
        header: {
            display: "flex",
            alignItems: "center",
            padding: "22px var(--theme-page-margin, 28px) 18px var(--theme-page-margin, 22px)",
            borderBottom: `3px solid ${GOLD}`,
            gap: "18px",
            flexShrink: 0,
        },
        photoCircle: {
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            objectFit: "cover",
            border: `3px solid ${GOLD}`,
            flexShrink: 0,
        },
        photoPlaceholder: {
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "#e8e8e8",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "28px",
            color: "#aaa",
            border: `3px solid ${GOLD}`,
        },
        headerNameBlock: {
            flex: 1,
        },
        headerName: {
            fontSize: "calc(26px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: DARK,
            margin: 0,
            lineHeight: "1.15",
        },
        headerProfession: {
            fontSize: "calc(13px * var(--theme-font-scale, 1))",
            color: GOLD,
            marginTop: "3px",
            fontWeight: "400",
        },
        headerContactBlock: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: "5px",
        },
        headerContactItem: {
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "calc(11.5px * var(--theme-font-scale, 1))",
            color: TEXT,
            justifyContent: "flex-end",
        },
        headerContactIcon: {
            color: DARK,
            display: "flex",
            alignItems: "center",
        },

        // BODY (two columns)
        body: {
            display: "flex",
            flex: 1,
            minHeight: 0,
        },
        leftColumn: {
            width: "54%",
            padding: "20px var(--theme-page-margin, 18px) var(--theme-page-margin, 30px) var(--theme-page-margin, 22px)",
            display: "flex",
            flexDirection: "column",
            gap: "calc(22px * var(--theme-section-margin, 1))",
            borderRight: `1px solid ${BORDER}`,
        },
        rightColumn: {
            width: "46%",
            padding: "20px var(--theme-page-margin, 22px) var(--theme-page-margin, 30px) var(--theme-page-margin, 18px)",
            display: "flex",
            flexDirection: "column",
            gap: "calc(22px * var(--theme-section-margin, 1))",
        },

        // SECTION TITLE ROW
        sectionTitleRow: {
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "10px",
            borderBottom: `1.5px solid ${BORDER}`,
            paddingBottom: "6px",
        },
        sectionTitleText: {
            fontSize: "calc(13px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: GOLD,
            textTransform: "uppercase",
            letterSpacing: "1.2px",
        },

        // LEFT BAR accent
        leftAccentBar: {
            width: "4px",
            background: GOLD,
            borderRadius: "2px",
            alignSelf: "stretch",
            minHeight: "100%",
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
        },

        // EXPERIENCE ITEM
        expRoleBanner: {
            background: "#f0ede6",
            padding: "5px 10px",
            marginBottom: "6px",
            borderLeft: `3px solid ${GOLD}`,
        },
        expRoleTitle: {
            fontSize: "calc(13px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: DARK,
        },
        expCompany: {
            fontSize: "calc(12.5px * var(--theme-font-scale, 1))",
            color: TEXT,
            marginBottom: "2px",
        },
        expDate: {
            fontSize: "calc(11.5px * var(--theme-font-scale, 1))",
            color: GOLD,
            fontWeight: "500",
            marginBottom: "6px",
        },
        expDesc: {
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            lineHeight: "var(--theme-line-height, 1.55)",
            color: TEXT,
        },
        expItem: {
            marginBottom: "calc(16px * var(--theme-paragraph-margin, 1))",
            position: "relative",
        },

        // EDUCATION ITEM
        eduDegree: {
            fontSize: "calc(13px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: DARK,
        },
        eduYear: {
            fontSize: "calc(11.5px * var(--theme-font-scale, 1))",
            color: GOLD,
            fontWeight: "600",
            marginBottom: "2px",
        },
        eduInst: {
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            color: TEXT_LIGHT,
            marginBottom: "2px",
        },
        eduGrade: {
            fontSize: "calc(11.5px * var(--theme-font-scale, 1))",
            color: TEXT_LIGHT,
        },
        eduItem: {
            marginBottom: "calc(12px * var(--theme-paragraph-margin, 1))",
        },

        // SKILL PILL TAGS
        skillTagsContainer: {
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
        },
        skillTag: {
            border: `1.5px solid ${GOLD}`,
            borderRadius: "3px",
            padding: "5px 10px",
            fontSize: "calc(11.5px * var(--theme-font-scale, 1))",
            color: GOLD,
            background: "transparent",
            fontWeight: "500",
            cursor: "default",
        },

        // CAREER TIMELINE (two-col)
        timelineItem: {
            display: "flex",
            gap: "12px",
            marginBottom: "calc(10px * var(--theme-paragraph-margin, 1))",
            alignItems: "flex-start",
        },
        timelineDate: {
            fontSize: "calc(11.5px * var(--theme-font-scale, 1))",
            color: TEXT,
            fontWeight: "500",
            width: "68px",
            flexShrink: 0,
            paddingTop: "1px",
        },
        timelineDesc: {
            fontSize: "calc(11.5px * var(--theme-font-scale, 1))",
            color: TEXT_LIGHT,
            lineHeight: "1.5",
            flex: 1,
        },

        // PROJECT ITEM
        projTitle: {
            fontSize: "calc(13px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: DARK,
            marginBottom: "2px",
        },
        projDuration: {
            fontSize: "calc(11.5px * var(--theme-font-scale, 1))",
            color: GOLD,
            marginBottom: "4px",
        },
        projDesc: {
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            color: TEXT_LIGHT,
            lineHeight: "1.5",
        },
        projItem: {
            marginBottom: "calc(12px * var(--theme-paragraph-margin, 1))",
        },

        // LANGUAGE ITEM
        languageItem: {
            fontSize: "calc(12.5px * var(--theme-font-scale, 1))",
            color: TEXT,
            marginBottom: "calc(8px * var(--theme-paragraph-margin, 1))",
            fontWeight: "500",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
        },

        // CONTACT (right column style)
        contactRow: {
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            color: TEXT,
            marginBottom: "calc(8px * var(--theme-paragraph-margin, 1))",
        },
    };

    // ──────────────────────────────────────────
    // SECTION TITLE COMPONENT
    // ──────────────────────────────────────────
    const SectionTitle = ({ titleKey, title, zoneId }) => {
        const { isContinued } = useSectionContext();
        const displayTitle = isContinued ? `${title} (Cont.)` : title;
        const icon = icons[titleKey] || icons.summary;
        return (
            <div style={styles.sectionTitleRow}>
                <span style={{ display: "flex", alignItems: "center" }}>{icon}</span>
                <span style={styles.sectionTitleText}>{displayTitle}</span>
            </div>
        );
    };

    // ──────────────────────────────────────────
    // HEADER CONTACT ICONS
    // ──────────────────────────────────────────
    const PhoneIcon = () => (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" /></svg>
    );
    const MapIcon = () => (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
    );
    const MailIcon = () => (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>
    );
    const BriefcaseIcon = () => (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8-2h4v2h-4V4z" /></svg>
    );
    const GithubIcon = () => (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.419 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" /></svg>
    );

    // ──────────────────────────────────────────
    // HEADER
    // ──────────────────────────────────────────
    const Header = () => {

        return (
            <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Header">
                <div style={styles.header}>
                    {/* PHOTO */}
                    {personal?.photo ? (
                        <img src={personal.photo} style={styles.photoCircle} alt="profile" />
                    ) : (
                        <div style={styles.photoPlaceholder}>👤</div>
                    )}

                    {/* NAME + PROFESSION */}
                    <div style={styles.headerNameBlock}>
                        <h1 style={styles.headerName}>
                            <SpellCheckText
                                text={personal?.name || "YOUR NAME"}
                                isActive={isSpellCheckActive}
                                onIgnore={onSpellCheckIgnore}
                                onReplace={(val) => onSpellCheckReplace('personal', 'name', val)}
                            />
                        </h1>
                        {personal?.profession && (
                            <div style={styles.headerProfession}>
                                <SpellCheckText
                                    text={personal.profession}
                                    isActive={isSpellCheckActive}
                                    onIgnore={onSpellCheckIgnore}
                                    onReplace={(val) => onSpellCheckReplace('personal', 'profession', val)}
                                />
                            </div>
                        )}
                    </div>

                    {/* CONTACT RIGHT */}
                    <div style={styles.headerContactBlock}>
                        {personal?.phone && (
                            <div style={styles.headerContactItem}>
                                <ResumeLink href={personal.phone}>
                                    <SpellCheckText text={personal.phone} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'phone', val)} />
                                </ResumeLink>
                                <span style={styles.headerContactIcon}><PhoneIcon /></span>
                            </div>
                        )}
                        {(personal?.city || personal?.state || personal?.country || personal?.zipCode) && (
                            <div style={styles.headerContactItem}>
                                <SpellCheckText
                                    text={[personal?.city, personal?.state, personal?.country, personal?.zipCode].filter(Boolean).join(", ")}
                                    isActive={isSpellCheckActive}
                                    onIgnore={onSpellCheckIgnore}
                                    onReplace={(val) => onSpellCheckReplace('personal', 'city', val)}
                                />
                                <span style={styles.headerContactIcon}><MapIcon /></span>
                            </div>
                        )}
                        {personal?.email && (
                            <div style={styles.headerContactItem}>
                                <ResumeLink href={personal.email}>
                                    <SpellCheckText text={personal.email} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'email', val)} />
                                </ResumeLink>
                                <span style={styles.headerContactIcon}><MailIcon /></span>
                            </div>
                        )}
                        {/* Years of experience / custom line can go here if available */}
                        {personal?.linkedin && (
                            <div style={styles.headerContactItem}>
                                <ResumeLink href={personal.linkedin}>
                                    <SpellCheckText text={personal.linkedin} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'linkedin', val)} />
                                </ResumeLink>
                                <span style={styles.headerContactIcon}><BriefcaseIcon /></span>
                            </div>
                        )}
                        {personal?.github && (
                            <div style={styles.headerContactItem}>
                                <ResumeLink href={personal.github}>
                                    <SpellCheckText text={personal.github} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'github', val)} />
                                </ResumeLink>
                                <span style={styles.headerContactIcon}><GithubIcon /></span>
                            </div>
                        )}
                        {(data.websites || []).filter(l => l.addToHeader && l.url).map((link, i) => (
                            <div key={i} style={styles.headerContactItem}>
                                <ResumeLink href={link.url}>
                                    <SpellCheckText text={link.url} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('websites', i, val, 'url')} />
                                </ResumeLink>
                                <span style={styles.headerContactIcon}><BriefcaseIcon /></span>
                            </div>
                        ))}
                    </div>
                </div>
            </SectionWrapper>
        );
    };

    // ──────────────────────────────────────────
    // CUSTOM RENDERERS
    // ──────────────────────────────────────────
    const customRenderers = {

        // SUMMARY
        summary: ({ zoneId }) => {
            const isSidebar = zoneId?.includes('left');
            if (!data.summary) return null;
            return (
                <SectionWrapper sectionId="summary" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Summary">
                    <div>
                        <SectionTitle titleKey="summary" title="Summary" zoneId={zoneId} />
                        <div className="resume-rich-text" style={styles.expDesc}>
                            <SplittableRichText html={data.summary} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('summary', null, val)} />
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        // EXPERIENCE
        experience: ({ itemIndices, isContinued, subItemRanges, zoneId }) => {
            const isSidebar = zoneId?.includes('left');
            const items = itemIndices ? itemIndices.map(idx => data.experience?.[idx]) : data.experience;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="experience" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Work Experience">
                    <div>
                        <SectionTitle titleKey="experience" title={isContinued ? "Experience (Continued)" : "Experience"} zoneId={zoneId} />
                        {items.map((exp, i) => {
                            if (!exp) return null;
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const dateStr = exp.year || exp.date || (exp.startYear ? `${exp.startYear} - ${exp.isCurrent ? 'Present' : (exp.endYear || 'Present')}` : "");
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.expItem}>
                                    <div style={styles.expRoleBanner}>
                                        <div style={styles.expRoleTitle}>
                                            <RichTextSpellCheck html={exp.title || exp.role} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'title')} />
                                        </div>
                                    </div>
                                    <div style={styles.expCompany}>
                                        <RichTextSpellCheck html={exp.company} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'company')} />
                                        {exp.location && <span>, {exp.location}</span>}
                                    </div>
                                    {dateStr && <div style={styles.expDate}>{dateStr}</div>}
                                    <div className="resume-rich-text" style={styles.expDesc}>
                                        <SplittableRichText html={exp.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'description')} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        // EDUCATION
        education: ({ itemIndices, isContinued, subItemRanges, zoneId }) => {
            const isSidebar = zoneId?.includes('left');
            const items = itemIndices ? itemIndices.map(idx => data.education?.[idx]) : data.education;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="education" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Education">
                    <div>
                        <SectionTitle titleKey="education" title={isContinued ? "Education (Continued)" : "Education"} zoneId={zoneId} />
                        {items.map((edu, i) => {
                            if (!edu) return null;
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const dateStr = edu.year || edu.date || (edu.startYear ? `${edu.startYear} - ${edu.isCurrent ? 'Present' : (edu.endYear || 'Present')}` : "");
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.eduItem}>
                                    <div style={styles.eduDegree}>
                                        <RichTextSpellCheck html={edu.study || edu.degree} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'study')} />
                                    </div>
                                    {dateStr && <div style={styles.eduYear}>{dateStr}</div>}
                                    <div style={styles.eduInst}>
                                        <RichTextSpellCheck html={edu.institution || edu.school} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'institution')} />
                                        {edu.location && <span>, {edu.location}</span>}
                                    </div>
                                    {edu.grade && <div style={styles.eduGrade}>Grade: {edu.grade}</div>}
                                    <div className="resume-rich-text" style={styles.expDesc}>
                                        <SplittableRichText html={edu.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSectionClick && onSpellCheckReplace('education', originalIdx, val, 'description')} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        // PUBLICATIONS (left)

        // ADDITIONAL INFO (left)
        additionalInfo: ({ isContinued, subItemRanges: renderSubItemRanges, zoneId }) => {
            const isSidebar = zoneId?.includes('left');
            const html = data.additionalInfo || "";
            if (!html || html.trim() === "" || html === "<p><br></p>") return null;
            return (
                <SectionWrapper sectionId="additionalInfo" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Additional Information">
                    <div>
                        <SectionTitle titleKey="summary" title="Additional Information" zoneId={zoneId} />
                        <div className="resume-rich-text" style={{ fontSize: "calc(12.5px * var(--theme-font-scale, 1))", lineHeight: "1.6", color: TEXT }}>
                            <SplittableRichText html={html} range={renderSubItemRanges?.additionalInfo} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('additionalInfo', 'additionalInfo', val)} />
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        // CUSTOM (left)
        custom: ({ isContinued, subItemRanges: renderSubItemRanges, zoneId }) => {
            const isSidebar = zoneId?.includes('left');
            if (!data.customSection?.isVisible || !data.customSection?.content) return null;
            const content = data.customSection.content;
            if (!content || content.trim() === "" || content === "<p><br></p>") return null;
            const title = data.customSection.title || "Additional Information";
            return (
                <SectionWrapper sectionId="custom" onSectionClick={onSectionClick} isInteractive={isInteractive} label={title}>
                    <div>
                        <SectionTitle titleKey="summary" title={title} zoneId={zoneId} />
                        <div className="resume-rich-text" style={{ fontSize: "calc(12.5px * var(--theme-font-scale, 1))", lineHeight: "1.6", color: TEXT }}>
                            <SplittableRichText html={content} range={renderSubItemRanges?.custom} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('customSection', 'content', val)} />
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        // SKILLS as PILL TAGS (right)
        skills: ({ itemIndices, isContinued, zoneId }) => {
            const isSidebar = zoneId?.includes('left');
            const items = itemIndices ? itemIndices.map(idx => data.skills?.[idx]).filter(Boolean) : (data.skills || []);
            const hasDescription = data.skillsDescription && data.skillsDescription.trim();

            if (items.length > 0) {
                return (
                    <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Key Skills">
                        <div>
                            <SectionTitle titleKey="skills" title="Key Skills" zoneId={zoneId} />
                            <div style={styles.skillTagsContainer}>
                                {items.map((skill, i) => {
                                    const originalIdx = itemIndices ? itemIndices[i] : i;
                                    return (
                                        <div key={originalIdx} data-item-index={originalIdx} style={styles.skillTag}>
                                            <RichTextSpellCheck html={typeof skill === 'object' ? skill.name : skill} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('skills', originalIdx, val, 'name')} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </SectionWrapper>
                );
            }
            if (hasDescription) {
                return (
                    <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Key Skills">
                        <div>
                            <SectionTitle titleKey="skills" title="Key Skills" zoneId={zoneId} />
                            <div className="resume-rich-text" style={{ fontSize: "calc(12.5px * var(--theme-font-scale, 1))", color: TEXT }}>
                                <SplittableRichText html={data.skillsDescription} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('skills', 'skillsDescription', val)} />
                            </div>
                        </div>
                    </SectionWrapper>
                );
            }
            return null;
        },

        // STRENGTHS as PILL TAGS (right)
        strengths: ({ itemIndices, isContinued, zoneId }) => {
            const isSidebar = zoneId?.includes('left');
            const items = itemIndices ? itemIndices.map(idx => data.strengths?.[idx]).filter(Boolean) : (data.strengths || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="strengths" navigationId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Key Strengths">
                    <div>
                        <SectionTitle titleKey="skills" title="Key Strengths" zoneId={zoneId} />
                        <div style={styles.skillTagsContainer}>
                            {items.map((skill, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <div key={originalIdx} data-item-index={originalIdx} style={styles.skillTag}>
                                        <RichTextSpellCheck html={typeof skill === 'object' ? skill.name : skill} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('strengths', originalIdx, val, 'name')} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        // ADDITIONAL SKILLS as PILL TAGS (right)
        additionalSkills: ({ itemIndices, isContinued, zoneId }) => {
            const isSidebar = zoneId?.includes('left');
            const items = itemIndices ? itemIndices.map(idx => data.additionalSkills?.[idx]).filter(Boolean) : (data.additionalSkills || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="additionalSkills" navigationId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Additional Skills">
                    <div>
                        <SectionTitle titleKey="skills" title="Additional Skills" zoneId={zoneId} />
                        <div style={styles.skillTagsContainer}>
                            {items.map((skill, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <div key={originalIdx} data-item-index={originalIdx} style={styles.skillTag}>
                                        <RichTextSpellCheck html={typeof skill === 'object' ? skill.name : skill} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('additionalSkills', originalIdx, val, 'name')} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        // CAREER TIMELINE — uses Experience data in a compact two-col format (right)
        // This is mapped from the "experience" section key alias "careerTimeline"
        // We render experience items as "Since XXXX | Role, Location"
        careerTimeline: ({ itemIndices, isContinued, zoneId }) => {
            // careerTimeline uses experience data but renders in compact timeline form
            const items = (data.experience || []);
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="careerTimeline" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Career Timeline">
                    <div>
                        <SectionTitle titleKey="timeline" title="Career Timeline" zoneId={zoneId} />
                        {items.map((exp, i) => {
                            if (!exp) return null;
                            const dateStr = exp.year || exp.date || (exp.startYear ? `${exp.isCurrent ? `Since ${exp.startYear}` : `${exp.startYear} - ${exp.endYear}`}` : "");
                            const descStr = [exp.company, exp.location, exp.title || exp.role].filter(Boolean).join(", ");
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.timelineItem}>
                                    <div style={styles.timelineDate}>{dateStr}</div>
                                    <div style={styles.timelineDesc}>{descStr}</div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        // PROJECTS (right)
        projects: ({ itemIndices, isContinued, subItemRanges, zoneId }) => {
            const isSidebar = zoneId?.includes('left');
            const items = itemIndices ? itemIndices.map(idx => data.projects?.[idx]) : data.projects;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="projects" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Projects">
                    <div>
                        <SectionTitle titleKey="projects" title="Projects" zoneId={zoneId} />
                        {items.map((proj, i) => {
                            if (!proj) return null;
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const dateStr = proj.year || proj.duration || (proj.startYear && `${proj.startYear} - ${proj.isCurrent ? 'Present' : (proj.endYear || 'Present')}`);
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.projItem}>
                                    <div style={styles.projTitle}>
                                        <RichTextSpellCheck html={proj.title} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('projects', originalIdx, val, 'title')} />
                                    </div>
                                    {dateStr && (
                                        <div style={styles.projDuration}>
                                            <SpellCheckText text={dateStr} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('projects', originalIdx, val, 'year')} />
                                        </div>
                                    )}
                                    {proj.technologies && proj.technologies.length > 0 && (
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "4px" }}>
                                            {proj.technologies.map((tech, tIdx) => (
                                                <span key={tIdx} style={{ fontSize: "calc(10.5px * var(--theme-font-scale, 1))", padding: "1px 6px", border: `1px solid ${GOLD}`, borderRadius: "2px", color: GOLD }}>
                                                    <RichTextSpellCheck html={tech} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => { const updated = [...proj.technologies]; updated[tIdx] = val; onSpellCheckReplace('projects', originalIdx, updated, 'technologies'); }} />
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="resume-rich-text" style={styles.projDesc}>
                                        <SplittableRichText html={proj.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('projects', originalIdx, val, 'description')} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        // LANGUAGES (right)
        languages: ({ itemIndices, isContinued, zoneId }) => {
            const isSidebar = zoneId?.includes('left');
            const items = itemIndices ? itemIndices.map(idx => data.languages?.[idx]) : data.languages;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="languages" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Language">
                    <div>
                        <SectionTitle titleKey="language" title="Language" zoneId={zoneId} />
                        {items.map((lang, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const name = typeof lang === 'object' ? (lang.name || lang.language || "") : lang;
                            const level = typeof lang === 'object' ? (lang.level || lang.proficiency || "") : "";
                            return (
                                <div key={i} data-item-index={originalIdx}>
                                    <div style={styles.languageItem}>
                                        <RichTextSpellCheck html={name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('languages', originalIdx, val, 'name')} />
                                        {level && <span style={{ fontSize: "calc(11px * var(--theme-font-scale, 1))", color: TEXT_LIGHT, fontWeight: "400", marginLeft: "6px", textTransform: "none" }}>{level}</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        // CERTIFICATIONS (right)
        certifications: ({ itemIndices, isContinued, zoneId, subItemRanges: renderSubItemRanges }) => {
            const isSidebar = zoneId?.includes('left');
            const items = itemIndices ? itemIndices.map(idx => data.certifications?.[idx]) : data.certifications;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="certifications" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Certifications">
                    <div>
                        <SectionTitle titleKey="certifications" title="Certifications" zoneId={zoneId} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "calc(8px * var(--theme-paragraph-margin, 1))" }}>
                            {items.map((cert, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <CertificationItem
                                        key={i}
                                        item={cert}
                                        index={originalIdx}
                                        isSpellCheckActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onSpellCheckReplace={(field, val) => onSpellCheckReplace('certifications', originalIdx, val, field)}
                                        variant="compact"
                                        subItemRange={renderSubItemRanges?.[originalIdx]}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        // SOFTWARE (right)
        software: ({ itemIndices, isContinued, zoneId, subItemRanges: renderSubItemRanges }) => {
            const isSidebar = zoneId?.includes('left');
            const items = itemIndices ? itemIndices.map(idx => data.software?.[idx]) : data.software;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="software" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Software">
                    <div>
                        <SectionTitle titleKey="software" title="Software" zoneId={zoneId} />
                        <div style={styles.skillTagsContainer}>
                            {items.map((item, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                const name = typeof item === 'object' ? item.name : item;
                                return (
                                    <div key={i} data-item-index={originalIdx} style={styles.skillTag}>
                                        <RichTextSpellCheck html={name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('software', originalIdx, val, 'name')} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },


        // INTERESTS (right)
        interests: ({ itemIndices, zoneId }) => {
            const isSidebar = zoneId?.includes('left');
            const items = itemIndices ? itemIndices.map(idx => data.interests?.[idx]) : data.interests;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="interests" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Interests">
                    <div>
                        <SectionTitle titleKey="interests" title="Interests" zoneId={zoneId} />
                        <div style={styles.skillTagsContainer}>
                            {items.map((item, i) => (
                                <div key={i} data-item-index={itemIndices ? itemIndices[i] : i} style={styles.skillTag}>
                                    <RichTextSpellCheck html={typeof item === 'object' ? item.name : item} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('interests', itemIndices ? itemIndices[i] : i, val, 'name')} />
                                </div>
                            ))}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        // WEBSITES (right)
        websites: ({ itemIndices, zoneId }) => {
            const isSidebar = zoneId?.includes('left');
            const items = itemIndices ? itemIndices.map(idx => data.websites?.[idx]) : data.websites;
            const portfolioLinks = (items || [])
                .map((link, idx) => ({ ...link, originalIdx: itemIndices ? itemIndices[idx] : idx }))
                .filter(link => link.url && !link.addToHeader);
            if (portfolioLinks.length === 0) return null;
            return (
                <SectionWrapper sectionId="websites" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Websites & Portfolios">
                    <div>
                        <SectionTitle titleKey="websites" title="Websites & Portfolios" zoneId={zoneId} />
                        {portfolioLinks.map((site, i) => (
                            <div key={i} style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", marginBottom: "calc(6px * var(--theme-paragraph-margin, 1))", color: GOLD }}>
                                <ResumeLink href={site.url}>
                                    <SpellCheckText text={site.url} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('websites', site.originalIdx, val, 'url')} />
                                </ResumeLink>
                            </div>
                        ))}
                    </div>
                </SectionWrapper>
            );
        },

        // PERSONAL DETAILS (extra fields)
        personalDetails: ({ zoneId }) => {
            const isSidebar = zoneId?.includes('left');
            const details = [
                { label: "Date of Birth", value: personal?.dob || personal?.dateOfBirth || personal?.birthDate, key: 'dob' },
                { label: "Nationality", value: personal?.nationality, key: 'nationality' },
                { label: "Marital Status", value: personal?.maritalStatus || personal?.marital_status, key: 'maritalStatus' },
                { label: "Gender", value: personal?.gender, key: 'gender' },
                { label: "Visa Status", value: personal?.visaStatus || personal?.visa_status, key: 'visaStatus' },
                { label: "Religion", value: personal?.religion, key: 'religion' },
                { label: "Passport", value: personal?.passport || personal?.passportNumber, key: 'passport' },
                { label: "Place of Birth", value: personal?.placeOfBirth, key: 'placeOfBirth' },
                { label: "Driving License", value: personal?.drivingLicense, key: 'drivingLicense' },
                { label: "Other", value: personal?.otherPersonal || personal?.otherInformation, key: 'otherPersonal' },
            ].filter(d => d.value);

            if (details.length === 0) return null;

            return (
                <SectionWrapper sectionId="personalDetails" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Personal Details">
                    <div>
                        <SectionTitle titleKey="personalDetails" title="Personal Details" zoneId={zoneId} />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "8px", fontSize: "calc(11.5px * var(--theme-font-scale, 1))" }}>
                            {details.map((detail, idx) => (
                                <React.Fragment key={idx}>
                                    <div style={{ color: GOLD, fontWeight: "600" }}>{detail.label}:</div>
                                    <div style={{ color: TEXT }}>
                                        <SpellCheckText text={detail.value} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', detail.key, val)} />
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        // KEY ACHIEVEMENTS
        keyAchievements: ({ itemIndices, zoneId }) => {
            const isSidebar = zoneId?.includes('left');
            const items = itemIndices ? itemIndices.map(idx => data.keyAchievements?.[idx]) : data.keyAchievements;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="keyAchievements" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Key Achievements">
                    <div>
                        <SectionTitle titleKey="awards" title="Key Achievements" zoneId={zoneId} />
                        <ul style={{ margin: 0, paddingLeft: "18px", color: TEXT, fontSize: "calc(12px * var(--theme-font-scale, 1))" }}>
                            {items.map((item, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                const content = typeof item === 'object' ? (item.name + (item.description ? `: ${item.description}` : "")) : item;
                                return (
                                    <li key={i} data-item-index={originalIdx} style={{ marginBottom: "4px" }}>
                                        <RichTextSpellCheck html={content} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('keyAchievements', originalIdx, val, 'name')} />
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </SectionWrapper>
            );
        },

        // ACCOMPLISHMENTS
        accomplishments: ({ itemIndices, zoneId }) => {
            const isSidebar = zoneId?.includes('left');
            const items = itemIndices ? itemIndices.map(idx => data.accomplishments?.[idx]) : data.accomplishments;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="accomplishments" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Accomplishments">
                    <div>
                        <SectionTitle titleKey="awards" title="Accomplishments" zoneId={zoneId} />
                        <ul style={{ margin: 0, paddingLeft: "18px", color: TEXT, fontSize: "calc(12px * var(--theme-font-scale, 1))" }}>
                            {items.map((item, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                const content = typeof item === 'object' ? (item.name + (item.description ? `: ${item.description}` : "")) : item;
                                return (
                                    <li key={i} data-item-index={originalIdx} style={{ marginBottom: "4px" }}>
                                        <RichTextSpellCheck html={content} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('accomplishments', originalIdx, val, 'name')} />
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </SectionWrapper>
            );
        },

        // AFFILIATIONS
        affiliations: ({ itemIndices, zoneId }) => {
            const isSidebar = zoneId?.includes('left');
            const items = itemIndices ? itemIndices.map(idx => data.affiliations?.[idx]) : data.affiliations;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="affiliations" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Professional Affiliations">
                    <div>
                        <SectionTitle titleKey="experience" title="Professional Affiliations" zoneId={zoneId} />
                        {items.map((item, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.projItem}>
                                    <div style={styles.projTitle}>
                                        <RichTextSpellCheck
                                            html={item.name}
                                            isActive={isSpellCheckActive}
                                            onIgnore={onSpellCheckIgnore}
                                            onReplace={(val) => onSpellCheckReplace('affiliations', originalIdx, val, 'name')}
                                        />
                                    </div>
                                    {item.description && (
                                        <div className="resume-rich-text" style={styles.projDesc}>
                                            <SplittableRichText
                                                html={item.description}
                                                isActive={isSpellCheckActive}
                                                onIgnore={onSpellCheckIgnore}
                                                onReplace={(val) => onSpellCheckReplace('affiliations', originalIdx, val, 'description')}
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

        // CONTACT (fallback)
        contact: ({ zoneId }) => {
            const isSidebar = zoneId?.includes('left');
            return (
                <SectionWrapper sectionId="contact" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Contact">
                    <div>
                        <SectionTitle titleKey="contact" title="Contact" zoneId={zoneId} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            {personal?.phone && (
                                <div style={styles.contactRow}>
                                    <span style={styles.headerContactIcon}><PhoneIcon /></span>
                                    <ResumeLink href={personal.phone}>
                                        <SpellCheckText text={personal.phone} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'phone', val)} />
                                    </ResumeLink>
                                </div>
                            )}
                            {personal?.email && (
                                <div style={styles.contactRow}>
                                    <span style={styles.headerContactIcon}><MailIcon /></span>
                                    <ResumeLink href={personal.email}>
                                        <SpellCheckText text={personal.email} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'email', val)} />
                                    </ResumeLink>
                                </div>
                            )}
                            {(personal?.city || personal?.country || personal?.zipCode) && (
                                <div style={styles.contactRow}>
                                    <span style={styles.headerContactIcon}><MapIcon /></span>
                                    <SpellCheckText text={[personal?.city, personal?.state, personal?.country, personal?.zipCode].filter(Boolean).join(", ")} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'city', val)} />
                                </div>
                            )}
                            {personal?.linkedin && (
                                <div style={styles.contactRow}>
                                    <span style={styles.headerContactIcon}><BriefcaseIcon /></span>
                                    <ResumeLink href={personal.linkedin}>
                                        <SpellCheckText text={personal.linkedin} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'linkedin', val)} />
                                    </ResumeLink>
                                </div>
                            )}
                            {personal?.github && (
                                <div style={styles.contactRow}>
                                    <span style={styles.headerContactIcon}><GithubIcon /></span>
                                    <ResumeLink href={personal.github}>
                                        <SpellCheckText text={personal.github} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'github', val)} />
                                    </ResumeLink>
                                </div>
                            )}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },


        // ADDITIONAL INFO (left)
        additionalInfo: ({ isContinued, subItemRanges: renderSubItemRanges, zoneId }) => {
            const isSidebar = zoneId?.includes('left');
            const html = data.additionalInfo || "";
            if (!html || html.trim() === "" || html === "<p><br></p>") return null;
            return (
                <SectionWrapper sectionId="additionalInfo" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Additional Information">
                    <div>
                        <SectionTitle titleKey="summary" title="Additional Information" zoneId={zoneId} />
                        <div className="resume-rich-text" style={{ fontSize: "calc(12.5px * var(--theme-font-scale, 1))", lineHeight: "1.6", color: TEXT }}>
                            <SplittableRichText html={html} range={renderSubItemRanges?.additionalInfo} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('additionalInfo', 'additionalInfo', val)} />
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        // CUSTOM (left)
        custom: ({ isContinued, subItemRanges: renderSubItemRanges, zoneId }) => {
            const isSidebar = zoneId?.includes('left');
            if (!data.customSection?.isVisible || !data.customSection?.content) return null;
            const content = data.customSection.content;
            if (!content || content.trim() === "" || content === "<p><br></p>") return null;
            const title = data.customSection.title || "Additional Information";
            return (
                <SectionWrapper sectionId="custom" onSectionClick={onSectionClick} isInteractive={isInteractive} label={title}>
                    <div>
                        <SectionTitle titleKey="summary" title={title} zoneId={zoneId} />
                        <div className="resume-rich-text" style={{ fontSize: "calc(12.5px * var(--theme-font-scale, 1))", lineHeight: "1.6", color: TEXT }}>
                            <SplittableRichText html={content} range={renderSubItemRanges?.custom} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('customSection', 'content', val)} />
                        </div>
                    </div>
                </SectionWrapper>
            );
        },
    };

    // ──────────────────────────────────────────
    // ZONE RENDERER
    // ──────────────────────────────────────────
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
                                isInteractive={isInteractive}
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

    // ──────────────────────────────────────────
    // MEASURER
    // ──────────────────────────────────────────
    const Measurer = () => (
        <div className="resume-measurer" style={{ position: "absolute", top: -10000, left: -10000, width: "210mm", visibility: "hidden" }}>
            <div className="page-height-marker" style={{ height: "297mm", width: "1px", position: "absolute", left: 0, top: 0 }} />
            <div style={{ ...styles.page, height: "auto" }}>
                <Header />
                <div style={styles.body}>
                    <div data-column-id="left" style={styles.leftColumn}>
                        {activeLeftSections.map(sid => (
                            <SectionRenderer key={sid} sectionId={sid} data={data} customRenderers={customRenderers} zoneId="left" />
                        ))}
                    </div>
                    <div data-column-id="right" style={styles.rightColumn}>
                        {activeRightSections.map(sid => (
                            <SectionRenderer key={sid} sectionId={sid} data={data} customRenderers={customRenderers} zoneId="right" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    // ──────────────────────────────────────────
    // PAGE RENDER
    // ──────────────────────────────────────────
    const renderPage = (page, i) => (
        <div key={i} style={styles.page}>
            {i === 0 && <Header />}
            <div style={{ ...styles.body, flex: 1 }}>
                <div data-column-id="left" style={styles.leftColumn}>
                    {renderZone(
                        `left-p${i}`,
                        page.left || [],
                        { display: "flex", flexDirection: "column", gap: "calc(22px * var(--theme-section-margin, 1))", flex: 1 }
                    )}
                </div>
                <div data-column-id="right" style={styles.rightColumn}>
                    {renderZone(
                        `right-p${i}`,
                        page.right || [],
                        { display: "flex", flexDirection: "column", gap: "calc(22px * var(--theme-section-margin, 1))", flex: 1 }
                    )}
                </div>
            </div>
            <div style={{ position: "absolute", bottom: "10px", right: "16px", fontSize: "9px", color: "#aaa" }}>
                Page {i + 1}
            </div>
        </div>
    );

    const renderSinglePage = () => (
        <div style={{ ...styles.page, height: "auto", minHeight: "297mm" }}>
            <Header />
            <div style={styles.body}>
                <div data-column-id="left" style={styles.leftColumn}>
                    {renderZone('left', activeLeftSections, {
                        display: "flex", flexDirection: "column",
                        gap: "calc(22px * var(--theme-section-margin, 1))", flex: 1
                    })}
                </div>
                <div data-column-id="right" style={styles.rightColumn}>
                    {renderZone('right', activeRightSections, {
                        display: "flex", flexDirection: "column",
                        gap: "calc(22px * var(--theme-section-margin, 1))", flex: 1
                    })}
                </div>
            </div>
        </div>
    );

    return (
        <div ref={containerRef} className="ochre-executive-root">
            <Measurer />
            <DndContext {...dndContextProps}>
                <SortableContext items={[...activeLeftSections, ...activeRightSections]} strategy={verticalListSortingStrategy}>
                    {showPageBreaks && pages
                        ? pages.map((page, i) => renderPage(page, i))
                        : renderSinglePage()
                    }
                </SortableContext>
                <StableResumeDragOverlay
                    activeId={activeId}
                    scale={scale}
                    renderSection={(id) => (
                        <div style={{ background: "white", padding: "10px", border: "1px solid #ddd", width: "280px" }}>
                            <SectionRenderer sectionId={id} data={data} customRenderers={customRenderers} />
                        </div>
                    )}
                />
            </DndContext>
        </div>
    );
};

export default OchreExecutive;