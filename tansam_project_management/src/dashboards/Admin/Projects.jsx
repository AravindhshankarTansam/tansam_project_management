import { useState } from "react";
import { FaEye, FaEllipsisH, FaTrash, FaEdit } from "react-icons/fa";

import "../../layouts/CSS/projects.css";

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
      workCategory:
        j % 3 === 0 ? "Software" : j % 3 === 1 ? "Hardware" : "Consulting",
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

  const [filterWorkCategory, setFilterWorkCategory] = useState("All");
const [filterLab, setFilterLab] = useState("All");
const [filterStatus, setFilterStatus] = useState("All");
// Flatten projects
const allProjects = [];
quotations.forEach((q) => {
  q.projects.forEach((p) => {
    allProjects.push({
      ...p,
      quotationName: q.quotationName,
      clientName: q.clientName,
    });
  });
});
const applyFilters = (projects) => {
  return projects.filter((p) => {
    return (
      (filterWorkCategory === "All" || p.workCategory === filterWorkCategory) &&
      (filterLab === "All" || p.lab === filterLab) &&
      (filterStatus === "All" || p.projectStatus === filterStatus)
    );
  });
};

const approvedProjects = applyFilters(
  allProjects.filter((p) => p.projectStatus !== "Dropped")
);

const droppedProjects = applyFilters(
  allProjects.filter((p) => p.projectStatus === "Dropped")
);



  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Important to reset to first page
  };

  // Flatten projects for tabs
 

 
  const paginatedProjects = (projects, page, perPage) => {
    const start = (page - 1) * perPage;
    return projects.slice(start, start + perPage);
  };

  const totalPages = (projects, perPage) =>
    Math.ceil(projects.length / perPage);

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
        if (
          q.id ===
          quotations.find(
            (qu) => qu.quotationName === editingProject.quotationName
          ).id
        ) {
          return {
            ...q,
            projects: q.projects.map((p) =>
              p.id === editingProject.id ? editingProject : p
            ),
          };
        }
        return q;
      })
    );
    setShowModal(false);
  };

  const handleDelete = (project) => {
    if (
      window.confirm(`Are you sure you want to delete ${project.projectName}?`)
    ) {
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
      <table className="table">
        <thead>
          <tr>
            {[
              "Project Name",
              "Quotation",
              "Client",
              "Lab",
              "Work Category",
              "Start Date",
              "End Date",
              "Status",
              "Progress",
              "Revenue",
              "Issues",
              showDroppedReason ? "Dropped Reason" : null,
              "Action",
            ]
              .filter(Boolean)
              .map((col) => (
                <th key={col} className="th">
                  {col}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {projects.length === 0 ? (
            <tr>
              <td
                colSpan={showDroppedReason ? 13 : 12}
                style={{ textAlign: "center" }}
              >
                No projects found
              </td>
            </tr>
          ) : (
            projects.map((p) => (
              <tr key={p.id}>
                <td className="td">{p.projectName}</td>
                <td className="td">{p.quotationName}</td>
                <td className="td">{p.clientName}</td>
                <td className="td">{p.lab}</td>
                <td className="td">{p.workCategory}</td>
                <td className="td">{p.startDate}</td>
                <td className="td">{p.endDate}</td>
                <td className="td">{p.projectStatus}</td>
                <td className="td">{p.currentProgress}</td>
                <td className="td">{p.revenue}</td>
                <td className="td">{p.issues}</td>
                {showDroppedReason && <td className="td">{p.droppedReason}</td>}
                <td className="td actionCell">
  <div className="actionGroup">
    {/* View */}
    <button
      className="viewBtn"
      onClick={() => openEditModal(p, true)}
      title="View"
    >
      <FaEye />
    </button>

    {/* Edit */}
    <button
      className="editBtn"
      onClick={() => openEditModal(p, false)}
      title="Edit"
    >
      <FaEdit />
    </button>

    {/* More */}
    <button
      className="moreBtn"
      onClick={() => openEditModal(p, true)}
      title="More"
    >
      <FaEllipsisH />
    </button>

    {/* Delete */}
    <button
      className="deleteBtn"
      onClick={() => handleDelete(p)}
      title="Delete"
    >
      <FaTrash />
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
        {Array.from(
          {
            length: totalPages(
              activeTab === "approved" ? approvedProjects : droppedProjects,
              itemsPerPage
            ),
          },
          (_, i) => (
            <button
              className={`pageBtn ${currentPage === i + 1 ? "active" : ""}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          )
        )}
      </div>
    </>
  );
  const displayedProjects =
    activeTab === "approved"
      ? paginatedProjects(approvedProjects, currentPage, itemsPerPage)
      : paginatedProjects(droppedProjects, currentPage, itemsPerPage);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Projects Dashboard</h2>

   <div className="tabRow">
  {/* LEFT: Tabs */}
<div className="tabHeader">
  {/* LEFT: Tabs */}
  <div className="tabs">
    <button
      className={`tabBtn ${activeTab === "approved" ? "active" : ""}`}
      onClick={() => {
        setActiveTab("approved");
        setCurrentPage(1);
      }}
    >
      Approved Projects
    </button>

    <button
      className={`tabBtn ${activeTab === "dropped" ? "active" : ""}`}
      onClick={() => {
        setActiveTab("dropped");
        setCurrentPage(1);
      }}
    >
      Dropped Projects
    </button>
  </div>

  {/* RIGHT: Show per page */}
  <div className="pageSizeRight">
    <label>
      Show{" "}
      <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>{" "}
      per page
    </label>
  </div>
</div>



  {/* RIGHT: Show per page */}

</div>

      <div
        style={{
          marginBottom: "10px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
  <div className="topControls">
  {/* Filters - LEFT */}
  <div className="filters">
    <select
      value={filterWorkCategory}
      onChange={(e) => setFilterWorkCategory(e.target.value)}
    >
      <option value="All">All Work Categories</option>
      <option value="Software">Software</option>
      <option value="Hardware">Hardware</option>
      <option value="Consulting">Consulting</option>
    </select>

    <select
      value={filterLab}
      onChange={(e) => setFilterLab(e.target.value)}
    >
      <option value="All">All Labs</option>
      <option value="Digital">Digital</option>
      <option value="Asset">Asset</option>
    </select>

    <select
      value={filterStatus}
      onChange={(e) => setFilterStatus(e.target.value)}
    >
      <option value="All">All Project Types</option>
      {PROJECT_STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  </div>

  {/* Show per page - RIGHT */}
 
</div>

        <div>
          Total Projects:{" "}
          {activeTab === "approved"
            ? approvedProjects.length
            : droppedProjects.length}
        </div>
      </div>
      {renderTable(displayedProjects, activeTab === "dropped")}

      {/* Modal */}
 {showModal && editingProject && (
  <div className="modalOverlay">
    <div className="modalBox">
      <h3>{isReadOnly ? "View Project" : "Edit Project"}</h3>

      <form onSubmit={handleSave}>
        {[
          "projectName",
          "lab",
          "workCategory",
          "startDate",
          "endDate",
          "projectStatus",
          "currentProgress",
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
                className="modalInput"
                disabled={isReadOnly}
              />
            );
          }

          if (field === "projectStatus") {
            return (
              <select
                key={field}
                name={field}
                value={editingProject[field]}
                onChange={handleChange}
                className="modalInput"
                disabled={isReadOnly}
              >
                {PROJECT_STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            );
          }

          return (
            <input
              key={field}
              name={field}
              placeholder={field.replace(/([A-Z])/g, " $1").trim()}
              value={editingProject[field]}
              onChange={handleChange}
              className="modalInput"
              disabled={isReadOnly}
            />
          );
        })}

        <div className="modalActions">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="cancelBtn"
          >
            {isReadOnly ? "Close" : "Cancel"}
          </button>

          {!isReadOnly && (
            <button type="submit" className="saveBtn">
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
