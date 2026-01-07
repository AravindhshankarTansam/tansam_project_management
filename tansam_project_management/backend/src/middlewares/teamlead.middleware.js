import { roleMiddleware } from "./admin.middleware.js";

/**
 * Team Lead only access
 */
export const teamLeadMiddleware = roleMiddleware(["TEAM LEAD"]);
