import React from "react";
import "./CSS/TopBar.css";

export default function TopBar({ user, onLogout }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="page-title">Dashboard</span>
      </div>

      <div className="topbar-right">
        <span className="user-name">
          Welcome, {user?.name || user?.role}
        </span>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
