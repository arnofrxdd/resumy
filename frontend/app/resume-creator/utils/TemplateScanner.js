import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import TemplateRegistryMap from '../templates/TemplateRegistry';

/**
 * TemplateScanner
 * 
 * Uses a "Spy" data object (JavaScript Proxy) to trace which fields
 * a template accesses during rendering. This allows us to dynamically
 * determine compatibility without hard-coded lists.
 */

// Cache results to avoid expensive re-renders
const compatibilityCache = new Map();

// Generate a complete "Spy" object based on the schema
const createSpyData = (onAccess) => {

    // Helper to proxy an object or array
    const createProxy = (target, path) => {
        return new Proxy(target, {
            get: (obj, prop) => {
                // If accessing a symbol or prototype, ignore
                if (typeof prop === 'symbol' || prop === 'prototype') return obj[prop];

                // Construct new path
                const currentPath = path ? `${path}.${prop}` : prop;

                // Log access
                if (typeof prop === 'string') {
                    onAccess(currentPath);
                }

                // If the value is an object/array, we must return a proxy of THAT too
                // to catch nested access (e.g. personal.city)
                const value = obj[prop];
                if (value && typeof value === 'object') {
                    return createProxy(value, currentPath);
                }

                return value;
            }
        });
    };

    // Full Schema Mock
    const mockData = {
        personal: {
            name: "Spy Name",
            profession: "Spy Profession",
            email: "spy@example.com",
            phone: "+1234567890",
            city: "Spy City",
            country: "Spy Country",
            state: "Spy State",
            zipCode: "10000",
            linkedin: "linkedin.com/in/spy",
            github: "github.com/spy",
            website: "spy.com",
            photo: "data:image/png;base64,SPY",
            dob: "2000-01-01",
            nationality: "Spyish",
            gender: "Spy",
            maritalStatus: "Single",
            religion: "Code",
            visaStatus: "Active",
            passport: "A1234567"
        },
        summary: "Spy Summary HTML",
        experience: [
            {
                title: "Spy Role",
                company: "Spy Corp",
                location: "Spy Loc",
                startMonth: "Jan",
                startYear: "2020",
                endMonth: "Feb",
                endYear: "2022",
                isCurrent: false,
                isRemote: true,
                description: "Spy Desc"
            }
        ],
        education: [
            {
                school: "Spy Uni",
                degree: "Spy Degree",
                field: "Spy Field",
                city: "Spy City",
                grade: "4.0",
                startMonth: "Jan",
                startYear: "2016",
                endMonth: "May",
                endYear: "2020",
                description: "Spy Edu Desc"
            }
        ],
        skills: [
            { name: "Spy Skill 1", level: 5 },
            { name: "Spy Skill 2", level: 3 }
        ],
        languages: [
            { name: "Spy Lang 1", level: "Native" }
        ],
        projects: [
            {
                title: "Spy Project",
                link: "project.spy",
                technologies: ["SpyTech"],
                startYear: "2021",
                endYear: "2022",
                description: "Spy Proj Desc"
            }
        ],
        certifications: [
            { name: "Spy Cert", date: "2021" }
        ],
        interests: ["Spy Interest 1"],
        keyAchievements: [{ name: "Spy Achievement 1", description: "Spy Achievement Description" }],
        software: [
            { name: "Spy Soft", rating: 5 }
        ],
        websites: [
            { url: "spy.web", addToHeader: true },
            { url: "portfolio.spy", addToHeader: false }
        ],
        affiliations: [{ name: "Spy Affiliation 1", description: "Spy Affiliation Description" }],
        accomplishments: [{ name: "Spy Accomplishment 1", description: "Spy Accomplishment Description" }],
        additionalInfo: "Spy Info HTML",
        customSection: {
            title: "Spy Custom",
            content: "Spy Content",
            isVisible: true
        },
        // Mock templateLayouts to return ALL sections for ANY template ID
        // This ensures that when the scanner forces {{SORTABLE}}, all sections are included
        templateLayouts: new Proxy({}, {
            get: (target, prop) => {
                if (prop === Symbol.iterator) return target[Symbol.iterator];
                return {
                    mainSectionsOrder: [
                        'summary', 'experience', 'education', 'projects', 'skills',
                        'languages', 'certifications', 'interests', 'software',
                        'websites', 'keyAchievements', 'accomplishments',
                        'additionalInfo', 'affiliations', 'customSection'
                    ],
                    sidebarSectionsOrder: []
                };
            }
        })
    };

    return createProxy(mockData, '');
};

const TemplateScanner = {
    /**
     * Scans a template to see which data fields it actually renders.
     * @param {string} templateId 
     * @returns {Promise<Set<string>>} A set of dot-notation paths (e.g. "personal.city")
     */
    scan: async (templateId) => {
        if (!templateId) return new Set();
        // Force re-scan for debug template to ensure logging works
        if (templateId !== 'debug-compatibility' && compatibilityCache.has(templateId)) {
            return compatibilityCache.get(templateId);
        }

        return new Promise((resolve) => {
            const accessedPaths = new Set();

            // 1. Create Spy Data
            const spyData = createSpyData((path) => {
                accessedPaths.add(path);

                // Heuristic: If accessing array index (experience.0.title), 
                // record generic path (experience.title) for easier checking
                const genericPath = path.replace(/\.\d+\./, '.').replace(/\.\d+$/, '');
                accessedPaths.add(genericPath);
            });

            // 2. Resolve Component
            const TemplateComponent = TemplateRegistryMap[templateId];
            if (!TemplateComponent) {
                console.warn(`[TemplateScanner] Template ${templateId} not found`);
                resolve(new Set());
                return;
            }

            // 3. Render into detached DOM
            // Render the COMPONENT DIRECTLY to avoid ResumeRenderer's data processing triggering false positives
            const container = document.createElement('div');
            const root = createRoot(container);

            try {
                flushSync(() => {
                    root.render(
                        <TemplateComponent
                            data={spyData}
                            // Pass mock props that templates might expect
                            font="Arial"
                            fontSize={1}
                            color="#000000"
                            layoutConfig={{ main: ["{{SORTABLE}}"], sidebar: ["{{SORTABLE}}"] }}
                            isSpellCheckActive={false}
                        />
                    );
                });

                // Small delay to allow effects/suspense to resolve
                setTimeout(() => {
                    root.unmount();

                    // Post-processing: Add implicit paths
                    accessedPaths.forEach(p => {
                        const parts = p.split('.');
                        if (parts.length > 1) accessedPaths.add(parts[0]);
                    });

                    // Cache and return
                    compatibilityCache.set(templateId, accessedPaths);
                    console.log(`[TemplateScanner] Scanned ${templateId}:`, accessedPaths);
                    resolve(accessedPaths);
                }, 100);

            } catch (err) {
                console.error("[TemplateScanner] Error scanning template:", err);
                resolve(new Set()); // Fail safe
            }
        });
    }
};

export default TemplateScanner;
