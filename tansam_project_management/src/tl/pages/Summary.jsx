import { useState, useEffect } from "react";
import {
  FiEye,
  FiCalendar,
  FiTarget,
  FiAlertTriangle,
  FiUsers,
  FiCheckCircle,
  FiArrowLeft,
} from "react-icons/fi";
import "./Summary.css";

import { fetchProjects } from "../../services/project.api";
import { fetchProjectFollowups } from "../../services/projectFollowup.api";

/* ---------- HELPERS ---------- */
const calculateDaysLeft = (endDate) => {
  if (!endDate) return null;
  const diff = new Date(endDate) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const getStatusColor = (status) => {
  switch (status) {
    case "In Progress":
      return "in-progress";
    case "At Risk":
      return "at-risk";
    case "Completed":
      return "completed";
    default:
      return "planned";
  }
};

export default function ProjectSummary() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD + MERGE DATA ================= */
  useEffect(() => {
    (async () => {
      try {
        const [projectData, followupData] = await Promise.all([
          fetchProjects(),
          fetchProjectFollowups(),
        ]);

        // Map followups by projectId for fast lookup
        const followupMap = {};
        followupData.forEach((f) => {
          followupMap[f.projectId] = f;
        });

        // Merge data
        const merged = projectData.map((p) => {
          const f = followupMap[p.id] || {};

          const totalTasks = 20; // placeholder until tasks module exists
          const progress = f.progress || 0;

          return {
            id: p.id,
            code: `PRJ-${p.id}`, // UI-generated
            name: p.projectName,
            client: p.clientName,
            type: p.projectType,
            startDate: p.startDate,
            endDate: p.endDate,

            status: f.status || p.status || "Planned",
            progress,

            totalTasks,
            completedTasks: Math.round((progress / 100) * totalTasks),

            teamSize: f.teamMembers || 0,
            criticalIssues: f.criticalIssues || 0,

            lead: p.projectLead || "—", // optional
          };
        });

        setProjects(merged);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ================= SINGLE PROJECT VIEW ================= */
  if (selectedProject) {
    const p = selectedProject;
    const daysLeft = calculateDaysLeft(p.endDate);

    return (
      <div className="project-summary single-view">
        <button className="back-btn" onClick={() => setSelectedProject(null)}>
          <FiArrowLeft size={18} />
          All Projects
        </button>

        <div className="single-header">
          <div>
            <h2>{p.name}</h2>
            <p className="subtitle">
              {p.client} • {p.type}
            </p>
          </div>

          <div className="header-meta">
            <span className="project-code">{p.code}</span>
            <span className={`status-badge ${getStatusColor(p.status)}`}>
              {p.status === "Completed" && <FiCheckCircle />}
              {p.status === "At Risk" && <FiAlertTriangle />}
              {p.status}
            </span>
          </div>
        </div>

        <div className="single-grid">
          {/* PROJECT DETAILS */}
          <div className="summary-card large">
            <h3>
              <FiTarget /> Project Details
            </h3>
            <div className="detail-grid">
              <div>
                <span>Project Lead</span>
                <strong>{p.lead}</strong>
              </div>
              <div>
                <span>Start Date</span>
                <strong>
                  {p.startDate
                    ? new Date(p.startDate).toLocaleDateString()
                    : "—"}
                </strong>
              </div>
              <div>
                <span>End Date</span>
                <strong>
                  {p.endDate
                    ? new Date(p.endDate).toLocaleDateString()
                    : "—"}
                </strong>
              </div>
              <div>
                <span>Days Remaining</span>
                <strong className={daysLeft <= 7 ? "urgent" : ""}>
                  {daysLeft ?? "—"}
                </strong>
              </div>
              <div>
                <span>Team Size</span>
                <strong>{p.teamSize} members</strong>
              </div>
              <div>
                <span>Critical Issues</span>
                <strong className={p.criticalIssues > 0 ? "critical" : ""}>
                  {p.criticalIssues}
                </strong>
              </div>
            </div>
          </div>

          {/* PROGRESS */}
          <div className="summary-card">
            <h3>
              <FiCheckCircle /> Progress Overview
            </h3>
            <div className="progress-large">
              <div className="progress-circle">
                <span>{p.progress}%</span>
              </div>
              <div>
                <div>
                  Tasks: {p.completedTasks} / {p.totalTasks}
                </div>
                <div className="task-bar">
                  <div
                    style={{
                      width: `${
                        (p.completedTasks / p.totalTasks) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ================= DASHBOARD VIEW ================= */
  return (
    <div className="project-summary dashboard-view">
      <div className="page-header">
        <h2>Project Summary Dashboard</h2>
        <p className="subtitle">
          Overview of all active and completed projects
        </p>
      </div>

      {loading ? (
        <div className="assign-loading">Loading summary...</div>
      ) : (
        <div className="projects-grid">
          {projects.map((p) => {
            const daysLeft = calculateDaysLeft(p.endDate);

            return (
              <div
                key={p.id}
                className="project-card"
                onClick={() => setSelectedProject(p)}
              >
                <div className="card-header">
                  <div>
                    <h3>{p.name}</h3>
                    <p>{p.client}</p>
                  </div>
                  <span
                    className={`status-badge small ${getStatusColor(p.status)}`}
                  >
                    {p.status}
                  </span>
                </div>

                <div className="card-body">
                  <div className="info-row">
                    <span>Code</span>
                    <strong>{p.code}</strong>
                  </div>
                  <div className="info-row">
                    <span>Type</span>
                    <strong>{p.type}</strong>
                  </div>

                  <div className="progress-section">
                    <div className="progress-label">
                      <span>Progress</span>
                      <strong>{p.progress}%</strong>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="fill"
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="meta-row">
                    <div>
                      <FiUsers /> {p.teamSize}
                    </div>
                    <div
                      className={p.criticalIssues > 0 ? "critical" : ""}
                    >
                      <FiAlertTriangle /> {p.criticalIssues}
                    </div>
                    <div className={daysLeft <= 7 ? "urgent" : ""}>
                      <FiCalendar /> {daysLeft ?? "—"} days
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <FiEye /> View Details
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
