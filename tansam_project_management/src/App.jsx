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
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
