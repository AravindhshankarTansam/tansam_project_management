import express from "express";
import {
  getDepartments,
  createDepartment,
  deleteDepartment,
} from "../controllers/department.controller.js";

const router = express.Router();

router.get("/departments", getDepartments);
router.post("/departments", createDepartment);
router.delete("/departments/:id", deleteDepartment);

export default router;
