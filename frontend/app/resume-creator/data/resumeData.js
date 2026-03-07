const resumeData = {
  // Primary accent color for the resume (hex code)
  themeColor: undefined,

  // Personal / Contact Information
  personal: {
    name: "FULL NAME",
    profession: "CURRENT ROLE / TITLE",
    email: "PROFESSIONAL EMAIL ADDRESS",
    phone: "PHONE NUMBER WITH COUNTRY CODE",
    linkedin: "LINKEDIN PROFILE URL",
    github: "GITHUB PROFILE URL (optional)",
    city: "CURRENT CITY",
    country: "COUNTRY",
    pincode: "POSTAL / ZIP CODE (optional)",
    website: "PORTFOLIO / PERSONAL WEBSITE (optional)",
  },

  // Professional summary shown at the top of the resume
  summary:
    "2–4 line summary highlighting your experience, key skills, and career focus. Keep it concise and impact-driven.",

  // Core skills relevant to the role
  skills: [
    "SKILL 1",
    "SKILL 2",
    "SKILL 3",
    "SKILL 4",
    "SKILL 5",
  ],

  // Work experience section
  experience: [
    {
      role: "JOB TITLE 1",
      company: "COMPANY NAME",
      duration: "MM/YYYY - MM/YYYY or Present",
      location: "CITY or Remote",
      bullets: [
        "Key responsibility or achievement (use action verbs).",
        "Quantify impact where possible (e.g., improved performance by 30%).",
        "Tools, technologies, or methods used."
      ]
    },
    {
      role: "JOB TITLE 2",
      company: "COMPANY NAME",
      duration: "MM/YYYY - MM/YYYY or Present",
      location: "CITY or Remote",
      bullets: [
        "Key responsibility or achievement (use action verbs).",
        "Quantify impact where possible (e.g., improved performance by 30%).",
        "Tools, technologies, or methods used."
      ]
    },
    {
      role: "JOB TITLE 3",
      company: "COMPANY NAME",
      duration: "MM/YYYY - MM/YYYY or Present",
      location: "CITY or Remote",
      bullets: [
        "Key responsibility or achievement (use action verbs).",
        "Quantify impact where possible (e.g., improved performance by 30%).",
        "Tools, technologies, or methods used."
      ]
    }
    // Add more roles if needed
  ],

  // Personal / Side Projects
  projects: [
    {
      title: "PROJECT NAME 1",
      description:
        "1–2 line overview explaining what the project does and the problem it solves.",
      technologies: [
        "TECH 1",
        "TECH 2",
        "TECH 3"
      ],
      link: "LIVE DEMO OR GITHUB REPOSITORY URL (optional)"
    },
    {
      title: "PROJECT NAME 2",
      description:
        "1–2 line overview explaining what the project does and the problem it solves.",
      technologies: [
        "TECH 1",
        "TECH 2",
        "TECH 3"
      ],
      link: "LIVE DEMO OR GITHUB REPOSITORY URL (optional)"
    }
    // Add more projects if needed
  ],

  // Key achievements or awards
  achievements: [
    "Achievement or recognition with measurable impact (e.g., Awarded Employee of the Month among 50+ team members).",
    "Competition win, certification, publication, or notable milestone.",
    "Any standout accomplishment that strengthens your profile."
  ],

  // Education details
  education: [
    {
      institution: "UNIVERSITY / COLLEGE NAME",
      degree: "DEGREE & MAJOR (e.g., B.Tech in Computer Science)",
      year: "MM/YYYY - MM/YYYY",
      location: "CITY / COUNTRY",
      Grade: "CGPA/Percentage"
    }
  ],

  // Optional sections
  languages: [
    "LANGUAGE 1 (e.g., English)"
  ],

  interests: [
    "INTEREST / HOBBY 1",
    "INTEREST / HOBBY 2"
  ]
};

export default resumeData;
