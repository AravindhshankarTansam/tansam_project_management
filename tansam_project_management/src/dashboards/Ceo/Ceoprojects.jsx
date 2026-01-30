import { useEffect, useState, useMemo } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Ceocss/Ceoprojects.css";

import { fetchProjects } from "../../services/project.api";
import { fetchProjectFollowups } from "../../services/projectfollowup.api";
import { getQuotations } from "../../services/quotation/quotation.api";
const ROWS_PER_PAGE = 10;

export default function CeoProjects() {
  const [projects, setProjects] = useState([]);
  const [followupStatuses, setFollowupStatuses] = useState({});
  const [loading, setLoading] = useState(true);

  /* 🔍 FILTER STATES */
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedType, setSelectedType] = useState("");
const [selectedLabs, setSelectedLabs] = useState([]); // ← Array for multi-select
const [currentPage, setCurrentPage] = useState(1);
const [quotations, setQuotations] = useState([]);
const [labPayments, setLabPayments] = useState({});
const [projectPayments, setProjectPayments] = useState({});

  /* ================= LOAD PROJECTS ================= */
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProjects();
        setProjects(data || []);
      } catch {
        toast.error("Failed to load projects");
      }
    })();
  }, []);
  useEffect(() => {
    (async () => {
      try {
        const data = await getQuotations();
        setQuotations(data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load quotation data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);
useEffect(() => {
  const payments = {};

  projects.forEach((project) => {
    const oppId = project.opportunityId?.trim()?.toUpperCase();
    if (!oppId) return;

    // sum approved & received quotations for this opportunity
    const totalRevenue = quotations
      .filter(
        (q) =>
          q.opportunity_id?.trim()?.toUpperCase() === oppId &&
          q.quotationStatus === "Approved" &&
          q.paymentReceived === "Yes"
      )
      .reduce((sum, q) => sum + Number(q.paymentAmount || 0), 0);

    if (!totalRevenue) return;

    // get labs for project
    const labs = Array.isArray(project.labNames)
      ? project.labNames
      : (project.labNames ? [project.labNames] : []);

    labs.forEach((lab) => {
      const key = lab.trim();
      payments[key] = (payments[key] || 0) + totalRevenue;
    });
  });

  setLabPayments(payments);
}, [projects, quotations]);
  /* ================= LOAD FOLLOWUP STATUS ================= */
  useEffect(() => {
    if (projects.length === 0) return;

    const loadStatuses = async () => {
      const statuses = {};
      const followups = await fetchProjectFollowups();

      projects.forEach((project) => {
        const projectFollowups = followups.filter(
          (f) => f.projectId === project.id
        );

        if (projectFollowups.length > 0) {
          const latest = projectFollowups.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          )[0];
          statuses[project.id] = latest.status;
        } else {
          statuses[project.id] = "Planned";
        }
      });

      setFollowupStatuses(statuses);
      setLoading(false);
    };

    loadStatuses();
  }, [projects]);
// After fetching projects and quotations
// ---------------------------
// Fetch quotations and map revenue per opportunity
// ---------------------------
useEffect(() => {
  (async () => {
    try {
      const data = await getQuotations(); // fetch all quotations
      if (!data) return;

      const paymentsMap = {};

      data.forEach((q) => {
        // Only consider approved and received payments
        if (q.quotationStatus === "Approved" && q.paymentReceived === "Yes") {
          const oppId = q.opportunity_id?.trim().toUpperCase(); // normalize key
          const amount = Number(q.paymentAmount || 0);

          if (oppId) {
            // accumulate if multiple quotations for same opportunity
            paymentsMap[oppId] = (paymentsMap[oppId] || 0) + amount;
          }

          console.log("Quotation:", q.quotationNo, "opportunity_id:", q.opportunity_id, "paymentAmount:", q.paymentAmount);
        }
      });

      console.log("Payments Map:", paymentsMap);
      setProjectPayments(paymentsMap);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load quotation payments");
    }
  })();
}, []);

useEffect(() => {
  (async () => {
    if (!projects || !projectPayments) return;

    try {
      const payments = {};

      // Only calculate for selected labs
      if (selectedLabs.length > 0) {
        selectedLabs.forEach((labName) => {
          const revenue = projects.reduce((sum, project) => {
            const oppId = project.opportunityId?.trim().toUpperCase();
            if (!oppId) return sum;

            // Normalize project.labNames as array of strings
            const projectLabNames = (() => {
              if (!project.labNames) return [];
              if (Array.isArray(project.labNames)) return project.labNames;
              if (typeof project.labNames === "string") {
                try {
                  const parsed = JSON.parse(project.labNames);
                  if (Array.isArray(parsed)) return parsed;
                  return [parsed];
                } catch {
                  return project.labNames.split(",").map(l => l.trim());
                }
              }
              return [];
            })();

            if (projectLabNames.includes(labName)) {
              return sum + (projectPayments[oppId] || 0);
            }
            return sum;
          }, 0);

          payments[labName] = revenue;
        });
      }

      setLabPayments(payments); // only selected labs
    } catch (err) {
      console.error("Failed to calculate lab payments:", err);
    }
  })();
}, [projects, projectPayments, selectedLabs]);


  /* ================= FILTER OPTIONS ================= */
  const clientOptions = useMemo(
    () => [...new Set(projects.map(p => p.clientName).filter(Boolean))],
    [projects]
  );

  const typeOptions = useMemo(
    () => [...new Set(projects.map(p => p.projectType).filter(Boolean))],
    [projects]
  );

  const labOptions = useMemo(() => {
    const labs = new Set();
    projects.forEach((p) => {
      if (!p.labNames) return;

      let labArray = [];
      if (Array.isArray(p.labNames)) {
        labArray = p.labNames;
      } else if (typeof p.labNames === "string") {
        try {
          const parsed = JSON.parse(p.labNames);
          labArray = Array.isArray(parsed) ? parsed : [p.labNames];
        } catch {
          labArray = [p.labNames];
        }
      }
      labArray.forEach(l => labs.add(l.trim()));
    });
    return Array.from(labs);
  }, [projects]);

  /* ================= FILTERED DATA ================= */
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        !searchTerm ||
        p.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.clientName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesClient =
        !selectedClient || p.clientName === selectedClient;

      const matchesType =
        !selectedType || p.projectType === selectedType;

      const matchesLabs =
        selectedLabs.length === 0 ||
        selectedLabs.some(lab => {
          if (Array.isArray(p.labNames)) {
            return p.labNames.includes(lab);
          }
          if (typeof p.labNames === "string") {
            try {
              const parsed = JSON.parse(p.labNames);
              return Array.isArray(parsed) ? parsed.includes(lab) : p.labNames === lab;
            } catch {
              return p.labNames === lab;
            }
          }
          return false;
        });

      return matchesSearch && matchesClient && matchesType && matchesLabs;
    });
  }, [projects, searchTerm, selectedClient, selectedType, selectedLabs]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedClient("");
    setSelectedType("");
    setSelectedLabs([]); // Clear multi-select
    setCurrentPage(1);
  };
{/* ================= LAB PAYMENT SUMMARY ================= */}

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toISOString().split("T")[0];
  };

  const totalPages = Math.ceil(filteredProjects.length / ROWS_PER_PAGE);

  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * ROWS_PER_PAGE;
    return filteredProjects.slice(start, start + ROWS_PER_PAGE);
  }, [filteredProjects, currentPage]);

  /* ================= MULTI-SELECT CHIPS COMPONENT ================= */
  function MultiSelectChips({
    options,
    value,
    onChange,
    placeholder = "Select labs...",
  }) {
    const [open, setOpen] = useState(false);

    const toggle = (lab) => {
      if (value.includes(lab)) {
        onChange(value.filter(v => v !== lab));
      } else {
        onChange([...value, lab]);
      }
    };

    const remove = (lab) => {
      onChange(value.filter(v => v !== lab));
    };

    return (
      <div className="multi-select">
        <div className="multi-select-input" onClick={() => setOpen(!open)}>
          {value.length === 0 ? (
            <span className="placeholder">{placeholder}</span>
          ) : (
            <div className="chips">
              {value.map(lab => (
                <span className="chip" key={lab}>
                  {lab}
                  <button type="button" onClick={(e) => {
                    e.stopPropagation();
                    remove(lab);
                  }}>
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          <span className="arrow">▾</span>
        </div>

        {open && (
          <div className="multi-select-dropdown">
            {options.map(lab => (
              <div
                key={lab}
                className={`option ${value.includes(lab) ? "selected" : ""}`}
                onClick={() => toggle(lab)}
              >
                {lab}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="ceo-quotations">
      <ToastContainer autoClose={1200} />

      <div className="page-header">
        <div>
          <h2>Projects Overview</h2>
          <p>High-level visibility of all projects</p>
        </div>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search project or client..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />

        <select
          value={selectedClient}
          onChange={(e) => {
            setSelectedClient(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Clients</option>
          {clientOptions.map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Project Types</option>
          {typeOptions.map(t => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* Multi-select for Labs */}
        <MultiSelectChips
          options={labOptions}
          value={selectedLabs}
          onChange={setSelectedLabs}
          placeholder="Select labs..."
        />

        {(searchTerm || selectedClient || selectedType || selectedLabs.length > 0) && (
          <button className="clear-btn" onClick={clearFilters}>
            Clear
          </button>
        )}
<div className="lab-cards">
  {Object.keys(labPayments).map(labName => {
    if (labPayments[labName] === 0) return null;
    return (
      <div key={labName} className="lab-card">
        <h4>{labName}</h4>
        <p>₹{labPayments[labName]}</p>
      </div>
    );
  })}
</div>


      </div>

      {/* ================= TABLE ================= */}
      <div className="table-card">
        {loading ? (
          <div className="loading">Loading projects...</div>
        ) : filteredProjects.length === 0 ? (
          <div className="empty-state">No projects found</div>
        ) : (
          <>
            <table className="projects-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Client Name</th>
                  <th>Client Type</th>
                  <th>Project Type</th>
                  <th>Project Status</th>
                  <th>Labs</th>
                  <th>Work Category</th>
                  <th>Revenue</th>
                  <th>Start</th>
                  <th>End</th>
                </tr>
              </thead>

              <tbody>
                {paginatedProjects.map((p) => (
                  <tr key={p.id}>
                    <td>{p.projectName}</td>
                    <td>{p.clientName}</td>
                    <td>
                      <span className="pill pill-client">
                        {p.clientType || "—"}
                      </span>
                    </td>
                    <td>
                      <span className={`type-badge ${p.projectType?.toLowerCase()}`}>
                        {p.projectType}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${followupStatuses[p.id]
                          ?.toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {followupStatuses[p.id] || "Planned"}
                      </span>
                    </td>
                    <td>
                      {Array.isArray(p.labNames)
                        ? p.labNames.join(", ")
                        : p.labNames || "—"}
                    </td>
                    <td>{p.workCategory || "—"}</td>
          <td>
  ₹{projectPayments[p.opportunityId?.trim().toUpperCase()] || "0"}
</td>



                    <td>{formatDate(p.startDate)}</td>
                    <td>{formatDate(p.endDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={currentPage === page ? "active" : ""}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}