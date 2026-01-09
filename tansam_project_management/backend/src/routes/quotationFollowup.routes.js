import express from "express";
import {
  getFollowups,
  addFollowup,
  updateFollowup,
  deleteFollowup,
} from "../controllers/quotationFollowup.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { quotationMiddleware } from "../middlewares/quotation.middleware.js";
const router = express.Router();
router.use(authMiddleware, quotationMiddleware);
router.get("/", getFollowups);
router.post("/", addFollowup);
router.put("/:id", updateFollowup);
router.delete("/:id", deleteFollowup);

export default router;
