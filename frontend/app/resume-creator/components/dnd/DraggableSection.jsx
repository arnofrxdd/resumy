import React from 'react';
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Move, GripVertical } from "lucide-react";

import { useResumeContext } from "../../templates/ResumeContext";
import { motion } from "framer-motion";

const DraggableSection = ({ id, children, isEnabled: propsIsEnabled }) => {
    const { isReorderMode, isMobile } = useResumeContext() || {};
    const isEnabled = propsIsEnabled || isReorderMode;

    // We conditionally apply listeners to the handle OR the whole section
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
        position: 'relative',
        zIndex: isDragging ? 2000 : 'auto',
    };

    if (!children) return null;

    if (!isEnabled) {
        return <div>{children}</div>;
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...(isReorderMode ? attributes : {})}
            {...(isReorderMode ? listeners : {})}
            className={`draggable-section ${isDragging ? 'dragging' : ''} ${isReorderMode ? 'reorder-mode-active' : ''}`}
        >
            <motion.div
                className="draggable-section-content"
                initial={false}
                animate={isReorderMode && !isDragging ? {
                    rotate: [0, -0.4, 0.4, 0],
                    transition: {
                        rotate: { repeat: Infinity, duration: 0.3, ease: "linear" }
                    }
                } : {
                    rotate: 0,
                    transition: { duration: 0.1 }
                }}
                whileDrag={{ rotate: 0 }}
                style={{ height: '100%', width: '100%' }}
            >
                {children}
            </motion.div>

            {/* Legacy Handle for Non-Reorder Mode (if ever used) */}
            {!isReorderMode && !isMobile && (
                <div
                    {...attributes}
                    {...listeners}
                    className="drag-handle-overlay"
                >
                    <Move size={14} />
                </div>
            )}
        </div>
    );
};

export default DraggableSection;

