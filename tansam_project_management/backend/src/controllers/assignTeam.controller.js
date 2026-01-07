import { connectDB } from "../config/db.js";
import { initSchemas } from "../schema/main.schema.js";

/* CREATE ASSIGNMENT */
export const assignTeamMember = async (req, res) => {
  try {
    const {
      projectId,
      memberName,
      role,
      departmentId,
      effort,
      startDate,
      endDate,
    } = req.body;

    const db = await connectDB();
    await initSchemas(db, { assignTeam: true });

    await db.execute(
      `INSERT INTO project_team_assignments
       (project_id, member_name, role, department_id,
        estimated_effort, start_date, end_date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        projectId,
        memberName,
        role,
        departmentId,
        effort,
        startDate,
        endDate,
      ]
    );

    res.status(201).json({ message: "Team member assigned" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET ASSIGNMENTS */
export const getAssignments = async (req, res) => {
  try {
    const db = await connectDB();
    await initSchemas(db, { assignTeam: true });

    const [rows] = await db.execute(`
      SELECT
        a.id,
        p.project_name AS projectName,
        a.member_name AS memberName,
        a.role,
        d.name AS department,
        a.estimated_effort AS effort,
        a.start_date AS startDate,
        a.end_date AS endDate
      FROM project_team_assignments a
      JOIN projects p ON p.id = a.project_id
      JOIN departments d ON d.id = a.department_id
      ORDER BY a.id DESC
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* DELETE ASSIGNMENT */
export const deleteAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectDB();

    await db.execute(
      `DELETE FROM project_team_assignments WHERE id = ?`,
      [id]
    );

    res.json({ message: "Assignment removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
