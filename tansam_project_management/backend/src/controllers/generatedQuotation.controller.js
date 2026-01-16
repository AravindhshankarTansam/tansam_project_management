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
    console.error("Get Generated Quotations Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add a new quotation
export const addGeneratedQuotation = async (req, res) => {
  try {
    const db = await connectDB();
    await initSchemas(db, { finance: true });
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

    const [result] = await db.execute(
      `INSERT INTO generated_quotations
       (refNo, date, clientName, kindAttn, subject, items, terms, signature, seal, financeManagerName)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      ]
    );

    res.status(201).json({ id: result.insertId });
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
