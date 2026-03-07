import React from "react";
import SectionWrapper from "../../components/SectionWrapper";
import { SectionTitle, ExperienceItem, EducationItem, ExtraSection } from "../common/BaseComponents";

const ClassicTemplate = ({ data, onSectionClick }) => {
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
    <div
      style={{
        padding: "60px 70px",
        fontFamily: "var(--theme-font)",
        color: "#1e293b",
        background: "white",
        boxSizing: "border-box",
        minHeight: "100%"
      }}
    >
      <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive}>
        <header style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "2px", margin: "0 0 5px 0", color: "var(--theme-color, #000)" }}>
            {personal.name}
          </h1>
          <div style={{ fontSize: "16px", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px" }}>
            {personal.profession}
          </div>
          <div style={{ fontSize: "12px", marginTop: "15px", color: "#475569", display: "flex", justifyContent: "center", gap: "20px" }}>
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>{personal.phone}</span>}
            {(personal.city || personal.country) && <span>{personal.city}, {personal.country}</span>}
          </div>
        </header>
      </SectionWrapper>

      {summary && (
        <SectionWrapper sectionId="summary" onSectionClick={onSectionClick} isInteractive={isInteractive}>
          <section>
            <SectionTitle title="Summary" style={{ borderBottomColor: "var(--theme-color, #000)", color: "var(--theme-color, #000)" }} />
            <div style={{ fontSize: "14px", lineHeight: "1.7", color: "#334155", textAlign: "justify" }} dangerouslySetInnerHTML={{ __html: summary }} />
          </section>
        </SectionWrapper>
      )}

      {experience && experience.length > 0 && (
        <SectionWrapper sectionId="experience" onSectionClick={onSectionClick} isInteractive={isInteractive}>
          <section>
            <SectionTitle title="Professional Experience" style={{ borderBottomColor: "var(--theme-color, #000)", color: "var(--theme-color, #000)" }} />
            {experience.map((job, i) => (
              <ExperienceItem key={i} item={job} />
            ))}
          </section>
        </SectionWrapper>
      )}

      <ExtraSection id="projects" title="Key Projects" data={data} onSectionClick={onSectionClick} style={{ color: "var(--theme-color, #000)" }}>
        {projects.map((p, i) => (
          <div key={i} style={{ marginBottom: "15px" }}>
            <div style={{ fontWeight: "800", fontSize: "14px", color: "#000" }}>{p.name || p.title}</div>
            <div style={{ fontSize: "14px", lineHeight: "1.5", color: "#475569" }} dangerouslySetInnerHTML={{ __html: p.description }} />
          </div>
        ))}
      </ExtraSection>

      {education && education.length > 0 && (
        <SectionWrapper sectionId="education" onSectionClick={onSectionClick} isInteractive={isInteractive}>
          <section>
            <SectionTitle title="Education" style={{ borderBottomColor: "var(--theme-color, #000)", color: "var(--theme-color, #000)" }} />
            {education.map((e, i) => (
              <EducationItem key={i} item={e} />
            ))}
          </section>
        </SectionWrapper>
      )}

      {skills?.length > 0 && (
        <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive}>
          <section>
            <SectionTitle title="Skills" style={{ borderBottomColor: "var(--theme-color, #000)", color: "var(--theme-color, #000)" }} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {skills.map((s, i) => (
                <span key={i} style={{ fontSize: "13px", fontWeight: "700", border: "1px solid #e2e8f0", padding: "4px 10px", borderRadius: "4px" }}>
                  {typeof s === "object" ? s.name : s}
                </span>
              ))}
            </div>
          </section>
        </SectionWrapper>
      )}

      <ExtraSection id="languages" title="Languages" data={data} onSectionClick={onSectionClick}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "15px" }}>
          {languages.map((l, i) => (
            <div key={i} style={{ fontSize: "13px" }}>
              <div style={{ fontWeight: "800", color: "#000" }}>{typeof l === "object" ? l.name : l}</div>
              <div style={{ color: "#64748b" }}>{["", "Beg", "Int", "Adv", "Flex", "Nat"][l.level || 0]}</div>
            </div>
          ))}
        </div>
      </ExtraSection>
    </div>
  );
};

export default ClassicTemplate;