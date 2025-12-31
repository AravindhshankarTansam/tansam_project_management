import React from 'react';
import './CSS/TopBar.css';

export default function TopBar() {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <span className="page-title">Dashboard</span>
      </div>

      <div className="topbar-right">
        <span className="user-name">Welcome, User</span>
        <button className="logout-btn">Logout</button>
      </div>
    </header>
  );
}
