import express from "express";
import {
  assignTeamMember,
  getAssignments,
  updateAssignment,
  deleteAssignment,
} from "../controllers/assignTeam.controller.js";

const router = express.Router();

router.get("/assignments", getAssignments);
router.post("/assignments", assignTeamMember);
router.delete("/assignments/:id", deleteAssignment);

router.put("/assignments/:id", updateAssignment);

export default router;
