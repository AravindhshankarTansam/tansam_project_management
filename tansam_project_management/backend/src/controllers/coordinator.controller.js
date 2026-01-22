import { connectDB } from "../config/db.js";
import { initSchemas } from "../schema/main.schema.js";
import { sendMail } from "../utils/mail.util.js";
import { assignedOpportunityTemplate,  unassignedOpportunityTemplate , opportunityContactUpdatedTemplate, } from "../utils/mail.template.js";
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
   CREATE OPPORTUNITY + MAIL
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
      assignedTo,
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
        normalize(customerName),
        normalize(industry),
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

    /* ================= SEND MAIL ================= */

    if (assignedTo) {
      const assignedUser = await getUserById(db, assignedTo);
      const assignorUser = await getUserById(db, req.user.id);

      if (assignedUser?.email) {
        await sendMail({
          to: [assignedUser.email, assignorUser?.email].filter(Boolean),
          subject: `New Opportunity Assigned - ${opportunityName}`,
          html: assignedOpportunityTemplate({
            userName: assignedUser.name,
            opportunityId,
            opportunityName,
            customerName,
            stage: leadStatus || "NEW",
            assignedBy: assignorUser?.name || "Coordinator",

            // 👇 CONTACT DETAILS
            contactPerson,
            contactEmail,
            contactPhone,
          }),
        });
      }
    }

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
   GET OPPORTUNITIES
====================================================== */
export const getOpportunities = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const db = await connectDB();
    await initSchemas(db, { coordinator: true });

    let query = `
      SELECT *
      FROM opportunities_coordinator
    `;
    const params = [];

    if (req.user.role === "COORDINATOR") {
      query += ` WHERE created_by = ?`;
      params.push(req.user.id);
    }

    query += ` ORDER BY id DESC`;

    const [rows] = await db.execute(query, params);
    res.json(rows);
  } catch (err) {
    console.error("Get opportunities error:", err);
    res.status(500).json({ message: "Failed to fetch opportunities" });
  }
};

/* ======================================================
   UPDATE OPPORTUNITY (SEND MAIL IF ASSIGNED USER CHANGES)
====================================================== */

// export const updateOpportunity = async (req, res) => {
//   try {
//     if (!req.user?.id) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }

//     const { opportunity_id } = req.params;
//     const {
//       opportunityName,
//       customerName,
//       industry,
//       contactPerson,
//       contactEmail,
//       contactPhone,
//       leadSource,
//       leadDescription,
//       leadStatus,
//       assignedTo,
//     } = req.body;

//     const db = await connectDB();
//     await initSchemas(db, { coordinator: true });

//     const [[oldOpp]] = await db.execute(
//       `
//       SELECT assigned_to, opportunity_name, customer_name
//       FROM opportunities_coordinator
//       WHERE opportunity_id = ?
//       `,
//       [opportunity_id]
//     );

//     if (!oldOpp) {
//       return res.status(404).json({ message: "Opportunity not found" });
//     }

//     await db.execute(
//       `
//       UPDATE opportunities_coordinator
//       SET
//         opportunity_name = COALESCE(?, opportunity_name),
//         customer_name    = COALESCE(?, customer_name),
//         company_name     = COALESCE(?, company_name),
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
//         normalize(customerName),
//         normalize(industry),
//         normalize(contactPerson),
//         normalize(contactEmail),
//         normalize(contactPhone),
//         leadSource || null,
//         leadDescription || null,
//         leadStatus || null,
//         normalize(assignedTo),
//         opportunity_id,
//       ]
//     );

//     /* ========== SEND MAIL ON REASSIGN ========== */

//     if (
//       assignedTo &&
//       oldOpp.assigned_to &&
//       String(oldOpp.assigned_to) !== String(assignedTo)
//     ) {
//       const [[oldUser]] = await db.execute(
//         `SELECT name, email FROM users_admin WHERE id = ?`,
//         [oldOpp.assigned_to]
//       );

//       const [[newUser]] = await db.execute(
//         `SELECT name, email FROM users_admin WHERE id = ?`,
//         [assignedTo]
//       );

//       // 🔴 Old user
//       if (oldUser?.email) {
//         await sendMail({
//           to: oldUser.email,
//           subject: "Opportunity Reassigned",
//           html: unassignedOpportunityTemplate({
//             userName: oldUser.name,
//             opportunityId: opportunity_id,
//             opportunityName: oldOpp.opportunity_name,
//             customerName: oldOpp.customer_name,
//             reassignedTo: newUser?.name || "Another user",
//           }),
//         });
//       }

//       // 🟢 New user (WITH CONTACT DETAILS)
//       if (newUser?.email) {
//         await sendMail({
//           to: newUser.email,
//           subject: "New Opportunity Assigned",
//           html: assignedOpportunityTemplate({
//             userName: newUser.name,
//             opportunityId: opportunity_id,
//             opportunityName: opportunityName || oldOpp.opportunity_name,
//             customerName: customerName || oldOpp.customer_name,
//             stage: leadStatus || "NEW",
//             assignedBy: req.user.name || req.user.username,

//             // 👇 CONTACT DETAILS
//             contactPerson,
//             contactEmail,
//             contactPhone,
//           }),
//         });
//       }
//     }

//     res.json({ message: "Opportunity updated successfully" });
//   } catch (err) {
//     console.error("Update opportunity error:", err);
//     res.status(500).json({ message: "Update failed" });
//   }
// };

export const updateOpportunity = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { opportunity_id } = req.params;
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
      assignedTo,
    } = req.body;

    const db = await connectDB();
    await initSchemas(db, { coordinator: true });

    /* ================= HELPERS ================= */

    const clean = (v) =>
      v === undefined || v === null ? "" : String(v).trim();

    /* ================= FETCH OLD DATA ================= */

    const [[oldOpp]] = await db.execute(
      `
      SELECT
        opportunity_name,
        customer_name,
        contact_person,
        contact_email,
        contact_phone,
        assigned_to
      FROM opportunities_coordinator
      WHERE opportunity_id = ?
      `,
      [opportunity_id]
    );

    if (!oldOpp) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    /* ================= RESOLVE FINAL VALUES ================= */
    // (IMPORTANT – prevents empty diff rows)

    const finalOpportunityName =
      clean(opportunityName) || clean(oldOpp.opportunity_name);
    const finalCustomerName =
      clean(customerName) || clean(oldOpp.customer_name);
    const finalContactPerson =
      clean(contactPerson) || clean(oldOpp.contact_person);
    const finalContactEmail =
      clean(contactEmail) || clean(oldOpp.contact_email);
    const finalContactPhone =
      clean(contactPhone) || clean(oldOpp.contact_phone);

    /* ================= UPDATE ================= */

    await db.execute(
      `
      UPDATE opportunities_coordinator
      SET
        opportunity_name = COALESCE(?, opportunity_name),
        customer_name    = COALESCE(?, customer_name),
        company_name     = COALESCE(?, company_name),
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
        normalize(customerName),
        normalize(industry),
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

    /* ================= CHANGE DETECTION (FIXED) ================= */

    const assignmentChanged =
      assignedTo &&
      String(oldOpp.assigned_to) !== String(assignedTo);

    const contactChanged =
      clean(oldOpp.customer_name) !== finalCustomerName ||
      clean(oldOpp.contact_person) !== finalContactPerson ||
      clean(oldOpp.contact_email) !== finalContactEmail ||
      clean(oldOpp.contact_phone) !== finalContactPhone;

    /* ================= FETCH USERS ================= */

    const [[assignor]] = await db.execute(
      `SELECT name, email FROM users_admin WHERE id = ?`,
      [req.user.id]
    );

    const [[assignedUser]] = assignedTo
      ? await db.execute(
          `SELECT name, email FROM users_admin WHERE id = ?`,
          [assignedTo]
        )
      : [[]];

    /* ================= MAIL LOGIC ================= */

    /* 🔁 REASSIGNMENT MAIL – OLD USER */
    if (assignmentChanged && oldOpp.assigned_to) {
      const [[oldUser]] = await db.execute(
        `SELECT name, email FROM users_admin WHERE id = ?`,
        [oldOpp.assigned_to]
      );

      if (oldUser?.email) {
        await sendMail({
          to: oldUser.email,
          subject: "Opportunity Reassigned",
          html: unassignedOpportunityTemplate({
            userName: oldUser.name,
            opportunityId: opportunity_id,
            opportunityName: oldOpp.opportunity_name,
            customerName: oldOpp.customer_name,
            reassignedTo: assignedUser?.name || "Another user",
          }),
        });
      }
    }

    /* 🟢 NEW ASSIGNEE MAIL */
    if (assignmentChanged && assignedUser?.email) {
      await sendMail({
        to: assignedUser.email,
        subject: "New Opportunity Assigned",
        html: assignedOpportunityTemplate({
          userName: assignedUser.name,
          opportunityId: opportunity_id,
          opportunityName: finalOpportunityName,
          customerName: finalCustomerName,
          stage: leadStatus || "NEW",
          assignedBy: assignor?.name || "Coordinator",
          contactPerson: finalContactPerson,
          contactEmail: finalContactEmail,
          contactPhone: finalContactPhone,
        }),
      });
    }

    /* 🧑‍💼 CONTACT DETAILS UPDATED – OLD vs NEW DIFF */
    if (contactChanged && assignedUser?.email && !assignmentChanged) {
      await sendMail({
        to: assignedUser.email,
        subject: "Opportunity Contact Details Updated",
        html: opportunityContactUpdatedTemplate({
          userName: assignedUser.name,
          opportunityId: opportunity_id,
          opportunityName: finalOpportunityName,
          customerName: finalCustomerName,
          assignedBy: assignor?.name || "Coordinator",

          oldContact: {
            contactPerson: clean(oldOpp.contact_person),
            contactEmail: clean(oldOpp.contact_email),
            contactPhone: clean(oldOpp.contact_phone),
          },
          newContact: {
            contactPerson: finalContactPerson,
            contactEmail: finalContactEmail,
            contactPhone: finalContactPhone,
          },
        }),
      });
    }

    res.json({ message: "Opportunity updated successfully" });
  } catch (err) {
    console.error("Update opportunity error:", err);
    res.status(500).json({ message: "Update failed" });
  }
};




/* ======================================================
   DELETE OPPORTUNITY
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

/* ======================================================
   CREATE OPPORTUNITY TRACKER
====================================================== */
export const createOpportunityTracker = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      opportunity_id,
      stage,
      next_followup_date,
      next_action,
      remarks,
    } = req.body;

    if (!opportunity_id) {
      return res.status(400).json({ message: "Opportunity is required" });
    }

    const db = await connectDB();
    await initSchemas(db, { coordinator: true });

    const [[opp]] = await db.execute(
      `
      SELECT opportunity_name, customer_name, assigned_to
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
        customer_name,
        assigned_to,
        stage,
        next_followup_date,
        next_action,
        remarks,
        created_by,
        created_by_name,
        created_by_role
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        opportunity_id,
        opp.opportunity_name,
        opp.customer_name,
        opp.assigned_to,
        normalizeStage(stage),
        next_followup_date || null,
        normalize(next_action),
        normalize(remarks),
        req.user.id,
        req.user.name || req.user.username || "Unknown",
        req.user.role,
      ]
    );

    res.status(201).json({ message: "Opportunity tracker created successfully" });
  } catch (err) {
    console.error("Create tracker error:", err);
    res.status(500).json({ message: "Failed to create opportunity tracker" });
  }
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
