import { createAdminSchemas } from "./admin/admin.schema.js";
import { createCoordinatorSchemas } from "./coordinator/coordinator.schema.js";
import { createProjectSchemas } from "./project/project.schema.js";

import { createAssignTeamSchema } from "./project/assignTeam/assignTeam.schema.js";
import { createDepartmentSchema } from "./project/department/department.schema.js";
import { createMemberSchema } from "./project/member/member.schema.js";
import { createQuotationFollowupsSchema } from "./finance/finance.schema.js";
import { createProjectTypeSchema } from "./project/projectType/projectType.schema.js";
import { createProjectFollowupSchema } from "./project/projectfollowup/projectFollowup.schema.js";
import { createCeoForecastSchema } from "./Ceo/Ceoforecast.schema.js";


/**
 * Main schema initializer
 * Called from controllers (role-based)
 */
export const initSchemas = async (db, options = {}) => {

  // ===== BASE TABLES FIRST (no FKs) =====
  if (options.admin) {
    await createAdminSchemas(db);
  }

  if (options.coordinator) {
    await createCoordinatorSchemas(db);
  }

  if (options.project) {
    await createProjectSchemas(db);      // parent
  }

  if (options.department) {
    await createDepartmentSchema(db);    // parent
  }

  if (options.member) {
    await createMemberSchema(db);        // parent
  }

  if (options.projectType) {
    await createProjectTypeSchema(db);
  }

  if (options.finance) {
    await createQuotationFollowupsSchema(db);
  }

  if (options.projectFollowup) {
    await createProjectFollowupSchema(db);
  }

  if (options.createCeoForecastSchema) {
    await createCeoForecastSchema(db);
  }

  // ===== CHILD TABLES LAST (has FKs) =====
  if (options.assignTeam) {
    await createAssignTeamSchema(db);    // MUST BE LAST
  }
};
