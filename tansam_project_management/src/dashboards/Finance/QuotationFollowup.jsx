import { useState } from "react";
import "../../layouts/CSS/finance.css";
import { useEffect } from "react";

import {
  getFollowups,
  addFollowup,
  updateFollowup,
  deleteFollowup,
} from "../../services/quotation/quotationFollowup.api";


export default function QuotationFollowup() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [activePhase, setActivePhase] = useState("followup");

const [newFollowup, setNewFollowup] = useState({
  project_name: "",
  clientResponse: "",
  lastFollowup: "",
  revisedCost: "",
  nextFollowup: "",
  remarks: "",
  status: "",
  poReceived: "No",
  paymentPhase: "Initial",
  paymentReceived: "No",
  paymentAmount: "",
  reason: "",
});
useEffect(() => {
  loadFollowups();
}, []);

const loadFollowups = async () => {
  try {
    const res = await getFollowups();
    setData(res);
  } catch (err) {
    console.error(err);
  }
};

  // Delete a row
 const handleDelete = async (id) => {
  if (!window.confirm("Delete this follow-up?")) return;

  try {
    await deleteFollowup(id);
    await loadFollowups();
  } catch (err) {
    console.error("Delete failed:", err);
  }
};

  // Edit a row
  const handleEdit = followup => {
    setEditId(followup.id);
    setNewFollowup({ ...followup });
    setShowModal(true);
  };

  // Save (Add or Update)
const handleSave = async () => {
  try {
    if (editId) {
      await updateFollowup(editId, newFollowup);
    } else {
      await addFollowup(newFollowup);
    }

    await loadFollowups(); // reload from DB
    setShowModal(false);
    setEditId(null);

    setNewFollowup({
      project_name: "",
      clientResponse: "",
      lastFollowup: "",
      revisedCost: "",
      nextFollowup: "",
      remarks: "",
      status: "",
      poReceived: "No",
      paymentPhase: "Initial",
      paymentReceived: "No",
      paymentAmount: "",
      reason: "",
    });
  } catch (err) {
    console.error("Save failed:", err);
    alert("Failed to save follow-up");
  }
};


  // Pagination logic
  const totalPages = Math.ceil(data.length / pageSize);
  const paginated = data.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="finance-container">
      {/* Header */}
      <div className="table-header">
        <h2>Quotation Follow-up</h2>
        <button className="btn-add-quotation" onClick={() => setShowModal(true)}>
          + Add Quotation follow-up
        </button>
      </div>
  <div style={{ position: "relative" }}>
<div className="page-size-ui">
  <span>Show</span>

  <select
    value={pageSize}
    onChange={(e) => {
      setPageSize(Number(e.target.value));
      setPage(1);
    }}
  >
    <option value={5}>5</option>
    <option value={10}>10</option>
    <option value={25}>25</option>
    <option value={50}>50</option>
  </select>

  <span>per page</span>
</div>

  </div>
      {/* Table */}
      <div className="phase-tabs">
      <button
        className={activePhase === "followup" ? "active-tab" : ""}
        onClick={() => setActivePhase("followup")}
      >
        Quotation Follow-up Phase
      </button>

      <button
        className={activePhase === "payment" ? "active-tab" : ""}
        onClick={() => setActivePhase("payment")}
      >
        Payment Phase
      </button>
    </div>

      <div className="card-table">
        
   <table>
  <thead>
    <tr>
      <th>Project Name</th>

      {/* 🔹 Quotation Follow-up Phase columns */}
      {activePhase === "followup" && (
        <>
          <th>Client Response</th>
          <th>Last Follow-up</th>
          <th>Revised Cost</th>
          <th>Next Follow-up</th>
          <th>Remarks</th>
          <th>Order Status</th>
          <th>PO Received</th>
        </>
      )}

      {/* 🔹 Payment Phase columns */}
      {activePhase === "payment" && (
        <>
          <th>Payment Phase</th>
          <th>Payment Received</th>
          <th>Payment Amount</th>
          <th>Reason</th>
        </>
      )}

      <th>Actions</th>
    </tr>
  </thead>

  <tbody>
    {paginated.map((d) => (
      <tr key={d.id}>
        <td>{d.project_name}</td>

        {/* 🔹 Quotation Follow-up Phase data */}
        {activePhase === "followup" && (
          <>
            <td>{d.clientResponse}</td>
            <td>{d.lastFollowup}</td>
            <td>₹ {d.revisedCost}</td>
            <td>{d.nextFollowup}</td>
            <td>{d.remarks}</td>
            <td>{d.status}</td>
            <td>{d.poReceived}</td>
          </>
        )}

        {/* 🔹 Payment Phase data */}
        {activePhase === "payment" && (
          <>
            <td>{d.paymentPhase}</td>
            <td>{d.paymentReceived}</td>
            <td>{d.paymentAmount ? `₹ ${d.paymentAmount}` : "-"}</td>
            <td>{d.reason || "-"}</td>
          </>
        )}

        <td>
          <button className="btn-edit" onClick={() => handleEdit(d)}>✏️</button>
          <button className="btn-delete" onClick={() => handleDelete(d.id)}>
            🗑️
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      </div>

      {/* Pagination Controls */}
<div className="pagination" style={{ marginTop: "10px", display: "flex", gap: "15px", alignItems: "center" }}>
  <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
  <span>{page} / {totalPages}</span>

  {/* Boxed per-page dropdown */}

</div>


      {/* Add/Edit Modal */}
    {showModal && (
  <div className="modal-overlay">
    <div className="modal modal-lg">
      {/* Header */}
      <div className="modal-header">
        <h3>{editId ? "Edit Quotation Follow-up" : "Add Quotation Follow-up"}</h3>
        <span className="modal-close" onClick={() => setShowModal(false)}>
          ✕
        </span>
      </div>

      {/* Body */}
      <div className="modal-body">
        <div className="form-grid">
          {/* Client Response */}
          <div className="form-group">
            <label>Client Response *</label>
            <select
              value={newFollowup.clientResponse}
              onChange={e =>
                setNewFollowup({ ...newFollowup, clientResponse: e.target.value })
              }
            >
              <option value="">Select</option>
              <option>Interested</option>
              <option>Pending</option>
              <option>Not Interested</option>
            </select>
          </div>

          {/* Last Follow-up */}
          <div className="form-group">
            <label>Last Follow-up *</label>
            <input
              type="date"
              value={newFollowup.lastFollowup}
              onChange={e =>
                setNewFollowup({ ...newFollowup, lastFollowup: e.target.value })
              }
            />
          </div>

          {/* Revised Cost */}
          <div className="form-group">
            <label>Revised Cost *</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={newFollowup.revisedCost}
              onChange={e =>
                setNewFollowup({ ...newFollowup, revisedCost: e.target.value })
              }
            />
          </div>

          {/* Next Follow-up */}
          <div className="form-group">
            <label>Next Follow-up</label>
            <input
              type="date"
              value={newFollowup.nextFollowup}
              onChange={e =>
                setNewFollowup({ ...newFollowup, nextFollowup: e.target.value })
              }
            />
          </div>

          {/* Order Status */}
          <div className="form-group">
            <label>Order Status *</label>
            <select
              value={newFollowup.status}
              onChange={e =>
                setNewFollowup({ ...newFollowup, status: e.target.value })
              }
            >
              <option value="">Select</option>
              <option>In Discussion</option>
              <option>Confirmed</option>
              <option>Cancelled</option>
            </select>
          </div>

          {/* PO Received */}
          <div className="form-group">
            <label>PO Received *</label>
            <select
              value={newFollowup.poReceived}
              onChange={e =>
                setNewFollowup({ ...newFollowup, poReceived: e.target.value })
              }
            >
              <option>No</option>
              <option>Yes</option>
            </select>
          </div>

          {/* Payment Phase */}
          <div className="form-group">
            <label>Payment Phase *</label>
            <select
              value={newFollowup.paymentPhase}
              onChange={e =>
                setNewFollowup({ ...newFollowup, paymentPhase: e.target.value })
              }
            >
              <option>Initial</option>
              <option>Advance</option>
              <option>Partial</option>
              <option>Final</option>
              <option>Completed</option>
            </select>
          </div>

          {/* Payment Received */}
          <div className="form-group">
            <label>Payment Received *</label>
            <select
              value={newFollowup.paymentReceived}
              onChange={e =>
                setNewFollowup({
                  ...newFollowup,
                  paymentReceived: e.target.value,
                  paymentAmount: e.target.value === "No" ? "" : newFollowup.paymentAmount,
                })
              }
            >
              <option>No</option>
              <option>Yes</option>
            </select>
          </div>

          {/* Payment Amount (Conditional) */}
          {newFollowup.paymentReceived === "Yes" && (
            <div className="form-group">
              <label>Payment Amount *</label>
              <input
                type="number"
                placeholder="Enter received amount"
                value={newFollowup.paymentAmount}
                onChange={e =>
                  setNewFollowup({
                    ...newFollowup,
                    paymentAmount: e.target.value,
                  })
                }
              />
            </div>
          )}

          {/* Remarks (Full Width) */}
          <div className="form-group full-width">
            <label>Remarks</label>
            <input
              placeholder="Enter remarks"
              value={newFollowup.remarks}
              onChange={e =>
                setNewFollowup({ ...newFollowup, remarks: e.target.value })
              }
            />
          </div>

          {/* Reason (Full Width) */}
      {newFollowup.paymentReceived === "No" && (
  <div className="form-group full-width">
    <label>Reason</label>
    <input
      placeholder="Reason if any"
      value={newFollowup.reason}
      onChange={(e) =>
        setNewFollowup({ ...newFollowup, reason: e.target.value })
      }
    />
  </div>
)}

        </div>
      </div>

      {/* Footer */}
      <div className="modal-footer">
        <button className="btn-secondary" onClick={() => setShowModal(false)}>
          Cancel
        </button>
        <button
          className="btn-primary"
          onClick={handleSave}
          disabled={
            newFollowup.paymentReceived === "Yes" &&
            (!newFollowup.paymentAmount || Number(newFollowup.paymentAmount) <= 0)
          }
        >
          {editId ? "Update" : "Save"}
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}