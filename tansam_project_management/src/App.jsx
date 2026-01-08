import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./auth/Login.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";

/* ADMIN */
import AdminDashboard from "./dashboards/Admin/AdminDashboard.jsx";
import Users from "./dashboards/Admin/Users.jsx";
import Roles from "./dashboards/Admin/Roles.jsx";
import Labs from "./dashboards/Admin/Labs.jsx";
import Reports from "./dashboards/Admin/Reports.jsx";
import CreateProjectType from "./dashboards/Admin/CreateProjectType.jsx";
import CreateWorkCategories from "./dashboards/Admin/CreateWorkCategories.jsx";

/* COORDINATOR */
import CoordinatorDashboard from "./dashboards/Coordinator/CoordinatorDashboard.jsx";
import Opportunities from "./dashboards/Coordinator/Opportunities.jsx";
import OpportunitiesTacker from "./dashboards/Coordinator/OpportunitiesTacker.jsx";

/* TEAM LEADER */
import TLDashboard from "./tl/pages/TLDashboard.jsx";
import CreateProject from "./tl/pages/CreateProject.jsx";
import ProjectFollowUp from "./tl/pages/ProjectFollowUp.jsx";
import Summary from "./tl/pages/Summary.jsx";
import AssignTeam from "./tl/pages/AssignTeam.jsx";
import Department from "./tl/pages/department.jsx";
import TeamMember from "./tl/pages/teammember.jsx";
import ProjectTypes from "./tl/pages/projectTypes.jsx";

/* CEO */
import CEODashboard from "./dashboards/CEO/page/CEODashboard.jsx";
import ProjectSection from "./dashboards/CEO/page/ProjectSection.jsx";
import QuotationSection from "./dashboards/CEO/page/QuotationSection.jsx";
import ForecastSection from "./dashboards/CEO/page/ForecastSection.jsx";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const PrivateRoute = ({ children }) =>
    user ? children : <Navigate to="/" replace />;

  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
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
          <Route path="labs" element={<Labs />} />
          <Route path="reports" element={<Reports />} />
          <Route path="project-types" element={<CreateProjectType />} />
          <Route path="work-categories" element={<CreateWorkCategories />} />
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
          <Route path="opportunities" element={<Opportunities />} />
          <Route
            path="opportunities-tracker"
            element={<OpportunitiesTacker />}
          />
        </Route>

        {/* TEAM LEADER */}
        <Route
          path="/tl"
          element={
            <PrivateRoute>
              <DashboardLayout user={user} setUser={setUser} />
            </PrivateRoute>
          }
        >
          <Route index element={<TLDashboard />} />
          <Route path="create-project" element={<CreateProject />} />
          <Route path="follow-up" element={<ProjectFollowUp />} />
          <Route path="summary" element={<Summary />} />
          <Route path="assign-team" element={<AssignTeam />} />
          <Route path="department" element={<Department />} />
          <Route path="team-member" element={<TeamMember />} />
          <Route path="project-types" element={<ProjectTypes />} />
        </Route>

        {/* CEO */}
        <Route
          path="/ceo"
          element={
            <PrivateRoute>
              <DashboardLayout user={user} setUser={setUser} />
            </PrivateRoute>
          }
        >
          <Route index element={<CEODashboard />} />
          <Route path="projects" element={<ProjectSection />} />
          <Route path="quotations" element={<QuotationSection />} />
          <Route path="forecast" element={<ForecastSection />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
