import { useState, useEffect, useMemo } from "react";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
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

  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage] = useState(1);

  const [form, setForm] = useState(emptyForm);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    (async () => {
      try {
        const [p, t, o] = await Promise.all([
          fetchProjects(),
          fetchProjectTypes(),
          fetchOpportunities(),
        ]);

        setProjects(p || []);
        setProjectTypes((t || []).filter(x => x.status === "ACTIVE"));
        setOpportunities(o || []);
      } catch {
        toast.error("Failed to load data");
      }
    })();
  }, []);

  /* ================= NORMALIZED PROJECT TYPE ================= */

  const projectType = form.projectType?.toUpperCase();

  const isInternal = projectType === "INTERNAL";
  const isCustomer = projectType === "CUSTOMER";
  const isCustomerPOC = projectType === "CUSTOMER_POC";

  /* ================= OPPORTUNITY LOOKUP ================= */

  const selectedOpportunity = useMemo(() => {
    if (!isCustomerPOC || !form.opportunityId) return null;
    return opportunities.find(
      o => o.opportunity_id === form.opportunityId
    );
  }, [isCustomerPOC, form.opportunityId, opportunities]);

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
      projectType: projectType,
      projectName: isCustomerPOC
        ? selectedOpportunity?.opportunity_name
        : form.projectName,
      clientName: isCustomerPOC
        ? selectedOpportunity?.customer_name
        : form.clientName,
      opportunityId: isCustomerPOC ? form.opportunityId : null,
      startDate: form.startDate,
      endDate: form.endDate,
      status: form.status,
      quotationNumber: isCustomer ? form.quotationNumber : null,
      poNumber: isCustomer ? form.poNumber : null,
      poFile: isCustomer ? form.poFile : null,
    };

    try {
      if (isEdit) {
        await updateProject(form.id, payload);
        toast.success("Project updated");
      } else {
        await createProject(payload);
        toast.success("Project created");
      }

      setProjects(await fetchProjects());
      setShowModal(false);
      setIsEdit(false);
      setForm(emptyForm);
    } catch (err) {
      toast.error(err.message || "Action failed");
    }
  };

  /* ================= FILTER + PAGINATION ================= */

  const filteredProjects = useMemo(() => {
    if (!searchTerm) return projects;
    const q = searchTerm.toLowerCase();
    return projects.filter(
      p =>
        p.projectName?.toLowerCase().includes(q) ||
        p.clientName?.toLowerCase().includes(q)
    );
  }, [projects, searchTerm]);


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

      {/* SEARCH */}
      <div className="search-box">
        <FiSearch />
        <input
          placeholder="Search project or client..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <table className="project-table">
        <thead>
          <tr>
            <th>Project</th>
            <th>Client</th>
            <th>Type</th>
            <th>Start</th>
            <th>End</th>
            <th>Status</th>
            {isTL && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {paginatedProjects.map(p => (
            <tr key={p.id}>
              <td>{p.projectName}</td>
              <td>{p.clientName}</td>
              <td>{p.projectType}</td>
              <td>{formatDate(p.startDate)}</td>
              <td>{formatDate(p.endDate)}</td>
              <td>
                <span className={`status-badge ${p.status.toLowerCase().replace(" ", "-")}`}>
                  {p.status === "Completed" && <FiCheckCircle />}
                  {p.status}
                </span>
              </td>
              {isTL && (
                <td className="action-col">
                  <button className="icon-btn edit-btn"
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
                  <button className="icon-btn delete-btn" onClick={() => deleteProject(p.id)}>
                    <FiTrash2 />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{isEdit ? "Edit Project" : "Create Project"}</h3>

            <form onSubmit={handleSubmit}>
              {/* PROJECT TYPE */}
              <select
                name="projectType"
                value={form.projectType}
                onChange={handleChange}
                required
              >
                <option value="">Select Project Type</option>
                {projectTypes.map(t => (
                  <option key={t.id} value={t.name}>
                    {t.name}
                  </option>
                ))}
              </select>

              {/* CUSTOMER POC */}
              {isCustomerPOC && (
                <>
                  <select
                    name="opportunityId"
                    value={form.opportunityId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Opportunity</option>
                    {opportunities.map(o => (
                      <option key={o.opportunity_id} value={o.opportunity_id}>
                        {o.opportunity_name}
                      </option>
                    ))}
                  </select>

                  <input
                    value={selectedOpportunity?.opportunity_name || ""}
                    placeholder="Project Name"
                    disabled
                  />

                  <input
                    value={selectedOpportunity?.customer_name || ""}
                    placeholder="Client Name"
                    disabled
                  />
                </>
              )}

              {/* INTERNAL + CUSTOMER */}
              {(isInternal || isCustomer) && (
                <>
                  <input
                    name="projectName"
                    placeholder="Project Name"
                    value={form.projectName}
                    onChange={handleChange}
                    required
                  />

                  <input
                    name="clientName"
                    placeholder="Client Name"
                    value={form.clientName}
                    onChange={handleChange}
                    required
                  />
                </>
              )}

              {/* DATES */}
              <input type="date" name="startDate" value={form.startDate} onChange={handleChange} required />
              <input type="date" name="endDate" value={form.endDate} onChange={handleChange} required />

              {/* CUSTOMER ONLY */}
              {isCustomer && (
                <>
                  <input
                    name="quotationNumber"
                    placeholder="Quotation Number"
                    value={form.quotationNumber}
                    onChange={handleChange}
                    required
                  />

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

              {/* STATUS */}
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
                <button type="submit">
                  {isEdit ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
