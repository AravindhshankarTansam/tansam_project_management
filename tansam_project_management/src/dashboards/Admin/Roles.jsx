import { useState } from "react";

import "./css/role.css";
export default function Roles() {
  const [roles, setRoles] = useState([
    { id: 1, name: "COORDINATOR"},
    { id: 2, name: "TL" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState({
    id: null,
    name: "",
   
  });

  // 🔹 Open Add Role
  const openAddModal = () => {
    setIsEdit(false);
    setForm({ id: null, name: "" });
    setShowModal(true);
  };

  // 🔹 Open Edit Role
  const openEditModal = (role) => {
    setIsEdit(true);
    setForm(role);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Submit (Add / Edit)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name) {
      alert("Role name is required");
      return;
    }

    if (isEdit) {
      setRoles(
        roles.map((r) =>
          r.id === form.id ? { ...form } : r
        )
      );
    } else {
      setRoles([
        ...roles,
        { ...form, id: Date.now() },
      ]);
    }

    setShowModal(false);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🔐 Roles Master</h2>

      <button onClick={openAddModal} style={styles.addBtn}>
        ➕ Add Role
      </button>

      {/* ---------- TABLE ---------- */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Role Name</th>
          
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td>{role.name}</td>
             
              <td className="action-cell">
  <button
    className="icon-btn edit"
    onClick={() => openEditModal(role)}
    title="Edit"
  >
    ✏️
  </button>

  <button
    className="icon-btn delete"
    title="Delete"
  >
    🗑️
  </button>
</td>

            </tr>
          ))}
        </tbody>
      </table>

      {/* ---------- MODAL ---------- */}
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>{isEdit ? "Edit Role" : "Add Role"}</h3>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Role Name"
                value={form.name}
                onChange={handleChange}
                style={styles.input}
              />

              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                style={styles.textarea}
              />

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
  addBtn: {
    marginBottom: "10px",
    padding: "8px 12px",
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
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "#fff",
    padding: "20px",
    width: "400px",
    borderRadius: "4px",
  },
  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
  },
  textarea: {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
  },
  cancelBtn: {
    marginRight: "10px",
    padding: "6px 10px",
  },
  saveBtn: {
    padding: "6px 10px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
  },
};
