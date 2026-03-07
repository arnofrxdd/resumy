import React from 'react';
import PaginatedCanvas from '../../core-engine/PaginatedCanvas';

/**
 * CleanA4Template
 * 
 * The first template to use the new "Core Engine" (Measure -> Distribute -> Render).
 * It enforces strict A4 paging and correct section splitting.
 */
const CleanA4Template = ({ data, isSpellCheckActive, onReorder }) => {

    // Use data.mainSectionsOrder if available (from DnD), otherwise fallback
    const sectionsOrder = data.mainSectionsOrder || data.sectionsOrder || [
        'summary',
        'experience',
        'education',
        'skills',
        'projects',
        'languages',
        'certifications',
        'interests',
        'software',
        'affiliations',
        'keyAchievements',
        'accomplishments',
        'additionalInfo',
        'custom'
    ];

    return (
        <div className="clean-a4-template">
            {/* 
              We pass the data and the desired order.
              PaginatedCanvas will measure everything and lay it out.
            */}
            <PaginatedCanvas
                data={data}
                sectionsOrder={sectionsOrder}
                onReorder={onReorder}
                config={{
                    themeColor: data.themeColor || '#3b82f6',
                    themeStyles: {
                        '--main-title-size': '24px',
                        '--section-title-size': '16px',
                        '--item-title-size': '14px',
                        '--item-base-size': '12px'
                    }
                }}
            />
        </div>
    );
};

export default CleanA4Template;
