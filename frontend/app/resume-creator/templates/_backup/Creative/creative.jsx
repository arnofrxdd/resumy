import React from "react";
import { MapPin, Phone, Mail, Linkedin, Github, Globe } from "lucide-react";
import "./creative.css";
import SectionWrapper from "../../components/SectionWrapper";
import { SectionTitle, ExperienceItem, EducationItem, ExtraSection } from "../common/BaseComponents";

export default function Creative({ data, onSectionClick }) {
  if (!data) return null;

  const {
    personal = {},
    skills = [],
    experience = [],
    education = [],
    summary,
    projects = [],
    languages = [],
    certifications = [],
    software = [],
    selectedExtraSections = {}
  } = data;

  const isInteractive = !!onSectionClick;

  return (
    <div className="creative-resume" style={{ fontFamily: "var(--theme-font)", color: "#333", width: "100%", background: '#fff' }}>
      {/* HEADER BANNER */}
      <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive}>
        <header style={{ background: "var(--theme-color, #6c63ff)", padding: "40px", color: "white", display: "flex", alignItems: "center", gap: "30px", borderBottomRightRadius: "60px" }}>
          {personal.photo && (
            <img
              src={personal.photo}
              alt={personal.name}
              style={{ width: "140px", height: "140px", borderRadius: "50%", objectFit: "cover", border: "5px solid rgba(255,255,255,0.3)", boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
            />
          )}
          <div>
            <h1 style={{ margin: 0, fontSize: "40px", fontWeight: "800", textTransform: "uppercase", lineHeight: 1 }}>{personal.name}</h1>
            <h2 style={{ margin: "5px 0 0 0", fontSize: "18px", opacity: 0.9, fontWeight: "500", letterSpacing: '1px' }}>{personal.profession}</h2>
          </div>
        </header>
      </SectionWrapper>

      <div style={{ display: "flex", padding: "40px", gap: "40px" }}>
        {/* MAIN COLUMN */}
        <div style={{ flex: 2 }}>
          {summary && (
            <SectionWrapper sectionId="summary" onSectionClick={onSectionClick} isInteractive={isInteractive}>
              <section>
                <SectionTitle title="Profile" style={{ color: "var(--theme-color, #6c63ff)" }} />
                <p style={{ lineHeight: "1.7", color: "#475569", fontSize: "14px" }}>{summary}</p>
              </section>
            </SectionWrapper>
          )}

          {experience && experience.length > 0 && (
            <SectionWrapper sectionId="experience" onSectionClick={onSectionClick} isInteractive={isInteractive}>
              <section>
                <SectionTitle title="Experience" style={{ color: "var(--theme-color, #6c63ff)" }} />
                {experience.map((job, i) => (
                  <ExperienceItem key={i} item={job} />
                ))}
              </section>
            </SectionWrapper>
          )}

          <ExtraSection id="projects" title="Projects" data={data} onSectionClick={onSectionClick} style={{ color: "var(--theme-color, #6c63ff)" }}>
            {projects.map((p, i) => (
              <div key={i} style={{ marginBottom: "20px" }}>
                <div style={{ fontWeight: 700, fontSize: "15px" }}>{p.name || p.title}</div>
                {p.link && <div style={{ fontSize: "12px", color: "var(--theme-color, #6c63ff)", marginBottom: "4px" }}>{p.link}</div>}
                <div style={{ fontSize: "14px", color: "#475569", lineHeight: "1.5" }} dangerouslySetInnerHTML={{ __html: p.description }} />
              </div>
            ))}
          </ExtraSection>
        </div>

        {/* SIDEBAR */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: "30px" }}>
          {/* Contact */}
          <div style={{ background: "#f8fafc", padding: "20px", borderRadius: "15px", border: '1px solid #f1f5f9' }}>
            <h3 style={{ marginTop: 0, fontSize: "14px", textTransform: "uppercase", color: "#1e293b", borderBottom: "2px solid var(--theme-color, #6c63ff)", display: 'inline-block', marginBottom: "15px", fontWeight: '800' }}>Contact</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px", color: "#475569" }}>
              {personal.email && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Mail size={14} color="var(--theme-color, #6c63ff)" /> {personal.email}</div>}
              {personal.phone && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Phone size={14} color="var(--theme-color, #6c63ff)" /> {personal.phone}</div>}
              {(personal.city || personal.country) && <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><MapPin size={14} color="var(--theme-color, #6c63ff)" /> {personal.city}, {personal.country}</div>}
              <div style={{ marginTop: 5, display: 'flex', gap: 12 }}>
                {personal.linkedin && <Linkedin size={16} color="var(--theme-color, #6c63ff)" />}
                {personal.github && <Github size={16} color="var(--theme-color, #6c63ff)" />}
                {personal.website && <Globe size={16} color="var(--theme-color, #6c63ff)" />}
              </div>
            </div>
          </div>

          {/* Education */}
          {education && education.length > 0 && (
            <SectionWrapper sectionId="education" onSectionClick={onSectionClick} isInteractive={isInteractive}>
              <div>
                <h3 style={{ fontSize: "14px", textTransform: "uppercase", borderBottom: "2px solid #f1f5f9", paddingBottom: "5px", marginBottom: "15px", fontWeight: '800' }}>Education</h3>
                {education.map((e, i) => (
                  <EducationItem key={i} item={e} />
                ))}
              </div>
            </SectionWrapper>
          )}

          <ExtraSection id="languages" title="Languages" data={data} onSectionClick={onSectionClick}>
            {languages.map((l, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: 6 }}>
                <span style={{ fontWeight: '600' }}>{typeof l === 'object' ? l.name : l}</span>
                <span style={{ color: '#64748b' }}>{['', 'Beg', 'Int', 'Adv', 'Fluent', 'Native'][l.level || 0]}</span>
              </div>
            ))}
          </ExtraSection>

          <ExtraSection id="software" title="Software" data={data} onSectionClick={onSectionClick}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {software.map((s, i) => (
                <span key={i} style={{ background: '#f1f5f9', padding: "4px 10px", borderRadius: "5px", fontSize: "11px", fontWeight: "700" }}>{typeof s === 'object' ? s.name : s}</span>
              ))}
            </div>
          </ExtraSection>
        </div>
      </div>
    </div>
  );
}