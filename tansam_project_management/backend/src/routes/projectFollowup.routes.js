import express from "express";
import {
  getProjectFollowups,
  createProjectFollowup,
  updateProjectFollowup,
} from "../controllers/projectFollowup.controller.js";

const router = express.Router();

router.get("/project-followups", getProjectFollowups);
router.post("/project-followups", createProjectFollowup);
router.put("/project-followups/:projectId", updateProjectFollowup);

export default router;
