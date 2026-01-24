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
   CONFIG
====================================================== */

const CEO_EMAIL = "ceo@yourcompany.com";

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

const normalizeClientName = (name) =>
  name ? name.trim().replace(/\s+/g, " ").toUpperCase() : null;

const fuzzyKey = (name) => {
  const clean = normalizeClientName(name);
  if (!clean || clean.length < 10) return clean;
  return clean.slice(0, 5) + clean.slice(-5);
};

const normalizeAssignedUsers = (assignedTo) => {
  if (!assignedTo) return null;
  if (Array.isArray(assignedTo)) return assignedTo.map(String).join(",");
  return String(assignedTo);
};

const parseAssignedUsers = (assignedTo) => {
  if (!assignedTo) return [];
  return String(assignedTo)
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
};

/* ======================================================
   ID GENERATORS
====================================================== */

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
    [`OPP-${year}-%`]
  );

  let seq = 1;
  if (rows.length) {
    seq = parseInt(rows[0].opportunity_id.split("-")[2], 10) + 1;
  }

  return `OPP-${year}-${String(seq).padStart(3, "0")}`;
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
   CREATE OPPORTUNITY
====================================================== */

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

    /* ========= CLIENT CHECK (UNCHANGED) ========= */

    const [[exactClient]] = await db.execute(
      `
      SELECT client_id
      FROM opportunities_coordinator
      WHERE UPPER(client_name) = ?
      LIMIT 1
      `,
      [normalizedClientName]
    );

    let clientId;

    if (exactClient) {
      clientId = exactClient.client_id;
    } else {
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

      clientId = await generateClientId(db);
    }

    const assignedStr = normalizeAssignedUsers(assignedTo);

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
        assignedStr,
        req.user.id,
        req.user.name || req.user.username,
        req.user.role,
      ]
    );

    /* ========= MAIL (MULTI + CEO) ========= */

    const assignor = await getUserById(db, req.user.id);
    const userIds = parseAssignedUsers(assignedStr);
    const emails = [];

    for (const id of userIds) {
      const u = await getUserById(db, id);
      if (u?.email) emails.push(u.email);
    }

    if (emails.length) {
      await sendMail({
        to: [...new Set([...emails, CEO_EMAIL])],
        subject: `New Opportunity Assigned - ${opportunityName}`,
        html: assignedOpportunityTemplate({
          userName: "Team",
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
   UPDATE OPPORTUNITY
====================================================== */

// export const updateOpportunity = async (req, res) => {
//   try {
//     const { opportunity_id } = req.params;
//     const {
//       opportunityName,
//       clientName,
//       contactPerson,
//       contactEmail,
//       contactPhone,
//       leadSource,
//       leadDescription,
//       leadStatus,
//       assignedTo,
//       isNewClient,
//       client_id,
//     } = req.body;

//     const db = await connectDB();
//     await initSchemas(db, { coordinator: true });

//     const [[oldOpp]] = await db.execute(
//       `SELECT * FROM opportunities_coordinator WHERE opportunity_id = ?`,
//       [opportunity_id]
//     );

//     if (!oldOpp) {
//       return res.status(404).json({ message: "Opportunity not found" });
//     }

//     const clean = (v) =>
//       v === undefined || v === null ? "" : String(v).trim();

//     const contactChanged =
//       clean(oldOpp.client_name) !== clean(clientName) ||
//       clean(oldOpp.contact_person) !== clean(contactPerson) ||
//       clean(oldOpp.contact_email) !== clean(contactEmail) ||
//       clean(oldOpp.contact_phone) !== clean(contactPhone);

//     /* ========= CLIENT LOGIC (UNCHANGED) ========= */

//     let finalClientId = oldOpp.client_id;
//     let finalClientName = oldOpp.client_name;

//     if (clientName && !client_id) {
//       const normalizedClientName = normalizeClientName(clientName);

//       if (normalizedClientName !== oldOpp.client_name) {
//         const key = fuzzyKey(normalizedClientName);

//         const [[similarClient]] = await db.execute(
//           `
//           SELECT client_id, client_name
//           FROM opportunities_coordinator
//           WHERE UPPER(CONCAT(LEFT(client_name,5), RIGHT(client_name,5))) = ?
//             AND client_id != ?
//           LIMIT 1
//           `,
//           [key, oldOpp.client_id]
//         );

//         if (similarClient && !isNewClient) {
//           return res.status(409).json({
//             code: "SIMILAR_CLIENT_FOUND",
//             existingClient: similarClient,
//           });
//         }

//         await db.execute(
//           `UPDATE opportunities_coordinator SET client_name = ? WHERE client_id = ?`,
//           [normalizedClientName, oldOpp.client_id]
//         );

//         finalClientName = normalizedClientName;
//       }
//     }

//     if (client_id && client_id !== oldOpp.client_id) {
//       const [[row]] = await db.execute(
//         `SELECT client_name FROM opportunities_coordinator WHERE client_id = ? LIMIT 1`,
//         [client_id]
//       );

//       if (!row) {
//         return res.status(400).json({ message: "Invalid client selected" });
//       }

//       finalClientId = client_id;
//       finalClientName = row.client_name;
//     }

//     /* ========= ASSIGNMENT CHANGE ========= */

//     const newAssigned = parseAssignedUsers(assignedTo);
//     const oldAssigned = parseAssignedUsers(oldOpp.assigned_to);

//     const assignmentChanged =
//       JSON.stringify([...newAssigned].sort()) !==
//       JSON.stringify([...oldAssigned].sort());

//     /* ========= UPDATE ========= */

//     const assignedStr = normalizeAssignedUsers(assignedTo);

//     await db.execute(
//       `
//       UPDATE opportunities_coordinator
//       SET
//         opportunity_name = COALESCE(?, opportunity_name),
//         client_id        = ?,
//         client_name      = ?,
//         contact_person   = COALESCE(?, contact_person),
//         contact_email    = COALESCE(?, contact_email),
//         contact_phone    = COALESCE(?, contact_phone),
//         lead_source      = COALESCE(?, lead_source),
//         lead_description = COALESCE(?, lead_description),
//         lead_status      = COALESCE(?, lead_status),
//         assigned_to      = COALESCE(?, assigned_to)
//       WHERE opportunity_id = ?
//       `,
//       [
//         normalize(opportunityName),
//         finalClientId,
//         finalClientName,
//         normalize(contactPerson),
//         normalize(contactEmail),
//         normalize(contactPhone),
//         leadSource || null,
//         leadDescription || null,
//         leadStatus || null,
//         assignedStr,
//         opportunity_id,
//       ]
//     );

//     /* ========= MAILS ========= */

//     const assignor = await getUserById(db, req.user.id);

//     if (assignmentChanged) {
//       const newEmails = [];
//       const oldEmails = [];

//       for (const id of newAssigned) {
//         const u = await getUserById(db, id);
//         if (u?.email) newEmails.push(u.email);
//       }

//       for (const id of oldAssigned) {
//         const u = await getUserById(db, id);
//         if (u?.email) oldEmails.push(u.email);
//       }

//       const removed = oldEmails.filter((e) => !newEmails.includes(e));
//       if (removed.length) {
//         await sendMail({
//           to: removed,
//           subject: "Opportunity Reassigned",
//           html: unassignedOpportunityTemplate({
//             userName: "Team",
//             opportunityId,
//             opportunityName: oldOpp.opportunity_name,
//             clientName: oldOpp.client_name,
//             reassignedTo: "Another team",
//           }),
//         });
//       }

//       if (newEmails.length) {
//         await sendMail({
//           to: [...new Set([...newEmails, CEO_EMAIL])],
//           subject: "New Opportunity Assigned",
//           html: assignedOpportunityTemplate({
//             userName: "Team",
//             opportunityId,
//             opportunityName: opportunityName || oldOpp.opportunity_name,
//             clientName: finalClientName,
//             stage: leadStatus || oldOpp.lead_status,
//             assignedBy: assignor?.name || "Coordinator",
//             contactPerson,
//             contactEmail,
//             contactPhone,
//           }),
//         });
//       }
//     }

//     if (contactChanged && !assignmentChanged && oldOpp.assigned_to) {
//       const emails = [];

//       for (const id of oldAssigned) {
//         const u = await getUserById(db, id);
//         if (u?.email) emails.push(u.email);
//       }

//       if (emails.length) {
//         await sendMail({
//           to: [...new Set([...emails, CEO_EMAIL])],
//           subject: "Opportunity Contact Details Updated",
//           html: opportunityContactUpdatedTemplate({
//             userName: "Team",
//             opportunityId,
//             opportunityName: opportunityName || oldOpp.opportunity_name,
//             clientName: finalClientName,
//             assignedBy: req.user.name || "Coordinator",
//             oldContact: {
//               contactPerson: oldOpp.contact_person,
//               contactEmail: oldOpp.contact_email,
//               contactPhone: oldOpp.contact_phone,
//             },
//             newContact: {
//               contactPerson,
//               contactEmail,
//               contactPhone,
//             },
//           }),
//         });
//       }
//     }

//     res.json({ message: "Opportunity updated successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Update failed" });
//   }
// };

export const checkSimilarClient = async (req, res) => {
  const { name } = req.query;
  if (!name || name.length < 3) return res.json(null);

  const db = await connectDB();
  await initSchemas(db, { coordinator: true });

  const normalize = (v) =>
    v.trim().replace(/\s+/g, " ").toUpperCase();

  const fuzzyKey = (n) => {
    const clean = normalize(n);
    if (clean.length < 10) return clean;
    return clean.slice(0, 5) + clean.slice(-5);
  };

  const key = fuzzyKey(name);

  const [[row]] = await db.execute(
    `
    SELECT client_id, client_name
    FROM opportunities_coordinator
    WHERE UPPER(CONCAT(LEFT(client_name,5), RIGHT(client_name,5))) = ?
    LIMIT 1
    `,
    [key]
  );

  res.json(row || null);
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
      isNewClient,
      client_id,
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

    const clean = (v) =>
      v === undefined || v === null ? "" : String(v).trim();

    const contactChanged =
      clean(oldOpp.client_name) !== clean(clientName) ||
      clean(oldOpp.contact_person) !== clean(contactPerson) ||
      clean(oldOpp.contact_email) !== clean(contactEmail) ||
      clean(oldOpp.contact_phone) !== clean(contactPhone);

    /* ========= CLIENT LOGIC (UNCHANGED) ========= */

    let finalClientId = oldOpp.client_id;
    let finalClientName = oldOpp.client_name;

    if (clientName && !client_id) {
      const normalizedClientName = normalizeClientName(clientName);

      if (normalizedClientName !== oldOpp.client_name) {
        const key = fuzzyKey(normalizedClientName);

        const [[similarClient]] = await db.execute(
          `
          SELECT client_id, client_name
          FROM opportunities_coordinator
          WHERE UPPER(CONCAT(LEFT(client_name,5), RIGHT(client_name,5))) = ?
            AND client_id != ?
          LIMIT 1
          `,
          [key, oldOpp.client_id]
        );

        if (similarClient && !isNewClient) {
          return res.status(409).json({
            code: "SIMILAR_CLIENT_FOUND",
            existingClient: similarClient,
          });
        }

        await db.execute(
          `UPDATE opportunities_coordinator SET client_name = ? WHERE client_id = ?`,
          [normalizedClientName, oldOpp.client_id]
        );

        finalClientName = normalizedClientName;
      }
    }

    if (client_id && client_id !== oldOpp.client_id) {
      const [[row]] = await db.execute(
        `SELECT client_name FROM opportunities_coordinator WHERE client_id = ? LIMIT 1`,
        [client_id]
      );

      if (!row) {
        return res.status(400).json({ message: "Invalid client selected" });
      }

      finalClientId = client_id;
      finalClientName = row.client_name;
    }

    /* ========= ASSIGNMENT CHANGE ========= */

    const newAssigned = parseAssignedUsers(assignedTo);
    const oldAssigned = parseAssignedUsers(oldOpp.assigned_to);

    const assignmentChanged =
      JSON.stringify([...newAssigned].sort()) !==
      JSON.stringify([...oldAssigned].sort());

    /* ========= UPDATE ========= */

    const assignedStr = normalizeAssignedUsers(assignedTo);

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
        assignedStr,
        opportunity_id,
      ]
    );

    /* ========= MAILS ========= */

    const assignor = await getUserById(db, req.user.id);

    if (assignmentChanged) {
      const newEmails = [];
      const oldEmails = [];

      for (const id of newAssigned) {
        const u = await getUserById(db, id);
        if (u?.email) newEmails.push(u.email);
      }

      for (const id of oldAssigned) {
        const u = await getUserById(db, id);
        if (u?.email) oldEmails.push(u.email);
      }

      const removed = oldEmails.filter((e) => !newEmails.includes(e));
      if (removed.length) {
        await sendMail({
          to: removed,
          subject: "Opportunity Reassigned",
          html: unassignedOpportunityTemplate({
            userName: "Team",
            opportunityId,
            opportunityName: oldOpp.opportunity_name,
            clientName: oldOpp.client_name,
            reassignedTo: "Another team",
          }),
        });
      }

      if (newEmails.length) {
        await sendMail({
          to: [...new Set([...newEmails, CEO_EMAIL])],
          subject: "New Opportunity Assigned",
          html: assignedOpportunityTemplate({
            userName: "Team",
            opportunityId,
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

    if (contactChanged && !assignmentChanged && oldOpp.assigned_to) {
      const emails = [];

      for (const id of oldAssigned) {
        const u = await getUserById(db, id);
        if (u?.email) emails.push(u.email);
      }

      if (emails.length) {
        await sendMail({
          to: [...new Set([...emails, CEO_EMAIL])],
          subject: "Opportunity Contact Details Updated",
          html: opportunityContactUpdatedTemplate({
            userName: "Team",
            opportunityId,
            opportunityName: opportunityName || oldOpp.opportunity_name,
            clientName: finalClientName,
            assignedBy: req.user.name || "Coordinator",
            oldContact: {
              contactPerson: oldOpp.contact_person,
              contactEmail: oldOpp.contact_email,
              contactPhone: oldOpp.contact_phone,
            },
            newContact: {
              contactPerson,
              contactEmail,
              contactPhone,
            },
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

    let query = `
      SELECT t.*
      FROM opportunity_tracker t
      INNER JOIN (
        SELECT opportunity_id, MAX(id) AS latest_id
        FROM opportunity_tracker
        GROUP BY opportunity_id
      ) latest
        ON latest.latest_id = t.id
    `;

    const params = [];

    // 🔐 Coordinator → only their opportunities
    if (req.user.role === "COORDINATOR") {
      query += ` WHERE t.created_by = ?`;
      params.push(req.user.id);
    }

    query += ` ORDER BY t.id DESC`;

    const [rows] = await db.execute(query, params);
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
