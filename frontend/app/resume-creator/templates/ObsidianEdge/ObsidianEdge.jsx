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
import { Globe, Mail, Phone, MapPin, Linkedin, Github } from "lucide-react";

/**
 * ObsidianEdge Template
 * Premium dark-header resume with warm gold accents, circular photo,
 * uppercase section labels, elegant skill bars, and refined two-tone layout.
 */
const ObsidianEdge = ({
    data, onSectionClick, onReorder, scale = 1,
    isSpellCheckActive, onSpellCheckIgnore, onSpellCheckReplace,
    layoutConfig, showPageBreaks
}) => {
    const containerRef = useRef(null);
    if (!data) return null;
    const { personal } = data;
    const isInteractive = !!onSectionClick && !isSpellCheckActive;
    const canReorder = !!onReorder && !isSpellCheckActive;

    const templateId = 'obsidian-edge';
    const initialLayout = getSavedLayout(data, templateId, {
        main: ['summary', 'skills', 'strengths', 'additionalSkills', 'experience', 'education', 'keyAchievements', 'accomplishments', 'projects', 'certifications', 'languages', 'software', 'interests', 'awards', 'volunteering', 'publications', 'references', 'affiliations', 'websites', 'personalDetails', 'additionalInfo', 'custom']
    });
    const completeLayout = getCompleteLayout(data, initialLayout, 'main');
    const activeSections = completeLayout.main || [];

    const { dndContextProps, activeId } = useResumeDragAndDrop({
        data, onReorder, scale, containers: { main: activeSections }
    });
    const pages = useAutoPagination({
        columns: { main: activeSections }, data, enabled: showPageBreaks, containerRef, scale
    });

    // --- PALETTE ---
    const accent = "var(--theme-color, #c8a24e)";
    const headerBg = "#0f172a";
    const headerBgLight = "#1e293b";
    const darkText = "#1a1a2e";
    const medText = "#475569";
    const ltText = "#64748b";
    const cardBg = "#f8fafc";

    const styles = {
        page: {
            width: "210mm", height: "297mm", background: "white",
            padding: "0 0 0 0", boxSizing: "border-box", position: "relative",
            margin: "0 auto 30px auto", color: darkText,
            fontFamily: "var(--theme-font, 'Inter', 'Segoe UI', sans-serif)",
            letterSpacing: "var(--theme-letter-spacing, 0.01em)",
            overflow: "hidden", display: "flex", flexDirection: "column",
        },
        bodyPad: {
            paddingLeft: "var(--theme-page-margin, 32px)",
            paddingRight: "var(--theme-page-margin, 32px)",
            paddingTop: "var(--theme-page-margin, 32px)",
            paddingBottom: "var(--theme-page-margin, 32px)",
            flex: 1,
        },
        // HEADER
        headerCard: {
            background: `linear-gradient(135deg, ${headerBg} 0%, ${headerBgLight} 100%)`,
            padding: "28px var(--theme-page-margin, 32px) 22px",
            display: "flex", alignItems: "center", gap: "22px",
            position: "relative", overflow: "hidden",
        },
        headerDecor: {
            position: "absolute", right: "-40px", top: "-40px",
            width: "180px", height: "180px", borderRadius: "50%",
            border: `2px solid rgba(200,162,78,0.12)`, pointerEvents: "none",
        },
        headerDecor2: {
            position: "absolute", right: "30px", bottom: "-60px",
            width: "120px", height: "120px", borderRadius: "50%",
            border: `2px solid rgba(200,162,78,0.08)`, pointerEvents: "none",
        },
        photo: {
            width: "90px", height: "90px", borderRadius: "50%",
            objectFit: "cover", flexShrink: 0,
            border: `3px solid ${accent}`, boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        },
        headerText: { flex: 1, zIndex: 1 },
        name: {
            fontSize: "calc(28px * var(--theme-font-scale, 1))",
            fontWeight: "800", color: "#ffffff", lineHeight: "1.1",
            marginBottom: "3px", letterSpacing: "0.02em",
        },
        profession: {
            fontSize: "calc(13px * var(--theme-font-scale, 1))",
            fontWeight: "600", color: accent, letterSpacing: "0.08em",
            textTransform: "uppercase", marginBottom: "8px",
        },
        contactRow: {
            display: "flex", flexWrap: "wrap", gap: "12px",
            fontSize: "calc(11px * var(--theme-font-scale, 1))",
            color: "rgba(255,255,255,0.75)",
        },
        contactItem: { display: "flex", alignItems: "center", gap: "5px" },
        accentUnder: {
            width: "100%", height: "3px",
            background: `linear-gradient(90deg, ${accent} 0%, transparent 100%)`,
        },
        // SECTION HEADING
        sectionHeading: {
            display: "flex", alignItems: "center", gap: "10px",
            marginBottom: "calc(10px * var(--theme-paragraph-margin, 1))",
        },
        sectionHeadingBar: {
            width: "4px", height: "18px", borderRadius: "2px",
            background: accent, flexShrink: 0,
        },
        sectionHeadingText: {
            fontSize: "calc(13px * var(--theme-font-scale, 1))",
            fontWeight: "800", color: darkText,
            textTransform: "uppercase", letterSpacing: "0.12em", lineHeight: "1.2",
        },
        sectionHeadingLine: {
            flex: 1, height: "1px", background: "#e2e8f0",
        },
        // CONTENT
        cw: {
            // marginBottom: "calc(18px * var(--theme-section-margin, 1))" // Spacing handled by ZONE_STYLE gap
        },
        is: {
            // marginBottom: "calc(12px * var(--theme-paragraph-margin, 1))" 
        },
        rt: {
            fontSize: "calc(12.5px * var(--theme-font-scale, 1))",
            lineHeight: "var(--theme-line-height, 1.55)", color: medText,
        },
        il: { fontWeight: "700", color: darkText, marginRight: "6px" },
        bullet: { marginRight: "7px", color: accent, fontWeight: "700" },
        // EXPERIENCE
        expCard: {
            padding: "10px 14px", background: cardBg,
            borderLeft: `3px solid ${accent}`, borderRadius: "0 6px 6px 0",
            marginBottom: "calc(12px * var(--theme-paragraph-margin, 1))",
        },
        jobTitle: {
            fontSize: "calc(13.5px * var(--theme-font-scale, 1))",
            fontWeight: "700", color: darkText,
        },
        jobCompany: {
            fontSize: "calc(12.5px * var(--theme-font-scale, 1))",
            fontWeight: "600", color: accent,
        },
        jobMeta: {
            fontSize: "calc(11.5px * var(--theme-font-scale, 1))",
            color: ltText, display: "flex", alignItems: "center", gap: "6px",
            marginBottom: "6px", flexWrap: "wrap",
        },
        // SKILL BAR
        skillBarOuter: {
            height: "6px", background: "#e2e8f0", borderRadius: "3px",
            overflow: "hidden", flex: 1, maxWidth: "80px",
        },
        skillBarInner: {
            height: "100%", borderRadius: "3px",
            background: `linear-gradient(90deg, ${accent}, #e8c96a)`,
        },
        // GRID
        grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 28px" },
        historyRow: {
            display: "grid", gridTemplateColumns: "1.4fr 1fr 0.6fr",
            alignItems: "baseline", gap: "10px",
            marginBottom: "calc(4px * var(--theme-paragraph-margin, 1))",
        },
    };

    // --- HEADER ---
    const Header = () => {
        const contactParts = [];
        if (personal?.city || personal?.state || personal?.country || personal?.zipCode) {
            contactParts.push({
                icon: <MapPin size={11} />,
                text: [personal.city, personal.state, personal.country, personal.zipCode].filter(Boolean).join(", ")
            });
        }
        if (personal?.phone) contactParts.push({ icon: <Phone size={11} />, text: personal.phone });
        if (personal?.email) contactParts.push({ icon: <Mail size={11} />, text: personal.email });
        if (personal?.linkedin) contactParts.push({ icon: <Linkedin size={11} />, text: personal.linkedin });
        if (personal?.github) contactParts.push({ icon: <Github size={11} />, text: personal.github });
        if (personal?.website) contactParts.push({ icon: <Globe size={11} />, text: personal.website });
        if (data.websites) data.websites.filter(s => s.addToHeader).forEach(s => contactParts.push({ icon: <Globe size={11} />, text: s.label || s.url }));

        return (
            <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Header">
                <div style={styles.headerCard}>
                    <div style={styles.headerDecor} /><div style={styles.headerDecor2} />
                    {personal?.photo && <img src={personal.photo} alt="Profile" style={styles.photo} />}
                    <div style={styles.headerText}>
                        <h1 style={styles.name}><SpellCheckText text={personal?.name || "YOUR NAME"} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'name', val)} /></h1>
                        {personal?.profession && <div style={styles.profession}><SpellCheckText text={personal.profession} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'profession', val)} /></div>}
                        {contactParts.length > 0 && (
                            <div style={styles.contactRow}>
                                {contactParts.map((c, i) => (
                                    <div key={i} style={styles.contactItem}>
                                        <ResumeLink href={c.text} style={{ display: "flex", alignItems: "center", gap: "5px", color: "inherit" }}>
                                            <span style={{ color: accent }}>{c.icon}</span> {c.text}
                                        </ResumeLink>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div style={styles.accentUnder} />
            </SectionWrapper>
        );
    };

    // --- SECTION HEADER ---
    const SectionHeader = ({ title }) => {
        const { isContinued } = useSectionContext();
        return (
            <div style={styles.sectionHeading}>
                <div style={styles.sectionHeadingBar} />
                <div style={styles.sectionHeadingText}>{isContinued ? `${title} (cont.)` : title}</div>
                <div style={styles.sectionHeadingLine} />
            </div>
        );
    };

    // --- SKILL LEVEL BAR ---
    const SkillBar = ({ level = 0, max = 5 }) => (
        <div style={styles.skillBarOuter}><div style={{ ...styles.skillBarInner, width: `${(level / max) * 100}%` }} /></div>
    );

    // --- CUSTOM RENDERERS ---
    const customRenderers = {
        summary: ({ isContinued, subItemRanges }) => (
            <SectionWrapper sectionId="summary" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Professional Summary">
                <div style={styles.cw}><SectionHeader title="Professional Summary" />
                    <div className="resume-rich-text" style={styles.rt}><SplittableRichText html={data.summary} range={subItemRanges?.summary} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('summary', 'summary', val)} /></div>
                </div>
            </SectionWrapper>
        ),
        experience: ({ itemIndices, subItemRanges }) => {
            const items = itemIndices ? itemIndices.map(i => data.experience?.[i]).filter(Boolean) : (data.experience || []);
            if (!items.length) return null;
            return (
                <SectionWrapper sectionId="experience" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Experience">
                    <div style={styles.cw}><SectionHeader title="Professional Experience" />
                        {items.map((exp, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const startDate = [exp.startMonth, exp.startYear].filter(Boolean).join(" ");
                            const endDate = exp.isCurrent ? "Present" : [exp.endMonth, exp.endYear].filter(Boolean).join(" ");
                            const dates = startDate && endDate ? `${startDate} – ${endDate}` : (startDate || endDate || "");
                            const loc = [exp.location, exp.isRemote ? "(Remote)" : null].filter(Boolean).join(" ");
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.expCard}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "4px", marginBottom: "2px" }}>
                                        <span style={styles.jobTitle}><RichTextSpellCheck html={exp.title || exp.role || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('experience', originalIdx, v, 'title')} /></span>
                                        <span style={styles.jobCompany}><RichTextSpellCheck html={exp.company || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('experience', originalIdx, v, 'company')} /></span>
                                    </div>
                                    <div style={styles.jobMeta}>
                                        {dates && <span style={{ fontWeight: "600" }}>{dates}</span>}
                                        {loc && <><span style={{ color: "#cbd5e1" }}>|</span><span><MapPin size={10} style={{ marginRight: 3 }} />{loc}</span></>}
                                    </div>
                                    {exp.description && <div className="resume-rich-text" style={styles.rt}><SplittableRichText html={exp.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('experience', originalIdx, v, 'description')} /></div>}
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },
        education: ({ itemIndices, subItemRanges }) => {
            const items = itemIndices ? itemIndices.map(i => data.education?.[i]).filter(Boolean) : (data.education || []);
            if (!items.length) return null;
            return (
                <SectionWrapper sectionId="education" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Education">
                    <div style={styles.cw}><SectionHeader title="Education" />
                        {items.map((edu, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const startDate = [edu.startMonth, edu.startYear].filter(Boolean).join(" ");
                            const endDate = [edu.endMonth, edu.endYear].filter(Boolean).join(" ");
                            const dates = startDate && endDate ? `${startDate} – ${endDate}` : (startDate || endDate || "");
                            const deg = [edu.degree, edu.field].filter(Boolean).join(" — ");
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.is}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "6px" }}>
                                        <div>
                                            {deg && <div style={{ fontWeight: "700", fontSize: "calc(13px * var(--theme-font-scale, 1))" }}><RichTextSpellCheck html={deg} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('education', originalIdx, v, 'degree')} /></div>}
                                            <div style={{ color: medText, fontStyle: "italic", fontSize: "calc(12px * var(--theme-font-scale, 1))" }}><RichTextSpellCheck html={[edu.school || "", edu.city].filter(Boolean).join(", ")} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('education', originalIdx, v, 'school')} /></div>
                                        </div>
                                        {dates && <div style={{ fontSize: "calc(11.5px * var(--theme-font-scale, 1))", color: ltText }}>{dates}</div>}
                                    </div>
                                    {edu.grade && <div style={{ ...styles.rt, marginTop: "2px" }}><span style={styles.il}>GPA:</span><SpellCheckText text={edu.grade} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('education', originalIdx, v, 'grade')} /></div>}
                                    {edu.description && <div className="resume-rich-text" style={{ ...styles.rt, marginTop: "4px" }}><SplittableRichText html={edu.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('education', originalIdx, v, 'description')} /></div>}
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },
        skills: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(i => data.skills?.[i]).filter(Boolean) : (data.skills || []);
            if (!items.length) return null;
            return (
                <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Skills">
                    <div style={styles.cw}><SectionHeader title="Technical Skills" />
                        <div style={styles.grid2}>
                            {items.map((skill, i) => {
                                const oi = itemIndices ? itemIndices[i] : i;
                                const s = typeof skill === 'object' ? skill : { name: skill, level: 0 };
                                return (
                                    <div key={oi} data-item-index={oi} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "calc(12.5px * var(--theme-font-scale, 1))", marginBottom: "calc(4px * var(--theme-paragraph-margin, 1))" }}>
                                        <span style={styles.bullet}>▸</span>
                                        <span style={{ flex: 1 }}><RichTextSpellCheck html={s.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('skills', oi, v, 'name')} /></span>
                                        {s.level > 0 && <SkillBar level={s.level} />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },
        strengths: ({ itemIndices }) => {
            const str = itemIndices ? itemIndices.map(i => data.strengths?.[i]).filter(Boolean) : (data.strengths || []);
            if (!str.length) return null;
            return (
                <SectionWrapper sectionId="strengths" navigationId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Strengths">
                    <div style={styles.cw}>
                        <SectionHeader title="Core Strengths" />
                        <div style={styles.grid2}>
                            {str.map((s, i) => {
                                const oi = itemIndices ? itemIndices[i] : i;
                                const nm = typeof s === 'object' ? s.name : s;
                                const lvl = typeof s === 'object' ? (s.level ?? s.rating ?? 0) : 0;
                                return (
                                    <div key={oi} data-item-index={oi} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "calc(12.5px * var(--theme-font-scale, 1))", marginBottom: "calc(3px * var(--theme-paragraph-margin, 1))" }}>
                                        <span style={styles.bullet}>▸</span>
                                        <span style={{ flex: 1 }}><RichTextSpellCheck html={nm || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('strengths', oi, v, 'name')} /></span>
                                        {lvl > 0 && <SkillBar level={lvl} />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },
        additionalSkills: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(i => data.additionalSkills?.[i]).filter(Boolean) : (data.additionalSkills || []);
            if (!items.length) return null;
            return (
                <SectionWrapper sectionId="additionalSkills" navigationId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Additional Skills">
                    <div style={styles.cw}>
                        <SectionHeader title="Additional Skills" />
                        <div style={styles.grid2}>
                            {items.map((s, i) => {
                                const oi = itemIndices ? itemIndices[i] : i;
                                const nm = typeof s === 'object' ? s.name : s;
                                const lvl = typeof s === 'object' ? (s.level ?? s.rating ?? 0) : 0;
                                return (
                                    <div key={oi} data-item-index={oi} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "calc(12.5px * var(--theme-font-scale, 1))", marginBottom: "calc(3px * var(--theme-paragraph-margin, 1))" }}>
                                        <span style={styles.bullet}>▸</span>
                                        <span style={{ flex: 1 }}><RichTextSpellCheck html={nm || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('additionalSkills', oi, v, 'name')} /></span>
                                        {lvl > 0 && <SkillBar level={lvl} />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },
        keyAchievements: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(i => data.keyAchievements?.[i]).filter(Boolean) : (data.keyAchievements || []);
            if (!items.length) return null;
            return (
                <SectionWrapper sectionId="keyAchievements" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Key Achievements">
                    <div style={styles.cw}><SectionHeader title="Key Achievements" />
                        {items.map((item, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i; return (
                                <div key={i} data-item-index={originalIdx} style={{ ...styles.is, display: "flex", alignItems: "flex-start" }}>
                                    <span style={styles.bullet}>★</span>
                                    <div>
                                        {item.name && <div style={{ fontWeight: "700", color: darkText, fontSize: "calc(12.5px * var(--theme-font-scale, 1))", marginBottom: "2px" }}><RichTextSpellCheck html={item.name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('keyAchievements', originalIdx, v, 'name')} /></div>}
                                        {item.description && <div className="resume-rich-text" style={styles.rt}><RichTextSpellCheck html={item.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('keyAchievements', originalIdx, v, 'description')} /></div>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },
        accomplishments: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(i => data.accomplishments?.[i]).filter(Boolean) : (data.accomplishments || []);
            if (!items.length) return null;
            return (
                <SectionWrapper sectionId="accomplishments" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Accomplishments">
                    <div style={styles.cw}><SectionHeader title="Accomplishments" />
                        {items.map((item, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i; return (
                                <div key={i} data-item-index={originalIdx} style={{ ...styles.is, display: "flex", alignItems: "flex-start" }}>
                                    <span style={styles.bullet}>▸</span>
                                    <div>
                                        {item.name && <div style={{ fontWeight: "700", color: darkText, fontSize: "calc(12.5px * var(--theme-font-scale, 1))", marginBottom: "2px" }}><RichTextSpellCheck html={item.name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('accomplishments', originalIdx, v, 'name')} /></div>}
                                        {item.description && <div className="resume-rich-text" style={styles.rt}><RichTextSpellCheck html={item.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('accomplishments', originalIdx, v, 'description')} /></div>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },
        projects: ({ itemIndices, subItemRanges }) => {
            const items = itemIndices ? itemIndices.map(i => data.projects?.[i]).filter(Boolean) : (data.projects || []);
            if (!items.length) return null;
            return (
                <SectionWrapper sectionId="projects" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Projects">
                    <div style={styles.cw}><SectionHeader title="Projects" />
                        {items.map((p, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const dates = p.year || (p.startYear && `${p.startYear} – ${p.isCurrent ? 'Present' : (p.endYear || '')}`);
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.expCard}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "6px", marginBottom: "4px" }}>
                                        <div style={{ fontWeight: "700", fontSize: "calc(13px * var(--theme-font-scale, 1))" }}><RichTextSpellCheck html={p.title || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('projects', originalIdx, v, 'title')} /></div>
                                        {dates && <div style={{ fontSize: "calc(11.5px * var(--theme-font-scale, 1))", color: ltText }}>{dates}</div>}
                                    </div>
                                    {p.link && (
                                        <div style={{ fontSize: "calc(11px * var(--theme-font-scale, 1))", color: accent, marginBottom: "3px" }}>
                                            <ResumeLink href={p.link}>
                                                <RichTextSpellCheck html={p.link} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('projects', originalIdx, v, 'link')} />
                                            </ResumeLink>
                                        </div>
                                    )}
                                    {p.technologies?.length > 0 && <div style={{ ...styles.rt, marginBottom: "4px" }}><span style={styles.il}>Tech:</span>{p.technologies.join(" · ")}</div>}
                                    {p.description && <div className="resume-rich-text" style={styles.rt}><SplittableRichText html={p.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('projects', originalIdx, v, 'description')} /></div>}
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },
        certifications: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(i => data.certifications?.[i]).filter(Boolean) : (data.certifications || []);
            if (!items.length) return null;
            return (
                <SectionWrapper sectionId="certifications" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Certifications">
                    <div style={styles.cw}><SectionHeader title="Certifications" />
                        {items.map((c, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i; return (
                                <div key={i} data-item-index={originalIdx} style={styles.is}>
                                    <div style={styles.historyRow}>
                                        <div style={{ fontWeight: "700", fontSize: "calc(12.5px * var(--theme-font-scale, 1))" }}><span style={styles.bullet}>▸</span><RichTextSpellCheck html={c.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('certifications', originalIdx, v, 'name')} /></div>
                                        <div style={{ textAlign: "center", color: medText, fontSize: "calc(12px * var(--theme-font-scale, 1))" }}><RichTextSpellCheck html={c.issuer || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('certifications', originalIdx, v, 'issuer')} /></div>
                                        <div style={{ textAlign: "right", color: ltText, fontSize: "calc(11.5px * var(--theme-font-scale, 1))" }}><RichTextSpellCheck html={c.date || c.year || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('certifications', originalIdx, v, 'date')} /></div>
                                    </div>
                                    {c.description && <div className="resume-rich-text" style={{ ...styles.rt, marginLeft: "18px" }}><RichTextSpellCheck html={c.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('certifications', originalIdx, v, 'description')} /></div>}
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },
        languages: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(i => data.languages?.[i]).filter(Boolean) : (data.languages || []);
            if (!items.length) return null;
            const lvlLabels = ['', 'Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Native'];
            return (
                <SectionWrapper sectionId="languages" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Languages">
                    <div style={styles.cw}><SectionHeader title="Languages" />
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px 28px" }}>
                            {items.map((l, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i; return (
                                    <div key={i} data-item-index={originalIdx} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "calc(12.5px * var(--theme-font-scale, 1))" }}>
                                        <span style={styles.il}><RichTextSpellCheck html={l.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('languages', originalIdx, v, 'name')} /></span>
                                        {l.level > 0 && <><SkillBar level={l.level} /><span style={{ color: ltText, fontSize: "calc(11px * var(--theme-font-scale, 1))" }}>{lvlLabels[l.level] || ""}</span></>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },
        software: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(i => data.software?.[i]).filter(Boolean) : (data.software || []);
            if (!items.length) return null;
            const rl = ['', 'Beginner', 'Elementary', 'Intermediate', 'Advanced', 'Expert'];
            return (
                <SectionWrapper sectionId="software" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Software">
                    <div style={styles.cw}><SectionHeader title="Software Proficiency" />
                        <div style={styles.grid2}>
                            {items.map((s, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i; return (
                                    <div key={i} data-item-index={originalIdx} style={{ marginBottom: "calc(4px * var(--theme-paragraph-margin, 1))" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "calc(12.5px * var(--theme-font-scale, 1))" }}>
                                            <span style={styles.bullet}>▸</span>
                                            <span style={{ flex: 1 }}><RichTextSpellCheck html={s.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('software', originalIdx, v, 'name')} /></span>
                                            {s.rating > 0 && <SkillBar level={s.rating} />}
                                        </div>
                                        {s.description && <div className="resume-rich-text" style={{ ...styles.rt, marginLeft: "18px", fontSize: "calc(11.5px * var(--theme-font-scale, 1))" }}><RichTextSpellCheck html={s.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('software', originalIdx, v, 'description')} /></div>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },
        interests: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(i => data.interests?.[i]).filter(Boolean) : (data.interests || []);
            if (!items.length) return null;
            return (
                <SectionWrapper sectionId="interests" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Interests">
                    <div style={styles.cw}><SectionHeader title="Interests" />
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", fontSize: "calc(12.5px * var(--theme-font-scale, 1))" }}>
                            {items.map((item, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i; return (
                                    <div key={i} data-item-index={originalIdx} style={{ display: "flex", alignItems: "center" }}><span style={styles.bullet}>▸</span><RichTextSpellCheck html={typeof item === 'object' ? item.name : item} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('interests', originalIdx, v, 'name')} /></div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },
        awards: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(i => data.awards?.[i]).filter(Boolean) : (data.awards || []);
            if (!items.length) return null;
            return (
                <SectionWrapper sectionId="awards" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Awards">
                    <div style={styles.cw}><SectionHeader title="Honors & Awards" />
                        {items.map((a, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i; return (
                                <div key={i} data-item-index={originalIdx} style={styles.is}>
                                    <div style={styles.historyRow}>
                                        <div style={{ fontWeight: "700", fontSize: "calc(12.5px * var(--theme-font-scale, 1))" }}><span style={styles.bullet}>★</span><RichTextSpellCheck html={a.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('awards', originalIdx, v, 'name')} /></div>
                                        <div style={{ textAlign: "center", color: medText, fontSize: "calc(12px * var(--theme-font-scale, 1))" }}><RichTextSpellCheck html={a.issuer || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('awards', originalIdx, v, 'issuer')} /></div>
                                        <div style={{ textAlign: "right", color: ltText, fontSize: "calc(11.5px * var(--theme-font-scale, 1))" }}><RichTextSpellCheck html={a.date || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('awards', originalIdx, v, 'date')} /></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },
        volunteering: ({ itemIndices, subItemRanges }) => {
            const items = itemIndices ? itemIndices.map(i => data.volunteering?.[i]).filter(Boolean) : (data.volunteering || []);
            if (!items.length) return null;
            return (
                <SectionWrapper sectionId="volunteering" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Volunteering">
                    <div style={styles.cw}><SectionHeader title="Community & Volunteering" />
                        {items.map((v, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i; const vStartDate = [v.startMonth, v.startYear].filter(Boolean).join(" "); const vEndDate = v.isCurrent ? "Present" : [v.endMonth, v.endYear].filter(Boolean).join(" "); const dates = vStartDate && vEndDate ? `${vStartDate} – ${vEndDate}` : (vStartDate || vEndDate || ""); return (
                                <div key={i} data-item-index={originalIdx} style={styles.expCard}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", marginBottom: "4px" }}>
                                        <div><span style={{ fontWeight: "700", fontSize: "calc(13px * var(--theme-font-scale, 1))", marginRight: "8px" }}><RichTextSpellCheck html={v.organization || v.company || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('volunteering', originalIdx, val, 'organization')} /></span><span style={{ color: medText, fontSize: "calc(12px * var(--theme-font-scale, 1))" }}><RichTextSpellCheck html={v.cause || v.title || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('volunteering', originalIdx, val, 'title')} /></span></div>
                                        {dates && <div style={{ fontSize: "calc(11.5px * var(--theme-font-scale, 1))", color: ltText }}>{dates}</div>}
                                    </div>
                                    {v.description && <div className="resume-rich-text" style={styles.rt}><SplittableRichText html={v.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('volunteering', originalIdx, val, 'description')} /></div>}
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },
        publications: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(i => data.publications?.[i]).filter(Boolean) : (data.publications || []);
            if (!items.length) return null;
            return (
                <SectionWrapper sectionId="publications" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Publications">
                    <div style={styles.cw}><SectionHeader title="Publications" />
                        {items.map((p, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i; return (
                                <div key={i} data-item-index={originalIdx} style={styles.is}>
                                    <div style={styles.historyRow}>
                                        <div style={{ fontWeight: "700", fontSize: "calc(12.5px * var(--theme-font-scale, 1))" }}><span style={styles.bullet}>▸</span><RichTextSpellCheck html={p.title || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('publications', originalIdx, v, 'title')} /></div>
                                        <div style={{ textAlign: "center", color: medText, fontSize: "calc(12px * var(--theme-font-scale, 1))" }}><RichTextSpellCheck html={p.publisher || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('publications', originalIdx, v, 'publisher')} /></div>
                                        <div style={{ textAlign: "right", color: ltText, fontSize: "calc(11.5px * var(--theme-font-scale, 1))" }}><RichTextSpellCheck html={p.date || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('publications', originalIdx, v, 'date')} /></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },
        references: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(i => data.references?.[i]).filter(Boolean) : (data.references || []);
            if (!items.length) return null;
            return (
                <SectionWrapper sectionId="references" onSectionClick={onSectionClick} isInteractive={isInteractive} label="References">
                    <div style={styles.cw}><SectionHeader title="References" />
                        <div style={styles.grid2}>
                            {items.map((r, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i; return (
                                    <div key={i} data-item-index={originalIdx} style={{ padding: "8px 12px", background: cardBg, borderRadius: "6px", fontSize: "calc(12.5px * var(--theme-font-scale, 1))" }}>
                                        <div style={{ fontWeight: "700", color: darkText }}><RichTextSpellCheck html={r.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('references', originalIdx, v, 'name')} /></div>
                                        <div style={{ color: medText, fontStyle: "italic" }}><RichTextSpellCheck html={r.title || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('references', originalIdx, v, 'title')} /></div>
                                        <div style={{ color: ltText }}><RichTextSpellCheck html={r.contact || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('references', originalIdx, v, 'contact')} /></div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },
        affiliations: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(i => data.affiliations?.[i]).filter(Boolean) : (data.affiliations || []);
            if (!items.length) return null;
            return (
                <SectionWrapper sectionId="affiliations" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Affiliations">
                    <div style={styles.cw}><SectionHeader title="Professional Affiliations" />
                        {items.map((a, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i; return (
                                <div key={i} data-item-index={originalIdx} style={{ ...styles.is, display: "flex", alignItems: "flex-start" }}>
                                    <span style={styles.bullet}>▸</span>
                                    <div><div style={{ fontWeight: "700", color: darkText, fontSize: "calc(12.5px * var(--theme-font-scale, 1))" }}><RichTextSpellCheck html={a.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('affiliations', originalIdx, v, 'name')} /></div>
                                        {a.description && <div className="resume-rich-text" style={styles.rt}><RichTextSpellCheck html={a.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('affiliations', originalIdx, v, 'description')} /></div>}</div>
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
                    <div style={styles.cw}><SectionHeader title="Personal Information" />
                        <div style={styles.grid2}>
                            {details.map((d, i) => (
                                <div key={i} style={{ fontSize: "calc(12.5px * var(--theme-font-scale, 1))" }}>
                                    <span style={styles.il}>{d.label}:</span>
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
                    <div style={styles.cw}><SectionHeader title="Additional Information" />
                        <div className="resume-rich-text" style={styles.rt}><SplittableRichText html={data.additionalInfo} range={subItemRanges?.additionalInfo} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('additionalInfo', 'additionalInfo', v)} /></div>
                    </div>
                </SectionWrapper>
            );
        },
        websites: ({ itemIndices }) => {
            const allWebsites = data.websites || [];
            const items = itemIndices
                ? itemIndices.map(i => ({ item: allWebsites[i], originalIdx: i })).filter(e => e.item)
                : allWebsites.map((item, i) => ({ item, originalIdx: i }));
            if (!items.length) return null;
            const contactParts = [];
            if (personal?.city || personal?.country) contactParts.push([personal.city, personal.state, personal.country].filter(Boolean).join(", "));
            if (personal?.phone) contactParts.push(personal.phone);
            if (personal?.email) contactParts.push(personal.email);
            if (personal?.linkedin) contactParts.push(personal.linkedin);
            if (personal?.github) contactParts.push(personal.github);
            if (personal?.website) contactParts.push(personal.website);
            const portfolioItems = items.filter(({ item: w }) => !w.addToHeader);
            return (
                <>
                    {contactParts.length > 0 && (
                        <SectionWrapper sectionId="websites" navigationId="websites" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Contact">
                            <div style={styles.cw}><SectionHeader title="Contact" />
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 22px", fontSize: "calc(12.5px * var(--theme-font-scale, 1))" }}>
                                    {contactParts.map((c, i) => (
                                        <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                            <span style={styles.bullet}>▸</span>
                                            <ResumeLink href={c.text instanceof Object ? null : c}>{c instanceof Object ? c.text : c}</ResumeLink>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </SectionWrapper>
                    )}
                    {portfolioItems.length > 0 && (
                        <SectionWrapper sectionId="portfolios" navigationId="websites" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Portfolios">
                            <div style={styles.cw}><SectionHeader title="Websites & Portfolios" />
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 22px", fontSize: "calc(12.5px * var(--theme-font-scale, 1))" }}>
                                    {portfolioItems.map(({ item: w, originalIdx }) => (
                                        <div key={originalIdx} data-item-index={originalIdx} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                            <Globe size={11} style={{ color: accent, flexShrink: 0 }} />
                                            <ResumeLink href={w.url}>
                                                <span style={{ fontWeight: "600" }}>{w.label || w.url}</span>
                                            </ResumeLink>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </SectionWrapper>
                    )}
                </>
            );
        },
        custom: ({ subItemRanges }) => {
            if (!data.customSection?.isVisible || !data.customSection?.content) return null;
            const title = data.customSection.title || "Additional Section";
            return (
                <SectionWrapper sectionId="custom" onSectionClick={onSectionClick} isInteractive={isInteractive} label={title}>
                    <div style={styles.cw}><SectionHeader title={title} />
                        <div className="resume-rich-text" style={styles.rt}><SplittableRichText html={data.customSection.content} range={subItemRanges?.custom} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('customSection', 'content', v)} /></div>
                    </div>
                </SectionWrapper>
            );
        }
    };

    // --- RENDER ZONE ---
    const renderZone = (id, items, columnStyle = {}) => (
        <DroppableZone id={id} style={{ ...columnStyle }}>
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

    const ZONE_STYLE = {
        display: "flex",
        flexDirection: "column",
        gap: "calc(18px * var(--theme-section-margin, 1))",
        minHeight: '100px',
        flex: 1
    };

    const Measurer = () => (
        <div className="resume-measurer" style={{ position: "absolute", top: -10000, left: -10000, width: "210mm", visibility: "hidden" }}>
            {/* MANDATORY — gives useAutoPagination the real DPI-aware A4 pixel height */}
            <div className="page-height-marker" style={{ height: "297mm", width: "1px", position: "absolute", left: 0, top: 0 }} />
            <div style={{ ...styles.page, height: "auto", overflow: "visible" }}>
                <Header />
                <div data-column-id="main" style={{ ...styles.bodyPad, ...ZONE_STYLE }}>
                    {activeSections.map(sid => (
                        <SectionRenderer key={sid} sectionId={sid} data={data} customRenderers={customRenderers} zoneId="main" />
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div ref={containerRef} className="obsidian-edge-root">
            <Measurer />
            <DndContext {...dndContextProps}>
                <SortableContext items={activeSections} strategy={verticalListSortingStrategy}>
                    {showPageBreaks && pages ? (
                        pages.map((page, i) => (
                            <div key={i} style={{ ...styles.page, height: "297mm", minHeight: "unset", overflow: "hidden" }}>
                                {i === 0 && <Header />}
                                <div style={{ ...styles.bodyPad }}>
                                    {renderZone(`main-p${i}`, page.main, ZONE_STYLE)}
                                </div>
                                <div style={{ position: "absolute", bottom: "12px", right: "32px", fontSize: "9px", color: ltText, fontFamily: "sans-serif" }}>Page {i + 1}</div>
                            </div>
                        ))
                    ) : (
                        <div style={{ ...styles.page, height: "auto", minHeight: "297mm", overflow: "visible" }}>
                            <Header />
                            <div style={styles.bodyPad}>
                                {renderZone('main', activeSections, ZONE_STYLE)}
                            </div>
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

export default ObsidianEdge;
