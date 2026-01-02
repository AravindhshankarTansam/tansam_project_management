import { useState } from "react";
import { FiEdit, FiTrash2, FiChevronDown, FiPlus } from "react-icons/fi";
import "./CreateProject.css";

export default function CreateProject() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      projectName: "Marketing Website",
      clientName: "ABC Pvt Ltd",
      projectType: "Web Development",
      startDate: "2024-06-01",
      endDate: "2024-08-15",
      status: "In Progress",
    },
  ]);

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
    setForm(project);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEdit) {
      setProjects(projects.map((p) => (p.id === form.id ? form : p)));
    } else {
      setProjects([...projects, { ...form, id: Date.now() }]);
    }

    setShowModal(false);
  };

  return (
    <div className="create-project">
      {/* HEADER */}
      <div className="page-header">
        <h2>Project Management</h2>
        <button className="add-btn" onClick={openAddModal}>
          <FiPlus className="plus-icon" />
          Create New Project
        </button>
      </div>

      {/* TABLE CARD */}
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
            {projects.map((p) => (
              <tr key={p.id}>
                <td>{p.projectName}</td>
                <td>{p.clientName}</td>
                <td>{p.projectType}</td>
                <td>{p.startDate}</td>
                <td>{p.endDate}</td>
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
                    title="Edit Project"
                  >
                    <FiEdit />
                  </button>
                  <button
                    className="icon-btn delete"
                    onClick={() => handleDelete(p.id)}
                    title="Delete Project"
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
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