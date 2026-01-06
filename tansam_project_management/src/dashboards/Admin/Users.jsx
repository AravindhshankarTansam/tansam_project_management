import { useEffect, useState } from "react";
import {
  fetchUsers,
  createUser,
  updateUser,
  fetchRoles,
  fetchLabs,
} from "../../services/admin/admin.roles.api";
import { toast } from "react-toastify";

import { FiUserPlus, FiEdit, FiX, FiSave } from "react-icons/fi";
import "./admincss/User.css";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [roles, setRoles] = useState([]);
  const [labs, setLabs] = useState([]);

  const [form, setForm] = useState({
    id: null,
    name: "",
    mobile: "",
    email: "",
    role: "",
    lab: "",
    password: "",
    status: "ACTIVE",
  });

  const loadUsers = async () => {
    try {
      setUsers(await fetchUsers());
    } catch {
      toast.error("Failed to load users");
    }
  };

  const loadMasters = async () => {
    try {
      setRoles((await fetchRoles()).filter(r => r.status === "ACTIVE"));
      setLabs((await fetchLabs()).filter(l => l.status === "ACTIVE"));
    } catch {
      toast.error("Failed to load master data");
    }
  };

  useEffect(() => {
    loadUsers();
    loadMasters();
  }, []);

  const openAddModal = () => {
    setIsEdit(false);
    setForm({
      id: null,
      name: "",
      mobile: "",
      email: "",
      role: "",
      lab: "",
      password: "",
      status: "ACTIVE",
    });
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setIsEdit(true);
    setForm({ ...user, password: "" });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.mobile || !form.email || !form.role) {
      toast.warning("Please fill all required fields");
      return;
    }

    try {
      if (isEdit) {
        await updateUser(form.id, {
          role: form.role,
          lab: form.lab,
          status: form.status,
        });
        toast.success("User updated successfully");
      } else {
        await createUser(form);
        toast.success("User created successfully");
      }
      setShowModal(false);
      loadUsers();
    } catch (err) {
      toast.error(err.message || "Operation failed");
    }
  };

  return (
    <div className="users-container">
      {/* PAGE HEADER */}
      <div className="page-header">
        <div>
          <h2>User Management</h2>
          <p className="page-sub">
            Create, update and manage application users
          </p>
        </div>

        <button className="primary-btn" onClick={openAddModal}>
          <FiUserPlus /> Add User
        </button>
      </div>

      {/* TABLE CARD */}
      <div className="table-card">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Role</th>
              <th>Lab</th>
              <th>Status</th>
              <th style={{ textAlign: "center" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.mobile}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.lab || "-"}</td>
                <td>
                  <span className={`status ${u.status.toLowerCase()}`}>
                    {u.status}
                  </span>
                </td>
                <td style={{ textAlign: "center" }}>
                  <button
                    className="icon-btn"
                    onClick={() => openEditModal(u)}
                  >
                    <FiEdit />
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan="7" className="empty">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>{isEdit ? "Edit User" : "Add User"}</h3>
              <button
                className="icon-btn"
                onClick={() => setShowModal(false)}
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-body">
              {!isEdit && (
                <>
                  <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} />
                  <input name="mobile" placeholder="Mobile Number" value={form.mobile} onChange={handleChange} />
                  <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} />
                  <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} />
                </>
              )}

              <select name="role" value={form.role} onChange={handleChange}>
                <option value="">Select Role</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.name}>{r.name}</option>
                ))}
              </select>

              <select name="lab" value={form.lab} onChange={handleChange}>
                <option value="">Select Lab</option>
                {labs.map((l) => (
                  <option key={l.id} value={l.name}>{l.name}</option>
                ))}
              </select>

              <select name="status" value={form.status} onChange={handleChange}>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>

              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={() => setShowModal(false)}>
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
