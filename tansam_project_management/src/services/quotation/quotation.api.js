const QUOTATIONS_URL = "http://localhost:9899/api/quotations";

// safe headers
const authHeaders = () => {
  const userId = localStorage.getItem("userId") || "1";          // default to 1 if missing
  const userRole = (localStorage.getItem("userRole") || "FINANCE").toUpperCase(); // default FINANCE

  return {
    "Content-Type": "application/json",
    "x-user-id": userId,
    "x-user-role": userRole,
  };
};

export const getQuotations = async () => {
  const res = await fetch(QUOTATIONS_URL, { headers: authHeaders() });
  if (!res.ok) throw new Error("Failed to fetch quotations");
  return res.json();
};

export const addQuotation = async (data) => {
  const res = await fetch(QUOTATIONS_URL, {
    method: "POST",
    headers: authHeaders(), // same headers as getQuotations
    body: JSON.stringify(data), // your quotation data
  });

  if (!res.ok) throw new Error("Failed to add quotation");

  return res.json();
};


export const updateQuotation = async (id, data) => {
  const res = await fetch(`${QUOTATIONS_URL}/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update quotation");
  return res.json();
};

export const deleteQuotation = async (id) => {
  const res = await fetch(`${QUOTATIONS_URL}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete quotation");
  return res.json();
};
