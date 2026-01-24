import { useEffect, useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Ceocss/Ceoquotation.css";

import { getQuotations } from "../../services/quotation/quotation.api";

const ITEMS_PER_PAGE = 10;

export default function CeoQuotation() {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("quotation");

  /* Filters */
  const [searchOpportunity, setSearchOpportunity] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  /* ================= LOAD DATA ================= */
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

  /* ================= FILTER OPTIONS ================= */
  const clientOptions = useMemo(() => {
    return [...new Set(quotations.map((q) => q.clientName).filter(Boolean))];
  }, [quotations]);

  /* ================= FILTERED DATA ================= */
  const filteredData = useMemo(() => {
    return quotations.filter((q) => {
      const matchOpportunity =
        !searchOpportunity ||
        q.opprtunity_name
          ?.toLowerCase()
          .includes(searchOpportunity.toLowerCase());

      const matchClient =
        !selectedClient || q.clientName === selectedClient;

      return matchOpportunity && matchClient;
    });
  }, [quotations, searchOpportunity, selectedClient]);

  /* ================= TOTAL VALUE ================= */


  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const clearFilters = () => {
    setSearchOpportunity("");
    setSelectedClient("");
    setCurrentPage(1);
  };
const totalQuotationValue = useMemo(() => {
  return filteredData.reduce(
    (sum, q) => sum + (Number(q.value) || 0),
    0
  );
}, [filteredData]);

const totalPaymentReceived = useMemo(() => {
  return filteredData.reduce(
    (sum, q) => sum + (Number(q.paymentAmount) || 0),
    0
  );
}, [filteredData]);

  /* ================= RENDER ================= */
  return (
    <div className="ceo-quotation">
      <ToastContainer autoClose={1200} />

      {/* HEADER */}
      <div className="page-header">
        <h2>Quotation Overview</h2>
        <p>Customer quotation summary</p>
      </div>

      {/* FILTERS + TOTAL */}
      <div className="filter-row">
        <div className="filter-left">
          <input
            type="text"
            placeholder="Search by opportunity..."
            value={searchOpportunity}
            onChange={(e) => {
              setSearchOpportunity(e.target.value);
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

          {(searchOpportunity || selectedClient) && (
            <button className="clear-btn" onClick={clearFilters}>
              Clear
            </button>
          )}
        </div>

   <div className="summary-row">
  {activeTab === "quotation" ? (
    <div className="summary-card">
      <span className="summary-label">Total Quotation Value</span>
      <span className="summary-value">
        ₹ {totalQuotationValue.toLocaleString("en-IN")}
      </span>
    </div>
  ) : (
    <div className="summary-card success">
      <span className="summary-label">Total Payment Received</span>
      <span className="summary-value">
        ₹ {totalPaymentReceived.toLocaleString("en-IN")}
      </span>
    </div>
  )}
</div>

      </div>

      {/* ================= TABS ================= */}
      <div className="tabs">
        <button
          className={activeTab === "quotation" ? "active" : ""}
          onClick={() => setActiveTab("quotation")}
        >
          Quotation
        </button>

        <button
          className={activeTab === "payment" ? "active" : ""}
          onClick={() => setActiveTab("payment")}
        >
          Payment Phase
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <div className="card-table">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>S.No</th>

                {activeTab === "quotation" ? (
                  <>
                    <th>Client Name</th>
                    <th>Client Type</th>
                    <th>Opportunity Name</th>
                     <th>Quotation Value</th>
                  </>
                ) : (
                  <>
                    <th>Client Name</th>
                    <th>Client Type</th>
                    <th>Payment Phase</th>
                    <th>Payment Amount</th>
                    <th>Pending Reason</th>
                  </>
                )}
              </tr>
            </thead>

            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((q, i) => (
                  <tr key={q.id}>
                    <td>
                      {(currentPage - 1) * ITEMS_PER_PAGE + i + 1}
                    </td>

                    {activeTab === "quotation" ? (
                      <>
                        <td>{q.clientName}</td>
                        <td>{q.clientType}</td>
                        <td>{q.opprtunity_name}</td>
                        <td>{q.value}</td>
                      </>
                    ) : (
                      <>
                        <td>{q.clientName}</td>
                        <td>{q.clientType}</td>
                        <td>{q.paymentPhase || "Not Started"}</td>
                        <td>
                          {q.paymentAmount
                            ? `₹ ${Number(q.paymentAmount).toLocaleString(
                                "en-IN"
                              )}`
                            : "—"}
                        </td>
                        <td>{q.paymentPendingReason || "—"}</td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={activeTab === "quotation" ? 4 : 6}>
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
