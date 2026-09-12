import React, { useState } from "react";
import "../../../styles/dashboardSidebar.css";
import { NavLink, Link } from "react-router-dom";
import logo from "../../../assets/asti-india-logo.png";
import LogoutModal from "../../../shared/components/logoutModal";

interface LMSSidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}
function LMSSidebar({ collapsed, setCollapsed }: LMSSidebarProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const links = [
    { to: "/lms", name: "Overview", end: true },
    { to: "/lms/user-management", name: "User Management" },
    { to: "/lms/employee-management", name: "Employee Management" },

    { to: "/lms/course-management", name: "Course Management" },
    { to: "/lms/departments", name: "Departments" },
  ];

  return (
    <>
      {/* Scrollable navigation links container */}
      <div className="sidebar-nav-scroll">
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
                    width="24"
                    height="24"
                    viewBox="0 0 48 48"
                    fill="none"
                    style={{
                      transition: "transform .3s",
                      transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
                    flexShrink: 0,
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
            className={`portal-sidebar-btn h-40px w-100 rounded-3 d-flex align-items-center text-decoration-none navigation-hover ${collapsed ? "justify-content-center p-0" : "justify-content-start px-3"}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
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
                `h-40px w-100 rounded-3 d-flex align-items-center text-decoration-none navigation-hover ${collapsed ? "justify-content-center p-0" : "justify-content-start px-3"
                } ${isActive ? "active" : ""}`
              }
            >
                  {(() => {
                    switch (link.name) {
                      case 'Overview':
                        return (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
                            <path d="M10 3H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm10 10h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zM17 3c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4zM7 13c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4z" />
                          </svg>
                        );
                      case 'User Management':
                        return (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        );
                      case 'Employee Management':
                        return (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
                            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5s-3 1.34-3 3 1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-1.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-1.5c0-2.33-4.67-3.5-7-3.5z" />
                          </svg>
                        );

                      case 'Course Management':
                        return (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
                            <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm-7 10.67V17c0 2.21 3.13 4 7 4s7-1.79 7-4v-3.33c-1.87 1.05-4.31 1.66-7 1.66s-5.13-.61-7-1.66z" />
                          </svg>
                        );
                      case 'Departments':
                        return (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
                            <path d="M22 11V3h-7v3H9V3H2v8h7V8h2v10h4v3h7v-8h-7v3h-2V8h2v3h7zM4 9V5h3v4H4zm13-4h3v4h-3V5zm0 14h3v4h-3v-4z" />
                          </svg>
                        );
                      default:
                        return (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
                            <path d="M10 3H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1zm10 10h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1zM17 3c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4zM7 13c-2.206 0-4 1.794-4 4s1.794 4 4 4 4-1.794 4-4-1.794-4-4-4z" />
                          </svg>
                        );
                    }
                  })()}
            {!collapsed && <span className="ms-2 text-nowrap" style={{ fontSize: '0.9rem' }}>{link.name}</span>}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Pinned footer logout button */}
      <div className="sidebar-footer-section w-100">
        <button
          type="button"
          className="sidebar-logout-btn justify-content-center p-0"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowLogoutModal(true);
          }}
          title="Log out"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ pointerEvents: "none", flexShrink: 0 }}
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          {!collapsed && (
            <span className="ms-2" style={{ pointerEvents: "none", fontSize: "0.9rem" }}>
              Logout
            </span>
          )}
        </button>
      </div>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
      />
    </>
  );
}
export default LMSSidebar;
