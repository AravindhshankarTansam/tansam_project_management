import { useState, useEffect } from "react";
import {
  FiEye,
  FiEdit2,
  FiCheckCircle,
  FiAlertTriangle,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProjectFollowUp.css";

import {
  fetchProjectFollowups,
  updateProjectFollowup,
  getPOFileUrl,
} from "../../services/projectfollowup.api";
import RichTextEditor from "../../components/RichTextEditor";


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

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewingProject, setViewingProject] = useState(null);



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

  
  /* ================= VIEW ================= */
  const openViewModal = (project) => {
    setViewingProject(project);
    setViewModalOpen(true);
  };

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
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
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
      issueDescription: editingProject.issueDescription,
    });

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
                <th>Project</th>
                <th>Client</th>
                {/* <th>Quotation</th> */}
                <th>Status</th>
                <th>Progress</th>
                <th>Next Milestone</th>
                <th>Team</th>
                <th>Issues Description</th>
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
                  const hasPOFile =
                    p.poFile &&
                    typeof p.poFile === "string" &&
                    p.poFile.trim() !== "" &&
                    p.poFile !== "null";

                  return (
                    <tr
                      key={p.projectId}
                      className="clickable-row"
                      onClick={() => openViewModal(p)}
                    >
                      <td>
                        <strong>{p.projectName}</strong>
                        <div className="code">
                          {p.projectReference || `PRJ-${p.projectId}`}
                        </div>
                      </td>

                      <td>{p.clientName}</td>

                      {/* <td>{p.quotationCode || "—"}</td> */}

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

                      <td>{p.progress || 0}%</td>

                      <td>
                        <div>{p.nextMilestone || "—"}</div>
                        <div className={isUrgent ? "urgent" : "days-left"}>
                          {daysLeft !== null ? `${daysLeft} days left` : "—"}
                        </div>
                      </td>

                      <td className="center">
                        <FiUsers /> {p.teamMembers || 0}
                      </td>

                   <td className="issue-cell">
  {p.issueDescription ? (
    <div
      className="issue-preview"
      dangerouslySetInnerHTML={{
        __html: p.issueDescription,
      }}
    />
  ) : (
    <span className="no-issue">—</span>
  )}
</td>


                      <td
                        className="actions"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* View PO - always visible */}
                        <button
                          className={`icon-btn view-btn ${!hasPOFile ? "disabled-view" : ""}`}
                          onClick={() => hasPOFile && openPdfInNewTab(p.poFile)}
                          title={hasPOFile ? "View PO" : "PO not uploaded"}
                          disabled={!hasPOFile}
                        >
                          <FiEye />
                        </button>

                        {/* Edit */}
                        <button
                          className="icon-btn edit-btn"
                          onClick={() => openEditModal(p)}
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

      {/* ================= VIEW MODAL ================= */}
      {/* ================= VIEW MODAL ================= */}
      {viewModalOpen && viewingProject && (
        <div className="modal-overlay" onClick={() => setViewModalOpen(false)}>
          <div className="view-modal-card" onClick={(e) => e.stopPropagation()}>
            {/* Header with gradient accent */}
            <div className="view-modal-header">
              <h3>Project Details</h3>
              <button
                className="close-btn"
                onClick={() => setViewModalOpen(false)}
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Status Section with "Project Status :" label */}
            <div className="view-status-section">
              <div className="status-label">Project Status :</div>
              <div className="view-status-banner">
                <span
                  className={`status-badge large ${viewingProject.status?.toLowerCase().replace(" ", "-") || "unknown"}`}
                >
                  {viewingProject.status === "Completed" && <FiCheckCircle />}
                  {viewingProject.status === "At Risk" && <FiAlertTriangle />}
                  {viewingProject.status || "Unknown"}
                </span>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="view-details-grid">
              <div className="detail-item">
                <label>Project</label>
                <p>{viewingProject.projectName}</p>
              </div>

              <div className="detail-item">
                <label>Client</label>
                <p>{viewingProject.clientName}</p>
              </div>

              <div className="detail-item">
                <label>Progress</label>
                <div className="progress-container">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${viewingProject.progress || 0}%` }}
                    ></div>
                  </div>
                  <span>{viewingProject.progress || 0}%</span>
                </div>
              </div>

              <div className="detail-item">
                <label>Next Milestone</label>
                <p>{viewingProject.nextMilestone || "—"}</p>
              </div>

              <div className="detail-item">
                <label>Due Date</label>
                <p>{viewingProject.milestoneDueDate || "—"}</p>
              </div>

              <div className="detail-item full-width">
  <label>Issue Description</label>
  <div
    className="description-content"
    dangerouslySetInnerHTML={{
      __html:
        viewingProject.issueDescription ||
        "<p>No issue description available</p>",
    }}
  />
</div>

            </div>

            {/* View PO Button - Prominent green CTA */}
            {viewingProject.poFile && (
              <button
                className="view-po-btn"
                onClick={() => openPdfInNewTab(viewingProject.poFile)}
              >
                <FiEye size={18} />
                View Purchase Order
              </button>
            )}
          </div>
        </div>
      )}
      {/* ================= EDIT MODAL (UNCHANGED) ================= */}
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

              <div className="edit-progress-wrap">
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
                <span className="edit-progress-value">
                  {editingProject.progress || 0}%
                </span>
              </div>

              <label>Next Milestone</label>
              <input
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

       <label>Issue Description</label>

<div className="modal-description-box">
  <RichTextEditor
    value={editingProject.issueDescription || ""}
    onChange={(v) =>
      setEditingProject({
        ...editingProject,
        issueDescription: v,
      })
    }
  />
</div>


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
