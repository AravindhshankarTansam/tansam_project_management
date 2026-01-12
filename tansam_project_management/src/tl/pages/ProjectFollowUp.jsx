import { useState, useEffect } from "react";
import {
  FiEye,
  FiEdit2,
  FiCheckCircle,
  FiAlertTriangle,
  FiUsers,
} from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProjectFollowUp.css";

import {
  fetchProjectFollowups,
  updateProjectFollowup,
   getPOFileUrl,
} from "../../services/projectFollowup.api";

/* ---------- HELPERS ---------- */
const calculateDaysLeft = (dueDate) => {
  if (!dueDate) return null;
  const diff = new Date(dueDate) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export default function ProjectFollowUp() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProjectFollowups();
        setProjects(data);
      } catch (err) {
        toast.error(err.message || "Failed to load follow-ups");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openEditModal = (p) => {
    setEditingProject({ ...p });
    setEditModalOpen(true);
  };

  const openPdfInNewTab = (filePath) => {
  const pdfUrl = getPOFileUrl(filePath);

  if (!pdfUrl) {
    toast.warn("PO not uploaded yet");
    return;
  }

  window.open(
    pdfUrl + "#toolbar=0&navpanes=0&scrollbar=0",
    "_blank",
    "noopener,noreferrer"
  );
};


  /* ================= UPDATE ================= */
const handleUpdate = async (e) => {
  e.preventDefault();

  try {
    await updateProjectFollowup(editingProject.projectId, {
      status: editingProject.status,
      progress: editingProject.progress,
      nextMilestone: editingProject.nextMilestone,
      milestoneDueDate: editingProject.milestoneDueDate,
      criticalIssues: editingProject.criticalIssues,
    });

    // ✅ Always refresh from backend
    const refreshed = await fetchProjectFollowups();
    setProjects(refreshed);

    toast.success("Project follow-up updated");
    setEditModalOpen(false);
  } catch (err) {
    toast.error(err.message || "Update failed");
  }
};


  return (
    <div className="followup-page">
      <ToastContainer autoClose={1500} newestOnTop />

      {/* HEADER */}
      <div className="followup-header">
        <h2>Project Follow Up</h2>
        <p>Track execution, risk & milestones</p>
      </div>

      {/* TABLE */}
      <div className="followup-table-card">
        {loading ? (
          <div className="assign-loading">Loading projects...</div>
        ) : (
          <table className="followup-table">
            <thead>
              <tr>
                <th>Project name</th>
                <th>Client</th>
                <th>Quotation</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Next Milestone</th>
                <th>Team</th>
                <th>Issues</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {projects.length === 0 ? (
                <tr>
                  <td colSpan="9" className="assign-empty">
                    No projects found
                  </td>
                </tr>
              ) : (
                projects.map((p) => {
                  const daysLeft = calculateDaysLeft(p.milestoneDueDate);
                  const isUrgent =
                    daysLeft !== null &&
                    daysLeft <= 3 &&
                    p.status !== "Completed";

                  return (
                    <tr key={p.projectId}>
                      <td>
                        <strong>{p.projectName}</strong>
                        <div className="code">PRJ-{p.projectId}</div>
                      </td>

                      <td>{p.clientName}</td>

                      <td>
                        {p.quotationCode ? (
                          <span className="quotation-code">
                            {p.quotationCode}
                          </span>
                        ) : (
                          <span className="quotation-missing">—</span>
                        )}
                      </td>

                      <td>
                        <span
                          className={`status-badge ${p.status
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {p.status === "Completed" && <FiCheckCircle />}
                          {p.status === "At Risk" && <FiAlertTriangle />}
                          {p.status}
                        </span>
                      </td>

                      <td>
                        <div className="progress-wrap">
                          <div className="progress-bar">
                            <div
                              className="progress-fill"
                              style={{ width: `${p.progress || 0}%` }}
                            />
                          </div>
                          <span>{p.progress || 0}%</span>
                        </div>
                      </td>

                      <td>
                        <div>{p.nextMilestone || "—"}</div>
                        <div className={isUrgent ? "urgent" : "days-left"}>
                          {daysLeft !== null
                            ? `${daysLeft} days left`
                            : "—"}
                        </div>
                      </td>

                      <td className="center">
                        <FiUsers /> {p.teamMembers || 0}
                      </td>

                      <td
                        className={`center ${
                          p.criticalIssues > 0 ? "critical" : ""
                        }`}
                      >
                        {p.criticalIssues || 0}
                      </td>

                      <td className="actions">
                        <button
                          className="icon-btn view-po"
                          onClick={() => openPdfInNewTab(p.poFile)}
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
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* EDIT MODAL */}
      {editModalOpen && editingProject && (
        <div className="modal-overlay" onClick={() => setEditModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Project Follow-Up</h3>

            <form onSubmit={handleUpdate}>
              <label>Status</label>
              <select
                value={editingProject.status}
                onChange={(e) =>
                  setEditingProject({
                    ...editingProject,
                    status: e.target.value,
                  })
                }
              >
                <option>Planned</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>At Risk</option>
                <option>On Hold</option>
              </select>

              <label>Progress (%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={editingProject.progress || 0}
                onChange={(e) =>
                  setEditingProject({
                    ...editingProject,
                    progress: Number(e.target.value),
                  })
                }
              />
              <div className="progress-value">
                {editingProject.progress || 0}%
              </div>

              <label>Next Milestone</label>
              <input
                type="text"
                value={editingProject.nextMilestone || ""}
                onChange={(e) =>
                  setEditingProject({
                    ...editingProject,
                    nextMilestone: e.target.value,
                  })
                }
              />

              <label>Milestone Due Date</label>
              <input
                type="date"
                value={editingProject.milestoneDueDate || ""}
                onChange={(e) =>
                  setEditingProject({
                    ...editingProject,
                    milestoneDueDate: e.target.value,
                  })
                }
              />

              <label>Critical Issues</label>
              <input
                type="number"
                min="0"
                value={editingProject.criticalIssues || 0}
                onChange={(e) =>
                  setEditingProject({
                    ...editingProject,
                    criticalIssues: Number(e.target.value),
                  })
                }
              />

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                >
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
