import { useState, useMemo, useCallback } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

// Mock data (replace with your actual API later)
const QUOTATIONS = [
  {
    "Sl No.": 1,
    "Client Name": "ABC Corp",
    "Client Type": "Corporate",
    "Work Category": "Web Development",
    "Quote Value": "1,25,000",
    "Status": "Approved",
    "Created Date": "2025-12-15"
  },
  {
    "Sl No.": 2,
    "Client Name": "XYZ Ltd",
    "Client Type": "SME",
    "Work Category": "Mobile App",
    "Quote Value": "2,50,000",
    "Status": "Pending",
    "Created Date": "2025-12-20"
  },
  {
    "Sl No.": 3,
    "Client Name": "Tech Innovators",
    "Client Type": "Corporate",
    "Work Category": "UI/UX Design",
    "Quote Value": "75,000",
    "Status": "Approved",
    "Created Date": "2025-12-25"
  },
  {
    "Sl No.": 4,
    "Client Name": "Startup Hub",
    "Client Type": "Startup",
    "Work Category": "Web Development",
    "Quote Value": "85,000",
    "Status": "Rejected",
    "Created Date": "2025-12-28"
  },
  {
    "Sl No.": 5,
    "Client Name": "Global Solutions",
    "Client Type": "Corporate",
    "Work Category": "Testing",
    "Quote Value": "3,20,000",
    "Status": "Pending",
    "Created Date": "2026-01-01"
  },
  {
    "Sl No.": 6,
    "Client Name": "Digital Agency",
    "Client Type": "SME",
    "Work Category": "Mobile App",
    "Quote Value": "1,80,000",
    "Status": "Approved",
    "Created Date": "2026-01-02"
  }
];

export default function FinanceDashboard() {
  const [filter, setFilter] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [selectedSlice, setSelectedSlice] = useState(null);

  // Enhanced filtering
  const filteredData = useMemo(() => {
    let data = QUOTATIONS;
    
    // Text filter
    if (filter) {
      data = data.filter(q =>
        q["Client Name"]?.toLowerCase().includes(filter.toLowerCase()) ||
        q["Client Type"]?.toLowerCase().includes(filter.toLowerCase()) ||
        q["Work Category"]?.toLowerCase().includes(filter.toLowerCase())
      );
    }

    // Date filter
    if (dateRange !== "all" && data[0]?.["Created Date"]) {
      const now = new Date();
      let cutoffDate;
      
      switch (dateRange) {
        case "week": cutoffDate = new Date(now - 7 * 24 * 60 * 60 * 1000); break;
        case "month": cutoffDate = new Date(now - 30 * 24 * 60 * 60 * 1000); break;
        default: cutoffDate = new Date(0);
      }
      
      data = data.filter(q => {
        const quoteDate = new Date(q["Created Date"]);
        return quoteDate >= cutoffDate;
      });
    }

    return data;
  }, [filter, dateRange]);

  // Metrics
  const totalQuotations = filteredData.length;
  const totalQuoteValue = filteredData.reduce(
    (sum, q) => sum + Number(q["Quote Value"]?.toString().replace(/,/g, "") || 0),
    0
  );
  const avgQuoteValue = totalQuotations ? totalQuoteValue / totalQuotations : 0;

  // Chart data
  const clientTypes = [...new Set(filteredData.map(q => q["Client Type"]))];
  const typeValues = clientTypes.map(t => {
    const typeQuotes = filteredData.filter(q => q["Client Type"] === t);
    return typeQuotes.reduce((sum, q) => 
      sum + Number(q["Quote Value"]?.toString().replace(/,/g, "") || 0), 0
    );
  });

  const chartData = {
    labels: clientTypes,
    datasets: [{
      data: typeValues.length ? typeValues : [1, 1, 1],
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
      borderWidth: 2,
      borderColor: "#fff",
      hoverOffset: 10,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom", labels: { padding: 20, usePointStyle: true } },
      tooltip: {
        callbacks: {
          label: (context) => {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ₹${context.parsed.toLocaleString()} (${percentage}%)`;
          }
        }
      }
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        setSelectedSlice(clientTypes[index]);
      }
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      "Approved": "#10b981",
      "Pending": "#f59e0b",
      "Rejected": "#ef4444"
    };
    return (
      <span style={{
        backgroundColor: `${colors[status] || '#6b7280'}10`,
        color: colors[status] || '#6b7280',
        padding: '2px 8px',
        borderRadius: 12,
        fontSize: 12,
        fontWeight: 500
      }}>
        {status}
      </span>
    );
  };

  return (
    <div style={{ padding: 24, background: "#f8fafc", minHeight: "100vh" }}>
      <h2 style={{ margin: "0 0 24px 0", color: "#1e293b" }}>Finance Dashboard</h2>

      {/* Filters */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search by Client, Type, or Category..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{
            padding: "12px 16px",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            width: 320,
            fontSize: 14
          }}
        />
        <select
          value={dateRange}
          onChange={e => setDateRange(e.target.value)}
          style={{
            padding: "12px 16px",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            background: "white"
          }}
        >
          <option value="all">All Time</option>
          <option value="week">This Week</option>
          <option value="month">Last 30 Days</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr)", gap: 20, marginBottom: 32 }}>
        <div style={{ padding: 24, background: "white", borderRadius: 12, boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <h4 style={{ color: "#64748b", margin: 0, fontSize: 14 }}>Total Quotations</h4>
          <p style={{ fontSize: 28, fontWeight: 700, color: "#1e293b", margin: "8px 0 0 0" }}>
            {totalQuotations}
          </p>
        </div>
        <div style={{ padding: 24, background: "white", borderRadius: 12, boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <h4 style={{ color: "#64748b", margin: 0, fontSize: 14 }}>Total Value</h4>
          <p style={{ fontSize: 28, fontWeight: 700, color: "#059669", margin: "8px 0 0 0" }}>
            ₹{totalQuoteValue.toLocaleString()}
          </p>
        </div>
        <div style={{ padding: 24, background: "white", borderRadius: 12, boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <h4 style={{ color: "#64748b", margin: 0, fontSize: 14 }}>Avg Quote Value</h4>
          <p style={{ fontSize: 24, fontWeight: 700, color: "#7c3aed", margin: "8px 0 0 0" }}>
            ₹{Math.round(avgQuoteValue).toLocaleString()}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        {/* Interactive Pie Chart */}
        <div style={{ flex: 1, minWidth: 400, background: "white", padding: 24, borderRadius: 12, boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h4 style={{ margin: 0, color: "#1e293b" }}>Quotations by Client Type</h4>
            {selectedSlice && (
              <span style={{ background: "#eff6ff", color: "#2563eb", padding: "4px 12px", borderRadius: 20, fontSize: 14, fontWeight: 500 }}>
                Selected: {selectedSlice}
              </span>
            )}
          </div>
          <div style={{ height: 350 }}>
            <Pie data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Enhanced Table */}
        <div style={{ flex: 2, background: "white", borderRadius: 12, boxShadow: "0 4px 6px rgba(0,0,0,0.05)", overflow: "hidden" }}>
          <div style={{ padding: 24 }}>
            <h4 style={{ margin: 0, color: "#1e293b" }}>
              Recent Quotations ({filteredData.length})
            </h4>
          </div>
          <div style={{ overflowX: "auto", maxHeight: 400 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  {filteredData[0] && Object.keys(filteredData[0]).map(h => (
                    <th key={h} style={{ 
                      border: "1px solid #e2e8f0", 
                      padding: "16px 12px", 
                      textAlign: "left",
                      fontWeight: 600,
                      color: "#374151",
                      fontSize: 14
                    }}>
                      {h.replace(/([A-Z])/g, ' $1').trim()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredData.slice(0, 10).map((row, idx) => (
                  <tr key={idx} style={{ 
                    background: idx % 2 === 0 ? "#fafbfc" : "white",
                    "&:hover": { background: "#eff6ff !important" }
                  }}>
                    {Object.entries(row).map(([key, value]) => (
                      <td key={key} style={{ 
                        border: "1px solid #e2e8f0", 
                        padding: "16px 12px",
                        verticalAlign: "middle"
                      }}>
                        {key === "Status" ? getStatusBadge(value) :
                         key === "Quote Value" ? `₹${value}` :
                         String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
