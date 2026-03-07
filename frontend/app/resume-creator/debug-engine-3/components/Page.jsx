import React from 'react';
import SectionRenderer from './SectionRenderer';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Sortable Item Wrapper ---
const SortableSectionItem = ({ id, children }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        position: 'relative',
        touchAction: 'none' // Important for mobile DnD
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {/* Drag Handle Indicator */}
            {/* We could add a visual handle, but for now entire item is draggable */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, cursor: 'grab' }} />
            <div style={{ pointerEvents: 'none' }}> {/* Content not interactive during drag */}
                {children}
            </div>
        </div>
    );
};

// --- Page Component ---
const Page = ({ pageIndex, pageData, data, templateConfig, pageSize }) => {
    // pageData has { regions: { sidebar: [...], main: [...] } }

    // Page Dimensions Styles
    const pageStyle = {
        width: pageSize === 'LETTER' ? '215.9mm' : '210mm',
        height: pageSize === 'LETTER' ? '279.4mm' : '297mm',
        background: 'white',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        margin: '0 auto 30px auto', // Visual margin between pages
        position: 'relative',
        display: 'flex', // Flex container for regions
        flexDirection: 'row',
        overflow: 'hidden' // Important for print
    };

    // Region Rendering
    const regions = Object.keys(pageData.regions);

    return (
        <div className="resume-page" style={pageStyle}>
            {/* Debug Info Overlay */}
            <div style={{ position: 'absolute', top: 5, right: 5, fontSize: '10px', color: '#999', pointerEvents: 'none' }}>
                Page {pageIndex + 1} ({pageSize})
            </div>

            {regions.map(regionName => {
                const regionItems = pageData.regions[regionName] || [];
                const regionConfig = templateConfig.regions[regionName] || {};

                // Styles
                const regionStyle = {
                    width: regionConfig.width || '100%',
                    padding: regionConfig.styles?.padding || '20px',
                    backgroundColor: regionConfig.styles?.background || 'transparent',
                    color: regionConfig.styles?.color || 'inherit',
                    boxSizing: 'border-box',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    // Use flex 1 if width not specified? No, strict width usually better for resume
                };

                // Prepare Sortable Items
                // We only allow dragging the START of a section (where header is true or it's the first part)
                // We suffix IDs to make them unique across pages if needed, though we only drag starts.
                const sortableIds = regionItems
                    .filter(item => !item.isContinuation)
                    .map(item => `${item.sectionId}__${pageIndex}`);

                return (
                    <div key={regionName} style={regionStyle}>
                        <SortableContext
                            id={`${regionName}-${pageIndex}`}
                            items={sortableIds}
                            strategy={verticalListSortingStrategy}
                        >
                            {regionItems.map((item, idx) => {
                                const content = (
                                    <SectionRenderer
                                        sectionId={item.sectionId}
                                        data={data}
                                        templateConfig={templateConfig}
                                        contentOverride={item.subItems}
                                        subItemRanges={item.subItemRanges}
                                        hasHeader={item.header}
                                        isContinuation={item.isContinuation}
                                        isMeasurement={false}
                                    />
                                );

                                const uniqueId = `${item.sectionId}__${pageIndex}`;

                                if (!item.isContinuation) {
                                    return (
                                        <SortableSectionItem key={uniqueId} id={uniqueId}>
                                            <div style={{ marginBottom: '10px' }}>
                                                {content}
                                            </div>
                                        </SortableSectionItem>
                                    );
                                } else {
                                    return (
                                        <div key={`${uniqueId}-cont`} style={{ marginBottom: '10px' }}>
                                            {content}
                                        </div>
                                    );
                                }
                            })}
                        </SortableContext>
                    </div>
                );
            })}
        </div>
    );
};

export default Page;
