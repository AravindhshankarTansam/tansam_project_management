export const createProjectSchemas = async (db) => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS projects (
      id INT AUTO_INCREMENT PRIMARY KEY,
      project_name VARCHAR(255) NOT NULL,
      client_name VARCHAR(255) NOT NULL,
      project_type VARCHAR(100) NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      status ENUM('Planned','In Progress','Completed','On Hold')
        DEFAULT 'Planned',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};