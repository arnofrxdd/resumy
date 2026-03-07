import React from 'react';
import SectionRenderer from './SectionRenderer';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableSection = ({ sectionId, data, pageItem }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: sectionId });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        cursor: 'grab'
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <SectionRenderer sectionId={sectionId} data={data} pageItem={pageItem} />
        </div>
    );
};

const Page = ({ pageIndex, pageData, data, templateConfig = {} }) => {
    const regionsConfig = templateConfig.regions || {};
    const containerStyles = templateConfig.containerStyles || { display: 'flex', flexDirection: 'row', gap: '20px' };

    return (
        <div
            className="resume-page"
            style={{
                width: '210mm',
                height: '297mm',
                backgroundColor: 'white',
                padding: templateConfig.padding || '40px',
                boxSizing: 'border-box',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
                marginBottom: '40px',
                position: 'relative',
                overflow: 'hidden',
                ...templateConfig.rootStyles
            }}
        >
            <div style={{ ...containerStyles, height: '100%', width: '100%' }}>
                {Object.keys(pageData.regions).map(regionId => {
                    const regionConfig = regionsConfig[regionId] || {};
                    const items = pageData.regions[regionId] || [];

                    return (
                        <div
                            key={regionId}
                            style={{
                                width: regionConfig.width || 'auto',
                                flex: regionConfig.width ? 'none' : 1,
                                height: '100%',
                                ...regionConfig.styles
                            }}
                        >
                            {items.map((item, idx) => (
                                <SortableSection
                                    key={`${item.sectionId}-${idx}`}
                                    sectionId={item.sectionId}
                                    data={data}
                                    pageItem={item}
                                />
                            ))}
                        </div>
                    );
                })}
            </div>

            {/* Page Number */}
            <div style={{ position: 'absolute', bottom: '20px', right: '40px', fontSize: '10px', color: '#ccc' }}>
                Page {pageIndex + 1}
            </div>
        </div>
    );
};

export default Page;
