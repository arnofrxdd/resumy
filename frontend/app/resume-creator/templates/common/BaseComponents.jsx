import React from 'react';
import SectionWrapper from '../../components/SectionWrapper';
import SpellCheckHighlighter from '../../components/SpellCheckHighlighter';
import HtmlAwareSpellChecker from '../../components/HtmlAwareSpellChecker';
import { useSectionContext } from './SectionContext';
import { useResumeContext } from '../ResumeContext';
import './Templates.css';

/**
 * Atomic building blocks for templates.
 * Use these to build custom layouts while keeping spell-check functionality.
 */
export const SpellCheckText = ({ text, isActive, onIgnore, onReplace }) => (
    <SpellCheckHighlighter text={text} isActive={isActive} onIgnore={onIgnore} onReplace={onReplace} />
);

export const RichTextSpellCheck = ({ html, isActive, onIgnore, onReplace }) => (
    <HtmlAwareSpellChecker html={html} isActive={isActive} onIgnore={onIgnore} onReplace={onReplace} />
);

/**
 * Standardized Section Title that uses CSS variables for theme coloring.
 * Automatically handles (Continued) suffix if in a continued section context.
 */
export const SectionTitle = ({ title, style = {} }) => {
    const { isContinued } = useSectionContext();

    // Auto-append continuation if it's missing but context says it's continued
    let displayTitle = title;
    if (isContinued && !displayTitle.includes('(Continued)') && !displayTitle.includes('(Cont.)')) {
        // We use (Continued) as default, but templates can override formatting if needed
        displayTitle = `${displayTitle} (Continued)`;
    }

    return (
        <h3 className="template-section-title" style={style}>
            {displayTitle}
        </h3>
    );
};

/**
 * SplittableRichText
 * Renders only a specific range of bullets/blocks from HTML.
 * Used for Surgical Splitting.
 */
export const SplittableRichText = ({ html, range = null, isActive, onIgnore, onReplace }) => {
    if (!html) return null;

    // SSR Safety
    if (typeof document === 'undefined') {
        return <RichTextSpellCheck html={html} isActive={isActive} onIgnore={onIgnore} onReplace={onReplace} />;
    }

    // Parse HTML into virtual blocks (bullets)
    const temp = document.createElement('div');
    temp.innerHTML = html;

    // Find top-level blocks. 
    // If it's a list, we want the LIs.
    // If it's a series of paragraphs or divs, we want those.
    // We avoid querySelectorAll because it's recursive and leads to duplication if divs are nested.
    let blocks = [];
    const list = temp.querySelector('ul, ol');
    if (list) {
        blocks = Array.from(list.children).filter(node => node.tagName.toLowerCase() === 'li');
    } else {
        // Filter for common block elements at the top level
        blocks = Array.from(temp.children).filter(node =>
            ['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'section', 'article'].includes(node.tagName.toLowerCase())
        );
    }

    if (blocks.length === 0) {
        return <RichTextSpellCheck html={html} isActive={isActive} onIgnore={onIgnore} onReplace={onReplace} />;
    }

    const handleBlockReplace = (blockIdx, nextBlockHtml) => {
        if (!onReplace) return;

        // Rebuild full HTML from all blocks, replacing only one
        const updatedBlocks = blocks.map((b, i) => i === blockIdx ? nextBlockHtml : b.outerHTML);

        // Wrap back in a list if it was a list
        const isList = temp.querySelector('ul, ol');
        const listTag = isList ? isList.tagName.toLowerCase() : 'div';

        const finalHtml = `<${listTag}>${updatedBlocks.join('')}</${listTag}>`;
        onReplace(finalHtml);
    };

    return (
        <div className="splittable-rich-text">
            {blocks.map((block, i) => {
                // If we have a specific range (start, end), only render those
                if (range && range !== 'measure') {
                    if (i < range.start || i > range.end) return null;
                }

                const isLi = block.tagName.toLowerCase() === 'li';
                const content = (
                    <RichTextSpellCheck
                        html={block.outerHTML}
                        isActive={isActive}
                        onIgnore={onIgnore}
                        onReplace={(val) => handleBlockReplace(i, val)}
                    />
                );

                return (
                    <div key={i} data-sub-item-index={i} className="sub-item-block">
                        {isLi ? (
                            <ul style={{ listStyleType: 'disc', paddingLeft: '18px', margin: 0 }}>{content}</ul>
                        ) : content}
                    </div>
                );
            })}
        </div>
    );
};

/**
 * Standardized Job / Experience Entry
 */
export const ExperienceItem = ({ item, isSpellCheckActive, onSpellCheckIgnore, onSpellCheckReplace, variant = 'classic', index, subItemRange }) => {
    const handleReplace = (field, newVal) => {
        if (onSpellCheckReplace) onSpellCheckReplace(field, newVal);
    };

    const dateStr = item.date || item.year || (item.startYear ? `${item.startMonth ? item.startMonth + " " : ""}${item.startYear} - ${item.isCurrent ? "Present" : (item.endYear ? (item.endMonth ? item.endMonth + " " : "") + item.endYear : "Present")}` : "");

    return (
        <div className={`experience-item variant-${variant}`} data-item-index={index}>
            <div className="section-item-container">
                {/* Date Area */}
                {variant !== 'timeline' && (
                    <div className="item-date" data-debug-box="textbox">
                        <SpellCheckText
                            text={dateStr}
                            isActive={isSpellCheckActive}
                            onIgnore={onSpellCheckIgnore}
                            onReplace={(val) => handleReplace(item.year ? 'year' : 'date', val)}
                        />
                    </div>
                )}

                {/* Content Area */}
                <div style={{ flex: 1 }}>
                    <div className="item-header">
                        <h4 className="item-title" data-debug-box="textbox">
                            <RichTextSpellCheck
                                html={item.title || item.role}
                                isActive={isSpellCheckActive}
                                onIgnore={onSpellCheckIgnore}
                                onReplace={(val) => handleReplace(item.title ? 'title' : 'role', val)}
                            />
                        </h4>
                        {variant === 'timeline' && (
                            <div className="item-date" data-debug-box="textbox">
                                <SpellCheckText
                                    text={dateStr}
                                    isActive={isSpellCheckActive}
                                    onIgnore={onSpellCheckIgnore}
                                    onReplace={(val) => handleReplace(item.year ? 'year' : 'date', val)}
                                />
                            </div>
                        )}
                    </div>

                    <div className="item-subtitle" data-debug-box="textbox">
                        <SpellCheckText
                            text={item.company}
                            isActive={isSpellCheckActive}
                            onIgnore={onSpellCheckIgnore}
                            onReplace={(val) => handleReplace('company', val)}
                        />
                        {(item.location) && (
                            <span style={{ opacity: 0.8 }}> , <SpellCheckText
                                text={item.location}
                                isActive={isSpellCheckActive}
                                onIgnore={onSpellCheckIgnore}
                                onReplace={(val) => handleReplace('location', val)}
                            /></span>
                        )}
                        {item.isRemote && <span style={{ opacity: 0.8 }}> (Remote)</span>}
                    </div>
                    {item.description && (
                        <div className="resume-rich-text" data-debug-box="textbox">
                            <SplittableRichText
                                html={item.description}
                                range={subItemRange}
                                isActive={isSpellCheckActive}
                                onIgnore={onSpellCheckIgnore}
                                onReplace={(val) => handleReplace('description', val)}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/**
 * Standardized Education Entry
 */
export const EducationItem = ({ item, isSpellCheckActive, onSpellCheckIgnore, onSpellCheckReplace, variant = 'classic', index, subItemRange }) => {
    const eduDate = item.date || item.year || (item.startYear ? `${item.startMonth ? item.startMonth + " " : ""}${item.startYear} - ${item.isCurrent ? "Present" : (item.endYear || "Present")}` : (item.isCurrent ? "Present" : (item.endYear || '')));

    const handleReplace = (field, newVal) => {
        if (onSpellCheckReplace) onSpellCheckReplace(field, newVal);
    };

    return (
        <div className={`education-item variant-${variant}`} data-item-index={index}>
            <div className="item-header" style={{ marginBottom: "4px" }}>
                <h4 className="item-title">
                    <RichTextSpellCheck
                        html={item.degree}
                        isActive={isSpellCheckActive}
                        onIgnore={onSpellCheckIgnore}
                        onReplace={(val) => handleReplace('degree', val)}
                    />
                    {item.field && <span> in <SpellCheckText
                        text={item.field}
                        isActive={isSpellCheckActive}
                        onIgnore={onSpellCheckIgnore}
                        onReplace={(val) => handleReplace('field', val)}
                    /></span>}
                </h4>
                {(variant !== 'minimal' || variant === 'timeline') && (
                    <div className="item-date">
                        <SpellCheckText
                            text={eduDate}
                            isActive={isSpellCheckActive}
                            onIgnore={onSpellCheckIgnore}
                            onReplace={(val) => handleReplace(item.year ? 'year' : 'date', val)}
                        />
                    </div>
                )}
            </div>

            <div className="item-subtitle" style={{ marginBottom: (variant === 'minimal' || !item.description) ? "0" : "8px", display: "flex", justifyContent: "space-between" }}>
                <div>
                    <SpellCheckText
                        text={item.institution || item.school}
                        isActive={isSpellCheckActive}
                        onIgnore={onSpellCheckIgnore}
                        onReplace={(val) => handleReplace(item.institution ? 'institution' : 'school', val)}
                    />
                    {(item.city || item.location) && <span>, <SpellCheckText
                        text={item.city || item.location}
                        isActive={isSpellCheckActive}
                        onIgnore={onSpellCheckIgnore}
                        onReplace={(val) => handleReplace(item.city ? 'city' : 'location', val)}
                    /></span>}
                </div>
                {item.grade && (
                    <div style={{ fontSize: "calc(var(--font-size-small, 10px) * var(--theme-font-scale, 1))", color: "var(--theme-text-muted, #334155)", fontStyle: "italic", fontWeight: "700" }}>
                        <SpellCheckText
                            text={`GPA: ${item.grade}`}
                            isActive={isSpellCheckActive}
                            onIgnore={onSpellCheckIgnore}
                            onReplace={(val) => handleReplace('grade', val.replace("GPA: ", ""))}
                        />
                    </div>
                )}
            </div>
            {item.description && (
                <div className="resume-rich-text" style={{ marginTop: "6px" }}>
                    <SplittableRichText
                        html={item.description}
                        range={subItemRange}
                        isActive={isSpellCheckActive}
                        onIgnore={onSpellCheckIgnore}
                        onReplace={(val) => handleReplace('description', val)}
                    />
                </div>
            )}
        </div>
    );
};

/**
 * Project Entry
 */
export const ProjectItem = ({ item, isSpellCheckActive, onSpellCheckIgnore, onSpellCheckReplace, index, subItemRange }) => {
    const handleReplace = (field, newVal) => {
        if (onSpellCheckReplace) onSpellCheckReplace(field, newVal);
    };

    const dateStr = item.year || (item.startYear && `${item.startYear} - ${item.endYear || 'Present'}`);

    return (
        <div className="project-item" data-item-index={index} style={{ marginBottom: "calc(25px * var(--theme-paragraph-margin, 1))" }}>
            <div className="item-header" style={{ marginBottom: "4px" }}>
                <h4 className="item-title">
                    <RichTextSpellCheck
                        html={item.title}
                        isActive={isSpellCheckActive}
                        onIgnore={onSpellCheckIgnore}
                        onReplace={(val) => handleReplace('title', val)}
                    />
                    {item.link && (
                        <ResumeLink href={item.link} style={{ fontSize: "calc(var(--font-size-small, 10px) * var(--theme-font-scale, 1))", marginLeft: "12px", color: "var(--theme-color, #635bff)" }}>
                            Link ↗
                        </ResumeLink>
                    )}
                </h4>
                {dateStr && (
                    <span className="item-date" data-debug-box="textbox">
                        <SpellCheckText
                            text={dateStr}
                            isActive={isSpellCheckActive}
                            onIgnore={onSpellCheckIgnore}
                            onReplace={(val) => handleReplace(item.year ? 'year' : 'date', val)}
                        />
                    </span>
                )}
            </div>

            {/* Technologies */}
            {item.technologies && item.technologies.length > 0 && (
                <div style={{ marginBottom: "8px" }}>
                    <TagList
                        items={item.technologies}
                        variant="pills"
                        isSpellCheckActive={isSpellCheckActive}
                        onIgnore={onSpellCheckIgnore}
                        onSpellCheckReplace={(idx, val) => {
                            const updated = [...item.technologies];
                            updated[idx] = val;
                            handleReplace('technologies', updated);
                        }}
                    />
                </div>
            )}

            {item.description && (
                <div className="resume-rich-text" style={{ lineHeight: "1.6", marginTop: "8px" }}>
                    <SplittableRichText
                        html={item.description}
                        range={subItemRange}
                        isActive={isSpellCheckActive}
                        onIgnore={onSpellCheckIgnore}
                        onReplace={(val) => handleReplace('description', val)}
                    />
                </div>
            )}
        </div>
    );
};

/**
 * Individual Skill Item
 */
export const SkillItem = ({ skill, index, isSpellCheckActive, onSpellCheckIgnore, onSpellCheckReplace, variant = 'tags', originalIndex }) => {
    const isList = variant === 'list';
    const isMinimal = variant === 'minimal';
    const isObj = typeof skill === 'object';
    const level = isObj ? (skill.level ?? skill.rating) : null;

    const renderLevel = (lvl) => {
        if (!lvl || lvl <= 0) return null;
        return (
            <span style={{ display: "flex", gap: "3px", marginLeft: "8px", alignItems: "center" }}>
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            backgroundColor: i < lvl ? "var(--theme-color, #635bff)" : "rgba(120, 120, 120, 0.15)",
                            boxShadow: i < lvl ? "0 0 5px var(--theme-color, rgba(99, 91, 255, 0.3))" : "none"
                        }}
                    />
                ))}
            </span>
        );
    };

    if (isList) {
        return (
            <li style={{ marginBottom: "2px" }} data-item-index={originalIndex}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <RichTextSpellCheck
                        html={isObj ? skill.name : skill}
                        isActive={isSpellCheckActive}
                        onIgnore={onSpellCheckIgnore}
                        onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace(index, val, isObj ? 'name' : null)}
                    />
                    {level !== undefined && level !== null && renderLevel(level)}
                </div>
            </li>
        );
    }

    return (
        <div data-item-index={originalIndex} className={`skill-tag ${isMinimal ? 'minimal' : ''}`}>
            {isMinimal && <span style={{ marginRight: "6px", color: "var(--theme-color)" }}>•</span>}
            <RichTextSpellCheck
                html={isObj ? skill.name : skill}
                isActive={isSpellCheckActive}
                onIgnore={onSpellCheckIgnore}
                onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace(index, val, isObj ? 'name' : null)}
            />
            {level !== undefined && level !== null && renderLevel(level)}
        </div>
    );
};

/**
 * Enhanced Skills Component with Variants and Levels
 */
export const Skills = ({ items, isSpellCheckActive, onSpellCheckIgnore, onSpellCheckReplace, variant = 'tags', itemIndices = null }) => {
    if (!items || items.length === 0) return null;

    const isList = variant === 'list';
    const isGrid = variant === 'grid';

    if (isList) {
        return (
            <ul style={{ margin: "0 0 0 15px", padding: 0 }} className="resume-rich-text">
                {items.map((skill, i) => (
                    <SkillItem
                        key={i}
                        skill={skill}
                        index={i}
                        isSpellCheckActive={isSpellCheckActive}
                        onSpellCheckIgnore={onSpellCheckIgnore}
                        onSpellCheckReplace={onSpellCheckReplace}
                        variant={variant}
                        originalIndex={itemIndices ? itemIndices[i] : i}
                    />
                ))}
            </ul>
        );
    }

    return (
        <div className={isGrid ? "skills-grid" : "skills-flex"}>
            {items.map((skill, i) => (
                <SkillItem
                    key={i}
                    skill={skill}
                    index={i}
                    isSpellCheckActive={isSpellCheckActive}
                    onSpellCheckIgnore={onSpellCheckIgnore}
                    onSpellCheckReplace={onSpellCheckReplace}
                    variant={variant}
                    originalIndex={itemIndices ? itemIndices[i] : i}
                />
            ))}
        </div>
    );
};

/**
 * Standardized Languages / Software / Tags
 */
export const TagList = ({ items, isSpellCheckActive, onIgnore, onSpellCheckReplace, variant = 'pills', itemIndices = null }) => {
    if (!items || items.length === 0) return null;

    if (variant === 'bullets') {
        return (
            <ul className="resume-rich-text" style={{ paddingLeft: "18px", margin: 0 }}>
                {items.map((item, i) => {
                    const originalIndex = itemIndices ? itemIndices[i] : i;
                    return (
                        <li key={i} data-item-index={originalIndex}>
                            <RichTextSpellCheck
                                html={typeof item === 'object' ? item.name : item}
                                isActive={isSpellCheckActive}
                                onIgnore={onIgnore}
                                onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace(i, val)}
                            />
                        </li>
                    );
                })}
            </ul>
        );
    }

    return (
        <div className="skills-flex">
            {items.map((item, i) => {
                const originalIndex = itemIndices ? itemIndices[i] : i;
                const isPill = variant === 'pills' || variant === 'bordered';
                return (
                    <div
                        key={i}
                        data-item-index={originalIndex}
                        className={isPill ? "skill-tag" : ""}
                        style={!isPill ? { fontSize: "calc(var(--font-size-body, 11px) * var(--theme-font-scale, 1))", color: "var(--theme-text-muted)" } : {}}
                    >
                        <RichTextSpellCheck
                            html={typeof item === 'object' ? item.name : item}
                            isActive={isSpellCheckActive}
                            onIgnore={onIgnore}
                            onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace(i, val)}
                        />
                        {typeof item === 'object' && item.level && <span style={{ opacity: 0.6, marginLeft: "4px" }}>({item.level})</span>}
                    </div>
                );
            })}
        </div>
    );
};

/**
 * Highlighted section header used in zones (e.g. Sidebar).
 */
export const ZonalSectionHeader = ({ title }) => (
    <div
        style={{
            background: "var(--header-bg, var(--theme-color, #0a2540))",
            padding: "8px 15px",
            margin: "var(--zonal-header-margin, 0 -20px calc(15px * var(--theme-section-margin, 1)) -20px)",
            display: "flex",
            alignItems: "center"
        }}
    >
        <h3
            style={{
                fontSize: "calc(var(--font-size-item-title, 13px) * var(--theme-font-scale, 1))",
                fontWeight: "700",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "var(--section-title-color, #ffffff)",
                margin: 0
            }}
        >
            {title}
        </h3>
    </div>
);

/**
 * Higher-Order Component for Extra Sections
 */
export const ExtraSection = ({ id, title, data, onSectionClick, isSpellCheckActive, onSpellCheckIgnore, children, style = {} }) => {
    const isVisible = data.selectedExtraSections?.[id];
    if (!isVisible) return null;

    return (
        <SectionWrapper sectionId={id} onSectionClick={onSectionClick} isInteractive={!!onSectionClick && !isSpellCheckActive}>
            <section style={{ marginBottom: "calc(30px * var(--theme-section-margin, 1))", ...style }}>
                <SectionTitle title={title} />
                {children}
            </section>
        </SectionWrapper>
    );
};

const PROFICIENCY_MAPPING = {
    1: "Beginner",
    2: "Intermediate",
    3: "Advanced",
    4: "Fluent",
    5: "Native"
};

export const LanguageItem = ({ item, isSpellCheckActive, onIgnore, onSpellCheckReplace, index, variant, subItemRange }) => {
    const rawLevel = typeof item === 'object' ? (item.level || item.rating) : null;

    // Convert numeric level to label if it exists in our mapping
    const levelLabel = PROFICIENCY_MAPPING[rawLevel] || (typeof item.level === 'string' ? item.level : null);

    const renderStars = (lvl) => {
        let numericLevel = 0;
        if (typeof lvl === 'number') numericLevel = lvl;
        else if (typeof lvl === 'string') {
            const low = lvl.toLowerCase();
            if (low.includes('native') || low.includes('fluent')) numericLevel = 5;
            else if (low.includes('advanced')) numericLevel = 4;
            else if (low.includes('intermediate')) numericLevel = 3;
            else if (low.includes('basic') || low.includes('beginner')) numericLevel = 2;
            else if (!isNaN(parseInt(lvl))) numericLevel = parseInt(lvl);
        }

        if (numericLevel === 0) return null;

        return (
            <div className="star-rating" style={{ display: "flex", gap: "2px" }}>
                {[...Array(5)].map((_, i) => (
                    <svg key={i} width="10" height="10" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ fill: i < numericLevel ? "var(--theme-color, #635bff)" : "rgba(0,0,0,0.05)", color: i < numericLevel ? "var(--theme-color, #635bff)" : "#e2e8f0" }}>
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                ))}
            </div>
        );
    };

    const isCompact = variant === 'compact';

    return (
        <div data-item-index={index} className={`language-item variant-${variant}`} style={{
            display: isCompact ? "inline-flex" : "flex",
            justifyContent: isCompact ? "flex-start" : "space-between",
            alignItems: "center",
            marginBottom: isCompact ? "0" : "6px",
            gap: isCompact ? "4px" : "10px"
        }}>
            <span style={{ fontWeight: "600", fontSize: "calc(var(--item-base-size, 13px) * var(--theme-font-scale, 1))" }}>
                <RichTextSpellCheck
                    html={typeof item === 'object' ? item.name : item}
                    isActive={isSpellCheckActive}
                    onIgnore={onIgnore}
                    onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('name', val)}
                />
            </span>
            {levelLabel && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {!isCompact && renderStars(rawLevel)}
                    <span style={{
                        fontSize: isCompact ? "calc(var(--item-base-size, 13px) * var(--theme-font-scale, 1))" : "calc(var(--font-size-small, 11px) * var(--theme-font-scale, 1))",
                        color: isCompact ? "inherit" : "var(--theme-text-muted, #64748b)",
                        fontWeight: isCompact ? "400" : "500",
                        opacity: isCompact ? 0.8 : 1
                    }}>
                        {isCompact && " ("}
                        <SpellCheckText
                            text={levelLabel}
                            isActive={isSpellCheckActive}
                            onIgnore={onIgnore}
                            onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('level', val)}
                        />
                        {isCompact && ")"}
                    </span>
                </div>
            )}
        </div>
    );
};

export const CertificationItem = ({ item, isSpellCheckActive, onIgnore, onSpellCheckReplace, index, variant, subItemRange }) => {
    const isCompact = variant === 'compact';
    const dateStr = item?.date || item?.year;

    return (
        <div data-item-index={index} className={`certification-item variant-${variant}`} style={{
            marginBottom: isCompact ? "8px" : "15px",
            display: "flex",
            flexDirection: "column"
        }}>
            <div className="item-header" style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                flexDirection: isCompact ? "column" : "row",
                gap: isCompact ? "2px" : "10px"
            }}>
                <div className="item-title" style={{
                    fontWeight: "700",
                    fontSize: isCompact ? "calc(13px * var(--theme-font-scale, 1))" : "calc(14.5px * var(--theme-font-scale, 1))",
                    color: "var(--theme-text-primary, #1e293b)"
                }}>
                    <RichTextSpellCheck
                        html={typeof item === 'object' ? item.name : item}
                        isActive={isSpellCheckActive}
                        onIgnore={onIgnore}
                        onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('name', val)}
                    />
                </div>
                {dateStr && (
                    <div className="item-date" style={{
                        fontSize: "calc(12px * var(--theme-font-scale, 1))",
                        color: "var(--theme-text-muted, #64748b)",
                        fontStyle: isCompact ? "normal" : "italic",
                        opacity: 0.8
                    }}>
                        <SpellCheckText
                            text={dateStr}
                            isActive={isSpellCheckActive}
                            onIgnore={onIgnore}
                            onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('date', val)}
                        />
                    </div>
                )}
            </div>
            {item && (item.issuer || item.authority) && (
                <div style={{
                    fontSize: "calc(12px * var(--theme-font-scale, 1))",
                    color: "var(--theme-text-muted, #475569)",
                    marginTop: "2px",
                    fontWeight: "500"
                }}>
                    <SpellCheckText
                        text={item.issuer || item.authority}
                        isActive={isSpellCheckActive}
                        onIgnore={onIgnore}
                        onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace(item.issuer ? 'issuer' : 'authority', val)}
                    />
                </div>
            )}
            {item?.description && (
                <div className="resume-rich-text" style={{
                    fontSize: "calc(12.5px * var(--theme-font-scale, 1))",
                    lineHeight: "1.6",
                    marginTop: "6px",
                    color: "var(--theme-text-body, #334155)"
                }}>
                    <SplittableRichText
                        html={item.description}
                        range={subItemRange}
                        isActive={isSpellCheckActive}
                        onIgnore={onIgnore}
                        onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('description', val)}
                    />
                </div>
            )}
        </div>
    );
};

export const SoftwareItem = ({ item, isSpellCheckActive, onIgnore, onSpellCheckReplace, index, variant, subItemRange }) => {
    const isCompact = variant === 'compact' || variant === 'sidebar';
    const level = item?.rating || item?.level;

    const renderStars = (lvl) => {
        if (!lvl || lvl <= 0) return null;
        return (
            <div className="star-rating" style={{ display: "flex", gap: "3px", alignItems: "center" }}>
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        style={{
                            width: "7px",
                            height: "7px",
                            borderRadius: "50%",
                            backgroundColor: i < lvl ? "var(--theme-color, #635bff)" : "rgba(120, 120, 120, 0.15)",
                            boxShadow: i < lvl ? "0 0 4px var(--theme-color, rgba(99, 91, 255, 0.2))" : "none"
                        }}
                    />
                ))}
            </div>
        );
    };

    return (
        <div data-item-index={index} className={`software-item variant-${variant}`} style={{
            marginBottom: isCompact ? "8px" : "15px",
            display: "flex",
            flexDirection: "column"
        }}>
            <div className="item-header" style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                flexDirection: isCompact ? "column" : "row",
                gap: isCompact ? "4px" : "10px"
            }}>
                <div className="item-title" style={{
                    fontWeight: "700",
                    fontSize: isCompact ? "calc(13.5px * var(--theme-font-scale, 1))" : "calc(15px * var(--theme-font-scale, 1))",
                    color: "var(--theme-text-primary, #1e293b)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                }}>
                    <RichTextSpellCheck
                        html={typeof item === 'object' ? item.name : item}
                        isActive={isSpellCheckActive}
                        onIgnore={onIgnore}
                        onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('name', val)}
                    />
                    {!isCompact && renderStars(level)}
                </div>
                {isCompact && level > 0 && (
                    <div style={{ marginTop: "2px" }}>
                        {renderStars(level)}
                    </div>
                )}
            </div>

            {item?.description && (
                <div className="resume-rich-text" style={{
                    fontSize: "calc(12.5px * var(--theme-font-scale, 1))",
                    lineHeight: "1.6",
                    marginTop: "6px",
                    color: "var(--theme-text-body, #334155)"
                }}>
                    <SplittableRichText
                        html={item.description}
                        range={subItemRange}
                        isActive={isSpellCheckActive}
                        onIgnore={onIgnore}
                        onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('description', val)}
                    />
                </div>
            )}
        </div>
    );
};

/**
 * ResumeLink Component
 * Ensures links have proper protocols and are clickable in PDFs.
 */
export const ResumeLink = ({ href, children, style = {}, className = "" }) => {
    if (!href) return children;

    const { resumeData } = useResumeContext() || {};
    const shouldShorten = resumeData?.personal?.shortenHeaderLinks;

    let targetHref = href.trim();

    // Auto-detect email
    if (targetHref.includes('@') && !targetHref.startsWith('mailto:') && !targetHref.includes('://')) {
        targetHref = `mailto:${targetHref}`;
    }
    // Auto-detect phone (simple check for numbers and +)
    else if (/^[\d\s+()-]+$/.test(targetHref) && targetHref.length > 5 && !targetHref.startsWith('tel:')) {
        targetHref = `tel:${targetHref.replace(/\s/g, '')}`;
    }
    // Auto-detect web links
    else if (!targetHref.startsWith('http') && !targetHref.startsWith('mailto:') && !targetHref.startsWith('tel:')) {
        targetHref = `https://${targetHref}`;
    }

    // LABEL SHORTENING LOGIC (Smart Header Labels)
    let displayChildren = children;
    if (shouldShorten) {
        const lowerHref = targetHref.toLowerCase().replace('https://', '').replace('http://', '').replace('www.', '').split(/[/?#]/)[0];

        let label = null;
        if (lowerHref.includes('linkedin.com')) label = 'LinkedIn';
        else if (lowerHref.includes('github.com')) label = 'GitHub';
        else if (lowerHref.includes('twitter.com') || lowerHref.includes('x.com')) label = 'Twitter';
        else if (lowerHref.includes('portfolio') ||
            (resumeData?.personal?.website && lowerHref === resumeData.personal.website.replace(/https?:\/\//, '').replace('www.', '').split(/[/?#]/)[0])) {
            label = 'Website';
        }

        if (label) {
            // CASE 1: Child is a string
            if (typeof children === 'string') {
                const lowerChild = children.toLowerCase();
                if (lowerChild.includes('.') || lowerChild.startsWith('http')) {
                    displayChildren = label;
                }
            }
            // CASE 2: Child is a SpellCheckText component (passed text prop)
            else if (React.isValidElement(children) && children.props && children.props.text) {
                const childText = String(children.props.text || "").toLowerCase();
                if (childText.includes('.') || childText.startsWith('http') || childText.includes('com/')) {
                    displayChildren = React.cloneElement(children, { text: label });
                }
            }
        }
    }

    return (
        <a
            href={targetHref}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                color: "inherit",
                textDecoration: "none",
                ...style
            }}
            className={`resume-link ${className}`}
        >
            {displayChildren}
        </a>
    );
};

export const WebsiteItem = ({ item, isSpellCheckActive, onIgnore, onSpellCheckReplace, index }) => (
    <li data-item-index={index} style={{ marginBottom: "4px" }} className="resume-rich-text">
        <ResumeLink href={item.url} style={{ color: "var(--theme-color, #635bff)" }}>
            <SpellCheckText
                text={item.url}
                isActive={isSpellCheckActive}
                onIgnore={onIgnore}
                onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('url', val)}
            />
        </ResumeLink>
    </li>
);

export const AchievementItem = ({ item, isSpellCheckActive, onIgnore, onSpellCheckReplace, index, subItemRange }) => {
    const isObject = item && typeof item === 'object';
    const name = isObject ? item.name : item;
    const description = isObject ? item.description : null;

    return (
        <li data-item-index={index} style={{ marginBottom: "8px", paddingLeft: "4px" }} className="resume-rich-text">
            <div>
                <RichTextSpellCheck
                    html={name}
                    isActive={isSpellCheckActive}
                    onIgnore={onIgnore}
                    onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace(isObject ? 'name' : null, val)}
                />
            </div>
            {description && (
                <div style={{ fontSize: "0.95em", marginTop: "2px", opacity: 0.9 }}>
                    <SplittableRichText
                        html={description}
                        range={subItemRange}
                        isActive={isSpellCheckActive}
                        onIgnore={onIgnore}
                        onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('description', val)}
                    />
                </div>
            )}
        </li>
    );
};

export const AccomplishmentItem = ({ item, isSpellCheckActive, onIgnore, onSpellCheckReplace, index, subItemRange }) => {
    const isObject = item && typeof item === 'object';
    const name = isObject ? item.name : item;
    const description = isObject ? item.description : null;

    return (
        <li data-item-index={index} style={{ marginBottom: "8px", paddingLeft: "4px" }} className="resume-rich-text">
            <div>
                <RichTextSpellCheck
                    html={name}
                    isActive={isSpellCheckActive}
                    onIgnore={onIgnore}
                    onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace(isObject ? 'name' : null, val)}
                />
            </div>
            {description && (
                <div style={{ fontSize: "0.95em", marginTop: "2px", opacity: 0.9 }}>
                    <SplittableRichText
                        html={description}
                        range={subItemRange}
                        isActive={isSpellCheckActive}
                        onIgnore={onIgnore}
                        onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('description', val)}
                    />
                </div>
            )}
        </li>
    );
};

export const AffiliationItem = ({ item, isSpellCheckActive, onIgnore, onSpellCheckReplace, index, subItemRange }) => {
    const isObject = item && typeof item === 'object';
    const name = isObject ? item.name : item;
    const description = isObject ? item.description : null;

    return (
        <li data-item-index={index} style={{ marginBottom: "8px" }} className="resume-rich-text">
            <div>
                <RichTextSpellCheck
                    html={name}
                    isActive={isSpellCheckActive}
                    onIgnore={onIgnore}
                    onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace(isObject ? 'name' : null, val)}
                />
            </div>
            {description && (
                <div style={{ fontSize: "0.95em", marginTop: "2px", opacity: 0.9 }}>
                    <SplittableRichText
                        html={description}
                        range={subItemRange}
                        isActive={isSpellCheckActive}
                        onIgnore={onIgnore}
                        onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('description', val)}
                    />
                </div>
            )}
        </li>
    );
};

export default {
    SectionTitle,
    ZonalSectionHeader,
    ExperienceItem,
    EducationItem,
    Skills,
    ProjectItem,
    TagList,
    SpellCheckText,
    RichTextSpellCheck,
    ExtraSection,
    LanguageItem,
    CertificationItem,
    SoftwareItem,
    WebsiteItem,
    AchievementItem,
    AffiliationItem
};
