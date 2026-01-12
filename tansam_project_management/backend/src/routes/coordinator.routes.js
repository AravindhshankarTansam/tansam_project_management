import express from "express";
import {
  createOpportunity,
  getOpportunities,
  updateOpportunity,
  deleteOpportunity,
  createOpportunityTracker,
  getOpportunityTrackers,
  updateOpportunityTracker,
  deleteOpportunityTracker,
} from "../controllers/coordinator.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { coordinatorMiddleware } from "../middlewares/coordinator.middleware.js";

const router = express.Router();

// ===================================
// COORDINATOR – OPPORTUNITY ROUTES
// ===================================

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

// ===================================
// COORDINATOR – OPPORTUNITY TRACKER ROUTES
// ===================================

router.get(
  "/opportunity-tracker",
  authMiddleware,
  coordinatorMiddleware,
  getOpportunityTrackers
);

router.post(
  "/opportunity-tracker",
  authMiddleware,
  coordinatorMiddleware,
  createOpportunityTracker
);

router.put(
  "/opportunity-tracker/:id",
  authMiddleware,
  coordinatorMiddleware,
  updateOpportunityTracker
);

router.delete(
  "/opportunity-tracker/:id",
  authMiddleware,
  coordinatorMiddleware,
  deleteOpportunityTracker
);

export default router;
