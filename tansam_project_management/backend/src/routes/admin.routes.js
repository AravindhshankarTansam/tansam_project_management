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
  getUsers,
  createUser,
  updateUser,
  getClientTypes,
  createClientType,
  updateClientType
} from "../controllers/admin.controller.js";
import {getOpportunities,} from "../controllers/coordinator.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/admin.middleware.js";

const router = express.Router();

// ADMIN ONLY
router.get("/roles", authMiddleware, roleMiddleware(["ADMIN","COORDINATOR"]), getRoles);
router.post("/roles", authMiddleware, roleMiddleware(["ADMIN"]), createRole);
router.put("/roles/:id", authMiddleware, roleMiddleware(["ADMIN"]), updateRole);

// LABS (ADMIN)
router.get("/labs", authMiddleware, roleMiddleware(["ADMIN", "FINANCE"]), getLabs);
router.post("/labs", authMiddleware, roleMiddleware(["ADMIN"]), createLab);
router.put("/labs/:id", authMiddleware, roleMiddleware(["ADMIN"]), updateLab);

// PROJECT TYPES (ADMIN)
router.get(
  "/project-types",
  authMiddleware,
  roleMiddleware(["ADMIN", "TEAM LEAD"]),
  getProjectTypes
);

router.post("/project-types", authMiddleware, roleMiddleware(["ADMIN"]), createProjectType);
router.put("/project-types/:id", authMiddleware, roleMiddleware(["ADMIN"]), updateProjectType);

// CLIENT TYPES (ADMIN)
router.get(
  "/client-types",
  authMiddleware,
  roleMiddleware(["ADMIN", "TEAM LEAD"]),
  getClientTypes
);

router.post(
  "/client-types",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  createClientType
);

router.put(
  "/client-types/:id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  updateClientType
);


// WORK CATEGORIES (ADMIN)
router.get("/work-categories", authMiddleware, roleMiddleware(["ADMIN","TEAM LEAD","FINANCE"]), getWorkCategories);
router.post("/work-categories", authMiddleware, roleMiddleware(["ADMIN"]), createWorkCategory);
router.put("/work-categories/:id", authMiddleware, roleMiddleware(["ADMIN"]), updateWorkCategory);

// 👤 USERS (ADMIN)
router.get("/users", authMiddleware, roleMiddleware(["ADMIN","COORDINATOR"]), getUsers);
router.post("/users", authMiddleware, roleMiddleware(["ADMIN"]), createUser);
router.put("/users/:id", authMiddleware, roleMiddleware(["ADMIN"]), updateUser);

// COORDINATOR – OPPORTUNITY ROUTES (ADMIN)
router.get(
  "/opportunities",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  getOpportunities
);


export default router;