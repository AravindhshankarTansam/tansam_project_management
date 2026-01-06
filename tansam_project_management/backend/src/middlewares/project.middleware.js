// src/middlewares/project.middleware.js
import { connectDB } from "../config/db.js";
import { initSchemas } from "../schema/main.schema.js";

export const projectMiddleware = async (req, res, next) => {
  try {
    const db = await connectDB();

    // ensure schema exists
    await initSchemas(db, { project: true });

    // attach db to request (clean pattern)
    req.db = db;

    next();
  } catch (err) {
    res.status(500).json({ message: "Project middleware failed" });
  }
};
