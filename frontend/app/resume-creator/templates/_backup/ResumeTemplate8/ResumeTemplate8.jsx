import React from 'react';
import './ResumeTemplate8.css';
import SectionWrapper from '../../components/SectionWrapper';

const ResumeTemplate8 = ({ data, highlightSection, onSectionClick }) => {
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
    themeColor = "#071044"
  } = data;

  const isInteractive = !!onSectionClick;

  return (
    <div className="template8-body" style={{ display: 'flex', background: '#fff', minHeight: '100%', fontFamily: "var(--theme-font)" }}>
      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: '50px' }}>
        <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive}>
          <header style={{ marginBottom: '40px' }}>
            <h1 style={{ fontSize: '36px', fontWeight: '900', margin: '0 0 5px 0', color: themeColor, textTransform: 'uppercase' }}>{personal.name}</h1>
            <div style={{ fontSize: '18px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: '2px' }}>{personal.profession}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '15px', fontSize: '12px', color: '#475569', fontWeight: '600' }}>
              {personal.email && <span>✉ {personal.email}</span>}
              {personal.phone && <span>📱 {personal.phone}</span>}
              {(personal.city || personal.country) && <span>📍 {personal.city}, {personal.country}</span>}
            </div>
          </header>
        </SectionWrapper>

        {summary && (
          <SectionWrapper sectionId="summary" onSectionClick={onSectionClick} isInteractive={isInteractive}>
            <section style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '900', color: themeColor, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px', borderBottom: `2px solid ${themeColor}`, paddingBottom: '5px' }}>About Me</h3>
              <div style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }} dangerouslySetInnerHTML={{ __html: summary }} />
            </section>
          </SectionWrapper>
        )}

        {experience && experience.length > 0 && (
          <SectionWrapper sectionId="experience" onSectionClick={onSectionClick} isInteractive={isInteractive}>
            <section style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '900', color: themeColor, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px', borderBottom: `2px solid ${themeColor}`, paddingBottom: '5px' }}>Experience</h3>
              {experience.map((job, i) => (
                <div key={i} style={{ marginBottom: '25px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '15px', color: '#1e293b' }}>
                    <span>{job.title}</span>
                    <span style={{ color: '#64748b', fontSize: '12px' }}>{job.date}</span>
                  </div>
                  <div style={{ color: themeColor, fontWeight: '700', fontSize: '14px', margin: '2px 0 8px 0' }}>{job.company}</div>
                  <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#475569' }} dangerouslySetInnerHTML={{ __html: job.description }} />
                </div>
              ))}
            </section>
          </SectionWrapper>
        )}
      </div>

      {/* SIDEBAR */}
      <div style={{ width: '280px', background: themeColor, color: '#fff', padding: '50px 30px', flexShrink: 0 }}>
        <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive}>
          <section style={{ marginBottom: '35px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '800', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '5px', marginBottom: '15px', textTransform: 'uppercase' }}>Skills</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {skills.map((s, i) => (
                <div key={i} style={{ fontSize: '12px', fontWeight: '600' }}>• {typeof s === 'object' ? s.name : s}</div>
              ))}
            </div>
          </section>
        </SectionWrapper>

        {education && education.length > 0 && (
          <SectionWrapper sectionId="education" onSectionClick={onSectionClick} isInteractive={isInteractive}>
            <section style={{ marginBottom: '35px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '800', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '5px', marginBottom: '15px', textTransform: 'uppercase' }}>Education</h4>
              {education.map((e, i) => (
                <div key={i} style={{ marginBottom: '15px' }}>
                  <div style={{ fontWeight: '700', fontSize: '13px' }}>{e.degree}</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', margin: '2px 0' }}>{e.year}</div>
                  <div style={{ fontSize: '12px', opacity: 0.9 }}>{e.institution}</div>
                </div>
              ))}
            </section>
          </SectionWrapper>
        )}

        {selectedExtraSections.languages && languages?.length > 0 && (
          <SectionWrapper sectionId="languages" onSectionClick={onSectionClick} isInteractive={isInteractive}>
            <section style={{ marginBottom: '35px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '800', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '5px', marginBottom: '15px', textTransform: 'uppercase' }}>Languages</h4>
              {languages.map((l, i) => (
                <div key={i} style={{ fontSize: '12px', marginBottom: '8px' }}>
                  <div style={{ fontWeight: '700' }}>{typeof l === 'object' ? l.name : l}</div>
                  <div style={{ opacity: 0.7, fontSize: '11px' }}>{['', 'Beginner', 'Intermediate', 'Advanced', 'Fluent', 'Native'][l.level || 0]}</div>
                </div>
              ))}
            </section>
          </SectionWrapper>
        )}
      </div>
    </div>
  );
};

export default ResumeTemplate8;