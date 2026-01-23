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
            projectName: f.projectName || `Project ${f.projectId || f.id}`,
            progress: f.progress,
          }));

        setTopProgressProjects(top3);
      } catch (err) {
        console.error("Dashboard data load failed", err);
      }
    })();
  }, []);

  // Custom label renderer – shows name + % inside pie slices
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    const name = topProgressProjects[index]?.projectName || "";
    const value = `${(percent * 100).toFixed(0)}%`;

    // Shorten long names
    const displayName = name.length > 15 ? name.substring(0, 12) + "..." : name;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="11"
        fontWeight="600"
        pointerEvents="none"
      >
        <tspan x={x} dy="-6">{displayName}</tspan>
        <tspan x={x} dy="14">{value}</tspan>
      </text>
    );
  };

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
        {/* PIE CHART – Improved */}
        <div className="panel">
          <h3 className="panel-title">Top Project Progress</h3>
          <p className="panel-sub">
            Highest progress based on latest follow-ups
          </p>

          {topProgressProjects.length === 0 ? (
            <p className="no-data">No progress data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topProgressProjects}
                  dataKey="progress"
                  nameKey="projectName"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={110}
                  paddingAngle={3}
                  label={renderCustomizedLabel}
                  labelLine={false}
                >
                  {topProgressProjects.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value}%`, name]}
                  contentStyle={{
                    backgroundColor: "rgba(30, 41, 59, 0.95)",
                    border: "none",
                    borderRadius: "10px",
                    color: "#ffffff",
                    padding: "12px 16px",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
                  }}
                  itemStyle={{ color: "#e2e8f0" }}
                  labelStyle={{ color: "#94a3b8", fontWeight: 600 }}
                />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  wrapperStyle={{ marginTop: "12px" }}
                />
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