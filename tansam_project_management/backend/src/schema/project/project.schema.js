export const createProjectSchemas = async (db) => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS projects (
      id INT AUTO_INCREMENT PRIMARY KEY,

      project_reference VARCHAR(100), -- OPP_2026_001/prj-14

      project_name VARCHAR(255) NOT NULL,
      client_name VARCHAR(255) NOT NULL,

      project_type ENUM('INTERNAL','CUSTOMER','CUSTOMER_POC') NOT NULL,

      opportunity_id VARCHAR(50), -- OPP_2026_001 (ONLY FOR POC)

      start_date DATE NOT NULL,
      end_date DATE NOT NULL,

      status ENUM('Planned','In Progress','Completed','On Hold')
        DEFAULT 'Planned',

      quotation_number VARCHAR(100),
      po_number VARCHAR(100),
      po_file VARCHAR(255),

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};
