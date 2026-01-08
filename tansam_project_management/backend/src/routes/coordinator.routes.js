import express from "express";
import {
  createOpportunity,
  getOpportunities,
  updateOpportunity,
  deleteOpportunity,
} from "../controllers/coordinator.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { coordinatorMiddleware } from "../middlewares/coordinator.middleware.js";

const router = express.Router();

// ===============================
// COORDINATOR – OPPORTUNITY ROUTES
// ===============================

router.get(
  "/opportunities",
  authMiddleware,
  coordinatorMiddleware,
  getOpportunities
);

router.post(
  "/opportunities",
  authMiddleware,
  coordinatorMiddleware,
  createOpportunity
);

router.put(
  "/opportunities/:opportunity_id",
  authMiddleware,
  coordinatorMiddleware,
  updateOpportunity
);

router.delete(
  "/opportunities/:opportunity_id",
  authMiddleware,
  coordinatorMiddleware,
  deleteOpportunity
);

export default router;
