import { useState } from "react";
import "../Sidebar/Sidebar.css";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside className="sidebar">
      <h2 className="logo">
        <img src="/logo.png" alt="TANSAM Logo" />
        <div className="logo-text">
          TANSAM
          <span>Project Management</span>
        </div>
      </h2>

      <nav>
        <p className="nav-title">Main</p>

        <a href="#" className="active">Dashboard</a>

        {/* Dropdown */}
        <div className="dropdown">
          <button
            className="dropdown-btn"
            onClick={() => setIsOpen(!isOpen)}
          >
            Mastertable
            <span className="arrow">{isOpen ? "▴" : "▾"}</span>
          </button>

          {isOpen && (
            <div className="dropdown-content">
              <a href="/TermsAndConditions">Terms & conditions</a>
              <a href="#">Table 2</a>
              <a href="#">Table 3</a>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
}

