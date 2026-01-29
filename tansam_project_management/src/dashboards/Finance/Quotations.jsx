import { useState, useEffect } from "react";
// import "./Financecss/finance.css";

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
import { fetchOpportunities } from "../../services/coordinator/coordinator.opportunity.api.js";
import { FaMoneyCheckAlt } from "react-icons/fa";
import { fetchProjects } from "../../services/project.api.js";
import Select from "react-select";

export default function Quotations() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
const [showPaymentForm, setShowPaymentForm] = useState(false);

  const [workCategories, setWorkCategories] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [labs, setLabs] = useState([]);
  const [activeTab, setActiveTab] = useState("quotation");
  const [showDoc, setShowDoc] = useState(false);
  const [projects, setProjects] = useState([]);
const [selectedProject, setSelectedProject] = useState("");

const openPaymentModal = (quotation) => {
  setNewQuotation(quotation);
  setShowPaymentModal(true);
};
const [paymentQuotationId, setPaymentQuotationId] = useState(null);

  const clientOptions = [...new Set(data.map((d) => d.clientName))];
  const workCategoryOptions = [
    ...new Set(data.map((d) => d.work_category_name)),
  ];
  const labOptions = [...new Set(data.map((d) => d.lab_name))];
  const [showGenerateQuotation, setShowGenerateQuotation] = useState(false);

  const [selectedClient, setSelectedClient] = useState("");
  const [selectedWorkCategory, setSelectedWorkCategory] = useState("");
  const [selectedLab, setSelectedLab] = useState("");

  const [newQuotation, setNewQuotation] = useState({
    quotationNo: "",
    opportunity_id: "",
    opportunity_name: "",
    client_id: "",
    clientName: "",
    client_type_id: "",
    client_type_name: "",
    work_category_id: "",
    work_category_name: "",
    lab_id: "",
    lab_name: "",
    description: "",
   pricingMode: "value", // "value" | "unit"
unitPrice: "",
qty: "",
gst: "",
    date: "",
   quotationStatus: "Draft",
  revisedCost: "",
  poReceived: "No",
   poNumber: "",
  paymentReceived: "No",
  paymentReceivedDate: "",
  paymentAmount: "",
  paymentPendingReason: "",
   items: [{ description: "", qty: "", unitPrice: "", gst: "", total: "0.00" }],
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
      const generated = await getGeneratedQuotationByQuotationId(
        originalQuotation.id,
      );
      console.log("API returned generated data:", generated);

      // ────────────────────────────────────────────────
      // Define the base structure that GenerateQuotation expects
      const baseQuotation = {
        id: originalQuotation.id,
        quotationNo: originalQuotation.quotationNo || "",
        opportunity_name: originalQuotation.opportunity_name || "",
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
          refNo: `TN/SA/${new Date().getFullYear()}/${String(originalQuotation.id).padStart(4, "0")}`,
          date: new Date().toISOString().split("T")[0],
        };
      } else {
        console.log("Loading existing generated quotation data");
        quotationToUse = {
          ...baseQuotation,

          // original quotation reference
          quotationId: originalQuotation.id,
          quotationNo: originalQuotation.quotationNo,
          opportunity_name:
            originalQuotation.opportunity_name ||
            generated.opportunity_name ||
            "",
          clientName: originalQuotation.clientName || "",

          // generated quotation identity
          generatedId: generated.id,

          refNo: generated.refNo,
          date: generated.date,

          items: generated.items
            ? JSON.parse(generated.items)
            : baseQuotation.items,
          terms: generated.terms
            ? JSON.parse(generated.terms)
            : baseQuotation.terms,
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
// Ensure unitPrice, qty, gst are passed to GenerateQuotation
quotationToUse = {
  ...quotationToUse,
  unitPrice: newQuotation.unitPrice || 0,
  qty: newQuotation.qty || 0,
  gst: newQuotation.gst || 0,
};

      setNewQuotation(quotationToUse);
      setShowGenerateQuotation(true);
      
    } catch (err) {
      console.error("Error loading generated quotation:", err);
      alert(
        "Could not load previous generated version. Opening with basic data.",
      );

      // Fallback – at least show something
      setNewQuotation({
        ...baseQuotation,
        refNo: `TN/SA/${new Date().getFullYear()}/${String(originalQuotation.id).padStart(4, "0")}`,
        date: new Date().toISOString().split("T")[0],
      });
      setShowGenerateQuotation(true);
    }
  };
useEffect(() => {
  const loadProjects = async () => {
    if (!showPaymentForm || !newQuotation.clientName) return;

    try {
      const res = await fetchProjects(); // existing project.api.js
      const filtered = res.filter(
        (p) =>
          p.clientName?.toLowerCase() ===
          newQuotation.clientName?.toLowerCase()
      );
      setProjects(filtered);
    } catch (err) {
      console.error("Failed to load projects", err);
      setProjects([]);
    }
  };

  loadProjects();
}, [showPaymentForm, newQuotation.clientName]);


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
  if (newQuotation.quotationStatus === "Approved") {
    setNewQuotation((prev) => ({
      ...prev,
      paymentPhase: "Started",
    }));
  } else {
    setNewQuotation((prev) => ({
      ...prev,
      
      paymentPhase: "Not Started",
      revisedCost: "",
      poReceived: "No",
      poNumber: "",
      paymentReceived: "No",
      paymentReceivedDate: "",
      paymentAmount: "",
      paymentPendingReason: "",
    }));
  }
}, [newQuotation.quotationStatus]);
const initializePaymentFields = (status, currentData) => {
  if (status === "Approved") {
    return {
     
      
      paymentPhase: currentData.paymentPhase || "Started",
      revisedCost: currentData.revisedCost || "",
      poReceived: currentData.poReceived || "No",
      poNumber: currentData.poNumber || "",
      paymentReceived: currentData.paymentReceived || "No",
      paymentReceivedDate: currentData.paymentReceivedDate || "",
      paymentAmount: currentData.paymentAmount || "",
      paymentPendingReason: currentData.paymentPendingReason || "",
    };
  } else {
    return {
      paymentPhase: "Not Started",
      revisedCost: "",
      poReceived: "No",
      poNumber: "",
      paymentReceived: "No",
      paymentReceivedDate: "",
      paymentAmount: "",
      paymentPendingReason: "",
    };
  }
};

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
        q.work_category_name === selectedWorkCategory) &&
      (selectedLab === "" || q.lab_name === selectedLab),
  );
  const generateQuotationNo = (data) => {
    const numbers = data
      .map((q) => q.quotationNo)
      .filter(Boolean)
      .map((no) => Number(no.replace("TANSAM/", "")))
      .filter((n) => !isNaN(n));

    const nextNumber = numbers.length ? Math.max(...numbers) + 1 : 1001;
    return `TANSAM/${nextNumber}`;
  };

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

const calculateTotalValue = () => {
  if (newQuotation.pricingMode === "unit") {
    const unit = Number(newQuotation.unitPrice || 0);
    const qty = Number(newQuotation.qty || 0);
    const gst = Number(newQuotation.gst || 0);
    const base = unit * qty;
    return (base + (base * gst) / 100).toFixed(2);
  }

  // ✅ VALUE MODE → user already entered final value
  return Number(newQuotation.value || 0).toFixed(2);
};

  const handleEdit = (quotation) => {
    setEditId(quotation.id);
    setNewQuotation({
      ...quotation,
      ...initializePaymentFields(quotation.quotationStatus, quotation),
  
      paymentPhase: quotation.paymentPhase || "Not Started",
      revisedCost: quotation.revisedCost || "",
      poReceived: quotation.poReceived || "No",
        poNumber: quotation.poNumber || "",
      paymentReceived: quotation.paymentReceived || "No",
      paymentReceivedDate: quotation.paymentReceivedDate || "",
      paymentAmount: quotation.paymentAmount || "",
      paymentPendingReason: quotation.paymentPendingReason || "",
    });
    setShowModal(true);
  };

  useEffect(() => {
    getQuotations().then((res) => setData(res));
  }, []);

  const handleSaveQuotation = async () => {
    try {
const totalValue =
  newQuotation.pricingMode === "unit"
    ? (() => {
        const base =
          Number(newQuotation.unitPrice || 0) *
          Number(newQuotation.qty || 0);
        return base + (base * Number(newQuotation.gst || 0)) / 100;
      })()
    : Number(newQuotation.value || 0);

    // if (newQuotation.quotationStatus === "Approved") {
    //   const matchingOpp = opportunities.find(
    //     (opp) =>
    //       opp.opportunity_name === newQuotation.opportunity_name.split(",")[0]
    //   );

    //   if (!matchingOpp || matchingOpp.stage !== "WON") {
    //     return alert(
    //       "Quotation cannot be approved because the opportunity stage is not 'WON'."
    //     );
    //   }
    // }

 const matchedOpportunity = opportunities.find(
    (opp) =>
      opp.opportunity_name ===
      newQuotation.opportunity_name.split(",")[0] // first selected value
  );

  const opportunity_id = matchedOpportunity?.opportunity_id || null;


   const payload = {
  quotationNo: editId
    ? newQuotation.quotationNo
    : newQuotation.quotationNo || generateQuotationNo(data),
     opportunity_id,
  opportunity_name: newQuotation.opportunity_name,
  client_id: newQuotation.client_id,
  clientName: newQuotation.clientName,
  client_type_id: newQuotation.client_type_id,
  client_type_name: newQuotation.client_type_name,
  work_category_id: newQuotation.work_category_id,
  work_category_name: newQuotation.work_category_name,
  lab_id: newQuotation.lab_id,
  lab_name: newQuotation.lab_name,
  description: newQuotation.description,
   pricingMode: newQuotation.pricingMode,
  unitPrice: newQuotation.unitPrice || 0,
  qty: newQuotation.qty || 0,
  gst: newQuotation.gst || 0,
  value: totalValue, 
items: JSON.stringify(newQuotation.items), 
  date: newQuotation.date,
  quotationStatus: newQuotation.quotationStatus,
  // ✅ only include payment fields if Approved
  ...(newQuotation.quotationStatus === "Approved"
    ? {
      
        paymentPhase: newQuotation.paymentPhase,
        revisedCost: newQuotation.revisedCost,
        poReceived: newQuotation.poReceived,
        poNumber: newQuotation.poNumber,
        paymentReceived: newQuotation.paymentReceived,
        paymentReceivedDate: newQuotation.paymentReceivedDate,
        paymentAmount: newQuotation.paymentAmount,
        paymentPendingReason: newQuotation.paymentPendingReason,
      }
    : {}),
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
        opportunity_name: "",
        clientName: "",
        client_type_name: "",
        work_category_name: "",
        lab_name: "",
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
      opportunity_name: "",
      clientName: "",
      client_type_name: "",
      work_category_name: "",
      lab_name: "",
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
              opportunity_name: "",
              clientName: "",
              client_type_name: "",
              work_category_name: "",
              lab_name: "",
              description: "",
              gst: "",
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
          {labOptions.map((lab_name) => (
            <option key={lab_name} value={lab_name}>
              {lab_name}
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
                      <td>
                        <strong>{q.quotationNo}</strong>
                      </td>
                      <td>{q.opportunity_name}</td>
                      <td>{q.clientName}</td>
                      <td>
                        <span
                          className={`badge badge-${q.client_type_name.toLowerCase()}`}
                        >
                          {q.client_type_name}
                        </span>
                      </td>
                      <td>{q.work_category_name}</td>
                      <td>
                        <span className="badge-lab_name">{q.lab_name}</span>
                      </td>
                      <td className="desc-cell">{q.description}</td>
                      <td className="value-cell">
                        ₹ {parseInt(q.value || 0).toLocaleString("en-IN")}
                      </td>
                      <td>{new Date(q.date).toLocaleDateString("en-IN")}</td>

                      {/* Actions column ONLY in Quotation tab */}
                      <td className="actions-cell">
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(q)}
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                          {q.quotationStatus === "Approved" && (
<FaMoneyCheckAlt
  style={{ cursor: "pointer", color: "green" }}
   size={30}
  title="Payment"
  onClick={async () => {
    try {
      // fetch latest quotations from DB
      const allQuotations = await getQuotations();
      const latestQuotation = allQuotations.find((item) => item.id === q.id);

      if (!latestQuotation) return alert("Quotation not found");

      // set state with latest payment info
      setPaymentQuotationId(latestQuotation.id)
      setNewQuotation({
        ...latestQuotation,
        
        paymentPhase: latestQuotation.paymentPhase || "Started",
        revisedCost: latestQuotation.revisedCost || "",
        poReceived: latestQuotation.poReceived || "No",
        poNumber: latestQuotation.poNumber || "",
        paymentReceived: latestQuotation.paymentReceived || "No",
        paymentReceivedDate: latestQuotation.paymentReceivedDate || "",
        paymentAmount: latestQuotation.paymentAmount || "",
        paymentPendingReason: latestQuotation.paymentPendingReason || "",
      });

      setEditId(null); // ensure edit modal is closed
      setShowModal(false);
      setShowPaymentForm(true); // open payment modal
    } catch (err) {
      console.error(err);
      alert("Failed to load payment details");
    }
  }}
/>

)}

                        <button
                          className="btn-delete"
                          onClick={() => deleteRow(q.id)}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                        {q.isGenerated ? (
                          <button
                            className="btn-medit"
                            onClick={() => handleEditGeneratedQuotation(q)}
                            title="Edit Generated Quotation"
                          >
                            <MdEditDocument size={30} />
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
                            <FaFilePdf   size={30} />
                          </button>
                        )}
                      </td>
                    </>
                  ) : (
                    <>
                      <td>
                        <strong>{q.quotationNo}</strong>
                      </td>
                      <td>{q.project_name || "-"}</td>
                      <td>{q.paymentPhase || "Not Started"}</td>   
                      <td>{q.revisedCost || "-"}</td>
                      
                      <td>{q.poReceived || "No"}</td>
                       <td>{q.poNumber || "-"}</td>
                      <td>{q.paymentReceived || "No"}</td>
                      <td>{q.paymentAmount || "-"}</td>
                      <td>{q.paymentPendingReason || "-"}</td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={activeTab === "quotation" ? "11" : "7"}
                  className="no-data"
                >
                  No quotations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
    <div className="pagination">
  {/* Prev */}
  <button
    disabled={page === 1}
    onClick={() => setPage(page - 1)}
  >
    ← Prev
  </button>

  {/* Page Numbers */}
  {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map(
    (num) => (
      <button
        key={num}
        className={`page-btn ${page === num ? "active" : ""}`}
        onClick={() => setPage(num)}
      >
        {num}
      </button>
    )
  )}

  {/* Next */}
  <button
    disabled={page === totalPages}
    onClick={() => setPage(page + 1)}
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
              <button className="btn-close" onClick={closeModal}>
                ✕
              </button>
            </div>

            {/* FORM */}
            <div className="modal-form">
              <div className="form-group">
                <label>Quotation No *</label>
                <input type="text" value={newQuotation.quotationNo} readOnly />
              </div>
<div className="form-group">
   <label>Client Name(s) *</label>

            <select
  value={newQuotation.client_id}
  onChange={(e) => {
    const clientId = e.target.value;
    setNewQuotation({
      ...newQuotation,
      client_id: clientId,
      clientName: "", // keep blank for now
      opportunity_name: "", // reset opportunity selection
      work_category_id: "",
      work_category_name: "",
      lab_id: "",
      lab_name: "",
      client_type_id: "",
      client_type_name: "",
    });
  }}
>
  <option value="">Select Client</option>
  {opportunities
    .map((opp) => ({
      client_id: opp.client_id,
      client_name: opp.client_name,
    }))
    .filter(
      (v, i, a) => a.findIndex((t) => t.client_id === v.client_id) === i
    )
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
  placeholder={
    newQuotation.client_id
      ? "Select Opportunity"
      : "Select Client First"
  }
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
    newQuotation.opportunity_name
      ? newQuotation.opportunity_name.split(",").map((name) => ({
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
      opportunity_name: oppNames.join(","),
      clientName: firstOpp?.client_name || "",
      
      // Auto-fill only AFTER opportunity selection
      client_type_id: firstOpp?.client_type_id || "",
      client_type_name: firstOpp?.client_type_name || "",
      work_category_id: firstOpp?.work_category_id || "",
      work_category_name: firstOpp?.work_category_name || "",
      lab_id: firstOpp?.lab_id || "",
      lab_name: firstOpp?.lab_name
        ? JSON.parse(firstOpp.lab_name).join(", ")
        : "",
    });
  }}
/>

              </div>

              <div className="form-group">
                <label>Client Type</label>
                <input
                  type="text"
                  value={newQuotation.client_type_name}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>Work Category</label>
                <input
                  type="text"
                  value={newQuotation.work_category_name}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label>Lab</label>
                <input type="text" value={newQuotation.lab_name} readOnly />
              </div>
      <div className="form-group">
  <label>Pricing Mode *</label>
  <select
    value={newQuotation.pricingMode}
    onChange={(e) =>
      setNewQuotation({
        ...newQuotation,
        pricingMode: e.target.value,
        unitPrice: "",
        qty: "",
        gst: "",
        value: "",
      })
    }
  >
    <option value="value">Enter Total Value Only</option>
    <option value="unit">Unit Price × Qty + GST</option>
  </select>
</div>
{newQuotation.pricingMode === "value" && (
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
)}
{newQuotation.pricingMode === "unit" && (
  <>
    <div className="form-group">
      <label>Unit Price *</label>
      <input
        type="number"
        value={newQuotation.unitPrice}
        onChange={(e) =>
          setNewQuotation({ ...newQuotation, unitPrice: e.target.value })
        }
      />
    </div>

    <div className="form-group">
      <label>Quantity *</label>
      <input
        type="number"
        value={newQuotation.qty}
        onChange={(e) =>
          setNewQuotation({ ...newQuotation, qty: e.target.value })
        }
      />
    </div>

    <div className="form-group">
      <label>GST (%)</label>
      <input
        type="number"
        value={newQuotation.gst}
        onChange={(e) =>
          setNewQuotation({ ...newQuotation, gst: e.target.value })
        }
      />
    </div>

    <div className="form-group">
      <label>Calculated Value</label>
      <input
        type="text"
        readOnly
        value={(() => {
          const unit = Number(newQuotation.unitPrice || 0);
          const qty = Number(newQuotation.qty || 0);
          const gst = Number(newQuotation.gst || 0);
          const base = unit * qty;
          const total = base + (base * gst) / 100;
          return total.toFixed(2);
        })()}
      />
    </div>
  </>
)}


              <div className="form-group">
                <label>Work Description *</label>
                <textarea
                  value={newQuotation.description}
                  onChange={(e) =>
                    setNewQuotation({
                      ...newQuotation,
                      description: e.target.value,
                    })
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
    <div className="form-group">
  <label>Quotation Status *</label>
  <select
    value={newQuotation.quotationStatus}
    onChange={(e) =>
      setNewQuotation({
        ...newQuotation,
        quotationStatus: e.target.value,
      })
    }
  >
    <option value="Draft">Draft</option>
    {editId && (
      <>
        <option value="Submitted">Submitted</option>
        <option value="Approved">Approved</option>
        <option value="Rejected">Rejected</option>
      </>
    )}
  </select>
</div>


              {/* PAYMENT PHASE */}
  

            </div>
  

            {/* LIVE QUOTATION PREVIEW */}
            {/* <div
              className="quotation-preview"
              style={{
                border: "1px solid #ccc",
                backgroundColor: "#fffefe",
                maxHeight: "100px",
              }}
            >
              <h2 style={{ textAlign: "center" }}>Quotation</h2>
              <p>
                <strong>Quotation No:</strong> {newQuotation.quotationNo}
              </p>
              <p>
                <strong>Date:</strong> {newQuotation.date}
              </p>
              <p>
                <strong>Opportunity Name:</strong>{" "}
                {newQuotation.opportunity_name}
              </p>
              <p>
                <strong>Client:</strong> {newQuotation.clientName} (
                {newQuotation.client_type_name})
              </p>
              <p>
                <strong>Lab:</strong> {newQuotation.lab_name}
              </p>
              <p>
                <strong>Work Category:</strong>{" "}
                {newQuotation.work_category_name}
              </p>
              <p>
                <strong>Description:</strong> {newQuotation.description}
              </p>
              <p>
                <strong>Quote Value (Incl. GST):</strong> ₹{" "}
                {calculateTotalValue()}
              </p>
            </div> */}

            {/* ACTIONS */}
            <div className="modal-actions">
              <button className="btn-save" onClick={handleSaveQuotation}>
                {editId ? "Update Quotation" : "Create & Save Quotation"}
              </button>

              {/* <button className="btn-download" onClick={() => downloadDocx(newQuotation)}>
          Generate DOCX
        </button> */}

              <button className="btn-cancel" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
         {showPaymentForm && (
  <div className="modal-overlay" onClick={() => setShowPaymentForm(false)}>
    <div className="modal" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h3>Enter Payment Details</h3>
        <button className="btn-close" onClick={() => setShowPaymentForm(false)}>
          ✕
        </button>
      </div>

      <div className="modal-form">

  

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
{newQuotation.poReceived === "Yes" && (
  <div className="form-group">
    <label>Purchase Order Number *</label>
    <input
      type="text"
      value={newQuotation.poNumber || ""}
      onChange={(e) =>
        setNewQuotation({ ...newQuotation, poNumber: e.target.value })
      }
    />
  </div>
)}

            <div className="form-group">
              <label>Payment Received *</label>
              <select
                value={newQuotation.paymentReceived}
                onChange={(e) =>
                  setNewQuotation({
                    ...newQuotation,
                    paymentReceived: e.target.value,
                  })
                }
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

      {newQuotation.paymentReceived === "Yes" && (
  <>
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

    <div className="form-group">
      <label>Payment Received Date *</label>
      <input
        type="date"
        value={newQuotation.paymentReceivedDate || ""}
        onChange={(e) =>
          setNewQuotation({
            ...newQuotation,
            paymentReceivedDate: e.target.value,
          })
        }
      />
    </div>
  </>
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

      <div className="modal-actions">
               <button
          className="btn-save"
          onClick={async () => {
            try {
              await updateQuotation(newQuotation.id, newQuotation); // save payment
              setShowPaymentForm(false);
              // optionally refresh your quotation list
            } catch (err) {
              console.error(err);
              alert("Error saving payment details");
            }
          }}
        >
          Save Payment
        </button>
        <button
          className="btn-cancel"
          onClick={() => setShowPaymentForm(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
