import { connectDB } from "../config/db.js";
import { initSchemas } from "../schema/main.schema.js";

/**
 * Generate business opportunity ID
 * Format: OPP_YYYY_001
 */
const generateOpportunityId = async (db) => {
  const year = new Date().getFullYear();

  const [rows] = await db.execute(
    `
    SELECT opportunity_id
    FROM opportunities_coordinator
    WHERE opportunity_id LIKE ?
    ORDER BY id DESC
    LIMIT 1
    `,
    [`OPP_${year}_%`]
  );

  let seq = 1;
  if (rows.length > 0) {
    seq = parseInt(rows[0].opportunity_id.split("_")[2], 10) + 1;
  }

  return `OPP_${year}_${String(seq).padStart(3, "0")}`;
};

/* ======================================================
   CREATE OPPORTUNITY
====================================================== */
export const createOpportunity = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      opportunityName,
      customerName,
      industry,
      contactPerson,
      contactEmail,
      contactPhone,
      leadSource,
      leadDescription,
      leadStatus,
    } = req.body;

    if (!opportunityName || !customerName) {
      return res.status(400).json({
        message: "Opportunity name and customer name are required",
      });
    }

    const db = await connectDB();
    await initSchemas(db, { coordinator: true });

    const opportunityId = await generateOpportunityId(db);

    await db.execute(
      `
      INSERT INTO opportunities_coordinator (
        opportunity_id,
        opportunity_name,
        customer_name,
        company_name,
        contact_person,
        contact_email,
        contact_phone,
        lead_source,
        lead_description,
        lead_status,
        created_by,
        created_by_name,
        created_by_role
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        opportunityId,
        opportunityName.trim(),
        customerName.trim(),
        industry?.trim() || null,
        contactPerson?.trim() || null,
        contactEmail?.trim() || null,
        contactPhone?.trim() || null,
        leadSource || null,
        leadDescription || null,
        leadStatus || "NEW",
        req.user.id,
        req.user.name || req.user.username || "Unknown",
        req.user.role,
      ]
    );

    res.status(201).json({
      opportunity_id: opportunityId,
      message: "Opportunity created successfully",
    });
  } catch (err) {
    console.error("Create opportunity error:", err);
    res.status(500).json({ message: "Failed to create opportunity" });
  }
};

/* ======================================================
   GET OPPORTUNITIES (OWN)
====================================================== */
export const getOpportunities = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const db = await connectDB();
    await initSchemas(db, { coordinator: true });

    const [rows] = await db.execute(
      `
      SELECT
        opportunity_id,
        opportunity_name,
        customer_name,
        company_name,
        contact_person,
        contact_email,
        contact_phone,
        lead_source,
        lead_description,
        lead_status,
        created_at,
        created_by,
        created_by_name,
        created_by_role
      FROM opportunities_coordinator
      WHERE created_by = ?
      ORDER BY id DESC
      `,
      [req.user.id]
    );

    res.json(rows);
  } catch (err) {
    console.error("Get opportunities error:", err);
    res.status(500).json({ message: "Failed to fetch opportunities" });
  }
};

/* ======================================================
   UPDATE OPPORTUNITY (OWN ONLY)
====================================================== */
export const updateOpportunity = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { opportunity_id } = req.params;

    const normalize = (v) => (v?.trim() ? v.trim() : null);

    const db = await connectDB();
    await initSchemas(db, { coordinator: true });

    const [result] = await db.execute(
      `
      UPDATE opportunities_coordinator
      SET
        opportunity_name  = COALESCE(?, opportunity_name),
        customer_name     = COALESCE(?, customer_name),
        company_name      = COALESCE(?, company_name),
        contact_person    = COALESCE(?, contact_person),
        contact_email     = COALESCE(?, contact_email),
        contact_phone     = COALESCE(?, contact_phone),
        lead_source       = COALESCE(?, lead_source),
        lead_description  = COALESCE(?, lead_description),
        lead_status       = COALESCE(?, lead_status)
      WHERE opportunity_id = ?
        AND created_by = ?
      `,
      [
        normalize(req.body.opportunityName),
        normalize(req.body.customerName),
        normalize(req.body.industry),
        normalize(req.body.contactPerson),
        normalize(req.body.contactEmail),
        normalize(req.body.contactPhone),
        req.body.leadSource || null,
        req.body.leadDescription || null,
        req.body.leadStatus || null,
        opportunity_id,
        req.user.id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    res.json({ message: "Opportunity updated successfully" });
  } catch (err) {
    console.error("Update opportunity error:", err);
    res.status(500).json({ message: "Failed to update opportunity" });
  }
};

/* ======================================================
   DELETE OPPORTUNITY (OWN ONLY)
====================================================== */
export const deleteOpportunity = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { opportunity_id } = req.params;

    const db = await connectDB();
    await initSchemas(db, { coordinator: true });

    const [result] = await db.execute(
      `
      DELETE FROM opportunities_coordinator
      WHERE opportunity_id = ?
        AND created_by = ?
      `,
      [opportunity_id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    res.json({ message: "Opportunity deleted successfully" });
  } catch (err) {
    console.error("Delete opportunity error:", err);
    res.status(500).json({ message: "Failed to delete opportunity" });
  }
};
