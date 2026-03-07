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
 * ClearVista Template
 * Clean white resume with blue accent section headings, profile photo top-right,
 * bold contact labels, bullet-list skills, and two-column experience layout.
 * Mirrors the classic professional style shown in reference screenshot.
 */
const ClearVista = ({
    data, onSectionClick, onReorder, scale = 1,
    isSpellCheckActive, onSpellCheckIgnore, onSpellCheckReplace,
    layoutConfig, showPageBreaks
}) => {
    const containerRef = useRef(null);
    if (!data) return null;
    const { personal } = data;
    const isInteractive = !!onSectionClick && !isSpellCheckActive;
    const canReorder = !!onReorder && !isSpellCheckActive;

    const templateId = 'clear-vista';
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
    const accent = "var(--theme-color, #4a9fd4)";
    const darkText = "#1a1a1a";
    const medText = "#555555";
    const ltText = "#888888";
    const borderColor = "#e0e0e0";
    const labelColor = "#222222";

    const styles = {
        page: {
            width: "210mm",
            height: "297mm",
            background: "#ffffff",
            padding: "0",
            boxSizing: "border-box",
            position: "relative",
            margin: "0 auto 30px auto",
            color: darkText,
            fontFamily: "var(--theme-font, 'Georgia', 'Times New Roman', serif)",
            letterSpacing: "var(--theme-letter-spacing, 0.01em)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
        },
        bodyPad: {
            padding: "var(--theme-page-margin, 32px)",
            flex: 1,
        },

        // HEADER
        headerCard: {
            padding: "24px var(--theme-page-margin, 32px) 18px",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            borderBottom: `2px solid ${borderColor}`,
            background: "#ffffff",
        },
        headerLeft: {
            flex: 1,
        },
        name: {
            fontSize: "calc(30px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: darkText,
            lineHeight: "1.1",
            marginBottom: "4px",
            fontFamily: "var(--theme-font, 'Georgia', serif)",
            letterSpacing: "-0.01em",
        },
        profession: {
            fontSize: "calc(13px * var(--theme-font-scale, 1))",
            fontWeight: "400",
            color: medText,
            marginBottom: "14px",
            fontStyle: "italic",
        },
        contactTable: {
            display: "flex",
            flexDirection: "column",
            gap: "calc(3px * var(--theme-paragraph-margin, 1))",
        },
        contactRow: {
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "calc(11.5px * var(--theme-font-scale, 1))",
            color: medText,
            lineHeight: "var(--theme-line-height, 1.5)",
        },
        contactLabel: {
            fontWeight: "700",
            color: labelColor,
            minWidth: "52px",
            fontSize: "calc(11.5px * var(--theme-font-scale, 1))",
        },
        photo: {
            width: "88px",
            height: "88px",
            objectFit: "cover",
            flexShrink: 0,
            border: `1px solid ${borderColor}`,
            borderRadius: "2px",
            marginLeft: "20px",
        },
        photoPlaceholder: {
            width: "88px",
            height: "88px",
            flexShrink: 0,
            marginLeft: "20px",
            background: "#e8e8e8",
            borderRadius: "2px",
            border: `1px solid ${borderColor}`,
        },

        // SECTION HEADING — blue text, no bar, just bold colored label with underline
        sectionHeading: {
            marginBottom: "calc(8px * var(--theme-paragraph-margin, 1))",
            borderBottom: `1.5px solid ${borderColor}`,
            paddingBottom: "3px",
        },
        sectionHeadingText: {
            fontSize: "calc(14px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: accent,
            letterSpacing: "0.04em",
            lineHeight: "1.3",
            fontFamily: "var(--theme-font, 'Georgia', serif)",
        },

        // CONTENT
        cw: {
        },
        is: {
            marginBottom: "calc(10px * var(--theme-paragraph-margin, 1))",
        },
        rt: {
            fontSize: "calc(11.5px * var(--theme-font-scale, 1))",
            lineHeight: "var(--theme-line-height, 1.6)",
            color: medText,
        },
        il: {
            fontWeight: "700",
            color: darkText,
            marginRight: "6px",
        },

        // EXPERIENCE — two-column: date left, content right
        expRow: {
            display: "grid",
            gridTemplateColumns: "110px 1fr",
            gap: "0 16px",
            marginBottom: "calc(14px * var(--theme-paragraph-margin, 1))",
        },
        expDate: {
            fontSize: "calc(11px * var(--theme-font-scale, 1))",
            color: medText,
            paddingTop: "1px",
            lineHeight: "var(--theme-line-height, 1.5)",
        },
        expContent: {
            flex: 1,
        },
        jobTitle: {
            fontSize: "calc(13px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: darkText,
            marginBottom: "1px",
        },
        jobCompany: {
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            fontWeight: "400",
            color: medText,
            fontStyle: "italic",
            marginBottom: "4px",
        },

        // SKILLS — vertical bullet list
        skillItem: {
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
            marginBottom: "calc(4px * var(--theme-paragraph-margin, 1))",
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            color: darkText,
            lineHeight: "var(--theme-line-height, 1.5)",
        },
        bullet: {
            color: darkText,
            fontSize: "calc(14px * var(--theme-font-scale, 1))",
            lineHeight: "1.3",
            flexShrink: 0,
        },

        // SKILL BAR
        skillBarOuter: {
            height: "6px",
            background: "#e2e8f0",
            borderRadius: "3px",
            overflow: "hidden",
            flex: 1,
            maxWidth: "80px",
            marginTop: "6px",
        },
        skillBarInner: {
            height: "100%",
            borderRadius: "3px",
            background: accent,
        },

        // GRID
        grid2: {
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0 28px",
        },
        historyRow: {
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 0.6fr",
            alignItems: "baseline",
            gap: "10px",
            marginBottom: "calc(4px * var(--theme-paragraph-margin, 1))",
        },
    };

    // --- HEADER ---
    const Header = () => {
        const contactParts = [];
        const addrParts = [personal?.city, personal?.state, personal?.country, personal?.zipCode || personal?.zip].filter(Boolean).join(", ");
        if (addrParts) contactParts.push({ label: "Address", text: addrParts, icon: null });
        if (personal?.phone) contactParts.push({ label: "Phone", text: personal.phone, icon: null });
        if (personal?.email) contactParts.push({ label: "E-mail", text: personal.email, icon: null });
        if (personal?.linkedin) contactParts.push({ label: "LinkedIn", text: personal.linkedin, icon: null });
        if (personal?.github) contactParts.push({ label: "GitHub", text: personal.github, icon: null });
        if (personal?.website) contactParts.push({ label: "Website", text: personal.website, icon: null });
        if (data.websites) data.websites.filter(w => w.addToHeader).forEach(s => contactParts.push({ label: s.label || "Web", text: s.url, icon: null }));

        return (
            <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Header">
                <div style={styles.headerCard}>
                    <div style={styles.headerLeft}>
                        <h1 style={styles.name}>
                            <SpellCheckText
                                text={personal?.name || "YOUR NAME"}
                                isActive={isSpellCheckActive}
                                onIgnore={onSpellCheckIgnore}
                                onReplace={(val) => onSpellCheckReplace('personal', 'name', val)}
                            />
                        </h1>
                        {personal?.profession && (
                            <div style={styles.profession}>
                                <SpellCheckText
                                    text={personal.profession}
                                    isActive={isSpellCheckActive}
                                    onIgnore={onSpellCheckIgnore}
                                    onReplace={(val) => onSpellCheckReplace('personal', 'profession', val)}
                                />
                            </div>
                        )}
                        {contactParts.length > 0 && (
                            <div style={styles.contactTable}>
                                {contactParts.map((c, i) => (
                                    <div key={i} style={styles.contactRow}>
                                        <span style={styles.contactLabel}>{c.label}</span>
                                        <ResumeLink href={c.text} style={{ color: medText, textDecoration: "none" }}>
                                            {c.text}
                                        </ResumeLink>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {personal?.photo
                        ? <img src={personal.photo} alt="Profile" style={styles.photo} />
                        : <div style={styles.photoPlaceholder} />
                    }
                </div>
            </SectionWrapper>
        );
    };

    // --- SECTION HEADER ---
    const SectionHeader = ({ title }) => {
        const { isContinued } = useSectionContext();
        return (
            <div style={styles.sectionHeading}>
                <div style={styles.sectionHeadingText}>
                    {isContinued ? `${title} (cont.)` : title}
                </div>
            </div>
        );
    };

    // --- SKILL BAR ---
    const SkillBar = ({ level = 0, max = 5 }) => (
        <div style={styles.skillBarOuter}>
            <div style={{ ...styles.skillBarInner, width: `${(level / max) * 100}%` }} />
        </div>
    );

    // --- CUSTOM RENDERERS ---
    const customRenderers = {
        contact: () => {
            const { personal: p = {} } = data;
            const items = data.websites || [];
            const links = [
                { label: 'LinkedIn', value: p.linkedin },
                { label: 'GitHub', value: p.github },
                { label: 'Website', value: p.website },
                ...items.filter(site => site.addToHeader && site.url).map(site => ({ label: site.label || 'Website', value: site.url }))
            ];

            return (
                <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Header Details">
                    <div style={styles.cw}>
                        <SectionHeader title="Contact Information" />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px" }}>
                            {p.phone && (
                                <div style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))" }}>
                                    <span style={styles.il}>Phone:</span>
                                    <ResumeLink href={p.phone}>
                                        <SpellCheckText text={p.phone} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'phone', val)} />
                                    </ResumeLink>
                                </div>
                            )}
                            {p.email && (
                                <div style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))" }}>
                                    <span style={styles.il}>Email:</span>
                                    <ResumeLink href={p.email}>
                                        <SpellCheckText text={p.email} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'email', val)} />
                                    </ResumeLink>
                                </div>
                            )}
                            {(p.city || p.state) && (
                                <div style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))" }}>
                                    <span style={styles.il}>Location:</span>
                                    <SpellCheckText text={[p.city, p.state, p.country].filter(Boolean).join(", ")} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'city', val)} />
                                </div>
                            )}
                            {links.filter(l => l.value).map((link, i) => (
                                <div key={i} style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))" }}>
                                    <span style={styles.il}>{link.label}:</span>
                                    <ResumeLink href={link.value}>
                                        <SpellCheckText text={link.value} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', link.field || 'website', val)} />
                                    </ResumeLink>
                                </div>
                            ))}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        summary: ({ subItemRanges }) => (
            <SectionWrapper sectionId="summary" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Professional Summary">
                <div style={styles.cw}>
                    <SectionHeader title="Professional Summary" />
                    <div className="resume-rich-text" style={styles.rt}>
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

        experience: ({ itemIndices, subItemRanges }) => {
            const items = itemIndices ? itemIndices.map(i => data.experience?.[i]).filter(Boolean) : (data.experience || []);
            if (!items.length) return null;
            return (
                <SectionWrapper sectionId="experience" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Work History">
                    <div style={styles.cw}>
                        <SectionHeader title="Work History" />
                        {items.map((exp, i) => {
                            const oi = itemIndices ? itemIndices[i] : i;
                            const startDate = [exp.startMonth && exp.startMonth.toString().padStart ? exp.startMonth : exp.startMonth, exp.startYear].filter(Boolean).join("-");
                            const endDate = exp.isCurrent ? "Current" : [exp.endMonth, exp.endYear].filter(Boolean).join("-");
                            const dates = startDate && endDate ? `${startDate} - ${endDate}` : (startDate || endDate || "");
                            const loc = [exp.location, exp.isRemote ? "(Remote)" : null].filter(Boolean).join(" ");
                            return (
                                <div key={i} data-item-index={oi} style={styles.expRow}>
                                    <div style={styles.expDate}>{dates}</div>
                                    <div style={styles.expContent}>
                                        <div style={styles.jobTitle}>
                                            <RichTextSpellCheck
                                                html={exp.title || exp.role || ""}
                                                isActive={isSpellCheckActive}
                                                onIgnore={onSpellCheckIgnore}
                                                onReplace={(v) => onSpellCheckReplace('experience', oi, v, 'title')}
                                            />
                                        </div>
                                        <div style={styles.jobCompany}>
                                            <RichTextSpellCheck
                                                html={[exp.company, loc].filter(Boolean).join(", ")}
                                                isActive={isSpellCheckActive}
                                                onIgnore={onSpellCheckIgnore}
                                                onReplace={(v) => onSpellCheckReplace('experience', oi, v, 'company')}
                                            />
                                        </div>
                                        {exp.description && (
                                            <div className="resume-rich-text" style={styles.rt}>
                                                <SplittableRichText
                                                    html={exp.description}
                                                    range={subItemRanges?.[oi]}
                                                    isActive={isSpellCheckActive}
                                                    onIgnore={onSpellCheckIgnore}
                                                    onReplace={(v) => onSpellCheckReplace('experience', oi, v, 'description')}
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

        education: ({ itemIndices, subItemRanges }) => {
            const items = itemIndices ? itemIndices.map(i => data.education?.[i]).filter(Boolean) : (data.education || []);
            if (!items.length) return null;
            return (
                <SectionWrapper sectionId="education" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Education">
                    <div style={styles.cw}>
                        <SectionHeader title="Education" />
                        {items.map((edu, i) => {
                            const oi = itemIndices ? itemIndices[i] : i;
                            const startDate = [edu.startMonth, edu.startYear].filter(Boolean).join("-");
                            const endDate = [edu.endMonth, edu.endYear].filter(Boolean).join("-");
                            const dates = startDate && endDate ? `${startDate} - ${endDate}` : (startDate || endDate || "");
                            const deg = [edu.degree, edu.field].filter(Boolean).join(" — ");
                            return (
                                <div key={i} data-item-index={oi} style={styles.expRow}>
                                    <div style={styles.expDate}>{dates}</div>
                                    <div style={styles.expContent}>
                                        {deg && (
                                            <div style={{ fontWeight: "700", fontSize: "calc(13px * var(--theme-font-scale, 1))", marginBottom: "1px" }}>
                                                <RichTextSpellCheck html={deg} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('education', oi, v, 'degree')} />
                                            </div>
                                        )}
                                        <div style={{ ...styles.rt, fontStyle: "italic", marginBottom: "4px" }}>
                                            <RichTextSpellCheck
                                                html={[edu.school || "", edu.city].filter(Boolean).join(", ")}
                                                isActive={isSpellCheckActive}
                                                onIgnore={onSpellCheckIgnore}
                                                onReplace={(v) => onSpellCheckReplace('education', oi, v, 'school')}
                                            />
                                        </div>
                                        {edu.grade && (
                                            <div style={styles.rt}>
                                                <span style={styles.il}>GPA:</span>
                                                <SpellCheckText text={edu.grade} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('education', oi, v, 'grade')} />
                                            </div>
                                        )}
                                        {edu.description && (
                                            <div className="resume-rich-text" style={{ ...styles.rt, marginTop: "4px" }}>
                                                <SplittableRichText html={edu.description} range={subItemRanges?.[oi]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('education', oi, v, 'description')} />
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
            const items = itemIndices ? itemIndices.map(i => data.skills?.[i]).filter(Boolean) : (data.skills || []);
            if (!items.length) return null;
            return (
                <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Skills">
                    <div style={styles.cw}>
                        <SectionHeader title="Skills" />
                        <div>
                            {items.map((skill, i) => {
                                const oi = itemIndices ? itemIndices[i] : i;
                                const s = typeof skill === 'object' ? skill : { name: skill, level: 0 };
                                return (
                                    <div key={oi} data-item-index={oi} style={styles.skillItem}>
                                        <span style={styles.bullet}>•</span>
                                        <span style={{ flex: 1 }}>
                                            <RichTextSpellCheck
                                                html={s.name || ""}
                                                isActive={isSpellCheckActive}
                                                onIgnore={onSpellCheckIgnore}
                                                onReplace={(v) => onSpellCheckReplace('skills', oi, v, 'name')}
                                            />
                                        </span>
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
                        <div>
                            {str.map((s, i) => {
                                const oi = itemIndices ? itemIndices[i] : i;
                                const nm = typeof s === 'object' ? s.name : s;
                                const lvl = typeof s === 'object' ? (s.level ?? s.rating ?? 0) : 0;
                                return (
                                    <div key={oi} data-item-index={oi} style={styles.skillItem}>
                                        <span style={styles.bullet}>•</span>
                                        <span style={{ flex: 1 }}>
                                            <RichTextSpellCheck html={nm || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('strengths', oi, v, 'name')} />
                                        </span>
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
                        <div>
                            {items.map((s, i) => {
                                const oi = itemIndices ? itemIndices[i] : i;
                                const nm = typeof s === 'object' ? s.name : s;
                                const lvl = typeof s === 'object' ? (s.level ?? s.rating ?? 0) : 0;
                                return (
                                    <div key={oi} data-item-index={oi} style={styles.skillItem}>
                                        <span style={styles.bullet}>•</span>
                                        <span style={{ flex: 1 }}>
                                            <RichTextSpellCheck html={nm || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('additionalSkills', oi, v, 'name')} />
                                        </span>
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
                    <div style={styles.cw}>
                        <SectionHeader title="Key Achievements" />
                        {items.map((item, i) => {
                            const oi = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={oi} style={{ ...styles.is, display: "flex", alignItems: "flex-start", gap: "8px" }}>
                                    <span style={styles.bullet}>•</span>
                                    <div>
                                        {item.name && (
                                            <div style={{ fontWeight: "700", color: darkText, fontSize: "calc(12.5px * var(--theme-font-scale, 1))", marginBottom: "2px" }}>
                                                <RichTextSpellCheck html={item.name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('keyAchievements', oi, v, 'name')} />
                                            </div>
                                        )}
                                        {item.description && (
                                            <div className="resume-rich-text" style={styles.rt}>
                                                <RichTextSpellCheck html={item.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('keyAchievements', oi, v, 'description')} />
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

        accomplishments: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(i => data.accomplishments?.[i]).filter(Boolean) : (data.accomplishments || []);
            if (!items.length) return null;
            return (
                <SectionWrapper sectionId="accomplishments" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Accomplishments">
                    <div style={styles.cw}>
                        <SectionHeader title="Accomplishments" />
                        {items.map((item, i) => {
                            const oi = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={oi} style={{ ...styles.is, display: "flex", alignItems: "flex-start", gap: "8px" }}>
                                    <span style={styles.bullet}>•</span>
                                    <div>
                                        {item.name && (
                                            <div style={{ fontWeight: "700", color: darkText, fontSize: "calc(12.5px * var(--theme-font-scale, 1))", marginBottom: "2px" }}>
                                                <RichTextSpellCheck html={item.name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('accomplishments', oi, v, 'name')} />
                                            </div>
                                        )}
                                        {item.description && (
                                            <div className="resume-rich-text" style={styles.rt}>
                                                <RichTextSpellCheck html={item.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('accomplishments', oi, v, 'description')} />
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

        projects: ({ itemIndices, subItemRanges }) => {
            const items = itemIndices ? itemIndices.map(i => data.projects?.[i]).filter(Boolean) : (data.projects || []);
            if (!items.length) return null;
            return (
                <SectionWrapper sectionId="projects" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Projects">
                    <div style={styles.cw}>
                        <SectionHeader title="Projects" />
                        {items.map((p, i) => {
                            const oi = itemIndices ? itemIndices[i] : i;
                            const dates = p.year || (p.startYear && `${p.startYear} – ${p.isCurrent ? 'Present' : (p.endYear || '')}`);
                            return (
                                <div key={i} data-item-index={oi} style={styles.expRow}>
                                    <div style={styles.expDate}>{dates}</div>
                                    <div style={styles.expContent}>
                                        <div style={{ fontWeight: "700", fontSize: "calc(13px * var(--theme-font-scale, 1))", marginBottom: "2px" }}>
                                            <RichTextSpellCheck html={p.title || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('projects', oi, v, 'title')} />
                                        </div>
                                        {p.link && (
                                            <div style={{ fontSize: "calc(11px * var(--theme-font-scale, 1))", color: accent, marginBottom: "3px" }}>
                                                <ResumeLink href={p.link}>
                                                    <RichTextSpellCheck html={p.link} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('projects', oi, v, 'link')} />
                                                </ResumeLink>
                                            </div>
                                        )}
                                        {p.technologies?.length > 0 && (
                                            <div style={{ ...styles.rt, marginBottom: "4px" }}>
                                                <span style={styles.il}>Tech:</span>{p.technologies.join(" · ")}
                                            </div>
                                        )}
                                        {p.description && (
                                            <div className="resume-rich-text" style={styles.rt}>
                                                <SplittableRichText html={p.description} range={subItemRanges?.[oi]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('projects', oi, v, 'description')} />
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

        certifications: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(i => data.certifications?.[i]).filter(Boolean) : (data.certifications || []);
            if (!items.length) return null;
            return (
                <SectionWrapper sectionId="certifications" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Certifications">
                    <div style={styles.cw}>
                        <SectionHeader title="Certifications" />
                        {items.map((c, i) => {
                            const oi = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={oi} style={styles.is}>
                                    <div style={styles.historyRow}>
                                        <div style={{ fontWeight: "700", fontSize: "calc(12.5px * var(--theme-font-scale, 1))" }}>
                                            <span style={styles.bullet}>• </span>
                                            <RichTextSpellCheck html={c.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('certifications', oi, v, 'name')} />
                                        </div>
                                        <div style={{ color: medText, fontSize: "calc(12px * var(--theme-font-scale, 1))" }}>
                                            <RichTextSpellCheck html={c.issuer || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('certifications', oi, v, 'issuer')} />
                                        </div>
                                        <div style={{ textAlign: "right", color: ltText, fontSize: "calc(11.5px * var(--theme-font-scale, 1))" }}>
                                            <RichTextSpellCheck html={c.date || c.year || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('certifications', oi, v, 'date')} />
                                        </div>
                                    </div>
                                    {c.description && (
                                        <div className="resume-rich-text" style={{ ...styles.rt, marginLeft: "16px" }}>
                                            <RichTextSpellCheck html={c.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('certifications', oi, v, 'description')} />
                                        </div>
                                    )}
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
                    <div style={styles.cw}>
                        <SectionHeader title="Languages" />
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 28px" }}>
                            {items.map((l, i) => {
                                const oi = itemIndices ? itemIndices[i] : i;
                                return (
                                    <div key={i} data-item-index={oi} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "calc(12.5px * var(--theme-font-scale, 1))" }}>
                                        <span style={styles.bullet}>•</span>
                                        <span style={{ fontWeight: "700" }}>
                                            <RichTextSpellCheck html={l.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('languages', oi, v, 'name')} />
                                        </span>
                                        {l.level > 0 && (
                                            <>
                                                <SkillBar level={l.level} />
                                                <span style={{ color: ltText, fontSize: "calc(11px * var(--theme-font-scale, 1))" }}>{lvlLabels[l.level] || ""}</span>
                                            </>
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
            const items = itemIndices ? itemIndices.map(i => data.software?.[i]).filter(Boolean) : (data.software || []);
            if (!items.length) return null;
            return (
                <SectionWrapper sectionId="software" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Software">
                    <div style={styles.cw}>
                        <SectionHeader title="Software Proficiency" />
                        <div style={styles.grid2}>
                            {items.map((s, i) => {
                                const oi = itemIndices ? itemIndices[i] : i;
                                return (
                                    <div key={i} data-item-index={oi} style={{ marginBottom: "calc(4px * var(--theme-paragraph-margin, 1))" }}>
                                        <div style={styles.skillItem}>
                                            <span style={styles.bullet}>•</span>
                                            <span style={{ flex: 1 }}>
                                                <RichTextSpellCheck html={s.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('software', oi, v, 'name')} />
                                            </span>
                                            {s.rating > 0 && <SkillBar level={s.rating} />}
                                        </div>
                                        {s.description && (
                                            <div className="resume-rich-text" style={{ ...styles.rt, marginLeft: "16px" }}>
                                                <RichTextSpellCheck html={s.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('software', oi, v, 'description')} />
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

        interests: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(i => data.interests?.[i]).filter(Boolean) : (data.interests || []);
            if (!items.length) return null;
            return (
                <SectionWrapper sectionId="interests" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Interests">
                    <div style={styles.cw}>
                        <SectionHeader title="Interests" />
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 20px", fontSize: "calc(12px * var(--theme-font-scale, 1))" }}>
                            {items.map((item, i) => {
                                const oi = itemIndices ? itemIndices[i] : i;
                                return (
                                    <div key={i} data-item-index={oi} style={styles.skillItem}>
                                        <span style={styles.bullet}>•</span>
                                        <RichTextSpellCheck html={typeof item === 'object' ? item.name : item} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('interests', oi, v, 'name')} />
                                    </div>
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
                    <div style={styles.cw}>
                        <SectionHeader title="Honors & Awards" />
                        {items.map((a, i) => {
                            const oi = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={oi} style={styles.is}>
                                    <div style={styles.historyRow}>
                                        <div style={{ fontWeight: "700", fontSize: "calc(12.5px * var(--theme-font-scale, 1))" }}>
                                            <span style={styles.bullet}>• </span>
                                            <RichTextSpellCheck html={a.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('awards', oi, v, 'name')} />
                                        </div>
                                        <div style={{ color: medText, fontSize: "calc(12px * var(--theme-font-scale, 1))" }}>
                                            <RichTextSpellCheck html={a.issuer || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('awards', oi, v, 'issuer')} />
                                        </div>
                                        <div style={{ textAlign: "right", color: ltText, fontSize: "calc(11.5px * var(--theme-font-scale, 1))" }}>
                                            <RichTextSpellCheck html={a.date || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('awards', oi, v, 'date')} />
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
            const items = itemIndices ? itemIndices.map(i => data.volunteering?.[i]).filter(Boolean) : (data.volunteering || []);
            if (!items.length) return null;
            return (
                <SectionWrapper sectionId="volunteering" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Volunteering">
                    <div style={styles.cw}>
                        <SectionHeader title="Community & Volunteering" />
                        {items.map((v, i) => {
                            const oi = itemIndices ? itemIndices[i] : i;
                            const vStartDate = [v.startMonth, v.startYear].filter(Boolean).join("-");
                            const vEndDate = v.isCurrent ? "Present" : [v.endMonth, v.endYear].filter(Boolean).join("-");
                            const dates = vStartDate && vEndDate ? `${vStartDate} - ${vEndDate}` : (vStartDate || vEndDate || "");
                            return (
                                <div key={i} data-item-index={oi} style={styles.expRow}>
                                    <div style={styles.expDate}>{dates}</div>
                                    <div style={styles.expContent}>
                                        <div style={{ fontWeight: "700", fontSize: "calc(13px * var(--theme-font-scale, 1))", marginBottom: "1px" }}>
                                            <RichTextSpellCheck html={v.organization || v.company || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('volunteering', oi, val, 'organization')} />
                                        </div>
                                        <div style={{ ...styles.rt, fontStyle: "italic", marginBottom: "4px" }}>
                                            <RichTextSpellCheck html={v.cause || v.title || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('volunteering', oi, val, 'title')} />
                                        </div>
                                        {v.description && (
                                            <div className="resume-rich-text" style={styles.rt}>
                                                <SplittableRichText html={v.description} range={subItemRanges?.[oi]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('volunteering', oi, val, 'description')} />
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

        publications: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(i => data.publications?.[i]).filter(Boolean) : (data.publications || []);
            if (!items.length) return null;
            return (
                <SectionWrapper sectionId="publications" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Publications">
                    <div style={styles.cw}>
                        <SectionHeader title="Publications" />
                        {items.map((p, i) => {
                            const oi = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={oi} style={styles.is}>
                                    <div style={styles.historyRow}>
                                        <div style={{ fontWeight: "700", fontSize: "calc(12.5px * var(--theme-font-scale, 1))" }}>
                                            <span style={styles.bullet}>• </span>
                                            <RichTextSpellCheck html={p.title || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('publications', oi, v, 'title')} />
                                        </div>
                                        <div style={{ color: medText, fontSize: "calc(12px * var(--theme-font-scale, 1))" }}>
                                            <RichTextSpellCheck html={p.publisher || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('publications', oi, v, 'publisher')} />
                                        </div>
                                        <div style={{ textAlign: "right", color: ltText, fontSize: "calc(11.5px * var(--theme-font-scale, 1))" }}>
                                            <RichTextSpellCheck html={p.date || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('publications', oi, v, 'date')} />
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
            const items = itemIndices ? itemIndices.map(i => data.references?.[i]).filter(Boolean) : (data.references || []);
            if (!items.length) return null;
            return (
                <SectionWrapper sectionId="references" onSectionClick={onSectionClick} isInteractive={isInteractive} label="References">
                    <div style={styles.cw}>
                        <SectionHeader title="References" />
                        <div style={styles.grid2}>
                            {items.map((r, i) => {
                                const oi = itemIndices ? itemIndices[i] : i;
                                return (
                                    <div key={i} data-item-index={oi} style={{ padding: "8px 12px", background: "#f7f7f7", borderRadius: "4px", border: `1px solid ${borderColor}`, fontSize: "calc(12px * var(--theme-font-scale, 1))", marginBottom: "calc(6px * var(--theme-paragraph-margin, 1))" }}>
                                        <div style={{ fontWeight: "700", color: darkText }}>
                                            <RichTextSpellCheck html={r.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('references', oi, v, 'name')} />
                                        </div>
                                        <div style={{ color: medText, fontStyle: "italic" }}>
                                            <RichTextSpellCheck html={r.title || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('references', oi, v, 'title')} />
                                        </div>
                                        <div style={{ color: ltText }}>
                                            <RichTextSpellCheck html={r.contact || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('references', oi, v, 'contact')} />
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
            const items = itemIndices ? itemIndices.map(i => data.affiliations?.[i]).filter(Boolean) : (data.affiliations || []);
            if (!items.length) return null;
            return (
                <SectionWrapper sectionId="affiliations" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Affiliations">
                    <div style={styles.cw}>
                        <SectionHeader title="Professional Affiliations" />
                        {items.map((a, i) => {
                            const oi = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={oi} style={{ ...styles.is, display: "flex", alignItems: "flex-start", gap: "8px" }}>
                                    <span style={styles.bullet}>•</span>
                                    <div>
                                        <div style={{ fontWeight: "700", color: darkText, fontSize: "calc(12.5px * var(--theme-font-scale, 1))" }}>
                                            <RichTextSpellCheck html={a.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('affiliations', oi, v, 'name')} />
                                        </div>
                                        {a.description && (
                                            <div className="resume-rich-text" style={styles.rt}>
                                                <RichTextSpellCheck html={a.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('affiliations', oi, v, 'description')} />
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
                { label: 'Other', value: p.otherPersonal || p.otherInformation }
            ].filter(d => d.value);
            if (!details.length) return null;
            return (
                <SectionWrapper sectionId="personalDetails" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Personal Details">
                    <div style={styles.cw}>
                        <SectionHeader title="Personal Information" />
                        <div style={styles.grid2}>
                            {details.map((d, i) => (
                                <div key={i} style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", marginBottom: "calc(4px * var(--theme-paragraph-margin, 1))" }}>
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
                    <div style={styles.cw}>
                        <SectionHeader title="Additional Information" />
                        <div className="resume-rich-text" style={styles.rt}>
                            <SplittableRichText html={data.additionalInfo} range={subItemRanges?.additionalInfo} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('additionalInfo', 'additionalInfo', v)} />
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        websites: ({ itemIndices }) => {
            // Build items with their original indices tracked
            const allWebsites = data.websites || [];
            const items = itemIndices
                ? itemIndices.map(i => ({ item: allWebsites[i], originalIdx: i })).filter(e => e.item)
                : allWebsites.map((item, i) => ({ item, originalIdx: i }));
            if (!items.length) return null;
            const portfolioItems = items.filter(({ item: w }) => !w.addToHeader);
            if (!portfolioItems.length) return null;
            return (
                <SectionWrapper sectionId="portfolios" navigationId="websites" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Portfolios">
                    <div style={styles.cw}>
                        <SectionHeader title="Websites & Portfolios" />
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 22px", fontSize: "calc(12px * var(--theme-font-scale, 1))" }}>
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
            );
        },

        custom: ({ subItemRanges }) => {
            if (!data.customSection?.isVisible || !data.customSection?.content) return null;
            const title = data.customSection.title || "Additional Section";
            return (
                <SectionWrapper sectionId="custom" onSectionClick={onSectionClick} isInteractive={isInteractive} label={title}>
                    <div style={styles.cw}>
                        <SectionHeader title={title} />
                        <div className="resume-rich-text" style={styles.rt}>
                            <SplittableRichText html={data.customSection.content} range={subItemRanges?.custom} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(v) => onSpellCheckReplace('customSection', 'content', v)} />
                        </div>
                    </div>
                </SectionWrapper>
            );
        }
    };

    // --- RENDER ZONE ---
    const renderZone = (id, items) => (
        <DroppableZone id={id} style={{ display: 'flex', flexDirection: 'column', gap: 'calc(18px * var(--theme-section-margin, 1))', flex: 1 }}>
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

    const Measurer = () => (
        <div className="resume-measurer" style={{ position: "absolute", top: -10000, left: -10000, width: "210mm", visibility: "hidden" }}>
            <div className="page-height-marker" style={{ height: "297mm", width: "1px", position: "absolute", left: 0, top: 0 }} />
            <div style={{ ...styles.page, height: "auto", overflow: "visible" }}>
                <Header />
                <div data-column-id="main" style={{ ...styles.bodyPad, display: 'flex', flexDirection: 'column', gap: 'calc(18px * var(--theme-section-margin, 1))' }}>
                    {activeSections.map(sid => (
                        <div key={sid}>
                            <SectionRenderer sectionId={sid} data={data} customRenderers={customRenderers} zoneId="main" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div ref={containerRef} className="clear-vista-root">
            <Measurer />
            <DndContext {...dndContextProps}>
                <SortableContext items={activeSections} strategy={verticalListSortingStrategy}>
                    {showPageBreaks && pages ? (
                        pages.map((page, i) => (
                            <div key={i} style={styles.page}>
                                {i === 0 && <Header />}
                                <div style={styles.bodyPad}>{renderZone(`main-p${i}`, page.main)}</div>
                                <div style={{ position: "absolute", bottom: "12px", right: "32px", fontSize: "9px", color: ltText, fontFamily: "sans-serif" }}>
                                    Page {i + 1}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div style={{ ...styles.page, height: "auto", minHeight: "100%" }}>
                            <Header />
                            <div style={styles.bodyPad}>{renderZone('main', activeSections)}</div>
                        </div>
                    )}
                </SortableContext>
                <StableResumeDragOverlay activeId={activeId} scale={scale} renderSection={(id) => (
                    <div className="dragging-preview" style={{ background: "white", padding: "10px", border: "1px solid #e0e0e0" }}>
                        <SectionRenderer sectionId={id} data={data} customRenderers={customRenderers} />
                    </div>
                )} />
            </DndContext>
        </div>
    );
};

export default ClearVista;
