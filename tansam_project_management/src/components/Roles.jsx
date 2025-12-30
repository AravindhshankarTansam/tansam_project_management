import { useState, useEffect } from "react";

export default function Roles() {
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roleName, setRoleName] = useState("");
  const [roles, setRoles] = useState([]);
  const API_BASE = 'http://localhost:5000';

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    const res = await fetch(`${API_BASE}/api/roles`);
    const data = await res.json();
    setRoles(data);
  };

  const handleRoleSubmit = async () => {
    if (!roleName.trim()) {
      alert("Role name required");
      return;
    }
    try {
      const method = editingRole ? 'PUT' : 'POST';
      const url = editingRole ? `${API_BASE}/api/roles/${editingRole}` : `${API_BASE}/api/roles`;
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: roleName })
      });
      
      if (res.ok) {
        setRoleName("");
        setShowRoleModal(false);
        setEditingRole(null);
        fetchRoles();
      } else {
        const data = await res.json();
        alert(data.msg);
      }
    } catch {
      alert('Server error');
    }
  };

  const deleteRole = async (id) => {
    if (confirm("Are you sure?")) {
      await fetch(`${API_BASE}/api/roles/${id}`, { method: 'DELETE' });
      fetchRoles();
    }
  };

  const editRole = (role) => {
    setEditingRole(role.id);
    setRoleName(role.name);
    setShowRoleModal(true);
  };

  return (
    <>
      <div className="header">
        <h2>Role Management</h2>
        <button className="add-btn" onClick={() => setShowRoleModal(true)}>
          ➕ Add Role
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Role Name</th>
              <th>Permissions</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role, index) => (
              <tr key={role.id}>
                <td>{index + 1}</td>
                <td><strong>{role.name}</strong></td>
                <td>{JSON.parse(role.permissions).join(", ")}</td>
                <td>
                  <button className="action-btn edit" onClick={() => editRole(role)}>✏️</button>
                  <button className="action-btn delete" onClick={() => deleteRole(role.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role Modal */}
      {showRoleModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingRole ? 'Edit Role' : 'Add Role'}</h3>
            <div className="form-group">
              <label>Role Name</label>
              <input
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="Enter role name"
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleRoleSubmit}>
                {editingRole ? 'Update' : 'Create'} Role
              </button>
              <button onClick={() => {
                setShowRoleModal(false);
                setEditingRole(null);
                setRoleName("");
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
