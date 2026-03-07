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
import {
    Mail, Phone, MapPin, Globe, Linkedin, Github,
    User, Briefcase, GraduationCap, Award, Monitor,
    Layout, Heart, BookOpen, Trophy, Users, Star, Globe2
} from "lucide-react";
import { getCompleteLayout, getSavedLayout } from "../common/TemplateUtils";

/**
 * SageSplit Template — Rebuilt per NEW_TEMPLATE_GUIDELINES.md
 *
 * Design:
 * - Light gray header: circular photo (left) + name/title (right) + SVG corner accents
 * - Two-column body: LEFT sidebar 38% | RIGHT main 62%
 * - Timeline-style entries (dot + vertical line) in main column
 * - Icon-prefixed section headings in dark navy
 *
 * Fixes applied vs old version:
 * 1. styles.page uses height:"297mm" + overflow:"hidden" (was minHeight + overflow:visible)
 * 2. Paginated pages explicitly set height:"297mm", minHeight:"unset", overflow:"hidden"
 * 3. Free-flow page uses height:"auto", minHeight:"297mm"
 */
const SageSplit = ({
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

    // ─── THEME ──────────────────────────────────────────────────────────────────
    const accent = "var(--theme-color, #1e3a5f)";
    const headerBg = "#e8edf2";

    // ─── LAYOUT ─────────────────────────────────────────────────────────────────
    const templateId = "sage-split";
    const initialLayout = getSavedLayout(data, templateId, {
        sidebar: ["summary", "contact", "skills", "strengths", "additionalSkills", "software", "languages", "interests", "certifications", "personalDetails", "websites"],
        main: ["education", "experience", "projects", "awards", "volunteer", "publications", "custom", "additionalInfo"],
    });
    const completeLayout = getCompleteLayout(data, initialLayout, "main");
    const activeSidebarSections = completeLayout.sidebar || [];
    const activeMainSections = completeLayout.main || [];

    // ─── DRAG & DROP ─────────────────────────────────────────────────────────────
    const { dndContextProps, activeId } = useResumeDragAndDrop({
        data, onReorder, scale,
        containers: { sidebar: activeSidebarSections, main: activeMainSections },
    });

    // ─── PAGINATION ──────────────────────────────────────────────────────────────
    const pages = useAutoPagination({
        columns: { sidebar: activeSidebarSections, main: activeMainSections },
        data,
        enabled: showPageBreaks,
        containerRef,
        scale,
    });

    // ─── STYLES ──────────────────────────────────────────────────────────────────
    const styles = {
        // ── Page ──────────────────────────────────────────────────────────────────
        // RULE: height MUST be "297mm" (fixed), overflow MUST be "hidden".
        // The paginated page render overrides to these same values explicitly.
        // The free-flow render overrides height to "auto" and minHeight to "297mm".
        page: {
            width: "210mm",
            height: "297mm",
            background: "#ffffff",
            boxSizing: "border-box",
            position: "relative",
            margin: "0 auto 30px auto",
            color: "#2d2d2d",
            fontFamily: "var(--theme-font, 'Georgia', serif)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
        },
        // ── Header ────────────────────────────────────────────────────────────────
        headerWrapper: {
            position: "relative",
            background: headerBg,
            display: "flex",
            alignItems: "center",
            padding: "30px 40px",
            minHeight: "160px",
            overflow: "hidden",
            flexShrink: 0,
        },
        cornerAccentTopRight: {
            position: "absolute", top: 0, right: 0,
            width: "90px", height: "90px",
            overflow: "hidden", pointerEvents: "none",
        },
        cornerAccentBottomRight: {
            position: "absolute", bottom: 0, right: 0,
            width: "70px", height: "70px",
            overflow: "hidden", pointerEvents: "none",
        },
        photoCircle: {
            width: "130px", height: "130px",
            borderRadius: "50%", objectFit: "cover",
            border: "4px solid white", flexShrink: 0,
            marginRight: "30px", background: "#ccd6e0",
        },
        photoPlaceholder: {
            width: "130px", height: "130px",
            borderRadius: "50%", background: "#ccd6e0",
            flexShrink: 0, marginRight: "30px",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#8898aa", fontSize: "40px", fontWeight: "300",
        },
        headerTextBlock: { flex: 1 },
        headerName: {
            fontSize: "calc(36px * var(--theme-font-scale, 1))",
            fontWeight: "700", color: "#1a1a2e",
            margin: 0, lineHeight: "1.15",
            fontFamily: "var(--theme-font, 'Georgia', serif)",
        },
        headerProfession: {
            fontSize: "calc(16px * var(--theme-font-scale, 1))",
            fontWeight: "400", color: "#556070",
            marginTop: "6px", letterSpacing: "0.3px",
        },
        // ── Body ──────────────────────────────────────────────────────────────────
        bodyRow: {
            display: "flex",
            flex: 1,
            minHeight: 0,
        },
        sidebarCol: {
            width: "38%",
            padding: "28px 24px 40px 36px",
            display: "flex",
            flexDirection: "column",
            gap: "calc(22px * var(--theme-section-margin, 1))",
            borderRight: "1px solid #e0e6ed",
            boxSizing: "border-box",
        },
        mainCol: {
            width: "62%",
            padding: "28px 36px 40px 28px",
            display: "flex",
            flexDirection: "column",
            gap: "calc(22px * var(--theme-section-margin, 1))",
            boxSizing: "border-box",
        },
        // ── Section Heading ────────────────────────────────────────────────────────
        sectionHeadingRow: {
            display: "flex", alignItems: "center",
            gap: "8px", marginBottom: "14px",
        },
        sectionIcon: { width: "22px", height: "22px", color: accent, flexShrink: 0 },
        sectionTitle: {
            fontSize: "calc(15px * var(--theme-font-scale, 1))",
            fontWeight: "700", color: accent,
            margin: 0, textTransform: "uppercase", letterSpacing: "0.8px",
        },
        sectionDivider: {
            height: "1px", background: "#d0dae4",
            marginTop: "4px", marginBottom: "14px",
        },
        // ── Contact ────────────────────────────────────────────────────────────────
        contactRow: {
            display: "flex", alignItems: "flex-start",
            gap: "9px",
            marginBottom: "calc(9px * var(--theme-paragraph-margin, 1))",
            fontSize: "calc(12.5px * var(--theme-font-scale, 1))",
            color: "#3d4f62", lineHeight: "1.4",
        },
        contactIcon: { width: "14px", height: "14px", color: accent, flexShrink: 0, marginTop: "1px" },
        // ── Skill Bullet ────────────────────────────────────────────────────────────
        skillBullet: {
            width: "6px", height: "6px",
            borderRadius: "50%", background: accent,
            flexShrink: 0, marginRight: "8px",
        },
        dotRating: { display: "flex", gap: "3px", marginLeft: "8px" },
        // ── Timeline ────────────────────────────────────────────────────────────────
        timelineItem: {
            display: "flex", gap: "0",
            marginBottom: "calc(22px * var(--theme-paragraph-margin, 1))",
            position: "relative",
        },
        timelineIndicator: {
            display: "flex", flexDirection: "column",
            alignItems: "center",
            width: "20px", flexShrink: 0, marginRight: "14px",
        },
        timelineDot: {
            width: "10px", height: "10px",
            borderRadius: "50%",
            border: `2px solid var(--theme-color, #1e3a5f)`,
            background: "white", marginTop: "4px", flexShrink: 0,
        },
        timelineLine: {
            width: "2px", flex: 1,
            background: "#d0dae4", marginTop: "4px", minHeight: "20px",
        },
        timelineContent: { flex: 1 },
        timelineDateBadge: {
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            fontWeight: "600", color: "#556070", marginBottom: "4px",
        },
        timelineTitle: {
            fontSize: "calc(13.5px * var(--theme-font-scale, 1))",
            fontWeight: "700", color: "#1a1a2e",
            textTransform: "uppercase", letterSpacing: "0.3px", marginBottom: "2px",
        },
        timelineSubtitle: {
            fontSize: "calc(12.5px * var(--theme-font-scale, 1))",
            color: "#556070", marginBottom: "6px",
        },
        timelineDescription: {
            fontSize: "calc(12.5px * var(--theme-font-scale, 1))",
            color: "#475569",
            lineHeight: "var(--theme-line-height, 1.6)",
        },
        timelineGrade: {
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            color: "#7c8fa0", marginTop: "2px",
        },
    };

    // ─── SVG Corner Accents ──────────────────────────────────────────────────────
    const CornerAccentTR = () => (
        <div style={styles.cornerAccentTopRight}>
            <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
                <path d="M90 0 L90 90 L60 90 L90 50 Z" fill="var(--theme-color, #1e3a5f)" opacity="0.85" />
                <path d="M90 0 L90 50 L50 0 Z" fill="var(--theme-color, #1e3a5f)" opacity="0.5" />
                <path d="M90 0 L90 30 L30 0 Z" fill="#4a90c4" opacity="0.4" />
            </svg>
        </div>
    );

    const CornerAccentBR = () => (
        <div style={styles.cornerAccentBottomRight}>
            <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
                <path d="M70 70 L0 70 L70 20 Z" fill="var(--theme-color, #1e3a5f)" opacity="0.7" />
                <path d="M70 70 L70 20 L30 70 Z" fill="#4a90c4" opacity="0.4" />
            </svg>
        </div>
    );

    // ─── Section Heading ─────────────────────────────────────────────────────────
    const SectionHeading = ({ title, icon: Icon }) => {
        const { isContinued } = useSectionContext();
        const displayTitle = isContinued ? `${title} (Cont.)` : title;
        return (
            <>
                <div style={styles.sectionHeadingRow}>
                    {Icon && <Icon style={styles.sectionIcon} strokeWidth={1.8} />}
                    <h3 style={styles.sectionTitle}>{displayTitle}</h3>
                </div>
                <div style={styles.sectionDivider} />
            </>
        );
    };

    // ─── Skill Bullet Item ────────────────────────────────────────────────────────
    const SkillBulletItem = ({ name, level, originalIdx, onReplace }) => {
        const lvl = typeof level === "number" ? level : null;
        return (
            <div
                style={{ display: "flex", alignItems: "center", marginBottom: "calc(8px * var(--theme-paragraph-margin, 1))" }}
                data-item-index={originalIdx}
            >
                <div style={styles.skillBullet} />
                <span style={{ fontSize: "calc(13px * var(--theme-font-scale, 1))", color: "#334155", flex: 1 }}>
                    <RichTextSpellCheck
                        html={name}
                        isActive={isSpellCheckActive}
                        onIgnore={onSpellCheckIgnore}
                        onReplace={onReplace}
                    />
                </span>
                {lvl > 0 && (
                    <span style={styles.dotRating}>
                        {[...Array(5)].map((_, di) => (
                            <div key={di} style={{
                                width: "6px", height: "6px", borderRadius: "50%",
                                backgroundColor: di < lvl ? "var(--theme-color, #1e3a5f)" : "#d0dae4",
                            }} />
                        ))}
                    </span>
                )}
            </div>
        );
    };

    // ════════════════════════════════════════════════════════════════════════════
    //  CUSTOM RENDERERS
    // ════════════════════════════════════════════════════════════════════════════
    const customRenderers = {

        // ── SUMMARY ───────────────────────────────────────────────────────────────
        summary: ({ subItemRanges, zoneId }) => (
            <SectionWrapper sectionId="summary" onSectionClick={onSectionClick} isInteractive={isInteractive} label="About Me">
                <div>
                    <SectionHeading title="About Me" icon={User} />
                    <div className="resume-rich-text" style={{ fontSize: "calc(12.5px * var(--theme-font-scale, 1))", lineHeight: "var(--theme-line-height, 1.6)", color: "#3d4f62" }}>
                        <SplittableRichText
                            html={data.summary}
                            range={subItemRanges?.summary}
                            isActive={isSpellCheckActive}
                            onIgnore={onSpellCheckIgnore}
                            onReplace={(val) => onSpellCheckReplace("summary", "summary", val)}
                        />
                    </div>
                </div>
            </SectionWrapper>
        ),

        // ── CONTACT ───────────────────────────────────────────────────────────────
        contact: ({ zoneId }) => {
            const websiteItems = data.websites || [];
            const extraLinks = [
                personal?.linkedin && { label: "LinkedIn", value: personal.linkedin, icon: Linkedin },
                personal?.github && { label: "GitHub", value: personal.github, icon: Github },
                personal?.website && { label: "Website", value: personal.website, icon: Globe },
            ].filter(Boolean);
            const headerWebsites = websiteItems
                .map((link, idx) => ({ ...link, originalIdx: idx }))
                .filter(link => link.addToHeader && link.url)
                .map(link => ({ label: link.label || "Website", value: link.url, icon: Globe2, idx: link.originalIdx }));

            return (
                <SectionWrapper sectionId="contact" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Contact">
                    <div>
                        <SectionHeading title="Contact" icon={Phone} />
                        {personal?.phone && (
                            <div style={styles.contactRow}>
                                <Phone style={styles.contactIcon} strokeWidth={1.8} />
                                <ResumeLink href={personal.phone}>
                                    <SpellCheckText text={personal.phone} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace("personal", "phone", val)} />
                                </ResumeLink>
                            </div>
                        )}
                        {personal?.email && (
                            <div style={styles.contactRow}>
                                <Mail style={styles.contactIcon} strokeWidth={1.8} />
                                <ResumeLink href={personal.email}>
                                    <SpellCheckText text={personal.email} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace("personal", "email", val)} />
                                </ResumeLink>
                            </div>
                        )}
                        {(personal?.city || personal?.country) && (
                            <div style={styles.contactRow}>
                                <MapPin style={styles.contactIcon} strokeWidth={1.8} />
                                <SpellCheckText
                                    text={[personal?.city, personal?.state, personal?.zipCode, personal?.country].filter(Boolean).join(", ")}
                                    isActive={isSpellCheckActive}
                                    onIgnore={onSpellCheckIgnore}
                                    onReplace={(val) => onSpellCheckReplace("personal", "city", val)}
                                />
                            </div>
                        )}
                        {[...extraLinks, ...headerWebsites].map((link, i) => (
                            <div key={i} style={styles.contactRow}>
                                <link.icon style={styles.contactIcon} strokeWidth={1.8} />
                                <ResumeLink href={link.value}>
                                    <SpellCheckText
                                        text={link.value}
                                        isActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onReplace={(val) => onSpellCheckReplace("personal", link.label?.toLowerCase(), val)}
                                    />
                                </ResumeLink>
                            </div>
                        ))}
                    </div>
                </SectionWrapper>
            );
        },

        // ── WEBSITES ──────────────────────────────────────────────────────────────
        websites: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.websites?.[idx]) : data.websites;
            // Show all links in sidebar websites section, regardless of addToHeader
            const links = (items || [])
                .map((link, idx) => ({ ...link, originalIdx: itemIndices ? itemIndices[idx] : idx }))
                .filter(link => link.url);
            if (links.length === 0) return null;
            return (
                <SectionWrapper sectionId="websites" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Websites">
                    <div>
                        <SectionHeading title="Websites & Portfolios" icon={Globe} />
                        {links.map((site, i) => (
                            <div key={i} style={styles.contactRow}>
                                <Globe style={styles.contactIcon} strokeWidth={1.8} />
                                <ResumeLink href={site.url}>
                                    <SpellCheckText text={site.url} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                        onReplace={(val) => onSpellCheckReplace("websites", site.originalIdx, val, "url")} />
                                </ResumeLink>
                            </div>
                        ))}
                    </div>
                </SectionWrapper>
            );
        },

        // ── SOFTWARE ──────────────────────────────────────────────────────────────
        software: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.software?.[idx]).filter(Boolean) : (data.software || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="software" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Software">
                    <div>
                        <SectionHeading title="Software" icon={Monitor} />
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                            {items.map((soft, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <SoftwareItem
                                        key={i}
                                        item={soft}
                                        index={originalIdx}
                                        isSpellCheckActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onSpellCheckReplace={(field, val) => onSpellCheckReplace("software", originalIdx, val, field)}
                                        variant="tag"
                                    />
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        // ── PERSONAL DETAILS ──────────────────────────────────────────────────────
        personalDetails: ({ zoneId }) => {
            const { personal: p = {} } = data;
            const details = [
                { label: 'Date of Birth', value: p.dob || p.dateOfBirth || p.birthDate, icon: User },
                { label: 'Nationality', value: p.nationality, icon: Globe },
                { label: 'Marital Status', value: p.maritalStatus || p.marital_status, icon: User },
                { label: 'Gender', value: p.gender, icon: User },
                { label: 'Religion', value: p.religion, icon: User },
                { label: 'Visa Status', value: p.visaStatus || p.visa_status, icon: User },
                { label: 'Passport', value: p.passport || p.passportNumber, icon: User },
                { label: 'Place of Birth', value: p.placeOfBirth, icon: MapPin },
                { label: 'Driving License', value: p.drivingLicense, icon: User },
                { label: 'Other', value: p.otherPersonal || p.otherInformation, icon: User }
            ].filter(d => d.value);

            if (details.length === 0) return null;

            return (
                <SectionWrapper sectionId="personalDetails" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Personal Details">
                    <div>
                        <SectionHeading title="Personal Details" icon={User} />
                        {details.map((d, i) => (
                            <div key={i} style={styles.contactRow}>
                                <d.icon style={styles.contactIcon} strokeWidth={1.8} />
                                <div>
                                    <div style={{ fontSize: "11px", color: accent, fontWeight: "600", textTransform: "uppercase" }}>{d.label}</div>
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

        // ── SKILLS ────────────────────────────────────────────────────────────────
        skills: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.skills?.[idx]).filter(Boolean) : (data.skills || []);
            const hasDescription = data.skillsDescription && data.skillsDescription.trim();
            if (items.length > 0) {
                return (
                    <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Skills">
                        <div>
                            <SectionHeading title="Skills" icon={Star} />
                            {items.map((skill, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                const name = typeof skill === "object" ? skill.name : skill;
                                const lvl = typeof skill === "object" ? (skill.level ?? skill.rating) : null;
                                return (
                                    <SkillBulletItem key={originalIdx} name={name} level={lvl} originalIdx={originalIdx}
                                        onReplace={(val) => onSpellCheckReplace("skills", originalIdx, val, "name")} />
                                );
                            })}
                        </div>
                    </SectionWrapper>
                );
            }
            if (hasDescription) {
                return (
                    <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Skills">
                        <div>
                            <SectionHeading title="Skills" icon={Star} />
                            <div className="resume-rich-text" style={{ fontSize: "calc(12.5px * var(--theme-font-scale, 1))" }}>
                                <SplittableRichText html={data.skillsDescription} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                    onReplace={(val) => onSpellCheckReplace("skills", "skillsDescription", val)} />
                            </div>
                        </div>
                    </SectionWrapper>
                );
            }
            return null;
        },

        // ── STRENGTHS ─────────────────────────────────────────────────────────────
        strengths: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.strengths?.[idx]).filter(Boolean) : (data.strengths || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="strengths" navigationId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Key Strengths">
                    <div>
                        <SectionHeading title="Key Strengths" icon={Trophy} />
                        {items.map((skill, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const name = typeof skill === "object" ? skill.name : skill;
                            const lvl = typeof skill === "object" ? (skill.level ?? skill.rating) : null;
                            return (
                                <SkillBulletItem key={originalIdx} name={name} level={lvl} originalIdx={originalIdx}
                                    onReplace={(val) => onSpellCheckReplace("strengths", originalIdx, val, "name")} />
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        // ── ADDITIONAL SKILLS ─────────────────────────────────────────────────────
        additionalSkills: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.additionalSkills?.[idx]).filter(Boolean) : (data.additionalSkills || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="additionalSkills" navigationId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Additional Skills">
                    <div>
                        <SectionHeading title="Additional Skills" icon={Layout} />
                        {items.map((skill, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const name = typeof skill === "object" ? skill.name : skill;
                            const lvl = typeof skill === "object" ? (skill.level ?? skill.rating) : null;
                            return (
                                <SkillBulletItem key={originalIdx} name={name} level={lvl} originalIdx={originalIdx}
                                    onReplace={(val) => onSpellCheckReplace("additionalSkills", originalIdx, val, "name")} />
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        // ── LANGUAGES ─────────────────────────────────────────────────────────────
        languages: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.languages?.[idx]) : data.languages;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="languages" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Language">
                    <div>
                        <SectionHeading title="Language" icon={BookOpen} />
                        {items.map((lang, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} style={{ marginBottom: "calc(8px * var(--theme-paragraph-margin, 1))" }}>
                                    <LanguageItem
                                        item={lang}
                                        index={originalIdx}
                                        isSpellCheckActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onSpellCheckReplace={(field, val) => onSpellCheckReplace("languages", originalIdx, val, field)}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        // ── INTERESTS ─────────────────────────────────────────────────────────────
        interests: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.interests?.[idx]) : data.interests;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="interests" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Interests">
                    <div>
                        <SectionHeading title="Interests" icon={Heart} />
                        {items.map((item, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const name = typeof item === "object" ? item.name : item;
                            return (
                                <SkillBulletItem key={originalIdx} name={name} level={null} originalIdx={originalIdx}
                                    onReplace={(val) => onSpellCheckReplace("interests", originalIdx, val, "name")} />
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        // ── CERTIFICATIONS ────────────────────────────────────────────────────────
        certifications: ({ itemIndices, zoneId, subItemRanges: renderSubItemRanges }) => {
            const items = itemIndices ? itemIndices.map(idx => data.certifications?.[idx]) : data.certifications;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="certifications" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Certifications">
                    <div>
                        <SectionHeading title="Certifications" icon={Award} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "calc(10px * var(--theme-paragraph-margin, 1))" }}>
                            {items.map((cert, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <CertificationItem
                                        key={i}
                                        item={cert}
                                        index={originalIdx}
                                        isSpellCheckActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onSpellCheckReplace={(field, val) => onSpellCheckReplace("certifications", originalIdx, val, field)}
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

        // ── EDUCATION ─────────────────────────────────────────────────────────────
        education: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.education?.[idx]) : data.education;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="education" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Education">
                    <div>
                        <SectionHeading title="Education" icon={GraduationCap} />
                        {items.map((edu, i) => {
                            if (!edu) return null;
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const dateStr = edu.year || edu.date || (edu.endYear || "");
                            const fullDate = edu.startYear
                                ? `(${edu.startYear} - ${edu.isCurrent ? "Present" : edu.endYear || ""})`
                                : dateStr ? `(${dateStr})` : "";
                            const institution = [edu.institution || edu.school, edu.location].filter(Boolean).join(", ");
                            const isLast = i === items.length - 1;
                            return (
                                <div key={i} style={styles.timelineItem} data-item-index={originalIdx}>
                                    <div style={styles.timelineIndicator}>
                                        <div style={styles.timelineDot} />
                                        {!isLast && <div style={styles.timelineLine} />}
                                    </div>
                                    <div style={styles.timelineContent}>
                                        {fullDate && (
                                            <div style={styles.timelineDateBadge}>
                                                <RichTextSpellCheck html={fullDate} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                                    onReplace={(val) => onSpellCheckReplace("education", originalIdx, val, "year")} />
                                            </div>
                                        )}
                                        <div style={styles.timelineTitle}>
                                            <RichTextSpellCheck html={institution} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                                onReplace={(val) => onSpellCheckReplace("education", originalIdx, val, "institution")} />
                                        </div>
                                        <div style={styles.timelineSubtitle}>
                                            <RichTextSpellCheck html={edu.degree || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                                onReplace={(val) => onSpellCheckReplace("education", originalIdx, val, "degree")} />
                                        </div>
                                        {edu.grade && <div style={styles.timelineGrade}>GPA: {edu.grade}</div>}
                                        {edu.description && (
                                            <div className="resume-rich-text" style={{ ...styles.timelineDescription, marginTop: "6px" }}>
                                                <SplittableRichText html={edu.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                                    onReplace={(val) => onSpellCheckReplace("education", originalIdx, val, "description")} />
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

        // ── EXPERIENCE ────────────────────────────────────────────────────────────
        experience: ({ itemIndices, subItemRanges, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.experience?.[idx]) : data.experience;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="experience" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Experience">
                    <div>
                        <SectionHeading title="Experience" icon={Briefcase} />
                        {items.map((exp, i) => {
                            if (!exp) return null;
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const dateStr = exp.year || exp.date || (exp.startYear
                                ? `(${exp.startYear} - ${exp.isCurrent ? "Current" : exp.endYear})`
                                : "");
                            const companyLine = [exp.company, exp.location].filter(Boolean).join(", ") + (exp.isRemote ? " • Remote" : "");
                            const isLast = i === items.length - 1;
                            return (
                                <div key={i} style={styles.timelineItem} data-item-index={originalIdx}>
                                    <div style={styles.timelineIndicator}>
                                        <div style={styles.timelineDot} />
                                        {!isLast && <div style={styles.timelineLine} />}
                                    </div>
                                    <div style={styles.timelineContent}>
                                        {dateStr && (
                                            <div style={styles.timelineDateBadge}>
                                                <RichTextSpellCheck html={dateStr} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                                    onReplace={(val) => onSpellCheckReplace("experience", originalIdx, val, "date")} />
                                            </div>
                                        )}
                                        <div style={styles.timelineTitle}>
                                            <RichTextSpellCheck html={exp.title || exp.role || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                                onReplace={(val) => onSpellCheckReplace("experience", originalIdx, val, "title")} />
                                        </div>
                                        {companyLine.trim() && (
                                            <div style={styles.timelineSubtitle}>
                                                <RichTextSpellCheck html={companyLine} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                                    onReplace={(val) => onSpellCheckReplace("experience", originalIdx, val, "company")} />
                                            </div>
                                        )}
                                        {exp.description && (
                                            <div className="resume-rich-text" style={styles.timelineDescription}>
                                                <SplittableRichText
                                                    html={exp.description}
                                                    range={subItemRanges?.[originalIdx]}
                                                    isActive={isSpellCheckActive}
                                                    onIgnore={onSpellCheckIgnore}
                                                    onReplace={(val) => onSpellCheckReplace("experience", originalIdx, val, "description")}
                                                />
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

        // ── PROJECTS ──────────────────────────────────────────────────────────────
        projects: ({ itemIndices, subItemRanges, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.projects?.[idx]) : data.projects;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="projects" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Projects">
                    <div>
                        <SectionHeading title="Projects" icon={Layout} />
                        {items.map((proj, i) => {
                            if (!proj) return null;
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const dateStr = proj.year || (proj.startYear
                                ? `${proj.startYear} - ${proj.isCurrent ? "Present" : (proj.endYear || "Present")}`
                                : "");
                            const isLast = i === items.length - 1;
                            return (
                                <div key={i} style={styles.timelineItem} data-item-index={originalIdx}>
                                    <div style={styles.timelineIndicator}>
                                        <div style={styles.timelineDot} />
                                        {!isLast && <div style={styles.timelineLine} />}
                                    </div>
                                    <div style={styles.timelineContent}>
                                        {dateStr && <div style={styles.timelineDateBadge}>{dateStr}</div>}
                                        <div style={styles.timelineTitle}>
                                            <RichTextSpellCheck html={proj.title} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                                onReplace={(val) => onSpellCheckReplace("projects", originalIdx, val, "title")} />
                                        </div>
                                        {proj.link && (
                                            <div style={{ fontSize: "calc(11.5px * var(--theme-font-scale, 1))", color: "var(--theme-color, #1e3a5f)", marginBottom: "5px" }}>
                                                <ResumeLink href={proj.link}>
                                                    <RichTextSpellCheck html={proj.link} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                                        onReplace={(val) => onSpellCheckReplace("projects", originalIdx, val, "link")} />
                                                </ResumeLink>
                                            </div>
                                        )}
                                        {proj.technologies?.length > 0 && (
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "7px" }}>
                                                {proj.technologies.map((tech, tIdx) => (
                                                    <span key={tIdx} style={{ fontSize: "calc(11px * var(--theme-font-scale, 1))", padding: "2px 8px", background: "#eef2f7", borderRadius: "10px", color: "#556070" }}>
                                                        <RichTextSpellCheck html={tech} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                                            onReplace={(val) => {
                                                                const updated = [...proj.technologies];
                                                                updated[tIdx] = val;
                                                                onSpellCheckReplace("projects", originalIdx, updated, "technologies");
                                                            }} />
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        {proj.description && (
                                            <div className="resume-rich-text" style={styles.timelineDescription}>
                                                <SplittableRichText html={proj.description} range={subItemRanges?.[originalIdx]}
                                                    isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                                    onReplace={(val) => onSpellCheckReplace("projects", originalIdx, val, "description")} />
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

        // ── AWARDS ────────────────────────────────────────────────────────────────
        awards: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.awards?.[idx]) : data.awards;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="awards" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Awards">
                    <div>
                        <SectionHeading title="Awards" icon={Trophy} />
                        {items.map((award, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const isLast = i === items.length - 1;
                            return (
                                <div key={i} style={styles.timelineItem} data-item-index={originalIdx}>
                                    <div style={styles.timelineIndicator}>
                                        <div style={styles.timelineDot} />
                                        {!isLast && <div style={styles.timelineLine} />}
                                    </div>
                                    <div style={styles.timelineContent}>
                                        <div style={styles.timelineTitle}>
                                            <RichTextSpellCheck html={award.name || award.title || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                                onReplace={(val) => onSpellCheckReplace("awards", originalIdx, val, "name")} />
                                        </div>
                                        <div style={styles.timelineSubtitle}>
                                            <RichTextSpellCheck html={award.issuer || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                                onReplace={(val) => onSpellCheckReplace("awards", originalIdx, val, "issuer")} />
                                            {award.date && <span> • {award.date}</span>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        // ── VOLUNTEER ─────────────────────────────────────────────────────────────
        volunteer: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.volunteer?.[idx]) : data.volunteer;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="volunteer" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Volunteer">
                    <div>
                        <SectionHeading title="Volunteer" icon={Users} />
                        {items.map((item, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const isLast = i === items.length - 1;
                            return (
                                <div key={i} style={styles.timelineItem} data-item-index={originalIdx}>
                                    <div style={styles.timelineIndicator}>
                                        <div style={styles.timelineDot} />
                                        {!isLast && <div style={styles.timelineLine} />}
                                    </div>
                                    <div style={styles.timelineContent}>
                                        <div style={styles.timelineTitle}>
                                            <RichTextSpellCheck html={item.organization || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                                onReplace={(val) => onSpellCheckReplace("volunteer", originalIdx, val, "organization")} />
                                        </div>
                                        <div style={styles.timelineSubtitle}>
                                            <RichTextSpellCheck html={item.role || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                                onReplace={(val) => onSpellCheckReplace("volunteer", originalIdx, val, "role")} />
                                        </div>
                                        <div style={{ fontSize: "calc(11.5px * var(--theme-font-scale, 1))", color: "#7c8fa0" }}>
                                            {item.startDate}{item.startDate && " – "}{item.isCurrent ? "Present" : item.endDate}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        // ── PUBLICATIONS ──────────────────────────────────────────────────────────
        publications: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.publications?.[idx]) : data.publications;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="publications" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Publications">
                    <div>
                        <SectionHeading title="Publications" icon={BookOpen} />
                        {items.map((pub, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const isLast = i === items.length - 1;
                            return (
                                <div key={i} style={styles.timelineItem} data-item-index={originalIdx}>
                                    <div style={styles.timelineIndicator}>
                                        <div style={styles.timelineDot} />
                                        {!isLast && <div style={styles.timelineLine} />}
                                    </div>
                                    <div style={styles.timelineContent}>
                                        <div style={styles.timelineTitle}>
                                            <RichTextSpellCheck html={pub.name || pub.title || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                                onReplace={(val) => onSpellCheckReplace("publications", originalIdx, val, "name")} />
                                        </div>
                                        <div style={styles.timelineSubtitle}>
                                            <RichTextSpellCheck html={pub.publisher || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                                onReplace={(val) => onSpellCheckReplace("publications", originalIdx, val, "publisher")} />
                                            {pub.releaseDate && <span> • {pub.releaseDate}</span>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        // ── ADDITIONAL INFO ───────────────────────────────────────────────────────
        additionalInfo: ({ subItemRanges: renderSubItemRanges, zoneId }) => {
            const html = data.additionalInfo || "";
            if (!html || html.trim() === "" || html === "<p><br></p>") return null;
            return (
                <SectionWrapper sectionId="additionalInfo" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Additional Information">
                    <div>
                        <SectionHeading title="Additional Information" icon={User} />
                        <div className="resume-rich-text" style={{ fontSize: "calc(12.5px * var(--theme-font-scale, 1))", lineHeight: "var(--theme-line-height, 1.6)" }}>
                            <SplittableRichText html={html} range={renderSubItemRanges?.additionalInfo}
                                isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                onReplace={(val) => onSpellCheckReplace("additionalInfo", "additionalInfo", val)} />
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        // ── CUSTOM SECTION ────────────────────────────────────────────────────────
        custom: ({ subItemRanges: renderSubItemRanges, zoneId }) => {
            if (!data.customSection?.isVisible || !data.customSection?.content) return null;
            const content = data.customSection.content;
            if (!content || content.trim() === "" || content === "<p><br></p>") return null;
            const title = data.customSection.title || "Additional Information";
            return (
                <SectionWrapper sectionId="custom" onSectionClick={onSectionClick} isInteractive={isInteractive} label={title}>
                    <div>
                        <SectionHeading title={title} icon={User} />
                        <div className="resume-rich-text" style={{ fontSize: "calc(12.5px * var(--theme-font-scale, 1))", lineHeight: "var(--theme-line-height, 1.6)" }}>
                            <SplittableRichText html={content} range={renderSubItemRanges?.custom}
                                isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                onReplace={(val) => onSpellCheckReplace("customSection", "content", val)} />
                        </div>
                    </div>
                </SectionWrapper>
            );
        },
    };

    // ════════════════════════════════════════════════════════════════════════════
    //  HEADER
    // ════════════════════════════════════════════════════════════════════════════
    const Header = () => (
        <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Header">
            <div style={styles.headerWrapper}>
                <CornerAccentTR />
                <CornerAccentBR />
                {personal?.photo
                    ? <img src={personal.photo} style={styles.photoCircle} alt="profile" />
                    : (
                        <div style={styles.photoPlaceholder}>
                            <User strokeWidth={1} style={{ width: "50px", height: "50px" }} />
                        </div>
                    )
                }
                <div style={styles.headerTextBlock}>
                    <h1 style={styles.headerName}>
                        <SpellCheckText
                            text={personal?.name || "YOUR NAME"}
                            isActive={isSpellCheckActive}
                            onIgnore={onSpellCheckIgnore}
                            onReplace={(val) => onSpellCheckReplace("personal", "name", val)}
                        />
                    </h1>
                    {personal?.profession && (
                        <div style={styles.headerProfession}>
                            <SpellCheckText
                                text={personal.profession}
                                isActive={isSpellCheckActive}
                                onIgnore={onSpellCheckIgnore}
                                onReplace={(val) => onSpellCheckReplace("personal", "profession", val)}
                            />
                        </div>
                    )}
                </div>
            </div>
        </SectionWrapper>
    );

    // ════════════════════════════════════════════════════════════════════════════
    //  ZONE RENDERER
    // ════════════════════════════════════════════════════════════════════════════
    const renderZone = (id, items, columnStyle) => (
        <DroppableZone id={id} style={{ ...columnStyle }}>
            {items.map((sid, idx) => {
                const isContinued = typeof sid === "object" && sid.isContinued;
                const sectionId = typeof sid === "string" ? sid : sid.id;
                const dragId = isContinued ? `${id}-cont-${sectionId}-${idx}` : sectionId;
                return (
                    <DraggableSection key={dragId} id={dragId} isEnabled={canReorder && !isContinued}>
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
                    </DraggableSection>
                );
            })}
        </DroppableZone>
    );

    // ════════════════════════════════════════════════════════════════════════════
    //  MEASURER — off-screen clone for useAutoPagination to measure heights
    // ════════════════════════════════════════════════════════════════════════════
    const Measurer = () => (
        <div className="resume-measurer" style={{ position: "absolute", top: -10000, left: -10000, width: "210mm", visibility: "hidden" }}>
            {/* MANDATORY — DO NOT REMOVE: gives useAutoPagination the real A4 pixel height */}
            <div className="page-height-marker" style={{ height: "297mm", width: "1px", position: "absolute", left: 0, top: 0 }} />
            <div style={{ ...styles.page, height: "auto", overflow: "visible" }}>
                <Header />
                <div style={styles.bodyRow}>
                    <div data-column-id="sidebar" style={styles.sidebarCol}>
                        {activeSidebarSections.map(sid => (
                            <SectionRenderer key={sid} sectionId={sid} data={data} customRenderers={customRenderers} zoneId="sidebar" />
                        ))}
                    </div>
                    <div data-column-id="main" style={styles.mainCol}>
                        {activeMainSections.map(sid => (
                            <SectionRenderer key={sid} sectionId={sid} data={data} customRenderers={customRenderers} zoneId="main" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const sidebarGapStyle = { display: "flex", flexDirection: "column", gap: "calc(22px * var(--theme-section-margin, 1))" };
    const mainGapStyle = { display: "flex", flexDirection: "column", gap: "calc(22px * var(--theme-section-margin, 1))" };

    // ════════════════════════════════════════════════════════════════════════════
    //  RENDER
    // ════════════════════════════════════════════════════════════════════════════
    return (
        <div ref={containerRef} className="sage-split-root">
            <Measurer />
            <DndContext {...dndContextProps}>
                <SortableContext items={[...activeSidebarSections, ...activeMainSections]} strategy={verticalListSortingStrategy}>

                    {showPageBreaks && pages ? (
                        // ── PAGINATED MODE ────────────────────────────────────────────────────
                        // RULE: height must be fixed "297mm", minHeight "unset", overflow "hidden"
                        // so pages never grow beyond A4.
                        pages.map((page, i) => (
                            <div key={i} style={{ ...styles.page, height: "297mm", minHeight: "unset", overflow: "hidden" }}>
                                {i === 0 && <Header />}
                                <div style={{ ...styles.bodyRow, flex: 1 }}>
                                    <div style={styles.sidebarCol}>
                                        {renderZone(`sidebar-p${i}`, page.sidebar || [], sidebarGapStyle)}
                                    </div>
                                    <div style={styles.mainCol}>
                                        {renderZone(`main-p${i}`, page.main || [], mainGapStyle)}
                                    </div>
                                </div>
                                <div style={{ position: "absolute", bottom: "15px", right: "20px", fontSize: "10px", opacity: 0.4, color: "#556070" }}>
                                    Page {i + 1}
                                </div>
                            </div>
                        ))
                    ) : (
                        // ── FREE-FLOW MODE (page breaks off) ─────────────────────────────────
                        // height: auto lets it grow; minHeight keeps single-page minimum at A4.
                        <div style={{ ...styles.page, height: "auto", minHeight: "297mm" }}>
                            <Header />
                            <div style={styles.bodyRow}>
                                <div style={styles.sidebarCol}>
                                    {renderZone("sidebar", activeSidebarSections, sidebarGapStyle)}
                                </div>
                                <div style={styles.mainCol}>
                                    {renderZone("main", activeMainSections, mainGapStyle)}
                                </div>
                            </div>
                        </div>
                    )}

                </SortableContext>
                <StableResumeDragOverlay
                    activeId={activeId}
                    scale={scale}
                    renderSection={(id) => (
                        <div style={{ background: "white", padding: "10px", border: "1px solid #d0dae4", borderRadius: "4px", width: "280px" }}>
                            <SectionRenderer sectionId={id} data={data} customRenderers={customRenderers} />
                        </div>
                    )}
                />
            </DndContext>
        </div>
    );
};

export default SageSplit;
