import { useState } from "react";
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

export default function ProjectSummary() {
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      id: 1,
      code: "PRJ-2026-001",
      name: "Marketing Website Revamp",
      client: "ABC Pvt Ltd",
      type: "Web Development",
      status: "In Progress",
      progress: 72,
      totalTasks: 24,
      completedTasks: 18,
      teamSize: 6,
      criticalIssues: 2,
      endDate: "2026-01-20",
      startDate: "2025-11-01",
      lead: "Rahul Sharma",
    },
    {
      id: 2,
      code: "PRJ-2026-002",
      name: "Internal HR Portal",
      client: "Internal",
      type: "Web Application",
      status: "In Progress",
      progress: 45,
      totalTasks: 32,
      completedTasks: 14,
      teamSize: 4,
      criticalIssues: 0,
      endDate: "2026-02-15",
      startDate: "2025-12-01",
      lead: "Priya Singh",
    },
    {
      id: 3,
      code: "PRJ-2026-003",
      name: "Mobile Banking App",
      client: "National Bank",
      type: "Mobile App",
      status: "At Risk",
      progress: 58,
      totalTasks: 48,
      completedTasks: 28,
      teamSize: 8,
      criticalIssues: 5,
      endDate: "2026-01-09",
      startDate: "2025-10-01",
      lead: "Amit Kumar",
    },
    {
      id: 4,
      code: "PRJ-2026-004",
      name: "E-Commerce Platform",
      client: "ShopFast Inc",
      type: "Web Development",
      status: "Completed",
      progress: 100,
      totalTasks: 60,
      completedTasks: 60,
      teamSize: 10,
      criticalIssues: 0,
      endDate: "2025-12-30",
      startDate: "2025-08-01",
      lead: "Neha Gupta",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress": return "in-progress";
      case "At Risk": return "at-risk";
      case "Completed": return "completed";
      default: return "planned";
    }
  };

  const calculateDaysLeft = (endDate) => {
    const diff = new Date(endDate) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

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
            <p className="subtitle">{p.client} • {p.type}</p>
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
            <h3><FiTarget /> Project Details</h3>
            <div className="detail-grid">
              <div><span>Project Lead</span><strong>{p.lead}</strong></div>
              <div><span>Start Date</span><strong>{new Date(p.startDate).toLocaleDateString()}</strong></div>
              <div><span>End Date</span><strong>{new Date(p.endDate).toLocaleDateString()}</strong></div>
              <div>
                <span>Days Remaining</span>
                <strong className={daysLeft <= 7 ? "urgent" : ""}>
                  {daysLeft} days
                </strong>
              </div>
              <div><span>Team Size</span><strong>{p.teamSize} members</strong></div>
              <div>
                <span>Critical Issues</span>
                <strong className={p.criticalIssues > 0 ? "critical" : ""}>
                  {p.criticalIssues}
                </strong>
              </div>
            </div>
          </div>

          {/* PROGRESS & TASKS */}
          <div className="summary-card">
            <h3><FiCheckCircle /> Progress Overview</h3>
            <div className="progress-large">
              <div className="progress-circle">
                <span>{p.progress}%</span>
              </div>
              <div>
                <div>
                  Tasks: {p.completedTasks} / {p.totalTasks}
                </div>
                <div className="task-bar">
                  <div style={{ width: `${(p.completedTasks / p.totalTasks) * 100}%` }} />
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
        <p className="subtitle">Overview of all active and completed projects</p>
      </div>

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
                <span className={`status-badge small ${getStatusColor(p.status)}`}>
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
                    <div className="fill" style={{ width: `${p.progress}%` }} />
                  </div>
                </div>

                <div className="meta-row">
                  <div><FiUsers /> {p.teamSize}</div>
                  <div className={p.criticalIssues > 0 ? "critical" : ""}>
                    <FiAlertTriangle /> {p.criticalIssues}
                  </div>
                  <div className={daysLeft <= 7 ? "urgent" : ""}>
                    <FiCalendar /> {daysLeft} days
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
    </div>
  );
}
