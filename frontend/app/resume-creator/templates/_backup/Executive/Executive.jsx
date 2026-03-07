import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";
import "./executive.css";
import SectionWrapper from "../../components/SectionWrapper";
import { SectionTitle, ExperienceItem, EducationItem, ExtraSection } from "../common/BaseComponents";

const SidebarTitle = ({ title }) => (
  <h3 style={{
    fontSize: "12px",
    fontWeight: "800",
    color: "#1e293b",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "15px",
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: "5px"
  }}>
    {title}
  </h3>
);

export default function Executive({ data, onSectionClick }) {
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
    <div className="executive-resume" style={{ padding: "50px", boxSizing: "border-box", background: "#fff", fontFamily: "var(--theme-font)" }}>
      {/* HEADER */}
      <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive}>
        <header style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "900", margin: "0 0 5px 0", textTransform: "uppercase", color: "#0f172a" }}>{personal.name}</h1>
          <p style={{ fontSize: "16px", color: "var(--theme-color)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "2px", margin: 0 }}>{personal.profession}</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "15px", fontSize: "13px", color: "#475569" }}>
            {personal.email && <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><Mail size={12} /> {personal.email}</div>}
            {personal.phone && <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><Phone size={12} /> {personal.phone}</div>}
            {(personal.city || personal.country) && <div style={{ display: "flex", alignItems: "center", gap: "6px" }}><MapPin size={12} /> {personal.city}, {personal.country}</div>}
          </div>
        </header>
      </SectionWrapper>

      <div style={{ display: "flex", gap: "50px" }}>
        {/* MAIN */}
        <div style={{ flex: 2 }}>
          {summary && (
            <SectionWrapper sectionId="summary" onSectionClick={onSectionClick} isInteractive={isInteractive}>
              <section style={{ marginBottom: "35px" }}>
                <SectionTitle title="Executive Profile" />
                <div style={{ fontSize: "14px", lineHeight: "1.7", color: "#334155" }} dangerouslySetInnerHTML={{ __html: summary }} />
              </section>
            </SectionWrapper>
          )}

          {experience && experience.length > 0 && (
            <SectionWrapper sectionId="experience" onSectionClick={onSectionClick} isInteractive={isInteractive}>
              <section style={{ marginBottom: "35px" }}>
                <SectionTitle title="Professional Experience" />
                {experience.map((job, i) => (
                  <ExperienceItem key={i} item={job} />
                ))}
              </section>
            </SectionWrapper>
          )}

          <ExtraSection id="projects" title="Key Projects" data={data} onSectionClick={onSectionClick}>
            {projects.map((p, i) => (
              <div key={i} style={{ marginBottom: "15px" }}>
                <div style={{ fontWeight: "700", color: "#0f172a", fontSize: "14px" }}>{p.name}</div>
                <div style={{ fontSize: "13px", color: "#475569" }}>{p.description}</div>
              </div>
            ))}
          </ExtraSection>
        </div>

        {/* SIDEBAR */}
        <div style={{ flex: 1 }}>
          {education && education.length > 0 && (
            <SectionWrapper sectionId="education" onSectionClick={onSectionClick} isInteractive={isInteractive}>
              <section style={{ marginBottom: "35px" }}>
                <SidebarTitle title="Education" />
                {education.map((edu, i) => (
                  <EducationItem key={i} item={edu} />
                ))}
              </section>
            </SectionWrapper>
          )}

          {skills && skills.length > 0 && (
            <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive}>
              <section style={{ marginBottom: "35px" }}>
                <SidebarTitle title="Top Skills" />
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {skills.map((skill, i) => (
                    <span key={i} style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      background: "#f1f5f9",
                      color: "#475569",
                      padding: "4px 10px",
                      borderRadius: "4px",
                      textTransform: "uppercase"
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            </SectionWrapper>
          )}

          <ExtraSection id="languages" title="Languages" data={data} onSectionClick={onSectionClick}>
            {languages.map((l, i) => (
              <div key={i} style={{ marginBottom: "8px", fontSize: "13px" }}>
                <div style={{ fontWeight: "700", color: "#1e293b" }}>{l.name}</div>
                <div style={{ color: "#64748b", fontSize: "11px" }}>{["", "Elementary", "Limited", "Professional", "Full Professional", "Native"][l.level || 0]}</div>
              </div>
            ))}
          </ExtraSection>

          <ExtraSection id="certifications" title="Certifications" data={data} onSectionClick={onSectionClick}>
            {certifications.map((c, i) => (
              <div key={i} style={{ marginBottom: "8px", fontSize: "12px", color: "#475569" }}>• {c}</div>
            ))}
          </ExtraSection>
        </div>
      </div>
    </div>
  );
}