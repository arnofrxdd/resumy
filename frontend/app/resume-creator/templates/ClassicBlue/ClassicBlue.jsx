import React from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useResumeDragAndDrop, DroppableZone, StableResumeDragOverlay } from "../../hooks/useResumeDragAndDrop";
import DraggableSection from "../../components/dnd/DraggableSection";
import SectionRenderer from "../common/SectionRenderer";
import SectionWrapper from "../../components/SectionWrapper";
import { SectionTitle, SpellCheckText, RichTextSpellCheck } from "../common/BaseComponents";
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react";

/**
 * ClassicBlue Template
 * Features a bold light-blue header, two-column layout, and serif typography.
 */
const ClassicBlue = ({ data, onSectionClick, onReorder, scale = 1, isSpellCheckActive, onSpellCheckIgnore, onSpellCheckReplace, layoutConfig }) => {
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
                    <SectionTitle title="Professional Summary" />
                    <div style={{ paddingBottom: '15px', borderBottom: '1px solid #e2e8f0' }}>
                        <div className="resume-rich-text" style={{ fontSize: "var(--item-base-size, 13px)", lineHeight: "1.6", color: "#475569" }}>
                            <RichTextSpellCheck
                                html={data.summary}
                                isActive={isSpellCheckActive}
                                onIgnore={onSpellCheckIgnore}
                                onReplace={(val) => onSpellCheckReplace('summary', 'summary', val)}
                            />
                        </div>
                    </div>
                </div>
            </SectionWrapper>
        ),
        experience: () => data.experience?.length > 0 && (
            <SectionWrapper sectionId="experience" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Experience">
                <div style={{ marginBottom: "calc(20px * var(--theme-section-margin, 1))" }}>
                    <SectionTitle title="Work History" />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        {data.experience.map((exp, index) => (
                            <div key={index}>
                                <h4 style={{ margin: '0 0 5px 0', fontSize: '15px', fontWeight: '700', color: '#334155' }}>
                                    <SpellCheckText text={`${exp.company}${exp.title ? ` - ${exp.title}` : ''}`} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => {
                                        const [comp, ...titleParts] = val.split(' - ');
                                        onSpellCheckReplace('experience', index, comp, 'company');
                                        if (titleParts.length) onSpellCheckReplace('experience', index, titleParts.join(' - '), 'title');
                                    }} />
                                </h4>
                                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>
                                    <SpellCheckText text={exp.location} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', index, val, 'location')} />
                                </div>
                                <div style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic', marginBottom: '8px' }}>
                                    <SpellCheckText text={`${exp.startMonth} ${exp.startYear} - ${exp.isCurrent ? 'Current' : `${exp.endMonth} ${exp.endYear}`}`} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', index, val, 'date')} />
                                </div>
                                <div className="resume-rich-text" style={{ fontSize: '13px', lineHeight: '1.5', color: '#475569' }}>
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
                    <SectionTitle title="Education" />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {data.education.map((edu, index) => (
                            <div key={index}>
                                <div style={{ fontSize: '13px', color: '#64748b' }}>
                                    <SpellCheckText text={`${edu.startMonth} ${edu.startYear}`} isActive={isSpellCheckActive} />
                                </div>
                                <h4 style={{ margin: '4px 0', fontSize: '14px', fontWeight: '700', color: '#334155' }}>
                                    <SpellCheckText text={`${edu.school}${edu.degree ? `, ${edu.degree}` : ''}`} isActive={isSpellCheckActive} />
                                </h4>
                                <div style={{ fontSize: '13px', color: '#64748b' }}>
                                    <SpellCheckText text={edu.city} isActive={isSpellCheckActive} />
                                </div>
                                {edu.grade && (
                                    <div style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic', marginTop: '2px' }}>
                                        <SpellCheckText text={`GPA: ${edu.grade}`} isActive={isSpellCheckActive} />
                                    </div>
                                )}
                                {edu.field && (
                                    <div style={{ fontSize: '13px', color: '#444', marginTop: '2px' }}>
                                        <SpellCheckText text={`${edu.degree}: ${edu.field}`} isActive={isSpellCheckActive} />
                                    </div>
                                )}
                                {edu.description && (
                                    <div className="resume-rich-text" style={{ fontSize: '13px', lineHeight: '1.5', color: '#475569', marginTop: '6px' }}>
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
    const defaultLayout = {
        main: ['summary', SORTABLE_KEY],
        sidebar: ['personal', SORTABLE_KEY]
    };
    const layout = layoutConfig || defaultLayout;

    const templateSpecificLayout = data.templateLayouts?.['classic-blue'] || {};
    const mainOrder = [...(templateSpecificLayout.mainSectionsOrder || ['experience', 'projects', 'keyAchievements'])];
    const sidebarOrder = [...(templateSpecificLayout.sidebarSectionsOrder || ['skills', 'education', 'languages'])];

    const { dndContextProps, activeId, dragStartContainerId } = useResumeDragAndDrop({
        data,
        onReorder: (newOrders) => onReorder?.(newOrders, 'classic-blue'),
        scale,
        containers: {
            main: mainOrder.filter(id => data[id]?.length > 0 || id === 'summary'),
            sidebar: sidebarOrder.filter(id => data[id]?.length > 0)
        }
    });

    const initials = personal?.name ? personal.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'SP';

    return (
        <div style={{
            minHeight: "100%",
            width: "100%",
            background: "#ffffff",
            fontFamily: "'Inter', sans-serif",
            display: 'flex',
            flexDirection: 'column',
            border: '8px solid #cbd5e1',
            boxSizing: 'border-box',
            // --- TEMPLATE-LEVEL OVERRIDES ---
            '--section-title-font': 'serif',
            '--section-title-style': 'italic',
            '--section-title-weight': '500',
            '--section-title-transform': 'none',
            '--section-title-border': 'none',
            '--section-title-color': '#475569',
            '--section-title-size': '18px',
            '--section-title-spacing': '0px'
        }}>
            <DndContext {...dndContextProps}>

                {/* --- HEADER --- */}
                <div style={{
                    backgroundColor: "var(--theme-color, #93c5fd)",
                    padding: "40px 20px",
                    textAlign: "center",
                    color: "white"
                }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        border: '1px solid white',
                        margin: '0 auto 15px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        fontWeight: '300',
                        letterSpacing: '2px'
                    }}>
                        {initials}
                    </div>
                    <h1 style={{
                        margin: 0,
                        fontSize: "36px",
                        fontFamily: "serif",
                        fontStyle: 'italic',
                        fontWeight: '500',
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
                        margin: "10px 0 0",
                        fontSize: "18px",
                        color: "rgba(255,255,255,0.8)",
                        fontWeight: '300'
                    }}>
                        <SpellCheckText
                            text={personal?.profession || "Profession"}
                            isActive={isSpellCheckActive}
                            onIgnore={onSpellCheckIgnore}
                            onReplace={(val) => onSpellCheckReplace('personal', 'profession', val)}
                        />
                    </p>
                </div>

                {/* --- CONTENT --- */}
                <div style={{ display: 'flex', flex: 1 }}>

                    {/* LEFT COLUMN (MAIN) */}
                    <div style={{ flex: 1.8, padding: 'var(--theme-page-margin, 30px)', backgroundColor: 'white' }}>
                        <DroppableZone id="main">
                            {layout.main.map((item, idx) => {
                                if (item === SORTABLE_KEY) {
                                    return (
                                        <SortableContext key="main-sort" items={mainOrder} strategy={verticalListSortingStrategy} id="main">
                                            {mainOrder.map(sid => (
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
                                    );
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
                        </DroppableZone>
                    </div>

                    {/* RIGHT COLUMN (SIDEBAR) */}
                    <div style={{ flex: 1, backgroundColor: "#f1f5f9", padding: "var(--theme-page-margin, 30px) var(--theme-page-margin, 20px)" }}>

                        {/* CONTACT INFO FIXED */}
                        <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Personal Details">
                            <div style={{ marginBottom: '30px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {personal?.email && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#1e293b' }}>
                                            <Mail size={14} /> {personal.email}
                                        </div>
                                    )}
                                    {personal?.phone && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#1e293b' }}>
                                            <Phone size={14} /> {personal.phone}
                                        </div>
                                    )}
                                    {(personal?.city || personal?.country) && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#1e293b' }}>
                                            <MapPin size={14} /> {personal.city}, {personal.country}
                                        </div>
                                    )}
                                </div>
                                <div style={{ marginTop: '20px', borderTop: '1px solid #cbd5e1' }}></div>
                            </div>
                        </SectionWrapper>

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

export default ClassicBlue;
