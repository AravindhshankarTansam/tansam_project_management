import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function DashboardLayout({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user"); // clear session
    setUser(null);                   // clear state
    navigate("/", { replace: true }); // redirect to login
  };

  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <Sidebar role={user?.role} />

      {/* Main content */}
      <div style={styles.main}>
        <TopBar user={user} onLogout={handleLogout} />

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
