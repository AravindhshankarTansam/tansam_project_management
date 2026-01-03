import { useState } from "react";
import "../../layouts/CSS/finance.css";

const FOLLOWUP_DATA = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  clientResponse: i % 2 === 0 ? "Interested" : "Pending",
  lastFollowup: "2024-10-05",
  revisedCost: 26000 + i * 800,
  nextFollowup: "2024-10-15",
  remarks: "Waiting for approval",
  status: i % 3 === 0 ? "Confirmed" : "In Discussion",
  poReceived: i % 2 === 0 ? "Yes" : "No",
  reason: i % 2 === 0 ? "-" : "Budget issue",
}));

export default function QuotationFollowup() {
  const [data, setData] = useState(FOLLOWUP_DATA);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [newFollowup, setNewFollowup] = useState({
    clientResponse: "Interested",
    lastFollowup: "",
    revisedCost: "",
    nextFollowup: "",
    remarks: "",
    status: "In Discussion",
    poReceived: "No",
    reason: "",
  });

  // Delete a row
  const deleteRow = id => setData(prev => prev.filter(d => d.id !== id));

  // Edit a row
  const handleEdit = followup => {
    setEditId(followup.id);
    setNewFollowup({ ...followup });
    setShowModal(true);
  };

  // Save (Add or Update)
  const handleSave = () => {
    if (editId) {
      setData(prev =>
        prev.map(d => (d.id === editId ? { ...d, ...newFollowup } : d))
      );
    } else {
      const newId = data.length ? data[data.length - 1].id + 1 : 1;
      setData(prev => [...prev, { id: newId, ...newFollowup }]);
    }
    setShowModal(false);
    setEditId(null);
    setNewFollowup({
      clientResponse: "Interested",
      lastFollowup: "",
      revisedCost: "",
      nextFollowup: "",
      remarks: "",
      status: "In Discussion",
      poReceived: "No",
      reason: "",
    });
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
          + Add Quotation
        </button>
      </div>
  <div style={{ position: "relative" }}>
    <select
      value={pageSize}
      onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
      style={{
        padding: "5px 10px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        backgroundColor: "#fff",
        cursor: "pointer",
        appearance: "none",
        WebkitAppearance: "none",
        MozAppearance: "none",
      }}
    >
      {[5, 10, 25, 50].map(n => (
        <option key={n} value={n}>{n} per page</option>
      ))}
    </select>
  </div>
      {/* Table */}
      <div className="card-table">
        
        <table>
          <thead>
            <tr>
              {[
                "Client Response",
                "Last Follow-up",
                "Revised Cost",
                "Next Follow-up",
                "Remarks",
                "Order Status",
                "PO Received",
                "Reason",
                "Actions",
              ].map(h => (
                <th key={h}>
                  {h}
                  <span className="resize-handle" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map(d => (
              <tr key={d.id}>
                <td>{d.clientResponse}</td>
                <td>{d.lastFollowup}</td>
                <td>₹ {d.revisedCost}</td>
                <td>{d.nextFollowup}</td>
                <td>{d.remarks}</td>
                <td>{d.status}</td>
                <td>{d.poReceived}</td>
                <td>{d.reason}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(d)}>✏️</button>
                  <button className="btn-delete" onClick={() => deleteRow(d.id)}>🗑️</button>
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
          <div className="modal">
            <h3>{editId ? "Edit Quotation" : "Add Quotation"}</h3>
            <div className="modal-form">
              <select
                value={newFollowup.clientResponse}
                onChange={e => setNewFollowup({ ...newFollowup, clientResponse: e.target.value })}
              >
                <option>Interested</option>
                <option>Pending</option>
                <option>Not Interested</option>
              </select>

              <input
                type="date"
                value={newFollowup.lastFollowup}
                onChange={e => setNewFollowup({ ...newFollowup, lastFollowup: e.target.value })}
              />

              <input
                type="number"
                placeholder="Revised Cost"
                value={newFollowup.revisedCost}
                onChange={e => setNewFollowup({ ...newFollowup, revisedCost: e.target.value })}
              />

              <input
                type="date"
                value={newFollowup.nextFollowup}
                onChange={e => setNewFollowup({ ...newFollowup, nextFollowup: e.target.value })}
              />

              <input
                placeholder="Remarks"
                value={newFollowup.remarks}
                onChange={e => setNewFollowup({ ...newFollowup, remarks: e.target.value })}
              />

              <select
                value={newFollowup.status}
                onChange={e => setNewFollowup({ ...newFollowup, status: e.target.value })}
              >
                <option>In Discussion</option>
                <option>Confirmed</option>
                <option>Cancelled</option>
              </select>

              <select
                value={newFollowup.poReceived}
                onChange={e => setNewFollowup({ ...newFollowup, poReceived: e.target.value })}
              >
                <option>No</option>
                <option>Yes</option>
              </select>

              <input
                placeholder="Reason"
                value={newFollowup.reason}
                onChange={e => setNewFollowup({ ...newFollowup, reason: e.target.value })}
              />
            </div>

            <div className="modal-actions">
              <button onClick={handleSave}>{editId ? "Update" : "Save"}</button>
              <button onClick={() => { setShowModal(false); setEditId(null); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
