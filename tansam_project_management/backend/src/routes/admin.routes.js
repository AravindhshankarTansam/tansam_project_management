import express from "express";
import {
  getRoles,
  createRole,
  updateRole,
  getLabs,
  createLab,
  updateLab,
  getProjectTypes,
  createProjectType,
  updateProjectType,
  getWorkCategories,
  createWorkCategory,
  updateWorkCategory,
} from "../controllers/admin.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/admin.middleware.js";

const router = express.Router();

// ADMIN ONLY
router.get("/roles", authMiddleware, roleMiddleware(["ADMIN"]), getRoles);
router.post("/roles", authMiddleware, roleMiddleware(["ADMIN"]), createRole);
router.put("/roles/:id", authMiddleware, roleMiddleware(["ADMIN"]), updateRole);

// LABS (ADMIN)
router.get("/labs", authMiddleware, roleMiddleware(["ADMIN"]), getLabs);
router.post("/labs", authMiddleware, roleMiddleware(["ADMIN"]), createLab);
router.put("/labs/:id", authMiddleware, roleMiddleware(["ADMIN"]), updateLab);

// PROJECT TYPES (ADMIN)
router.get("/project-types", authMiddleware, roleMiddleware(["ADMIN"]), getProjectTypes);
router.post("/project-types", authMiddleware, roleMiddleware(["ADMIN"]), createProjectType);
router.put("/project-types/:id", authMiddleware, roleMiddleware(["ADMIN"]), updateProjectType);

// WORK CATEGORIES (ADMIN)
router.get("/work-categories", authMiddleware, roleMiddleware(["ADMIN"]), getWorkCategories);
router.post("/work-categories", authMiddleware, roleMiddleware(["ADMIN"]), createWorkCategory);
router.put("/work-categories/:id", authMiddleware, roleMiddleware(["ADMIN"]), updateWorkCategory);


export default router;