import { connectDB } from "../config/db.js";

// Get all quotations
export const getQuotations = async (req, res) => {
  try {
    const db = await connectDB();
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

    const [result] = await db.execute(
      `INSERT INTO quotations
       (quotationNo, clientName, clientType, workCategory, lab, description, value, date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
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
      clientName,
      clientType,
      workCategory,
      lab,
      description,
      value,
      date,
    } = req.body;

    const db = await connectDB();

    await db.execute(
      `UPDATE quotations
       SET clientName=?, clientType=?, workCategory=?, lab=?, description=?, value=?, date=?
       WHERE id=?`,
      [clientName, clientType, workCategory, lab, description, value, date, id]
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
