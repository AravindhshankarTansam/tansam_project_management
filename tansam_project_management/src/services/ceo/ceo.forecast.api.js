const BASE_URL = "http://localhost:9899/api/ceo/forecast";

/* 🔐 AUTH HEADERS */
const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    throw new Error("User not logged in");
  }

  return {
    "Content-Type": "application/json",
    "x-user-id": user.id,
    "x-user-role": user.role,
    "x-user-name": user.username,
  };
};

/* ================= GET ================= */
export const fetchForecasts = async () => {
  const res = await fetch(BASE_URL, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch forecasts");
  return res.json();
};

/* ================= CREATE ================= */
export const createForecast = async (payload) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Create failed");

  return data;
};

/* ================= UPDATE ================= */
export const updateForecast = async (id, payload) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Update failed");

  return data;
};

/* ================= DELETE ================= */
export const deleteForecast = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Delete failed");
  return res.json();
};
