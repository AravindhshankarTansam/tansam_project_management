import { useEffect, useState } from "react";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProjectTypes.css";

import {
  fetchProjectTypes,
  createProjectType,
  updateProjectType,
  deleteProjectType,
} from "../../services/projectType.api";

export default function ProjectTypes() {
  const [types, setTypes] = useState([]);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ✅ SAFE useEffect (NO ESLINT ERROR) */
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const data = await fetchProjectTypes();
        if (mounted) {
          setTypes(data || []);
          setLoading(false);
        }
      } catch {
        toast.error("Failed to load project types");
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  /* 🔁 Reload helper (used OUTSIDE useEffect only) */
  const reloadTypes = async () => {
    const data = await fetchProjectTypes();
    setTypes(data || []);
  };

  /* ✅ ADD / UPDATE */
  const handleSave = async () => {
    if (!name.trim()) {
      toast.warn("Enter project type name");
      return;
    }

    try {
      if (editing) {
        await updateProjectType(editing.id, {
          name: name.trim(),
          status: editing.status || "ACTIVE",
        });
        toast.success("Project type updated");
      } else {
        await createProjectType({ name: name.trim() });
        toast.success("Project type created");
      }

      setName("");
      setEditing(null);
      reloadTypes();
    } catch {
      toast.error("Action failed");
    }
  };

  /* ❌ DELETE */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project type?")) return;

    try {
      await deleteProjectType(id);
      toast.success("Project type deleted");
      reloadTypes();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="project-type-page">
      <ToastContainer position="top-right" autoClose={1500} newestOnTop />

      <div className="page-header">
        <h2>Project Types</h2>
        <p className="subtitle">Manage project categories</p>
      </div>

      {/* ADD / EDIT */}
      <div className="type-form">
        <input
          placeholder="Project type name (e.g. Web Development)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
        <button onClick={handleSave}>
          <FiPlus />
          {editing ? "Update" : "Add"}
        </button>
      </div>

      {/* LIST */}
      <div className="type-list">
        {loading ? (
          <p className="empty">Loading...</p>
        ) : types.length === 0 ? (
          <p className="empty">No project types found</p>
        ) : (
          types.map((t, i) => (
            <div key={t.id} className="type-row">
              <span>{i + 1}. {t.name}</span>

              <div className="actions">
                <button
                  className="edit"
                  onClick={() => {
                    setEditing(t);
                    setName(t.name);
                  }}
                >
                  <FiEdit />
                </button>

                <button
                  className="delete"
                  onClick={() => handleDelete(t.id)}
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
