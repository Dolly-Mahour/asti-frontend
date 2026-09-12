import React, { useEffect, useState } from "react";
import { getSections } from "../services/sectionService";
import { getLines } from "../services/lineService";
import { useNavigate } from "react-router-dom";
import type { Department, Section, Line } from "../models/departments";
import "../../../styles/departments.css";
import { createDepartment, getDepartment, updateDepartment, deleteDepartment } from "../services/departmentService";

export default function Departments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [search, setSearch] = useState<string>("");

  // Add Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [nameInput, setNameInput] = useState("");

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [editNameInput, setEditNameInput] = useState("");

  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState<Department | null>(null);

  const navigate = useNavigate();

  const fetchDepartments = async () => {
    try {
      const response = await getDepartment();
      const data = response?.data?.data || [];
      setDepartments(data);
      console.log("RES OF DEPARTMENTS --", data);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchSections();
    fetchLines();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await getSections();
      setSections(res?.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch sections:", err);
    }
  };

  const fetchLines = async () => {
    try {
      const res = await getLines();
      setLines(res?.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch lines:", err);
    }
  };
  const totalDepts = departments.length;
  const totalSubDepts = departments.reduce((sum, d) => sum + (d.subDepartments?.length || 0), 0);
  const totalSections = sections.length;
  const totalLines = lines.length;
  const DEFAULT_KPI = { sections: 36, lines: 72 };
  const displayedSections = totalSections || DEFAULT_KPI.sections;
  const displayedLines = totalLines || DEFAULT_KPI.lines;

  const filteredDepartments = departments.filter((dept) =>
    (dept.name || "").toLowerCase().includes(search.toLowerCase()) ||
    String(dept.id || "").toLowerCase().includes(search.toLowerCase())
  );

  // Add Handlers
  const handleAddDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    try {
      const response = await createDepartment(nameInput.trim());
      console.log("ADD DEPARTMENT RES ----", response.data);
      setShowAddModal(false);
      setNameInput("");
      fetchDepartments();
    } catch (error) {
      console.error("Failed to add department:", error);
    }
  };

  // Edit Handlers
  const handleOpenEditModal = (dept: Department) => {
    setSelectedDept(dept);
    setEditNameInput(dept.name);
    setShowEditModal(true);
  };

  const handleSaveEditDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDept || !editNameInput.trim()) return;

    try {
      await updateDepartment(selectedDept.id, editNameInput.trim());
      setShowEditModal(false);
      setSelectedDept(null);
      setEditNameInput("");
      fetchDepartments();
    } catch (error) {
      console.error("Failed to update department:", error);
    }
  };

  // Delete Handlers
  const handleOpenDeleteModal = (dept: Department) => {
    setDeptToDelete(dept);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deptToDelete) return;

    try {
      await deleteDepartment(deptToDelete.id);
      setShowDeleteModal(false);
      setDeptToDelete(null);
      fetchDepartments();
    } catch (error) {
      console.error("Failed to delete department:", error);
    }
  };

  return (
    <div className="h-auto bg-white shadow-sm rounded border p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Department Management</h4>
        <button
          className="btn btn-asti-gradient px-4 py-2 fw-semibold rounded-pill"
          onClick={() => {
            setNameInput("");
            setShowAddModal(true);
          }}
        >
          + Add Department
        </button>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {[ 
          {
            label: "Total Departments",
            value: totalDepts,
            colorClass: "stat-card-value-primary",
            bgClass: "my-fade-blue",
            stroke: "#3e6db5",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            ),
          },
          {
            label: "Total Sub-Departments",
            value: `${totalSubDepts} Sub-Depts`,
            colorClass: "stat-card-value-pink",
            bgClass: "my-fade-pink",
            stroke: "#e22b6e",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            ),
          },
          {
            label: "Total Sections",
            value: displayedSections,
            colorClass: "stat-card-value-purple",
            bgClass: "my-fade-purple",
            stroke: "#6740d5",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
            ),
          },
          {
            label: "Active Lines",
            value: displayedLines,
            colorClass: "stat-card-value-cyan",
            bgClass: "my-fade-yellow",
            stroke: "#0284c7",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            ),
          },
        ].map((stat, i) => (
          <div key={i} className="col-md-6 col-lg-3">
            <div className="stat-card-box d-flex align-items-center p-3 h-100">
              <div
                className={`me-3 rounded-circle p-2 d-flex align-items-center justify-content-center flex-shrink-0 ${stat.bgClass}`}
                style={{ width: "46px", height: "46px", color: stat.stroke }}
              >
                {stat.icon}
              </div>
              <div>
                <div className="stat-card-label">{stat.label}</div>
                <div className={`stat-card-value ${stat.colorClass}`}>{stat.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="ctq-filter-bar border rounded-4 shadow-sm p-3 mb-4 d-flex align-items-center justify-content-between flex-wrap gap-3">
        <div className="d-flex align-items-center flex-wrap gap-2">
          {/* Filter label */}
          <div className="d-flex align-items-center me-1">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#e22b6e"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span className="ms-1 fw-semibold" style={{ fontSize: "0.82rem", color: "#3d3d3d" }}>
              Filters
            </span>
          </div>

          <div className="ctq-filter-search-group">
            <svg
              className="ctq-filter-search-icon"
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
            <input
              type="text"
              className="ctq-filter-search-input"
              placeholder="Search by ID or department name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {search && (
            <button
              type="button"
              className="ctq-filter-clear-btn"
              onClick={() => setSearch("")}
            >
              Clear
            </button>
          )}
        </div>

        <div className="ctq-filter-count-info ms-auto">
          Showing <strong>{filteredDepartments.length}</strong> of {totalDepts}
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0 dept-table">
          <thead className="table-light">
            <tr className="dept-table-header">
              <th className="py-3 px-3">ID</th>
              <th className="py-3 px-3">Department Name</th>
              <th className="py-3 px-3">Sub-Departments</th>
              <th className="py-3 px-3 text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDepartments.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-5 text-muted">
                  No departments found.
                </td>
              </tr>
            ) : (
              filteredDepartments.map((dept) => {
                const subCount = dept.subDepartments?.length || 0;
                return (
                  <tr key={dept.id}>
                    <td className="px-3">
                      <span className="badge-dept-code">#{dept.id}</span>
                    </td>
                    <td className="px-3">
                      <div className="fw-semibold text-dark">{dept.name}</div>
                    </td>
                    <td className="px-3">
                      <button
                        className="btn btn-sm rounded-pill btn-subdept-count-badge"
                        onClick={() => navigate("/lms/departments/sub-departments", {
                          state: {
                            departmentId: dept.id,
                            departmentName: dept.name,
                          },
                        })}
                      >
                        {subCount} Sub-Dept{subCount !== 1 ? "s" : ""}
                      </button>
                    </td>
                    <td className="px-3 text-end">
                      <div className="d-inline-flex gap-2 align-items-center">
                        <button
                          className="btn btn-sm rounded-pill btn-subdept-nav"
                          onClick={() => navigate("/lms/departments/sub-departments", {
                            state: {
                              departmentId: dept.id,
                              departmentName: dept.name,
                            },
                          })}
                        >
                          Sub-Departments →
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary rounded-circle btn-action-circle"
                          onClick={() => handleOpenEditModal(dept)}
                          title="Edit Department"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>

                        <button
                          type="button"
                          className="btn btn-sm rounded-circle btn-action-delete"
                          onClick={() => handleOpenDeleteModal(dept)}
                          title="Delete Department"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {
        showAddModal && (
          <div className="modal fade show d-block dept-modal-backdrop" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow rounded-3">
                <div className="modal-header border-bottom-0 pb-0">
                  <h5 className="modal-title fw-bold">Add Department</h5>
                  <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                </div>

                <form onSubmit={handleAddDepartment}>
                  <div className="modal-body py-3">
                    <div className="mb-2">
                      <label className="form-label fw-semibold small text-muted">
                        Department Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Quality Assurance"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="modal-footer border-top-0 pt-0">
                    <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowAddModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-asti-gradient rounded-pill px-4 fw-semibold">
                      Add Department
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )
      }

      {/* Edit Modal */}
      {
        showEditModal && selectedDept && (
          <div className="modal fade show d-block dept-modal-backdrop" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow rounded-3">
                <div className="modal-header border-bottom-0 pb-0">
                  <h5 className="modal-title fw-bold">Edit Department</h5>
                  <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                </div>

                <form onSubmit={handleSaveEditDepartment}>
                  <div className="modal-body py-3">
                    <div className="mb-2">
                      <label className="form-label fw-semibold small text-muted">
                        Department Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={editNameInput}
                        onChange={(e) => setEditNameInput(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="modal-footer border-top-0 pt-0">
                    <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowEditModal(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-asti-gradient rounded-pill px-4 fw-semibold">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )
      }

      {/* Delete Confirmation Modal */}
      {
        showDeleteModal && deptToDelete && (
          <div className="modal fade show d-block dept-modal-backdrop" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow rounded-3">
                <div className="modal-header border-bottom-0 pb-0">
                  <h5 className="modal-title fw-bold text-danger">Delete Department</h5>
                  <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                </div>

                <div className="modal-body py-3">
                  <p className="mb-0 text-secondary">
                    Are you sure you want to delete department <br></br><strong>"{deptToDelete.name}"</strong>
                  </p>
                </div>

                <div className="modal-footer border-top-0 pt-0">
                  <button type="button" className="btn btn-light rounded-pill px-4" onClick={() => setShowDeleteModal(false)}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-danger rounded-pill px-4 fw-semibold" onClick={handleConfirmDelete}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}