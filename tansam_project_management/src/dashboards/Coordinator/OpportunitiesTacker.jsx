import { useEffect, useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import "./CSS/OpportunitiesTracker.css";
import ProgressTracker from "./Tracker.jsx";

import { fetchOpportunities } from "../../services/coordinator/coordinator.opportunity.api";
import {
  fetchOpportunityTrackers,
  createOpportunityTracker,
  updateOpportunityTracker,
  deleteOpportunityTracker,
} from "../../services/coordinator/coordinator.tracker.api";

const STAGES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL_SENT",
  "NEGOTIATION",
  "WON",
  "LOST",
];

export default function OpportunitiesTracker() {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [opportunities, setOpportunities] = useState([]);
  const [trackerList, setTrackerList] = useState([]);

  const [form, setForm] = useState({
    id: null,
    opportunity_id: "",
    stage: "NEW",
    next_followup_date: "",
    next_action: "",
    remarks: "",
  });

  /* ================= LOAD DATA ================= */

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

      setOpportunities(oppData);
      setTrackerList(trackerData);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FORM ================= */

  const resetForm = () => {
    setForm({
      id: null,
      opportunity_id: "",
      stage: "NEW",
      next_followup_date: "",
      next_action: "",
      remarks: "",
    });
  };

  const openAddModal = () => {
    resetForm();
    setIsEdit(false);
    setShowModal(true);
  };

  const openEditModal = (row) => {
    setIsEdit(true);
    setForm({
      id: row.id,
      opportunity_id: row.opportunity_id,
      stage: row.stage,
      next_followup_date: row.next_followup_date || "",
      next_action: row.next_action || "",
      remarks: row.remarks || "",
    });
    setShowModal(true);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ================= SAVE ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateOpportunityTracker(form.id, form);
      } else {
        await createOpportunityTracker(form);
      }

      setShowModal(false);
      resetForm();
      loadAll();
    } catch (err) {
      alert(err.message);
    }
  };

  /* ================= DELETE ================= */

  const handleRemove = async (id) => {
    if (!window.confirm("Remove this tracker?")) return;
    try {
      await deleteOpportunityTracker(id);
      loadAll();
    } catch (err) {
      alert(err.message);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="tracker-container">
      <div className="tracker-wrapper">
        <h2 className="tracker-title">Opportunities Tracker</h2>

        <div className="tracker-actions">
          <button onClick={openAddModal}>+ Add Tracker</button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="table-wrapper">
            <table className="tracker-table">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Opportunity</th>
                  <th>Client Name</th>
                  <th>Assigned To</th>
                  <th>Stage</th>
                  <th>Next Follow-up</th>
                  <th>Edit</th>
                  <th>Remove</th>
                </tr>
              </thead>

              <tbody>
                {trackerList.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="empty">
                      No tracker records found
                    </td>
                  </tr>
                ) : (
                  trackerList.map((row, index) => (
                    <tr key={row.id}>
                      <td>{index + 1}</td>
                      <td>{row.opportunity_name}</td>
                      <td>{row.customer_name}</td>
                      <td>{row.assigned_to || "-"}</td>
                      <td>
                        <span className={`stage ${row.stage.toLowerCase()}`}>
                          {row.stage}
                        </span>
                        <ProgressTracker currentStage={row.stage} />
                      </td>
                      <td>{row.next_followup_date || "-"}</td>
                      <td>
                        <button
                          className="icon-btn"
                          onClick={() => openEditModal(row)}
                        >
                          <FiEdit />
                        </button>
                      </td>
                      <td>
                        <button
                          className="icon-btn remove-btn"
                          onClick={() => handleRemove(row.id)}
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* MODAL */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-card">
              <h3>{isEdit ? "Edit Tracker" : "Add Tracker"}</h3>

              <form onSubmit={handleSubmit} className="tracker-form">
                {!isEdit && (
                  <div className="form-group">
                    <label>Opportunity</label>
                    <select
                      name="opportunity_id"
                      value={form.opportunity_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Opportunity</option>
                      {opportunities.map((o) => (
                        <option
                          key={o.opportunity_id}
                          value={o.opportunity_id}
                        >
                          {o.opportunity_name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="form-group">
                  <label>Stage</label>
                  <select
                    name="stage"
                    value={form.stage}
                    onChange={handleChange}
                  >
                    {STAGES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Next Follow-up Date</label>
                  <input
                    type="date"
                    name="next_followup_date"
                    value={form.next_followup_date}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group full">
                  <label>Next Action</label>
                  <textarea
                    name="next_action"
                    value={form.next_action}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group full">
                  <label>Remarks</label>
                  <textarea
                    name="remarks"
                    value={form.remarks}
                    onChange={handleChange}
                  />
                </div>

                <div className="modal-actions">
                  <button type="submit">Save</button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      resetForm();
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
      </div>
    </div>
  );
}
