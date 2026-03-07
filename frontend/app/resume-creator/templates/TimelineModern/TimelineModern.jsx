import React from "react";
import { DndContext } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SectionWrapper from "../../components/SectionWrapper";
import { useResumeDragAndDrop, DroppableZone, StableResumeDragOverlay } from "../../hooks/useResumeDragAndDrop";
import DraggableSection from "../../components/dnd/DraggableSection";
import SectionRenderer from "../common/SectionRenderer";
import { SpellCheckText, RichTextSpellCheck } from "../common/BaseComponents";
import SpellCheckHighlighter from "../../components/SpellCheckHighlighter";
import {
    Briefcase,
    GraduationCap,
    Puzzle,
    Trophy,
    User,
    Mail,
    Phone,
    MapPin,
    Globe,
    Languages,
    Cpu,
    Award
} from "lucide-react";
import "./TimelineModern.css";

const SectionIcon = ({ sectionId }) => {
    switch (sectionId) {
        case 'experience': return <Briefcase size={16} />;
        case 'education': return <GraduationCap size={16} />;
        case 'skills': return <Puzzle size={16} />;
        case 'certifications': return <Trophy size={16} />;
        case 'summary': return <User size={16} />;
        case 'languages': return <Languages size={16} />;
        case 'software': return <Cpu size={16} />;
        case 'accomplishments': return <Award size={16} />;
        default: return <Puzzle size={16} />;
    }
};

const TimelineModern = ({ data, onSectionClick, onReorder, scale = 1, isSpellCheckActive, onSpellCheckIgnore, onSpellCheckReplace }) => {
    if (!data) return null;

    const isInteractive = !!onSectionClick && !isSpellCheckActive;
    const canReorder = !!onReorder && !isSpellCheckActive;

    const { personal, summary } = data;

    // Custom renderers for timeline items
    const customRenderers = {
        summary: () => summary && summary.length > 0 && (
            <SectionWrapper sectionId="summary" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Summary">
                <div className="timeline-summary">
                    <RichTextSpellCheck
                        html={summary}
                        isActive={isSpellCheckActive}
                        onIgnore={onSpellCheckIgnore}
                        onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('summary', 'summary', val)}
                    />
                </div>
            </SectionWrapper>
        ),
        experience: () => data.experience?.length > 0 && (
            <div className="timeline-section">
                <div className="timeline-section-icon"><Briefcase size={16} /></div>
                <h3 className="timeline-section-title">Experience</h3>
                {data.experience.map((exp, idx) => (
                    <div key={idx} className="timeline-item">
                        <div className="timeline-item-node"></div>
                        <div className="timeline-item-content">
                            <div className="timeline-experience-title">
                                <SpellCheckText
                                    text={exp.title}
                                    isActive={isSpellCheckActive}
                                    onIgnore={onSpellCheckIgnore}
                                    onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('experience', idx, val, 'title')}
                                />
                            </div>
                            <div className="timeline-experience-company">
                                {exp.company}
                                {exp.location && ` • ${exp.location}`}
                            </div>
                            <div className="timeline-experience-date">
                                {exp.startMonth} {exp.startYear} - {exp.isCurrent ? 'Present' : `${exp.endMonth} ${exp.endYear}`}
                            </div>
                            <div className="rich-text">
                                <RichTextSpellCheck
                                    html={exp.description}
                                    isActive={isSpellCheckActive}
                                    onIgnore={onSpellCheckIgnore}
                                    onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('experience', idx, val, 'description')}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ),
        education: () => data.education?.length > 0 && (
            <div className="timeline-section">
                <div className="timeline-section-icon"><GraduationCap size={16} /></div>
                <h3 className="timeline-section-title">Education</h3>
                {data.education.map((edu, idx) => (
                    <div key={idx} className="timeline-item">
                        <div className="timeline-item-node"></div>
                        <div className="timeline-item-content">
                            <div className="timeline-experience-title">
                                <SpellCheckText
                                    text={`${edu.degree}${edu.field ? `, ${edu.field}` : ''}`}
                                    isActive={isSpellCheckActive}
                                    onIgnore={onSpellCheckIgnore}
                                    onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('education', idx, val, 'degree')}
                                />
                            </div>
                            <div className="timeline-experience-company">
                                {edu.school}
                                {edu.city && ` • ${edu.city}`}
                            </div>
                            {edu.grade && (
                                <div style={{ fontSize: '12px', opacity: 0.8, fontStyle: 'italic', color: 'var(--theme-text)' }}>
                                    GPA: {edu.grade}
                                </div>
                            )}
                            <div className="timeline-experience-date">
                                {edu.startMonth} {edu.startYear} - {edu.endMonth} {edu.endYear}
                            </div>
                            {edu.description && (
                                <div className="rich-text" style={{ marginTop: '8px' }}>
                                    <RichTextSpellCheck
                                        html={edu.description}
                                        isActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('education', idx, val, 'description')}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        ),
        skills: () => data.skills?.length > 0 && (
            <div className="timeline-section">
                <div className="timeline-section-icon"><Puzzle size={16} /></div>
                <h3 className="timeline-section-title">Skills</h3>
                {data.skills.map((skill, idx) => (
                    <div key={idx} className="timeline-item">
                        <div className="timeline-item-node"></div>
                        <div className="timeline-item-content" style={{ fontWeight: 500 }}>
                            <SpellCheckText
                                text={typeof skill === 'string' ? skill : skill.name}
                                isActive={isSpellCheckActive}
                                onIgnore={onSpellCheckIgnore}
                                onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('skills', idx, val)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        )
    };

    const allKnownSections = [
        'summary', 'experience', 'education', 'skills', 'projects', 'languages',
        'certifications', 'interests', 'websites', 'software', 'affiliations',
        'strengths', 'additionalSkills', 'keyAchievements', 'accomplishments', 'additionalInfo', 'custom'
    ];

    const templateId = 'timeline-modern';
    const templateSpecificLayout = data.templateLayouts?.[templateId] || {};
    let currentOrder = [...(templateSpecificLayout.mainSectionsOrder || data.mainSectionsOrder || allKnownSections)];

    // Ensure all data-containing sections are in the list
    allKnownSections.forEach(sid => {
        if (!currentOrder.includes(sid)) currentOrder.push(sid);
    });

    const hasSectionData = (sid) => {
        const sData = data[sid];
        if (!sData) return false;
        if (Array.isArray(sData)) return sData.length > 0;
        if (typeof sData === 'string') return sData.trim().length > 0;
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
        <div className="timeline-modern-container">
            <DndContext {...dndContextProps}>

                {/* --- HEADER --- */}
                <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Header">
                    <header className="timeline-modern-header">
                        <div className="timeline-modern-header-info">
                            <h1 className="timeline-modern-name">
                                <SpellCheckHighlighter
                                    text={personal?.name}
                                    isActive={isSpellCheckActive}
                                    onIgnore={onSpellCheckIgnore}
                                    onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('personal', 'name', val)}
                                />
                            </h1>
                            <p className="timeline-modern-profession">
                                <SpellCheckHighlighter
                                    text={personal?.profession}
                                    isActive={isSpellCheckActive}
                                    onIgnore={onSpellCheckIgnore}
                                    onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('personal', 'profession', val)}
                                />
                            </p>

                            <div className="timeline-modern-contact">
                                {personal?.address && (
                                    <div className="timeline-modern-contact-item">
                                        <span className="timeline-modern-contact-label">Address</span>
                                        <span>
                                            <SpellCheckHighlighter
                                                text={personal.address}
                                                isActive={isSpellCheckActive}
                                                onIgnore={onSpellCheckIgnore}
                                                onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('personal', 'address', val)}
                                            />
                                        </span>
                                    </div>
                                )}
                                {personal?.phone && (
                                    <div className="timeline-modern-contact-item">
                                        <span className="timeline-modern-contact-label">Phone</span>
                                        <span>
                                            <SpellCheckHighlighter
                                                text={personal.phone}
                                                isActive={isSpellCheckActive}
                                                onIgnore={onSpellCheckIgnore}
                                                onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('personal', 'phone', val)}
                                            />
                                        </span>
                                    </div>
                                )}
                                {personal?.email && (
                                    <div className="timeline-modern-contact-item">
                                        <span className="timeline-modern-contact-label">E-mail</span>
                                        <span>
                                            <SpellCheckHighlighter
                                                text={personal.email}
                                                isActive={isSpellCheckActive}
                                                onIgnore={onSpellCheckIgnore}
                                                onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('personal', 'email', val)}
                                            />
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="timeline-modern-photo-container">
                            {personal?.photo ? (
                                <img src={personal.photo} alt="Profile" className="timeline-modern-photo" />
                            ) : (
                                <User size={64} color="#94a3b8" />
                            )}
                        </div>
                    </header>
                </SectionWrapper>

                {/* --- BODY --- */}
                <div className="timeline-modern-body">
                    <div className="timeline-vertical-line"></div>

                    <DroppableZone id="main">
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
                                        customRenderers={customRenderers}
                                    />
                                </DraggableSection>
                            ))}
                        </SortableContext>
                    </DroppableZone>
                </div>

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

export default TimelineModern;
