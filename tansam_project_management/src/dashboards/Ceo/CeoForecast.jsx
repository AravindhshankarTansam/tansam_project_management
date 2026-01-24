import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Ceocss/CeoForecast.css";

import { fetchWorkCategories } from "../../services/admin/admin.roles.api";
import { fetchOpportunities } from "../../services/coordinator/coordinator.opportunity.api";

const CONFIDENCE_OPTIONS = [0, 30, 75, 100];
const FY_OPTIONS = ["2025-26", "2026-27", "2027-28"];

export default function CeoForecast() {
  const [rows, setRows] = useState([]);
  const [workCategories, setWorkCategories] = useState([]);
  const [clients, setClients] = useState([]);

  /* ================= LOAD MASTER DATA ================= */
  useEffect(() => {
    (async () => {
      try {
        const [wc, opps] = await Promise.all([
          fetchWorkCategories(),
          fetchOpportunities(),
        ]);

        setWorkCategories(wc || []);

        // unique client names from opportunities
        const uniqueClients = [
          ...new Set((opps || []).map(o => o.client_name).filter(Boolean)),
        ];
        setClients(uniqueClients);
      } catch {
        toast.error("Failed to load forecast masters");
      }
    })();
  }, []);

  /* ================= ADD ROW ================= */
  const addRow = () => {
    setRows(prev => [
      ...prev,
      {
        workCategory: "",
        clientName: "",
        totalValue: "",
        confidence: "",
        realizable: "",
        fy: "",
        carryover: 0,
        remarks: "",
      },
    ]);
  };

  /* ================= UPDATE CELL ================= */
  const updateRow = (index, key, value) => {
    setRows(prev => {
      const copy = [...prev];
      copy[index][key] = value;

      // auto-calc carryover
      const total = Number(copy[index].totalValue || 0);
      const realizable = Number(copy[index].realizable || 0);
      copy[index].carryover = total - realizable;

      return copy;
    });
  };

  return (
    <div className="ceo-forecast">
      <ToastContainer autoClose={1200} />

      <div className="page-header">
        <div>
          <h2>Forecast Overview</h2>
          <p>CEO level revenue forecast & pipeline</p>
        </div>

        <button className="add-btn" onClick={addRow}>
          + Add Forecast
        </button>
      </div>

      <div className="table-card">
        <table className="forecast-table">
          <thead>
            <tr>
              <th>Work Category</th>
              <th>Client Name</th>
              <th>Total Value</th>
              <th>Confidence %</th>
              <th>Realizable FY</th>
              <th>FY</th>
              <th>Carryover</th>
              <th>Remarks</th>
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty">
                  No forecast data added
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr key={i}>
                  {/* Work Category */}
                  <td>
                    <select
                      value={row.workCategory}
                      onChange={(e) =>
                        updateRow(i, "workCategory", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      {workCategories.map(w => (
                        <option key={w.id} value={w.name}>
                          {w.name}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Client */}
                  <td>
                    <select
                      value={row.clientName}
                      onChange={(e) =>
                        updateRow(i, "clientName", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      {clients.map(c => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Total Value */}
                  <td>
                    <input
                      type="number"
                      value={row.totalValue}
                      onChange={(e) =>
                        updateRow(i, "totalValue", e.target.value)
                      }
                    />
                  </td>

                  {/* Confidence */}
                  <td>
                    <select
                      value={row.confidence}
                      onChange={(e) =>
                        updateRow(i, "confidence", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      {CONFIDENCE_OPTIONS.map(c => (
                        <option key={c} value={c}>
                          {c}%
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Realizable */}
                  <td>
                    <input
                      type="number"
                      value={row.realizable}
                      onChange={(e) =>
                        updateRow(i, "realizable", e.target.value)
                      }
                    />
                  </td>

                  {/* FY */}
                  <td>
                    <select
                      value={row.fy}
                      onChange={(e) =>
                        updateRow(i, "fy", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      {FY_OPTIONS.map(fy => (
                        <option key={fy} value={fy}>
                          {fy}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Carryover (auto) */}
                  <td className="readonly">
                    {row.carryover || 0}
                  </td>

                  {/* Remarks */}
                  <td>
                    <input
                      value={row.remarks}
                      onChange={(e) =>
                        updateRow(i, "remarks", e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
