import { connectDB } from "../config/db.js";
import { initSchemas } from "../schema/main.schema.js";

/* ================= GET ================= */
export const getForecasts = async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM ceo_forecast ORDER BY created_at DESC"
  );
  res.json(rows);
};

/* ================= CREATE ================= */
export const createForecast = async (req, res) => {
  const {
    workCategoryId,
    workCategoryName,
    clientName,
    totalValue,
    confidence,
    realizable,
    fy,
    carryover,
    remarks,
  } = req.body;

  const [result] = await db.query(
    `INSERT INTO ceo_forecast
     (work_category_id, work_category_name, client_name,
      total_value, confidence, realizable_value, fy, carryover, remarks, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      workCategoryId,
      workCategoryName,
      clientName,
      totalValue,
      confidence,
      realizable,
      fy,
      carryover,
      remarks,
      req.user.id,
    ]
  );

  res.json({ id: result.insertId });
};

/* ================= UPDATE ================= */
export const updateForecast = async (req, res) => {
  const { id } = req.params;

  const {
    workCategoryId,
    workCategoryName,
    clientName,
    totalValue,
    confidence,
    realizable,
    fy,
    carryover,
    remarks,
  } = req.body;

  await db.query(
    `UPDATE ceo_forecast SET
      work_category_id = ?,
      work_category_name = ?,
      client_name = ?,
      total_value = ?,
      confidence = ?,
      realizable_value = ?,
      fy = ?,
      carryover = ?,
      remarks = ?
     WHERE id = ?`,
    [
      workCategoryId,
      workCategoryName,
      clientName,
      totalValue,
      confidence,
      realizable,
      fy,
      carryover,
      remarks,
      id,
    ]
  );

  res.json({ success: true });
};

/* ================= DELETE ================= */
export const deleteForecast = async (req, res) => {
  const { id } = req.params;

  await db.query("DELETE FROM ceo_forecast WHERE id = ?", [id]);
  res.json({ success: true });
};
