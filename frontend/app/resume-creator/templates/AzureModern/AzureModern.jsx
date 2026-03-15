import React, { useRef } from "react";
import { DndContext } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SectionWrapper from "../../components/SectionWrapper";
import { useResumeDragAndDrop, DroppableZone, StableResumeDragOverlay } from "../../hooks/useResumeDragAndDrop";
import DraggableSection from "../../components/dnd/DraggableSection";
import SectionRenderer from "../common/SectionRenderer";
import { useSectionContext } from "../common/SectionContext";
import { useAutoPagination } from "../../hooks/useAutoPagination";
import { SpellCheckText, SplittableRichText, RichTextSpellCheck, LanguageItem, CertificationItem, SoftwareItem, ResumeLink } from "../common/BaseComponents";
import { Mail, Phone, MapPin, Globe, Linkedin, Github, User, Briefcase, GraduationCap, Award, Monitor, Layout, Heart, BookOpen, Trophy, Users, Star } from "lucide-react";
import { getCompleteLayout, getSavedLayout } from "../common/TemplateUtils";

/**
 * AzureModern Template
 * A high-fidelity reconstruction of the user-provided "Azure" style template.
 * Features a full-width colored header, a full-width top summary, 
 * and a 70/30 split below with a shaded sidebar.
 */
const AzureModern = ({
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

    // --- 1. DATA PREP ---
    if (!data) return null;
    const { personal } = data;
    const isInteractive = !!onSectionClick && !isSpellCheckActive;
    const canReorder = !!onReorder && !isSpellCheckActive;

    // --- 2. DYNAMIC LAYOUT ENGINE ---
    const templateId = 'azure-modern';
    const savedLayout = data.templateLayouts?.[templateId] || {};
    const initialLayout = {
        main: savedLayout.main || savedLayout.left || ['summary', 'experience', 'education', 'projects', 'certifications', 'volunteering', 'publications', 'custom'],
        sidebar: savedLayout.sidebar || savedLayout.right || ['personalDetails', 'contact', 'websites', 'skills', 'strengths', 'additionalSkills', 'languages', 'awards', 'references', 'affiliations', 'software', 'additionalInfo']
    };

    // Auto-complete the layout with any "orphaned" sections (e.g. Certifications, Languages)
    const completeLayout = getCompleteLayout(data, initialLayout, 'main');
    const activeMainSections = completeLayout.main || [];
    const activeSidebarSections = completeLayout.sidebar || [];

    // --- 3. DRAG & DROP HOOK ---
    const { dndContextProps, activeId } = useResumeDragAndDrop({
        data,
        onReorder,
        scale,
        containers: { main: activeMainSections, sidebar: activeSidebarSections }
    });

    // --- 4. PAGINATION HOOK ---
    const pages = useAutoPagination({
        columns: { main: activeMainSections, sidebar: activeSidebarSections },
        data,
        enabled: showPageBreaks,
        containerRef,
        scale
    });

    // --- 5. STYLES ---
    const styles = {
        page: {
            width: "210mm",
            height: "297mm",
            background: "white",
            boxSizing: "border-box",
            position: "relative",
            margin: "0 auto 30px auto",
            color: "#334155",
            fontFamily: "var(--theme-font, 'Inter', sans-serif)",
            overflow: "visible",
            display: "flex",
            flexDirection: "column",
        },
        header: {
            background: "var(--theme-color, #70b1e8)",
            padding: "var(--theme-page-margin, 40px) var(--theme-page-margin, 50px)",
            color: "white",
        },
        name: {
            fontSize: "calc(48px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            margin: "0",
            lineHeight: "1.1",
        },
        profession: {
            fontSize: "calc(20px * var(--theme-font-scale, 1))",
            fontWeight: "400",
            opacity: 0.9,
            marginTop: "8px",
        },
        summaryArea: {
            paddingBottom: "10px",
        },
        layoutBody: {
            display: "flex",
            flex: 1,
            minHeight: 0,
        },
        mainColumn: {
            width: "68%",
            padding: "20px var(--theme-page-margin, 30px) var(--theme-page-margin, 40px) var(--theme-page-margin, 50px)",
            display: "flex",
            flexDirection: "column",
            gap: "calc(25px * var(--theme-section-margin, 1))",
            flex: 1,
        },
        sidebarColumn: {
            width: "32%",
            background: "#f8fafc", // Light shaded sidebar
            padding: "20px var(--theme-page-margin, 50px) var(--theme-page-margin, 40px) var(--theme-page-margin, 30px)",
            display: "flex",
            flexDirection: "column",
            gap: "calc(25px * var(--theme-section-margin, 1))",
            minHeight: "100%",
        },
        sectionTitle: {
            fontSize: "calc(18px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: "var(--theme-color, #70b1e8)",
            borderBottom: "2px solid #e2e8f0",
            paddingBottom: "8px",
            marginBottom: "15px",
            textTransform: "capitalize",
        },
        itemRow: {
            display: "flex",
            marginBottom: "calc(20px * var(--theme-paragraph-margin, 1))",
        },
        dateCol: {
            width: "110px",
            fontSize: "calc(13px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: "#1e293b",
            paddingTop: "2px",
        },
        contentCol: {
            flex: 1,
        },
        sidebarTitle: {
            fontSize: "calc(18px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: "var(--theme-color, #70b1e8)",
            borderBottom: "2px solid #e2e8f0",
            paddingBottom: "8px",
            marginBottom: "15px",
        },
        contactLabel: {
            fontWeight: "700",
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            color: "var(--theme-color, #70b1e8)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "4px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
        },
        contactText: {
            fontSize: "calc(13px * var(--theme-font-scale, 1))",
            color: "#475569",
            marginBottom: "calc(12px * var(--theme-paragraph-margin, 1))",
            display: "block",
            paddingLeft: "22px",
            wordBreak: "break-all",
            overflowWrap: "break-word",
        },
        photo: {
            width: "100%",
            aspectRatio: "1/1",
            objectFit: "cover",
            marginBottom: "20px",
            borderRadius: "4px",
            border: "1px solid #e2e8f0",
        }
    };

    const Header = () => (
        <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Header">
            <div style={styles.header}>
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
            </div>
        </SectionWrapper>
    );

    const SectionTitle = ({ title, zoneId }) => {
        const { isContinued } = useSectionContext();
        const isSidebar = zoneId?.includes("sidebar");
        const displayTitle = isContinued ? `${title} (Cont.)` : title;
        return (
            <h3 style={isSidebar ? styles.sidebarTitle : styles.sectionTitle}>
                {displayTitle}
            </h3>
        );
    };

    const customRenderers = {
        summary: ({ isContinued, subItemRanges, zoneId }) => (
            <SectionWrapper sectionId="summary" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Summary">
                <div style={styles.summaryArea}>
                    <SectionTitle title="Professional Summary" zoneId={zoneId} />
                    <div className="resume-rich-text" style={{ fontSize: "calc(13px * var(--theme-font-scale, 1))", lineHeight: "var(--theme-line-height, 1.6)" }}>
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
        experience: ({ itemIndices, isContinued, subItemRanges, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.experience?.[idx]) : data.experience;
            if (!items || items.length === 0) return null;
            const isSidebar = zoneId?.toLowerCase().includes("sidebar");

            return (
                <SectionWrapper sectionId="experience" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Experience">
                    <div>
                        <SectionTitle title="Work History" zoneId={zoneId} />
                        {items.map((exp, i) => {
                            if (!exp) return null;
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const isContinuedItem = subItemRanges?.[originalIdx]?.start > 0;
                            const dateStr = exp.year || exp.date || (exp.startYear ? `${exp.startYear} - ${exp.isCurrent ? "Current" : exp.endYear}` : "");

                            return (
                                <div key={i} data-item-index={originalIdx} style={{
                                    ...styles.itemRow,
                                    flexDirection: isSidebar ? "column" : "row",
                                    gap: isSidebar ? "4px" : "0"
                                }}>
                                    {!isContinuedItem && (
                                        <div style={{
                                            ...styles.dateCol,
                                            width: isSidebar ? "100%" : styles.dateCol.width,
                                            marginBottom: isSidebar ? "4px" : "0",
                                            fontSize: isSidebar ? "calc(12px * var(--theme-font-scale, 1))" : styles.dateCol.fontSize,
                                        }}>
                                            <RichTextSpellCheck html={dateStr} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'date')} />
                                        </div>
                                    )}
                                    <div style={styles.contentCol}>
                                        {!isContinuedItem && (
                                            <>
                                                <div style={{ fontWeight: "700", fontSize: isSidebar ? "calc(14.5px * var(--theme-font-scale, 1))" : "calc(16px * var(--theme-font-scale, 1))", color: "#1e293b" }}>
                                                    <RichTextSpellCheck html={exp.title || exp.role || ""} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'title')} />
                                                </div>
                                                <div style={{ fontWeight: "400", fontSize: isSidebar ? "calc(12.5px * var(--theme-font-scale, 1))" : "calc(13.5px * var(--theme-font-scale, 1))", fontStyle: "italic", marginBottom: "8px", color: "var(--theme-color, #70b1e8)" }}>
                                                    <RichTextSpellCheck html={`${exp.company || ""}${exp.location ? `, ${exp.location}` : ""}${exp.isRemote ? " • Remote" : ""}`} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'company')} />
                                                </div>
                                            </>
                                        )}
                                        <div className="resume-rich-text" style={{ fontSize: "calc(13px * var(--theme-font-scale, 1))", lineHeight: "var(--theme-line-height, 1.6)" }}>
                                            <SplittableRichText
                                                html={exp.description}
                                                range={subItemRanges?.[originalIdx]}
                                                isActive={isSpellCheckActive}
                                                onIgnore={onSpellCheckIgnore}
                                                onReplace={(val) => onSpellCheckReplace('experience', originalIdx, val, 'description')}
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },
        education: ({ itemIndices, isContinued, subItemRanges, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.education?.[idx]) : data.education;
            if (!items || items.length === 0) return null;
            const isSidebar = zoneId?.toLowerCase().includes("sidebar");

            return (
                <SectionWrapper sectionId="education" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Education">
                    <div>
                        <SectionTitle title="Education" zoneId={zoneId} />
                        {items.map((edu, i) => {
                            if (!edu) return null;
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const isContinuedItem = subItemRanges?.[originalIdx]?.start > 0;

                            return (
                                <div key={i} data-item-index={originalIdx} style={{
                                    ...styles.itemRow,
                                    flexDirection: isSidebar ? "column" : "row",
                                    gap: isSidebar ? "4px" : "0"
                                }}>
                                    {!isContinuedItem && (
                                        <div style={{
                                            ...styles.dateCol,
                                            width: isSidebar ? "100%" : styles.dateCol.width,
                                            marginBottom: isSidebar ? "4px" : "0",
                                            fontSize: isSidebar ? "calc(12px * var(--theme-font-scale, 1))" : styles.dateCol.fontSize,
                                        }}>
                                            <RichTextSpellCheck html={edu.year || edu.date || (edu.endYear || "")} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'year')} />
                                        </div>
                                    )}
                                    <div style={styles.contentCol}>
                                        {!isContinuedItem && (
                                            <>
                                                <div style={{ fontWeight: "700", fontSize: isSidebar ? "calc(14.5px * var(--theme-font-scale, 1))" : "calc(16px * var(--theme-font-scale, 1))", color: "#1e293b" }}>
                                                    <RichTextSpellCheck html={edu.degree} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'degree')} />
                                                </div>
                                                <div style={{ fontSize: isSidebar ? "calc(12.5px * var(--theme-font-scale, 1))" : "calc(13.5px * var(--theme-font-scale, 1))", color: "var(--theme-color, #70b1e8)", fontStyle: "italic", marginBottom: edu.description ? "4px" : "0" }}>
                                                    <RichTextSpellCheck html={`${edu.institution || edu.school}${edu.location ? `, ${edu.location}` : ""}`} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'institution')} />
                                                </div>
                                                {edu.grade && <div style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", color: "#64748b", marginTop: "2px", marginBottom: edu.description ? "6px" : "0" }}>GPA: {edu.grade}</div>}
                                            </>
                                        )}
                                        {edu.description && (
                                            <div className="resume-rich-text" style={{ fontSize: "calc(13px * var(--theme-font-scale, 1))", lineHeight: "var(--theme-line-height, 1.6)", marginTop: isContinuedItem ? "0" : "4px" }}>
                                                <SplittableRichText
                                                    html={edu.description}
                                                    range={subItemRanges?.[originalIdx]}
                                                    isActive={isSpellCheckActive}
                                                    onIgnore={onSpellCheckIgnore}
                                                    onReplace={(val) => onSpellCheckReplace('education', originalIdx, val, 'description')}
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
        projects: ({ itemIndices, isContinued, subItemRanges, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.projects?.[idx]) : data.projects;
            if (!items || items.length === 0) return null;
            const isSidebar = zoneId?.toLowerCase().includes("sidebar");

            return (
                <SectionWrapper sectionId="projects" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Projects">
                    <div>
                        <SectionTitle title="Projects" zoneId={zoneId} />
                        {items.map((proj, i) => {
                            if (!proj) return null;
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            const isContinuedItem = subItemRanges?.[originalIdx]?.start > 0;
                            const dateStr = proj.year || (proj.startYear && `${proj.startYear} - ${proj.isCurrent ? 'Present' : (proj.endYear || 'Present')}`);

                            return (
                                <div key={i} data-item-index={originalIdx} style={{ marginBottom: "calc(25px * var(--theme-paragraph-margin, 1))" }}>
                                    {!isContinuedItem && (
                                        <>
                                            <div style={{
                                                display: "flex",
                                                flexDirection: isSidebar ? "column" : "row",
                                                justifyContent: isSidebar ? "flex-start" : "space-between",
                                                alignItems: isSidebar ? "flex-start" : "baseline",
                                                marginBottom: "4px",
                                                gap: isSidebar ? "2px" : "0"
                                            }}>
                                                <div style={{ fontWeight: "700", fontSize: isSidebar ? "calc(14.5px * var(--theme-font-scale, 1))" : "calc(16px * var(--theme-font-scale, 1))", color: "#1e293b" }}>
                                                    <RichTextSpellCheck html={proj.title} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('projects', originalIdx, val, 'title')} />
                                                </div>
                                                {dateStr && (
                                                    <div style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", color: "#64748b", fontWeight: "500" }}>
                                                        <SpellCheckText text={dateStr} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('projects', originalIdx, val, proj.year ? 'year' : 'date')} />
                                                    </div>
                                                )}
                                            </div>

                                            {proj.link && (
                                                <div style={{ fontSize: "calc(13px * var(--theme-font-scale, 1))", color: "var(--theme-color, #70b1e8)", marginBottom: "8px" }}>
                                                    <ResumeLink href={proj.link}>
                                                        <RichTextSpellCheck html={proj.link} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('projects', originalIdx, val, 'link')} />
                                                    </ResumeLink>
                                                </div>
                                            )}

                                            {/* Technologies */}
                                            {proj.technologies && proj.technologies.length > 0 && (
                                                <div style={{ marginBottom: "8px" }}>
                                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                                        {proj.technologies.map((tech, tIdx) => (
                                                            <div key={tIdx} style={{ fontSize: "calc(11px * var(--theme-font-scale, 1))", padding: "2px 8px", background: "#f1f5f9", borderRadius: "12px", color: "#475569" }}>
                                                                <RichTextSpellCheck
                                                                    html={tech}
                                                                    isActive={isSpellCheckActive}
                                                                    onIgnore={onSpellCheckIgnore}
                                                                    onReplace={(val) => {
                                                                        const updated = [...proj.technologies];
                                                                        updated[tIdx] = val;
                                                                        onSpellCheckReplace('projects', originalIdx, updated, 'technologies');
                                                                    }}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    <div className="resume-rich-text" style={{ fontSize: "calc(13px * var(--theme-font-scale, 1))", lineHeight: "var(--theme-line-height, 1.6)", color: "#475569", marginTop: isContinuedItem ? "0" : "4px" }}>
                                        <SplittableRichText
                                            html={proj.description}
                                            range={subItemRanges?.[originalIdx]}
                                            isActive={isSpellCheckActive}
                                            onIgnore={onSpellCheckIgnore}
                                            onReplace={(val) => onSpellCheckReplace('projects', originalIdx, val, 'description')}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },
        additionalInfo: ({ isContinued, subItemRanges: renderSubItemRanges, zoneId }) => {
            const html = data.additionalInfo || "";
            if (!html || html.trim() === "" || html === "<p><br></p>") return null;
            const title = "Additional Information";
            return (
                <SectionWrapper sectionId="additionalInfo" onSectionClick={onSectionClick} isInteractive={isInteractive} label={title}>
                    <div>
                        <SectionTitle title={title} zoneId={zoneId} />
                        <div className="resume-rich-text" style={{ fontSize: "calc(13.5px * var(--theme-font-scale, 1))", lineHeight: "1.6" }}>
                            <SplittableRichText
                                html={html}
                                range={renderSubItemRanges?.additionalInfo}
                                isActive={isSpellCheckActive}
                                onIgnore={onSpellCheckIgnore}
                                onReplace={(val) => onSpellCheckReplace('additionalInfo', 'additionalInfo', val)}
                            />
                        </div>
                    </div>
                </SectionWrapper>
            );
        },
        custom: ({ isContinued, subItemRanges: renderSubItemRanges, zoneId }) => {
            if (!data.customSection?.isVisible || !data.customSection?.content) return null;
            const content = data.customSection.content;
            if (!content || content.trim() === "" || content === "<p><br></p>") return null;

            const title = data.customSection.title || "Additional Information";
            return (
                <SectionWrapper sectionId="custom" onSectionClick={onSectionClick} isInteractive={isInteractive} label={title}>
                    <div>
                        <SectionTitle title={title} zoneId={zoneId} />
                        <div className="resume-rich-text" style={{ fontSize: "calc(13.5px * var(--theme-font-scale, 1))", lineHeight: "1.6" }}>
                            <SplittableRichText
                                html={content}
                                range={renderSubItemRanges?.custom}
                                isActive={isSpellCheckActive}
                                onIgnore={onSpellCheckIgnore}
                                onReplace={(val) => onSpellCheckReplace('customSection', 'content', val)}
                            />
                        </div>
                    </div>
                </SectionWrapper>
            );
        },
        contact: ({ zoneId }) => {
            const items = data.websites || [];
            const contactLinks = [
                { label: 'LinkedIn', value: personal?.linkedin, type: 'personal', field: 'linkedin' },
                { label: 'GitHub', value: personal?.github, type: 'personal', field: 'github' },
                { label: 'Website', value: personal?.website, type: 'personal', field: 'website' },
                ...items
                    .map((link, idx) => ({ ...link, originalIdx: idx }))
                    .filter(link => link.addToHeader && link.url)
                    .map(link => ({ label: link.label || 'Website', value: link.url, type: 'websites', field: 'url', idx: link.originalIdx }))
            ];

            return (
                <SectionWrapper sectionId="contact" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Contact">
                    <div style={{ marginBottom: "var(--theme-section-margin, 25px)" }}>
                        <SectionTitle title="Contact" zoneId={zoneId} />

                        {personal?.city && (
                            <>
                                <span style={styles.contactLabel}>Location</span>
                                <span style={styles.contactText}>
                                    <SpellCheckText
                                        text={[personal?.city, personal?.state, personal?.zipCode, personal?.country].filter(Boolean).join(", ")}
                                        isActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onReplace={(val) => onSpellCheckReplace('personal', 'city', val)}
                                    />
                                </span>
                            </>
                        )}

                        <span style={styles.contactLabel}>Phone</span>
                        <span style={styles.contactText}>
                            <ResumeLink href={personal?.phone}>
                                <SpellCheckText text={personal?.phone || "+000 000 000"} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'phone', val)} />
                            </ResumeLink>
                        </span>
                        <span style={styles.contactLabel}>E-mail</span>
                        <span style={styles.contactText}>
                            <ResumeLink href={personal?.email}>
                                <SpellCheckText text={personal?.email || "hello@address.com"} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'email', val)} />
                            </ResumeLink>
                        </span>

                        {contactLinks.map((link, i) => link.value && (
                            <React.Fragment key={i}>
                                <span style={styles.contactLabel}>
                                    {link.label}
                                </span>
                                <span style={styles.contactText}>
                                    <ResumeLink href={link.value}>
                                        <SpellCheckText
                                            text={link.value}
                                            isActive={isSpellCheckActive}
                                            onIgnore={onSpellCheckIgnore}
                                            onReplace={(val) => onSpellCheckReplace(link.type, link.type === 'personal' ? link.field : link.idx, val, link.type === 'websites' ? 'url' : null)}
                                        />
                                    </ResumeLink>
                                </span>
                            </React.Fragment>
                        ))}
                    </div>
                </SectionWrapper>
            );
        },
        websites: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.websites?.[idx]) : data.websites;
            const portfolioLinks = (items || [])
                .map((link, idx) => ({ ...link, originalIdx: itemIndices ? itemIndices[idx] : idx }))
                .filter(link => !link.addToHeader && link.url);

            if (portfolioLinks.length === 0) return null;

            return (
                <SectionWrapper sectionId="websites" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Websites & Portfolios">
                    <div style={{ marginBottom: "var(--theme-section-margin, 25px)" }}>
                        <SectionTitle title="Websites & Portfolios" zoneId={zoneId} />
                        {portfolioLinks.map((site, i) => (
                            <React.Fragment key={i}>
                                <span style={styles.contactLabel}>{site.label || 'Portfolio'}</span>
                                <span style={styles.contactText}>
                                    <ResumeLink href={site.url}>
                                        <SpellCheckText
                                            text={site.url}
                                            isActive={isSpellCheckActive}
                                            onIgnore={onSpellCheckIgnore}
                                            onReplace={(val) => onSpellCheckReplace('websites', site.originalIdx, val, 'url')}
                                        />
                                    </ResumeLink>
                                </span>
                            </React.Fragment>
                        ))}
                    </div>
                </SectionWrapper>
            );
        },
        strengths: ({ itemIndices, isContinued, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.strengths?.[idx]).filter(Boolean) : (data.strengths || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="strengths" navigationId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Key Strengths">
                    <div style={{ marginBottom: "var(--theme-section-margin, 25px)" }}>
                        <SectionTitle title="Key Strengths" zoneId={zoneId} />
                        <ul className="resume-rich-text" style={{ paddingLeft: "15px", margin: 0 }}>
                            {items.map((skill, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                const lvl = typeof skill === 'object' ? (skill.level ?? skill.rating) : null;
                                return (
                                    <li key={originalIdx} data-item-index={originalIdx} style={{ marginBottom: "8px", fontSize: "calc(13.5px * var(--theme-font-scale, 1))" }}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                            <RichTextSpellCheck html={typeof skill === 'object' ? skill.name : skill} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('strengths', originalIdx, val, 'name')} />
                                            {lvl > 0 && <span style={{ display: "flex", gap: "3px", marginLeft: "8px" }}>{[...Array(5)].map((_, di) => <div key={di} style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: di < lvl ? "var(--theme-color, #635bff)" : "rgba(120,120,120,0.15)" }} />)}</span>}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </SectionWrapper>
            );
        },
        additionalSkills: ({ itemIndices, isContinued, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.additionalSkills?.[idx]).filter(Boolean) : (data.additionalSkills || []);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="additionalSkills" navigationId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Additional Skills">
                    <div style={{ marginBottom: "var(--theme-section-margin, 25px)" }}>
                        <SectionTitle title="Additional Skills" zoneId={zoneId} />
                        <ul className="resume-rich-text" style={{ paddingLeft: "15px", margin: 0 }}>
                            {items.map((skill, i) => {
                                const originalIdx = itemIndices ? itemIndices[i] : i;
                                const lvl = typeof skill === 'object' ? (skill.level ?? skill.rating) : null;
                                return (
                                    <li key={originalIdx} data-item-index={originalIdx} style={{ marginBottom: "8px", fontSize: "calc(13.5px * var(--theme-font-scale, 1))" }}>
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                            <RichTextSpellCheck html={typeof skill === 'object' ? skill.name : skill} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('additionalSkills', originalIdx, val, 'name')} />
                                            {lvl > 0 && <span style={{ display: "flex", gap: "3px", marginLeft: "8px" }}>{[...Array(5)].map((_, di) => <div key={di} style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: di < lvl ? "var(--theme-color, #635bff)" : "rgba(120,120,120,0.15)" }} />)}</span>}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </SectionWrapper>
            );
        },
        skills: ({ itemIndices, isContinued, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.skills?.[idx]).filter(Boolean) : (data.skills || []);
            const hasDescription = data.skillsDescription && data.skillsDescription.trim();

            if (items.length > 0) {
                return (
                    <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Skills">
                        <div style={{ marginBottom: "var(--theme-section-margin, 25px)" }}>
                            <SectionTitle title="Skills" zoneId={zoneId} />
                            <ul className="resume-rich-text" style={{ paddingLeft: "15px", margin: 0 }}>
                                {items.map((skill, i) => {
                                    const originalIdx = itemIndices ? itemIndices[i] : i;
                                    const lvl = typeof skill === 'object' ? (skill.level ?? skill.rating) : null;
                                    return (
                                        <li key={originalIdx} data-item-index={originalIdx} style={{ marginBottom: "8px", fontSize: "calc(13.5px * var(--theme-font-scale, 1))" }}>
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                                <RichTextSpellCheck html={typeof skill === 'object' ? skill.name : skill} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('skills', originalIdx, val, 'name')} />
                                                {lvl > 0 && <span style={{ display: "flex", gap: "3px", marginLeft: "8px" }}>{[...Array(5)].map((_, di) => <div key={di} style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: di < lvl ? "var(--theme-color, #635bff)" : "rgba(120,120,120,0.15)" }} />)}</span>}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </SectionWrapper>
                );
            }

            if (hasDescription) {
                return (
                    <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Skills">
                        <div style={{ marginBottom: "var(--theme-section-margin, 25px)" }}>
                            <SectionTitle title="Skills" zoneId={zoneId} />
                            <div className="resume-rich-text" style={{ fontSize: "calc(13.5px * var(--theme-font-scale, 1))" }}>
                                <SplittableRichText
                                    html={data.skillsDescription}
                                    isActive={isSpellCheckActive}
                                    onIgnore={onSpellCheckIgnore}
                                    onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('skills', 'skillsDescription', val)}
                                />
                            </div>
                        </div>
                    </SectionWrapper>
                );
            }

            return null;
        },
        languages: ({ itemIndices, isContinued, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.languages?.[idx]) : data.languages;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="languages" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Languages">
                    <div style={{ marginBottom: "var(--theme-section-margin, 25px)" }}>
                        <SectionTitle title="Languages" zoneId={zoneId} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
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
        certifications: ({ itemIndices, isContinued, zoneId, subItemRanges: renderSubItemRanges }) => {
            const items = itemIndices ? itemIndices.map(idx => data.certifications?.[idx]) : data.certifications;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="certifications" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Certifications">
                    <div style={{ marginBottom: "var(--theme-section-margin, 25px)" }}>
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
                                        variant={zoneId?.toLowerCase().includes('sidebar') ? 'compact' : undefined}
                                        subItemRange={renderSubItemRanges?.[originalIdx]}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },
        software: ({ itemIndices, isContinued, zoneId, subItemRanges: renderSubItemRanges }) => {
            const items = itemIndices ? itemIndices.map(idx => data.software?.[idx]) : data.software;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="software" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Software">
                    <div style={{ marginBottom: "var(--theme-section-margin, 25px)" }}>
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
                                        variant={zoneId?.toLowerCase().includes('sidebar') ? 'compact' : undefined}
                                        subItemRange={renderSubItemRanges?.[originalIdx]}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },
        interests: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.interests?.[idx]) : data.interests;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="interests" navigationId="interests" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Interests">
                    <div style={{ marginBottom: "var(--theme-section-margin, 25px)" }}>
                        <SectionTitle title="Interests" zoneId={zoneId} />
                        <ul className="resume-rich-text" style={{
                            paddingLeft: "15px",
                            margin: 0,
                            display: "flex",
                            flexDirection: "column",
                            gap: "calc(6px * var(--theme-paragraph-margin, 1))"
                        }}>
                            {items.map((item, i) => (
                                <li key={i} data-item-index={itemIndices ? itemIndices[i] : i} style={{ fontSize: "calc(13px * var(--theme-font-scale, 1))" }}>
                                    <RichTextSpellCheck html={typeof item === 'object' ? item.name : item} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('interests', itemIndices ? itemIndices[i] : i, val, 'name')} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </SectionWrapper>
            );
        },
        awards: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.awards?.[idx]) : data.awards;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="awards" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Awards">
                    <div style={{ marginBottom: "var(--theme-section-margin, 25px)" }}>
                        <SectionTitle title="Awards" zoneId={zoneId} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "calc(12px * var(--theme-paragraph-margin, 1))" }}>
                            {items.map((award, i) => (
                                <div key={i} style={{ fontSize: "calc(13px * var(--theme-font-scale, 1))" }}>
                                    <div style={{ fontWeight: "700", color: "#1e293b" }}>
                                        <RichTextSpellCheck html={award.title} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('awards', itemIndices ? itemIndices[i] : i, val, 'title')} />
                                    </div>
                                    <div style={{ color: "var(--theme-color, #70b1e8)", fontStyle: "italic" }}>
                                        <RichTextSpellCheck html={award.issuer} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('awards', itemIndices ? itemIndices[i] : i, val, 'issuer')} />
                                        {award.year && <span> • {award.year}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },
        personalDetails: ({ zoneId }) => {
            const details = [
                { label: "BORN", value: personal?.dob, field: 'dob' },
                { label: "NATIONALITY", value: personal?.nationality, field: 'nationality' },
                { label: "GENDER", value: personal?.gender, field: 'gender' },
                { label: "MARITAL STATUS", value: personal?.maritalStatus, field: 'maritalStatus' },
                { label: "VISA STATUS", value: personal?.visaStatus, field: 'visaStatus' },
                { label: "RELIGION", value: personal?.religion, field: 'religion' },
                { label: "PASSPORT", value: personal?.passport, field: 'passport' },
                { label: "PLACE OF BIRTH", value: personal?.placeOfBirth, field: 'placeOfBirth' },
                { label: "DRIVING LICENSE", value: personal?.drivingLicense, field: 'drivingLicense' },
                { label: "OTHER", value: personal?.otherPersonal, field: 'otherPersonal' },
            ].filter(d => d.value);

            if (details.length === 0) return null;
            return (
                <SectionWrapper sectionId="personalDetails" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Personal Details">
                    <div style={{ marginBottom: "var(--theme-section-margin, 25px)" }}>
                        <SectionTitle title="Personal Details" zoneId={zoneId} />
                        {details.map((detail, i) => (
                            <React.Fragment key={i}>
                                <span style={styles.contactLabel}>{detail.label}</span>
                                <span style={styles.contactText}>
                                    <SpellCheckText text={detail.value} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', detail.field, val)} />
                                </span>
                            </React.Fragment>
                        ))}
                    </div>
                </SectionWrapper>
            );
        },
        volunteering: ({ itemIndices, zoneId, subItemRanges }) => {
            const items = itemIndices ? itemIndices.map(idx => data.volunteering?.[idx] || data.volunteer?.[idx]) : (data.volunteering || data.volunteer);
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="volunteering" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Volunteering">
                    <div style={{ marginBottom: "var(--theme-section-margin, 25px)" }}>
                        <SectionTitle title="Volunteering" zoneId={zoneId} />
                        {items.map((item, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            return (
                                <div key={i} data-item-index={originalIdx} style={{ marginBottom: "15px" }}>
                                    <div style={{ fontWeight: "700", fontSize: "calc(14px * var(--theme-font-scale, 1))", color: "#1e293b" }}>
                                        <RichTextSpellCheck html={item.organization || item.company} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('volunteering', originalIdx, val, 'organization')} />
                                    </div>
                                    <div style={{ fontWeight: "600", fontSize: "calc(13px * var(--theme-font-scale, 1))", color: "var(--theme-color, #70b1e8)" }}>
                                        <RichTextSpellCheck html={item.role || item.title} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('volunteering', originalIdx, val, 'role')} />
                                    </div>
                                    <div style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", color: "#64748b", marginBottom: "4px" }}>
                                        {[item.startDate, item.isCurrent ? "Present" : item.endDate].filter(Boolean).join(" - ")}
                                        {item.location && ` • ${item.location}`}
                                    </div>
                                    {item.description && (
                                        <div className="resume-rich-text" style={{ fontSize: "calc(13px * var(--theme-font-scale, 1))", lineHeight: "1.6" }}>
                                            <SplittableRichText html={item.description} range={subItemRanges?.[originalIdx]} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('volunteering', originalIdx, val, 'description')} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },
        publications: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.publications?.[idx]) : data.publications;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="publications" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Publications">
                    <div style={{ marginBottom: "var(--theme-section-margin, 25px)" }}>
                        <SectionTitle title="Publications" zoneId={zoneId} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "calc(12px * var(--theme-paragraph-margin, 1))" }}>
                            {items.map((pub, i) => (
                                <div key={i}>
                                    <div style={{ fontWeight: "700", fontSize: "calc(14px * var(--theme-font-scale, 1))", color: "#1e293b" }}>
                                        <RichTextSpellCheck html={pub.name || pub.title} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('publications', itemIndices ? itemIndices[i] : i, val, 'name')} />
                                    </div>
                                    <div style={{ fontSize: "calc(13px * var(--theme-font-scale, 1))", color: "var(--theme-color, #70b1e8)" }}>
                                        <RichTextSpellCheck html={pub.publisher} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('publications', itemIndices ? itemIndices[i] : i, val, 'publisher')} />
                                        {pub.releaseDate && <span> • {pub.releaseDate}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },
        references: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.references?.[idx]) : data.references;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="references" onSectionClick={onSectionClick} isInteractive={isInteractive} label="References">
                    <div style={{ marginBottom: "var(--theme-section-margin, 25px)" }}>
                        <SectionTitle title="References" zoneId={zoneId} />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "15px" }}>
                            {items.map((ref, i) => (
                                <div key={i}>
                                    <div style={{ fontWeight: "700", fontSize: "calc(14px * var(--theme-font-scale, 1))", color: "#1e293b" }}>
                                        <RichTextSpellCheck html={ref.name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('references', itemIndices ? itemIndices[i] : i, val, 'name')} />
                                    </div>
                                    <div style={{ fontSize: "calc(13px * var(--theme-font-scale, 1))", color: "var(--theme-color, #70b1e8)" }}>
                                        <RichTextSpellCheck html={ref.company || ref.title} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('references', itemIndices ? itemIndices[i] : i, val, 'company')} />
                                    </div>
                                    {ref.contact && (
                                        <div style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", color: "#64748b" }}>
                                            <RichTextSpellCheck html={ref.contact} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('references', itemIndices ? itemIndices[i] : i, val, 'contact')} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },
        affiliations: ({ itemIndices, zoneId }) => {
            const items = itemIndices ? itemIndices.map(idx => data.affiliations?.[idx]) : data.affiliations;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="affiliations" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Affiliations">
                    <div style={{ marginBottom: "var(--theme-section-margin, 25px)" }}>
                        <SectionTitle title="Affiliations" zoneId={zoneId} />
                        {items.map((aff, i) => (
                            <div key={i} style={{ marginBottom: "10px" }}>
                                <div style={{ fontWeight: "700", fontSize: "calc(14px * var(--theme-font-scale, 1))", color: "#1e293b" }}>
                                    <RichTextSpellCheck html={aff.name} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('affiliations', itemIndices ? itemIndices[i] : i, val, 'name')} />
                                </div>
                                <div style={{ fontSize: "calc(13px * var(--theme-font-scale, 1))", color: "var(--theme-color, #70b1e8)" }}>
                                    <RichTextSpellCheck html={aff.role || aff.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('affiliations', itemIndices ? itemIndices[i] : i, val, 'role')} />
                                </div>
                            </div>
                        ))}
                    </div>
                </SectionWrapper>
            );
        }
    };

    const renderZone = (id, items, columnStyle) => (
        <DroppableZone id={id} style={{ ...columnStyle }}>

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

    const Measurer = () => (
        <div className="resume-measurer" style={{ position: "absolute", top: -10000, left: -10000, width: "210mm", visibility: "hidden" }}>
            <div className="page-height-marker" style={{ height: "297mm", width: "1px", position: "absolute", left: 0, top: 0 }}></div>
            <div style={{ ...styles.page, height: "auto" }}>
                <Header />
                <div style={styles.layoutBody}>
                    <div data-column-id="main" style={styles.mainColumn}>
                        {activeMainSections.map(sid => (
                            <SectionRenderer key={sid} sectionId={sid} data={data} customRenderers={customRenderers} />
                        ))}
                    </div>
                    <div data-column-id="sidebar" style={styles.sidebarColumn}>
                        {personal?.photo && (
                            <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Photo">
                                <img src={personal.photo} style={styles.photo} alt="profile" />
                            </SectionWrapper>
                        )}
                        {activeSidebarSections.map(sid => (
                            <SectionRenderer key={sid} sectionId={sid} data={data} customRenderers={customRenderers} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div ref={containerRef} className="azure-modern-root" >
            <Measurer />
            <DndContext {...dndContextProps}>
                <SortableContext items={[...activeMainSections, ...activeSidebarSections]} strategy={verticalListSortingStrategy}>
                    {showPageBreaks && pages ? (
                        pages.map((page, i) => (
                            <div key={i} style={styles.page}>
                                {i === 0 && <Header />}
                                <div style={{ ...styles.layoutBody, flex: 1 }}>
                                    <div style={styles.mainColumn}>
                                        {renderZone(`main-p${i}`, page.main, { display: "flex", flexDirection: "column", gap: "calc(25px * var(--theme-section-margin, 1))" })}
                                    </div>
                                    <div style={styles.sidebarColumn}>
                                        {i === 0 && personal?.photo && (
                                            <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Photo">
                                                <img src={personal.photo} style={styles.photo} alt="profile" />
                                            </SectionWrapper>
                                        )}
                                        {renderZone(`sidebar-p${i}`, page.sidebar, { display: "flex", flexDirection: "column", gap: "calc(25px * var(--theme-section-margin, 1))" })}
                                    </div>
                                </div>
                                <div style={{ position: "absolute", bottom: "15px", right: "20px", fontSize: "10px", opacity: 0.5 }}>Page {i + 1}</div>
                            </div>
                        ))
                    ) : (
                        <div style={{ ...styles.page, height: "auto", minHeight: "100%" }}>
                            <Header />
                            <div style={styles.layoutBody}>
                                <div style={styles.mainColumn}>
                                    {renderZone('main', activeMainSections, { display: "flex", flexDirection: "column", gap: "calc(25px * var(--theme-section-margin, 1))" })}
                                </div>
                                <div style={styles.sidebarColumn}>
                                    {personal?.photo && (
                                        <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Photo">
                                            <img src={personal.photo} style={styles.photo} alt="profile" />
                                        </SectionWrapper>
                                    )}
                                    {renderZone('sidebar', activeSidebarSections, { display: "flex", flexDirection: "column", gap: "calc(25px * var(--theme-section-margin, 1))" })}
                                </div>
                            </div>
                        </div>
                    )}
                </SortableContext>
                <StableResumeDragOverlay activeId={activeId} scale={scale} renderSection={(id) => (
                    <div style={{ background: "white", padding: "10px", border: "1px solid #ddd", width: "300px" }}>
                        <SectionRenderer sectionId={id} data={data} customRenderers={customRenderers} />
                    </div>
                )} />
            </DndContext>
        </div >
    );
};

export default AzureModern;
