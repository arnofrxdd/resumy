const dummyData = {
    personal: {
        name: "Johnathan Smith",
        profession: "Senior Software Engineer",
        email: "john.smith@example.com",
        phone: "+1 (555) 000-1234",
        linkedin: "linkedin.com/in/johnsmith",
        github: "github.com/johnsmith",
        city: "San Francisco",
        country: "USA",
        website: "johnsmith.dev",
        photo: null
    },
    summary: "<ul><li>Results-driven Senior Software Engineer with over 8 years of experience in building scalable web applications.</li><li>Expert in React, Node.js, and cloud architecture.</li><li>Managed cross-functional teams of 12+ engineers to deliver 5+ enterprise-grade products from conception to launch.</li></ul>",
    experience: [
        {
            title: "Senior Full Stack Developer",
            company: "Tech Giant Inc.",
            location: "San Francisco, CA",
            startMonth: "January",
            startYear: "2020",
            endMonth: "",
            endYear: "",
            isCurrent: true,
            description: "<ul><li>Led a team of 12 engineers to re-architect the core platform, improving load times by 40%.</li><li>Implemented microservices architecture using Node.js and AWS Lambda.</li><li>Mentored junior developers and established best coding practices across the organization.</li></ul>"
        },
        {
            title: "Full Stack Engineer",
            company: "Growth Startup",
            location: "Austin, TX",
            startMonth: "June",
            startYear: "2016",
            endMonth: "December",
            endYear: "2019",
            isCurrent: false,
            description: "<ul><li>Developed and maintained customer-facing dashboards using React and Redux.</li><li>Optimized database queries in PostgreSQL, reducing API latency by 25%.</li><li>Collaborated with product designers to implement pixel-perfect UI components.</li></ul>"
        }
    ],
    education: [
        {
            school: "Stanford University",
            institution: "Stanford University",
            degree: "Bachelor of Science",
            field: "Computer Science",
            location: "Stanford, CA",
            city: "Stanford, CA",
            startMonth: "September",
            startYear: "2012",
            endMonth: "June",
            endYear: "2016",
            grade: "3.9 GPA"
        }
    ],
    skills: [
        { name: "JavaScript (ES6+)", level: 5 },
        { name: "React & Next.js", level: 5 },
        { name: "Node.js & Express", level: 4 },
        { name: "PostgreSQL & MongoDB", level: 4 },
        { name: "AWS & Docker", level: 4 },
        { name: "Python & Django", level: 3 }
    ],
    projects: [
        {
            title: "AI Resume Builder",
            description: "Developed an AI-powered resume builder that helps users create professional resumes in minutes using natural language processing.",
            technologies: ["React", "Node.js", "OpenAI API", "Tailwind CSS"]
        },
        {
            title: "Real-time Chat Application",
            description: "Built a highly scalable real-time chat application supporting thousands of concurrent users using WebSockets and Redis.",
            technologies: ["TypeScript", "Socket.io", "Redis", "Next.js"]
        }
    ],
    keyAchievements: [
        "Published 3 open-source libraries with over 5k stars on GitHub.",
        "Speaker at Global Tech Conference 2022 on Future of Frontend Development.",
        "Awarded 'Employee of the Year' at Tech Giant Inc. in 2021."
    ],
    achievements: [
        "Published 3 open-source libraries with over 5k stars on GitHub.",
        "Speaker at Global Tech Conference 2022 on Future of Frontend Development.",
        "Awarded 'Employee of the Year' at Tech Giant Inc. in 2021."
    ],
    languages: [
        { name: "English", level: 5 },
        { name: "Spanish", level: 4 },
        { name: "French", level: 2 }
    ],
    courses: [
        "Full Stack Web Development - Code Academy",
        "Cloud Architecture with AWS - Coursera",
        "Advanced React Patterns - Frontend Masters"
    ],
    interests: [
        "Open Source Contribution",
        "Backpacking & Hiking",
        "Chess",
        "Machine Learning"
    ]
};

export default dummyData;
