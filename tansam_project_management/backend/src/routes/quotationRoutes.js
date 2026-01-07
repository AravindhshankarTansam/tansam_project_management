import express from "express";
import {
  getQuotations,
  addQuotation,
  updateQuotation,
  deleteQuotation,
} from "../controllers/quotation.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { quotationMiddleware } from "../middlewares/quotation.middleware.js";

const router = express.Router();

router.use(authMiddleware, quotationMiddleware);

router.get("/", getQuotations);
router.post("/", addQuotation);
router.put("/:id", updateQuotation);
router.delete("/:id", deleteQuotation);

export default router;
