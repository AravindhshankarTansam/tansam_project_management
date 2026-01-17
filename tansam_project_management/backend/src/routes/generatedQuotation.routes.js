import express from "express";
import {
  getGeneratedQuotations,
  addGeneratedQuotation,
  getGeneratedQuotationById,
  updateGeneratedQuotation,
  deleteGeneratedQuotation,
} from "../controllers/generatedQuotation.controller.js";

import { uploadPO } from "../middlewares/upload_image.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { quotationMiddleware } from "../middlewares/quotation.middleware.js";

const router = express.Router();

router.use(authMiddleware, quotationMiddleware);

router.get("/", getGeneratedQuotations);

// ✅ THIS IS MANDATORY
router.post(
  "/",
  uploadPO.fields([
    { name: "signature", maxCount: 1 },
    { name: "seal", maxCount: 1 },
  ]),
  addGeneratedQuotation
);

router.get("/:id", getGeneratedQuotationById);
router.put("/:id", updateGeneratedQuotation);
router.delete("/:id", deleteGeneratedQuotation);

export default router;
