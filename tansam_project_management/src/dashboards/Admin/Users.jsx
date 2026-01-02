import { useEffect, useState } from "react";
import "./admincss/User.css";
import { FiPlus, FiX, FiSave } from "react-icons/fi";

const ROLES = ["COORDINATOR", "TL", "FINANCE", "CEO"];
const LABS = ["Lab A", "Lab B", "Lab C"];

export default function Users() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    role: "",
    lab: "",
    password: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    setUsers([
      {
        id: 1,
        name: "John Doe",
        mobile: "9876543210",
        email: "john@test.com",
        role: "COORDINATOR",
        lab: "Lab A",
        status: "ACTIVE",
      },
    ]);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.mobile || !form.email || !form.role) {
      alert("Please fill all required fields");
      return;
    }

    setUsers([...users, { ...form, id: Date.now() }]);
    setShowModal(false);

    setForm({
      name: "",
      mobile: "",
      email: "",
      role: "",
      lab: "",
      password: "",
      status: "ACTIVE",
    });
  };

  return (
    <div className="users-container">
      {/* HEADER */}
      <div className="users-header">
        <h2 className="users-title">User Management</h2>

        <button className="primary-btn" onClick={() => setShowModal(true)}>
          <FiPlus size={16} />
          Add User
        </button>
      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Role</th>
              <th>Lab</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-text">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.mobile}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.lab || "-"}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        u.status === "ACTIVE" ? "active" : "inactive"
                      }`}
                    >
                      {u.status}
                    </span>
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
              <h3>Add User</h3>
              <button
                className="icon-btn"
                onClick={() => setShowModal(false)}
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label className="form-label">Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter full name"
              />

              <label className="form-label">Mobile Number</label>
              <input
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter mobile number"
              />

              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter email"
              />

              <label className="form-label">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select role</option>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>

              <label className="form-label">Lab</label>
              <select
                name="lab"
                value={form.lab}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select lab</option>
                {LABS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>

              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter password"
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
