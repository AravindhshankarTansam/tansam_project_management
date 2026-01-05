import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./auth/Login.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import AdminDashboard from "./dashboards/Admin/AdminDashboard.jsx";
import Users from "./dashboards/Admin/Users.jsx";
import Roles from "./dashboards/Admin/Roles.jsx";
import Labs from "./dashboards/Admin/Labs.jsx";
import Reports from "./dashboards/Admin/Reports.jsx";
import CreateProjectType from "./dashboards/Admin/CreateProjectType.jsx";
import CreateWorkCategories from "./dashboards/Admin/CreateWorkCategories.jsx";
// TL Imports
import TLLayout from "./tl/layout/TLLayout.jsx";
import TLDashboard from "./tl/pages/TLdashboard.jsx";
import CreateProject from "./tl/pages/CreateProject.jsx";
import ProjectFollowUp from "./tl/pages/ProjectFollowUp.jsx";
import Summary from "./tl/pages/Summary.jsx";





function App() {
  const [user, setUser] = useState(null);

  // 🔥 Restore session on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/" replace />;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login setUser={setUser} />} />

        {/* Admin */}
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
         {/* TEAM LEADER (SEPARATE, NOT INSIDE ADMIN) */}
  <Route
    path="/tl"
    element={
      <PrivateRoute>
        <TLLayout />
      </PrivateRoute>
    }
  >
    <Route index element={<TLDashboard />} />
    <Route path="create-project" element={<CreateProject />} />
    <Route path="follow-up" element={<ProjectFollowUp />} />
    <Route path="summary" element={<Summary />} />
  </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
