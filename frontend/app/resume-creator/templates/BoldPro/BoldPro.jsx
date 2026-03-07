import React from "react";
import { DndContext } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useResumeDragAndDrop, DroppableZone, StableResumeDragOverlay } from "../../hooks/useResumeDragAndDrop";
import DraggableSection from "../../components/dnd/DraggableSection";
import SectionRenderer from "../common/SectionRenderer";
import SectionWrapper from "../../components/SectionWrapper";
import { SectionTitle, SpellCheckText, RichTextSpellCheck } from "../common/BaseComponents";

/**
 * BoldPro Template
 * Two-column layout with a dark sidebar and bold typography.
 * Features:
 * - Dark left sidebar with white text
 * - Main content on right with bold headers
 * - Yellow (or theme color) accent underline for name
 * - Condensed, uppercase section titles
 * - Skills with progress bars
 */
const BoldPro = ({ data, onSectionClick, onReorder, scale = 1, isSpellCheckActive, onSpellCheckIgnore, onSpellCheckReplace, layoutConfig }) => {
    if (!data) return null;

    const { personal } = data;
    const canReorder = !!onReorder && !isSpellCheckActive;
    const isInteractive = !!onSectionClick && !isSpellCheckActive;

    // --- 1. CUSTOM RENDERERS ---

    const customRenderers = {
        // SUMMARY: In sidebar, white text
        summary: () => data.summary && (
            <SectionWrapper sectionId="summary" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Summary">
                <div style={{ marginBottom: "calc(30px * var(--theme-section-margin, 1))", color: "inherit" }}>
                    <SectionTitle
                        title="ABOUT ME"
                        style={{
                            color: "inherit",
                            borderBottom: "none",
                            fontSize: "20px",
                            marginBottom: "15px",
                            letterSpacing: "2px"
                        }}
                    />
                    <div className="resume-rich-text" style={{ fontSize: "13px", lineHeight: "1.6", opacity: 0.9 }}>
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

        // SKILLS: Progress bars in sidebar
        skills: () => data.skills?.length > 0 && (
            <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Skills">
                <div style={{ marginBottom: "calc(30px * var(--theme-section-margin, 1))", color: "inherit" }}>
                    <SectionTitle
                        title="SKILLS"
                        style={{
                            color: "inherit",
                            borderBottom: "none",
                            fontSize: "20px",
                            marginBottom: "20px",
                            letterSpacing: "4px"
                        }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {data.skills.map((skill, index) => {
                            const level = skill.level || 3; // Default to 3/5 if missing
                            const percentage = (level / 5) * 100;
                            return (
                                <div key={index}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '13px', fontWeight: '500' }}>
                                        <SpellCheckText
                                            text={typeof skill === 'string' ? skill : skill.name}
                                            isActive={isSpellCheckActive}
                                            onIgnore={onSpellCheckIgnore}
                                            onReplace={(val) => onSpellCheckReplace('skills', index, typeof skill === 'string' ? val : { ...skill, name: val })}
                                        />
                                    </div>
                                    <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px' }}>
                                        <div style={{ width: `${percentage}%`, height: '100%', background: 'var(--theme-color)', borderRadius: '2px' }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </SectionWrapper>
        ),

        // EXPERIENCE: Bold Title (Dates) format
        experience: () => data.experience?.length > 0 && (
            <SectionWrapper sectionId="experience" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Experience">
                <div style={{ marginBottom: "calc(25px * var(--theme-section-margin, 1))" }}>
                    <SectionTitle
                        title="EXPERIENCE"
                        style={{
                            color: "var(--theme-text, #333)",
                            borderBottom: "none",
                            fontSize: "24px",
                            marginBottom: "20px",
                            letterSpacing: "4px",
                            fontWeight: "400"
                        }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                        {data.experience.map((exp, index) => (
                            <div key={index}>
                                <h4 style={{
                                    margin: '0 0 10px 0',
                                    fontSize: '16px',
                                    fontWeight: '700',
                                    color: "var(--theme-text, #333)",
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px'
                                }}>
                                    <SpellCheckText text={exp.title} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', index, val, 'title')} />
                                    <span style={{ fontWeight: '400', marginLeft: '8px', color: 'var(--theme-text, #666)', opacity: 0.8 }}>
                                        (<SpellCheckText text={`${exp.startYear} - ${exp.isCurrent ? 'NOW' : exp.endYear}`} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', index, val, 'date')} />)
                                    </span>
                                </h4>

                                <div className="resume-rich-text" style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--theme-text, #555)' }}>
                                    <RichTextSpellCheck html={exp.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('experience', index, val, 'description')} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </SectionWrapper>
        ),

        // EDUCATION: Similar bold format
        education: () => data.education?.length > 0 && (
            <SectionWrapper sectionId="education" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Education">
                <div style={{ marginBottom: "calc(25px * var(--theme-section-margin, 1))" }}>
                    <SectionTitle
                        title="EDUCATION"
                        style={{
                            color: "var(--theme-text, #333)",
                            borderBottom: "none",
                            fontSize: "24px",
                            marginBottom: "20px",
                            letterSpacing: "4px",
                            fontWeight: "400"
                        }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {data.education.map((edu, index) => (
                            <div key={index}>
                                <h4 style={{
                                    margin: '0 0 5px 0',
                                    fontSize: '15px',
                                    fontWeight: '700',
                                    color: "var(--theme-text, #333)",
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    <SpellCheckText text={edu.school} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', index, val, 'school')} />
                                    <span style={{ fontWeight: '400', marginLeft: '6px', color: 'var(--theme-text, #666)', opacity: 0.8 }}>
                                        (<SpellCheckText text={`${edu.startYear} - ${edu.endYear || 'Present'}`} isActive={isSpellCheckActive} />)
                                    </span>
                                </h4>
                                <div style={{ fontSize: '14px', color: 'var(--theme-text, #555)', fontStyle: 'italic' }}>
                                    <SpellCheckText text={edu.degree || edu.field} isActive={isSpellCheckActive} />
                                </div>
                                {edu.grade && (
                                    <div style={{ fontSize: '13px', color: 'var(--theme-text, #666)', fontStyle: 'italic', marginTop: '2px', opacity: 0.8 }}>
                                        <SpellCheckText text={`GPA: ${edu.grade}`} isActive={isSpellCheckActive} />
                                    </div>
                                )}
                                {edu.description && (
                                    <div className="resume-rich-text" style={{ fontSize: '13px', lineHeight: '1.5', color: 'var(--theme-text, #555)', marginTop: '4px' }}>
                                        <RichTextSpellCheck html={edu.description} isActive={isSpellCheckActive} onIgnore={onSpellCheckIgnore} onReplace={(val) => onSpellCheckReplace('education', index, val, 'description')} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </SectionWrapper>
        )
    };

    // --- 2. LAYOUT LOGIC ---
    const SORTABLE_KEY = "{{SORTABLE}}";

    const layout = layoutConfig || {
        main: ['experience', 'education', SORTABLE_KEY],
        sidebar: ['summary', 'skills', SORTABLE_KEY]
    };

    const templateId = 'bold-pro';
    const templateSpecificLayout = data.templateLayouts?.[templateId] || {};
    const mainOrderRaw = [...(templateSpecificLayout.mainSectionsOrder || ['experience', 'education', 'projects', 'certifications'])];
    const sidebarOrderRaw = [...(templateSpecificLayout.sidebarSectionsOrder || ['summary', 'skills', 'languages', 'interests', 'software'])];

    // Filter out fixed sections from the sortable lists to avoid duplication
    // If a section is explicitly listed in layout.main/sidebar (before or after SORTABLE_KEY), it's "fixed" in that position.
    // We must ensure it doesn't appear again in the sortable list.
    const fixedMain = layout.main.filter(id => id !== SORTABLE_KEY);
    const fixedSidebar = layout.sidebar.filter(id => id !== SORTABLE_KEY);

    const mainOrder = mainOrderRaw.filter(id => !fixedMain.includes(id));
    const sidebarOrder = sidebarOrderRaw.filter(id => !fixedSidebar.includes(id));

    const { dndContextProps, activeId, dragStartContainerId } = useResumeDragAndDrop({
        data,
        onReorder: (newOrders) => onReorder?.(newOrders, templateId),
        scale,
        containers: {
            main: mainOrderRaw.filter(id => data[id]?.length > 0), // DragAndDrop hook likely needs the FULL list to handle moves correctly? 
            // Actually, if we move a fixed item, it might be weird. 
            // The hook tracks "containers" which represents the valid drop targets/sortable lists.
            // If we want fixed items to be UNMOVABLE, they shouldn't be in 'containers'.
            // If we want them movable, they shouldn't be in 'fixed'.
            // Since they are explicitly in layout, they are fixed.
            main: mainOrder.filter(id => data[id]?.length > 0),
            sidebar: sidebarOrder.filter(id => data[id]?.length > 0)
        }
    });

    return (
        <div style={{
            minHeight: "100%",
            width: "100%",
            background: "var(--theme-background, #ffffff)",
            display: 'flex',
            boxSizing: 'border-box',
            fontFamily: "var(--theme-font, 'Oswald', sans-serif)",
            lineHeight: 1.5,
            color: "var(--theme-text, #333333)"
        }}>
            <DndContext {...dndContextProps}>
                {/* --- SIDEBAR (Left, Dark) --- */}
                <div style={{
                    width: '35%',
                    background: "var(--theme-sidebar-background, #1e1e1e)",
                    color: "var(--theme-sidebar-text, #ffffff)",
                    padding: "var(--theme-page-margin, 40px) 30px",
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '1123px', // A4 Height @ 96 DPI approx
                    // Force overrides for all standard components inside this dark sidebar
                    '--item-title-color': "var(--theme-sidebar-text, #ffffff)",
                    '--item-subtitle-color': "rgba(255,255,255,0.7)",
                    '--item-body-color': "rgba(255,255,255,0.9)",
                    '--section-title-color': "var(--theme-sidebar-text, #ffffff)",
                    '--section-title-border': "2px solid var(--theme-color)"
                }}>
                    {/* Photo (Fixed at top of sidebar) */}
                    {personal?.photo && (
                        <div style={{
                            marginBottom: '40px',
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                            <img
                                src={personal.photo}
                                alt="Profile"
                                style={{
                                    width: '160px',
                                    height: '160px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '4px solid rgba(255,255,255,0.1)'
                                }}
                            />
                        </div>
                    )}

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
                                                    // Pass style overrides for sidebar items (white text)
                                                    style={{ color: 'inherit' }}
                                                />
                                            </DraggableSection>
                                        ))}
                                    </SortableContext>
                                );
                            }
                            // Fixed Items
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
                                    style={{ color: 'inherit' }}
                                />
                            );
                        })}
                    </DroppableZone>
                </div>

                {/* --- MAIN CONTENT (Right, White) --- */}
                <div style={{
                    width: '65%',
                    padding: "var(--theme-page-margin, 50px) 40px",
                    boxSizing: 'border-box'
                }}>
                    {/* HEADER (Name & Contact) */}
                    <header style={{ marginBottom: '60px', textAlign: 'center' }}>
                        <h1 style={{
                            margin: '0 0 20px 0',
                            fontSize: "calc(64px * var(--theme-font-scale, 1))",
                            fontWeight: '700',
                            lineHeight: '1',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            color: "var(--theme-text, #222)",
                            position: 'relative',
                            display: 'inline-block'
                        }}>
                            <SpellCheckText
                                text={personal?.name || "Your Name"}
                                isActive={isSpellCheckActive}
                                onIgnore={onSpellCheckIgnore}
                                onReplace={(val) => onSpellCheckReplace('personal', 'name', val)}
                            />
                            {/* Yellow Underline Accent */}
                            <span style={{
                                position: 'absolute',
                                bottom: '15px',
                                left: '-10px',
                                right: '-10px',
                                height: '20px',
                                background: 'var(--theme-color)',
                                zIndex: -1,
                                opacity: 0.6
                            }}></span>
                        </h1>

                        <div style={{
                            fontSize: "calc(14px * var(--theme-font-scale, 1))",
                            color: "var(--theme-text, #666)",
                            opacity: 0.8,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            alignItems: 'center'
                        }}>
                            {personal?.address && <span>{personal.address} {personal.city && `, ${personal.city}`} {personal.zipCode}</span>}

                            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                {personal?.phone && <SpellCheckText text={personal.phone} isActive={isSpellCheckActive} />}
                                {personal?.email && <SpellCheckText text={personal.email} isActive={isSpellCheckActive} />}
                            </div>
                        </div>
                    </header>

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

                <StableResumeDragOverlay
                    activeId={activeId}
                    dragStartContainerId={dragStartContainerId}
                    scale={scale}
                    renderSection={(id) => (
                        <div style={{
                            background: dragStartContainerId === 'sidebar' ? 'var(--theme-sidebar-background, #1e1e1e)' : 'var(--theme-background, #ffffff)',
                            color: dragStartContainerId === 'sidebar' ? 'var(--theme-sidebar-text, #ffffff)' : 'var(--theme-text, #333333)',
                            padding: '15px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                        }}>
                            <SectionRenderer
                                sectionId={id}
                                data={data}
                                customRenderers={customRenderers}
                                style={{ color: dragStartContainerId === 'sidebar' ? 'inherit' : 'inherit' }}
                            />
                        </div>
                    )}
                />
            </DndContext>
        </div>
    );
};

export default BoldPro;
