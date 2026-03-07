import React, { useState } from 'react';
import {
    Layout,
    Sparkles,
    Search,
    ArrowRight,
    ChevronRight,
    Grid,
    Zap,
    Crown,
    Filter,
    ArrowLeft as BackIcon
} from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import TemplatePreview from './TemplatePreview';
import { getMockDataForTemplate } from './MockProfiles';
import './PremiumTemplateMobile.css';

// --- SKELETON COMPONENT ---
const TemplateSkeleton = ({ isDense = false }) => (
    <div className={`pt-mobile-skeleton ${isDense ? 'dense' : ''}`}>
        <div className="pt-skeleton-preview">
            <div className="w-full h-full skeleton-shine opacity-40" />
            <div className="absolute inset-0 p-4 flex flex-col gap-3">
                <div className="w-2/3 h-4 bg-stone-100 rounded-md skeleton-shine" />
                <div className="w-full h-2 bg-stone-100 rounded-none skeleton-shine opacity-60" />
                <div className="w-full h-2 bg-stone-100 rounded-none skeleton-shine opacity-60" />
                <div className="w-4/5 h-2 bg-stone-100 rounded-none skeleton-shine opacity-60" />
                <div className="mt-auto w-1/2 h-6 bg-stone-100 rounded-md skeleton-shine" />
            </div>
        </div>
        {!isDense && (
            <div className="mt-3 px-1 space-y-2">
                <div className="w-3/4 h-3 bg-stone-100 rounded-md skeleton-shine" />
                <div className="w-1/2 h-2.5 bg-stone-100 rounded-md skeleton-shine opacity-60" />
            </div>
        )}
    </div>
);

const ConfirmationDrawer = ({ template, onConfirm, onCancel, data, showMockData }) => {
    const [activeColor, setActiveColor] = useState(template.recommendedColors?.[0] || '#8b5cf6');
    const mockData = showMockData ? getMockDataForTemplate(template) : data;

    const cleanData = React.useMemo(() => {
        const base = {
            ...mockData,
            personal: { ...mockData?.personal, photo: null }
        };
        return {
            ...base,
            themeColor: activeColor,
            templateLayouts: {
                ...(base.templateLayouts || {}),
                [template.id]: {
                    ...(base.templateLayouts?.[template.id] || {}),
                    themeColor: activeColor
                }
            }
        };
    }, [mockData, activeColor, template.id]);

    return (
        <motion.div
            className="pt-confirmation-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
        >
            <motion.div
                className="pt-confirmation-drawer"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="pt-drawer-handle" />
                <div className="pt-drawer-content">
                    <div className="pt-drawer-preview">
                        <TemplatePreview
                            templateId={template.id}
                            data={cleanData}
                            isFormPanel={true}
                        />
                    </div>
                    <div className="pt-drawer-info">
                        <h2>{template.name}</h2>
                        <p>A premium design optimized for {template.tags?.[0] || 'Modern'} resumes.</p>
                    </div>

                    {template.recommendedColors?.length > 0 && (
                        <div className="pt-mobile-palette-wrapper">
                            <span className="pt-palette-label">Color Palette</span>
                            <div className="pt-mobile-palette">
                                {template.recommendedColors.map((color, idx) => (
                                    <div
                                        key={idx}
                                        className={`pt-mobile-color-dot ${activeColor === color ? 'active' : ''}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => setActiveColor(color)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <button className="pt-use-template-btn" onClick={() => onConfirm(template.id, activeColor)}>
                        Use This Template <ArrowRight size={18} />
                    </button>
                    <button className="pt-cancel-btn" onClick={onCancel}>
                        Keep looking
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const LazyTemplateCard = ({ template, data, showMockData, onSelect, isDense = false }) => {
    const ref = React.useRef(null);
    const isInView = useInView(ref, { margin: "200px" });

    const mockData = showMockData ? getMockDataForTemplate(template) : data;
    const cleanData = React.useMemo(() => ({
        ...mockData,
        personal: {
            ...mockData?.personal,
            photo: null
        }
    }), [mockData]);

    return (
        <div
            ref={ref}
            className={`pt-mobile-card ${isDense ? 'dense' : ''}`}
            onClick={() => isInView && onSelect(template)}
        >
            {!isInView ? (
                <TemplateSkeleton isDense={isDense} />
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="pt-card-preview">
                        <div className="pt-template-render-wrapper">
                            <TemplatePreview
                                templateId={template.id}
                                data={cleanData}
                                isFormPanel={true}
                            />
                        </div>
                    </div>
                    <div className="pt-card-info">
                        <h3>{template.name}</h3>
                        {!isDense && <span className="pt-card-category">{template.tags?.[0] || 'Modern'}</span>}
                    </div>
                </motion.div>
            )}
        </div>
    );
};

const PremiumTemplateMobile = ({
    userId,
    data,
    onUpdateData,
    onComplete,
    projectTitle = "Untitled Resume",
    onUpdateTitle,
    templates = [],
    showMockData = true,
    onBack
}) => {
    const [view, setView] = useState('discovery'); // 'discovery' or 'all'
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [proOnly, setProOnly] = useState(false);
    const [headerVisible, setHeaderVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const scrollContainerRef = React.useRef(null);

    // Smart Hide Header Logic
    const handleScroll = (e) => {
        const currentScrollY = e.target.scrollTop;
        if (Math.abs(currentScrollY - lastScrollY) < 5) return; // Sensitivity threshold

        if (currentScrollY > lastScrollY && currentScrollY > 80) {
            setHeaderVisible(false); // Scroll down
        } else {
            setHeaderVisible(true); // Scroll up
        }
        setLastScrollY(currentScrollY);
    };

    // Categories for mobile
    const categories = ['All', 'Modern', 'Creative', 'Executive', 'Classic', 'Minimalist'];

    // Filter logic
    const filteredTemplates = templates.filter(t => {
        const matchesCategory = activeCategory === 'All' || (t.tags && t.tags.includes(activeCategory));
        const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
        const isPremium = t.tags?.includes('Premium');
        const matchesPro = true; // Always true to show all templates
        return matchesCategory && matchesSearch && matchesPro;
    });

    const curatedStories = [
        {
            id: 'creative-vanguard',
            title: 'Creative Vanguard',
            subtitle: 'Curated Story',
            description: 'Break the mold. For visionaries who need personality to breathe.',
            templates: templates.filter(t => t.tags?.includes('Creative')).slice(0, 3)
        },
        {
            id: 'executive-edge',
            title: 'Executive Edge',
            subtitle: 'Curated Story',
            description: 'Powerful, clean, and commanding designs for leadership.',
            templates: templates.filter(t => t.tags?.includes('Executive')).slice(0, 3)
        }
    ];

    if (curatedStories[0].templates.length === 0 && templates.length > 0) {
        curatedStories[0].templates = templates.slice(0, 3);
    }

    return (
        <div
            className="pt-mobile-root"
            ref={scrollContainerRef}
            onScroll={handleScroll}
        >
            {/* 1. COMPACT SEARCH & DISCOVERY HEADER */}
            <motion.div
                className="pt-mobile-header"
                initial={false}
                animate={{ y: headerVisible ? 0 : -160 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
            >
                <div className="pt-header-top">
                    {onBack && (
                        <button className="pt-back-btn" onClick={onBack}>
                            <BackIcon size={20} />
                        </button>
                    )}
                    <div className="pt-header-title">
                        <span className="pt-label">The Gallery</span>
                        <h1 className="pt-project-name">{projectTitle}</h1>
                    </div>
                    <div className="pt-header-actions">
                        <button className={`pt-view-toggle ${view === 'discovery' ? 'active' : ''}`} onClick={() => setView('discovery')}>
                            <Sparkles size={14} />
                        </button>
                        <button className={`pt-view-toggle ${view === 'all' ? 'active' : ''}`} onClick={() => setView('all')}>
                            <Grid size={14} />
                        </button>
                    </div>
                </div>

                <div className="pt-search-bar-wrapper">
                    <div className="pt-search-input-container">
                        <Search size={14} className="pt-search-icon" />
                        <input
                            type="text"
                            placeholder="Find a template..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </motion.div>

            {/* 2. MAIN CONTENT AREA */}
            <div className="pt-mobile-content">

                {view === 'discovery' ? (
                    <div className="pt-discovery-view">
                        {/* Featured Curated Reels */}
                        {curatedStories.map(story => (
                            <div key={story.id} className="pt-story-reel">
                                <div className="pt-story-header">
                                    <div className="pt-story-info">
                                        <div className="pt-story-tag">
                                            <Zap size={10} fill="currentColor" /> {story.subtitle}
                                        </div>
                                        <h2>{story.title}</h2>
                                    </div>
                                    <button className="pt-explore-btn" onClick={() => { setView('all'); setActiveCategory(story.title.split(' ')[0]) }}>
                                        All <ChevronRight size={14} />
                                    </button>
                                </div>
                                <div className="pt-horizontal-scroll">
                                    {story.templates.map(template => (
                                        <LazyTemplateCard
                                            key={template.id}
                                            template={template}
                                            data={data}
                                            showMockData={showMockData}
                                            onSelect={setSelectedTemplate}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* PROMO BANNER COMMENTED OUT */}
                        {/* <div className="pt-mobile-promo">
                            <div className="pt-promo-content">
                                <h3>Go Pro. Build Fast.</h3>
                                <p>Unlock 50+ templates and AI-powered writing tools.</p>
                                <button className="pt-promo-cta">Upgrade Now</button>
                            </div>
                        </div> */}
                    </div>
                ) : (
                    <div className="pt-all-templates-view">
                        {/* Horizontal Categories */}
                        <div className="pt-category-strip">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    className={`pt-cat-btn ${activeCategory === cat ? 'active' : ''}`}
                                    onClick={() => setActiveCategory(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Filter Summary - Pro Toggle Commented Out */}
                        <div className="pt-filter-summary">
                            <span>Showing {filteredTemplates.length} designs</span>
                            {/* <div className="pt-pro-toggle" onClick={() => setProOnly(!proOnly)}>
                                <div className={`pt-switch ${proOnly ? 'active' : ''}`} />
                                <span>Pro Only</span>
                            </div> */}
                        </div>

                        {/* Dense Grid */}
                        <div className="pt-mobile-grid">
                            {filteredTemplates.map(template => (
                                <LazyTemplateCard
                                    key={template.id}
                                    template={template}
                                    data={data}
                                    showMockData={showMockData}
                                    onSelect={setSelectedTemplate}
                                    isDense={true}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* 3. CONFIRMATION DRAWER */}
            <AnimatePresence>
                {selectedTemplate && (
                    <ConfirmationDrawer
                        template={selectedTemplate}
                        data={data}
                        showMockData={showMockData}
                        onConfirm={onComplete}
                        onCancel={() => setSelectedTemplate(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default PremiumTemplateMobile;
