import "../../../styles/departments.css";

function LMSOverview() {
  const stats = [
    {
      title: "Total Users",
      value: "1,245",
      color: "#3e6db5",
      bgClass: "my-fade-blue",
      stroke: "#3e6db5",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      title: "Active Courses",
      value: "32",
      color: "#e22b6e",
      bgClass: "my-fade-pink",
      stroke: "#e22b6e",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
    },
    {
      title: "Total Instructors",
      value: "45",
      color: "#6740d5",
      bgClass: "my-fade-purple",
      stroke: "#6740d5",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      ),
    },
    {
      title: "Completion Rate",
      value: "85%",
      color: "#d97706",
      bgClass: "my-fade-yellow",
      stroke: "#d97706",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
  ];

  return (
    <div className="h-auto shadow-sm rounded-4 border bg-white p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: "#1e293b" }}>LMS Overview</h4>
          <p className="text-muted mb-0" style={{ fontSize: "0.85rem" }}>
            Track learning activities, course progress, and training metrics
          </p>
        </div>
        <button
          className="btn btn-asti-gradient px-4 py-2 fw-semibold rounded-pill shadow-sm"
        >
          Generate Report
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="row g-3 mb-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="col-md-6 col-lg-3">
            <div className="stat-card-box h-100 d-flex align-items-center p-3">
              <div
                className={`me-3 rounded-circle p-2 d-flex align-items-center justify-content-center flex-shrink-0 ${stat.bgClass}`}
                style={{ width: "48px", height: "48px", color: stat.stroke }}
              >
                {stat.icon}
              </div>
              <div>
                <div className="stat-card-label">{stat.title}</div>
                <div className="stat-card-value" style={{ color: stat.color }}>
                  {stat.value}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Row */}
      <div className="row g-4">
        {/* Recent Enrollments Table */}
        <div className="col-lg-8">
          <div className="border rounded-4 shadow-sm bg-white overflow-hidden h-100">
            <div className="p-4 border-bottom d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <span
                  className="rounded-circle me-2 d-inline-block"
                  style={{ width: 10, height: 10, backgroundColor: "#e22b6e" }}
                ></span>
                <h6 className="fw-bold mb-0">Recent Enrollments</h6>
              </div>
              <span className="badge rounded-pill" style={{ background: "#f1f5f9", color: "#64748b", fontSize: "0.75rem" }}>
                Live Activity
              </span>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0 dept-table">
                <thead className="dept-table-header">
                  <tr>
                    <th className="py-3 px-4 border-0">Learner</th>
                    <th className="py-3 px-3 border-0">Course</th>
                    <th className="py-3 px-3 border-0">Date</th>
                    <th className="py-3 px-4 border-0 text-end">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-3">
                      <div className="fw-semibold text-dark">Arjun Sharma</div>
                      <small className="text-muted">arjun.sharma@asti.in</small>
                    </td>
                    <td className="px-3">
                      <span className="badge-dept-code">CNC Machine Operation</span>
                    </td>
                    <td className="px-3 text-muted" style={{ fontSize: "0.85rem" }}>Aug 10, 2026</td>
                    <td className="px-4 text-end">
                      <span className="badge-status-active">Active</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">
                      <div className="fw-semibold text-dark">Priya Mehta</div>
                      <small className="text-muted">priya.mehta@asti.in</small>
                    </td>
                    <td className="px-3">
                      <span className="badge-dept-code">Quality Inspection Tech</span>
                    </td>
                    <td className="px-3 text-muted" style={{ fontSize: "0.85rem" }}>Aug 09, 2026</td>
                    <td className="px-4 text-end">
                      <span className="badge-asti-yellow">Pending</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">
                      <div className="fw-semibold text-dark">Ravi Kumar</div>
                      <small className="text-muted">ravi.kumar@asti.in</small>
                    </td>
                    <td className="px-3">
                      <span className="badge-dept-code">Workplace Safety</span>
                    </td>
                    <td className="px-3 text-muted" style={{ fontSize: "0.85rem" }}>Aug 08, 2026</td>
                    <td className="px-4 text-end">
                      <span className="badge-status-active">Active</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Popular Courses */}
        <div className="col-lg-4">
          <div className="border rounded-4 shadow-sm bg-white overflow-hidden h-100">
            <div className="p-4 border-bottom d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <span
                  className="rounded-circle me-2 d-inline-block"
                  style={{ width: 10, height: 10, backgroundColor: "#3e6db5" }}
                ></span>
                <h6 className="fw-bold mb-0">Popular Courses</h6>
              </div>
              <span className="badge rounded-pill" style={{ background: "#e7f3fd", color: "#3e6db5", fontSize: "0.75rem" }}>
                Top 3
              </span>
            </div>
            <div className="p-3">
              <ul className="list-group list-group-flush">
                <li className="list-group-item px-3 py-3 d-flex justify-content-between align-items-center rounded-3 mb-2 border-0" style={{ background: "#fafbff" }}>
                  <div>
                    <h6 className="fw-semibold mb-1" style={{ fontSize: "0.9rem" }}>CNC Machine Operation Basics</h6>
                    <small className="text-muted">120 Enrolled Learners</small>
                  </div>
                  <span className="badge rounded-pill px-3 py-2 text-white" style={{ background: "linear-gradient(130deg, #e22b6e 0%, #3e6db5 100%)", fontSize: "0.75rem" }}>
                    #1
                  </span>
                </li>
                <li className="list-group-item px-3 py-3 d-flex justify-content-between align-items-center rounded-3 mb-2 border-0" style={{ background: "#fafbff" }}>
                  <div>
                    <h6 className="fw-semibold mb-1" style={{ fontSize: "0.9rem" }}>Workplace Safety & Compliance</h6>
                    <small className="text-muted">98 Enrolled Learners</small>
                  </div>
                  <span className="badge rounded-pill px-3 py-2 text-white" style={{ background: "linear-gradient(130deg, #e22b6e 0%, #3e6db5 100%)", fontSize: "0.75rem" }}>
                    #2
                  </span>
                </li>
                <li className="list-group-item px-3 py-3 d-flex justify-content-between align-items-center rounded-3 border-0" style={{ background: "#fafbff" }}>
                  <div>
                    <h6 className="fw-semibold mb-1" style={{ fontSize: "0.9rem" }}>Quality Inspection Techniques</h6>
                    <small className="text-muted">75 Enrolled Learners</small>
                  </div>
                  <span className="badge rounded-pill px-3 py-2 text-white" style={{ background: "linear-gradient(130deg, #e22b6e 0%, #3e6db5 100%)", fontSize: "0.75rem" }}>
                    #3
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LMSOverview;
