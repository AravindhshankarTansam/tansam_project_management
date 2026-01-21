import express from "express";
import {
  assignTeamMember,
  getAssignments,
  updateAssignment,
  deleteAssignment,
} from "../controllers/assignTeam.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { teamLeadMiddleware } from "../middlewares/teamlead.middleware.js";
import { roleMiddleware } from "../middlewares/admin.middleware.js";

const router = express.Router();

/**
 * GET ASSIGNMENTS — VIEW ACCESS
 */
router.get(
  "/assignments",
  authMiddleware,
  roleMiddleware(["TEAM LEAD", "ADMIN"]),
  getAssignments
);

/**
 * CREATE ASSIGNMENT — TEAM LEAD ONLY
 */
router.post(
  "/assignments",
  authMiddleware,
  teamLeadMiddleware,
  assignTeamMember
);

/**
 * UPDATE ASSIGNMENT — TEAM LEAD ONLY
 */
router.put(
  "/assignments/:id",
  authMiddleware,
  teamLeadMiddleware,
  updateAssignment
);

/**
 * DELETE ASSIGNMENT — TEAM LEAD ONLY
 */
router.delete(
  "/assignments/:id",
  authMiddleware,
  teamLeadMiddleware,
  deleteAssignment
);

export default router;
