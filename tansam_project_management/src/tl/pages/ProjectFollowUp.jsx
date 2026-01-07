import { useState } from "react";
import {
  FiEye,
  FiEdit2,
  FiCheckCircle,
  FiAlertTriangle,
  FiUsers,
  FiClock,
} from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProjectFollowUp.css";

const formatRelativeTime = (dateString) => {
  if (!dateString) return "Never";
  const now = new Date();
  const date = new Date(dateString);
  const diffInHours = Math.round((now - date) / (1000 * 60 * 60));

  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 48) return "Yesterday";
  return `${Math.floor(diffInHours / 24)}d ago`;
};

const calculateDaysLeft = (dueDate) => {
  if (!dueDate) return null;
  const now = new Date();
  const due = new Date(dueDate);
  const diffTime = due - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export default function ProjectFollowUp() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      projectName: "Marketing Website Revamp",
      clientName: "ABC Pvt Ltd",
      status: "In Progress",
      progress: 72,
      nextMilestone: "Beta Launch",
      milestoneDueDate: "2026-01-20",
      teamMembers: 6,
      criticalIssues: 2,
      lastUpdated: "2026-01-07T10:30:00",
    },
    {
      id: 2,
      projectName: "Internal HR Portal",
      clientName: "Internal",
      status: "In Progress",
      progress: 45,
      nextMilestone: "Design Review",
      milestoneDueDate: "2026-01-12",
      teamMembers: 4,
      criticalIssues: 0,
      lastUpdated: "2026-01-07T14:00:00",
    },
    {
      id: 3,
      projectName: "Mobile Banking App",
      clientName: "National Bank",
      status: "At Risk",
      progress: 58,
      nextMilestone: "UAT Phase",
      milestoneDueDate: "2026-01-09",
      teamMembers: 8,
      criticalIssues: 5,
      lastUpdated: "2026-01-06T09:15:00",
    },
    {
      id: 4,
      projectName: "E-Commerce Backend",
      clientName: "ShopFast Inc",
      status: "Completed",
      progress: 100,
      nextMilestone: "Go Live",
      milestoneDueDate: "2026-01-05",
      teamMembers: 5,
      criticalIssues: 0,
      lastUpdated: "2026-01-05T18:00:00",
    },
  ]);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const openEditModal = (project) => {
    setEditingProject({
      id: project.id,
      progress: project.progress || 0,
      nextMilestone: project.nextMilestone || "",
      milestoneDueDate: project.milestoneDueDate || "",
      criticalIssues: project.criticalIssues || 0,
    });
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingProject(null);
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    // Simulate save (later will call API)
    setProjects((prev) =>
      prev.map((p) =>
        p.id === editingProject.id
          ? {
              ...p,
              progress: editingProject.progress,
              nextMilestone: editingProject.nextMilestone,
              milestoneDueDate: editingProject.milestoneDueDate,
              criticalIssues: editingProject.criticalIssues,
              lastUpdated: new Date().toISOString(), // Simulate updated timestamp
            }
          : p
      )
    );

    toast.success("Project progress updated successfully!");
    closeEditModal();
  };

  return (
    <div className="followup-page">
      <ToastContainer position="top-right" autoClose={1500} theme="light" newestOnTop />

      {/* HEADER */}
      <div className="followup-header">
        <div>
          <h2>Project Follow Up</h2>
          <p className="followup-subtitle">
            Monitor delivery progress, risks, and team health across all projects
          </p>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="followup-table-card">
        {projects.length === 0 ? (
          <div className="followup-empty">
            <p>No projects found</p>
          </div>
        ) : (
          <table className="followup-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Client</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Next Milestone</th>
                <th>Team</th>
                <th>Critical Issues</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => {
                const daysLeft = calculateDaysLeft(p.milestoneDueDate);
                const isUrgent = daysLeft !== null && daysLeft <= 3 && p.status !== "Completed";
                const isOverdue = daysLeft !== null && daysLeft < 0;

                return (
                  <tr key={p.id} className="followup-row">
                    <td className="followup-project-cell">
                      <div>
                        <strong>{p.projectName}</strong>
                        <div className="followup-project-code">PRJ-2026-00{p.id}</div>
                      </div>
                    </td>

                    <td>{p.clientName}</td>

                    <td>
                      <span
                        className={`followup-status-badge ${
                          p.status?.toLowerCase().replace(" ", "-") || "planned"
                        } ${p.status === "At Risk" ? "at-risk" : ""}`}
                      >
                        {p.status === "Completed" && <FiCheckCircle className="badge-icon" />}
                        {p.status === "At Risk" && <FiAlertTriangle className="badge-icon" />}
                        {p.status || "Planned"}
                      </span>
                    </td>

                    <td>
                      <div className="followup-progress-container">
                        <div className="followup-progress-bar">
                          <div
                            className="followup-progress-fill"
                            style={{ width: `${p.progress || 0}%` }}
                          />
                        </div>
                        <span className="followup-progress-text">{p.progress || 0}%</span>
                      </div>
                    </td>

                    <td className={isUrgent || isOverdue ? "followup-urgent" : ""}>
                      <div>
                        <div>{p.nextMilestone || "—"}</div>
                        {p.milestoneDueDate && (
                          <small>
                            {isOverdue
                              ? `Overdue by ${Math.abs(daysLeft)}d`
                              : daysLeft !== null
                              ? `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left`
                              : "No due date"}
                          </small>
                        )}
                      </div>
                    </td>

                    <td>
                      <div className="followup-team">
                        <FiUsers className="team-icon" />
                        {p.teamMembers || 0}
                      </div>
                    </td>

                    <td className={p.criticalIssues > 0 ? "followup-critical" : ""}>
                      {p.criticalIssues > 0 && <FiAlertTriangle className="critical-icon" />}
                      {p.criticalIssues || 0}
                    </td>

                    <td>
                      <div className="followup-updated">
                        <FiClock className="clock-icon" />
                        {formatRelativeTime(p.lastUpdated)}
                      </div>
                    </td>

                    <td className="followup-actions">
                      <button className="followup-view-btn">
                        <FiEye className="view-icon" />
                        View
                      </button>
                      <button
                        className="followup-edit-btn"
                        onClick={() => openEditModal(p)}
                      >
                        <FiEdit2 className="edit-icon" />
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* EDIT MODAL */}
      {editModalOpen && editingProject && (
        <div className="followup-modal-overlay" onClick={closeEditModal}>
          <div className="followup-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Update Project Progress</h3>
            <p className="modal-project-name">{projects.find(p => p.id === editingProject.id)?.projectName}</p>

            <form onSubmit={handleUpdate}>
              <label>Progress (%)</label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={editingProject.progress}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, progress: Number(e.target.value) })
                }
                className="progress-slider"
              />
              <div className="progress-value">{editingProject.progress}%</div>

              <label>Next Milestone</label>
              <input
                type="text"
                placeholder="e.g. MVP Launch, Client Demo"
                value={editingProject.nextMilestone}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, nextMilestone: e.target.value })
                }
                required
              />

              <label>Milestone Due Date</label>
              <input
                type="date"
                value={editingProject.milestoneDueDate}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, milestoneDueDate: e.target.value })
                }
                required
              />

              <label>Critical Issues</label>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={editingProject.criticalIssues}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, criticalIssues: Number(e.target.value) })
                }
              />

              <div className="followup-modal-actions">
                <button type="button" className="followup-cancel-btn" onClick={closeEditModal}>
                  Cancel
                </button>
                <button type="submit" className="followup-save-btn">
                  Save Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}