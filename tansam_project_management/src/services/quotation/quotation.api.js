const QUOTATIONS_URL = "http://localhost:9899/api/quotations";

// safe headers
const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return {
    "Content-Type": "application/json",
    "x-user-id": user.id,
    "x-user-role": user.role,
    "x-user-name": user.username,
  };
};

export const getQuotations = async () => {
  const res = await fetch(QUOTATIONS_URL, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to fetch quotations");
  return res.json();
};

export const addQuotation = async (data) => {
  const res = await fetch(QUOTATIONS_URL, {
    method: "POST",
    headers: getAuthHeaders(), // same headers as getQuotations
    body: JSON.stringify(data), // your quotation data
  });

  if (!res.ok) throw new Error("Failed to add quotation");

  return res.json();
};


export const updateQuotation = async (id, data) => {
  const res = await fetch(`${QUOTATIONS_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update quotation");
  return res.json();
};

export const deleteQuotation = async (id) => {
  const res = await fetch(`${QUOTATIONS_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete quotation");
  return res.json();
};
