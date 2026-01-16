// routes/generatedQuotation.routes.js
import express from "express";
import {
  getGeneratedQuotations,
  addGeneratedQuotation,
  getGeneratedQuotationById,
  updateGeneratedQuotation,
  deleteGeneratedQuotation,
} from "../controllers/generatedQuotation.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.use(authMiddleware);

router.get("/", getGeneratedQuotations);
router.get("/:id", getGeneratedQuotationById);
router.post("/", addGeneratedQuotation);
router.put("/:id", updateGeneratedQuotation);
router.delete("/:id", deleteGeneratedQuotation);

export default router;
