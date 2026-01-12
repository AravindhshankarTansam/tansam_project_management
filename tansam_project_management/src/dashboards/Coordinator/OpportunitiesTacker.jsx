import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";
import "./CSS/OpportunitiesTracker.css";
// import Sidebar from "../Sidebar/Sidebar.jsx";
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

export default function OpportunitiesTracker() {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [opportunities, setOpportunities] = useState([]);
  const [trackerList, setTrackerList] = useState([]);

  const [form, setForm] = useState({
    id: null,
    opportunity_id: "",
    opportunity_name: "",
    customer_name: "",
    stage: "NEW",
    next_followup_date: "",
    next_action: "",
    remarks: "",
  });

  // LOAD DATA
  const loadAll = () => {
    setLoading(true);

    const storedOpps =
      JSON.parse(localStorage.getItem("opportunities")) || [
        { opportunity_id: "new", opportunity_name: "New", customer_name: "New Customer" },
        { opportunity_id: "old", opportunity_name: "Old", customer_name: "Old Customer" },
      ];

    const storedTrackers = JSON.parse(localStorage.getItem("trackerList")) || [];

    setOpportunities(storedOpps);
    setTrackerList(storedTrackers);

    localStorage.setItem("opportunities", JSON.stringify(storedOpps));
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  // FORM HANDLERS
  const resetForm = () => {
    setForm({
      id: null,
      opportunity_id: "",
      opportunity_name: "",
      customer_name: "",
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
      opportunity_name: row.opportunity_name || "",
      customer_name: row.customer_name || "",
      stage: row.stage,
      next_followup_date: row.next_followup_date || "",
      next_action: row.next_action || "",
      remarks: row.remarks || "",
    });
    setShowModal(true);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // SAVE DATA
  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedOpp = opportunities.find(
      (o) => o.opportunity_id === form.opportunity_id
    );

    let updatedList = [];

    if (isEdit) {
      updatedList = trackerList.map((t) =>
        t.id === form.id ? { ...form, ...selectedOpp } : t
      );
    } else {
      const newEntry = {
        ...form,
        id: Date.now(),
        opportunity_name: selectedOpp?.opportunity_name || form.opportunity_name,
        customer_name: selectedOpp?.customer_name || form.customer_name,
      };
      updatedList = [...trackerList, newEntry];
    }

    localStorage.setItem("trackerList", JSON.stringify(updatedList));
    setTrackerList(updatedList);

    setShowModal(false);
    resetForm();
  };

  // REMOVE TRACKER
  const handleRemove = (id) => {
    const updatedList = trackerList.filter((t) => t.id !== id);
    setTrackerList(updatedList);
    localStorage.setItem("trackerList", JSON.stringify(updatedList));
  };

  return (
    <div className="tracker-container">
      {/* Sidebar */}
      {/* <Sidebar className="sidebar" /> */}

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
                  <th>Stage</th>
                  <th>Next Follow-up</th>
                  <th>Edit</th>
                  <th>Remove</th>
                </tr>
              </thead>

              <tbody>
                {trackerList.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="empty">
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
                          Remove
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
                  <>
                    <div className="form-group">
                      <label>Opportunity</label>
                      <select
                        name="opportunity_id"
                        value={form.opportunity_id}
                        onChange={(e) => {
                          const selectedOpp = opportunities.find(
                            (o) => o.opportunity_id === e.target.value
                          );
                          setForm({
                            ...form,
                            opportunity_id: e.target.value,
                            opportunity_name: selectedOpp?.opportunity_name || "",
                            customer_name: selectedOpp?.customer_name || "",
                          });
                        }}
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

                    <div className="form-group">
                      <label>Client Name</label>
                      <select
                        name="customer_name"
                        value={form.customer_name}
                        onChange={(e) =>
                          setForm({ ...form, customer_name: e.target.value })
                        }
                        required
                      >
                        <option value="">Select Client</option>
                        {opportunities.map((o) => (
                          <option key={o.opportunity_id} value={o.customer_name}>
                            {o.customer_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
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
