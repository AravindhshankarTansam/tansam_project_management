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

/* ---------- HELPERS ---------- */
const formatRelativeTime = (dateString) => {
  if (!dateString) return "Never";
  const now = new Date();
  const date = new Date(dateString);
  const diffHrs = Math.round((now - date) / (1000 * 60 * 60));
  if (diffHrs < 1) return "Just now";
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffHrs < 48) return "Yesterday";
  return `${Math.floor(diffHrs / 24)}d ago`;
};

const calculateDaysLeft = (dueDate) => {
  if (!dueDate) return null;
  const diff = new Date(dueDate) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export default function ProjectFollowUp() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      projectName: "Marketing Website Revamp",
      clientName: "ABC Pvt Ltd",
      quotationCode: "QT-2026-014",
      poPdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
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
      quotationCode: "QT-2026-021",
      poPdfUrl: "https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf",
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
      quotationCode: null,
      poPdfUrl: null,
      status: "At Risk",
      progress: 58,
      nextMilestone: "UAT Phase",
      milestoneDueDate: "2026-01-09",
      teamMembers: 8,
      criticalIssues: 5,
      lastUpdated: "2026-01-06T09:15:00",
    },
  ]);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const openEditModal = (p) => {
    setEditingProject({ ...p });
    setEditModalOpen(true);
  };

  const openPdfInNewTab = (url) => {
    if (!url) {
      toast.warn("PO not uploaded yet");
      return;
    }
    // Open in new tab with restricted viewer (no download, no print)
    window.open(
      url + "#toolbar=0&navpanes=0&scrollbar=0&view=FitH",
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setProjects((prev) =>
      prev.map((p) =>
        p.id === editingProject.id
          ? { ...editingProject, lastUpdated: new Date().toISOString() }
          : p
      )
    );
    toast.success("Project updated successfully");
    setEditModalOpen(false);
  };

  return (
    <div className="followup-page">
      <ToastContainer autoClose={1500} newestOnTop />

      {/* HEADER */}
      <div className="followup-header">
        <h2>Project Follow Up</h2>
        <p>Track execution, risk & purchase orders</p>
      </div>

      {/* TABLE */}
      <div className="followup-table-card">
        <table className="followup-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Client</th>
              <th>Quotation</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Next Milestone</th>
              <th>Team</th>
              <th>Issues</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => {
              const daysLeft = calculateDaysLeft(p.milestoneDueDate);
              const isUrgent = daysLeft !== null && daysLeft <= 3 && p.status !== "Completed";

              return (
                <tr key={p.id}>
                  <td>
                    <strong>{p.projectName}</strong>
                    <div className="code">PRJ-2026-00{p.id}</div>
                  </td>

                  <td>{p.clientName}</td>

                  <td>
                    {p.quotationCode ? (
                      <span className="quotation-code">{p.quotationCode}</span>
                    ) : (
                      <span className="quotation-missing">—</span>
                    )}
                  </td>

                  <td>
                    <span className={`status-badge ${p.status.toLowerCase().replace(" ", "-")}`}>
                      {p.status === "Completed" && <FiCheckCircle />}
                      {p.status === "At Risk" && <FiAlertTriangle />}
                      {p.status}
                    </span>
                  </td>

                  <td>
                    <div className="progress-wrap">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${p.progress}%` }} />
                      </div>
                      <span>{p.progress}%</span>
                    </div>
                  </td>

                  <td>
                    <div>{p.nextMilestone}</div>
                    <div className={isUrgent ? "urgent" : "days-left"}>
                      {daysLeft !== null ? `${daysLeft} days left` : "—"}
                    </div>
                  </td>

                  <td className="center">
                    <FiUsers /> {p.teamMembers}
                  </td>

                  <td className={`center ${p.criticalIssues > 0 ? "critical" : ""}`}>
                    {p.criticalIssues}
                  </td>

                  <td className="center">
                    <FiClock /> {formatRelativeTime(p.lastUpdated)}
                  </td>

                  <td className="actions">
                    <button
                      className="icon-btn view-po"
                      onClick={() => openPdfInNewTab(p.poPdfUrl)}
                      title="View PO"
                    >
                      <FiEye />
                    </button>
                    <button
                      className="icon-btn edit"
                      onClick={() => openEditModal(p)}
                      title="Edit"
                    >
                      <FiEdit2 />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {editModalOpen && editingProject && (
        <div className="modal-overlay" onClick={() => setEditModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Project Progress</h3>
            <div className="project-info">
              <strong>{editingProject.projectName}</strong>
              <div>Client: {editingProject.clientName}</div>
              <div>Quotation: {editingProject.quotationCode || "—"}</div>
              <div>Status: {editingProject.status}</div>
              <div>Progress: {editingProject.progress}%</div>
              <div>Team Members: {editingProject.teamMembers}</div>
            </div>

            <form onSubmit={handleUpdate}>
              <label>Next Milestone</label>
              <input
                type="text"
                value={editingProject.nextMilestone}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, nextMilestone: e.target.value })
                }
                required
              />

              <label>Critical Issues</label>
              <input
                type="number"
                min="0"
                value={editingProject.criticalIssues}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, criticalIssues: +e.target.value })
                }
              />

              <div className="modal-actions">
                <button type="button" onClick={() => setEditModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}