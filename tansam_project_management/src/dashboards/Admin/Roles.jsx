import { useEffect, useState } from "react";
import {
  fetchRoles,
  createRole,
  updateRole,
} from "./../../services/admin/admin.roles.api";
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

  // 🔹 Load roles on page load
  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const data = await fetchRoles();
      setRoles(data);
    } catch (err) {
      alert(err.message);
    }
  };

  // 🔹 Open Add
  const openAddModal = () => {
    setIsEdit(false);
    setForm({ id: null, name: "", status: "ACTIVE" });
    setShowModal(true);
  };

  // 🔹 Open Edit
  const openEditModal = (role) => {
    setIsEdit(true);
    setForm(role);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Submit
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

return (
  <div className="roles-container">
    <h2 className="roles-title"> Roles Master</h2>

    <button onClick={openAddModal} className="add-btn">
      ➕ Add Role
    </button>

    {/* TABLE */}
    <table className="roles-table">
      <thead>
        <tr>
          <th>Role Name</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {roles.map((role) => (
          <tr key={role.id}>
            <td>{role.name}</td>
            <td>{role.status}</td>
            <td>
              <button
                onClick={() => openEditModal(role)}
                className="edit-btn"
              >
                ✏️ Edit
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* MODAL */}
    {showModal && (
      <div className="modal-overlay">
        <div className="modal-box">
          <h3 className="modal-title">
            {isEdit ? "Edit Role" : "Add Role"}
          </h3>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Role Name"
              value={form.name}
              onChange={handleChange}
              className="form-input"
            />

            {isEdit && (
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            )}

            <div className="form-actions">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
              <button type="submit" className="save-btn">
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
