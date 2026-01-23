import { useState, useEffect, useMemo } from "react";
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

const PROJECTS_PER_PAGE = 10;

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
  const [currentPage, setCurrentPage] = useState(1);


  // State for issue description popup
  const [issuePopupOpen, setIssuePopupOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const truncateRichText = (html, maxChars = 90) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.innerText || div.textContent || "";
    if (text.length <= maxChars) return html;
    return text.substring(0, maxChars).trim() + "...";
  };

  const hasUrgentKeyword = (html) => {
    const text = (html || "").toLowerCase();
    return /urgent|critical|blocker|high priority|stop/i.test(text);
  };

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

  // Open issue popup
  const openIssuePopup = (project) => {
    setSelectedIssue(project);
    setIssuePopupOpen(true);
  };

  const totalPages = Math.ceil(projects.length / PROJECTS_PER_PAGE);

const paginatedProjects = useMemo(() => {
  const start = (currentPage - 1) * PROJECTS_PER_PAGE;
  const end = start + PROJECTS_PER_PAGE;
  return projects.slice(start, end);
}, [projects, currentPage]);

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
                  <td colSpan="8" className="assign-empty">
                    No projects found
                  </td>
                </tr>
              ) : (
                paginatedProjects.map((p) => {
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
                        {p.issueDescription && p.issueDescription.trim() !== "" ? (
                          <div className="issue-preview-wrapper">
                            <div
                              className="issue-preview ellipsis"
                              dangerouslySetInnerHTML={{
                                __html: truncateRichText(p.issueDescription, 90),
                              }}
                            />
                            <button
                              className="issue-view-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                openIssuePopup(p);
                              }}
                              title="View full issue description"
                            >
                              <FiEye size={16} />
                            </button>

                            {hasUrgentKeyword(p.issueDescription) && (
                              <span className="issue-urgency-badge">Urgent</span>
                            )}
                          </div>
                        ) : (
                          <span className="no-issue">— No issues reported</span>
                        )}
                      </td>

                      <td
                        className="actions"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className={`icon-btn view-btn ${!hasPOFile ? "disabled-view" : ""}`}
                          onClick={() => hasPOFile && openPdfInNewTab(p.poFile)}
                          title={hasPOFile ? "View PO" : "PO not uploaded"}
                          disabled={!hasPOFile}
                        >
                          <FiEye />
                        </button>

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

{/* ================= PAGINATION ================= */}
{totalPages > 1 && (
  <div className="pagination">
    <button
      className="page-btn"
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((p) => p - 1)}
    >
      Prev
    </button>

    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <button
        key={page}
        className={`page-number ${page === currentPage ? "active" : ""}`}
        onClick={() => setCurrentPage(page)}
      >
        {page}
      </button>
    ))}

    <button
      className="page-btn"
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage((p) => p + 1)}
    >
      Next
    </button>
  </div>
)}

      {/* ================= VIEW MODAL ================= */}
      {viewModalOpen && viewingProject && (
        <div className="modal-overlay" onClick={() => setViewModalOpen(false)}>
          <div className="view-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="view-modal-header">
              <h3>Project Details</h3>
              <button
                className="close-btn"
                onClick={() => setViewModalOpen(false)}
              >
                <FiX size={20} />
              </button>
            </div>

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

      {/* ================= EDIT MODAL ================= */}
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
              <select
                value={editingProject.nextMilestone || ""}
                onChange={(e) =>
                  setEditingProject({
                    ...editingProject,
                    nextMilestone: e.target.value,
                  })
                }
              >
                <option value="">Select milestone</option>
                <option value="Design">Design</option>
                <option value="Development">Development</option>
                <option value="Testing">Testing</option>
                <option value="Release">Release</option>
                <option value="Bug Fix">Bug Fix</option>
              </select>

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

      {/* ================= ISSUE DESCRIPTION POPUP MODAL ================= */}
      {issuePopupOpen && selectedIssue && (
        <div
          className="issue-popup-overlay"
          onClick={() => setIssuePopupOpen(false)}
        >
          <div
            className="issue-popup-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="popup-header">
              <h4>Issue Description – {selectedIssue.projectName}</h4>
              <button
                className="close-popup"
                onClick={() => setIssuePopupOpen(false)}
              >
                <FiX size={22} />
              </button>
            </div>

            <div className="popup-body">
              <div
                className="full-issue-content"
                dangerouslySetInnerHTML={{
                  __html:
                    selectedIssue.issueDescription ||
                    "<p>No detailed description available</p>",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}