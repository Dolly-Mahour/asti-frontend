import { Outlet } from "react-router-dom";
import BreadcrumbTopbar from "../../../shared/components/breadcrumbTopbar";
import DashboardSidebar from "../components/dashboardSidebar";
import { useState } from "react";
function DashboardTemplate(){
      const [collapsed, setCollapsed] = useState(false);

    return (
        <>
        <div className="container-fluid main-dashboard-container p-0">
        <div className="dashboard-body no-navbar">
          <DashboardSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

          <div
            className={`dashboard-content ${
              collapsed ? "content-collapsed" : "content-expanded"
            }`}
          >
            <BreadcrumbTopbar />
            <Outlet />
          </div>
        </div>
      </div>
        </>
    );
}
export default DashboardTemplate;