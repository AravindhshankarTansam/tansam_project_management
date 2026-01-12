  import express from "express";
  import {
    getMembers,
    createMember,
    updateMember,
    deleteMember,
  } from "../controllers/members.controller.js";

  const router = express.Router();

  router.get("/members", getMembers);
  router.post("/members", createMember);
  router.put("/members/:id", updateMember);

  router.delete("/members/:id", deleteMember);

  export default router;
