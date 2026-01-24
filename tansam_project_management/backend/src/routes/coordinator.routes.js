import express from "express";
import {
  createOpportunity,
  getOpportunities,
  updateOpportunity,
  deleteOpportunity,
  checkSimilarClient,
  createOpportunityTracker,
  getOpportunityTrackers,
  updateOpportunityTracker,
  deleteOpportunityTracker,
} from "../controllers/coordinator.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { coordinatorMiddleware } from "../middlewares/coordinator.middleware.js";
import { roleMiddleware } from "../middlewares/admin.middleware.js";

const router = express.Router();

// ===================================
// COORDINATOR – OPPORTUNITY ROUTES
// ===================================

// router.get(
//   "/opportunities",
//   authMiddleware,
//   coordinatorMiddleware,
//   getOpportunities
// );
router.get(
  "/opportunities",
  authMiddleware,
  roleMiddleware(["COORDINATOR", "TEAM LEAD", "FINANCE","CEO"]),
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

// routes/coordinator.routes.js
router.get(
  "/clients/check",
  authMiddleware,
  roleMiddleware(["COORDINATOR", "TEAM LEAD", "FINANCE"]),
  checkSimilarClient
);

// ===================================
// COORDINATOR – OPPORTUNITY TRACKER ROUTES
// ===================================

router.get(
  "/opportunity-tracker",
  authMiddleware,
  roleMiddleware(["COORDINATOR", "TEAM LEAD", "ADMIN"]),
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
