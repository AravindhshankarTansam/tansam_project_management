import { useState } from "react";

const PROJECT_STATUSES = [
  "Created",
  "In Progress",
  "On Hold",
  "Completed",
  "Closed",
  "Dropped",
];

export default function ProjectsDashboard() {
  const dummyQuotations = [
    {
      id: 1,
      quotationName: "Quotation 1",
      clientName: "Client A",
      phase: "Approved",
      projects: [
        {
          id: 101,
          projectName: "Project 1A",
          projectStatus: "Created",
          workCategory: "Software",
          currentProgress: "0%",
          lab: "Digital",
          startDate: "2025-01-01",
          endDate: "2025-01-15",
          revenue: "100000",
          issues: "",
          droppedReason: "",
        },
        {
          id: 102,
          projectName: "Project 1B",
          projectStatus: "Dropped",
          workCategory: "Hardware",
          currentProgress: "0%",
          lab: "Asset",
          startDate: "2025-01-16",
          endDate: "2025-01-31",
          revenue: "120000",
          issues: "",
          droppedReason: "Budget issue",
        },
      ],
    },
    {
      id: 2,
      quotationName: "Quotation 2",
      clientName: "Client B",
      phase: "Approved",
      projects: [
        {
          id: 201,
          projectName: "Project 2A",
          projectStatus: "Dropped",
          workCategory: "Consulting",
          currentProgress: "0%",
          lab: "AR/VR",
          startDate: "2025-02-01",
          endDate: "2025-02-15",
          revenue: "80000",
          issues: "",
          droppedReason: "Client canceled",
        },
      ],
    },
  ];

  const [quotations, setQuotations] = useState(dummyQuotations);
  const [activeTab, setActiveTab] = useState("approved"); // approved or dropped
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Flatten projects for tabs
  const allProjects = [];
  quotations.forEach((q) => {
    q.projects.forEach((p) => {
      allProjects.push({ ...p, quotationName: q.quotationName, clientName: q.clientName });
    });
  });

  const approvedProjects = allProjects.filter((p) => p.projectStatus !== "Dropped");
  const droppedProjects = allProjects.filter((p) => p.projectStatus === "Dropped");

  // Handlers
  const openEditModal = (project) => {
    setEditingProject(project);
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

  const renderTable = (projects, showDroppedReason = false) => (
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
              <td style={styles.td}>
                <button onClick={() => openEditModal(p)} style={styles.iconBtn}>
                  ✏️
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Projects Dashboard</h2>

      <div style={{ marginBottom: "20px" }}>
        <button
          style={{ ...styles.tabBtn, background: activeTab === "approved" ? "#2563eb" : "#e5e7eb" }}
          onClick={() => setActiveTab("approved")}
        >
          Approved Projects
        </button>
        <button
          style={{ ...styles.tabBtn, background: activeTab === "dropped" ? "#2563eb" : "#e5e7eb" }}
          onClick={() => setActiveTab("dropped")}
        >
          Dropped Projects
        </button>
      </div>

      {activeTab === "approved" ? renderTable(approvedProjects) : renderTable(droppedProjects, true)}

      {/* Modal */}
      {showModal && editingProject && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Edit Project</h3>
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
                    />
                  );
                }
              })}
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
  iconBtn: { background: "transparent", border: "none", cursor: "pointer", fontSize: "16px" },
};
