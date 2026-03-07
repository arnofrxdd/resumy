import React from 'react';
import './ResumeTemplate6.css';
import SectionWrapper from '../../components/SectionWrapper';

const ResumeTemplate6 = ({ data, highlightSection, onSectionClick }) => {
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
    awards = [],
    interests = [],
    software = [],
    selectedExtraSections = {},
    themeColor = "#FF6A00",
    themeFont = "var(--theme-font)" // Assuming themeFont is available or needs to be added
  } = data;

  const isInteractive = !!onSectionClick;

  return (
    <div className="template6-body" style={{ padding: '40px 50px', fontFamily: themeFont, color: '#333', background: '#fff', minHeight: '100%', boxSizing: 'border-box' }}>
      <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive}>
        <header style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: '36px', fontWeight: '900', margin: '0 0 5px 0', color: themeColor, textTransform: 'uppercase' }}>{personal.name}</h1>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '2px' }}>{personal.profession}</div>
            </div>
            {personal.photo && (
              <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', border: `3px solid ${themeColor}` }}>
                <img src={personal.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
              </div>
            )}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px 20px', marginTop: '20px', fontSize: '13px', color: '#475569' }}>
            {personal.email && <div>✉ {personal.email}</div>}
            {personal.phone && <div>📱 {personal.phone}</div>}
            {(personal.city || personal.country) && <div>📍 {personal.city}, {personal.country}</div>}
            {personal.linkedin && <div>🔗 LinkedIn</div>}
          </div>
        </header>
      </SectionWrapper>

      {summary && (
        <SectionWrapper sectionId="summary" onSectionClick={onSectionClick} isInteractive={isInteractive}>
          <section style={{ marginBottom: '35px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: themeColor, textTransform: 'uppercase', borderLeft: `4px solid ${themeColor}`, paddingLeft: '12px', marginBottom: '15px' }}>Executive Summary</h2>
            <div style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }} dangerouslySetInnerHTML={{ __html: summary }} />
          </section>
        </SectionWrapper>
      )}

      {experience && experience.length > 0 && (
        <SectionWrapper sectionId="experience" onSectionClick={onSectionClick} isInteractive={isInteractive}>
          <section style={{ marginBottom: '35px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: themeColor, textTransform: 'uppercase', borderLeft: `4px solid ${themeColor}`, paddingLeft: '12px', marginBottom: '20px' }}>Professional Experience</h2>
            {experience.map((job, i) => (
              <div key={i} style={{ marginBottom: '25px', paddingLeft: '16px' }}>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>{job.title}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: themeColor, fontWeight: '700', fontSize: '14px', margin: '4px 0 10px 0' }}>
                  <span>{job.company}</span>
                  <span>{job.date}</span>
                </div>
                <div style={{ fontSize: '14px', color: '#475569' }} dangerouslySetInnerHTML={{ __html: job.description }} />
              </div>
            ))}
          </section>
        </SectionWrapper>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px' }}>
        <div>
          <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive}>
            <section style={{ marginBottom: '30px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '800', color: themeColor, textTransform: 'uppercase', borderLeft: `4px solid ${themeColor}`, paddingLeft: '12px', marginBottom: '15px' }}>Core Skills</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingLeft: '16px' }}>
                {skills.map((s, i) => (
                  <span key={i} style={{ background: '#fff7ed', color: '#ea580c', border: '1px solid #fed7aa', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                    {typeof s === 'object' ? s.name : s}
                  </span>
                ))}
              </div>
            </section>
          </SectionWrapper>

          {education && education.length > 0 && (
            <SectionWrapper sectionId="education" onSectionClick={onSectionClick} isInteractive={isInteractive}>
              <section style={{ marginBottom: '30px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '800', color: themeColor, textTransform: 'uppercase', borderLeft: `4px solid ${themeColor}`, paddingLeft: '12px', marginBottom: '15px' }}>Education</h2>
                {education.map((e, i) => (
                  <div key={i} style={{ marginBottom: '15px', paddingLeft: '16px' }}>
                    <div style={{ fontWeight: '700', fontSize: '14px', color: '#1e293b' }}>{e.degree}</div>
                    <div style={{ color: themeColor, fontWeight: '600', fontSize: '13px' }}>{e.year}</div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>{e.institution}</div>
                  </div>
                ))}
              </section>
            </SectionWrapper>
          )}
        </div>

        <div>
          {selectedExtraSections.languages && languages?.length > 0 && (
            <SectionWrapper sectionId="languages" onSectionClick={onSectionClick} isInteractive={isInteractive}>
              <section style={{ marginBottom: '30px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '800', color: themeColor, textTransform: 'uppercase', borderLeft: `4px solid ${themeColor}`, paddingLeft: '12px', marginBottom: '15px' }}>Languages</h2>
                <div style={{ paddingLeft: '16px' }}>
                  {languages.map((l, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '4px' }}>
                      <span style={{ fontWeight: '600', color: '#334155' }}>{typeof l === 'object' ? l.name : l}</span>
                      <span style={{ color: themeColor, fontWeight: '700' }}>{['', 'Beg', 'Int', 'Adv', 'Fluent', 'Native'][l.level || 0]}</span>
                    </div>
                  ))}
                </div>
              </section>
            </SectionWrapper>
          )}

          {selectedExtraSections.certifications && certifications?.length > 0 && (
            <SectionWrapper sectionId="certifications" onSectionClick={onSectionClick} isInteractive={isInteractive}>
              <section style={{ marginBottom: '30px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '800', color: themeColor, textTransform: 'uppercase', borderLeft: `4px solid ${themeColor}`, paddingLeft: '12px', marginBottom: '15px' }}>Certifications</h2>
                <div style={{ paddingLeft: '16px' }}>
                  {certifications.map((c, i) => (
                    <div key={i} style={{ fontSize: '13px', color: '#475569', marginBottom: '6px' }}>• {typeof c === 'object' ? c.name : c}</div>
                  ))}
                </div>
              </section>
            </SectionWrapper>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeTemplate6;