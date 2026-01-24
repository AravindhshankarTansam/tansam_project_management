import { useState, useEffect, useMemo } from "react";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiUsers,
   FiEye ,
   FiX
} from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CreateProject.css";

import {
  createProject,
  fetchProjects,
  updateProject,
  deleteProject,
} from "../../services/project.api";

import { fetchProjectTypes } from "../../services/admin/admin.roles.api";
import { fetchOpportunities } from "../../services/coordinator/coordinator.opportunity.api";
import { getQuotations } from "../../services/quotation/quotation.api";
import { fetchOpportunityTrackers } 
  from "../../services/coordinator/coordinator.tracker.api";


/* ================= CONSTANTS ================= */

const PROJECTS_PER_PAGE = 10;

const emptyForm = {
  id: null,
  projectType: "",
  projectName: "",
  clientName: "",
  opportunityId: "",
  startDate: "",
  endDate: "",
  status: "Planned",
  quotationNumber: "",
  poNumber: "",
  poFile: null,
};

const formatDate = (d) =>
  d ? new Date(d).toISOString().split("T")[0] : "";

/* ================= COMPONENT ================= */

export default function CreateProject() {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const isTL = role === "TEAM LEAD";
  const isAdmin = role === "ADMIN";

  const [projects, setProjects] = useState([]);
  const [projectTypes, setProjectTypes] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [quotations, setQuotations] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedClientDetails, setSelectedClientDetails] = useState(null);
  const [selectedOppClient, setSelectedOppClient] = useState("");

const [trackers, setTrackers] = useState([]);


  const [form, setForm] = useState(emptyForm);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    (async () => {
      try {
        const [p, t, o, q,tr] = await Promise.all([
          fetchProjects(),
          fetchProjectTypes(),
          fetchOpportunities(),
          getQuotations(),
            fetchOpportunityTrackers(), 
        ]);

        setProjects(p || []);
        setProjectTypes((t || []).filter((x) => x.status === "ACTIVE"));
        setOpportunities(o || []);
        setQuotations(q || []);
         setTrackers(tr || []);
      } catch {
        toast.error("Failed to load data");
      }
    })();
  }, []);

  /* ================= PROJECT TYPE FLAGS ================= */

  const projectType = form.projectType?.toUpperCase() || "";
  const isCustomer = projectType === "CUSTOMER";
  const isCustomerPOC = projectType === "CUSTOMER_POC";

  
const stageMap = useMemo(() => {
  const map = {};
  trackers.forEach((t) => {
    map[String(t.opportunity_id)] = t.stage;
  });
  return map;
}, [trackers]);
const opportunityClients = useMemo(() => {
  const set = new Set();
  opportunities.forEach((o) => {
    if (o.client_name) set.add(o.client_name);
  });
  return Array.from(set);
}, [opportunities]);

useEffect(() => {
  // console.log("TRACKERS:", trackers);
  // console.log("STAGE MAP:", stageMap);
}, [trackers, stageMap]);


const filteredOpportunitiesForProject = useMemo(() => {
  if (!form.projectType || !selectedOppClient) return [];

  return opportunities.filter((o) => {
    // 1️⃣ Client filter
    if (o.client_name !== selectedOppClient) return false;

    // 2️⃣ Stage filter
    const stage = stageMap[String(o.opportunity_id)];

    if (isCustomer) {
      return stage === "WON";
    }

    if (isCustomerPOC) {
      return stage && stage !== "LOST";
    }

    return false;
  });
}, [
  form.projectType,
  selectedOppClient,
  opportunities,
  stageMap,
  isCustomer,
  isCustomerPOC,
]);



useEffect(() => {
  setForm((prev) => ({
    ...prev,
    opportunityId: "",
  }));
  setSelectedOppClient("");
}, [form.projectType]);



  /* ================= SELECTED OPPORTUNITY ================= */

  const selectedOpportunity = useMemo(() => {
    if (!form.opportunityId) return null;
    return opportunities.find((o) => o.opportunity_id === form.opportunityId);
  }, [form.opportunityId, opportunities]);

  /* ================= DERIVED AUTO-FILL VALUES ================= */

  // Pure computation — no state updates here
const autoFilled = useMemo(() => {
  if (!selectedOpportunity || (!isCustomer && !isCustomerPOC)) {
    return {
      projectName: form.projectName,
      clientName: form.clientName,
      quotationNumber: form.quotationNumber,
    };
  }

  const projectName = selectedOpportunity.opportunity_name || form.projectName;
  const clientName = selectedOpportunity.client_name || form.clientName;

  let quotationNumber = "";

  if (isCustomer && quotations.length > 0) {
    // Super robust matching: trim + normalize spaces + case-insensitive
    const oppClient = (selectedOpportunity.client_name || "")
      .trim()
      .replace(/\s+/g, " ") // normalize multiple spaces
      .toLowerCase();

    const related = quotations.filter((q) => {
      const qClient = (q.clientName || "")
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();

      return qClient === oppClient || qClient.includes(oppClient) || oppClient.includes(qClient);
    });

    if (related.length > 0) {
      // Get the most recent quotation
      const latest = related.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
      quotationNumber = latest.quotationNo || ""; // ← correct field: quotationNo
    }
  }

  return { projectName, clientName, quotationNumber };
}, [selectedOpportunity, isCustomer, isCustomerPOC, quotations, form.projectName, form.clientName, form.quotationNumber]);

  // Apply auto-fill ONLY when opportunityId changes (safe & controlled)
// Apply auto-fill ONLY when opportunityId changes (safe & controlled)
useEffect(() => {
  if (!form.opportunityId) return;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  setForm((prev) => ({
    ...prev,
    projectName: autoFilled.projectName,
    clientName: autoFilled.clientName,
    quotationNumber: autoFilled.quotationNumber,
  }));
}, [form.opportunityId]);

  /* ================= HANDLERS ================= */

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isTL) return;

    if (isCustomer && (!form.quotationNumber || !form.poNumber || !form.poFile)) {
      toast.error("Quotation, PO Number & File are required");
      return;
    }

    const payload = {
      projectType,
      projectName: isCustomer || isCustomerPOC
        ? selectedOpportunity?.opportunity_name || form.projectName
        : form.projectName,
      clientName: isCustomer || isCustomerPOC
        ? selectedOpportunity?.client_name || form.clientName
        : form.clientName,
      opportunityId: (isCustomer || isCustomerPOC) ? form.opportunityId : null,
      startDate: form.startDate,
      endDate: form.endDate,
      status: form.status,
      quotationNumber: isCustomer ? form.quotationNumber : null,
      poNumber: isCustomer ? form.poNumber : null,
      poFile: isCustomer ? form.poFile : null,
    };

    try {
      isEdit
        ? await updateProject(form.id, payload)
        : await createProject(payload);

      setProjects(await fetchProjects());
      setShowModal(false);
      setIsEdit(false);
      setForm(emptyForm);
      toast.success(isEdit ? "Project updated" : "Project created");
    } catch (err) {
      toast.error(err.message || "Action failed");
    }
  };
  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this project?")) return;

  try {
    await deleteProject(id);

    // ✅ Update UI instantly (no refresh)
    setProjects((prev) => prev.filter((p) => p.id !== id));

    toast.success("Project deleted successfully");
  } catch (err) {
    toast.error(err.message || "Delete failed");
  }
};


  /* ================= FILTERS & PAGINATION ================= */

  const uniqueClients = useMemo(
    () => [...new Set(projects.map((p) => p.clientName).filter(Boolean))],
    [projects]
  );

  const filteredProjects = useMemo(() => {
    let data = projects;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      data = data.filter(
        (p) =>
          p.projectName?.toLowerCase().includes(q) ||
          p.clientName?.toLowerCase().includes(q)
      );
    }

    if (selectedClient) {
      data = data.filter((p) => p.clientName === selectedClient);
    }

    return data;
  }, [projects, searchTerm, selectedClient]);

  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * PROJECTS_PER_PAGE,
    currentPage * PROJECTS_PER_PAGE
  );

  /* ================= ACCESS ================= */

  if (!isTL && !isAdmin) {
    return <div className="unauthorized">Access Denied</div>;
  }

  /* ================= UI ================= */

  return (
    <div className="create-project">
      <ToastContainer autoClose={1200} />

      <div className="page-header">
        <h2>Project Management</h2>
        {isTL && (
          <button className="add-btn" onClick={() => setShowModal(true)}>
            <FiPlus /> Create New Project
          </button>
        )}
      </div>

      {/* SEARCH + CLIENT FILTER */}
      <div className="search-filter-bar">
        <div className="search-box">
          <FiSearch />
          <input
            placeholder="Search project or client..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="client-filter-box">
          <select
            value={selectedClient}
            onChange={(e) => {
              setSelectedClient(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Clients</option>
            {uniqueClients.map((client) => (
              <option key={client} value={client}>
                {client}
              </option>
            ))}
          </select>
        </div>

        {(searchTerm || selectedClient) && (
          <button
            className="reset-btn"
            onClick={() => {
              setSearchTerm("");
              setSelectedClient("");
              setCurrentPage(1);
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* TABLE */}
      <table className="project-table">
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Client Name</th>
            <th>Project Type</th>
            {/* <th>Client Details</th> */}
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
            {isTL && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {paginatedProjects.map((p) => (
            <tr key={p.id}>
              <td>{p.projectName}</td>
              <td className="client-name-cell">
                <span>{p.clientName}</span>

                <button
                  className="inline-view-btn"
                  title="View Client Details"
                  onClick={() => setSelectedClientDetails(p)}
                >
                  <FiEye color="#16a34a" />{" "}
                  {/* ← Green color (same as your app's green) */}
                </button>
              </td>

              <td>{p.projectType}</td>
              {/* <td className="client-details-col">
                <button
                  className="view-btn"
                  title="View Client Details"
                  onClick={() => setSelectedClientDetails(p)}
                >
                  <FiEye />
                </button>
              </td> */}

              <td>{formatDate(p.startDate)}</td>
              <td>{formatDate(p.endDate)}</td>
              <td>
                <span
                  className={`status-badge ${p.status.toLowerCase().replace(" ", "-")}`}
                >
                  {p.status === "Completed" && <FiCheckCircle />}
                  {p.status}
                </span>
              </td>
              {isTL && (
                <td className="action-col">
                  <button
                    className="icon-btn edit-btn"
                    onClick={() => {
                      setForm({
                        ...p,
                        startDate: formatDate(p.startDate),
                        endDate: formatDate(p.endDate),
                      });
                      setIsEdit(true);
                      setShowModal(true);
                    }}
                  >
                    <FiEdit />
                  </button>
                  <button
                    className="icon-btn delete-btn"
                    onClick={() => handleDelete(p.id)}
                  >
                    <FiTrash2 />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <FiChevronLeft /> Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`page-number ${page === currentPage ? "active" : ""}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            className="page-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next <FiChevronRight />
          </button>
        </div>
      )}
      {/* CLIENT DETAILS MODAL */}
      {selectedClientDetails && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedClientDetails(null)}
        >
          <div
            className="modal client-details-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with title + close button */}
            <div className="modal-header">
              <h3>Client Details</h3>
              <button
                className="close-btn" // changed class name
                onClick={() => setSelectedClientDetails(null)}
                aria-label="Close"
                title="Close"
              >
                <FiX size={24} strokeWidth={3} /> {/* using react icon */}
              </button>
            </div>

            {/* Content */}
            <dl className="client-info-grid">
              <dt>Client</dt>
              <dd>{selectedClientDetails.clientName || "—"}</dd>

              <dt>Contact Person</dt>
              <dd>{selectedClientDetails.contactPerson || "—"}</dd>

              <dt>Email</dt>
              <dd>{selectedClientDetails.contactEmail || "—"}</dd>

              <dt>Phone</dt>
              <dd>{selectedClientDetails.contactPhone || "—"}</dd>
            </dl>

            {/* Optional footer */}
            <div className="modal-footer">
              <button
                className="close-footer-btn"
                onClick={() => setSelectedClientDetails(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{isEdit ? "Edit Project" : "Create Project"}</h3>

            <form onSubmit={handleSubmit}>
              <select
                name="projectType"
                value={form.projectType}
                onChange={handleChange}
                required
              >
                <option value="">Select Project Type</option>
                {projectTypes.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>
              {/* SELECT CLIENT FIRST */}
              {(isCustomer || isCustomerPOC) && (
                <select
                  value={selectedOppClient}
                  onChange={(e) => {
                    setSelectedOppClient(e.target.value);
                    setForm((prev) => ({ ...prev, opportunityId: "" }));
                  }}
                  required
                >
                  <option value="">Select Client</option>
                  {opportunityClients.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              )}

              {(isCustomer || isCustomerPOC) && selectedOppClient && (
                <select
                  name="opportunityId"
                  value={form.opportunityId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Opportunity</option>
                  {filteredOpportunitiesForProject.map((o) => (
                    <option key={o.opportunity_id} value={o.opportunity_id}>
                      {o.opportunity_name} ({o.client_name})
                    </option>
                  ))}
                </select>
              )}

              <input
                name="projectName"
                placeholder="Project Name"
                value={autoFilled.projectName} // ← Use derived value
                onChange={handleChange}
                disabled={isCustomer || isCustomerPOC}
                required
              />

              <input
                name="clientName"
                placeholder="Client Name"
                value={autoFilled.clientName} // ← Use derived value
                onChange={handleChange}
                disabled={isCustomer || isCustomerPOC}
                required
              />

              {isCustomer && (
                <input
                  name="quotationNumber"
                  placeholder="Quotation Number (auto-filled)"
                  value={autoFilled.quotationNumber} // ← Use derived value
                  disabled
                />
              )}

              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
              />
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                required
              />

              {isCustomer && (
                <>
                  <input
                    name="poNumber"
                    placeholder="Purchase Order Number"
                    value={form.poNumber}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) =>
                      setForm({ ...form, poFile: e.target.files[0] })
                    }
                    required
                  />
                </>
              )}

              <select name="status" value={form.status} onChange={handleChange}>
                <option>Planned</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>On Hold</option>
              </select>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit">{isEdit ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}