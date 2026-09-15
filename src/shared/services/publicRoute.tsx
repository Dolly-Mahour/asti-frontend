import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "./authService";

interface PublicRouteProps {
  children?: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/admin-portals" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default PublicRoute;
