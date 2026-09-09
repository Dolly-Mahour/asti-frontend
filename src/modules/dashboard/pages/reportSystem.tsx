import React, { useState, useEffect } from "react";
import "../../../styles/reportSystem.css";

interface Recipient {
  id: string;
  email: string;
  frequencies: string[]; // "daily", "management", "monthly"
  combinedEmail: boolean;
  avatarColor: string;
}

const AVATAR_COLORS = [
  "#2563eb", // Blue
  "#7c3aed", // Purple
  "#ec2471", // ASTI Pink
  "#0284c7", // Sky blue
  "#0d9488", // Teal
  "#e11d48", // Rose
  "#4f46e5", // Indigo
];

const INITIAL_RECIPIENTS: Recipient[] = [
  {
    id: "1",
    email: "savdhan007@gmail.com",
    frequencies: ["daily", "management"],
    combinedEmail: true,
    avatarColor: "#2563eb",
  },
  {
    id: "2",
    email: "shivampanday70114@gmail.com",
    frequencies: ["daily", "management"],
    combinedEmail: true,
    avatarColor: "#2563eb",
  },
  {
    id: "3",
    email: "tejprakash2002jas@gmail.com",
    frequencies: ["daily", "management"],
    combinedEmail: true,
    avatarColor: "#4f46e5",
  },
  {
    id: "4",
    email: "pradeep.singh@furukawaminda.com",
    frequencies: ["daily", "management"],
    combinedEmail: true,
    avatarColor: "#2563eb",
  },
  {
    id: "5",
    email: "ankur.yadav@furukawaminda.com",
    frequencies: ["daily", "management"],
    combinedEmail: true,
    avatarColor: "#2563eb",
  },
  {
    id: "6",
    email: "krishna@gmail.com",
    frequencies: ["daily"],
    combinedEmail: false,
    avatarColor: "#2563eb",
  },
  {
    id: "7",
    email: "tejparkash2002jas@gmail.com",
    frequencies: ["daily", "management"],
    combinedEmail: true,
    avatarColor: "#2563eb",
  },
];

function ReportSystem() {
  // Automatic Send Times state
  const [dailyTime, setDailyTime] = useState<string>(() => {
    return localStorage.getItem("asti_report_daily_time") || "";
  });
  const [managementTime, setManagementTime] = useState<string>(() => {
    return localStorage.getItem("asti_report_management_time") || "";
  });
  const [monthlyTime, setMonthlyTime] = useState<string>(() => {
    return localStorage.getItem("asti_report_monthly_time") || "";
  });

  // Recipients list state
  const [recipients, setRecipients] = useState<Recipient[]>(() => {
    const saved = localStorage.getItem("asti_report_recipients");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_RECIPIENTS;
      }
    }
    return INITIAL_RECIPIENTS;
  });

  // Add Recipient form state
  const [newEmail, setNewEmail] = useState("");
  const [selectedFrequencies, setSelectedFrequencies] = useState<string[]>(["daily"]);
  const [searchTerm, setSearchTerm] = useState("");

  // Toast / notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "info">("success");

  // Manual Trigger Modal state
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [manualReportType, setManualReportType] = useState("all");
  const [manualSending, setManualSending] = useState(false);

  // Sync recipients to localStorage
  useEffect(() => {
    localStorage.setItem("asti_report_recipients", JSON.stringify(recipients));
  }, [recipients]);

  const showToast = (msg: string, type: "success" | "info" = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Save times handlers
  const handleSaveDailyTime = () => {
    localStorage.setItem("asti_report_daily_time", dailyTime);
    showToast(
      dailyTime
        ? `Daily Manpower Report time saved: ${dailyTime} IST`
        : "Daily Manpower Report automatic schedule disabled."
    );
  };

  const handleSaveManagementTime = () => {
    localStorage.setItem("asti_report_management_time", managementTime);
    showToast(
      managementTime
        ? `Management Daily Report time saved: ${managementTime} IST`
        : "Management Daily Report automatic schedule disabled."
    );
  };

  const handleSaveMonthlyTime = () => {
    localStorage.setItem("asti_report_monthly_time", monthlyTime);
    showToast(
      monthlyTime
        ? `Monthly Headcount Report time saved: ${monthlyTime} IST`
        : "Monthly Headcount Report automatic schedule disabled."
    );
  };

  // Toggle frequency selection for Add Recipient
  const toggleFrequency = (freq: string) => {
    setSelectedFrequencies((prev) => {
      if (prev.includes(freq)) {
        // Keep at least one selected
        if (prev.length === 1) return prev;
        return prev.filter((f) => f !== freq);
      } else {
        return [...prev, freq];
      }
    });
  };

  // Add recipient handler
  const handleAddRecipient = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = newEmail.trim().toLowerCase();
    if (!cleanEmail) {
      showToast("Please enter a valid email address.", "info");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      showToast("Please enter a valid email address format.", "info");
      return;
    }
    if (recipients.some((r) => r.email.toLowerCase() === cleanEmail)) {
      showToast("This email is already in the recipient list.", "info");
      return;
    }

    const randomColor =
      AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

    const newRec: Recipient = {
      id: Date.now().toString(),
      email: cleanEmail,
      frequencies: [...selectedFrequencies],
      combinedEmail: selectedFrequencies.length > 1,
      avatarColor: randomColor,
    };

    setRecipients((prev) => [newRec, ...prev]);
    setNewEmail("");
    showToast(`Added ${cleanEmail} to active recipients!`);
  };

  // Remove recipient handler
  const handleRemoveRecipient = (id: string, email: string) => {
    if (window.confirm(`Are you sure you want to remove ${email} from reports?`)) {
      setRecipients((prev) => prev.filter((r) => r.id !== id));
      showToast(`Removed ${email} from recipients.`, "info");
    }
  };

  // Manual report trigger handler
  const handleTriggerManualSend = () => {
    setManualSending(true);
    setTimeout(() => {
      setManualSending(false);
      setIsManualModalOpen(false);
      showToast(
        `Reports triggered successfully! Excel files dispatched to ${recipients.length} recipients.`
      );
    }, 1200);
  };

  // Filtered recipients
  const filteredRecipients = recipients.filter((r) =>
    r.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Dynamic included report text
  const getIncludedReportDetails = () => {
    const names: string[] = [];
    if (selectedFrequencies.includes("daily")) names.push("Manpower Report");
    if (selectedFrequencies.includes("management")) names.push("Management Attendance");
    if (selectedFrequencies.includes("monthly")) names.push("Monthly Headcount");

    const title = names.join(" & ") || "Manpower Report";
    const format =
      selectedFrequencies.length > 1
        ? "Combined Daily Excel Format (.xlsx)"
        : "Daily Excel Format (.xlsx)";
    return { title, format };
  };

  const included = getIncludedReportDetails();

  return (
    <div className="report-system-container">
      {/* ─── Top Header Card ─────────────────────────────────────── */}
      <div className="report-header-card">
        <div className="report-header-left">
          <div className="report-header-icon-box">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </div>
          <div>
            <h1 className="report-header-title">Email Report Settings</h1>
            <p className="report-header-subtitle">
              Manage automated manpower reports. Reports are generated as{" "}
              <span className="excel-highlight">Excel</span> files and sent to
              registered recipients.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="btn-trigger-manual"
          onClick={() => setIsManualModalOpen(true)}
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
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          Trigger Manual Report
        </button>
      </div>

      {/* ─── Main Content Grid ───────────────────────────────────── */}
      <div className="row g-4">
        {/* ── Left Column (Send Times & Add Recipient) ── */}
        <div className="col-lg-5 col-xl-4">
          {/* Card 1: Automatic Send Time */}
          <div className="report-panel-card">
            <div className="report-panel-header">
              <div>
                <h3 className="report-panel-title">Automatic Send Time</h3>
                <p className="report-panel-subtitle">
                  Set separate daily send times in India time (IST).
                </p>
              </div>
              <div className="panel-header-icon" title="India Standard Time (IST)">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
            </div>

            {/* Daily Manpower Report */}
            <div className="send-time-item">
              <label className="field-meta-label">Daily Manpower Report</label>
              <div className="time-input-group">
                <input
                  type="time"
                  className="time-input-field"
                  value={dailyTime}
                  onChange={(e) => setDailyTime(e.target.value)}
                  placeholder="--:-- --"
                />
                <span className="time-input-icon">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </span>
              </div>
              <button
                type="button"
                className="btn-save-time btn-save-daily"
                onClick={handleSaveDailyTime}
              >
                Save Daily Time
              </button>
            </div>

            {/* Management Daily Report */}
            <div className="send-time-item">
              <label className="field-meta-label">Management Daily Report</label>
              <div className="time-input-group">
                <input
                  type="time"
                  className="time-input-field"
                  value={managementTime}
                  onChange={(e) => setManagementTime(e.target.value)}
                  placeholder="--:-- --"
                />
                <span className="time-input-icon">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </span>
              </div>
              <button
                type="button"
                className="btn-save-time btn-save-management"
                onClick={handleSaveManagementTime}
              >
                Save Management Time
              </button>
            </div>

            {/* Monthly Headcount Report */}
            <div className="send-time-item mb-0">
              <label className="field-meta-label">Monthly Headcount Report</label>
              <div className="time-input-group">
                <input
                  type="time"
                  className="time-input-field"
                  value={monthlyTime}
                  onChange={(e) => setMonthlyTime(e.target.value)}
                  placeholder="--:-- --"
                />
                <span className="time-input-icon">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </span>
              </div>
              <button
                type="button"
                className="btn-save-time btn-save-monthly"
                onClick={handleSaveMonthlyTime}
              >
                Save Monthly Time
              </button>
            </div>

            <p className="send-time-footer-note mb-0">
              Leave a time empty to disable automatic sending for that report.
              Manual report sending remains unchanged.
            </p>
          </div>

          {/* Card 2: Add Recipient */}
          <div className="report-panel-card">
            <div className="report-panel-header">
              <h3 className="report-panel-title mb-0">Add Recipient</h3>
              <span className="badge-new">New</span>
            </div>

            <form onSubmit={handleAddRecipient}>
              {/* Email Address */}
              <div className="mb-3">
                <label className="field-meta-label">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  Email Address
                </label>
                <div className="recipient-input-wrapper mb-0">
                  <input
                    type="email"
                    className="recipient-email-input"
                    placeholder="name@company.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                  <span className="input-leading-icon">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Report Frequency Selectors */}
              <div className="mb-3">
                <label className="field-meta-label">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  Report Frequency
                </label>
                <div className="frequency-grid">
                  {/* Daily */}
                  <div
                    className={`frequency-card ${
                      selectedFrequencies.includes("daily") ? "active" : ""
                    }`}
                    onClick={() => toggleFrequency("daily")}
                  >
                    <div className="frequency-icon-bubble">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <div className="frequency-card-title">Daily</div>
                    <div className="frequency-card-subtitle">Manpower Report</div>
                  </div>

                  {/* Management Daily */}
                  <div
                    className={`frequency-card ${
                      selectedFrequencies.includes("management") ? "active" : ""
                    }`}
                    onClick={() => toggleFrequency("management")}
                  >
                    <div className="frequency-icon-bubble">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                    </div>
                    <div className="frequency-card-title">Management Daily</div>
                    <div className="frequency-card-subtitle">Attendance Data</div>
                  </div>

                  {/* Monthly */}
                  <div
                    className={`frequency-card ${
                      selectedFrequencies.includes("monthly") ? "active" : ""
                    }`}
                    onClick={() => toggleFrequency("monthly")}
                  >
                    <div className="frequency-icon-bubble">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                    </div>
                    <div className="frequency-card-title">Monthly</div>
                    <div className="frequency-card-subtitle">Headcount Report</div>
                  </div>
                </div>
              </div>

              {/* Included Report(s) Preview Card */}
              <div className="mb-3">
                <label className="field-meta-label">Included Report(s)</label>
                <div className="included-report-card">
                  <div className="included-report-left">
                    <div className="included-doc-icon-box">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                      </svg>
                    </div>
                    <div>
                      <div className="included-report-name">{included.title}</div>
                      <div className="included-report-format">{included.format}</div>
                    </div>
                  </div>
                  <div className="included-check-icon">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="9 12 11 14 15 10" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Add to List Button */}
              <button type="submit" className="btn-add-to-list">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add to List
              </button>
            </form>
          </div>
        </div>

        {/* ── Right Column (Active Recipients) ── */}
        <div className="col-lg-7 col-xl-8">
          <div className="report-panel-card h-100">
            <div className="report-panel-header">
              <div>
                <h3 className="report-panel-title">Active Recipients</h3>
                <p className="report-panel-subtitle">
                  People currently receiving the reports
                </p>
              </div>
              <span className="badge-total-count">
                Total: {recipients.length}
              </span>
            </div>

            {/* Search Filter Bar */}
            <div className="recipients-controls-bar">
              <div className="position-relative flex-grow-1">
                <input
                  type="text"
                  className="recipients-search-input w-100"
                  placeholder="Filter recipients by email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span
                  className="position-absolute text-muted"
                  style={{ left: "12px", top: "50%", transform: "translateY(-50%)" }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </span>
              </div>
              {searchTerm && (
                <button
                  className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                  onClick={() => setSearchTerm("")}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Recipient Items List */}
            <div className="recipients-list-wrapper">
              {filteredRecipients.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <svg
                    width="44"
                    height="44"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                    className="mb-2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                  <p className="mb-0 fw-semibold">No recipients found</p>
                  <small>Try adjusting your search filter or add a new email.</small>
                </div>
              ) : (
                filteredRecipients.map((rec) => {
                  const initial = rec.email.charAt(0).toUpperCase();

                  return (
                    <div key={rec.id} className="recipient-row-card">
                      <div className="recipient-row-left">
                        {/* Avatar */}
                        <div
                          className="recipient-avatar"
                          style={{ backgroundColor: rec.avatarColor }}
                        >
                          {initial}
                        </div>

                        {/* Info */}
                        <div className="recipient-info">
                          <div className="recipient-email">{rec.email}</div>
                          <div className="recipient-badges-row">
                            {rec.frequencies.includes("daily") && (
                              <span className="rec-badge badge-manpower">
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <circle cx="12" cy="12" r="10" />
                                  <polyline points="12 6 12 12 16 14" />
                                </svg>
                                Daily Manpower
                              </span>
                            )}

                            {rec.frequencies.includes("management") && (
                              <span className="rec-badge badge-management">
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                  <polyline points="14 2 14 8 20 8" />
                                </svg>
                                Management Daily
                              </span>
                            )}

                            {rec.frequencies.includes("monthly") && (
                              <span className="rec-badge badge-monthly">
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                  <line x1="16" y1="2" x2="16" y2="6" />
                                  <line x1="8" y1="2" x2="8" y2="6" />
                                </svg>
                                Monthly Headcount
                              </span>
                            )}

                            {rec.combinedEmail && (
                              <span className="rec-badge badge-combined">
                                + Combined Email
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons (Delete) */}
                      <div className="recipient-actions">
                        <button
                          type="button"
                          className="btn-remove-recipient"
                          title="Remove recipient"
                          onClick={() => handleRemoveRecipient(rec.id, rec.email)}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Trigger Manual Report Modal ──────────────────────────── */}
      {isManualModalOpen && (
        <div className="modal-overlay" onClick={() => setIsManualModalOpen(false)}>
          <div
            className="report-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="report-modal-header">
              <div className="d-flex align-items-center gap-2">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{
                    width: "36px",
                    height: "36px",
                    background: "rgba(62, 109, 181, 0.12)",
                    color: "var(--asti-blue)",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <div>
                  <h5 className="modal-title fw-bold mb-0">Trigger Manual Report</h5>
                  <small className="text-muted">Instant Excel generation & email</small>
                </div>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setIsManualModalOpen(false)}
              ></button>
            </div>

            <div className="report-modal-body">
              <div className="mb-3">
                <label className="form-label fw-semibold small text-secondary">
                  SELECT REPORT TYPE
                </label>
                <select
                  className="form-select"
                  value={manualReportType}
                  onChange={(e) => setManualReportType(e.target.value)}
                >
                  <option value="all">All Automated Reports (Combined)</option>
                  <option value="manpower">Daily Manpower Report (.xlsx)</option>
                  <option value="management">Management Daily Attendance (.xlsx)</option>
                  <option value="monthly">Monthly Headcount Report (.xlsx)</option>
                </select>
              </div>

              <div className="p-3 rounded-3 bg-light border mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="fw-semibold small">Recipients:</span>
                  <span className="badge bg-primary rounded-pill">
                    {recipients.length} Active Contacts
                  </span>
                </div>
                <small className="text-muted d-block">
                  Reports will be compiled from current shift and attendance logs,
                  formatted in Excel (.xlsx), and sent immediately.
                </small>
              </div>
            </div>

            <div className="report-modal-footer">
              <button
                type="button"
                className="btn btn-light rounded-pill px-4"
                onClick={() => setIsManualModalOpen(false)}
                disabled={manualSending}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn text-white rounded-pill px-4 fw-semibold"
                style={{
                  background: "linear-gradient(130deg, #e22b6e 0%, #3e6db5 100%)",
                  border: "none",
                }}
                onClick={handleTriggerManualSend}
                disabled={manualSending}
              >
                {manualSending ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    Generating & Sending...
                  </>
                ) : (
                  "Send Reports Now"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Toast Notification ──────────────────────────────────── */}
      {toastMessage && (
        <div
          className={`report-toast ${
            toastType === "success" ? "toast-success" : "toast-info"
          }`}
        >
          <div className="d-flex align-items-center gap-2">
            {toastType === "success" ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#3e6db5"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            )}
            <span className="small fw-semibold">{toastMessage}</span>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-link text-white text-decoration-none p-0"
            onClick={() => setToastMessage(null)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

export default ReportSystem;
