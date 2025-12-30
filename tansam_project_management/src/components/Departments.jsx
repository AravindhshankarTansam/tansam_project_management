import { useState, useEffect } from "react";

export default function Departments() {
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [deptForm, setDeptForm] = useState({ name: "", head: "" });
  const [departments, setDepartments] = useState([]);
  const API_BASE = 'http://localhost:5000';

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    const res = await fetch(`${API_BASE}/api/departments`);
    const data = await res.json();
    setDepartments(data);
  };

  const handleDeptSubmit = async () => {
    if (!deptForm.name || !deptForm.head) {
      alert("Please fill all fields");
      return;
    }
    try {
      const method = editingDept ? 'PUT' : 'POST';
      const url = editingDept ? `${API_BASE}/api/departments/${editingDept}` : `${API_BASE}/api/departments`;
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(deptForm)
      });
      
      if (res.ok) {
        setDeptForm({ name: "", head: "" });
        setShowDeptModal(false);
        setEditingDept(null);
        fetchDepartments();
      }
    } catch {
      alert('Server error');
    }
  };

  const deleteDept = async (id) => {
    if (confirm("Are you sure?")) {
      await fetch(`${API_BASE}/api/departments/${id}`, { method: 'DELETE' });
      fetchDepartments();
    }
  };

  const editDept = (dept) => {
    setEditingDept(dept.id);
    setDeptForm({ name: dept.name, head: dept.head });
    setShowDeptModal(true);
  };

  return (
    <>
      <div className="header">
        <h2>Department Management</h2>
        <button className="add-btn" onClick={() => setShowDeptModal(true)}>
          ➕ Add Department
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Department</th>
              <th>Head</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((dept, index) => (
              <tr key={dept.id}>
                <td>{index + 1}</td>
                <td>{dept.name}</td>
                <td>{dept.head}</td>
                <td>
                  <button className="action-btn edit" onClick={() => editDept(dept)}>✏️</button>
                  <button className="action-btn delete" onClick={() => deleteDept(dept.id)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Department Modal */}
      {showDeptModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingDept ? 'Edit Department' : 'Add Department'}</h3>
            <div className="form-group">
              <label>Department Name</label>
              <input
                value={deptForm.name}
                onChange={(e) => setDeptForm({...deptForm, name: e.target.value})}
                placeholder="Enter department name"
              />
            </div>
            <div className="form-group">
              <label>Head</label>
              <input
                value={deptForm.head}
                onChange={(e) => setDeptForm({...deptForm, head: e.target.value})}
                placeholder="Enter head name"
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleDeptSubmit}>
                {editingDept ? 'Update' : 'Create'} Department
              </button>
              <button onClick={() => {
                setShowDeptModal(false);
                setEditingDept(null);
                setDeptForm({ name: "", head: "" });
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
