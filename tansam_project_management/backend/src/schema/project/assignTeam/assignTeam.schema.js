export const createAssignTeamSchema = async (db) => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS project_team_assignments (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

      project_id INT UNSIGNED NOT NULL,
      member_name VARCHAR(150) NOT NULL,
      role VARCHAR(100) NOT NULL,
      department_id INT UNSIGNED NOT NULL,

      start_date DATE NOT NULL,
      end_date DATE NOT NULL,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE,

      FOREIGN KEY (department_id)
        REFERENCES departments(id)
        ON DELETE CASCADE
    ) ENGINE=InnoDB
  `);
};
