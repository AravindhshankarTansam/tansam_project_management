// middlewares/assignTeam.middleware.js
import { connectDB } from "../config/db.js";
import { initSchemas } from "../schema/main.schema.js";

export const assignTeamMiddleware = async (req, res, next) => {
  try {
    const db = await connectDB();
    await initSchemas(db, { assignTeam: true, department: true });

    req.db = db;
    next();
  } catch {
    res.status(500).json({ message: "Assign team middleware failed" });
  }
};
