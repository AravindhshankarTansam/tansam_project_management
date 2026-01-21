// controllers/generatedQuotation.controller.js
import { connectDB } from "../config/db.js";
import { initSchemas } from "../schema/main.schema.js";
// import { generateQuotationPdf } from "../utils/generateQuotationPdf.js"; // if you want backend PDF generation

// Get all generated quotations
export const getGeneratedQuotations = async (req, res) => {
  try {
    const db = await connectDB();
    await initSchemas(db, { finance: true });
    const [rows] = await db.execute(
      "SELECT * FROM generated_quotations ORDER BY id DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Get Generated Quotationsa Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add a new quotation
// controllers/generatedQuotation.controller.js
// controllers/generatedQuotation.controller.js

export const addGeneratedQuotation = async (req, res) => {
  try {
    const db = await connectDB();
    await initSchemas(db, { finance: true });

    const quotationId = req.body.quotation_id;

    if (!quotationId) {
      return res.status(400).json({ message: "Missing quotation_id" });
    }

    const {
      refNo, date, clientName, kindAttn, subject, financeManagerName,
      items, terms, termsContent
    } = req.body;

    const signaturePath = req.files?.signature?.[0] 
      ? `uploads/po/${req.files.signature[0].filename}` 
      : null;

    const sealPath = req.files?.seal?.[0] 
      ? `uploads/po/${req.files.seal[0].filename}` 
      : null;

    // IMPORTANT: Include quotation_id in the columns and values
   const [generatedResult] = await db.execute(
  `INSERT INTO generated_quotations 
   (quotationId, refNo, date, clientName, kindAttn, subject, 
    items, terms, termsContent, signature, seal, financeManagerName)
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [quotationId, refNo, date, clientName, kindAttn, subject, 
   items ? JSON.stringify(JSON.parse(items)) : '[]',
   terms ? JSON.stringify(JSON.parse(terms)) : '[]',
   termsContent || null,
   signaturePath,
   sealPath,
   financeManagerName]
);

    // Mark original quotation as generated
    await db.execute(
      `UPDATE quotations 
       SET isGenerated = 1
       WHERE id = ?`,  // better to use id instead of quotationNo
      [quotationId]
    );

    res.status(201).json({
      success: true,
      generatedId: generatedResult.insertId,
      message: "Quotation generated and original marked successfully"
    });

  } catch (error) {
    console.error("Add Generated Quotation Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// Get quotation by ID
// controllers/generatedQuotation.controller.js

export const getGeneratedQuotationById = async (req, res) => {
  try {
    const db = await connectDB();
    await initSchemas(db, { finance: true });

    const { id } = req.params; // this is the original quotation.id from frontend

    console.log(`[GET-GEN] Searching for quotation ID: ${id}`);

    // Use the correct column name — change quotationId to quotation_id if that's your actual column
 const [rows] = await db.execute(
  "SELECT * FROM generated_quotations WHERE quotationId = ? LIMIT 1",
  [id]
);

    console.log(`[GET-GEN] Found ${rows.length} row(s)`);

    if (rows.length === 0) {
      return res.status(200).json(null); // no error, just no data yet
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Get Generated Quotation Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update quotation
export const updateGeneratedQuotation = async (req, res) => {
  try {
    const db = await connectDB();
    await initSchemas(db, { finance: true });
    const { id } = req.params;
    const {
      refNo,
      date,
      clientName,
      kindAttn,
      subject,
      items,
      terms,

      signature,
      seal,
      financeManagerName,
    } = req.body;

    await db.execute(
      `UPDATE generated_quotations
       SET refNo=?, date=?, clientName=?, kindAttn=?, subject=?, items=?, terms=?, signature=?, seal=?, financeManagerName=?
       WHERE id=?`,
      [
        refNo,
        date,
        clientName,
        kindAttn,
        subject,
        JSON.stringify(items || []),
        JSON.stringify(terms || []),
        signature || null,
        seal || null,
        financeManagerName || null,
        id,
      ]
    );

    res.json({ id });
  } catch (error) {
    console.error("Update Generated Quotation Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete quotation
export const deleteGeneratedQuotation = async (req, res) => {
  try {
    const db = await connectDB();
    const { id } = req.params;
    await db.execute("DELETE FROM generated_quotations WHERE id=?", [id]);
    res.json({ message: "Quotation deleted", id });
  } catch (error) {
    console.error("Delete Generated Quotation Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
