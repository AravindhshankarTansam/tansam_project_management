import { useEffect, useState } from "react";
import "./admincss/ClientType.css";
import { FiPlus, FiEdit2, FiX, FiSave } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";

import {
  fetchClientTypes,
  createClientType,
  updateClientType,
} from "../../services/admin/admin.roles.api";

export default function ClientType() {
  const [clientTypes, setClientTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState({
    id: null,
    name: "",
    status: "ACTIVE",
  });

  const loadClientTypes = async () => {
    try {
      const data = await fetchClientTypes();
      setClientTypes(data || []);
    } catch {
      toast.error("Failed to load client types");
    }
  };

useEffect(() => {
  let mounted = true;

  const load = async () => {
    try {
      const data = await fetchClientTypes();
      if (mounted) {
        setClientTypes(data || []);
      }
    } catch {
      toast.error("Failed to load client types");
    }
  };

  load();

  return () => {
    mounted = false;
  };
}, []);


  const openAddModal = () => {
    setIsEdit(false);
    setForm({ id: null, name: "", status: "ACTIVE" });
    setShowModal(true);
  };

  const openEditModal = (type) => {
    setIsEdit(true);
    setForm(type);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.warn("Client type name is required");
      return;
    }

    try {
      if (isEdit) {
        await updateClientType(form.id, {
          name: form.name.trim(),
          status: form.status,
        });
        toast.success("Client type updated");
      } else {
        await createClientType({
          name: form.name.trim(),
          status: form.status,
        });
        toast.success("Client type created");
      }

      setShowModal(false);
      loadClientTypes();
    } catch (err) {
      toast.error(err.message || "Action failed");
    }
  };

  return (
    <div className="client-types-container">
      <ToastContainer autoClose={1500} />

      <div className="client-types-header">
        <h2>Client Types Master</h2>
        <button className="primary-btn" onClick={openAddModal}>
          <FiPlus /> Add Client Type
        </button>
      </div>

      <div className="table-wrapper">
        <table className="client-types-table">
          <thead>
            <tr>
              <th>Client Type</th>
              <th>Status</th>
              <th className="center">Action</th>
            </tr>
          </thead>
          <tbody>
            {clientTypes.length === 0 ? (
              <tr>
                <td colSpan="3" className="empty-text">
                  No client types found
                </td>
              </tr>
            ) : (
              clientTypes.map((type) => (
                <tr key={type.id}>
                  <td>{type.name}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        type.status === "ACTIVE" ? "active" : "inactive"
                      }`}
                    >
                      {type.status}
                    </span>
                  </td>
                  <td className="center">
                    <button
                      className="icon-btn edit"
                      onClick={() => openEditModal(type)}
                    >
                      <FiEdit2 />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{isEdit ? "Edit Client Type" : "Add Client Type"}</h3>
              <button onClick={() => setShowModal(false)}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Client Type Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter client type"
                  required
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit">
                  <FiSave /> Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
