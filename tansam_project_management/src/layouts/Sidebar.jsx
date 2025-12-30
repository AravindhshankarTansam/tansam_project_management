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
      <h3 className="sidebar-title">TANSAM</h3>
      <h4 className="sidebar-title">Project Management</h4>

      <p className="sidebar-role">
        Role: {normalizedRole || "N/A"}
      </p>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          // ✅ DROPDOWN ITEM
          if (item.children) {
            return (
              <div key={item.label} className="sidebar-dropdown">
                <div
                  className="sidebar-link dropdown-toggle"
                  onClick={() => toggleDropdown(item.label)}
                >
                  {item.label}
                  <span className="dropdown-arrow">
                    {openDropdown === item.label ? "▲" : "▼"}
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
              </div>
            );
          }

          // ✅ NORMAL LINK
          return (
            <Link
              key={item.path}
              to={item.path}
              className="sidebar-link"
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
