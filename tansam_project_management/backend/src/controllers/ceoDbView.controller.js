import { connectDB } from "../config/db.js";

/* ================= GET ALL TABLES ================= */
export const getAllDbTables = async (req, res) => {
  try {
    const db = await connectDB();

    const [rows] = await db.execute("SHOW TABLES");

    // MySQL format: { Tables_in_dbname: "table_name" }
    const tables = rows.map(row => Object.values(row)[0]);

    res.json(tables);
  } catch (err) {
    console.error("Get Tables Error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET TABLE DATA ================= */
export const getTableData = async (req, res) => {
  try {
    const db = await connectDB();
    const { table } = req.params;

    // Get valid table names
    const [tables] = await db.execute("SHOW TABLES");
    const validTables = tables.map(t => Object.values(t)[0]);

    if (!validTables.includes(table)) {
      return res.status(400).json({ message: "Invalid table name" });
    }

    const [rows] = await db.execute(
      `SELECT * FROM \`${table}\``
    );

    res.json(rows);
  } catch (err) {
    console.error("Get Table Data Error:", err);
    res.status(500).json({ message: err.message });
  }
};

/* ================= DOWNLOAD TABLE ================= */
export const downloadTableData = async (req, res) => {
  try {
    const db = await connectDB();
    const { table } = req.params;

    const [tables] = await db.execute("SHOW TABLES");
    const validTables = tables.map(t => Object.values(t)[0]);

    if (!validTables.includes(table)) {
      return res.status(400).json({ message: "Invalid table name" });
    }

    const [rows] = await db.execute(
      `SELECT * FROM \`${table}\``
    );

    res.json({
      table,
      count: rows.length,
      data: rows,
    });
  } catch (err) {
    console.error("Download Table Error:", err);
    res.status(500).json({ message: err.message });
  }
};

