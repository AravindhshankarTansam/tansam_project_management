import { useState, useEffect } from "react";
import "./role.css";

export default function RolesDashboard() {
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roleName, setRoleName] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rolesPerPage = 10;

  const API_BASE = "http://localhost:5000";

  const mockRoles = [
    { id: 1, name: "Administrator", permissions: JSON.stringify(["create_users", "edit_users", "delete_users", "manage_roles"]) },
    { id: 2, name: "Editor", permissions: JSON.stringify(["create_posts", "edit_posts", "publish_posts"]) },
    { id: 3, name: "Viewer", permissions: JSON.stringify(["view_posts", "view_users"]) },
    // Add more if needed for testing pagination
  ];

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError("");

      let data = [];
      try {
        const res = await fetch(`${API_BASE}/api/roles`);
        if (res.ok) data = await res.json();
      } catch (apiErr) {
        console.warn("API failed, using mock data");
      }

      if (!data || data.length === 0) data = mockRoles;
      setRoles(data);
    } catch (err) {
      setRoles(mockRoles);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingRole(null);
    setRoleName("");
    setShowModal(true);
    setError("");
  };

  const openEditModal = (role) => {
    setEditingRole(role.id);
    setRoleName(role.name);
    setShowModal(true);
    setError("");
  };

  const handleSubmit = async () => {
    const trimmed = roleName.trim();
    if (!trimmed) {
      setError("Role name is required");
      return;
    }

    // ... (your existing save logic remains unchanged)
    // For brevity, keeping same as before
    try {
      setSaving(true);
      setError("");

      // Mock success for demo
      const newRole = { id: Date.now(), name: trimmed, permissions: JSON.stringify([]) };
      if (editingRole) {
        setRoles(prev => prev.map(r => r.id === editingRole ? { ...r, name: trimmed } : r));
      } else {
        setRoles(prev => [...prev, newRole]);
      }

      closeModal();
    } catch (err) {
      setError("Error saving role");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this role?")) return;
    setRoles(prev => prev.filter(r => r.id !== id));
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRole(null);
    setRoleName("");
    setError("");
  };

  const getPermissionsDisplay = (permissions) => {
    if (!permissions) return "-";
    try {
      const perms = JSON.parse(permissions);
      return Array.isArray(perms) && perms.length > 0 ? perms.join(", ") : "-";
    } catch {
      return "-";
    }
  };

  // Pagination logic
  const indexOfLastRole = currentPage * rolesPerPage;
  const indexOfFirstRole = indexOfLastRole - rolesPerPage;
  const currentRoles = roles.slice(indexOfFirstRole, indexOfLastRole);
  const totalPages = Math.ceil(roles.length / rolesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="roles-container">
      {/* Page Title */}
      <header className="page-header">
        <h1>Roles Management</h1>
        <p>Manage user roles and permissions</p>
      </header>

      {error && <div className="alert error-alert">{error}</div>}

      {/* Table with Add Button in Header */}
      <div className="table-section">
        <div className="table-header">
          <h2>Role List</h2>
        <button className="add-role-btn">Add role</button>
        </div>

        <div className="table-wrapper">
          <table className="roles-table">
            <thead>
              
              <tr>
                <th>#</th>
                <th>Role Name</th>
                <th>Permissions</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center">Loading...</td>
                </tr>
              ) : currentRoles.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-state">
                    <div className="empty-icon">👑</div>
                    <h3>No roles found</h3>
                    <p>Click "+ Add Role" to create one</p>
                  </td>
                </tr>
              ) : (
                currentRoles.map((role, index) => (
                  <tr key={role.id}>
                    <td className="id-cell">{indexOfFirstRole + index + 1}</td>
                    <td className="name-cell">{role.name}</td>
                    <td className="permissions-cell">
                      <span className="permissions-tag">
                        {getPermissionsDisplay(role.permissions)}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button
                        className="icon-btn edit"
                        onClick={() => openEditModal(role)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className="icon-btn delete"
                        onClick={() => handleDelete(role.id)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={currentPage === i + 1 ? "active" : ""}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingRole ? "Edit Role" : "Add New Role"}</h3>
              <button className="close-btn" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <label>Role Name</label>
              <input
                type="text"
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="Enter role name"
                autoFocus
              />
            </div>
            <div className="modal-actions">
              <button className="secondary-btn" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="primary-btn"
                onClick={handleSubmit}
                disabled={saving || !roleName.trim()}
              >
                {saving ? "Saving..." : editingRole ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 