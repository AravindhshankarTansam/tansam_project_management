export const createProjectTypeSchema = async (db) => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS project_types (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
      created_by INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};
