import React from 'react';
import './ResumeTemplate11.css';
import SectionWrapper from '../../components/SectionWrapper';
import { Github, Linkedin, Mail, MapPin, Globe } from 'lucide-react';

const ResumeTemplate11 = ({ data, onSectionClick }) => {
    if (!data) return null;

    const {
        personal = {},
        summary = "",
        experience = [],
        education = [],
        skills = [],
        projects = [],
        selectedExtraSections = {},
        themeColor = "#58a6ff"
    } = data;

    const isInteractive = !!onSectionClick; // for editor
    const themeFont = "var(--theme-font, 'JetBrains Mono', monospace)";

    return (
        <div className="tech-resume" style={{ padding: '40px', boxSizing: 'border-box', background: '#0d1117', color: '#c9d1d9', fontFamily: themeFont, minHeight: '100%' }}>

            {/* HEADER */}
            <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive}>
                <header style={{ marginBottom: '40px', borderBottom: '1px solid #30363d', paddingBottom: '20px' }}>
                    <h1 style={{ fontSize: '36px', color: '#fff', marginBottom: '5px' }}>{personal.name}</h1>
                    <div style={{ fontSize: '18px', color: themeColor, fontFamily: 'monospace', marginBottom: '15px' }}>&gt; {personal.profession}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', fontSize: '14px', color: '#8b949e' }}>
                        {personal.email && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> {personal.email}</div>}
                        {personal.linkedin && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Linkedin size={14} /> linkedin.com/in/...</div>}
                        {personal.github && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Github size={14} /> github.com/...</div>}
                        {(personal.city || personal.country) && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> {personal.city}, {personal.country}</div>}
                    </div>
                </header>
            </SectionWrapper>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>

                {/* MAIN COLUMN */}
                <div>
                    {summary && (
                        <SectionWrapper sectionId="summary" onSectionClick={onSectionClick} isInteractive={isInteractive}>
                            <section style={{ marginBottom: '30px' }}>
                                <h2 className="section-header" style={{ color: themeColor }}>// Summary</h2>
                                <div style={{ fontSize: '14px' }} dangerouslySetInnerHTML={{ __html: summary }} />
                            </section>
                        </SectionWrapper>
                    )}

                    {experience && experience.length > 0 && (
                        <SectionWrapper sectionId="experience" onSectionClick={onSectionClick} isInteractive={isInteractive}>
                            <section style={{ marginBottom: '30px' }}>
                                <h2 className="section-header" style={{ color: themeColor }}>// Experience</h2>
                                {experience.map((job, i) => (
                                    <div key={i} style={{ marginBottom: '25px', paddingLeft: '15px', borderLeft: `2px solid #30363d` }}>
                                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>{job.title}</div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: themeColor, margin: '4px 0 8px 0', fontFamily: 'monospace' }}>
                                            <span>{job.company}</span>
                                            <span>{job.date}</span>
                                        </div>
                                        <div style={{ fontSize: '14px' }} dangerouslySetInnerHTML={{ __html: job.description }} />
                                    </div>
                                ))}
                            </section>
                        </SectionWrapper>
                    )}

                    {projects && projects.length > 0 && (
                        <SectionWrapper sectionId="projects" onSectionClick={onSectionClick} isInteractive={isInteractive}>
                            <section style={{ marginBottom: '30px' }}>
                                <h2 className="section-header" style={{ color: themeColor }}>// Projects</h2>
                                {projects.map((p, i) => (
                                    <div key={i} style={{ marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                                            <span style={{ fontWeight: 'bold', color: '#fff' }}>{p.name}</span>
                                            {p.link && <a href={p.link} target="_blank" rel="noreferrer" style={{ fontSize: '12px', fontFamily: 'monospace' }}>[View Project]</a>}
                                        </div>
                                        <div style={{ fontSize: '14px', marginTop: '4px' }} dangerouslySetInnerHTML={{ __html: p.description }} />
                                    </div>
                                ))}
                            </section>
                        </SectionWrapper>
                    )}
                </div>

                {/* SIDE COLUMN */}
                <div>
                    <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive}>
                        <section style={{ marginBottom: '30px' }}>
                            <h2 className="section-header" style={{ color: themeColor }}>// Tech Stack</h2>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {skills.map((s, i) => (
                                    <span key={i} className="skill-tag">{typeof s === 'object' ? s.name : s}</span>
                                ))}
                            </div>
                        </section>
                    </SectionWrapper>

                    {education && education.length > 0 && (
                        <SectionWrapper sectionId="education" onSectionClick={onSectionClick} isInteractive={isInteractive}>
                            <section style={{ marginBottom: '30px' }}>
                                <h2 className="section-header" style={{ color: themeColor }}>// Education</h2>
                                {education.map((e, i) => (
                                    <div key={i} style={{ marginBottom: '15px' }}>
                                        <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '14px' }}>{e.degree}</div>
                                        <div style={{ fontSize: '12px', color: themeColor, fontFamily: 'monospace', margin: '2px 0' }}>{e.year}</div>
                                        <div style={{ fontSize: '13px', color: '#8b949e' }}>{e.institution}</div>
                                    </div>
                                ))}
                            </section>
                        </SectionWrapper>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResumeTemplate11;
