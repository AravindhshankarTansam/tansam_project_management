import { useEffect, useState } from "react";
import { FiPlus, FiTrash2, FiUsers } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { fetchDepartments } from "../../services/department.api";
import {
  fetchMembers,
  createMember,
  deleteMember,
} from "../../services/member.api";

import "./teammember.css";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    designation: "",
    departmentId: "",
  });

  /* LOAD DATA */
  useEffect(() => {
    let mounted = true;

    Promise.all([fetchMembers(), fetchDepartments()])
      .then(([m, d]) => {
        if (mounted) {
          setMembers(m || []);
          setDepartments(d || []);
          setLoading(false);
        }
      })
      .catch(() => {
        toast.error("Failed to load members");
        setLoading(false);
      });

    return () => (mounted = false);
  }, []);

  const reloadMembers = async () => {
    const data = await fetchMembers();
    setMembers(data || []);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ADD MEMBER */
  const handleAdd = async () => {
    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.designation.trim() ||
      !form.departmentId
    ) {
      toast.warn("Please fill all fields");
      return;
    }

    try {
      await createMember({
        name: form.name.trim(),
        email: form.email.trim(),
        designation: form.designation.trim(),
        departmentId: Number(form.departmentId),
      });

      toast.success("Member created successfully");
      setForm({
        name: "",
        email: "",
        designation: "",
        departmentId: "",
      });
      reloadMembers();
    } catch {
      toast.error("Failed to create member");
    }
  };

  /* DELETE */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this member?")) return;

    try {
      await deleteMember(id);
      toast.success("Member deleted");
      reloadMembers();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="member-wrapper">
      <ToastContainer newestOnTop autoClose={2000} />

      <div className="member-header">
        <h2 className="member-title">Team Members</h2>
        <p className="member-subtitle">Manage organization members</p>
      </div>

      {/* ADD CARD */}
      <div className="member-add-card">
        <input
          placeholder="Full Name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          placeholder="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          placeholder="Designation (Developer / QA)"
          name="designation"
          value={form.designation}
          onChange={handleChange}
        />

        <select
          name="departmentId"
          value={form.departmentId}
          onChange={handleChange}
        >
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <button className="member-add-btn" onClick={handleAdd}>
          <FiPlus /> Add
        </button>
      </div>

      {/* LIST */}
      {loading ? (
        <div className="member-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="member-card member-skeleton">
              <div className="member-avatar-skel" />
              <div className="member-line-skel" />
            </div>
          ))}
        </div>
      ) : members.length === 0 ? (
        <div className="member-empty">
          <FiUsers className="member-empty-icon" />
          <p>No members found</p>
        </div>
      ) : (
        <div className="member-grid">
          {members.map((m) => (
            <div key={m.id} className="member-card">
              <div className="member-card-left">
                <div className="member-avatar">
                  <FiUsers />
                </div>
                <div>
                  <h3>{m.name}</h3>
                  <p>{m.designation}</p>
                  <span className="member-dept">{m.department}</span>
                </div>
              </div>

              <button
                className="member-delete-btn"
                onClick={() => handleDelete(m.id)}
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
