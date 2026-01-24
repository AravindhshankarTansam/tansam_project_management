import { connectDB } from "../config/db.js";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { createQuotationDocx } from "../utils/QuotationDocx.js";
import { initSchemas } from "../schema/main.schema.js";
import { G } from "@react-pdf/renderer";
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
    const db = await connectDB();
    await initSchemas(db, { finance: true, coordinator: true });

    const {
      opprtunity_name,
      quotationNo,
      clientName,
      clientType,
      workCategory,
      lab,
      description,
      value,
      date,
      paymentPhase,
      revisedCost,
      poReceived,
      paymentReceived,
      paymentAmount,
      paymentPendingReason,
    } = req.body;

    // 🔑 Fetch client_id from coordinator table
    const [[client]] = await db.execute(
      `
      SELECT client_id
      FROM opportunities_coordinator
      WHERE UPPER(client_name) = UPPER(?)
      LIMIT 1
      `,
      [clientName]
    );

    if (!client) {
      return res.status(400).json({
        message: "Client not found in opportunities",
      });
    }

    const client_id = client.client_id;

    const [result] = await db.execute(
      `
      INSERT INTO quotations (
        opprtunity_name,
        quotationNo,
        client_id,
        clientName,
        clientType,
        workCategory,
        lab,
        description,
        value,
        date,
        paymentPhase,
        revisedCost,
        poReceived,
        paymentReceived,
        paymentAmount,
        paymentPendingReason
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        opprtunity_name,
        quotationNo,
        client_id,
        clientName,
        clientType,
        workCategory,
        lab,
        description,
        value,
        date,
        paymentPhase ?? null,
        revisedCost ?? null,
        poReceived ?? null,
        paymentReceived ?? null,
        paymentAmount ?? null,
        paymentPendingReason ?? null,
      ]
    );

    res.status(201).json({
      id: result.insertId,
      client_id,
      message: "Quotation created successfully",
    });
  } catch (error) {
    console.error("Add Quotation Error:", error);
    res.status(500).json({ message: error.message });
  }
};


// Update quotation
export const updateQuotation = async (req, res) => {
  try {
     const db = await connectDB();
    await initSchemas(db, { finance: true });
    const { id } = req.params;
    const {
      opprtunity_name,
      clientName,
      clientType,
      workCategory,
      
      lab,
      description,
      value,
      date,
       paymentPhase,
    revisedCost,
    poReceived,
    paymentReceived,
    paymentAmount,
    paymentPendingReason,
    } = req.body;

  
await db.execute(
  `UPDATE quotations
   SET opprtunity_name=?, clientName=?, clientType=?, workCategory=?, lab=?, description=?, value=?,  date=?, paymentPhase=?, revisedCost=?, poReceived=?, paymentReceived=?, paymentAmount=?, paymentPendingReason=?
   WHERE id=?`,
  [
    opprtunity_name,
    clientName,
    clientType,
    workCategory,
    lab,
    description,
    value,
    
    date,
    paymentPhase,
    revisedCost,
    poReceived,
    paymentReceived,
    paymentAmount,
    paymentPendingReason,
    id,
  ]
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
    await initSchemas(db, { finance: true });

    // 🔴 CRITICAL: delete child rows FIRST
    await db.execute(
      "DELETE FROM generated_quotations WHERE quotationId = ?",
      [id]
    );

    // ✅ then delete parent
    await db.execute(
      "DELETE FROM quotations WHERE id = ?",
      [id]
    );

    res.json({
      message: "Quotation and related generated quotations deleted",
      id,
    });
  } catch (error) {
    console.error("Delete Quotation Error:", error);
    res.status(500).json({ message: error.message });
  }
};




export const getQuotationById = async (id) => {
  const db = await connectDB();
      await initSchemas(db, { finance: true });
  const [rows] = await db.execute("SELECT * FROM quotations WHERE id=?", [id]);
  return rows[0]; // or null if not found
};
//Download Quotation as DOCX
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
