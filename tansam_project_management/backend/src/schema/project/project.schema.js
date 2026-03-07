export const createProjectSchemas = async (db) => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS projects (
      id INT AUTO_INCREMENT PRIMARY KEY,

      project_reference VARCHAR(100),

      project_name VARCHAR(255) NOT NULL,
      client_name VARCHAR(255) NOT NULL,

      project_type ENUM('INTERNAL','CUSTOMER','CUSTOMER_POC') NOT NULL,

      opportunity_id VARCHAR(50),

      /* ← changed back to JSON as you requested */
      lab_id JSON NULL,
      lab_name JSON NULL,

      work_category_id INT,
      work_category_name VARCHAR(100),

      client_type_id INT,
      client_type_name VARCHAR(100),

      /* Keeping VARCHAR for flexible date format like '2025-04' */
      start_date VARCHAR(10) NULL,       -- e.g. '2025-04' or '2025-04-15'
      end_date   VARCHAR(10) NULL,       -- e.g. '2025-12' or '2026-03-01'

      status VARCHAR(50) NULL DEFAULT 'Planned',

      quotation_number VARCHAR(100),
      po_number VARCHAR(100),
      po_file VARCHAR(255),
      created_by INT NULL,

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};