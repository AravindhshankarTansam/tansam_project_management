import { useState, useEffect } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { fetchProjects } from "../../services/project.api";
import {
  fetchAssignments,
  createAssignment,
  deleteAssignment,
} from "../../services/assignTeam.api";
import { fetchDepartments } from "../../services/department.api";

import "./AssignTeam.css";

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

export default function AssignTeam() {
  const [projects, setProjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    projectId: "",
    memberName: "",
    role: "",
    departmentId: "",
    effort: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    Promise.all([
      fetchProjects(),
      fetchDepartments(),
      fetchAssignments(),
    ])
      .then(([projs, depts, assigns]) => {
        setProjects(projs || []);
        setDepartments(depts || []);
        setAssignments(assigns || []);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load data");
        setLoading(false);
      });
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      await createAssignment({
        projectId: Number(form.projectId),
        memberName: form.memberName.trim(),
        role: form.role.trim(),
        departmentId: Number(form.departmentId),
        effort: form.effort,
        startDate: form.startDate,
        endDate: form.endDate,
      });

      const updated = await fetchAssignments();
      setAssignments(updated);
      toast.success("Team member assigned successfully!");
      setShowModal(false);
      setForm({
        projectId: "",
        memberName: "",
        role: "",
        departmentId: "",
        effort: "",
        startDate: "",
        endDate: "",
      });
    } catch {
      toast.error("Failed to assign member");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this team member?")) return;

    try {
      await deleteAssignment(id);
      setAssignments(assignments.filter((a) => a.id !== id));
      toast.success("Member removed");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="assign-page">
      <ToastContainer position="top-right" autoClose={1500} theme="light" newestOnTop />

      {/* Header */}
      <div className="assign-header">
        <h2>Assign Team Members</h2>
        <button className="assign-add-btn" onClick={() => setShowModal(true)}>
          <FiPlus className="plus-icon" />
          Assign New Member
        </button>
      </div>

      {/* Table Card */}
      <div className="assign-table-card">
        {loading ? (
          <div className="assign-loading">Loading assignments...</div>
        ) : assignments.length === 0 ? (
          <div className="assign-empty">
            <p>No team members assigned yet</p>
          </div>
        ) : (
          <table className="assign-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Member</th>
                <th>Role</th>
                <th>Department</th>
                <th>Effort</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => (
                <tr key={a.id}>
                  <td>{a.projectName}</td>
                  <td><strong>{a.memberName}</strong></td>
                  <td>{a.role}</td>
                  <td>{a.department}</td>
                  <td>{a.effort}</td>
                  <td>{formatDate(a.startDate)}</td>
                  <td>{formatDate(a.endDate)}</td>
                  <td>
                    <button
                      className="assign-delete-btn"
                      onClick={() => handleDelete(a.id)}
                      title="Remove member"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="assign-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="assign-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Assign Team Member</h3>

            <form onSubmit={handleSave}>
              <select
                name="projectId"
                value={form.projectId}
                onChange={handleChange}
                required
              >
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.projectName}
                  </option>
                ))}
              </select>

              <input
                name="memberName"
                placeholder="Member Name"
                value={form.memberName}
                onChange={handleChange}
                required
              />

              <input
                name="role"
                placeholder="Role (e.g. Developer, Designer)"
                value={form.role}
                onChange={handleChange}
                required
              />

              <select
                name="departmentId"
                value={form.departmentId}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>

              <input
                name="effort"
                placeholder="Effort (e.g. 40h, 5 days)"
                value={form.effort}
                onChange={handleChange}
                required
              />

              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
              />

              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                required
              />

              <div className="assign-modal-actions">
                <button
                  type="button"
                  className="assign-cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="assign-save-btn">
                  Assign Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}