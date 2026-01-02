import React, { useState } from "react";
import "../TermsAndConditions/TermsAndCondition.css";
import Sidebar from "../Sidebar/Sidebar";
import Terms from "../Terms/Terms";

const TermsAndConditions = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <header className="header-container">
          <nav className="navbar">
            <div className="logo-title">
              <img src="/logo.png" alt="Logo" className="logo12" />
              <span className="title1">Tansam</span>
            </div>
            <div className="spacer"></div>
          </nav>
        </header>

        <main className="content12">
          <div className="content-header">
            <h1>Terms and Conditions</h1>
            <button
              className={`add-btn ${showAddForm ? "open" : ""}`}
              onClick={() => setShowAddForm(!showAddForm)}
            >
              {showAddForm ? "Close" : "Add"}
            </button>
          </div>

          <p>
            Please review our terms and conditions carefully. You can add new terms below.
          </p>

          <div
            className={`add-form-container ${showAddForm ? "show" : ""}`}
          >
            {showAddForm && <Terms />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TermsAndConditions;