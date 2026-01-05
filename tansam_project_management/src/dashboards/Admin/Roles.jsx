import { useEffect, useState } from "react";
import {
  fetchRoles,
  createRole,
  updateRole,
} from "./../../services/admin/admin.roles.api";
import { FiPlus, FiEdit, FiX, FiSave } from "react-icons/fi";
import "./admincss/Roles.css";

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState({
    id: null,
    name: "",
    status: "ACTIVE",
  });

  /* ================= LOAD ROLES ================= */
  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setRoles(await fetchRoles());
    } catch (err) {
      alert(err.message);
    }
  };

  /* ================= HANDLERS ================= */
  const openAddModal = () => {
    setIsEdit(false);
    setForm({ id: null, name: "", status: "ACTIVE" });
    setShowModal(true);
  };

  const openEditModal = (role) => {
    setIsEdit(true);
    setForm(role);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name) {
      alert("Role name is required");
      return;
    }

    try {
      if (isEdit) {
        await updateRole(form.id, {
          name: form.name,
          status: form.status,
        });
      } else {
        await createRole(form.name);
      }
      setShowModal(false);
      loadRoles();
    } catch (err) {
      alert(err.message);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="roles-container">
      {/* HEADER */}
      <div className="roles-header">
        <h2>ROLES MASTER</h2>
        <button className="primary-btn" onClick={openAddModal}>
          <FiPlus /> Add Role
        </button>
      </div>

      {/* TABLE */}
      <table className="roles-table">
        <thead>
          <tr>
            <th>Role Name</th>
            <th>Status</th>
            <th style={{ textAlign: "center" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td>{role.name}</td>
              <td>
                <span className={`status ${role.status.toLowerCase()}`}>
                  {role.status}
                </span>
              </td>
              <td style={{ textAlign: "center" }}>
                <button
                  className="icon-btn"
                  onClick={() => openEditModal(role)}
                >
                  <FiEdit />
                </button>
              </td>
            </tr>
          ))}

          {roles.length === 0 && (
            <tr>
              <td colSpan="3" className="empty">
                No roles found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>{isEdit ? "Edit Role" : "Add Role"}</h3>
              <button
                className="icon-btn"
                onClick={() => setShowModal(false)}
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              <input
                type="text"
                name="name"
                placeholder="Role Name"
                value={form.name}
                onChange={handleChange}
              />

              {isEdit && (
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  <FiSave /> Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
