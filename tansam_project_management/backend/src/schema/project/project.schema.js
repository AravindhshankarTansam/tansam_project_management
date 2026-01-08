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

      po_status ENUM('Negotiated','Received') DEFAULT 'Negotiated',

      quotation_number VARCHAR(100),
      po_number VARCHAR(100),
      po_file VARCHAR(255),

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};
