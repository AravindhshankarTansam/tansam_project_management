import { useEffect, useState } from "react";
import RichTextEditor from "../../components/RichTextEditor";
import {
  fetchOpportunities,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
} from "../../services/coordinator/coordinator.opportunity.api";
import {
  fetchOpportunityTrackers,
  createOpportunityTracker,
  updateOpportunityTracker,
} from "../../services/coordinator/coordinator.tracker.api";
import { fetchUsers } from "../../services/admin/admin.roles.api.js";
import { FiEdit, FiTrash2, FiX } from "react-icons/fi";
import "./CSS/Opportunities.css";
import ProgressTracker from "./Tracker.jsx";

const STAGES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL_SENT",
  "NEGOTIATION",
  "WON",
  "LOST",
];

export default function Opportunities() {
  const [showModal, setShowModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [trackers, setTrackers] = useState([]);
  const [isPreview, setIsPreview] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [originalAssignedTo, setOriginalAssignedTo] = useState(null);

  //  Toast state
    const [toast, setToast] = useState({
      open: false,
      type: "success",
      message: "",
      position: "top",
    });

    //  Toast helper
    const showToast = ({
      message,
      type = "success",
      position = "top",
      duration = 3000,
    }) => {
      setToast({ open: true, message, type, position });

      setTimeout(() => {
        setToast((t) => ({ ...t, open: false }));
      }, duration);
    };

  /* ================= FILTER STATE ================= */
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    source: "",
  });

  /* ================= FORM STATE (Add/Edit) ================= */
  const [form, setForm] = useState({
    opportunity_id: null,
    opportunityName: "",
    customerName: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    leadSource: "",
    leadDescription: "",
    status: "NEW",          // ← Opportunity status (NEW/EXISTING)
    stage: "NEW",           // ← Tracker stage (full pipeline)
    assignedTo: "",
    next_followup_date: "",
    next_action: "",
  });

  /* ================= LOAD ================= */
  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [oppData, trackerData, usersData] = await Promise.all([
      fetchOpportunities(),
      fetchOpportunityTrackers(),
      fetchUsers(),                // 👈 ADD
    ]);

      setUsers(usersData || []);
      setOpportunities(oppData || []);
      setTrackers(trackerData || []);
    } catch (err) {
      alert(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const getTrackerForOpportunity = (oppId) =>
    trackers.find((t) => t.opportunity_id === oppId) || {};

  const getUserById = (id) =>
  users.find((u) => String(u.id) === String(id));

  const assignableUsers = users.filter(
    (u) => u.role !== "COORDINATOR"
  );

  /* ================= HANDLERS ================= */
  const resetForm = () => {
    setForm({
      opportunity_id: null,
      opportunityName: "",
      customerName: "",
      contactPerson: "",
      contactEmail: "",
      contactPhone: "",
      leadSource: "",
      leadDescription: "",
      status: "NEW",          // ← Opportunity status
      stage: "NEW",           // ← Tracker stage
      assignedTo: "",
      next_followup_date: "",
      next_action: "",
    });
  };

  const openAddModal = () => {
    setIsEdit(false);
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (row) => {
    const tracker = getTrackerForOpportunity(row.opportunity_id);

    setIsEdit(true);
    setOriginalAssignedTo(row.assigned_to);
    setForm({
      opportunity_id: row.opportunity_id,
      opportunityName: row.opportunity_name,
      customerName: row.customer_name,
      contactPerson: row.contact_person || "",
      contactEmail: row.contact_email || "",
      contactPhone: row.contact_phone || "",
      leadSource: row.lead_source || "",
      leadDescription: row.lead_description || "",
      status: row.lead_status || "NEW",                    // ← Opportunity status
      stage: tracker.stage || row.lead_status || "NEW",    // ← Tracker stage (prefer tracker if exists)
      assignedTo: row.assigned_to || "",
      next_followup_date: tracker.next_followup_date?.slice(0, 10) || "",
      next_action: tracker.next_action || "",
    });
    setShowModal(true);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);

    const isReassign =
      isEdit &&
      originalAssignedTo &&
      String(originalAssignedTo) !== String(form.assignedTo);

    // 🔔 PRE-TOAST
    if (!isEdit) {
      showToast({
        message: "Creating opportunity & sending mail...",
        type: "info",
        position: "top",
      });
    } else if (isReassign) {
      showToast({
        message: "Reassigning opportunity & sending mail...",
        type: "info",
        position: "top",
      });
    }

    let opportunityId;

    // 🔹 OPPORTUNITY PAYLOAD
    const opportunityPayload = {
      ...form,
      leadStatus: form.status,
    };

    delete opportunityPayload.status;
    delete opportunityPayload.next_followup_date;
    delete opportunityPayload.next_action;
    delete opportunityPayload.stage;

    // 🔹 CREATE / UPDATE OPPORTUNITY
    if (isEdit) {
      await updateOpportunity(form.opportunity_id, opportunityPayload);
      opportunityId = form.opportunity_id;
    } else {
      const created = await createOpportunity(opportunityPayload);
      opportunityId = created.opportunity_id;
    }

    // 🔹 TRACKER
    const tracker = getTrackerForOpportunity(opportunityId);
    const trackerPayload = {
      ...tracker,
      opportunity_id: opportunityId,
      stage: form.stage,
      next_followup_date: form.next_followup_date || null,
      next_action: form.next_action || "",
      remarks: tracker.remarks || "",
    };

    if (tracker.id) {
      await updateOpportunityTracker(tracker.id, trackerPayload);
    } else {
      await createOpportunityTracker(trackerPayload);
    }

    // 🔔 SUCCESS TOAST
    if (!isEdit) {
      showToast({
        message: "Opportunity created & mail sent successfully",
        type: "success",
        position: "top",
      });
    } else if (isReassign) {
      showToast({
        message: "Opportunity reassigned & mail sent successfully",
        type: "success",
        position: "top",
      });
    } else {
      showToast({
        message: "Opportunity updated successfully",
        type: "success",
        position: "top",
      });
    }

    setTimeout(() => {
      setShowModal(false);
      setIsPreview(false);
      resetForm();
      loadAll();
    }, 800);
  } catch (err) {
    console.error(err);
    showToast({
      message: "Operation failed. Please try again.",
      type: "error",
      position: "top",
    });
  } finally {
    setLoading(false);
  }
};

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this opportunity?")) return;
    try {
      await deleteOpportunity(id);
      loadAll();
    } catch (err) {
      alert(err.message);
    }
  };



  /* ================= FILTER LOGIC ================= */
  const filteredOpportunities = opportunities.filter((item) => {
    const searchMatch =
      !filters.search ||
      item.opportunity_name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      item.customer_name?.toLowerCase().includes(filters.search.toLowerCase());

    const statusMatch = !filters.status || item.lead_status === filters.status;
    const sourceMatch = !filters.source || item.lead_source === filters.source;

    return searchMatch && statusMatch && sourceMatch;
  });

  /* ================= UI ================= */
  return (
    <div className="opportunity-wrapper">
      <h2 className="opportunity-title">New Opportunities</h2>

      <div className="opportunity-actions">
        <button onClick={openAddModal}>+ Add Opportunity</button>
      </div>

      {/* FILTER BAR */}
      <div className="opportunity-filters">
        <input
          placeholder="Search Opportunity / Client"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="NEW">NEW</option>
          <option value="EXISTING">EXISTING</option>
        </select>

        <select
          value={filters.source}
          onChange={(e) => setFilters({ ...filters, source: e.target.value })}
        >
          <option value="">All Sources</option>
          <option value="WEBSITE">Website</option>
          <option value="REFERRAL">Referral</option>
          <option value="CALL">Call</option>
          <option value="EMAIL">Email</option>
        </select>

        <button
          className="reset-btn"
          onClick={() => setFilters({ search: "", status: "", source: "" })}
        >
          Reset
        </button>
      </div>

      {/* MAIN TABLE */}
      <div className="opportunity-table-wrapper">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="opportunity-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Opportunity</th>
                <th>Client</th>
                <th>Source</th>
                <th>Assigned To</th>
                <th>Stage</th>
                <th>Status</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredOpportunities.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty">
                    No opportunities found
                  </td>
                </tr>
              ) : (
                filteredOpportunities.map((item, index) => {
                  const tracker = getTrackerForOpportunity(item.opportunity_id);
                  return (
                    <tr key={item.opportunity_id}>
                      <td>{index + 1}</td>
                      <td>{item.opportunity_name}</td>
                      <td>{item.customer_name}</td>
                      <td>{item.lead_source || "-"}</td>
                      <td>
                        {getUserById(item.assigned_to)
                          ? getUserById(item.assigned_to).name ||
                            getUserById(item.assigned_to).username
                          : "-"}
                      </td>
                      <td>
                        <span className={`status ${tracker.stage?.toLowerCase() || "new"}`}>
                          {tracker.stage || "NEW"}
                        </span>
                      </td>
                      <td>
                        <span className={`status ${item.lead_status?.toLowerCase() || "new"}`}>
                          {item.lead_status || "NEW"}
                        </span>
                      </td>
                      <td className="actions">
                        <button
                          className="table-action view-action"
                          onClick={() => setViewData(item)}
                        >
                          View
                        </button>
                        <button
                          className="icon-btn edit"
                          onClick={() => openEditModal(item)}
                        >
                          <FiEdit />
                        </button>
                        <button
                          className="icon-btn delete"
                          onClick={() => handleDelete(item.opportunity_id)}
                        >
                          <FiTrash2 />
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

      {/* ADD / EDIT MODAL - Now with both Stage and Status */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>{isEdit ? "Edit Opportunity" : "Add Opportunity"}</h3>

            <form onSubmit={handleSubmit} className="opportunity-form">
              <div className="form-group">
                <label>Opportunity Name</label>
                <input
                  name="opportunityName"
                  value={form.opportunityName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Client Name</label>
                <input
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Contact Person</label>
                <input
                  name="contactPerson"
                  value={form.contactPerson}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Assigned To</label>
                <select
                  name="assignedTo"
                  value={form.assignedTo}
                  onChange={handleChange}
                >
                  <option value="">Select User</option>
                 {assignableUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name || u.username}
                  </option>
                ))}
                </select>
              </div>

              <div className="form-group">
                <label>Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={form.contactEmail}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Contact Phone</label>
                <input
                  name="contactPhone"
                  value={form.contactPhone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Source</label>
                <select
                  name="leadSource"
                  value={form.leadSource}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="WEBSITE">Website</option>
                  <option value="REFERRAL">Referral</option>
                  <option value="CALL">Call</option>
                  <option value="EMAIL">Email</option>
                </select>
              </div>

              {/* Status (NEW / EXISTING) */}
              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="NEW">NEW</option>
                  <option value="EXISTING">EXISTING</option>
                </select>
              </div>

              {/* Stage (full pipeline) */}
              <div className="form-group">
                <label>Stage</label>
                <select
                  name="stage"
                  value={form.stage}
                  onChange={handleChange}
                >
                  {STAGES.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </div>

              {/* Next Follow-up Date */}
              <div className="form-group">
                <label>Next Follow-up Date</label>
                <input
                  type="date"
                  name="next_followup_date"
                  value={form.next_followup_date}
                  onChange={handleChange}
                />
              </div>

              {/* Next Action */}
              <div className="form-group full-width">
                <label>Next Action</label>
                <textarea
                  name="next_action"
                  value={form.next_action}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="form-group full-width">
                <label>Description</label>
                <div className="modal-description-box">
                  {!isPreview ? (
                    <RichTextEditor
                      value={form.leadDescription}
                      onChange={(v) =>
                        setForm({ ...form, leadDescription: v })
                      }
                    />
                  ) : (
                    <div
                      className="preview-content"
                      dangerouslySetInnerHTML={{
                        __html:
                          form.leadDescription ||
                          "<p>No description</p>",
                      }}
                    />
                  )}
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="preview-btn"
                  onClick={() => setIsPreview(!isPreview)}
                >
                  {isPreview ? "Back to Edit" : "Preview"}
                </button>
                <button type="submit">Save
                  {loading && (
                    <div className="global-loader">
                      <div className="spinner"></div>
                      <p>Processing request & sending mail…</p>
                    </div>
                  )}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    resetForm();
                    setIsPreview(false);
                    setShowModal(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {viewData && (
        <div className="modal-overlay" onClick={() => setViewData(null)}>
          <div className="view-modal" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="view-header">
              <div>
                <h3 className="view-title">{viewData.opportunity_name}</h3>
                <p className="view-subtitle">
                  <strong>Client Name:</strong> {viewData.customer_name || "—"}
                </p>
              </div>
              <div className="view-header-right">
                <span className={`status-badge ${viewData.lead_status?.toLowerCase()}`}>
                  {viewData.lead_status}
                </span>
                <button className="close-btn" onClick={() => setViewData(null)}>
                  <FiX size={20} />
                </button>
              </div>
            </div>

            {/* Contact Details - 3x3 Grid */}
            <div className="contact-grid">
              <div className="grid-item">
                <label>Contact Person</label>
                <p>{viewData.contact_person || "—"}</p>
              </div>
              <div className="grid-item">
                <label>Assigned To</label>
                <p>
                  {getUserById(viewData.assigned_to)
                    ? `${getUserById(viewData.assigned_to).name || getUserById(viewData.assigned_to).username}
                      (${getUserById(viewData.assigned_to).role})`
                    : "—"}
                </p>
              </div>
              <div className="grid-item">
                <label>Email</label>
                <p>{viewData.contact_email || "—"}</p>
              </div>
              <div className="grid-item">
                <label>Phone</label>
                <p>{viewData.contact_phone || "—"}</p>
              </div>
              <div className="grid-item">
                <label>Source</label>
                <p>{viewData.lead_source || "—"}</p>
              </div>
              <div className="grid-item empty"></div>
            </div>

            {/* Tracker Information */}
            <div className="tracker-section">
              <h4>Tracker Information</h4>
              <div className="tracker-info">
                <div className="info-item full-width">
                  <label>Stage</label>
                  <div className="stage-progress-wrapper">
                    <span
                      className={`status ${(getTrackerForOpportunity(viewData.opportunity_id).stage || "NEW").toLowerCase()}`}
                    >
                      {getTrackerForOpportunity(viewData.opportunity_id).stage || "NEW"}
                    </span>
                    <ProgressTracker
                      currentStage={getTrackerForOpportunity(viewData.opportunity_id).stage || "NEW"}
                    />
                  </div>
                </div>

                <div className="info-item">
                  <label>Next Follow-up Date</label>
                  <p>
                    {getTrackerForOpportunity(viewData.opportunity_id).next_followup_date
                      ? getTrackerForOpportunity(viewData.opportunity_id).next_followup_date.slice(0, 10)
                      : "—"}
                  </p>
                </div>

                <div className="info-item">
                  <label>Next Action</label>
                  <p>
                    {getTrackerForOpportunity(viewData.opportunity_id).next_action || "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="description-section">
              <label>Description</label>
              <div
                className="description-content"
                dangerouslySetInnerHTML={{
                  __html: viewData.lead_description || "<p>No description available</p>",
                }}
              />
            </div>
          </div>
        </div>
      )}
      {toast.open && (
          <div className={`toast toast-${toast.type} toast-${toast.position}`}>
            {toast.message}
          </div>
        )}
    </div>
  );
}