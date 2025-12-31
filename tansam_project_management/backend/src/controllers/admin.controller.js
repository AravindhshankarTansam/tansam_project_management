import { connectDB } from "../config/db.js";
import { initSchemas } from "../schema/main.schema.js";

/**
 * GET roles (ADMIN only)
 */
export const getRoles = async (req, res) => {
  try {
    const db = await connectDB();

    // 🔥 Load ADMIN schemas only
    await initSchemas(db, { admin: true });

    const [roles] = await db.execute(
      "SELECT id, name, status FROM roles ORDER BY id"
    );

    res.json(roles);
  } catch (err) {
    console.error("Get roles error:", err);
    res.status(500).json({ message: "Failed to fetch roles" });
  }
};

/**
 * CREATE role (ADMIN only)
 */
export const createRole = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Role name is required" });
    }

    const db = await connectDB();
    await initSchemas(db, { admin: true });

    await db.execute(
      "INSERT INTO roles (name) VALUES (?)",
      [name.toUpperCase()]
    );

    res.status(201).json({ message: "Role created successfully" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Role already exists" });
    }

    console.error("Create role error:", err);
    res.status(500).json({ message: "Failed to create role" });
  }
};

/**
 * UPDATE role (ADMIN only)
 */
export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;

    const db = await connectDB();

    await db.execute(
      "UPDATE roles SET name=?, status=? WHERE id=?",
      [name.toUpperCase(), status || "ACTIVE", id]
    );

    res.json({ message: "Role updated successfully" });
  } catch (err) {
    console.error("Update role error:", err);
    res.status(500).json({ message: "Failed to update role" });
  }
};
