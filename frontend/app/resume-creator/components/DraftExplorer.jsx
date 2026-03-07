"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X, Plus, MoreHorizontal, Edit2, Trash2, CheckCircle, Check,
    ArrowRight, LayoutTemplate, Search
} from "lucide-react";
import { supabaseClient } from "@/lib/supabaseClient";
import TemplatePreview from "./TemplatePreview";
import "./onboarding.css";

const DraftExplorer = ({
    isOpen,
    onClose,
    drafts,
    currentResumeId,
    onSelectDraft,
    onRenameDraft,
    onDeleteDraft,
    onStartNew,
    isMobile = false
}) => {
    const [activeMenuId, setActiveMenuId] = useState(null);
    const [renameId, setRenameId] = useState(null);
    const [renamingTitle, setRenamingTitle] = useState("");
    const [deleteConfirmId, setDeleteConfirmId] = useState(null);
    const [selectedDraftIds, setSelectedDraftIds] = useState([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [switchConfirmDraft, setSwitchConfirmDraft] = useState(null);
    const dropdownRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleRename = (e, id) => {
        if (e) e.stopPropagation();
        if (renamingTitle.trim()) {
            onRenameDraft(id, renamingTitle);
        }
        setRenameId(null);
    };

    const toggleSelectDraft = (e, id) => {
        e.stopPropagation();
        setSelectedDraftIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedDraftIds.length === drafts.length) {
            setSelectedDraftIds([]);
        } else {
            setSelectedDraftIds(drafts.map(d => d.id));
        }
    };

    const handleBulkDelete = () => {
        selectedDraftIds.forEach(id => onDeleteDraft(id));
        setSelectedDraftIds([]);
        setIsSelectionMode(false);
        setDeleteConfirmId(null);
    };

    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 z-[12000] flex items-center justify-center ${isMobile ? 'p-0' : 'p-4 md:p-10'}`}>
            <motion.div
                className="absolute inset-0 bg-stone-900/40 backdrop-blur-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            />

            <motion.div
                className={`bg-white w-full max-w-6xl flex flex-col overflow-hidden shadow-2xl relative border border-[#e1e4e8] ${isMobile ? 'h-full max-h-full rounded-none' : 'h-full md:max-h-[90vh] rounded-[20px]'}`}
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                style={isMobile ? { paddingBottom: 'env(safe-area-inset-bottom)' } : {}}
            >
                {/* Header */}
                <div className={`flex items-center justify-between ${isMobile ? 'p-4' : 'p-6 md:p-8'} border-b border-[#e1e4e8] bg-white sticky top-0 z-[100]`}>
                    <div>
                        <h2 className="text-xl md:text-2xl font-extrabold text-[#1a1a1b] tracking-tight">Saved Drafts</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-[#5e6c84] font-semibold text-[10px] md:text-sm">Manage your ongoing projects</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {!isMobile && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        setIsSelectionMode(!isSelectionMode);
                                        if (isSelectionMode) setSelectedDraftIds([]);
                                    }}
                                    className={`text-[12px] font-bold px-4 py-2 rounded-xl border transition-all ${isSelectionMode ? 'bg-[#1a1a1b] text-white border-[#1a1a1b]' : 'bg-white text-[#1a1a1b] border-[#e1e4e8] hover:border-[#1a1a1b]'}`}
                                >
                                    {isSelectionMode ? 'Cancel Selection' : 'Manage Drafts'}
                                </button>
                                {isSelectionMode && (
                                    <button
                                        onClick={toggleSelectAll}
                                        className="text-[12px] font-bold px-4 py-2 bg-white text-[#1a1a1b] border border-[#e1e4e8] rounded-xl hover:bg-[#f4f6f8] transition-all"
                                    >
                                        {selectedDraftIds.length === drafts.length ? 'Deselect All' : 'Select All'}
                                    </button>
                                )}
                            </div>
                        )}
                        <button
                            onClick={onClose}
                            className="w-10 h-10 md:w-11 md:h-11 bg-[#f4f6f8] rounded-xl flex items-center justify-center text-[#5e6c84] hover:text-[#1a1a1b] transition-all"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className={`flex-1 overflow-y-auto ${isMobile ? 'p-4' : 'p-8 md:p-12'} bg-white`}>
                    <div className="max-w-7xl mx-auto">
                        {/* Mobile Management Actions */}
                        {isMobile && (
                            <div className="flex items-center justify-between mb-6">
                                <button
                                    onClick={() => {
                                        setIsSelectionMode(!isSelectionMode);
                                        if (isSelectionMode) setSelectedDraftIds([]);
                                    }}
                                    className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all ${isSelectionMode ? 'bg-[#1a1a1b] text-white border-[#1a1a1b]' : 'bg-white text-[#1a1a1b] border-[#e1e4e8]'}`}
                                >
                                    {isSelectionMode ? 'Cancel' : 'Manage'}
                                </button>
                                {isSelectionMode && (
                                    <button
                                        onClick={toggleSelectAll}
                                        className="text-[11px] font-bold px-3 py-1.5 bg-white text-[#1a1a1b] border border-[#e1e4e8] rounded-lg"
                                    >
                                        {selectedDraftIds.length === drafts.length ? 'None' : 'All'}
                                    </button>
                                )}
                            </div>
                        )}

                        <div className={`grid ${isMobile ? 'grid-cols-2 gap-4' : 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'}`}>
                            {/* New Draft Card */}
                            <motion.div
                                className={`group flex flex-col bg-white border-2 border-dashed border-[#e1e4e8] ${isMobile ? 'min-h-[200px]' : 'aspect-[210/297]'} hover:border-[#2d5cf7] hover:bg-[#f4f6f8]/50 cursor-pointer transition-all rounded-[8px] items-center justify-center p-6 gap-4`}
                                whileHover={{ scale: 0.98 }}
                                onClick={onStartNew}
                            >
                                <div className="w-12 h-12 md:w-16 md:h-16 bg-[#f4f6f8] text-[#5e6c84] flex items-center justify-center rounded group-hover:bg-[#2d5cf7] group-hover:text-white transition-all shadow-sm">
                                    <Plus size={isMobile ? 24 : 32} strokeWidth={2.5} />
                                </div>
                                <span className={`font-bold text-[#1a1a1b] ${isMobile ? 'text-sm' : 'text-lg'}`}>New Resume</span>
                            </motion.div>

                            {/* Existing Drafts */}
                            {drafts.map((draft, idx) => (
                                <motion.div
                                    key={draft.id}
                                    className={`group flex flex-col bg-white border ${selectedDraftIds.includes(draft.id) ? 'border-[#2d5cf7] ring-2 ring-[#2d5cf7]/10' : 'border-[#e1e4e8]'} cursor-pointer transition-all rounded-[8px] overflow-hidden shadow-sm hover:shadow-md`}
                                    onClick={() => {
                                        if (isSelectionMode) {
                                            toggleSelectDraft({ stopPropagation: () => { } }, draft.id);
                                        } else {
                                            draft.id !== currentResumeId && setSwitchConfirmDraft(draft);
                                        }
                                    }}
                                >
                                    <div className="relative aspect-[210/297] bg-[#f4f6f8] overflow-hidden border-b border-[#e1e4e8]">
                                        <div className="w-full h-full transform scale-100 origin-top transition-transform duration-500 group-hover:scale-[1.02]">
                                            <TemplatePreview
                                                templateId={draft.template_id || 'berlin-sleek'}
                                                data={draft.data || {}}
                                                designSettings={typeof draft.design_settings === 'string' ? JSON.parse(draft.design_settings || '{}') : draft.design_settings}
                                                isFormPanel={true}
                                                currentStep={draft.last_step_index || 1}
                                            />
                                        </div>

                                        {/* Draft Status Badge */}
                                        <div className="absolute top-3 right-3 z-20">
                                            <div className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider shadow-sm ${draft.id === currentResumeId ? 'bg-[#2d5cf7] text-white' : 'bg-white/90 backdrop-blur-sm text-[#5e6c84] border border-[#e1e4e8]'}`}>
                                                {draft.id === currentResumeId ? 'Active' : `Slot ${idx + 1}`}
                                            </div>
                                        </div>

                                        {/* Selection Indicators */}
                                        {isSelectionMode && (
                                            <div className="absolute top-3 left-3 z-20">
                                                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${selectedDraftIds.includes(draft.id) ? 'bg-[#2d5cf7] border-[#2d5cf7] text-white' : 'bg-white border-[#2d5cf7]'}`}>
                                                    {selectedDraftIds.includes(draft.id) && <Check size={14} strokeWidth={4} />}
                                                </div>
                                            </div>
                                        )}

                                        {!isSelectionMode && (
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                                                <button className="opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all bg-white text-[#1a1a1b] font-bold text-xs py-2 px-4 rounded-lg shadow-xl">
                                                    Continue Editing
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4 flex flex-col gap-1 relative">
                                        <div className="flex items-start justify-between">
                                            {renameId === draft.id ? (
                                                <input
                                                    autoFocus
                                                    type="text"
                                                    value={renamingTitle}
                                                    onChange={e => setRenamingTitle(e.target.value)}
                                                    onBlur={e => handleRename(null, draft.id)}
                                                    onKeyDown={e => e.key === 'Enter' && handleRename(null, draft.id)}
                                                    onClick={e => e.stopPropagation()}
                                                    className="w-full bg-white border-b-2 border-[#2d5cf7] text-sm font-bold text-[#1a1a1b] outline-none py-0.5"
                                                />
                                            ) : (
                                                <h3 className="text-sm font-bold text-[#1a1a1b] truncate pr-6">
                                                    {draft.title || "Untitled Resume"}
                                                </h3>
                                            )}

                                            {!isSelectionMode && (
                                                <div className="absolute right-3 top-3.5" ref={activeMenuId === draft.id ? dropdownRef : null}>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveMenuId(activeMenuId === draft.id ? null : draft.id);
                                                        }}
                                                        className="p-1 text-[#5e6c84] hover:text-[#1a1a1b] transition-colors"
                                                    >
                                                        <MoreHorizontal size={18} />
                                                    </button>

                                                    <AnimatePresence>
                                                        {activeMenuId === draft.id && (
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0.95 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                exit={{ opacity: 0, scale: 0.95 }}
                                                                className="absolute bottom-full right-0 mb-2 w-40 bg-white shadow-xl border border-[#e1e4e8] rounded-xl overflow-hidden z-[100]"
                                                            >
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setRenameId(draft.id);
                                                                        setRenamingTitle(draft.title || "");
                                                                        setActiveMenuId(null);
                                                                    }}
                                                                    className="w-full px-4 py-3 text-left text-xs font-bold text-[#1a1a1b] hover:bg-[#f4f6f8] flex items-center gap-2"
                                                                >
                                                                    <Edit2 size={14} /> Rename
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setDeleteConfirmId(draft.id);
                                                                        setActiveMenuId(null);
                                                                    }}
                                                                    className="w-full px-4 py-3 text-left text-xs font-bold text-[#e11d48] hover:bg-[#fff1f2] flex items-center gap-2"
                                                                >
                                                                    <Trash2 size={14} /> Delete
                                                                </button>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className="text-[11px] text-[#5e6c84]">
                                                {new Date(draft.updated_at).toLocaleDateString()}
                                            </span>
                                            {draft.id !== currentResumeId && (
                                                <ArrowRight size={14} className="text-[#5e6c84] opacity-0 group-hover:opacity-100 transition-opacity" />
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bulk Action Bar - Matches Premium Theme */}
                <AnimatePresence>
                    {isSelectionMode && selectedDraftIds.length > 0 && (
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-[90%] md:w-auto"
                        >
                            <div className="bg-[#1a1a1b] text-white px-6 py-4 rounded shadow-md flex items-center gap-6 border border-white/10">
                                <span className="text-xs font-bold whitespace-nowrap">{selectedDraftIds.length} Selected</span>
                                <div className="w-[1px] h-4 bg-white/20" />
                                <button
                                    onClick={() => setDeleteConfirmId('bulk')}
                                    className="bg-[#e11d48] hover:bg-[#be123c] text-white px-4 py-2 text-xs font-extrabold rounded-lg transition-all flex items-center gap-2"
                                >
                                    <Trash2 size={14} /> Delete Drafts
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Custom Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteConfirmId && (
                    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-stone-900/60 backdrop-blur-md"
                            onClick={() => setDeleteConfirmId(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white p-8 w-full max-w-md relative z-10 shadow-2xl border border-stone-100"
                        >
                            <div className="w-16 h-16 bg-rose-50 text-rose-500 flex items-center justify-center mb-6">
                                <Trash2 size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-stone-900 tracking-tighter mb-2">Delete Draft?</h3>
                            <p className="text-stone-500 font-medium text-sm mb-8 leading-relaxed">
                                This action is permanent and cannot be undone. All your progress on this resume will be lost forever.
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => {
                                        if (deleteConfirmId === 'bulk') {
                                            handleBulkDelete();
                                        } else {
                                            onDeleteDraft(deleteConfirmId);
                                            setDeleteConfirmId(null);
                                        }
                                    }}
                                    className="w-full py-4 bg-rose-500 text-white font-black text-xs uppercase tracking-widest hover:bg-rose-600 transition-colors"
                                >
                                    {deleteConfirmId === 'bulk' ? `Yes, Delete ${selectedDraftIds.length} Drafts` : 'Yes, Delete Permanently'}
                                </button>
                                <button
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="w-full py-4 bg-stone-50 text-stone-900 font-black text-xs uppercase tracking-widest hover:bg-stone-100 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Custom Switch Draft Confirmation Modal */}
            <AnimatePresence>
                {switchConfirmDraft && (
                    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-stone-900/60 backdrop-blur-md"
                            onClick={() => setSwitchConfirmDraft(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white p-8 w-full max-w-md relative z-10 shadow-2xl border border-stone-100"
                        >
                            <div className="w-16 h-16 bg-orange-50 text-orange-600 flex items-center justify-center mb-6">
                                <ArrowRight size={32} />
                            </div>
                            <h3 className="text-2xl font-black text-stone-900 tracking-tighter mb-2">Switch Drafts?</h3>
                            <p className="text-stone-500 font-medium text-sm mb-8 leading-relaxed">
                                Do you want to load <strong>"{switchConfirmDraft.title || 'Untitled Resume'}"</strong>? Your current progress has been automatically saved.
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => {
                                        onSelectDraft(switchConfirmDraft);
                                        setSwitchConfirmDraft(null);
                                    }}
                                    className="w-full py-4 bg-orange-600 text-white font-black text-xs uppercase tracking-widest hover:bg-orange-700 transition-colors"
                                >
                                    Yes, Load Draft
                                </button>
                                <button
                                    onClick={() => setSwitchConfirmDraft(null)}
                                    className="w-full py-4 bg-stone-50 text-stone-900 font-black text-xs uppercase tracking-widest hover:bg-stone-100 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DraftExplorer;
