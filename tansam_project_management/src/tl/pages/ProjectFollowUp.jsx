import { useState } from "react";
import { FiEye, FiCheckCircle } from "react-icons/fi";
import "./ProjectFollowUp.css";

export default function ProjectFollowUp() {
  const [projects] = useState([
    {
      id: 1,
      projectName: "Marketing Website",
      clientName: "ABC Pvt Ltd",
      projectStatus: "In Progress",
      totalRevenue: 75000,
      paidAmount: 40000,
    },
    {
      id: 2,
      projectName: "Mobile App Redesign",
      clientName: "XYZ Solutions",
      projectStatus: "Completed",
      totalRevenue: 120000,
      paidAmount: 120000,
    },
    {
      id: 3,
      projectName: "E-Commerce Platform",
      clientName: "ShopFast Inc",
      projectStatus: "In Progress",
      totalRevenue: 200000,
      paidAmount: 80000,
    },
  ]);

  return (
    <div className="followup-page">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h2>Project Follow Up</h2>
          <p className="page-sub">
            Track delivery status and financial health of ongoing projects
          </p>
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="table-card">
        <table className="followup-table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Client</th>
              <th>Status</th>
              <th>Total Revenue (₹)</th>
              <th>Paid (₹)</th>
              <th>Pending (₹)</th>
              <th>Payment Progress</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => {
              const pending = p.totalRevenue - p.paidAmount;
              const progressPercent = (p.paidAmount / p.totalRevenue) * 100;

              return (
                <tr key={p.id}>
                  <td className="project-name">
                    <div>
                      <strong>{p.projectName}</strong>
                      <small>PRJ-2026-00{p.id}</small>
                    </div>
                  </td>
                  <td>{p.clientName}</td>

                  <td>
                    <span
                      className={`status-badge ${
                        p.projectStatus === "Completed" ? "completed" : "in-progress"
                      }`}
                    >
                      {p.projectStatus === "Completed" && <FiCheckCircle />}
                      {p.projectStatus}
                    </span>
                  </td>

                  <td className="amount">₹{p.totalRevenue.toLocaleString()}</td>
                  <td className="amount paid">₹{p.paidAmount.toLocaleString()}</td>

                  <td className={`amount ${pending > 0 ? "pending" : "cleared"}`}>
                    ₹{pending.toLocaleString()}
                  </td>

                  <td>
                    <div className="progress-container">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <span className="progress-text">{Math.round(progressPercent)}%</span>
                    </div>
                  </td>

                  <td>
                    <button className="track-btn">
                      <FiEye className="icon" />
                      View Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}