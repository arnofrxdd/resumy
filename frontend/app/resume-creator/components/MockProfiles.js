export const MOCK_PROFILES = {
    tech: {
        personal: {
            photo: "https://i.pravatar.cc/150?u=john",
            name: "Johnathan Smith",
            profession: "Senior Full Stack Developer",
            city: "San Francisco",
            state: "CA",
            country: "USA",
            zipCode: "94103",
            phone: "+1 (555) 0123-4567",
            email: "john.smith@example.com",
            linkedin: "linkedin.com/in/johnsmith",
            github: "github.com/johnsmith",
            website: "johnsmith.dev",
            dob: "12/05/1992",
            nationality: "American",
            maritalStatus: "Single",
            visaStatus: "U.S. Citizen",
            gender: "Male",
        },
        summary: "<p>Results-driven <strong>Senior Software Engineer</strong> with over 8 years of experience in building scalable web applications. Expert in React, Node.js, and cloud architecture. Managed cross-functional teams of 12+ engineers to deliver premium products from conception to launch.</p>",
        experience: [
            {
                title: "Senior Full Stack Developer",
                company: "Tech Giant Inc.",
                location: "San Francisco, CA",
                isRemote: false,
                startMonth: "September",
                startYear: "2020",
                isCurrent: true,
                description: "<ul><li>Led the architectural overhaul of the core SaaS platform, improving load times by 40% and enhancing user retention by 15% through optimized hydration strategies.</li><li>Implemented microservices architecture using Node.js and AWS Lambda, reducing infrastructure costs by 25% and improving deployment speed by 50%.</li><li>Mentored junior developers and established best coding practices, leading to a 30% reduction in production bugs over 12 months.</li><li>Collaborated with DevOps to implement CI/CD pipelines using GitHub Actions and Docker, automating testing and deployment for 50+ microservices.</li></ul>"
            },
            {
                title: "Full Stack Engineer",
                company: "Growth Startup",
                location: "Austin, TX",
                isRemote: true,
                startMonth: "June",
                startYear: "2017",
                isCurrent: false,
                endMonth: "August",
                endYear: "2020",
                description: "<ul><li>Developed and maintained customer-facing dashboards using React and Redux with 99.9% uptime for over 500k monthly active users.</li><li>Optimized database queries in PostgreSQL, reducing backend API latency by 35% across all endpoints through strategic indexing and caching.</li><li>Collaborated with product designers to implement pixel-perfect UI components and fluid animations using Framer Motion and SVG.</li><li>Developed real-time notification features using WebSockets and Redis, improving user engagement metrics by 20%.</li></ul>"
            },
            {
                title: "Junior Web Developer",
                company: "Web Solutions Agency",
                location: "San Jose, CA",
                isRemote: false,
                startMonth: "July",
                startYear: "2015",
                isCurrent: false,
                endMonth: "May",
                endYear: "2017",
                description: "<ul><li>Built responsive websites for diverse clients using HTML, CSS, and jQuery, ensuring cross-browser compatibility and accessibility.</li><li>Integrated social media APIs and third-party payment gateways like Stripe and PayPal for e-commerce clients.</li><li>Assisted in SEO optimization and performance tuning, leading to a 20% increase in organic traffic for key stakeholder projects.</li></ul>"
            }
        ],
        education: [
            {
                school: "Stanford University",
                city: "Stanford, CA",
                degree: "Master of Science",
                field: "Computer Science",
                grade: "3.9 GPA",
                startMonth: "September",
                startYear: "2016",
                endMonth: "June",
                endYear: "2018",
                description: "<p>Specialized in Artificial Intelligence and Distributed Systems. Research assistant for the Human-Computer Interaction group working on novel interface design.</p>"
            },
            {
                school: "University of California, Berkeley",
                city: "Berkeley, CA",
                degree: "Bachelor of Science",
                field: "Software Engineering",
                grade: "3.8 GPA",
                startMonth: "September",
                startYear: "2012",
                endMonth: "May",
                endYear: "2016",
                description: "<p>Minor in Business Management. Captain of the Competitive Programming team and lead organizer for the campus-wide hackathon.</p>"
            }
        ],
        skills: [
            { name: "JavaScript (ES6+)", level: 5 },
            { name: "React & Next.js", level: 5 },
            { name: "Node.js & Express", level: 4 },
            { name: "PostgreSQL & MongoDB", level: 4 },
            { name: "AWS & Docker", level: 4 },
            { name: "TypeScript", level: 5 },
            { name: "Python", level: 4 },
            { name: "GraphQL", level: 4 }
        ],
        projects: [
            {
                title: "AI Resume Intelligence",
                link: "https://gaplytiq.com",
                startYear: "2023",
                endYear: "2024",
                isCurrent: false,
                technologies: ["React", "Node.js", "OpenAI", "Pinecone"],
                description: "<p>Developed an AI-powered resume analyzer that helps users optimize their career documents using NLP and LLMs. Includes automated feedback generation and keyword matching.</p>"
            },
            {
                title: "Real-time Crypto Tracker",
                link: "https://crypto-live.dev",
                startYear: "2022",
                endYear: "2023",
                isCurrent: false,
                technologies: ["Next.js", "WebSockets", "D3.js"],
                description: "<p>Built a high-performance cryptocurrency dashboard with real-time price updates and interactive technical analysis charts for over 200 tokens.</p>"
            },
            {
                title: "Open Source UI Library",
                link: "https://github.com/johnsmith/nebula-ui",
                startYear: "2021",
                endYear: "2022",
                isCurrent: false,
                technologies: ["React", "Stitches", "Radix UI"],
                description: "<p>Created a lightweight, accessible UI component library for React with built-in dark mode support and zero-config styling.</p>"
            }
        ],
        languages: [
            { name: "English", level: 5 },
            { name: "Spanish", level: 3 },
            { name: "French", level: 2 }
        ],
        certifications: [
            { name: "AWS Certified Solutions Architect", date: "2023", issuer: "Amazon Web Services", description: "<p>Validation of advanced cloud architecture and deployment skills.</p>" },
            { name: "Professional Scrum Master", date: "2021", issuer: "Scrum.org", description: "<p>Certification in Agile project management and team leadership.</p>" }
        ],
        software: [
            { name: "VS Code", rating: 5 },
            { name: "Docker", rating: 4 },
            { name: "Postman", rating: 5 },
            { name: "JIRA", rating: 4 }
        ],
        interests: ["Open Source", "Backpacking", "Chess", "Digital Photography"],
        strengths: [
            { name: "Scalable Architecture", level: 5 },
            { name: "Team Leadership", level: 4 },
            { name: "Problem Solving", level: 5 }
        ],
        additionalSkills: [
            { name: "Agile/Scrum", level: 5 },
            { name: "TDD", level: 4 },
            { name: "Performance Tuning", level: 5 }
        ]
    },
    creative: {
        personal: {
            photo: "https://i.pravatar.cc/150?u=alex",
            name: "Alex Rivera",
            profession: "Senior Product Designer",
            city: "Brooklyn",
            state: "NY",
            country: "USA",
            zipCode: "11201",
            phone: "+1 (555) 9876-5432",
            email: "alex.rivera@design.co",
            website: "arivera.design",
            linkedin: "linkedin.com/in/alexrivera",
            nationality: "Hispanic",
            gender: "Non-binary",
        },
        summary: "<p>Visual storyteller and <strong>UX strategist</strong> with 8+ years of experience crafting immersive digital experiences. Passionate about minimalism, accessibility, and the intersection of technology and human emotion. Expert in building scalable design systems for global brands.</p>",
        experience: [
            {
                title: "Lead UI/UX Designer",
                company: "Creative Vanguard",
                location: "New York, NY",
                isRemote: false,
                startMonth: "March",
                startYear: "2019",
                isCurrent: true,
                description: "<ul><li>Spearheaded the rebranding of a global fintech application, resulting in a 20% increase in user acquisition and a 15% boost in NPS.</li><li>Created a comprehensive design system ('Nova') that reduced production handoff time by 50% across 5 product teams.</li><li>Conducted over 100+ user interviews to drive product decisions based on empathy and quantitative data.</li><li>Collaborated with stakeholders to define product roadmaps and visual strategies.</li></ul>"
            },
            {
                title: "Senior UI Designer",
                company: "Digital Dream",
                location: "Los Angeles, CA",
                isRemote: true,
                startMonth: "January",
                startYear: "2016",
                isCurrent: false,
                endMonth: "February",
                endYear: "2019",
                description: "<ul><li>Designed multi-platform mobile apps for iOS and Android, focusing on gestural interactions and subtle micro-animations.</li><li>Collaborated with engineers to ensure 100% design fidelity using Figma and Principle.</li><li>Reduced churn by 10% through a complete redesign of the user onboarding flow and interactive feedback loops.</li></ul>"
            },
            {
                title: "Visual Designer",
                company: "Artistic Media Group",
                location: "Miami, FL",
                isRemote: false,
                startMonth: "June",
                startYear: "2014",
                isCurrent: false,
                endMonth: "December",
                endYear: "2015",
                description: "<ul><li>Created high-impact marketing assets, including social media campaigns, print advertisements, and event branding.</li><li>Developed brand identities for 15+ early-stage startups across various industries.</li><li>Managed client relationships and project timelines for boutique design projects.</li></ul>"
            }
        ],
        education: [
            {
                school: "Rhode Island School of Design",
                city: "Providence, RI",
                degree: "BFA",
                field: "Graphic Design",
                startYear: "2010",
                endYear: "2014",
                description: "<p>Concentration in Interactive Media and Typography. Graduated with Distinguished Honors. Recipient of the Merit Scholarship.</p>"
            },
            {
                school: "The Cooper Union",
                city: "New York, NY",
                degree: "Summer Fellowship",
                field: "Type Design",
                startYear: "2013",
                endYear: "2013",
                description: "<p>Intensive program focused on typeface construction, history, and digital font production.</p>"
            }
        ],
        skills: [
            { name: "Product Strategy", level: 5 },
            { name: "UI/UX Design", level: 5 },
            { name: "Figma & Framer", level: 5 },
            { name: "Motion Graphics", level: 4 },
            { name: "Design Systems", level: 5 },
            { name: "User Research", level: 4 },
            { name: "A/B Testing", level: 4 }
        ],
        projects: [
            {
                title: "FinTech App Redesign",
                technologies: ["Figma", "Framer", "React"],
                description: "<p>A complete overhaul of a complex financial dashboard focusing on modern aesthetics, accessibility, and high-performance charts. Reduced cognitive load by 40%.</p>"
            },
            {
                title: "Luxury E-commerce Site",
                technologies: ["Shopify", "Spline", "GSAP"],
                description: "<p>Designed an immersive 3D shopping experience for a high-end fashion brand using WebGL and Spline. Increased conversion by 12% and average time on page by 30%.</p>"
            },
            {
                title: "Creative Portfolio Engine",
                technologies: ["Next.js", "Three.js", "Tailwind"],
                description: "<p>Built a custom portfolio template for artists with dynamic 3D transitions and effortless content management.</p>"
            }
        ],
        languages: [
            { name: "English", level: 5 },
            { name: "French", level: 4 },
            { name: "Portuguese", level: 3 }
        ],
        interests: ["Street Photography", "Analog Synths", "Pottery", "Indie Game Dev"],
        education: [
            {
                school: "Kellogg School of Management",
                degree: "Master of Business Administration (MBA)",
                field: "Strategy and Marketing",
                startYear: "2008",
                endYear: "2010",
                description: "<p>Top 5% of class. Specialized in Disruptive Innovation and Global Marketing. President of the Marketing Club and recipient of the Dean's Award.</p>"
            },
            {
                school: "Northwestern University",
                degree: "Bachelor of Arts",
                field: "Economics and Communications",
                startYear: "2004",
                endYear: "2008",
                description: "<p>Summa Cum Laude. Member of the Debate Team. Minor in Applied Statistics. Phi Beta Kappa member.</p>"
            }
        ],
        skills: [
            { name: "Market Strategy", level: 5 },
            { name: "P&L Management", level: 5 },
            { name: "Public Relations", level: 5 },
            { name: "Growth Hacking", level: 4 },
            { name: "Crisis Communication", level: 5 },
            { name: "Global Operations", level: 4 },
            { name: "Brand Positioning", level: 5 }
        ],
        projects: [
            {
                title: "Global Rebranding Initiative",
                technologies: ["Brand strategy", "Market Research", "Media Buying"],
                description: "<p>Led the multi-year effort to unify a fragmented global brand architecture across 12 product categories and 40 countries.</p>"
            },
            {
                title: "Market Entry: Brazil",
                technologies: ["Localization", "GTM Strategy", "Strategic Partnerships"],
                description: "<p>Managed the end-to-end launch of our fintech suite in the Brazilian market, achieving profitability in just 14 months.</p>"
            }
        ],
        languages: [
            { name: "English", level: 5 },
            { name: "German", level: 4 },
            { name: "Mandarin", level: 2 }
        ],
        interests: ["Philanthropy", "Sailing", "Wine Tasting", "Contemporary Art", "Marathon Running"],
        affiliations: [
            { name: "American Marketing Association", description: "Board Member and Keynote Speaker" },
            { name: "World Business Council", description: "Strategic Advisor on Digital Transformation" }
        ],
        certifications: [
            { name: "Executive Leadership Program", issuer: "Harvard Business School", year: "2022" },
            { name: "Advanced Product Marketing", issuer: "Reforge", year: "2021" }
        ]
    },
    modern: {
        personal: {
            photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=arnav",
            name: "Arnav Sharma",
            profession: "Senior Business Analyst",
            city: "New Delhi",
            country: "India",
            phone: "+91 98765 43210",
            email: "arnav.sharma@consulting.com",
            linkedin: "linkedin.com/in/arnavsharma",
        },
        summary: "<p>Analytical and detail-oriented <strong>Senior Business Analyst</strong> with 7+ years of experience in data modeling, process optimization, and strategic planning. Adept at bridging the gap between business needs and complex technical solutions to drive ROI.</p>",
        experience: [
            {
                title: "Senior Process Analyst",
                company: "Delloite Consulting",
                location: "Bangalore, India",
                startYear: "2021",
                isCurrent: true,
                description: "<ul><li>Automated internal reporting processes using PowerBI and Python, saving 25 man-hours per week for the regional leadership team.</li><li>Conducted gap analysis for legacy financial systems, identifying $3M in annual cost-saving opportunities through operational streamlining.</li><li>Facilitated workshops with 50+ stakeholders to gather and document complex business requirements for enterprise-wide ERP upgrades.</li><li>Led a team of 3 junior analysts on high-priority client engagements.</li></ul>"
            },
            {
                title: "Business Data Analyst",
                company: "Infosys Ltd.",
                location: "Pune, India",
                startYear: "2018",
                isCurrent: false,
                endYear: "2021",
                description: "<ul><li>Developed predictive models for customer churn using Python and Scikit-learn, achieving 88% accuracy and reducing attrition by 12%.</li><li>Visualized sales performance metrics in Tableau, leading to a 10% increase in regional sales rep productivity.</li><li>Performed root cause analysis for supply chain bottlenecks, reducing average delivery delays by 15% over 18 months.</li><li>Automated data extraction from multiple SQL databases for recurring weekly audits.</li></ul>"
            },
            {
                title: "Junior Analyst",
                company: "StartUp Metrics",
                location: "Delhi, India",
                startYear: "2016",
                isCurrent: false,
                endYear: "2018",
                description: "<ul><li>Assisted senior analysts in gathering data for market research reports and competitor analysis.</li><li>Maintained internal databases and ensured data integrity for monthly performance reviews.</li><li>Created standardized reporting templates for the marketing department.</li></ul>"
            }
        ],
        education: [
            {
                school: "Indian Institute of Management",
                degree: "PGDM",
                field: "Business Analytics",
                startYear: "2014",
                endYear: "2016",
                description: "<p>Core focus on Predictive Modeling and Supply Chain Analytics. Ranked in the top 5% of the batch. Recipient of the Academic Excellence Award.</p>"
            },
            {
                school: "Delhi Technological University",
                degree: "Bachelor of Technology",
                field: "Information Technology",
                startYear: "2010",
                endYear: "2014",
                description: "<p>Completed several data science projects and internships. Secretary of the DTU Data Science Club and lead for the annual tech fest.</p>"
            }
        ],
        skills: [
            { name: "Python (SQL, Pandas)", level: 5 },
            { name: "Tableau/PowerBI", level: 5 },
            { name: "Statistical Analysis", level: 5 },
            { name: "Agile Methodology", level: 4 },
            { name: "Process Mapping", level: 5 },
            { name: "Project Management", level: 4 },
            { name: "SAP ERP", level: 4 }
        ],
        projects: [
            {
                title: "Financial Forecasting Tool",
                technologies: ["Python", "Pandas", "Streamlit"],
                description: "<p>Developed a self-service forecasting tool for the finance department that predicts quarterly revenue with a 95% confidence interval.</p>"
            },
            {
                title: "Warehouse Optimization",
                technologies: ["SQL", "Tableau", "Six Sigma"],
                description: "<p>Redesigned the inventory layout for a major e-commerce regional hub, reducing picking time by 20%.</p>"
            }
        ],
        languages: [
            { name: "Hindi", level: 5 },
            { name: "English", level: 5 },
            { name: "Punjabi", level: 4 }
        ],
        interests: ["Cricket", "Classical Music", "Cooking", "Trekking", "Stock Market Analysis"],
        certifications: [
            { name: "Google Data Analytics Professional", date: "2022", issuer: "Coursera" },
            { name: "CBAP Certification", date: "2023", issuer: "IIBA" },
            { name: "Lean Six Sigma Green Belt", date: "2020", issuer: "KMPG" }
        ],
        strengths: [
            { name: "Analytical Thinking", level: 5 },
            { name: "Strategic Planning", level: 5 },
            { name: "Cross-functional Leadership", level: 4 }
        ],
        education: [
            {
                school: "University of Cambridge",
                degree: "PhD",
                field: "Theoretical Physics",
                startYear: "2006",
                endYear: "2010",
                description: "<p>Thesis Title: 'Non-linear Dynamics in Entangled Systems'. Awarded the Smith-Knight Prize and the Rayleigh Prize for exceptional research quality.</p>"
            },
            {
                school: "Imperial College London",
                degree: "MSci",
                field: "Physics",
                startYear: "2002",
                endYear: "2006",
                description: "<p>First Class Honours. Awarded the Forbes Prize for the best final year research project on string theory.</p>"
            }
        ],
        skills: [
            { name: "Mathematical Modeling", level: 5 },
            { name: "Python (NumPy, SciPy)", level: 5 },
            { name: "Grant Writing", level: 5 },
            { name: "Quantum Mechanics", level: 5 },
            { name: "Public Speaking", level: 4 },
            { name: "Latex / Overleaf", level: 5 }
        ],
        projects: [
            {
                title: "Simulated Annealing Algorithm",
                technologies: ["C++", "MPI", "OpenMP"],
                description: "<p>Developed a massively parallel algorithm for solving complex optimization problems in condensed matter physics.</p>"
            }
        ],
        languages: [
            { name: "English", level: 5 },
            { name: "Latin", level: 2 },
            { name: "German", level: 3 }
        ],
        interests: ["Astronomy", "Gardening", "Restoring Vintage Books", "Classical Philosophy", "Mountain Biking"],
        education: [
            {
                school: "London School of Economics",
                degree: "Master of Laws (LLM)",
                field: "Commercial Law",
                startYear: "2008",
                endYear: "2009",
                description: "<p>Concentration in International Business Transactions and Copyright Law. Distinction in both the final thesis and oral examinations.</p>"
            },
            {
                school: "University of Oxford",
                degree: "Bachelor of Civil Law",
                field: "Jurisprudence",
                startYear: "2004",
                endYear: "2008",
                description: "<p>First Class Honours. Recipient of the Gibbs Prize for Law. President of the Oxford Law Society and member of the University Mooting Team.</p>"
            }
        ],
        skills: [
            { name: "Litigation", level: 4 },
            { name: "Risk Assessment", level: 5 },
            { name: "Negotiation", level: 5 },
            { name: "Compliance", level: 5 },
            { name: "Contract Law", level: 5 },
            { name: "Drafting", level: 5 }
        ],
        projects: [
            {
                title: "Regulatory Gap Analysis",
                technologies: ["Process Mapping", "Compliance Audit"],
                description: "<p>Led a comprehensive audit of data processing activities for a major retailer to ensure 100% compliance with new GDPR regulations.</p>"
            }
        ],
        languages: [
            { name: "English", level: 5 },
            { name: "German", level: 4 },
            { name: "French", level: 3 }
        ],
        affiliations: [
            { name: "The Law Society", description: "Active member and contributor to the Corporate Law Committee" },
            { name: "International Bar Association", description: "Member of the M&A and Private Equity Committee" }
        ],
        interests: ["Political History", "Marathon Running", "Jazz Piano", "Traditional Sailing"],
        education: [
            {
                school: "George Brown College",
                degree: "Diploma",
                field: "Fashion Management",
                startYear: "2014",
                endYear: "2016"
            }
        ],
        skills: [
            { name: "Visual Merchandising", level: 5 },
            { name: "Team Leadership", level: 5 },
            { name: "Sales Strategy", level: 4 },
            { name: "Inventory Systems", level: 4 },
            { name: "Loss Prevention", level: 5 }
        ],
        strengths: [
            { name: "Customer Experience", level: 5 },
            { name: "Operational Excellence", level: 5 },
            { name: "Conflict Resolution", level: 4 }
        ],
        software: [
            { name: "Shopify POS", rating: 5 },
            { name: "Microsoft Excel", rating: 4 },
            { name: "Workday", rating: 4 }
        ],
        languages: [{ name: "English", level: 5 }, { name: "Cantonese", level: 4 }, { name: "Mandarin", level: 3 }],
        interests: ["Fashion Design", "Yoga", "Travel Photography", "Sustainable Retail"]
    },
    medical: {
        personal: {
            name: "Dr. Elena Rodriguez",
            profession: "General Practitioner",
            city: "Madrid",
            country: "Spain",
            phone: "+34 912 345 678",
            email: "e.rodriguez@hospital-central.es",
            photo: "https://i.pravatar.cc/150?u=dr_elena",
        },
        summary: "<p>Compassionate and dedicated <strong>General Practitioner</strong> with over 10 years of experience in primary care and emergency medicine. Committed to providing evidence-based patient care and promoting community health.</p>",
        experience: [
            {
                title: "Senior General Practitioner",
                company: "Hospital Central de Madrid",
                location: "Madrid, Spain",
                startYear: "2015",
                isCurrent: true,
                description: "<ul><li>Managing a patient load of 30+ per day, focusing on chronic disease management and preventative care.</li><li>Lead the department's transition to a new Electronic Health Records (EHR) system.</li><li>Mentoring junior residents and medical students during clinical rotations.</li></ul>"
            },
            {
                title: "Emergency Room Physician",
                company: "St. Jude Clinic",
                location: "Barcelona, Spain",
                startYear: "2011",
                endYear: "2015",
                description: "<ul><li>Provided acute care in a high-volume emergency department.</li><li>Stabilized critically ill patients and coordinated multi-disciplinary care teams.</li></ul>"
            }
        ],
        education: [
            {
                school: "Universidad Complutense de Madrid",
                degree: "Doctor of Medicine (MD)",
                field: "General Medicine",
                startYear: "2004",
                endYear: "2010"
            }
        ],
        skills: [
            { name: "Clinical Diagnosis", level: 5 },
            { name: "Emergency Care", level: 5 },
            { name: "Patient Communication", level: 5 },
            { name: "EHR Management", level: 4 }
        ],
        languages: [{ name: "Spanish", level: 5 }, { name: "English", level: 4 }],
        projects: [{ title: "Community Vaccination Drive", description: "Liaised with local authorities to immunize over 5,000 residents." }],
        interests: ["Medical Research", "Hiking", "Opera"],
        certifications: [{ name: "Board Certified in Internal Medicine", issuer: "Spanish Medical Board", year: "2012" }]
    },
    hospitality: {
        personal: {
            name: "Marco Rossi",
            profession: "Executive Chef",
            city: "Florence",
            country: "Italy",
            phone: "+39 055 1234567",
            email: "marco.rossi@ristorante-premium.it",
            photo: "https://i.pravatar.cc/150?u=marco",
            linkedin: "linkedin.com/in/marcorossi-chef",
            website: "chefmarcorossi.it"
        },
        summary: "<p>Creative and passionate <strong>Executive Chef</strong> with 15+ years of experience in Michelin-starred kitchens across Europe and North America. Specialized in modern Italian cuisine, sustainable farm-to-table concepts, and high-volume fine dining management. Proven leadership in mentoring culinary teams and designing profitable, award-winning menus.</p>",
        experience: [
            {
                title: "Executive Chef",
                company: "Ristorante Bella Vista",
                location: "Florence, Italy",
                startYear: "2018",
                isCurrent: true,
                description: "<ul><li>Earned two Michelin stars in the 2021 guide for innovative menu design and technical execution.</li><li>Direct a kitchen brigade of 35 staff members, ensuring culinary excellence and overseeing a $4M annual food budget.</li><li>Developed strong relationships with local Tuscan farmers to source 95% of ingredients within a 50km radius, heavily reducing the carbon footprint.</li><li>Reduced food waste by 30% through comprehensive inventory management and nose-to-tail culinary techniques.</li></ul>"
            },
            {
                title: "Chef de Cuisine",
                company: "Le Cirque",
                location: "New York, NY",
                startYear: "2014",
                endYear: "2018",
                description: "<ul><li>Managed daily kitchen operations at a high-volume flagship restaurant serving up to 500 covers per dinner service.</li><li>Created 40+ seasonal specials that increased average check size by 18% over a three-year period.</li><li>Trained and mentored 15 junior sous chefs, 5 of whom went on to become head chefs in major metropolitan cities.</li><li>Collaborated directly with the Sommelier to design intricate 7-course tasting menus with paired international wines.</li></ul>"
            },
            {
                title: "Sous Chef",
                company: "Trattoria Milano",
                location: "Milan, Italy",
                startYear: "2010",
                endYear: "2014",
                description: "<ul><li>Assisted the Executive Chef in daily prep, line cooking, and expediting during peak service hours.</li><li>Managed the pasta and sauce station, manually rolling fresh pasta daily for 200+ guests.</li><li>Conducted weekly sanitation and safety audits, maintaining a perfect health inspection record for 4 consecutive years.</li></ul>"
            }
        ],
        education: [
            {
                school: "ALMA International School of Italian Cuisine",
                degree: "Master of Italian Cuisine",
                field: "Culinary Arts",
                startYear: "2008",
                endYear: "2010",
                description: "<p>Graduated with Highest Honors. Intensive training in regional Italian culinary traditions, advanced plating techniques, and kitchen economics.</p>"
            },
            {
                school: "University of Gastronomic Sciences",
                degree: "Bachelor Degree",
                field: "Food Science and Culture",
                startYear: "2004",
                endYear: "2008",
                description: "<p>Studied food anthropology, sustainable agriculture, and the global supply chain.</p>"
            }
        ],
        skills: [
            { name: "Menu Development & Costing", level: 5 },
            { name: "High-Volume Fine Dining", level: 5 },
            { name: "Kitchen Team Leadership", level: 5 },
            { name: "Farm-to-Table Sourcing", level: 5 },
            { name: "P&L Management", level: 4 },
            { name: "Food Safety & Sanitation (HACCP)", level: 5 }
        ],
        languages: [
            { name: "Italian", level: 5 },
            { name: "English", level: 5 },
            { name: "French", level: 4 }
        ],
        projects: [
            {
                title: "Zero Waste Initiative",
                technologies: ["Sustainability", "Inventory Software"],
                description: "<p>Spearheaded a whole-restaurant zero-waste program, utilizing fermentation and composting to reduce total landfill contribution by 85%.</p>"
            },
            {
                title: "Guest Chef Pop-Up",
                technologies: ["Event Planning", "Marketing"],
                description: "<p>Organized a highly successful 3-week pop-up restaurant in Tokyo, introducing modern Tuscan cuisine to the Japanese culinary elite.</p>"
            }
        ],
        interests: ["Wine Collecting", "Coastal Fishing", "History of Art", "Foraging", "Food Photography"],
        certifications: [
            { name: "Advanced Food Safety Certification", issuer: "European Food Safety Authority", year: "2019" },
            { name: "Level 2 Sommelier", issuer: "Court of Master Sommeliers", year: "2016" }
        ]
    },
    trades: {
        personal: {
            name: "David Miller",
            profession: "Master Electrician",
            city: "Melbourne",
            country: "Australia",
            phone: "+61 3 9000 0000",
            email: "david.elec@melb-trades.com.au",
            photo: "https://i.pravatar.cc/150?u=david_miller",
            linkedin: "linkedin.com/in/david-miller-elec",
            website: "davidmiller-electrical.com.au"
        },
        summary: "<p>Safety-focused <strong>Master Electrician</strong> with 12+ years of experience in residential, commercial, and industrial electrical systems. Expert in complex wiring, home automation, and large-scale solar integrations. Known for leading cross-functional teams on high-stakes infrastructure projects while maintaining a flawless safety record.</p>",
        experience: [
            {
                title: "Senior Site Electrician",
                company: "Melbourne Electrical Solutions",
                location: "Melbourne, VIC",
                startYear: "2016",
                isCurrent: true,
                description: "<ul><li>Lead electrical contractor for a $50M residential project, managing a team of 10 sparkies.</li><li>Implemented smart home automation systems (C-Bus, KNX) for 100+ luxury apartments, increasing property value by 5%.</li><li>Maintained a 100% safety record with no reported incidents over 6 years through rigorous OHS audits and daily toolbox talks.</li><li>Reduced project material waste by 15% through precision planning and strategic vendor negotiations.</li></ul>"
            },
            {
                title: "Industrial Electrician",
                company: "Oz Mining Ltd.",
                location: "Perth, WA",
                startYear: "2010",
                endYear: "2016",
                description: "<ul><li>Maintained and repaired heavy mining machinery electrical components operating in extreme environmental conditions.</li><li>Executed large-scale solar array installations in remote Outback locations, providing sustainable power to extraction sites.</li><li>Conducted preventative maintenance on high-voltage switchgear, reducing unscheduled downtime by 20%.</li></ul>"
            },
            {
                title: "Apprentice Electrician",
                company: "Sparky & Sons",
                location: "Geelong, VIC",
                startYear: "2006",
                endYear: "2010",
                description: "<ul><li>Assisted master electricians in residential wiring, fault finding, and switchboard upgrades.</li><li>Completed 4-year apprenticeship program, graduating at the top of the TAFE class.</li><li>Gained hands-on experience with modern test equipment and the latest Wiring Rules (AS/NZS 3000).</li></ul>"
            }
        ],
        education: [
            {
                school: "TAFE Victoria",
                degree: "Certificate III in Electrotechnology",
                field: "Electrotechnology",
                startYear: "2006",
                endYear: "2010",
                description: "<p>Comprehensive training in electrical theory, practical wiring, and safety standards. Awarded 'Apprentice of the Year' in 2009.</p>"
            },
            {
                school: "Holmesglen Institute",
                degree: "Diploma of Electrical Engineering",
                field: "Engineering",
                startYear: "2016",
                endYear: "2018",
                description: "<p>Advanced studies in power systems, programmable logic controllers (PLCs), and energy management.</p>"
            }
        ],
        skills: [
            { name: "Industrial Wiring", level: 5 },
            { name: "Solar Integration", level: 5 },
            { name: "Fault Diagnosis", level: 5 },
            { name: "Project Management", level: 4 },
            { name: "Home Automation (KNX/C-Bus)", level: 4 },
            { name: "OHS Compliance", level: 5 }
        ],
        certifications: [
            { name: "A-Grade Electrical License", issuer: "EnergySafe Victoria", year: "2010" },
            { name: "Clean Energy Council Accredited Installer", issuer: "CEC", year: "2017", description: "<p>Certified for grid-connected variable solar PV systems.</p>" },
            { name: "First Aid & CPR", issuer: "St John Ambulance", year: "2023" }
        ],
        projects: [
            {
                title: "Smart Grid Retrofit",
                technologies: ["SCADA", "KNX", "Solar PV"],
                description: "<p>Led the retrofitting of a 50-year-old commercial building with a modern smart grid system, reducing its carbon footprint by 30% and cutting energy costs by $15k annually.</p>"
            },
            {
                title: "Remote Mining Solar Array",
                technologies: ["High Voltage", "Inverters", "Off-grid Systems"],
                description: "<p>Designed and supervised the installation of a 500kW off-grid solar and battery storage system for a remote mining camp in Western Australia.</p>"
            }
        ],
        languages: [{ name: "English", level: 5 }],
        interests: ["Surfing", "Restoring Classic Cars", "BBQ", "Home Brewing", "Camping"],
        education: [
            {
                school: "University of Texas at Austin",
                degree: "Bachelor of Science",
                field: "Public Relations and Digital Media",
                startYear: "2012",
                endYear: "2016",
                description: "<p>Graduated with Honors. Focus on Digital Marketing, Consumer Behavior, and Visual Storytelling. Vice President of the PR Student Society.</p>"
            },
            {
                school: "General Assembly",
                degree: "Bootcamp Certificate",
                field: "Data Analytics for Marketing",
                startYear: "2020",
                endYear: "2020",
                description: "<p>10-week intensive course focusing on interpreting marketing data using SQL and visual analytics tools.</p>"
            }
        ],
        skills: [
            { name: "Short-form Video Production", level: 5 },
            { name: "Data Analytics (Sprout Social, Google Analytics)", level: 4 },
            { name: "Influencer Marketing & Negotiations", level: 5 },
            { name: "Brand Voice Definition", level: 5 },
            { name: "Copywriting", level: 4 },
            { name: "Paid Social (Meta Ads, TikTok Ads)", level: 4 }
        ],
        languages: [
            { name: "English", level: 5 },
            { name: "Spanish", level: 5 }
        ],
        software: [
            { name: "CapCut & Final Cut Pro", rating: 5 },
            { name: "Adobe Creative Cloud", rating: 4 },
            { name: "Canva Pro", rating: 5 },
            { name: "Sprout Social / Hootsuite", rating: 5 }
        ],
        projects: [
            {
                title: "The #GlowUp Challenge",
                technologies: ["TikTok", "Influencer Sourcing", "UGC"],
                description: "<p>Conceived and executed a viral hashtag challenge for a beauty brand that accumulated over 50 million views and led to a complete sell-out of the featured product line within a week.</p>"
            },
            {
                title: "B2B LinkedIn Revival",
                technologies: ["LinkedIn Analytics", "Content Strategy"],
                description: "<p>Transitioned a boring corporate FinTech LinkedIn page into a thought-leadership hub, boosting organic lead generation by 45% in one quarter.</p>"
            }
        ],
        strengths: [
            { name: "Trend Forecasting", level: 5 },
            { name: "Creative Direction", level: 4 },
            { name: "Agile Execution", level: 5 }
        ],
        interests: ["Vlogging", "Indie Music Festivals", "Boutique Coffee Culture", "Thrifting", "Interior Design"],
        volunteering: [
            { organization: "Austin Pets Alive!", role: "Social Media Volunteer", startDate: "2019", isCurrent: true, description: "<p>Creating engaging reels to help long-stay shelter animals get adopted, contributing to a 20% increase in monthly adoptions.</p>" }
        ]
    },
    // Adding highly-needed Executive profile for premium templates
    executive: {
        personal: {
            photo: "https://i.pravatar.cc/150?u=exec_richard",
            name: "Richard Montgomery",
            profession: "Chief Operating Officer",
            city: "New York",
            state: "NY",
            country: "USA",
            phone: "+1 (212) 555-0198",
            email: "r.montgomery@fortune-corp.com",
            linkedin: "linkedin.com/in/rmontgomery-exec",
            website: "montgomery-consulting.com",
        },
        summary: "<p>Visionary <strong>Chief Operating Officer</strong> with 20+ years of experience driving multi-billion dollar growth for Fortune 500 enterprises. Expert in scaling global operations, leading M&A integrations, and orchestrating digital transformation strategies that increase shareholder value by over 40%.</p>",
        experience: [
            {
                title: "Chief Operating Officer",
                company: "Global Logistics Corp",
                location: "New York, NY",
                startYear: "2018",
                isCurrent: true,
                description: "<ul><li>Spearheaded a global restructuring initiative that reduced overhead by $50M while increasing operational efficiency across 4 continents.</li><li>Led the successful acquisition and integration of three regional competitors, expanding market share by 25% within 24 months.</li><li>Architected a new data-driven supply chain model that improved delivery speed by 30% and reduced carbon footprint by 15%.</li></ul>"
            },
            {
                title: "VP of Operations",
                company: "TechNexus Systems",
                location: "Palo Alto, CA",
                startYear: "2012",
                endYear: "2018",
                description: "<ul><li>Managed a $500M annual budget and a cross-functional team of 1,200 employees across R&D, Manufacturing, and Sales.</li><li>Implemented Lean Six Sigma methodologies that reduced manufacturing defects by 45% and improved gross margins by 8 points.</li><li>Successfully launched 12 major product lines into international markets, generating over $2B in cumulative revenue.</li></ul>"
            }
        ],
        education: [
            {
                school: "Harvard Business School",
                degree: "Master of Business Administration (MBA)",
                field: "Strategic Management",
                startYear: "2002",
                endYear: "2004",
                description: "<p>Baker Scholar (Top 5% of class). Specialized in International Trade and Organizational Leadership.</p>"
            }
        ],
        skills: [
            { name: "Executive Leadership", level: 5 },
            { name: "Strategic Planning", level: 5 },
            { name: "P&L Management", level: 5 },
            { name: "M&A Integration", level: 5 },
            { name: "Operational Excellence", level: 5 }
        ],
        certifications: [
            { name: "Wharton Executive Leadership Program", issuer: "University of Pennsylvania", year: "2015" }
        ],
        software: [
            { name: "SAP S/4HANA", rating: 5 },
            { name: "Salesforce CRM", rating: 5 },
            { name: "Oracle NetSuite", rating: 4 }
        ],
        interests: ["Sailing", "Philanthropy", "Classical Music", "Fine Arts Advisory"],
        strengths: [{ name: "Visionary Strategy", level: 5 }, { name: "Crisis Management", level: 5 }]
    }
};

/**
 * Returns a stable mock profile based on the template ID and its tags.
 * This ensures different templates show different people, even in the same category.
 */
export const getMockDataForTemplate = (template) => {
    if (!template) return MOCK_PROFILES.tech;

    const allKeys = Object.keys(MOCK_PROFILES);
    const tags = template.tags || [];

    // 1. Determine a "Seed" from the template ID
    // We use a simple hash to pick a random profile if no tag matches, 
    // or to pick a specific variation within a tag group.
    const getHash = (str) => {
        let hash = 0;
        if (!str) return 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash |= 0;
        }
        return Math.abs(hash);
    };

    const idToHash = template.id || template.name || "default";
    const seed = getHash(idToHash);

    // 2. Define "Bucket" probabilities based on tags
    // We filter these against allKeys to ensure we never return undefined.
    const getProfileFromBucket = (primaryKeys) => {
        const validKeys = primaryKeys.filter(key => allKeys.includes(key));
        const targetKeys = validKeys.length > 0 ? validKeys : ["tech", "modern", "creative"];
        const index = seed % targetKeys.length;
        return MOCK_PROFILES[targetKeys[index]] || MOCK_PROFILES.tech;
    };

    const techKeys = ["tech", "modern"];
    const execKeys = ["executive", "modern"];
    const creativeKeys = ["creative", "hospitality"];
    const classicKeys = ["executive", "modern", "medical", "trades"];

    if (tags.includes("Executive") || tags.includes("Corporate") || tags.includes("Professional")) {
        return getProfileFromBucket(execKeys);
    }
    if (tags.includes("Creative") || tags.includes("Artistic")) {
        return getProfileFromBucket(creativeKeys);
    }
    if (tags.includes("Modern") || tags.includes("Tech")) {
        return getProfileFromBucket(techKeys);
    }
    if (tags.includes("Academic") || tags.includes("Classic")) {
        return getProfileFromBucket(classicKeys);
    }

    // Default: Return a random profile but ensure it exists
    return MOCK_PROFILES[allKeys[seed % allKeys.length]] || MOCK_PROFILES.tech;
};
