import { useEffect, useState } from "react";
import {
  fetchUsers,
  createUser,
  updateUser,
  fetchRoles,
  fetchLabs,
} from "../../services/admin/admin.roles.api";
import { toast } from "react-toastify";

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

  // 🔹 LOAD USERS
const loadUsers = async () => {
  try {
    const data = await fetchUsers();
    setUsers(data);
  } catch (err) {
    toast.error("Failed to load users");
  }
};

  // 🔹 LOAD USERS
const loadMasters = async () => {
  try {
    const rolesData = await fetchRoles();
    const labsData = await fetchLabs();

    setRoles(rolesData.filter(r => r.status === "ACTIVE"));
    setLabs(labsData.filter(l => l.status === "ACTIVE"));
  } catch (err) {
    toast.error("Failed to load users");
  }
};

useEffect(() => {
  loadUsers();
  loadMasters();
}, []);


  // 🔹 Open Add
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

  // 🔹 Open Edit
  const openEditModal = (user) => {
    setIsEdit(true);
    setForm({ ...user, password: "" });
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Save User
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
        await createUser({
          name: form.name,
          mobile: form.mobile,
          email: form.email,
          role: form.role,
          lab: form.lab,
          password: form.password,
          status: form.status,
        });
        toast.success("User created successfully");
      }

      setShowModal(false);
      loadUsers();
    } catch (err) {
      toast.error(err.message || "Operation failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* ---------- HEADER ---------- */}
      <div style={styles.header}>
        <h2>👤 User Management</h2>
        <button style={styles.addBtn} onClick={openAddModal}>
          ➕ Add User
        </button>
      </div>

      {/* ---------- TABLE ---------- */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Mobile</th>
            <th>Email</th>
            <th>Role</th>
            <th>Lab</th>
            <th>Status</th>
            <th>Action</th>
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
              <td>{u.status}</td>
              <td>
                <button
                  style={styles.editBtn}
                  onClick={() => openEditModal(u)}
                >
                  ✏️ Edit
                </button>
              </td>
            </tr>
          ))}

          {users.length === 0 && (
            <tr>
              <td colSpan="7">No users found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ---------- MODAL ---------- */}
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>{isEdit ? "Edit User" : "Add User"}</h3>

            <form onSubmit={handleSubmit}>
              {!isEdit && (
                <>
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

                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </>
              )}

<select
  name="role"
  value={form.role}
  onChange={handleChange}
  style={styles.input}
>
  <option value="">Select Role</option>
  {roles.map((r) => (
    <option key={r.id} value={r.name}>
      {r.name}
    </option>
  ))}
</select>

<select
  name="lab"
  value={form.lab}
  onChange={handleChange}
  style={styles.input}
>
  <option value="">Select Lab</option>
  {labs.map((l) => (
    <option key={l.id} value={l.name}>
      {l.name}
    </option>
  ))}
</select>

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
    marginBottom: "15px",
  },
  addBtn: {
    padding: "8px 14px",
    background: "#16a34a",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  editBtn: {
    padding: "4px 8px",
    background: "#f59e0b",
    border: "none",
    cursor: "pointer",
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
    width: "420px",
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
