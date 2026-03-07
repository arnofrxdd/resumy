'use client';
import React from 'react';
import DebugEngine3 from './DebugEngine3';
import { testData } from './utils/testData';
import { stressTemplateConfig } from '../new-engine/utils/stressTestData';

// Creative Modern Template Config for Engine 3
const creativeTemplateConfig = {
    layout: {
        // Defines regions and their order
        sidebar: ['personal', 'skills', 'languages', 'interests'],
        main: ['summary', 'experience', 'projects', 'education']
    },
    // Configuration for regions (width, style)
    regions: {
        sidebar: {
            width: '30%',
            styles: {
                background: '#1e293b', // Dark Slate
                color: '#f8fafc',
                padding: '20px'
            }
        },
        main: {
            width: '70%',
            styles: {
                background: '#ffffff',
                color: '#334155',
                padding: '30px'
            }
        }
    },
    // Global Styles
    styles: {
        fontFamily: "'Inter', sans-serif",
        headingColor: '#334155',
        sidebarHeadingColor: '#ffffff'
    }
};

const DebugEngine3Page = () => {
    return (
        <div style={{ width: '100vw', minHeight: '100vh', overflow: 'auto', background: '#0f172a' }}>
            <DebugEngine3
                data={testData}
                templateConfig={creativeTemplateConfig}
            />
        </div>
    );
};

export default DebugEngine3Page;
