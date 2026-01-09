import { connectDB } from "../config/db.js";
import { initSchemas } from "../schema/main.schema.js";

/* GET MEMBERS */
export const getMembers = async (req, res) => {
  try {
    const db = await connectDB();
    await initSchemas(db, { member: true });

    const [rows] = await db.execute(
      `SELECT id, name, email FROM members ORDER BY name`
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* CREATE MEMBER */
export const createMember = async (req, res) => {
  try {
    const { name, email } = req.body;
    const db = await connectDB();
    await initSchemas(db, { member: true });

    await db.execute(
      `INSERT INTO members (name, email) VALUES (?, ?)`,
      [name, email || null]
    );

    res.status(201).json({ message: "Member created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* DELETE MEMBER */
export const deleteMember = async (req, res) => {
  try {
    const { id } = req.params;
    const db = await connectDB();

    await db.execute(`DELETE FROM members WHERE id = ?`, [id]);
    res.json({ message: "Member deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
