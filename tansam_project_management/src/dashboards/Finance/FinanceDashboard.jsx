import { useState, useEffect, useMemo } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { getQuotations } from "../../services/quotation/quotation.api";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function FinanceDashboard() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [selectedSlice, setSelectedSlice] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const quotations = await getQuotations();
        setData(quotations);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Filtered data
  const filteredData = useMemo(() => {
    let temp = data;

    if (filter) {
      temp = temp.filter(
        (q) =>
          q.clientName?.toLowerCase().includes(filter.toLowerCase()) ||
          q.clientType?.toLowerCase().includes(filter.toLowerCase()) ||
          q.workCategory?.toLowerCase().includes(filter.toLowerCase())
      );
    }

    if (dateRange !== "all") {
      const now = new Date();
      let cutoffDate;
      switch (dateRange) {
        case "week":
          cutoffDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
          break;
        case "month":
          cutoffDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          cutoffDate = new Date(0);
      }
      temp = temp.filter((q) => new Date(q.date) >= cutoffDate);
    }

    return temp;
  }, [data, filter, dateRange]);

  // KPI calculations
  const displayedData = selectedSlice
    ? filteredData.filter((q) => q.lab === selectedSlice)
    : filteredData;

  const totalQuotations = displayedData.length;
  const totalQuoteValue = displayedData.reduce(
    (sum, q) => sum + Number(q.value?.toString().replace(/,/g, "") || 0),
    0
  );
  const avgQuoteValue = totalQuotations ? totalQuoteValue / totalQuotations : 0;

  // Pie chart data based on lab
  const labs = [...new Set(filteredData.map((q) => q.lab))];
  const labValues = labs.map((lab) =>
    filteredData
      .filter((q) => q.lab === lab)
      .reduce((sum, q) => sum + Number(q.value?.toString().replace(/,/g, "") || 0), 0)
  );

  const chartData = {
    labels: labs,
    datasets: [
      {
        data: labValues.length ? labValues : [1],
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
          "#FF9F40", "#C9CBCF", "#8BC34A", "#FF7043", "#26A69A"
        ],
        borderWidth: 2,
        borderColor: "#fff",
        hoverOffset: 10,
      },
    ],
  };

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right",
      labels: {
        boxWidth: 20,
        padding: 12,
        usePointStyle: true,
        font: { size: 14 },
      },
      maxHeight: 200, // optional scrollable legend
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = ((context.parsed / total) * 100).toFixed(1);
          return `${context.label}: ₹${context.parsed.toLocaleString()} (${percentage}%)`;
        },
      },
    },
  },
  onClick: (event, elements) => {
    if (elements.length > 0) {
      const clicked = labs[elements[0].index];
      setSelectedSlice(selectedSlice === clicked ? null : clicked);
    }
  },
};

// Chart height container
<div style={{ height: 450, width: "100%" }}>
  <Pie data={chartData} options={chartOptions} />
</div>


  return (
    <div style={{ padding: 24, background: "#f8fafc", minHeight: "100vh" }}>
      <h2 style={{ marginBottom: 24 }}>Finance Dashboard</h2>

      {/* Filters */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search by Client, Type, or Category..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 8, width: 320 }}
        />
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          style={{ padding: "12px 16px", border: "1px solid #e2e8f0", borderRadius: 8 }}
        >
          <option value="all">All Time</option>
          <option value="week">This Week</option>
          <option value="month">Last 30 Days</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 32 }}>
        <div style={{ padding: 24, background: "white", borderRadius: 12, boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <h4>Total Quotations</h4>
          <p style={{ fontSize: 28, fontWeight: 700 }}>{totalQuotations}</p>
        </div>
        <div style={{ padding: 24, background: "white", borderRadius: 12, boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <h4>Revenue</h4>
          <p style={{ fontSize: 28, fontWeight: 700, color: "#059669" }}>₹{totalQuoteValue.toLocaleString()}</p>
        </div>
        <div style={{ padding: 24, background: "white", borderRadius: 12, boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <h4>Avg Quote Value</h4>
          <p style={{ fontSize: 24, fontWeight: 700, color: "#7c3aed" }}>₹{Math.round(avgQuoteValue).toLocaleString()}</p>
        </div>
      </div>

      {/* Charts and Table */}
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 400, background: "white", padding: 24, borderRadius: 12, boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h4>Quotations by Lab</h4>
            {selectedSlice && <span style={{ background: "#eff6ff", color: "#2563eb", padding: "4px 12px", borderRadius: 20 }}>Selected: {selectedSlice}</span>}
          </div>
         <div style={{ height: 450, width: "100%" }}>
  <Pie data={chartData} options={chartOptions} />
</div>

        </div>

        <div style={{ flex: 2, background: "white", borderRadius: 12, boxShadow: "0 4px 6px rgba(0,0,0,0.05)", overflow: "hidden" }}>
          <div style={{ padding: 24 }}>
            <h4>Recent Quotations ({displayedData.length})</h4>
          </div>
          <div style={{ overflowX: "auto", maxHeight: 400 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {data[0] && Object.keys(data[0]).map((h) => (
                    <th key={h} style={{ border: "1px solid #e2e8f0", padding: "16px 12px", textAlign: "left" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayedData.slice(0, 10).map((row, idx) => (
                  <tr key={idx} style={{ background: idx % 2 === 0 ? "#fafbfc" : "white" }}>
                    {Object.entries(row).map(([key, value]) => (
                      <td key={key} style={{ border: "1px solid #e2e8f0", padding: "16px 12px" }}>
                        {key === "value" ? `₹${value}` : String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {displayedData.length === 0 && <p style={{ padding: 24 }}>No quotations found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
