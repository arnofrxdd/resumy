import React, { useRef, useMemo } from "react";
import { DndContext } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import SectionWrapper from "../../components/SectionWrapper";
import { useResumeDragAndDrop, DroppableZone, StableResumeDragOverlay } from "../../hooks/useResumeDragAndDrop";
import DraggableSection from "../../components/dnd/DraggableSection";
import {
    ExperienceItem,
    EducationItem,
    ProjectItem,
    LanguageItem,
    CertificationItem,
    Skills,
    AchievementItem,
    AffiliationItem,
    WebsiteItem,
    SpellCheckText,
    RichTextSpellCheck
} from "../common/BaseComponents";
import SpellCheckHighlighter from "../../components/SpellCheckHighlighter";
import { useAutoPagination } from "../../hooks/useAutoPagination";
import {
    User, Briefcase, GraduationCap, Puzzle, Diamond, Languages, Trophy,
    Heart, Cpu, Award, Star, Zap, Book, Settings, Layers, FileText, Link as LinkIcon,
    Mail, Phone, MapPin, Globe
} from "lucide-react";
import "./EmeraldTimeline.css";

const SECTION_ICONS = {
    summary: <User size={16} />,
    experience: <Briefcase size={16} />,
    education: <GraduationCap size={16} />,
    skills: <Puzzle size={16} />,
    projects: <Settings size={16} />,
    languages: <Languages size={16} />,
    certifications: <Trophy size={16} />,
    interests: <Diamond size={16} />,
    software: <Cpu size={16} />,
    accomplishments: <Award size={16} />,
    affiliations: <Layers size={16} />,
    keyAchievements: <Star size={16} />,
    additionalInfo: <Book size={16} />,
    custom: <FileText size={16} />,
    websites: <LinkIcon size={16} />,
    strengths: <Zap size={16} />
};

const getSectionTitle = (sid, data) => {
    if (sid === 'custom' && data.customSection?.title) return data.customSection.title;
    const titles = {
        keyAchievements: "Key Achievements",
        additionalInfo: "Additional Info",
        software: "Software & Tools",
        websites: "Websites & Portfolios"
    };
    return titles[sid] || sid.charAt(0).toUpperCase() + sid.slice(1).replace(/([A-Z])/g, ' $1');
};

const DiamondHeader = ({ icon, title, isContinued }) => (
    <div className="emerald-section-header-container">
        {!isContinued && (
            <div className="diamond-marker">
                <div className="diamond-icon">{icon}</div>
            </div>
        )}
        <h3 className="emerald-section-title">
            {isContinued ? `${title} (Continued)` : title}
        </h3>
    </div>
);

const EmeraldSection = ({ sid, data, isContinued, itemIndices, onSectionClick, isInteractive, isSpellCheckActive, onSpellCheckIgnore, onSpellCheckReplace }) => {
    const title = getSectionTitle(sid, data);
    const icon = SECTION_ICONS[sid] || <Puzzle size={16} />;
    const sData = data[sid];

    if (!sData && sid !== 'custom') return null;

    let content = null;

    if (sid === 'summary') {
        content = (
            <div className="emerald-content">
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
                <div key={originalIndex} className="emerald-item-wrapper" style={{ position: 'relative' }} data-item-index={originalIndex}>
                    <div className="timeline-node-small"></div>
                    <ItemComponent
                        item={item}
                        isSpellCheckActive={isSpellCheckActive}
                        onSpellCheckIgnore={onSpellCheckIgnore}
                        onSpellCheckReplace={(field, val) => onSpellCheckReplace(sid, originalIndex, val, field)}
                        variant="emerald"
                    />
                </div>
            );
        });
    } else if (sid === 'skills') {
        const rawItems = sData || [];
        const items = itemIndices ? itemIndices.map(idx => rawItems[idx]).filter(Boolean) : rawItems;
        content = (
            <div className="emerald-skills">
                <Skills
                    items={items}
                    variant="emerald-pills"
                    isSpellCheckActive={isSpellCheckActive}
                    onSpellCheckIgnore={onSpellCheckIgnore}
                    onSpellCheckReplace={onSpellCheckReplace}
                    itemIndices={itemIndices}
                />
            </div>
        );
    } else {
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
                <div key={originalIndex} className="emerald-item-wrapper" style={{ position: 'relative', marginBottom: '10px' }} data-item-index={originalIndex}>
                    <div className="timeline-node-small" style={{ top: '6px' }}></div>
                    {ItemComponent ? (
                        <ItemComponent
                            item={item}
                            isSpellCheckActive={isSpellCheckActive}
                            onIgnore={onSpellCheckIgnore}
                            onSpellCheckReplace={(field, val) => onSpellCheckReplace(sid, originalIndex, val, field)}
                        />
                    ) : (
                        <div className="emerald-content">
                            <RichTextSpellCheck
                                html={sid === 'custom' ? data.customSection.content : (typeof item === 'string' ? item : item.description)}
                                isActive={isSpellCheckActive}
                                onIgnore={onSpellCheckIgnore}
                                onReplace={(val) => onSpellCheckReplace(sid, originalIndex, val)}
                            />
                        </div>
                    )}
                </div>
            );
        });
    }

    return (
        <SectionWrapper sectionId={sid} onSectionClick={onSectionClick} isInteractive={isInteractive} label={title}>
            <div className={`emerald-section ${isContinued ? 'is-continued' : ''}`}>
                <DiamondHeader icon={icon} title={title} isContinued={isContinued} />
                <div className="emerald-section-body">
                    {content}
                </div>
            </div>
        </SectionWrapper>
    );
};

const EmeraldTimeline = ({ data, onSectionClick, onReorder, scale = 1, isSpellCheckActive, onSpellCheckIgnore, onSpellCheckReplace, showPageBreaks }) => {
    const containerRef = useRef(null);
    if (!data) return null;

    const isInteractive = !!onSectionClick && !isSpellCheckActive;
    const canReorder = !!onReorder && !isSpellCheckActive;

    // --- 1. Compute Section Orders ---
    const allKnown = [
        'summary', 'experience', 'education', 'skills', 'projects', 'languages',
        'certifications', 'interests', 'websites', 'software', 'affiliations',
        'strengths', 'additionalSkills', 'keyAchievements', 'accomplishments', 'additionalInfo', 'custom'
    ];

    // Support template-specific layouts
    const templateId = 'emerald-timeline';
    const templateSpecificLayout = data.templateLayouts?.[templateId] || {};
    const currentOrder = templateSpecificLayout.mainSectionsOrder || data.mainSectionsOrder || allKnown;

    const hasData = (sid) => {
        const sData = data[sid];
        if (!sData) return false;
        if (Array.isArray(sData)) return sData.length > 0;
        if (typeof sData === 'string') return sData.trim().length > 0;
        if (sid === 'custom') return data.customSection?.isVisible && data.customSection?.content;
        if (sid === 'websites') return data.websites && data.websites.length > 0;
        return true;
    };

    const activeSections = useMemo(() => {
        return [...new Set(currentOrder)].filter(hasData);
    }, [data, currentOrder]);

    const layoutState = { main: activeSections };

    // --- 2. DnD Logic ---
    const { dndContextProps, activeId, dragStartContainerId } = useResumeDragAndDrop({
        data,
        onReorder,
        scale,
        containers: layoutState
    });

    // --- 3. Pagination Logic (Using useAutoPagination for now as it matches the column-based logic better) ---
    // Note: EmeraldTimeline is single column, so useAutoPagination is stable.
    const pages = useAutoPagination({
        columns: layoutState,
        data,
        enabled: showPageBreaks,
        containerRef,
        scale
    });

    const renderHeader = () => (
        <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Header">
            <header className="emerald-header">
                <div className="emerald-header-info">
                    <h1 className="emerald-name">
                        <SpellCheckHighlighter
                            text={data.personal?.name}
                            isActive={isSpellCheckActive}
                            onIgnore={onSpellCheckIgnore}
                            onReplace={(val) => onSpellCheckReplace('personal', 'name', val)}
                        />
                    </h1>
                    <p className="emerald-profession">
                        <SpellCheckHighlighter
                            text={data.personal?.profession}
                            isActive={isSpellCheckActive}
                            onIgnore={onSpellCheckIgnore}
                            onReplace={(val) => onSpellCheckReplace('personal', 'profession', val)}
                        />
                    </p>
                    <div className="emerald-contact">
                        {(data.personal?.email || data.personal?.phone || data.personal?.city) && (
                            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                {data.personal?.email && (
                                    <div className="emerald-contact-item">
                                        <span className="emerald-contact-label">Email</span>
                                        <span>{data.personal.email}</span>
                                    </div>
                                )}
                                {data.personal?.phone && (
                                    <div className="emerald-contact-item">
                                        <span className="emerald-contact-label">Phone</span>
                                        <span>{data.personal.phone}</span>
                                    </div>
                                )}
                                {data.personal?.city && (
                                    <div className="emerald-contact-item">
                                        <span className="emerald-contact-label">Location</span>
                                        <span>{data.personal.city}{data.personal.country ? `, ${data.personal.country}` : ''}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                {data.personal?.photo && (
                    <div className="emerald-photo-container">
                        <img src={data.personal.photo} alt="Profile" className="emerald-photo" />
                    </div>
                )}
            </header>
        </SectionWrapper>
    );

    const renderZoneContent = (items, isPaginatedContext = false, pageId = "") => {
        return items.map((item, idx) => {
            const sid = item.id || item;
            const itemIndices = item.itemIndices || null;
            const isContinued = item.isContinued || false;

            const sectionMarkup = (
                <EmeraldSection
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

            // In paginated context, we use a prefixed ID for DnD to avoid collisions but keep them sortable
            const dnDId = isPaginatedContext ? sid : sid;

            if (!canReorder || isContinued) {
                return (
                    <div key={`${sid}-${idx}`} className="non-draggable-section">
                        {sectionMarkup}
                    </div>
                );
            }

            return (
                <DraggableSection key={dnDId} id={dnDId} isEnabled={canReorder}>
                    {sectionMarkup}
                </DraggableSection>
            );
        });
    };

    const fullLayout = (
        <div className="emerald-timeline-root" style={{ padding: '40px' }}>
            {renderHeader()}
            <div className="emerald-body">
                <DroppableZone id="main">
                    <SortableContext items={activeSections} strategy={verticalListSortingStrategy} id="main">
                        {renderZoneContent(activeSections)}
                    </SortableContext>
                </DroppableZone>
            </div>
        </div>
    );

    const paginatedLayout = pages ? (
        <div className="paginated-resume-container" style={{ display: "flex", flexDirection: "column", gap: "0", background: "transparent" }}>
            <SortableContext items={activeSections} strategy={verticalListSortingStrategy}>
                {pages.map((page, pageIdx) => (
                    <div key={pageIdx} className="resume-page" style={{
                        width: "100%", // Fill the 210mm parent
                        height: "297mm",
                        background: "white",
                        position: "relative",
                        overflow: "hidden",
                        padding: "0", // Padding is handled inside emerald-timeline-root
                        boxSizing: "border-box"
                    }}>
                        <div className="emerald-timeline-root" style={{ height: "100%", padding: "40px" }}>
                            {pageIdx === 0 && renderHeader()}
                            <div className="emerald-body" style={{ flex: 1, paddingTop: pageIdx > 0 ? "0px" : "40px" }}>
                                {renderZoneContent(page.main, true, `p${pageIdx}`)}
                            </div>
                        </div>
                        {/* Page Number Overlay */}
                        <div style={{ position: "absolute", bottom: "15px", right: "20px", fontSize: "10px", opacity: 0.5, zIndex: 10 }}>
                            Page {pageIdx + 1} of {pages.length}
                        </div>
                    </div>
                ))}
            </SortableContext>
        </div>
    ) : (
        <div style={{ textAlign: "center", padding: "100px", color: "#94a3b8" }}>Calculating Page Breaks...</div>
    );

    return (
        <div ref={containerRef} className="emerald-timeline-container" style={{ width: '100%' }}>
            {/* Hidden Measurer */}
            <div className="resume-measurer" style={{ position: "absolute", top: -10000, left: -10000, width: "210mm", visibility: "hidden", pointerEvents: "none" }}>
                <div className="emerald-timeline-root" style={{ padding: "40px" }}>
                    {renderHeader()}
                    <div className="emerald-body main-column-measurer" data-column-id="main">
                        {activeSections.map(sid => (
                            <EmeraldSection
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

            <DndContext {...dndContextProps}>
                {showPageBreaks ? paginatedLayout : fullLayout}
                <StableResumeDragOverlay
                    activeId={activeId}
                    dragStartContainerId={dragStartContainerId}
                    scale={scale}
                    renderSection={(id) => (
                        <div style={{
                            width: "500px",
                            background: "white",
                            padding: "20px",
                            borderRadius: "4px",
                            boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
                            border: "2px solid #10b981",
                            opacity: 0.95
                        }}>
                            <h3 style={{ margin: 0, color: '#10b981', textTransform: 'uppercase', fontSize: '14px', fontWeight: 800 }}>
                                Moving {getSectionTitle(id, data)}
                            </h3>
                        </div>
                    )}
                />
            </DndContext>
        </div>
    );
};

export default EmeraldTimeline;
