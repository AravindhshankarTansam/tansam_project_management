import { connectDB } from "../config/db.js";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { createQuotationDocx } from "../utils/QuotationDocx.js";

// Get all quotations
export const getQuotations = async (req, res) => {
  try {
    const db = await connectDB();
     await initSchemas(db, { finance: true });
    const [rows] = await db.execute(
      "SELECT * FROM quotations ORDER BY id ASC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Get Quotations Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add quotation
export const addQuotation = async (req, res) => {
  try {
    const {
      project_name,
      quotationNo,
      clientName,
      clientType,
      workCategory,
      lab,
      description,
      value,
      date,
    } = req.body;

    const db = await connectDB();
    await initSchemas(db, { finance: true });
    const [result] = await db.execute(
      `INSERT INTO quotations
       (project_name, quotationNo, clientName, clientType, workCategory, lab, description, value, date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        project_name,
        quotationNo,
        clientName,
        clientType,
        workCategory,
        lab,
        description,
        value,
        date,
      ]
    );

    res.status(201).json({
      id: result.insertId,
      project_name,
      quotationNo,
      clientName,
      clientType,
      workCategory,
      lab,
      description,
      value,
      date,
    });
  } catch (error) {
    console.error("Add Quotation Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update quotation
export const updateQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      project_name,
      clientName,
      clientType,
      workCategory,
      lab,
      description,
      value,
      date,
    } = req.body;

    const db = await connectDB();
    await initSchemas(db, { finance: true });
    await db.execute(
      `UPDATE quotations
       SET project_name=?, clientName=?, clientType=?, workCategory=?, lab=?, description=?, value=?, date=?
       WHERE id=?`,
      [project_name, clientName, clientType, workCategory, lab, description, value, date, id]
    );

    res.json({ id, ...req.body });
  } catch (error) {
    console.error("Update Quotation Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete quotation
export const deleteQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectDB();
    await db.execute("DELETE FROM quotations WHERE id=?", [id]);
    res.json({ message: "Quotation deleted", id });
  } catch (error) {
    console.error("Delete Quotation Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getQuotationById = async (id) => {
  const db = await connectDB();
      await initSchemas(db, { finance: true });
  const [rows] = await db.execute("SELECT * FROM quotations WHERE id=?", [id]);
  return rows[0]; // or null if not found
};

export const downloadQuotationDocx = async (req, res) => {
  const { id } = req.params;
  const quotation = await getQuotationById(id);

  if (!quotation) return res.status(404).send("Quotation not found");

  const buffer = await createQuotationDocx(quotation);

  res.set({
    "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "Content-Disposition": `attachment; filename=Quotation_${quotation.quotationNo}.docx`,
  });
  res.send(buffer);
};
