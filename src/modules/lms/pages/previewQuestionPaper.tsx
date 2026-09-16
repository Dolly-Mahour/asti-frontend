import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import type { QuestionPaper, QuestionItem } from "../models/questionPaper";
import { questionPaperService } from "../services/questionPaperService";
import "../../../styles/previewQuestionPaper.css";

// Helper to ensure every question has 4 MCQ options in preview
const getDisplayOptions = (q: QuestionItem) => {
  if (q.options && q.options.length > 0) {
    return q.options;
  }
  return [
    { id: `${q.id}-opt-a`, label: "A", text: "Option A" },
    { id: `${q.id}-opt-b`, label: "B", text: "Option B" },
    { id: `${q.id}-opt-c`, label: "C", text: "Option C" },
    { id: `${q.id}-opt-d`, label: "D", text: "Option D" },
  ];
};

export function PreviewQuestionPaper() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const paperId = searchParams.get("id");
  const [paper, setPaper] = useState<QuestionPaper | null>(null);

  useEffect(() => {
    if (paperId) {
      const found = questionPaperService.getById(paperId);
      setPaper(found);
    }
  }, [paperId]);

  const handlePrint = () => {
    window.print();
  };

  const handleEdit = () => {
    if (paperId) {
      navigate(`/lms/create-question-paper?id=${paperId}`);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!paper) {
    return (
      <div className="pqp-not-found">
        <div className="pqp-not-found-inner">
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
          <h5 className="mt-3 fw-bold text-dark">Question Paper Not Found</h5>
          <p className="text-muted" style={{ fontSize: "0.9rem" }}>
            The paper you're looking for doesn't exist or hasn't been saved yet.
          </p>
          <button
            className="btn btn-primary px-4 mt-2"
            style={{ background: "#1d4ed8", border: "none", borderRadius: "8px" }}
            onClick={() => navigate("/lms/question-paper-management")}
          >
            Go to Paper Management
          </button>
        </div>
      </div>
    );
  }

  const totalQuestions = (paper.sections || []).reduce(
    (sum, s) => sum + (s.questions || []).length,
    0
  );
  const totalMarks = (paper.sections || []).reduce(
    (sum, s) => sum + s.questions.reduce((qs, q) => qs + (q.marks || 0), 0),
    0
  );

  return (
    <div className="pqp-page">
      {/* Top Navbar */}
      <div className="pqp-topbar no-print">
        <div className="pqp-topbar-left">
          <button className="pqp-back-btn" onClick={handleBack} title="Go back">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div className="pqp-topbar-title-block">
            <span className="pqp-topbar-title">Question Paper Preview</span>
            <span className="pqp-topbar-subtitle">Print-ready examination layout</span>
          </div>
        </div>

        <div className="pqp-topbar-actions">
          <div
            className="pqp-btn-student active"
            title="Student Examination View (All questions MCQ without answers)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Student View
          </div>

          <button className="pqp-btn-edit" onClick={handleEdit}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit
          </button>

          <button className="pqp-btn-print" onClick={handlePrint}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Print
          </button>
        </div>
      </div>

      {/* Exam Paper Content */}
      <div className="pqp-content">
        <div className="pqp-paper">
          {/* Paper Header */}
          <div className="pqp-paper-header">
            <img
              className="pqp-paper-logo"
              src="/asti-logo.png"
              alt="ASTI Logo"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div className="pqp-paper-title-block">
              <div className="pqp-paper-main-title">{paper.title}</div>
              {paper.subTitle && (
                <div className="pqp-paper-subtitle">{paper.subTitle}</div>
              )}
            </div>

          </div>

          {/* Info Table */}
          <div className="pqp-info-table-wrap">
            <table className="pqp-info-table">
              <thead>
                <tr>
                  <th>Paper Code / Ref</th>
                  <th>Department</th>
                  <th>Sub Dept / Line</th>
                  <th>Time Allowed</th>
                  <th>Pass Score</th>
                  <th>Total Questions</th>
                  <th>Total Marks</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{paper.code || "ASTI-QP"}</td>
                  <td>{paper.department}</td>
                  <td>{paper.subDepartment} – {paper.lineSection}</td>
                  <td>{paper.allowedTime} Mins</td>
                  <td>{paper.passingScore}%</td>
                  <td>{totalQuestions}</td>
                  <td>{totalMarks}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Instructions */}
          <div className="pqp-instructions">
            <strong>Instructions:</strong>&nbsp;Read all questions carefully before answering.
            All questions are Multiple Choice (MCQ). Select the single best answer for each question.
            Each question carries marks as indicated. Total sections: {(paper.sections || []).length}.
          </div>

          {/* Sections and Questions */}
          {(paper.sections || []).map((sec, secIdx) => {
            let qGlobalOffset = 0;
            for (let i = 0; i < secIdx; i++) {
              qGlobalOffset += (paper.sections[i]?.questions || []).length;
            }
            const sectionMarks = sec.questions.reduce((sum, q) => sum + (q.marks || 0), 0);
            const displaySubtitle = sec.subtitle
              ?.replace(/Short Answer Questions/gi, "Multiple Choice Questions")
              ?.replace(/Long Answer Questions/gi, "Multiple Choice Questions")
              || sec.subtitle || "Multiple Choice Questions";

            return (
              <div key={sec.id} className="pqp-section">
                <div className="pqp-section-header">
                  <span className="pqp-section-name">{sec.name}: {displaySubtitle}</span>
                  <span className="pqp-section-meta">
                    {sec.questions.length} Q(s)&nbsp;·&nbsp;{sectionMarks} Marks
                  </span>
                </div>

                {sec.questions.map((q, qIdx) => {
                  const qNum = qGlobalOffset + qIdx + 1;
                  const options = getDisplayOptions(q);

                  return (
                    <div key={q.id} className="pqp-question">
                      <div className="pqp-q-row">
                        <span className="pqp-q-num">Q{qNum}.</span>
                        <span className="pqp-q-text">{q.questionText}</span>
                        <span className="pqp-q-marks">[{q.marks} {q.marks > 1 ? "Marks" : "Mark"}]</span>
                      </div>

                      {/* Always render 2-column MCQ options grid, with no right answers revealed */}
                      <div className="pqp-options-grid">
                        {options.map((opt) => (
                          <div key={opt.id} className="pqp-option">
                            <span className="pqp-option-letter">({opt.label})</span>
                            <span className="pqp-option-text">{opt.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* Footer */}
          <div className="pqp-paper-footer">
            <span>— End of Question Paper —</span>
            <span>Total Marks: {totalMarks}&nbsp;|&nbsp;Total Questions: {totalQuestions}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreviewQuestionPaper;

