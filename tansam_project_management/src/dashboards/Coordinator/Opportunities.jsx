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
import { FiEdit, FiTrash2, FiX } from "react-icons/fi";
import "./CSS/Opportunities.css";

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
    leadStatus: "NEW",
    assignedTo: "",
    next_followup_date: "",      // ← NEW: for editable field
    next_action: "",             // ← NEW: for editable field
  });

  /* ================= LOAD ================= */
  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [oppData, trackerData] = await Promise.all([
        fetchOpportunities(),
        fetchOpportunityTrackers(),
      ]);
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
      leadStatus: "NEW",
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
    setForm({
      opportunity_id: row.opportunity_id,
      opportunityName: row.opportunity_name,
      customerName: row.customer_name,
      contactPerson: row.contact_person || "",
      contactEmail: row.contact_email || "",
      contactPhone: row.contact_phone || "",
      leadSource: row.lead_source || "",
      leadDescription: row.lead_description || "",
      leadStatus: row.lead_status,
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
    let opportunityId;

    // 1. Prepare opportunity payload — exclude stage (leadStatus)
    const opportunityPayload = { ...form };
    delete opportunityPayload.next_followup_date;  // belongs to tracker
    delete opportunityPayload.next_action;         // belongs to tracker
    delete opportunityPayload.leadStatus;          // ← IMPORTANT: remove stage from opportunity

    if (isEdit) {
      await updateOpportunity(form.opportunity_id, opportunityPayload);
      opportunityId = form.opportunity_id;
    } else {
      const created = await createOpportunity(opportunityPayload);
      opportunityId = created.opportunity_id; // assuming API returns new ID
    }

    // 2. Handle tracker separately (stage + next follow-up + next action)
    const tracker = getTrackerForOpportunity(opportunityId);
    const trackerPayload = {
      ...tracker,
      opportunity_id: opportunityId,
      stage: form.leadStatus,                        // ← stage goes here
      next_followup_date: form.next_followup_date || null,
      next_action: form.next_action || "",
      remarks: tracker.remarks || "", // keep existing
    };

    if (tracker.id) {
      await updateOpportunityTracker(tracker.id, trackerPayload);
    } else {
      await createOpportunityTracker(trackerPayload);
    }

    setShowModal(false);
    setIsPreview(false);
    resetForm();
    loadAll();
  } catch (err) {
    alert(err.message || "Failed to save opportunity");
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
                        <span className={`status ${tracker.stage?.toLowerCase() || "new"}`}>
                          {tracker.stage || "NEW"}
                        </span>
                      </td>
                      <td>
                        <span className={`status ${item.lead_status.toLowerCase()}`}>
                          {item.lead_status}
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

      {/* ADD / EDIT MODAL - Now with editable Next Follow-up & Next Action */}
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
                <input
                  name="assignedTo"
                  value={form.assignedTo}
                  onChange={handleChange}
                />
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

              <div className="form-group">
                <label>Stage</label>
                <select
                  name="leadStatus"
                  value={form.leadStatus}
                  onChange={handleChange}
                >
                  {STAGES.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </div>

              {/* NEW: Editable Next Follow-up Date */}
              <div className="form-group">
                <label>Next Follow-up Date</label>
                <input
                  type="date"
                  name="next_followup_date"
                  value={form.next_followup_date}
                  onChange={handleChange}
                />
              </div>

              {/* NEW: Editable Next Action */}
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
                <button type="submit">Save</button>
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

      {/* VIEW MODAL - Unchanged (read-only) */}
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
                <span className={`status-badge ${viewData.lead_status.toLowerCase()}`}>
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
                <p>{viewData.assigned_to || "—"}</p>
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

            {/* Read-only Tracker Info */}
            <div className="tracker-section">
              <h4>Tracker Information</h4>
              <div className="tracker-info">
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
    </div>
  );
}