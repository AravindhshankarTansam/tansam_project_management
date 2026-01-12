const BASE_URL = "http://localhost:9899/api";

/* GET all project followups */
export const fetchProjectFollowups = async () => {
  const res = await fetch(`${BASE_URL}/project-followups`);
  if (!res.ok) throw new Error("Failed to load project follow-ups");
  return res.json();
};

/* UPDATE followup by projectId */
export const updateProjectFollowup = async (projectId, data) => {
  const res = await fetch(`${BASE_URL}/project-followups/${projectId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Update failed");
  }

  return res.json();
};
