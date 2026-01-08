import express from "express";
import {
  assignTeamMember,
  getAssignments,
  deleteAssignment,
} from "../controllers/assignTeam.controller.js";

const router = express.Router();

router.get("/assignments", getAssignments);
router.post("/assignments", assignTeamMember);
router.delete("/assignments/:id", deleteAssignment);

export default router;
