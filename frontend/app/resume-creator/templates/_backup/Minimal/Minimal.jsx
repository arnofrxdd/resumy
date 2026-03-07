import React from "react";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import "./minimal.css";
import SectionWrapper from "../../components/SectionWrapper";
import { SectionTitle, ExperienceItem, EducationItem, ExtraSection } from "../common/BaseComponents";

export default function Minimal({ data, onSectionClick }) {
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
    selectedExtraSections = {}
  } = data;

  const isInteractive = !!onSectionClick;

  return (
    <div className="minimal-resume" style={{ padding: "40px", boxSizing: "border-box", background: "#fff", fontFamily: "var(--theme-font)" }}>
      {/* HEADER */}
      <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive}>
        <header style={{ marginBottom: "25px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "800", margin: "0 0 5px 0", color: "var(--theme-color, #001e3c)" }}>{personal.name}</h1>
          <div style={{ fontSize: "15px", fontWeight: "600", color: "var(--theme-color, #3b82f6)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "15px" }}>{personal.profession}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", fontSize: "12px", color: "#475569" }}>
            {personal.email && <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><Mail size={12} /> {personal.email}</div>}
            {personal.phone && <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><Phone size={12} /> {personal.phone}</div>}
            {(personal.city || personal.country) && <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><MapPin size={12} /> {personal.city}, {personal.country}</div>}
            {personal.website && <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><Globe size={12} /> {personal.website}</div>}
          </div>
        </header>
      </SectionWrapper>

      {/* Profile */}
      {summary && (
        <SectionWrapper sectionId="summary" onSectionClick={onSectionClick} isInteractive={isInteractive}>
          <section>
            <SectionTitle title="Profile" style={{ color: "var(--theme-color, #001e3c)", borderBottomColor: "#e2e8f0" }} />
            <div style={{ fontSize: "13px", lineHeight: "1.6", color: "#334155" }} dangerouslySetInnerHTML={{ __html: summary }} />
          </section>
        </SectionWrapper>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <SectionWrapper sectionId="experience" onSectionClick={onSectionClick} isInteractive={isInteractive}>
          <section>
            <SectionTitle title="Experience" style={{ color: "var(--theme-color, #001e3c)", borderBottomColor: "#e2e8f0" }} />
            {experience.map((job, i) => (
              <ExperienceItem key={i} item={job} />
            ))}
          </section>
        </SectionWrapper>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <SectionWrapper sectionId="education" onSectionClick={onSectionClick} isInteractive={isInteractive}>
          <section>
            <SectionTitle title="Education" style={{ color: "var(--theme-color, #001e3c)", borderBottomColor: "#e2e8f0" }} />
            {education.map((edu, i) => (
              <EducationItem key={i} item={edu} />
            ))}
          </section>
        </SectionWrapper>
      )}

      {/* Skills */}
      {skills?.length > 0 && (
        <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive}>
          <section>
            <SectionTitle title="Skills" style={{ color: "var(--theme-color, #001e3c)", borderBottomColor: "#e2e8f0" }} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {skills.map((s, i) => (
                <span key={i} style={{ fontSize: "12px", color: "#334155", fontWeight: "600", background: "#f8fafc", padding: "3px 8px", border: "1px solid #e2e8f0", borderRadius: "4px" }}>
                  {typeof s === "object" ? s.name : s}
                </span>
              ))}
            </div>
          </section>
        </SectionWrapper>
      )}

      <ExtraSection id="projects" title="Key Projects" data={data} onSectionClick={onSectionClick}>
        {projects.map((p, i) => (
          <div key={i} style={{ marginBottom: "15px" }}>
            <div style={{ fontWeight: "700", color: "#001e3c", fontSize: "14px" }}>{p.name || p.title}</div>
            <div style={{ fontSize: "13px", color: "#475569" }}>{p.description}</div>
          </div>
        ))}
      </ExtraSection>

      <ExtraSection id="languages" title="Languages" data={data} onSectionClick={onSectionClick}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
          {languages.map((l, i) => (
            <div key={i} style={{ fontSize: "12px" }}>
              <div style={{ fontWeight: "700" }}>{typeof l === "object" ? l.name : l}</div>
              <div style={{ color: "#64748b" }}>{["", "Beg", "Int", "Adv", "Flex", "Nat"][l.level || 0]}</div>
            </div>
          ))}
        </div>
      </ExtraSection>

      <ExtraSection id="certifications" title="Certifications" data={data} onSectionClick={onSectionClick}>
        {certifications.map((c, i) => (
          <div key={i} style={{ marginBottom: "8px", fontSize: "12px", color: "#475569" }}>• {c}</div>
        ))}
      </ExtraSection>
    </div>
  );
}