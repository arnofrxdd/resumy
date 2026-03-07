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
 * EmeraldInsight Template
 * Inspired by the Shawn Garcia resume style:
 * - Sage-green header spanning full width, circular photo left + large name/title right
 * - Two-column body: LEFT (About Me, Experience, ...) | RIGHT (Education, Skills, Contact, ...)
 * - No sidebar background — both columns are plain white
 * - Section titles in sage-green, plain text body, italic sub-entries for experience
 * - Bullet list for skills, icon row for contact
 * - Full pagination, section continuation, drag-and-drop, spell-check, all spacing vars
 */
const EmeraldInsight = ({
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

    // ─── THEME ──────────────────────────────────────────────────────────────────
    // Sage green: var(--theme-color, #7a9e7e)
    const green = "var(--theme-color, #7a9e7e)";
    const headerBg = "var(--theme-color, #7a9e7e)";

    // ─── LAYOUT ENGINE ──────────────────────────────────────────────────────────
    const templateId = 'emerald-insight';
    const savedLayout = data.templateLayouts?.[templateId] || {};
    const initialLayout = {
        left: savedLayout.left || savedLayout.sidebar || ["summary", "experience", "projects", "awards", "volunteer", "publications", "custom", "additionalInfo"],
        right: savedLayout.right || savedLayout.main || ["education", "skills", "strengths", "additionalSkills", "contact", "websites", "languages", "certifications", "software", "interests", "personalDetails"]
    };

    const completeLayout = getCompleteLayout(data, initialLayout, "left");
    const activeLeftSections = completeLayout.left || [];
    const activeRightSections = completeLayout.right || [];

    // ─── DRAG & DROP ────────────────────────────────────────────────────────────
    const { dndContextProps, activeId } = useResumeDragAndDrop({
        data,
        onReorder,
        scale,
        containers: { left: activeLeftSections, right: activeRightSections }
    });

    // ─── PAGINATION ─────────────────────────────────────────────────────────────
    const pages = useAutoPagination({
        columns: { left: activeLeftSections, right: activeRightSections },
        data,
        enabled: showPageBreaks,
        containerRef,
        scale
    });

    // ─── STYLES ─────────────────────────────────────────────────────────────────
    const styles = {
        page: {
            width: "210mm",
            height: "297mm",
            background: "white",
            boxSizing: "border-box",
            position: "relative",
            margin: "0 auto 30px auto",
            color: "#2d2d2d",
            fontFamily: "var(--theme-font, 'Calibri', 'Trebuchet MS', sans-serif)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
        },
        // ── Header ──────────────────────────────────────────────────────────────
        header: {
            background: headerBg,
            display: "flex",
            alignItems: "center",
            padding: "28px 40px 28px 36px",
            gap: "28px",
            minHeight: "150px",
        },
        photoCircleWrap: {
            flexShrink: 0,
            width: "115px",
            height: "115px",
            borderRadius: "50%",
            overflow: "hidden",
            border: "4px solid rgba(255,255,255,0.6)",
            background: "rgba(255,255,255,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        },
        photoImg: {
            width: "100%",
            height: "100%",
            objectFit: "cover",
        },
        headerText: {
            flex: 1,
            color: "white",
        },
        headerName: {
            fontSize: "calc(38px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            margin: 0,
            lineHeight: "1.15",
            color: "white",
        },
        headerProfession: {
            fontSize: "calc(15px * var(--theme-font-scale, 1))",
            fontWeight: "400",
            color: "rgba(255,255,255,0.88)",
            marginTop: "6px",
            letterSpacing: "0.2px",
        },
        // ── Body ────────────────────────────────────────────────────────────────
        bodyRow: {
            display: "flex",
            flex: 1,
            minHeight: 0,
        },
        leftCol: {
            width: "48%",
            padding: "24px 20px var(--theme-page-margin, 40px) 36px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: "calc(20px * var(--theme-section-margin, 1))",
        },
        rightCol: {
            width: "52%",
            padding: "24px 36px var(--theme-page-margin, 40px) 20px",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            gap: "calc(20px * var(--theme-section-margin, 1))",
        },
        // ── Section Heading ──────────────────────────────────────────────────────
        sectionTitle: {
            fontSize: "calc(15px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: green,
            margin: "0 0 10px 0",
            paddingBottom: "0",
            letterSpacing: "0.2px",
        },
        // ── Experience Item ──────────────────────────────────────────────────────
        expCompany: {
            fontSize: "calc(13px * var(--theme-font-scale, 1))",
            fontWeight: "600",
            color: "#2d2d2d",
            marginBottom: "1px",
        },
        expDate: {
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            color: "#6b7280",
            fontStyle: "italic",
            marginBottom: "5px",
        },
        expDescription: {
            fontSize: "calc(12.5px * var(--theme-font-scale, 1))",
            lineHeight: "var(--theme-line-height, 1.55)",
            color: "#374151",
        },
        // ── Education Item ───────────────────────────────────────────────────────
        eduSchool: {
            fontSize: "calc(13px * var(--theme-font-scale, 1))",
            fontWeight: "600",
            color: "#2d2d2d",
            marginBottom: "1px",
        },
        eduDate: {
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            color: "#6b7280",
            fontStyle: "italic",
            marginBottom: "3px",
        },
        eduDegree: {
            fontSize: "calc(12.5px * var(--theme-font-scale, 1))",
            fontStyle: "italic",
            color: "#374151",
        },
        // ── Skills bullet list ───────────────────────────────────────────────────
        skillsList: {
            listStyle: "disc",
            paddingLeft: "18px",
            margin: 0,
        },
        skillItem: {
            fontSize: "calc(13px * var(--theme-font-scale, 1))",
            color: "#374151",
            marginBottom: "calc(5px * var(--theme-paragraph-margin, 1))",
            lineHeight: "1.4",
        },
        // ── Contact ─────────────────────────────────────────────────────────────
        contactRow: {
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "calc(12.5px * var(--theme-font-scale, 1))",
            color: "#374151",
            marginBottom: "calc(8px * var(--theme-paragraph-margin, 1))",
        },
        contactIcon: {
            width: "13px",
            height: "13px",
            color: green,
            flexShrink: 0,
        },
        // ── Dot rating ───────────────────────────────────────────────────────────
        dotRating: {
            display: "flex",
            gap: "3px",
            marginLeft: "auto",
            paddingLeft: "8px",
        },
    };

    // ════════════════════════════════════════════════════════════════════════════
    //  SECTION TITLE COMPONENT
    // ════════════════════════════════════════════════════════════════════════════
    const SectionTitle = ({ title, zoneId }) => {
        const { isContinued } = useSectionContext();
        const displayTitle = isContinued ? `${title} (Cont.)` : title;
        return <h3 style={styles.sectionTitle}>{displayTitle}</h3>;
    };

    // ─── Skill dot rating display ─────────────────────────────────────────────
    const DotRating = ({ level }) => {
        if (!level || level <= 0) return null;
        return (
            <span style={styles.dotRating}>
                {[...Array(5)].map((_, di) => (
                    <div key={di} style={{
                        width: "6px", height: "6px", borderRadius: "50%",
                        backgroundColor: di < level ? "var(--theme-color, #7a9e7e)" : "#d1d5db"
                    }} />
                ))}
            </span>
        );
    };

    // ════════════════════════════════════════════════════════════════════════════
    //  CUSTOM RENDERERS
    // ════════════════════════════════════════════════════════════════════════════
    const customRenderers = {

        // ── SUMMARY / ABOUT ME ─────────────────────────────────────────────────
        summary: ({ isContinued, subItemRanges, zoneId }) => (
            <SectionWrapper sectionId="summary" onSectionClick={onSectionClick} isInteractive={isInteractive} label="About Me">
                <div style={{ paddingBottom: "1px" }}>
                    <SectionTitle title="About Me" zoneId={zoneId} />
                    <div className="resume-rich-text" style={{ fontSize: "calc(12.5px * var(--theme-font-scale, 1))", lineHeight: "var(--theme-line-height, 1.6)", color: "#374151" }}>
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

        // ── EXPERIENCE ────────────────────────────────────────────────────────
        experience: ({ itemIndices, subItemRanges, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.experience?.[idx]).filter(Boolean) : (data.experience || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="experience" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Experience">
                    <div style={{ paddingBottom: "1px" }}>
                        <SectionTitle title="Experience" zoneId={zoneId} />
                        {items.map((exp, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const dateStr = exp.year || exp.date || (exp.startYear ? `${exp.startYear} - ${exp.isCurrent ? "Present" : exp.endYear}` : "");
                            const companyLine = [exp.company, exp.location].filter(Boolean).join(", ") + (exp.isRemote ? " (Remote)" : "");
                            return (
                                <div key={i} data-item-index={originalIdx} style={{ marginBottom: "calc(16px * var(--theme-paragraph-margin, 1))", paddingBottom: "1px" }}>
                                    <div style={styles.expCompany}>
                                        <RichTextSpellCheck html={companyLine || (exp.title || "")} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                            onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'company')} />
                                    </div>
                                    {dateStr && (
                                        <div style={styles.expDate}>
                                            <RichTextSpellCheck html={dateStr} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                                onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'date')} />
                                        </div>
                                    )}
                                    {(exp.title || exp.role) && (
                                        <div style={{ fontSize: "calc(12.5px * var(--theme-font-scale, 1))", fontWeight: "600", color: "#4b5563", marginBottom: "4px" }}>
                                            <RichTextSpellCheck html={exp.title || exp.role} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                                onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'title')} />
                                        </div>
                                    )}
                                    {exp.description && (
                                        <div className="resume-rich-text" style={styles.expDescription}>
                                            <SplittableRichText
                                                html={exp.description}
                                                range={subItemRanges?.[originalIdx]}
                                                isActive={isSpellCheckActive}
                                                onIgnore={onSpellCheckIgnore}
                                                onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'description')}
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

        // ── EDUCATION ─────────────────────────────────────────────────────────
        education: ({ itemIndices, subItemRanges, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.education?.[idx]).filter(Boolean) : (data.education || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="education" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Education">
                    <div style={{ paddingBottom: "1px" }}>
                        <SectionTitle title="Education" zoneId={zoneId} />
                        {items.map((edu, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const school = edu.institution || edu.school || "";
                            const dateStr = edu.year || edu.date || (edu.startYear ? `${edu.startYear} - ${edu.isCurrent ? "Present" : edu.endYear}` : edu.endYear || "");
                            return (
                                <div key={i} data-item-index={originalIdx} style={{ marginBottom: "calc(14px * var(--theme-paragraph-margin, 1))", paddingBottom: "1px" }}>
                                    <div style={styles.eduSchool}>
                                        <RichTextSpellCheck html={school} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                            onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'institution')} />
                                    </div>
                                    {dateStr && (
                                        <div style={styles.eduDate}>
                                            <RichTextSpellCheck html={dateStr} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                                onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'year')} />
                                        </div>
                                    )}
                                    {edu.degree && (
                                        <div style={styles.eduDegree}>
                                            <RichTextSpellCheck html={edu.degree} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                                onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'degree')} />
                                        </div>
                                    )}
                                    {edu.grade && <div style={{ fontSize: "calc(11.5px * var(--theme-font-scale, 1))", color: "#6b7280", marginTop: "2px" }}>GPA: {edu.grade}</div>}
                                    {edu.description && (
                                        <div className="resume-rich-text" style={{ ...styles.expDescription, marginTop: "5px" }}>
                                            <SplittableRichText html={edu.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                                onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'description')} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        // ── SKILLS ────────────────────────────────────────────────────────────
        skills: ({ itemIndices, subItemRanges, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.skills?.[idx]).filter(Boolean) : (data.skills || []);
            const hasDescription = data.skillsDescription && data.skillsDescription.trim();

            if (items.length > 0) {
                return (
                    <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Skills">
                        <div style={{ paddingBottom: "1px" }}>
                            <SectionTitle title="Skills" zoneId={zoneId} />
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px 20px" }}>
                                {items.map((skill, i) => {
                                    const originalIdx = itemIndices ? itemIndices[i] : i;
                                    const name = typeof skill === 'object' ? skill.name : skill;
                                    const lvl = typeof skill === 'object' ? (skill.level ?? skill.rating) : null;
                                    return (
                                        <div key={originalIdx} data-item-index={originalIdx} style={styles.skillItem}>
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                                                <div style={{ flex: 1 }}>
                                                    <RichTextSpellCheck html={name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                                        onReplace={(val) => onSpellCheckReplace('skills', originalIdx, val, 'name')} />
                                                </div>
                                                <DotRating level={lvl} />
                                            </div>
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
                    <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Skills">
                        <div style={{ paddingBottom: "1px" }}>
                            <SectionTitle title="Skills" zoneId={zoneId} />
                            <div className="resume-rich-text" style={{ fontSize: "calc(12.5px * var(--theme-font-scale, 1))", color: "#374151" }}>
                                <SplittableRichText html={data.skillsDescription} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                    onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('skills', 'skillsDescription', val)} />
                            </div>
                        </div>
                    </SectionWrapper>
                );
            }
            return null;
        },

        // ── STRENGTHS ─────────────────────────────────────────────────────────
        strengths: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.strengths?.[idx]).filter(Boolean) : (data.strengths || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="strengths" navigationId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Key Strengths">
                    <div style={{ paddingBottom: "1px" }}>
                        <SectionTitle title="Key Strengths" zoneId={zoneId} />
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px 20px" }}>
                            {items.map((skill, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                const name = typeof skill === 'object' ? skill.name : skill;
                                const lvl = typeof skill === 'object' ? (skill.level ?? skill.rating) : null;
                                return (
                                    <div key={originalIdx} data-item-index={originalIdx} style={styles.skillItem}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                                            <div style={{ flex: 1 }}>
                                                <RichTextSpellCheck html={name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                                    onReplace={(val) => onSpellCheckReplace('strengths', originalIdx, val, 'name')} />
                                            </div>
                                            <DotRating level={lvl} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        // ── ADDITIONAL SKILLS ─────────────────────────────────────────────────
        additionalSkills: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.additionalSkills?.[idx]).filter(Boolean) : (data.additionalSkills || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="additionalSkills" navigationId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Additional Skills">
                    <div style={{ paddingBottom: "1px" }}>
                        <SectionTitle title="Additional Skills" zoneId={zoneId} />
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px 20px" }}>
                            {items.map((skill, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                const name = typeof skill === 'object' ? skill.name : skill;
                                const lvl = typeof skill === 'object' ? (skill.level ?? skill.rating) : null;
                                return (
                                    <div key={originalIdx} data-item-index={originalIdx} style={styles.skillItem}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
                                            <div style={{ flex: 1 }}>
                                                <RichTextSpellCheck html={name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                                    onReplace={(val) => onSpellCheckReplace('additionalSkills', originalIdx, val, 'name')} />
                                            </div>
                                            <DotRating level={lvl} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        // ── CONTACT ───────────────────────────────────────────────────────────
        contact: ({ zoneId }) => {
            const websiteItems = data.websites || [];
            const extraLinks = [
                personal?.linkedin && { label: 'LinkedIn', value: personal.linkedin, icon: Linkedin },
                personal?.github && { label: 'GitHub', value: personal.github, icon: Github },
                personal?.website && { label: 'Website', value: personal.website, icon: Globe },
            ].filter(Boolean);

            const headerWebsites = websiteItems
                .map((link, idx) => ({ ...link, originalIdx: idx }))
                .filter(link => link.addToHeader && link.url)
                .map(link => ({ label: link.label || 'Website', value: link.url, icon: Globe2, idx: link.originalIdx }));

            return (
                <SectionWrapper sectionId="contact" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Contact">
                    <div style={{ paddingBottom: "1px" }}>
                        <SectionTitle title="Contact" zoneId={zoneId} />
                        {personal?.phone && (
                            <div style={styles.contactRow}>
                                <Phone style={styles.contactIcon} strokeWidth={2} />
                                <ResumeLink href={personal.phone}>
                                    <SpellCheckText text={personal.phone} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                        onReplace={(val) => onSpellCheckReplace('personal', 'phone', val)} />
                                </ResumeLink>
                            </div>
                        )}
                        {personal?.email && (
                            <div style={styles.contactRow}>
                                <Mail style={styles.contactIcon} strokeWidth={2} />
                                <ResumeLink href={personal.email}>
                                    <SpellCheckText text={personal.email} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                        onReplace={(val) => onSpellCheckReplace('personal', 'email', val)} />
                                </ResumeLink>
                            </div>
                        )}
                        {(personal?.city || personal?.country || personal?.zipCode || personal?.zip) && (
                            <div style={styles.contactRow}>
                                <MapPin style={styles.contactIcon} strokeWidth={2} />
                                <SpellCheckText
                                    text={[personal?.city, personal?.state, personal?.zipCode || personal?.zip, personal?.country].filter(Boolean).join(", ")}
                                    isActive={isSpellCheckActive}
                                    onIgnore={onSpellCheckIgnore}
                                    onReplace={(val) => onSpellCheckReplace('personal', 'city', val)}
                                />
                            </div>
                        )}
                        {[...extraLinks, ...headerWebsites].map((link, i) => (
                            <div key={i} style={styles.contactRow}>
                                <link.icon style={styles.contactIcon} strokeWidth={2} />
                                <ResumeLink href={link.value}>
                                    <SpellCheckText text={link.value} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                        onReplace={(val) => onSpellCheckReplace('personal', link.label?.toLowerCase(), val)} />
                                </ResumeLink>
                            </div>
                        ))}
                    </div>
                </SectionWrapper>
            );
        },

        // ── PERSONAL DETAILS ──────────────────────────────────────────────────
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
                    <div style={{ paddingBottom: "1px" }}>
                        <SectionTitle title="Personal Details" zoneId={zoneId} />
                        {details.map((d, i) => (
                            <div key={i} style={styles.contactRow}>
                                <d.icon style={styles.contactIcon} strokeWidth={2} />
                                <div>
                                    <div style={{ fontSize: "11px", color: green, fontWeight: "600", textTransform: "uppercase" }}>{d.label}</div>
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

        // ── WEBSITES ──────────────────────────────────────────────────────────
        websites: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.websites?.[idx]) : data.websites;
            const portfolioLinks = (items || [])
                .map((link, idx) => ({ ...link, originalIdx: itemIndices ? itemIndices[idx] : idx }))
                .filter(link => !link.addToHeader && link.url);
            if (portfolioLinks.length === 0) return null;
            return (
                <SectionWrapper sectionId="websites" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Websites">
                    <div style={{ paddingBottom: "1px" }}>
                        <SectionTitle title="Websites & Portfolios" zoneId={zoneId} />
                        {portfolioLinks.map((site, i) => (
                            <div key={i} style={styles.contactRow}>
                                <Globe style={styles.contactIcon} strokeWidth={2} />
                                <ResumeLink href={site.url}>
                                    <SpellCheckText text={site.url} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                        onReplace={(val) => onSpellCheckReplace('websites', site.originalIdx, val, 'url')} />
                                </ResumeLink>
                            </div>
                        ))}
                    </div>
                </SectionWrapper>
            );
        },
        // ── LANGUAGES ─────────────────────────────────────────────────────────
        languages: ({ itemIndices, isContinued, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.languages?.[idx]) : data.languages;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="languages" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Languages">
                    <div style={{ paddingBottom: "1px" }}>
                        <SectionTitle title="Languages" zoneId={zoneId} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "calc(8px * var(--theme-paragraph-margin, 1))" }}>
                            {items.map((lang, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <LanguageItem
                                        key={i}
                                        item={lang}
                                        index={originalIdx}
                                        isSpellCheckActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onSpellCheckReplace={(field, val) => onSpellCheckReplace('languages', originalIdx, val, field)}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        // ── CERTIFICATIONS ────────────────────────────────────────────────────
        certifications: ({ itemIndices, isContinued, zoneId, subItemRanges: renderSubItemRanges }) => {
            const items = itemIndices ? itemIndices.map(idx => data.certifications?.[idx]) : data.certifications;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="certifications" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Certifications">
                    <div style={{ paddingBottom: "1px" }}>
                        <SectionTitle title="Certifications" zoneId={zoneId} />
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

        // ── SOFTWARE ──────────────────────────────────────────────────────────
        software: ({ itemIndices, isContinued, zoneId, subItemRanges: renderSubItemRanges }) => {
            const items = itemIndices ? itemIndices.map(idx => data.software?.[idx]) : data.software;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="software" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Software">
                    <div style={{ paddingBottom: "1px" }}>
                        <SectionTitle title="Software" zoneId={zoneId} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "calc(10px * var(--theme-paragraph-margin, 1))" }}>
                            {items.map((item, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <SoftwareItem
                                        key={i}
                                        item={item}
                                        index={originalIdx}
                                        isSpellCheckActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onSpellCheckReplace={(field, val) => onSpellCheckReplace('software', originalIdx, val, field)}
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

        // ── INTERESTS ─────────────────────────────────────────────────────────
        interests: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.interests?.[idx]).filter(Boolean) : (data.interests || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="interests" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Interests">
                    <div style={{ paddingBottom: "1px" }}>
                        <SectionTitle title="Interests" zoneId={zoneId} />
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                            {items.map((item, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                const name = typeof item === 'object' ? item.name : item;
                                return (
                                    <div key={originalIdx} data-item-index={originalIdx} style={{ ...styles.skillItem, background: "#f9fafb", padding: "4px 12px", borderRadius: "15px", border: "1px solid #e5e7eb" }}>
                                        <RichTextSpellCheck html={name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                            onReplace={(val) => onSpellCheckReplace('interests', originalIdx, val, 'name')} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        // ── PROJECTS ──────────────────────────────────────────────────────────
        projects: ({ itemIndices, subItemRanges, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.projects?.[idx]).filter(Boolean) : (data.projects || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="projects" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Projects">
                    <div style={{ paddingBottom: "1px" }}>
                        <SectionTitle title="Projects" zoneId={zoneId} />
                        {items.map((proj, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const dateStr = proj.year || (proj.startYear ? `${proj.startYear} - ${proj.isCurrent ? 'Present' : (proj.endYear || 'Present')}` : "");
                            return (
                                <div key={i} data-item-index={originalIdx} style={{ marginBottom: "calc(16px * var(--theme-paragraph-margin, 1))", paddingBottom: "1px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "8px" }}>
                                        <div style={{ fontWeight: "600", fontSize: "calc(13px * var(--theme-font-scale, 1))", color: "#2d2d2d" }}>
                                            <RichTextSpellCheck html={proj.title} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                                onReplace={(val) => onSpellCheckReplace('projects', originalIdx, val, 'title')} />
                                        </div>
                                        {dateStr && <div style={styles.expDate}>{dateStr}</div>}
                                    </div>
                                    {proj.link && (
                                        <div style={{ fontSize: "calc(11.5px * var(--theme-font-scale, 1))", color: green, marginBottom: "4px" }}>
                                            <ResumeLink href={proj.link}>
                                                <RichTextSpellCheck html={proj.link} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                                    onReplace={(val) => onSpellCheckReplace('projects', originalIdx, val, 'link')} />
                                            </ResumeLink>
                                        </div>
                                    )}
                                    {proj.technologies?.length > 0 && (
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "6px" }}>
                                            {proj.technologies.map((tech, tIdx) => (
                                                <span key={tIdx} style={{ fontSize: "calc(11px * var(--theme-font-scale, 1))", padding: "2px 7px", background: "#f0f4f0", borderRadius: "10px", color: green }}>
                                                    <RichTextSpellCheck html={tech} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                                        onReplace={(val) => {
                                                            const updated = [...proj.technologies];
                                                            updated[tIdx] = val;
                                                            onSpellCheckReplace('projects', originalIdx, updated, 'technologies');
                                                        }} />
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    {proj.description && (
                                        <div className="resume-rich-text" style={styles.expDescription}>
                                            <SplittableRichText html={proj.description} range={subItemRanges?.[originalIdx]}
                                                isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                                onReplace={(val) => onSpellCheckReplace('projects', originalIdx, val, 'description')} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        // ── AWARDS ────────────────────────────────────────────────────────────
        awards: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.awards?.[idx]).filter(Boolean) : (data.awards || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="awards" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Awards">
                    <div style={{ paddingBottom: "1px" }}>
                        <SectionTitle title="Awards" zoneId={zoneId} />
                        {items.map((award, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={originalIdx} style={{ marginBottom: "calc(12px * var(--theme-paragraph-margin, 1))", paddingBottom: "1px" }}>
                                    <div style={{ fontWeight: "600", fontSize: "calc(13px * var(--theme-font-scale, 1))", color: "#2d2d2d" }}>
                                        <RichTextSpellCheck html={award.title} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                            onReplace={(val) => onSpellCheckReplace('awards', originalIdx, val, 'title')} />
                                    </div>
                                    <div style={styles.expDate}>
                                        <RichTextSpellCheck html={award.issuer || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                            onReplace={(val) => onSpellCheckReplace('awards', originalIdx, val, 'issuer')} />
                                        {award.year && <span> • {award.year}</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        // ── VOLUNTEER ─────────────────────────────────────────────────────────
        volunteer: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.volunteer?.[idx]).filter(Boolean) : (data.volunteer || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="volunteer" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Volunteer">
                    <div style={{ paddingBottom: "1px" }}>
                        <SectionTitle title="Volunteer" zoneId={zoneId} />
                        {items.map((item, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={originalIdx} style={{ marginBottom: "calc(14px * var(--theme-paragraph-margin, 1))", paddingBottom: "1px" }}>
                                    <div style={styles.expCompany}>
                                        <RichTextSpellCheck html={item.organization} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                            onReplace={(val) => onSpellCheckReplace('volunteer', originalIdx, val, 'organization')} />
                                    </div>
                                    <div style={{ fontWeight: "600", fontSize: "calc(12.5px * var(--theme-font-scale, 1))", color: "#4b5563", marginBottom: "2px" }}>
                                        <RichTextSpellCheck html={item.role} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                            onReplace={(val) => onSpellCheckReplace('volunteer', originalIdx, val, 'role')} />
                                    </div>
                                    <div style={styles.expDate}>
                                        {item.startDate} {item.startDate && "–"} {item.isCurrent ? "Present" : item.endDate}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        // ── PUBLICATIONS ──────────────────────────────────────────────────────
        publications: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.publications?.[idx]).filter(Boolean) : (data.publications || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="publications" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Publications">
                    <div style={{ paddingBottom: "1px" }}>
                        <SectionTitle title="Publications" zoneId={zoneId} />
                        {items.map((pub, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={originalIdx} style={{ marginBottom: "calc(12px * var(--theme-paragraph-margin, 1))", paddingBottom: "1px" }}>
                                    <div style={styles.expCompany}>
                                        <RichTextSpellCheck html={pub.name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                            onReplace={(val) => onSpellCheckReplace('publications', originalIdx, val, 'name')} />
                                    </div>
                                    <div style={styles.expDate}>
                                        <RichTextSpellCheck html={pub.publisher || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                            onReplace={(val) => onSpellCheckReplace('publications', originalIdx, val, 'publisher')} />
                                        {pub.releaseDate && <span> • {pub.releaseDate}</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        // ── ADDITIONAL INFO ───────────────────────────────────────────────────
        additionalInfo: ({ subItemRanges: renderSubItemRanges, zoneId }) => {
            const html = data.additionalInfo || "";
            if (!html || html.trim() === "" || html === "<p><br></p>") return null;
            return (
                <SectionWrapper sectionId="additionalInfo" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Additional Information">
                    <div style={{ paddingBottom: "1px" }}>
                        <SectionTitle title="Additional Information" zoneId={zoneId} />
                        <div className="resume-rich-text" style={{ fontSize: "calc(12.5px * var(--theme-font-scale, 1))", lineHeight: "1.6", color: "#374151" }}>
                            <SplittableRichText html={html} range={renderSubItemRanges?.additionalInfo}
                                isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                onReplace={(val) => onSpellCheckReplace('additionalInfo', 'additionalInfo', val)} />
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        // ── CUSTOM SECTION ────────────────────────────────────────────────────
        custom: ({ subItemRanges: renderSubItemRanges, zoneId }) => {
            if (!data.customSection?.isVisible || !data.customSection?.content) return null;
            const content = data.customSection.content;
            if (!content || content.trim() === "" || content === "<p><br></p>") return null;
            const title = data.customSection.title || "Additional Information";
            return (
                <SectionWrapper sectionId="custom" onSectionClick={onSectionClick} isInteractive={isInteractive} label={title}>
                    <div style={{ paddingBottom: "1px" }}>
                        <SectionTitle title={title} zoneId={zoneId} />
                        <div className="resume-rich-text" style={{ fontSize: "calc(12.5px * var(--theme-font-scale, 1))", lineHeight: "1.6", color: "#374151" }}>
                            <SplittableRichText html={content} range={renderSubItemRanges?.custom}
                                isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore}
                                onReplace={(val) => onSpellCheckReplace('customSection', 'content', val)} />
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
            <div style={styles.header}>
                {/* Circular photo */}
                <div style={styles.photoCircleWrap}>
                    {personal?.photo
                        ? <img src={personal.photo} style={styles.photoImg} alt="profile" />
                        : <User strokeWidth={1} style={{ width: "46px", height: "46px", color: "rgba(255,255,255,0.7)" }} />
                    }
                </div>
                {/* Name + title */}
                <div style={styles.headerText}>
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
            </div>
        </SectionWrapper>
    );

    // ════════════════════════════════════════════════════════════════════════════
    //  ZONE RENDERER
    // ════════════════════════════════════════════════════════════════════════════
    const renderZone = (id, items, colStyle) => (
        <DroppableZone id={id} style={colStyle}>
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

    // ════════════════════════════════════════════════════════════════════════════
    //  MEASURER
    // ════════════════════════════════════════════════════════════════════════════
    const Measurer = () => (
        <div className="resume-measurer" style={{ position: "absolute", top: -10000, left: -10000, width: "210mm", visibility: "hidden" }}>
            <div className="page-height-marker" style={{ height: "297mm", width: "1px", position: "absolute", left: 0, top: 0 }} />
            <div style={{ ...styles.page, height: "auto", overflow: "visible" }}>
                <Header />
                <div style={styles.bodyRow}>
                    <div data-column-id="left" style={styles.leftCol}>
                        {activeLeftSections.map(sid => (
                            <div key={sid} style={{ paddingBottom: "1px" }}>
                                <SectionRenderer sectionId={sid} data={data} customRenderers={customRenderers} zoneId="left" />
                            </div>
                        ))}
                    </div>
                    <div data-column-id="right" style={styles.rightCol}>
                        {activeRightSections.map(sid => (
                            <div key={sid} style={{ paddingBottom: "1px" }}>
                                <SectionRenderer sectionId={sid} data={data} customRenderers={customRenderers} zoneId="right" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const leftGap = { display: "flex", flexDirection: "column", gap: "calc(20px * var(--theme-section-margin, 1))" };
    const rightGap = { display: "flex", flexDirection: "column", gap: "calc(20px * var(--theme-section-margin, 1))" };

    // ════════════════════════════════════════════════════════════════════════════
    //  RENDER
    // ════════════════════════════════════════════════════════════════════════════
    return (
        <div ref={containerRef} className="emerald-insight-root">
            <Measurer />
            <DndContext {...dndContextProps}>
                <SortableContext items={[...activeLeftSections, ...activeRightSections]} strategy={verticalListSortingStrategy}>
                    {showPageBreaks && pages ? (
                        pages.map((page, i) => (
                            <div key={i} style={{ ...styles.page, height: "297mm" }}>
                                {i === 0 && <Header />}
                                <div style={{ ...styles.bodyRow, flex: 1 }}>
                                    <div style={styles.leftCol}>
                                        {renderZone(`left-p${i}`, page.left, leftGap)}
                                    </div>
                                    <div style={styles.rightCol}>
                                        {renderZone(`right-p${i}`, page.right, rightGap)}
                                    </div>
                                </div>
                                <div style={{ position: "absolute", bottom: "15px", right: "20px", fontSize: "10px", opacity: 0.4, color: "#6b7280" }}>
                                    Page {i + 1}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ ...styles.page, height: "auto", minHeight: "297mm" }}>
                            <Header />
                            <div style={styles.bodyRow}>
                                <div style={styles.leftCol}>
                                    {renderZone('left', activeLeftSections, leftGap)}
                                </div>
                                <div style={styles.rightCol}>
                                    {renderZone('right', activeRightSections, rightGap)}
                                </div>
                            </div>
                        </div>
                    )}
                </SortableContext>
                <StableResumeDragOverlay
                    activeId={activeId}
                    scale={scale}
                    renderSection={(id) => (
                        <div style={{ background: "white", padding: "10px", border: "1px solid #d1d5db", borderRadius: "4px", width: "270px" }}>
                            <SectionRenderer sectionId={id} data={data} customRenderers={customRenderers} />
                        </div>
                    )}
                />
            </DndContext>
        </div>
    );
};

export default EmeraldInsight;