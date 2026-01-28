const BASE_URL = "http://localhost:9899/api/ceo";

/* 🔐 AUTH HEADERS — SAME PATTERN AS ADMIN */
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

/* ============================
   GET FORECASTS
============================ */
export const fetchForecasts = async () => {
  const res = await fetch(`${BASE_URL}/forecast`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch forecasts");
  return res.json();
};

/* ============================
   CREATE FORECAST
============================ */
export const createForecast = async (payload) => {
  const res = await fetch(`${BASE_URL}/forecast`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Create forecast failed");

  return data;
};

/* ============================
   UPDATE FORECAST
============================ */
export const updateForecast = async (id, payload) => {
  const res = await fetch(`${BASE_URL}/forecast/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Update forecast failed");

  return data;
};

/* ============================
   DELETE FORECAST
============================ */
export const deleteForecast = async (id) => {
  const res = await fetch(`${BASE_URL}/forecast/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw new Error("Delete forecast failed");
  return res.json();
};
