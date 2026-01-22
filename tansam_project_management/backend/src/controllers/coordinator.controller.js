import { connectDB } from "../config/db.js";
import { initSchemas } from "../schema/main.schema.js";
import { sendMail } from "../utils/mail.util.js";
import {
  assignedOpportunityTemplate,
  unassignedOpportunityTemplate,
  opportunityContactUpdatedTemplate,
} from "../utils/mail.template.js";
import { getUserById } from "../utils/user.helper.js";

/* ======================================================
   HELPERS
====================================================== */

const ALLOWED_STAGES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "PROPOSAL_SENT",
  "NEGOTIATION",
  "WON",
  "LOST",
];

const normalizeStage = (stage) => {
  if (!stage) return "NEW";
  const clean = stage.trim().toUpperCase();
  return ALLOWED_STAGES.includes(clean) ? clean : "NEW";
};

const normalize = (v) => (v?.trim() ? v.trim() : null);

/* ======================================================
   ID GENERATORS
====================================================== */

const generateOpportunityId = async (db) => {
  const [rows] = await db.execute(
    `
    SELECT opportunity_id
    FROM opportunities_coordinator
    WHERE opportunity_id LIKE 'OPP%'
    ORDER BY id DESC
    LIMIT 1
    `
  );

  let seq = 1;
  if (rows.length) {
    seq = parseInt(rows[0].opportunity_id.replace("OPP", ""), 10) + 1;
  }

  return `OPP${String(seq).padStart(3, "0")}`;
};

const generateClientId = async (db) => {
  const [rows] = await db.execute(
    `
    SELECT client_id
    FROM opportunities_coordinator
    WHERE client_id LIKE 'CLIENT%'
    ORDER BY id DESC
    LIMIT 1
    `
  );

  let seq = 1;
  if (rows.length) {
    seq = parseInt(rows[0].client_id.replace("CLIENT", ""), 10) + 1;
  }

  return `CLIENT${String(seq).padStart(3, "0")}`;
};

/* ======================================================
   CREATE OPPORTUNITY (UI + CSV SAFE)
====================================================== */

const normalizeClientName = (name) =>
  name ? name.trim().replace(/\s+/g, " ").toUpperCase() : null;

const fuzzyKey = (name) => {
  const clean = normalizeClientName(name);
  if (!clean || clean.length < 10) return clean;
  return clean.slice(0, 5) + clean.slice(-5);
};

export const createOpportunity = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      opportunityName,
      clientName,
      contactPerson,
      contactEmail,
      contactPhone,
      leadSource,
      leadDescription,
      leadStatus,
      assignedTo,
      isNewClient,
    } = req.body;

    if (!opportunityName || !clientName) {
      return res
        .status(400)
        .json({ message: "Opportunity name and client name are required" });
    }

    const db = await connectDB();
    await initSchemas(db, { coordinator: true });

    const normalizedClientName = normalizeClientName(clientName);

    const opportunityId = await generateOpportunityId(db);
    let clientId;

    /* ========= SIMILAR CLIENT CHECK ========= */

    const key = fuzzyKey(normalizedClientName);

    const [[similarClient]] = await db.execute(
      `
      SELECT client_id, client_name
      FROM opportunities_coordinator
      WHERE UPPER(CONCAT(LEFT(client_name,5), RIGHT(client_name,5))) = ?
      LIMIT 1
      `,
      [key]
    );

    if (similarClient && !isNewClient) {
      return res.status(409).json({
        code: "SIMILAR_CLIENT_FOUND",
        existingClient: similarClient,
      });
    }

    clientId = similarClient ? similarClient.client_id : await generateClientId(db);

    /* ========= INSERT ========= */

    await db.execute(
      `
      INSERT INTO opportunities_coordinator (
        opportunity_id,
        opportunity_name,
        client_id,
        client_name,
        contact_person,
        contact_email,
        contact_phone,
        lead_source,
        lead_description,
        lead_status,
        assigned_to,
        created_by,
        created_by_name,
        created_by_role
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        opportunityId,
        normalize(opportunityName),
        clientId,
        normalizedClientName,
        normalize(contactPerson),
        normalize(contactEmail),
        normalize(contactPhone),
        leadSource || null,
        leadDescription || null,
        leadStatus || "NEW",
        normalize(assignedTo),
        req.user.id,
        req.user.name || req.user.username,
        req.user.role,
      ]
    );

    /* ========= MAIL ========= */

    if (assignedTo) {
      const assignedUser = await getUserById(db, assignedTo);
      const assignor = await getUserById(db, req.user.id);

      if (assignedUser?.email) {
        await sendMail({
          to: [assignedUser.email, assignor?.email].filter(Boolean),
          subject: `New Opportunity Assigned - ${opportunityName}`,
          html: assignedOpportunityTemplate({
            userName: assignedUser.name,
            opportunityId,
            opportunityName,
            clientName: normalizedClientName,
            stage: leadStatus || "NEW",
            assignedBy: assignor?.name || "Coordinator",
            contactPerson,
            contactEmail,
            contactPhone,
          }),
        });
      }
    }

    res.status(201).json({
      opportunity_id: opportunityId,
      client_id: clientId,
      message: "Opportunity created successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create opportunity" });
  }
};



/* ======================================================
   GET OPPORTUNITIES
====================================================== */
export const getOpportunities = async (req, res) => {
  const db = await connectDB();
  await initSchemas(db, { coordinator: true });

  let sql = `SELECT * FROM opportunities_coordinator`;
  const params = [];

  if (req.user.role === "COORDINATOR") {
    sql += ` WHERE created_by = ?`;
    params.push(req.user.id);
  }

  sql += ` ORDER BY id DESC`;
  const [rows] = await db.execute(sql, params);
  res.json(rows);
};

/* ======================================================
   UPDATE OPPORTUNITY (ALL MAILS)
====================================================== */
export const updateOpportunity = async (req, res) => {
  try {
    const { opportunity_id } = req.params;
    const {
      opportunityName,
      clientName,
      contactPerson,
      contactEmail,
      contactPhone,
      leadSource,
      leadDescription,
      leadStatus,
      assignedTo,
      isNewClient,      // 👈 REQUIRED
      client_id,        // 👈 OPTIONAL (explicit switch)
    } = req.body;

    const db = await connectDB();
    await initSchemas(db, { coordinator: true });

    const [[oldOpp]] = await db.execute(
      `SELECT * FROM opportunities_coordinator WHERE opportunity_id = ?`,
      [opportunity_id]
    );

    if (!oldOpp) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    let finalClientId = oldOpp.client_id;
    let finalClientName = oldOpp.client_name;

    /* ================= CLIENT NAME LOGIC ================= */

    if (clientName) {
      const normalizedClientName = normalizeClientName(clientName);

      if (
        normalizedClientName !== oldOpp.client_name &&
        !client_id
      ) {
        const key = fuzzyKey(normalizedClientName);

        const [[similarClient]] = await db.execute(
          `
          SELECT client_id, client_name
          FROM opportunities_coordinator
          WHERE
            UPPER(
              CONCAT(
                LEFT(client_name, 5),
                RIGHT(client_name, 5)
              )
            ) = ?
            AND client_id != ?
          LIMIT 1
          `,
          [key, oldOpp.client_id]
        );

        if (similarClient && !isNewClient) {
          return res.status(409).json({
            code: "SIMILAR_CLIENT_FOUND",
            message: "A similar client already exists",
            existingClient: similarClient,
          });
        }

        await db.execute(
          `
          UPDATE opportunities_coordinator
          SET client_name = ?
          WHERE client_id = ?
          `,
          [normalizedClientName, oldOpp.client_id]
        );

        finalClientName = normalizedClientName;
      }
    }

    /* ================= EXPLICIT CLIENT SWITCH ================= */

    if (client_id && client_id !== oldOpp.client_id) {
      finalClientId = client_id;

      const [[clientRow]] = await db.execute(
        `SELECT client_name FROM opportunities_coordinator WHERE client_id = ? LIMIT 1`,
        [client_id]
      );

      if (!clientRow) {
        return res.status(400).json({ message: "Invalid client selected" });
      }

      finalClientName = clientRow.client_name;
    }

    /* ================= UPDATE OPPORTUNITY ================= */

    await db.execute(
      `
      UPDATE opportunities_coordinator
      SET
        opportunity_name = COALESCE(?, opportunity_name),
        client_id        = ?,
        client_name      = ?,
        contact_person   = COALESCE(?, contact_person),
        contact_email    = COALESCE(?, contact_email),
        contact_phone    = COALESCE(?, contact_phone),
        lead_source      = COALESCE(?, lead_source),
        lead_description = COALESCE(?, lead_description),
        lead_status      = COALESCE(?, lead_status),
        assigned_to      = COALESCE(?, assigned_to)
      WHERE opportunity_id = ?
      `,
      [
        normalize(opportunityName),
        finalClientId,
        finalClientName,
        normalize(contactPerson),
        normalize(contactEmail),
        normalize(contactPhone),
        leadSource || null,
        leadDescription || null,
        leadStatus || null,
        normalize(assignedTo),
        opportunity_id,
      ]
    );

    /* ================= MAIL (ADDED) ================= */

    const assignmentChanged =
      assignedTo && String(oldOpp.assigned_to) !== String(assignedTo);

    const assignor = await getUserById(db, req.user.id);

    if (assignmentChanged) {
      const newUser = await getUserById(db, assignedTo);
      const oldUser = oldOpp.assigned_to
        ? await getUserById(db, oldOpp.assigned_to)
        : null;

      // 🔁 Mail to old assigned user
      if (oldUser?.email) {
        await sendMail({
          to: oldUser.email,
          subject: "Opportunity Reassigned",
          html: unassignedOpportunityTemplate({
            userName: oldUser.name,
            opportunityId: opportunity_id,
            opportunityName: oldOpp.opportunity_name,
            clientName: oldOpp.client_name,
            reassignedTo: newUser?.name || "Another user",
          }),
        });
      }

      // 🟢 Mail to new assigned user
      if (newUser?.email) {
        await sendMail({
          to: newUser.email,
          subject: "New Opportunity Assigned",
          html: assignedOpportunityTemplate({
            userName: newUser.name,
            opportunityId: opportunity_id,
            opportunityName: opportunityName || oldOpp.opportunity_name,
            clientName: finalClientName,
            stage: leadStatus || oldOpp.lead_status,
            assignedBy: assignor?.name || "Coordinator",
            contactPerson,
            contactEmail,
            contactPhone,
          }),
        });
      }
    }

    res.json({ message: "Opportunity updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};

/* ======================================================
   DELETE OPPORTUNITY
====================================================== */
export const deleteOpportunity = async (req, res) => {
  const { opportunity_id } = req.params;
  const db = await connectDB();

  const [result] = await db.execute(
    `
    DELETE FROM opportunities_coordinator
    WHERE opportunity_id = ?
      AND created_by = ?
    `,
    [opportunity_id, req.user.id]
  );

  if (!result.affectedRows) {
    return res.status(404).json({ message: "Opportunity not found" });
  }

  res.json({ message: "Opportunity deleted successfully" });
};

/* ======================================================
   OPPORTUNITY TRACKER
====================================================== */
export const createOpportunityTracker = async (req, res) => {
  const {
    opportunity_id,
    stage,
    next_followup_date,
    next_action,
    remarks,
  } = req.body;

  const db = await connectDB();

  const [[opp]] = await db.execute(
    `
    SELECT opportunity_name, client_id, client_name, assigned_to
    FROM opportunities_coordinator
    WHERE opportunity_id = ?
    `,
    [opportunity_id]
  );

  if (!opp) {
    return res.status(404).json({ message: "Opportunity not found" });
  }

  await db.execute(
    `
    INSERT INTO opportunity_tracker (
      opportunity_id,
      opportunity_name,
      client_id,
      client_name,
      assigned_to,
      stage,
      next_followup_date,
      next_action,
      remarks,
      created_by,
      created_by_name,
      created_by_role
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      opportunity_id,
      opp.opportunity_name,
      opp.client_id,
      opp.client_name,
      opp.assigned_to,
      normalizeStage(stage),
      next_followup_date || null,
      normalize(next_action),
      normalize(remarks),
      req.user.id,
      req.user.name || req.user.username,
      req.user.role,
    ]
  );

  res.status(201).json({ message: "Opportunity tracker created successfully" });
};

/* ======================================================
   GET OPPORTUNITY TRACKERS
====================================================== */
export const getOpportunityTrackers = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const db = await connectDB();
    await initSchemas(db, { coordinator: true });

    const [rows] = await db.execute(
      `
      SELECT *
      FROM opportunity_tracker
      WHERE created_by = ?
      ORDER BY id DESC
      `,
      [req.user.id]
    );

    res.json(rows);
  } catch (err) {
    console.error("Get tracker error:", err);
    res.status(500).json({ message: "Failed to fetch opportunity trackers" });
  }
};

/* ======================================================
   UPDATE OPPORTUNITY TRACKER
====================================================== */
export const updateOpportunityTracker = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const db = await connectDB();

    const [result] = await db.execute(
      `
      UPDATE opportunity_tracker
      SET
        stage              = COALESCE(?, stage),
        next_followup_date = COALESCE(?, next_followup_date),
        next_action        = COALESCE(?, next_action),
        remarks            = COALESCE(?, remarks)
      WHERE id = ?
        AND created_by = ?
      `,
      [
        normalizeStage(req.body.stage),
        req.body.next_followup_date || null,
        normalize(req.body.next_action),
        normalize(req.body.remarks),
        id,
        req.user.id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Tracker not found" });
    }

    res.json({ message: "Opportunity tracker updated successfully" });
  } catch (err) {
    console.error("Update tracker error:", err);
    res.status(500).json({ message: "Failed to update opportunity tracker" });
  }
};

/* ======================================================
   DELETE OPPORTUNITY TRACKER
====================================================== */
export const deleteOpportunityTracker = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;
    const db = await connectDB();

    const [result] = await db.execute(
      `
      DELETE FROM opportunity_tracker
      WHERE id = ?
        AND created_by = ?
      `,
      [id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Tracker not found" });
    }

    res.json({ message: "Opportunity tracker deleted successfully" });
  } catch (err) {
    console.error("Delete tracker error:", err);
    res.status(500).json({ message: "Failed to delete opportunity tracker" });
  }
};
