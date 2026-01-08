import { useState } from "react";
import "./ProjectSection.css";

const PROJECTS = [
  { name: "Training - Naan Mudhalvan", client: "TNSDC", type: "Academia", status: "Ongoing" },
  { name: "ML Face Recognition", client: "JSW Steel", type: "Industry", status: "Ongoing" },
  { name: "Traffic Classification", client: "Highways", type: "Industry", status: "Completed" }
];

export default function ProjectSection() {
  const [filter, setFilter] = useState("ALL");

  const filtered =
    filter === "ALL" ? PROJECTS : PROJECTS.filter(p => p.status === filter);

  return (
    <div className="project-card">
      <div className="project-header">
        <h2>PROJECT 2025–2026</h2>

        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="ALL">All</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Project</th>
            <th>Client</th>
            <th>Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p, i) => (
            <tr key={i}>
              <td>{p.name}</td>
              <td>{p.client}</td>
              <td>{p.type}</td>
              <td>{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
