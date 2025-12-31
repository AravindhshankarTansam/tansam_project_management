import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { SIDEBAR_MENU } from "./SidebarConfig/SidebarConfig";
import "./CSS/Sidebar.css";

export default function Sidebar({ role }) {
  const normalizedRole = role?.toLowerCase();
  const menuItems = SIDEBAR_MENU[normalizedRole] || [];
  const location = useLocation();

  const [openDropdown, setOpenDropdown] = useState(null);

  // ✅ Auto-open dropdown if a child route is active
  useEffect(() => {
    menuItems.forEach((item) => {
      if (item.children) {
        const isChildActive = item.children.some(
          (child) => child.path === location.pathname
        );
        if (isChildActive) {
          setOpenDropdown(item.label);
        }
      }
    });
  }, [location.pathname, menuItems]);

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3 className="logo">TANSAM</h3>
        <span className="subtitle">Project Management</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          if (item.children) {
            const isOpen = openDropdown === item.label;

            return (
              <div key={item.label} className="sidebar-section">
                <button
                  className={`section-title ${isOpen ? "open" : ""}`}
                  onClick={() => toggleDropdown(item.label)}
                >
                  <span>{item.label}</span>
                  <span className="arrow">{isOpen ? "▾" : "▸"}</span>
                </button>

                {isOpen && (
                  <div className="sidebar-submenu">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className={({ isActive }) =>
                          isActive
                            ? "sidebar-sublink active"
                            : "sidebar-sublink"
                        }
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
