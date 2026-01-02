import { useState } from "react";
import "./admincss/Lab.css";
import { FiPlus, FiEdit2, FiX, FiSave } from "react-icons/fi";

export default function Labs() {
  const [labs, setLabs] = useState([
    { id: 1, name: "Lab A", status: "ACTIVE" },
    { id: 2, name: "Lab B", status: "INACTIVE" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState({
    id: null,
    name: "",
    status: "ACTIVE",
  });

  const openAddModal = () => {
    setIsEdit(false);
    setForm({ id: null, name: "", status: "ACTIVE" });
    setShowModal(true);
  };

  const openEditModal = (lab) => {
    setIsEdit(true);
    setForm(lab);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Lab name is required");
      return;
    }

    if (isEdit) {
      setLabs(labs.map((l) => (l.id === form.id ? { ...form } : l)));
    } else {
      setLabs([...labs, { ...form, id: Date.now() }]);
    }

    setShowModal(false);
  };

  return (
    <div className="labs-container">
      {/* HEADER */}
      <div className="labs-header">
        <h2 className="labs-title">Labs Master</h2>

        <button className="primary-btn" onClick={openAddModal}>
          <FiPlus size={16} />
          Add Lab
        </button>
      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        <table className="labs-table">
          <thead>
            <tr>
              <th className="col-name">Lab Name</th>
              <th className="col-status">Status</th>
              <th className="col-action center">Action</th>
            </tr>
          </thead>
          <tbody>
            {labs.length === 0 ? (
              <tr>
                <td colSpan="3" className="empty-text">
                  No labs found
                </td>
              </tr>
            ) : (
              labs.map((lab) => (
                <tr key={lab.id}>
                  <td className="col-name">{lab.name}</td>
                  <td className="col-status">
                    <span
                      className={`status-badge ${
                        lab.status === "ACTIVE" ? "active" : "inactive"
                      }`}
                    >
                      {lab.status}
                    </span>
                  </td>
                  <td className="col-action center">
                    <button
                      className="icon-btn edit"
                      onClick={() => openEditModal(lab)}
                      title="Edit Lab"
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

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3>{isEdit ? "Edit Lab" : "Add Lab"}</h3>
              <button className="icon-btn" onClick={() => setShowModal(false)}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label className="form-label">Lab Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter lab name"
              />

              <label className="form-label">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-btn">
                  <FiSave size={16} />
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
