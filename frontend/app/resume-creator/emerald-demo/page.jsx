"use client";
import React, { useState } from 'react';
// import EmeraldTimeline from '../templates/EmeraldTimeline/EmeraldTimeline';
const EmeraldTimeline = () => null;

// Stress test data for pagination/continuation
const mockData = {
    personal: {
        name: "Alex Dev",
        profession: "Senior Software Engineer",
        email: "alex.dev@example.com",
        phone: "+1 (555) 123-4587",
        address: "San Francisco, CA",
        photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex"
    },
    summary: "Experienced software engineer with a passion for building scalable web applications and intuitive user interfaces. Proven track record of delivering high-quality code in fast-paced environments. Expert in React, Node.js, and modern frontend architectures. Highly skilled in cloud infrastructure and DevOps practices.",
    experience: [
        {
            company: "Tech Giant Inc.",
            role: "Senior Frontend Engineer",
            startYear: "2020",
            endYear: "Present",
            isCurrent: true,
            location: "San Francisco, CA",
            description: "<ul><li>Lead a team of 10 developers to build a high-performance dashboard using React and Redux.</li><li>Optimized runtime performance by 40% through code splitting and memoization.</li><li>Implemented a custom design system used across 5 different product lines.</li><li>Mentored junior engineers and conducted weekly tech talks on modern web standards.</li><li>Architected a micro-frontend solution to decouple legacy monolithic application.</li></ul>"
        },
        {
            company: "Innovative Startup",
            role: "Software Engineer",
            startYear: "2017",
            endYear: "2020",
            location: "Austin, TX",
            description: "<ul><li>Developed and maintained a real-time analytics platform using Node.js and Socket.io.</li><li>Integrated third-party APIs for seamless data synchronization.</li><li>Wrote comprehensive unit and integration tests using Jest and Cypress.</li><li>Reduced cloud infrastructure costs by 20% by optimizing AWS Lambda functions.</li><li>Collaborated with designers to ensure pixel-perfect implementation of UI components.</li></ul>"
        },
        {
            company: "Growth Phase Corp",
            role: "Junior Web Developer",
            startYear: "2015",
            endYear: "2017",
            location: "Remote",
            description: "<ul><li>Assisted in the development of a customer-facing e-commerce site using Vue.js.</li><li>Collaborated with backend engineers to define and consume RESTful APIs.</li><li>Implemented responsive design patterns to ensure compatibility across mobile and desktop.</li><li>Improved SEO rankings by 15% through optimized semantic HTML and meta-data.</li></ul>"
        }
    ],
    education: [
        {
            institution: "University of Technology",
            degree: "Master of Science",
            field: "Computer Science",
            startYear: "2013",
            endYear: "2015",
            location: "Cambridge, MA"
        },
        {
            school: "State University",
            degree: "Bachelor of Science",
            field: "Information Systems",
            startYear: "2009",
            endYear: "2013",
            location: "Austin, TX"
        }
    ],
    skills: [
        { name: "JavaScript (ES6+)", level: 5 },
        { name: "React & Redux", level: 5 },
        { name: "Node.js", level: 4 },
        { name: "TypeScript", level: 4 },
        { name: "HTML5 & CSS3", level: 5 },
        { name: "Python", level: 3 },
        { name: "Docker", level: 4 },
        { name: "AWS", level: 3 },
        { name: "Git & CI/CD", level: 5 },
        { name: "Agile Methodologies", level: 4 }
    ],
    interests: ["Open Source", "Hiking", "Photography", "Chess", "Travel"],
    languages: [
        { name: "English", level: "Native" },
        { name: "Spanish", level: "Fluent" }
    ],
    certifications: [
        { name: "AWS Certified Solutions Architect", date: "2022" },
        { name: "Professional Scrum Master", date: "2021" }
    ],
    mainSectionsOrder: ['summary', 'experience', 'skills', 'education', 'interests', 'languages', 'certifications']
};

export default function EmeraldDemoPage() {
    const [data, setData] = useState(mockData);
    const [showPageBreaks, setShowPageBreaks] = useState(true);

    const handleReorder = (newOrders) => {
        setData(prev => ({
            ...prev,
            ...newOrders
        }));
    };

    return (
        <div style={{ padding: '20px', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>EmeraldTimeline Template Demo</h1>
                    <button
                        onClick={() => setShowPageBreaks(!showPageBreaks)}
                        style={{ padding: '8px 16px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        {showPageBreaks ? "Show Full Layout" : "Show Page Breaks"}
                    </button>
                </div>

                <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                    <EmeraldTimeline
                        data={data}
                        showPageBreaks={showPageBreaks}
                        onReorder={handleReorder}
                        scale={0.8}
                    />
                </div>
            </div>
        </div>
    );
}
