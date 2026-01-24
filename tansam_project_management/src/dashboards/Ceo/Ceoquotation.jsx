import { useEffect, useState, useMemo } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Ceocss/Ceoquotation.css";

import { fetchProjects } from "../../services/project.api";
import { getQuotations } from "../../services/quotation/quotation.api";

const ITEMS_PER_PAGE = 10;

export default function CeoQuotation() {
  const [projects, setProjects] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 🔎 Filters & Pagination */
  const [searchProject, setSearchProject] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    (async () => {
      try {
        const [allProjects, allQuotations] = await Promise.all([
          fetchProjects(),
          getQuotations(),
        ]);

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

  /* ================= FILTERED & PAGINATED DATA ================= */
  const clientOptions = [...new Set(tableData.map((d) => d.clientName))];

  const filteredData = useMemo(() => {
    return tableData.filter((row) => {
      const matchProject =
        !searchProject ||
        row.projectName?.toLowerCase().includes(searchProject.toLowerCase());

      const matchClient = !selectedClient || row.clientName === selectedClient;

      return matchProject && matchClient;
    });
  }, [tableData, searchProject, selectedClient]);

  const totalQuotationValue = useMemo(() => {
    return filteredData.reduce((sum, row) => sum + (Number(row.quotationValue) || 0), 0);
  }, [filteredData]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const clearFilters = () => {
    setSearchProject("");
    setSelectedClient("");
    setCurrentPage(1);
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

      {/* ================= FILTER + TOTAL ROW ================= */}
      <div className="filter-row">
        <div className="filter-left">
          <input
            type="text"
            placeholder="Search by project name..."
            value={searchProject}
            onChange={(e) => {
              setSearchProject(e.target.value);
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

        {/* Total Value – Right Side */}
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
        ) : paginatedData.length === 0 ? (
          <div className="empty-state">No quotation data available</div>
        ) : (
          <>
            <table className="quotation-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Client Name</th>
                  <th>Client Type</th>
                  <th>Quotation Value</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, index) => (
                  <tr key={index}>
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

            {/* ================= PAGINATION ================= */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="page-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Prev
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