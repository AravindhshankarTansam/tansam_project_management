// services/generatedQuotation.api.js
const GENERATED_QUOTATION_URL = "http://localhost:9899/api/generatequotation";

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return {
    "Content-Type": "application/json",
    "x-user-id": user.id,
    "x-user-role": user.role,
    "x-user-name": user.username,
  };
};
export const saveGeneratedQuotation = async (quotationFormData) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const res = await fetch(GENERATED_QUOTATION_URL, {
    method: "POST",
    headers: {
      "x-user-id": user.id,
      "x-user-role": user.role,
      "x-user-name": user.username,
      // ❌ do NOT set Content-Type here for FormData
    },
    body: quotationFormData, // pass FormData directly
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Failed to save quotation");
  }

  return await res.json();
};


export const updateGeneratedQuotation = async (id, data) => {
  const res = await fetch(`${GENERATED_QUOTATION_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update quotation");
  return res.json();
};

export const deleteGeneratedQuotation = async (id) => {
  const res = await fetch(`${GENERATED_QUOTATION_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete quotation");
  return res.json();
};

export const getGeneratedQuotationById = async (id) => {
  const res = await fetch(`${GENERATED_QUOTATION_URL}/${id}`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error("Failed to fetch quotation by ID");
  return res.json();
};
