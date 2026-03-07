import React from "react";
import { DndContext } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SectionWrapper from "../../components/SectionWrapper";
import { useResumeDragAndDrop, DroppableZone, StableResumeDragOverlay } from "../../hooks/useResumeDragAndDrop";
import DraggableSection from "../../components/dnd/DraggableSection";
import SectionRenderer from "../common/SectionRenderer";
import { SpellCheckText, RichTextSpellCheck, SectionTitle } from "../common/BaseComponents";
import SpellCheckHighlighter from "../../components/SpellCheckHighlighter";
import { MapPin, Phone, Mail, Linkedin, Github, Globe } from "lucide-react";

/**
 * Unique local renderer for Projects in Executive Minimalist.
 * Demonstrates the power of "Template-First" customization.
 */
const MinimalProjectItem = ({ item, isSpellCheckActive, onSpellCheckIgnore, onSpellCheckReplace }) => (
    <div style={{ marginBottom: "25px" }}>
        <h4 style={{ margin: "0 0 5px 0", fontSize: "calc(1.1em * var(--theme-font-scale, 1))", fontWeight: "700", display: "flex", justifyContent: "space-between", color: "var(--theme-color)" }}>
            <SpellCheckText
                text={item.title}
                isActive={isSpellCheckActive}
                onIgnore={onSpellCheckIgnore}
                onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('title', val)}
            />
            <span style={{ fontSize: "calc(0.8em * var(--theme-font-scale, 1))", opacity: 0.6, fontWeight: "500" }}>
                <SpellCheckText
                    text={item.year || (item.startYear && `${item.startYear} - ${item.endYear || 'Present'}`)}
                    isActive={isSpellCheckActive}
                    onIgnore={onSpellCheckIgnore}
                    onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace(item.year ? 'year' : 'date', val)}
                />
            </span>
        </h4>
        <div style={{ fontSize: "calc(0.95em * var(--theme-font-scale, 1))", color: "var(--theme-text)", opacity: 0.9 }}>
            <RichTextSpellCheck
                html={item.description}
                isActive={isSpellCheckActive}
                onIgnore={onSpellCheckIgnore}
                onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('description', val)}
            />
        </div>
    </div>
);

/**
 * Unique local renderer for Education in Executive Minimalist.
 */
const MinimalEducationItem = ({ item, isSpellCheckActive, onSpellCheckIgnore, onSpellCheckReplace }) => {
    const eduDate = item.year || item.date || (item.endYear ? (item.startYear ? `${item.startYear} - ${item.endYear}` : item.endYear) : '');
    return (
        <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2px" }}>
                <h4 style={{ margin: 0, fontSize: "calc(1.1em * var(--theme-font-scale, 1))", fontWeight: "700", color: "var(--theme-color)" }}>
                    <SpellCheckText
                        text={item.degree}
                        isActive={isSpellCheckActive}
                        onIgnore={onSpellCheckIgnore}
                        onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('degree', val)}
                    />
                    {item.field && <span style={{ fontWeight: "400", opacity: 0.8 }}> — <SpellCheckText
                        text={item.field}
                        isActive={isSpellCheckActive}
                        onIgnore={onSpellCheckIgnore}
                        onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('field', val)}
                    /></span>}
                </h4>
                <span style={{ fontSize: "calc(0.85em * var(--theme-font-scale, 1))", fontWeight: "500", opacity: 0.6 }}>
                    <SpellCheckText
                        text={eduDate}
                        isActive={isSpellCheckActive}
                        onIgnore={onSpellCheckIgnore}
                        onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace(item.year ? 'year' : 'date', val)}
                    />
                </span>
            </div>
            <div style={{ fontSize: "calc(0.95em * var(--theme-font-scale, 1))", fontWeight: "600", color: "var(--theme-text)" }}>
                <SpellCheckText
                    text={item.institution || item.school}
                    isActive={isSpellCheckActive}
                    onIgnore={onSpellCheckIgnore}
                    onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace(item.institution ? 'institution' : 'school', val)}
                />
                {(item.city || item.location) && <span style={{ fontWeight: "400", opacity: 0.7 }}>, <SpellCheckText
                    text={item.city || item.location}
                    isActive={isSpellCheckActive}
                    onIgnore={onSpellCheckIgnore}
                    onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace(item.city ? 'city' : 'location', val)}
                /></span>}
            </div>
            {item.grade && (
                <div style={{ fontSize: "calc(0.9em * var(--theme-font-scale, 1))", color: "var(--theme-text)", opacity: 0.7, fontStyle: "italic", marginTop: "2px" }}>
                    <SpellCheckText
                        text={`GPA: ${item.grade}`}
                        isActive={isSpellCheckActive}
                        onIgnore={onSpellCheckIgnore}
                        onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('grade', val.replace("GPA: ", ""))}
                    />
                </div>
            )}
            {item.description && (
                <div style={{ fontSize: "calc(0.9em * var(--theme-font-scale, 1))", color: "var(--theme-text)", opacity: 0.8, marginTop: "6px" }}>
                    <RichTextSpellCheck
                        html={item.description}
                        isActive={isSpellCheckActive}
                        onIgnore={onSpellCheckIgnore}
                        onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('description', val)}
                    />
                </div>
            )}
        </div>
    );
};

/**
 * Unique local renderer for Languages.
 * Demonstrates a "Pill" style unique to this template.
 */
const MinimalLanguageItem = ({ item, isSpellCheckActive, onSpellCheckIgnore, onSpellCheckReplace }) => (
    <div style={{
        display: "inline-block",
        margin: "0 10px 10px 0",
        padding: "5px 15px",
        border: "1px solid var(--theme-color)",
        borderRadius: "20px",
        fontSize: "calc(0.9em * var(--theme-font-scale, 1))",
        color: "var(--theme-color)",
        fontWeight: "600"
    }}>
        <SpellCheckText
            text={typeof item === 'object' ? item.name : item}
            isActive={isSpellCheckActive}
            onIgnore={onSpellCheckIgnore}
            onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace(typeof item === 'object' ? 'name' : null, val)}
        />
        {item.level && <span style={{ fontWeight: "400", opacity: 0.7, marginLeft: "5px" }}>— <SpellCheckText
            text={item.level}
            isActive={isSpellCheckActive}
            onIgnore={onSpellCheckIgnore}
            onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('level', val)}
        /></span>}
    </div>
);

/**
 * ExecutiveMinimalist Template
 * A sophisticated, single-column template designed for high-level professionals.
 * Focuses on typography and clear hierarchy.
 */
const ExecutiveMinimalist = ({ data, onSectionClick, onReorder, scale = 1, isSpellCheckActive, onSpellCheckIgnore, onSpellCheckReplace, layoutConfig }) => {
    if (!data) return null;

    const isInteractive = !!onSectionClick && !isSpellCheckActive;
    const canReorder = !!onReorder && !isSpellCheckActive;

    const { personal, websites } = data;

    const sectionVariants = {
        experience: 'minimal',
        education: 'minimal',
        skills: 'list'
    };

    // Custom renderers local to this template
    const customRenderers = {
        education: () => data.education?.length > 0 && (
            <SectionWrapper sectionId="education" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Education">
                <div style={{ marginBottom: "calc(15px * var(--theme-section-margin, 1))" }}>
                    <SectionTitle title="Education" />
                    {data.education.map((edu, idx) => (
                        <MinimalEducationItem
                            key={idx}
                            item={edu}
                            isSpellCheckActive={isSpellCheckActive}
                            onSpellCheckIgnore={onSpellCheckIgnore}
                            onSpellCheckReplace={(field, val) => onSpellCheckReplace && onSpellCheckReplace('education', idx, val, field)}
                        />
                    ))}
                </div>
            </SectionWrapper>
        ),
        projects: () => data.projects?.length > 0 && (
            <SectionWrapper sectionId="projects" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Projects">
                <div style={{ marginBottom: "calc(15px * var(--theme-section-margin, 1))" }}>
                    <SectionTitle title="Key Projects" />
                    {data.projects.map((proj, idx) => (
                        <MinimalProjectItem
                            key={idx}
                            item={proj}
                            isSpellCheckActive={isSpellCheckActive}
                            onSpellCheckIgnore={onSpellCheckIgnore}
                            onSpellCheckReplace={(field, val) => onSpellCheckReplace && onSpellCheckReplace('projects', idx, val, field)}
                        />
                    ))}
                </div>
            </SectionWrapper>
        ),
        languages: () => data.languages?.length > 0 && (
            <SectionWrapper sectionId="languages" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Languages">
                <div style={{ marginBottom: "calc(15px * var(--theme-section-margin, 1))" }}>
                    <SectionTitle title="Languages" />
                    <div>
                        {data.languages.map((lang, idx) => (
                            <MinimalLanguageItem
                                key={idx}
                                item={lang}
                                isSpellCheckActive={isSpellCheckActive}
                                onSpellCheckIgnore={onSpellCheckIgnore}
                                onSpellCheckReplace={(field, val) => onSpellCheckReplace && onSpellCheckReplace('languages', idx, val, field)}
                            />
                        ))}
                    </div>
                </div>
            </SectionWrapper>
        )
    };

    // --- DEFAULTS ---
    const SORTABLE_KEY = "{{SORTABLE}}";
    const defaultLayout = {
        main: [SORTABLE_KEY]
    };

    const layout = layoutConfig || defaultLayout;

    // --- ORDERING LOGIC ---
    // --- ORDERING LOGIC ---
    const allKnownSections = [
        'summary', 'experience', 'education', 'skills', 'projects', 'languages',
        'certifications', 'interests', 'websites', 'software', 'affiliations',
        'strengths', 'additionalSkills', 'keyAchievements', 'accomplishments', 'additionalInfo', 'custom'
    ];

    // Priority 1: Template-specific record
    // Priority 2: Global order (legacy)
    // Priority 3: All known sections
    const templateSpecificLayout = data.templateLayouts?.['executive-minimalist'] || {};
    let currentOrder = [...(templateSpecificLayout.mainSectionsOrder || data.mainSectionsOrder || allKnownSections)];

    // Ensure all data-containing sections are in the list if not already there
    allKnownSections.forEach(sid => {
        if (!currentOrder.includes(sid)) {
            currentOrder.push(sid);
        }
    });

    // --- SYNC ORDERS BACK TO PARENT ---
    // Only sync if we've added new discovery sections or if this template doesn't have a specific record yet
    React.useEffect(() => {
        const hasTemplateRecord = !!data.templateLayouts?.['executive-minimalist'];
        if (!hasTemplateRecord && onReorder) {
            onReorder({
                mainSectionsOrder: currentOrder
            });
        }
    }, [onReorder]);

    // --- DATA VISIBILITY CHECK ---
    const hasSectionData = (sid) => {
        const sData = data[sid];
        if (!sData) return false;

        if (Array.isArray(sData)) return sData.length > 0;
        if (typeof sData === 'string') return sData.trim().length > 0;

        // Special cases
        if (sid === 'custom') return data.customSection && data.customSection.isVisible;
        if (sid === 'websites') {
            return websites && websites.filter(w => !w.addToHeader).length > 0;
        }

        return true;
    };

    const activeSections = currentOrder.filter(hasSectionData);

    const { dndContextProps, activeId, dragStartContainerId } = useResumeDragAndDrop({
        data,
        onReorder,
        scale,
        containers: {
            main: activeSections
        }
    });

    return (
        <div style={{
            minHeight: "100%",
            width: "100%",
            fontFamily: "var(--theme-font, 'Merriweather', serif)",
            background: "var(--theme-background, white)",
            color: "var(--theme-text, #0f172a)",
            padding: "var(--theme-page-margin, 50px)",
            boxSizing: "border-box",
            lineHeight: "var(--theme-line-height, 1.6)"
        }}>
            <DndContext {...dndContextProps}>

                {/* --- HEADER --- */}
                <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Header">
                    <header style={{ textAlign: "center", borderBottom: "2px solid var(--theme-color)", paddingBottom: "30px", marginBottom: "40px" }}>
                        <h1 style={{
                            fontSize: "calc(3.2em * var(--theme-font-scale, 1))",
                            fontWeight: "300",
                            margin: "0 0 10px 0",
                            color: "var(--theme-color)",
                            letterSpacing: "2px",
                            textTransform: "uppercase"
                        }}>
                            <SpellCheckHighlighter
                                text={personal?.name}
                                isActive={isSpellCheckActive}
                                onIgnore={onSpellCheckIgnore}
                                onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('personal', 'name', val)}
                            />
                        </h1>
                        <p style={{ fontSize: "calc(1.2em * var(--theme-font-scale, 1))", fontWeight: "600", opacity: 0.8, textTransform: "uppercase", letterSpacing: "3px", marginBottom: "20px" }}>
                            <SpellCheckHighlighter
                                text={personal?.profession}
                                isActive={isSpellCheckActive}
                                onIgnore={onSpellCheckIgnore}
                                onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('personal', 'profession', val)}
                            />
                        </p>

                        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px", fontSize: "calc(0.9em * var(--theme-font-scale, 1))", color: "var(--theme-text)" }}>
                            {personal?.email && (<span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Mail size={14} />
                                <SpellCheckHighlighter
                                    text={personal.email}
                                    isActive={isSpellCheckActive}
                                    onIgnore={onSpellCheckIgnore}
                                    onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('personal', 'email', val)}
                                />
                            </span>)}
                            {personal?.phone && (<span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Phone size={14} />
                                <SpellCheckHighlighter
                                    text={personal.phone}
                                    isActive={isSpellCheckActive}
                                    onIgnore={onSpellCheckIgnore}
                                    onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('personal', 'phone', val)}
                                />
                            </span>)}
                            {personal?.city && (<span style={{ display: "flex", alignItems: "center", gap: "6px" }}><MapPin size={14} />
                                <SpellCheckHighlighter
                                    text={`${personal.city}${personal.country ? ', ' + personal.country : ''}`}
                                    isActive={isSpellCheckActive}
                                    onIgnore={onSpellCheckIgnore}
                                    onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('personal', 'city', val.split(',')[0].trim())}
                                />
                            </span>)}
                        </div>

                        {/* Additional Personal Info (DOB, Nationality, etc.) */}
                        {(personal?.dob || personal?.nationality || personal?.gender || personal?.religion) && (
                            <div style={{ marginTop: "15px", display: "flex", justifyContent: "center", gap: "15px", fontSize: "calc(0.85em * var(--theme-font-scale, 1))", opacity: 0.7 }}>
                                {personal.dob && <span>DOB: <SpellCheckHighlighter text={personal.dob} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'dob', val)} /></span>}
                                {personal.nationality && <span>Nationality: <SpellCheckHighlighter text={personal.nationality} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'nationality', val)} /></span>}
                                {personal.religion && <span>Religion: <SpellCheckHighlighter text={personal.religion} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('personal', 'religion', val)} /></span>}
                            </div>
                        )}
                    </header>
                </SectionWrapper>

                {/* --- MAIN CONTENT (DRAGGABLE) --- */}
                <DroppableZone id="main" style={{ display: "flex", flexDirection: "column", gap: "calc(30px * var(--theme-section-margin, 1))" }}>
                    <SortableContext items={activeSections} strategy={verticalListSortingStrategy} id="main">
                        {activeSections.map(sid => (
                            <DraggableSection key={sid} id={sid} isEnabled={canReorder}>
                                <SectionRenderer
                                    sectionId={sid}
                                    data={data}
                                    onSectionClick={onSectionClick}
                                    isSpellCheckActive={isSpellCheckActive}
                                    onSpellCheckIgnore={onSpellCheckIgnore}
                                    onSpellCheckReplace={onSpellCheckReplace}
                                    variants={sectionVariants}
                                    customRenderers={customRenderers}
                                />
                            </DraggableSection>
                        ))}
                    </SortableContext>
                </DroppableZone>

                {/* Drag Overlay */}
                <StableResumeDragOverlay
                    activeId={activeId}
                    dragStartContainerId={dragStartContainerId}
                    scale={scale}
                    renderSection={(id) => (
                        <div style={{
                            width: "600px",
                            background: "white",
                            padding: "20px",
                            borderRadius: "4px",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                            borderLeft: "4px solid var(--theme-color)",
                            opacity: 0.9
                        }}>
                            <SectionRenderer sectionId={id} data={data} onSectionClick={null} isSpellCheckActive={false} />
                        </div>
                    )} />

            </DndContext>
        </div>
    );
};

export default ExecutiveMinimalist;
