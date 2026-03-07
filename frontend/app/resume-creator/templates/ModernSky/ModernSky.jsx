import React from "react";
import { DndContext } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useResumeDragAndDrop, DroppableZone, StableResumeDragOverlay } from "../../hooks/useResumeDragAndDrop";
import DraggableSection from "../../components/dnd/DraggableSection";
import SectionRenderer from "../common/SectionRenderer";
import SectionWrapper from "../../components/SectionWrapper";
import { SectionTitle, SpellCheckText, RichTextSpellCheck } from "../common/BaseComponents";
import { Mail, Phone, MapPin } from "lucide-react";

/**
 * ModernSky Template
 * Features a light-blue header with a prominent contact bar and a two-column layout.
 * Default margin is 0 but adjustable via theme variables.
 */
const ModernSky = ({ data, onSectionClick, onReorder, scale = 1, isSpellCheckActive, onSpellCheckIgnore, onSpellCheckReplace, layoutConfig }) => {
    if (!data) return null;

    const { personal } = data;
    const canReorder = !!onReorder && !isSpellCheckActive;
    const isInteractive = !!onSectionClick && !isSpellCheckActive;

    // --- 1. THEME & VARIANTS ---
    const sectionVariants = {
        experience: 'classic',
        education: 'classic',
        skills: 'bullets'
    };

    // --- 2. UNIQUE COMPONENTS FOR THIS TEMPLATE ---
    const customRenderers = {
        summary: () => data.summary && (
            <SectionWrapper sectionId="summary" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Summary">
                <div style={{ marginBottom: "calc(25px * var(--theme-section-margin, 1))" }}>
                    <SectionTitle title="PROFESSIONAL SUMMARY" />
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
                <div style={{ marginBottom: "calc(20px * var(--theme-section-margin, 1))" }}>
                    <SectionTitle title="WORK HISTORY" />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {data.experience.map((exp, index) => (
                            <div key={index} style={{ marginBottom: '10px' }}>
                                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '2px' }}>
                                    <SpellCheckText text={`${exp.startMonth} ${exp.startYear} - ${exp.isCurrent ? 'Current' : `${exp.endMonth} ${exp.endYear}`}`} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', index, val, 'date')} />
                                </div>
                                <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: '700', color: '#000' }}>
                                    <SpellCheckText text={`${exp.title}, `} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', index, val.replace(', ', ''), 'title')} />
                                    <span style={{ fontWeight: '400' }}>
                                        <SpellCheckText text={`${exp.company}${exp.location ? `, ${exp.location}` : ''}`} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', index, val, 'company')} />
                                    </span>
                                </h4>
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
                <div style={{ marginBottom: "calc(20px * var(--theme-section-margin, 1))" }}>
                    <SectionTitle title="EDUCATION" />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {data.education.map((edu, index) => (
                            <div key={index}>
                                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
                                    <SpellCheckText text={`${edu.startMonth} ${edu.startYear}`} isActive={isSpellCheckActive} />
                                </div>
                                <h4 style={{ margin: '2px 0', fontSize: '14px', fontWeight: '700', color: '#000' }}>
                                    <SpellCheckText text={`${edu.degree || edu.field}, ${edu.school}`} isActive={isSpellCheckActive} />
                                </h4>
                                <div style={{ fontSize: '13px', color: '#475569' }}>
                                    <SpellCheckText text={`${edu.city}${edu.country ? `, ${edu.country}` : ''}`} isActive={isSpellCheckActive} />
                                </div>
                                {edu.grade && (
                                    <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', marginTop: '2px' }}>
                                        <SpellCheckText text={`GPA: ${edu.grade}`} isActive={isSpellCheckActive} />
                                    </div>
                                )}
                                {edu.description && (
                                    <div className="resume-rich-text" style={{ fontSize: '13px', lineHeight: '1.5', color: '#334155', marginTop: '6px' }}>
                                        <RichTextSpellCheck
                                            html={edu.description}
                                            isActive={isSpellCheckActive}
                                            onIgnore={onSpellCheckIgnore}
                                            onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('education', index, val, 'description')}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </SectionWrapper>
        )
    };

    // --- 3. DND SETUP ---
    const SORTABLE_KEY = "{{SORTABLE}}";
    const layout = layoutConfig || {
        main: ['summary', SORTABLE_KEY],
        sidebar: [SORTABLE_KEY]
    };

    const templateSpecificLayout = data.templateLayouts?.['modern-sky'] || {};
    const mainOrder = [...(templateSpecificLayout.mainSectionsOrder || ['experience', 'projects', 'education'])];
    const sidebarOrder = [...(templateSpecificLayout.sidebarSectionsOrder || ['skills', 'languages', 'interests', 'certifications'])];

    const { dndContextProps, activeId, dragStartContainerId } = useResumeDragAndDrop({
        data,
        onReorder: (newOrders) => onReorder?.(newOrders, 'modern-sky'),
        scale,
        containers: {
            main: mainOrder.filter(id => data[id]?.length > 0 || id === 'summary'),
            sidebar: sidebarOrder.filter(id => data[id]?.length > 0)
        }
    });

    return (
        <div style={{
            minHeight: "100%",
            width: "100%",
            background: "#ffffff",
            fontFamily: "'Inter', sans-serif",
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
            '--section-title-font': "'Inter', sans-serif",
            '--section-title-style': 'normal',
            '--section-title-weight': '700',
            '--section-title-transform': 'uppercase',
            '--section-title-border': 'none',
            '--section-title-color': 'var(--theme-color, #60a5fa)',
            '--section-title-size': '16px',
            '--section-title-spacing': '1px'
        }}>
            <DndContext {...dndContextProps}>

                {/* --- HEADER --- */}
                <div style={{
                    backgroundColor: "#eff6ff", // Light blue background
                    padding: "40px 60px",
                    display: 'flex',
                    alignItems: 'center',
                    gap: '40px'
                }}>
                    {/* Placeholder for Logo/Initial */}
                    <div style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '48px',
                        fontWeight: '900',
                        color: '#d1d5db',
                        fontFamily: 'sans-serif'
                    }}>
                        {personal?.name?.[0] || 'S'}
                    </div>

                    <div style={{ flex: 1 }}>
                        <div style={{ width: '40px', height: '4px', backgroundColor: 'var(--theme-color, #60a5fa)', marginBottom: '10px' }}></div>
                        <h1 style={{
                            margin: 0,
                            fontSize: "42px",
                            fontWeight: '400',
                            color: '#1e293b',
                            fontFamily: 'sans-serif',
                            letterSpacing: '1px'
                        }}>
                            <SpellCheckText
                                text={personal?.name || "Saanvi Patel"}
                                isActive={isSpellCheckActive}
                                onIgnore={onSpellCheckIgnore}
                                onReplace={(val) => onSpellCheckReplace('personal', 'name', val)}
                            />
                        </h1>
                        <p style={{
                            margin: "5px 0 0",
                            fontSize: "18px",
                            color: "#64748b",
                            fontWeight: '600',
                            textTransform: 'capitalize'
                        }}>
                            <SpellCheckText
                                text={personal?.profession || "Profession"}
                                isActive={isSpellCheckActive}
                                onIgnore={onSpellCheckIgnore}
                                onReplace={(val) => onSpellCheckReplace('personal', 'profession', val)}
                            />
                        </p>
                    </div>
                </div>

                {/* --- CONTACT BAR --- */}
                <div style={{
                    backgroundColor: "var(--theme-color, #93c5fd)",
                    padding: "12px 60px",
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: 'white',
                    fontSize: '13px',
                    fontWeight: '500'
                }}>
                    <div>
                        <SpellCheckText text={personal?.phone} isActive={isSpellCheckActive} />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <SpellCheckText text={personal?.email} isActive={isSpellCheckActive} />
                    </div>
                    <div>
                        <SpellCheckText text={`${personal?.city}${personal?.country ? `, ${personal?.country}` : ''}`} isActive={isSpellCheckActive} />
                    </div>
                </div>

                {/* --- CONTENT --- */}
                <div style={{ display: 'flex', flex: 1 }}>

                    {/* SIDEBAR */}
                    <div style={{ width: '280px', backgroundColor: '#eff6ff', padding: '40px 30px' }}>
                        <DroppableZone id="sidebar">
                            <SortableContext items={sidebarOrder} strategy={verticalListSortingStrategy} id="sidebar">
                                {sidebarOrder.map(sid => (
                                    <DraggableSection key={sid} id={sid} isEnabled={canReorder}>
                                        <SectionRenderer
                                            sectionId={sid}
                                            data={data}
                                            onSectionClick={onSectionClick}
                                            isSpellCheckActive={isSpellCheckActive}
                                            onIgnore={onSpellCheckIgnore}
                                            onReplace={onSpellCheckReplace}
                                            customRenderers={customRenderers}
                                            variants={sectionVariants}
                                        />
                                    </DraggableSection>
                                ))}
                            </SortableContext>
                        </DroppableZone>
                    </div>

                    {/* MAIN */}
                    <div style={{ flex: 1, padding: '40px 60px', backgroundColor: 'white' }}>
                        <DroppableZone id="main">
                            <SortableContext items={[...layout.main, ...mainOrder]} strategy={verticalListSortingStrategy} id="main">
                                {layout.main.map((item, idx) => {
                                    if (item === SORTABLE_KEY) {
                                        return mainOrder.map(sid => (
                                            <DraggableSection key={sid} id={sid} isEnabled={canReorder}>
                                                <SectionRenderer
                                                    sectionId={sid}
                                                    data={data}
                                                    onSectionClick={onSectionClick}
                                                    isSpellCheckActive={isSpellCheckActive}
                                                    onIgnore={onSpellCheckIgnore}
                                                    onReplace={onSpellCheckReplace}
                                                    customRenderers={customRenderers}
                                                    variants={sectionVariants}
                                                />
                                            </DraggableSection>
                                        ));
                                    }
                                    return (
                                        <SectionRenderer
                                            key={idx}
                                            sectionId={item}
                                            data={data}
                                            onSectionClick={onSectionClick}
                                            isSpellCheckActive={isSpellCheckActive}
                                            onIgnore={onSpellCheckIgnore}
                                            onReplace={onSpellCheckReplace}
                                            customRenderers={customRenderers}
                                            variants={sectionVariants}
                                        />
                                    );
                                })}
                            </SortableContext>
                        </DroppableZone>
                    </div>
                </div>

                <StableResumeDragOverlay
                    activeId={activeId}
                    dragStartContainerId={dragStartContainerId}
                    scale={scale}
                    renderSection={(id) => (
                        <div style={{ background: 'white', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', opacity: 0.8 }}>
                            <SectionRenderer sectionId={id} data={data} variants={sectionVariants} customRenderers={customRenderers} />
                        </div>
                    )}
                />
            </DndContext>
        </div>
    );
};

export default ModernSky;
