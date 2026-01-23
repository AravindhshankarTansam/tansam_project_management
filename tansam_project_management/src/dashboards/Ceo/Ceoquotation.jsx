import { useEffect, useState, useMemo } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Ceocss/Ceoquotation.css";

import { fetchProjects } from "../../services/project.api";
import { getQuotations } from "../../services/quotation/quotation.api";

export default function CeoQuotation() {
  const [projects, setProjects] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 🔎 Filters */
  const [searchProject, setSearchProject] = useState("");
  const [selectedClient, setSelectedClient] = useState("");

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    (async () => {
      try {
        const [allProjects, allQuotations] = await Promise.all([
          fetchProjects(),
          getQuotations(),
        ]);

        // ✅ Only CUSTOMER projects
        const customerProjects = (allProjects || []).filter(
          (p) => p.projectType === "CUSTOMER"
        );

        setProjects(customerProjects);
        setQuotations(allQuotations || []);
      } catch {
        toast.error("Failed to load CEO quotation data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ================= MERGE DATA ================= */
  const tableData = useMemo(() => {
    return projects.map((project) => {
      const quotation = quotations.find(
        (q) => q.project_name === project.projectName
      );

      return {
        projectName: project.projectName,
        clientName: project.clientName,
        clientType: "Customer",
        quotationValue: quotation?.value || null,
      };
    });
  }, [projects, quotations]);

  /* ================= FILTER DATA ================= */
  const clientOptions = [
    ...new Set(tableData.map((d) => d.clientName)),
  ];

  const filteredData = tableData.filter((row) => {
    const matchProject =
      !searchProject ||
      row.projectName
        .toLowerCase()
        .includes(searchProject.toLowerCase());

    const matchClient =
      !selectedClient || row.clientName === selectedClient;

    return matchProject && matchClient;
  });
  const totalQuotationValue = useMemo(() => {
  return filteredData.reduce((sum, row) => {
    return sum + (Number(row.quotationValue) || 0);
  }, 0);
}, [filteredData]);


  const clearFilters = () => {
    setSearchProject("");
    setSelectedClient("");
  };

  const formatCurrency = (value) =>
    value ? `₹ ${Number(value).toLocaleString("en-IN")}` : "—";

  return (
    <div className="ceo-quotation">
      <ToastContainer autoClose={1200} />

      <div className="page-header">
        <h2>Quotation Overview</h2>
        <p>Customer project quotation values</p>
      </div>

      {/* ================= FILTER BAR ================= */}
    <div className="filter-row">
  {/* Left part: search + dropdown + clear */}
  <div className="filter-left">
    <input
      type="text"
      placeholder="Search by project name..."
      value={searchProject}
      onChange={(e) => setSearchProject(e.target.value)}
    />

    <select
      value={selectedClient}
      onChange={(e) => setSelectedClient(e.target.value)}
    >
      <option value="">All Clients</option>
      {clientOptions.map((client) => (
        <option key={client} value={client}>
          {client}
        </option>
      ))}
    </select>

    {(searchProject || selectedClient) && (
      <button className="clear-btn" onClick={clearFilters}>
        Clear
      </button>
    )}
  </div>

  {/* Right part: total value card */}
  <div className="summary-card compact">
    <span className="summary-label">Total Quotation Value</span>
    <span className="summary-value">
      ₹ {totalQuotationValue.toLocaleString("en-IN")}
    </span>
  </div>
</div>

      {/* ================= TABLE ================= */}
      <div className="table-card">
        {loading ? (
          <div className="loading">Loading quotation summary...</div>
        ) : filteredData.length === 0 ? (
          <div className="empty-state">No quotation data available</div>
        ) : (
          <table className="quotation-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Client Name</th>
                <th>Project Type</th>
                <th>Quotation Value</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row) => (
                <tr key={`${row.projectName}-${row.clientName}`}>
                  <td>{row.projectName}</td>
                  <td>{row.clientName}</td>
                  <td>
                    <span className="type-badge customer">CUSTOMER</span>
                  </td>
                  <td className="value">
                    {formatCurrency(row.quotationValue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
