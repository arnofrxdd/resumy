
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { spellChecker } from '../utils/SpellCheckManager';
import { X, Search } from 'lucide-react';

/**
 * Highlighting Component
 * Scans text and wraps errors in red underline spans.
 * Handles clicking on errors to show popup.
 */
const SpellCheckHighlighter = ({ text, onIgnore, onReplace, isActive = false }) => {
    const [errors, setErrors] = useState([]);
    const [isChecking, setIsChecking] = useState(false);

    // Trigger async check when text or active state changes
    useEffect(() => {
        if (!isActive || !text) {
            setErrors([]);
            return;
        }

        let isMounted = true;
        const check = async () => {
            setIsChecking(true);
            const results = await spellChecker.checkTextAsync(text);
            if (isMounted) {
                setErrors(results);
                setIsChecking(false);
            }
        };

        const timer = setTimeout(check, 500); // 500ms debounce
        return () => {
            isMounted = false;
            clearTimeout(timer);
        };
    }, [text, isActive]);

    // If not active or empty, just return text
    if (!isActive || !text) return <>{text}</>;

    if (isChecking && errors.length === 0) {
        return (
            <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span className="spell-check-scanning-indicator" style={{
                    fontSize: '10px',
                    color: '#94a3b8',
                    fontStyle: 'italic',
                    animation: 'pulse 2s infinite'
                }}>
                    Scanning...
                </span>
                {text}
            </span>
        );
    }

    if (errors.length === 0) return <>{text}</>;

    const parts = [];
    let lastIndex = 0;

    // Sorting errors by index to ensure correct replacement/rendering
    const sortedErrors = [...errors].sort((a, b) => a.index - b.index);

    sortedErrors.forEach((error, i) => {
        // Text before error
        if (error.index > lastIndex) {
            parts.push(text.slice(lastIndex, error.index));
        }

        // Error span
        parts.push(
            <SpellError
                key={`${error.index}-${i}`}
                word={error.word}
                initialSuggestions={error.suggestions}
                onIgnore={onIgnore}
                onReplace={(suggestion) => {
                    const newText = text.slice(0, error.index) + suggestion + text.slice(error.index + error.word.length);
                    // Crucial: send both old and new for HTML-aware replacement
                    if (onReplace) onReplace(newText, text);
                }}
            />
        );

        lastIndex = error.index + error.length;
    });

    // Remaining text
    if (lastIndex < text.length) {
        parts.push(text.slice(lastIndex));
    }

    return (
        <span style={{ position: 'relative' }}>
            {isChecking && (
                <span style={{
                    position: 'absolute',
                    top: '-15px',
                    left: '0',
                    fontSize: '9px',
                    color: '#7c3aed',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                }}>
                    AI Updating...
                </span>
            )}
            {parts}
        </span>
    );
};

const SpellError = ({ word, initialSuggestions = [], onIgnore, onReplace }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [suggestions, setSuggestions] = useState(initialSuggestions);
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
    const triggerRef = useRef(null);
    const popupRef = useRef(null);

    // Sync suggestions if initialSuggestions change
    useEffect(() => {
        setSuggestions(initialSuggestions);
    }, [initialSuggestions]);

    // Close popup on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target) && !triggerRef.current.contains(event.target)) {
                setShowPopup(false);
            }
        };

        const updatePosition = () => {
            if (showPopup && triggerRef.current) {
                const rect = triggerRef.current.getBoundingClientRect();
                setPopupPosition({
                    top: rect.bottom + window.scrollY + 8,
                    left: rect.left + window.scrollX + rect.width / 2
                });
            }
        };

        if (showPopup) {
            document.addEventListener('mousedown', handleClickOutside);
            window.addEventListener('scroll', updatePosition, true);
            window.addEventListener('resize', updatePosition);
            updatePosition();
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }, [showPopup]);

    return (
        <span style={{ position: 'relative', display: 'inline-block', zIndex: showPopup ? 100000 : 'auto' }}>
            <span
                ref={triggerRef}
                className="spell-error-word"
                style={{
                    textDecoration: 'underline wavy #ef4444',
                    textUnderlineOffset: '3px',
                    cursor: 'pointer',
                    backgroundColor: showPopup ? 'rgba(239, 68, 68, 0.1)' : 'transparent'
                }}
                onClick={(e) => {
                    e.stopPropagation(); // Prevent drag/other clicks
                    setShowPopup(!showPopup);
                }}
            >
                {word}
            </span>

            {showPopup && createPortal(
                <div
                    ref={popupRef}
                    className="spell-popup animate-fade"
                    style={{
                        position: 'absolute',
                        top: `${popupPosition.top}px`,
                        left: `${popupPosition.left}px`,
                        transform: 'translateX(-50%)',
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)',
                        borderRadius: '4px',
                        padding: '12px',
                        zIndex: 1000000,
                        minWidth: '220px',
                        color: '#1c1917',
                        textAlign: 'left',
                        fontSize: '14px',
                        fontWeight: 'normal',
                        lineHeight: '1.5',
                        fontFamily: "'Inter', sans-serif",
                        textTransform: 'none',
                        letterSpacing: 'normal',
                        whiteSpace: 'normal',
                        pointerEvents: 'auto'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div style={{
                        fontWeight: '800',
                        marginBottom: '12px',
                        color: '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        borderBottom: '1px solid #f1f5f9',
                        paddingBottom: '8px',
                        fontSize: '15px'
                    }}>
                        <span style={{ textDecoration: 'line-through', opacity: 0.5 }}>{word}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>Suggestions</div>

                        {suggestions.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '12px' }}>
                                {suggestions.map((s, idx) => (
                                    <button
                                        key={idx}
                                        style={{
                                            padding: '6px 8px', borderRadius: '4px',
                                            border: 'none', background: '#f8fafc',
                                            cursor: 'pointer', fontSize: '13px', color: '#0f172a',
                                            textAlign: 'left', fontWeight: '600',
                                            display: 'flex', alignItems: 'center', gap: '8px'
                                        }}
                                        onClick={() => {
                                            if (onReplace) onReplace(s);
                                            setShowPopup(false);
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}
                                    >
                                        <Search size={12} color="#3b82f6" /> {s}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px', padding: '4px 8px' }}>No suggestions available</div>
                        )}

                        <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '8px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <button
                                onClick={() => {
                                    spellChecker.ignoreWord(word);
                                    onIgnore(); // Trigger re-render
                                    setShowPopup(false);
                                }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '6px 8px', borderRadius: '4px',
                                    border: 'none', background: 'transparent',
                                    cursor: 'pointer', fontSize: '13px', color: '#64748b',
                                    textAlign: 'left'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <X size={14} color="#94a3b8" /> Ignore
                            </button>

                            <button
                                onClick={() => {
                                    spellChecker.ignoreAll(word);
                                    onIgnore(); // Trigger re-render
                                    setShowPopup(false);
                                }}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '6px 8px', borderRadius: '4px',
                                    border: 'none', background: 'transparent',
                                    cursor: 'pointer', fontSize: '13px', color: '#64748b',
                                    textAlign: 'left'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <X size={14} color="#94a3b8" /> Ignore All
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </span>
    );
};

export default SpellCheckHighlighter;
