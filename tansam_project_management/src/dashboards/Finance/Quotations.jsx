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
    <div 
      className="exact-quotation-modal"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close button */}
      <button className="close-btn" onClick={closeModal}>×</button>

      <div className="quotation-document">
        {/* Header */}
        <div className="doc-header">
          <div className="logos-row">
            <img src="/tansam-logo.png" alt="TANSAM" className="tansam-logo" />
            <div className="powered-section">
              <span>Powered by</span>
              <img src="/siemens-logo.png" alt="Siemens" className="siemens-logo" />
            </div>
            <img src="/tidco-logo.png" alt="TIDCO" className="tidco-logo" />
          </div>

          <h1 className="main-title">
            Tamil Nadu Smart and Advanced Manufacturing Centre
          </h1>
          <p className="main-subtitle">
            (A Government of Tamil Nadu Enterprise wholly owned by TIDCO)
          </p>

          <h2 className="quotation-heading">Quotation</h2>
        </div>

        {/* REF & DATE */}
        <div className="ref-date-row">
          <div>
            <strong>REF:</strong> 
            <span className="ref-value">{newQuotation.quotationNo || 'TANSAM-XXXX/2025-26'}</span>
          </div>
          <div>
            <strong>DATE:</strong> 
            <input
              type="date"
              value={newQuotation.date}
              onChange={(e) => setNewQuotation({...newQuotation, date: e.target.value})}
              className="date-field"
            />
          </div>
        </div>

        {/* To / Kind Attn / Address */}
        <div className="to-address-block">
          <strong>To,</strong><br/>
          <input
            className="institute-field"
            value={newQuotation.clientName}
            onChange={(e) => setNewQuotation({...newQuotation, clientName: e.target.value})}
            placeholder="GRT INSTITUTE OF ENGINEERING AND TECHNOLOGY"
          /><br/>

          <strong>kind attn: -</strong>
          <input
            className="attn-field"
            value={newQuotation.kindAttn || ""}
            onChange={(e) => setNewQuotation({...newQuotation, kindAttn: e.target.value})}
            placeholder="Dr.S.SATHYA /HOD"
          /><br/>

          <textarea
            className="full-address"
            rows={3}
            value={newQuotation.address || ""}
            onChange={(e) => setNewQuotation({...newQuotation, address: e.target.value})}
            placeholder="GRT Mahalakshmi Nagar, Chennai - Tirupathi Highway\nTiruttani – 631 209"
          />
        </div>

        {/* Subject */}
        <div className="subject-row">
          <strong>Sub:</strong>
          <input
            className="subject-field"
            value={newQuotation.project_name || ""}
            onChange={(e) => setNewQuotation({...newQuotation, project_name: e.target.value})}
            placeholder="Quote offer for Industrial Visit 2.5 hours Sir/Madam,"
          />
        </div>

        {/* Thank you message */}
        <p className="thank-text">
          We thank you very much for your valuable inquiry. With reference to the same, we are pleased to submit our most competitive price as below.
        </p>

        {/* Main Editable Table */}
        <div className="quotation-table-container">
          <table className="quotation-table">
            <thead>
              <tr>
                <th className="slno-col">S. No</th>
                <th className="desc-col">Product description</th>
                <th className="qty-col">Qty Per Students</th>
                <th className="unit-col">Unit price +TAX</th>
                <th className="total-col">Total price in INR inclusive of TAX</th>
              </tr>
            </thead>
            <tbody>
              {(newQuotation.items || []).map((item, index) => (
                <tr key={index}>
                  <td className="slno-cell">{index + 1}</td>
                  <td>
                    <textarea
                      value={item.description || ""}
                      onChange={(e) => {
                        const updated = [...(newQuotation.items || [])];
                        updated[index] = { ...updated[index], description: e.target.value };
                        setNewQuotation({ ...newQuotation, items: updated });
                      }}
                      placeholder="Other education and training services N.E.C. (Industrial Visit with E-Certificate)..."
                      rows={3}
                      className="desc-input"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.qty || ""}
                      onChange={(e) => {
                        const updated = [...(newQuotation.items || [])];
                        updated[index] = { ...updated[index], qty: e.target.value };
                        setNewQuotation({ ...newQuotation, items: updated });
                      }}
                      className="qty-input"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.unitPrice || ""}
                      onChange={(e) => {
                        const updated = [...(newQuotation.items || [])];
                        const qty = Number(updated[index].qty || 0);
                        const price = Number(e.target.value || 0);
                        updated[index] = { 
                          ...updated[index], 
                          unitPrice: e.target.value,
                          total: (qty * price).toFixed(2)
                        };
                        setNewQuotation({ ...newQuotation, items: updated });
                      }}
                      className="unit-input"
                    />
                  </td>
                  <td className="total-cell">
                    ₹ {Number(item.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Add Row Button */}
          <button
            className="add-row-btn"
            onClick={() => {
              const newItem = { description: "", qty: "", unitPrice: "", total: "0.00" };
              setNewQuotation({
                ...newQuotation,
                items: [...(newQuotation.items || []), newItem]
              });
            }}
          >
            + Add Row
          </button>

          {/* Total */}
          <div className="grand-total">
            <strong>Total Service Value with Tax</strong>
            <strong className="total-amount">
              ₹ {Number(
                (newQuotation.items || []).reduce((sum, i) => sum + Number(i.total || 0), 0)
              ).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </strong>
          </div>
        </div>

        {/* Terms & Conditions - Editable */}
        <div className="terms-block">
          <h3>Terms & Conditions</h3>
          <textarea
            className="terms-editor"
            rows={8}
            value={newQuotation.terms || 
              "1. Validity     : This quotation is valid for [10/15 days] from the date of issue.\n" +
              "2. Payment      : 100% payment advance\n" +
              "3. Delivery     : [days] Date of confirmed order with PO\n" +
              "4. Purchase Order : Send PO for Confirmation within 5 days"
            }
            onChange={(e) => setNewQuotation({...newQuotation, terms: e.target.value})}
          />
        </div>

        {/* Signature */}
        <div className="signature-block">
          <p><strong>Yours truly,</strong></p>
          <div className="signature-placeholder">
            <p style={{ margin: "80px 0 12px", textAlign: "center" }}>
              ___________________________
            </p>
            <p style={{ textAlign: "center" }}>
              <strong>Natesh C</strong><br/>
              Manager Operations
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="footer-section">
          <div className="footer-columns">
            <div>Tel: +91 44 69255700</div>
            <div>E-Mail: info@tansam.org</div>
            <div>URL: www.tansam.org</div>
            <div>
              C-Wing North, 603, TIDEL Park<br/>
              No.4, Rajiv Gandhi Salai,<br/>
              Taramani, Chennai - 600113
            </div>
          </div>
          <div className="gst-line">
            GSTIN: 33AAJCT2401Q1Z7 | CIN : U91990TN2022NPL150529
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bottom-actions">
          <button className="btn-cancel" onClick={closeModal}>Cancel</button>
          <button className="btn-save" onClick={handleSaveQuotation}>
            {editId ? "Update Quotation" : "Save Quotation"}
          </button>
          <button 
            className="btn-generate-docx"
            onClick={() => downloadDocx(newQuotation)}
          >
            Generate DOCX
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
