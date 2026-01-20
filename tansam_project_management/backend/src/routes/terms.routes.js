import express from "express";
import bodyParser from "body-parser";
import {
  getTerms,
  addTerms,
  updateTerms,
  deleteTerms,
  getActiveTerms,
} from "../controllers/terms.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { quotationMiddleware } from "../middlewares/quotation.middleware.js";

const router = express.Router();


router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.use(authMiddleware, quotationMiddleware);

router.get("/", getTerms);
router.post("/", addTerms);
router.put("/:id", updateTerms);
router.delete("/:id", deleteTerms);
router.get("/active/latest", getActiveTerms);

export default router;
