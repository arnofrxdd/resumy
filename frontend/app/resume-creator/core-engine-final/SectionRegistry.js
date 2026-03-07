import React from 'react';

// Section Components (Simple Renderers)
const ExperienceSection = ({ items, isContinuation, sectionId }) => (
    <div className="section-content">
        {items.map((item, idx) => (
            <div key={idx} className="experience-item" style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                    <span>{item.title}</span>
                    <span>{item.startYear} - {item.endYear || 'Present'}</span>
                </div>
                <div style={{ fontStyle: 'italic', color: '#666' }}>{item.company} | {item.location}</div>
                <div
                    className="description"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                    style={{ marginTop: '5px' }}
                />
            </div>
        ))}
    </div>
);

const EducationSection = ({ items }) => (
    <div className="section-content">
        {items.map((item, idx) => (
            <div key={idx} className="education-item" style={{ marginBottom: '10px' }}>
                <div style={{ fontWeight: 'bold' }}>{item.school}</div>
                <div>{item.degree} in {item.field} ({item.startYear} - {item.endYear})</div>
            </div>
        ))}
    </div>
);

const SkillsSection = ({ items }) => (
    <div className="section-content" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {items.map((item, idx) => (
            <span key={idx} style={{
                background: '#eee',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px'
            }}>
                {item.name}
            </span>
        ))}
    </div>
);

const SummarySection = ({ content }) => (
    <div className="section-content" dangerouslySetInnerHTML={{ __html: content }} />
);

const SectionRegistry = {
    experience: ExperienceSection,
    education: EducationSection,
    skills: SkillsSection,
    languages: SkillsSection, // Reuse skills style for now
    summary: SummarySection
};

export default SectionRegistry;
