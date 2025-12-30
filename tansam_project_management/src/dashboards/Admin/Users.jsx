import { useEffect, useState } from "react";

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

  // Mock fetch
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
    <div style={{ padding: "20px" }}>
      {/* ---------- HEADER ---------- */}
      <div style={styles.header}>
        <h2>👤 User Management</h2>
        <button style={styles.addBtn} onClick={() => setShowModal(true)}>
          ➕ Add User
        </button>
      </div>

      {/* ---------- USERS TABLE ---------- */}
      <table style={styles.table}>
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
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.mobile}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.lab}</td>
              <td>{u.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ---------- MODAL ---------- */}
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Add User</h3>

            <form onSubmit={handleSubmit}>
              <input
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                style={styles.input}
              />

              <input
                name="mobile"
                placeholder="Mobile Number"
                value={form.mobile}
                onChange={handleChange}
                style={styles.input}
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                style={styles.input}
              />

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="">Select Role</option>
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>

              <select
                name="lab"
                value={form.lab}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="">Select Lab</option>
                {LABS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                style={styles.input}
              />

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                style={styles.input}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>

              <div style={{ textAlign: "right" }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.saveBtn}>
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

/* ---------- STYLES ---------- */
const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },
  addBtn: {
    padding: "8px 14px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    borderRadius: "4px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "#fff",
    padding: "20px",
    width: "400px",
    borderRadius: "6px",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
  },
  cancelBtn: {
    marginRight: "10px",
    padding: "6px 10px",
  },
  saveBtn: {
    padding: "6px 12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
  },
};
