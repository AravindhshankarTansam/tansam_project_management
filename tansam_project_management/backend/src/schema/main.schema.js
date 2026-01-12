import { createAdminSchemas } from "./admin/admin.schema.js";
import { createCoordinatorSchemas } from "./coordinator/coordinator.schema.js";
import { createProjectSchemas } from "./project/project.schema.js";

import { createAssignTeamSchema } from "./project/assignTeam/assignTeam.schema.js";
import { createDepartmentSchema } from "./project/department/department.schema.js";
import { createMemberSchema } from "./project/member/member.schema.js";
import { createFinanceSchemas } from "./finance/finance.schema.js";
import { createProjectTypeSchema } from "./project/projectType/projectType.schema.js";
import { createProjectFollowupSchema } from "./project/projectfollowup/projectFollowup.schema.js";


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
    console.log("Coordinator schemas initialized");
  }
    if (options.project) {
    await createProjectSchemas(db);
  }
  if (options.assignTeam) {
    await createAssignTeamSchema(db);
  }
  if (options.assignTeam) {
    await createAssignTeamSchema(db);
  }

  if (options.department) {
    await createDepartmentSchema(db);
  }
  if (options.member) {
  await createMemberSchema(db);
}

 if (options.finance) {
  await createFinanceSchemas(db);
}
  if (options.projectType) {
    await createProjectTypeSchema(db);
  }
   if (options.projectFollowup) {
    await createProjectFollowupSchema(db);
  }

 

  // future extensions 👇
  // if (options.project) { ... }
  // if (options.reports) { ... }
};
