import React from 'react';
import './ResumeTemplate4.css';
import SectionWrapper from '../../components/SectionWrapper';
import { SectionTitle, ExperienceItem, EducationItem, ExtraSection } from '../common/BaseComponents';

const ResumeTemplate4 = ({ data, onSectionClick }) => {
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
    selectedExtraSections = {}
  } = data;

  const isInteractive = !!onSectionClick;

  return (
    <div className="resume-body" style={{ padding: '40px', boxSizing: 'border-box', background: '#fff', fontFamily: "var(--theme-font)" }}>
      <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive}>
        <header style={{ borderBottom: "4px solid var(--theme-color, #5dade2)", paddingBottom: '20px', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '900', margin: '0 0 5px 0', textTransform: 'uppercase', color: '#1e293b' }}>{personal.name}</h1>
          <div style={{ fontSize: '18px', fontWeight: '600', color: "var(--theme-color, #5dade2)", textTransform: 'uppercase', letterSpacing: '1px' }}>{personal.profession}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '15px', fontSize: '13px', color: '#64748b' }}>
            {personal.email && <div>{personal.email}</div>}
            {personal.phone && <div>{personal.phone}</div>}
            {(personal.city || personal.country) && <div>{personal.city}, {personal.country}</div>}
          </div>
        </header>
      </SectionWrapper>

      <div style={{ display: 'flex', gap: '40px' }}>
        <div style={{ flex: 2 }}>
          {summary && (
            <SectionWrapper sectionId="summary" onSectionClick={onSectionClick} isInteractive={isInteractive}>
              <section style={{ marginBottom: '30px' }}>
                <SectionTitle title="Profile" />
                <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#334155' }} dangerouslySetInnerHTML={{ __html: summary }} />
              </section>
            </SectionWrapper>
          )}

          {experience && experience.length > 0 && (
            <SectionWrapper sectionId="experience" onSectionClick={onSectionClick} isInteractive={isInteractive}>
              <section style={{ marginBottom: '30px' }}>
                <SectionTitle title="Experience" />
                {experience.map((job, i) => (
                  <ExperienceItem key={i} item={job} />
                ))}
              </section>
            </SectionWrapper>
          )}

          <ExtraSection id="projects" title="Projects" data={data} onSectionClick={onSectionClick}>
            {projects.map((p, i) => (
              <div key={i} style={{ marginBottom: '15px' }}>
                <div style={{ fontWeight: '700', fontSize: '15px' }}>{p.name || p.title}</div>
                <div style={{ fontSize: '14px', color: '#475569' }} dangerouslySetInnerHTML={{ __html: p.description }} />
              </div>
            ))}
          </ExtraSection>
        </div>

        <div style={{ flex: 1 }}>
          <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive}>
            <section style={{ marginBottom: '30px' }}>
              <SectionTitle title="Skills" style={{ fontSize: '16px' }} />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {skills.map((s, i) => (
                  <span key={i} style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                    {typeof s === 'object' ? s.name : s}
                  </span>
                ))}
              </div>
            </section>
          </SectionWrapper>

          {education && education.length > 0 && (
            <SectionWrapper sectionId="education" onSectionClick={onSectionClick} isInteractive={isInteractive}>
              <section style={{ marginBottom: '30px' }}>
                <SectionTitle title="Education" style={{ fontSize: '16px' }} />
                {education.map((e, i) => (
                  <EducationItem key={i} item={e} />
                ))}
              </section>
            </SectionWrapper>
          )}

          <ExtraSection id="languages" title="Languages" data={data} onSectionClick={onSectionClick}>
            {languages.map((l, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}>
                <span style={{ fontWeight: '600' }}>{typeof l === 'object' ? l.name : l}</span>
                <span style={{ color: '#64748b' }}>{['', 'Beg', 'Int', 'Adv', 'Fluent', 'Native'][l.level || 0]}</span>
              </div>
            ))}
          </ExtraSection>
        </div>
      </div>
    </div>
  );
};

export default ResumeTemplate4;