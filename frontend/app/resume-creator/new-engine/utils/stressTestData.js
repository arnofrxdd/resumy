export const stressTestData = {
    personal: {
        name: "Maximus 'Overflow' Data",
        profession: "Infinite Scale Engineer & Pagination Specialist",
        email: "maximus.data@gaplytiq.ai",
        phone: "+91 98765 43210",
        city: "Mumbai / Remote",
        summary: "Expert in breaking engines and testing limits. This summary is intentionally designed to be extremely long and spans multiple paragraphs. <br/><br/> First of all, we need to ensure that the summary itself can break across pages if it exceeds a full page height, although usually it's at the top. <br/><br/> Second, we are testing the 'Surgical Splitting' feature which allows individual bullet points and paragraphs to move to the next page instead of leaving a massive white gap. <br/><br/> Third, we are validating the 'Universal Region' logic that allows any number of columns. This resume will use a 3-column layout later to prove it. <br/><br/> Finally, we are checking 'Section Continuation' headers which should appear as 'SUMMARY (CONTINUED)' if it breaks."
    },
    experience: [
        {
            id: 'e_extreme',
            title: "The Ultimate Stress Tester",
            company: "Chaos Engineering Lab",
            startYear: "2024",
            endYear: "Present",
            description: "<ul>" +
                Array.from({ length: 30 }).map((_, i) => `<li>Hyper-detailed bullet point #${i + 1} which is designed to be long enough to potentially wrap across lines and test the vertical height measurement precisely. Bullet #${i + 1} continued...</li>`).join('') +
                "</ul>"
        },
        {
            id: 'e1',
            title: "Director of Stress Testing",
            company: "Global Scale Inc",
            startYear: "2020",
            endYear: "Present",
            description: "<ul><li>Managed a fleet of 5000+ servers across 12 regions with 100% automated pagination.</li><li>Implemented surgical splitting logic for internal documentation that saved 40% paper waste.</li><li>Reduced gap-related frustration by 95% across the engineering department.</li><li>Led the migration from single-column to multi-column dynamic layouts.</li><li>Wrote the definitive guide on 'Aesthetic Pagination for Modern Web Apps'.</li><li>Optimized bullet point rendering to be 10x faster using shadow DOM measurements.</li><li>This item has many bullets to ensure it breaks mid-list.</li><li>Adding even more bullets here.</li><li>And another one for good measure.</li><li>Let's see if this reaches the bottom of page 1.</li><li>If it does, the next bullet should be on page 2.</li></ul>"
        },
        ...Array.from({ length: 25 }).map((_, i) => ({
            id: `filler-${i}`,
            title: `Senior Filler Role ${i + 1}`,
            company: "Growth Co",
            startYear: "2010",
            endYear: "2015",
            description: "<ul><li>Standard filler description for vertical space testing.</li><li>Ensuring we have enough content to reach page 5 or 6.</li></ul>"
        }))
    ],
    projects: [
        {
            id: 'p1',
            title: "The Great Paginate-o-matic",
            link: "github.com/gaplytiq/paginate",
            description: "A revolutionary tool that slices HTML like a gourmet chef slices sashimi. <br/> Integrated with all major frameworks. <br/> Supports A4, Letter, and Legal. <br/> Includes dark mode for night-time printing."
        },
        {
            id: 'p2',
            title: "Surgical Splitter JS",
            description: "Lightweight 2kb library for splitting lists across virtual pages. Zero dependencies. High performance."
        },
        ...Array.from({ length: 10 }).map((_, i) => ({
            id: `proj-filler-${i}`,
            title: `Experimental Project ${i + 1}`,
            description: "Testing project section splitting with multiple items."
        }))
    ],
    skills: ["React", "Node.js", "TypeScript", "Pagination", "Recursion", "Layouts", "CSS-in-JS", "PDF Generation", "Surgical Splitting", "Aesthetic Design"],
    education: [
        { school: "University of Layouts", degree: "PhD in Whitespace Management", startYear: "2010", endYear: "2014" },
        { school: "College of Grids", degree: "B.Des in Graphic Engineering", startYear: "2006", endYear: "2010" }
    ],
    languages: ["English (Native)", "Javascript (Fluent)", "Typescript (Expert)", "HTML5 (Native)", "CSS3 (Fluent)"],
    layout: {
        col1: ['personal', 'skills', 'languages'],
        col2: ['summary', 'experience'],
        col3: ['education', 'projects']
    }
};

export const stressTemplateConfig = {
    regions: {
        col1: { width: '25%', styles: { background: '#1e293b', color: '#f8fafc', padding: '25px', borderRight: '1px solid #334155' } },
        col2: { width: '50%', styles: { padding: '25px', background: '#ffffff' } },
        col3: { width: '25%', styles: { padding: '25px', background: '#f8fafc', borderLeft: '1px solid #e2e8f0' } }
    },
    styles: {
        header: { borderBottom: '2px solid var(--theme-color, #3b82f6)', color: 'var(--theme-color, #3b82f6)', fontSize: '1.2rem', fontWeight: '800', marginBottom: '15px', textTransform: 'uppercase', letterSpacing: '1px' },
        text: { fontSize: '0.85rem', lineHeight: '1.6', color: '#334155' }
    }
};
