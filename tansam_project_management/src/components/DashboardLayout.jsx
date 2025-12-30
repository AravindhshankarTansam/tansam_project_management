import { useState } from "react";
import Users from "./Users";
import Roles from "./Roles";
import Departments from "./Departments";

export default function DashboardLayout({ user, setIsLoggedIn }) {
  const [activeSection, setActiveSection] = useState("users");
  const [showMaster, setShowMaster] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('user');
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2 className="logo">TANSAM</h2>
          <button className="logout-btn" onClick={handleLogout}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </button>
        </div>

        <ul className="menu">
          <li 
            className={activeSection === "users" ? "active" : ""} 
            onClick={() => setActiveSection("users")}
          >
            <span>👥</span> User Management
          </li>
          <li onClick={() => setShowMaster(!showMaster)} className={showMaster ? "active" : ""}>
            <span>⚙️</span> Master Data
          </li>
          {showMaster && (
            <ul className="submenu">
              <li 
                className={activeSection === "roles" ? "active-submenu" : ""} 
                onClick={() => setActiveSection("roles")}
              >
                <span>🎭</span> Roles
              </li>
              <li 
                className={activeSection === "departments" ? "active-submenu" : ""} 
                onClick={() => setActiveSection("departments")}
              >
                <span>🏢</span> Departments
              </li>
            </ul>
          )}
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {activeSection === "users" && <Users />}
        {activeSection === "roles" && <Roles />}
        {activeSection === "departments" && <Departments />}
      </main>
    </div>
  );
}
