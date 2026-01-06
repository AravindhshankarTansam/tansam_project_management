import { roleMiddleware } from "./admin.middleware.js";

/**
 * Coordinator-only access middleware
 */
export const coordinatorMiddleware = roleMiddleware(["COORDINATOR"]);
