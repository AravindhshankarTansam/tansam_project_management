import { useState, useEffect } from "react";

export default function Users() {
  const [showUserModal, setShowUserModal] = useState(false);
  const [userForm, setUserForm] = useState({ role: "", username: "", password: "" });
  const [users, setUsers] = useState([]);
  const API_BASE = 'http://localhost:5000';

  // GET /api/users
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/users`);
      const data = await res.json();
      setUsers(data);
    } catch {
      console.error('Backend not running');
    }
  };

  // POST /api/users
  const handleUserSubmit = async () => {
    if (!userForm.role || !userForm.username || !userForm.password) {
      alert("Please fill all fields");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm)
      });
      if (res.ok) {
        setUserForm({ role: "", username: "", password: "" });
        setShowUserModal(false);
        fetchUsers(); // Refresh list
      } else {
        const data = await res.json();
        alert(data.msg);
      }
    } catch {
      alert('Server error');
    }
  };

  const deleteUser = async (id) => {
    if (confirm("Are you sure?")) {
      await fetch(`${API_BASE}/api/users/${id}`, { method: 'DELETE' });
      fetchUsers();
    }
  };

  return (
    <>
      <div className="header">
        <h2>User Management</h2>
        <button className="add-btn" onClick={() => setShowUserModal(true)}>
          ➕ Add User
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Role</th>
              <th>Username</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan="5" className="no-data">No users found. Create first admin user!</td></tr>
            ) : (
              users.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td><span className="role-badge">{user.role}</span></td>
                  <td>{user.username}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                    <button className="action-btn delete" onClick={() => deleteUser(user.id)}>
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* User Modal */}
      {showUserModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add User</h3>
            <div className="form-group">
              <label>Role</label>
              <select value={userForm.role} onChange={(e) => setUserForm({...userForm, role: e.target.value})}>
                <option value="">Select Role</option>
                <option value="Coordinator">Coordinator</option>
                <option value="Team Lead">Team Lead</option>
                <option value="Finance">Finance</option>
                <option value="CEO">CEO / MD</option>
              </select>
            </div>
            <div className="form-group">
              <label>Username</label>
              <input
                value={userForm.username}
                onChange={(e) => setUserForm({...userForm, username: e.target.value})}
                placeholder="Enter username"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={userForm.password}
                onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                placeholder="Enter password"
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleUserSubmit}>Create User</button>
              <button onClick={() => setShowUserModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
