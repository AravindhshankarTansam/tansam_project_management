import { useState } from "react";
import "./admincss/ProjectType.css";
import { FiPlus, FiEdit2, FiX, FiSave } from "react-icons/fi";

export default function CreateProjectTypes() {
  const [projectTypes, setProjectTypes] = useState([
    { id: 1, name: "New Installation", status: "ACTIVE" },
    { id: 2, name: "Maintenance", status: "INACTIVE" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState({
    id: null,
    name: "",
    status: "ACTIVE",
  });

  const openAddModal = () => {
    setIsEdit(false);
    setForm({ id: null, name: "", status: "ACTIVE" });
    setShowModal(true);
  };

  const openEditModal = (type) => {
    setIsEdit(true);
    setForm(type);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Project type name is required");
      return;
    }

    if (isEdit) {
      setProjectTypes(
        projectTypes.map((t) =>
          t.id === form.id ? { ...form } : t
        )
      );
    } else {
      setProjectTypes([
        ...projectTypes,
        { ...form, id: Date.now() },
      ]);
    }

    setShowModal(false);
  };

  return (
    <div className="project-types-container">
      {/* HEADER */}
      <div className="project-types-header">
        <h2 className="project-types-title">Project Types Master</h2>

        <button className="primary-btn" onClick={openAddModal}>
          <FiPlus size={16} />
          Add Project Type
        </button>
      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        <table className="project-types-table">
          <thead>
            <tr>
              <th className="col-name">Project Type</th>
              <th className="col-status">Status</th>
              <th className="col-action center">Action</th>
            </tr>
          </thead>

          <tbody>
            {projectTypes.length === 0 ? (
              <tr>
                <td colSpan="3" className="empty-text">
                  No project types found
                </td>
              </tr>
            ) : (
              projectTypes.map((type) => (
                <tr key={type.id}>
                  <td className="col-name">{type.name}</td>

                  <td className="col-status">
                    <span
                      className={`status-badge ${
                        type.status === "ACTIVE" ? "active" : "inactive"
                      }`}
                    >
                      {type.status}
                    </span>
                  </td>

                  <td className="col-action center">
                    <button
                      className="icon-btn edit"
                      onClick={() => openEditModal(type)}
                      title="Edit Project Type"
                    >
                      <FiEdit2 />
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
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>{isEdit ? "Edit Project Type" : "Add Project Type"}</h3>
              <button
                className="icon-btn"
                onClick={() => setShowModal(false)}
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label className="form-label">Project Type Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter project type name"
              />

              <label className="form-label">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  <FiSave size={16} />
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