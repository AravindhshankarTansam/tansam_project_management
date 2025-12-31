import express from "express";
import {
  getRoles,
  createRole,
  updateRole,
} from "../controllers/admin.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/admin.middleware.js";

const router = express.Router();

// ADMIN ONLY
router.get("/roles", authMiddleware, roleMiddleware(["ADMIN"]), getRoles);
router.post("/roles", authMiddleware, roleMiddleware(["ADMIN"]), createRole);
router.put("/roles/:id", authMiddleware, roleMiddleware(["ADMIN"]), updateRole);

export default router;
