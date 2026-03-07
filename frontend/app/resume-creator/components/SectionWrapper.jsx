import React, { useRef } from 'react';
import { Edit3, ChevronUp, ChevronDown, Move } from 'lucide-react';
import { useResumeContext } from '../templates/ResumeContext';
import { useSectionContext } from '../templates/common/SectionContext';

/**
 * SectionWrapper
 * Wraps a resume section to make it interactive (hover handles + click to edit)
 */
const SectionWrapper = ({ children, sectionId, navigationId, onSectionClick: propsOnSectionClick, isInteractive: propsIsInteractive, label = "" }) => {
    // Consume contexts
    const {
        highlightSection,
        onSectionClick: contextOnSectionClick,
        onReorder,
        isReorderMode,
        setIsReorderMode,
        isMobile,
        resumeData,
        templateId
    } = useResumeContext() || {};

    const { zoneId = 'main' } = useSectionContext() || {};

    // Determine active click handler and interactivity
    const onSectionClick = propsOnSectionClick || contextOnSectionClick;
    const isInteractive = propsIsInteractive !== undefined ? propsIsInteractive : (!!onSectionClick);
    const active = isInteractive;

    const timerRef = useRef(null);

    // --- LONG PRESS LOGIC (Mobile Reorder) ---
    const startLongPress = (e) => {
        if (!active) return;
        if (e.type === 'mousedown' && e.button !== 0) return;

        timerRef.current = setTimeout(() => {
            if (setIsReorderMode && isMobile) {
                console.log(`[SectionWrapper] Long-press detected on ${sectionId}! Entering Reorder Mode.`);
                setIsReorderMode(true);
                if (window.navigator && window.navigator.vibrate) {
                    window.navigator.vibrate(60);
                }
            }
        }, 500);
    };

    const cancelLongPress = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
    };

    // --- REORDER LOGIC ---
    const moveSection = (direction) => {
        if (!onReorder || !resumeData) return;

        // 1. Determine active layout config
        const layoutId = templateId || resumeData.templateId || 'creative-marketing';
        const layouts = resumeData.templateLayouts?.[layoutId] || {};

        // Find which array this section belongs to
        let targetZone = zoneId;
        let sections = layouts[zoneId] || layouts[zoneId + 'SectionsOrder'];

        // Fallback to global sectionsOrder if zone-specific not found or if it's a flat template
        if (!sections) {
            sections = resumeData.sectionsOrder;
            targetZone = 'sectionsOrder';
        }

        if (!Array.isArray(sections)) return;

        // 2. Perform Swap
        const idx = sections.indexOf(sectionId);
        if (idx === -1) return;

        const newSections = [...sections];
        const swapIdx = direction === 'up' ? idx - 1 : idx + 1;

        if (swapIdx < 0 || swapIdx >= newSections.length) return;

        // Swap
        [newSections[idx], newSections[swapIdx]] = [newSections[swapIdx], newSections[idx]];

        // 3. Update
        if (targetZone === 'sectionsOrder') {
            onReorder(newSections);
        } else {
            onReorder({ [targetZone]: newSections });
        }
    };

    const isHighlighted = highlightSection === sectionId ||
        (highlightSection === 'skills' && (sectionId === 'strengths' || sectionId === 'additionalSkills')) ||
        (highlightSection && sectionId && highlightSection === navigationId);

    const displayLabel = label || sectionId.charAt(0).toUpperCase() + sectionId.slice(1);

    const handleClick = (e) => {
        if (!active || isReorderMode) return;
        e.stopPropagation();
        if (onSectionClick) {
            onSectionClick(navigationId || sectionId);
        }
    };

    return (
        <div
            className={`interactive-section-wrapper ${active ? 'active' : ''} ${isHighlighted ? 'highlighted-section' : ''} ${isReorderMode ? 'reorder-mode-active' : ''}`}
            onClick={handleClick}
            onMouseDown={startLongPress}
            onMouseUp={cancelLongPress}
            onMouseLeave={cancelLongPress}
            onTouchStart={startLongPress}
            onTouchEnd={cancelLongPress}
            onTouchMove={cancelLongPress}
            data-label={displayLabel}
            data-section-id={sectionId}
            style={{ position: 'relative' }}
        >
            {/* EDIT OVERLAY (Classic) */}
            {active && !isReorderMode && !isMobile && (
                <div className="edit-overlay">
                    <Edit3 size={16} />
                    <span>Edit {displayLabel}</span>
                </div>
            )}

            {/* EXIT REORDER (Mobile/Action) */}

            {children}
        </div>
    );
};

export default SectionWrapper;
