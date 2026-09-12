import React, { useEffect, useState } from "react";
import type {
  User,
  UserFormData,
  RoleFilter,
} from "../models/userManagement";
import {
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../services/userService";
import "../../../styles/departments.css";

function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("All Roles");

  const [showModal, setShowModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [formData, setFormData] = useState<UserFormData>({
    id: null,
    name: "",
    email: "",
    password: "",
    role: "OPERATOR",
  });

  const roles: RoleFilter[] = [
    "All Roles",
    "ADMIN",
    "INSTRUCTOR",
    "OPERATOR",
    "MANAGER",
  ];

  // --------------------------------------------------
  // Fetch users from API
  // --------------------------------------------------
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUser("desc", "id");
      const userList = res?.data?.data || [];
      setUsers(userList);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --------------------------------------------------
  // Role badge styling
  // --------------------------------------------------
  const roleBadgeStyle = (role: string) => {
    const normalized = (role || "").toUpperCase();
    const map: Record<string, { bg: string; color: string; border: string }> = {
      ADMIN: { bg: "#fee8f1", color: "#e22b6e", border: "1px solid #fca5c0" },
      "SUPER ADMIN": { bg: "#fdf2f8", color: "#db2777", border: "1px solid #fbcfe8" },
      INSTRUCTOR: { bg: "#f0edfc", color: "#6740d5", border: "1px solid #ddd6fe" },
      OPERATOR: { bg: "#e7f3fd", color: "#3e6db5", border: "1px solid #bfdbfe" },
      MANAGER: { bg: "#fef3c7", color: "#d97706", border: "1px solid #fde68a" },
    };

    return (
      map[normalized] || {
        bg: "#f1f5f9",
        color: "#475569",
        border: "1px solid #e2e8f0",
      }
    );
  };

  // --------------------------------------------------
  // Filter users
  // --------------------------------------------------
  const filtered = users.filter((user) => {
    const searchValue = search.toLowerCase();

    const matchSearch =
      (user.name || "").toLowerCase().includes(searchValue) ||
      (user.email || "").toLowerCase().includes(searchValue) ||
      String(user.id || "").includes(searchValue);

    const matchRole =
      roleFilter === "All Roles" ||
      (user.role || "").toUpperCase() === roleFilter.toUpperCase();

    return matchSearch && matchRole;
  });

  // --------------------------------------------------
  // Statistics
  // --------------------------------------------------
  const totalProfiles = users.length;
  const instructorCount = users.filter(
    (u) => (u.role || "").toUpperCase() === "INSTRUCTOR"
  ).length;
  const adminCount = users.filter(
    (u) =>
      (u.role || "").toUpperCase() === "ADMIN" ||
      (u.role || "").toUpperCase() === "SUPER ADMIN"
  ).length;

  // --------------------------------------------------
  // Input change
  // --------------------------------------------------
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // Open Add Modal
  // --------------------------------------------------
  const handleAddUser = (): void => {
    setFormData({
      id: null,
      name: "",
      email: "",
      password: "",
      role: "OPERATOR",
    });
    setErrorMessage("");
    setIsEditing(false);
    setShowModal(true);
  };

  // --------------------------------------------------
  // Open Edit Modal
  // --------------------------------------------------
  const handleEditUser = (user: User): void => {
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email ?? "",
      password: "",
      role: user.role,
    });
    setErrorMessage("");
    setIsEditing(true);
    setShowModal(true);
  };

  // --------------------------------------------------
  // Delete user via API
  // --------------------------------------------------
  const handleDeleteUser = async (id: number): Promise<void> => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        await fetchUsers();
      } catch (error: any) {
        console.error("Failed to delete user:", error);
        alert(
          error?.response?.data?.message ||
            "Failed to delete user. Please try again."
        );
      }
    }
  };

  // --------------------------------------------------
  // Submit user (Create or Update) via API
  // --------------------------------------------------
  const handleSubmit = async (): Promise<void> => {
    setErrorMessage("");

    if (!formData.name.trim()) {
      setErrorMessage("Please enter the user's name.");
      return;
    }

    if (!formData.email.trim()) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!isEditing && (!formData.password || formData.password.length < 6)) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (
      isEditing &&
      formData.password &&
      formData.password.trim().length > 0 &&
      formData.password.length < 6
    ) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (!formData.role) {
      setErrorMessage("Please select a role.");
      return;
    }

    setSubmitting(true);
    try {
      if (isEditing && formData.id !== null) {
        const payload: {
          name: string;
          email: string;
          role: string;
          password?: string;
        } = {
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          role: formData.role,
        };

        if (formData.password && formData.password.trim()) {
          payload.password = formData.password.trim();
        }

        await updateUser(formData.id, payload);
      } else {
        await createUser({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password?.trim() || "",
          role: formData.role,
        });
      }

      setShowModal(false);
      await fetchUsers();
    } catch (error: any) {
      console.error("Failed to save user:", error);
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to save user. Please verify your inputs.";
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------
  return (
    <div className="h-auto bg-white shadow-sm rounded border p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">User Management</h4>

        <button
          type="button"
          className="btn btn-asti-gradient px-4 py-2 fw-semibold rounded-pill"
          onClick={handleAddUser}
        >
          + Create User
        </button>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        {[
          {
            label: "Total Profiles",
            value: totalProfiles,
            color: "#3e6db5",
            bgClass: "my-fade-blue",
            stroke: "#3e6db5",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            ),
          },
          {
            label: "Instructor Roles",
            value: `${instructorCount} Instructor${
              instructorCount !== 1 ? "s" : ""
            }`,
            color: "#6740d5",
            bgClass: "my-fade-purple",
            stroke: "#6740d5",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            ),
          },
          {
            label: "Admin Roles",
            value: `${adminCount} Admin${adminCount !== 1 ? "s" : ""}`,
            color: "#e22b6e",
            bgClass: "my-fade-pink",
            stroke: "#e22b6e",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            ),
          },
        ].map((stat, index) => (
          <div key={index} className="col-md-4">
            <div className="stat-card-box d-flex align-items-center p-3">
              <div
                className={`me-3 rounded-circle p-2 d-flex align-items-center justify-content-center flex-shrink-0 ${stat.bgClass}`}
                style={{ width: "46px", height: "46px", color: stat.stroke }}
              >
                {stat.icon}
              </div>
              <div>
                <div className="stat-card-label">{stat.label}</div>
                <div className="stat-card-value" style={{ color: stat.color }}>
                  {stat.value}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
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
            <span
              className="ms-1 fw-semibold"
              style={{ fontSize: "0.82rem", color: "#3d3d3d" }}
            >
              Filters
            </span>
          </div>

          {/* Search */}
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
              <path d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="text"
              className="ctq-filter-search-input"
              placeholder="Search by name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Role Filter */}
          <div className="d-flex align-items-center">
            <select
              className="ctq-filter-select"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {(roleFilter !== "All Roles" || search) && (
            <button
              type="button"
              className="ctq-filter-clear-btn"
              onClick={() => {
                setRoleFilter("All Roles");
                setSearch("");
              }}
            >
              Clear
            </button>
          )}
        </div>

        <div className="ctq-filter-count-info ms-auto">
          Showing <strong>{filtered.length}</strong> of {users.length} users
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0 dept-table">
          <thead>
            <tr className="dept-table-header">
              {["ID", "Name", "Email Address", "Role", "Actions"].map(
                (heading, index) => (
                  <th
                    key={index}
                    className="py-3 px-3"
                    style={{
                      textAlign: index === 4 ? "right" : "left",
                    }}
                  >
                    {heading}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-5 text-muted">
                  Loading users...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-5 text-muted">
                  No records found.
                </td>
              </tr>
            ) : (
              filtered.map((user) => {
                const badge = roleBadgeStyle(user.role);

                return (
                  <tr
                    key={user.id}
                    style={{ borderBottom: "1px solid #f1f5f9" }}
                  >
                    <td className="px-3">
                      <span className="badge-dept-code">#{user.id}</span>
                    </td>

                    <td className="px-3 fw-semibold text-dark">{user.name}</td>

                    <td
                      className="px-3"
                      style={{
                        color: user.email ? "#475569" : "#94a3b8",
                        fontStyle: user.email ? "normal" : "italic",
                      }}
                    >
                      {user.email || "NULL"}
                    </td>

                    <td className="px-3">
                      <span
                        className="px-2 py-1 rounded-pill fw-bold"
                        style={{
                          fontSize: "0.72rem",
                          background: badge.bg,
                          color: badge.color,
                          border: badge.border,
                          letterSpacing: "0.04em",
                          display: "inline-block",
                        }}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="px-3 text-end">
                      {/* Edit */}
                      <button
                        type="button"
                        className="btn-action-circle me-1"
                        title="Edit"
                        onClick={() => handleEditUser(user)}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        className="btn-action-delete"
                        title="Delete"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show"></div>

          <div className="modal fade show d-block" tabIndex={-1}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content p-4">
                {/* Modal Header */}
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold">
                    {isEditing ? "Edit User" : "Create New User"}
                  </h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                {/* Modal Body */}
                <div className="modal-body">
                  {errorMessage && (
                    <div className="alert alert-danger py-2 small mb-3">
                      {errorMessage}
                    </div>
                  )}

                  {/* Name */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">
                      Full Name <span className="text-danger">*</span>
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                      autoFocus
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">
                      Email Address <span className="text-danger">*</span>
                    </label>

                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                    />
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">
                      Password{" "}
                      {!isEditing && <span className="text-danger">*</span>}
                    </label>

                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder={
                        isEditing
                          ? "Leave blank to keep current password"
                          : "Enter password (min 6 characters)"
                      }
                    />
                    <small className="text-muted" style={{ fontSize: "0.75rem" }}>
                      {isEditing
                        ? "Only enter if you wish to reset the user password."
                        : "Must be at least 6 characters long."}
                    </small>
                  </div>

                  {/* Role */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">
                      Role Assignment <span className="text-danger">*</span>
                    </label>

                    <select
                      className="form-select"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="INSTRUCTOR">INSTRUCTOR</option>
                      <option value="OPERATOR">OPERATOR</option>
                      <option value="MANAGER">MANAGER</option>
                    </select>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="modal-footer border-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-light rounded-pill px-4"
                    onClick={() => setShowModal(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="btn btn-asti-gradient rounded-pill px-4 fw-semibold"
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting
                      ? "Saving..."
                      : isEditing
                      ? "Update User"
                      : "Create User"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default UserManagement;