// import { useState, useEffect } from "react";
// import {
//   FiEye,
//   FiCalendar,
//   FiTarget,
//   FiAlertTriangle,
//   FiUsers,
//   FiCheckCircle,
//   FiArrowLeft,
// } from "react-icons/fi";
// import "./Summary.css";

// import { fetchProjects } from "../../services/project.api";
// import { fetchProjectFollowups } from "../../services/projectFollowup.api";

// /* ---------- HELPERS ---------- */
// const calculateDaysLeft = (endDate) => {
//   if (!endDate) return null;
//   const diff = new Date(endDate) - new Date();
//   return Math.ceil(diff / (1000 * 60 * 60 * 24));
// };

// const getStatusColor = (status) => {
//   switch (status) {
//     case "In Progress":
//       return "in-progress";
//     case "At Risk":
//       return "at-risk";
//     case "Completed":
//       return "completed";
//     default:
//       return "planned";
//   }
// };

// export default function ProjectSummary() {
//   const [projects, setProjects] = useState([]);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [loading, setLoading] = useState(true);

//   /* ================= LOAD + MERGE ================= */
//   useEffect(() => {
//     (async () => {
//       const [projectData, followupData] = await Promise.all([
//         fetchProjects(),
//         fetchProjectFollowups(),
//       ]);

//       const followupMap = {};
//       followupData.forEach((f) => {
//         followupMap[f.projectId] = f;
//       });

//       const merged = projectData.map((p) => {
//         const f = followupMap[p.id] || {};

//         return {
//           id: p.id,
//           code: `PRJ-${p.id}`,
//           name: p.projectName,
//           client: p.clientName,
//           type: p.projectType,
//           startDate: p.startDate,
//           endDate: p.endDate,

//           status: f.status || p.status || "Planned",
//           progress: f.progress || 0,

//           teamSize: f.teamMembers || 0,
//           criticalIssues: f.criticalIssues || 0,
//           lead: p.projectLead || "—",
//         };
//       });

//       setProjects(merged);
//       setLoading(false);
//     })();
//   }, []);

//   /* ================= SINGLE PROJECT VIEW ================= */
//   if (selectedProject) {
//     const p = selectedProject;
//     const daysLeft = calculateDaysLeft(p.endDate);

//     return (
//       <div className="project-summary single-view">
//         <button className="back-btn" onClick={() => setSelectedProject(null)}>
//           <FiArrowLeft /> All Projects
//         </button>

//         <div className="single-header">
//           <div>
//             <h2>{p.name}</h2>
//             <p className="subtitle">{p.client} • {p.type}</p>
//           </div>

//           <div className="header-meta">
//             <span className="project-code">{p.code}</span>
//             <span className={`status-badge ${getStatusColor(p.status)}`}>
//               {p.status}
//             </span>
//           </div>
//         </div>

//         <div className="single-grid">
//           {/* DETAILS */}
//           <div className="summary-card large">
//             <h3><FiTarget /> Project Details</h3>
//             <div className="detail-grid">
//               <div><span>Project Lead</span><strong>{p.lead}</strong></div>
//               <div><span>Start Date</span><strong>{new Date(p.startDate).toLocaleDateString()}</strong></div>
//               <div><span>End Date</span><strong>{new Date(p.endDate).toLocaleDateString()}</strong></div>
//               <div>
//                 <span>Days Remaining</span>
//                 <strong className={daysLeft <= 7 ? "urgent" : ""}>
//                   {daysLeft ?? "—"} days
//                 </strong>
//               </div>
//               <div><span>Team Size</span><strong>{p.teamSize}</strong></div>
//               <div>
//                 <span>Critical Issues</span>
//                 <strong className={p.criticalIssues > 0 ? "critical" : ""}>
//                   {p.criticalIssues}
//                 </strong>
//               </div>
//             </div>
//           </div>

//           {/* PIE PROGRESS (ONLY HERE) */}
//           <div className="summary-card">
//             <h3><FiCheckCircle /> Progress Overview</h3>
//             <div className="progress-large">
//               <div
//                 className="progress-circle"
//                 style={{
//                   background: `conic-gradient(
//                     #10b981 ${p.progress * 3.6}deg,
//                     #e5e7eb 0deg
//                   )`,
//                 }}
//               >
//                 <span>{p.progress}%</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   /* ================= DASHBOARD VIEW ================= */
//   return (
//     <div className="project-summary dashboard-view">
//       <div className="page-header">
//         <h2>Project Summary Dashboard</h2>
//         <p className="subtitle">Overview of all active and completed projects</p>
//       </div>

//       {loading ? (
//         <div>Loading...</div>
//       ) : (
//         <div className="projects-grid">
//           {projects.map((p) => {
//             const daysLeft = calculateDaysLeft(p.endDate);

//             return (
//               <div
//                 key={p.id}
//                 className="project-card"
//                 onClick={() => setSelectedProject(p)}
//               >
//                 <div className="card-header">
//                   <div>
//                     <h3>{p.name}</h3>
//                     <p>{p.client}</p>
//                   </div>
//                   <span className={`status-badge small ${getStatusColor(p.status)}`}>
//                     {p.status}
//                   </span>
//                 </div>

//                 <div className="card-body">
//                   <div className="info-row">
//                     <span>Code</span>
//                     <strong>{p.code}</strong>
//                   </div>

//                   {/* ✅ BAR ONLY */}
//                   <div className="progress-section">
//                     <div className="progress-label">
//                       <span>Progress</span>
//                       <strong>{p.progress}%</strong>
//                     </div>
//                     <div className="progress-bar">
//                       <div className="fill" style={{ width: `${p.progress}%` }} />
//                     </div>
//                   </div>

//                   <div className="meta-row">
//                     <div><FiUsers /> {p.teamSize}</div>
//                     <div className={p.criticalIssues > 0 ? "critical" : ""}>
//                       <FiAlertTriangle /> {p.criticalIssues}
//                     </div>
//                     <div className={daysLeft <= 7 ? "urgent" : ""}>
//                       <FiCalendar /> {daysLeft ?? "—"} days
//                     </div>
//                   </div>
//                 </div>

//                 <div className="card-footer">
//                   <FiEye /> View Details
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }
