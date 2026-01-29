import { useState, useEffect } from "react";
import { FiPlus, FiTrash2, FiEdit } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { fetchProjects } from "../../../services/project.api";
import {
  fetchAssignments,
  createAssignment,
  deleteAssignment,
  updateAssignment,
} from "../../../services/assignTeam.api";
import { fetchDepartments } from "../../../services/department.api";
import { fetchMembers } from "../../../services/member.api";

import "../CSS/AssignTeam.css";

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
};

export default function AssignTeam() {
  const [projects, setProjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [members, setMembers] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isEdit, setIsEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [sendingMail, setSendingMail] = useState(false);

  const [form, setForm] = useState({
    projectId: "",
    memberName: "",
    role: "",
    departmentId: "",
    // effort: "",
    startDate: "",
    endDate: "",
  });

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    Promise.all([
      fetchProjects(),
      fetchDepartments(),
      fetchAssignments(),
      fetchMembers(),
    ]).then(([p, d, a, m]) => {
      setProjects(p || []);
      setDepartments(d || []);
      setAssignments(a || []);
      setMembers(m || []);
      setLoading(false);
    });
  }, []);

  /* ================= HANDLERS ================= */
  const openEditModal = (assignment) => {
    setIsEdit(true);
    setEditingId(assignment.id);
    setForm({
      projectId: assignment.projectId,
      memberName: assignment.memberName,
      role: assignment.role,
      departmentId: assignment.departmentId,
      // effort: assignment.effort,
      startDate: formatDate(assignment.startDate),
      endDate: formatDate(assignment.endDate),
    });
    setShowModal(true);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();

    try {
      setSendingMail(true); // 🔥 START GLOBAL LOADER

      const payload = {
        projectId: Number(form.projectId),
        memberName: form.memberName.trim(),
        role: form.role.trim(),
        departmentId: Number(form.departmentId),
        // effort: form.effort,
        startDate: form.startDate,
        endDate: form.endDate,
      };

      if (isEdit) {
        await updateAssignment(editingId, payload);
        toast.success("Assignment updated successfully ✅");
      } else {
        await createAssignment(payload);
        toast.success("Team member assigned & mail sent ✅");
      }

      setAssignments(await fetchAssignments());
      setShowModal(false);
      setIsEdit(false);
      setEditingId(null);

      setForm({
        projectId: "",
        memberName: "",
        role: "",
        departmentId: "",
        // effort: "",
        startDate: "",
        endDate: "",
      });
    } catch {
      toast.error("Failed to assign team member ❌");
    } finally {
      setSendingMail(false); // 🔥 STOP GLOBAL LOADER
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

  /* ================= UI ================= */
  return (
    <div className="assign-page">
      {/* Toast */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />

      {/* Header */}
      <div className="assign-header">
        <h2>Assign Team Members</h2>
        <button className="assign-add-btn" onClick={() => setShowModal(true)}>
          <FiPlus className="plus-icon" />
          Assign New Member
        </button>
      </div>

      {/* Table */}
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
                {/* <th>Effort</th> */}
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
                  {/* <td>{a.effort}</td> */}
                  <td>{formatDate(a.startDate)}</td>
                  <td>{formatDate(a.endDate)}</td>
                  <td>
                    <button
                      className="assign-edit-btn"
                      onClick={() => openEditModal(a)}
                    >
                      <FiEdit />
                    </button>
                    <button
                      className="assign-delete-btn"
                      onClick={() => handleDelete(a.id)}
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
        <div
          className="assign-modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div className="assign-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{isEdit ? "Edit Assignment" : "Assign Team Member"}</h3>

            <form onSubmit={handleSave}>
              <select name="projectId" value={form.projectId} onChange={handleChange} required>
                <option value="">Select Project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.projectName}</option>
                ))}
              </select>

              <select name="memberName" value={form.memberName} onChange={handleChange} required>
                <option value="">Select Member</option>
                {members.map((m) => (
                  <option key={m.id} value={m.name}>{m.name}</option>
                ))}
              </select>

              <input name="role" placeholder="Role" value={form.role} onChange={handleChange} required />

              <select name="departmentId" value={form.departmentId} onChange={handleChange} required>
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>

              {/* <input name="effort" placeholder="Effort" value={form.effort} onChange={handleChange} required /> */}
              <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required />
              <input type="date" name="endDate" value={form.endDate} onChange={handleChange} required />

              <div className="assign-modal-actions">
                <button type="button" className="assign-cancel-btn" onClick={() => setShowModal(false)} disabled={sendingMail}>
                  Cancel
                </button>
                <button type="submit" className="assign-save-btn" disabled={sendingMail}>
                  {sendingMail ? "Sending mail..." : isEdit ? "Update Assignment" : "Assign Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🔥 GLOBAL FULL SCREEN LOADER */}
      {sendingMail && (
        <div className="global-loader-overlay">
          <div className="global-loader">
            <div className="spinner"></div>
            <p>Processing request & sending mail…</p>
          </div>
        </div>
      )}
    </div>
  );
}
