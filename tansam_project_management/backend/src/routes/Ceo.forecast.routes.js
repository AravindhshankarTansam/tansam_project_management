import express from "express";
import {
  getForecasts,
  createForecast,
  updateForecast,
  deleteForecast,
} from "../controllers/Ceo.forecast.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/admin.middleware.js";

const router = express.Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN", "CEO","COORDINATOR"]),
  getForecasts
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN", "CEO","COORDINATOR"]),
  createForecast
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN", "CEO","COORDINATOR"]),
  updateForecast
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["ADMIN", "CEO","COORDINATOR"]),
  deleteForecast
);

export default router;
