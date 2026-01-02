import { useNavigate } from "react-router-dom";
import "../StatCards/StatCards.css";

export default function StatCards() {
  const navigate = useNavigate();

  return (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <p>Total Quotations</p>
          <h3>24</h3>
        </div>
        <div className="stat-card">
          <p>In Process</p>
          <h3>12</h3>
        </div>
        <div className="stat-card">
          <p>Completed</p>
          <h3>8</h3>
        </div>
        <div className="stat-card">
          <p>On hold</p>
          <h3>4</h3>
        </div>
      </div>

      {/* Navigate to GenerateQuotation page */}
      <button
        className="create-btn"
        onClick={() => navigate("/generate-quotation")}
      >
        + Create Quotation
      </button>
    </>
  );
}

