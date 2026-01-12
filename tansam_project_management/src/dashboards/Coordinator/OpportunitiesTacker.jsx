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

const ITEMS_PER_PAGE = 10; // You can change this

export default function OpportunitiesTracker() {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [opportunities, setOpportunities] = useState([]);
  const [trackerList, setTrackerList] = useState([]);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = trackerList.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = trackerList.slice(startIndex, endIndex);

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
      setCurrentPage(1); // Reset to first page after reload
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

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

  const [form, setForm] = useState({
    id: null,
    opportunity_id: "",
    stage: "NEW",
    next_followup_date: "",
    next_action: "",
    remarks: "",
  });

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
      next_followup_date: row.next_followup_date
        ? row.next_followup_date.slice(0, 10)
        : "",
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

  const handleRemove = async (id) => {
    if (!window.confirm("Remove this tracker?")) return;
    try {
      await deleteOpportunityTracker(id);
      loadAll();
    } catch (err) {
      alert(err.message);
    }
  };

  // Pagination handlers
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToPrev = () => goToPage(currentPage - 1);
  const goToNext = () => goToPage(currentPage + 1);

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
          <>
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
                    <th>Next Action</th>
                    <th>Remarks</th>
                    <th>Edit</th>
                    <th>Remove</th>
                  </tr>
                </thead>

                <tbody>
                  {currentItems.length === 0 && totalItems === 0 ? (
                    <tr>
                      <td colSpan="10" className="empty">
                        No tracker records found
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((row, index) => (
                      <tr key={row.id}>
                        <td>{startIndex + index + 1}</td>
                        <td>{row.opportunity_name}</td>
                        <td>{row.customer_name}</td>
                        <td>{row.assigned_to || "-"}</td>

                        <td>
                          <span className={`stage ${row.stage.toLowerCase()}`}>
                            {row.stage}
                          </span>
                          <ProgressTracker currentStage={row.stage} />
                        </td>

                        <td>
                          {row.next_followup_date
                            ? row.next_followup_date.slice(0, 10)
                            : "-"}
                        </td>

                        <td className="text-cell">
                          {row.next_action || "-"}
                        </td>

                        <td className="text-cell">
                          {row.remarks || "-"}
                        </td>

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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="page-btn"
                  onClick={goToPrev}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`page-btn ${currentPage === page ? "active" : ""}`}
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  className="page-btn"
                  onClick={goToNext}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* Modal remains unchanged */}
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
                        <option key={o.opportunity_id} value={o.opportunity_id}>
                          {o.opportunity_name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="form-group">
                  <label>Stage</label>
                  <select name="stage" value={form.stage} onChange={handleChange}>
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