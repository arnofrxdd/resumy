/**
 * TemplateUtils.js
 * Shared logic for robust template rendering.
 * 
 * KEY DESIGN RULE:
 * data.templateLayouts[id] stores BOTH layout arrays (main/sidebar/left/right)
 * AND metadata (themeColor, designSettings). Templates must ONLY read the layout
 * arrays from it, not use the whole object as a layout — otherwise a truthy
 * { themeColor: '#...' } with no layout arrays would block default fallbacks,
 * causing all sections to disappear.
 *
 * Use getSavedLayout() for all template layout reading. Never do:
 *   const layout = data.templateLayouts?.[id] || defaultLayout;   ← BROKEN
 * Instead do:
 *   const layout = getSavedLayout(data, id, defaultLayout);        ← CORRECT
 */

const LAYOUT_ZONE_KEYS = ['main', 'sidebar', 'left', 'right', 'center', 'top', 'bottom'];

/**
 * Safely read layout zone arrays from data.templateLayouts[templateId].
 * Strips non-layout metadata (themeColor, designSettings, etc.) and returns
 * only the actual section arrays, falling back to defaultLayout if none exist.
 *
 * @param {Object} data              - Resume data object
 * @param {string} templateId        - Template ID key (e.g. 'azure-modern')
 * @param {Object} defaultLayout     - Default layout { main: [...], sidebar: [...] }
 * @returns {Object}                 - Layout with only zone arrays (no metadata)
 */
export const getSavedLayout = (data, templateId, defaultLayout) => {
    const saved = data?.templateLayouts?.[templateId];
    if (!saved) return defaultLayout;

    // Extract only the layout zone arrays, ignoring metadata like themeColor/designSettings
    const layoutZones = {};
    LAYOUT_ZONE_KEYS.forEach(key => {
        if (Array.isArray(saved[key])) {
            layoutZones[key] = saved[key];
        }
    });

    // If no layout arrays are found, the object only has metadata (e.g. just themeColor)
    // → fall back to defaults so templates don't get an empty layout
    if (Object.keys(layoutZones).length === 0) return defaultLayout;

    return layoutZones;
};

/**
 * Automatically calculates the complete set of sections to render,
 * ensuring that sections with data are NEVER "forgotten" even if
 * the template designer didn't explicitly place them.
 *
 * @param {Object} data          - The resume data object
 * @param {Object} currentLayout - The template's predefined layout (e.g. { left: [], right: [] })
 * @param {string} fallbackZone  - Where to put unassigned sections (default 'right' or 'main')
 * @returns {Object}             - The complete layout with all active sections included.
 */
export const getCompleteLayout = (data, currentLayout, fallbackZone = null) => {
    if (!data) return currentLayout;

    const allPossibleSections = [
        'summary', 'experience', 'education', 'skills', 'projects',
        'languages', 'certifications', 'interests', 'websites',
        'software', 'affiliations', 'strengths', 'additionalSkills',
        'accomplishments', 'keyAchievements', 'additionalInfo', 'custom', 'personalDetails',
        'awards', 'volunteer', 'volunteering', 'publications', 'references',
        'careerTimeline', 'profile'
    ];

    const hasSectionData = (sid) => {
        if (!sid) return false;
        const sectionId = typeof sid === 'string' ? sid : sid.id;

        if (sectionId === 'custom') return !!data.customSection?.isVisible && !!data.customSection?.content;
        if (sectionId === 'personalDetails') {
            const p = data.personal || {};
            return !!(p.dob || p.nationality || p.maritalStatus || p.gender || p.religion || p.visaStatus || p.passport || p.otherPersonal);
        }
        if (sectionId === 'websites') {
            return (data.websites || []).some(w => !w.addToHeader);
        }
        // Always return true for core structural sections to avoid accidental removal
        if (sectionId === 'contact' || sectionId === 'personal' || sectionId === 'header' || sectionId === 'personalDetailsHeader') return true;

        const val = data[sectionId];
        if (!val) return false;
        if (Array.isArray(val)) return val.length > 0;
        if (typeof val === 'string') return val.trim().length > 0;
        return true;
    };

    // 1. Identify all sections that have data
    const activeSectionsWithData = new Set(allPossibleSections.filter(hasSectionData));

    // 2. Filter the predefined layout to ONLY include sections that have data
    // (Always keep certain sections if explicitly in layout)
    const filteredLayout = {};
    Object.keys(currentLayout || {}).forEach(zone => {
        if (Array.isArray(currentLayout[zone])) {
            filteredLayout[zone] = currentLayout[zone].filter(sid => {
                const sectionId = typeof sid === 'string' ? sid : sid.id;
                if (['personal', 'header', 'contact'].includes(sectionId)) return true;
                return activeSectionsWithData.has(sectionId);
            });
        }
    });

    // 3. Identify which sections are already assigned in the filtered layout
    const assignedSections = new Set();
    Object.values(filteredLayout).forEach(zoneSections => {
        zoneSections.forEach(s => assignedSections.add(typeof s === 'string' ? s : s.id));
    });

    // 4. Find "orphaned" sections (have data but no home in the filtered layout)
    const activeSectionsList = Array.from(activeSectionsWithData);
    const orphanedSections = activeSectionsList.filter(sid => !assignedSections.has(sid));

    if (orphanedSections.length === 0) return filteredLayout;

    // 5. Create a deep copy of the layout to avoid mutations
    const newLayout = JSON.parse(JSON.stringify(filteredLayout));

    // 6. Determine the fallback zone
    let targetZone = fallbackZone;
    if (!targetZone) {
        if (newLayout.right) targetZone = 'right';
        else if (newLayout.main) targetZone = 'main';
        else if (newLayout.left) targetZone = 'left';
        else {
            newLayout.main = [];
            targetZone = 'main';
        }
    }

    if (!newLayout[targetZone]) newLayout[targetZone] = [];

    // 7. Append orphaned sections
    newLayout[targetZone] = [...newLayout[targetZone], ...orphanedSections];

    return newLayout;
};
