import { useState } from "react";

export default function Roles() {
  const [roles, setRoles] = useState([
    { id: 1, name: "COORDINATOR", description: "Handles enquiries" },
    { id: 2, name: "TL", description: "Team Lead approval" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState({
    id: null,
    name: "",
    description: "",
  });

  // 🔹 Open Add Role
  const openAddModal = () => {
    setIsEdit(false);
    setForm({ id: null, name: "", description: "" });
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
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td>{role.name}</td>
              <td>{role.description}</td>
              <td>
                <button
                  onClick={() => openEditModal(role)}
                  style={styles.editBtn}
                >
                  ✏️ Edit
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
