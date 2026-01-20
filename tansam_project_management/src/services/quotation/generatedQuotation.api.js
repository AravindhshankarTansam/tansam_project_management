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

// Get generated quotation by original quotation id (not by generated row id)
export const getGeneratedQuotationByQuotationId = async (req, res) => {
  try {
    const db = await connectDB();
    await initSchemas(db, { finance: true });

    const { quotationId } = req.params; // comes from URL /by-quotation/:quotationId

    console.log(`[GET-GEN-BY-QID] Searching for quotationId: ${quotationId}`);

    // IMPORTANT: Use the correct column name from your table
    // If your column is quotationId (camelCase):
    const [rows] = await db.execute(
      "SELECT * FROM generated_quotations WHERE quotationId = ? LIMIT 1",
      [quotationId]
    );

    // If your column is quotation_id (snake_case), use this instead:
    // const [rows] = await db.execute(
    //   "SELECT * FROM generated_quotations WHERE quotation_id = ? LIMIT 1",
    //   [quotationId]
    // );

    console.log(`[GET-GEN-BY-QID] Found ${rows.length} row(s)`);

    if (rows.length === 0) {
      return res.status(200).json(null); // no error, just no data
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("[GET-GEN-BY-QID] Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};