import { useEffect, useState, useMemo } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Ceocss/Ceoprojects.css";

import { fetchProjects } from "../../services/project.api";
import { fetchProjectFollowups } from "../../services/projectFollowup.api";
import { getQuotations } from "../../services/quotation/quotation.api";
import { getTotalRevenue } from "../../services/quotation/quotation.api";
import { fetchLabs } from "../../services/admin/admin.roles.api";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
const ROWS_PER_PAGE = 10;

export default function CeoProjects() {
  const [projects, setProjects] = useState([]);
  const [followupStatuses, setFollowupStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [dynamicFilteredRevenue, setDynamicFilteredRevenue] = useState(0);
  /* 🔍 FILTER STATES */
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedLabs, setSelectedLabs] = useState([]); // ← Array for multi-select
  const [currentPage, setCurrentPage] = useState(1);
  const [quotations, setQuotations] = useState([]);
  const [_labPayments, setLabPayments] = useState({});
  // const [projectPayments, setProjectPayments] = useState({});
  const [allLabPayments, setAllLabPayments] = useState({});
  const [_filteredLabPayments, setFilteredLabPayments] = useState({});
  const [labs, setLabs] = useState([]); // ← fetched from API
  // const totalRevenue = useMemo(() => {
  //   return quotations
  //     .filter(
  //       (q) => q.quotationStatus === "Approved" && q.paymentReceived === "Yes"
  //     )
  //     .reduce((sum, q) => sum + Number(q.paymentAmountReceived || 0), 0);
  // }, [quotations]);
const revenueByOpportunity = useMemo(() => {
  const map = {};
  quotations.forEach((q) => {
    const key = String(q.opportunity_id || "");  // remove any inner spaces

    map[key] =Number(q.paymentAmount || 0);
  });
  return map;
}, [quotations]);
const downloadExcel = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Projects");

  // Add headers
  worksheet.columns = [
    { header: "Project Name", key: "projectName", width: 30 },
    { header: "Client Name", key: "clientName", width: 25 },
    { header: "Client Type", key: "clientType", width: 20 },
    { header: "Project Type", key: "projectType", width: 20 },
    { header: "Project Status", key: "status", width: 20 },
    { header: "Labs", key: "labs", width: 30 },
    { header: "Work Category", key: "workCategory", width: 25 },
    { header: "Revenue", key: "revenue", width: 15 },
    { header: "Start", key: "start", width: 15 },
    { header: "End", key: "end", width: 15 },
  ];

  // Add rows
projects.forEach((p) => {
  const key = String(p.opportunityId || "")
    .trim()
    .toUpperCase()
    .replace(/\s/g, "");

  const revenue = revenueByOpportunity[key] || 0; // now matches table

    // Handle labs
    let labs = "—";
    if (Array.isArray(p.labNames)) labs = p.labNames.join(", ");
    else if (typeof p.labNames === "string") {
      try {
        const parsed = JSON.parse(p.labNames);
        labs = Array.isArray(parsed) ? parsed.join(", ") : parsed;
      } catch {
        labs = p.labNames;
      }
    }

    worksheet.addRow({
      projectName: p.projectName || "—",
      clientName: p.clientName || "—",
      clientType: p.client_Type || "—",
      projectType: p.projectType || "—",
      status: followupStatuses[p.id] || "Planned",
      labs,
      workCategory: p.workCategory || "—",
      revenue,
      start: formatDate(p.startDate),
      end: formatDate(p.endDate),
    });
  });

  // Convert workbook to blob and save
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/octet-stream" });
  saveAs(blob, "Projects.xlsx");
};
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
      const data = await getQuotations();
      if (!data) return;

      const paymentsMap = {};

      data.forEach((q) => {
        const oppId = String(q.opportunity_id || "")
          .trim()
          .toUpperCase()
          .replace(/\s/g, "");

        const amount = Number(q.paymentAmount || 0);

        paymentsMap[oppId] = (paymentsMap[oppId] || 0) + amount;
      });

      setProjectPayments(paymentsMap);
    } catch (err) {
      // toast.error("Failed to load quotation payments");
    }
  })();
}, []);
  useEffect(() => {
    const loadLabs = async () => {
      try {
        const labData = await fetchLabs(); // from admin.roles.api.js
        // Map to names if API returns objects
        const labNames = labData.map(l => l.name);
        setLabs(labNames);
      } catch (err) {
        console.error("Failed to fetch labs:", err);
        alert("Failed to load labs");
      }
    };

    loadLabs();
  }, []);



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

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const params = new URLSearchParams();

        if (selectedClient) params.append("clientName", selectedClient);
        if (selectedType) params.append("projectType", selectedType);
        if (selectedLabs.length > 0) params.append("labs", selectedLabs.join(","));

      const data = await getTotalRevenue(params.toString());
setDynamicFilteredRevenue(data.totalRevenue || 0);
      } catch (error) {
        console.error("Revenue fetch error:", error);
      }
    };

    fetchRevenue();
  }, [selectedClient, selectedType, selectedLabs]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedClient("");
    setSelectedType("");
    setSelectedLabs([]); // Clear multi-select
    setCurrentPage(1);
  };
  {/* ================= LAB PAYMENT SUMMARY ================= */ }

  const formatDate = (date) => {
    if (!date) return "—";

    const d = new Date(date);

    if (isNaN(d.getTime())) return "—"; // ✅ prevents crash

    return d.toISOString().split("T")[0];
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
      <option key={c} value={c}>{c}</option>
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
      <option key={t} value={t}>{t}</option>
    ))}
  </select>

  {/* Labs should come immediately after project type */}
  <MultiSelectChips
    options={labs}
    value={selectedLabs}
    onChange={setSelectedLabs}
    placeholder="Select labs..."
  />
  <div className="lab-cards">
          <div className="lab-card total-revenue">
            <h4>Total Revenue</h4>
            <p>
              ₹ {Number(dynamicFilteredRevenue).toLocaleString("en-IN")}
            </p>
          </div>
        </div>
          <button className="download-btn" onClick={downloadExcel}>
  Download Excel
</button>
  {(searchTerm || selectedClient || selectedType || selectedLabs.length > 0) && (
    <button className="clear-btn" onClick={clearFilters}>
      Clear
    </button>
  )}

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
                        {p.client_Type || "—"}
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
  {(() => {
    const key = String(p.opportunityId || "").trim();
    const revenue = revenueByOpportunity[key] || 0;

    return `₹${revenue.toLocaleString("en-IN")}`;
  })()}
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
