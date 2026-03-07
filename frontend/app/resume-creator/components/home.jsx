import React, { useState } from "react";
import { motion } from "framer-motion";
import { FilePlus, Sparkles, ArrowRight } from "lucide-react";
import "./home.css";

export default function Home({ onStart }) {
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const fileInputRef = React.useRef(null);

  const handleCreate = () => {
    onStart("new");
  };

  const handleImprove = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setLoadingText("Uploading resume...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Mocking for now to avoid auth issues if not logged in
      // In a real scenario, this would be a fetch call to /api/resumes/upload
      /*
      const response = await fetch("/api/resumes/upload", {
        method: "POST",
        body: formData,
        // headers: { "Authorization": `Bearer ${token}` }
      });
      const result = await response.json();
      */

      // Simulated wait for AI analysis
      setTimeout(() => setLoadingText("AI Analyzing professional profile..."), 1000);
      setTimeout(() => setLoadingText("Extracting structure and skills..."), 2000);
      setTimeout(() => setLoadingText("Mapping to elite templates..."), 3000);

      setTimeout(() => {
        setLoading(false);
        // We simulate parsed data for standard Zety-like greeting
        const simulatedParsedData = {
          personal: {
            name: "ARNAV",
            profession: "Developer at MomentClock",
            email: "", // Test missing case
            phone: "+91 9876543210",
            city: "Delhi",
            country: "India"
          },
          summary: "Experienced Developer focusing on creating engaging web applications and scalable backend systems.",
          skills: ["React.js", "Express.js", "Node.js", "MongoDB", "TypeScript", "AWS", "CCNA", "Docker", "Kubernetes", "Redis", "GraphQL", "Tailwind CSS"],
          experience: [
            { title: "Developer", company: "MomentClock", date: "2023 - Present", description: "Focused on creating engaging web applications." }
          ],
          education: [
            { degree: "B.Tech in Computer Science", institution: "IIT Delhi", year: "2019 - 2023" }
          ],
          certifications: ["AWS Certified Developer", "CCNA"]
        };

        onStart("improve", simulatedParsedData);
      }, 4000);

    } catch (error) {
      console.error("Upload failed", error);
      setLoading(false);
      alert("Analysis failed. Starting fresh.");
      onStart("new");
    }
  };

  return (
    <div className="home-container">
      <div className="grid-bg"></div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
      />

      {loading && (
        <div className="loader-overlay">
          <div className="spinner"></div>
          <p style={{ fontFamily: 'Inter', color: '#0a2540', fontWeight: 600 }}>{loadingText}</p>
        </div>
      )}

      <div className="content-box">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#635bff', letterSpacing: '0.15em', marginBottom: '20px', textTransform: 'uppercase' }}>
            RESUME ARCHITECT
          </div>
          <h1 className="hero-title">
            Build a resume that <br />
            <span>commands attention.</span>
          </h1>
          <p className="hero-subtitle">
            Our intelligent resume system analyzes industry standards to structure your
            experience for maximum impact. Professional, precise, and optimized for elite roles.
          </p>
        </motion.header>

        <div className="action-cards">
          {/* Action 1: Create */}
          <motion.div
            className="action-card"
            onClick={handleCreate}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <div className="icon-box">
              <FilePlus size={28} />
            </div>
            <div className="card-info">
              <h3 className="card-title">Architect New</h3>
              <p className="card-desc">Start from scratch with our modular system designed for modern ATS requirements.</p>
            </div>
            <div className="card-btn">
              <span>Start Building</span>
              <ArrowRight size={18} />
            </div>
          </motion.div>

          {/* Action 2: Improve */}
          <motion.div
            className="action-card"
            onClick={handleImprove}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{ background: '#f6f9fc' }}
          >
            <div className="icon-box" style={{ background: '#fff' }}>
              <Sparkles size={28} style={{ color: '#635bff' }} />
            </div>
            <div className="card-info">
              <h3 className="card-title">Optimize Existing</h3>
              <p className="card-desc">Upload your current resume and let our system refine the structure and visual hierarchy.</p>
            </div>
            <div className="card-btn">
              <span>Analyze Profile</span>
              <ArrowRight size={18} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}