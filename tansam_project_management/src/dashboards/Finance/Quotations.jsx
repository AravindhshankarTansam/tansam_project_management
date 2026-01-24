import { useState, useEffect } from "react";
import "../../layouts/CSS/finance.css";
import GenerateQuotation from "./generateQuotation";
import {
  getQuotations,
  addQuotation,
  updateQuotation,
  deleteQuotation,
} from "../../services/quotation/quotation.api";
import { FaFileWord, FaEdit, FaTrash, FaFilePdf } from "react-icons/fa";
import { MdEditDocument } from "react-icons/md";
import { fetchWorkCategories } from "../../services/admin/admin.roles.api";
import { fetchLabs } from "../../services/admin/admin.roles.api";
import { getGeneratedQuotationByQuotationId } from "../../services/quotation/generatedQuotation.api";
import { fetchOpportunities  } from "../../services/coordinator/coordinator.opportunity.api.js";
import Select from "react-select";

export default function Quotations() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
 
const [workCategories, setWorkCategories] = useState([]);
const [opportunities, setOpportunities] = useState([]);
const [labs, setLabs] = useState([]);
const [activeTab, setActiveTab] = useState("quotation");
const [showDoc, setShowDoc] = useState(false);

  const clientOptions = [...new Set(data.map((d) => d.clientName))];
  const workCategoryOptions = [...new Set(data.map((d) => d.workCategory))];
  const labOptions = [...new Set(data.map((d) => d.lab))];
const [showGenerateQuotation, setShowGenerateQuotation] = useState(false);

  const [selectedClient, setSelectedClient] = useState("");
  const [selectedWorkCategory, setSelectedWorkCategory] = useState("");
  const [selectedLab, setSelectedLab] = useState("");

  const [newQuotation, setNewQuotation] = useState({
    quotationNo: "",
     opprtunity_name: "", 
      client_id: "", 
    clientName: "",
    clientType: "Corporate",
    workCategory: "",
    lab: "",
    description: "",
    value: "",
     gst: "",
  totalValue: "",
    date: "",
    revisedCost: "",
  paymentPhase: "Not Started",
  poReceived: "No",
  paymentReceived: "No",
  paymentAmount: "",
  paymentPendingReason: "",
  });

  const clearAllFilters = () => {
    setSelectedClient("");
    setSelectedWorkCategory("");
    setSelectedLab("");
    setPage(1);
  };
const handleEditGeneratedQuotation = async (originalQuotation) => {
  console.log("Medit clicked for quotation ID:", originalQuotation.id);

  try {
    const generated = await getGeneratedQuotationByQuotationId(originalQuotation.id);
    console.log("API returned generated data:", generated);

    // ────────────────────────────────────────────────
    // Define the base structure that GenerateQuotation expects
    const baseQuotation = {
      id: originalQuotation.id,
      quotationNo: originalQuotation.quotationNo || "",
      opprtunity_name: originalQuotation.opprtunity_name || "",
      clientName: originalQuotation.clientName || "",
      kindAttn: "",
      subject: "",
      financeManagerName: "",
      items: [{ description: "", qty: "", unitPrice: "", total: "0.00" }],
      terms: [],
      termsContent: "",
      signature: null,
      seal: null,
      existingSignature: null,
      existingSeal: null,
    };
    // ────────────────────────────────────────────────

    let quotationToUse;

    if (!generated || !generated.id) {
      console.warn("No previously generated quotation found for this ID");
      // Start with basic info from original quotation
      quotationToUse = {
        ...baseQuotation,
        refNo: `TN/SA/${new Date().getFullYear()}/${String(originalQuotation.id).padStart(4, '0')}`,
        date: new Date().toISOString().split("T")[0],
      };
    } else {
      console.log("Loading existing generated quotation data");
quotationToUse = {
  ...baseQuotation,

  // original quotation reference
  quotationId: originalQuotation.id,
  quotationNo: originalQuotation.quotationNo,
  opprtunity_name: originalQuotation.opprtunity_name || generated.opprtunity_name || "",
  clientName: originalQuotation.clientName || "",

  // generated quotation identity
  generatedId: generated.id,

  refNo: generated.refNo,
  date: generated.date,

  items: generated.items ? JSON.parse(generated.items) : baseQuotation.items,
  terms: generated.terms ? JSON.parse(generated.terms) : baseQuotation.terms,
  termsContent: generated.termsContent || "",

  existingSignature: generated.signature
    ? `http://localhost:9899/${generated.signature}`
    : null,

  existingSeal: generated.seal
    ? `http://localhost:9899/${generated.seal}`
    : null,

  signature: null,
  seal: null,
};

    }

    setNewQuotation(quotationToUse);
    setShowGenerateQuotation(true);

  } catch (err) {
    console.error("Error loading generated quotation:", err);
    alert("Could not load previous generated version. Opening with basic data.");

    // Fallback – at least show something
    setNewQuotation({
      ...baseQuotation,
      refNo: `TN/SA/${new Date().getFullYear()}/${String(originalQuotation.id).padStart(4, '0')}`,
      date: new Date().toISOString().split("T")[0],
    });
    setShowGenerateQuotation(true);
  }
};
useEffect(() => {
  const loadWorkCategories = async () => {
    try {
      const categories = await fetchWorkCategories(); // API from admin.roles.api.js
      setWorkCategories(categories);
    } catch (err) {
      console.error("Failed to fetch work categories:", err);
      alert("Failed to load work categories");
    }
  };

  loadWorkCategories();
}, []);

useEffect(() => {
  const loadLabs = async () => {
    try {
      const labData = await fetchLabs(); // from admin.roles.api.js
      setLabs(labData);
    } catch (err) {
      console.error("Failed to fetch labs:", err);
      alert("Failed to load labs");
    }
  };

  loadLabs();
}, []);

useEffect(() => {
  const loadOpportunities = async () => {
    try {
      const data = await fetchOpportunities(); // API call
      setOpportunities(data);
    } catch (err) {
      console.error("Failed to fetch opportunities:", err);
      alert("Failed to load opportunities");
    }
  };

  loadOpportunities();
}, []);

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

const calculateTotalValue = () => {
  return ((parseFloat(newQuotation.value || 0) || 0) * (1 + (parseFloat(newQuotation.gst || 0) || 0) / 100)).toFixed(2);
};

  const handleEdit = (quotation) => {
    setEditId(quotation.id);
  setNewQuotation({
    ...quotation,
    paymentPhase: quotation.paymentPhase || "Not Started",
    revisedCost: quotation.revisedCost || "",
    poReceived: quotation.poReceived || "No",
    paymentReceived: quotation.paymentReceived || "No",
    paymentAmount: quotation.paymentAmount || "",
    paymentPendingReason: quotation.paymentPendingReason || "",
  });
    setShowModal(true);
  };

useEffect(() => {
  getQuotations().then(res => setData(res));
}, []);

const handleSaveQuotation = async () => {
  try {
      const finalValue =
      (parseFloat(newQuotation.value || 0) || 0) +
      (parseFloat(newQuotation.gst || 0) || 0);

   const payload = {
  ...newQuotation,
    value: finalValue,

  quotationNo: editId
    ? newQuotation.quotationNo
    : newQuotation.quotationNo || generateQuotationNo(data),
  totalValue: parseFloat(newQuotation.totalValue) || 0, // send to backend
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
      opprtunity_name: "",
      clientName: "",
      clientType: "Corporate",
      workCategory: "",
      lab: "",
      description: "",
      value: "",
          gst: "",
      totalValue: "",
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
      opprtunity_name: "",
      clientName: "",
      clientType: "Corporate",
      workCategory: "",
      lab: "",
      description: "",
      value: "",
      date: "",
    });
  };
if (showDoc) {
  return (
    <QuotationDocument
      quotation={newQuotation}
      onBack={() => setShowDoc(false)}
    />
  );
}
if (showGenerateQuotation) {
  return (
  <GenerateQuotation
  quotation={newQuotation}
  onSaved={async () => {
    try {
      const fresh = await getQuotations();
      setData(fresh);
    } catch (err) {
      console.error("Refresh after generate failed", err);
    }
    setShowGenerateQuotation(false);
  }}
/>
  );
}



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
      opprtunity_name: "",
      clientName: "",
      clientType: "Corporate",
      workCategory: "",
      lab: "",
      description: "",
       gst:"",
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
<div className="tabs">
  <button
    className={`tab ${activeTab === "quotation" ? "active" : ""}`}
    onClick={() => setActiveTab("quotation")}
  >
    Quotation
  </button>
  <button
    className={`tab ${activeTab === "payment" ? "active" : ""}`}
    onClick={() => setActiveTab("payment")}
  >
    Payment Phase
  </button>
  </div>
      {/* Table */}
    <div className="card-table">
  <table>
    <thead>
      <tr>
        <th>S.No</th>
        {activeTab === "quotation" ? (
          <>
            <th>Quotation No</th>
            <th>Opportunity Name</th>
            <th>Client Name</th>
            <th>Client Type</th>
            <th>Work Category</th>
            <th>Lab</th>
            <th>Description</th>
            <th>Quote Value</th>
            <th>Date</th>
            <th>Actions</th> {/* Only in Quotation tab */}
          </>
        ) : (
          <>
            <th>Quotation No</th>
            <th>Payment Phase</th>
            <th>Revised Cost</th>
            <th>PO Received</th>
            <th>Payment Received</th>
            <th>Payment Amount</th>
            <th>Pending Reason</th>
          </>
        )}
      </tr>
    </thead>
    <tbody>
      {paginated.length > 0 ? (
        paginated.map((q, i) => (
          <tr key={q.id} className="table-row">
            <td>{(page - 1) * pageSize + i + 1}</td>

            {activeTab === "quotation" ? (
              <>
                <td><strong>{q.quotationNo}</strong></td>
                <td>{q.opprtunity_name}</td>
                <td>{q.clientName}</td>
                <td>
                  <span className={`badge badge-${q.clientType.toLowerCase()}`}>
                    {q.clientType}
                  </span>
                </td>
                <td>{q.workCategory}</td>
                <td><span className="badge-lab">{q.lab}</span></td>
                <td className="desc-cell">{q.description}</td>
                <td className="value-cell">
                  ₹ {parseInt(q.value || 0).toLocaleString("en-IN")}
                </td>
                <td>{new Date(q.date).toLocaleDateString("en-IN")}</td>

                {/* Actions column ONLY in Quotation tab */}
                <td className="actions-cell">
                  <button className="btn-edit" onClick={() => handleEdit(q)} title="Edit">
                    <FaEdit />
                  </button>
                  <button className="btn-delete" onClick={() => deleteRow(q.id)} title="Delete">
                    <FaTrash />
                  </button>
                  {q.isGenerated ? (
                    <button
                      className="btn-medit"
                      onClick={() => handleEditGeneratedQuotation(q)}
                      title="Edit Generated Quotation"
                    >
                      <MdEditDocument />
                    </button>
                  ) : (
                    <button
                      className="btn-generate"
                      onClick={() => {
                        setNewQuotation(q);
                        setShowGenerateQuotation(true);
                      }}
                      title="Generate Quotation"
                    >
                      <FaFilePdf />
                    </button>
                  )}
                </td>
              </>
            ) : (
              <>
                <td><strong>{q.quotationNo}</strong></td>
                <td>{q.paymentPhase || "Not Started"}</td>
                <td>{q.revisedCost || "-"}</td>
                <td>{q.poReceived || "No"}</td>
                <td>{q.paymentReceived || "No"}</td>
                <td>{q.paymentAmount || "-"}</td>
                <td>{q.paymentPendingReason || "-"}</td>
              </>
            )}
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={activeTab === "quotation" ? "11" : "7"} className="no-data">
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
  <label>Client *</label>
<select
  value={newQuotation.client_id}
 onChange={(e) => {
  const clientId = e.target.value;
  const selectedClient = opportunities.find(
    (opp) => String(opp.client_id) === String(clientId)
  );

  setNewQuotation({
    ...newQuotation,
    client_id: clientId,
    clientName: selectedClient?.client_name || "",
    opprtunity_name: "", // reset opportunity selection
    workCategory: selectedClient?.workCategory || "",
    lab: selectedClient?.lab || "",
    clientType: selectedClient?.clientType || "Corporate", // default if missing
  });
}}

>

    <option value="">Select Client</option>
    {opportunities
      .map((opp) => ({ client_id: opp.client_id, client_name: opp.client_name }))
      .filter((v, i, a) => a.findIndex(t => t.client_id === v.client_id) === i) // unique clients
      .map((client) => (
        <option key={client.client_id} value={client.client_id}>
          {client.client_name}
        </option>
      ))}
  </select>
</div>

{/* OPPORTUNITY SELECTION (filtered by selected client) */}
{/* OPPORTUNITY SELECTION AS CHECKBOXES */}
{/* OPPORTUNITY SELECTION (filtered by selected client) */}

<div className="form-group">
  <label>Opportunity Name(s) *</label>

  <Select
  isMulti
  isDisabled={!newQuotation.client_id}
  placeholder={newQuotation.client_id ? "Select Opportunity" : "Select Client First"}
  options={
    newQuotation.client_id
      ? opportunities
          .filter(
            (opp) => String(opp.client_id) === String(newQuotation.client_id)
          )
          .map((opp) => ({
            value: opp.opportunity_name,
            label: opp.opportunity_name,
          }))
      : []
  }
  value={
    newQuotation.opprtunity_name
      ? newQuotation.opprtunity_name.split(",").map((name) => ({
          value: name,
          label: name,
        }))
      : []
  }
  onChange={(selected) => {
    const oppNames = selected ? selected.map((s) => s.value) : [];
    const firstOpp = opportunities.find(
      (opp) =>
        String(opp.client_id) === String(newQuotation.client_id) &&
        oppNames.includes(opp.opportunity_name)
    );

    setNewQuotation({
      ...newQuotation,
      opprtunity_name: oppNames.join(","),
      // Auto-fill based on selected opportunity
      workCategory: firstOpp?.work_category_name || "",
      lab: firstOpp?.lab_name ? JSON.parse(firstOpp.lab_name).join(", ") : "",
      clientType: firstOpp?.client_type_name || "Corporate",
    });
  }}
/>

</div>



<div className="form-group">
  <label>Client Type</label>
  <input type="text" value={newQuotation.clientType} readOnly />
</div>

<div className="form-group">
  <label>Work Category</label>
  <input type="text" value={newQuotation.workCategory} readOnly />
</div>
<div className="form-group">
  <label>Lab</label>
  <input type="text" value={newQuotation.lab} readOnly />
</div>
       <div className="form-group">
  <label>Quote Value *</label>
  <input
    type="number"
    value={newQuotation.value}
    onChange={(e) =>
      setNewQuotation({ ...newQuotation, value: parseFloat(e.target.value) || 0 })
    }
  />
</div>

<div className="form-group">
  <label>GST</label>
  <input
    type="number"
    value={newQuotation.gst}
    onChange={(e) =>
      setNewQuotation({ ...newQuotation, gst: parseFloat(e.target.value) || 0 })
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
        {/* PAYMENT PHASE */}
<div className="form-group">
  <label>Payment Phase *</label>
  <select
    value={newQuotation.paymentPhase}
    onChange={(e) =>
      setNewQuotation({ ...newQuotation, paymentPhase: e.target.value })
    }
  >
    <option value="Not Started">Not Started</option>
    <option value="Started">Started</option>
  </select>
</div>


{newQuotation.paymentPhase === "Started" && (
  <>
    <div className="form-group">
      <label>Revised Cost</label>
      <input
        type="number"
        value={newQuotation.revisedCost}
        onChange={(e) =>
          setNewQuotation({ ...newQuotation, revisedCost: e.target.value })
        }
      />
    </div>

    <div className="form-group">
      <label>PO Received *</label>
      <select
        value={newQuotation.poReceived}
        onChange={(e) =>
          setNewQuotation({ ...newQuotation, poReceived: e.target.value })
        }
      >
        <option value="No">No</option>
        <option value="Yes">Yes</option>
      </select>
    </div>

    <div className="form-group">
      <label>Payment Received *</label>
      <select
        value={newQuotation.paymentReceived}
        onChange={(e) =>
          setNewQuotation({ ...newQuotation, paymentReceived: e.target.value })
        }
      >
        <option value="No">No</option>
        <option value="Yes">Yes</option>
      </select>
    </div>

    {newQuotation.paymentReceived === "Yes" && (
      <div className="form-group">
        <label>Payment Amount</label>
        <input
          type="number"
          value={newQuotation.paymentAmount}
          onChange={(e) =>
            setNewQuotation({
              ...newQuotation,
              paymentAmount: e.target.value,
            })
          }
        />
      </div>
    )}

    {newQuotation.paymentReceived === "No" && (
      <div className="form-group">
        <label>Payment Pending Reason</label>
        <textarea
          rows="2"
          value={newQuotation.paymentPendingReason}
          onChange={(e) =>
            setNewQuotation({
              ...newQuotation,
              paymentPendingReason: e.target.value,
            })
          }
        />
      </div>
    )}
  </>
)}




      </div>

      {/* LIVE QUOTATION PREVIEW */}
      <div className="quotation-preview" style={{
        border: "1px solid #ccc",
        padding: "20px",
        marginTop: "20px",
        backgroundColor: "#fffefe",
        maxHeight: "400px",
        overflowY: "auto"
      }}>
        <h2 style={{ textAlign: "center" }}>Quotation</h2>
        <p><strong>Quotation No:</strong> {newQuotation.quotationNo}</p>
        <p><strong>Date:</strong> {newQuotation.date}</p>
        <p><strong>Opportunity Name:</strong> {newQuotation.opprtunity_name}</p>
        <p><strong>Client:</strong> {newQuotation.clientName} ({newQuotation.clientType})</p>
        <p><strong>Lab:</strong> {newQuotation.lab}</p>
        <p><strong>Work Category:</strong> {newQuotation.workCategory}</p>
        <p><strong>Description:</strong> {newQuotation.description}</p>
        <p>
  <strong>Quote Value (Incl. GST):</strong> ₹{" "}
  {calculateTotalValue()}
</p>

      </div>

      {/* ACTIONS */}
      <div className="modal-actions">
        <button className="btn-save" onClick={handleSaveQuotation}>
          {editId ? "Update Quotation" : "Create & Save Quotation"}
        </button>

        {/* <button className="btn-download" onClick={() => downloadDocx(newQuotation)}>
          Generate DOCX
        </button> */}

        <button className="btn-cancel" onClick={closeModal}>Cancel</button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
