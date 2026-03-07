
// Forcing HMR update
export const mockResumeData = {
    personal: {
        name: "Jonathan 'Test' Doe",
        profession: "Senior Full Stack Architect",
        email: "jonathan.doe@example.com",
        phone: "+1 (555) 987-6543",
        city: "San Francisco",
        country: "USA",
        linkedin: "linkedin.com/in/johndoe",
        github: "github.com/johndoe",
        summary: "<p>Highly experienced software architect with over 15 years of expertise in building scalable, distributed systems. Proven track record of leading large teams, optimizing performance, and driving technical innovation. Passionate about clean code, microservices architecture, and cloud-native solutions. Dedicated to mentoring junior developers and fostering a culture of continuous learning. This summary is intentionally long to take up significant vertical space at the top of the main column, ensuring that subsequent sections are pushed further down the page to test the pagination logic effectively.</p>"
    },
    experience: [
        {
            id: 'exp-1',
            title: "Staff Software Engineer",
            company: "Tech Giant Corp",
            location: "San Francisco, CA",
            startYear: "2022",
            endYear: "Present",
            isCurrent: true,
            description: "<ul><li>Architected the next-generation billing platform handling $1B+ in annual transactions.</li><li>Led a team of 12 seniors to migrate legacy monoliths to microservices using Go and gRPC.</li><li>Reduced latency by 40% through aggressive caching strategies and database optimizations.</li><li>Implemented a comprehensive CI/CD pipeline using GitHub Actions and Kubernetes.</li><li>Mentored 5 junior engineers to promotion within 18 months.</li><li>Coordinated with product management to define roadmap and technical strategy.</li><li>Resolved critical production incidents with 99.99% uptime SLA.</li></ul>"
        },
        {
            id: 'exp-2',
            title: "Senior Backend Developer",
            company: "Unicorn Startup",
            location: "New York, NY",
            startYear: "2019",
            endYear: "2022",
            description: "<ul><li>Designed and implemented the core API gateway using Node.js and Express.</li><li>Scaled the user authentication system to support 5 million active users.</li><li>Optimized PostgreSQL queries, reducing P95 response times by 200ms.</li><li>Integrated third-party payment gateways (Stripe, PayPal) with robust error handling.</li><li>Collaborated with frontend teams to define GraphQL schemas for the dashboard.</li><li>Introduced automated testing (Jest, Cypress) raising code coverage from 20% to 85%.</li><li>Championed the adoption of TypeScript across the entire backend codebase.</li></ul>"
        },
        {
            id: 'exp-3',
            title: "Full Stack Developer",
            company: "Mid-Sized Tech",
            location: "Austin, TX",
            startYear: "2016",
            endYear: "2019",
            description: "<ul><li>Built the customer-facing web application using React and Redux.</li><li>Developed internal tools to streamline operations and customer support workflows.</li><li>Migrated on-premise infrastructure to AWS (EC2, S3, RDS).</li><li>Implemented real-time features using WebSockets and Socket.io.</li><li>Participated in daily stand-ups and bi-weekly sprint planning.</li><li>Refactored legacy jQuery code to modern React components.</li><li>Ensured cross-browser compatibility and responsive design for mobile users.</li><li>This item is purposefully long to test the breaking logic within a single item if we ever support that, or just to occupy vertical space.</li></ul>"
        },
        {
            id: 'exp-4',
            title: "Junior Web Developer",
            company: "Agile Agency",
            location: "Remote",
            startYear: "2014",
            endYear: "2016",
            description: "<ul><li>Developed responsive websites for various clients using HTML, CSS, and JavaScript.</li><li>Customized WordPress themes and plugins to meet specific client requirements.</li><li>Collaborated with designers to translate Figma mockups into pixel-perfect code.</li><li>Maintained and updated existing client websites with security patches.</li><li>Optimized images and assets for faster page load speeds.</li><li>Assisted senior developers in debugging and troubleshooting issues.</li></ul>"
        },
        {
            id: 'exp-5',
            title: "Intern",
            company: "Local Software House",
            location: "Chicago, IL",
            startYear: "2013",
            endYear: "2014",
            description: "<ul><li>Assisted in testing and QA of web applications.</li><li>Wrote documentation for internal APIs and tools.</li><li>Fixed minor UI bugs and styling issues.</li><li>Learned the basics of version control with Git.</li><li>Participated in code reviews and learning sessions.</li></ul>"
        },
        {
            id: 'exp-6',
            title: "Freelance Developer",
            company: "Self-Employed",
            location: "Remote",
            startYear: "2012",
            endYear: "2013",
            description: "<ul><li>Built custom websites for small businesses using PHP and MySQL.</li><li>Managed hosting and domain configuration for clients.</li><li>Provided ongoing maintenance and support.</li></ul>"
        }
    ],
    education: [
        {
            id: 'edu-1',
            school: "Stanford University",
            degree: "M.S. Computer Science",
            startYear: "2012",
            endYear: "2014"
        },
        {
            id: 'edu-2',
            school: "University of Illinois",
            degree: "B.S. Computer Engineering",
            startYear: "2008",
            endYear: "2012"
        },
        {
            id: 'edu-3',
            school: "Online Academy",
            degree: "Full Stack Certification",
            startYear: "2015",
            endYear: "2015"
        }
    ],
    skills: [
        { name: "JavaScript (ES6+)", level: 5 },
        { name: "React / Next.js", level: 5 },
        { name: "Node.js / Express", level: 5 },
        { name: "Python / Django", level: 4 },
        { name: "Go / Golang", level: 3 },
        { name: "SQL (PostgreSQL)", level: 4 },
        { name: "NoSQL (MongoDB)", level: 4 },
        { name: "Docker / Kubernetes", level: 3 },
        { name: "AWS (EC2, S3, Lambda)", level: 4 },
        { name: "Git / CI/CD", level: 5 },
        { name: "GraphQL", level: 4 },
        { name: "TypeScript", level: 5 },
        { name: "Redis", level: 3 },
        { name: "Elasticsearch", level: 3 },
        { name: "Linux Administration", level: 4 }
    ],
    projects: [
        {
            id: 'proj-1',
            title: "E-Commerce Platform",
            description: "Built a fully functional e-commerce site with cart, checkout, and payments.",
            link: "github.com/test/ecommerce"
        },
        {
            id: 'proj-2',
            title: "Task Management App",
            description: "A Trello-like drag and drop task manager built with React DnD.",
            link: "github.com/test/tasks"
        },
        {
            id: 'proj-3',
            title: "Weather Dashboard",
            description: "Real-time weather data visualization using OpenWeatherMap API.",
            link: "github.com/test/weather"
        },
        {
            id: 'proj-4',
            title: "Chat Application",
            description: "Real-time chat app using Socket.io and Redis adapter.",
            link: "github.com/test/chat"
        }
    ],
    languages: [
        { name: "English", level: 5 },
        { name: "Spanish", level: 3 },
        { name: "French", level: 2 },
        { name: "German", level: 1 }
    ],
    // DEFAULT LAYOUT STATE
    layout: {
        sidebar: ['personal', 'skills', 'languages', 'projects'],
        main: ['summary', 'experience', 'education']
    }
};

// Configuration for the Template (Defines how regions look)
export const mockTemplateConfig = {
    regions: {
        sidebar: {
            width: '30%',
            styles: {
                background: '#f8fafc',
                padding: '20px',
                borderRight: '1px solid #e2e8f0'
            }
        },
        main: {
            width: '70%',
            styles: {
                padding: '20px',
                background: '#ffffff'
            }
        }
    },
    // Global container styles
    containerStyles: {
        display: 'flex',
        flexDirection: 'row',
        height: '100%' // Important for filling page
    }
};
