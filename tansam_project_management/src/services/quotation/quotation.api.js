const API_BASE =  import.meta.env.VITE_API_BASE_URL;

const QUOTATIONS_URL = `${API_BASE}/quotations`;

// safe headers
export const getAuthHeaders = () => {
  const storedUser = sessionStorage.getItem("user");

  if (!storedUser) return {};

  const user = JSON.parse(storedUser);

  if (!user) return {};

  return {
    "Content-Type": "application/json",
    "x-user-id": user.id,
    "x-user-role": user.role,
    "x-user-name": user.name,
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
export const generateQuotationNo = async () => {
  const res = await fetch(
    `${QUOTATIONS_URL}/generate-quotation-no`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  if (!res.ok) throw new Error("Failed to generate quotation number");

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
export const getTotalRevenue = async (queryString = "") => {
  const res = await fetch(`${QUOTATIONS_URL}/total-revenue?${queryString}`, {
    headers: getAuthHeaders(),
  });

  console.log("Revenue API status:", res.status);

  const data = await res.json();
  console.log("Revenue API data:", data);

  if (!res.ok) throw new Error("Failed to fetch total revenue");

  return data;
};
export const deleteQuotation = async (id) => {
  const res = await fetch(`${QUOTATIONS_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete quotation");
  return res.json();
};
