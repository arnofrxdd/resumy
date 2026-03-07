/**
 * useResumeHistory.js
 * 
 * Command-pattern Undo/Redo for the Resume Builder's Finalize view.
 * 
 * Instead of storing full data snapshots (which is expensive and error-prone),
 * we store typed "commands" — tiny objects describing what changed and how to reverse it.
 * 
 * Supported command types:
 *  - DATA_CHANGE: a generic data update (themeColor, designSettings, section reorder, etc.)
 *  - TEMPLATE_CHANGE: switch between templates
 *  - SPELL_CHECK_DRAFT: spell-check overlay toggle
 */

import { useState, useRef, useEffect, useCallback } from 'react';

const MAX_HISTORY = 60;

export function useResumeHistory({ data, setData, activeTemplateId, onChangeTemplate }) {
    // The command stack: array of { type, undo: fn, redo: fn }
    const [history, setHistory] = useState([]);
    const [index, setIndex] = useState(-1); // -1 = nothing yet

    // A ref flag so we can skip recording while we're applying an undo/redo
    const isApplyingHistory = useRef(false);

    const canUndo = index >= 0;
    const canRedo = index < history.length - 1;

    /**
     * Record a new command.
     * @param {object} command - { undo: () => void, redo: () => void, label?: string }
     */
    const record = useCallback((command) => {
        if (isApplyingHistory.current) return;

        setHistory(prev => {
            // When we record after an undo, wipe the "future"
            const newHistory = prev.slice(0, index + 1);
            newHistory.push(command);
            // Trim to max size
            return newHistory.slice(-MAX_HISTORY);
        });
        setIndex(prev => Math.min(prev + 1, MAX_HISTORY - 1));
    }, [index]);

    const undo = useCallback(() => {
        if (!canUndo) return;
        const command = history[index];
        if (!command) return;

        isApplyingHistory.current = true;
        command.undo();
        setIndex(prev => prev - 1);
        // Let React settle before re-enabling recording
        requestAnimationFrame(() => {
            isApplyingHistory.current = false;
        });
    }, [canUndo, history, index]);

    const redo = useCallback(() => {
        if (!canRedo) return;
        const command = history[index + 1];
        if (!command) return;

        isApplyingHistory.current = true;
        command.redo();
        setIndex(prev => prev + 1);
        requestAnimationFrame(() => {
            isApplyingHistory.current = false;
        });
    }, [canRedo, history, index]);

    // ── Keyboard shortcuts ──────────────────────────────────────────────
    useEffect(() => {
        const handler = (e) => {
            // Don't intercept when user is typing in an input
            const tag = document.activeElement?.tagName;
            const isEditing = tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable;
            if (isEditing) return;

            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
                e.preventDefault();
                if (e.shiftKey) {
                    redo();
                } else {
                    undo();
                }
            } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
                e.preventDefault();
                redo();
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [undo, redo]);

    // ── Helper: record a DATA change ────────────────────────────────────
    // Call this BEFORE applying a change, passing both old and new values.
    const recordDataChange = useCallback((label, applyFn, oldData) => {
        // Snapshot the old state at the time of the call
        const snapshot = JSON.parse(JSON.stringify(oldData));
        record({
            label,
            undo: () => setData(prev => ({ ...JSON.parse(JSON.stringify(snapshot)), onboarding_metadata: prev.onboarding_metadata })),
            redo: () => {
                // Re-apply the change
                setData(prev => {
                    const next = applyFn(prev);
                    return { ...next, onboarding_metadata: prev.onboarding_metadata };
                });
            }
        });
    }, [record, setData]);

    // ── Helper: record a TEMPLATE change ────────────────────────────────
    const recordTemplateChange = useCallback((oldTemplateId, newTemplateId) => {
        record({
            label: 'Template Change',
            undo: () => { if (onChangeTemplate) onChangeTemplate(oldTemplateId); },
            redo: () => { if (onChangeTemplate) onChangeTemplate(newTemplateId); }
        });
    }, [record, onChangeTemplate]);

    return {
        canUndo,
        canRedo,
        undo,
        redo,
        record,
        recordDataChange,
        recordTemplateChange,
        isApplyingHistory,
        historyLength: history.length,
        currentIndex: index,
    };
}
