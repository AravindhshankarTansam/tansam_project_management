import { roleMiddleware } from "./admin.middleware.js";

export const quotationMiddleware = (req, res, next) => {
  // normalize role coming from login
  req.user.role = String(req.user.role).toUpperCase();

  // allow FINANCE role
  return roleMiddleware(["FINANCE"])(req, res, next);
};
