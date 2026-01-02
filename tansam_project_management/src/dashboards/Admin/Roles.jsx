import { useEffect, useState } from "react";
import {
  fetchRoles,
  createRole,
  updateRole,
} from "./../../services/admin/admin.roles.api";
import "./admincss/Roles.css";

import { FiPlus, FiEdit2, FiX, FiSave } from "react-icons/fi";

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState({
    id: null,
    name: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const data = await fetchRoles();
      setRoles(data || []);
    } catch (err) {
      alert(err.message);
    }
  };

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

    if (!form.name.trim()) {
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

  return (
    <div className="roles-container">
      {/* HEADER */}
      <div className="roles-header">
        <h2 className="roles-title">Roles Master</h2>

        <button className="primary-btn" onClick={openAddModal}>
          <FiPlus size={16} />
          Add Role
        </button>
      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        <table className="roles-table">
          <thead>
            <tr>
              <th className="col-name">Role Name</th>
              <th className="col-status">Status</th>
              <th className="col-action center">Action</th>
            </tr>
          </thead>

          <tbody>
            {roles.length === 0 ? (
              <tr>
                <td colSpan="3" className="empty-text">
                  No roles found
                </td>
              </tr>
            ) : (
              roles.map((role) => (
                <tr key={role.id}>
                  <td className="col-name">{role.name}</td>

                  <td className="col-status">
                    <span
                      className={`status-badge ${
                        role.status === "ACTIVE" ? "active" : "inactive"
                      }`}
                    >
                      {role.status}
                    </span>
                  </td>

                  <td className="col-action center">
                    <button
                      className="icon-btn"
                      onClick={() => openEditModal(role)}
                      title="Edit Role"
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
              <h3>{isEdit ? "Edit Role" : "Add Role"}</h3>
              <button
                className="icon-btn"
                onClick={() => setShowModal(false)}
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label className="form-label">Role Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter role name"
              />

              {isEdit && (
                <>
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
                </>
              )}

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
