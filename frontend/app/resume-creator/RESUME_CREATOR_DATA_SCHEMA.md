# Resume Creator Data Schema

This document outlines the data schema and field IDs for the sections of the Gaplytiq Resume Creator.

---
## 1. Core Header Fields (Step 1)
These fields are part of the primary `personal` object in the resume data and are found on the first step of the form.

| Field ID | Label | Data Type | Placeholder / Description |
| :--- | :--- | :--- | :--- |
| `personal.photo` | Profile Photo | Base64 String | Professional profile image |
| `personal.name` | First & Last Name | String | e.g. John Doe |
| `personal.profession` | Profession / Job Title | String | e.g. Sales Manager |
| `personal.city` | City | String | e.g. New York |
| `personal.country` | Country | String | e.g. USA |
| `personal.state` | State | String | e.g. NY |
| `personal.zipCode` | Zip Code | String | e.g. 10001 |
| `personal.phone` | Phone | String | e.g. +1 234 567 890 |
| `personal.email` | Email | String | e.g. john.doe@example.com |
| `personal.linkedin` | LinkedIn | String | URL or Username (Dynamic field) |
| `personal.github` | GitHub | String | URL or Username (Dynamic field) |
| `personal.website` | Website | String | Portfolio or Personal URL (Dynamic field) |

---

## 2. Personal Details (Extra Section)
Optional fields used to capture more specific personal information, usually found in a dedicated extra section.

| Field ID | Label | Data Type | Options / Placeholder |
| :--- | :--- | :--- | :--- |
| `personal.dob` | Date of Birth | String | DD/MM/YYYY |
| `personal.nationality` | Nationality | String | e.g. Indian |
| `personal.maritalStatus` | Marital Status | Enum/String | Single, Married, Divorced, etc. |
| `personal.visaStatus` | Visa Status | String | e.g. Full working capabilities |
| `personal.gender` | Gender | Enum/String | Male, Female, Non-binary, etc. |
| `personal.religion` | Religion | String | e.g. Christian |
| `personal.passport` | Passport Number | String | |
| `personal.otherPersonal` | Other Information | String | |

---

## 3. Websites & Portfolios (Step 7+ / Extra Section)
Independent section for multiple web links. These can optionally be highlighted in the header.

| Field ID | Key | Data Type | Description |
| :--- | :--- | :--- | :--- |
| `websites` | `url` | String | The actual link/URL |
| `websites` | `label` | String | Label for the link (e.g. Portfolio) |
| `websites` | `addToHeader` | Boolean | Whether to display this in the main header |

---

## 4. Education (Step 2)
Captures academic history. This section typically maps to an array of objects.

| Field ID | Label | Data Type | Placeholder / Description |
| :--- | :--- | :--- | :--- |
| `education[].school` | School Name | String | e.g. MIT |
| `education[].city` | School Location | String | e.g. Cambridge, MA |
| `education[].degree` | Degree | String | e.g. Bachelor of Science |
| `education[].field` | Field of Study | String | e.g. Computer Science |
| `education[].grade` | Percentage / GPA | String | e.g. 3.8 GPA |
| `education[].startMonth` | Start Month | String | e.g. September |
| `education[].startYear` | Start Year | String | e.g. 2018 |
| `education[].endMonth` | End Month | String | e.g. May |
| `education[].endYear` | End Year | String | e.g. 2022 |
| `education[].description` | Education Description | HTML String | Coursework, honors, etc. |

---

## 5. Work Experience (Step 3)
Tracks professional history. This maps to an array of objects.

| Field ID | Label | Data Type | Placeholder / Description |
| :--- | :--- | :--- | :--- |
| `experience[].title` | Job Title | String | e.g. Graphic Designer |
| `experience[].company` | Employer | String | e.g. Acme Corp |
| `experience[].location` | Location | String | e.g. New York, NY |
| `experience[].isRemote` | Remote Position | Boolean | Whether the role was remote |
| `experience[].startMonth` | Start Month | String | e.g. January |
| `experience[].startYear` | Start Year | String | e.g. 2020 |
| `experience[].isCurrent` | I currently work here | Boolean | |
| `experience[].endMonth` | End Month | String | e.g. Present (if current) |
| `experience[].endYear` | End Year | String | |
| `experience[].description` | Description | HTML String | Achievements and responsibilities |

---

## 6. Skills & Strengths (Step 4)
Captures technical and soft skills across different categories.

### 6.1 Main Skills
| Field ID | Label | Data Type | Description |
| :--- | :--- | :--- | :--- |
| `skills[]` | Skill Item | Array<Object> | Array of `{ name: string, level: number }` |
| `skills[].name` | Skill Name | String | Name of the skill |
| `skills[].level` | Skill Level | Number | Proficiency (1-5) |
| `skillsDescription` | Text Editor View | HTML String | HTML representation of the skills list |

### 6.2 Key Strengths & Additional Skills
| Field ID | Label | Data Type | Description |
| :--- | :--- | :--- | :--- |
| `strengths[]` | Key Strengths | Array<Object> | Array of `{ name: string, level: number }` |
| `additionalSkills[]` | Additional Skills | Array<Object> | Array of `{ name: string, level: number }` |

---

## 7. Professional Summary (Step 5)
Captures the elevator pitch or summary statement of the user.

| Field ID | Label | Data Type | Description |
| :--- | :--- | :--- | :--- |
| `summary` | Professional Summary | HTML String | Professional background and achievements |

---

## 8. Projects (Extra Section)
Showcases practical experience. This maps to an array of objects.

| Field ID | Label | Data Type | Placeholder / Description |
| :--- | :--- | :--- | :--- |
| `projects[].title` | Project Title | String | e.g. E-commerce Website |
| `projects[].link` | Project Link | String | e.g. https://github.com/... |
| `projects[].startYear` | Start Year | String | e.g. 2023 |
| `projects[].endYear` | End Year | String | e.g. 2024 |
| `projects[].isCurrent` | Currently working on this | Boolean | |
| `projects[].technologies` | Technologies Used | Array<String> | e.g. ["React", "Node.js"] |
| `projects[].description` | Project Description | HTML String | Features, achievements, etc. |

---

## 9. Languages (Extra Section)
Captures linguistic proficiency. This maps to an array of objects.

| Field ID | Label | Data Type | Placeholder / Description |
| :--- | :--- | :--- | :--- |
| `languages[].name` | Language Name | String | e.g. English, French |
| `languages[].level` | Proficiency Level | Number | 1 (Beginner) to 5 (Native) |

---

## 10. Certifications (Extra Section)
Lists professional certifications and licenses. This maps to an array of objects.

| Field ID | Label | Data Type | Placeholder / Description |
| :--- | :--- | :--- | :--- |
| `certifications[].name` | Certification Name | String | e.g. AWS Solutions Architect |
| `certifications[].date` | Date | String | e.g. 2023 |
| `certifications[].issuer` | Authority / Issuer | String | e.g. Amazon Web Services |
| `certifications[].description`| Description / Highlights | HTML String | Key topics or achievements |

---

## 11. Software (Extra Section)
Technical tools and software proficiency. Maps to an array of objects.

| Field ID | Label | Data Type | Placeholder / Description |
| :--- | :--- | :--- | :--- |
| `software[].name` | Software / Tool Name | String | e.g. Microsoft Excel |
| `software[].rating` | Rating | Number | Proficiency (1-5) |
| `software[].description` | Description / Highlights | HTML String | Details or key projects |

---

## 12. Key Achievements (Extra Section)
High-impact career wins and accolades. Maps to an array of objects.

| Field ID | Label | Data Type | Placeholder / Description |
| :--- | :--- | :--- | :--- |
| `keyAchievements[].name` | Achievement / Award Name | String | e.g. Employee of the Month |
| `keyAchievements[].description`| Description / Details | HTML String | Context about the achievement |

---

## 13. Accomplishments (Extra Section)
Unique achievements and recognition. Maps to an array of objects.

| Field ID | Label | Data Type | Placeholder / Description |
| :--- | :--- | :--- | :--- |
| `accomplishments[].name` | Title | String | e.g. Employee of the Month |
| `accomplishments[].description` | Description (Optional) | HTML String | Context or details |

---

## 14. Affiliations (Extra Section)
Professional memberships and organizations. Maps to an array of objects.

| Field ID | Label | Data Type | Placeholder / Description |
| :--- | :--- | :--- | :--- |
| `affiliations[].name` | Organization Name | String | e.g. Rotary International |
| `affiliations[].description`| Description / Role | HTML String | Membership details or your role |

---

## 15. Interests (Extra Section)
Personal hobbies and interests. Maps to an array of strings.

| Field ID | Label | Data Type | Placeholder / Description |
| :--- | :--- | :--- | :--- |
| `interests[]` | Interest | Array<String> | e.g. ["Photography", "Travelling"] |

---

## 16. Additional Information (Extra Section)
Full-width text area for miscellaneous details.

| Field ID | Label | Data Type | Description |
| :--- | :--- | :--- | :--- |
| `additionalInfo` | Additional Information | HTML String | Flexible text area for optional content |

---

## 17. Custom Section (Extra Section)
Allows users to define their own section title and content.

| Field ID | Label | Data Type | Description |
| :--- | :--- | :--- | :--- |
| `customSection.title` | Section Title | String | User-defined title (e.g. Publications) |
| `customSection.content` | Content | HTML String | Body of the custom section |
| `customSection.isVisible` | Visible | Boolean | Visibility toggle |
| `customSectionTitle` | Legacy Title | String | Synced title for backward compatibility |

---

## Technical Notes:
- **Data Path**: All fields are relative to the root `data` object passed to the `FormPanel`.
- **Dynamic Fields**: Some fields like `linkedin`, `github`, and `website` in the Core Header are conditionally rendered based on user interaction but stored under the same `personal` object.
- **Photo Handling**: Photos are handled as Base64 strings for immediate preview and persistence.
- **Education Array**: The `education` key holds an array of entries, allowing users to list multiple degrees.

check  (template naem)  no cutting off issue or too much leaving page gap section gap issue no page 2 and beyond issues

check for dedicated all sections rendering
check fo ui bugs issuess font sizing and all
check for desgin panel support section spacging para spacing line spacing and all etc 
I WANT NO BUGS


Resolved Sidebar Flickering: Added the missing data-column-id="sidebar" and data-column-id="main" attributes across all rendering paths (Measurer, multi-page, and single-page views). These attributes are essential for the useAutoPagination engine to correctly identify and measure column heights, which prevents the infinite layout recalculation loops that caused flickering.
Standardized Sidebar Sections: Updated the 

strengths
, 

additionalSkills
, and 

skills
 renderers to use a clean bulleted list style. This replaces the previous horizontal skill bars which could cause inconsistent vertical spacing and alignment issues during pagination.
Fixed Measurement Inconsistency: Added zoneId to the SectionRenderer calls within the 

Measurer
 component. This ensures that sections render identically during the height calculation phase and the actual display phase, further stabilizing the pagination.
Improved Formatting: Ensured consistent font scaling and paragraph margins across all sidebar list items for a more premium, "Azure Modern"-like feel.
The template should now function smoothly with drag-and-drop and auto-pagination, maintaining a consistent sidebar appearance.

