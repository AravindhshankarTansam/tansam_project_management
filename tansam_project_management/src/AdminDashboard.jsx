import { useState } from "react";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [showMaster, setShowMaster] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  const handleAddUser = () => {
    if (!role || !username || !password) {
      alert("Please fill all fields");
      return;
    }

    setUsers([...users, { role, username, password }]);
    setRole("");
    setUsername("");
    setPassword("");
    setShowModal(false);
  };

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="logo">TANSAM</h2>

        <ul className="menu">
          <li onClick={() => setShowMaster(!showMaster)}>Master Table</li>

          {showMaster && (
            <ul className="submenu">
              <li onClick={() => navigate("/roles")}>Role</li>

              <li>Department</li>
            </ul>
          )}
        </ul>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <div className="header">
          <h2>Role Management</h2>
          <button className="add-btn" onClick={() => setShowModal(true)}>
            Add User
          </button>
        </div>

        <div className="table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Role</th>
                <th>Username</th>
                <th>Password</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No users added
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{user.role}</td>
                    <td>{user.username}</td>
                    <td>{user.password}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add User</h3>

            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">Select Role</option>
              <option>Coordinator</option>
              <option>Team Lead</option>
              <option>Finance</option>
              <option>CEO / MD</option>
            </select>

            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />

            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />

            <div className="modal-actions">
              <button className="save-btn" onClick={handleAddUser}>
                Save
              </button>
              <button className="cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}