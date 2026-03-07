import React, { useRef, useState, useMemo } from 'react';
import { RotateCcw, ChevronDown, Check, X, Palette, Type, Maximize, ArrowLeft, MoveVertical, AlignLeft, Layout as LayoutIcon, Sliders as SlidersIcon, Type as TypeIcon, Maximize2, MoveHorizontal, ALargeSmall, Pipette } from 'lucide-react';
import { templatesConfig } from '../templates/TemplateManager';

export default function DesignPanel({ data, setData, settings, setSettings, templateId, onColorChange, onClose, isMobile, onSubTabChange }) {
    const colorInputRef = useRef(null);
    const [subTab, setSubTab] = useState('main');
    const [showCustomTuning, setShowCustomTuning] = useState(false);

    const handleSubTabChange = (tab) => {
        setSubTab(tab);
        if (tab !== 'color') setShowCustomTuning(false);
        if (onSubTabChange) onSubTabChange(tab);
    };

    const baseColors = [
        '#3b82f6', '#10b981', '#1e293b', '#8b5cf6',
        '#ef4444', '#f97316', '#2563eb', '#db2777',
        '#7c3aed', '#0891b2', '#059669', '#ca8a04',
        '#475569', '#14b8a6', '#f43f5e', '#84cc16'
    ];

    const currentTemplateId = templateId || data.templateId || 'unified-template';
    const templateConfig = templatesConfig.find(t => t.id === currentTemplateId);
    const activeColor = data.themeColor || templateConfig?.defaultColor || '#3b82f6';
    const recommendedColors = templateConfig?.recommendedColors || [];

    let colors = [...baseColors];
    if (templateConfig?.defaultColor && !colors.includes(templateConfig.defaultColor)) {
        colors = [templateConfig.defaultColor, ...baseColors];
    }
    if (activeColor && !colors.includes(activeColor)) {
        colors = [activeColor, ...colors];
    }

    const fonts = [
        "Inter", "Roboto", "Open Sans", "Lato", "Montserrat",
        "Merriweather", "Playfair Display", "Lora", "EB Garamond",
        "Libre Baskerville", "Outfit", "Century Gothic", "Source Sans Pro",
        "Josefin Sans", "Cinzel"
    ];

    // --- RGB COLOR HELPERS ---
    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 124, g: 58, b: 237 }; // Fallback to primary purple
    };

    const rgbToHex = (r, g, b) => {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    };

    const handleRgbChange = (channel, value) => {
        const rgb = hexToRgb(activeColor);
        const newRgb = { ...rgb, [channel]: parseInt(value, 10) };
        const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
        handleColorClick(newHex);
    };

    const handleHexChange = (e) => {
        let val = e.target.value;
        if (!val.startsWith('#')) val = '#' + val;
        if (/^#?([a-f\d]{3}){1,2}$/i.test(val)) {
            handleColorClick(val);
        }
    };

    const rgbValues = useMemo(() => hexToRgb(activeColor), [activeColor]);

    const handleColorClick = (color) => {
        if (onColorChange) onColorChange(color);
        else setData(prev => ({ ...prev, themeColor: color }));
    };

    const handleCustomColorClick = () => {
        setShowCustomTuning(!showCustomTuning);
        if (!showCustomTuning) {
            // Optional: If we want to still trigger the native picker on FIRST click
            // colorInputRef.current?.click();
        }
    };
    const handleCustomColorChange = (e) => handleColorClick(e.target.value);

    const updateSetting = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const resetDefaults = () => {
        if (templateConfig && templateConfig.defaults) {
            setSettings(templateConfig.defaults);
            if (templateConfig.defaultColor) handleColorClick(templateConfig.defaultColor);
        } else {
            const fallbacks = {
                fontSize: 1, fontFamily: 'Inter', sectionSpacing: 1,
                paragraphSpacing: 1, lineHeight: 1.5, letterSpacing: 0, pageMargin: 40
            };
            setSettings(fallbacks);
            handleColorClick('#3b82f6');
        }
    };

    // --- MOBILE UI COMPONENTS ---
    const MobileToolItem = ({ icon: Icon, label, id }) => (
        <button
            onClick={() => handleSubTabChange(id)}
            style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                minWidth: '68px', height: '64px', background: 'transparent', border: 'none',
                color: subTab === id ? '#7c3aed' : '#475569', gap: '2px', cursor: 'pointer',
                transition: 'all 0.2s'
            }}
        >
            <div style={{ padding: '6px', borderRadius: '8px', background: subTab === id ? '#f5f3ff' : 'transparent' }}>
                <Icon size={18} />
            </div>
            <span style={{ fontSize: '8px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
        </button>
    );

    const CompactSliderView = ({ itemKey, label, icon: Icon }) => {
        const defVal = templateConfig?.defaults?.[itemKey] || (itemKey === 'lineHeight' ? 1.5 : (itemKey === 'pageMargin' ? 40 : 1));
        const currentVal = settings[itemKey] || defVal;
        const sliderVal = itemKey === 'pageMargin' ? (currentVal / 40) * 50 : (currentVal / defVal) * 50;
        const pct = Math.max(0, Math.min(100, sliderVal));

        const applyPct = (clientX, rect) => {
            const rawPct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
            const newSliderVal = 1 + rawPct * 99;
            const newVal = itemKey === 'pageMargin' ? (newSliderVal / 50) * 40 : (newSliderVal / 50) * defVal;
            updateSetting(itemKey, newVal);
        };

        const onPointerDown = (e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            applyPct(e.clientX, e.currentTarget.getBoundingClientRect());
        };

        const onPointerMove = (e) => {
            if (e.buttons === 0 && e.pressure === 0) return;
            applyPct(e.clientX, e.currentTarget.getBoundingClientRect());
        };

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '12px 20px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button onClick={() => handleSubTabChange('main')} style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#7c3aed' }}>
                            <ArrowLeft size={18} />
                        </button>
                        <Icon size={16} color="#7c3aed" />
                        <span style={{ fontSize: '11px', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase' }}>{label}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '10px', fontWeight: 900, color: '#7c3aed', background: '#f5f3ff', padding: '3px 6px', borderRadius: '4px' }}>{Math.round(pct * 2)}%</span>
                        <X size={18} color="#94a3b8" onClick={onClose} style={{ cursor: 'pointer' }} />
                    </div>
                </div>

                {/* Custom pointer-events slider — reliably works on Chrome emulator & real touch */}
                <div
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    style={{
                        position: 'relative',
                        height: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        touchAction: 'none',
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                    }}
                >
                    {/* Track */}
                    <div style={{ position: 'absolute', left: 0, right: 0, height: '6px', background: '#e2e8f0', borderRadius: '3px' }} />
                    {/* Fill */}
                    <div style={{ position: 'absolute', left: 0, width: `${pct}%`, height: '6px', background: '#7c3aed', borderRadius: '3px' }} />
                    {/* Thumb */}
                    <div style={{
                        position: 'absolute',
                        left: `calc(${pct}% - 14px)`,
                        width: '28px', height: '28px',
                        borderRadius: '50%',
                        background: '#7c3aed',
                        border: '3px solid #ffffff',
                        boxShadow: '0 2px 8px rgba(124,58,237,0.4)',
                        pointerEvents: 'none',
                    }} />
                </div>
            </div>
        );
    };

    if (isMobile) {
        return (
            <div className={`design-panel mobile-redesign ${subTab !== 'main' ? 'is-editing-tool' : ''}`} style={{
                display: 'flex', flexDirection: 'column', background: '#ffffff', overflow: 'hidden', paddingBottom: 'env(safe-area-inset-bottom)'
            }}>
                {subTab === 'main' ? (
                    <>
                        <div style={{ padding: '12px 16px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Designer Studio</span>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <button
                                    onClick={resetDefaults}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        background: '#f5f3ff',
                                        border: 'none',
                                        color: '#7c3aed',
                                        padding: '4px 8px',
                                        borderRadius: '6px',
                                        fontSize: '9px',
                                        fontWeight: 800,
                                        textTransform: 'uppercase'
                                    }}
                                >
                                    <RotateCcw size={10} /> RESET
                                </button>
                                <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                                    <X size={18} />
                                </button>
                            </div>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            overflowX: 'auto',
                            padding: '4px 2px',
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none'
                        }}>
                            <MobileToolItem icon={Palette} label="Theme" id="color" />
                            <MobileToolItem icon={TypeIcon} label="Font" id="font" />
                            <MobileToolItem icon={ALargeSmall} label="Scaling" id="size" />
                            <MobileToolItem icon={MoveHorizontal} label="Letter" id="letterSpacing" />
                            <MobileToolItem icon={MoveVertical} label="Section" id="sectionSpacing" />
                            <MobileToolItem icon={AlignLeft} label="Line" id="lineHeight" />
                            <MobileToolItem icon={Maximize2} label="Margin" id="pageMargin" />
                            <MobileToolItem icon={LayoutIcon} label="Block" id="paragraphSpacing" />
                        </div>
                    </>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {subTab === 'color' && (
                            <div style={{ padding: '16px 20px 24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <button onClick={() => handleSubTabChange('main')} style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#7c3aed' }}>
                                            <ArrowLeft size={18} />
                                        </button>
                                        <span style={{ fontSize: '11px', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Theme Color</span>
                                    </div>
                                    <X size={16} color="#94a3b8" onClick={onClose} style={{ cursor: 'pointer' }} />
                                </div>

                                {recommendedColors.length > 0 && (
                                    <div style={{ marginBottom: '20px' }}>
                                        <p style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.02em' }}>Recommended Palettes</p>
                                        <div style={{ display: 'flex', gap: '14px', overflowX: 'auto', scrollbarWidth: 'none', padding: '10px 4px', margin: '0 -4px' }}>
                                            {recommendedColors.map((c, idx) => (
                                                <div
                                                    key={`rec-${idx}`}
                                                    onClick={() => handleColorClick(c)}
                                                    style={{
                                                        width: '42px',
                                                        height: '42px',
                                                        borderRadius: '12px',
                                                        backgroundColor: c,
                                                        flexShrink: 0,
                                                        border: '1px solid rgba(0,0,0,0.06)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        boxShadow: activeColor === c ? `0 0 0 2px white, 0 0 0 5px #7c3aed` : 'none',
                                                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        cursor: 'pointer',
                                                        zIndex: activeColor === c ? 2 : 1
                                                    }}
                                                >
                                                    {activeColor === c && <Check size={20} color="white" strokeWidth={4} />}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <p style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.02em' }}>Expert Presets</p>
                                    <div style={{ display: 'flex', gap: '14px', overflowX: 'auto', padding: '10px 4px 16px', margin: '0 -4px', scrollbarWidth: 'none' }}>
                                        <div
                                            onClick={handleCustomColorClick}
                                            style={{
                                                width: '44px',
                                                height: '44px',
                                                borderRadius: '12px',
                                                flexShrink: 0,
                                                position: 'relative',
                                                cursor: 'pointer',
                                                overflow: 'hidden',
                                                border: '1px solid rgba(0,0,0,0.06)',
                                                boxShadow: !colors.includes(activeColor) ? `0 0 0 2px white, 0 0 0 5px #7c3aed` : 'none',
                                                zIndex: !colors.includes(activeColor) ? 2 : 1
                                            }}
                                        >
                                            <div className="gradient-sweep" style={{ width: '100%', height: '100%', borderRadius: '0' }} />
                                            <input type="color" ref={colorInputRef} style={{ display: 'none' }} onChange={handleCustomColorChange} value={activeColor} />
                                            {!colors.includes(activeColor) && (
                                                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.1)' }}>
                                                    <Check size={20} color="white" strokeWidth={4} />
                                                </div>
                                            )}
                                        </div>
                                        {colors.map(c => (
                                            <div
                                                key={c}
                                                style={{
                                                    backgroundColor: c,
                                                    width: '44px',
                                                    height: '44px',
                                                    borderRadius: '12px',
                                                    flexShrink: 0,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    border: '1px solid rgba(0,0,0,0.06)',
                                                    boxShadow: activeColor === c ? `0 0 0 2px white, 0 0 0 5px #7c3aed` : 'none',
                                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    zIndex: activeColor === c ? 2 : 1
                                                }}
                                                onClick={() => handleColorClick(c)}
                                            >
                                                {activeColor === c && <Check size={20} color="white" strokeWidth={4} />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {showCustomTuning && (
                                    <div style={{ animation: 'fadeIn 0.2s ease-out' }}>
                                        <p style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.02em', marginTop: '20px' }}>Custom Tuning</p>
                                        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '16px', border: '1px solid #e2e8f0' }}>
                                            {/* RGB Sliders */}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                                                {[
                                                    { label: 'R', key: 'r', color: '#ef4444' },
                                                    { label: 'G', key: 'g', color: '#10b981' },
                                                    { label: 'B', key: 'b', color: '#3b82f6' }
                                                ].map(({ label, key, color }) => (
                                                    <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <span style={{ fontSize: '10px', fontWeight: 900, color: '#64748b', width: '12px' }}>{label}</span>
                                                        <input
                                                            type="range"
                                                            min="0" max="255"
                                                            value={rgbValues[key]}
                                                            onChange={(e) => handleRgbChange(key, e.target.value)}
                                                            style={{
                                                                flex: 1,
                                                                height: '4px',
                                                                borderRadius: '2px',
                                                                accentColor: activeColor,
                                                                WebkitAppearance: 'none',
                                                                background: '#e2e8f0'
                                                            }}
                                                        />
                                                        <span style={{ fontSize: '10px', fontWeight: 700, color: '#0f172a', width: '24px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{rgbValues[key]}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Hex Input */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#ffffff', padding: '8px 12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                                                <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: activeColor }} />
                                                <input
                                                    type="text"
                                                    value={activeColor.toUpperCase()}
                                                    onChange={handleHexChange}
                                                    maxLength={7}
                                                    style={{
                                                        flex: 1,
                                                        border: 'none',
                                                        fontSize: '12px',
                                                        fontWeight: 700,
                                                        color: '#0f172a',
                                                        outline: 'none',
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.05em'
                                                    }}
                                                />
                                                <button
                                                    onClick={() => colorInputRef.current?.click()}
                                                    style={{ background: 'none', border: 'none', padding: '4px', display: 'flex', alignItems: 'center', color: '#94a3b8' }}
                                                >
                                                    <Pipette size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {subTab === 'font' && (
                            <div style={{ padding: '12px 20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <button onClick={() => handleSubTabChange('main')} style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#7c3aed' }}>
                                            <ArrowLeft size={18} />
                                        </button>
                                        <span style={{ fontSize: '11px', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase' }}>Typography</span>
                                    </div>
                                    <X size={16} color="#94a3b8" onClick={onClose} style={{ cursor: 'pointer' }} />
                                </div>
                                <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
                                    {fonts.map(f => (
                                        <button
                                            key={f}
                                            onClick={() => updateSetting('fontFamily', f)}
                                            style={{
                                                padding: '8px 14px', whiteSpace: 'nowrap', background: settings.fontFamily === f ? '#f5f3ff' : '#ffffff',
                                                border: `2px solid ${settings.fontFamily === f ? '#7c3aed' : '#f1f5f9'}`, borderRadius: '6px',
                                                fontFamily: f, fontSize: '13px', color: '#0f172a'
                                            }}
                                        >
                                            {f}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {subTab === 'size' && (
                            <div style={{ padding: '12px 20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <button onClick={() => handleSubTabChange('main')} style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#7c3aed' }}>
                                            <ArrowLeft size={18} />
                                        </button>
                                        <span style={{ fontSize: '11px', fontWeight: 900, color: '#0f172a', textTransform: 'uppercase' }}>Font Scaling</span>
                                    </div>
                                    <X size={16} color="#94a3b8" onClick={onClose} style={{ cursor: 'pointer' }} />
                                </div>
                                <div style={{
                                    display: 'flex',
                                    background: '#f1f5f9',
                                    padding: '4px',
                                    borderRadius: '12px',
                                    gap: '4px'
                                }}>
                                    {[
                                        { label: 'Compact', val: 0.85 },
                                        { label: 'Standard', val: 1 },
                                        { label: 'Relaxed', val: 1.15 }
                                    ].map(opt => (
                                        <button
                                            key={opt.label}
                                            onClick={() => updateSetting('fontSize', opt.val)}
                                            style={{
                                                flex: 1,
                                                padding: '10px 4px',
                                                background: settings.fontSize === opt.val ? '#ffffff' : 'transparent',
                                                border: 'none',
                                                borderRadius: '10px',
                                                color: settings.fontSize === opt.val ? '#7c3aed' : '#64748b',
                                                boxShadow: settings.fontSize === opt.val ? '0 2px 8px rgba(0,0,0,0.05)' : 'none',
                                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '4px'
                                            }}
                                        >
                                            <div style={{
                                                fontSize: opt.val === 0.85 ? '10px' : (opt.val === 1 ? '13px' : '16px'),
                                                fontWeight: 900,
                                                height: '24px',
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}>Aa</div>
                                            <span style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.02em' }}>{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {subTab === 'letterSpacing' && <CompactSliderView itemKey="letterSpacing" label="Letter Space" icon={MoveHorizontal} />}
                        {subTab === 'sectionSpacing' && <CompactSliderView itemKey="sectionSpacing" label="Section Gap" icon={MoveVertical} />}
                        {subTab === 'lineHeight' && <CompactSliderView itemKey="lineHeight" label="Line Height" icon={AlignLeft} />}
                        {subTab === 'pageMargin' && <CompactSliderView itemKey="pageMargin" label="Page Padding" icon={Maximize2} />}
                        {subTab === 'paragraphSpacing' && <CompactSliderView itemKey="paragraphSpacing" label="Block Spacing" icon={LayoutIcon} />}
                    </div>
                )}
            </div>
        );
    }

    // --- PC UI (UNCHANGED) ---
    return (
        <div className="design-panel pc-standard" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            <div className="pane-header-with-close" style={{ padding: '24px 24px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h2 className="pane-title">Design & Formatting</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={resetDefaults} style={{ background: 'none', border: 'none', color: '#7c3aed', fontSize: '11px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <RotateCcw size={12} /> Reset
                    </button>
                    <button className="pane-close-btn" onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                        <X size={20} />
                    </button>
                </div>
            </div>

            <div className="design-content-scroll" style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px' }}>
                <div className="templates-section" style={{ marginBottom: '32px' }}>
                    <h3 className="section-label-mid">Color Theme</h3>
                    <div className="color-picker-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        <div className={`color-wheel-swatch ${!colors.includes(data.themeColor) ? 'active' : ''}`} onClick={handleCustomColorClick} style={{ width: '30px', height: '30px', cursor: 'pointer', position: 'relative' }}>
                            <div className="gradient-sweep" style={{ width: '100%', height: '100%' }}></div>
                            <input type="color" ref={colorInputRef} style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }} onChange={handleCustomColorChange} value={data.themeColor || '#3b82f6'} />
                        </div>
                        {colors.map(c => (
                            <div key={c} className={`color-circle ${activeColor === c ? 'active' : ''}`} style={{ backgroundColor: c, width: '30px', height: '30px', cursor: 'pointer', border: activeColor === c ? '2px solid white' : '1px solid rgba(0,0,0,0.05)', boxShadow: activeColor === c ? `0 0 0 2px ${c}` : 'none' }} onClick={() => handleColorClick(c)} />
                        ))}
                    </div>
                </div>

                {recommendedColors.length > 0 && (
                    <div className="templates-section" style={{ marginBottom: '32px' }}>
                        <h3 className="section-label-mid">Template Palettes</h3>
                        <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '12px', fontWeight: 600 }}>Curated for {templateConfig?.name || 'this template'}</p>
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {recommendedColors.map((c, idx) => (
                                <div key={idx} onClick={() => handleColorClick(c)} title={c} style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: c, cursor: 'pointer', border: activeColor === c ? '2px solid white' : '1px solid rgba(0,0,0,0.08)', boxShadow: activeColor === c ? `0 0 0 2.5px ${c}, 0 4px 12px rgba(0,0,0,0.15)` : '0 2px 6px rgba(0,0,0,0.08)', transform: activeColor === c ? 'scale(1.15)' : 'scale(1)', transition: 'all 0.2s ease', position: 'relative', flexShrink: 0 }}>
                                    {activeColor === c && <svg style={{ position: 'absolute', inset: 0, margin: 'auto', width: '14px', height: '14px' }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="templates-section" style={{ marginBottom: '32px' }}>
                    <h3 className="section-label-mid">Typography</h3>
                    <div style={{ position: 'relative' }}>
                        <select value={settings.fontFamily} onChange={(e) => updateSetting('fontFamily', e.target.value)} style={{ width: '100%', padding: '12px 16px', border: '1px solid #e2e8f0', borderRadius: '0', fontSize: '14px', color: '#0f172a', appearance: 'none', background: '#f8fafc', cursor: 'pointer', fontFamily: settings.fontFamily, fontWeight: 500 }}>
                            {fonts.map(f => <option key={f} value={f} style={{ fontFamily: f, fontSize: '16px', padding: '10px' }}>{f}</option>)}
                        </select>
                        <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94a3b8' }} />
                    </div>
                </div>

                <div className="templates-section" style={{ marginBottom: '32px' }}>
                    <h3 className="section-label-mid">Layout Sizing</h3>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {[
                            { label: 'Small', val: 0.85, iconSize: '12px' },
                            { label: 'Normal', val: 1, iconSize: '16px' },
                            { label: 'Large', val: 1.15, iconSize: '20px' }
                        ].map(opt => (
                            <button key={opt.label} onClick={() => updateSetting('fontSize', opt.val)} style={{ flex: 1, padding: '12px', background: settings.fontSize === opt.val ? '#eff6ff' : 'white', border: `1px solid ${settings.fontSize === opt.val ? '#3b82f6' : '#e2e8f0'}`, borderRadius: '0', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}>
                                <span style={{ fontSize: opt.iconSize, fontWeight: 700, color: settings.fontSize === opt.val ? '#7c3aed' : '#0f172a' }}>A</span>
                                <span style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>{opt.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="templates-section">
                    <h3 className="section-label-mid">Adjust Spacing</h3>
                    {[
                        { key: 'sectionSpacing', label: 'Section Spacing' },
                        { key: 'paragraphSpacing', label: 'Paragraph Spacing' },
                        { key: 'lineHeight', label: 'Line Height' },
                        { key: 'letterSpacing', label: 'Letter Spacing' },
                        { key: 'pageMargin', label: 'Page Margins' }
                    ].map(item => {
                        const defVal = templateConfig?.defaults?.[item.key] || (item.key === 'lineHeight' ? 1.5 : (item.key === 'pageMargin' ? 40 : 1));
                        const currentVal = settings[item.key] || defVal;
                        let sliderVal = item.key === 'pageMargin' ? (currentVal / 40) * 50 : (currentVal / defVal) * 50;

                        return (
                            <div key={item.key} style={{ marginBottom: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>{item.label}</label>
                                    <span style={{ fontSize: '11px', color: '#7c3aed', fontWeight: 800 }}>{Math.round(sliderVal * 2)}%</span>
                                </div>
                                <input type="range" min="0.5" max="100" step="0.5" value={sliderVal} onChange={(e) => {
                                    const val = parseFloat(e.target.value);
                                    const newVal = item.key === 'pageMargin' ? (val / 50) * 40 : (val / 50) * defVal;
                                    updateSetting(item.key, newVal);
                                }} style={{ width: '100%', accentColor: '#7c3aed', height: '4px', background: '#e2e8f0', borderRadius: '0', outline: 'none', cursor: 'pointer' }} />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
