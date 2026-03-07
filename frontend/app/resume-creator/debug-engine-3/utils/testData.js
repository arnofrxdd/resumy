export const testData = {
    personal: {
        name: "Maximus Pagination",
        profession: "Senior Layout Engineer",
        city: "New York, NY",
        email: "max@example.com",
        phone: "+1 555-0123"
    },
    summary: "Experienced software engineer with a focus on high-performance web applications. Skilled in React, Node.js, and advanced CSS layouts. Proven track record of optimizing rendering engines and ensuring pixel-perfect designs across devices. Passionate about clean code and scalable architecture. \n\nAnother paragraph to test splitting of text blocks. This paragraph should potentially move to the next page if the first one fills the space. We want to see if the engine can handle multi-paragraph summaries gracefully without awkward cuts.",
    experience: [
        {
            id: 'job1',
            title: "Senior Developer",
            company: "Tech Giant Corp",
            duration: "2020 - Present",
            description: "Leading the frontend team.",
            bullets: [
                "Architected a new rendering engine that improved performance by 300%.",
                "Managed a team of 10 developers across 3 time zones.",
                "Implemented rigorous testing protocols resulting in zero critical bugs in production.",
                "Collaborated with product managers to define roadmap and deliverables.",
                "Mentored junior developers and conducted code reviews.",
                "Optimized build pipeline reducing deploy times by 50%.",
                "Designed and implemented a custom component library used across 5 products.",
                "Ensured accessibility compliance (WCAG 2.1 AA) for all user-facing interfaces.",
                "Led the migration from legacy monolithic architecture to micro-frontends.",
                "Presented technical talks at internal and external conferences.",
                "This bullet is intentionally placed to test page break boundaries.",
                "Another bullet to ensure smooth continuation on the next page.",
                "Validating that the header repeats correctly if a break occurs here.",
                "Checking spacing and margins after page breaks.",
                "Testing nested list handling (mock data structure flattened for simplicity).",
                "Ensuring drag and drop handles appear correctly for this item.",
                "Final bullet of this massive list to close out the section."
            ]
        },
        {
            id: 'job2',
            title: "Mid-Level Developer",
            company: "StartUp Inc",
            duration: "2017 - 2020",
            description: "Full stack development.",
            bullets: [
                "Developed key features for the MVP launch.",
                "Integrated third-party APIs for payment processing and analytics.",
                "Maintained 99.9% uptime for critical services.",
                "wrote unit and integration tests achieving 80% code coverage.",
                "Participated in daily stand-ups and agile sprint planning.",
                "Debugged complex production issues under pressure.",
                "Refactored legacy code to use modern ES6+ syntax.",
                "Implemented responsive design for mobile and tablet devices.",
                "Set up CI/CD pipelines using GitHub Actions.",
                "Contributed to open source projects used by the company."
            ]
        },
        ...Array.from({ length: 5 }).map((_, i) => ({
            id: `job-old-${i}`,
            title: `Developer Role ${i + 1}`,
            company: `Previous Company ${i + 1}`,
            duration: `201${5 - i} - 201${6 - i}`,
            description: "Worked on various web projects.",
            bullets: [
                "Maintained internal tools.",
                "Fixed bugs and improved UI consistency.",
                "Collaborated with designers to implement pixel-perfect mockups."
            ]
        }))
    ],
    projects: [
        {
            id: 'proj1',
            title: "Resume Builder Engine",
            description: "A complex React application for building resumes with real-time preview.",
            bullets: [
                "Implemented drag and drop functionality.",
                "Created a custom pagination algorithm to handle A4 page breaks.",
                "Supported multi-column layouts and custom themes."
            ]
        },
        ...Array.from({ length: 8 }).map((_, i) => ({
            id: `proj-filler-${i}`,
            title: `Side Project ${i + 1}`,
            description: "A small utility library.",
            bullets: [
                "Published to npm.",
                "Wrote documentation and usage examples.",
                "Received 100+ stars on GitHub."
            ]
        }))
    ],
    skills: [
        { name: "JavaScript", level: 5 },
        { name: "React", level: 5 },
        { name: "Node.js", level: 4 },
        { name: "CSS/SASS", level: 5 },
        { name: "TypeScript", level: 4 },
        { name: "GraphQL", level: 3 },
        { name: "Docker", level: 3 },
        { name: "AWS", level: 3 }
    ],
    education: [
        {
            degree: "BS Computer Science",
            school: "University of Tech",
            year: "2013 - 2017"
        }
    ],
    languages: ["English", "Spanish", "French"],
    interests: ["Hiking", "Photography", "Open Source", "Gaming"]
};
