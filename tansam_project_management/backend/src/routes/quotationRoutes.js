import express from "express";
import {
  getQuotations,
  addQuotation,
  updateQuotation,
  deleteQuotation,
  downloadQuotationDocx
} from "../controllers/quotation.controller.js";

const router = express.Router();

router.get("/", getQuotations);
router.post("/", addQuotation);
router.put("/:id", updateQuotation);
router.delete("/:id", deleteQuotation);

// ✅ Correct download route
router.get("/:id/docx", downloadQuotationDocx);

export default router;
