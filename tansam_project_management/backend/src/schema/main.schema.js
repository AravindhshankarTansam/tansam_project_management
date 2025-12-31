import { createAdminSchemas } from "./admin/admin.schema.js";

/**
 * Main schema initializer
 * Called from controllers (admin only)
 */
export const initSchemas = async (db, options = {}) => {
  if (options.admin) {
    await createAdminSchemas(db);
  }

  // future 👇
  // if (options.user) { ... }
  // if (options.project) { ... }
};
