import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function DashboardLayout({ user }) {
  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <Sidebar role={user?.role} />

      {/* Main content */}
      <div style={styles.main}>
        <TopBar />

        <main style={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */
const styles = {
  layout: {
    display: "flex",
    height: "100vh",
    background: "#f8fafc",
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: 1,
    overflowY: "auto",
  },
};
