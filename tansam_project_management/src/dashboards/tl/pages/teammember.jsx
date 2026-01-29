  import { useEffect, useMemo, useState } from "react";
  import {
    FiPlus,
    FiEdit,
    FiTrash2,
    FiUsers,
    FiChevronLeft,
    FiChevronRight,
  } from "react-icons/fi";
  import { ToastContainer, toast } from "react-toastify";
  import "react-toastify/dist/ReactToastify.css";

  import { fetchDepartments } from "../../../services/department.api";
  import {
    fetchMembers,
    createMember,
    deleteMember,
    updateMember,
  } from "../../../services/member.api";

import "../CSS/teammember.css";


  const MEMBERS_PER_PAGE = 8;

  const emptyForm = {
    id: null,
    name: "",
    email: "",
    designation: "",
    departmentId: "",
  };

  export default function Members() {
    const [members, setMembers] = useState([]);
    const [departments, setDepartments] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [form, setForm] = useState(emptyForm);

    const [currentPage, setCurrentPage] = useState(1);

    /* LOAD DATA */
    useEffect(() => {
      (async () => {
        try {
          const [m, d] = await Promise.all([
            fetchMembers(),
            fetchDepartments(),
          ]);
          setMembers(m || []);
          setDepartments(d || []);
        } catch {
          toast.error("Failed to load members");
        }
      })();
    }, []);

    /* PAGINATION */
    const totalPages = Math.ceil(members.length / MEMBERS_PER_PAGE);
    const paginatedMembers = useMemo(() => {
      const start = (currentPage - 1) * MEMBERS_PER_PAGE;
      return members.slice(start, start + MEMBERS_PER_PAGE);
    }, [members, currentPage]);

    const handleChange = (e) =>
      setForm({ ...form, [e.target.name]: e.target.value });

    /* OPEN MODALS */
    const openAddModal = () => {
      setIsEdit(false);
      setForm(emptyForm);
      setShowModal(true);
    };

    const openEditModal = (member) => {
      setIsEdit(true);
      setForm(member);
      setShowModal(true);
    };

    /* SUBMIT */
    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!form.name || !form.email || !form.designation || !form.departmentId) {
        toast.warn("Please fill all fields");
        return;
      }

      try {
        if (isEdit) {
          await updateMember(form.id, form);
          toast.success("Member updated");
        } else {
          await createMember(form);
          toast.success("Member created");
        }

        setMembers(await fetchMembers());
        setShowModal(false);
        setForm(emptyForm);
      } catch {
        toast.error("Action failed");
      }
    };

    /* DELETE */
    const handleDelete = async (id) => {
      if (!window.confirm("Delete this member?")) return;
      await deleteMember(id);
      setMembers(await fetchMembers());
      toast.success("Member deleted");
    };

    return (
      <div className="member-wrapper">
        <ToastContainer autoClose={1500} newestOnTop />

        {/* HEADER */}
        {/* HEADER */}
        <div className="member-header">
          <h2>Team Members</h2>

          <button className="member-add-btn-modern" onClick={openAddModal}>
            <FiPlus className="plus-icon" />
            Create Team Member
          </button>
        </div>

        {/* TABLE */}
        <div className="table-card">
          <table className="project-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                {/* <th>Designation</th> */}
                <th>Department</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedMembers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-results">
                    No members found
                  </td>
                </tr>
              ) : (
                paginatedMembers.map((m) => (
                  <tr key={m.id}>
                    <td>
                      <FiUsers /> {m.name}
                    </td>
                    <td>{m.email}</td>
                    {/* <td>{m.designation}</td> */}
                    <td>{m.department}</td>
                    <td className="action-col">
                      <button
                        className="icon-btn edit-btn"
                        onClick={() => openEditModal(m)}
                      >
                        <FiEdit />
                      </button>
                      <button
                        className="icon-btn delete-btn"
                        onClick={() => handleDelete(m.id)}
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="page-btn"
              >
                <FiChevronLeft /> Prev
              </button>

              <span className="page-number active">{currentPage}</span>

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="page-btn"
              >
                Next <FiChevronRight />
              </button>
            </div>
          )}
        </div>

        {/* MODAL */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>{isEdit ? "Edit Member" : "Create Member"}</h3>

              <form onSubmit={handleSubmit}>
                <input
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                />

                <input
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                />

                <input
                  name="designation"
                  placeholder="Designation"
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

                <div className="modal-actions">
                  <button type="button" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit">{isEdit ? "Update" : "Create"}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }
