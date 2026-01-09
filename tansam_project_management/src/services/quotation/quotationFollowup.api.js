const FOLLOWUPS_URL = "http://localhost:9899/api/quotation-followups";

// ✅ same safe headers
const authHeaders = () => {
  const userId = localStorage.getItem("userId") || "1";
  const userRole = (localStorage.getItem("userRole") || "FINANCE").toUpperCase();

  return {
    "Content-Type": "application/json",
    "x-user-id": userId,
    "x-user-role": userRole,
  };
};

/* ===============================
   GET all follow-ups
================================ */
export const getFollowups = async () => {
  const res = await fetch(FOLLOWUPS_URL, {
    headers: authHeaders(),
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
    headers: authHeaders(),
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
    headers: authHeaders(),
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
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to delete follow-up");
  return res.json();
};
