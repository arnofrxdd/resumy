import React from 'react';
import './ResumeTemplate10.css';
import SectionWrapper from '../../components/SectionWrapper';

const ResumeTemplate10 = ({ data, onSectionClick }) => {
    if (!data) return null;

    const {
        personal = {},
        summary = "",
        experience = [],
        education = [],
        skills = [],
        projects = [],
        languages = [],
        certifications = [],
        selectedExtraSections = {},
        themeColor = "#000000"
    } = data;

    const isInteractive = !!onSectionClick;
    const themeFont = "var(--theme-font, 'Garamond', serif)";

    const Divider = () => (
        <div style={{ borderBottom: '1px solid #000', margin: '10px 0 15px 0' }} />
    );

    return (
        <div className="ivy-league-resume" style={{ padding: '50px', boxSizing: 'border-box', background: '#fff', fontFamily: themeFont, color: '#000', minHeight: '100%' }}>

            {/* HEADER */}
            <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive}>
                <header style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{ fontSize: '32px', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '1px' }}>{personal.name}</h1>
                    <div style={{ fontSize: '14px', marginBottom: '10px' }}>
                        {personal.email && <span>{personal.email}</span>}
                        {personal.phone && <span> • {personal.phone}</span>}
                        {(personal.city || personal.country) && <span> • {personal.city}, {personal.country}</span>}
                        {personal.linkedin && <span> • LinkedIn</span>}
                    </div>
                </header>
            </SectionWrapper>

            {/* EDUCATION (Academic Focus - Often Higher Up) */}
            {education && education.length > 0 && (
                <SectionWrapper sectionId="education" onSectionClick={onSectionClick} isInteractive={isInteractive}>
                    <section style={{ marginBottom: '25px' }}>
                        <h2 style={{ fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Education</h2>
                        <Divider />
                        {education.map((e, i) => (
                            <div key={i} style={{ marginBottom: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                    <span>{e.institution}</span>
                                    <span>{e.year}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontStyle: 'italic' }}>
                                    <span>{e.degree}</span>
                                    <span>{e.city}</span>
                                </div>
                                {e.description && <div style={{ fontSize: '14px', marginTop: '5px' }}>{e.description}</div>}
                            </div>
                        ))}
                    </section>
                </SectionWrapper>
            )}

            {/* EXPERIENCE */}
            {experience && experience.length > 0 && (
                <SectionWrapper sectionId="experience" onSectionClick={onSectionClick} isInteractive={isInteractive}>
                    <section style={{ marginBottom: '25px' }}>
                        <h2 style={{ fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Professional Experience</h2>
                        <Divider />
                        {experience.map((job, i) => (
                            <div key={i} style={{ marginBottom: '15px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                                    <span>{job.company}</span>
                                    <span>{job.date}</span>
                                </div>
                                <div style={{ fontStyle: 'italic', marginBottom: '5px' }}>{job.title}</div>
                                <div style={{ fontSize: '14px' }} dangerouslySetInnerHTML={{ __html: job.description }} />
                            </div>
                        ))}
                    </section>
                </SectionWrapper>
            )}

            {/* SKILLS */}
            <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive}>
                <section style={{ marginBottom: '25px' }}>
                    <h2 style={{ fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Skills & Interests</h2>
                    <Divider />
                    <div style={{ fontSize: '14px' }}>
                        <span style={{ fontWeight: 'bold' }}>Skills: </span>
                        {skills.map((s, i) => (
                            <span key={i}>{typeof s === 'object' ? s.name : s}{i < skills.length - 1 ? ', ' : ''}</span>
                        ))}
                    </div>
                    {languages.length > 0 && (
                        <div style={{ fontSize: '14px', marginTop: '5px' }}>
                            <span style={{ fontWeight: 'bold' }}>Languages: </span>
                            {languages.map((l, i) => (
                                <span key={i}>{typeof l === 'object' ? l.name : l}{i < languages.length - 1 ? ', ' : ''}</span>
                            ))}
                        </div>
                    )}
                </section>
            </SectionWrapper>

            {/* PROJECTS */}
            {projects && projects.length > 0 && (
                <SectionWrapper sectionId="projects" onSectionClick={onSectionClick} isInteractive={isInteractive}>
                    <section>
                        <h2 style={{ fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Projects</h2>
                        <Divider />
                        {projects.map((p, i) => (
                            <div key={i} style={{ marginBottom: '10px' }}>
                                <div style={{ fontWeight: 'bold' }}>{p.name || p.title}</div>
                                <div style={{ fontSize: '14px' }} dangerouslySetInnerHTML={{ __html: p.description }} />
                            </div>
                        ))}
                    </section>
                </SectionWrapper>
            )}

        </div>
    );
};

export default ResumeTemplate10;
