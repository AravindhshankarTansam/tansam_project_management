import { useState, useEffect } from "react";
import "../../layouts/CSS/finance.css";

import {
  getQuotations,
  addQuotation,
  updateQuotation,
  deleteQuotation,
} from "../../services/quotation/quotation.api";
import { FaFileWord, FaEdit, FaTrash } from "react-icons/fa";
import tansamLogo from "../../assets/tansam/tansamoldlogo.png";
import siemensLogo from "../../assets/tansam/siemens.png";
import tidcoLogo from "../../assets/tansam/tidcologo.png";
import tnLogo from "../../assets/tansam/tnlogo.png";          // ← Tamil Nadu Govt emblem (temple)

export default function Quotations() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
// const formData = new FormData();
// formData.append("quotation", JSON.stringify(newQuotation));
// formData.append("signature", signatureFile);

  const clientOptions = [...new Set(data.map((d) => d.clientName))];
  const workCategoryOptions = [...new Set(data.map((d) => d.workCategory))];
  const labOptions = [...new Set(data.map((d) => d.lab))];
const [signatureFile, setSignatureFile] = useState(null);

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
// Quotations.jsx - only the modal part (rest of your component stays mostly same)

{showModal && (
  <div className="modal-overlay" onClick={closeModal}>
     <div className="a4-scale-wrapper"><div className="a4-quotation-page">
    <div className="a4-quotation-page" onClick={(e) => e.stopPropagation()}>
      <button className="page-close-btn" onClick={closeModal}>×</button>

      <div className="paper-content">

        {/* Header - Logos + Titles */}
       
   {/* ================= HEADER ================= */}
<div className="doc-header">

  {/* Logos */}
  <div className="letterhead-logos">

    {/* LEFT : TN GOVT */}
    <div className="logo-left">
      <img src={tnLogo} alt="Tamil Nadu Government" />
    </div>

    {/* CENTER : TANSAM + Siemens */}
    <div className="logo-center">
      <img src={tansamLogo} alt="TANSAM" className="tansam-logo" />
      <div className="powered-by">
        <span>Powered by</span>
        <img src={siemensLogo} alt="Siemens" />
      </div>
    </div>

    {/* RIGHT : TIDCO */}
    <div className="logo-right">
      <img src={tidcoLogo} alt="TIDCO" />
    </div>

  </div>

  {/* Titles */}
  <h1 className="main-title">
    Tamil Nadu Smart and Advanced Manufacturing Centre
  </h1>

  <p className="main-subtitle">
    (A Government of Tamil Nadu Enterprise wholly owned by TIDCO)
  </p>

  <h2 className="quotation-heading">Quotation</h2>

</div>



          <div className="ref-date-line">
            <div>
              <strong>REF:</strong> 
              <input 
                type="text" 
                value={newQuotation.quotationNo} 
                onChange={e => setNewQuotation({...newQuotation, quotationNo: e.target.value})}
                className="ref-field"
              />
            </div>
            <div>
              <strong>DATE:</strong> 
              <input 
                type="date" 
                value={newQuotation.date} 
                onChange={e => setNewQuotation({...newQuotation, date: e.target.value})}
                className="date-field"
              />
            </div>
          </div>

        
        </div>

        {/* To + Kind Attn (left + right on same line) */}
 <div className="to-section">
  <div className="to-left">
    <label>To</label>
    <input
      value={newQuotation.clientName}
      onChange={e => setNewQuotation({...newQuotation, clientName: e.target.value})}
      placeholder="Institute / Company Name"
    />

    <textarea
      rows={4}
      placeholder="Complete Address"
      value={newQuotation.address || ""}
      onChange={e => setNewQuotation({...newQuotation, address: e.target.value})}
    />
  </div>

  <div className="kind-attn-right">
    <label>Kind Attn</label>
    <input
      value={newQuotation.kindAttn || ""}
      onChange={e => setNewQuotation({...newQuotation, kindAttn: e.target.value})}
      placeholder="Name & Designation"
    />
  </div>
</div>


        <div className="subject-block">
          <strong>Sub:</strong>
          <input
            className="subject-field"
            value={newQuotation.project_name}
            onChange={e => setNewQuotation({...newQuotation, project_name: e.target.value})}
            placeholder="Quote offer for Industrial Visit..."
          />
        </div>

        {/* <p className="thank-para">
          We thank you very much for your valuable inquiry. With reference to the same, we are pleased to submit our most competitive price as below.
        </p> */}

        {/* Compact Table */}
        <table className="compact-quotation-table">
          <thead>
            <tr>
              <th>S. No</th>
              <th>Product description</th>
              <th>Qty Per Students</th>
              <th>Unit price +TAX</th>
              <th>Total price in INR inclusive of TAX</th>
            </tr>
          </thead>
          <tbody>
            {(newQuotation.items || []).map((item, idx) => (
              <tr key={idx}>
                <td className="slno-cell">{idx + 1}</td>
                <td>
                  <textarea
                    className="desc-compact"
                    rows={2}           // ← reduced height
                    value={item.description || ""}
                    onChange={e => {
                      const items = [...(newQuotation.items || [])];
                      items[idx].description = e.target.value;
                      setNewQuotation({...newQuotation, items});
                    }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="qty-compact"
                    value={item.qty || ""}
                    onChange={e => {
                      const items = [...(newQuotation.items || [])];
                      items[idx].qty = e.target.value;
                      items[idx].total = (Number(e.target.value||0) * Number(item.unitPrice||0)).toFixed(2);
                      setNewQuotation({...newQuotation, items});
                    }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="unit-compact"
                    value={item.unitPrice || ""}
                    onChange={e => {
                      const items = [...(newQuotation.items || [])];
                      items[idx].unitPrice = e.target.value;
                      items[idx].total = (Number(item.qty||0) * Number(e.target.value||0)).toFixed(2);
                      setNewQuotation({...newQuotation, items});
                    }}
                  />
                </td>
                <td className="total-cell">
                  ₹ {Number(item.total || 0).toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          className="add-row-small"
          onClick={() => {
            setNewQuotation({
              ...newQuotation,
              items: [...(newQuotation.items || []), { description: "", qty: "", unitPrice: "", total: "0" }]
            });
          }}
        >
          + Add Row
        </button>

        <div className="total-line">
          <strong>Total Service Value with Tax</strong>
          <strong>
            ₹ {Number((newQuotation.items || []).reduce((s, i) => s + Number(i.total||0), 0))
                .toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </strong>
        </div>

        {/* Terms */}
        <div className="terms-area">
          <h3>Terms & Conditions</h3>
       <textarea
    className="terms-editor"
    value={newQuotation.terms || 
      "1. Validity     : This quotation is valid for [10/15 days] from the date of issue.\n" +
      "2. Payment      : 100% payment advance\n" +
      "3. Delivery     : [days] Date of confirmed order with P.O\n" +
      "4. Purchase Order : Send P.O for Confirmation within 5 days"
    }
    onChange={e => setNewQuotation({ ...newQuotation, terms: e.target.value })}
    rows={9}
    placeholder="Enter terms and conditions here..."
  />
        </div>

        {/* Signature + Yours truly */}
        <div className="closing-section">
          <p className="yours-truly"><strong>Yours truly,</strong></p>

          <div className="signature-upload">
            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={(e) => setSignatureFile(e.target.files?.[0] ?? null)}
            />
            {signatureFile && (
              <div className="sig-preview">
                <img src={URL.createObjectURL(signatureFile)} alt="Signature" />
              </div>
            )}
          </div>

          <p className="sign-name">
            <strong>Natesh C</strong><br />
            Manager Operations
          </p>
        </div>

        {/* Footer - restored */}
        <div className="doc-footer">
          <div className="footer-left">
            Tel : +91 44 69255700<br />
            E-Mail : info@tansam.org
          </div>
          <div className="footer-center">
            URL : www.tansam.org
          </div>
          <div className="footer-right">
            C-Wing North, 603, TIDEL Park<br />
            No.4, Rajiv Gandhi Salai,<br />
            Taramani, Chennai-600113
          </div>
        </div>

      </div>

      {/* Action buttons at bottom */}
      <div className="bottom-actions">
        <button className="btn-cancel" onClick={closeModal}>Cancel</button>
        <button className="btn-save" onClick={handleSaveQuotation}>
          {editId ? "Update" : "Save"} Quotation
        </button>
      </div>
    </div> </div>
  </div>
  
)}
    </div>
  );
}
