import React, { useState, useEffect, createContext, useContext } from 'react';
import SectionWrapper from "../../components/SectionWrapper";
import {
    SectionTitle,
    ExperienceItem,
    EducationItem,
    Skills,
    SkillItem,
    ProjectItem,
    TagList,
    SpellCheckText,
    RichTextSpellCheck,
    LanguageItem,
    CertificationItem,
    SoftwareItem,
    WebsiteItem,
    AchievementItem,
    AccomplishmentItem,
    AffiliationItem,
    SplittableRichText
} from "./BaseComponents";

import { SectionContext, useSectionContext } from './SectionContext';

const SectionRenderer = ({
    sectionId,
    data,
    onSectionClick,
    isSpellCheckActive,
    onSpellCheckIgnore,
    onSpellCheckReplace,
    variants = {},
    customRenderers = {},
    itemIndices = null, // New: only render these indices
    isContinued = false, // New: show (Continued) in title
    subItemRanges = {}, // New: Map of item index to {start, end} for surgical splitting
    zoneId = 'main' // New: identifies the column/region
}) => {
    if (!data) return null;

    const isInteractive = !!onSectionClick && !isSpellCheckActive;

    const {
        summary,
        experience = [],
        education = [],
        skills = [],
        skillsDescription,
        projects = [],
        languages = [],
        certifications = [],
        interests = [],
        websites = [],
        software = [],
        affiliations,
        strengths = [],
        additionalSkills = [],
        accomplishments,
        keyAchievements,
        additionalInfo
    } = data;

    // Helper to filter items if itemIndices is provided
    const getFilteredItems = (items) => {
        if (!items) return [];
        if (!itemIndices) return items;
        return itemIndices.map(idx => items[idx]).filter(Boolean);
    };

    const getTitle = (baseTitle) => isContinued ? `${baseTitle} (Continued)` : baseTitle;

    const defaultRenderers = {
        summary: () => summary && (
            <SectionWrapper sectionId="summary" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Summary">
                <div style={{ marginBottom: "var(--theme-section-margin, 25px)" }}>

                    <SectionTitle title={getTitle("Summary")} />
                    <div
                        className="resume-rich-text"
                    >
                        <SplittableRichText
                            html={summary}
                            isActive={isSpellCheckActive}
                            onIgnore={onSpellCheckIgnore}
                            onReplace={(val) => onSpellCheckReplace('summary', 'summary', val)}
                            range={subItemRanges?.['summary']}
                        />
                    </div>
                </div>
            </SectionWrapper>
        ),
        experience: () => {
            const items = getFilteredItems(experience);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="experience" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Experience">
                    <div style={{ marginBottom: "var(--theme-section-margin, 25px)" }}>

                        <SectionTitle title={getTitle("Experience")} />
                        {items.map((exp, index) => {
                            const originalIndex = itemIndices ? itemIndices[index] : index;
                            return (
                                <ExperienceItem
                                    key={originalIndex}
                                    item={exp}
                                    isSpellCheckActive={isSpellCheckActive}
                                    onSpellCheckIgnore={onSpellCheckIgnore}
                                    onSpellCheckReplace={(field, val) => onSpellCheckReplace('experience', originalIndex, val, field)}
                                    variant={variants.experience}
                                    index={originalIndex}
                                    subItemRange={subItemRanges?.[originalIndex]}
                                />
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },
        education: () => {
            const items = getFilteredItems(education);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="education" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Education">
                    <div style={{ marginBottom: "var(--theme-section-margin, 25px)" }}>

                        <SectionTitle title={getTitle("Education")} />
                        {items.map((edu, index) => {
                            const originalIndex = itemIndices ? itemIndices[index] : index;
                            return (
                                <EducationItem
                                    key={originalIndex}
                                    item={edu}
                                    isSpellCheckActive={isSpellCheckActive}
                                    onSpellCheckIgnore={onSpellCheckIgnore}
                                    onSpellCheckReplace={(field, val) => onSpellCheckReplace('education', originalIndex, val, field)}
                                    variant={variants.education}
                                    index={originalIndex}
                                    subItemRange={subItemRanges?.[originalIndex]}
                                />
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },
        projects: () => {
            const items = getFilteredItems(projects);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="projects" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Projects">
                    <div style={{ marginBottom: "var(--theme-section-margin, 25px)" }}>

                        <SectionTitle title={getTitle("Projects")} />
                        {items.map((proj, index) => {
                            const originalIndex = itemIndices ? itemIndices[index] : index;
                            return (
                                <ProjectItem
                                    key={originalIndex}
                                    item={proj}
                                    isSpellCheckActive={isSpellCheckActive}
                                    onSpellCheckIgnore={onSpellCheckIgnore}
                                    onSpellCheckReplace={(field, val) => onSpellCheckReplace('projects', originalIndex, val, field)}
                                    index={originalIndex}
                                    subItemRange={subItemRanges?.[originalIndex]}
                                />
                            );
                        })}
                    </div>
                </SectionWrapper>
            );
        },
        software: ({ itemIndices, isContinued, zoneId: renderZoneId, subItemRanges: renderSubItemRanges }) => {
            const items = itemIndices ? itemIndices.map(idx => data.software?.[idx]) : data.software;
            if (!items || items.length === 0) return null;

            const effectiveZoneId = renderZoneId || zoneId;
            const isSidebar = effectiveZoneId?.toLowerCase().includes('sidebar') || effectiveZoneId?.toLowerCase().includes('left') || effectiveZoneId?.toLowerCase().includes('right');
            const effectiveVariant = variants.software || (isSidebar ? 'compact' : undefined);

            return (
                <SectionWrapper sectionId="software" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Software">
                    <div style={{ marginBottom: "var(--theme-section-margin, 25px)" }}>
                        <SectionTitle title={getTitle("Software & Tools")} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {items.map((item, index) => {
                                const originalIndex = itemIndices ? itemIndices[index] : index;
                                return (
                                    <SoftwareItem
                                        key={originalIndex}
                                        item={item}
                                        isSpellCheckActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onSpellCheckReplace={(field, val) => onSpellCheckReplace('software', originalIndex, val, field)}
                                        index={originalIndex}
                                        variant={effectiveVariant}
                                        subItemRange={renderSubItemRanges?.[originalIndex] || subItemRanges?.[originalIndex]}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },
        languages: ({ zoneId: renderZoneId } = {}) => {
            const items = getFilteredItems(languages);
            if (items.length === 0) return null;
            const effectiveZoneId = renderZoneId || zoneId;
            const isSidebar = effectiveZoneId?.toLowerCase().includes('sidebar') || effectiveZoneId?.toLowerCase().includes('left') || effectiveZoneId?.toLowerCase().includes('right');
            const effectiveVariant = variants.languages || (isSidebar ? 'compact' : undefined);

            return (
                <SectionWrapper sectionId="languages" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Languages">
                    <div style={{ marginBottom: "var(--theme-section-margin, 25px)" }}>

                        <SectionTitle title={getTitle("Languages")} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                            {items.map((lang, index) => {
                                const originalIndex = itemIndices ? itemIndices[index] : index;
                                return (
                                    <LanguageItem
                                        key={originalIndex}
                                        item={lang}
                                        isSpellCheckActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onSpellCheckReplace={(field, val) => onSpellCheckReplace('languages', originalIndex, val, field)}
                                        index={originalIndex}
                                        variant={effectiveVariant}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },
        certifications: ({ itemIndices, isContinued, zoneId: renderZoneId, subItemRanges: renderSubItemRanges }) => {
            const items = itemIndices ? itemIndices.map(idx => data.certifications?.[idx]) : data.certifications;
            if (!items || items.length === 0) return null;

            const effectiveZoneId = renderZoneId || zoneId;
            const isSidebar = effectiveZoneId?.toLowerCase().includes('sidebar') || effectiveZoneId?.toLowerCase().includes('left') || effectiveZoneId?.toLowerCase().includes('right');
            const effectiveVariant = variants.certifications || (isSidebar ? 'compact' : undefined);

            return (
                <SectionWrapper sectionId="certifications" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Certifications">
                    <div style={{ marginBottom: "var(--theme-section-margin, 25px)" }}>
                        <SectionTitle title={getTitle("Certifications")} />
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {items.map((cert, index) => {
                                const originalIndex = itemIndices ? itemIndices[index] : index;
                                return (
                                    <CertificationItem
                                        key={originalIndex}
                                        item={cert}
                                        isSpellCheckActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onSpellCheckReplace={(field, val) => onSpellCheckReplace('certifications', originalIndex, val, field)}
                                        index={originalIndex}
                                        variant={effectiveVariant}
                                        subItemRange={renderSubItemRanges?.[originalIndex] || subItemRanges?.[originalIndex]}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },
        skills: () => {
            const items = getFilteredItems(skills);
            const hasDescription = skillsDescription && skillsDescription.trim();
            // Prioritize structured skills (has level data) over rich text description
            const useStructured = items.length > 0;
            const hasItems = items.length > 0 || hasDescription;
            if (!hasItems) return null;
            return (
                <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Skills">
                    <div style={{ marginBottom: "var(--theme-section-margin, 25px)" }}>

                        <SectionTitle title={getTitle("Skills")} />
                        {/* PRIMARY: Render structured skill items with levels (each has data-item-index for pagination splitting) */}
                        {useStructured && (
                            <div className={variants.skills === 'list' ? "skills-list-vertical" : "skills-flex"}>
                                {items.map((skill, index) => {
                                    const originalIndex = itemIndices ? itemIndices[index] : index;
                                    return (
                                        <SkillItem
                                            key={originalIndex}
                                            skill={skill}
                                            index={index}
                                            isSpellCheckActive={isSpellCheckActive}
                                            onSpellCheckIgnore={onSpellCheckIgnore}
                                            onSpellCheckReplace={(idx, val, field) => {
                                                const orig = itemIndices ? itemIndices[idx] : idx;
                                                onSpellCheckReplace('skills', orig, val, field);
                                            }}
                                            variant={variants.skills}
                                            originalIndex={originalIndex}
                                        />
                                    );
                                })}
                            </div>
                        )}
                        {/* FALLBACK: Rich text description only when no structured skills exist */}
                        {!useStructured && hasDescription && (
                            <div className="resume-rich-text">
                                <SplittableRichText
                                    html={skillsDescription}
                                    isActive={isSpellCheckActive}
                                    onIgnore={onSpellCheckIgnore}
                                    onReplace={(val) => onSpellCheckReplace && onSpellCheckReplace('skills', 'skillsDescription', val)}
                                    range={subItemRanges?.['skills']}
                                />
                            </div>
                        )}
                    </div>
                </SectionWrapper>
            );
        },
        strengths: () => {
            const items = getFilteredItems(strengths);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="strengths" navigationId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Key Strengths">
                    <div style={{ marginBottom: "var(--theme-section-margin, 25px)" }}>
                        <SectionTitle title={getTitle("Key Strengths")} />
                        <div className="skills-flex">
                            {items.map((item, index) => {
                                const originalIndex = itemIndices ? itemIndices[index] : index;
                                return (
                                    <SkillItem
                                        key={`str-${originalIndex}`}
                                        skill={item}
                                        index={index}
                                        isSpellCheckActive={isSpellCheckActive}
                                        onSpellCheckIgnore={onSpellCheckIgnore}
                                        onSpellCheckReplace={(idx, val, field) => {
                                            const orig = itemIndices ? itemIndices[idx] : idx;
                                            onSpellCheckReplace('strengths', orig, val, field);
                                        }}
                                        variant="minimal"
                                        originalIndex={originalIndex}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },
        additionalSkills: () => {
            const items = getFilteredItems(additionalSkills);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="additionalSkills" navigationId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Additional Skills">
                    <div style={{ marginBottom: "var(--theme-section-margin, 25px)" }}>
                        <SectionTitle title={getTitle("Additional Skills")} />
                        <div className="skills-flex">
                            {items.map((item, index) => {
                                const originalIndex = itemIndices ? itemIndices[index] : index;
                                return (
                                    <SkillItem
                                        key={`add-${originalIndex}`}
                                        skill={item}
                                        index={index}
                                        isSpellCheckActive={isSpellCheckActive}
                                        onSpellCheckIgnore={onSpellCheckIgnore}
                                        onSpellCheckReplace={(idx, val, field) => {
                                            const orig = itemIndices ? itemIndices[idx] : idx;
                                            onSpellCheckReplace('additionalSkills', orig, val, field);
                                        }}
                                        variant="minimal"
                                        originalIndex={originalIndex}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },
        websites: () => {
            // Filter out header items first, then apply itemIndices (which always reference original data.websites positions)
            const allWebsites = websites || [];
            let visibleItems;
            if (itemIndices) {
                // itemIndices refer to positions in data.websites; pick those and exclude addToHeader ones
                visibleItems = itemIndices
                    .map(idx => ({ item: allWebsites[idx], originalIndex: idx }))
                    .filter(e => e.item && !e.item.addToHeader);
            } else {
                visibleItems = allWebsites
                    .map((item, idx) => ({ item, originalIndex: idx }))
                    .filter(e => !e.item.addToHeader);
            }
            if (visibleItems.length === 0) return null;
            return (
                <SectionWrapper sectionId="websites" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Websites">
                    <div style={{ marginBottom: "var(--theme-section-margin, 25px)" }}>

                        <SectionTitle title={getTitle("Websites & Portfolios")} />
                        <ul className="resume-rich-text" style={{
                            margin: 0, paddingLeft: "18px"
                        }}>
                            {visibleItems.map(({ item: site, originalIndex }) => (
                                <WebsiteItem
                                    key={originalIndex}
                                    item={site}
                                    isSpellCheckActive={isSpellCheckActive}
                                    onIgnore={onSpellCheckIgnore}
                                    onSpellCheckReplace={(field, val) => onSpellCheckReplace('websites', originalIndex, val, field)}
                                    index={originalIndex}
                                />
                            ))}
                        </ul>
                    </div>
                </SectionWrapper>
            );
        },
        keyAchievements: ({ itemIndices, subItemRanges }) => {
            const achievements = data.keyAchievements || [];
            const rawEntries = (itemIndices || achievements.map((_, i) => i)).map(idx => ({
                item: achievements[idx],
                originalIndex: idx
            })).filter(e => e.item);

            // Filter out truly empty entries
            const entries = rawEntries.filter(e => {
                const name = typeof e.item === 'object' ? e.item.name : e.item;
                const desc = typeof e.item === 'object' ? e.item.description : null;
                return (name && name.trim() !== "" && name !== "<p><br></p>") || (desc && desc.trim() !== "" && desc !== "<p><br></p>");
            });

            if (entries.length === 0) return null;

            return (
                <SectionWrapper sectionId="keyAchievements" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Key Achievements">
                    <div style={{ marginBottom: "var(--theme-section-margin, 25px)" }}>
                        <SectionTitle title={getTitle("Key Achievements")} />
                        <ul className="resume-rich-text" style={{ margin: 0, paddingLeft: "18px" }}>
                            {entries.map((entry, index) => {
                                return (
                                    <AchievementItem
                                        key={entry.originalIndex}
                                        item={entry.item}
                                        index={entry.originalIndex}
                                        isSpellCheckActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onSpellCheckReplace={(field, val) => onSpellCheckReplace('keyAchievements', entry.originalIndex, val, field)}
                                        subItemRange={subItemRanges?.[entry.originalIndex]}
                                    />
                                );
                            })}
                        </ul>
                    </div>
                </SectionWrapper>
            );
        },
        accomplishments: ({ itemIndices, subItemRanges }) => {
            const accomplishments = Array.isArray(data.accomplishments) ? data.accomplishments : (data.accomplishments ? [data.accomplishments] : []);
            const rawEntries = (itemIndices || accomplishments.map((_, i) => i)).map(idx => ({
                item: accomplishments[idx],
                originalIndex: idx
            })).filter(e => e.item);

            // Filter out truly empty entries
            const entries = rawEntries.filter(e => {
                const name = typeof e.item === 'object' ? e.item.name : e.item;
                const desc = typeof e.item === 'object' ? e.item.description : null;
                return (name && name.trim() !== "" && name !== "<p><br></p>") || (desc && desc.trim() !== "" && desc !== "<p><br></p>");
            });

            if (entries.length === 0) return null;

            return (
                <SectionWrapper sectionId="accomplishments" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Accomplishments">
                    <div style={{ marginBottom: "var(--theme-section-margin, 25px)" }}>
                        <SectionTitle title={getTitle("Accomplishments")} />
                        <ul className="resume-rich-text" style={{ margin: 0, paddingLeft: "18px" }}>
                            {entries.map((entry, index) => {
                                return (
                                    <AccomplishmentItem
                                        key={entry.originalIndex}
                                        item={entry.item}
                                        index={entry.originalIndex}
                                        isSpellCheckActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onSpellCheckReplace={(field, val) => onSpellCheckReplace('accomplishments', entry.originalIndex, val, field)}
                                        subItemRange={subItemRanges?.[entry.originalIndex]}
                                    />
                                );
                            })}
                        </ul>
                    </div>
                </SectionWrapper>
            );
        },
        affiliations: ({ itemIndices, subItemRanges }) => {
            const affiliations = Array.isArray(data.affiliations) ? data.affiliations : (data.affiliations ? [data.affiliations] : []);
            const rawEntries = (itemIndices || affiliations.map((_, i) => i)).map(idx => ({
                item: affiliations[idx],
                originalIndex: idx
            })).filter(e => e.item);

            // Filter out truly empty entries
            const entries = rawEntries.filter(e => {
                const name = typeof e.item === 'object' ? e.item.name : e.item;
                const desc = typeof e.item === 'object' ? e.item.description : null;
                return (name && name.trim() !== "" && name !== "<p><br></p>") || (desc && desc.trim() !== "" && desc !== "<p><br></p>");
            });

            if (entries.length === 0) return null;

            return (
                <SectionWrapper sectionId="affiliations" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Affiliations">
                    <div style={{ marginBottom: "var(--theme-section-margin, 25px)" }}>
                        <SectionTitle title={getTitle("Affiliations")} />
                        <ul className="resume-rich-text" style={{ margin: 0, paddingLeft: "18px" }}>
                            {entries.map((entry, index) => {
                                return (
                                    <AffiliationItem
                                        key={entry.originalIndex}
                                        item={entry.item}
                                        index={entry.originalIndex}
                                        isSpellCheckActive={isSpellCheckActive}
                                        onIgnore={onSpellCheckIgnore}
                                        onSpellCheckReplace={(field, val) => onSpellCheckReplace('affiliations', entry.originalIndex, val, field)}
                                        subItemRange={subItemRanges?.[entry.originalIndex]}
                                    />
                                );
                            })}
                        </ul>
                    </div>
                </SectionWrapper>
            );
        },
        additionalInfo: ({ subItemRanges: renderSubItemRanges }) => {
            const html = data.additionalInfo || "";
            // Filter out truly empty content
            if (!html || html.trim() === "" || html === "<p><br></p>") return null;

            return (
                <SectionWrapper sectionId="additionalInfo" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Additional Info">
                    <div style={{ marginBottom: "var(--theme-section-margin, 25px)" }}>
                        <SectionTitle title={getTitle("Additional Info")} />
                        <div
                            className="resume-rich-text"
                            style={{ paddingLeft: "18px" }}
                        >
                            <SplittableRichText
                                html={html}
                                isActive={isSpellCheckActive}
                                onIgnore={onSpellCheckIgnore}
                                onReplace={(val) => onSpellCheckReplace('additionalInfo', 'additionalInfo', val)}
                                range={renderSubItemRanges?.['additionalInfo']}
                            />
                        </div>
                    </div>
                </SectionWrapper>
            );
        },
        custom: ({ subItemRanges: renderSubItemRanges }) => {
            if (!data.customSection?.isVisible || !data.customSection?.content) return null;
            const content = data.customSection.content;
            // Filter out truly empty content
            if (!content || content.trim() === "" || content === "<p><br></p>") return null;

            const title = data.customSection.title || "Custom Section";

            return (
                <SectionWrapper sectionId="custom" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Custom Section">
                    <div style={{ marginBottom: "var(--theme-section-margin, 25px)" }}>
                        <SectionTitle title={getTitle(title)} />
                        <div
                            className="resume-rich-text"
                            style={{ paddingLeft: "18px" }}
                        >
                            <SplittableRichText
                                html={content}
                                isActive={isSpellCheckActive}
                                onIgnore={onSpellCheckIgnore}
                                onReplace={(val) => onSpellCheckReplace('customSection', 'content', val)}
                                range={renderSubItemRanges?.['custom']}
                            />
                        </div>
                    </div>
                </SectionWrapper>
            );
        },
        interests: () => {
            const items = getFilteredItems(interests);
            if (items.length === 0) return null;
            return (
                <SectionWrapper sectionId="interests" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Interests">
                    <div style={{ marginBottom: "var(--theme-section-margin, 25px)" }}>

                        <SectionTitle title={getTitle("Interests")} />
                        <div className="skills-flex">
                            {items.map((item, index) => {
                                const originalIndex = itemIndices ? itemIndices[index] : index;
                                return (
                                    <SkillItem
                                        key={originalIndex}
                                        skill={item}
                                        index={index}
                                        isSpellCheckActive={isSpellCheckActive}
                                        onSpellCheckIgnore={onSpellCheckIgnore}
                                        onSpellCheckReplace={(idx, val) => {
                                            const orig = itemIndices ? itemIndices[idx] : idx;
                                            onSpellCheckReplace('interests', orig, val);
                                        }}
                                        variant="minimal"
                                        originalIndex={originalIndex}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },
        personalDetails: () => {
            const { personal = {} } = data;
            const details = [
                { label: 'Date of Birth', value: personal.dob },
                { label: 'Nationality', value: personal.nationality },
                { label: 'Marital Status', value: personal.maritalStatus },
                { label: 'Gender', value: personal.gender },
                { label: 'Religion', value: personal.religion },
                { label: 'Visa Status', value: personal.visaStatus },
                { label: 'Passport', value: personal.passport },
                { label: 'Other', value: personal.otherPersonal }
            ].filter(d => d.value);

            if (details.length === 0) return null;

            return (
                <SectionWrapper sectionId="personalDetails" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Personal Details">
                    <div style={{ marginBottom: "var(--theme-section-margin, 25px)" }}>
                        <SectionTitle title={getTitle("Personal Details")} />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 20px" }}>
                            {details.map((detail, idx) => (
                                <div key={idx} style={{ fontSize: "calc(13px * var(--theme-font-scale, 1))" }}>
                                    <span style={{ fontWeight: 700, color: "var(--theme-text-muted, #64748b)", marginRight: "8px" }}>{detail.label}:</span>
                                    <span style={{ color: "var(--theme-text-primary, #1e293b)" }}>{detail.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </SectionWrapper>
            );
        },
    };


    // Combine default renderers with custom overrides from the template
    const finalRenderers = { ...defaultRenderers, ...customRenderers };

    const content = finalRenderers[sectionId] ? finalRenderers[sectionId]({ itemIndices, isContinued, subItemRanges, zoneId }) : null;

    if (!content) return null;

    return (
        <SectionContext.Provider value={{ isContinued, sectionId, zoneId, subItemRanges }}>
            {content}
        </SectionContext.Provider>
    );
};

export default SectionRenderer;
