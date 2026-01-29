import { useEffect, useState } from "react";
import { FiPlus, FiTrash2, FiBriefcase } from "react-icons/fi"; // Added FiBriefcase for icon
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  fetchDepartments,
  createDepartment,
  deleteDepartment,
} from "../../services/department.api";

import "../CSS/department.css";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      const data = await fetchDepartments();
      if (isMounted) {
        setDepartments(data || []);
        setLoading(false);
      }
    };

    load();
    return () => (isMounted = false);
  }, []);

  const reloadDepartments = async () => {
    const data = await fetchDepartments();
    setDepartments(data || []);
  };

  /* ✅ ADD */
  const handleAdd = async () => {
    if (!name.trim()) return;

    try {
      await createDepartment(name.trim());
      setName("");
      await reloadDepartments();

      toast.success("Department created successfully", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "light",
      });
    } catch {
      toast.error("Failed to create department");
    }
  };

  /* ✅ DELETE */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this department?")) return;

    try {
      await deleteDepartment(id);
      await reloadDepartments();

      toast.success("Department deleted successfully", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        pauseOnHover: false,
        theme: "light",
      });
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="dept-wrapper">
      <ToastContainer newestOnTop />

      <div className="dept-header">
        <h2 className="dept-title">Departments</h2>
        <p className="dept-subtitle">Manage organization departments</p>
      </div>

      {/* Add Form */}
      <div className="dept-add-card">
        <input
          type="text"
          placeholder="Department name (e.g. AI, Full Stack)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button onClick={handleAdd} className="dept-add-btn">
          <FiPlus />
          Add
        </button>
      </div>

      {/* Departments List */}
      {loading ? (
        <div className="dept-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="dept-card dept-skeleton">
              <div className="dept-skeleton-avatar"></div>
              <div className="dept-skeleton-line"></div>
            </div>
          ))}
        </div>
      ) : departments.length === 0 ? (
        <div className="dept-empty">
          <FiBriefcase className="dept-empty-icon" />
          <p>No departments found</p>
        </div>
      ) : (
        <div className="dept-grid">
          {departments.map((d, i) => (
            <div key={d.id} className="dept-card">
              <div className="dept-card-header">
                <div className="dept-avatar">
                  <FiBriefcase />
                </div>
                <div className="dept-info">
                  <span className="dept-index">#{i + 1}</span>
                  <h3 className="dept-name">{d.name}</h3>
                </div>
              </div>
              <button
                className="dept-delete-btn"
                onClick={() => handleDelete(d.id)}
                title="Delete"
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}