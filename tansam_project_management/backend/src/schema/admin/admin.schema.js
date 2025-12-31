/**
 * Admin-related database schema
 * Includes roles table (created only by admin access)
 */

export const createAdminSchemas = async (db) => {
  // 🔐 ROLES TABLE
  await db.execute(`
    CREATE TABLE IF NOT EXISTS roles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) UNIQUE NOT NULL,
      status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
    )
  `);
};
