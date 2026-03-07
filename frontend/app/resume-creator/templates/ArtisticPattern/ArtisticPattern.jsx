import React from "react";
import { DndContext } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useResumeDragAndDrop, DroppableZone, StableResumeDragOverlay } from "../../hooks/useResumeDragAndDrop";
import DraggableSection from "../../components/dnd/DraggableSection";
import SectionRenderer from "../common/SectionRenderer";
import SectionWrapper from "../../components/SectionWrapper";
import { SectionTitle, SpellCheckText, RichTextSpellCheck } from "../common/BaseComponents";

/**
 * ArtisticPattern Template
 * Inspired by the provided image featuring:
 * - Top decorative beige bar
 * - Geometric pattern in top-left sidebar area
 * - Large elegant serif name in top-right
 * - Unique section header styles (Black line for sidebar, Blue line for main)
 */
const ArtisticPattern = ({ data, onSectionClick, onReorder, scale = 1, isSpellCheckActive, onSpellCheckIgnore, onSpellCheckReplace, layoutConfig }) => {
    if (!data) return null;

    const { personal } = data;
    const canReorder = !!onReorder && !isSpellCheckActive;
    const isInteractive = !!onSectionClick && !isSpellCheckActive;

    // --- 1. OVERRIDES FOR THIS TEMPLATE ---
    const customRenderers = {
        summary: () => data.summary && (
            <SectionWrapper sectionId="summary" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Summary">
                <div style={{ marginBottom: "calc(30px * var(--theme-section-margin, 1))" }}>
                    <div className="resume-rich-text" style={{ fontSize: "var(--item-base-size, 13px)", lineHeight: "1.6", color: "#334155" }}>
                        <RichTextSpellCheck
                            html={data.summary}
                            isActive={isSpellCheckActive}
                            onIgnore={onSpellCheckIgnore}
                            onReplace={(val) => onSpellCheckReplace('summary', 'summary', val)}
                        />
                    </div>
                </div>
            </SectionWrapper>
        ),
        experience: () => data.experience?.length > 0 && (
            <SectionWrapper sectionId="experience" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Experience">
                <div style={{ marginBottom: "calc(25px * var(--theme-section-margin, 1))" }}>
                    <SectionTitle
                        title="WORK HISTORY"
                        style={{
                            borderBottom: '1.5px solid var(--theme-color)',
                            fontSize: '18px',
                            color: 'var(--theme-color)',
                            paddingBottom: '4px',
                            letterSpacing: '0.5px'
                        }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        {data.experience.map((exp, index) => (
                            <div key={index}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#000', textTransform: 'uppercase' }}>
                                        <SpellCheckText text={exp.title} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', index, val, 'title')} />
                                    </h4>
                                    <div style={{ fontSize: '11px', color: '#475569', fontWeight: '600', textTransform: 'uppercase' }}>
                                        <SpellCheckText text={`${exp.startMonth} ${exp.startYear} - ${exp.isCurrent ? 'Current' : `${exp.endMonth} ${exp.endYear}`}`} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', index, val, 'date')} />
                                    </div>
                                </div>
                                <div style={{ fontSize: '14px', color: '#475569', marginBottom: '8px', fontWeight: '500' }}>
                                    <SpellCheckText text={exp.company} isActive={isSpellCheckActive} />
                                    {exp.location && <span> | <SpellCheckText text={exp.location} isActive={isSpellCheckActive} /></span>}
                                </div>
                                <div className="resume-rich-text" style={{ fontSize: '13px', lineHeight: '1.5', color: '#334155' }}>
                                    <RichTextSpellCheck html={exp.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', index, val, 'description')} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </SectionWrapper>
        ),
        education: () => data.education?.length > 0 && (
            <SectionWrapper sectionId="education" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Education">
                <div style={{ marginBottom: "calc(25px * var(--theme-section-margin, 1))" }}>
                    <SectionTitle
                        title="EDUCATION"
                        style={{
                            borderBottom: '1px solid #000',
                            fontSize: '16px',
                            color: 'var(--theme-color)',
                            textTransform: 'uppercase'
                        }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {data.education.map((edu, index) => (
                            <div key={index} style={{ marginBottom: '8px' }}>
                                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>
                                    <SpellCheckText
                                        text={`${edu.startMonth ? edu.startMonth + ' ' : ''}${edu.startYear}${edu.endYear ? ` - ${edu.endMonth ? edu.endMonth + ' ' : ''}${edu.endYear}` : ' - Present'}`}
                                        isActive={isSpellCheckActive}
                                    />
                                </div>
                                <h4 style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: '700', color: '#000' }}>
                                    <SpellCheckText text={edu.degree || edu.field} isActive={isSpellCheckActive} />
                                </h4>
                                <div style={{ fontSize: '13px', color: '#334155', lineHeight: '1.4' }}>
                                    <SpellCheckText text={`${edu.school}${edu.city ? `, ${edu.city}` : ''}`} isActive={isSpellCheckActive} />
                                </div>
                                {edu.grade && (
                                    <div style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic', marginTop: '2px' }}>
                                        <SpellCheckText text={`Grade: ${edu.grade}`} isActive={isSpellCheckActive} />
                                    </div>
                                )}
                                {edu.description && (
                                    <div className="resume-rich-text" style={{ fontSize: '13px', lineHeight: '1.5', color: '#334155', marginTop: '4px' }}>
                                        <RichTextSpellCheck
                                            html={edu.description}
                                            isActive={isSpellCheckActive}
                                            onIgnore={onSpellCheckIgnore}
                                            onReplace={(val) => onSpellCheckReplace('education', index, val, 'description')}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </SectionWrapper>
        ),
        skills: () => data.skills?.length > 0 && (
            <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Skills">
                <div style={{ marginBottom: "calc(25px * var(--theme-section-margin, 1))" }}>
                    <SectionTitle
                        title="SKILLS"
                        style={{
                            borderBottom: '1px solid #000',
                            fontSize: '16px',
                            color: 'var(--theme-color)',
                            textTransform: 'uppercase'
                        }}
                    />
                    <ul style={{ paddingLeft: '15px', margin: 0, fontSize: '13px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {data.skills.map((skill, index) => (
                            <li key={index} style={{ listStyleType: 'disc' }}>
                                <SpellCheckText text={typeof skill === 'string' ? skill : skill.name} isActive={isSpellCheckActive} />
                            </li>
                        ))}
                    </ul>
                </div>
            </SectionWrapper>
        )
    };

    // --- 2. LAYOUT LOGIC ---
    const SORTABLE_KEY = "{{SORTABLE}}";

    // Default layout matches the image
    const layout = layoutConfig || {
        main: [SORTABLE_KEY],
        sidebar: ['summary', 'skills', 'education', SORTABLE_KEY]
    };

    const templateId = 'artistic-pattern';
    const templateSpecificLayout = data.templateLayouts?.[templateId] || {};
    const mainOrder = [...(templateSpecificLayout.mainSectionsOrder || ['experience', 'projects', 'certifications'])];
    const sidebarOrder = [...(templateSpecificLayout.sidebarSectionsOrder || ['languages', 'interests', 'software'])];

    const { dndContextProps, activeId, dragStartContainerId } = useResumeDragAndDrop({
        data,
        onReorder: (newOrders) => onReorder?.(newOrders, templateId),
        scale,
        containers: {
            main: mainOrder.filter(id => data[id]?.length > 0),
            sidebar: sidebarOrder.filter(id => data[id]?.length > 0)
        }
    });

    return (
        <div style={{
            minHeight: "100%",
            width: "100%",
            background: "#ffffff",
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            position: 'relative',
            borderTop: '8px solid #d6d3d1', // The beige top bar
            '--section-title-font': "'Inter', sans-serif",
            '--section-title-weight': '700',
            '--section-title-transform': 'none',
            '--section-title-spacing': '0px',
            '--section-title-margin': '15px'
        }}>
            <DndContext {...dndContextProps}>

                {/* --- HEADER --- */}
                <div style={{ padding: '60px 60px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    {/* Pattern Area (Left) */}
                    <div style={{
                        width: '240px',
                        height: '180px',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        zIndex: 0,
                        opacity: 0.15,
                        background: `radial-gradient(circle at 50% 50%, transparent 40%, var(--theme-color) 41%, var(--theme-color) 45%, transparent 46%)`,
                        backgroundSize: '40px 40px',
                        maskImage: 'radial-gradient(ellipse at left top, black 20%, transparent 80%)'
                    }}></div>

                    <div style={{ flex: 1 }}></div>

                    {/* Personal Info Area (Right) */}
                    <header style={{ textAlign: 'right', position: 'relative', zIndex: 1 }}>
                        <h1 style={{
                            fontSize: '60px',
                            fontFamily: 'var(--theme-font, Playfair Display, serif)',
                            margin: 0,
                            color: '#000',
                            lineHeight: 1.1,
                            fontWeight: '700'
                        }}>
                            <SpellCheckText
                                text={personal?.name || "Saanvi Patel"}
                                isActive={isSpellCheckActive}
                                onIgnore={onSpellCheckIgnore}
                                onReplace={(val) => onSpellCheckReplace('personal', 'name', val)}
                            />
                        </h1>
                        <p style={{
                            margin: '8px 0 20px',
                            fontSize: '20px',
                            fontWeight: '800',
                            color: '#94a3b8',
                            textTransform: 'uppercase',
                            letterSpacing: '2px'
                        }}>
                            <SpellCheckText
                                text={personal?.profession || "PROFESSION"}
                                isActive={isSpellCheckActive}
                                onIgnore={onSpellCheckIgnore}
                                onReplace={(val) => onSpellCheckReplace('personal', 'profession', val)}
                            />
                        </p>
                        <div style={{ fontSize: '13px', color: '#334155', fontWeight: '500', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <SpellCheckText text={personal?.email} isActive={isSpellCheckActive} />
                            <SpellCheckText text={personal?.phone} isActive={isSpellCheckActive} />
                        </div>
                    </header>
                </div>

                {/* --- CONTENT AREA --- */}
                <div style={{ display: 'flex', position: 'relative', zIndex: 1, padding: '0 60px var(--theme-page-margin, 60px)' }}>

                    {/* SIDEBAR (35%) */}
                    <div style={{ width: '35%', paddingRight: '40px' }}>
                        <DroppableZone id="sidebar">
                            {layout.sidebar.map(sid => {
                                if (sid === SORTABLE_KEY) {
                                    return (
                                        <SortableContext key="side-sort" items={sidebarOrder} strategy={verticalListSortingStrategy} id="sidebar">
                                            {sidebarOrder.map(subid => (
                                                <DraggableSection key={subid} id={subid} isEnabled={canReorder}>
                                                    <SectionRenderer
                                                        sectionId={subid}
                                                        data={data}
                                                        onSectionClick={onSectionClick}
                                                        isSpellCheckActive={isSpellCheckActive}
                                                        onIgnore={onSpellCheckIgnore}
                                                        onReplace={onSpellCheckReplace}
                                                        customRenderers={customRenderers}
                                                    />
                                                </DraggableSection>
                                            ))}
                                        </SortableContext>
                                    );
                                }
                                return (
                                    <SectionRenderer
                                        key={sid}
                                        sectionId={sid}
                                        data={data}
                                        onSectionClick={onSectionClick}
                                        isSpellCheckActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onReplace={onSpellCheckReplace}
                                        customRenderers={customRenderers}
                                    />
                                );
                            })}
                        </DroppableZone>
                    </div>

                    {/* MAIN (65%) */}
                    <div style={{ width: '65%', borderLeft: '1px solid #f1f5f9', paddingLeft: '40px' }}>
                        <DroppableZone id="main">
                            {layout.main.map(sid => {
                                if (sid === SORTABLE_KEY) {
                                    return (
                                        <SortableContext key="main-sort" items={mainOrder} strategy={verticalListSortingStrategy} id="main">
                                            {mainOrder.map(subid => (
                                                <DraggableSection key={subid} id={subid} isEnabled={canReorder}>
                                                    <SectionRenderer
                                                        sectionId={subid}
                                                        data={data}
                                                        onSectionClick={onSectionClick}
                                                        isSpellCheckActive={isSpellCheckActive}
                                                        onIgnore={onSpellCheckIgnore}
                                                        onReplace={onSpellCheckReplace}
                                                        customRenderers={customRenderers}
                                                    />
                                                </DraggableSection>
                                            ))}
                                        </SortableContext>
                                    );
                                }
                                return (
                                    <SectionRenderer
                                        key={sid}
                                        sectionId={sid}
                                        data={data}
                                        onSectionClick={onSectionClick}
                                        isSpellCheckActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onReplace={onSpellCheckReplace}
                                        customRenderers={customRenderers}
                                    />
                                );
                            })}
                        </DroppableZone>
                    </div>
                </div>

                <StableResumeDragOverlay
                    activeId={activeId}
                    dragStartContainerId={dragStartContainerId}
                    scale={scale}
                    renderSection={(id) => (
                        <div style={{ background: 'white', padding: '15px', border: '1px solid #e2e8f0', borderRadius: '4px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', opacity: 0.9 }}>
                            <SectionRenderer sectionId={id} data={data} customRenderers={customRenderers} />
                        </div>
                    )}
                />
            </DndContext>
        </div>
    );
};

export default ArtisticPattern;
