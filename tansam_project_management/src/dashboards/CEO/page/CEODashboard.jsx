import { useState } from "react";
import KPICard from "../component/KPICard";
import ProjectSection from "./ProjectSection";
import QuotationSection from "./QuotationSection";
import ForecastSection from "./ForecastSection";
import "./CEODashboard.css";

export default function CEODashboard() {
  const [activeSection, setActiveSection] = useState(null);

  return (
    <div className="dashboard">

      {activeSection && (
        <div className="back-container">
          <button className="back-btn" onClick={() => setActiveSection(null)}>
            ← Back to Dashboard
          </button>
        </div>
      )}

      {activeSection === null && (
        <div className="kpi-row">
          <div onClick={() => setActiveSection("PROJECT")}>
            <KPICard title="Projects" value="₹52.1 Cr Revenue" />
          </div>

          <div onClick={() => setActiveSection("QUOTATION")}>
            <KPICard title="Quotations" value="₹28.4 Cr Pipeline" />
          </div>

          <div onClick={() => setActiveSection("FORECAST")}>
            <KPICard title="Forecast" value="₹6.99 Cr FY26" />
          </div>
        </div>
      )}

      {activeSection === "PROJECT" && <ProjectSection />}
      {activeSection === "QUOTATION" && <QuotationSection />}
      {activeSection === "FORECAST" && <ForecastSection />}
    </div>
  );
}
