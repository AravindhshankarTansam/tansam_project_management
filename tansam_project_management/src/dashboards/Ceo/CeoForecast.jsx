import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Ceocss/CeoForecast.css";
import { FaSave, FaTrash } from "react-icons/fa";

import {
  fetchForecasts,
  createForecast,
  updateForecast,
  deleteForecast,
} from "../../services/ceo/ceo.forecast.api";

import { fetchWorkCategories } from "../../services/admin/admin.roles.api";
import { fetchOpportunities } from "../../services/coordinator/coordinator.opportunity.api";

const CONFIDENCE_OPTIONS = [0, 25, 50, 75, 100];

/* ================= HELPER ================= */
const formatMonthYear = (value) => {
  if (!value) return "";
  const [year, month] = value.split("-");
  return new Date(year, month - 1).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
};

export default function CeoForecast() {
  const [rows, setRows] = useState([]);
  const [workCategories, setWorkCategories] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const isCEO = user?.role === "CEO";


  /* ================= LOAD DATA ================= */
  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setLoading(true);

      const [forecastData, wc, opps] = await Promise.all([
        fetchForecasts(),
        fetchWorkCategories(),
        fetchOpportunities(),
      ]);

      setRows(Array.isArray(forecastData) ? forecastData : []);
      setWorkCategories(wc || []);

      const uniqueClients = [
        ...new Set((opps || []).map(o => o.client_name).filter(Boolean)),
      ];
      setClients(uniqueClients);

    } catch (err) {
      console.error(err); // for debugging only
      toast.error("Server error while loading forecast data"); // only real errors
    } finally {
      setLoading(false);
    }
  };


  /* ================= ADD ROW ================= */
  const addRow = () => {
    setRows(prev => [
      ...prev,
      {
        id: null,
        work_category_id: "",
        work_category_name: "",
        client_name: "",
        total_value: "",
        confidence: "",
        realizable_value: "",
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

      const total = Number(copy[index].total_value || 0);
      const realizable = Number(copy[index].realizable_value || 0);
      copy[index].carryover = total - realizable;

      return copy;
    });
  };

  /* ================= SAVE ================= */
  const saveRow = async (row, index) => {
    try {
      const payload = {
        workCategoryId: row.work_category_id,
        workCategoryName: row.work_category_name,
        clientName: row.client_name,
        totalValue: row.total_value,
        confidence: row.confidence,
        realizable: row.realizable_value,
        fy: row.fy, // YYYY-MM
        carryover: row.carryover,
        remarks: row.remarks,
      };

      if (row.id) {
        await updateForecast(row.id, payload);
        toast.success("Forecast updated");
      } else {
        const created = await createForecast(payload);
        rows[index].id = created.id;
        toast.success("Forecast saved");
      }

      loadAll();
    } catch {
      toast.error("Save failed");
    }
  };

  /* ================= DELETE ================= */
  const removeRow = async (row) => {
    if (!row.id) {
      setRows(prev => prev.filter(r => r !== row));
      return;
    }

    if (!window.confirm("Delete this forecast?")) return;

    await deleteForecast(row.id);
    toast.success("Forecast deleted");
    loadAll();
  };

  return (
    <div className="ceo-forecast">
      <ToastContainer autoClose={1200} />

      <div className="page-header">
        <div>
          <h2>Forecast Overview</h2>
          <p>Revenue forecast</p>
        </div>

            {!isCEO && (
        <button className="add-btn" onClick={addRow}>
          + Add Forecast
        </button>
      )}

      </div>

      <div className="table-card">
        <table className="forecast-table">
          <thead>
            <tr>
              <th>Work Category</th>
              <th>Client</th>
              <th>Total Value</th>
              <th>Confidence %</th>
              <th>Realizable</th>
              <th>FY (Month)</th>
              <th>Carryover</th>
              <th>Remarks</th>
              {!isCEO && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan="9" className="empty">
                  No forecast data
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr key={`${row.id || 'new'}-${i}`}>

                  {/* Work Category */}
                 <td>
                    {isCEO ? (
                      <span className="readonly-text">
                        {row.work_category_name || "-"}
                      </span>
                    ) : (
                      <select
                        value={row.work_category_id}
                        onChange={(e) => {
                          const wc = workCategories.find(
                            (w) => String(w.id) === e.target.value
                          );
                          if (!wc) return;
                          updateRow(i, "work_category_id", wc.id);
                          updateRow(i, "work_category_name", wc.name);
                        }}
                      >
                        <option value="">Select</option>
                        {workCategories.map((w) => (
                          <option key={w.id} value={w.id}>
                            {w.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>
                  {/* Client */}
                 <td>
                    {isCEO ? (
                      <span className="readonly-text">
                        {row.client_name || "-"}
                      </span>
                    ) : (
                      <select
                        value={row.client_name}
                        onChange={(e) =>
                          updateRow(i, "client_name", e.target.value)
                        }
                      >
                        <option value="">Select</option>
                        {clients.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    )}
                  </td>


                  {/* Total Value */}
                  <td>
                    {isCEO ? (
                      <span className="readonly-text">
                        {row.total_value || 0}
                      </span>
                    ) : (
                      <input
                        type="number"
                        value={row.total_value}
                        onChange={(e) =>
                          updateRow(i, "total_value", e.target.value)
                        }
                      />
                    )}
                  </td>


                  {/* Confidence */}
                  <td>
                  {isCEO ? (
                    <span className="readonly-text">
                      {row.confidence ? `${row.confidence}%` : "-"}
                    </span>
                  ) : (
                    <select
                      value={row.confidence}
                      onChange={(e) =>
                        updateRow(i, "confidence", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      {CONFIDENCE_OPTIONS.map((c) => (
                        <option key={c} value={c}>
                          {c}%
                        </option>
                      ))}
                    </select>
                  )}
                </td>


                  {/* Realizable */}
                 <td>
                  {isCEO ? (
                    <span className="readonly-text">
                      {row.realizable_value || 0}
                    </span>
                  ) : (
                    <input
                      type="number"
                      value={row.realizable_value}
                      onChange={(e) =>
                        updateRow(i, "realizable_value", e.target.value)
                      }
                    />
                  )}
                </td>

                  {/* FY – Month Picker */}
                 <td>
                  {isCEO ? (
                    <span className="readonly-text">
                      {formatMonthYear(row.fy) || "-"}
                    </span>
                  ) : (
                    <>
                      <input
                        type="month"
                        value={row.fy || ""}
                        onChange={(e) => updateRow(i, "fy", e.target.value)}
                      />
                      <div className="fy-label">{formatMonthYear(row.fy)}</div>
                    </>
                  )}
                </td>


                  {/* Carryover */}
                  <td className="readonly">{row.carryover || 0}</td>

                  {/* Remarks */}
                 <td>
                  {isCEO ? (
                    <span className="readonly-text">
                      {row.remarks || "-"}
                    </span>
                  ) : (
                    <input
                      value={row.remarks || ""}
                      onChange={(e) => updateRow(i, "remarks", e.target.value)}
                    />
                  )}
                </td>


                  {/* Actions */}
                {!isCEO && (
                <td className="actions">
                  <button
                    className="icon-btn save"
                    title="Save"
                    onClick={() => saveRow(row, i)}
                  >
                    <FaSave />
                  </button>

                  <button
                    className="icon-btn delete"
                    title="Delete"
                    onClick={() => removeRow(row)}
                  >
                    <FaTrash />
                  </button>
                </td>
              )}

                </tr>
              ))
            )}
          </tbody>
        </table>

        {loading && <p className="loading">Loading…</p>}
      </div>
    </div>
  );
}
