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
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react";
import { getCompleteLayout, getSavedLayout } from "../common/TemplateUtils";

/**
 * EXECUTIVE SIDEBAR TEMPLATE
 * High-Density 2-Column layout with a dark sidebar and premium typography.
 */
const ExecutiveSidebar = ({ data, onSectionClick, onReorder, scale = 1, isSpellCheckActive, onSpellCheckIgnore, onSpellCheckReplace, showPageBreaks }) => {
    const containerRef = useRef(null);
    if (!data) return null;

    const templateId = 'executive-sidebar';
    const isInteractive = !!onSectionClick && !isSpellCheckActive;
    const canReorder = !!onReorder && !isSpellCheckActive;

    const { personal } = data;

    // --- 1. DYNAMIC LAYOUT ENGINE ---
    const initialLayout = getSavedLayout(data, templateId, {
        left: ["websites", "skills", "strengths", "languages", "interests", "additionalSkills"],
        right: ["summary", "experience", "education", "projects", "certifications", "custom"]
    });

    // Auto-complete the layout with any "orphaned" sections (e.g. Certifications, Languages)
    const completeLayout = getCompleteLayout(data, initialLayout, 'right');
    const activeLeftSections = completeLayout.left || [];
    const activeRightSections = completeLayout.right || [];

    // --- 2. KERNEL HOOKS ---
    const { dndContextProps, activeId } = useResumeDragAndDrop({
        data,
        onReorder,
        scale,
        containers: { left: activeLeftSections, right: activeRightSections }
    });

    const pages = useAutoPagination({
        columns: { left: activeLeftSections, right: activeRightSections },
        data,
        enabled: showPageBreaks,
        containerRef,
        scale
    });

    // --- 3. STYLES (Universal Design Panel Support) ---
    const styles = {
        page: {
            width: "210mm",
            height: "297mm",
            background: "var(--theme-background, white)",
            boxSizing: "border-box",
            position: "relative",
            margin: "0 auto 30px auto",
            color: "var(--theme-text, #334155)",
            fontFamily: "var(--theme-font, 'Inter', sans-serif)",
            overflow: "visible",
            display: "flex",
        },
        sidebar: {
            width: "30%",
            backgroundColor: "var(--theme-sidebar-bg, #252b33)",
            color: "var(--theme-sidebar-text, #ffffff)",
            padding: "var(--theme-page-margin, 40px) calc(var(--theme-page-margin, 40px) * 0.8)",
            display: "flex",
            flexDirection: "column",
            gap: "calc(25px * var(--theme-section-margin, 1))",
            zIndex: 10, // Increased to allow hover handles to work but keep below overlay
        },
        mainContent: {
            flex: 1,
            backgroundColor: "var(--theme-background, #ffffff)",
            padding: "var(--theme-page-margin, 40px)",
            display: "flex",
            flexDirection: "column",
            gap: "calc(25px * var(--theme-section-margin, 1))",
        },
        photoContainer: {
            display: "flex",
            justifyContent: "center",
            marginBottom: "10px",
        },
        photo: {
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            objectFit: "cover",
            border: "4px solid rgba(255,255,255,0.1)",
        },
        name: {
            fontSize: "calc(42px * var(--theme-font-scale, 1))",
            fontWeight: "800",
            color: "#1e293b",
            margin: "0 0 4px 0",
            textTransform: "uppercase",
            letterSpacing: "-0.5px",
        },
        profession: {
            fontSize: "calc(18px * var(--theme-font-scale, 1))",
            fontWeight: "500",
            color: "#64748b",
            margin: "0 0 10px 0",
            textTransform: "capitalize",
            letterSpacing: "0.2px",
        },
        sidebarTitle: {
            fontSize: "calc(16px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: "var(--local-title, #ffffff)",
            textTransform: "uppercase",
            letterSpacing: "1.2px",
            marginBottom: "calc(15px * var(--theme-paragraph-margin, 1))",
            borderBottom: "2px solid var(--local-title-alt, rgba(255,255,255,0.2))",
            paddingBottom: "6px",
            display: "block",
            width: "100%",
        },
        mainTitle: {
            fontSize: "calc(18px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: "var(--local-title, var(--theme-color, #1e293b))",
            textTransform: "uppercase",
            letterSpacing: "1px",
            marginBottom: "calc(15px * var(--theme-paragraph-margin, 1))",
            borderBottom: "2px solid var(--local-title, var(--theme-color, #1e293b))",
            paddingBottom: "6px",
            display: "block",
            width: "100%",
        },
        contactItem: {
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            marginBottom: "calc(10px * var(--theme-paragraph-margin, 1))",
            fontSize: "calc(13px * var(--theme-font-scale, 1))",
        },
        contactLabel: {
            fontWeight: "700",
            fontSize: "calc(11px * var(--theme-font-scale, 1))",
            textTransform: "uppercase",
            color: "var(--local-text-muted, #64748b)",
        },
        contactValue: {
            color: "var(--local-text, #475569)",
            wordBreak: "break-all",
        },
        bulletItem: {
            display: "flex",
            gap: "10px",
            marginBottom: "calc(12px * var(--theme-paragraph-margin, 1))",
            fontSize: "calc(13px * var(--theme-font-scale, 1))",
            lineHeight: "1.4",
            color: "var(--local-text, #475569)",
        },
        bulletDot: {
            marginTop: "calc(7.5px * var(--theme-font-scale, 1))",
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            background: "var(--local-title, #1e293b)",
            flexShrink: 0,
        },
        expHeader: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "4px",
        },
        expTitle: {
            fontSize: "calc(15px * var(--theme-font-scale, 1))",
            fontWeight: "700",
            color: "var(--local-title, #1e293b)",
        },
        expDate: {
            fontSize: "calc(12px * var(--theme-font-scale, 1))",
            color: "var(--local-text-muted, #64748b)",
            fontWeight: "500",
        },
        expSub: {
            fontSize: "calc(13px * var(--theme-font-scale, 1))",
            color: "var(--local-text, #475569)",
            fontWeight: "600",
            marginBottom: "8px",
        }
    };

    // --- 4. RENDER HELPERS ---
    const MainSectionTitle = ({ title }) => {
        const { isContinued } = useSectionContext();
        const displayTitle = isContinued ? `${title} (Cont.)` : title;
        return (
            <div style={styles.mainTitle}>
                {displayTitle}
            </div>
        );
    };

    const SidebarSectionTitle = ({ title }) => {
        const { isContinued } = useSectionContext();
        const displayTitle = isContinued ? `${title} (Cont.)` : title;
        return (
            <div style={styles.sidebarTitle}>{displayTitle}</div>
        );
    };

    const ExperienceRenderer = ({ item, index, subItemRange, isSidebar }) => {
        // Format date range properly
        const dateStr = item.year || item.date || (item.startYear ? `${item.startYear} - ${item.isCurrent ? "Present" : (item.endYear || "Present")}` : "");

        return (
            <div data-item-index={index} style={{ marginBottom: "calc(20px * var(--theme-paragraph-margin, 1))" }}>
                <div style={{ ...styles.expHeader, flexDirection: isSidebar ? "column" : "row", gap: isSidebar ? "2px" : "10px" }}>
                    <div style={styles.expTitle}>
                        <RichTextSpellCheck html={item.title || item.role} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', index, val, 'title')} />
                    </div>
                    <div style={styles.expDate}>
                        <RichTextSpellCheck html={dateStr} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', index, val, 'date')} />
                    </div>
                </div>
                <div style={{ ...styles.expSub, fontSize: "calc(13px * var(--theme-font-scale, 1))" }}>
                    <RichTextSpellCheck html={`${item.company || ""}${item.location ? ` | ${item.location}` : ""}${item.isRemote ? " | Remote" : ""}`} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', index, val, 'company')} />
                </div>
                {item.description && (
                    <div className="resume-rich-text" style={{ fontSize: "calc(13px * var(--theme-font-scale, 1))", color: "var(--local-text, #475569)", lineHeight: "1.6", marginTop: "4px" }}>
                        <SplittableRichText
                            html={item.description}
                            range={subItemRange}
                            isActive={isSpellCheckActive}
                            onIgnore={onSpellCheckIgnore}
                            onReplace={(val) => onSpellCheckReplace('experience', index, val, 'description')}
                        />
                    </div>
                )}
            </div>
        );
    };

    const EducationRenderer = ({ item, index, isSidebar }) => (
        <div data-item-index={index} style={{ marginBottom: "calc(20px * var(--theme-paragraph-margin, 1))" }}>

            <div style={{ ...styles.expHeader, flexDirection: isSidebar ? "column" : "row", gap: isSidebar ? "2px" : "10px" }}>
                <div style={styles.expTitle}>
                    <RichTextSpellCheck html={item.degree} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', index, val, 'degree')} />
                </div>
                <div style={styles.expDate}>
                    <SpellCheckText text={item.year || item.date} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', index, val, 'date')} />
                </div>
            </div>
            <div style={{ ...styles.expSub, fontSize: "calc(13px * var(--theme-font-scale, 1))" }}>
                <RichTextSpellCheck html={`${item.institution || item.school || ""}${item.field ? ` — ${item.field}` : ""}`} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', index, val, 'institution')} />
            </div>
            {item.grade && (
                <div style={{ fontSize: "calc(12px * var(--theme-font-scale, 1))", color: "var(--local-text-muted, #64748b)", fontStyle: "italic", marginTop: "2px" }}>
                    GPA: <SpellCheckText text={item.grade} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', index, val, 'grade')} />
                </div>
            )}
            {item.description && (
                <div className="resume-rich-text" style={{ fontSize: "calc(13px * var(--theme-font-scale, 1))", color: "var(--local-text, #475569)", lineHeight: "1.6", marginTop: "4px" }}>
                    <SplittableRichText
                        html={item.description}
                        isActive={isSpellCheckActive}
                        onIgnore={onSpellCheckIgnore}
                        onReplace={(val) => onSpellCheckReplace('education', index, val, 'description')}
                    />
                </div>
            )}
        </div>
    );

    const ProjectRenderer = ({ item, index, subItemRange }) => {
        const dateStr = item.year || (item.startYear && `${item.startYear} - ${item.isCurrent ? "Present" : (item.endYear || "Present")}`);

        return (
            <div data-item-index={index} style={{ marginBottom: "calc(20px * var(--theme-paragraph-margin, 1))" }}>
                <div style={styles.expHeader}>
                    <div style={styles.expTitle}>
                        <RichTextSpellCheck html={item.title} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('projects', index, val, 'title')} />
                    </div>
                    {dateStr && (
                        <div style={styles.expDate}>
                            <SpellCheckText text={dateStr} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('projects', index, val, item.year ? 'year' : 'date')} />
                        </div>
                    )}
                </div>
                {item.link && (
                    <div style={{ ...styles.expSub, color: 'var(--theme-color, #1e293b)', fontSize: 'calc(12px * var(--theme-font-scale, 1))', marginBottom: "4px" }}>
                        <ResumeLink href={item.link}>
                            <RichTextSpellCheck html={item.link} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('projects', index, val, 'link')} />
                        </ResumeLink>
                    </div>
                )}

                {/* Technologies */}
                {item.technologies && item.technologies.length > 0 && (
                    <div style={{ marginBottom: "8px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {item.technologies.map((tech, tIdx) => (
                            <div key={tIdx} style={{ fontSize: "calc(11px * var(--theme-font-scale, 1))", padding: "1px 8px", background: "var(--local-title-alt, rgba(0,0,0,0.05))", border: "1px solid var(--local-title-alt, #e2e8f0)", borderRadius: "4px", color: "var(--local-text, #475569)" }}>
                                <RichTextSpellCheck
                                    html={tech}
                                    isActive={isSpellCheckActive}
                                    onIgnore={onSpellCheckIgnore}
                                    onReplace={(val) => {
                                        const updated = [...item.technologies];
                                        updated[tIdx] = val;
                                        onSpellCheckReplace('projects', index, updated, 'technologies');
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {item.description && (
                    <div className="resume-rich-text" style={{ fontSize: "calc(13px * var(--theme-font-scale, 1))", color: "var(--local-text, #475569)", lineHeight: "1.6" }}>
                        <SplittableRichText
                            html={item.description}
                            range={subItemRange}
                            isActive={isSpellCheckActive}
                            onIgnore={onSpellCheckIgnore}
                            onReplace={(val) => onSpellCheckReplace('projects', index, val, 'description')}
                        />
                    </div>
                )}
            </div>
        );
    };

    const ExecutiveTagList = ({ items, title, sectionId, navigationId, isContinued, itemIndices, zoneId, subItemRanges }) => {
        const isSidebar = zoneId?.includes("left");
        return (
            <SectionWrapper sectionId={sectionId} navigationId={navigationId} onSectionClick={onSectionClick} isInteractive={isInteractive} label={title}>
                <div>
                    {isSidebar ? (
                        <SidebarSectionTitle title={isContinued ? `${title} (Cont.)` : title} />
                    ) : (
                        <MainSectionTitle title={isContinued ? `${title} (Cont.)` : title} />
                    )}
                    <div style={{ marginTop: "calc(5px * var(--theme-paragraph-margin, 1))" }}>
                        {items.map((item, i) => {
                            const originalIdx = itemIndices ? itemIndices[i] : i;
                            if (sectionId === 'languages') {
                                return (
                                    <div key={i} style={styles.bulletItem}>
                                        <div style={styles.bulletDot} />
                                        <div style={{ flex: 1 }}>
                                            <LanguageItem
                                                item={item}
                                                index={originalIdx}
                                                isSpellCheckActive={isSpellCheckActive}
                                                onIgnore={onSpellCheckIgnore}
                                                onSpellCheckReplace={(field, val) => onSpellCheckReplace('languages', originalIdx, val, field)}
                                                variant="compact"
                                            />
                                        </div>
                                    </div>
                                );
                            }

                            if (sectionId === 'certifications') {
                                return (
                                    <div key={i} style={styles.bulletItem}>
                                        <div style={styles.bulletDot} />
                                        <div style={{ flex: 1 }}>
                                            <CertificationItem
                                                item={item}
                                                index={originalIdx}
                                                isSpellCheckActive={isSpellCheckActive}
                                                onIgnore={onSpellCheckIgnore}
                                                onSpellCheckReplace={(field, val) => onSpellCheckReplace('certifications', originalIdx, val, field)}
                                                variant="compact"
                                                subItemRange={subItemRanges?.[originalIdx]}
                                            />
                                        </div>
                                    </div>
                                );
                            }

                            if (sectionId === 'software') {
                                return (
                                    <div key={i} style={styles.bulletItem}>
                                        <div style={styles.bulletDot} />
                                        <div style={{ flex: 1 }}>
                                            <SoftwareItem
                                                item={item}
                                                index={originalIdx}
                                                isSpellCheckActive={isSpellCheckActive}
                                                onIgnore={onSpellCheckIgnore}
                                                onSpellCheckReplace={(field, val) => onSpellCheckReplace('software', originalIdx, val, field)}
                                                variant="compact"
                                                subItemRange={subItemRanges?.[originalIdx]}
                                            />
                                        </div>
                                    </div>
                                );
                            }
                            return (
                                <div key={i} style={styles.bulletItem} data-item-index={originalIdx}>
                                    <div style={styles.bulletDot} />
                                    <span style={styles.contactValue}>
                                        <RichTextSpellCheck html={typeof item === 'object' ? item.name : (item || "")} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace(sectionId, originalIdx, val)} />
                                        {typeof item === 'object' && item.level && <span style={{ opacity: 0.7, fontSize: "calc(12px * var(--theme-font-scale, 1))" }}> — {item.level}</span>}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </SectionWrapper>
        );
    };

    // --- 5. ZONE RENDERER ---
    const customRenderers = {
        summary: ({ isContinued, zoneId, subItemRanges }) => {
            const isSidebar = zoneId?.includes("left");
            if (!data.summary) return null;
            return (
                <SectionWrapper sectionId="summary" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Profile">
                    <div>

                        {isSidebar ? (
                            <SidebarSectionTitle title={isContinued ? "Profile (Cont.)" : "Profile"} />
                        ) : (
                            <MainSectionTitle title={isContinued ? "Profile (Cont.)" : "Profile"} />
                        )}
                        <div className="resume-rich-text" style={{ fontSize: "calc(13px * var(--theme-font-scale, 1))", lineHeight: "1.7", color: "var(--local-text, #475569)" }}>
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
            );
        },
        experience: ({ itemIndices, isContinued, subItemRanges, zoneId }) => {
            const isSidebar = zoneId?.includes("left");
            const items = itemIndices ? itemIndices.map(idx => data.experience?.[idx]) : data.experience;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="experience" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Experience">
                    <div>
                        {isSidebar ? (
                            <SidebarSectionTitle title={isContinued ? "Experience (Cont.)" : "Experience"} />
                        ) : (
                            <MainSectionTitle title={isContinued ? "Work Experience (Cont.)" : "Work Experience"} />
                        )}
                        {items.map((exp, i) => (
                            <ExperienceRenderer key={i} item={exp} index={itemIndices ? itemIndices[i] : i} subItemRange={subItemRanges?.[itemIndices ? itemIndices[i] : i]} isSidebar={isSidebar} />
                        ))}
                    </div>
                </SectionWrapper>
            );
        },
        education: ({ itemIndices, isContinued, zoneId }) => {
            const isSidebar = zoneId?.includes("left");
            const items = itemIndices ? itemIndices.map(idx => data.education?.[idx]) : data.education;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="education" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Education">
                    <div>

                        {isSidebar ? (
                            <SidebarSectionTitle title={isContinued ? "Education (Cont.)" : "Education"} />
                        ) : (
                            <MainSectionTitle title={isContinued ? "Education (Cont.)" : "Education"} />
                        )}
                        {items.map((edu, i) => <EducationRenderer key={i} item={edu} index={itemIndices ? itemIndices[i] : i} isSidebar={isSidebar} />)}
                    </div>
                </SectionWrapper>
            );
        },
        skills: ({ itemIndices, isContinued, zoneId, subItemRanges }) => {
            const items = itemIndices ? itemIndices.map(idx => data.skills?.[idx]).filter(Boolean) : (data.skills || []);
            const hasDescription = data.skillsDescription && data.skillsDescription.trim();
            const useStructured = items.length > 0;

            // PRIMARY: Use structured skills (ExecutiveTagList shows levels + data-item-index for pagination)
            if (useStructured) {
                return (
                    <ExecutiveTagList items={items} title="Skills" sectionId="skills" isContinued={isContinued} itemIndices={itemIndices} zoneId={zoneId} subItemRanges={subItemRanges} />
                );
            }

            // FALLBACK: Rich text only when no structured skills exist
            if (hasDescription) {
                const isSidebar = zoneId?.includes("left");
                return (
                    <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Skills">
                        <div>
                            {isSidebar ? <SidebarSectionTitle title="Skills" /> : <MainSectionTitle title="Skills" />}
                            <div className="resume-rich-text" style={{ fontSize: "calc(13px * var(--theme-font-scale, 1))", lineHeight: "1.6", color: "var(--local-text, #475569)" }}>
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
        strengths: ({ itemIndices, isContinued, zoneId, subItemRanges }) => {
            const items = itemIndices ? itemIndices.map(idx => data.strengths?.[idx]).filter(Boolean) : (data.strengths || []);
            if (items.length === 0) return null;
            return <ExecutiveTagList items={items} title="Key Strengths" sectionId="strengths" navigationId="skills" isContinued={isContinued} itemIndices={itemIndices} zoneId={zoneId} subItemRanges={subItemRanges} />;
        },
        additionalSkills: ({ itemIndices, isContinued, zoneId, subItemRanges }) => {
            const items = itemIndices ? itemIndices.map(idx => data.additionalSkills?.[idx]).filter(Boolean) : (data.additionalSkills || []);
            if (items.length === 0) return null;
            return <ExecutiveTagList items={items} title="Additional Skills" sectionId="additionalSkills" navigationId="skills" isContinued={isContinued} itemIndices={itemIndices} zoneId={zoneId} subItemRanges={subItemRanges} />;
        },
        languages: ({ itemIndices, isContinued, zoneId, subItemRanges }) => {
            const items = itemIndices ? itemIndices.map(idx => data.languages?.[idx]) : data.languages;
            if (!items || items.length === 0) return null;
            return <ExecutiveTagList items={items} title="Languages" sectionId="languages" isContinued={isContinued} itemIndices={itemIndices} zoneId={zoneId} subItemRanges={subItemRanges} />;
        },
        interests: ({ itemIndices, isContinued, zoneId, subItemRanges }) => {
            const items = itemIndices ? itemIndices.map(idx => data.interests?.[idx]) : data.interests;
            if (!items || items.length === 0) return null;
            return <ExecutiveTagList items={items} title="Hobbies" sectionId="interests" isContinued={isContinued} itemIndices={itemIndices} zoneId={zoneId} subItemRanges={subItemRanges} />;
        },
        websites: ({ itemIndices, zoneId }) => {
            const isSidebar = zoneId?.includes("left");
            const items = itemIndices ? itemIndices.map(idx => data.websites?.[idx]) : data.websites;

            const contactLinks = [
                { label: 'LinkedIn', value: personal?.linkedin, type: 'personal', field: 'linkedin' },
                { label: 'GitHub', value: personal?.github, type: 'personal', field: 'github' },
                { label: 'Website', value: personal?.website, type: 'personal', field: 'website' },
                ...(items || [])
                    .map((link, idx) => ({ ...link, originalIdx: itemIndices ? itemIndices[idx] : idx }))
                    .filter(link => link.addToHeader && link.url)
                    .map(link => ({ label: link.label || 'Website', value: link.url, type: 'websites', field: 'url', idx: link.originalIdx }))
            ];

            const portfolioLinks = (items || [])
                .map((link, idx) => ({ ...link, originalIdx: itemIndices ? itemIndices[idx] : idx }))
                .filter(link => !link.addToHeader && link.url);

            const renderContactBlock = () => (
                <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Contact">
                    <div>
                        {isSidebar ? <SidebarSectionTitle title="Contact" /> : <MainSectionTitle title="Contact" />}
                        {personal?.city && (
                            <div style={styles.contactItem}>
                                <span style={styles.contactLabel}>Location</span>
                                <span style={styles.contactValue}>
                                    {[personal?.city, personal?.state, personal?.zipCode, personal?.country].filter(Boolean).join(", ")}
                                </span>
                            </div>
                        )}
                        {personal?.phone && (
                            <div style={styles.contactItem}>
                                <span style={styles.contactLabel}>Phone</span>
                                <span style={styles.contactValue}>
                                    <ResumeLink href={personal.phone}>
                                        {personal.phone}
                                    </ResumeLink>
                                </span>
                            </div>
                        )}
                        {personal?.email && (
                            <div style={styles.contactItem}>
                                <span style={styles.contactLabel}>Email</span>
                                <span style={styles.contactValue}>
                                    <ResumeLink href={personal.email}>
                                        {personal.email}
                                    </ResumeLink>
                                </span>
                            </div>
                        )}

                        {contactLinks.map((link, i) => link.value && (
                            <div key={i} style={styles.contactItem}>
                                <span style={styles.contactLabel}>{link.label}</span>
                                <span style={styles.contactValue}>
                                    <ResumeLink href={link.value}>
                                        <SpellCheckText
                                            text={link.value}
                                            isActive={isSpellCheckActive}
                                            onIgnore={onSpellCheckIgnore}
                                            onReplace={(val) => onSpellCheckReplace(link.type, link.type === 'personal' ? link.field : link.idx, val, link.type === 'websites' ? 'url' : null)}
                                        />
                                    </ResumeLink>
                                </span>
                            </div>
                        ))}
                    </div>
                </SectionWrapper>
            );

            const renderPortfolioBlock = () => (
                <SectionWrapper sectionId="websites" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Websites & Portfolios">
                    <div>
                        {isSidebar ? <SidebarSectionTitle title="Websites & Portfolios" /> : <MainSectionTitle title="Websites & Portfolios" />}
                        {portfolioLinks.map((site, i) => (
                            <div key={i} style={styles.contactItem}>
                                <span style={styles.contactLabel}>{site.label || 'Portfolio'}</span>
                                <span style={styles.contactValue}>
                                    <ResumeLink href={site.url}>
                                        <SpellCheckText
                                            text={site.url}
                                            isActive={isSpellCheckActive}
                                            onIgnore={onSpellCheckIgnore}
                                            onReplace={(val) => onSpellCheckReplace('websites', site.originalIdx, val, 'url')}
                                        />
                                    </ResumeLink>
                                </span>
                            </div>
                        ))}
                    </div>
                </SectionWrapper>
            );

            return (
                <React.Fragment>
                    {renderContactBlock()}
                    {portfolioLinks.length > 0 && renderPortfolioBlock()}
                </React.Fragment>
            );
        },
        projects: ({ itemIndices, isContinued, subItemRanges, zoneId }) => {
            const isSidebar = zoneId?.includes("left");
            const items = itemIndices ? itemIndices.map(idx => data.projects?.[idx]) : data.projects;
            if (!items || items.length === 0) return null;
            return (
                <SectionWrapper sectionId="projects" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Projects">
                    <div>

                        {isSidebar ? (
                            <SidebarSectionTitle title={isContinued ? "Projects (Cont.)" : "Projects"} />
                        ) : (
                            <MainSectionTitle title={isContinued ? "Projects (Cont.)" : "Projects"} />
                        )}
                        {items.map((proj, i) => (
                            <ProjectRenderer
                                key={i}
                                item={proj}
                                index={itemIndices ? itemIndices[i] : i}
                                subItemRange={subItemRanges?.[itemIndices ? itemIndices[i] : i]}
                                isSidebar={isSidebar}
                            />
                        ))}
                    </div>
                </SectionWrapper>
            );
        },
        certifications: ({ itemIndices, isContinued, zoneId, subItemRanges }) => {
            const items = itemIndices ? itemIndices.map(idx => data.certifications?.[idx]) : data.certifications;
            if (!items || items.length === 0) return null;
            return <ExecutiveTagList items={items} title="Certifications" sectionId="certifications" isContinued={isContinued} itemIndices={itemIndices} zoneId={zoneId} subItemRanges={subItemRanges} />;
        },
        software: ({ itemIndices, isContinued, zoneId, subItemRanges }) => {
            const items = itemIndices ? itemIndices.map(idx => data.software?.[idx]) : data.software;
            if (!items || items.length === 0) return null;
            return <ExecutiveTagList items={items} title="Software & Tools" sectionId="software" isContinued={isContinued} itemIndices={itemIndices} zoneId={zoneId} subItemRanges={subItemRanges} />;
        },
        additionalInfo: ({ isContinued, subItemRanges: renderSubItemRanges, zoneId }) => {
            const isSidebar = zoneId?.includes("left");
            const html = data.additionalInfo || "";
            if (!html || html.trim() === "" || html === "<p><br></p>") return null;
            const title = "Additional Information";
            return (
                <SectionWrapper sectionId="additionalInfo" onSectionClick={onSectionClick} isInteractive={isInteractive} label={title}>
                    <div>
                        {isSidebar ? (
                            <SidebarSectionTitle title={isContinued ? `${title} (Cont.)` : title} />
                        ) : (
                            <MainSectionTitle title={isContinued ? `${title} (Cont.)` : title} />
                        )}
                        <div className="resume-rich-text" style={{ fontSize: "calc(13px * var(--theme-font-scale, 1))", color: "var(--local-text, #475569)", lineHeight: "1.7" }}>
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
            const isSidebar = zoneId?.includes("left");
            if (!data.customSection?.isVisible || !data.customSection?.content) return null;
            const content = data.customSection.content;
            if (!content || content.trim() === "" || content === "<p><br></p>") return null;

            const title = data.customSection.title || "Additional Information";
            return (
                <SectionWrapper sectionId="custom" onSectionClick={onSectionClick} isInteractive={isInteractive} label={title}>
                    <div>
                        {isSidebar ? (
                            <SidebarSectionTitle title={isContinued ? `${title} (Cont.)` : title} />
                        ) : (
                            <MainSectionTitle title={isContinued ? `${title} (Cont.)` : title} />
                        )}
                        <div className="resume-rich-text" style={{ fontSize: "calc(13px * var(--theme-font-scale, 1))", color: "var(--local-text, #475569)", lineHeight: "1.7" }}>
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
        }
    };

    const renderHeader = () => (
        <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Header">
            <div style={{ paddingBottom: "10px" }}>
                <h1 style={styles.name}>
                    <SpellCheckText text={personal?.name || "YOUR NAME"} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'name', val)} />
                </h1>
                <p style={styles.profession}>
                    <SpellCheckText text={personal?.profession || "Profession"} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'profession', val)} />
                </p>
            </div>
        </SectionWrapper>
    );

    const renderZone = (zoneId, paginatedSections = null) => {
        const sections = paginatedSections || (zoneId === 'left' ? activeLeftSections : activeRightSections);
        const isSidebar = zoneId === 'left' || zoneId.startsWith('left-p');

        return (
            <DroppableZone id={zoneId} style={{
                display: "flex",
                flexDirection: "column",
                gap: "calc(25px * var(--theme-section-margin, 1))",
                '--local-title': isSidebar ? 'var(--theme-sidebar-text, #ffffff)' : 'var(--theme-color, #1e293b)',
                '--local-title-alt': isSidebar ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                '--local-text': isSidebar ? 'var(--theme-sidebar-text, rgba(255,255,255,0.8))' : '#475569',
                '--local-text-muted': isSidebar ? 'rgba(255,255,255,0.6)' : '#64748b'
            }}>
                {sections.map((section, idx) => {
                    const sid = typeof section === 'string' ? section : section.id;
                    const Renderer = customRenderers[sid] || ((props) => <SectionRenderer sectionId={sid} data={data} {...props} />);
                    return (
                        <DraggableSection key={sid} id={sid} isEnabled={canReorder}>
                            <div>
                                <Renderer
                                    itemIndices={section.itemIndices}
                                    isContinued={section.isContinued}
                                    subItemRanges={section.subItemRanges}
                                    onSectionClick={onSectionClick}
                                    zoneId={zoneId}
                                />
                            </div>
                        </DraggableSection>
                    );
                })}
            </DroppableZone>
        );
    };

    // --- 6. FINAL LAYOUTS ---
    const fullLayout = (
        <div style={styles.page}>
            <div style={styles.sidebar}>
                {personal?.photo && (
                    <div style={styles.photoContainer}>
                        <img src={personal.photo} alt="Profile" style={styles.photo} />
                    </div>
                )}
                {renderZone('left')}
            </div>
            <div style={styles.mainContent}>
                {renderHeader()}
                {renderZone('right')}
            </div>
        </div>
    );

    const paginatedLayout = pages?.map((page, i) => (
        <div key={i} className="resume-page" style={{ ...styles.page, height: "297mm", marginBottom: "30px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
            <div style={styles.sidebar}>
                {i === 0 && personal?.photo && (
                    <div style={styles.photoContainer}>
                        <img src={personal.photo} alt="Profile" style={styles.photo} />
                    </div>
                )}
                {renderZone(`left-p${i}`, page.left)}
            </div>
            <div style={styles.mainContent}>
                {i === 0 && renderHeader()}
                {renderZone(`right-p${i}`, page.right)}
            </div>
            <div style={{ position: "absolute", bottom: "10px", right: "20px", fontSize: "10px", opacity: 0.5 }}>Page {i + 1} of {pages.length}</div>
        </div>
    ));

    const Measurer = () => (
        <div className="resume-measurer" style={{ position: "absolute", top: -10000, left: -10000, width: "210mm", visibility: "hidden" }}>
            <div className="page-height-marker" style={{ height: "297mm", width: "1px", position: "absolute", left: 0, top: 0 }}></div>
            <div style={{ ...styles.page, height: "auto" }}>
                <div style={styles.sidebar} data-column-id="left">
                    {personal?.photo && <div style={styles.photoContainer}><div style={styles.photo} /></div>}
                    {renderZone('left')}
                </div>
                <div style={styles.mainContent} data-column-id="right">
                    {renderHeader()}
                    {renderZone('right')}
                </div>
            </div>
        </div>
    );

    return (
        <div ref={containerRef} className="executive-sidebar-root">
            <Measurer />
            <DndContext {...dndContextProps}>
                <SortableContext items={[...activeLeftSections, ...activeRightSections]} strategy={verticalListSortingStrategy}>
                    {showPageBreaks ? paginatedLayout : fullLayout}
                </SortableContext>
                <StableResumeDragOverlay
                    activeId={activeId}
                    scale={scale}
                    renderSection={(id) => (
                        <div className="dragging-preview">
                            <SectionRenderer sectionId={id} data={data} />
                        </div>
                    )}
                />
            </DndContext>
        </div>
    );
};

export default ExecutiveSidebar;
