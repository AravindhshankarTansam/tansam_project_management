export const createCoordinatorSchemas = async (db) => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS opportunities_coordinator (
      id INT AUTO_INCREMENT PRIMARY KEY,

      opportunity_id VARCHAR(20) NOT NULL UNIQUE,

      opportunity_name VARCHAR(150) NOT NULL,

      client_id VARCHAR(20) NOT NULL,
      client_name VARCHAR(150) NOT NULL,

      contact_person VARCHAR(100),
      contact_email VARCHAR(100),
      contact_phone VARCHAR(20),

      lead_source ENUM('WEBSITE','REFERRAL','CALL','EMAIL'),
      lead_description LONGTEXT,
      lead_status ENUM('NEW','EXISTING') DEFAULT 'NEW',

      assigned_to VARCHAR(255),

      created_by INT NOT NULL COMMENT 'coordinator user id',
      created_by_name VARCHAR(100) COMMENT 'creator name',
      created_by_role VARCHAR(50) COMMENT 'creator role',

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

      INDEX idx_opportunity_id (opportunity_id),
      INDEX idx_client_id (client_id),
      INDEX idx_created_by (created_by)
    )
  `);

    await db.execute(`
    CREATE TABLE IF NOT EXISTS opportunity_tracker (
      id INT AUTO_INCREMENT PRIMARY KEY,

      opportunity_id VARCHAR(20) NOT NULL,
      opportunity_name VARCHAR(150) NOT NULL,

      client_id VARCHAR(20) NOT NULL,
      client_name VARCHAR(150) NOT NULL,

      assigned_to VARCHAR(255),

      stage ENUM(
        'NEW',
        'CONTACTED',
        'QUALIFIED',
        'PROPOSAL_SENT',
        'NEGOTIATION',
        'WON',
        'LOST'
      ) DEFAULT 'NEW',

      next_followup_date DATE,
      next_action TEXT,
      remarks TEXT,

      created_by INT NOT NULL,
      created_by_name VARCHAR(100),
      created_by_role VARCHAR(50),

      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

      INDEX idx_opportunity_id (opportunity_id),
      INDEX idx_client_id (client_id),
      INDEX idx_created_by (created_by)
    );
  `);
};
