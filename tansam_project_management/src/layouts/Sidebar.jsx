import { useState } from "react";
import { Link } from "react-router-dom";
import { SIDEBAR_MENU } from "./SidebarConfig/SidebarConfig.js";
import "./CSS/Sidebar.css";

export default function Sidebar({ role }) {
  const normalizedRole = role?.toLowerCase();
  const menuItems = SIDEBAR_MENU[normalizedRole] || [];
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img
          src="/public/tansam.jpg"
          alt="TANSAM Logo"
          className="sidebar-logo-img"
        />
        <div className="sidebar-title-wrap">
          <h3 className="sidebar-title">TANSAM</h3>
          <h4 className="sidebar-subtitle">Project Management</h4>
        </div>
      </div>

      <p className="sidebar-role">Role: {normalizedRole || "N/A"}</p>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <div
            key={item.label}
            className={`sidebar-item ${openDropdown === item.label ? "open" : ""}`} // + addition
          >
            {item.children ? (
              <>
                <div
                  className="sidebar-link dropdown-toggle"
                  onClick={() => toggleDropdown(item.label)}
                >
                  <span>{item.label}</span>
              <span className="dropdown-arrow">
  {openDropdown === item.label ? "-" : "+"}
</span>

                </div>

                {openDropdown === item.label && (
                  <div className="dropdown-menu">
                    {item.children.map((child) => (
                      <Link
                        key={child.path}
                        to={child.path}
                        className="sidebar-sublink"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Link key={item.path} to={item.path} className="sidebar-link">
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* <div className="sidebar-footer">Settings</div> */}
    </aside>
  );
}
