import React, { useState } from "react";
import Sidebar from "../Sidebar/Sidebar.jsx";
import StatCards from "../StatCards/StatCards.jsx";
import ClientTable from "../ClientTable/ClientTable.jsx";
import "./Dashboard.css";

export default function Dashboard() {
  const [clients] = useState([]);

  

  return (
    <div className="layout">
     
      <Sidebar role="finance" />
      <main className="contents1">
        <h1>Dashboard</h1>

        <StatCards />

        <div className="section">
          <h2>Client Quotation</h2>
          <p className="subtitle">
            Track quotations, follow-ups and order status
          </p>

          <ClientTable clients={clients} />
        </div>
      </main>
    </div>
  );
}
