import { useState, useEffect, useMemo } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Ceocss/Ceoprojects.css";

import { fetchProjects } from "../../services/project.api";
import { fetchProjectFollowups } from "../../services/projectfollowup.api";

export default function CeoProjects() {
  const [projects, setProjects] = useState([]);
  const [followupStatuses, setFollowupStatuses] = useState({});
  const [loading, setLoading] = useState(true);

  /* 🔍 FILTER STATES */
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedType, setSelectedType] = useState("");

  /* ================= LOAD PROJECTS ================= */
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProjects();
        setProjects(data || []);
      } catch {
        toast.error("Failed to load projects");
      }
    })();
  }, []);

  /* ================= LOAD FOLLOWUP STATUS ================= */
  useEffect(() => {
    if (projects.length === 0) return;

    const loadStatuses = async () => {
      const statuses = {};
      const followups = await fetchProjectFollowups();

      projects.forEach((project) => {
        const projectFollowups = followups.filter(
          (f) => f.projectId === project.id
        );

        if (projectFollowups.length > 0) {
          const latest = projectFollowups.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          )[0];
          statuses[project.id] = latest.status;
        } else {
          statuses[project.id] = "Planned";
        }
      });

      setFollowupStatuses(statuses);
      setLoading(false);
    };

    loadStatuses();
  }, [projects]);

  /* ================= FILTER OPTIONS ================= */
  const clientOptions = useMemo(
    () => [...new Set(projects.map(p => p.clientName).filter(Boolean))],
    [projects]
  );

  const typeOptions = useMemo(
    () => [...new Set(projects.map(p => p.projectType).filter(Boolean))],
    [projects]
  );

  /* ================= FILTERED DATA ================= */
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchesSearch =
        !searchTerm ||
        p.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.clientName?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesClient =
        !selectedClient || p.clientName === selectedClient;

      const matchesType =
        !selectedType || p.projectType === selectedType;

      return matchesSearch && matchesClient && matchesType;
    });
  }, [projects, searchTerm, selectedClient, selectedType]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedClient("");
    setSelectedType("");
  };

  const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toISOString().split("T")[0];
};


  return (
    <div className="ceo-projects">
      <ToastContainer autoClose={1200} />

      <div className="page-header">
        <div>
          <h2>Projects Overview</h2>
          <p>High-level visibility of all projects</p>
        </div>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search project or client..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
        >
          <option value="">All Clients</option>
          {clientOptions.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="">All Project Types</option>
          {typeOptions.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        {(searchTerm || selectedClient || selectedType) && (
          <button className="clear-btn" onClick={clearFilters}>
            Clear
          </button>
        )}
      </div>

      {/* ================= TABLE ================= */}
      <div className="table-card">
        {loading ? (
          <div className="loading">Loading projects...</div>
        ) : filteredProjects.length === 0 ? (
          <div className="empty-state">No projects found</div>
        ) : (
          <table className="projects-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Client</th>
                <th>Type</th>
                <th>Status</th>
                <th>Start</th>
                <th>End</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map(p => (
                <tr key={p.id}>
                  <td>{p.projectName}</td>
                  <td>{p.clientName}</td>
                  <td>
                    <span className={`type-badge ${p.projectType?.toLowerCase()}`}>
                      {p.projectType}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${followupStatuses[p.id]?.toLowerCase().replace(" ", "-")}`}>
                      {followupStatuses[p.id]}
                    </span>
                  </td>
                  <td>{formatDate(p.startDate)}</td>
                  <td>{formatDate(p.endDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
