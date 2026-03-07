import React from "react";
import { MapPin, Phone, Mail, Linkedin } from "lucide-react";
import SectionWrapper from "../../components/SectionWrapper";
import { SectionTitle, ExperienceItem, EducationItem, ExtraSection } from "../common/BaseComponents";

const SidebarSectionHeader = ({ title }) => (
  <div
    style={{
      background: "var(--theme-color, #0f172a)",
      padding: "8px 15px",
      margin: "0 -20px 15px -20px",
      display: "flex",
      alignItems: "center"
    }}
  >
    <h3
      style={{
        fontSize: "13px",
        fontWeight: "700",
        letterSpacing: "1.5px",
        textTransform: "uppercase",
        color: "#ffffff",
        margin: 0
      }}
    >
      {title}
    </h3>
  </div>
);

const ModernSidebar = ({ data, onSectionClick }) => {
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
    interests = [],
    selectedExtraSections = {}
  } = data;

  const renderSkillWithRating = (skill, index) => {
    const name = typeof skill === 'object' ? skill.name : skill;
    const level = typeof skill === 'object' ? skill.level : 3;

    return (
      <div key={index} style={{ marginBottom: "10px" }}>
        <div style={{ fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
          {name}
        </div>
        {level > 0 && (
          <div style={{ display: "flex", gap: "4px" }}>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: i < level ? "var(--theme-color, #3b82f6)" : "rgba(255,255,255,0.2)",
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const isInteractive = !!onSectionClick;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100%",
        width: "100%",
        fontFamily: "var(--theme-font)",
        background: "white",
      }}
    >
      {/* --- SIDEBAR --- */}
      <div
        style={{
          width: "32%",
          background: "#1e293b",
          color: "white",
          padding: "30px 20px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: "25px",
        }}
      >
        <SectionWrapper sectionId="personal" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Header">
          {/* Photo */}
          {personal?.photo && (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
              <img
                src={personal.photo}
                alt={personal.name || "Profile"}
                style={{
                  width: "140px",
                  height: "140px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "4px solid rgba(255,255,255,0.1)",
                }}
              />
            </div>
          )}

          {/* Name & Profession in Sidebar */}
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: "800", margin: "0 0 8px 0", color: "#ffffff", textTransform: "uppercase", lineHeight: 1.2 }}>
              {personal?.name}
            </h1>
            <div style={{ fontSize: "14px", color: "var(--theme-color, #3b82f6)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>
              {personal?.profession}
            </div>
          </div>

          {/* Contact */}
          <div>
            <SidebarSectionHeader title="Contact" />
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13px" }}>
              {personal?.email && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Mail size={14} color="var(--theme-color, #3b82f6)" /> <span style={{ wordBreak: 'break-all' }}>{personal.email}</span>
                </div>
              )}
              {personal?.phone && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Phone size={14} color="var(--theme-color, #3b82f6)" /> <span>{personal.phone}</span>
                </div>
              )}
              {(personal?.city || personal?.country || personal?.pincode) && (
                <div style={{ display: "flex", alignItems: "start", gap: "10px" }}>
                  <MapPin size={14} color="var(--theme-color, #3b82f6)" />{" "}
                  <span>
                    {[personal.city, personal.country, personal.pincode]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </div>
              )}
              {personal?.linkedin && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <Linkedin size={14} color="var(--theme-color, #3b82f6)" />
                  <span>{personal.linkedin.replace(/^https?:\/\//, "")}</span>
                </div>
              )}
            </div>
          </div>
        </SectionWrapper>

        {/* Skills */}
        <SectionWrapper sectionId="skills" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Skills">
          {(skills?.length > 0) && (
            <div style={{ marginTop: "10px" }}>
              <SidebarSectionHeader title="Skills" />
              <div style={{ display: "flex", flexDirection: "column" }}>
                {skills.map((skill, index) => renderSkillWithRating(skill, index))}
              </div>
            </div>
          )}
        </SectionWrapper>

        {/* --- EXTRA SIDEBAR SECTIONS --- */}
        <ExtraSection id="languages" title="Languages" data={data} onSectionClick={onSectionClick}>
          {languages.map((lang, idx) => {
            const name = typeof lang === 'object' ? lang.name : lang;
            const level = typeof lang === 'object' ? lang.level : 5;
            return (
              <div key={idx} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{name}</span>
                  <div style={{ display: 'flex', gap: 2 }}>
                    {[...Array(5)].map((_, i) => (
                      <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: i < level ? 'var(--theme-color, #3b82f6)' : 'rgba(255,255,255,0.2)' }} />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </ExtraSection>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div style={{ flex: 1, padding: "40px", color: "#334155", boxSizing: "border-box" }}>
        {summary && (
          <SectionWrapper sectionId="summary" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Summary">
            <div style={{ marginBottom: "35px" }}>
              <SectionTitle title="Profile" />
              <div
                style={{ fontSize: "14px", lineHeight: "1.7", color: "#475569" }}
                dangerouslySetInnerHTML={{ __html: summary }}
              />
            </div>
          </SectionWrapper>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <SectionWrapper sectionId="experience" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Experience">
            <div style={{ marginBottom: "35px" }}>
              <SectionTitle title="Work History" />
              {experience.map((exp, index) => (
                <div key={index} style={{ marginBottom: "25px" }}>
                  <div style={{ display: "flex", gap: "20px" }}>
                    <div style={{ width: "120px", fontSize: "13px", color: "#64748b", fontWeight: "700", paddingTop: "2px" }}>
                      {exp.year || (exp.startYear && `${exp.startYear} - ${exp.endYear || 'Present'}`)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <ExperienceItem item={exp} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionWrapper>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <SectionWrapper sectionId="education" onSectionClick={onSectionClick} isInteractive={isInteractive} label="Education">
            <div style={{ marginBottom: 35 }}>
              <SectionTitle title="Education" />
              {education.map((edu, index) => (
                <div key={index} style={{ marginBottom: "25px" }}>
                  <div style={{ display: 'flex', gap: "20px" }}>
                    <div style={{ width: "120px", fontSize: "13px", color: "#64748b", fontWeight: "700", paddingTop: "2px" }}>
                      {edu.year || (edu.startYear && `${edu.startYear} - ${edu.endYear || 'Present'}`)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <EducationItem item={edu} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionWrapper>
        )}

        <ExtraSection id="projects" title="Projects" data={data} onSectionClick={onSectionClick}>
          {projects.map((p, i) => (
            <div key={i} style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: "800", fontSize: "16px", color: "#1e293b" }}>{p.name || p.title}</div>
              {p.link && <div style={{ color: "var(--theme-color, #3b82f6)", fontSize: 13, marginBottom: 5 }}>{p.link}</div>}
              <div style={{ fontSize: "14px", lineHeight: "1.6", color: "#475569" }} dangerouslySetInnerHTML={{ __html: p.description }} />
            </div>
          ))}
        </ExtraSection>

        <ExtraSection id="certifications" title="Certifications" data={data} onSectionClick={onSectionClick}>
          {certifications.map((c, i) => (
            <div key={i} style={{ fontSize: 14, marginBottom: 12, display: 'flex', gap: '10px' }}>
              <div style={{ fontWeight: "700", color: "#1e293b" }}>•</div>
              <div>
                {typeof c === 'object' ? (
                  <>
                    <div style={{ fontWeight: "700" }}>{c.name}</div>
                    {c.date && <div style={{ fontSize: 12, color: "#64748b" }}>{c.date}</div>}
                  </>
                ) : (
                  <div style={{ fontWeight: "600" }}>{c}</div>
                )}
              </div>
            </div>
          ))}
        </ExtraSection>

        <ExtraSection id="interests" title="Interests" data={data} onSectionClick={onSectionClick}>
          <p style={{ fontSize: 14, color: "#475569" }}>
            {interests.map(i => typeof i === 'object' ? i.name : i).join(", ")}
          </p>
        </ExtraSection>
      </div>
    </div>
  );
};

export default ModernSidebar;
