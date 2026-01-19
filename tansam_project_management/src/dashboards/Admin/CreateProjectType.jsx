import { useEffect, useState } from "react";
import "./admincss/ProjectType.css";
import { FiPlus, FiEdit2, FiX, FiSave } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";

import {
  fetchProjectTypes,
  createProjectType,
  updateProjectType,
} from "../../services/admin/admin.roles.api";

export default function CreateProjectTypes() {
  const [projectTypes, setProjectTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState({
    id: null,
    name: "",
    status: "ACTIVE",
  });

  /* 🔁 LOAD TYPES */
  const loadProjectTypes = async () => {
    try {
      const data = await fetchProjectTypes();
      setProjectTypes(data || []);
    } catch {
      toast.error("Failed to load project types");
    }
  };
useEffect(() => {
  let mounted = true;

  (async () => {
    try {
      const data = await fetchProjectTypes();
      if (mounted) {
        setProjectTypes(data || []);
      }
    } catch {
      toast.error("Failed to load project types");
    }
  })();

  return () => {
    mounted = false;
  };
}, []);


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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.warn("Project type name is required");
      return;
    }

    try {
      if (isEdit) {
        await updateProjectType(form.id, {
          name: form.name.trim(),
          status: form.status,
        });
        toast.success("Project type updated");
      } else {
        await createProjectType({
          name: form.name.trim(),
          status: form.status,
        });
        toast.success("Project type created");
      }

      setShowModal(false);
      loadProjectTypes();
    } catch (err) {
      toast.error(err.message || "Action failed");
    }
  };

  return (
    <div className="project-types-container">
      <ToastContainer autoClose={1500} />

      {/* HEADER */}
      <div className="project-types-header">
        <h2 className="project-types-title">Project Types Master</h2>
        <button className="primary-btn" onClick={openAddModal}>
          <FiPlus size={16} /> Add Project Type
        </button>
      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        <table className="project-types-table">
          <thead>
            <tr>
              <th>Project Type</th>
              <th>Status</th>
              <th className="center">Action</th>
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
                  <td>{type.name}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        type.status === "ACTIVE" ? "active" : "inactive"
                      }`}
                    >
                      {type.status}
                    </span>
                  </td>
                  <td className="center">
                    <button
                      className="icon-btn edit"
                      onClick={() => openEditModal(type)}
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
   {/* MODAL */}
{showModal && (
  <div className="modal-overlay" onClick={() => setShowModal(false)}>
    <div className="modal-box" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h3>{isEdit ? "Edit Project Type" : "Add Project Type"}</h3>
        <button onClick={() => setShowModal(false)}>
          <FiX />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Project Type Name */}
        <div className="form-group">
          <label>Project Type Name</label>
          <input
            className="form-input"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter project type"
            required
          />
        </div>

        {/* Status */}
        <div className="form-group">
          <label>Status</label>
          <select
            className="form-select"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="button" className="secondary-btn" onClick={() => setShowModal(false)}>
            Cancel
          </button>
          <button type="submit" className="primary-btn">
            <FiSave size={16} /> Save
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
}
