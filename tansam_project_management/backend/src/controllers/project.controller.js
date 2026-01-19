
import { connectDB } from "../config/db.js";
import { initSchemas } from "../schema/main.schema.js";

export const createProject = async (req, res) => {
  try {
    const db = await connectDB();

    const {
      projectType,
      projectName,
      clientName,
      opportunityId,
      startDate,
      endDate,
      status,
      quotationNumber,
      poNumber,
    } = req.body;

    const poFilePath = req.file ? req.file.path : null;

    // ✅ NORMALIZE TYPE
    const normalizedType = projectType
      ?.toUpperCase()
      .replace(/\s+/g, "_");

    let finalProjectName = projectName;
    let finalClientName = clientName;
    let oppId = null;

    /* ================= CUSTOMER POC ================= */
    if (normalizedType === "CUSTOMER_POC") {
      if (!opportunityId) {
        return res.status(400).json({ message: "Opportunity is required" });
      }

      const [[opp]] = await db.execute(
        `SELECT
            opportunity_id,
            opportunity_name,
            customer_name
         FROM opportunities_coordinator
         WHERE opportunity_id = ?`,
        [opportunityId]
      );

      if (!opp) {
        return res.status(400).json({ message: "Invalid opportunity" });
      }

      finalProjectName = opp.opportunity_name;
      finalClientName = opp.customer_name;
      oppId = opp.opportunity_id;
    }

    /* ================= CUSTOMER VALIDATION ================= */
    if (
      normalizedType === "CUSTOMER" &&
      (!quotationNumber || !poNumber || !poFilePath)
    ) {
      return res.status(400).json({
        message: "Quotation, PO Number and File are required for Customer projects",
      });
    }

    /* ================= INSERT PROJECT ================= */
    const [result] = await db.execute(
      `INSERT INTO projects
       (project_name, client_name, project_type, opportunity_id,
        start_date, end_date, status,
        quotation_number, po_number, po_file)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        finalProjectName,
        finalClientName,
        normalizedType,
        oppId,
        startDate,
        endDate,
        status || "Planned",
        normalizedType === "CUSTOMER" ? quotationNumber : null,
        normalizedType === "CUSTOMER" ? poNumber : null,
        normalizedType === "CUSTOMER" ? poFilePath : null,
      ]
    );

    const projectId = result.insertId;

    /* ================= PROJECT REFERENCE ================= */
    if (normalizedType === "CUSTOMER_POC") {
      const projectReference = `${oppId}/prj-${projectId}`;

      await db.execute(
        `UPDATE projects SET project_reference=? WHERE id=?`,
        [projectReference, projectId]
      );
    }

    res.status(201).json({
      message: "Project created successfully",
      projectId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


export const getProjects = async (req, res) => {
  try {
    const db = await connectDB();
    await initSchemas(db, { project: true });

    const [rows] = await db.execute(`
      SELECT
        id,
        project_reference AS projectReference,
        project_name AS projectName,
        client_name AS clientName,
        project_type AS projectType,
        opportunity_id AS opportunityId,
        start_date AS startDate,
        end_date AS endDate,
        status,
        quotation_number AS quotationNumber,
        po_number AS poNumber,
        po_file AS poFile
      FROM projects
      ORDER BY id DESC
    `);

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
      quotationNumber,
      poNumber,
    } = req.body;

    const poFilePath = req.file ? req.file.path : null;

    const db = await connectDB();

    await db.execute(
      `UPDATE projects SET
        project_name = ?,
        client_name = ?,
        project_type = ?,
        start_date = ?,
        end_date = ?,
        status = ?,
        quotation_number = ?,
        po_number = ?,
        po_file = ?
       WHERE id = ?`,
      [
        projectName,
        clientName,
        projectType,
        startDate,
        endDate,
        status,
        quotationNumber || null,
        poNumber || null,
        poFilePath,
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