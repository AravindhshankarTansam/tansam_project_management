import { useState } from "react";

export default function CreateProject() {
  // 🔹 Dummy data
  const dummyProjects = Array.from({ length: 120 }, (_, i) => ({
    id: i + 1,
    projectName: `Project ${i + 1}`,
    clientName: `Client ${((i % 10) + 1)}`,
    clientType: i % 2 === 0 ? "Industry" : "Academia",
    projectType: i % 2 === 0 ? "New Installation" : "Maintenance",
    projectStatus: ["Active", "In Progress", "Completed"][i % 3],
    workCategory: ["Software", "Hardware", "Consulting"][i % 3],
    currentProgress: `${(i % 100) + 1}%`,
    lab: ["Digital", "Asset", "AR/VR", "Smart Factory"][i % 4],
    startDate: `2025-0${(i % 9) + 1}-01`,
    endDate: `2025-0${(i % 9) + 1}-15`,
    revenue: (50000 + i * 1500).toLocaleString(),
    issues: i % 5 === 0 ? "Pending" : "",
  }));

  // 🔹 State
  const [projects, setProjects] = useState(dummyProjects);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({
    projectName: "",
    clientName: "",
    clientType: "Industry",
    projectType: "",
    projectStatus: "Active",
    workCategory: "",
    currentProgress: "",
    lab: "",
    startDate: "",
    endDate: "",
    revenue: "",
    issues: "",
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
      projectType: "",
      projectStatus: "Active",
      workCategory: "",
      currentProgress: "",
      lab: "",
      startDate: "",
      endDate: "",
      revenue: "",
      issues: "",
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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.projectName.trim()) {
      alert("Project Name is required");
      return;
    }
    if (isEdit) {
      setProjects(projects.map((p) => (p.id === form.id ? { ...form } : p)));
    } else {
      setProjects([...projects, { ...form, id: Date.now() }]);
    }
    setShowModal(false);
  };

  const handlePageChange = (page) => setCurrentPage(page);
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // 🔹 Render
  return (
    <div style={{ padding: "20px" }}>
      <h2>📦 Projects Master</h2>
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
  <button onClick={openAddModal} style={styles.addBtn}>➕ Add Project</button>

  <div>
    Show:{" "}
    <select value={itemsPerPage} onChange={handleItemsPerPageChange} style={{ marginLeft: "5px" }}>
      <option value={25}>25</option>
      <option value={50}>50</option>
      <option value={100}>100</option>
    </select>{" "}
    per page
  </div>
</div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Client Name</th>
            <th>Client Type</th>
            <th>Project Type</th>
            <th>Project Status</th>
            <th>Work Category</th>
            <th>Current Progress</th>
            <th>LAB</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Revenue</th>
            <th>Issues</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProjects.length === 0 ? (
            <tr>
              <td colSpan="13" style={{ textAlign: "center" }}>
                No projects added
              </td>
            </tr>
          ) : (
            paginatedProjects.map((p) => (
              <tr key={p.id}>
                <td>{p.projectName}</td>
                <td>{p.clientName}</td>
                <td>{p.clientType}</td>
                <td>{p.projectType}</td>
                <td>{p.projectStatus}</td>
                <td>{p.workCategory}</td>
                <td>{p.currentProgress}</td>
                <td>{p.lab}</td>
                <td>{p.startDate}</td>
                <td>{p.endDate}</td>
                <td>{p.revenue}</td>
                <td>{p.issues}</td>
                <td style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => openEditModal(p)} style={styles.iconBtn}>✏️</button>
                  <button onClick={() => handleDelete(p.id)} style={{ ...styles.iconBtn, color: "#dc2626" }}>🗑️</button>
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
              {["projectName","clientName","clientType","projectType","projectStatus","workCategory","currentProgress","lab","startDate","endDate","revenue","issues"].map((field) => (
                field.includes("Date") ? (
                  <input
                    key={field}
                    type="date"
                    name={field}
                    value={form[field]}
                    onChange={handleChange}
                    style={styles.input}
                  />
                ) : field === "clientType" || field === "projectStatus" ? (
                  <select key={field} name={field} value={form[field]} onChange={handleChange} style={styles.input}>
                    {field === "clientType" ? <><option>Industry</option><option>Academia</option></> : <><option>Active</option><option>In Progress</option><option>Completed</option></>}
                  </select>
                ) : (
                  <input
                    key={field}
                    name={field}
                    placeholder={field.replace(/([A-Z])/g, " $1").trim()}
                    value={form[field]}
                    onChange={handleChange}
                    style={styles.input}
                  />
                )
              ))}
              <div style={{ textAlign: "right" }}>
                <button type="button" onClick={() => setShowModal(false)} style={styles.cancelBtn}>Cancel</button>
                <button type="submit" style={styles.saveBtn}>Save</button>
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
