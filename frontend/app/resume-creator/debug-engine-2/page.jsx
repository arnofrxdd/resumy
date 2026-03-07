'use client';
import React from 'react';
import DebugEngine2 from '../new-engine/DebugEngine2';
import { stressTestData, stressTemplateConfig } from '../new-engine/utils/stressTestData';

const DebugEngine2Page = () => {
    return (
        <div style={{ width: '100vw', minHeight: '100vh', overflow: 'auto', background: '#0f172a' }}>
            <DebugEngine2
                data={stressTestData}
                config={{
                    pageSize: 'A4',
                    paddingTop: 50,
                    paddingBottom: 50,
                    templateConfig: stressTemplateConfig
                }}
            />
        </div>
    );
};

export default DebugEngine2Page;
