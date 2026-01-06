
import { useState, useEffect } from "react";
import { FiEdit, FiTrash2, FiChevronDown, FiPlus } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CreateProject.css";
import {
  createProject,
  fetchProjects,
  updateProject,
  deleteProject,
} from "../../services/project.api";


/* ---------- DATE FORMAT HELPER ---------- */
const formatDate = (dateValue) => {
  if (!dateValue) return "";
  return new Date(dateValue).toISOString().split("T")[0];
};

export default function CreateProject() {
  /* ---------- STATE ---------- */
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState({
    id: null,
    projectName: "",
    clientName: "",
    projectType: "",
    startDate: "",
    endDate: "",
    status: "Planned",
  });

  /* ---------- LOAD PROJECTS ---------- */
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects();
        setProjects(data);
      } catch {
        toast.error("Failed to load projects");
      }
    };

    loadProjects();
  }, []);

  /* ---------- HANDLERS ---------- */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setIsEdit(false);
    setForm({
      id: null,
      projectName: "",
      clientName: "",
      projectType: "",
      startDate: "",
      endDate: "",
      status: "Planned",
    });
    setShowModal(true);
  };

  const openEditModal = (project) => {
    setIsEdit(true);
    setForm({
      ...project,
      startDate: formatDate(project.startDate),
      endDate: formatDate(project.endDate),
    });
    setShowModal(true);
  };

const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this project?")) return;

  try {
    await deleteProject(id);
    setProjects((prev) => prev.filter((p) => p.id !== id));
    toast.success("Project deleted successfully");
  } catch {
    toast.error("Delete failed");
  }
};


  /* ---------- CREATE PROJECT ---------- */
const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    projectName: form.projectName,
    clientName: form.clientName,
    projectType: form.projectType,
    startDate: form.startDate,
    endDate: form.endDate,
    status: form.status,
  };

  try {
    if (isEdit) {
      await updateProject(form.id, payload);
      toast.success("Project updated successfully");
    } else {
      await createProject(payload);
      toast.success("Project created successfully");
    }

    const data = await fetchProjects();
    setProjects(data);
    setShowModal(false);
    setIsEdit(false);
  } catch (err) {
    toast.error(err.message);
  }
};

  /* ---------- UI ---------- */
  return (
    <div className="create-project">
      {/* TOAST CONTAINER (LOCAL TO THIS PAGE) */}
      <ToastContainer
        position="top-right"
        autoClose={1200}           // 1.2 seconds (adjust if needed)
        hideProgressBar={false}    // ✅ show progress bar
        newestOnTop
        closeOnClick
        pauseOnHover={false}
        draggable
        theme="light"              // clean professional look
      />


      {/* HEADER */}
      <div className="page-header">
        <h2>Project Management</h2>
        <button className="add-btn" onClick={openAddModal}>
          <FiPlus className="plus-icon" />
          Create New Project
        </button>
      </div>

      {/* TABLE */}
      <div className="table-card">
        <table className="project-table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Client</th>
              <th>Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No projects found
                </td>
              </tr>
            ) : (
              projects.map((p) => (
                <tr key={p.id}>
                  <td>{p.projectName}</td>
                  <td>{p.clientName}</td>
                  <td>{p.projectType}</td>
                  <td>{formatDate(p.startDate)}</td>
                  <td>{formatDate(p.endDate)}</td>
                  <td>
                    <span
                      className={`status ${p.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="action-col">
                    <button
                      className="icon-btn edit"
                      onClick={() => openEditModal(p)}
                      title="Edit"
                    >
                      <FiEdit />
                    </button>
                    <button
                      className="icon-btn delete"
                      onClick={() => handleDelete(p.id)}
                      title="Delete"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>{isEdit ? "Edit Project" : "Create New Project"}</h3>

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
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Consulting">Consulting</option>
                </select>
                <FiChevronDown className="select-icon" />
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
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Planned">Planned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>
                <FiChevronDown className="select-icon" />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  {isEdit ? "Update Project" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}