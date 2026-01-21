// projectfollowup.schema.js

export const createProjectFollowupSchema = async (db) => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS project_followups (
      id INT AUTO_INCREMENT PRIMARY KEY,

      project_id INT NOT NULL UNIQUE,

      progress INT DEFAULT 0,
      next_milestone VARCHAR(255),
      milestone_due_date DATE,

      issue_description TEXT,   -- ✅ TEXT description instead of number

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

      CONSTRAINT fk_followup_project
        FOREIGN KEY (project_id)
        REFERENCES projects(id)
        ON DELETE CASCADE
    )
  `);
};
