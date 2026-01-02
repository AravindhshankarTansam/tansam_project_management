import { useEffect, useState } from "react";
import {
  fetchLabs,
  createLab,
  updateLab,
} from "../../services/admin/admin.roles.api";

export default function Labs() {
  const [labs, setLabs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState({
    id: null,
    name: "",
    status: "ACTIVE",
  });

  // 🔹 LOAD LABS
  const loadLabs = async () => {
    try {
      const data = await fetchLabs();
      setLabs(data);
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    loadLabs();
  }, []);

  // 🔹 Open Add
  const openAddModal = () => {
    setIsEdit(false);
    setForm({ id: null, name: "", status: "ACTIVE" });
    setShowModal(true);
  };

  // 🔹 Open Edit
  const openEditModal = (lab) => {
    setIsEdit(true);
    setForm(lab);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Save
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Lab name is required");
      return;
    }

    try {
      if (isEdit) {
        await updateLab(form.id, {
          name: form.name,
          status: form.status,
        });
      } else {
        await createLab({
          name: form.name,
          status: form.status,
        });
      }

      setShowModal(false);
      loadLabs();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🏢 Labs Master</h2>

      <button onClick={openAddModal} style={styles.addBtn}>
        ➕ Add Lab
      </button>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Lab Name</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {labs.map((lab) => (
            <tr key={lab.id}>
              <td>{lab.name}</td>
              <td>{lab.status}</td>
              <td>
                <button
                  onClick={() => openEditModal(lab)}
                  style={styles.editBtn}
                >
                  ✏️ Edit
                </button>
              </td>
            </tr>
          ))}

          {labs.length === 0 && (
            <tr>
              <td colSpan="3">No labs found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ---------- MODAL ---------- */}
      {showModal && (
        <div style={styles.modal}>
          <div style={styles.modal}>
            <h3>{isEdit ? "Edit Lab" : "Add Lab"}</h3>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Lab Name"
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

/* ---------- STYLES (MISSING BEFORE) ---------- */
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
