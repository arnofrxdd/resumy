import React from 'react';
import './ResumeTemplate7.css';
import { User, Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';
import SectionWrapper from '../../components/SectionWrapper';

const ResumeTemplate7 = ({ data, highlightSection, onSectionClick }) => {
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
    themeColor = "#B57EDC"
  } = data;

  const isInteractive = !!onSectionClick;

  return (
    <div className="template7-body" style={{ display: 'flex', background: '#fff', minHeight: '100%', fontFamily: "var(--theme-font)" }}>
      {/* SIDEBAR */}
      <div style={{ width: '280px', background: '#2d3748', color: '#fff', padding: '40px 30px', flexShrink: 0 }}>
        <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#fff', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {personal.photo ? <img src={personal.photo} style={{ width: '100%', minHeight: '100%', objectFit: 'cover' }} alt="" /> : <User size={50} color="#cbd5e1" />}
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>{personal.name}</h1>
            <div style={{ fontSize: '13px', fontWeight: '600', color: themeColor, textTransform: 'uppercase', letterSpacing: '2px' }}>{personal.profession}</div>
          </div>
        </SectionWrapper>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', fontSize: '12px', marginBottom: '40px' }}>
          {personal.email && <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Mail size={14} color={themeColor} /> {personal.email}</div>}
          {personal.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Phone size={14} color={themeColor} /> {personal.phone}</div>}
          {(personal.city || personal.country) && <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><MapPin size={14} color={themeColor} /> {personal.city}, {personal.country}</div>}
          {personal.linkedin && <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Linkedin size={14} color={themeColor} /> LinkedIn</div>}
        </div>

        <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive}>
          <section style={{ marginBottom: '35px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '800', borderBottom: `2px solid ${themeColor}`, paddingBottom: '5px', marginBottom: '15px' }}>SKILLS</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {skills.map((s, i) => (
                <div key={i} style={{ fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>{typeof s === 'object' ? s.name : s}</span>
                  </div>
                  <div style={{ height: '4px', background: '#4a5568', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${(s.level || 4) * 20}%`, height: '100%', background: themeColor }}></div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </SectionWrapper>

        {selectedExtraSections.languages && languages?.length > 0 && (
          <SectionWrapper sectionId="languages" onSectionClick={onSectionClick} isInteractive={isInteractive}>
            <section>
              <h3 style={{ fontSize: '14px', fontWeight: '800', borderBottom: `2px solid ${themeColor}`, paddingBottom: '5px', marginBottom: '15px' }}>LANGUAGES</h3>
              {languages.map((l, i) => (
                <div key={i} style={{ fontSize: '12px', marginBottom: '10px' }}>
                  <div style={{ fontWeight: '600' }}>{typeof l === 'object' ? l.name : l}</div>
                  <div style={{ color: '#a0aec0', fontSize: '11px' }}>{['', 'Beginner', 'Intermediate', 'Advanced', 'Fluent', 'Native'][l.level || 0]}</div>
                </div>
              ))}
            </section>
          </SectionWrapper>
        )}
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: '50px' }}>
        {summary && (
          <SectionWrapper sectionId="summary" onSectionClick={onSectionClick} isInteractive={isInteractive}>
            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1a202c', borderBottom: '2px solid #edf2f7', paddingBottom: '10px', marginBottom: '15px' }}>Profile</h2>
              <div style={{ fontSize: '14px', lineHeight: '1.7', color: '#4a5568' }} dangerouslySetInnerHTML={{ __html: summary }} />
            </section>
          </SectionWrapper>
        )}

        {experience && experience.length > 0 && (
          <SectionWrapper sectionId="experience" onSectionClick={onSectionClick} isInteractive={isInteractive}>
            <section style={{ marginBottom: '40px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1a202c', borderBottom: '2px solid #edf2f7', paddingBottom: '10px', marginBottom: '20px' }}>Experience</h2>
              {experience.map((job, i) => (
                <div key={i} style={{ marginBottom: '30px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '5px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: '#2d3748' }}>{job.title}</h4>
                    <span style={{ fontSize: '12px', color: themeColor, fontWeight: '700' }}>{job.date}</span>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: themeColor, marginBottom: '10px' }}>{job.company}</div>
                  <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#4a5568' }} dangerouslySetInnerHTML={{ __html: job.description }} />
                </div>
              ))}
            </section>
          </SectionWrapper>
        )}

        {education && education.length > 0 && (
          <SectionWrapper sectionId="education" onSectionClick={onSectionClick} isInteractive={isInteractive}>
            <section>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#1a202c', borderBottom: '2px solid #edf2f7', paddingBottom: '10px', marginBottom: '20px' }}>Education</h2>
              {education.map((e, i) => (
                <div key={i} style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: '700', margin: 0, color: '#2d3748' }}>{e.degree}</h4>
                    <span style={{ fontSize: '12px', color: '#718096' }}>{e.year}</span>
                  </div>
                  <div style={{ fontSize: '14px', color: '#4a5568' }}>{e.institution}</div>
                </div>
              ))}
            </section>
          </SectionWrapper>
        )}
      </div>
    </div>
  );
};

export default ResumeTemplate7;