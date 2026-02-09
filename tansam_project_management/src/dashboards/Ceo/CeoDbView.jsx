import React, { useEffect, useState } from "react";
import "./Ceocss/CeoDbView.css";

import {
  fetchAllDbTables,
  fetchTableData,
  downloadTableData,
} from "../../services/ceo/ceo.dbView.api";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const CeoDbView = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      const data = await fetchAllDbTables();
      setTables(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleTableChange = async (tableName) => {
    setSelectedTable(tableName);
    setLoading(true);
    setRows([]);

    try {
      const data = await fetchTableData(tableName);
      setRows(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const result = await downloadTableData(selectedTable);
      if (!result.data || result.data.length === 0) return;

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(result.table);

      worksheet.columns = Object.keys(result.data[0]).map((key) => ({
        header: key.toUpperCase(),
        key,
        width: 20,
      }));

      result.data.forEach((row) => worksheet.addRow(row));

      const buffer = await workbook.xlsx.writeBuffer();
      const today = new Date().toISOString().split("T")[0];

      saveAs(
        new Blob([buffer], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        `${result.table}_table_${today}.xlsx`
      );
    } catch (err) {
      alert("Download failed");
    }
  };

  const downloadCSV = (data, tableName) => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csv = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((h) =>
            row[h] == null ? "" : `"${String(row[h]).replace(/"/g, '""')}"`
          )
          .join(",")
      ),
    ].join("\n");

    const today = new Date().toISOString().split("T")[0];
    saveAs(new Blob([csv], { type: "text/csv" }), `${tableName}_${today}.csv`);
  };

  const handleCsvDownload = async () => {
    const result = await downloadTableData(selectedTable);
    if (result?.data?.length) downloadCSV(result.data, result.table);
  };

  const headers = rows.length ? Object.keys(rows[0]) : [];

  return (
    <div className="ceo-db-page">
      <div className="ceo-db-header">
        <h2>CEO Database Viewer</h2>
        <p>Read-only access to all database tables</p>
      </div>

      <div className="ceo-db-controls">
        <select
          value={selectedTable}
          onChange={(e) => handleTableChange(e.target.value)}
        >
          <option value="" disabled>
            Select a database table
          </option>
          {tables.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <button
          className="download-btn"
          disabled={!selectedTable || !rows.length}
          onClick={handleDownload}
        >
          Download Excel
        </button>

        <button
          className="download-btn csv"
          disabled={!selectedTable || !rows.length}
          onClick={handleCsvDownload}
        >
          Download CSV
        </button>
      </div>

      <div className="ceo-db-table-wrapper">
        <div className="ceo-db-table-scroll">
          {loading ? (
            <div className="loader">Loading data…</div>
          ) : rows.length === 0 ? (
            <div className="empty-state">
              Please select a table to view data
            </div>
          ) : (
            <table className="ceo-db-table">
              <thead>
                <tr>
                  {headers.map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={i}>
                    {headers.map((h) => (
                      <td key={h}>{row[h] ?? "-"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default CeoDbView;
