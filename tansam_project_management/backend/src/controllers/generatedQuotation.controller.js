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

    const {
      quotationId,         // ← This MUST come from frontend!
      refNo,
      date,
      clientName,
      kindAttn,
      subject,
      financeManagerName,
    } = req.body;

    const items = req.body.items ? JSON.parse(req.body.items) : [];
    const terms = req.body.terms ? JSON.parse(req.body.terms) : [];

    const signaturePath = req.files?.signature?.[0]?.filename
      ? `uploads/po/${req.files.signature[0].filename}`
      : null;

    const sealPath = req.files?.seal?.[0]?.filename
      ? `uploads/po/${req.files.seal[0].filename}`
      : null;

    // 1. Insert generated quotation
    const [result] = await db.execute(
      `INSERT INTO generated_quotations
       (quotationId, refNo, date, clientName, kindAttn, subject, items, terms, signature, seal, financeManagerName)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        quotationId,
        refNo,
        date,
        clientName,
        kindAttn || null,
        subject || null,
        JSON.stringify(items),
        JSON.stringify(terms),
        signaturePath,
        sealPath,
        financeManagerName || null,
      ]
    );

    // 2. VERY IMPORTANT → Update original quotation!
    await db.execute(
      `UPDATE quotations 
       SET isGenerated = 1 
       WHERE id = ?`,
      [quotationId]
    );

    res.json({ 
      success: true, 
      id: result.insertId,
      message: "Quotation generated and marked successfully"
    });
  } catch (error) {
    console.error("Add Generated Quotation Error:", error);
    res.status(500).json({ message: error.message });
  }
};
// Get quotation by ID
export const getGeneratedQuotationById = async (req, res) => {
  try {
    const db = await connectDB();
    await initSchemas(db, { finance: true });
    const { id } = req.params;
    const [rows] = await db.execute(
      "SELECT * FROM generated_quotations WHERE id=?",
      [id]
    );
    res.json(rows[0] || null);
  } catch (error) {
    console.error("Get Generated Quotation By ID Error:", error);
    res.status(500).json({ message: "Server error" });
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
