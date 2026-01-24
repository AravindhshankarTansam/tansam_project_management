export const createProjectSchemas = async (db) => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS projects (
      id INT AUTO_INCREMENT PRIMARY KEY,

      project_reference VARCHAR(100),

      project_name VARCHAR(255) NOT NULL,
      client_name VARCHAR(255) NOT NULL,

      project_type ENUM('INTERNAL','CUSTOMER','CUSTOMER_POC') NOT NULL,

      opportunity_id VARCHAR(50),

      /* ✅ NEW FIELDS */
      lab_id JSON,
      lab_name JSON,

      work_category_id INT,
      work_category_name VARCHAR(100),

      client_type_id INT,
      client_type_name VARCHAR(100),

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
