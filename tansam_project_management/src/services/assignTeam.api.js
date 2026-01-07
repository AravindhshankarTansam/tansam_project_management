const BASE_URL = "http://localhost:9899/api";

export const fetchAssignments = async () => {
  const res = await fetch(`${BASE_URL}/assignments`);
  if (!res.ok) throw new Error("Failed to fetch assignments");
  return res.json();
};

export const createAssignment = async (data) => {
  const res = await fetch(`${BASE_URL}/assignments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Assignment failed");
  }

  return res.json();
};

export const deleteAssignment = async (id) => {
  const res = await fetch(`${BASE_URL}/assignments/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Delete failed");
  return res.json();
};
