
const BASE_URL = "http://localhost:9899/api";

/**
 * Create Project API
 */
export const createProject = async (project) => {
  const res = await fetch(`${BASE_URL}/projects`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(project),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create project");
  }

  return res.json();
};

export const fetchProjects = async () => {
  const res = await fetch(`${BASE_URL}/projects`);
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
};
/* ✅ UPDATE */
export const updateProject = async (id, project) => {
  const res = await fetch(`${BASE_URL}/projects/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(project),
  });
  if (!res.ok) throw new Error("Update failed");
  return res.json();
};

/* ✅ DELETE */
export const deleteProject = async (id) => {
  const res = await fetch(`${BASE_URL}/projects/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Delete failed");
  return res.json();
};