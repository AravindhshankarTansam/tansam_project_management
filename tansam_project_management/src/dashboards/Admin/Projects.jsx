import { useState } from "react";

export default function CreateProject() {
  // 🔹 Dummy data
  const dummyProjects = Array.from({ length: 120 }, (_, i) => ({
    id: i + 1,
    projectName: `Project ${i + 1}`,
    clientName: `Client ${((i % 10) + 1)}`,
    clientType: i % 2 === 0 ? "Industry" : "Academia",
    lab: ["Digital", "Asset", "AR/VR", "Smart Factory"][i % 4],
    pocStatus: ["Not Required", "In Progress", "Completed"][i % 3],
    quotationAmount: (50000 + i * 1500).toLocaleString(),
    quotationStatus: ["Draft", "Submitted", "Approved"][i % 3],
    expectedPODate: `2025-0${(i % 9) + 1}-15`,
    remarks: "Dummy data for pagination testing",
  }));

  // 🔹 State
  const [projects, setProjects] = useState(dummyProjects);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({
    projectName: "",
    clientName: "",
    clientType: "Industry",
    lab: "",
    pocStatus: "Not Required",
    quotationAmount: "",
    quotationStatus: "Draft",
    expectedPODate: "",
    remarks: "",
  });

  // 🔹 Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const paginatedProjects = projects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 🔹 Handlers
  const openAddModal = () => {
    setIsEdit(false);
    setForm({
      projectName: "",
      clientName: "",
      clientType: "Industry",
      lab: "",
      pocStatus: "Not Required",
      quotationAmount: "",
      quotationStatus: "Draft",
      expectedPODate: "",
      remarks: "",
    });
    setShowModal(true);
  };

  const openEditModal = (project) => {
    setIsEdit(true);
    setForm(project);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this project?")) {
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.projectName.trim()) {
      alert("Project Name is required");
      return;
    }

    if (isEdit) {
      setProjects(projects.map((p) => (p.id === form.id ? form : p)));
    } else {
      setProjects([...projects, { ...form, id: Date.now() }]);
    }

    setShowModal(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  // 🔹 Render
  return (
    <div style={{ padding: "20px" }}>
      <h2>📦 Projects (Requirement → Quotation)</h2>

      <button onClick={openAddModal} style={styles.addBtn}>
        ➕ Add Project
      </button>

      {/* Items per page selector */}
      <div style={{ marginBottom: "10px" }}>
        Show:{" "}
        <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>{" "}
        per page
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Project</th>
            <th>Client</th>
            <th>Type</th>
            <th>Lab</th>
            <th>PoC</th>
            <th>Quotation</th>
            <th>Status</th>
            <th>PO Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProjects.length === 0 ? (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
                No projects added
              </td>
            </tr>
          ) : (
            paginatedProjects.map((p) => (
              <tr key={p.id}>
                <td>{p.projectName}</td>
                <td>{p.clientName}</td>
                <td>{p.clientType}</td>
                <td>{p.lab}</td>
                <td>{p.pocStatus}</td>
                <td>{p.quotationAmount}</td>
                <td>{p.quotationStatus}</td>
                <td>{p.expectedPODate}</td>
                <td style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => openEditModal(p)} style={styles.iconBtn}>
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    style={{ ...styles.iconBtn, color: "#dc2626" }}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination buttons */}
      <div style={{ marginTop: "10px" }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            style={{
              padding: "6px 10px",
              marginRight: "4px",
              background: currentPage === i + 1 ? "#2563eb" : "#e5e7eb",
              color: currentPage === i + 1 ? "#fff" : "#000",
              border: "none",
              cursor: "pointer",
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>{isEdit ? "Edit Project" : "Add Project"}</h3>
            <form onSubmit={handleSubmit}>
              <input
                name="projectName"
                placeholder="Project Name"
                value={form.projectName}
                onChange={handleChange}
                style={styles.input}
              />
              <input
                name="clientName"
                placeholder="Client Name"
                value={form.clientName}
                onChange={handleChange}
                style={styles.input}
              />
              <select
                name="clientType"
                value={form.clientType}
                onChange={handleChange}
                style={styles.input}
              >
                <option>Industry</option>
                <option>Academia</option>
              </select>
              <input
                name="lab"
                placeholder="Lab"
                value={form.lab}
                onChange={handleChange}
                style={styles.input}
              />
              <select
                name="pocStatus"
                value={form.pocStatus}
                onChange={handleChange}
                style={styles.input}
              >
                <option>Not Required</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
              <input
                name="quotationAmount"
                placeholder="Quotation Amount"
                value={form.quotationAmount}
                onChange={handleChange}
                style={styles.input}
              />
              <select
                name="quotationStatus"
                value={form.quotationStatus}
                onChange={handleChange}
                style={styles.input}
              >
                <option>Draft</option>
                <option>Submitted</option>
                <option>Approved</option>
              </select>
              <input
                type="date"
                name="expectedPODate"
                value={form.expectedPODate}
                onChange={handleChange}
                style={styles.input}
              />
              <textarea
                name="remarks"
                placeholder="Remarks"
                value={form.remarks}
                onChange={handleChange}
                style={styles.input}
              />
              <div style={{ textAlign: "right" }}>
                <button type="button" onClick={() => setShowModal(false)} style={styles.cancelBtn}>
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

const styles = {
  addBtn: { marginBottom: "10px", padding: "8px 12px", background: "#16a34a", color: "#fff", border: "none", cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse" },
  iconBtn: { background: "transparent", border: "none", cursor: "pointer", fontSize: "16px" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" },
  modal: { background: "#fff", padding: "20px", width: "360px", borderRadius: "4px" },
  input: { width: "100%", padding: "8px", marginBottom: "10px" },
  cancelBtn: { marginRight: "10px", padding: "6px 10px" },
  saveBtn: { padding: "6px 10px", background: "#2563eb", color: "#fff", border: "none" },
};
