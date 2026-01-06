
import { connectDB } from "../config/db.js";
import { initSchemas } from "../schema/main.schema.js";

export const createProject = async (req, res) => {
  try {
    const db = await connectDB();

    // ✅ THIS IS THE KEY LINE
    await initSchemas(db, { project: true });

    const {
      projectName,
      clientName,
      projectType,
      startDate,
      endDate,
      status,
    } = req.body;

    await db.execute(
      `INSERT INTO projects
       (project_name, client_name, project_type, start_date, end_date, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        projectName,
        clientName,
        projectType,
        startDate,
        endDate,
        status || "Planned",
      ]
    );

    res.status(201).json({ message: "Project created successfully" });
  } catch (err) {
    console.error("Create project error:", err);
    res.status(500).json({ message: err.message });
  }
};
export const getProjects = async (req, res) => {
  try {
    const db = await connectDB();
    await initSchemas(db, { project: true });

    const [rows] = await db.execute(
      `SELECT 
         id,
         project_name AS projectName,
         client_name AS clientName,
         project_type AS projectType,
         start_date AS startDate,
         end_date AS endDate,
         status
       FROM projects
       ORDER BY id DESC`
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
/* ✅ UPDATE PROJECT */
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      projectName,
      clientName,
      projectType,
      startDate,
      endDate,
      status,
    } = req.body;

    const db = await connectDB();

    await db.execute(
      `UPDATE projects SET
        project_name = ?,
        client_name = ?,
        project_type = ?,
        start_date = ?,
        end_date = ?,
        status = ?
       WHERE id = ?`,
      [
        projectName,
        clientName,
        projectType,
        startDate,
        endDate,
        status,
        id,
      ]
    );

    res.json({ message: "Project updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ✅ DELETE PROJECT */
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectDB();

    await db.execute(`DELETE FROM projects WHERE id = ?`, [id]);

    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};