import React from "react";
import { MapPin, Phone, Mail, Linkedin, Github, Globe } from "lucide-react";
import "./compact.css";
import SectionWrapper from "../../components/SectionWrapper";
import { SectionTitle, ExperienceItem, EducationItem, ExtraSection } from "../common/BaseComponents";

export default function Compact({ data, onSectionClick }) {
  if (!data) return null;

  const {
    personal = {},
    summary,
    experience = [],
    education = [],
    skills = [],
    projects = [],
    languages = [],
    certifications = [],
    software = [],
    selectedExtraSections = {}
  } = data;

  const isInteractive = !!onSectionClick;

  return (
    <div className="compact-resume" style={{ padding: '40px', boxSizing: 'border-box', fontFamily: "var(--theme-font)", background: 'white' }}>
      {/* HEADER */}
      <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive}>
        <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '3px solid var(--theme-color, #0f172a)', paddingBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '36px', fontWeight: '900', margin: '0 0 5px 0', textTransform: 'uppercase', color: 'var(--theme-color, #0f172a)', lineHeight: 1 }}>
              {personal?.name}
            </h1>
            <div style={{ fontSize: '16px', color: 'var(--theme-color, #3b82f6)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', filter: 'brightness(1.2)' }}>
              {personal?.profession}
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '13px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {personal?.email && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>{personal.email} <Mail size={12} color="var(--theme-color)" /></div>}
            {personal?.phone && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>{personal.phone} <Phone size={12} color="var(--theme-color)" /></div>}
            {(personal?.city || personal?.country) && <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>{[personal.city, personal.country].filter(Boolean).join(", ")} <MapPin size={12} color="var(--theme-color)" /></div>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '5px' }}>
              {personal?.linkedin && <Linkedin size={14} color="var(--theme-color)" />}
              {personal?.github && <Github size={14} color="var(--theme-color)" />}
              {personal?.website && <Globe size={14} color="var(--theme-color)" />}
            </div>
          </div>
        </header>
      </SectionWrapper>

      <div style={{ display: 'flex', gap: '40px' }}>
        {/* MAIN COLUMN */}
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
                <div style={{ fontWeight: '800', fontSize: '15px', color: '#0f172a' }}>{p.name || p.title}</div>
                {p.link && <div style={{ color: 'var(--theme-color, #3b82f6)', fontSize: '12px', marginBottom: '4px' }}>{p.link}</div>}
                <div style={{ fontSize: '14px', lineHeight: '1.5', color: '#475569' }} dangerouslySetInnerHTML={{ __html: p.description }} />
              </div>
            ))}
          </ExtraSection>
        </div>

        {/* SIDEBAR COLUMN */}
        <div style={{ flex: 1 }}>
          <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive}>
            <section style={{ marginBottom: '30px' }}>
              <SectionTitle title="Skills" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {skills?.map((s, i) => (
                  <div key={i} style={{ fontSize: '13px', fontWeight: '600', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '6px', height: '6px', background: 'var(--theme-color, #3b82f6)', borderRadius: '50%' }}></div>
                    {typeof s === 'object' ? s.name : s}
                  </div>
                ))}
              </div>
            </section>
          </SectionWrapper>

          {education && education.length > 0 && (
            <SectionWrapper sectionId="education" onSectionClick={onSectionClick} isInteractive={isInteractive}>
              <section style={{ marginBottom: '30px' }}>
                <SectionTitle title="Education" />
                {education.map((edu, i) => (
                  <EducationItem key={i} item={edu} />
                ))}
              </section>
            </SectionWrapper>
          )}

          <ExtraSection id="languages" title="Languages" data={data} onSectionClick={onSectionClick}>
            {languages.map((l, i) => (
              <div key={i} style={{ fontSize: '13px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: '600' }}>{typeof l === 'object' ? l.name : l}</span>
                <span style={{ color: '#64748b' }}>{["", 'Beginner', 'Int', 'Adv', 'Fluent', 'Native'][l.level || 0]}</span>
              </div>
            ))}
          </ExtraSection>

          <ExtraSection id="certifications" title="Certifications" data={data} onSectionClick={onSectionClick}>
            {certifications.map((c, i) => (
              <div key={i} style={{ fontSize: '13px', marginBottom: '8px', color: '#475569' }}>
                • {typeof c === 'object' ? c.name : c}
              </div>
            ))}
          </ExtraSection>

          <ExtraSection id="software" title="Software" data={data} onSectionClick={onSectionClick}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {software.map((s, i) => (
                <span key={i} style={{ background: '#f1f5f9', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', color: '#334155' }}>
                  {typeof s === 'object' ? s.name : s}
                </span>
              ))}
            </div>
          </ExtraSection>
        </div>
      </div>
    </div>
  );
}