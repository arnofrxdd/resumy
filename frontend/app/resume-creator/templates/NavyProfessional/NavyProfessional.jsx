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
 * NavyProfessional Template
 * A premium executive resume inspired by the Aniruddha Basak design:
 * - Large bold navy name with right-aligned contact icons
 * - ALL-CAPS section headers with thick navy bottom border
 * - Diamond ❖ bullet points throughout
 * - 3-column Core Competencies grid
 * - Side-by-side Domain Exposure + Notable Accomplishments
 * - Clean, professional work experience entries
 */
const NavyProfessional = ({
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

    const templateId = 'navy-professional';
    const initialLayout = getSavedLayout(data, templateId, {
        main: [
            'summary', 'skills', 'strengths', 'additionalSkills',
            'experience', 'education', 'keyAchievements', 'accomplishments',
            'projects', 'certifications', 'languages', 'software',
            'interests', 'awards', 'volunteering', 'publications',
            'references', 'affiliations', 'personalDetails', 'additionalInfo', 'custom'
        ]
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

    // --- COLORS ---
    const navy = "var(--theme-color, #1a3a5c)";
    const darkText = "#1a1a1a";
    const mediumText = "#333333";
    const lightText = "#555555";
    const diamond = "❖";

    const styles = {
        page: {
            width: "210mm",
            height: "297mm",
            background: "white",
            padding: "var(--theme-page-margin, 40px)",
            boxSizing: "border-box",
            position: "relative",
            margin: "0 auto 30px auto",
            color: darkText,
            fontFamily: "var(--theme-font, 'Calibri', 'Arial', sans-serif)",
            letterSpacing: "var(--theme-letter-spacing, 0px)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
        },
        // --- HEADER ---
        headerWrap: {
            background: navy,
            color: "white",
            padding: "24px 30px",
            marginBottom: "calc(20px * var(--theme-section-margin, 1))",
        },
        headerTop: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center", // Vertically center content
            gap: "20px",
        },
        photo: {
            width: "80px",
            height: "80px",
            borderRadius: "4px",
            objectFit: "cover",
            border: "2px solid rgba(255,255,255,0.2)",
            flexShrink: 0,
        },
        nameBlock: {
            flex: 1,
            paddingRight: "20px",
        },
        name: {
            fontSize: "calc(32px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: "white",
            lineHeight: "1.1",
            letterSpacing: "1px",
            textTransform: "uppercase",
            marginBottom: "6px",
        },
        profession: {
            fontSize: "calc(14.5px * var(--theme-font-scale, 1))",
            fontStyle: "italic", // Keep italic as per previous, or remove if strictly following image? Image looks normal weight but maybe title case.
            color: "white",
            fontWeight: "500",
            letterSpacing: "0.5px",
            opacity: 0.95,
        },
        contactBlock: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end", // Align right
            justifyContent: "center",
            gap: "5px",
            minWidth: "220px",
        },
        contactItem: {
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            color: "white",
            fontWeight: "500",
        },
        contactIcon: {
            width: "18px",
            height: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            // Inverted colors: White box, Navy icon (or transparent box, white icon?)
            // The image usually has white icons on dark bg. Let's assume white icons with no box, or white box.
            // "check 1st pic i want 1st pick like that" -> Image shows white icons next to text.
            // Let's go with simple white icons.
            color: "white",
            fontSize: "14px",
            flexShrink: 0,
        },
        // --- SECTION HEADING ---
        sectionHeading: {
            fontSize: "calc(13px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: navy,
            textTransform: "uppercase",
            letterSpacing: "1.5px",
            paddingBottom: "4px",
            borderBottom: `2.5px solid ${navy}`,
            marginBottom: "calc(10px * var(--theme-paragraph-margin, 1))",
            lineHeight: "1.3",
        },
        contentWrapper: {
        },
        // --- RICH TEXT ---
        richText: {
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            lineHeight: "var(--theme-line-height, 1.5)",
            color: mediumText,
            textAlign: "justify",
        },
        // --- BULLET ITEM ---
        bulletRow: {
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
            marginBottom: "calc(5px * var(--theme-paragraph-margin, 1))",
        },
        bulletIcon: {
            color: navy,
            fontSize: "calc(10px * var(--theme-font-scale, 1))",
            marginTop: "2px",
            flexShrink: 0,
            lineHeight: "1.5",
        },
        bulletText: {
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            lineHeight: "var(--theme-line-height, 1.5)",
            color: mediumText,
            flex: 1,
        },
        // --- EXPERIENCE ---
        expHeader: {
            display: "flex",
            flexWrap: "wrap",
            alignItems: "baseline",
            gap: "0px",
            marginBottom: "2px",
            fontSize: "calc(12.5px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: darkText,
        },
        expDates: {
            color: darkText,
            fontWeight: "700",
        },
        expSep: {
            margin: "0 5px",
            color: lightText,
            fontWeight: "400",
        },
        expTitle: {
            color: darkText,
        },
        expCompany: {
            color: darkText,
        },
        expLocation: {
            color: lightText,
            fontWeight: "400",
            fontStyle: "italic",
        },
        expDesc: {
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            lineHeight: "var(--theme-line-height, 1.5)",
            color: mediumText,
            textAlign: "justify",
            marginTop: "4px",
        },
        itemSpacing: {
            // marginBottom: "calc(12px * var(--theme-paragraph-margin, 1))",
        },
        // --- EDUCATION ---
        eduRow: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            flexWrap: "wrap",
            gap: "4px",
            marginBottom: "calc(8px * var(--theme-paragraph-margin, 1))",
        },
        eduDegree: {
            fontWeight: "700",
            fontSize: "calc(12.5px * var(--theme-font-scale, 1))",
            color: darkText,
        },
        eduSchool: {
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            color: mediumText,
            fontStyle: "italic",
        },
        eduDate: {
            fontSize: "calc(11.5px * var(--theme-font-scale, 1))",
            color: lightText,
        },
        // --- SIDE-BY-SIDE LAYOUT ---
        sideBySide: {
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0 24px",
        },
        // --- ACCOMPLISHMENTS TIMELINE ---
        accomplishmentItem: {
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
            marginBottom: "calc(5px * var(--theme-paragraph-margin, 1))",
        },
        accomplishmentDot: {
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            border: `2px solid ${navy}`,
            background: "white",
            flexShrink: 0,
            marginTop: "3px",
        },
        accomplishmentText: {
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            lineHeight: "var(--theme-line-height, 1.5)",
            color: mediumText,
        },
        // --- 3-COLUMN GRID ---
        threeColGrid: {
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "4px 16px",
        },
    };

    // --- HEADER ---
    const Header = () => {
        const phone = personal?.phone;
        const email = personal?.email;
        const linkedin = personal?.linkedin;
        const location = [personal?.city, personal?.state, personal?.country, personal?.zipCode].filter(Boolean).join(", ");

        return (
            <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Header">
                <div style={styles.headerWrap}>
                    <div style={styles.headerTop}>
                        {personal?.photo && (
                            <img src={personal.photo} alt="Profile" style={styles.photo} />
                        )}
                        {/* LEFT: Name + Title */}
                        <div style={styles.nameBlock}>
                            <h1 style={styles.name}>
                                <SpellCheckText text={personal?.name || "YOUR NAME"} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'name', val)} />
                            </h1>
                            {personal?.profession && (
                                <div style={styles.profession}>
                                    <SpellCheckText text={personal.profession} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'profession', val)} />
                                </div>
                            )}
                        </div>

                        {/* RIGHT: Contact Info */}
                        <div style={styles.contactBlock}>
                            {phone && (
                                <div style={styles.contactItem}>
                                    <span style={styles.contactIcon}>📞</span>
                                    <ResumeLink href={phone}><span>{phone}</span></ResumeLink>
                                </div>
                            )}
                            {email && (
                                <div style={styles.contactItem}>
                                    <span style={styles.contactIcon}>✉</span>
                                    <ResumeLink href={email}><span>{email}</span></ResumeLink>
                                </div>
                            )}
                            {linkedin && (
                                <div style={styles.contactItem}>
                                    <span style={{ ...styles.contactIcon, background: "#0077b5", borderRadius: "3px", fontWeight: "700", fontSize: "8px" }}>in</span>
                                    <ResumeLink href={linkedin}><span>{linkedin}</span></ResumeLink>
                                </div>
                            )}
                            {personal?.github && (
                                <div style={styles.contactItem}>
                                    <span style={styles.contactIcon}>Github</span>
                                    <ResumeLink href={personal.github}><span>{personal.github}</span></ResumeLink>
                                </div>
                            )}
                            {location && (
                                <div style={styles.contactItem}>
                                    <span style={styles.contactIcon}>📍</span>
                                    <span>{location}</span>
                                </div>
                            )}
                            {data.websites?.filter(site => site.addToHeader && site.url).map((site, i) => (
                                <div key={i} style={styles.contactItem}>
                                    <span style={styles.contactIcon}>🌐</span>
                                    <ResumeLink href={site.url}><span>{site.label || site.url}</span></ResumeLink>
                                </div>
                            ))}
                        </div>
                    </div>
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

    // --- DIAMOND BULLET ITEM ---
    const DiamondBullet = ({ children, style = {} }) => (
        <div style={{ ...styles.bulletRow, ...style }}>
            <span style={styles.bulletIcon}>{diamond}</span>
            <div style={styles.bulletText}>{children}</div>
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
                    <div style={styles.contentWrapper}>
                        <SectionHeader title="Contact Information" />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px" }}>
                            {p.phone && (
                                <DiamondBullet>
                                    <span style={{ fontWeight: "700", marginRight: "4px" }}>Phone:</span>
                                    <ResumeLink href={p.phone}>
                                        <SpellCheckText text={p.phone} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'phone', val)} />
                                    </ResumeLink>
                                </DiamondBullet>
                            )}
                            {p.email && (
                                <DiamondBullet>
                                    <span style={{ fontWeight: "700", marginRight: "4px" }}>Email:</span>
                                    <ResumeLink href={p.email}>
                                        <SpellCheckText text={p.email} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'email', val)} />
                                    </ResumeLink>
                                </DiamondBullet>
                            )}
                            {(p.city || p.state) && (
                                <DiamondBullet>
                                    <span style={{ fontWeight: "700", marginRight: "4px" }}>Location:</span>
                                    <SpellCheckText text={[p.city, p.state, p.country].filter(Boolean).join(", ")} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'city', val)} />
                                </DiamondBullet>
                            )}
                            {links.filter(l => l.value).map((link, i) => (
                                <DiamondBullet key={i}>
                                    <span style={{ fontWeight: "700", marginRight: "4px" }}>{link.label}:</span>
                                    <ResumeLink href={link.value}>
                                        <SpellCheckText text={link.value} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', link.field || 'website', val)} />
                                    </ResumeLink>
                                </DiamondBullet>
                            ))}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        summary: ({ subItemRanges }) => (
            <SectionWrapper sectionId="summary" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Profile Summary">
                <div style={styles.contentWrapper}>
                    <SectionHeader title="Profile Summary" />
                    <div className="resume-rich-text" style={styles.richText}>
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
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Core Competencies">
                    <div style={styles.contentWrapper}>
                        <SectionHeader title="Core Competencies" />
                        <div style={styles.threeColGrid}>
                            {items.map((skill, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                const name = typeof skill === 'object' ? skill.name : skill;
                                return (
                                    <DiamondBullet key={originalIdx}>
                                        <div data-item-index={originalIdx}>
                                            <RichTextSpellCheck
                                                html={name || ""}
                                                isActive={isSpellCheckActive}
                                                onIgnore={onSpellCheckIgnore}
                                                onReplace={(val) => onSpellCheckReplace('skills', originalIdx, val, 'name')}
                                            />
                                        </div>
                                    </DiamondBullet>
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        strengths: ({ itemIndices }) => {
            const items = itemIndices ? itemIndices.map(idx => data.strengths?.[idx]).filter(Boolean) : (data.strengths || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="strengths" navigationId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Key Strengths">
                    <div style={styles.contentWrapper}>
                        <SectionHeader title="Key Strengths" />
                        <div style={styles.threeColGrid}>
                            {items.map((s, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <DiamondBullet key={originalIdx}>
                                        <div data-item-index={originalIdx}>
                                            <RichTextSpellCheck
                                                html={typeof s === 'object' ? s.name : s}
                                                isActive={isSpellCheckActive}
                                                onIgnore={onSpellCheckIgnore}
                                                onReplace={(val) => onSpellCheckReplace('strengths', originalIdx, val, 'name')}
                                            />
                                        </div>
                                    </DiamondBullet>
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
                <SectionWrapper sectionId="additionalSkills" navigationId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Domain Exposure">
                    <div style={styles.contentWrapper}>
                        <SectionHeader title="Domain Exposure" />
                        <div>
                            {items.map((s, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <DiamondBullet key={originalIdx}>
                                        <div data-item-index={originalIdx}>
                                            <RichTextSpellCheck
                                                html={typeof s === 'object' ? s.name : s}
                                                isActive={isSpellCheckActive}
                                                onIgnore={onSpellCheckIgnore}
                                                onReplace={(val) => onSpellCheckReplace('additionalSkills', originalIdx, val, 'name')}
                                            />
                                        </div>
                                    </DiamondBullet>
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
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            return (
                                <DiamondBullet key={i}>
                                    <div data-item-index={originalIdx}>
                                        {item.name && (
                                            <span style={{ fontWeight: "700", color: darkText }}>
                                                <RichTextSpellCheck html={item.name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('keyAchievements', originalIdx, val, 'name')} />
                                            </span>
                                        )}
                                        {item.description && (
                                            <span className="resume-rich-text">
                                                {item.name && " – "}
                                                <RichTextSpellCheck html={item.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('keyAchievements', originalIdx, val, 'description')} />
                                            </span>
                                        )}
                                    </div>
                                </DiamondBullet>
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
                <SectionWrapper sectionId="accomplishments" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Notable Accomplishments">
                    <div style={styles.contentWrapper}>
                        <SectionHeader title="Notable Accomplishments" />
                        {items.map((item, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.accomplishmentItem}>
                                    <div style={styles.accomplishmentDot} />
                                    <div style={styles.accomplishmentText}>
                                        {item.name && (
                                            <span style={{ fontWeight: "700", color: darkText }}>
                                                <RichTextSpellCheck html={item.name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('accomplishments', originalIdx, val, 'name')} />
                                            </span>
                                        )}
                                        {item.description && (
                                            <span className="resume-rich-text" style={{ color: lightText }}>
                                                {item.name && " "}
                                                <RichTextSpellCheck html={item.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('accomplishments', originalIdx, val, 'description')} />
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },

        experience: ({ itemIndices, subItemRanges }) => {
            const items = itemIndices ? itemIndices.map(idx => data.experience?.[idx]).filter(Boolean) : (data.experience || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="experience" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Work Experience">
                    <div style={styles.contentWrapper}>
                        <SectionHeader title="Work Experience" />
                        {items.map((exp, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const startDate = exp.startYear || exp.startDate || "";
                            const endDate = exp.isCurrent ? "Present" : (exp.endYear || exp.endDate || "");
                            const dates = exp.year || exp.date || (startDate ? `${startDate} – ${endDate}` : "");
                            const locationStr = [exp.location, exp.isRemote ? "(Remote)" : null].filter(Boolean).join(" ");
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.itemSpacing}>
                                    {/* Header line: Dates | Title | Company | Location */}
                                    <div style={styles.expHeader}>
                                        {dates && (
                                            <>
                                                <span style={styles.expDates}>
                                                    <RichTextSpellCheck html={dates} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'year')} />
                                                </span>
                                                <span style={styles.expSep}> | </span>
                                            </>
                                        )}
                                        {(exp.title || exp.role) && (
                                            <>
                                                <span style={styles.expTitle}>
                                                    <RichTextSpellCheck html={exp.title || exp.role || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'title')} />
                                                </span>
                                                {exp.company && <span style={styles.expSep}> | </span>}
                                            </>
                                        )}
                                        {exp.company && (
                                            <>
                                                <span style={styles.expCompany}>
                                                    <RichTextSpellCheck html={exp.company} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'company')} />
                                                </span>
                                                {locationStr && <span style={styles.expSep}> | </span>}
                                            </>
                                        )}
                                        {locationStr && (
                                            <span style={styles.expLocation}>{locationStr}</span>
                                        )}
                                    </div>
                                    {/* Description */}
                                    {exp.description && (
                                        <div className="resume-rich-text" style={styles.expDesc}>
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

        education: ({ itemIndices, subItemRanges }) => {
            const items = itemIndices ? itemIndices.map(idx => data.education?.[idx]).filter(Boolean) : (data.education || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="education" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Education">
                    <div style={styles.contentWrapper}>
                        <SectionHeader title="Education" />
                        {items.map((edu, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const dates = edu.year || edu.date || (edu.endYear ? `${edu.startYear ? edu.startYear + " – " : ""}${edu.endYear}` : "");
                            const degreeStr = [edu.degree, edu.field].filter(Boolean).join(" — ");
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.eduRow}>
                                    <div>
                                        {degreeStr && (
                                            <div style={styles.eduDegree}>
                                                <RichTextSpellCheck html={degreeStr} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'degree')} />
                                            </div>
                                        )}
                                        <div style={styles.eduSchool}>
                                            <RichTextSpellCheck html={[edu.institution || edu.school || "", edu.city].filter(Boolean).join(", ")} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'institution')} />
                                        </div>
                                    </div>
                                    {dates && <div style={styles.eduDate}>{dates}</div>}
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
                                <DiamondBullet key={i}>
                                    <div data-item-index={originalIdx}>
                                        <span style={{ fontWeight: "700" }}>
                                            <RichTextSpellCheck html={cert.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('certifications', originalIdx, val, 'name')} />
                                        </span>
                                        {cert.issuer && (
                                            <span style={{ color: lightText }}>
                                                {" – "}
                                                <RichTextSpellCheck html={cert.issuer} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('certifications', originalIdx, val, 'issuer')} />
                                            </span>
                                        )}
                                        {(cert.date || cert.year) && (
                                            <span style={{ color: lightText, fontStyle: "italic" }}>
                                                {" ("}
                                                <RichTextSpellCheck html={cert.date || cert.year || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('certifications', originalIdx, val, 'date')} />
                                                {")"}
                                            </span>
                                        )}
                                    </div>
                                </DiamondBullet>
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
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 24px" }}>
                            {items.map((lang, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <div key={i} data-item-index={originalIdx} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "calc(12px * var(--theme-font-scale, 1))" }}>
                                        <span style={styles.bulletIcon}>{diamond}</span>
                                        <span style={{ fontWeight: "700" }}>
                                            <RichTextSpellCheck html={lang.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('languages', originalIdx, val, 'name')} />
                                        </span>
                                        {lang.level && (
                                            <span style={{ color: lightText }}>
                                                {" – "}
                                                <RichTextSpellCheck html={lang.level} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('languages', originalIdx, val, 'level')} />
                                            </span>
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
                    <div style={styles.contentWrapper}>
                        <SectionHeader title="Software Proficiency" />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4px 16px" }}>
                            {items.map((item, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <DiamondBullet key={i}>
                                        <div data-item-index={originalIdx}>
                                            <RichTextSpellCheck html={item.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('software', originalIdx, val, 'name')} />
                                        </div>
                                    </DiamondBullet>
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
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px" }}>
                            {items.map((item, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <DiamondBullet key={i} style={{ marginBottom: "2px" }}>
                                        <div data-item-index={originalIdx}>
                                            <RichTextSpellCheck html={typeof item === 'object' ? item.name : item} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('interests', originalIdx, val, 'name')} />
                                        </div>
                                    </DiamondBullet>
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
                                <DiamondBullet key={i}>
                                    <div data-item-index={originalIdx}>
                                        <span style={{ fontWeight: "700" }}>
                                            <RichTextSpellCheck html={award.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('awards', originalIdx, val, 'name')} />
                                        </span>
                                        {award.date && (
                                            <span style={{ color: lightText }}>
                                                {" – "}
                                                <RichTextSpellCheck html={award.date} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('awards', originalIdx, val, 'date')} />
                                            </span>
                                        )}
                                    </div>
                                </DiamondBullet>
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
                            const dates = vol.year || vol.date || (vol.startYear ? `${vol.startYear} – ${vol.isCurrent ? "Present" : (vol.endYear || "")}` : "");
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.itemSpacing}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap" }}>
                                        <div>
                                            <span style={{ fontWeight: "700", fontSize: "calc(12.5px * var(--theme-font-scale, 1))", marginRight: "8px" }}>
                                                <RichTextSpellCheck html={vol.organization || vol.company || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('volunteering', originalIdx, val, 'organization')} />
                                            </span>
                                            <span style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", color: mediumText }}>
                                                <RichTextSpellCheck html={vol.cause || vol.title || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('volunteering', originalIdx, val, 'title')} />
                                            </span>
                                        </div>
                                        {dates && <div style={{ fontSize: "calc(11.5px * var(--theme-font-scale, 1))", color: lightText, fontStyle: "italic" }}>{dates}</div>}
                                    </div>
                                    {vol.description && (
                                        <div className="resume-rich-text" style={{ ...styles.richText, marginTop: "4px" }}>
                                            <SplittableRichText html={vol.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('volunteering', originalIdx, val, 'description')} />
                                        </div>
                                    )}
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
                                <DiamondBullet key={i}>
                                    <div data-item-index={originalIdx}>
                                        <span style={{ fontWeight: "700" }}>
                                            <RichTextSpellCheck html={pub.title || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('publications', originalIdx, val, 'title')} />
                                        </span>
                                        {pub.publisher && (
                                            <span style={{ color: lightText }}>
                                                {" – "}
                                                <RichTextSpellCheck html={pub.publisher} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('publications', originalIdx, val, 'publisher')} />
                                            </span>
                                        )}
                                        {pub.date && (
                                            <span style={{ color: lightText, fontStyle: "italic" }}>
                                                {" ("}
                                                <RichTextSpellCheck html={pub.date} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('publications', originalIdx, val, 'date')} />
                                                {")"}
                                            </span>
                                        )}
                                    </div>
                                </DiamondBullet>
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
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                            {items.map((ref, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                return (
                                    <div key={i} data-item-index={originalIdx} style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))" }}>
                                        <div style={{ fontWeight: "700", color: darkText }}>
                                            <RichTextSpellCheck html={ref.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('references', originalIdx, val, 'name')} />
                                        </div>
                                        <div style={{ color: mediumText, fontStyle: "italic" }}>
                                            <RichTextSpellCheck html={ref.title || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('references', originalIdx, val, 'title')} />
                                        </div>
                                        <div style={{ color: lightText }}>
                                            <RichTextSpellCheck html={ref.contact || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('references', originalIdx, val, 'contact')} />
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
                    <div style={styles.contentWrapper}>
                        <SectionHeader title="Professional Affiliations" />
                        {items.map((aff, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            return (
                                <DiamondBullet key={i}>
                                    <div data-item-index={originalIdx}>
                                        <span style={{ fontWeight: "700" }}>
                                            <RichTextSpellCheck html={aff.name || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('affiliations', originalIdx, val, 'name')} />
                                        </span>
                                        {aff.description && (
                                            <span className="resume-rich-text" style={{ color: mediumText }}>
                                                {" – "}
                                                <RichTextSpellCheck html={aff.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('affiliations', originalIdx, val, 'description')} />
                                            </span>
                                        )}
                                    </div>
                                </DiamondBullet>
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
                                <div key={i} style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))" }}>
                                    <span style={{ fontWeight: "700", color: darkText, marginRight: "6px" }}>
                                        {d.label}:
                                    </span>
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
                        <div className="resume-rich-text" style={styles.richText}>
                            <SplittableRichText html={data.additionalInfo} range={subItemRanges?.additionalInfo} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('additionalInfo', 'additionalInfo', val)} />
                        </div>
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
                            const dates = proj.year || (proj.startYear && `${proj.startYear} – ${proj.isCurrent ? 'Present' : (proj.endYear || '')}`);
                            return (
                                <div key={i} data-item-index={originalIdx} style={styles.itemSpacing}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "8px" }}>
                                        <div style={{ fontWeight: "700", fontSize: "calc(12.5px * var(--theme-font-scale, 1))", color: darkText }}>
                                            <RichTextSpellCheck html={proj.title || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('projects', originalIdx, val, 'title')} />
                                            {proj.link && (
                                                <ResumeLink href={proj.link} style={{ fontWeight: "400", fontSize: "0.9em", marginLeft: "10px", color: navy }}>
                                                    🔗 {proj.link}
                                                </ResumeLink>
                                            )}
                                        </div>
                                        {dates && <div style={{ fontSize: "calc(11.5px * var(--theme-font-scale, 1))", color: lightText }}>{dates}</div>}
                                    </div>
                                    {proj.description && (
                                        <div className="resume-rich-text" style={{ ...styles.richText, marginTop: "4px" }}>
                                            <SplittableRichText html={proj.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('projects', originalIdx, val, 'description')} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
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
                        <div className="resume-rich-text" style={styles.richText}>
                            <SplittableRichText html={data.customSection.content} range={subItemRanges?.custom} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('customSection', 'content', val)} />
                        </div>
                    </div>
                </SectionWrapper>
            );
        },

        websites: ({ itemIndices }) => {
            const items = data.websites || [];
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="websites" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Websites & Portfolios">
                    <div style={styles.contentWrapper}>
                        <SectionHeader title="Websites & Portfolios" />
                        {items.map((site, i) => (
                            <DiamondBullet key={i}>
                                <ResumeLink href={site.url}>
                                    <span style={{ fontWeight: "700" }}>{site.label || site.url}</span>
                                    {site.label && site.url && <span style={{ color: lightText }}> – {site.url}</span>}
                                </ResumeLink>
                            </DiamondBullet>
                        ))}
                    </div>
                </SectionWrapper>
            );
        },
    };

    // --- RENDER ZONE ---
    const renderZone = (id, items, columnStyle = {}) => (
        <DroppableZone id={id} style={{ ...columnStyle, flex: 1 }}>
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
        gap: "calc(20px * var(--theme-section-margin, 1))",
        minHeight: '100px'
    };

    const Measurer = () => (
        <div className="resume-measurer" style={{ position: "absolute", top: -10000, left: -10000, width: "210mm", visibility: "hidden" }}>
            <div className="page-height-marker" style={{ height: "297mm", width: "1px", position: "absolute", left: 0, top: 0 }} />
            <div style={{ ...styles.page, height: "auto", overflow: "visible" }}>
                <Header />
                <div data-column-id="main" style={{ ...ZONE_STYLE }}>
                    {activeSections.map(sid => (
                        <SectionRenderer key={sid} sectionId={sid} data={data} customRenderers={customRenderers} zoneId="main" />
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div ref={containerRef} className="navy-professional-root">
            <Measurer />
            <DndContext {...dndContextProps}>
                <SortableContext items={activeSections} strategy={verticalListSortingStrategy}>
                    {showPageBreaks && pages ? (
                        pages.map((page, i) => (
                            <div key={i} style={{ ...styles.page, height: "297mm", minHeight: "unset", overflow: "hidden" }}>
                                {i === 0 && <Header />}
                                <div style={{ flex: 1 }}>{renderZone(`main-p${i}`, page.main, ZONE_STYLE)}</div>
                                <div style={{ position: "absolute", bottom: "15px", right: "40px", fontSize: "10px", opacity: 0.4, fontFamily: "sans-serif" }}>Page {i + 1}</div>
                            </div>
                        ))
                    ) : (
                        <div style={{ ...styles.page, height: "auto", minHeight: "297mm", overflow: "visible" }}>
                            <Header />
                            <div style={{ flex: 1 }}>{renderZone('main', activeSections, ZONE_STYLE)}</div>
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

export default NavyProfessional;
