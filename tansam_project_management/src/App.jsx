import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./auth/Login.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";

// Admin
import AdminDashboard from "./dashboards/Admin/AdminDashboard.jsx";
import Users from "./dashboards/Admin/Users.jsx";
import Roles from "./dashboards/Admin/Roles.jsx";
import Labs from "./dashboards/Admin/Labs.jsx";
import Reports from "./dashboards/Admin/Reports.jsx";
import CreateProjectType from "./dashboards/Admin/CreateProjectType.jsx";
import CreateWorkCategories from "./dashboards/Admin/CreateWorkCategories.jsx";

// Coordinator
import CoordinatorDashboard from "./dashboards/Coordinator/CoordinatorDashboard.jsx";
import Opportunities from "./dashboards/Coordinator/Opportunities.jsx";
import OpportunitiesTacker from "./dashboards/Coordinator/OpportunitiesTacker.jsx";
import CreateProject from "./dashboards/Admin/Projects.jsx";
import Quotations from "./dashboards/Finance/Quotations.jsx";
import QuotationFollowup from "./dashboards/Finance/QuotationFollowup.jsx";
// import FinanceReports from "./dashboards/Finance/Reports.jsx";
import FinanceDashboard from "./dashboards/Finance/FinanceDashboard.jsx";
function App() {
  const [user, setUser] = useState(null);

  // 🔄 Restore session on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const PrivateRoute = ({ children }) =>
    user ? children : <Navigate to="/" replace />;

  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login setUser={setUser} />} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <DashboardLayout user={user} setUser={setUser} />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="roles" element={<Roles />} />
            <Route path="project" element={<CreateProject />} />
          <Route path="labs" element={<Labs />} />
          <Route path="reports" element={<Reports />} />
          <Route path="project-types" element={<CreateProjectType />} />
          <Route path="work-categories" element={<CreateWorkCategories />} />
        </Route>

        <Route
  path="/finance"
  element={
    <PrivateRoute>
      <DashboardLayout user={user} setUser={setUser} />
    </PrivateRoute>
  }
>
 
  <Route path="quotations" element={<Quotations />} />
  <Route path="quotation-followup" element={<QuotationFollowup />} />
  <Route path="dashboard" element={<FinanceDashboard />} />
  {/* <Route path="reports" element={<FinanceReports />} /> */}
</Route>

        {/* COORDINATOR */}
        <Route
          path="/coordinator"
          element={
            <PrivateRoute>
              <DashboardLayout user={user} setUser={setUser} />
            </PrivateRoute>
          }
        >
          <Route index element={<CoordinatorDashboard />} />
          <Route path="/coordinator/Opportunities-tacker" element={<OpportunitiesTacker />} />
          <Route path="/coordinator/opportunities" element={<Opportunities />} />
        </Route>
      </Routes>
    </BrowserRouter>  
  );
}

export default App;
