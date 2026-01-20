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
  let connection;

  try {
    const db = await connectDB();
    await initSchemas(db, { finance: true });

    connection = await db.getConnection();
    await connection.beginTransaction();

    const quotationId = req.body.quotation_id;

    // Critical logs
    console.log("[SAVE-GEN] quotation_id received from frontend:", quotationId);
    console.log("[SAVE-GEN] All body keys:", Object.keys(req.body));

    if (!quotationId || isNaN(Number(quotationId))) {
      throw new Error(`Invalid quotation_id: ${quotationId}`);
    }

    // ... your existing data extraction + UPSERT code ...

    const [updateRes] = await connection.execute(
      "UPDATE quotations SET isGenerated = 1 WHERE id = ?",
      [Number(quotationId)]   // force number
    );

    console.log("[SAVE-GEN] isGenerated UPDATE result:", {
      affectedRows: updateRes.affectedRows,
      changedRows: updateRes.changedRows || 0
    });

    await connection.commit();

    res.json({ success: true, quotationId, message: "Saved" });

  } catch (err) {
    if (connection) await connection.rollback().catch(() => {});
    console.error("[SAVE-GEN] Error:", err.message);
    res.status(500).json({ message: "Save failed", error: err.message });
  } finally {
    if (connection) connection.release();
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
