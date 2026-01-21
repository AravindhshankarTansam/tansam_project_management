import express from "express";
import {
  getGeneratedQuotations,
  addGeneratedQuotation,
  getGeneratedQuotationByQuotationId,
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


router.put("/:id", updateGeneratedQuotation);
router.delete("/:id", deleteGeneratedQuotation);
router.get("/by-quotation/:quotationId", getGeneratedQuotationByQuotationId );

export default router;
