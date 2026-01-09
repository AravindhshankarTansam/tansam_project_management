
import express from "express";
import { createProject, getProjects,
  updateProject,
  deleteProject, } from "../controllers/project.controller.js";
  import { uploadPO } from "../middlewares/upload.middleware.js";

const router = express.Router();


/**
 * POST /api/projects
 */

router.get("/projects", getProjects);
router.post("/projects", uploadPO.single("poFile"), createProject);
router.put("/projects/:id", uploadPO.single("poFile"), updateProject);
router.delete("/projects/:id", deleteProject); 

export default router;
