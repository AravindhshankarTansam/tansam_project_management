import "./TLDashboard.css";
import {
  FiArrowUpRight,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

export default function TLDashboard() {
  return (
    <div className="tl-dashboard">
      <h2 className="page-title">Dashboard</h2>

      {/* ================= TOP METRICS ================= */}
      <div className="stats-grid">
        <div className="stat-card clickable">
          <div className="card-header">
            <span className="stat-label">Total Projects</span>
            <FiArrowUpRight className="card-icon" />
          </div>
          <h3 className="stat-value">12</h3>
          <span className="stat-sub">+2 from last month</span>
        </div>

        <div className="stat-card clickable">
          <div className="card-header">
            <span className="stat-label">Active Tasks</span>
            <FiClock className="card-icon" />
          </div>
          <h3 className="stat-value">48</h3>
          <span className="stat-sub">12 due today</span>
        </div>

        <div className="stat-card clickable">
          <div className="card-header">
            <span className="stat-label">Completed</span>
            <FiCheckCircle className="card-icon success" />
          </div>
          <h3 className="stat-value">124</h3>
          <span className="stat-sub">98% success rate</span>
        </div>

        <div className="stat-card clickable">
          <div className="card-header">
            <span className="stat-label">Alerts</span>
            <FiAlertCircle className="card-icon danger" />
          </div>
          <h3 className="stat-value">3</h3>
          <span className="stat-sub">Overdue tasks</span>
        </div>
      </div>

      {/* ================= BOTTOM SECTION ================= */}
      <div className="bottom-grid">
        {/* PROJECT PROGRESS */}
        <div className="panel">
          <h3 className="panel-title">Project Progress & Revenue</h3>
          <p className="panel-sub">
            Overall completion status and financial performance.
          </p>

          <div className="project-row">
            <div className="project-header">
              <span className="project-name">Marketing Website</span>
              <span className="project-percent">75%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "75%" }} />
            </div>
            <span className="revenue">$45,000 revenue</span>
          </div>

          <div className="project-row">
            <div className="project-header">
              <span className="project-name">Mobile App Redesign</span>
              <span className="project-percent">42%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "42%" }} />
            </div>
            <span className="revenue">$32,000 revenue</span>
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="panel">
          <h3 className="panel-title">Recent Activity</h3>
          <p className="panel-sub">Latest updates from your team.</p>

          <ul className="activity-list">
            <li>
              <div className="avatar">S</div>
              <div>
                <strong>Sarah Miller</strong> completed <b>Hero Section</b>
                <span>2h ago</span>
              </div>
            </li>

            <li>
              <div className="avatar">J</div>
              <div>
                <strong>Jack Wilson</strong> commented on <b>API Docs</b>
                <span>4h ago</span>
              </div>
            </li>

            <li>
              <div className="avatar">S</div>
              <div>
                <strong>Sarah Miller</strong> updated status of <b>Nav Design</b>
                <span>5h ago</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
