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
 * AzureExecutive Template
 * Faithful recreation of the provided image:
 *
 * HEADER (full width):
 *   Left: First name (large, blue, bold) / Last name (larger, black, bold) / Profession (dark, caps, small)
 *   Center: Vertical pipe divider line extending full header height
 *   Right: PHONE | value, EMAIL | value, LOCATION | value, EXPERIENCE | value (table-style)
 *
 * Below header: full-width blue accent bar
 *
 * BODY (two columns):
 *   Left (~38%): Key Skills (bullet), Career Timeline (two-col date+desc), Languages, Certifications, Software, Awards, Interests, Websites
 *   Right (~62%): Profile Summary, Work Experience (blue left-bar accent, bold role, company, blue date, desc), Education (blue left-bar), Projects, Volunteer, Publications, Custom, AdditionalInfo
 *
 * Accent color: var(--theme-color, #1a6fd4)
 * Full pagination, section breaking, drag-and-drop, spell check, spacing vars
 */
const AzureExecutive = ({
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

    // ── THEME ──
    const BLUE = "var(--theme-color, #1a6fd4)";
    const DARK = "#111827";
    const TEXT = "#2d2d2d";
    const TEXT_LIGHT = "#555";
    const DIVIDER = "#e5e7eb";

    // ── LAYOUT ──
    const templateId = 'azure-executive';
    const savedLayout = data.templateLayouts?.[templateId] || {};
    const initialLayout = {
        left: savedLayout.left || savedLayout.sidebar || ['skills', 'strengths', 'additionalSkills', 'careerTimeline', 'languages', 'certifications', 'software', 'interests', 'websites', 'contact', 'personalDetails'],
        right: savedLayout.right || savedLayout.main || ['summary', 'experience', 'education', 'projects', 'keyAchievements', 'accomplishments', 'affiliations', 'additionalInfo', 'custom']
    };

    const completeLayout = getCompleteLayout(data, initialLayout, 'right');
    const activeLeftSections = completeLayout.left || [];
    const activeRightSections = completeLayout.right || [];

    // ── DRAG & DROP ──
    const { dndContextProps, activeId } = useResumeDragAndDrop({
        data, onReorder, scale,
        containers: { left: activeLeftSections, right: activeRightSections }
    });

    // ── PAGINATION ──
    const pages = useAutoPagination({
        columns: { left: activeLeftSections, right: activeRightSections },
        data,
        enabled: showPageBreaks,
        containerRef,
        scale
    });

    // ── STYLES ──
    const S = {
        page: {
            width: "210mm",
            height: "297mm",
            background: "white",
            boxSizing: "border-box",
            position: "relative",
            margin: "0 auto 30px auto",
            color: TEXT,
            fontFamily: "var(--theme-font, 'Helvetica Neue', Arial, sans-serif)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
        },

        // ── HEADER ──
        header: {
            display: "flex",
            padding: "28px 32px 0 32px",
            gap: "24px",
            flexShrink: 0,
            minHeight: "120px",
            alignItems: "flex-start",
        },
        headerPhoto: {
            width: "85px",
            height: "105px",
            objectFit: "cover",
            border: `2px solid ${BLUE}`,
            flexShrink: 0,
        },
        headerLeft: {
            flex: "0 0 auto",
            minWidth: "220px",
            paddingRight: "24px",
            paddingBottom: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
        },
        firstName: {
            fontSize: "calc(34px * var(--theme-font-scale, 1))",
            fontWeight: "800",
            color: BLUE,
            lineHeight: "1.05",
            letterSpacing: "-0.5px",
            margin: 0,
        },
        lastName: {
            fontSize: "calc(40px * var(--theme-font-scale, 1))",
            fontWeight: "800",
            color: DARK,
            lineHeight: "1.0",
            letterSpacing: "-0.5px",
            margin: 0,
        },
        profession: {
            fontSize: "calc(11px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: DARK,
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginTop: "8px",
            lineHeight: "1.4",
        },
        headerDivider: {
            width: "1px",
            background: "#c0c0c0",
            alignSelf: "stretch",
            margin: "0 24px 0 0",
            flexShrink: 0,
        },
        headerRight: {
            flex: 1,
            paddingBottom: "20px",
            paddingTop: "6px",
        },
        headerRightContent: {
            display: "flex",
            flexDirection: "column",
            gap: "7px",
        },
        contactTableRow: {
            display: "flex",
            alignItems: "baseline",
            gap: 0,
        },
        contactLabel: {
            fontSize: "calc(10.5px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: DARK,
            textTransform: "uppercase",
            letterSpacing: "0.8px",
            minWidth: "90px",
            flexShrink: 0,
        },
        contactPipe: {
            fontSize: "calc(11px * var(--theme-font-scale, 1))",
            color: BLUE,
            fontWeight: "700",
            marginRight: "10px",
            flexShrink: 0,
        },
        contactValue: {
            fontSize: "calc(11.5px * var(--theme-font-scale, 1))",
            color: TEXT,
            wordBreak: "break-all",
        },

        // ── ACCENT BAR ──
        accentBar: {
            height: "7px",
            background: BLUE,
            width: "100%",
            flexShrink: 0,
        },

        // ── BODY ──
        body: {
            display: "flex",
            flex: 1,
            minHeight: 0,
        },
        leftColumn: {
            width: "38%",
            padding: "22px var(--theme-page-margin, 20px) var(--theme-page-margin, 30px) var(--theme-page-margin, 32px)",
            display: "flex",
            flexDirection: "column",
            gap: "calc(22px * var(--theme-section-margin, 1))",
            borderRight: `1px solid ${DIVIDER}`,
        },
        rightColumn: {
            width: "62%",
            padding: "22px var(--theme-page-margin, 32px) var(--theme-page-margin, 30px) var(--theme-page-margin, 24px)",
            display: "flex",
            flexDirection: "column",
            gap: "calc(22px * var(--theme-section-margin, 1))",
        },

        // ── SECTION TITLE ──
        sectionTitle: {
            fontSize: "calc(16px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: DARK,
            marginBottom: "12px",
            margin: 0,
            paddingBottom: "0",
        },
        sectionTitleWrap: {
            marginBottom: "12px",
        },

        // ── SKILL BULLETS (left) ──
        skillBullet: {
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
            marginBottom: "calc(7px * var(--theme-paragraph-margin, 1))",
            fontSize: "calc(12.5px * var(--theme-font-scale, 1))",
            color: TEXT,
            lineHeight: "var(--theme-line-height, 1.45)",
        },
        skillDot: {
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            background: DARK,
            flexShrink: 0,
            marginTop: "5px",
        },

        // ── CAREER TIMELINE (left) ──
        timelineRow: {
            display: "flex",
            gap: "12px",
            marginBottom: "calc(9px * var(--theme-paragraph-margin, 1))",
            alignItems: "flex-start",
        },
        timelineDate: {
            fontSize: "calc(11.5px * var(--theme-font-scale, 1))",
            color: TEXT,
            fontWeight: "400",
            width: "62px",
            flexShrink: 0,
            lineHeight: "var(--theme-line-height, 1.4)",
        },
        timelineDesc: {
            fontSize: "calc(11.5px * var(--theme-font-scale, 1))",
            color: TEXT,
            lineHeight: "var(--theme-line-height, 1.45)",
            flex: 1,
        },

        // ── LANGUAGE (left) ──
        langItem: {
            fontSize: "calc(12.5px * var(--theme-font-scale, 1))",
            color: TEXT,
            marginBottom: "calc(6px * var(--theme-paragraph-margin, 1))",
            lineHeight: "var(--theme-line-height, 1.4)",
        },
        // Generic rich text block
        richText: {
            fontSize: "calc(12.5px * var(--theme-font-scale, 1))",
            lineHeight: "var(--theme-line-height, 1.6)",
            color: TEXT,
        },

        // ── EXPERIENCE (right) ──
        expItem: {
            marginBottom: "calc(18px * var(--theme-paragraph-margin, 1))",
            paddingLeft: "12px",
            borderLeft: `3px solid ${BLUE}`,
            position: "relative",
        },
        expRole: {
            fontSize: "calc(13.5px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: DARK,
            marginBottom: "2px",
        },
        expCompany: {
            fontSize: "calc(12.5px * var(--theme-font-scale, 1))",
            color: TEXT,
            marginBottom: "2px",
        },
        expDate: {
            fontSize: "calc(11.5px * var(--theme-font-scale, 1))",
            color: BLUE,
            marginBottom: "6px",
            fontWeight: "500",
        },
        expDesc: {
            fontSize: "calc(12.5px * var(--theme-font-scale, 1))",
            lineHeight: "var(--theme-line-height, 1.6)",
            color: TEXT,
        },

        // ── EDUCATION (right) ──
        eduItem: {
            marginBottom: "calc(14px * var(--theme-paragraph-margin, 1))",
            paddingLeft: "12px",
            borderLeft: `3px solid ${BLUE}`,
        },
        eduDegree: {
            fontSize: "calc(13.5px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: DARK,
            marginBottom: "2px",
        },
        eduYear: {
            fontSize: "calc(11.5px * var(--theme-font-scale, 1))",
            color: TEXT_LIGHT,
            marginBottom: "2px",
        },
        eduInst: {
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            color: TEXT_LIGHT,
        },

        // ── PROJECTS (right) ──
        projItem: {
            marginBottom: "calc(14px * var(--theme-paragraph-margin, 1))",
            paddingLeft: "12px",
            borderLeft: `3px solid ${BLUE}`,
        },
        projTitle: {
            fontSize: "calc(13.5px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: DARK,
            marginBottom: "2px",
        },
        projDate: {
            fontSize: "calc(11.5px * var(--theme-font-scale, 1))",
            color: BLUE,
            marginBottom: "4px",
        },
        projDesc: {
            fontSize: "calc(12.5px * var(--theme-font-scale, 1))",
            lineHeight: "var(--theme-line-height, 1.55)",
            color: TEXT,
        },

        // ── SUMMARY (right) ──
        summaryText: {
            fontSize: "calc(12.5px * var(--theme-font-scale, 1))",
            lineHeight: "var(--theme-line-height, 1.65)",
            color: TEXT,
        },

        // ── LEFT SECTION GENERIC ──
        leftSectionTitle: {
            fontSize: "calc(15px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: DARK,
            marginBottom: "10px",
        },

        // ── RIGHT SECTION GENERIC ──
        rightSectionTitle: {
            fontSize: "calc(16px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: DARK,
            marginBottom: "12px",
        },
    };

    // ──────────────────────────────────────────
    // SECTION TITLE HELPERS
    // ──────────────────────────────────────────
    const AdaptiveTitle = ({ title, zoneId }) => {
        const { isContinued } = useSectionContext();
        const isLeft = zoneId?.includes("left");
        const style = isLeft ? S.leftSectionTitle : S.rightSectionTitle;
        return <div style={style}>{isContinued ? `${title} (Cont.)` : title}</div>;
    };

    // ──────────────────────────────────────────
    // HEADER (full width)
    // ──────────────────────────────────────────
    const Header = () => {
        // Split name into first + last for two-tone effect
        const fullName = personal?.name || "YOUR NAME";
        const nameParts = fullName.trim().split(" ");
        const firstName = nameParts.slice(0, -1).join(" ") || fullName;
        const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

        return (
            <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Header">
                <div style={S.header}>
                    {personal?.photo && (
                        <img src={personal.photo} style={S.headerPhoto} alt="profile" />
                    )}
                    {/* LEFT: Name + Profession */}
                    <div style={S.headerLeft}>
                        <div>
                            <div style={S.firstName}>
                                <SpellCheckText
                                    text={firstName}
                                    isActive={isSpellCheckActive}
                                    onIgnore={onSpellCheckIgnore}
                                    onReplace={(val) => onSpellCheckReplace('personal', 'name', `${val} ${lastName}`.trim())}
                                />
                            </div>
                            {lastName && (
                                <div style={S.lastName}>
                                    <SpellCheckText
                                        text={lastName}
                                        isActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onReplace={(val) => onSpellCheckReplace('personal', 'name', `${firstName} ${val}`.trim())}
                                    />
                                </div>
                            )}
                        </div>
                        {personal?.profession && (
                            <div style={S.profession}>
                                <SpellCheckText
                                    text={personal.profession}
                                    isActive={isSpellCheckActive}
                                    onIgnore={onSpellCheckIgnore}
                                    onReplace={(val) => onSpellCheckReplace('personal', 'profession', val)}
                                />
                            </div>
                        )}
                    </div>

                    {/* CENTER: vertical divider */}
                    <div style={S.headerDivider} />

                    {/* RIGHT: Contact table */}
                    <div style={S.headerRight}>
                        <div style={S.headerRightContent}>
                            {personal?.phone && (
                                <div style={S.contactTableRow}>
                                    <span style={S.contactLabel}>PHONE</span>
                                    <span style={S.contactPipe}>|</span>
                                    <span style={S.contactValue}>
                                        <ResumeLink href={personal.phone}>
                                            <SpellCheckText text={personal.phone} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'phone', val)} />
                                        </ResumeLink>
                                    </span>
                                </div>
                            )}
                            {personal?.email && (
                                <div style={S.contactTableRow}>
                                    <span style={S.contactLabel}>EMAIL</span>
                                    <span style={S.contactPipe}>|</span>
                                    <span style={S.contactValue}>
                                        <ResumeLink href={personal.email}>
                                            <SpellCheckText text={personal.email} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'email', val)} />
                                        </ResumeLink>
                                    </span>
                                </div>
                            )}
                            {(personal?.city || personal?.country) && (
                                <div style={S.contactTableRow}>
                                    <span style={S.contactLabel}>LOCATION</span>
                                    <span style={S.contactPipe}>|</span>
                                    <span style={S.contactValue}>
                                        <SpellCheckText
                                            text={[personal?.city, personal?.state, personal?.country, personal?.zipCode].filter(Boolean).join(", ")}
                                            isActive={isSpellCheckActive}
                                            onIgnore={onSpellCheckIgnore}
                                            onReplace={(val) => onSpellCheckReplace('personal', 'city', val)}
                                        />
                                    </span>
                                </div>
                            )}
                            {personal?.linkedin && (
                                <div style={S.contactTableRow}>
                                    <span style={S.contactLabel}>LINKEDIN</span>
                                    <span style={S.contactPipe}>|</span>
                                    <span style={S.contactValue}>
                                        <ResumeLink href={personal.linkedin}>
                                            <SpellCheckText text={personal.linkedin} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'linkedin', val)} />
                                        </ResumeLink>
                                    </span>
                                </div>
                            )}
                            {personal?.github && (
                                <div style={S.contactTableRow}>
                                    <span style={S.contactLabel}>GITHUB</span>
                                    <span style={S.contactPipe}>|</span>
                                    <span style={S.contactValue}>
                                        <ResumeLink href={personal.github}>
                                            <SpellCheckText text={personal.github} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'github', val)} />
                                        </ResumeLink>
                                    </span>
                                </div>
                            )}
                            {personal?.website && (
                                <div style={S.contactTableRow}>
                                    <span style={S.contactLabel}>WEBSITE</span>
                                    <span style={S.contactPipe}>|</span>
                                    <span style={S.contactValue}>
                                        <ResumeLink href={personal.website}>
                                            <SpellCheckText text={personal.website} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'website', val)} />
                                        </ResumeLink>
                                    </span>
                                </div>
                            )}
                            {(data.websites || []).filter(l => l.addToHeader && l.url).map((link, i) => (
                                <div key={i} style={S.contactTableRow}>
                                    <span style={S.contactLabel}>{link.label || 'LINK'}</span>
                                    <span style={S.contactPipe}>|</span>
                                    <span style={S.contactValue}>
                                        <ResumeLink href={link.url}>
                                            <SpellCheckText text={link.url} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('websites', i, val, 'url')} />
                                        </ResumeLink>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </SectionWrapper>
        );
    };

    // ──────────────────────────────────────────
    // CUSTOM RENDERERS
    // ──────────────────────────────────────────
    const customRenderers = {

        // ── LEFT SECTIONS ──

        // SKILLS — bullet list
        skills: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.skills?.[idx]).filter(Boolean) : (data.skills || []);
            const hasDescription = data.skillsDescription && data.skillsDescription.trim();
            const isLeft = zoneId && zoneId.includes("left");
            if (items.length === 0 && !hasDescription) return null;
            return (
                <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Key Skills">
                    <div>
                        <AdaptiveTitle title="Key Skills" zoneId={zoneId} />
                        {isLeft ? (
                            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                {items.map((skill, i) => {
                                    const originalIdx = itemIndices ? itemIndices[i] : i;
                                    const lvl = typeof skill === 'object' ? (skill.level ?? skill.rating) : null;
                                    return (
                                        <li key={originalIdx} data-item-index={originalIdx} style={S.skillBullet}>
                                            <div style={S.skillDot} />
                                            <div style={{ flex: 1 }}>
                                                <RichTextSpellCheck html={typeof skill === 'object' ? skill.name : skill} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('skills', originalIdx, val, 'name')} />
                                            </div>
                                            {lvl > 0 && <span style={{ display: "flex", gap: "3px" }}>{[...Array(5)].map((_, di) => <div key={di} style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: di < lvl ? BLUE : "#ddd" }} />)}</span>}
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <ul style={{ paddingLeft: "16px", margin: 0 }}>
                                {items.map((skill, i) => {
                                    const originalIdx = itemIndices ? itemIndices[i] : i;
                                    return (
                                        <li key={originalIdx} data-item-index={originalIdx} style={{ marginBottom: "5px", fontSize: "calc(12.5px * var(--theme-font-scale, 1))", color: TEXT }}>
                                            <RichTextSpellCheck html={typeof skill === 'object' ? skill.name : skill} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('skills', originalIdx, val, 'name')} />
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </SectionWrapper>
            );
            if (hasDescription) {
                return (
                    <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Key Skills">
                        <div>
                            <AdaptiveTitle title="Key Skills" zoneId={zoneId} />
                            <div className="resume-rich-text" style={{ fontSize: "calc(12.5px * var(--theme-font-scale, 1))", color: TEXT }}>
                                <SplittableRichText html={data.skillsDescription} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('skills', 'skillsDescription', val)} />
                            </div>
                        </div>
                    </SectionWrapper>
                );
            }
            return null;
        },

        // STRENGTHS — bullet list (left)
        strengths: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.strengths?.[idx]).filter(Boolean) : (data.strengths || []);
            if (items.length === 0) return null;
            const isLeft = zoneId && zoneId.includes("left");
            return (
                <SectionWrapper sectionId="strengths" navigationId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Key Strengths">
                    <div>
                        <AdaptiveTitle title="Key Strengths" zoneId={zoneId} />
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            {items.map((skill, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                const lvl = typeof skill === 'object' ? (skill.level ?? skill.rating) : null;
                                return (
                                    <li key={originalIdx} data-item-index={originalIdx} style={isLeft ? S.skillBullet : { marginBottom: "5px", fontSize: "calc(12.5px * var(--theme-font-scale, 1))", color: TEXT }}>
                                        {isLeft && <div style={S.skillDot} />}
                                        <div style={{ flex: 1 }}>
                                            <RichTextSpellCheck html={typeof skill === 'object' ? skill.name : skill} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('strengths', originalIdx, val, 'name')} />
                                        </div>
                                        {lvl > 0 && <span style={{ display: "flex", gap: "3px", marginLeft: "8px" }}>{[...Array(5)].map((_, di) => <div key={di} style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: di < lvl ? BLUE : "#ddd" }} />)}</span>}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </SectionWrapper>
            );
        },

        // ADDITIONAL SKILLS — bullet list (left)
        additionalSkills: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.additionalSkills?.[idx]).filter(Boolean) : (data.additionalSkills || []);
            if (items.length === 0) return null;
            const isLeft = zoneId && zoneId.includes("left");
            return (
                <SectionWrapper sectionId="additionalSkills" navigationId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Additional Skills">
                    <div>
                        <AdaptiveTitle title="Additional Skills" zoneId={zoneId} />
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            {items.map((skill, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                const lvl = typeof skill === 'object' ? (skill.level ?? skill.rating) : null;
                                return (
                                    <li key={originalIdx} data-item-index={originalIdx} style={isLeft ? S.skillBullet : { marginBottom: "5px", fontSize: "calc(12.5px * var(--theme-font-scale, 1))", color: TEXT }}>
                                        {isLeft && <div style={S.skillDot} />}
                                        <div style={{ flex: 1 }}>
                                            <RichTextSpellCheck html={typeof skill === 'object' ? skill.name : skill} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('additionalSkills', originalIdx, val, 'name')} />
                                        </div>
                                        {lvl > 0 && <span style={{ display: "flex", gap: "3px", marginLeft: "8px" }}>{[...Array(5)].map((_, di) => <div key={di} style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: di < lvl ? BLUE : "#ddd" }} />)}</span>}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </SectionWrapper>
            );
        },

        // CAREER TIMELINE — uses experience data, two-col compact (left)
        careerTimeline: ({ zoneId }) => {
            const items = data.experience || [];
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="careerTimeline" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Career Timeline">
                    <div>
                        <AdaptiveTitle title="Career Timeline" zoneId={zoneId} />
                        {items.map((exp, i) => {
                            if (!exp) return null;
                            const dateStr = exp.year || exp.date || (exp.startYear ? (exp.isCurrent ? `Since ${exp.startYear}` : `${exp.startYear} - ${exp.endYear}`) : "");
                            const descStr = [exp.company, exp.location, exp.title || exp.role].filter(Boolean).join(", ");
                            return (
                                <div key={i} style={S.timelineRow}>
                                    <div style={S.timelineDate}>{dateStr}</div>
                                    <div style={S.timelineDesc}>{descStr}</div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        // LANGUAGES (left)
        languages: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.languages?.[idx]) : data.languages;
            if (!items || items.length === 0) return null;
            const isLeft = zoneId && zoneId.includes("left");
            return (
                <SectionWrapper sectionId="languages" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Languages">
                    <div>
                        <AdaptiveTitle title="Languages" zoneId={zoneId} />
                        {isLeft ? (
                            items.map((lang, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                const name = typeof lang === 'object' ? (lang.name || lang.language || "") : lang;
                                const level = typeof lang === 'object' ? (lang.level || lang.proficiency || "") : "";
                                return (
                                    <div key={i} data-item-index={originalIdx} style={S.langItem}>
                                        <RichTextSpellCheck html={name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('languages', originalIdx, val, 'name')} />
                                        {level && <span style={{ color: TEXT_LIGHT, fontSize: "calc(11px * var(--theme-font-scale, 1))", marginLeft: "6px" }}>{level}</span>}
                                    </div>
                                );
                            })
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                {items.map((lang, i) => {
                                    const originalIdx = itemIndices ? itemIndices[i] : i;
                                    return (
                                        <LanguageItem key={i} item={lang} index={originalIdx} isSpellCheckActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onSpellCheckReplace={(field, val) => onSpellCheckReplace('languages', originalIdx, val, field)} />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </SectionWrapper>
            );
        },

        // CERTIFICATIONS (left or right)
        certifications: ({ itemIndices, zoneId, subItemRanges: renderSubItemRanges }) => {
            const items = itemIndices ? itemIndices.map(idx => data.certifications?.[idx]) : data.certifications;
            if (!items || items.length === 0) return null;
            const isLeft = zoneId && zoneId.includes("left");
            return (
                <SectionWrapper sectionId="certifications" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Certifications">
                    <div>
                        <AdaptiveTitle title="Certifications" zoneId={zoneId} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "calc(8px * var(--theme-paragraph-margin, 1))" }}>
                            {items.map((cert, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <CertificationItem key={i} item={cert} index={originalIdx} isSpellCheckActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onSpellCheckReplace={(field, val) => onSpellCheckReplace('certifications', originalIdx, val, field)} variant={isLeft ? 'compact' : undefined} subItemRange={renderSubItemRanges?.[originalIdx]} />
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        // SOFTWARE
        software: ({ itemIndices, zoneId, subItemRanges: renderSubItemRanges }) => {
            const items = itemIndices ? itemIndices.map(idx => data.software?.[idx]) : data.software;
            if (!items || items.length === 0) return null;
            const isLeft = zoneId && zoneId.includes("left");
            return (
                <SectionWrapper sectionId="software" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Software">
                    <div>
                        <AdaptiveTitle title="Software" zoneId={zoneId} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "calc(8px * var(--theme-paragraph-margin, 1))" }}>
                            {items.map((item, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <SoftwareItem key={i} item={item} index={originalIdx} isSpellCheckActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onSpellCheckReplace={(field, val) => onSpellCheckReplace('software', originalIdx, val, field)} variant={isLeft ? 'compact' : undefined} subItemRange={renderSubItemRanges?.[originalIdx]} />
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },


        // INTERESTS
        interests: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.interests?.[idx]).filter(Boolean) : (data.interests || []);
            if (items.length === 0) return null;
            const isLeft = zoneId && zoneId.includes("left");
            return (
                <SectionWrapper sectionId="interests" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Interests">
                    <div>
                        <AdaptiveTitle title="Interests" zoneId={zoneId} />
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            {items.map((item, i) => (
                                <li key={i} data-item-index={itemIndices ? itemIndices[i] : i} style={isLeft ? S.skillBullet : { marginBottom: "5px", fontSize: "calc(12.5px * var(--theme-font-scale, 1))", color: TEXT }}>
                                    {isLeft && <div style={S.skillDot} />}
                                    <RichTextSpellCheck html={typeof item === 'object' ? item.name : item} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('interests', itemIndices ? itemIndices[i] : i, val, 'name')} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </SectionWrapper>
            );
        },

        // WEBSITES
        websites: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.websites?.[idx]) : data.websites;
            const links = (items || []).map((link, idx) => ({ ...link, originalIdx: itemIndices ? itemIndices[idx] : idx })).filter(link => link.url && !link.addToHeader);
            if (links.length === 0) return null;
            const isLeft = zoneId && zoneId.includes("left");
            return (
                <SectionWrapper sectionId="websites" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Websites & Portfolios">
                    <div>
                        <AdaptiveTitle title="Websites" zoneId={zoneId} />
                        {links.map((site, i) => (
                            <div key={i} style={{ fontSize: "calc(11.5px * var(--theme-font-scale, 1))", marginBottom: "5px", color: BLUE }}>
                                <ResumeLink href={site.url}>
                                    <SpellCheckText text={site.url} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('websites', site.originalIdx, val, 'url')} />
                                </ResumeLink>
                            </div>
                        ))}
                    </div>
                </SectionWrapper>
            );
        },

        // CONTACT (if placed in left column)
        contact: ({ zoneId }) => {
            return (
                <SectionWrapper sectionId="contact" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Contact">
                    <div>
                        <AdaptiveTitle title="Contact" zoneId={zoneId} />
                        {personal?.phone && (
                            <div style={S.timelineRow}>
                                <div style={{ ...S.timelineDate, minWidth: "60px" }}>Phone</div>
                                <div style={S.timelineDesc}><ResumeLink href={personal.phone}><SpellCheckText text={personal.phone} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'phone', val)} /></ResumeLink></div>
                            </div>
                        )}
                        {personal?.email && (
                            <div style={S.timelineRow}>
                                <div style={{ ...S.timelineDate, minWidth: "60px" }}>Email</div>
                                <div style={S.timelineDesc}><ResumeLink href={personal.email}><SpellCheckText text={personal.email} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'email', val)} /></ResumeLink></div>
                            </div>
                        )}
                    </div>
                </SectionWrapper>
            );
        },

        // ── RIGHT SECTIONS ──

        // SUMMARY (right)
        summary: ({ isContinued, subItemRanges, zoneId }) => {
            const isLeft = zoneId && zoneId.includes("left");
            return (
                <SectionWrapper sectionId="summary" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Profile Summary">
                    <div>
                        <AdaptiveTitle title="Profile Summary" zoneId={zoneId} />
                        <div className="resume-rich-text" style={S.summaryText}>
                            <SplittableRichText html={data.summary} range={subItemRanges?.summary} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('summary', 'summary', val)} />
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        // EXPERIENCE (right) — blue left-bar accent per item
        experience: ({ itemIndices, subItemRanges, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.experience?.[idx]) : data.experience;
            if (!items || items.length === 0) return null;
            const isLeft = zoneId && zoneId.includes("left");
            return (
                <SectionWrapper sectionId="experience" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Work Experience">
                    <div>
                        <AdaptiveTitle title="Work Experience" zoneId={zoneId} />
                        {items.map((exp, i) => {
                            if (!exp) return null;
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const dateStr = exp.year || exp.date || (exp.startYear ? `${exp.startYear === exp.endYear ? exp.startYear : `${exp.startYear} - ${exp.isCurrent ? "Present" : exp.endYear}`}` : "");
                            const companyLine = [exp.company, exp.location, exp.isRemote ? "Remote" : null].filter(Boolean).join(", ");
                            return (
                                <div key={i} data-item-index={originalIdx} style={S.expItem}>
                                    <div style={S.expRole}>
                                        <RichTextSpellCheck html={exp.title || exp.role || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'title')} />
                                    </div>
                                    <div style={S.expCompany}>
                                        <RichTextSpellCheck html={companyLine} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'company')} />
                                    </div>
                                    <div style={S.expDate}>
                                        <RichTextSpellCheck html={dateStr} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'date')} />
                                    </div>
                                    <div className="resume-rich-text" style={S.expDesc}>
                                        <SplittableRichText html={exp.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'description')} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        // EDUCATION (right) — blue left-bar per item
        education: ({ itemIndices, subItemRanges, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.education?.[idx]) : data.education;
            if (!items || items.length === 0) return null;
            const isLeft = zoneId && zoneId.includes("left");
            return (
                <SectionWrapper sectionId="education" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Education">
                    <div>
                        <AdaptiveTitle title="Education" zoneId={zoneId} />
                        {items.map((edu, i) => {
                            if (!edu) return null;
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const yearStr = edu.endYear || edu.startYear
                                ? [edu.startYear, edu.isCurrent ? 'Present' : edu.endYear].filter(Boolean).join(' – ')
                                : (edu.year || edu.date || '');
                            return (
                                <div key={i} data-item-index={originalIdx} style={S.eduItem}>
                                    <div style={S.eduDegree}>
                                        <RichTextSpellCheck html={edu.degree} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'degree')} />
                                    </div>
                                    <div style={S.eduYear}>
                                        <RichTextSpellCheck html={yearStr} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'year')} />
                                    </div>
                                    <div style={S.eduInst}>
                                        <RichTextSpellCheck html={`${edu.institution || edu.school || ""}${edu.location ? `, ${edu.location}` : ""}`} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'institution')} />
                                    </div>
                                    {edu.grade && <div style={{ fontSize: "calc(11.5px * var(--theme-font-scale, 1))", color: TEXT_LIGHT, marginTop: "2px" }}>{edu.grade}</div>}
                                    {edu.description && (
                                        <div className="resume-rich-text" style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", lineHeight: "1.5", marginTop: "4px", color: TEXT_LIGHT }}>
                                            <SplittableRichText html={edu.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'description')} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        // PROJECTS (right)
        projects: ({ itemIndices, subItemRanges, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.projects?.[idx]) : data.projects;
            if (!items || items.length === 0) return null;
            const isLeft = zoneId && zoneId.includes("left");
            return (
                <SectionWrapper sectionId="projects" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Projects">
                    <div>
                        <AdaptiveTitle title="Projects" zoneId={zoneId} />
                        {items.map((proj, i) => {
                            if (!proj) return null;
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const dateStr = proj.year || proj.duration || (proj.startYear && `${proj.startYear} - ${proj.isCurrent ? 'Present' : (proj.endYear || 'Present')}`);
                            return (
                                <div key={i} data-item-index={originalIdx} style={S.projItem}>
                                    <div style={S.projTitle}>
                                        <RichTextSpellCheck html={proj.title} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('projects', originalIdx, val, 'title')} />
                                    </div>
                                    {dateStr && <div style={S.projDate}>{dateStr}</div>}
                                    {proj.technologies && proj.technologies.length > 0 && (
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "4px" }}>
                                            {proj.technologies.map((tech, tIdx) => (
                                                <span key={tIdx} style={{ fontSize: "calc(10.5px * var(--theme-font-scale, 1))", padding: "1px 7px", border: `1px solid ${BLUE}`, borderRadius: "2px", color: BLUE }}>
                                                    <RichTextSpellCheck html={tech} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => { const u = [...proj.technologies]; u[tIdx] = val; onSpellCheckReplace('projects', originalIdx, u, 'technologies'); }} />
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="resume-rich-text" style={S.projDesc}>
                                        <SplittableRichText html={proj.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('projects', originalIdx, val, 'description')} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },


        // ADDITIONAL INFO (right)
        additionalInfo: ({ subItemRanges: renderSubItemRanges, zoneId }) => {
            const html = data.additionalInfo || "";
            if (!html || html.trim() === "" || html === "<p><br></p>") return null;
            const isLeft = zoneId && zoneId.includes("left");
            return (
                <SectionWrapper sectionId="additionalInfo" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Additional Information">
                    <div>
                        <AdaptiveTitle title="Additional Information" zoneId={zoneId} />
                        <div className="resume-rich-text" style={S.summaryText}>
                            <SplittableRichText html={html} range={renderSubItemRanges?.additionalInfo} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('additionalInfo', 'additionalInfo', val)} />
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        // CUSTOM (right)
        custom: ({ subItemRanges: renderSubItemRanges, zoneId }) => {
            if (!data.customSection?.isVisible || !data.customSection?.content) return null;
            const content = data.customSection.content;
            if (!content || content.trim() === "" || content === "<p><br></p>") return null;
            const isLeft = zoneId && zoneId.includes("left");
            const title = data.customSection.title || data.customSectionTitle || "Additional Information";
            return (
                <SectionWrapper sectionId="custom" onSectionClick={onSectionClick} isInteractive={isInteractive} label={title}>
                    <div>
                        <AdaptiveTitle title={title} zoneId={zoneId} />
                        <div className="resume-rich-text" style={S.richText}>
                            <SplittableRichText html={content} range={renderSubItemRanges?.custom} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('customSection', 'content', val)} />
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        // KEY ACHIEVEMENTS
        keyAchievements: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.keyAchievements?.[idx]).filter(Boolean) : (data.keyAchievements || []);
            if (items.length === 0) return null;
            const isLeft = zoneId && zoneId.includes("left");
            return (
                <SectionWrapper sectionId="keyAchievements" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Key Achievements">
                    <div>
                        <AdaptiveTitle title="Key Achievements" zoneId={zoneId} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: `calc(10px * var(--theme-paragraph-margin, 1))` }}>
                            {items.map((item, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <div key={i} data-item-index={originalIdx} style={isLeft ? {} : { paddingLeft: '12px', borderLeft: `3px solid ${BLUE}` }}>
                                        {item.name && <div style={{ fontWeight: '700', fontSize: 'calc(12.5px * var(--theme-font-scale, 1))', color: DARK, marginBottom: '3px' }}>
                                            <RichTextSpellCheck html={item.name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('keyAchievements', originalIdx, val, 'name')} />
                                        </div>}
                                        {item.description && <div className="resume-rich-text" style={S.richText}>
                                            <RichTextSpellCheck html={item.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('keyAchievements', originalIdx, val, 'description')} />
                                        </div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        // ACCOMPLISHMENTS
        accomplishments: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.accomplishments?.[idx]).filter(Boolean) : (data.accomplishments || []);
            if (items.length === 0) return null;
            const isLeft = zoneId && zoneId.includes("left");
            return (
                <SectionWrapper sectionId="accomplishments" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Accomplishments">
                    <div>
                        <AdaptiveTitle title="Accomplishments" zoneId={zoneId} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: `calc(10px * var(--theme-paragraph-margin, 1))` }}>
                            {items.map((item, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <div key={i} data-item-index={originalIdx} style={isLeft ? {} : { paddingLeft: '12px', borderLeft: `3px solid ${BLUE}` }}>
                                        {item.name && <div style={{ fontWeight: '700', fontSize: 'calc(12.5px * var(--theme-font-scale, 1))', color: DARK, marginBottom: '3px' }}>
                                            <RichTextSpellCheck html={item.name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('accomplishments', originalIdx, val, 'name')} />
                                        </div>}
                                        {item.description && <div className="resume-rich-text" style={S.richText}>
                                            <RichTextSpellCheck html={item.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('accomplishments', originalIdx, val, 'description')} />
                                        </div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        // AFFILIATIONS
        affiliations: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.affiliations?.[idx]).filter(Boolean) : (data.affiliations || []);
            if (items.length === 0) return null;
            const isLeft = zoneId && zoneId.includes("left");
            return (
                <SectionWrapper sectionId="affiliations" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Affiliations">
                    <div>
                        <AdaptiveTitle title="Affiliations" zoneId={zoneId} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: `calc(10px * var(--theme-paragraph-margin, 1))` }}>
                            {items.map((item, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <div key={i} data-item-index={originalIdx} style={isLeft ? {} : { paddingLeft: '12px', borderLeft: `3px solid ${BLUE}` }}>
                                        {item.name && <div style={{ fontWeight: '700', fontSize: 'calc(12.5px * var(--theme-font-scale, 1))', color: DARK, marginBottom: '3px' }}>
                                            <RichTextSpellCheck html={item.name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('affiliations', originalIdx, val, 'name')} />
                                        </div>}
                                        {item.description && <div className="resume-rich-text" style={S.richText}>
                                            <RichTextSpellCheck html={item.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('affiliations', originalIdx, val, 'description')} />
                                        </div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },


        // PERSONAL DETAILS
        personalDetails: ({ zoneId }) => {
            const p = data.personal || {};
            const fields = [
                { label: 'Date of Birth', value: p.dob || p.dateOfBirth || p.birthDate },
                { label: 'Nationality', value: p.nationality },
                { label: 'Marital Status', value: p.maritalStatus || p.marital_status },
                { label: 'Religion', value: p.religion },
                { label: 'Gender', value: p.gender },
                { label: 'Visa Status', value: p.visaStatus || p.visa_status },
                { label: 'Passport', value: p.passport || p.passportNumber },
                { label: 'Place of Birth', value: p.placeOfBirth },
                { label: 'Driving License', value: p.drivingLicense },
                { label: 'Other', value: p.otherPersonal || p.otherInformation },
            ].filter(f => f.value);
            if (fields.length === 0) return null;
            const isLeft = zoneId && zoneId.includes("left");
            return (
                <SectionWrapper sectionId="personalDetails" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Personal Details">
                    <div>
                        <AdaptiveTitle title="Personal Details" zoneId={zoneId} />
                        {fields.map((f, i) => (
                            <div key={i} style={S.timelineRow}>
                                <div style={{ ...S.timelineDate, minWidth: '80px' }}>{f.label}</div>
                                <div style={S.timelineDesc}>{f.value}</div>
                            </div>
                        ))}
                    </div>
                </SectionWrapper>
            );
        },
    };

    // ──────────────────────────────────────────
    // ZONE RENDERER
    // ──────────────────────────────────────────
    const renderZone = (id, items, colStyle) => (
        <DroppableZone id={id} style={{ ...colStyle, flex: 1 }}>
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
            <div style={{ ...S.page, height: "auto" }}>
                <Header />
                <div style={S.accentBar} />
                <div style={S.body}>
                    <div data-column-id="left" style={S.leftColumn}>
                        {activeLeftSections.map(sid => (
                            <SectionRenderer key={sid} sectionId={sid} data={data} customRenderers={customRenderers} zoneId="left" />
                        ))}
                    </div>
                    <div data-column-id="right" style={S.rightColumn}>
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
        <div key={i} style={S.page}>
            {i === 0 && <Header />}
            {i === 0 && <div style={S.accentBar} />}
            <div style={{ ...S.body, flex: 1 }}>
                <div data-column-id="left" style={S.leftColumn}>
                    {renderZone(
                        `left-p${i}`,
                        page.left || [],
                        { display: "flex", flexDirection: "column", gap: "calc(22px * var(--theme-section-margin, 1))" }
                    )}
                </div>
                <div data-column-id="right" style={S.rightColumn}>
                    {renderZone(
                        `right-p${i}`,
                        page.right || [],
                        { display: "flex", flexDirection: "column", gap: "calc(22px * var(--theme-section-margin, 1))" }
                    )}
                </div>
            </div>
            <div style={{ position: "absolute", bottom: "10px", right: "16px", fontSize: "9px", color: "#aaa" }}>
                Page {i + 1}
            </div>
        </div>
    );

    const renderSinglePage = () => (
        <div style={{ ...S.page, height: "auto", minHeight: "297mm" }}>
            <Header />
            <div style={S.accentBar} />
            <div style={S.body}>
                <div data-column-id="left" style={S.leftColumn}>
                    {renderZone('left', activeLeftSections, {
                        display: "flex", flexDirection: "column",
                        gap: "calc(22px * var(--theme-section-margin, 1))"
                    })}
                </div>
                <div data-column-id="right" style={S.rightColumn}>
                    {renderZone('right', activeRightSections, {
                        display: "flex", flexDirection: "column",
                        gap: "calc(22px * var(--theme-section-margin, 1))"
                    })}
                </div>
            </div>
        </div>
    );

    return (
        <div ref={containerRef} className="azure-executive-root">
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

export default AzureExecutive;