import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import SectionRenderer from './SectionRenderer';

// Sortable Wrapper for Sections
const SortableSectionItem = ({ id, children, config }) => {
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
        position: 'relative', // Needed for absolute positioning of handle
        opacity: isDragging ? 0.3 : 1, // Visual feedback for original item
        border: isDragging ? '2px dashed #3b82f6' : '1px solid transparent', // Highlight drop zone
        borderRadius: '4px'
    };

    // Drag Handle Component
    const DragHandle = ({ ...props }) => (
        <div
            {...props}
            className="drag-handle-overlay"
            style={{
                position: 'absolute',
                left: '-24px',
                top: '0',
                bottom: '0',
                width: '20px',
                cursor: 'grab',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#cbd5e1',
                borderRadius: '4px',
                zIndex: 50,
                // Only show on hover of the parent wrapper (handled via CSS/Logic or simple hover state)
                transition: 'all 0.2s ease',
                opacity: 0
            }}
            title="Drag Section"
        >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="12" r="1" />
                <circle cx="9" cy="5" r="1" />
                <circle cx="9" cy="19" r="1" />
                <circle cx="15" cy="12" r="1" />
                <circle cx="15" cy="5" r="1" />
                <circle cx="15" cy="19" r="1" />
            </svg>
        </div>
    );

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="section-item-wrapper"
            onMouseEnter={(e) => {
                const handle = e.currentTarget.querySelector('.drag-handle-overlay');
                if (handle) handle.style.opacity = '1';
                e.currentTarget.style.boxShadow = '0 0 0 1px #e2e8f0'; // Subtle border on hover
            }}
            onMouseLeave={(e) => {
                const handle = e.currentTarget.querySelector('.drag-handle-overlay');
                if (handle) handle.style.opacity = '0';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            {/* 
                We attach listeners ONLY to the handle. 
                This prevents accidental drags when selecting text or clicking.
            */}
            <DragHandle {...listeners} {...attributes} />
            <div style={{ marginLeft: '0px' }}>
                {children}
            </div>
        </div>
    );
};

const Page = ({ pageIndex, pageData, data, config }) => {
    // pageData: { regions: { sidebar: [...], main: [...] } }

    // Page Dimensions
    const sizeStyles = config.pageSize === 'LETTER'
        ? { width: '215.9mm', height: '279.4mm' }
        : { width: '210mm', height: '297mm' };

    const templateConfig = config.templateConfig || {};
    const actualConfig = templateConfig.config || templateConfig;

    // Use regions from pageData to support dynamic layouts
    const regionNames = Object.keys(pageData.regions);
    const regionConfigs = actualConfig.regions || {};
    const templateStyles = templateConfig.styles || {};

    // Merge into config for children
    const childConfig = { ...config, templateStyles };

    return (
        <div
            className="resume-page"
            style={{
                ...sizeStyles,
                background: 'white',
                boxShadow: '0 20px 50px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)', // Strong shadow
                border: '1px solid #e2e8f0', // Subtle light border
                margin: '0 auto',
                padding: '0',
                position: 'relative',
                overflow: 'hidden',
                boxSizing: 'border-box'
            }}
        >
            {/* Added Page indicator overlay for easier debugging */}
            <div style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                padding: '4px 8px',
                background: 'rgba(0,0,0,0.05)',
                borderRadius: '4px',
                fontSize: '10px',
                color: '#94a3b8',
                zIndex: 100,
                pointerEvents: 'none'
            }}>
                {config.pageSize} • SHEET {pageIndex + 1}
            </div>
            <div className="page-layout-container" style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
                {regionNames.map(regionName => {
                    const regionContent = pageData.regions[regionName] || [];
                    const regionConfig = regionConfigs[regionName] || {};
                    const regionStyle = regionConfig.styles || {};
                    const regionWidth = regionConfig.width || (100 / regionNames.length) + '%';

                    const sortableUiIds = regionContent
                        .filter(part => !part.isContinuation)
                        .map(part => part.sectionId);

                    return (
                        <div
                            key={regionName}
                            className={`region-${regionName}`}
                            style={{
                                width: regionWidth,
                                ...regionStyle,
                                boxSizing: 'border-box',
                                height: '100%',
                                position: 'relative',
                                overflow: 'hidden' // Prevents content bleed-over
                            }}
                        >
                            <SortableContext
                                id={regionName}
                                items={sortableUiIds}
                                strategy={verticalListSortingStrategy}
                            >
                                {regionContent.map((part, idx) => {
                                    const content = (
                                        <SectionRenderer
                                            sectionId={part.sectionId}
                                            data={data}
                                            contentOverride={part.subItems}
                                            subItemRanges={part.subItemRanges || {}}
                                            isContinuation={part.isContinuation}
                                            hasHeader={part.header || part.isContinuation}
                                            config={childConfig}
                                        />
                                    );

                                    if (!part.isContinuation) {
                                        return (
                                            <SortableSectionItem key={part.sectionId} id={part.sectionId} config={config}>
                                                {content}
                                            </SortableSectionItem>
                                        );
                                    } else {
                                        return (
                                            <div key={`${part.sectionId}_cont_${pageIndex}_${idx}`} style={{ marginBottom: '10px' }}>
                                                {content}
                                            </div>
                                        );
                                    }
                                })}
                            </SortableContext>

                            {regionContent.length === 0 && (
                                <div style={{ height: '100%', minHeight: '50px' }}></div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div style={{ position: 'absolute', bottom: '15px', right: '20px', fontSize: '11px', fontWeight: 'bold', color: '#cbd5e1', zIndex: 99 }}>
                P.{pageIndex + 1}
            </div>
        </div>
    );
};

export default Page;
