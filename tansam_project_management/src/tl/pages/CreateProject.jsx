import { useState, useEffect, useMemo } from "react";
import {
  FiEdit,
  FiTrash2,
  FiChevronDown,
  FiPlus,
  FiSearch,
  FiFilter,
  FiX,
  FiCheckCircle,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CreateProject.css";

import {
  createProject,
  fetchProjects,
  updateProject,
  deleteProject,
} from "../../services/project.api";

import { fetchProjectTypes } from "../../services/projectType.api";

const emptyForm = {
  id: null,
  projectName: "",
  clientName: "",
  projectType: "",
  startDate: "",
  endDate: "",
  status: "Planned",
  poStatus: "Negotiated",
  quotationNumber: "",
  poNumber: "",
  poFile: null,
};

const formatDate = (dateValue) => {
  if (!dateValue) return "";
  return new Date(dateValue).toISOString().split("T")[0];
};

const PROJECTS_PER_PAGE = 10;

export default function CreateProject() {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const isTL = role === "TEAM LEAD";
  const isAdmin = role === "ADMIN";

  const [projects, setProjects] = useState([]);
  const [projectTypes, setProjectTypes] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const [projectsData, typesData] = await Promise.all([
          fetchProjects(),
          fetchProjectTypes(),
        ]);

        if (mounted) {
          setProjects(projectsData || []);
          setProjectTypes(typesData || []);
        }
      } catch {
        toast.error("Failed to load data");
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  /* Filtered Projects */
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.projectName?.toLowerCase().includes(q) ||
          p.clientName?.toLowerCase().includes(q)
      );
    }

    if (selectedType) {
      filtered = filtered.filter((p) => p.projectType === selectedType);
    }

    return filtered;
  }, [projects, searchTerm, selectedType]);

  /* Pagination Logic */
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * PROJECTS_PER_PAGE;
    return filteredProjects.slice(start, start + PROJECTS_PER_PAGE);
  }, [filteredProjects, currentPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

 const openAddModal = () => {
    if (!isTL) return;
    setIsEdit(false);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (project) => {
    if (!isTL) return;  
    setIsEdit(true);
    setForm({
      ...project,
      startDate: formatDate(project.startDate),
      endDate: formatDate(project.endDate),
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!isTL) return;
    if (!window.confirm("Delete this project?")) return;

    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast.success("Project deleted");
    } catch {
      toast.error("Delete failed");
    }
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!isTL) return;

  /* ================= PO VALIDATION ================= */
  if (form.poStatus === "Received") {
    if (!form.quotationNumber && !form.poFile) {
      toast.error("Quotation number or file is required");
      return;
    }

    if (!form.poNumber && !form.poFile) {
      toast.error("PO number or file is required");
      return;
    }
  }
  /* ================================================= */

const payload = {
  projectName: form.projectName,
  clientName: form.clientName,
  projectType: form.projectType,
  startDate: form.startDate,
  endDate: form.endDate,
  status: form.status,
  poStatus: form.poStatus,
  quotationNumber: form.quotationNumber || "",
  poNumber: form.poNumber || "",
  poFile: form.poFile || null,
};


  try {
    if (isEdit) {
      await updateProject(form.id, payload);
      toast.success("Project updated");
    } else {
      await createProject(payload);
      toast.success("Project created");
    }

    setProjects(await fetchProjects());
    setCurrentPage(1);
    setShowModal(false);
    setIsEdit(false);
  } catch (err) {
    toast.error(err.message || "Action failed");
  }
};

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedType("");
    setCurrentPage(1);
  };

  if (!isTL && !isAdmin) {
    return (
      <div className="unauthorized">
        <h3>Access Denied</h3>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="create-project">
      <ToastContainer autoClose={1200} newestOnTop />

      <div className="page-header">
        <h2>Project Management</h2>
        {isTL && (
          <button className="add-btn" onClick={openAddModal}>
            <FiPlus /> Create New Project
          </button>
        )}
      </div>

      <div className="search-filter-bar">
        <div className="search-box">
          <FiSearch />
          <input
            placeholder="Search project or client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-box">
          <FiFilter />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">All Types</option>
            {projectTypes.map((t) => (
              <option key={t.id} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>
          <FiChevronDown />
        </div>

        {(searchTerm || selectedType) && (
          <button className="reset-btn" onClick={resetFilters}>
            <FiX /> Clear
          </button>
        )}
      </div>

      <div className="table-card">
        <table className="project-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Client</th>
              <th>Type</th>
              <th>Start</th>
              <th>End</th>
              <th>Progress</th>
              <th>Quotation No</th>
              <th>PO No</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedProjects.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-results">
                  No projects found
                </td>
              </tr>
            ) : (
              paginatedProjects.map((p) => (
                <tr key={p.id}>
                  <td>{p.projectName}</td>
                  <td>{p.clientName}</td>
                  <td>{p.projectType}</td>
                  <td>{formatDate(p.startDate)}</td>
                  <td>{formatDate(p.endDate)}</td>

                  {/* ✅ MAIN PROJECT STATUS */}
                  <td>
                    <span
                      className={`status-badge ${p.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {p.status === "Completed" && (
                        <FiCheckCircle style={{ marginRight: "6px" }} />
                      )}
                      {p.status}
                    </span>
                  </td>

                  {/* ✅ QUOTATION NUMBER */}
                  <td>{p.quotationNumber || "-"}</td>
                    <td>{p.poNumber || "-"}</td>

                  {/* ✅ PO STATUS */}
                  {/* <td>
                    <span
                      className={`po-badge ${
                        p.poStatus === "Received" ? "received" : "negotiated"
                      }`}
                    >
                      {p.poStatus}
                    </span>
                  </td> */}

                  {/* ✅ ACTIONS */}
                  <td className="action-col">
                    <button
                      className="icon-btn edit-btn"
                      disabled={!isTL}
                      onClick={() => openEditModal(p)}
                    >
                      <FiEdit />
                    </button>
                    <button
                      className="icon-btn delete-btn"
                      disabled={!isTL}
                      onClick={() => handleDelete(p.id)}
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="page-btn"
            >
              <FiChevronLeft />
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`page-number ${
                  page === currentPage ? "active" : ""
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="page-btn"
            >
              Next
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && isTL && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{isEdit ? "Edit Project" : "Create Project"}</h3>

            <form onSubmit={handleSubmit}>
              <input
                name="projectName"
                placeholder="Project Name"
                value={form.projectName}
                onChange={handleChange}
                required
              />
              <input
                name="clientName"
                placeholder="Client Name"
                value={form.clientName}
                onChange={handleChange}
                required
              />

              <div className="select-wrapper">
                <select
                  name="projectType"
                  value={form.projectType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Project Type</option>
                  {projectTypes.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name}
                    </option>
                  ))}
                </select>
                {/* <FiChevronDown className="select-icon" /> */}
              </div>

              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
              />
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                required
              />
              <div className="select-wrapper">
                <select
                  name="poStatus"
                  value={form.poStatus}
                  onChange={handleChange}
                >
                  <option value="Negotiated">Negotiated</option>
                  <option value="Received">Received</option>
                </select>
              </div>
              {form.poStatus === "Received" && (
                <>
                  <input
                    name="quotationNumber"
                    placeholder="Quotation Number"
                    value={form.quotationNumber}
                    onChange={handleChange}
                    required
                  />

                  <input
                    name="poNumber"
                    placeholder="Purchase Order Number"
                    value={form.poNumber}
                    onChange={handleChange}
                    required
                  />

                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) =>
                      setForm({ ...form, poFile: e.target.files[0] })
                    }
                  />
                </>
              )}

              <div className="select-wrapper">
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option>Planned</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>On Hold</option>
                </select>
                {/* <FiChevronDown className="select-icon" /> */}
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit">{isEdit ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}