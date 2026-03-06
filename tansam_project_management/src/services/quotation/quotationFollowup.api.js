const API_BASE = import.meta.env.VITE_API_BASE_URL;

const FOLLOWUPS_URL = `${API_BASE}/api/quotation-followups`;

// ✅ same safe headers
export const getAuthHeaders = () => {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) return {};

  const user = JSON.parse(storedUser);

  return {
    "Content-Type": "application/json",
    "x-user-id": user.id,
    "x-user-role": user.role,
    "x-user-name": user.username,
  };
};

/* ===============================
   GET all follow-ups
================================ */
export const getFollowups = async () => {
  const res = await fetch(FOLLOWUPS_URL, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch quotation follow-ups");
  return res.json();
};

/* ===============================
   ADD follow-up
================================ */
export const addFollowup = async (data) => {
  const res = await fetch(FOLLOWUPS_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to add follow-up");
  return res.json();
};

/* ===============================
   UPDATE follow-up
================================ */
export const updateFollowup = async (id, data) => {
  const res = await fetch(`${FOLLOWUPS_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update follow-up");
  return res.json();
};

/* ===============================
   DELETE follow-up
================================ */
export const deleteFollowup = async (id) => {
  const res = await fetch(`${FOLLOWUPS_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to delete follow-up");
  return res.json();
};
