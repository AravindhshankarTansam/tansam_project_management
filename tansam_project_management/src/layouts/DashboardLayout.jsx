import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function DashboardLayout({ user }) {
  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <Sidebar role={user?.role} />
      </aside>

      {/* Main area */}
      <div style={styles.main}>
        <TopBar />

        {/* Page content */}
        <div style={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */
const styles = {
  layout: {
    display: "flex",
    height: "100vh",
  },
  sidebar: {
    width: "220px",
    background: "#1e293b",
    color: "#fff",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: 1,
    padding: "20px",
    background: "#f8fafc",
    overflowY: "auto",
  },
};
