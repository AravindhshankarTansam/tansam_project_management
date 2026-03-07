import "../CSS/TLDashboard.css";
import { useEffect, useState } from "react";
import {
  FiArrowUpRight,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

import { fetchProjects } from "../../../services/project.api";
import { fetchProjectFollowups } from "../../../services/projectFollowup.api";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PIE_COLORS = ["#22c55e", "#3b82f6", "#f59e0b"];

/* ===== helper ===== */
const timeAgo = (date) => {
  if (!date) return "—"; // 👈 FIX #1

  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return "—"; // 👈 FIX #2

  const diff = (Date.now() - parsed.getTime()) / 1000;

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};


export default function TLDashboard() {
  const [totalProjects, setTotalProjects] = useState(0);
  const [activeTasks, setActiveTasks] = useState(0);
  const [completedProjects, setCompletedProjects] = useState(0);
  const [onHoldAlerts, setOnHoldAlerts] = useState(0);

  const [topProgressProjects, setTopProgressProjects] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        /* ================= PROJECT COUNT ================= */
        const projects = await fetchProjects();
        setTotalProjects(projects?.length || 0);

        /* ================= FOLLOWUPS ================= */
        const followups = await fetchProjectFollowups();

        setActiveTasks(
          followups.filter((f) => f.status === "In Progress").length
        );

        setCompletedProjects(
          followups.filter((f) => f.status === "Completed").length
        );

        setOnHoldAlerts(
          followups.filter((f) => f.status === "On Hold").length
        );

        /* ================= TOP 3 BY PROGRESS ================= */
        const top3 = [...followups]
          .filter((f) => typeof f.progress === "number")
          .sort((a, b) => b.progress - a.progress)
          .slice(0, 3)
          .map((f) => ({
            projectName: f.projectName || `Project ${f.projectId}`,
            progress: f.progress,
          }));

        setTopProgressProjects(top3);

        /* ================= RECENT ACTIVITY ================= */
        const recent = [...followups]
          .sort(
            (a, b) =>
              new Date(b.updated_at || b.created_at) -
              new Date(a.updated_at || a.created_at)
          )
          .slice(0, 5);

        setRecentActivities(recent);
      } catch (err) {
        console.error("Dashboard data load failed", err);
      }
    })();
  }, []);

  return (
    <div className="tl-dashboard">
      <h2 className="page-title">Dashboard</h2>

      {/* ================= TOP METRICS ================= */}
      <div className="stats-grid">
        <div className="stat-card clickable">
          <div className="card-header">
            <span className="stat-label">Total Projects</span>
            <FiArrowUpRight className="card-icon" />
          </div>
          <h3 className="stat-value">{totalProjects}</h3>
        </div>

        <div className="stat-card clickable">
          <div className="card-header">
            <span className="stat-label">Active Tasks</span>
            <FiClock className="card-icon" />
          </div>
          <h3 className="stat-value">{activeTasks}</h3>
        </div>

        <div className="stat-card clickable">
          <div className="card-header">
            <span className="stat-label">Completed Tasks</span>
            <FiCheckCircle className="card-icon success" />
          </div>
          <h3 className="stat-value">{completedProjects}</h3>
        </div>

        <div className="stat-card clickable">
          <div className="card-header">
            <span className="stat-label">On Hold</span>
            <FiAlertCircle className="card-icon danger" />
          </div>
          <h3 className="stat-value">{onHoldAlerts}</h3>
        </div>
      </div>

      {/* ================= BOTTOM ================= */}
      <div className="bottom-grid">
        {/* ===== PIE ===== */}
        <div className="panel">
          <h3 className="panel-title">Top Project Progress</h3>
          <p className="panel-sub">Highest progress based on follow-ups</p>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={topProgressProjects}
                dataKey="progress"
                nameKey="projectName"
                innerRadius={50}
                outerRadius={110}
                paddingAngle={3}
              >
                {topProgressProjects.map((_, i) => (
                  <Cell
                    key={i}
                    fill={PIE_COLORS[i % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* ===== RECENT ACTIVITY (REAL DATA) ===== */}
        <div className="panel">
          <h3 className="panel-title">Recent Activity</h3>
          <p className="panel-sub">Latest project updates</p>

          <ul className="activity-list">
            {recentActivities.length === 0 ? (
              <li>No recent activity</li>
            ) : (
              recentActivities.map((a) => (
                    <li key={`${a.id || "pf"}-${a.projectId}-${a.created_at || "na"}`}>
                  <div className="avatar">
                    {a.projectName?.charAt(0) || "P"}
                  </div>
                  <div>
                    <strong>{a.projectName}</strong>
                    <div className="activity-text">
                      Status: {a.status} · Progress: {a.progress || 0}%
                    </div>
                    <span>{timeAgo(a.updatedAt || a.createdAt)}</span>

                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
