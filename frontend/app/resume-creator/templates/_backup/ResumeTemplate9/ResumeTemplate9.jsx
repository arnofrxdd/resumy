import React from 'react';
import './ResumeTemplate9.css';
import SectionWrapper from '../../components/SectionWrapper';

const ResumeTemplate9 = ({ data, highlightSection, onSectionClick }) => {
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
    themeColor = "#5C03BC"
  } = data;

  const isInteractive = !!onSectionClick;

  return (
    <div className="t9-body" style={{ background: '#f1f5f9', padding: '40px', boxSizing: 'border-box', minHeight: '100%', fontFamily: "var(--theme-font)" }}>
      <div style={{ background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}>
        <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive}>
          <header style={{ background: themeColor, color: '#fff', padding: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: '900', margin: 0, textTransform: 'uppercase' }}>{personal.name}</h1>
              <div style={{ fontSize: '16px', fontWeight: '600', opacity: 0.9, marginTop: '5px', letterSpacing: '1px' }}>{personal.profession}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginTop: '20px', fontSize: '12px' }}>
                {personal.email && <span>✉ {personal.email}</span>}
                {personal.phone && <span>📱 {personal.phone}</span>}
                {(personal.city || personal.country) && <span>📍 {personal.city}, {personal.country}</span>}
              </div>
            </div>
            {personal.photo && (
              <div style={{ width: '100px', height: '100px', borderRadius: '12px', border: '3px solid rgba(255,255,255,0.3)', overflow: 'hidden' }}>
                <img src={personal.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
              </div>
            )}
          </header>
        </SectionWrapper>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', padding: '40px' }}>
          <div>
            {summary && (
              <SectionWrapper sectionId="summary" onSectionClick={onSectionClick} isInteractive={isInteractive}>
                <section style={{ marginBottom: '35px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: themeColor, textTransform: 'uppercase', marginBottom: '15px' }}>Profile</h3>
                  <div style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }} dangerouslySetInnerHTML={{ __html: summary }} />
                </section>
              </SectionWrapper>
            )}

            {experience && experience.length > 0 && (
              <SectionWrapper sectionId="experience" onSectionClick={onSectionClick} isInteractive={isInteractive}>
                <section>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: themeColor, textTransform: 'uppercase', marginBottom: '20px' }}>Experience</h3>
                  {experience.map((job, i) => (
                    <div key={i} style={{ marginBottom: '25px', position: 'relative', paddingLeft: '20px', borderLeft: `2px solid ${themeColor}22` }}>
                      <div style={{ position: 'absolute', left: '-6px', top: '5px', width: '10px', height: '10px', borderRadius: '50%', background: themeColor }}></div>
                      <div style={{ fontWeight: '800', fontSize: '15px', color: '#1e293b' }}>{job.title}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', margin: '2px 0 8px 0' }}>
                        <span style={{ fontWeight: '700', color: themeColor }}>{job.company}</span>
                        <span style={{ color: '#64748b' }}>{job.date}</span>
                      </div>
                      <div style={{ fontSize: '14px', color: '#475569' }} dangerouslySetInnerHTML={{ __html: job.description }} />
                    </div>
                  ))}
                </section>
              </SectionWrapper>
            )}
          </div>

          <div>
            <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive}>
              <section style={{ marginBottom: '35px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: themeColor, textTransform: 'uppercase', marginBottom: '15px' }}>Expertise</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {skills.map((s, i) => (
                    <span key={i} style={{ padding: '5px 12px', background: `${themeColor}11`, color: themeColor, borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>
                      {typeof s === 'object' ? s.name : s}
                    </span>
                  ))}
                </div>
              </section>
            </SectionWrapper>

            {education && education.length > 0 && (
              <SectionWrapper sectionId="education" onSectionClick={onSectionClick} isInteractive={isInteractive}>
                <section style={{ marginBottom: '35px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: themeColor, textTransform: 'uppercase', marginBottom: '15px' }}>Education</h3>
                  {education.map((e, i) => (
                    <div key={i} style={{ marginBottom: '20px' }}>
                      <div style={{ fontWeight: '800', fontSize: '14px', color: '#1e293b' }}>{e.degree}</div>
                      <div style={{ color: themeColor, fontWeight: '700', fontSize: '13px', margin: '2px 0' }}>{e.year}</div>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>{e.institution}</div>
                    </div>
                  ))}
                </section>
              </SectionWrapper>
            )}

            {selectedExtraSections.languages && languages?.length > 0 && (
              <SectionWrapper sectionId="languages" onSectionClick={onSectionClick} isInteractive={isInteractive}>
                <section>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: themeColor, textTransform: 'uppercase', marginBottom: '15px' }}>Languages</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                    {languages.map((l, i) => (
                      <div key={i}>
                        <div style={{ fontWeight: '700', fontSize: '13px', color: '#1e293b' }}>{typeof l === 'object' ? l.name : l}</div>
                        <div style={{ color: '#64748b', fontSize: '12px' }}>{['', 'Beginner', 'Intermediate', 'Advanced', 'Fluent', 'Native'][l.level || 0]}</div>
                      </div>
                    ))}
                  </div>
                </section>
              </SectionWrapper>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeTemplate9;