import { useEffect, useMemo, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Ceocss/Ceoquotation.css";

import { getQuotations } from "../../services/quotation/quotation.api";



export default function CeoQuotation() {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("quotation");
const [itemsPerPage, setItemsPerPage] = useState(10);
const ITEMS_PER_PAGE =10;
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
useEffect(() => {
  setCurrentPage(1);
}, [activeTab]);

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

      const matchClient = !selectedClient || q.clientName === selectedClient;

      return matchOpportunity && matchClient;
    });
  }, [quotations, searchOpportunity, selectedClient]);

  /* ================= TOTAL VALUE ================= */

  /* ================= PAGINATION ================= */
  // const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
const totalPages = Math.ceil(filteredData.length / itemsPerPage);

const paginatedData = useMemo(() => {
  const start = (currentPage - 1) * itemsPerPage;
  return filteredData.slice(start, start + itemsPerPage);
}, [filteredData, currentPage, itemsPerPage]);


  const clearFilters = () => {
    setSearchOpportunity("");
    setSelectedClient("");
    setCurrentPage(1);
  };
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goPrev = () => {
    if (currentPage > 1) {
      setCurrentPage((p) => p - 1);
    }
  };

  const goNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((p) => p + 1);
    }
  };

  const totalQuotationValue = useMemo(() => {
    return filteredData.reduce((sum, q) => {
      try {
        const items = JSON.parse(q.itemDetails || "[]");
        const total = items.reduce(
          (subSum, item) => subSum + Number(item.total || 0),
          0,
        );
        return sum + total;
      } catch {
        return sum;
      }
    }, 0);
  }, [filteredData]);

  const totalPaymentReceived = useMemo(() => {
    return filteredData.reduce(
      (sum, q) => sum + (Number(q.paymentAmount) || 0),
      0,
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
     <div className="page-size">
  <label>Show</label>
  <select
    value={itemsPerPage}
    onChange={(e) => {
      setItemsPerPage(Number(e.target.value));
      setCurrentPage(1);
    }}
  >
    <option value={10}>10</option>
    <option value={25}>25</option>
    <option value={50}>50</option>
  </select>
  <span>entries</span>
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
                    <th>Work Category</th>
                    <th>Lab</th>
                    <th>Quotation Value</th>
                  </>
                ) : (
                  <>
                    <th>Client Name</th>
                    <th>Client Type</th>
                    <th>Work Category</th>
                    <th>Lab</th>
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
                    <td>{(currentPage - 1) * ITEMS_PER_PAGE + i + 1}</td>

                    {activeTab === "quotation" ? (
                      <>
                        <td>{q.clientName}</td>
                        <td>{q.client_type_name}</td>
                        <td>{q.opportunity_name}</td>
                        <td>{q.work_category_name}</td>
                        <td>{q.lab_name}</td>
                        <td className="value-cell">
                          ₹{" "}
                          {(() => {
                            try {
                              const items = JSON.parse(q.itemDetails || "[]");

                              const total = items.reduce(
                                (sum, item) => sum + Number(item.total || 0),
                                0,
                              );

                              return total.toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              });
                            } catch {
                              return "0.00";
                            }
                          })()}
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{q.clientName}</td>
                        <td>{q.client_type_name}</td>
                        <td>{q.work_category_name}</td>
                        <td>{q.lab_name}</td>
                        <td>{q.paymentPhase || "Not Started"}</td>
                        <td>
                          {q.paymentAmount
                            ? `₹ ${Number(q.paymentAmount).toLocaleString(
                                "en-IN",
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
     
  <div className="pagination">
    <button
      disabled={currentPage === 1}
      onClick={goPrev}
    >
      ◀ Prev
    </button>

    {Array.from({ length: totalPages }, (_, i) => i + 1)
      .slice(
        Math.max(0, currentPage - 3),
        Math.min(totalPages, currentPage + 2)
      )
      .map((page) => (
        <button
          key={page}
          className={page === currentPage ? "active" : ""}
          onClick={() => goToPage(page)}
        >
          {page}
        </button>
      ))}

    <button
      disabled={currentPage === totalPages}
      onClick={goNext}
    >
      Next ▶
    </button>
  </div>


    </div>
  );
}