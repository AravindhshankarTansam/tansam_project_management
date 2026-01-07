import express from "express";
import {
  getProjectTypes,
  createProjectType,
  updateProjectType,
  deleteProjectType,
} from "../controllers/projectType.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { teamLeadMiddleware } from "../middlewares/teamlead.middleware.js";

const router = express.Router();

/**
 * TEAM LEAD – Project Types
 */
router.get(
  "/project-types",
  authMiddleware,
  teamLeadMiddleware,
  getProjectTypes
);

router.post(
  "/project-types",
  authMiddleware,
  teamLeadMiddleware,
  createProjectType
);

router.put(
  "/project-types/:id",
  authMiddleware,
  teamLeadMiddleware,
  updateProjectType
);

router.delete(
  "/project-types/:id",
  authMiddleware,
  teamLeadMiddleware,
  deleteProjectType
);

export default router;
