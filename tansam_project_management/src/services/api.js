const BASE_URL = "http://localhost:9899/api";

/**
 * Login API
 * @param {string} email
 * @param {string} password
 */
export const loginUser = async (email, password) => {
  // ✅ Finance frontend login (no backend account)
  if (email === "fm@tansam.com" && password === "Tansam@123") {
    return {
      id: 5,
      email: "fm@tansam.com",
      role: "finance",
      name: "Finance Manager",
    };
  }

  // Admin and all other users → fetch from backend
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data; // backend should return { id, email, role, name, route (optional) }
};

const QUOTATIONS_URL = `${BASE_URL}/quotations`;

/* =========================
   GET QUOTATIONS
========================= */
export const getQuotations = async () => {
  const res = await fetch(QUOTATIONS_URL);

  if (!res.ok) {
    throw new Error("Failed to fetch quotations");
  }

  return await res.json();
};

/* =========================
   ADD QUOTATION
========================= */
export const addQuotation = async (data) => {
  const res = await fetch(QUOTATIONS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Add quotation error:", err);
    throw new Error("Failed to add quotation");
  }

  return await res.json();
};

/* =========================
   UPDATE QUOTATION
========================= */
export const updateQuotation = async (id, data) => {
  const res = await fetch(`${QUOTATIONS_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to update quotation");
  }

  return await res.json();
};

/* =========================
   DELETE QUOTATION
========================= */
export const deleteQuotation = async (id) => {
  const res = await fetch(`${QUOTATIONS_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete quotation");
  }

  return await res.json();
};