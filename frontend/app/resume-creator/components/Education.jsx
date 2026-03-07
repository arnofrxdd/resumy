import React, { useState, useEffect } from "react";
import { Check, Lightbulb, Trash2, Edit2, ChevronDown, ChevronUp, Link as LinkIcon, Plus, ArrowLeft, GraduationCap, Zap, Sparkles, Loader2, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Editor, EditorProvider, Toolbar, BtnBold, BtnItalic, BtnUnderline, BtnBulletList } from 'react-simple-wysiwyg';
import ResumeRenderer from "../templates/ResumeRenderer";
import { templatesConfig } from "../templates/TemplateManager";
import "./form.css";
import "./education.css";
import CompatibilityWarning from "./CompatibilityWarning";
import { getAIHeaderAdvice, toTitleCase, LOCATION_DATA } from "./HeaderIntelligence";

// --- DATA LISTS ---
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const years = Array.from({ length: 50 }, (_, i) => 2030 - i);

// --- ZETY STYLE EXAMPLES ---
const exampleCategories = [
  {
    title: "Educational Achievements",
    subtitle: "Would you like to include any honours, rank or CGPA score?",
    items: [
      { label: "Honours", text: `Honours <span style="color:#2563eb">[Semester, Year]</span>` },
      { label: "Graduated with Distinction", text: `Graduated with Distinction, <span style="color:#2563eb">[Semester, Year]</span>` },
      { label: "GPA/CGPA", text: `<span style="color:#2563eb">[Number]</span> GPA/CGPA` },
      { label: "Final Grade", text: `Final Grade: <span style="color:#2563eb">[Letter]</span>` },
      { label: "Class Rank", text: `Ranked <span style="color:#2563eb">[Number]</span>% in Class` }
    ]
  },
  {
    title: "Prizes and Scholarships",
    subtitle: "Have you received awards and grants?",
    items: [
      { label: "Awards", text: `Recipient of <span style="color:#2563eb">[Award Name]</span>, <span style="color:#2563eb">[Semester, Year]</span>` },
      { label: "Scholarship", text: `<span style="color:#2563eb">[Scholarship Name]</span>, <span style="color:#2563eb">[Year Awarded]</span> from <span style="color:#2563eb">[Awarding Body]</span>` },
      { label: "Athletic or Competitive Scholarship", text: `<span style="color:#2563eb">[Scholarship Name]</span>, <span style="color:#2563eb">[Year Awarded]</span> from <span style="color:#2563eb">[Awarding Body]</span> for <span style="color:#2563eb">[Reason for Award]</span>` }
    ]
  },
  {
    title: "Coursework and Professional Development",
    subtitle: "Would you like to include any completed courses that are relevant to your desired job?",
    items: [
      { label: "Relevant Coursework", text: `Completed Coursework: <span style="color:#2563eb">[Course Title]</span>, <span style="color:#2563eb">[Year]</span>` },
      { label: "Professional Development", text: `Professional Development Studies: <span style="color:#2563eb">[Area of Study]</span>, <span style="color:#2563eb">[Year]</span>` },
      { label: "College Coursework", text: `Completed College-level Coursework: <span style="color:#2563eb">[Area of Study]</span>, <span style="color:#2563eb">[School Name]</span>` }
    ]
  },
  {
    title: "Activities and Organizations",
    subtitle: "Have you been a team player in a group or an organization?",
    items: [
      { label: "Club Membership", text: `Member of <span style="color:#2563eb">[Club Name]</span>, <span style="color:#2563eb">[Year]</span> to <span style="color:#2563eb">[Year]</span>` },
      { label: "Club or Program Representative", text: `<span style="color:#2563eb">[Position]</span>, <span style="color:#2563eb">[Program or Club]</span>, <span style="color:#2563eb">[Year]</span> to <span style="color:#2563eb">[Year]</span>` },
      { label: "Sorority or Fraternity", text: `Member of <span style="color:#2563eb">[Sorority or Fraternity]</span>, <span style="color:#2563eb">[Year]</span>` },
      { label: "Captain or Leadership", text: `<span style="color:#2563eb">[Captain or Leader]</span> of <span style="color:#2563eb">[Team Name]</span>` },
      { label: "Sports Participation", text: `<span style="color:#2563eb">[Position]</span> for <span style="color:#2563eb">[Team Name]</span>, <span style="color:#2563eb">[Year]</span> to <span style="color:#2563eb">[Year]</span>` }
    ]
  },
  {
    title: "Major Projects",
    subtitle: "What noteworthy projects would you like to list?",
    items: [
      { label: "Thesis Paper", text: `Thesis Paper: <span style="color:#2563eb">[Thesis Title]</span>` },
      { label: "Capstone Project", text: `<span style="color:#2563eb">[Project Name]</span>, <span style="color:#2563eb">[Your Role and Brief Project Description]</span> - Capstone Project` },
      { label: "Research Projects", text: `<span style="color:#2563eb">[Project Name]</span>, <span style="color:#2563eb">[Project Results Statement]</span> - Research Project` },
      { label: "Dissertation", text: `Dissertation: <span style="color:#2563eb">[Dissertation Title]</span>` }
    ]
  },
  {
    title: "Study Abroad",
    subtitle: "Have you studied overseas? Include your international educational experience here.",
    items: [
      { label: "Study Abroad", text: `Study Abroad: <span style="color:#2563eb">[Subject]</span> - <span style="color:#2563eb">[School Name]</span>, <span style="color:#2563eb">[Location]</span>, <span style="color:#2563eb">[Year]</span> to <span style="color:#2563eb">[Year]</span>` }
    ]
  },
  {
    title: "Apprenticeship and Internship",
    subtitle: "Have you had hands-on experience developing skills that are relevant to your desired job?",
    items: [
      { label: "Apprenticeship", text: `<span style="color:#2563eb">[Apprenticeship Name]</span>, <span style="color:#2563eb">[Organization Name]</span>, Completed <span style="color:#2563eb">[Year]</span>` },
      { label: "Internship", text: `<span style="color:#2563eb">[Internship Name]</span>, <span style="color:#2563eb">[Organization Name]</span>, Completed <span style="color:#2563eb">[Year]</span>` }
    ]
  }
];

// --- INPUT COMPONENTS ---
const ValidatedInput = ({ label, value = "", onChange, placeholder = "", error, required, aiSuggestion, isLoading }) => {
  const strValue = value?.toString() || "";
  const aiStr = aiSuggestion?.toString() || "";
  const hasActiveAISuggestion = aiStr && strValue.toLowerCase() !== aiStr.toLowerCase();
  const showGhost = hasActiveAISuggestion && aiStr.toLowerCase().startsWith(strValue.toLowerCase());

  return (
    <div className="input-wrap group" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <label className="form-label">{label} {required && <span style={{ color: '#ef4444' }}>*</span>}</label>
        {hasActiveAISuggestion && (
          <div className="flex items-center gap-1.5 animate-pulse bg-violet-50 px-2.5 py-0.5 rounded-full border border-violet-100 shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-violet-600 shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
            <span className="text-[10px] font-black text-violet-600 uppercase tracking-widest">AI SUGGESTED</span>
          </div>
        )}
      </div>
      <div className="input-container" style={{ position: 'relative' }}>
        <input
          className={`gap-input ${error ? 'error' : ''} ${hasActiveAISuggestion ? 'ai-glow-border' : ''}`}
          value={strValue}
          onChange={onChange}
          placeholder={hasActiveAISuggestion ? "" : placeholder}
          style={{ position: 'relative', zIndex: 10, background: 'transparent' }}
        />

        {showGhost && (
          <div className="absolute left-[17px] top-1/2 -translate-y-1/2 pointer-events-none z-20 whitespace-pre overflow-hidden pr-20" style={{ fontSize: '15px' }}>
            <span className="opacity-0">{strValue}</span>
            <span className="text-violet-500/50 font-medium">{aiStr.substring(strValue.length)}</span>
          </div>
        )}

        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-30">
          {hasActiveAISuggestion && (
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                onChange({ target: { value: aiStr } });
              }}
              className="bg-gradient-to-br from-violet-600 to-pink-500 text-white p-1.5 rounded-lg shadow-lg hover:scale-110 active:scale-95 transition-all border-0 flex items-center justify-center"
              title="Accept AI"
            >
              <Sparkles size={13} fill="currentColor" />
            </button>
          )}
          {strValue && !error && !hasActiveAISuggestion && <Check size={14} className="input-check-icon" />}
        </div>
      </div>
      {error && <p className="input-error-text">{error}</p>}
    </div>
  );
};

const SelectInput = ({ label, value, onChange, options, placeholder = "Select", disabled = false }) => (
  <div className="input-wrap" style={{ opacity: disabled ? 0.6 : 1, pointerEvents: disabled ? 'none' : 'auto' }}>
    {label && <label className="form-label">{label}</label>}
    <div className="input-container">
      <select className="gap-select" value={value || ""} onChange={onChange} disabled={disabled}>
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <div className="select-arrow-icon"><ChevronDown size={14} /></div>
    </div>
  </div>
);

const formatDates = (startMonth, startYear, endMonth, endYear, isCurrent = false) => {
  if (!startYear && !endYear && !isCurrent) return "";
  const start = startMonth && startYear ? `${startMonth} ${startYear}` : (startYear || "");
  const end = isCurrent ? "Present" : (endMonth && endYear ? `${endMonth} ${endYear}` : (endYear || ""));
  const currentYear = new Date().getFullYear();
  if (!isCurrent && endYear && parseInt(endYear) > currentYear) return `Expected in ${end}`;
  if (start && end) return `${start} – ${end}`;
  return end || start;
};

// --- DEGREE SELECTION COMPONENT ---
// DegreeSelection component merged into main component's view state logic for better control over back flow

const SortableEducationItem = ({ id, edu, idx, onEdit, onDelete, formatDates }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 1,
    position: 'relative',
    opacity: isDragging ? 0.5 : 1
  };

  const title = `${edu.degree || 'Degree'}${edu.field ? ` in ${edu.field}` : ''}`;
  const school = edu.school || 'School Name';
  const dates = formatDates(edu.startMonth, edu.startYear, edu.endMonth, edu.endYear, edu.isCurrent);

  return (
    <div ref={setNodeRef} style={style} className={`summary-card ${isDragging ? 'dragging' : ''}`}>
      <div {...attributes} {...listeners} className="drag-handle" style={{ cursor: 'grab', marginRight: '16px', color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
        <GripVertical size={20} />
      </div>
      <div className="summary-number-col">
        <div className="summary-number">{idx + 1}</div>
      </div>
      <div className="summary-details">
        <h4 className="summary-title">{title}</h4>
        <p className="summary-subtitle">{school} {edu.city && `• ${edu.city}`} {dates && `• ${dates}`}</p>

        {!edu.description && (
          <div className="missing-coursework-container">
            <div className="missing-badge"><span className="red-dot"></span> Missing details</div>
            <div className="add-coursework-link" onClick={() => onEdit(idx)}>+ Add coursework or honors</div>
          </div>
        )}
      </div>
      <div className="item-actions">
        <button className="action-btn icon-btn" onClick={() => onEdit(idx)}><Edit2 size={14} /></button>
        <button className="action-btn icon-btn delete" onClick={() => onDelete(idx)}><Trash2 size={14} /></button>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function Education({ data, setData, templateId, onBack, onNext, onPreview, isQuickEdit, onReturnToDashboard, isFieldSupported, currentTemplateName, isMobile }) {
  const [view, setView] = useState(() => {
    if (data.education && data.education.length > 0) return 'list';
    if (isQuickEdit) return 'degree-selection';
    return 'intro';
  });
  const [editIndex, setEditIndex] = useState(-1);
  const [backupData, setBackupData] = useState(null);

  useEffect(() => {
    if (!Array.isArray(data.education)) {
      setData(prev => ({ ...prev, education: [] }));
    }
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = educationList.findIndex((_, i) => `edu-${i}` === active.id);
      const newIndex = educationList.findIndex((_, i) => `edu-${i}` === over.id);

      const newList = arrayMove(educationList, oldIndex, newIndex);
      setData(prev => ({ ...prev, education: newList }));
    }
  };

  const [isAddingNew, setIsAddingNew] = useState(false);

  const educationList = Array.isArray(data.education) ? data.education : [];

  const handleEdit = (index) => {
    setBackupData([...educationList]);
    setEditIndex(index);
    setIsAddingNew(false);
    setView('form');
  };

  const handleAddNew = () => {
    setBackupData([...educationList]);
    setEditIndex(-1);
    setIsAddingNew(true);
    setView('degree-selection');
  };

  const handleDegreeSelect = (degree) => {
    const newEntry = { school: "", degree: degree, field: "", grade: "", city: "", startMonth: "", startYear: "", endMonth: "", endYear: "", isCurrent: false, description: "" };
    const newList = [...educationList, newEntry];
    setData(prev => ({ ...prev, education: newList }));
    setEditIndex(newList.length - 1);
    setView('form');
  };

  const handleDelete = (index) => {
    const newList = educationList.filter((_, i) => i !== index);
    setData(prev => ({ ...prev, education: newList }));
  };

  const handleCancel = () => {
    if (backupData) setData(prev => ({ ...prev, education: backupData }));

    if (isAddingNew) {
      setView('degree-selection');
    } else {
      setView(educationList.length > 0 ? 'list' : 'intro');
    }
  };

  const handleSave = () => setView('list');

  const goToPrev = () => {
    if (view === 'intro') {
      onBack();
    } else if (view === 'degree-selection') {
      setView(educationList.length > 0 ? 'list' : 'intro');
    } else if (view === 'list') {
      onBack();
    } else if (view === 'form') {
      handleCancel();
    }
  };

  // --- VIEWS ---
  if (view === 'intro') {
    return (
      <div className={`animate-fade education-intro-container ${isMobile ? 'mobile-mode' : ''}`} style={{
        justifyContent: 'center',
        maxWidth: '800px',
        margin: '0 auto',
        padding: isMobile ? '20px' : '0'
      }}>
        <div className="edu-intro-left" style={{ flex: 'none', width: '100%', maxWidth: '600px', textAlign: isMobile ? 'center' : 'left' }}>
          {!isMobile && (
            <button className="back-link" onClick={goToPrev}>
              <ArrowLeft size={16} /> Go Back
            </button>
          )}

          <div className="intro-text-content">
            <h1 className="form-title" style={{ fontSize: isMobile ? '28px' : '36px' }}>
              Great, let’s work on your<br />Education
            </h1>
            <div className="education-intro-text">
              <p className="intro-label">Insight for your career:</p>
              <p className="intro-body">Employers quickly scan this section to understand your foundation. We’ll frame it perfectly for you.</p>
            </div>
          </div>

          <div className="form-footer" style={{
            marginTop: 'auto',
            paddingBottom: '20px',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '16px' : '12px',
            alignItems: 'stretch'
          }}>
            {!isMobile && <button className="btn-preview" onClick={onPreview}>Preview</button>}
            <div style={{ display: 'flex', gap: '12px', flexDirection: isMobile ? 'column' : 'row', width: '100%' }}>
              {isQuickEdit && (
                <button className="btn-next outlined" onClick={onReturnToDashboard}>Dashboard</button>
              )}
              <button className="btn-next primary" onClick={() => educationList.length > 0 ? setView('list') : handleAddNew()} style={{ width: '100%' }}>
                {isMobile ? 'Get Started' : 'Continue'}
              </button>

            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'degree-selection') {
    return (
      <div className={`animate-fade education-container ${isMobile ? 'mobile-mode' : ''}`} style={{ padding: isMobile ? '16px' : '0' }}>
        <button className="back-link" onClick={goToPrev}>
          <ArrowLeft size={16} /> Go Back
        </button>

        <h1 className="form-title" style={{ fontSize: isMobile ? '24px' : '32px' }}>Highest level of education?</h1>
        <p className="degree-subtext">Select the most recent milestone you've reached.</p>

        <div className="degree-grid" style={{
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: isMobile ? '12px' : '16px'
        }}>
          {[
            "Secondary School", "Vocational Certificate", "Apprenticeship",
            "Associate Degree", "Bachelor's Degree", "Master's Degree",
            "Doctorate or Ph.D."
          ].map(deg => (
            <button key={deg} className="degree-btn" onClick={() => handleDegreeSelect(deg)} style={{ padding: isMobile ? '16px' : '20px' }}>
              {deg}
            </button>
          ))}
          <button className="degree-btn" onClick={() => handleDegreeSelect("")} style={{ borderStyle: 'dashed', borderColor: '#94a3b8', color: '#64748b', padding: isMobile ? '16px' : '20px' }}>
            Other / Custom
          </button>
        </div>

        <div className="form-footer" style={{ marginTop: 'auto', paddingBottom: '20px', display: 'flex', justifyContent: 'center' }}>
          <button className="btn-cancel" onClick={() => setView('list')}>Skip for now</button>
        </div>
      </div>
    );
  }

  if (view === 'list') {
    return (
      <div className={`animate-fade education-container ${isMobile ? 'mobile-mode' : ''}`} style={{ padding: isMobile ? '16px' : '0' }}>
        <button className="back-link" onClick={goToPrev}>
          <ArrowLeft size={16} /> Go Back
        </button>

        <div className="form-header" style={{ marginBottom: '40px' }}>
          <h1 className="form-title">Education summary</h1>
          <p className="form-subtitle">Highlight your academic journey and achievements.</p>
        </div>

        <div className="summary-list">
          {educationList.length === 0 ? (
            <div className="empty-summary-state animate-fade">
              <div className="empty-state-icon">
                <GraduationCap size={48} />
              </div>
              <div className="empty-state-content">
                <h3 className="empty-state-title">No education entries added yet</h3>
                <p className="empty-state-text">Your academic journey is an important part of your professional story. Start by adding your highest level of education.</p>
              </div>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={educationList.map((_, i) => `edu-${i}`)}
                strategy={verticalListSortingStrategy}
              >
                {educationList.map((edu, idx) => (
                  <SortableEducationItem
                    key={`edu-${idx}`}
                    id={`edu-${idx}`}
                    edu={edu}
                    idx={idx}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    formatDates={formatDates}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>

        <button className="btn-add-another dashed" onClick={handleAddNew}>
          <Plus size={16} /> Add another education
        </button>

        <div className="studio-tip" style={{ marginTop: '24px' }}>
          <div className="studio-tip-icon">
            <Lightbulb size={24} />
          </div>
          <div className="studio-tip-content">
            <span className="studio-tip-title">Expert Advice</span>
            <p className="studio-tip-text">If you have a higher degree, you can omit your high school details unless it's specifically relevant.</p>
          </div>
        </div>

        <div className="form-footer" style={{
          borderTop: '1px solid var(--gap-border)',
          paddingTop: '32px',
          marginTop: 'auto',
          display: 'flex',
          justifyContent: isMobile ? 'stretch' : 'flex-end'
        }}>
          <button
            className="btn-next primary"
            onClick={isQuickEdit ? onReturnToDashboard : onNext}
            style={{ width: isMobile ? '100%' : 'auto', minWidth: '240px' }}
          >
            {isQuickEdit ? 'Save Changes' : 'Continue to Experience'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <EducationForm
      index={editIndex}
      data={data}
      setData={setData}
      onSave={handleSave}
      onCancel={handleCancel}
      onPreview={onPreview}
      isQuickEdit={isQuickEdit}
      onReturnToDashboard={onReturnToDashboard}
      isFieldSupported={isFieldSupported}
      currentTemplateName={currentTemplateName}
      goToPrev={goToPrev}
      isMobile={isMobile}
    />
  );
}

// --- FORM COMPONENT ---
function EducationForm({ index, data, setData, onSave, onCancel, onPreview, isQuickEdit, onReturnToDashboard, isFieldSupported, currentTemplateName, goToPrev, isMobile }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [openSection, setOpenSection] = useState(0);
  const [showLinkPopup, setShowLinkPopup] = useState(false);
  const [linkData, setLinkData] = useState({ text: '', url: '' });
  const [errors, setErrors] = useState({});
  const [eduSuggestions, setEduSuggestions] = useState({ school: null, city: null, degree: null, field: null });
  const [isGeneratingBullets, setIsGeneratingBullets] = useState(false);
  const [localForm, setLocalForm] = useState(data.education[index] || {
    school: "", degree: "", field: "", grade: "", city: "", startMonth: "", startYear: "", endMonth: "", endYear: "", isCurrent: false, description: ""
  });

  useEffect(() => {
    if (data.education && data.education[index]) {
      setLocalForm(data.education[index]);
    }
  }, [index, data.education]);
  const [isAiThinking, setIsAiThinking] = useState({ school: false, city: false, degree: false, field: false });

  // Sync to parent for live preview
  const syncToParent = (updatedForm) => {
    const updatedList = [...(data.education || [])];
    updatedList[index] = updatedForm;
    setData(prev => ({ ...prev, education: updatedList }));
  };

  const handleChange = (field, value) => {
    const updated = { ...localForm, [field]: value };
    setLocalForm(updated);
    syncToParent(updated);

    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));

    // Trigger AI Intelligence for specific fields
    if (['school', 'degree', 'field', 'city'].includes(field)) {
      handleEduIntelligence(field, value, updated);
    }
  };

  const form = localForm;

  const handleEduIntelligence = async (field, value, currentForm) => {
    // Only trigger after 3 characters to avoid noisy guessing
    if (value.length >= 3) {
      setIsAiThinking(prev => ({ ...prev, [field]: true }));
      const context = {
        userCity: data.personal?.city,
        userProfession: data.personal?.profession,
        currentEntry: currentForm,
        typingField: field
      };

      console.log(`[EDU DEBUG] Intelligence for ${field}: "${value}"`, context);
      const aiRes = await getAIHeaderAdvice("education", value, context);
      setIsAiThinking(prev => ({ ...prev, [field]: false }));

      if (aiRes) {
        try {
          // Robust JSON Extraction (handles ```json ... ``` and other garbage)
          let cleanJson = aiRes;
          if (typeof cleanJson === 'string') {
            const match = cleanJson.match(/\{[\s\S]*\}/);
            if (match) cleanJson = match[0];
          }

          const parsed = (typeof cleanJson === 'string') ? JSON.parse(cleanJson) : cleanJson;
          if (parsed) {
            // Rule: If we type a school, we can suggest city/degree/field bundles (Lookahead)
            if (field === 'school') { // dcc9309e-4e26-4110-a160-04f07c2a8b7e
              setEduSuggestions({
                school: parsed.school || null,
                city: parsed.city || null,
                degree: parsed.degree || null,
                field: parsed.field || null
              });
            } else if (field === 'degree') { // 4078fc80-7f38-448c-8e0e-c388b57097b2
              // Gated Flow: Clear older fields, only look forward to 'field'
              setEduSuggestions(prev => ({
                ...prev,
                school: null,
                city: null,
                degree: parsed.degree || null,
                field: parsed.field || null
              }));
            } else {
              // Current field only: Clear backward look
              setEduSuggestions(prev => ({
                ...prev,
                school: null,
                city: null,
                [field]: parsed[field] || null
              }));
            }
          }
        } catch (e) {
          console.error("[EDU DEBUG] Parse Error:", e);
        }
      }
    } else if (value.length === 0) {
      setEduSuggestions(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.school?.trim()) newErrors.school = "School Name is required";
    if (!form.degree?.trim()) newErrors.degree = "Degree is required";

    // Date validation
    if (form.startYear && form.endYear) {
      const sYear = parseInt(form.startYear);
      const eYear = parseInt(form.endYear);
      if (sYear > eYear) {
        newErrors.dates = "In order to proceed, your end date can't be before the start date.";
      } else if (sYear === eYear && form.startMonth && form.endMonth) {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const sMonthIdx = months.indexOf(form.startMonth);
        const eMonthIdx = months.indexOf(form.endMonth);
        if (sMonthIdx > eMonthIdx) {
          newErrors.dates = "In order to proceed, your end date can't be before the start date.";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveInternal = () => {
    if (validate()) {
      isQuickEdit ? onReturnToDashboard() : onSave();
    } else if (isMobile) {
      setTimeout(() => {
        const firstError = document.querySelector('.input-error-text, .error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };


  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  };

  const appendDescription = (htmlText) => {
    const cleanText = stripHtml(htmlText);
    const cleanDesc = stripHtml(form.description);

    if (cleanDesc.includes(cleanText)) return;

    const currentDesc = form.description || "";
    const newText = `<li>${htmlText}</li>`;
    const updated = currentDesc.includes("<ul>")
      ? currentDesc.replace("</ul>", `${newText}</ul>`)
      : currentDesc + `<ul>${newText}</ul>`;
    handleChange("description", updated);
  };

  const insertLink = () => {
    if (!linkData.url) return;
    const linkHtml = `<a href="${linkData.url}" target="_blank" style="color: #1a56db; text-decoration: underline;">${linkData.text || linkData.url}</a>`;
    const currentDesc = form.description || "";

    let updated;
    if (currentDesc.includes("</ul>")) {
      updated = currentDesc.replace("</ul>", `<li>${linkHtml}</li></ul>`);
    } else {
      updated = currentDesc + (currentDesc ? " " : "") + linkHtml;
    }

    handleChange("description", updated);
    setShowLinkPopup(false);
    setLinkData({ text: '', url: '' });
  };

  const toggleSection = (idx) => setOpenSection(openSection === idx ? -1 : idx);

  return (
    <div className="animate-fade education-container">
      <button className="back-link" onClick={goToPrev} style={{ marginBottom: '20px' }}>
        <ArrowLeft size={16} /> Go Back
      </button>

      <h1 className="form-title" style={{ marginBottom: isMobile ? '16px' : '24px', fontSize: isMobile ? '24px' : '32px' }}>{form.school ? "Edit Education" : "Add Education"}</h1>

      <div className="form-row" style={{ flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '20px' : '24px' }}>
        <div className="form-col">
          <div className="input-group">
            <ValidatedInput
              label="School Name"
              value={form.school}
              onChange={e => {
                handleChange("school", e.target.value);
              }}
              required
              error={errors.school}
              aiSuggestion={eduSuggestions.school}
              isLoading={isAiThinking.school}
            />
            <CompatibilityWarning isSupported={isFieldSupported('education.school')} templateName={currentTemplateName} />
          </div>
        </div>
        <div className="form-col">
          <div className="input-group">
            <ValidatedInput
              label="School Location"
              value={form.city}
              onChange={e => {
                handleChange("city", e.target.value);
              }}
              placeholder="e.g. New York, NY"
              aiSuggestion={eduSuggestions.city}
              isLoading={isAiThinking.city}
            />
            <CompatibilityWarning isSupported={isFieldSupported('education.city')} templateName={currentTemplateName} />
          </div>
        </div>
      </div>

      <div className="form-row">
        <div className="form-col">
          <div className="input-group">
            <ValidatedInput
              label="Degree"
              value={form.degree}
              onChange={e => {
                handleChange("degree", e.target.value);
              }}
              placeholder="e.g. Bachelor of Science"
              required
              error={errors.degree}
              aiSuggestion={eduSuggestions.degree}
              isLoading={isAiThinking.degree}
            />
            <CompatibilityWarning isSupported={isFieldSupported('education.degree')} templateName={currentTemplateName} />
          </div>
        </div>
        <div className="form-col">
          <div className="input-group">
            <ValidatedInput
              label="Field of Study"
              value={form.field}
              onChange={e => {
                handleChange("field", e.target.value);
              }}
              placeholder="e.g. Computer Science"
              aiSuggestion={eduSuggestions.field}
              isLoading={isAiThinking.field}
            />
            <CompatibilityWarning isSupported={isFieldSupported('education.field')} templateName={currentTemplateName} />
          </div>
        </div>
      </div>

      <div className="form-row">
        <div className="form-col">
          <div className="input-group">
            <ValidatedInput label="Percentage / GPA" value={form.grade} onChange={e => handleChange("grade", e.target.value)} placeholder="e.g. 85% or 3.8 GPA" />
            <CompatibilityWarning isSupported={isFieldSupported('education.grade')} templateName={currentTemplateName} />
          </div>
        </div>
        <div className="form-col"></div>
      </div>

      <div className="form-row" style={{
        flexWrap: 'wrap',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '20px' : '24px',
        marginTop: isMobile ? '20px' : '24px'
      }}>
        <div className="form-col">
          <div className="input-group">
            <label className="form-label">Start Date</label>
            <CompatibilityWarning isSupported={isFieldSupported('education.startYear')} templateName={currentTemplateName} />
          </div>
          <div className="date-group">
            <SelectInput placeholder="Month" value={form.startMonth} options={months} onChange={e => handleChange("startMonth", e.target.value)} />
            <SelectInput placeholder="Year" value={form.startYear} options={years} onChange={e => handleChange("startYear", e.target.value)} />
          </div>
        </div>
        <div className="form-col">
          <div className="input-group">
            <label className="form-label">Graduation Date</label>
            <CompatibilityWarning isSupported={isFieldSupported('education.endYear')} templateName={currentTemplateName} />
          </div>
          <div className="date-group">
            <SelectInput
              placeholder="Month"
              value={form.endMonth}
              options={months}
              onChange={e => handleChange("endMonth", e.target.value)}
              disabled={form.isCurrent}
            />
            <SelectInput
              placeholder="Year"
              value={form.endYear}
              options={years}
              onChange={e => handleChange("endYear", e.target.value)}
              disabled={form.isCurrent}
            />
          </div>
          <div className="checkbox-wrapper" style={{ marginTop: '12px' }}>
            <input
              type="checkbox"
              id="currentEdu"
              checked={form.isCurrent}
              onChange={(e) => {
                const isChecked = e.target.checked;
                const updated = { ...form, isCurrent: isChecked };
                if (isChecked) {
                  updated.endMonth = "";
                  updated.endYear = "";
                }
                setLocalForm(updated);
                syncToParent(updated);
              }}
            />
            <label htmlFor="currentEdu">I am currently enrolled</label>
            <CompatibilityWarning isSupported={isFieldSupported('education.isCurrent')} templateName={currentTemplateName} />
          </div>
        </div>
        {errors.dates && (
          <div style={{ width: '100%', marginTop: '8px' }}>
            <p className="input-error-text" style={{ padding: '8px 12px', background: '#fef2f2', borderRadius: '4px', border: '1px solid #fecaca' }}>
              {errors.dates}
            </p>
          </div>
        )}
      </div>

      <div className="collapsible-trigger" onClick={() => setIsExpanded(!isExpanded)}>
        <span className="collapsible-label">{isExpanded ? "Close Additional Details" : "Add any additional coursework you're proud to showcase"}</span>
        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>

      {isExpanded && (
        <div className="workstation-wrapper animate-fade" style={{ padding: isMobile ? '12px' : '24px' }}>
          <div className="studio-tip" style={{ marginBottom: '24px' }}>
            <div className="studio-tip-icon">
              <Lightbulb size={24} />
            </div>
            <div className="studio-tip-content">
              <span className="studio-tip-title">Expert Advice</span>
              <p className="studio-tip-text">If you have a higher degree (like a Master's or PhD), you can omit your high school details unless it's specifically relevant to the role or a prestigious achievement.</p>
            </div>
          </div>

          <div className="studio-workstation" style={{
            flexDirection: isMobile ? 'column' : 'row',
            height: isMobile ? '750px' : '580px',
            gap: 0
          }}>
            {showLinkPopup && (
              <div className="link-overlay">
                <div className="link-popup">
                  <div className="link-popup-title"><LinkIcon size={20} color="var(--gap-primary)" /> Insert Link</div>
                  <div className="link-field-group">
                    <label className="link-label">Text to display</label>
                    <input className="link-input" placeholder="e.g. My Portfolio" value={linkData.text} onChange={(e) => setLinkData({ ...linkData, text: e.target.value })} autoFocus />
                  </div>
                  <div className="link-field-group">
                    <label className="link-label">URL</label>
                    <input className="link-input" placeholder="https://..." value={linkData.url} onChange={(e) => setLinkData({ ...linkData, url: e.target.value })} />
                  </div>
                  <div className="link-actions">
                    <button className="btn-cancel" style={{ padding: '8px 16px' }} onClick={() => setShowLinkPopup(false)}>Cancel</button>
                    <button className="btn-next primary" style={{ padding: '8px 24px' }} onClick={insertLink}>Add Link</button>
                  </div>
                </div>
              </div>
            )}
            <div className="studio-ws-sidebar">
              <div className="studio-ws-sidebar-header" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 className="studio-ws-sidebar-title">Ready-to-use examples</h3>
                <CompatibilityWarning isSupported={isFieldSupported('education.description')} templateName={currentTemplateName} />
              </div>
              <div className="studio-ws-sidebar-scroll">
                {exampleCategories.map((cat, idx) => (
                  <div key={idx} className={`studio-acc-item ${openSection === idx ? 'expanded' : ''}`}>
                    <div className="studio-acc-header" onClick={() => toggleSection(idx)}>
                      <span>{cat.title}</span>
                      {openSection === idx ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </div>
                    {openSection === idx && (
                      <div className="studio-acc-body">
                        {cat.items.map((item, i) => {
                          const isAdded = stripHtml(form.description).includes(stripHtml(item.text));
                          return (
                            <button
                              key={i}
                              className={`studio-example-pill ${isAdded ? 'added' : ''}`}
                              onClick={() => appendDescription(item.text)}
                              disabled={isAdded}
                            >
                              <span className="studio-pill-icon">{isAdded ? <Check size={12} /> : <Plus size={12} />}</span>
                              <span className="studio-pill-text">{item.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="studio-ws-editor" style={{ height: isMobile ? '400px' : 'none', flex: 1 }}>
              <div className="studio-ws-editor-header" style={{
                display: 'flex',
                alignItems: isMobile ? 'flex-start' : 'center',
                justifyContent: 'space-between',
                width: '100%',
                flexDirection: isMobile ? 'column' : 'row',
                gap: isMobile ? '12px' : '0',
                padding: isMobile ? '16px' : '20px 24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="studio-ws-editor-label">EDUCATION DESCRIPTION</span>
                  <CompatibilityWarning isSupported={isFieldSupported('education.description')} templateName={currentTemplateName} />
                </div>
              </div>
              <div className="studio-editor-canvas">
                <EditorProvider>
                  <Editor
                    value={form.description || ''}
                    onChange={(e) => handleChange("description", e.target.value)}
                    containerProps={{
                      style: {
                        height: '100%',
                        border: 'none',
                        outline: 'none',
                        overflowY: 'auto'
                      }
                    }}
                  >
                    <Toolbar>
                      <BtnBold /><BtnItalic /><BtnUnderline /><BtnBulletList />
                      <button className="rsw-btn studio-rsw-btn" onClick={() => setShowLinkPopup(true)} title="Insert Link">
                        <LinkIcon size={14} />
                      </button>
                    </Toolbar>
                  </Editor>
                </EditorProvider>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="form-footer" style={{
        marginTop: isMobile ? '40px' : '60px',
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px'
      }}>
        {!isMobile && <button className="btn-cancel" onClick={onCancel}>Cancel</button>}
        <button
          className="btn-next primary"
          onClick={handleSaveInternal}
          style={{ width: isMobile ? '100%' : 'auto', minWidth: '240px' }}
        >
          {isQuickEdit ? 'Save Changes' : 'Save & Next'}
        </button>
      </div>
    </div>
  );
}