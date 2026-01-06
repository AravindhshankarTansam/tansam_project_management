import { NavLink } from "react-router-dom";

export default function TLSidebar() {
  return (
    <aside style={styles.sidebar}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>TANSAM</h2>
        <span style={styles.role}>Team Leader</span>
      </div>

      {/* Navigation */}
      <nav style={styles.nav}>
        <NavLink to="/tl" end style={navStyle}>
          Dashboard
        </NavLink>

        <NavLink to="/tl/create-project" style={navStyle}>
          Create New Project
        </NavLink>

        <NavLink to="/tl/follow-up" style={navStyle}>
          Project Follow-up
        </NavLink>

        <NavLink to="/tl/summary" style={navStyle}>
          Summary
        </NavLink>
      </nav>
    </aside>
  );
}

/* ---------- Styles ---------- */

const styles = {
  sidebar: {
    width: "240px",
    minHeight: "100vh",
    background: "#ffffff", // ✅ white background
    color: "#0f172a",
    padding: "24px 20px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "2px 0 10px rgba(0,0,0,0.08)",
  },

  header: {
    marginBottom: "32px",
    animation: "slideIn 0.6s ease-out",
  },

  title: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "700",
    letterSpacing: "1px",
  },

  role: {
    fontSize: "13px",
    color: "#64748b",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "14px", // ✅ space between items
  },
};

/* Active + animation style */
const navStyle = ({ isActive }) => ({
  textDecoration: "none",
  padding: "10px 14px",
  borderRadius: "8px",
  fontSize: "15px",
  fontWeight: "500",
  color: isActive ? "#2563eb" : "#0f172a",
  background: isActive ? "#e0e7ff" : "transparent",
  transform: "translateX(0)",
  animation: "slideIn 0.5s ease-out",
  transition: "all 0.3s ease",
});

/* ---------- Global animation (add once in CSS) ---------- */
/*
@keyframes slideIn {
  from {
    transform: translateX(30px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
*/