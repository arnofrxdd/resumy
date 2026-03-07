import React from 'react';
import './ResumeTemplate12.css';
import SectionWrapper from '../../components/SectionWrapper';
import { Mail, Phone, MapPin, Globe, Linkedin, ArrowUpRight } from 'lucide-react';

const ResumeTemplate12 = ({ data, onSectionClick }) => {
    if (!data) return null;

    const {
        personal = {},
        summary = "",
        experience = [],
        education = [],
        skills = [],
        projects = [],
        themeColor = "#ff4757"
    } = data;

    const isInteractive = !!onSectionClick;
    const themeFont = "var(--theme-font, 'Playfair Display', serif)";

    return (
        <div className="designer-resume" style={{ background: '#fff', minHeight: '100%', fontFamily: themeFont, position: 'relative' }}>

            {/* CREATIVE HEADER SHAPE */}
            <div className="header-bg" style={{ background: themeColor, height: '220px', padding: '40px', color: '#fff' }}>
                <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive}>
                    <h1 style={{ fontSize: '56px', lineHeight: '1', marginBottom: '10px' }}>{personal.name?.split(' ')[0]}<br /><span style={{ opacity: 0.8 }}>{personal.name?.split(' ').slice(1).join(' ')}</span></h1>
                    <div style={{ fontSize: '20px', letterSpacing: '2px', fontWeight: 'bold' }}>{personal.profession}</div>
                </SectionWrapper>
            </div>

            <div style={{ padding: '0 40px 40px 40px', marginTop: '-40px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '50px' }}>

                {/* LEFT COLUMN (CONTACT + SKILLS) */}
                <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '40px' }}>
                        {personal.email && <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}><Mail size={16} color={themeColor} /> {personal.email}</div>}
                        {personal.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}><Phone size={16} color={themeColor} /> {personal.phone}</div>}
                        {(personal.city || personal.country) && <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}><MapPin size={16} color={themeColor} /> {personal.city}</div>}
                        {personal.website && <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}><Globe size={16} color={themeColor} /> Portfolio</div>}
                    </div>

                    <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive}>
                        <h3 className="section-title" style={{ fontSize: '18px' }}>Expertise</h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {skills.map((s, i) => (
                                <span key={i} style={{ border: `1px solid ${themeColor}`, color: themeColor, padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
                                    {typeof s === 'object' ? s.name : s}
                                </span>
                            ))}
                        </div>
                    </SectionWrapper>

                    {education && education.length > 0 && (
                        <SectionWrapper sectionId="education" onSectionClick={onSectionClick} isInteractive={isInteractive}>
                            <div style={{ marginTop: '40px' }}>
                                <h3 className="section-title" style={{ fontSize: '18px' }}>Education</h3>
                                {education.map((e, i) => (
                                    <div key={i} style={{ marginBottom: '15px' }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{e.degree}</div>
                                        <div style={{ fontSize: '12px', opacity: 0.6 }}>{e.institution}, {e.year}</div>
                                    </div>
                                ))}
                            </div>
                        </SectionWrapper>
                    )}
                </div>

                {/* RIGHT COLUMN (WORK + PROJECTS) */}
                <div style={{ paddingTop: '60px' }}>
                    {summary && (
                        <SectionWrapper sectionId="summary" onSectionClick={onSectionClick} isInteractive={isInteractive}>
                            <div style={{ marginBottom: '40px', fontSize: '16px', lineHeight: '1.8' }}>
                                <div dangerouslySetInnerHTML={{ __html: summary }} />
                            </div>
                        </SectionWrapper>
                    )}

                    {experience && experience.length > 0 && (
                        <SectionWrapper sectionId="experience" onSectionClick={onSectionClick} isInteractive={isInteractive}>
                            <h2 className="section-title">Work Experience</h2>
                            {experience.map((job, i) => (
                                <div key={i} style={{ marginBottom: '40px', position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: '-25px', top: '5px', width: '10px', height: '10px', background: themeColor, borderRadius: '50%' }}></div>
                                    <h4 style={{ fontSize: '20px', marginBottom: '5px' }}>{job.title}</h4>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '14px', fontWeight: 'bold', opacity: 0.5 }}>
                                        <span>{job.company}</span>
                                        <span>{job.date}</span>
                                    </div>
                                    <div style={{ fontSize: '15px', color: '#555' }} dangerouslySetInnerHTML={{ __html: job.description }} />
                                </div>
                            ))}
                        </SectionWrapper>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ResumeTemplate12;
