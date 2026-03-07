export const STRESS_TEST_DATA = {
    personal: {
        name: "DR. MAXIMUS OVERFLOW",
        profession: "Infinite Content Strategist & Lead Pagination Specialist",
        email: "maximus.overflow@pagination.ai",
        phone: "+1 (555) 000-INFINITE",
        city: "San Francisco",
        country: "USA",
        state: "CA",
        zipCode: "94107",
        linkedin: "linkedin.com/in/maximusthegreat",
        github: "github.com/maximusthegreat",
        website: "maximus.overflow.design",
        summary: `
            <p>Innovative and highly skilled Pagination Architect with over 15 years of experience in pushing the absolute limits of web-based document rendering. Proven track record of handling extremely long sections, multi-page overflows, and recursive content structures that break standard browsers.</p>
            <p>Expert in surgical splitting of bullet points and paragraph continuation logic. Dedicated to ensuring that no section, regardless of its length, ever leaves an unsightly gap in a professional document. Master of A4 constraints and sub-pixel measurement accuracy.</p>
            <p>Seeking to leverage my expertise in "The Ghost Measurement Layer" and manual DOM node traversal to create the world's most robust resume rendering engine for the Gaplytiq platform.</p>
        `
    },
    experience: [
        {
            title: "Chief Pagination Officer",
            company: "Infinite Scroll Inc.",
            location: "Void City, Metaverse",
            startYear: "2020",
            endYear: "Present",
            isCurrent: true,
            description: `
                <ul>
                    <li>Led the development of a proprietary rendering engine that supports "surgical splitting" of rich-text content across virtual pages, reducing whitespace by 40%.</li>
                    <li>Managed a team of 50 layout engineers to standardize the "Data-Slot-Render" golden triangle architecture for enterprise-grade CV generation.</li>
                    <li>Pioneered the "Recursive Bullet Split" algorithm which allows single bullet points spanning over 200 words to break gracefully across page boundaries without losing context or formatting.</li>
                    <li>Optimized the "Ghost Measurement Layer" to work with over 500 Google Fonts, ensuring ±0.5px accuracy in height calculations across Chrome, Safari, and Firefox.</li>
                    <li>Architected a multi-region drag-and-drop system that recalculates 5-page document layouts in under 15ms using an offscreen Canvas worker thread.</li>
                    <li>Successfully handled a resume with 250 bullet points in a single "Experience" entry, proving the engine is effectively un-crashable under normal or abnormal loads.</li>
                    <li>Developed the "Continuation Header" logic that automatically syncs section titles across pages while maintaining unique IDs for DOM accessibility compliance.</li>
                </ul>
            `
        },
        {
            title: "Senior Layout Developer",
            company: "The Margin Collapse Agency",
            location: "Paddington, UK",
            startYear: "2015",
            endYear: "2020",
            isCurrent: false,
            description: `
                <ul>
                    <li>Refactored a legacy resume builder that suffered from "Orphan Header Syndrome" (OHS), implementing a predictive look-ahead pagination algorithm.</li>
                    <li>Curated a library of 100+ "Universal Layout Patterns" that adaptable to both single-column and multi-column A4 templates.</li>
                    <li>Implemented a "Smart Spacer" utility that balances whitespace between sections to ensure a balanced aesthetic even when content is sparse on the last page.</li>
                    <li>Worked closely with PDF generators (Puppeteer and wkhtmltopdf) to synchronize CSS @media print rules with on-screen React state.</li>
                    <li>Identified and fixed a persistent 2px drift issue in Chromium's flexbox rendering that occurred when nested lists exceeded 1000px in total height.</li>
                </ul>
            `
        },
        {
            title: "Junior Bullet Point Specialist",
            company: "Listicle World",
            location: "Remote",
            startYear: "2010",
            endYear: "2015",
            isCurrent: false,
            description: `
                <ul>
                    <li>Mastered the art of writing concise yet impactful bullet points that maximize vertical space utilization.</li>
                    <li>Manually tested layout responsiveness for 50 different resume templates on mobile and desktop views.</li>
                    <li>Assisted in the implementation of "Draft Mode" which allows users to see page breaks in real-time as they type.</li>
                </ul>
            `
        }
    ],
    education: [
        {
            school: "University of Advanced Rendering",
            degree: "PhD in Document Physics",
            field: "Computational Layouts",
            city: "Cambridge",
            grade: "4.0 GPA",
            startYear: "2005",
            endYear: "2010",
            description: "<p>Thesis: On the Mathematical Impossibility of CSS Column-Break-Inside: Avoid in legacy browsers.</p>"
        }
    ],
    skills: [
        { name: "Surgical Pagination", level: 5 },
        { name: "Recursive Rendering", level: 5 },
        { name: "DOM Geometry Ops", level: 5 },
        { name: "React Reconciliation", level: 4 },
        { name: "A4 Constraints Mastery", level: 5 },
        { name: "CSS Margin Collapse Math", level: 5 }
    ],
    languages: [
        { name: "JavaScript / React", level: 5 },
        { name: "English (Native)", level: 5 },
        { name: "Binary Layout Language", level: 5 }
    ],
    sectionsOrder: ["summary", "experience", "education", "skills", "languages"]
};
