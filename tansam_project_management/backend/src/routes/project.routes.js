
import express from "express";
import { createProject, getProjects,
  updateProject,
  deleteProject, } from "../controllers/project.controller.js";

const router = express.Router();

/**
 * POST /api/projects
 */

router.get("/projects", getProjects);
router.post("/projects", createProject);
router.put("/projects/:id", updateProject);   // ✅ EDIT
router.delete("/projects/:id", deleteProject); 

export default router;
