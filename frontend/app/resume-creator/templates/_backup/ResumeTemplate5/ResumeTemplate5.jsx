import React from 'react';
import './ResumeTemplate5.css';
import { User, Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';
import SectionWrapper from '../../components/SectionWrapper';

const ResumeTemplate5 = ({ data, highlightSection, onSectionClick }) => {
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
        themeColor = "#3F3F3F"
    } = data;

    const isInteractive = !!onSectionClick;

    // Define themeFont based on the outer div's fontFamily
    const themeFont = "var(--theme-font)";

    return (
        <div className="template5-body" style={{ padding: '40px', boxSizing: 'border-box', background: '#f8fafc', minHeight: '100%', fontFamily: themeFont }}>
            <div style={{ padding: '40px', background: '#fff', fontFamily: themeFont, color: '#333', minHeight: '100%', boxSizing: 'border-box', position: 'relative', overflow: 'hidden' }}>
                <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive}>
                    <header style={{ display: 'flex', padding: '40px', gap: '30px', alignItems: 'center', borderBottom: `5px solid ${themeColor}` }}>
                        <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {personal.photo ? <img src={personal.photo} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} alt="" /> : <User size={60} color="#cbd5e1" />}
                        </div>
                        <div>
                            <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0, color: '#1e293b', textTransform: 'uppercase' }}>{personal.name}</h1>
                            <div style={{ fontSize: '18px', fontWeight: '700', color: themeColor, textTransform: 'uppercase', letterSpacing: '2px', marginTop: '5px' }}>{personal.profession}</div>
                        </div>
                    </header>
                </SectionWrapper>

                <div style={{ background: themeColor, padding: '15px 40px', display: 'flex', gap: '25px', flexWrap: 'wrap', color: '#fff', fontSize: '13px' }}>
                    {personal.email && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={14} /> {personal.email}</div>}
                    {personal.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Phone size={14} /> {personal.phone}</div>}
                    {(personal.city || personal.country) && <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MapPin size={14} /> {personal.city}, {personal.country}</div>}
                </div>

                <div style={{ display: 'flex', padding: '40px', gap: '40px' }}>
                    <div style={{ flex: 2 }}>
                        {summary && (
                            <SectionWrapper sectionId="summary" onSectionClick={onSectionClick} isInteractive={isInteractive}>
                                <section style={{ marginBottom: '35px' }}>
                                    <h2 style={{ fontSize: '18px', fontWeight: '800', color: themeColor, textTransform: 'uppercase', marginBottom: '15px', borderBottom: '2px solid #e2e8f0', paddingBottom: '5px' }}>About Me</h2>
                                    <div style={{ fontSize: '14px', lineHeight: '1.7', color: '#475569' }} dangerouslySetInnerHTML={{ __html: summary }} />
                                </section>
                            </SectionWrapper>
                        )}

                        {experience && experience.length > 0 && (
                            <SectionWrapper sectionId="experience" onSectionClick={onSectionClick} isInteractive={isInteractive}>
                                <section style={{ marginBottom: '35px' }}>
                                    <h2 style={{ fontSize: '18px', fontWeight: '800', color: themeColor, textTransform: 'uppercase', marginBottom: '15px', borderBottom: '2px solid #e2e8f0', paddingBottom: '5px' }}>Experience</h2>
                                    {experience.map((job, i) => (
                                        <div key={i} style={{ marginBottom: '25px' }}>
                                            <div style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>{job.title}</div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', color: themeColor, fontWeight: '600', fontSize: '14px', margin: '2px 0 8px 0' }}>
                                                <span>{job.company}</span>
                                                <span>{job.date}</span>
                                            </div>
                                            <div style={{ fontSize: '14px', color: '#475569' }} dangerouslySetInnerHTML={{ __html: job.description }} />
                                        </div>
                                    ))}
                                </section>
                            </SectionWrapper>
                        )}
                    </div>

                    <div style={{ flex: 1 }}>
                        <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive}>
                            <section style={{ marginBottom: '30px' }}>
                                <h2 style={{ fontSize: '16px', fontWeight: '800', color: themeColor, textTransform: 'uppercase', marginBottom: '10px' }}>Skills</h2>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {skills.map((s, i) => (
                                        <div key={i} style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ width: '8px', height: '8px', background: themeColor, borderRadius: '2px' }}></div>
                                            {typeof s === 'object' ? s.name : s}
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </SectionWrapper>

                        {education && education.length > 0 && (
                            <SectionWrapper sectionId="education" onSectionClick={onSectionClick} isInteractive={isInteractive}>
                                <section style={{ marginBottom: '30px' }}>
                                    <h2 style={{ fontSize: '16px', fontWeight: '800', color: themeColor, textTransform: 'uppercase', marginBottom: '10px' }}>Education</h2>
                                    {education.map((e, i) => (
                                        <div key={i} style={{ marginBottom: '15px' }}>
                                            <div style={{ fontWeight: '700', fontSize: '14px', color: '#1e293b' }}>{e.degree}</div>
                                            <div style={{ color: themeColor, fontSize: '13px', fontWeight: '700', margin: '2px 0' }}>{e.year}</div>
                                            <div style={{ fontSize: '13px', color: '#64748b' }}>{e.institution}</div>
                                        </div>
                                    ))}
                                </section>
                            </SectionWrapper>
                        )}

                        {selectedExtraSections.languages && languages?.length > 0 && (
                            <SectionWrapper sectionId="languages" onSectionClick={onSectionClick} isInteractive={isInteractive}>
                                <section style={{ marginBottom: '30px' }}>
                                    <h2 style={{ fontSize: '16px', fontWeight: '800', color: themeColor, textTransform: 'uppercase', marginBottom: '10px' }}>Languages</h2>
                                    {languages.map((l, i) => (
                                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                                            <span style={{ fontWeight: '600' }}>{typeof l === 'object' ? l.name : l}</span>
                                            <span style={{ color: '#64748b' }}>{['', 'Beg', 'Int', 'Adv', 'Fluent', 'Native'][l.level || 0]}</span>
                                        </div>
                                    ))}
                                </section>
                            </SectionWrapper>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeTemplate5;