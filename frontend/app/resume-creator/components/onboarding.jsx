import React, { useState, useRef, useEffect, useMemo } from "react";
import ResumyLogo from './Logo';
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { supabaseClient } from "@/lib/supabaseClient";
import {
  GraduationCap, Briefcase, FileText,
  Image as ImageIcon, Sparkles, Check,
  ArrowRight, ArrowLeft, ChevronRight, LayoutTemplate,
  Cpu, PenTool, Wand2, LogOut, Layout, Star,
  Search, SlidersHorizontal, LayoutGrid, Info,
  Award, Rocket, Zap, Target, Lock, X, CheckCircle2, Trash2, Plus,
  MoreHorizontal, Edit2, CheckCircle, Brain
} from "lucide-react";
import { useAuth } from "@/lib/authContext";
import { useAnalytics } from "@/lib/analytics";
import { UnderlineDoodle, SparkleDoodle, ScribbleDoodle, HighlightDoodle, StarDoodle, BoxDoodle, CurvyArrowDoodle, ZigZagDoodle, BurstDoodle, SparkleDoodle as Sparkle } from "@/components/landing-redesign/DoodleAnimations";
import "./onboarding.css";

// --- CONFIG & DATA ---
import { templatesConfig } from "../templates/TemplateManager";
import TemplatePreview from "./TemplatePreview";
import AIGreeting from "./AIGreeting";
import ResumeCreatorArt from "@/components/landing-redesign/features/ResumeCreatorArt";
import InputStoryArt from "./InputStoryArt";
import RefineReorderArt from "./RefineReorderArt";
import StyleExportArt from "./StyleExportArt";
import FunLoader from "./FunLoader";
import PremiumTemplateSelection from "./PremiumTemplateSelection";

// --- CONSTANTS ---
const STEPS = {
  WELCOME: "welcome",
  PROJECTS: "projects",
  PROJECT_DETAILS: "project_details", // New step for naming the project
  SOURCE_CHOICE: "source_choice",     // New step for choosing AI vs Scratch
  SOURCE_SELECTION: "source_selection",
  ANALYZE: "analyze",
  ROLE: "role",
  DEGREE: "degree",
  LAYOUT: "layout",
  PHOTO: "photo",
  THEME: "theme",
  SELECTION: "selection",
};

// --- DATA REFORMATTING HELPER ---
// --- DATA REFORMATTING HELPER ---
const reformatResumeData = (parsedData, resumeId = null) => {
  const personalSource = parsedData.personal || parsedData;
  // Strictly extra content fields, excluding metadata like title/template/step
  return {
    resume_id: resumeId,
    personal: {
      name: personalSource.name || personalSource.full_name || "",
      email: personalSource.email || "",
      phone: personalSource.phone || "",
      profession: personalSource.profession || (parsedData.experience?.[0]?.title) || "",
      linkedin: personalSource.linkedin || "",
      github: personalSource.github || "",
      website: personalSource.website || "",
      city: personalSource.city || "",
      country: personalSource.country || "",
      state: personalSource.state || "",
      zipCode: personalSource.zipCode || personalSource.pincode || "",
      dob: personalSource.dob || "",
      nationality: personalSource.nationality || "",
      maritalStatus: personalSource.maritalStatus || "",
      visaStatus: personalSource.visaStatus || "",
      gender: personalSource.gender || "",
      religion: personalSource.religion || "",
      passport: personalSource.passport || "",
      otherPersonal: personalSource.otherPersonal || "",
    },
    summary: parsedData.summary || "",
    skills: Array.isArray(parsedData.skills) ? parsedData.skills.map(s =>
      typeof s === 'string' ? { name: s, level: 3 } : s
    ) : [],
    strengths: Array.isArray(parsedData.strengths) ? parsedData.strengths : [],
    languages: Array.isArray(parsedData.languages) ? parsedData.languages : [],
    software: Array.isArray(parsedData.software) ? parsedData.software : [],
    experience: Array.isArray(parsedData.experience) ? parsedData.experience.map(e => ({
      title: e.title || "",
      company: e.company || "",
      location: e.location || "",
      isRemote: !!e.isRemote,
      startMonth: e.startMonth || "",
      startYear: e.startYear || "",
      isCurrent: !!e.isCurrent,
      endMonth: e.endMonth || "",
      endYear: e.endYear || "",
      description: e.description || ""
    })) : [],
    education: Array.isArray(parsedData.education) ? parsedData.education.map(ed => ({
      degree: ed.degree || "",
      school: ed.school || "",
      city: ed.city || "",
      field: ed.field || "",
      grade: ed.grade || "",
      startMonth: ed.startMonth || "",
      startYear: ed.startYear || "",
      endMonth: ed.endMonth || "",
      endYear: ed.endYear || "",
      description: ed.description || ""
    })) : [],
    projects: Array.isArray(parsedData.projects) ? parsedData.projects.map(p => ({
      title: p.name || p.title || "",
      description: p.description || "",
      technologies: Array.isArray(p.technologies) ? p.technologies : [],
      startYear: p.startYear || "",
      endYear: p.endYear || "",
      isCurrent: !!p.isCurrent,
      link: p.url || p.link || ""
    })) : [],
    certifications: Array.isArray(parsedData.certifications) ? parsedData.certifications : [],
    keyAchievements: Array.isArray(parsedData.keyAchievements) ? parsedData.keyAchievements : [],
    affiliations: Array.isArray(parsedData.affiliations) ? parsedData.affiliations : [],
    interests: Array.isArray(parsedData.interests) ? parsedData.interests : [],
    additionalInfo: parsedData.additionalInfo || "",
    awards: Array.isArray(parsedData.awards) ? parsedData.awards : [],
    initial_analysis: parsedData.initial_analysis || {
      sections_found: [],
      strengths: [],
      improvements: []
    },
    references: Array.isArray(parsedData.references) ? parsedData.references : [],
    accomplishments: Array.isArray(parsedData.accomplishments) ? parsedData.accomplishments : [],
    websites: Array.isArray(parsedData.websites) ? parsedData.websites : [],
    customSection: parsedData.customSection || { title: "", description: "" },
    designSettings: {
      fontSize: 1,
      fontFamily: undefined,
      sectionSpacing: 1,
      paragraphSpacing: 1,
      lineHeight: 1.5,
      letterSpacing: 0,
      pageMargin: 40,
    },
    visitedSections: {}
  };
};
// --- SUB-COMPONENTS ---

const PromoBanner = () => {
  const { trackEvent } = useAnalytics();
  return (
    <div className="relative w-full overflow-hidden rounded bg-indigo-600 p-12 text-white mb-20 shadow-md">
      <div className="relative z-10 max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded text-[10px] font-bold uppercase tracking-widest">Premium Collection</div>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight" style={{ fontFamily: 'Outfit' }}>
          Increase interview callbacks by <span className="text-indigo-100">300%</span> with professional themes.
        </h2>
        <p className="text-indigo-100 font-medium text-lg mb-10 leading-relaxed">
          Our designs align with industry standards, built from successful professional applications.
        </p>
        <button
          onClick={() => {
            trackEvent('promo_banner_click', 'Clicked Analyze Pro Analytics', { is_premium_intent: true });
            if (typeof window !== 'undefined') window.open('/pricing', '_blank');
          }}
          className="bg-white text-indigo-600 px-8 py-4 rounded font-bold text-sm flex items-center gap-3 hover:bg-slate-50 transition-colors shadow-sm"
        >
          Explore Pro Themes <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

const StoryReel = ({ title, slogan, templates, onSelect, data, icon: Icon }) => (
  <div className="mb-32 last:mb-0">
    <div className="flex items-end justify-between mb-12 px-2">
      <div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-indigo-50 rounded flex items-center justify-center text-indigo-600 shadow-sm">
            <Icon size={24} strokeWidth={2.5} />
          </div>
          <span className="text-[10px] font-bold text-indigo-600 tracking-[0.2em] uppercase">Curated Collection</span>
        </div>
        <h2 className="text-6xl font-black text-stone-900 tracking-tighter leading-none mb-6" style={{ fontFamily: 'Outfit' }}>{title}</h2>
        <p className="text-stone-400 font-bold text-xl max-w-xl leading-snug">{slogan}</p>
      </div>
      <div className="hidden md:flex items-center gap-3 text-stone-300 font-bold text-sm bg-stone-50 px-5 py-2 rounded-none border border-stone-100">
        <SlidersHorizontal size={14} /> Drag to explore
      </div>
    </div>

    <div className="flex gap-10 overflow-x-auto pb-12 scrollbar-hide snap-x px-2 -mx-2">
      {templates.map((t, idx) => (
        <div key={t.id} className="min-w-[380px] snap-start">
          <PremiumTemplateCard
            t={t}
            isSelected={false}
            onSelect={onSelect}
            data={data}
          />
        </div>
      ))}
    </div>
  </div>
);

const PremiumTemplateCard = ({ t, i, isSelected, onSelect, data }) => {
  const isPremium = t.tags?.includes("Premium");

  return (
    <div
      className={`group relative flex flex-col transition-all duration-500
              ${isSelected
          ? 'ring-4 ring-violet-500/10'
          : 'hover:translate-y-[-12px]'
        }
          `}
      onClick={() => onSelect(t)}
    >
      <div className={`relative w-full aspect-[210/297] bg-white overflow-hidden shadow-sm transition-all duration-500 rounded-sm
              ${isSelected
          ? 'shadow-[20px_40px_80px_rgba(124,58,237,0.1)] ring-2 ring-violet-500'
          : 'group-hover:shadow-[20px_50px_100px_rgba(0,0,0,0.08)] border border-stone-100'
        }
          `}>
        <div className="absolute inset-0 z-0 scale-[1.01]">
          <div className="w-full h-full transform transition-transform duration-700 group-hover:scale-105">
            <TemplatePreview
              templateId={t.id}
              data={{
                ...data,
                themeColor: t.recommendedColors?.[0] || "#3b82f6"
              }}
            />
          </div>
        </div>

        <div className="absolute inset-0 z-10 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="absolute top-6 right-6 z-20 flex flex-col gap-3">
          {isPremium && (
            <div className="bg-violet-600 text-white text-[10px] font-black px-4 py-2 rounded-none flex items-center gap-2 shadow-2xl shadow-violet-500/40 border border-violet-400/30 backdrop-blur-md">
              <Sparkles size={12} fill="currentColor" /> PRO
            </div>
          )}
        </div>

        <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
          <div className="bg-white text-stone-900 rounded-none px-8 py-4 font-black text-sm flex items-center gap-3 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 shadow-2xl scale-90 group-hover:scale-100" style={{ fontFamily: 'Outfit' }}>
            {isPremium ? <Lock size={16} className="text-violet-600" /> : <LayoutTemplate size={16} className="text-violet-600" />}
            {isSelected ? "Selected" : "Preview Design"}
          </div>
        </div>
      </div>

      <div className="mt-8 px-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-black text-stone-900 tracking-tight transition-colors group-hover:text-violet-600" style={{ fontFamily: 'Outfit' }}>
            {t.name}
          </h3>
          <div className="flex gap-2">
            {t.recommendedColors?.slice(0, 3).map((c, idx) => (
              <div key={idx} className="w-3.5 h-3.5 rounded-none border border-black/5 shadow-inner" style={{ background: c }} />
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {t.tags?.slice(0, 2).map((tag, idx) => (
            <span key={idx} className="text-[10px] font-black text-stone-400 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-100 uppercase tracking-widest">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};



export default function Onboarding({ onComplete, onBack, mode = "new", data = {}, onUpdateData }) {
  const { trackEvent } = useAnalytics();
  // Navigation State
  const [step, setStep] = useState(STEPS.WELCOME);

  // Initial View Tracking
  useEffect(() => {
    trackEvent('resume_creator_view', 'Resume creator opened', {
      feature_module: 'resume_creator',
      funnel_stage: 'viewed'
    });
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('step') === 'initial') {
        setStep(STEPS.SOURCE_CHOICE);
      } else if (mode === "improve") {
        setStep(STEPS.ANALYZE);
      }
    }
  }, [mode]);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [isExiting, setIsExiting] = useState(false);
  const { userId, userEmail, isAuthenticated } = useAuth();
  const [hoveredStep, setHoveredStep] = useState(null);
  const [drafts, setDrafts] = useState([]);
  const [loadingDrafts, setLoadingDrafts] = useState(false);
  const [renameId, setRenameId] = useState(null);
  const [renamingTitle, setRenamingTitle] = useState("");
  const dropdownRef = useRef(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [selectedDrafts, setSelectedDrafts] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch drafts when user is available
  useEffect(() => {
    if (isAuthenticated) {
      fetchDrafts();
    }
  }, [isAuthenticated]);

  const fetchDrafts = async () => {
    if (!userId) {
      setLoadingDrafts(false);
      return;
    }

    setLoadingDrafts(true);
    try {
      const { data, error } = await supabaseClient
        .from('builder_resumes')
        .select('id, title, template_id, updated_at, data, slot_id, last_step_index, design_settings')
        .eq('profile_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setDrafts(data || []);
    } catch (err) {
      console.error("Error fetching drafts:", err);
    } finally {
      setLoadingDrafts(false);
    }
  };

  const [careerDna, setCareerDna] = useState(null);
  const [isLoadingDna, setIsLoadingDna] = useState(false);

  // Fetch Career DNA on mount
  useEffect(() => {
    if (!isAuthenticated || !userId) return;

    const fetchDna = async () => {
      setIsLoadingDna(true);
      try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        const res = await fetch(`${API_URL}/api/user/career-dna`, {
          headers: { 'Authorization': `Bearer ${session?.access_token}` }
        });
        const data = await res.json();
        if (data && data.career_dna && Object.keys(data.career_dna).length > 2) {
          setCareerDna(data);
        }
      } catch (err) { }
      finally { setIsLoadingDna(false); }
    };
    fetchDna();
  }, [isAuthenticated, userId]);

  const useMasterDna = () => {
    if (!careerDna?.career_dna) return;

    setLoading(true);
    setLoadingText("Waking up your Career DNA...");

    setTimeout(() => {
      const parsedData = careerDna.career_dna;
      const reformatted = reformatResumeData(parsedData, careerDna.master_resume_id);

      // Do NOT auto-populate project title from name if user wants it clean
      // if (reformatted.personal?.name && (!projectTitle || projectTitle === "Untitled Resume")) {
      //   setProjectTitle(`${reformatted.personal.name}'s Resume`);
      // }

      if (onUpdateData) {
        onUpdateData(reformatted);
      }

      trackEvent('resume_creator_use_master_dna', 'Using Career DNA in Resume Creator', {
        feature_module: 'resume_creator',
        metadata: { resumeId: careerDna.master_resume_id }
      });

      setLoading(false);
      nextStep(STEPS.SELECTION); // Skip analyze, go to templates
    }, 1000);
  };

  const handleSelectDraft = (draft) => {
    setIsExiting(true);
    setTimeout(() => {
      let parsedDesign = draft.design_settings;
      if (typeof parsedDesign === 'string') {
        try { parsedDesign = JSON.parse(parsedDesign); } catch (e) { parsedDesign = {}; }
      }

      onComplete({
        ...draft.data,
        builder_resume_id: draft.id,
        template: draft.template_id,
        title: draft.title, // Pass the existing title when resuming
        last_step_index: draft.last_step_index,
        designSettings: parsedDesign
      });
    }, 800);
  };

  const handleSignOut = async () => {
    await supabaseClient.auth.signOut();
    window.location.reload();
  };

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const handleDeleteDraft = async (draftId) => {
    try {
      const { error } = await supabaseClient
        .from('builder_resumes')
        .delete()
        .eq('id', draftId);

      if (error) throw error;

      setDrafts(prev => prev.filter(d => d.id !== draftId));
      setSelectedDrafts(prev => prev.filter(id => id !== draftId));
      setActiveMenuId(null);
      setDeleteConfirmId(null);
    } catch (err) {
      console.error("Error deleting draft:", err);
      alert("Failed to delete draft.");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedDrafts.length === 0) return;

    try {
      const { error } = await supabaseClient
        .from('builder_resumes')
        .delete()
        .in('id', selectedDrafts);

      if (error) throw error;

      setDrafts(prev => prev.filter(d => !selectedDrafts.includes(d.id)));
      setSelectedDrafts([]);
      setIsSelectionMode(false);
      setDeleteConfirmId(null);
    } catch (err) {
      console.error("Error bulk deleting drafts:", err);
      alert("Failed to delete selected drafts.");
    }
  };

  const toggleSelectDraft = (e, draftId) => {
    e.stopPropagation();
    setSelectedDrafts(prev =>
      prev.includes(draftId)
        ? prev.filter(id => id !== draftId)
        : [...prev, draftId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedDrafts.length === drafts.length) {
      setSelectedDrafts([]);
    } else {
      setSelectedDrafts(drafts.map(d => d.id));
    }
  };

  const handleRenameDraft = async (e, draftId) => {
    if (e) e.stopPropagation();
    if (!renamingTitle.trim()) {
      setRenameId(null);
      return;
    }

    try {
      const { error } = await supabaseClient
        .from('builder_resumes')
        .update({ title: renamingTitle })
        .eq('id', draftId);

      if (error) throw error;

      setDrafts(prev => prev.map(d => d.id === draftId ? { ...d, title: renamingTitle } : d));
      setRenameId(null);
      setActiveMenuId(null);
    } catch (err) {
      console.error("Error renaming draft:", err);
      alert("Failed to rename draft.");
    }
  };

  // Loading State for AI Analysis
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const fileInputRef = React.useRef(null);

  // Data State
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    isStudent: false,
    degree: "",
    hasPhoto: true,
    columns: 2,
    stylePreference: "All",
  });

  const [projectTitle, setProjectTitle] = useState("Untitled Resume");
  const [nextStepAfterTitle, setNextStepAfterTitle] = useState(STEPS.SELECTION);
  const [hasNamedProject, setHasNamedProject] = useState(false); // true after PROJECT_DETAILS is submitted

  // --- DISCOVERY DATA ---
  const executiveTemplates = useMemo(() => templatesConfig.filter(t => !t.delisted && t.tags?.includes("Executive")).slice(0, 5), []);
  const creativeTemplates = useMemo(() => templatesConfig.filter(t => !t.delisted && t.tags?.includes("Creative")).slice(0, 5), []);
  const modernTemplates = useMemo(() => templatesConfig.filter(t => !t.delisted && t.tags?.includes("Modern")).slice(0, 5), []);

  const [selectedTemplateObj, setSelectedTemplateObj] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // --- HANDLERS ---
  const handleCardClick = (template) => {
    setSelectedTemplateObj(template);
    setIsPreviewModalOpen(true);

    if (template.tags?.includes("Premium")) {
      trackEvent('premium_template_click', `Clicked premium template: ${template.name}`, {
        is_premium_intent: true
      });
    }
  };

  const handleConfirmTemplate = () => {
    setIsPreviewModalOpen(false);
    setTimeout(() => {
      setSelectedTemplate(selectedTemplateObj.id);

      // Track "Aha" moment when template is confirmed
      trackEvent('resume_template_confirmed', `Confirmed template: ${selectedTemplateObj.name}`, {
        feature_module: 'resume_creator',
        funnel_stage: 'reached_aha',
        is_aha: true
      });

      setIsExiting(true);
      setTimeout(() => {
        onComplete({ ...formData, template: selectedTemplateObj.id });
      }, 800);
    }, 300);
  };

  const handleImprove = () => {
    nextStep(STEPS.SOURCE_SELECTION);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setLoadingText("Uploading resume...");

    try {
      const { data: { session } } = await supabaseClient.auth.getSession();
      const token = session?.access_token;
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

      const formData = new FormData();
      formData.append("file", file);

      // 1. Upload the file
      const response = await fetch(`${backendUrl}/api/resumes/upload`, {
        method: "POST",
        body: formData,
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const { resume_id } = await response.json();
      setLoadingText("AI Analyzing professional profile...");

      // 2. Poll for the result
      let attempts = 0;
      const maxAttempts = 50; // 100 seconds total
      let parsedData = null;

      while (attempts < maxAttempts) {
        attempts++;
        try {
          const statusRes = await fetch(`${backendUrl}/api/resumes/${resume_id}`, {
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });

          if (statusRes.ok) {
            const resume = await statusRes.json();

            // Wait for explicit 'completed' status
            if (resume.status === 'completed' && resume.parsed_json) {
              parsedData = resume.parsed_json;
              break;
            }

            // Handle failure
            if (resume.status === 'failed') {
              throw new Error("AI Analysis failed on server");
            }
          }
        } catch (pollErr) {
          console.warn("Polling attempt failed:", pollErr);
          // If it's a critical error (like the one we just threw), stop polling
          if (pollErr.message === "AI Analysis failed on server") throw pollErr;
        }

        if (attempts === 2) setLoadingText("Scanning resume structure...");
        if (attempts === 8) setLoadingText("Extracting career milestones...");
        if (attempts === 15) setLoadingText("Identifying key achievements...");
        if (attempts === 22) setLoadingText("Mapping skills to market needs...");
        if (attempts === 30) setLoadingText("Almost there! Finalizing analysis...");
        if (attempts === 40) setLoadingText("Completing final digital polish...");

        await new Promise(r => setTimeout(r, 2000));
      }

      if (!parsedData) {
        throw new Error("Analysis timed out");
      }

      setLoading(false);

      const reformatted = reformatResumeData(parsedData, resume_id);

      // Do NOT auto-populate project title from name
      // if (reformatted.personal?.name && (!projectTitle || projectTitle === "Untitled Resume")) {
      //   setProjectTitle(`${reformatted.personal.name}'s Resume`);
      // }

      console.log("🎨 FRONTEND REFORMATTED RADAR:", reformatted);
      console.log("🤖 AI ANALYSIS DATA FROM reformat:", reformatted.initial_analysis);
      console.log("📦 RAW parsedData FROM BACKEND:", JSON.stringify(parsedData).slice(0, 500));

      trackEvent('resume_ai_parsing_success', 'Resume parsed successfully', {
        feature_module: 'resume_creator',
        metadata: {
          sections_count: Object.keys(parsedData).length,
          has_name: !!reformatted.personal?.name,
          has_summary: !!reformatted.summary
        }
      });

      trackEvent('aha_moment', 'AI successfully parsed resume', {
        feature_module: 'resume_creator',
        funnel_stage: 'ai_analysis',
        metadata: { sections_found: Object.keys(parsedData).length }
      });

      if (onUpdateData) {
        onUpdateData(reformatted);
      }
      nextStep(STEPS.ANALYZE);

    } catch (error) {
      console.error("Upload/Analysis failed", error);
      trackEvent('resume_ai_parsing_failed', error.message, {
        feature_module: 'resume_creator',
        error: error.message
      });
      setLoading(false);
      alert("Analysis failed or timed out. Starting fresh.");
      nextStep(STEPS.ROLE);
    }
  };

  const nextStep = (next) => {
    setDirection(1);
    setStep(next);

    // Track Funnel Progression
    const stageMap = {
      [STEPS.PROJECT_DETAILS]: 'project_name_input',
      [STEPS.SOURCE_CHOICE]: 'creation_method_choice',
      [STEPS.SOURCE_SELECTION]: 'upload_started',
      [STEPS.ANALYZE]: 'parsing_ai_logic',
      [STEPS.ROLE]: 'target_role_definition',
      [STEPS.DEGREE]: 'education_level_check',
      [STEPS.LAYOUT]: 'structure_configuration',
      [STEPS.TEMPLATE]: 'aesthetic_selection',
      [STEPS.SELECTION]: 'entering_template_gallery'
    };

    const stage = stageMap[next];

    if (stage) {
      trackEvent(`resume_funnel_${next}`, `Moved to ${next}`, {
        feature_module: 'resume_creator',
        funnel_stage: stage,
        metadata: {
          current_step: step,
          next_step: next,
          has_resume_data: !!data?.personal?.name
        }
      });
    }
  };

  const prevStep = (prev) => {
    setDirection(-1);
    setStep(prev);
  };

  const updateData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleRoleSelect = (isStudent) => {
    updateData("isStudent", isStudent);
    if (isStudent) nextStep(STEPS.DEGREE);
    else nextStep(STEPS.LAYOUT);
  };

  const handleFinishSelection = () => {
    if (!selectedTemplate) return;
    setIsExiting(true);
    setTimeout(() => {
      onComplete({
        ...formData,
        template: selectedTemplate,
        title: projectTitle
      });
    }, 800);
  };

  // --- ANIMATION VARIANTS ---
  // "Premium" smooth slide-fade transitions
  const pageVariants = {
    initial: (dir) => ({
      opacity: 0,
      x: dir > 0 ? 40 : -40,
      scale: 0.98,
      filter: "blur(4px)"
    }),
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } // Custom cubic-bezier for "premium" feel
    },
    exit: (dir) => ({
      opacity: 0,
      x: dir > 0 ? -40 : 40,
      scale: 0.98,
      filter: "blur(4px)",
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
    })
  };

  return (
    <div className={`premium-onboarding ${isExiting ? 'exiting' : ''}`}>

      {/* BACKGROUND ELEMENTS */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[100%] bg-emerald-100/30 blur-[100px] rounded-none pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[80%] bg-orange-50/40 blur-[100px] rounded-none pointer-events-none" />
      <div className="grid-overlay" style={{ backgroundImage: 'radial-gradient(circle, #10B981 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.1 }} />

      {/* Doodles for personality */}
      <div className="absolute top-24 left-10 opacity-40 hidden xl:block animate-pulse-slow">
        <SparkleDoodle color="#10B981" className="w-12 h-12" />
      </div>
      <div className="absolute bottom-32 right-10 opacity-30 hidden xl:block">
        <StarDoodle color="#F59E0B" className="w-8 h-8" />
      </div>

      {/* HIDDEN FILE INPUT */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
      />

      {/* FUN AI LOADER OVERLAY */}
      <AnimatePresence>
        {loading && (
          <FunLoader text={loadingText} />
        )}
      </AnimatePresence>

      {/* TEMPLATE HERO ART BACKGROUND */}
      <div className="hero-art-bg">
        <div className="art-piece art-1">
          <div className="art-content"></div>
        </div>
        <div className="art-piece art-2">
          <div className="art-content"></div>
        </div>
        <div className="art-piece art-3">
          <div className="art-content"></div>
        </div>
      </div>

      {/* TOP NAV HEADER */}
      <div className="onboarding-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '0 40px', height: '80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {step !== STEPS.WELCOME && step !== STEPS.ANALYZE && (
            <button className="nav-back-btn" onClick={() => {
              if (step === STEPS.PROJECTS) prevStep(STEPS.WELCOME);
              else if (step === STEPS.SOURCE_CHOICE) prevStep(STEPS.WELCOME);
              else if (step === STEPS.PROJECT_DETAILS) prevStep(STEPS.SOURCE_CHOICE);
              else if (step === STEPS.SOURCE_SELECTION) prevStep(STEPS.PROJECT_DETAILS);
              else if (step === STEPS.SELECTION) prevStep(STEPS.SOURCE_CHOICE);
              else onBack();
            }}>
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          )}
          <Link href="/resume-creator" className="flex items-center gap-2 group flex-shrink-0">
            <ResumyLogo size={28} />
          </Link>
        </div>

        {/* USER ACTIONS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end mr-2">
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#1c1917', fontFamily: 'Outfit' }}>
                  {userEmail?.split('@')[0]}
                </span>
                <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>
                  {userEmail}
                </span>
              </div>

              <Link href="/dashboard" style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                color: '#0f172a',
                padding: '8px 16px',
                fontSize: '11px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                borderRadius: '0',
                textDecoration: 'none',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }} className="hover:bg-stone-50">
                <Layout size={14} color="#7c3aed" /> Dashboard
              </Link>

              <button
                onClick={handleSignOut}
                style={{
                  background: '#0f172a',
                  border: '1px solid #0f172a',
                  color: 'white',
                  padding: '8px 16px',
                  fontSize: '11px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  borderRadius: '0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }} className="hover:bg-stone-800"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          ) : (
            <Link href="/login" style={{
              background: '#0f172a',
              color: 'white',
              padding: '10px 24px',
              fontSize: '11px',
              fontWeight: 900,
              borderRadius: '0',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              Sign In
            </Link>
          )}
        </div>
      </div>

      <div className="onboarding-stage">
        <AnimatePresence mode="wait" custom={direction}>

          {/* 1. WELCOME (RESUME BUILDER SCREEN) */}
          {step === STEPS.WELCOME && (
            <motion.div
              key="welcome"
              className="welcome-hero-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="hero-top-section">
                {/* LEFT SIDE: TYPOGRAPHY and HERO */}
                <div className="architect-left relative">
                  <motion.div
                    initial={{ x: -40, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <div className="brand-pill bg-violet-600/5 text-violet-700 border border-violet-200/60 px-4 py-2 rounded-xl w-fit mb-6 backdrop-blur-sm">
                      <Sparkles className="w-4 h-4 flex-shrink-0" />
                      <span className="text-[11px] tracking-[0.2em] font-black uppercase">Next-Gen Resume Suite</span>
                    </div>
                    <h1 className="hero-display-text text-stone-900 font-black tracking-tighter leading-[0.85] mb-6 text-6xl md:text-7xl lg:text-7xl">
                      {loadingDrafts ? (
                        <div className="flex flex-col gap-4">
                          <span className="block italic font-serif font-normal text-stone-300 animate-pulse">Initializing...</span>
                          <span className="relative inline-block text-stone-200 animate-pulse">Your Workspace</span>
                        </div>
                      ) : drafts.length > 0 ? (
                        <>
                          <span className="block italic font-serif font-normal text-violet-600 mb-4 relative w-fit z-10 scale-110 origin-left">
                            Continue
                            <span className="absolute -inset-x-6 top-1/2 -translate-y-1/2 h-[130%] -z-10 opacity-30 skew-x-[-12deg] scale-125">
                              <HighlightDoodle color="#8B5CF6" className="w-full h-full" />
                            </span>
                          </span>
                          <span className="relative inline-block text-[52px] md:text-[60px] lg:text-[60px]">
                            Where you left off.
                            <ScribbleDoodle color="#8B5CF6" className="absolute -bottom-8 right-0 w-[110%] h-6 opacity-60 rotate-[1deg]" />
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="block italic font-serif font-normal text-violet-600 mb-4 relative w-fit z-10 scale-110 origin-left">
                            Architect
                            <span className="absolute -inset-x-6 top-1/2 -translate-y-1/2 h-[130%] -z-10 opacity-30 skew-x-[-12deg] scale-125">
                              <HighlightDoodle color="#8B5CF6" className="w-full h-full" />
                            </span>
                          </span>
                          <span className="relative inline-block">
                            Your Future.
                            <ScribbleDoodle color="#8B5CF6" className="absolute -bottom-8 right-0 w-[120%] h-6 opacity-60 rotate-[-1deg]" />
                          </span>
                        </>
                      )}
                    </h1>
                    <p className="hero-desc text-stone-500 font-medium text-lg leading-relaxed mt-10">
                      {loadingDrafts ? (
                        <span className="opacity-50">Syncing with our secure cloud to retrieve your progress...</span>
                      ) : drafts.length > 0 ? (
                        <>
                          Resume editing <span className="text-stone-900 font-black">{drafts[0].title || "Untitled Resume"}</span> or start a new project instantly.
                        </>
                      ) : (
                        <>
                          The most intuitive way to build a professional resume. <span className="text-stone-900 font-black">Fill, Customize, and Export</span> with AI-powered precision.
                        </>
                      )}
                    </p>

                    {/* NEW: HOW IT WORKS PREVIEW */}
                    {drafts.length === 0 && (
                      <div className="how-it-works-mini mt-12 space-y-6">
                        <div
                          className="step-item group"
                          onMouseEnter={() => setHoveredStep(1)}
                          onMouseLeave={() => setHoveredStep(null)}
                        >
                          <div className="step-num bg-stone-100 text-stone-400 group-hover:bg-violet-600 group-hover:text-white transition-colors">1</div>
                          <div className="step-content">
                            <h4 className="font-black text-stone-900 text-sm uppercase tracking-wider">Input your story</h4>
                            <p className="text-xs text-stone-500 font-medium">Type details in a fast, structured form or upload your existing PDF for AI extraction.</p>
                          </div>
                        </div>
                        <div
                          className="step-item group"
                          onMouseEnter={() => setHoveredStep(2)}
                          onMouseLeave={() => setHoveredStep(null)}
                        >
                          <div className="step-num bg-stone-100 text-stone-400 group-hover:bg-rose-500 group-hover:text-white transition-colors">2</div>
                          <div className="step-content">
                            <h4 className="font-black text-stone-900 text-sm uppercase tracking-wider">Refine & Reorder</h4>
                            <p className="text-xs text-stone-500 font-medium">Drag-and-drop sections to reorder, live-edit every detail, and optimize with AI suggestions.</p>
                          </div>
                        </div>
                        <div
                          className="step-item group"
                          onMouseEnter={() => setHoveredStep(3)}
                          onMouseLeave={() => setHoveredStep(null)}
                        >
                          <div className="step-num bg-stone-100 text-stone-400 group-hover:bg-orange-500 group-hover:text-white transition-colors">3</div>
                          <div className="step-content">
                            <h4 className="font-black text-stone-900 text-sm uppercase tracking-wider">Style & Export</h4>
                            <p className="text-xs text-stone-500 font-medium">Switch premium templates seamlessly and download your high-conversion PDF in one click.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* RIGHT: THE VISUAL ART */}
                <div className="hero-visual-section">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="w-full h-full flex items-center justify-center lg:scale-110"
                  >
                    <AnimatePresence mode="wait">
                      {hoveredStep === 1 ? (
                        <motion.div
                          key="input-art"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.5 }}
                          className="w-full h-full flex items-center justify-center"
                        >
                          <InputStoryArt />
                        </motion.div>
                      ) : hoveredStep === 2 ? (
                        <motion.div
                          key="refine-art"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.5 }}
                          className="w-full h-full flex items-center justify-center"
                        >
                          <RefineReorderArt />
                        </motion.div>
                      ) : hoveredStep === 3 ? (
                        <motion.div
                          key="style-art"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.5 }}
                          className="w-full h-full flex items-center justify-center"
                        >
                          <StyleExportArt />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="default-art"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="w-full h-full flex items-center justify-center relative"
                        >
                          {loadingDrafts ? (
                            <div className="relative w-full max-w-[55%] aspect-[210/297] bg-stone-50 overflow-hidden flex flex-col items-center justify-center gap-6">
                              <div className="w-20 h-20 border-4 border-stone-200 border-t-violet-600 rounded-full animate-spin" />
                              <div className="flex flex-col items-center gap-2">
                                <div className="w-32 h-4 bg-stone-200 animate-pulse" />
                                <div className="w-24 h-3 bg-stone-100 animate-pulse" />
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent animate-shimmer pointer-events-none" />
                            </div>
                          ) : drafts.length > 0 ? (
                            <div
                              onClick={() => handleSelectDraft(drafts[0])}
                              className="relative w-full max-w-[55%] aspect-[210/297] bg-white rounded-none shadow-[0_30px_60px_rgba(0,0,0,0.15)] ring-1 ring-stone-900/5 transform hover:scale-[1.02] transition-all duration-700 ease-out flex items-center justify-center bg-stone-50 overflow-hidden cursor-pointer group"
                            >
                              <div className="absolute top-6 left-6 z-40 bg-violet-600 text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 transform origin-left group-hover:scale-110 transition-transform">
                                <Layout size={14} /> Continues {drafts[0].title || "Untitled Resume"}
                              </div>
                              <div className="w-full h-full relative" style={{ pointerEvents: 'none' }}>
                                <TemplatePreview
                                  templateId={drafts[0].template_id || 'berlin-sleek'}
                                  data={drafts[0].data || {}}
                                  designSettings={typeof drafts[0].design_settings === 'string' ? JSON.parse(drafts[0].design_settings || '{}') : drafts[0].design_settings}
                                  isFormPanel={true}
                                />
                              </div>
                              <div className="absolute inset-0 bg-violet-900/0 group-hover:bg-violet-900/5 transition-colors z-20 pointer-events-none" />
                            </div>
                          ) : (
                            <ResumeCreatorArt />
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </div>

              {/* BOTTOM: INTERACTIVE MODULES (HORIZONTAL PILLS) */}
              <div className="hero-bottom-section">
                {/* Module 1: Create New */}
                <motion.div
                  className="sleek-pill-btn btn-indigo group"
                  onClick={() => {
                    setHasNamedProject(false);   // fresh start — ask for name after choosing method
                    setProjectTitle("Untitled Resume"); // clear any leftover title
                    nextStep(STEPS.SOURCE_CHOICE);
                  }}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
                >
                  <div className="pill-icon shadow-lg relative overflow-hidden group-hover:rotate-0 transition-transform duration-500">
                    <Plus size={24} className="relative z-10" />
                    <div className="absolute inset-0 bg-white/20 blur-md scale-0 group-hover:scale-150 transition-transform duration-700" />
                  </div>
                  <div className="pill-text">
                    <h3 className="font-black tracking-tight text-lg">Architect a New Resume</h3>
                    <p className="font-bold opacity-80">Start fresh or import with AI</p>
                  </div>
                  <div className="pill-arrow opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                    <ArrowRight size={20} />
                  </div>
                </motion.div>

                {/* Module 3: Continue Existing (Drafts) */}
                {drafts.length > 0 && (
                  <motion.div
                    className="sleek-pill-btn btn-orange group"
                    onClick={() => nextStep(STEPS.PROJECTS)}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.7, ease: [0.23, 1, 0.32, 1] }}
                  >
                    <div className="pill-icon shadow-lg relative overflow-hidden group-hover:rotate-0 transition-transform duration-500">
                      <Layout size={24} className="relative z-10" />
                      <div className="absolute inset-0 bg-white/20 blur-md scale-0 group-hover:scale-150 transition-transform duration-700" />
                    </div>
                    <div className="pill-text">
                      <h3 className="font-black tracking-tight text-lg">Continue Existing Narrative</h3>
                      <p className="font-bold opacity-80">Resume one of your {drafts.length} drafts</p>
                    </div>
                    <div className="pill-arrow opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                      <ArrowRight size={20} />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Decorative Doodles */}
              <div className="absolute bottom-8 left-8 opacity-10 hidden lg:block">
                <ZigZagDoodle color="#F97316" className="w-20 h-4" />
              </div>
            </motion.div>
          )}

          {/* 1.1.25 SOURCE CHOICE (NEW STEP) */}
          {step === STEPS.SOURCE_CHOICE && (
            <motion.div
              key="source_choice"
              className="step-container center-focus source-choice-container"
              variants={pageVariants}
              initial="initial" animate="animate" exit="exit" custom={direction}
            >
              <div className="step-header">
                <div className="brand-pill bg-emerald-600/5 text-emerald-700 border border-emerald-200/60 px-4 py-2 rounded-xl w-fit mb-6 mx-auto backdrop-blur-sm">
                  <Plus className="w-4 h-4 flex-shrink-0" />
                  <span className="text-[10px] tracking-[0.2em] font-black uppercase">Start Method</span>
                </div>
                <h2 className="text-4xl font-black text-stone-900 tracking-tighter mb-3">How would you like to build?</h2>
                <p className="text-stone-500 font-medium text-sm">Choose the path that works best for you.</p>
              </div>

              <div className="mt-12 flex flex-col md:flex-row gap-6 w-full max-w-2xl mx-auto">
                {/* Path 1: Fresh */}
                <motion.div
                  className="flex-1 bg-white border-2 border-stone-100 p-8 cursor-pointer hover:border-violet-500 transition-all group"
                  whileHover={{ y: -5 }}
                  onClick={() => {
                    if (hasNamedProject) {
                      // Already named (came from drafts → PROJECT_DETAILS path) — skip naming
                      nextStep(STEPS.SELECTION);
                    } else {
                      setNextStepAfterTitle(STEPS.SELECTION);
                      nextStep(STEPS.PROJECT_DETAILS);
                    }
                  }}
                >
                  <div className="w-12 h-12 bg-violet-100 text-violet-600 flex items-center justify-center rounded-xl mb-6 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                    <PenTool size={24} />
                  </div>
                  <h3 className="font-black text-stone-900 text-xl tracking-tight mb-2">From Scratch</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">Perfect if you don't have a resume yet or want a fresh start.</p>
                </motion.div>

                {/* Path 2: AI */}
                <motion.div
                  className="flex-1 bg-white border-2 border-stone-100 p-8 cursor-pointer hover:border-emerald-500 transition-all group relative"
                  whileHover={{ y: -5 }}
                  onClick={() => {
                    if (hasNamedProject) {
                      // Already named — skip naming, go straight to import
                      nextStep(STEPS.SOURCE_SELECTION);
                    } else {
                      setNextStepAfterTitle(STEPS.SOURCE_SELECTION);
                      nextStep(STEPS.PROJECT_DETAILS);
                    }
                  }}
                >
                  <div className="absolute -right-2 -top-3 bg-emerald-500 text-white px-3 py-1 rounded-none text-[7px] font-black uppercase tracking-widest shadow-xl z-20">
                    Standard ✨
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 flex items-center justify-center rounded-xl mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <Wand2 size={24} />
                  </div>
                  <h3 className="font-black text-stone-900 text-xl tracking-tight mb-2">Import with AI</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">Upload your current PDF/Doc and we'll extract the data for you.</p>
                </motion.div>

                {/* Path 3: Career DNA (MAGIC START) */}
                {careerDna && (
                  <motion.div
                    className="flex-1 bg-gradient-to-br from-violet-600 to-indigo-700 border-none p-8 cursor-pointer transition-all group relative shadow-2xl shadow-violet-200"
                    whileHover={{ y: -10, scale: 1.05 }}
                    onClick={useMasterDna}
                  >
                    <div className="absolute -right-2 -top-4 bg-emerald-400 text-stone-900 px-4 py-1.5 rounded-none text-[9px] font-black uppercase tracking-widest shadow-2xl z-20 animate-bounce">
                      Fastest ⚡
                    </div>
                    <div className="w-12 h-12 bg-white/20 text-white flex items-center justify-center rounded-xl mb-6 backdrop-blur-md border border-white/30 group-hover:bg-white group-hover:text-violet-600 transition-all">
                      <Brain size={24} />
                    </div>
                    <h3 className="font-black text-white text-xl tracking-tight mb-2">Use Career DNA</h3>
                    <p className="text-violet-100 text-sm leading-relaxed">Magic Start! Automatically populate your template from your verified profile.</p>
                  </motion.div>
                )}
              </div>

              <div className="step-footer mt-12">
                <button className="nav-back-btn" onClick={() => prevStep(STEPS.WELCOME)}>
                  <ArrowLeft size={14} /> Back
                </button>
              </div>
            </motion.div>
          )}

          {/* 1.1. PROJECTS (DRAFT LIST) */}
          {step === STEPS.PROJECTS && (
            <motion.div
              key="projects"
              className="projects-explorer-step"
              variants={pageVariants}
              initial="initial" animate="animate" exit="exit" custom={direction}
            >
              <div className="step-header mb-12 text-center">

                <h2 className="text-4xl font-black text-stone-900 tracking-tighter mb-3">Resume your work</h2>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                  <p className="text-stone-500 font-medium text-sm">Pick up exactly where you left off in your career narrative.</p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setIsSelectionMode(!isSelectionMode);
                        if (isSelectionMode) setSelectedDrafts([]);
                      }}
                      className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 border transition-all ${isSelectionMode ? 'bg-stone-900 text-white border-stone-900' : 'bg-white text-stone-600 border-stone-200 hover:border-stone-900'}`}
                    >
                      {isSelectionMode ? 'Cancel Selection' : 'Select Multiple'}
                    </button>
                    {isSelectionMode && (
                      <button
                        onClick={toggleSelectAll}
                        className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-stone-50 text-stone-600 border border-stone-200 hover:bg-stone-100 transition-all"
                      >
                        {selectedDrafts.length === drafts.length ? 'Deselect All' : 'Select All'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="drafts-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {loadingDrafts ? (
                  // Skeleton Cards
                  [1, 2, 3].map((i) => (
                    <div key={i} className="draft-card bg-white border border-stone-100 p-6 shadow-sm rounded-none animate-pulse">
                      <div className="relative w-full aspect-[210/297] bg-stone-50 mb-8 border border-stone-100 flex items-center justify-center">
                        <div className="w-12 h-12 bg-stone-100 rounded-full" />
                      </div>
                      <div className="space-y-4">
                        <div className="h-6 bg-stone-100 w-3/4" />
                        <div className="h-3 bg-stone-50 w-1/2" />
                      </div>
                      <div className="flex items-center justify-between mt-8 pt-6 border-t border-stone-50">
                        <div className="w-20 h-4 bg-stone-50" />
                        <div className="w-10 h-10 bg-stone-50" />
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    {drafts.map((draft, idx) => (
                      <motion.div
                        key={draft.id}
                        className={`draft-card group relative bg-white border p-6 cursor-pointer transition-all shadow-sm hover:shadow-2xl rounded-none ${selectedDrafts.includes(draft.id) ? 'border-orange-500 ring-2 ring-orange-500/10' : 'border-stone-100 hover:border-orange-200'}`}
                        whileHover={{ y: isSelectionMode ? 0 : -10 }}
                        onClick={() => {
                          if (isSelectionMode) {
                            setSelectedDrafts(prev =>
                              prev.includes(draft.id) ? prev.filter(id => id !== draft.id) : [...prev, draft.id]
                            );
                          } else {
                            handleSelectDraft(draft);
                          }
                        }}
                      >
                        {/* Selection Checkbox */}
                        {isSelectionMode && (
                          <div className="absolute top-8 left-8 z-50">
                            <div className={`w-6 h-6 rounded-none border-2 flex items-center justify-center transition-all ${selectedDrafts.includes(draft.id) ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white border-stone-200'}`}>
                              {selectedDrafts.includes(draft.id) && <Check size={14} strokeWidth={4} />}
                            </div>
                          </div>
                        )}
                        <div className="absolute top-8 right-8 z-30">
                          <div className="bg-white/80 backdrop-blur-md border border-stone-100 px-3 py-1 rounded-none text-[10px] font-black uppercase text-stone-400 group-hover:text-orange-500 shadow-sm transition-colors">
                            Slot {draft.slot_id || (idx + 1)}
                          </div>
                        </div>

                        <div className="relative w-full aspect-[210/297] bg-white overflow-hidden mb-8 border border-stone-100 rounded-none group-hover:border-orange-100 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] group-hover:shadow-[0_25px_60px_rgba(249,115,22,0.15)] flex items-center justify-center">
                          <div className="relative w-full h-full transform scale-100 origin-center transition-transform duration-700 group-hover:scale-[1.03]">
                            <TemplatePreview
                              templateId={draft.template_id || 'berlin-sleek'}
                              data={draft.data || {}}
                              designSettings={typeof draft.design_settings === 'string' ? JSON.parse(draft.design_settings || '{}') : draft.design_settings}
                              isFormPanel={true}
                            />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </div>

                        <div className="space-y-2">
                          {renameId === draft.id ? (
                            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                              <input focus="true" autoFocus type="text" value={renamingTitle} onChange={e => setRenamingTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleRenameDraft(null, draft.id)} className="flex-1 bg-stone-50 border-2 border-orange-500 px-3 py-2 text-sm font-black text-stone-900 outline-none rounded-none" placeholder="New Title..." />
                              <button onClick={e => handleRenameDraft(e, draft.id)} className="p-2 bg-orange-500 text-white rounded-none hover:bg-orange-600 transition-colors"><CheckCircle size={18} /></button>
                            </div>
                          ) : (
                            <h3 className="text-xl font-black text-stone-900 tracking-tight group-hover:text-orange-600 transition-colors truncate">
                              {draft.title || "Untitled Resume"}
                            </h3>
                          )}
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-none bg-orange-400" />
                            <p className="text-xs text-stone-400 font-bold uppercase tracking-wider">
                              {draft.template_id?.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-8 pt-6 border-t border-stone-50">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase text-stone-300 tracking-widest mb-1">Last Edited</span>
                            <span className="text-xs font-bold text-stone-500">
                              {new Date(draft.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="relative" ref={activeMenuId === draft.id ? dropdownRef : null}>
                              <button
                                onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === draft.id ? null : draft.id); }}
                                className="w-10 h-10 bg-stone-50 flex items-center justify-center text-stone-400 hover:bg-stone-100 hover:text-stone-900 transition-all rounded-none"
                              >
                                <MoreHorizontal size={20} />
                              </button>
                              <AnimatePresence>
                                {activeMenuId === draft.id && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                    className="absolute bottom-full right-0 mb-2 w-42 bg-white shadow-2xl border border-stone-100 z-50 py-2 rounded-none overflow-hidden"
                                  >
                                    <button onClick={(e) => { e.stopPropagation(); setRenameId(draft.id); setRenamingTitle(draft.title || ""); setActiveMenuId(null); }}
                                      className="w-full px-4 py-3 text-left text-[10px] font-black text-stone-600 hover:bg-stone-50 hover:text-orange-600 flex items-center gap-3 transition-colors uppercase tracking-widest">
                                      <Edit2 size={14} /> Rename
                                    </button>
                                    <div className="h-[1px] bg-stone-50 mx-2" />
                                    <button onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(draft.id); setActiveMenuId(null); }}
                                      className="w-full px-4 py-3 text-left text-[10px] font-black text-rose-500 hover:bg-rose-50 flex items-center gap-3 transition-colors uppercase tracking-widest">
                                      <Trash2 size={14} /> Delete
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                            <div className="w-10 h-10 rounded-none bg-stone-50 flex items-center justify-center text-stone-400 group-hover:bg-orange-500 group-hover:text-white transition-all transform group-hover:rotate-[-45deg]">
                              <ArrowRight size={18} />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    {drafts.length < 3 && (
                      <motion.div
                        className="draft-card group flex flex-col bg-white border-2 border-stone-100 p-8 hover:border-emerald-200 cursor-pointer transition-all rounded-none"
                        whileHover={{ y: -10 }}
                        onClick={() => {
                          setHasNamedProject(false);
                          setProjectTitle("Untitled Resume");
                          nextStep(STEPS.SOURCE_CHOICE);
                        }}
                      >
                        <div className="relative w-full aspect-[210/297] border-2 border-dashed border-stone-200 rounded-none bg-stone-50/50 flex flex-col items-center justify-center mb-8 group-hover:bg-emerald-50/50 group-hover:border-emerald-300 transition-all">
                          <div className="w-14 h-14 bg-white text-stone-400 flex items-center justify-center rounded-none shadow-sm group-hover:text-emerald-500 transition-colors">
                            <Plus size={28} />
                          </div>
                        </div>
                        <h3 className="text-xl font-black text-stone-900 mb-1 group-hover:text-emerald-600 transition-colors">Start New Draft</h3>
                        <p className="text-sm text-stone-400 font-medium mb-4 italic">You have {3 - drafts.length} slot{3 - drafts.length !== 1 ? 's' : ''} left</p>
                        <div className="flex items-center justify-between mt-auto pt-6 border-t border-stone-50">
                          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Create fresh narrative</span>
                          <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            Get Started <Plus size={12} />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
              </div>

              <div className="step-footer mt-12">
                <button className="nav-back-btn" onClick={() => prevStep(STEPS.WELCOME)}>
                  <ArrowLeft size={14} /> Back
                </button>
              </div>

              {/* Bulk Action Bar */}
              <AnimatePresence>
                {isSelectionMode && selectedDrafts.length > 0 && (
                  <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-md"
                  >
                    <div className="bg-stone-900 text-white p-6 shadow-2xl flex items-center justify-between border border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/10 flex items-center justify-center font-black text-sm">
                          {selectedDrafts.length}
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Selected Items</p>
                          <p className="text-xs font-bold">Ready for bulk action</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setDeleteConfirmId('bulk')}
                        className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                      >
                        <Trash2 size={14} /> Delete Selected
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

          )}

          {/* 1.1.5. PROJECT DETAILS (NAME YOUR PROJECT) */}
          {step === STEPS.PROJECT_DETAILS && (
            <motion.div
              key="project_details"
              className="step-container center-focus name-project-container"
              variants={pageVariants}
              initial="initial" animate="animate" exit="exit" custom={direction}
            >
              <div className="step-header">
                <div className="brand-pill bg-violet-600/5 text-violet-700 border border-violet-200/60 px-4 py-2 rounded-xl w-fit mb-6 mx-auto backdrop-blur-sm">
                  <PenTool className="w-4 h-4 flex-shrink-0" />
                  <span className="text-[10px] tracking-[0.2em] font-black uppercase">Project Identity</span>
                </div>
                <h2 className="text-4xl font-black text-stone-900 tracking-tighter mb-3">Name your project</h2>
                <p className="text-stone-500 font-medium text-sm">Give your resume draft a recognizable title.</p>
              </div>

              <div className="mt-12 w-full max-w-md mx-auto">
                <div className="zety-input-wrap !mb-8">
                  <label className="label uppercase tracking-widest text-[10px] font-black text-stone-400 mb-2 block">Project Title</label>
                  <input
                    type="text"
                    className="w-full text-2xl font-black text-stone-900 border-b-2 border-stone-200 focus:border-violet-600 bg-transparent py-4 outline-none transition-colors"
                    placeholder="e.g. Senior Frontend Resume"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="flex flex-col gap-4">
                  <button
                    className="w-full bg-indigo-600 text-white py-4 font-bold text-sm rounded hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all flex items-center justify-center gap-3 group"
                    onClick={() => {
                      setHasNamedProject(true);
                      nextStep(nextStepAfterTitle);
                    }}
                  >
                    Continue to {nextStepAfterTitle === STEPS.SELECTION ? "Templates" : nextStepAfterTitle === STEPS.SOURCE_CHOICE ? "Choose Method" : "Import"}
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <p className="text-center text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                    You can always change this later
                  </p>
                </div>
              </div>

              <div className="step-footer mt-12">
                <button className="nav-back-btn" onClick={() => prevStep(STEPS.SOURCE_CHOICE)}>
                  <ArrowLeft size={14} /> Back
                </button>
              </div>
            </motion.div>
          )}

          {/* 1.2. SOURCE SELECTION */}
          {step === STEPS.SOURCE_SELECTION && (
            <motion.div
              key="source_selection"
              className="step-container source-selection-container"
              variants={pageVariants}
              initial="initial" animate="animate" exit="exit" custom={direction}
            >
              <div className="step-header">
                <div className="brand-pill bg-emerald-600/5 text-emerald-700 border border-emerald-200/60 px-4 py-2 rounded-xl w-fit mb-6 mx-auto backdrop-blur-sm">
                  <Cpu className="w-4 h-4 flex-shrink-0" />
                  <span className="text-[10px] tracking-[0.2em] font-black uppercase">Data Extraction</span>
                </div>
                <h2 className="text-4xl font-black text-stone-900 tracking-tighter mb-3">Import your narrative</h2>
                <p className="text-stone-500 font-medium text-sm">Our AI will surgicaly extract your career milestones.</p>
              </div>

              <div className="import-options-grid mt-4">
                <motion.div
                  className="import-card recommended"
                  onClick={() => fileInputRef.current.click()}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className="import-card-header">
                    <div className="import-icon-box bg-emerald-100 text-emerald-600">
                      <FileText size={24} />
                    </div>
                    <div className="badge pulse">AI Recommended</div>
                  </div>
                  <div className="import-card-body">
                    <h3 className="font-black text-stone-900 text-lg">Upload PDF / DOCX</h3>
                    <p className="text-xs text-stone-500 font-medium leading-relaxed">Most accurate AI reconstruction. We'll map your experience into the creator instantly.</p>
                  </div>
                  <div className="import-card-footer">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Click to Browse</span>
                    <ArrowRight size={14} className="text-emerald-600" />
                  </div>
                </motion.div>

                <div className="import-row-group">
                  <div className="import-row-item disabled" onClick={() => alert("Cloud Sync coming soon!")}>
                    <div className="import-row-icon bg-blue-50 text-blue-500">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 17H2L12 2l10 15z" /></svg>
                    </div>
                    <div className="import-row-text">
                      <span className="font-bold text-stone-900 text-sm">Google Drive</span>
                      <span className="text-[9px] text-stone-400 font-black uppercase tracking-widest">Coming Soon</span>
                    </div>
                  </div>

                  <div className="import-row-item disabled" onClick={() => alert("Cloud Sync coming soon!")}>
                    <div className="import-row-icon bg-blue-50 text-blue-600">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 17h10l-6-6H-2l6 6z" /><path d="M12 17h10l-6-6H6l6 6z" /></svg>
                    </div>
                    <div className="import-row-text">
                      <span className="font-bold text-stone-900 text-sm">Dropbox</span>
                      <span className="text-[9px] text-stone-400 font-black uppercase tracking-widest">Coming Soon</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="step-footer mt-8">
                <button className="nav-back-btn" onClick={() => prevStep(STEPS.PROJECT_DETAILS)}>
                  <ArrowLeft size={14} /> Back
                </button>
              </div>
            </motion.div>
          )}

          {/* 1.5. ANALYZE (AI Upload) */}
          {step === STEPS.ANALYZE && (
            <motion.div
              key="analyze"
              className="step-container center-focus ai-container"
              variants={pageVariants}
              initial="initial" animate="animate" exit="exit" custom={direction}
            >
              <AIGreeting
                data={data}
                onContinue={() => nextStep(STEPS.SELECTION)} // Or wherever it should go after upload
                onBack={() => prevStep(STEPS.SOURCE_SELECTION)}
              />
            </motion.div>
          )}

          {/* 
          {step === STEPS.ROLE && (
            <motion.div
              key="role"
              className="step-container"
              variants={pageVariants}
              initial="initial" animate="animate" exit="exit" custom={direction}
            >
              <div className="step-header relative">
                <h2 className="text-stone-900 font-black tracking-tighter">Define your stage</h2>
                <p className="text-stone-500 font-medium">To tailor the experience, tell us where you are in your career.</p>

                <div className="absolute -top-6 -right-6 opacity-30 rotate-12">
                  <StarDoodle color="#F59E0B" className="w-8 h-8" />
                </div>
              </div>

              <div className="card-grid-2">
                <div className="selection-card group border-stone-200/60 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-500/5 transition-all duration-300" onClick={() => handleRoleSelect(true)}>
                  <div className="card-icon bg-stone-50 text-stone-400 group-hover:bg-violet-600 group-hover:text-white transition-all duration-300"><GraduationCap size={32} /></div>
                  <div className="card-text">
                    <h3 className="text-stone-900 font-bold">Student</h3>
                    <p className="text-stone-500">I'm studying or a recent graduate.</p>
                  </div>
                </div>
                <div className="selection-card group border-stone-200/60 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300" onClick={() => handleRoleSelect(false)}>
                  <div className="card-icon bg-stone-50 text-stone-400 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300"><Briefcase size={32} /></div>
                  <div className="card-text">
                    <h3 className="text-stone-900 font-bold">Professional</h3>
                    <p className="text-stone-500">I have work experience.</p>
                  </div>
                </div>
              </div>

              <div className="step-footer">
                <button className="btn-text" onClick={() => prevStep(STEPS.WELCOME)}>Back</button>
              </div>
            </motion.div>
          )}

          {step === STEPS.DEGREE && (
            <motion.div
              key="degree"
              className="step-container"
              variants={pageVariants}
              initial="initial" animate="animate" exit="exit" custom={direction}
            >
              <div className="step-header">
                <h2>Current Pursuit</h2>
                <p>What degree are you working towards?</p>
              </div>

              <div className="list-columns">
                {["High School", "Associate Degree", "Bachelor's Degree", "Master's Degree", "PhD / Doctorate"].map((d, i) => (
                  <div
                    key={d}
                    className="list-option-item"
                    onClick={() => {
                      updateData("degree", d);
                      nextStep(STEPS.LAYOUT);
                    }}
                  >
                    <span>{d}</span>
                    <ChevronRight size={16} className="item-arrow" />
                  </div>
                ))}
              </div>

              <div className="step-footer">
                <button className="btn-text" onClick={() => prevStep(STEPS.ROLE)}>Back</button>
              </div>
            </motion.div>
          )} 
          */}

          {/* 4. LAYOUT
          {step === STEPS.LAYOUT && (
            <motion.div
              key="layout"
              className="step-container"
              variants={pageVariants}
              initial="initial" animate="animate" exit="exit" custom={direction}
            >
              <div className="step-header relative">
                <h2 className="text-stone-900 font-black tracking-tighter">Visual Structure</h2>
                <p className="text-stone-500 font-medium">Choose a base layout for your content.</p>

                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-2 opacity-20">
                  <ScribbleDoodle color="#7C3AED" className="w-full h-full" />
                </div>
              </div>

              <div className="card-grid-2">
                <div
                  className={`selection-card ${formData.columns === 1 ? 'active' : ''}`}
                  onClick={() => updateData("columns", 1)}
                >
                  <div className="preview-skele-1col" />
                  <div className="card-text text-center">
                    <h3>Single Column</h3>
                    <p>Linear, traditional flow.</p>
                  </div>
                </div>
                <div
                  className={`selection-card ${formData.columns === 2 ? 'active' : ''}`}
                  onClick={() => updateData("columns", 2)}
                >
                  <div className="preview-skele-2col">
                    <div className="skele-sidebar" />
                    <div className="skele-main" />
                  </div>
                  <div className="card-text text-center">
                    <h3>Double Column</h3>
                    <p>Compact, modern utilization.</p>
                  </div>
                </div>
              </div>

              <div className="step-footer">
                <button className="btn-text" onClick={() => prevStep(STEPS.WELCOME)}>Back</button>
                <button className="btn-premium-primary" onClick={() => nextStep(STEPS.PHOTO)}>
                  Next Step
                </button>
              </div>
            </motion.div>
          )}

          {step === STEPS.PHOTO && (
            <motion.div
              key="photo"
              className="step-container"
              variants={pageVariants}
              initial="initial" animate="animate" exit="exit" custom={direction}
            >
              <div className="step-header relative">
                <h2 className="text-stone-900 font-black tracking-tighter">Personal Touch</h2>
                <p className="text-stone-500 font-medium">Do you want to include a headshot?</p>

                <div className="absolute -top-4 -left-4 opacity-20 -rotate-12">
                  <SparkleDoodle color="#10B981" className="w-10 h-10" />
                </div>
              </div>

              <div className="card-grid-2">
                <div
                  className={`selection-card ${formData.hasPhoto ? 'active' : ''}`}
                  onClick={() => updateData("hasPhoto", true)}
                >
                  <div className="card-icon"><ImageIcon size={32} /></div>
                  <div className="card-text">
                    <h3>Include Photo</h3>
                    <p>Great for modern industries.</p>
                  </div>
                </div>
                <div
                  className={`selection-card ${!formData.hasPhoto ? 'active' : ''}`}
                  onClick={() => updateData("hasPhoto", false)}
                >
                  <div className="card-icon"><FileText size={32} /></div>
                  <div className="card-text">
                    <h3>Text Only</h3>
                    <p>Conservative & standard.</p>
                  </div>
                </div>
              </div>

              <div className="step-footer">
                <button className="btn-text" onClick={() => prevStep(STEPS.LAYOUT)}>Back</button>
                <button className="btn-premium-primary" onClick={() => nextStep(STEPS.THEME)}>
                  Next Step
                </button>
              </div>
            </motion.div>
          )}

          {step === STEPS.THEME && (
            <motion.div
              key="theme"
              className="step-container"
              variants={pageVariants}
              initial="initial" animate="animate" exit="exit" custom={direction}
            >
              <div className="step-header relative">
                <h2 className="text-stone-900 font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-stone-900 to-violet-600">Aesthetic Direction</h2>
                <p className="text-stone-500 font-medium">What fits your industry best?</p>

                <div className="absolute -right-8 top-0 opacity-20">
                  <BoxDoodle color="#7C3AED" className="w-12 h-12 rotate-12" />
                </div>
              </div>

              <div className="vertical-list">
                {[
                  { id: "Simple", label: "Minimalist", desc: "Clean lines, heavy whitespace." },
                  { id: "Bold", label: "Executive", desc: "Strong headers, authoritative." },
                  { id: "Stylish", label: "Creative", desc: "Unique layouts, color accents." },
                  { id: "All", label: "Show All", desc: "Explore the full collection." },
                ].map((opt) => (
                  <div
                    key={opt.id}
                    className={`list-option-row ${formData.stylePreference === opt.id ? 'active' : ''}`}
                    onClick={() => updateData("stylePreference", opt.id)}
                  >
                    <div className="flex flex-col items-start gap-1">
                      <span className="font-semibold text-lg">{opt.label}</span>
                      <span className="text-sm opacity-60 font-normal">{opt.desc}</span>
                    </div>
                    {formData.stylePreference === opt.id && <Check size={20} className="text-blue-500" />}
                  </div>
                ))}
              </div>

              <div className="step-footer">
                <button className="btn-text" onClick={() => prevStep(STEPS.PHOTO)}>Back</button>
                <button className="btn-premium-primary" onClick={() => nextStep(STEPS.SELECTION)}>
                  View Templates <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )} 
          */}

        </AnimatePresence>
      </div>

      {/* 7. TEMPLATE SELECTION (Overlay) */}
      {
        step === STEPS.SELECTION && (
          <PremiumTemplateSelection
            userId={userId}
            data={data}
            onUpdateData={onUpdateData}
            onComplete={(templateId) => {
              setSelectedTemplate(templateId);
              setIsExiting(true);
              setTimeout(() => {
                onComplete({
                  ...formData,
                  template: templateId,
                  title: projectTitle // Pass the new title when finishing
                });
              }, 800);
            }}
            onBack={() => prevStep(STEPS.WELCOME)}
          />
        )
      }

      {/* PREVIEW MODAL */}
      <AnimatePresence>
        {isPreviewModalOpen && selectedTemplateObj && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-10">
            <motion.div
              className="absolute inset-0 bg-stone-900/40 backdrop-blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPreviewModalOpen(false)}
            />

            <motion.div
              className="bg-white rounded-3xl w-full max-w-[1300px] h-full max-h-[92vh] flex flex-col overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.3)] relative border border-stone-100"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            >
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="absolute top-8 right-8 z-[210] w-12 h-12 bg-white rounded flex items-center justify-center text-slate-400 hover:text-slate-900 border border-slate-100 transition-all shadow-sm hover:scale-110 active:scale-95"
              >
                <X size={24} />
              </button>

              <div className="flex flex-col md:flex-row h-full">
                {/* LEFT: THE PREVIEW */}
                <div className="w-full md:w-[65%] bg-stone-50 relative flex items-center justify-center p-16 overflow-y-auto">
                  <div className="w-full max-w-[85%] aspect-[210/297] bg-white shadow-2xl relative">
                    <TemplatePreview
                      templateId={selectedTemplateObj.id}
                      data={{
                        ...data,
                        themeColor: selectedTemplateObj.recommendedColors?.[0] || "#3b82f6"
                      }}
                    />

                    {/* PRO OVERLAY */}
                    {selectedTemplateObj.tags?.includes("Premium") && (
                      <div className="absolute inset-0 z-50 bg-stone-900/10 backdrop-blur-[4px] flex items-center justify-center p-12">
                        <div className="bg-white p-16 text-center max-w-sm rounded border border-stone-100 shadow-md relative overflow-hidden">
                          <div className="w-16 h-16 bg-indigo-600 text-white rounded flex items-center justify-center mx-auto mb-8 relative">
                            <Lock size={28} />
                          </div>
                          <h3 className="text-2xl font-bold tracking-tight mb-4" style={{ fontFamily: 'Outfit' }}>Premium Design</h3>
                          <p className="text-stone-500 font-medium leading-relaxed mb-10">
                            This exclusive layout is part of our Elite library. Unlock it and 50+ more with Pro access.
                          </p>
                          <button className="w-full bg-indigo-600 text-white py-4 rounded font-bold hover:bg-indigo-700 transition-all shadow-sm active:scale-95">
                            Get Full Access — $9
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT: THE SPECS */}
                <div className="w-full md:w-[35%] bg-white p-12 flex flex-col h-full border-l border-stone-100 overflow-y-auto">
                  <div className="mb-12">
                    <span className="text-xs font-bold text-violet-600 mb-4 block tracking-tight">
                      Signature Collection &bull; {selectedTemplateObj.id}
                    </span>
                    <h2 className="text-5xl font-black text-stone-900 tracking-tighter leading-[0.95] mb-8" style={{ fontFamily: 'Outfit' }}>
                      {selectedTemplateObj.name}
                    </h2>
                    <div className="flex flex-wrap gap-2 mb-10">
                      {selectedTemplateObj.tags?.map((tag, idx) => (
                        <span key={idx} className={`text-[10px] font-bold px-4 py-2 rounded-none border
                                ${tag === "Premium" ? 'bg-violet-600 border-violet-600 text-white' : 'border-stone-100 text-stone-400'}
                            `}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-12 mb-auto">
                    <div>
                      <h4 className="text-sm font-black text-stone-900 mb-4 flex items-center gap-2" style={{ fontFamily: 'Outfit' }}>
                        <Info size={16} className="text-violet-600" /> Style Rationale
                      </h4>
                      <p className="text-stone-500 font-medium leading-relaxed">
                        {selectedTemplateObj.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-stone-900 mb-6" style={{ fontFamily: 'Outfit' }}>Color Palettes</h4>
                      <div className="flex gap-4">
                        {selectedTemplateObj.recommendedColors?.map((color, idx) => (
                          <div
                            key={idx}
                            className="w-12 h-12 rounded border border-black/5 cursor-pointer hover:scale-110 transition-transform shadow-sm relative group"
                            style={{ backgroundColor: color }}
                          >
                            <div className="absolute inset-0 rounded ring-2 ring-indigo-500 scale-110 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-20">
                    {selectedTemplateObj.tags?.includes("Premium") ? (
                      <button disabled className="w-full py-6 bg-stone-50 border border-stone-200 text-stone-400 font-bold rounded cursor-not-allowed flex items-center justify-center gap-2">
                        <Lock size={18} /> Plan Upgrade Required
                      </button>
                    ) : (
                      <button
                        onClick={handleConfirmTemplate}
                        className="w-full py-6 bg-indigo-600 text-white rounded font-bold text-lg tracking-tight hover:bg-indigo-700 transition-all shadow-md flex items-center justify-center gap-4 group active:scale-[0.98]"
                        style={{ fontFamily: 'Outfit' }}
                      >
                        Select Design <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-md"
              onClick={() => setDeleteConfirmId(null)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white p-8 w-full max-w-md relative z-10 shadow-2xl border border-stone-100"
            >
              <div className="w-16 h-16 bg-rose-50 text-rose-500 flex items-center justify-center mb-6">
                <Trash2 size={32} />
              </div>
              <h3 className="text-2xl font-black text-stone-900 tracking-tighter mb-2">
                {deleteConfirmId === 'bulk' ? `Delete ${selectedDrafts.length} Drafts?` : 'Delete Draft?'}
              </h3>
              <p className="text-stone-500 font-medium text-sm mb-8 leading-relaxed">
                {deleteConfirmId === 'bulk'
                  ? `You are about to permanently remove ${selectedDrafts.length} resumes. This action is final and cannot be undone.`
                  : 'This action is permanent and cannot be undone. All your progress on this resume will be lost forever.'}
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    if (deleteConfirmId === 'bulk') {
                      handleBulkDelete();
                    } else {
                      handleDeleteDraft(deleteConfirmId);
                    }
                  }}
                  className="w-full py-4 bg-rose-500 text-white font-black text-xs uppercase tracking-widest hover:bg-rose-600 transition-colors"
                >
                  Yes, Delete Permanently
                </button>
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="w-full py-4 bg-stone-50 text-stone-900 font-black text-xs uppercase tracking-widest hover:bg-stone-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
