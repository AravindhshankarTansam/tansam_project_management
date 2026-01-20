import express from "express";
import {
  getQuotations,
  addQuotation,
  updateQuotation,
  deleteQuotation,
  downloadQuotationDocx,
} from "../controllers/quotation.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/admin.middleware.js";

const router = express.Router();

// Only apply authMiddleware globally (authentication only)
router.use(authMiddleware);

// GET quotations - Allow FINANCE + TEAM LEAD + COORDINATOR (if needed)
router.get(
  "/",
  roleMiddleware(["FINANCE", "TEAM LEAD", "COORDINATOR","CEO"]), // ← TEAM LEAD now allowed
  getQuotations
);

// Restrict write/delete/download to FINANCE only
router.post(
  "/",
  roleMiddleware(["FINANCE"]),
  addQuotation
);

router.put(
  "/:id",
  roleMiddleware(["FINANCE"]),
  updateQuotation
);

router.delete(
  "/:id",
  roleMiddleware(["FINANCE"]),
  deleteQuotation
);

router.get(
  "/:id/docx",
  roleMiddleware(["FINANCE"]),
  downloadQuotationDocx
);

export default router;