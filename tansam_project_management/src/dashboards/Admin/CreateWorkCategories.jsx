import { useEffect, useState } from "react";
import {
  fetchWorkCategories,
  createWorkCategory,
  updateWorkCategory,
} from "../../services/admin/admin.roles.api";

export default function CreateWorkCategories() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState({
    id: null,
    name: "",
    status: "ACTIVE",
  });

  // 🔹 LOAD WORK CATEGORIES
  const loadCategories = async () => {
    try {
      const data = await fetchWorkCategories();
      setCategories(data);
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // 🔹 Open Add
  const openAddModal = () => {
    setIsEdit(false);
    setForm({ id: null, name: "", status: "ACTIVE" });
    setShowModal(true);
  };

  // 🔹 Open Edit
  const openEditModal = (category) => {
    setIsEdit(true);
    setForm(category);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Save
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Work category name is required");
      return;
    }

    try {
      if (isEdit) {
        await updateWorkCategory(form.id, {
          name: form.name,
          status: form.status,
        });
      } else {
        await createWorkCategory({
          name: form.name,
          status: form.status,
        });
      }

      setShowModal(false);
      loadCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🗂 Work Categories Master</h2>

      <button onClick={openAddModal} style={styles.addBtn}>
        ➕ Add Work Category
      </button>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Work Category</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.name}</td>
              <td>{cat.status}</td>
              <td>
                <button
                  onClick={() => openEditModal(cat)}
                  style={styles.editBtn}
                >
                  ✏️ Edit
                </button>
              </td>
            </tr>
          ))}

          {categories.length === 0 && (
            <tr>
              <td colSpan="3">No work categories found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ---------- MODAL ---------- */}
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>{isEdit ? "Edit Work Category" : "Add Work Category"}</h3>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Work Category Name"
                value={form.name}
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
    width: "360px",
    borderRadius: "4px",
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
    padding: "6px 10px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
  },
};
