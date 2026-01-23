import "./TLDashboard.css";
import { useEffect, useState } from "react";
import {
  FiArrowUpRight,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

import { fetchProjects } from "../../services/project.api";
import { fetchProjectFollowups } from "../../services/projectfollowup.api";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PIE_COLORS = ["#22c55e", "#3b82f6", "#f59e0b"];

export default function TLDashboard() {
  const [totalProjects, setTotalProjects] = useState(0);
  const [activeTasks, setActiveTasks] = useState(0);
  const [completedProjects, setCompletedProjects] = useState(0);
  const [onHoldAlerts, setOnHoldAlerts] = useState(0);
  const [topProgressProjects, setTopProgressProjects] = useState([]);

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

        /* ================= TOP 3 PROJECTS BY PROGRESS ================= */
        const top3 = [...followups]
          .filter((f) => typeof f.progress === "number")
          .sort((a, b) => b.progress - a.progress)
          .slice(0, 3)
          .map((f) => ({
            projectName: f.projectName,
            progress: f.progress,
          }));

        setTopProgressProjects(top3);
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

      {/* ================= BOTTOM SECTION ================= */}
      <div className="bottom-grid">
        {/* PIE CHART */}
        <div className="panel">
          <h3 className="panel-title">Top Project Progress</h3>
          <p className="panel-sub">
            Highest progress based on latest follow-ups
          </p>

          {topProgressProjects.length === 0 ? (
            <p className="no-data">No progress data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={topProgressProjects}
                  dataKey="progress"
                  nameKey="projectName"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, value }) => `${name}: ${value}%`}
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
          )}
        </div>

        {/* RECENT ACTIVITY (still static – can be wired later) */}
        <div className="panel">
          <h3 className="panel-title">Recent Activity</h3>
          <p className="panel-sub">Latest updates from your team</p>

          <ul className="activity-list">
            <li>
              <div className="avatar">S</div>
              <div>
                <strong>Sarah Miller</strong> completed Hero Section
                <span>2h ago</span>
              </div>
            </li>
            <li>
              <div className="avatar">J</div>
              <div>
                <strong>Jack Wilson</strong> commented on API Docs
                <span>4h ago</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
