import { useEffect, useState } from "react";
import {
  fetchOpportunities,
} from "../../services/coordinator/coordinator.opportunity.api";
// import {
//   fetchOpportunityTracker,
//   createOpportunityTracker,
//   updateOpportunityTracker,
// } from "../../services/coordinator/coordinator.tracker.api";
import { FiEdit } from "react-icons/fi";
import "./CSS/OpportunitiesTracker.css";

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
    probability: 0,
    expected_value: "",
    next_followup_date: "",
    next_action: "",
    remarks: "",
  });

  /* ================= LOAD ================= */

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [opps, tracker] = await Promise.all([
        fetchOpportunities(),
        fetchOpportunityTracker(),
      ]);
      setOpportunities(opps);
      setTrackerList(tracker);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= HANDLERS ================= */

  const resetForm = () => {
    setForm({
      id: null,
      opportunity_id: "",
      stage: "NEW",
      probability: 0,
      expected_value: "",
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
      probability: row.probability,
      expected_value: row.expected_value || "",
      next_followup_date: row.next_followup_date || "",
      next_action: row.next_action || "",
      remarks: row.remarks || "",
    });
    setShowModal(true);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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

  /* ================= UI ================= */

  return (
    <div className="tracker-wrapper">
      <h2 className="tracker-title">Opportunities Tracker</h2>

      <div className="tracker-actions">
        <button onClick={openAddModal}>+ Add Tracker</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="tracker-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Opportunity</th>
              <th>Customer</th>
              <th>Stage</th>
              <th>Probability %</th>
              <th>Expected Value</th>
              <th>Next Follow-up</th>
              <th>Actions</th>
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
                  <td>
                    <span className={`stage ${row.stage.toLowerCase()}`}>
                      {row.stage}
                    </span>
                  </td>
                  <td>{row.probability}%</td>
                  <td>{row.expected_value || "-"}</td>
                  <td>{row.next_followup_date || "-"}</td>
                  <td>
                    <button
                      className="icon-btn"
                      onClick={() => openEditModal(row)}
                    >
                      <FiEdit />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* ================= MODAL ================= */}
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
                    <option value="">Select</option>
                    {opportunities.map((o) => (
                      <option
                        key={o.opportunity_id}
                        value={o.opportunity_id}
                      >
                        {o.opportunity_name} – {o.customer_name}
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
                <label>Probability (%)</label>
                <input
                  type="number"
                  name="probability"
                  value={form.probability}
                  onChange={handleChange}
                  min="0"
                  max="100"
                />
              </div>

              <div className="form-group">
                <label>Expected Value</label>
                <input
                  name="expected_value"
                  value={form.expected_value}
                  onChange={handleChange}
                />
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
  );
}
