import express from "express";
import {
  getQuotations,
  addQuotation,
  updateQuotation,
  deleteQuotation,
} from "../controllers/quotation.controller.js";

const router = express.Router();

router.get("/", getQuotations);
router.post("/", addQuotation);
router.put("/:id", updateQuotation);
router.delete("/:id", deleteQuotation);

export default router;
