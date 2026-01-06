export const createCoordinatorSchemas = async (db) => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS opportunities_coordinator (
      id INT AUTO_INCREMENT PRIMARY KEY,

      opportunity_id VARCHAR(20) UNIQUE NOT NULL,

      opportunity_name VARCHAR(150) NOT NULL,
      customer_name VARCHAR(150) NOT NULL,
      company_name VARCHAR(150),
      contact_person VARCHAR(100),
      contact_email VARCHAR(100),
      contact_phone VARCHAR(20),

      lead_source ENUM('WEBSITE','REFERRAL','CALL','EMAIL'),
      lead_description LONGTEXT,
      lead_status ENUM('NEW','EXISTING') DEFAULT 'NEW',

      created_by INT NOT NULL COMMENT 'coordinator user id',

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

      INDEX idx_opportunity_id (opportunity_id)
    )
  `);
};
