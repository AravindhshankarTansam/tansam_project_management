import { createAdminSchemas } from "./admin/admin.schema.js";
import { createCoordinatorSchemas } from "./coordinator/coordinator.schema.js";
import { createProjectSchemas } from "./project/project.schema.js";

/**
 * Main schema initializer
 * Called from controllers (role-based)
 */
export const initSchemas = async (db, options = {}) => {

  if (options.admin) {
    await createAdminSchemas(db);
  }

  if (options.coordinator) {
    await createCoordinatorSchemas(db);
  }
    if (options.project) {
    await createProjectSchemas(db);
  }

  // future extensions 👇
  // if (options.project) { ... }
  // if (options.reports) { ... }
};
