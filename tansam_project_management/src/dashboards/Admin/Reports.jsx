import { useState } from "react";

export default function Reports() {
  const [reports, setReports] = useState([
    { id: 1, name: "Sales Summary", status: "ACTIVE" },
    { id: 2, name: "Finance Overview", status: "INACTIVE" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState({
    id: null,
    name: "",
    status: "ACTIVE",
  });

  // 🔹 Open Add
  const openAddModal = () => {
    setIsEdit(false);
    setForm({ id: null, name: "", status: "ACTIVE" });
    setShowModal(true);
  };

  // 🔹 Open Edit
  const openEditModal = (report) => {
    setIsEdit(true);
    setForm(report);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Save
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Report name is required");
      return;
    }

    if (isEdit) {
      setReports(reports.map((r) => (r.id === form.id ? { ...form } : r)));
    } else {
      setReports([...reports, { ...form, id: Date.now() }]);
    }

    setShowModal(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Reports Master</h2>

      <button onClick={openAddModal} style={styles.addBtn}>
        ➕ Add Report
      </button>

      {/* ---------- TABLE ---------- */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Report Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td>{report.name}</td>
              <td>{report.status}</td>
              <td>
                <button
                  onClick={() => openEditModal(report)}
                  style={styles.editBtn}
                >
                  ✏️ Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ---------- MODAL ---------- */}
      {showModal && (
        <div style={styles.modal}>
          <div style={styles.modal}>
            <h3>{isEdit ? "Edit Report" : "Add Report"}</h3>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Report Name"
                value={form.name}
                onChange={handleChange}
                style={styles.input}
              />

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>

              <div style={{ textAlign: "right" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.saveBtn}>
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- STYLES ---------- */
const styles = {
  addBtn: {
    marginBottom: "10px",
    padding: "8px 12px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  editBtn: {
    padding: "4px 8px",
    background: "#f59e0b",
    border: "none",
    cursor: "pointer",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "#fff",
    padding: "20px",
    width: "360px",
    borderRadius: "4px",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
  },
  cancelBtn: {
    marginRight: "10px",
    padding: "6px 10px",
  },
  saveBtn: {
    padding: "6px 10px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
  },
};
