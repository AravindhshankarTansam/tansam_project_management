import { 
  FiUser, FiTarget, FiFileText, FiCheckCircle, FiDollarSign, 
  FiList, FiAlertTriangle, FiRefreshCw, FiLock, FiArrowRight 
} from "react-icons/fi";
import "./Summary.css";

export default function ProjectSummary() {
  return (
    <div className="project-summary">
      {/* HIERARCHY BREADCRUMB WITH ICON ARROWS */}
      <div className="hierarchy-flow">
        <div className="flow-item">
          <FiUser className="icon" />
          <span>Lead</span>
        </div>
        <FiArrowRight className="arrow-icon" />
        <div className="flow-item">
          <FiTarget className="icon" />
          <span>Opportunity</span>
        </div>
        <FiArrowRight className="arrow-icon" />
        <div className="flow-item active">
          <FiFileText className="icon" />
          <span>Project</span>
        </div>
        <FiArrowRight className="arrow-icon" />
        <div className="flow-item">
          <FiList className="icon" />
          <span>Tasks</span>
        </div>
      </div>

      {/* HEADER */}
      <div className="summary-header">
        <div>
          <h2>Project Summary</h2>
          <p className="subtitle">Marketing Website Development</p>
        </div>
        <div className="header-right">
          <span className="project-code">PRJ-2026-001</span>
          <span className="status-badge in-progress">In Progress</span>
        </div>
      </div>

      <div className="summary-grid">
        {/* PROJECT INFO */}
        <div className="summary-card large">
          <h3><FiFileText /> Project Information</h3>
          <div className="info-grid">
            <div><span>Project Name</span><b>Marketing Website</b></div>
            <div><span>Client</span><b>ABC Pvt Ltd</b></div>
            <div><span>Type</span><b>Web Development</b></div>
            <div><span>Start Date</span><b>01 Jun 2024</b></div>
            <div><span>End Date</span><b>15 Aug 2024</b></div>
            <div><span>Project Lead</span><b>Rahul Sharma</b></div>
          </div>
        </div>

        {/* SCOPE BASELINE */}
        <div className="summary-card">
          <h3><FiCheckCircle /> Scope Baseline</h3>
          <p className="scope-desc">Design and develop a responsive marketing website with CMS integration.</p>
          <div className="tags">
            <span>UI Design</span>
            <span>Frontend Dev</span>
            <span>CMS Integration</span>
          </div>
          <div className="locked-badge">
            <FiLock /> Scope Locked
          </div>
        </div>

        {/* ESTIMATION */}
        <div className="summary-card">
          <h3><FiDollarSign /> Estimation Summary</h3>
          <div className="cost-grid">
            <div><span>Base Cost</span><b>₹60,000</b></div>
            <div><span>Buffer (10%)</span><b>₹6,000</b></div>
            <div className="total"><span>Total Estimated</span><b>₹66,000</b></div>
          </div>
        </div>

        {/* FINANCIALS */}
        <div className="summary-card">
          <h3><FiDollarSign /> Financial Overview</h3>
          <div className="finance-grid">
            <div><span>Total Revenue</span><b>₹75,000</b></div>
            <div><span>Paid</span><b className="paid">₹40,000</b></div>
            <div><span>Pending</span><b className="pending">₹35,000</b></div>
          </div>
          <div className="progress-bar">
            <div className="progress" style={{ width: "53%" }}></div>
          </div>
          <small>53% Payment Received</small>
        </div>

        {/* TASK SUMMARY */}
        <div className="summary-card">
          <h3><FiList /> Task Progress</h3>
          <div className="task-grid">
            <div><span>Total Tasks</span><b>24</b></div>
            <div><span>Completed</span><b className="completed">18</b></div>
            <div><span>In Progress</span><b>5</b></div>
            <div><span>Blocked</span><b className="pending">1</b></div>
          </div>
          <div className="task-progress">
            <div className="bar">
              <div className="fill" style={{ width: "75%" }}></div>
            </div>
            <span>75% Complete</span>
          </div>
        </div>

        {/* CHANGE REQUESTS */}
        <div className="summary-card">
          <h3><FiRefreshCw /> Change Requests</h3>
          <div className="cr-grid">
            <div><span>Total CRs</span><b>2</b></div>
            <div><span>Approved</span><b className="completed">1</b></div>
            <div><span>Impact Cost</span><b className="pending">+₹12,000</b></div>
          </div>
        </div>

        {/* RISKS */}
        <div className="summary-card">
          <h3><FiAlertTriangle /> Active Risks</h3>
          <ul className="risk-list">
            <li>Delay in client content approval</li>
            <li>Third-party payment gateway integration delay</li>
          </ul>
          <div className="risk-count">2 Medium Risks</div>
        </div>

        {/* INVOICES */}
        <div className="summary-card">
          <h3><FiDollarSign /> Invoices</h3>
          <div className="invoice-grid">
            <div><span>Issued</span><b>3</b></div>
            <div><span>Paid</span><b className="completed">2</b></div>
            <div><span>Overdue</span><b className="pending">1</b></div>
          </div>
        </div>
      </div>
    </div>
  );
}