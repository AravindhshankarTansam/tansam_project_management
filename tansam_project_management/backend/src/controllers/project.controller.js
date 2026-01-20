
import { connectDB } from "../config/db.js";
import { initSchemas } from "../schema/main.schema.js";

export const createProject = async (req, res) => {
  try {
    const db = await connectDB();

    const {
      projectType,
      projectName,
      clientName,
      opportunityId,          // ← coming from frontend
      startDate,
      endDate,
      status,
      quotationNumber,
      poNumber,
    } = req.body;

    const poFilePath = req.file ? req.file.path : null;

    // Normalize type (replace spaces with underscore, uppercase)
    const normalizedType = projectType
      ?.toUpperCase()
      .replace(/\s+/g, "_") || "";

    let finalProjectName = projectName;
    let finalClientName = clientName;
    let oppId = null;

    // ================= SAVE OPPORTUNITY ID FOR BOTH CUSTOMER AND CUSTOMER_POC =================
    if (normalizedType === "CUSTOMER" || normalizedType === "CUSTOMER_POC") {
      if (!opportunityId) {
        return res.status(400).json({ 
          message: "Opportunity ID is required for Customer / Customer POC projects" 
        });
      }

      const [[opp]] = await db.execute(
        `SELECT opportunity_id, opportunity_name, customer_name
         FROM opportunities_coordinator
         WHERE opportunity_id = ?`,
        [opportunityId]
      );

      if (!opp) {
        return res.status(400).json({ message: "Invalid opportunity ID" });
      }

      // Auto-fill if frontend didn't provide (optional safety)
      finalProjectName = finalProjectName || opp.opportunity_name;
      finalClientName = finalClientName || opp.customer_name;
      oppId = opp.opportunity_id; // ← This is what saves it!
    }

    // ================= CUSTOMER VALIDATION =================
    if (normalizedType === "CUSTOMER" && (!quotationNumber || !poNumber || !poFilePath)) {
      return res.status(400).json({
        message: "Quotation Number, PO Number, and PO File are required for Customer projects",
      });
    }

    // ================= INSERT INTO PROJECTS =================
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
        oppId,                    // ← Now saved for both types
        startDate,
        endDate,
        status || "Planned",
        normalizedType === "CUSTOMER" ? quotationNumber : null,
        normalizedType === "CUSTOMER" ? poNumber : null,
        normalizedType === "CUSTOMER" ? poFilePath : null,
      ]
    );

    const projectId = result.insertId;

    // ================= PROJECT REFERENCE (only for POC) =================
    if (normalizedType === "CUSTOMER_POC" && oppId) {
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
    console.error("Create Project Error:", err);
    res.status(500).json({ message: err.message });
  }
};


export const getProjects = async (req, res) => {
  try {
    const db = await connectDB();
    await initSchemas(db, { project: true });
const [rows] = await db.execute(`
  SELECT
    p.id,
    p.project_reference AS projectReference,
    p.project_name AS projectName,
    p.client_name AS clientName,
    p.project_type AS projectType,
    p.opportunity_id AS opportunityId,
    p.start_date AS startDate,
    p.end_date AS endDate,
    p.status,

    -- 👇 OPPORTUNITY CLIENT DETAILS
    o.contact_person AS contactPerson,
    o.contact_email  AS contactEmail,
    o.contact_phone  AS contactPhone,
    o.assigned_to    AS assignedTo

  FROM projects p
  LEFT JOIN opportunities_coordinator o
    ON p.opportunity_id = o.opportunity_id
  ORDER BY p.id DESC
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