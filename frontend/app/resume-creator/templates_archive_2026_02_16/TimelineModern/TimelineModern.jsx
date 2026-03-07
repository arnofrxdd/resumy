import React, { useRef, useMemo } from "react";
import { DndContext } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SectionWrapper from "../../components/SectionWrapper";
import { useResumeDragAndDrop, DroppableZone, StableResumeDragOverlay } from "../../hooks/useResumeDragAndDrop";
import DraggableSection from "../../components/dnd/DraggableSection";
import {
    SpellCheckText,
    RichTextSpellCheck,
    ExperienceItem,
    EducationItem,
    ProjectItem,
    LanguageItem,
    CertificationItem,
    WebsiteItem,
    TagList,
    Skills,
    AchievementItem,
    AffiliationItem
} from "../common/BaseComponents";
import SpellCheckHighlighter from "../../components/SpellCheckHighlighter";
import { useAutoPagination } from "../../hooks/useAutoPagination";
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
    Award,
    Star,
    Zap,
    Book,
    Settings,
    Layers,
    FileText,
    Heart,
    Link as LinkIcon
} from "lucide-react";
import "./TimelineModern.css";

// --- CONFIG & HELPERS ---

const SECTION_ICONS = {
    summary: <User size={16} />,
    experience: <Briefcase size={16} />,
    education: <GraduationCap size={16} />,
    skills: <Puzzle size={16} />,
    projects: <Settings size={16} />,
    languages: <Languages size={16} />,
    certifications: <Trophy size={16} />,
    interests: <Heart size={16} />,
    software: <Cpu size={16} />,
    accomplishments: <Award size={16} />,
    affiliations: <Layers size={16} />,
    keyAchievements: <Star size={16} />,
    additionalInfo: <Book size={16} />,
    custom: <FileText size={16} />,
    websites: <LinkIcon size={16} />,
    strengths: <Zap size={16} />,
    additionalSkills: <Settings size={16} />
};

const getSectionTitle = (sid, data) => {
    if (sid === 'custom' && data.customSection?.title) return data.customSection.title;
    const titles = {
        keyAchievements: "Key Achievements",
        additionalInfo: "Additional Info",
        additionalSkills: "Additional Skills",
        software: "Software & Tools",
        websites: "Websites & Portfolios"
    };
    return titles[sid] || sid.charAt(0).toUpperCase() + sid.slice(1).replace(/([A-Z])/g, ' $1');
};

/**
 * TimelineSection
 * The ONLY place where SectionWrapper and data-section-id should live for a section.
 */
const TimelineSection = ({ sid, data, isContinued, itemIndices, onSectionClick, isInteractive, isSpellCheckActive, onSpellCheckIgnore, onSpellCheckReplace }) => {
    const title = getSectionTitle(sid, data);
    const icon = SECTION_ICONS[sid] || <Puzzle size={16} />;
    const sData = data[sid];

    if (!sData && sid !== 'custom') return null;

    // --- CONTENT RENDERING LOGIC ---
    let content = null;

    if (sid === 'summary') {
        content = (
            <div className="timeline-summary">
                <RichTextSpellCheck
                    html={sData}
                    isActive={isSpellCheckActive}
                    onIgnore={onSpellCheckIgnore}
                    onReplace={(val) => onSpellCheckReplace('summary', 'summary', val)}
                />
            </div>
        );
    } else if (['experience', 'education', 'projects'].includes(sid)) {
        const rawItems = sData || [];
        const items = itemIndices ? itemIndices.map(idx => rawItems[idx]).filter(Boolean) : rawItems;

        content = items.map((item, idx) => {
            const originalIndex = itemIndices ? itemIndices[idx] : idx;
            const ItemComponent = sid === 'experience' ? ExperienceItem : (sid === 'education' ? EducationItem : ProjectItem);
            return (
                <div key={originalIndex} className="timeline-item" data-item-index={originalIndex}>
                    <div className="timeline-item-node"></div>
                    <div className="timeline-item-content">
                        <ItemComponent
                            item={item}
                            isSpellCheckActive={isSpellCheckActive}
                            onSpellCheckIgnore={onSpellCheckIgnore}
                            onSpellCheckReplace={(field, val) => onSpellCheckReplace(sid, originalIndex, val, field)}
                            variant="timeline"
                        />
                    </div>
                </div>
            );
        });
    } else if (['skills', 'software', 'strengths', 'additionalSkills', 'interests'].includes(sid)) {
        const rawItems = sData || [];
        const items = itemIndices ? itemIndices.map(idx => rawItems[idx]).filter(Boolean) : rawItems;
        const ListComponent = (sid === 'skills') ? Skills : TagList;
        const variant = (sid === 'interests' || sid === 'strengths') ? 'bordered' : 'pills';

        content = (
            <div className="timeline-item">
                <div className="timeline-item-node"></div>
                <div className="timeline-item-content">
                    <ListComponent
                        items={items}
                        isSpellCheckActive={isSpellCheckActive}
                        onSpellCheckIgnore={onSpellCheckIgnore}
                        onSpellCheckReplace={(index, val) => {
                            const originalIndex = itemIndices ? itemIndices[index] : index;
                            onSpellCheckReplace(sid, originalIndex, val);
                        }}
                        variant={variant}
                    />
                </div>
            </div>
        );
    } else {
        // Generic List (Certifications, Languages, Websites, etc.)
        const rawItems = Array.isArray(sData) ? sData : (sid === 'custom' ? [data.customSection.content] : [sData]);
        const items = itemIndices ? itemIndices.map(idx => rawItems[idx]).filter(Boolean) : rawItems;

        content = items.map((item, idx) => {
            const originalIndex = itemIndices ? itemIndices[idx] : idx;
            let ItemComponent;
            if (sid === 'languages') ItemComponent = LanguageItem;
            else if (sid === 'certifications') ItemComponent = CertificationItem;
            else if (sid === 'keyAchievements' || sid === 'accomplishments') ItemComponent = AchievementItem;
            else if (sid === 'websites') ItemComponent = WebsiteItem;
            else if (sid === 'affiliations') ItemComponent = AffiliationItem;

            return (
                <div key={originalIndex} className="timeline-item" data-item-index={originalIndex}>
                    <div className="timeline-item-node"></div>
                    <div className="timeline-item-content">
                        {ItemComponent ? (
                            <ItemComponent
                                item={item}
                                isSpellCheckActive={isSpellCheckActive}
                                onIgnore={onSpellCheckIgnore}
                                onSpellCheckReplace={(field, val) => onSpellCheckReplace(sid, originalIndex, val, field)}
                            />
                        ) : (
                            <div className="rich-text">
                                <RichTextSpellCheck
                                    html={sid === 'custom' ? data.customSection.content : (typeof item === 'string' ? item : item.description)}
                                    isActive={isSpellCheckActive}
                                    onIgnore={onSpellCheckIgnore}
                                    onReplace={(val) => onSpellCheckReplace(sid, originalIndex, val)}
                                />
                            </div>
                        )}
                    </div>
                </div>
            );
        });
    }

    return (
        <SectionWrapper sectionId={sid} onSectionClick={onSectionClick} isInteractive={isInteractive} label={title}>
            <div className="timeline-section">
                {!isContinued && <div className="timeline-section-icon">{icon}</div>}
                <h3 className="timeline-section-title">
                    {isContinued ? `${title} (Continued)` : title}
                </h3>
                {content}
            </div>
        </SectionWrapper>
    );
};

const TimelineModern = ({ data, onSectionClick, onReorder, scale = 1, isSpellCheckActive, onSpellCheckIgnore, onSpellCheckReplace, showPageBreaks }) => {
    const containerRef = useRef(null);
    if (!data) return null;

    const isInteractive = !!onSectionClick && !isSpellCheckActive;
    const canReorder = !!onReorder && !isSpellCheckActive;

    // --- DATA UNIQUE FILTRATION ---
    const activeSections = useMemo(() => {
        const allKnown = [
            'summary', 'experience', 'education', 'skills', 'projects', 'languages',
            'certifications', 'interests', 'websites', 'software', 'affiliations',
            'strengths', 'additionalSkills', 'keyAchievements', 'accomplishments', 'additionalInfo', 'custom'
        ];

        const templateOrder = data.templateLayouts?.['timeline-modern']?.mainSectionsOrder || data.mainSectionsOrder || allKnown;
        const uniqueOrder = [...new Set(templateOrder)]; // Deduplicate input order

        const hasData = (sid) => {
            const sData = data[sid];
            if (!sData) return false;
            if (Array.isArray(sData)) return sData.length > 0;
            if (typeof sData === 'string') return sData.trim().length > 0;
            if (sid === 'custom') return data.customSection?.isVisible && data.customSection?.content;
            if (sid === 'websites') return data.websites?.filter(w => !w.addToHeader).length > 0;
            return true;
        };

        const existing = uniqueOrder.filter(hasData);
        // Add missing sections that have data
        allKnown.forEach(sid => {
            if (!existing.includes(sid) && hasData(sid)) existing.push(sid);
        });
        return existing;
    }, [data]);

    const { dndContextProps, activeId, dragStartContainerId } = useResumeDragAndDrop({
        data,
        onReorder,
        scale,
        containers: { main: activeSections }
    });

    const pages = useAutoPagination({
        columns: { main: activeSections },
        data,
        enabled: showPageBreaks,
        containerRef
    });

    const renderHeader = () => (
        <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Header">
            <header className="timeline-modern-header">
                <div className="timeline-modern-header-info">
                    <h1 className="timeline-modern-name">
                        <SpellCheckHighlighter
                            text={data.personal?.name}
                            isActive={isSpellCheckActive}
                            onIgnore={onSpellCheckIgnore}
                            onReplace={(val) => onSpellCheckReplace('personal', 'name', val)}
                        />
                    </h1>
                    <p className="timeline-modern-profession">
                        <SpellCheckHighlighter
                            text={data.personal?.profession}
                            isActive={isSpellCheckActive}
                            onIgnore={onSpellCheckIgnore}
                            onReplace={(val) => onSpellCheckReplace('personal', 'profession', val)}
                        />
                    </p>
                    <div className="timeline-modern-contact">
                        {data.personal?.email && <div className="timeline-modern-contact-item"><span className="timeline-modern-contact-label">Email</span> <span>{data.personal.email}</span></div>}
                        {data.personal?.phone && <div className="timeline-modern-contact-item"><span className="timeline-modern-contact-label">Phone</span> <span>{data.personal.phone}</span></div>}
                        {data.personal?.address && <div className="timeline-modern-contact-item"><span className="timeline-modern-contact-label">Address</span> <span>{data.personal.address}</span></div>}
                    </div>
                </div>
                {data.personal?.photo && (
                    <div className="timeline-modern-photo-container">
                        <img src={data.personal.photo} alt="Profile" className="timeline-modern-photo" />
                    </div>
                )}
            </header>
        </SectionWrapper>
    );

    const renderZoneContent = (items, isPaginatedContext = false) => {
        return items.map((item, idx) => {
            const sid = item.id || item;
            const itemIndices = item.itemIndices || null;
            const isContinued = item.isContinued || false;

            const sectionMarkup = (
                <TimelineSection
                    key={`${sid}-${idx}`}
                    sid={sid}
                    data={data}
                    isContinued={isContinued}
                    itemIndices={itemIndices}
                    onSectionClick={onSectionClick}
                    isInteractive={isInteractive}
                    isSpellCheckActive={isSpellCheckActive}
                    onSpellCheckIgnore={onSpellCheckIgnore}
                    onSpellCheckReplace={onSpellCheckReplace}
                />
            );

            if (!canReorder || isContinued || isPaginatedContext) {
                return (
                    <div key={`${sid}-${idx}`} data-section-id={isPaginatedContext ? null : sid}>
                        {sectionMarkup}
                    </div>
                );
            }

            return (
                <DraggableSection key={sid} id={sid} isEnabled={canReorder}>
                    {sectionMarkup}
                </DraggableSection>
            );
        });
    };

    const fullLayout = (
        <div className="timeline-modern-container">
            {renderHeader()}
            <div className="timeline-modern-body">
                <div className="timeline-vertical-line"></div>
                <DroppableZone id="main">
                    <SortableContext items={activeSections} strategy={verticalListSortingStrategy} id="main">
                        {renderZoneContent(activeSections)}
                    </SortableContext>
                </DroppableZone>
            </div>
        </div>
    );

    const paginatedLayout = pages ? (
        <div className="paginated-resume-container" style={{ display: "flex", flexDirection: "column", gap: "30px", background: "#f1f5f9", padding: "40px" }}>
            <SortableContext items={activeSections} strategy={verticalListSortingStrategy}>
                {pages.map((page, pageIdx) => (
                    <div key={pageIdx} className="resume-page" style={{
                        width: "210mm", height: "297mm",
                        background: "white",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                        position: "relative",
                        overflow: "hidden",
                        padding: "15px", // Matching UnifiedTemplate White Frame
                        boxSizing: "border-box"
                    }}>
                        <div className="timeline-modern-container" style={{ height: "100%", background: "white" }}>
                            {pageIdx === 0 && renderHeader()}
                            <div className="timeline-modern-body" style={{ flex: 1, paddingTop: pageIdx > 0 ? "20px" : "40px" }}>
                                <div className="timeline-vertical-line" style={{
                                    top: (pageIdx > 0) ? -20 : 40,
                                    bottom: (pageIdx < pages.length - 1) ? -40 : 40,
                                    height: "auto"
                                }}></div>
                                {renderZoneContent(page.main, true)}
                            </div>
                        </div>
                        <div style={{ position: "absolute", bottom: "15px", right: "20px", fontSize: "10px", opacity: 0.5 }}>Page {pageIdx + 1} of {pages.length}</div>
                    </div>
                ))}
            </SortableContext>
        </div>
    ) : (
        <div style={{ textAlign: "center", padding: "100px", color: "#94a3b8" }}>Calculating Page Breaks...</div>
    );

    const Measurer = () => (
        <div className="resume-measurer" style={{ position: "absolute", top: -10000, left: -10000, width: "210mm", visibility: "hidden", pointerEvents: "none" }}>
            <div className="page-height-marker" style={{ height: "calc(297mm - 30px)", width: "100%", position: "absolute", top: 15 }}></div>
            <div className="timeline-modern-container" style={{ padding: "15px" }}>
                {renderHeader()}
                <div className="timeline-modern-body main-column-measurer" data-column-id="main">
                    <div className="timeline-vertical-line"></div>
                    {/* IMPORTANT: Use a mapping that renders data-section-id ONCE per section */}
                    {activeSections.map(sid => (
                        <TimelineSection
                            key={sid}
                            sid={sid}
                            data={data}
                            isContinued={false}
                            itemIndices={null}
                            onSectionClick={null}
                            isInteractive={false}
                        />
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div ref={containerRef} className="timeline-modern-root">
            <Measurer />
            <DndContext {...dndContextProps}>
                {showPageBreaks ? paginatedLayout : fullLayout}
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
                            opacity: 0.95
                        }}>
                            <TimelineSection
                                sid={id}
                                data={data}
                                isContinued={false}
                                itemIndices={null}
                                onSectionClick={null}
                                isInteractive={false}
                            />
                        </div>
                    )} />
            </DndContext>
        </div>
    );
};

export default TimelineModern;
