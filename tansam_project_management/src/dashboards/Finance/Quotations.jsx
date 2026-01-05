import { useState } from "react";
import "../../layouts/CSS/finance.css";

const DUMMY_QUOTATIONS = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  quotationNo: `QT-2024-${1000 + i}`,
  clientName: `Client ${i + 1}`,
  clientType: i % 2 === 0 ? "Corporate" : "Individual",
  workCategory: i % 2 === 0 ? "Environmental" : "Chemical",
  lab: i % 3 === 0 ? "Chennai Lab" : "Bangalore Lab",
  description: "Sample testing & analysis",
  value: 25000 + i * 1000,
  date: "2024-10-01",
}));

export default function Quotations() {
  const [data, setData] = useState(DUMMY_QUOTATIONS);
  // const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
const clientOptions = [...new Set(data.map(d => d.clientName))];
const workCategoryOptions = [...new Set(data.map(d => d.workCategory))];
const labOptions = [...new Set(data.map(d => d.lab))];
const [selectedClient, setSelectedClient] = useState("");
const [selectedWorkCategory, setSelectedWorkCategory] = useState("");
const [selectedLab, setSelectedLab] = useState("");
const clearAllFilters = () => {
  setSelectedClient("");
  setSelectedWorkCategory("");
  setSelectedLab("");
  setPage(1); // reset pagination
};



  const [newQuotation, setNewQuotation] = useState({
    clientName: "",
    clientType: "Corporate",
    workCategory: "",
    lab: "",
    description: "",
    value: "",
    date: "",
  });

const filtered = data.filter(q =>
  (selectedClient === "" || q.clientName === selectedClient) &&
  (selectedWorkCategory === "" || q.workCategory === selectedWorkCategory) &&
  (selectedLab === "" || q.lab === selectedLab)
);


  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const deleteRow = id => {
    setData(prev => prev.filter(item => item.id !== id));
  };

  // const handleAddQuotation = () => {
  //   const newId = data.length ? data[data.length - 1].id + 1 : 1;
  //   const quotationNo = `QT-2024-${1000 + newId}`;
  //   setData(prev => [...prev, { id: newId, quotationNo, ...newQuotation }]);
  //   setShowModal(false);
  //   setNewQuotation({
  //     clientName: "",
  //     clientType: "Corporate",
  //     workCategory: "",
  //     lab: "",
  //     description: "",
  //     value: "",
  //     date: "",
  //   });
  // };
const handleEdit = (quotation) => {
  setEditId(quotation.id);
  setNewQuotation({ ...quotation });
  setShowModal(true);
};const handleSaveQuotation = () => {
  if (editId) {
    // Update existing quotation
    setData(prev =>
      prev.map(q => (q.id === editId ? { ...q, ...newQuotation } : q))
    );
  } else {
    // Add new quotation
    const newId = data.length ? data[data.length - 1].id + 1 : 1;
    const quotationNo = `QT-2024-${1000 + newId}`;
    setData(prev => [...prev, { id: newId, quotationNo, ...newQuotation }]);
  }

  // Reset modal
  setShowModal(false);
  setEditId(null);
  setNewQuotation({
    clientName: "",
    clientType: "Corporate",
    workCategory: "",
    lab: "",
    description: "",
    value: "",
    date: "",
  });
};
  return (
    <div className="finance-container">
      {/* Header */}
      <div className="table-header">
        <h2>Quotations</h2>
        <button className="btn-add-quotation" onClick={() => setShowModal(true)}>
          + Create New Quotation
        </button>
      </div>

      {/* Search & Page Size */}
<div className="filters">
  <select
    value={selectedClient}
    onChange={(e) => {
      setSelectedClient(e.target.value);
      setPage(1);
    }}
  >
    <option value="">All Clients</option>
    {clientOptions.map(client => (
      <option key={client} value={client}>{client}</option>
    ))}
  </select>

  <select
    value={selectedWorkCategory}
    onChange={(e) => {
      setSelectedWorkCategory(e.target.value);
      setPage(1);
    }}
  >
    <option value="">All Work Categories</option>
    {workCategoryOptions.map(cat => (
      <option key={cat} value={cat}>{cat}</option>
    ))}
  </select>

  <select
    value={selectedLab}
    onChange={(e) => {
      setSelectedLab(e.target.value);
      setPage(1);
    }}
  >
    <option value="">All Labs</option>
    {labOptions.map(lab => (
      <option key={lab} value={lab}>{lab}</option>
    ))}
  </select>
<button
  className="btn-clear-filters"
  onClick={clearAllFilters}
>
  Clear All
</button>

  <div className="page-size-ui">
    <span>Show</span>
    <select
      value={pageSize}
      onChange={(e) => {
        setPageSize(Number(e.target.value));
        setPage(1);
      }}
    >
      <option value={5}>5</option>
      <option value={10}>10</option>
      <option value={25}>25</option>
      <option value={50}>50</option>
    </select>
    <span>per page</span>
  </div>
</div>



      {/* Table */}
      <div className="card-table">
        <table>
          <thead>
            <tr>
              {[
                "S.No",
                "Quotation No",
                "Client Name",
                "Client Type",
                "Work Category",
                "LAB",
                "Work Description",
                "Quote Value",
                "Quotation Date",
                "Actions"
              ].map(h => <th key={h}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {paginated.length > 0 ? paginated.map((q, i) => (
              <tr key={q.id}>
                <td>{(page - 1) * pageSize + i + 1}</td>
                <td>{q.quotationNo}</td>
                <td>{q.clientName}</td>
                <td>{q.clientType}</td>
                <td>{q.workCategory}</td>
                <td>{q.lab}</td>
                <td>{q.description}</td>
                <td>₹ {q.value}</td>
                <td>{q.date}</td>
                <td>
                    <button className="btn-edit" onClick={() => handleEdit(q)}>✏️</button>
             <button className="btn-delete" onClick={() => deleteRow(q.id)}>🗑️</button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="10" align="center">No records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
        <span>{page} / {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
      </div>

      {/* Add Quotation Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Quotation</h3>
            <div className="modal-form">
              <input placeholder="Client Name" value={newQuotation.clientName} onChange={e => setNewQuotation({...newQuotation, clientName: e.target.value})} />
              <select value={newQuotation.clientType} onChange={e => setNewQuotation({...newQuotation, clientType: e.target.value})}>
                <option value="Corporate">Corporate</option>
                <option value="Individual">Individual</option>
              </select>
              <input placeholder="Work Category" value={newQuotation.workCategory} onChange={e => setNewQuotation({...newQuotation, workCategory: e.target.value})} />
              <input placeholder="Lab" value={newQuotation.lab} onChange={e => setNewQuotation({...newQuotation, lab: e.target.value})} />
              <input placeholder="Description" value={newQuotation.description} onChange={e => setNewQuotation({...newQuotation, description: e.target.value})} />
              <input type="number" placeholder="Quote Value" value={newQuotation.value} onChange={e => setNewQuotation({...newQuotation, value: e.target.value})} />
              <input type="date" value={newQuotation.date} onChange={e => setNewQuotation({...newQuotation, date: e.target.value})} />
            </div>
       <div className="modal-actions">
  <button onClick={handleSaveQuotation}>{editId ? "Update" : "Save"}</button>
  <button onClick={() => { setShowModal(false); setEditId(null); }}>Cancel</button>
</div>
          </div>
        </div>
      )}
    </div>
  );
}
