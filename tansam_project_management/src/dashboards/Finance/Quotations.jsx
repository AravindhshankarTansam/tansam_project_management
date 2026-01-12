import { useState, useEffect } from "react";
import "../../layouts/CSS/finance.css";

import {
  getQuotations,
  addQuotation,
  updateQuotation,
  deleteQuotation,
} from "../../services/quotation/quotation.api";
import { FaFileWord, FaEdit, FaTrash } from "react-icons/fa";

export default function Quotations() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);

  const clientOptions = [...new Set(data.map((d) => d.clientName))];
  const workCategoryOptions = [...new Set(data.map((d) => d.workCategory))];
  const labOptions = [...new Set(data.map((d) => d.lab))];

  const [selectedClient, setSelectedClient] = useState("");
  const [selectedWorkCategory, setSelectedWorkCategory] = useState("");
  const [selectedLab, setSelectedLab] = useState("");

  const [newQuotation, setNewQuotation] = useState({
    quotationNo: "",
     project_name: "", 
    clientName: "",
    clientType: "Corporate",
    workCategory: "",
    lab: "",
    description: "",
    value: "",
    date: "",
  });

  const clearAllFilters = () => {
    setSelectedClient("");
    setSelectedWorkCategory("");
    setSelectedLab("");
    setPage(1);
  };

  const filtered = data.filter(
    (q) =>
      (selectedClient === "" || q.clientName === selectedClient) &&
      (selectedWorkCategory === "" ||
        q.workCategory === selectedWorkCategory) &&
      (selectedLab === "" || q.lab === selectedLab)
  );
const generateQuotationNo = (data) => {
  const numbers = data
    .map(q => q.quotationNo)
    .filter(Boolean)
    .map(no => Number(no.replace("TANSAM/", "")))
    .filter(n => !isNaN(n));

  const nextNumber = numbers.length ? Math.max(...numbers) + 1 : 1001;
  return `TANSAM/${nextNumber}`;
};


  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // ✅ DOCX DOWNLOAD FUNCTION
const downloadDocx = async (quotation) => {
  setDownloadingId(quotation.id);
  try {
    const userId = localStorage.getItem("userId") || "1";
    const userRole = (localStorage.getItem("userRole") || "FINANCE").toUpperCase();

const response = await fetch(
  `http://localhost:9899/api/quotations/${quotation.id}/docx`,
  {
    method: "GET",
    headers: {
      Accept:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "x-user-id": userId,
      "x-user-role": userRole,
    },
  }
);

    if (!response.ok) {
      throw new Error("Download failed");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Quotation_${quotation.quotationNo}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download error:", error);
    alert("Failed to download DOCX");
  } finally {
    setDownloadingId(null);
  }
};

  const handleEdit = (quotation) => {
    setEditId(quotation.id);
    setNewQuotation({ ...quotation });
    setShowModal(true);
  };

  useEffect(() => {
    getQuotations().then(setData);
  }, []);

const handleSaveQuotation = async () => {
  try {
    const payload = {
      ...newQuotation,
      quotationNo: editId
        ? newQuotation.quotationNo   // ✅ KEEP EXISTING NUMBER ON EDIT
        : newQuotation.quotationNo || generateQuotationNo(data),
    };

    if (editId) {
      await updateQuotation(editId, payload);
    } else {
      await addQuotation(payload);
    }

    const updatedData = await getQuotations();
    setData(updatedData);

    setShowModal(false);
    setEditId(null);
    setNewQuotation({
      quotationNo: "",
      project_name: "",
      clientName: "",
      clientType: "Corporate",
      workCategory: "",
      lab: "",
      description: "",
      value: "",
      date: "",
    });
  } catch (err) {
    console.error(err);
    alert("Error saving quotation");
  }
};


  const deleteRow = async (id) => {
    if (window.confirm("Are you sure you want to delete this quotation?")) {
      try {
        await deleteQuotation(id);
        const updatedData = await getQuotations();
        setData(updatedData);
      } catch (err) {
        console.error(err);
        alert("Error deleting quotation");
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setNewQuotation({
      quotationNo: "",
      project_name: "",
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
        <div>
          <h2>Quotations Management</h2>
          <p className="header-subtitle">
            Create, manage and download quotations
          </p>
        </div>
      <button
  className="btn-add-quotation"
  onClick={() => {
    const quotationNo = generateQuotationNo(data);

    setNewQuotation({
      quotationNo,
      project_name: "",
      clientName: "",
      clientType: "Corporate",
      workCategory: "",
      lab: "",
      description: "",
      value: "",
      date: "",
    });

    setEditId(null);
    setShowModal(true);
  }}
>
  + Create New Quotation
</button>

      </div>

      {/* Filters */}
      <div className="filters">
        <select
          value={selectedClient}
          onChange={(e) => {
            setSelectedClient(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Clients</option>
          {clientOptions.map((client) => (
            <option key={client} value={client}>
              {client}
            </option>
          ))}
        </select>

        <select
          value={selectedWorkCategory}
          onChange={(e) => {
            setSelectedWorkCategory(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All Categories</option>
          {workCategoryOptions.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
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
          {labOptions.map((lab) => (
            <option key={lab} value={lab}>
              {lab}
            </option>
          ))}
        </select>

        <button className="btn-clear-filters" onClick={clearAllFilters}>
          ✕ Clear All
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
              <th>S.No</th>
             
              <th>Quotation No</th>
               <th>Project Name</th>
              <th>Client Name</th>
              <th>Client Type</th>
              <th>Work Category</th>
              <th>Lab</th>
              <th>Description</th>
              <th>Quote Value</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length > 0 ? (
              paginated.map((q, i) => (
                <tr key={q.id} className="table-row">
                  <td>{(page - 1) * pageSize + i + 1}</td>
                  <td>
                    <strong>{q.quotationNo}</strong>
                  </td>
                  <td>{q.project_name}</td>

                  <td>{q.clientName}</td>
                  <td>
                    <span
                      className={`badge badge-${q.clientType.toLowerCase()}`}
                    >
                      {q.clientType}
                    </span>
                  </td>
                  <td>{q.workCategory}</td>
                  <td>
                    <span className="badge-lab">{q.lab}</span>
                  </td>
                  <td className="desc-cell">{q.description}</td>
                  <td className="value-cell">
                    ₹ {parseInt(q.value).toLocaleString("en-IN")}
                  </td>
                  <td>{new Date(q.date).toLocaleDateString("en-IN")}</td>
                  <td className="actions-cell">
       <button
    className="btn-docx"
    onClick={() => downloadDocx(q)}
    disabled={downloadingId === q.id}
    title="Download DOCX"
  >
    {downloadingId === q.id ? "⏳" : <FaFileWord />}
  </button>
                     <button
    className="btn-edit"
    onClick={() => handleEdit(q)}
    title="Edit"
  >
    <FaEdit />
  </button>  <button
    className="btn-delete"
    onClick={() => deleteRow(q.id)}
    title="Delete"
  >
    <FaTrash />
  </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="no-data">
                  No quotations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          ← Prev
        </button>
        <span>
          Page {page} of {totalPages || 1}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next →
        </button>
      </div>

      {/* ✅ IMPROVED MODAL */}
    {showModal && (
  <div className="modal-overlay" onClick={closeModal}>
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h3>{editId ? "Edit Quotation" : "Create New Quotation"}</h3>
        <button className="btn-close" onClick={closeModal}>✕</button>
      </div>

      {/* FORM */}
      <div className="modal-form">
        <div className="form-group">
         
          
  <label>Quotation No *</label>
  <input
    type="text"
    value={newQuotation.quotationNo}
    readOnly
  />


        </div>

        <div className="form-group">
          <label>Project Name *</label>
          <input
            type="text"
            placeholder="Project Name"
            value={newQuotation.project_name}
            onChange={(e) =>
              setNewQuotation({ ...newQuotation, project_name: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Client Name *</label>
          <input
            type="text"
            placeholder="Client Name"
            value={newQuotation.clientName}
            onChange={(e) =>
              setNewQuotation({ ...newQuotation, clientName: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Client Type *</label>
          <select
            value={newQuotation.clientType}
            onChange={(e) =>
              setNewQuotation({ ...newQuotation, clientType: e.target.value })
            }
          >
            <option value="Corporate">Corporate</option>
            <option value="Individual">Individual</option>
            <option value="Government">Government</option>
            <option value="NGO">NGO</option>
          </select>
        </div>

        <div className="form-group">
          <label>Quote Value *</label>
          <input
            type="number"
            value={newQuotation.value}
            onChange={(e) =>
              setNewQuotation({ ...newQuotation, value: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Work Category *</label>
          <input
            type="text"
            value={newQuotation.workCategory}
            onChange={(e) =>
              setNewQuotation({ ...newQuotation, workCategory: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Lab *</label>
          <input
            type="text"
            value={newQuotation.lab}
            onChange={(e) =>
              setNewQuotation({ ...newQuotation, lab: e.target.value })
            }
          />
        </div>

        <div className="form-group">
          <label>Work Description *</label>
          <textarea
            value={newQuotation.description}
            onChange={(e) =>
              setNewQuotation({ ...newQuotation, description: e.target.value })
            }
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Quotation Date *</label>
          <input
            type="date"
            value={newQuotation.date}
            onChange={(e) =>
              setNewQuotation({ ...newQuotation, date: e.target.value })
            }
          />
        </div>
      </div>

      {/* LIVE QUOTATION PREVIEW */}
      <div className="quotation-preview" style={{
        border: "1px solid #ccc",
        padding: "20px",
        marginTop: "20px",
        backgroundColor: "#fff",
        maxHeight: "400px",
        overflowY: "auto"
      }}>
        <h2 style={{ textAlign: "center" }}>Quotation</h2>
        <p><strong>Quotation No:</strong> {newQuotation.quotationNo}</p>
        <p><strong>Date:</strong> {newQuotation.date}</p>
        <p><strong>Project Name:</strong> {newQuotation.project_name}</p>
        <p><strong>Client:</strong> {newQuotation.clientName} ({newQuotation.clientType})</p>
        <p><strong>Lab:</strong> {newQuotation.lab}</p>
        <p><strong>Work Category:</strong> {newQuotation.workCategory}</p>
        <p><strong>Description:</strong> {newQuotation.description}</p>
        <p><strong>Quote Value:</strong> ₹ {parseInt(newQuotation.value || 0).toLocaleString("en-IN")}</p>
      </div>

      {/* ACTIONS */}
      <div className="modal-actions">
        <button className="btn-save" onClick={handleSaveQuotation}>
          {editId ? "Update Quotation" : "Create & Save Quotation"}
        </button>

        <button className="btn-download" onClick={() => downloadDocx(newQuotation)}>
          Generate DOCX
        </button>

        <button className="btn-cancel" onClick={closeModal}>Cancel</button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
