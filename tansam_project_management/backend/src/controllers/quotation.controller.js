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
    const { unitPrice = 0, qty = 0, gst = 0, ...otherFields } = req.body;

  // Instead of just JSON.stringify(req.body.items)
const itemDetails = JSON.stringify(
  (req.body.items && req.body.items.length)
    ? req.body.items.map(item => ({
       
        qty: Number(item.qty || 0),
        unitPrice: Number(item.unitPrice || 0),
        gst: Number(item.gst || 0),
       
      }))
    : [{
        
        qty: Number(req.body.qty || 0),
        unitPrice: Number(req.body.unitPrice || 0),
        gst: Number(req.body.gst || 0),
     
      }]
);
// ensure string


    const {
      opprtunity_name,
      quotationNo,
      clientName,
      client_type_id,
      client_type_name,
      work_category_id,
      work_category_name,
      lab_id,
      lab_name,
      description,
      value,
      date,
      quotationStatus = 'Draft',
    } = req.body;

    // 🔑 Fetch client_id
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
    client_type_id,
    client_type_name,
    work_category_id,
    work_category_name,
    lab_id,
    lab_name,
    description,
    itemDetails,
    value,
    date,
    quotationStatus
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
  [
    opprtunity_name,
    quotationNo,
    client_id,
    clientName,
    client_type_id,
    client_type_name,
    work_category_id,
    work_category_name,
    lab_id,
    lab_name,
    description,
    itemDetails,
    value,
    date,
    quotationStatus, // defaulted to 'Draft' in JS destructuring
  ]
);

    res.status(201).json({
      id: result.insertId,
      quotationStatus: "Draft",
      message: "Quotation created successfully",
    });
  } catch (error) {
    console.error("Add Quotation Error:", error);
    res.status(500).json({ message: error.message });
  }
};



// Update quotation
// Update quotation
// Update quotation
// Update Quotation
export const updateQuotation = async (req, res) => {
  try {
    const db = await connectDB();
    await initSchemas(db, { finance: true });

    const { id } = req.params;

    // Fetch existing quotation
    const [[existing]] = await db.execute(
      "SELECT * FROM quotations WHERE id = ?",
      [id]
    );

    if (!existing) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    const currentStatus = existing.quotationStatus;



    // -----------------------------
    // Sanitize all fields to avoid undefined
    // -----------------------------
    const safeBody = {};
    [
      "opprtunity_name",
      "clientName",
      "client_type_name",
      "work_category_name",
      "lab_name",
      "description",
      "itemDetails",
      "value",
      "date",
      "quotationStatus",
      "paymentPhase",
      "revisedCost",
      "poReceived",
      "paymentReceived",
      "paymentAmount",
      "paymentPendingReason",
      "client_id",
    ].forEach((key) => {
      safeBody[key] = req.body[key] ?? null;
    });
safeBody.itemDetails = JSON.stringify(
  (req.body.items && req.body.items.length)
    ? req.body.items.map(item => ({
        description: item.description || "",
        qty: Number(item.qty || 0),
        unitPrice: Number(item.unitPrice || 0),
        gst: Number(item.gst || 0),
        total: Number(item.qty || 0) * Number(item.unitPrice || 0) * (1 + Number(item.gst || 0)/100)
      }))
    : [{
        description: "",
        qty: Number(req.body.qty || 0),
        unitPrice: Number(req.body.unitPrice || 0),
        gst: Number(req.body.gst || 0),
        total: Number(req.body.qty || 0) * Number(req.body.unitPrice || 0) * (1 + Number(req.body.gst || 0)/100)
      }]
);
    // -----------------------------
    // Determine final status
    // -----------------------------
    const finalStatus = safeBody.quotationStatus ?? currentStatus;
// 🔐 Fetch opportunity stage from correct table
const [oppRows] = await db.execute(
  `
  SELECT stage
  FROM opportunity_tracker
  WHERE opportunity_name = ? 
  LIMIT 1
  `,
  [safeBody.opprtunity_name]
);

const opp = oppRows[0];

if (!opp) {
  return res.status(400).json({ message: "Opportunity not found" });
}

// ❌ Block approval if not WON
if (safeBody.quotationStatus === "Approved" && opp.stage !== "WON") {
  return res.status(403).json({
    message: "Quotation can be approved only when opportunity stage is WON",
  });
}

    // -----------------------------
    // Ensure client_id exists
    // -----------------------------
    let client_id = safeBody.client_id;
    if (!client_id && safeBody.clientName) {
      const [[client]] = await db.execute(
        `SELECT client_id FROM opportunities_coordinator WHERE UPPER(client_name)=UPPER(?) LIMIT 1`,
        [safeBody.clientName]
      );

      if (!client) {
        return res.status(400).json({ message: "Client not found" });
      }
      client_id = client.client_id;
    }

    // -----------------------------
    // Payment protection
    // Only update payment fields if Approved
    // -----------------------------
    const paymentData =
      finalStatus === "Approved"
        ? {
          paymentPhase: safeBody.paymentPhase ?? "Started",
          revisedCost: safeBody.revisedCost ?? null,
          poReceived: safeBody.poReceived ?? "No",
          paymentReceived: safeBody.paymentReceived ?? "No",
          paymentAmount: safeBody.paymentAmount ?? null,
          paymentPendingReason: safeBody.paymentPendingReason ?? null,
        }
        : {
          paymentPhase: "Not Started",
          revisedCost: null,
          poReceived: "No",
          paymentReceived: "No",
          paymentAmount: null,
          paymentPendingReason: null,
        };

    // -----------------------------
    // Update quotation in DB
    // -----------------------------
    await db.execute(
      `
      UPDATE quotations
      SET
        opprtunity_name = ?,
        clientName = ?,
        client_type_name = ?,
        work_category_name = ?,
        lab_name = ?,
        description = ?,
          itemDetails = ?,
        value = ?,
        date = ?,
        quotationStatus = ?,
        paymentPhase = ?,
        revisedCost = ?,
        poReceived = ?,
        paymentReceived = ?,
        paymentAmount = ?,
        paymentPendingReason = ?,
        client_id = ?
      WHERE id = ?
      `,
      [
        safeBody.opprtunity_name,
        safeBody.clientName,
        safeBody.client_type_name,
        safeBody.work_category_name,
        safeBody.lab_name,
        safeBody.description,
       safeBody.itemDetails,
        safeBody.value,
        safeBody.date,
        finalStatus,
        paymentData.paymentPhase,
        paymentData.revisedCost,
        paymentData.poReceived,
        paymentData.paymentReceived,
        paymentData.paymentAmount,
        paymentData.paymentPendingReason,
        client_id,
        id,
      ]
    );

    res.json({
      message: "Quotation updated successfully",
      id,
      quotationStatus: finalStatus,
    });
  } catch (error) {
    console.error("Update Quotation Error:", error);
    res.status(500).json({ message: error.message });
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
