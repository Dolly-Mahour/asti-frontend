import React from "react";
import "../../../styles/dashboardSidebar.css";
import { NavLink, Link } from "react-router-dom";
import logo from "../../../assets/asti-india-logo.png";

interface LMSSidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}
function LMSSidebar({ collapsed, setCollapsed }:LMSSidebarProps) {
  const links = [
    { to: "/lms", name: "Overview", end: true },
    { to: "/lms/user-management", name: "User Management" },
    { to: "/lms/employee-management", name: "Employee Management" },
    { to: "/lms/instructor", name: "Instructor " },
    { to: "/lms/operator", name: "Operator " },
    { to: "/lms/course-management", name: "Course Management" },
    { to: "/lms/departments", name: "Departments" },
  ];

  return (
    <>
      <div className="border bg-white">
        <div
          className={`side-bar rounded d-flex flex-column justify-content-between p-2 ${collapsed ? "sidebar-collapsed" : "sidebar-expanded"
            }`}
        >
          <div className="row g-3 m-0 w-100">
            {/* Logo + collapse button row */}
            <div className="sidebar-header-row d-flex align-items-center justify-content-between w-100 px-1">
              {/* Logo — hidden when collapsed */}
              {!collapsed && (
                <img
                  src={logo}
                  alt="ASTI India"
                  className="sidebar-logo"
                />
              )}
              <button
                type="button"
                className={`btn btn-sm border-0 bg-transparent ${collapsed ? "mx-auto" : "ms-auto"}`}
                onClick={() => setCollapsed((prev) => !prev)}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 48 48"
                  fill="none"
                  style={{
                    transition: "transform .3s",
                    transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  <path d="M8 11H40" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  <path d="M8 24H40" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  <path d="M8 37H40" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                  <path d="M13.6567 29.6569L7.99988 24L13.6567 18.3431" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          {/* Portals Button */}
          <Link
            to="/admin-portals"
            className={`portal-sidebar-btn h-40px w-100 rounded-3 d-flex align-items-center text-decoration-none navigation-hover ${collapsed ? "justify-content-center p-0" : "justify-content-start px-4"}`}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M4 4h6v6H4V4zm10 0h6v6h-6V4zm0 10h6v6h-6v-6zm-10 0h6v6H4v-6z" />
            </svg>
            {!collapsed && <span className="ms-2">Portals</span>}
            {!collapsed && <span className="portal-sidebar-badge ms-auto">Switch</span>}
          </Link>

            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `h-40px w-100 rounded-3 d-flex align-items-center text-decoration-none navigation-hover ${collapsed ? "justify-content-center p-0" : "justify-content-start px-4"
                  } ${isActive ? "active" : ""}`
                }
              >
                {(() => {
                  switch (link.name) {
                    case 'Overview':
                      return (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3 3h18v18H3V3z" />
                        </svg>
                      );
                    case 'User Management':
                      return (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      );
                    case 'Employee Management':
                      return (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5s-3 1.34-3 3 1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-1.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-1.5c0-2.33-4.67-3.5-7-3.5z" />
                        </svg>
                      );
                    case 'Instructor':
                      return (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2L2 7l10 5 10-5-10-5zm0 7.5L4.5 7 12 3.5 19.5 7 12 9.5zM4 9v11h5v-6h6v6h5V9l-8 4-8-4z" />
                        </svg>
                      );
                    case 'Operator':
                      return (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 13H5v-2h14v2z" />
                        </svg>
                      );
                    case 'Course Management':
                      return (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 3L2 9l10 6 10-6-10-6zm0 13L2 10v10l10 6 10-6V10l-10 6z" />
                        </svg>
                      );
                    case 'Departments':
                      return (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3 13h8v8H3v-8zm10 0h8v8h-8v-8zm0-10h8v8h-8V3zm-10 0h8v8H3V3z" />
                        </svg>
                      );
                    default:
                      return (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M10 3H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm10 10h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zM17 3c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4zM7 13c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4z" />
                        </svg>
                      );
                  }
                })()}
                {!collapsed && <span className="ms-2 text-nowrap" style={{ fontSize: '0.9rem' }}>{link.name}</span>}
              </NavLink>
            ))}
          </div>

          <div className="d-flex h-30px w-100 align-items-center justify-content-center">
            <svg
              className="me-1"
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8.51428 20H4.51428C3.40971 20 2.51428 19.1046 2.51428 18V6C2.51428 4.89543 3.40971 4 4.51428 4H8.51428V6H4.51428V18H8.51428V20Z" fill="red"></path>
              <path d="M13.8418 17.385L15.262 15.9768L11.3428 12.0242L20.4857 12.0242C21.038 12.0242 21.4857 11.5765 21.4857 11.0242C21.4857 10.4719 21.038 10.0242 20.4857 10.0242L11.3236 10.0242L15.304 6.0774L13.8958 4.6572L7.5049 10.9941L13.8418 17.385Z" fill="red"></path>
            </svg>
            {!collapsed && <p className="mb-0 text-danger fw-semibold" style={{ fontSize: '0.9rem' }}>Logout</p>}
          </div>
        </div>
      </div>
    </>
  );
}
export default LMSSidebar;
