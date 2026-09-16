import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "../../../styles/createqQuestionPaper.css";
import type { QuestionPaper, SectionItem, OptionItem, QuestionItem } from "../models/questionPaper";
import { questionPaperService } from "../services/questionPaperService";

const DEFAULT_OPTIONS: OptionItem[] = [
  { id: "opt-1", label: "A", text: "Option A" },
  { id: "opt-2", label: "B", text: "Option B" },
  { id: "opt-3", label: "C", text: "Option C" },
  { id: "opt-4", label: "D", text: "Option D" },
];

import { SAMPLE_HINDI_SECTIONS } from "../services/questionPaperService";

const INITIAL_SECTIONS: SectionItem[] = SAMPLE_HINDI_SECTIONS;

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

export function CreateQuestionPaper() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const paperIdParam = searchParams.get("id");

  // Form State for Paper Config
  const [paperId, setPaperId] = useState<string | number | null>(paperIdParam);
  const [title, setTitle] = useState<string>("Operator Technical and Safety Assessment Question Paper");
  const [subTitle, setSubTitle] = useState<string>("Technical & Safety Evaluation Assessment");
  const [description, setDescription] = useState<string>(
    "मानकीकृत कार्यप्रणाली (SOP), 5S, PPE एवं गुणवत्ता नियंत्रण से संबंधित आवश्यक मूल्यांकन प्रश्न पत्र।"
  );
  const [code, setCode] = useState<string>("ASTI-QP-SOP-01");
  const [department, setDepartment] = useState<string>("Production");
  const [subDepartment, setSubDepartment] = useState<string>("Section A");
  const [lineSection, setLineSection] = useState<string>("Line 1");
  const [allowedTime, setAllowedTime] = useState<number>(30);
  const [passingScore, setPassingScore] = useState<number>(70);
  const [paperStatus, setPaperStatus] = useState<"PUBLISHED" | "DRAFT" | "ARCHIVED">("PUBLISHED");

  // Sections & Questions State
  const [sections, setSections] = useState<SectionItem[]>(INITIAL_SECTIONS);
  const [activeSectionId, setActiveSectionId] = useState<string>("sec-1");
  const [activeQuestionId, setActiveQuestionId] = useState<string>("q-1-1");
  const [questionSearch, setQuestionSearch] = useState<string>("");

  const [showAddSectionModal, setShowAddSectionModal] = useState<boolean>(false);
  const [newSectionName, setNewSectionName] = useState<string>("");
  const [newSectionSubtitle, setNewSectionSubtitle] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load existing paper if editing
  useEffect(() => {
    if (paperIdParam) {
      const existing = questionPaperService.getById(paperIdParam);
      if (existing) {
        setPaperId(existing.id);
        setTitle(existing.title || "");
        setSubTitle(existing.subTitle || "");
        setDescription(existing.description || "");
        setCode(existing.code || "");
        setDepartment(existing.department || "Production");
        setSubDepartment(existing.subDepartment || "Section A");
        setLineSection(existing.lineSection || "Line 1");
        setAllowedTime(existing.allowedTime || 60);
        setPassingScore(existing.passingScore || 20);
        setPaperStatus(existing.status || "PUBLISHED");
        if (existing.sections && existing.sections.length > 0) {
          setSections(existing.sections);
          setActiveSectionId(existing.sections[0].id);
          if (existing.sections[0].questions.length > 0) {
            setActiveQuestionId(existing.sections[0].questions[0].id);
          }
        }
      }
    }
  }, [paperIdParam]);

  // Active section & question lookup
  const activeSection = sections.find((s) => s.id === activeSectionId) || sections[0];
  const activeQuestions = activeSection?.questions || [];
  const activeQuestion =
    activeQuestions.find((q) => q.id === activeQuestionId) || activeQuestions[0];
  const activeQuestionIndex = activeQuestions.findIndex((q) => q.id === activeQuestion?.id);

  // Filtered questions in active section
  const filteredQuestions = activeQuestions.filter((q) =>
    (q.questionText || "").toLowerCase().includes(questionSearch.toLowerCase())
  );

  // Update current active question helper
  const updateActiveQuestion = (patch: Partial<QuestionItem>) => {
    if (!activeQuestion) return;
    setSections((prevSections) =>
      prevSections.map((sec) => {
        if (sec.id !== activeSectionId) return sec;
        return {
          ...sec,
          questions: sec.questions.map((q) =>
            q.id === activeQuestion.id ? { ...q, ...patch } : q
          ),
        };
      })
    );
  };

  // Section Handlers
  const handleAddSection = () => {
    if (!newSectionName.trim()) return;
    const newSec: SectionItem = {
      id: `sec-${Date.now()}`,
      name: newSectionName.trim(),
      subtitle: newSectionSubtitle.trim() || "Questions",
      questions: [
        {
          id: `q-${Date.now()}-1`,
          type: "Multiple Choice (MCQ)",
          questionText: "Write your question here.",
          options: DEFAULT_OPTIONS.map((o) => ({ ...o, id: `opt-${Date.now()}-${o.label}` })),
          correctOptionId: `opt-${Date.now()}-B`,
          marks: 1,
          negativeMarks: 0,
          difficulty: "Medium",
          isRequired: true,
        },
      ],
    };

    setSections((prev) => [...prev, newSec]);
    setActiveSectionId(newSec.id);
    setActiveQuestionId(newSec.questions[0].id);
    setNewSectionName("");
    setNewSectionSubtitle("");
    setShowAddSectionModal(false);
  };

  const handleDeleteSection = (e: React.MouseEvent, secId: string) => {
    e.stopPropagation();
    if (sections.length <= 1) return;
    const updated = sections.filter((s) => s.id !== secId);
    setSections(updated);
    if (activeSectionId === secId) {
      setActiveSectionId(updated[0].id);
      setActiveQuestionId(updated[0].questions[0]?.id || "");
    }
  };

  // Question Handlers
  const handleAddQuestion = () => {
    if (!activeSection) return;
    const newQId = `q-${Date.now()}`;
    const newOptions: OptionItem[] = [
      { id: `${newQId}-a`, label: "A", text: "Option A" },
      { id: `${newQId}-b`, label: "B", text: "Option B" },
      { id: `${newQId}-c`, label: "C", text: "Option C" },
      { id: `${newQId}-d`, label: "D", text: "Option D" },
    ];
    const newQuestion: QuestionItem = {
      id: newQId,
      type: "Multiple Choice (MCQ)",
      questionText: "Write your question here.",
      options: newOptions,
      correctOptionId: newOptions[1].id,
      marks: 1,
      negativeMarks: 0,
      difficulty: "Medium",
      isRequired: true,
    };

    setSections((prev) =>
      prev.map((s) =>
        s.id === activeSectionId
          ? { ...s, questions: [...s.questions, newQuestion] }
          : s
      )
    );
    setActiveQuestionId(newQId);
  };

  const handleDeleteQuestion = (e: React.MouseEvent, qId: string) => {
    e.stopPropagation();
    if (activeQuestions.length <= 1) return;
    const updatedQuestions = activeQuestions.filter((q) => q.id !== qId);
    setSections((prev) =>
      prev.map((s) =>
        s.id === activeSectionId ? { ...s, questions: updatedQuestions } : s
      )
    );
    if (activeQuestionId === qId) {
      setActiveQuestionId(updatedQuestions[0].id);
    }
  };

  // Option Handlers
  const handleAddOption = () => {
    if (!activeQuestion) return;
    if (activeQuestion.options.length >= 6) return;
    const nextIdx = activeQuestion.options.length;
    const nextLetter = OPTION_LETTERS[nextIdx] || `Opt ${nextIdx + 1}`;
    const newOpt: OptionItem = {
      id: `opt-${Date.now()}-${nextLetter}`,
      label: nextLetter,
      text: `Option ${nextLetter}`,
    };
    updateActiveQuestion({
      options: [...activeQuestion.options, newOpt],
    });
  };

  const handleUpdateOptionText = (optId: string, text: string) => {
    if (!activeQuestion) return;
    updateActiveQuestion({
      options: activeQuestion.options.map((o) =>
        o.id === optId ? { ...o, text } : o
      ),
    });
  };

  const handleDeleteOption = (optId: string) => {
    if (!activeQuestion || activeQuestion.options.length <= 2) return;
    const remaining = activeQuestion.options.filter((o) => o.id !== optId);
    const reindexed = remaining.map((o, idx) => ({
      ...o,
      label: OPTION_LETTERS[idx] || String(idx + 1),
    }));
    let newCorrect = activeQuestion.correctOptionId;
    if (activeQuestion.correctOptionId === optId) {
      newCorrect = reindexed[0]?.id || "";
    }
    updateActiveQuestion({
      options: reindexed,
      correctOptionId: newCorrect,
    });
  };

  const handleSetCorrectOption = (optId: string) => {
    updateActiveQuestion({ correctOptionId: optId });
  };

  // Navigation handlers
  const handlePrevQuestion = () => {
    if (activeQuestionIndex > 0) {
      setActiveQuestionId(activeQuestions[activeQuestionIndex - 1].id);
    }
  };

  const handleNextQuestion = () => {
    if (activeQuestionIndex < activeQuestions.length - 1) {
      setActiveQuestionId(activeQuestions[activeQuestionIndex + 1].id);
    }
  };

  // Save Paper Handler (CRUD to LocalStorage / Localhost)
  const handleSavePaper = () => {
    if (!title.trim()) {
      alert("Please enter a Test Paper Title");
      return;
    }

    const paperData: Partial<QuestionPaper> & { title: string } = {
      id: paperId || undefined,
      title: title.trim(),
      subTitle: subTitle.trim(),
      description: description.trim(),
      code: code.trim() || "ASTI TECHNICAL EVALUATION TEST PAPER",
      department,
      subDepartment,
      lineSection,
      allowedTime: Number(allowedTime) || 60,
      passingScore: Number(passingScore) || 20,
      status: paperStatus,
      sections,
    };

    const saved = questionPaperService.save(paperData);
    setPaperId(saved.id);
    setToastMessage(`Question Paper "${saved.title}" saved successfully!`);

    setTimeout(() => {
      setToastMessage(null);
      navigate("/lms/course-management");
    }, 1200);
  };

  // Preview Paper — auto-save draft then open preview page
  const handlePreviewPaper = () => {
    const paperData: Partial<QuestionPaper> & { title: string } = {
      id: paperId || undefined,
      title: title.trim() || "SKILL EVALUATION TEST PAPER",
      subTitle: subTitle.trim(),
      description: description.trim(),
      code: code.trim() || "ASTI TECHNICAL EVALUATION TEST PAPER",
      department,
      subDepartment,
      lineSection,
      allowedTime: Number(allowedTime) || 60,
      passingScore: Number(passingScore) || 20,
      status: paperStatus,
      sections,
    };
    const saved = questionPaperService.save(paperData);
    setPaperId(saved.id);
    navigate(`/lms/preview-question-paper?id=${saved.id}`);
  };

  return (
    <>
      <div className="container-fluid g-0 p-4 p-md-5 question-paper-container">
        {/* Top Navbar Header (from User Image) */}
        <div className="qp-top-navbar">
          <div className="d-flex align-items-center gap-3">
            {/* ASTI Logo Box */}
            <div className="qp-ntf-logo-box">
              <img className="w-100 h-100 object-fit-contain" src="/public/asti-logo.png" alt="" />
            </div>
            <div>
              <h4 className="qp-top-title">Question Paper Editor</h4>
              <p className="qp-top-subtitle">ASTI Skill Evaluation &amp; Assessment Management</p>
            </div>
          </div>

          <div className="qp-top-actions">
            <button
              type="button"
              className="qp-btn-preview"
              onClick={handlePreviewPaper}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Preview Paper
            </button>

            <button
              type="button"
              className="qp-btn-save-header"
              onClick={handleSavePaper}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              Save Paper
            </button>
          </div>
        </div>

        {/* Top Header Config Card */}
        <div className="row g-0 p-4 rounded-3 border border-secondary-subtle shadow-sm qp-config-card">
          <div className="row g-0 align-items-center mb-2">
            <div className="col-auto me-3">
              <div className="qp-header-icon-box">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
            </div>
            <div className="col">
              <h5 className="fw-bold text-dark mb-0">Paper Details &amp; Header Config</h5>
              <p className="text-primary fw-semibold mb-0" style={{ fontSize: "0.88rem" }}>
                {title || "SKILL EVALUATION TEST PAPER"}
              </p>
            </div>
            <div className="col-auto d-flex align-items-center gap-2">
              <select
                className="form-select form-select-sm"
                value={paperStatus}
                onChange={(e) => setPaperStatus(e.target.value as "PUBLISHED" | "DRAFT" | "ARCHIVED")}
                style={{ width: "130px", fontWeight: 600 }}
              >
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="DRAFT">DRAFT</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>
          </div>
          <hr className="my-3 text-secondary-subtle" />
          <div className="row g-3 align-items-center">
            <div className="col-md-6 px-2">
              <label className="qp-config-label">Test Paper Title</label>
              <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="SKILL EVALUATION TEST PAPER"
              />
            </div>
            <div className="col-md-6 px-2">
              <label className="qp-config-label">Paper Sub-Title / Module</label>
              <input
                type="text"
                className="form-control"
                value={subTitle}
                onChange={(e) => setSubTitle(e.target.value)}
                placeholder="New Manpower Technical Assessment"
              />
            </div>
          </div>
          <div className="row g-3 align-items-center mt-1">
            <div className="col-12 px-2">
              <label className="qp-config-label">Descriptions / Notes</label>
              <input
                type="text"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Assessment module for technical skills & safety procedures."
              />
            </div>
          </div>
          <div className="row g-3 align-items-center mt-1">
            <div className="col-md-6 px-2">
              <label className="qp-config-label">Evaluation Paper Code / Ref</label>
              <input
                type="text"
                className="form-control"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="ASTI TECHNICAL EVALUATION TEST PAPER"
              />
            </div>
            <div className="col-md-6 px-2">
              <label className="qp-config-label">Department</label>
              <select
                className="form-select"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="Production">Production</option>
                <option value="Quality Assurance">Quality Assurance</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Operations">Operations</option>
              </select>
            </div>
          </div>
          <div className="row g-3 align-items-center mt-1">
            <div className="col-md-6 px-2">
              <label className="qp-config-label">Sub Department</label>
              <select
                className="form-select"
                value={subDepartment}
                onChange={(e) => setSubDepartment(e.target.value)}
              >
                <option value="Section A">Section A</option>
                <option value="Section B">Section B</option>
                <option value="Section C">Section C</option>
                <option value="Section D">Section D</option>
              </select>
            </div>
            <div className="col-md-6 px-2">
              <label className="qp-config-label">Line / Section</label>
              <select
                className="form-select"
                value={lineSection}
                onChange={(e) => setLineSection(e.target.value)}
              >
                <option value="Line 1">Line 1</option>
                <option value="Line 2">Line 2</option>
                <option value="Line 3">Line 3</option>
                <option value="Line 4">Line 4</option>
              </select>
            </div>
          </div>
          <div className="row g-3 align-items-center mt-1">
            <div className="col-md-6 px-2">
              <label className="qp-config-label">Allowed Time (Minutes)</label>
              <input
                type="number"
                className="form-control"
                value={allowedTime}
                onChange={(e) => setAllowedTime(Number(e.target.value) || 0)}
                placeholder="60"
              />
            </div>
            <div className="col-md-6 px-2">
              <label className="qp-config-label">Passing Score %</label>
              <input
                type="number"
                className="form-control"
                value={passingScore}
                onChange={(e) => setPassingScore(Number(e.target.value) || 0)}
                placeholder="20"
              />
            </div>
          </div>
        </div>

        {/* Builder Layout Row: Left (Sections & Questions) + Right (Edit Question) */}
        <div className="row g-4 qp-builder-row">
          {/* Left Column (Sections & Questions in active section) */}
          <div className="col-12 col-lg-4 col-xl-4">
            {/* Sections Card */}
            <div className="qp-panel-card">
              <div className="d-flex align-items-center justify-content-between">
                <h5 className="qp-card-title">Sections ({sections.length})</h5>
                <button
                  type="button"
                  className="qp-section-btn-add"
                  onClick={() => setShowAddSectionModal(true)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add Section
                </button>
              </div>

              {/* Sections list */}
              <div className="qp-section-list">
                {sections.map((sec) => {
                  const isActive = sec.id === activeSectionId;
                  return (
                    <div
                      key={sec.id}
                      className={`qp-section-item ${isActive ? "active" : ""}`}
                      onClick={() => {
                        setActiveSectionId(sec.id);
                        if (sec.questions.length > 0) {
                          setActiveQuestionId(sec.questions[0].id);
                        }
                      }}
                    >
                      <div className="d-flex align-items-center flex-grow-1 overflow-hidden">
                        {/* Drag 6-dot icon */}
                        <div className="qp-drag-handle" title="Reorder section">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="8.5" cy="5" r="1.8" />
                            <circle cx="15.5" cy="5" r="1.8" />
                            <circle cx="8.5" cy="12" r="1.8" />
                            <circle cx="15.5" cy="12" r="1.8" />
                            <circle cx="8.5" cy="19" r="1.8" />
                            <circle cx="15.5" cy="19" r="1.8" />
                          </svg>
                        </div>
                        <div className="text-truncate me-2">
                          <div className="qp-section-name text-truncate">{sec.name}</div>
                          <div className="qp-section-subtitle text-truncate">{sec.subtitle}</div>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <span className="qp-badge-count">{sec.questions.length} Qs</span>
                        {sections.length > 1 && (
                          <button
                            type="button"
                            className="qp-icon-action-btn"
                            title="Delete section"
                            onClick={(e) => handleDeleteSection(e, sec.id)}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Questions in Section Card */}
            <div className="qp-panel-card">
              <h5 className="qp-card-title">
                Questions in {activeSection?.name || "Section"}
              </h5>

              {/* Search, Filter & Add Question */}
              <div className="qp-search-bar-row">
                <div className="qp-search-wrapper">
                  <svg
                    className="qp-search-icon"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input
                    type="text"
                    className="qp-search-input"
                    placeholder="Search questions..."
                    value={questionSearch}
                    onChange={(e) => setQuestionSearch(e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  className="qp-filter-btn"
                  title="Filter questions"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                  </svg>
                </button>

                <button
                  type="button"
                  className="qp-btn-add-question"
                  onClick={handleAddQuestion}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add Question
                </button>
              </div>

              {/* Question list items */}
              <div className="qp-question-list">
                {filteredQuestions.length === 0 ? (
                  <div className="text-center py-4 text-muted" style={{ fontSize: "0.85rem" }}>
                    No questions found.
                  </div>
                ) : (
                  filteredQuestions.map((q, idx) => {
                    const isSelected = q.id === activeQuestionId;
                    return (
                      <div
                        key={q.id}
                        className={`qp-question-item ${isSelected ? "active" : ""}`}
                        onClick={() => setActiveQuestionId(q.id)}
                      >
                        <p className="qp-question-text-preview">
                          {idx + 1}. {q.questionText || "Write your question here."}
                        </p>
                        <div className="d-flex align-items-center gap-1">
                          <button
                            type="button"
                            className="qp-icon-action-btn"
                            title="Question actions"
                            onClick={(e) => handleDeleteQuestion(e, q.id)}
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                              <circle cx="12" cy="5" r="2" />
                              <circle cx="12" cy="12" r="2" />
                              <circle cx="12" cy="19" r="2" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Question list pagination footer */}
              <div className="qp-pagination-footer">
                <span className="qp-pagination-text">
                  Showing 1 to {filteredQuestions.length} of {activeQuestions.length} questions
                </span>
                <div className="d-flex gap-1">
                  <button
                    type="button"
                    className="qp-page-btn"
                    disabled={activeQuestionIndex <= 0}
                    onClick={handlePrevQuestion}
                    title="Previous page"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="qp-page-btn"
                    disabled={activeQuestionIndex >= activeQuestions.length - 1}
                    onClick={handleNextQuestion}
                    title="Next page"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Edit Question Detail Panel) */}
          <div className="col-12 col-lg-8 col-xl-8">
            <div className="qp-panel-card">
              {activeQuestion ? (
                <>
                  {/* Edit Question Header */}
                  <div className="qp-edit-header">
                    <h5 className="qp-card-title">Edit Question</h5>
                    <div className="qp-type-selector">
                      <span className="qp-type-label">Question Type</span>
                      <select
                        className="qp-type-dropdown"
                        value={activeQuestion.type}
                        onChange={(e) => updateActiveQuestion({ type: e.target.value })}
                      >
                        <option value="Multiple Choice (MCQ)">Multiple Choice (MCQ)</option>
                        <option value="Short Answer">Short Answer</option>
                        <option value="Long Answer">Long Answer</option>
                        <option value="True / False">True / False</option>
                      </select>
                    </div>
                  </div>

                  {/* Question Text with Toolbar */}
                  <label className="qp-field-label">
                    Question Text <span className="text-danger">*</span>
                  </label>
                  <div className="qp-editor-wrapper">
                    <div className="qp-editor-toolbar">
                      <button
                        type="button"
                        className="qp-toolbar-btn"
                        title="Bold"
                        onClick={() => { }}
                      >
                        <strong>B</strong>
                      </button>
                      <button
                        type="button"
                        className="qp-toolbar-btn"
                        title="Italic"
                        onClick={() => { }}
                      >
                        <em>I</em>
                      </button>
                      <button
                        type="button"
                        className="qp-toolbar-btn"
                        title="Underline"
                        onClick={() => { }}
                      >
                        <u>U</u>
                      </button>

                      <div className="qp-toolbar-divider"></div>

                      <button
                        type="button"
                        className="qp-toolbar-btn"
                        title="Bullet List"
                        onClick={() => { }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="8" y1="6" x2="21" y2="6"></line>
                          <line x1="8" y1="12" x2="21" y2="12"></line>
                          <line x1="8" y1="18" x2="21" y2="18"></line>
                          <line x1="3" y1="6" x2="3.01" y2="6"></line>
                          <line x1="3" y1="12" x2="3.01" y2="12"></line>
                          <line x1="3" y1="18" x2="3.01" y2="18"></line>
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="qp-toolbar-btn"
                        title="Numbered List"
                        onClick={() => { }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="10" y1="6" x2="21" y2="6"></line>
                          <line x1="10" y1="12" x2="21" y2="12"></line>
                          <line x1="10" y1="18" x2="21" y2="18"></line>
                          <path d="M4 6h1v4"></path>
                          <path d="M4 10h2"></path>
                          <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="qp-toolbar-btn"
                        title="Insert Link"
                        onClick={() => { }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                      </button>

                      <div className="qp-toolbar-divider ms-auto"></div>

                      <button
                        type="button"
                        className="qp-toolbar-btn"
                        title="Undo"
                        onClick={() => { }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="1 4 1 10 7 10"></polyline>
                          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="qp-toolbar-btn"
                        title="Redo"
                        onClick={() => { }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="23 4 23 10 17 10"></polyline>
                          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                        </svg>
                      </button>
                    </div>

                    <textarea
                      className="qp-editor-textarea"
                      placeholder="Write your question here."
                      value={activeQuestion.questionText}
                      onChange={(e) => updateActiveQuestion({ questionText: e.target.value })}
                    />
                  </div>

                  {/* Options Section (for Multiple Choice) */}
                  {activeQuestion.type === "Multiple Choice (MCQ)" && (
                    <>
                      <div className="qp-options-header">
                        <h6 className="qp-options-title">
                          Options ({activeQuestion.options.length})
                        </h6>
                        <div className="qp-options-right-meta">
                          <span className="qp-max-options-badge">Max options: 6</span>
                          <button
                            type="button"
                            className="qp-btn-add-option"
                            disabled={activeQuestion.options.length >= 6}
                            onClick={handleAddOption}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="12" y1="5" x2="12" y2="19"></line>
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Add Option
                          </button>
                        </div>
                      </div>

                      <div className="qp-options-list">
                        {activeQuestion.options.map((opt) => {
                          const isCorrect = opt.id === activeQuestion.correctOptionId;
                          return (
                            <div
                              key={opt.id}
                              className={`qp-option-row ${isCorrect ? "correct" : ""}`}
                              onClick={() => handleSetCorrectOption(opt.id)}
                            >
                              {/* Radio selector */}
                              <div
                                className="qp-radio-indicator"
                                title="Set as correct answer"
                              >
                                {isCorrect && <div className="qp-radio-dot" />}
                              </div>

                              {/* Letter Label (A, B, C, D) */}
                              <span className="qp-option-letter">{opt.label}</span>

                              {/* Option Input */}
                              <input
                                type="text"
                                className="qp-option-input"
                                value={opt.text}
                                onChange={(e) => handleUpdateOptionText(opt.id, e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                              />

                              {/* Delete Option button */}
                              {activeQuestion.options.length > 2 && (
                                <button
                                  type="button"
                                  className="qp-option-delete-btn"
                                  title="Remove option"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteOption(opt.id);
                                  }}
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                  </svg>
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <p className="qp-options-help-text">
                        Select the correct answer for this question.
                      </p>
                    </>
                  )}

                  {/* Settings Row: Marks, Negative Marks, Difficulty Level, Required Question */}
                  <div className="qp-settings-row">
                    <div className="qp-setting-field">
                      <label className="qp-setting-label">
                        Marks <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        className="qp-setting-input"
                        value={activeQuestion.marks}
                        onChange={(e) =>
                          updateActiveQuestion({ marks: Number(e.target.value) || 0 })
                        }
                      />
                    </div>

                    <div className="qp-setting-field">
                      <label className="qp-setting-label">Negative Marks</label>
                      <input
                        type="number"
                        min="0"
                        className="qp-setting-input"
                        value={activeQuestion.negativeMarks}
                        onChange={(e) =>
                          updateActiveQuestion({ negativeMarks: Number(e.target.value) || 0 })
                        }
                      />
                    </div>

                    <div className="qp-setting-field">
                      <label className="qp-setting-label">Difficulty Level</label>
                      <select
                        className="qp-setting-select"
                        value={activeQuestion.difficulty}
                        onChange={(e) =>
                          updateActiveQuestion({
                            difficulty: e.target.value as "Easy" | "Medium" | "Hard",
                          })
                        }
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>

                    <div className="qp-setting-field d-flex align-items-end">
                      <label className="qp-required-checkbox-wrap">
                        <input
                          type="checkbox"
                          checked={activeQuestion.isRequired}
                          onChange={(e) =>
                            updateActiveQuestion({ isRequired: e.target.checked })
                          }
                        />
                        <span className="qp-required-label">Required Question</span>
                      </label>
                    </div>
                  </div>

                  {/* Navigation Footer */}
                  <div className="qp-nav-footer">
                    <button
                      type="button"
                      className="qp-btn-prev"
                      disabled={activeQuestionIndex <= 0}
                      onClick={handlePrevQuestion}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="19" y1="12" x2="5" y2="12"></line>
                        <polyline points="12 19 5 12 12 5"></polyline>
                      </svg>
                      Previous Question
                    </button>

                    <p className="qp-nav-counter">
                      Question {activeQuestionIndex + 1} of {activeQuestions.length}
                    </p>

                    <button
                      type="button"
                      className="qp-btn-next"
                      onClick={handleNextQuestion}
                      disabled={activeQuestionIndex >= activeQuestions.length - 1}
                    >
                      Next Question
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-5 text-muted">
                  No question selected. Click "Add Question" to get started.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Section Modal */}
      {showAddSectionModal && (
        <div className="qp-modal-overlay" onClick={() => setShowAddSectionModal(false)}>
          <div className="qp-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="fw-bold text-dark mb-0">Add New Section</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowAddSectionModal(false)}
              ></button>
            </div>
            <div className="mb-3">
              <label className="qp-config-label">Section Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Section D"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="mb-4">
              <label className="qp-config-label">Section Subtitle / Description</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Practical Assessment Questions"
                value={newSectionSubtitle}
                onChange={(e) => setNewSectionSubtitle(e.target.value)}
              />
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button
                type="button"
                className="btn btn-light border"
                onClick={() => setShowAddSectionModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                style={{ backgroundColor: "#1d4ed8", borderColor: "#1d4ed8" }}
                onClick={handleAddSection}
                disabled={!newSectionName.trim()}
              >
                Add Section
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Save Toast Notification */}
      {toastMessage && (
        <div className="qp-toast-notice">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
}

export default CreateQuestionPaper;
