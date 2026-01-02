import { useState } from "react";
import { FaEye, FaEllipsisH, FaTrash } from "react-icons/fa";

const PROJECT_STATUSES = [
  "Created",
  "In Progress",
  "On Hold",
  "Completed",
  "Closed",
  "Dropped",
];

export default function ProjectsDashboard() {
  // Generate dummy quotations with multiple projects
  const dummyQuotations = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    quotationName: `Quotation ${i + 1}`,
    clientName: `Client ${String.fromCharCode(65 + i)}`,
    phase: "Approved",
    projects: Array.from({ length: 12 }, (_, j) => ({
      id: (i + 1) * 100 + j + 1,
      projectName: `Project ${i + 1}-${j + 1}`,
      projectStatus: j % 5 === 0 ? "Dropped" : "Created",
      workCategory: j % 3 === 0 ? "Software" : j % 3 === 1 ? "Hardware" : "Consulting",
      currentProgress: `${Math.floor(Math.random() * 100)}%`,
      lab: j % 2 === 0 ? "Digital" : "Asset",
      startDate: "2025-01-01",
      endDate: "2025-01-15",
      revenue: `${50000 + j * 1000}`,
      issues: "",
      droppedReason: j % 5 === 0 ? "Client canceled" : "",
    })),
  }));




  const [quotations, setQuotations] = useState(dummyQuotations);
  const [activeTab, setActiveTab] = useState("approved"); // approved or dropped
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

const handleItemsPerPageChange = (e) => {
  setItemsPerPage(Number(e.target.value));
  setCurrentPage(1); // Reset page to 1
};
  // Flatten projects for tabs
  const allProjects = [];
  quotations.forEach((q) => {
    q.projects.forEach((p) => {
      allProjects.push({ ...p, quotationName: q.quotationName, clientName: q.clientName });
    });
  });

  const approvedProjects = allProjects.filter((p) => p.projectStatus !== "Dropped");
  const droppedProjects = allProjects.filter((p) => p.projectStatus === "Dropped");

  const paginatedProjects = (projects) => {
    const start = (currentPage - 1) * itemsPerPage;
    return projects.slice(start, start + itemsPerPage);
  };

  const totalPages = (projects) => Math.ceil(projects.length / itemsPerPage);

  // Handlers
  const openEditModal = (project, readOnly = false) => {
    setEditingProject(project);
    setIsReadOnly(readOnly);
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingProject({ ...editingProject, [name]: value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setQuotations((prev) =>
      prev.map((q) => {
        if (q.id === quotations.find((qu) => qu.quotationName === editingProject.quotationName).id) {
          return {
            ...q,
            projects: q.projects.map((p) => (p.id === editingProject.id ? editingProject : p)),
          };
        }
        return q;
      })
    );
    setShowModal(false);
  };

  const handleDelete = (project) => {
    if (window.confirm(`Are you sure you want to delete ${project.projectName}?`)) {
      setQuotations((prev) =>
        prev.map((q) => ({
          ...q,
          projects: q.projects.filter((p) => p.id !== project.id),
        }))
      );
    }
  };

  const renderTable = (projects, showDroppedReason = false) => (
    <>
      <table style={styles.table}>
        <thead>
          <tr>
            {[
              "Project Name",
              "Quotation",
              "Client",
              "Status",
              "Work Category",
              "Progress",
              "Lab",
              "Start Date",
              "End Date",
              "Revenue",
              "Issues",
              showDroppedReason ? "Dropped Reason" : null,
              "Action",
            ]
              .filter(Boolean)
              .map((col) => (
                <th key={col} style={styles.th}>
                  {col}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {projects.length === 0 ? (
            <tr>
              <td colSpan={showDroppedReason ? 13 : 12} style={{ textAlign: "center" }}>
                No projects found
              </td>
            </tr>
          ) : (
            projects.map((p) => (
              <tr key={p.id}>
                <td style={styles.td}>{p.projectName}</td>
                <td style={styles.td}>{p.quotationName}</td>
                <td style={styles.td}>{p.clientName}</td>
                <td style={styles.td}>{p.projectStatus}</td>
                <td style={styles.td}>{p.workCategory}</td>
                <td style={styles.td}>{p.currentProgress}</td>
                <td style={styles.td}>{p.lab}</td>
                <td style={styles.td}>{p.startDate}</td>
                <td style={styles.td}>{p.endDate}</td>
                <td style={styles.td}>{p.revenue}</td>
                <td style={styles.td}>{p.issues}</td>
                {showDroppedReason && <td style={styles.td}>{p.droppedReason}</td>}
<td style={{ ...styles.td,  whiteSpace: "normal" }}>
  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
    <button style={styles.viewBtn} onClick={() => openEditModal(p, true)}>
      <FaEye style={{ marginRight: "4px" }} /> 
    </button>
    <button style={styles.moreBtn} onClick={() => openEditModal(p, true)}>
      <FaEllipsisH style={{ marginRight: "4px" }} /> 
    </button>
    <button style={styles.deleteBtn} onClick={() => handleDelete(p)}>
      <FaTrash style={{ marginRight: "4px" }} /> 
    </button>
  </div>
</td>


              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ marginTop: "10px", textAlign: "center" }}>
        {Array.from({ length: totalPages(projects) }, (_, i) => (
          <button
            key={i}
            style={{
              ...styles.pageBtn,
              background: currentPage === i + 1 ? "#2563eb" : "#e5e7eb",
              color: currentPage === i + 1 ? "#fff" : "#000",
            }}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </>
  );

  const displayedProjects =
    activeTab === "approved" ? paginatedProjects(approvedProjects) : paginatedProjects(droppedProjects);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Projects Dashboard</h2>

      <div style={{ marginBottom: "20px" }}>
        <button
          style={{ ...styles.tabBtn, background: activeTab === "approved" ? "#2563eb" : "#e5e7eb" }}
          onClick={() => {
            setActiveTab("approved");
            setCurrentPage(1);
          }}
        >
          Approved Projects
        </button>
        <button
          style={{ ...styles.tabBtn, background: activeTab === "dropped" ? "#2563eb" : "#e5e7eb" }}
          onClick={() => {
            setActiveTab("dropped");
            setCurrentPage(1);
          }}
        >
          Dropped Projects
        </button>
        
      </div>
    <div style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <label>
          Show{" "}
          <select value={itemsPerPage} onChange={handleItemsPerPageChange} style={{ padding: "4px 8px", marginLeft: "4px" }}>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>{" "}
          per page
        </label>
      </div>
      <div>Total Projects: {activeTab === "approved" ? approvedProjects.length : droppedProjects.length}</div>
    </div>
      {renderTable(displayedProjects, activeTab === "dropped")}

      {/* Modal */}
      {showModal && editingProject && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>{isReadOnly ? "View Project" : "Edit Project"}</h3>
            <form onSubmit={handleSave}>
              {[
                "projectName",
                "projectStatus",
                "workCategory",
                "currentProgress",
                "lab",
                "startDate",
                "endDate",
                "revenue",
                "issues",
                "droppedReason",
              ].map((field) => {
                if (field.includes("Date")) {
                  return (
                    <input
                      key={field}
                      type="date"
                      name={field}
                      value={editingProject[field]}
                      onChange={handleChange}
                      style={styles.input}
                      disabled={isReadOnly}
                    />
                  );
                } else if (field === "projectStatus") {
                  return (
                    <select
                      key={field}
                      name={field}
                      value={editingProject[field]}
                      onChange={handleChange}
                      style={styles.input}
                      disabled={isReadOnly}
                    >
                      {PROJECT_STATUSES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  );
                } else {
                  return (
                    <input
                      key={field}
                      name={field}
                      placeholder={field.replace(/([A-Z])/g, " $1").trim()}
                      value={editingProject[field]}
                      onChange={handleChange}
                      style={styles.input}
                      disabled={isReadOnly}
                    />
                  );
                }
              })}
              <div style={{ textAlign: "right" }}>
                <button type="button" onClick={() => setShowModal(false)} style={styles.cancelBtn}>
                  {isReadOnly ? "Close" : "Cancel"}
                </button>
                {!isReadOnly && (
                  <button type="submit" style={styles.saveBtn}>
                    Save
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
    tableLayout: "fixed",
  },
  th: {
    border: "1px solid #ccc",
    padding: "8px",
    background: "#f3f4f6",
    textAlign: "left",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  td: {
    border: "1px solid #ccc",
    padding: "8px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  tabBtn: {
    padding: "6px 12px",
    marginRight: "10px",
    border: "none",
    cursor: "pointer",
    color: "#fff",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    background: "#fff",
    padding: "20px",
    width: "450px",
    borderRadius: "4px",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  input: { width: "100%", padding: "8px", marginBottom: "10px" },
  cancelBtn: { marginRight: "10px", padding: "6px 10px" },
  saveBtn: { padding: "6px 10px", background: "#2563eb", color: "#fff", border: "none" },
  viewBtn: {
    background: "#22c55e",
    color: "#fff",
    border: "none",
    padding: "4px 8px",
    marginRight: "4px",
    cursor: "pointer",
    borderRadius: "3px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  moreBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "4px 8px",
    marginRight: "4px",
    cursor: "pointer",
    borderRadius: "3px",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  deleteBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "4px 8px",
    cursor: "pointer",
    borderRadius: "3px",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  pageBtn: {
    margin: "0 4px",
    padding: "4px 8px",
    cursor: "pointer",
    borderRadius: "3px",
    border: "none",
  },
};
