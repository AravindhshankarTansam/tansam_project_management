import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

import Login from "./auth/Login.jsx";

// Admin Imports
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import AdminDashboard from "./dashboards/Admin/AdminDashboard.jsx"
import CreateWorkCategories from "./dashboards/Admin/CreateWorkCategories.jsx";
import CreateProjectType from "./dashboards/Admin/CreateProjectType.jsx";
import Labs from "./dashboards/Admin/Labs.jsx";
import Reports from "./dashboards/Admin/Reports.jsx";
import Roles from "./dashboards/Admin/Roles.jsx";
import Users from "./dashboards/Admin/Users.jsx";

// Cordinator Imports

function App() {
  const [user, setUser] = useState(null);

  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login setUser={setUser} />} />

        {/* Admin Layout with Nested Routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <DashboardLayout user={user} />
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

      </Routes>
    </BrowserRouter>
  );
}

export default App;
