const BASE_URL = import.meta.env.VITE_API_BASE_URL;


/* 🔑 derive server root from API url */
const SERVER_URL = BASE_URL.replace("/api", "");

/* 🔐 AUTH HEADERS */
const getAuthHeaders = (isJson = false) => {
  const raw = localStorage.getItem("user");
  if (!raw) throw new Error("User not logged in");

  const user = JSON.parse(raw);

  const headers = {
    "x-user-id": user.id,
    "x-user-role": user.role,
    "x-user-name": user.username,
  };

  if (isJson) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};


/* ============================
   GET PROJECT FOLLOWUPS
============================ */
export const fetchProjectFollowups = async () => {
  const res = await fetch(`${BASE_URL}/project-followups`, {
    headers: getAuthHeaders(), // ✅ REQUIRED
  });

  if (!res.ok) throw new Error("Failed to load project follow-ups");
  return res.json();
};

/* ============================
   UPDATE FOLLOWUP
============================ */
export const updateProjectFollowup = async (projectId, data) => {
  const res = await fetch(`${BASE_URL}/project-followups/${projectId}`, {
    method: "PUT",
    headers: getAuthHeaders(true), // ✅ JSON headers
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Update failed");

  return result;
};

/* ============================
   RESOLVE PO FILE URL
============================ */
export const getPOFileUrl = (filePath) => {
  if (!filePath) return null;
  return `${SERVER_URL}/${filePath}`;
};
