// 💬 QUOTATION & FOLLOW-UPS SCHEMA (FINANCE)

export const createQuotationFollowupsSchema = async (db) => {
  try {
    /* ===============================
       QUOTATIONS TABLE
       =============================== */
    await db.execute(`
   CREATE TABLE IF NOT EXISTS quotations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  opportunity_id VARCHAR(20) NOT NULL,
  quotationNo VARCHAR(50) NOT NULL,
  clientName VARCHAR(100) NOT NULL,
  clientType VARCHAR(50) NOT NULL,
  workCategory VARCHAR(100) NOT NULL,
  lab VARCHAR(100) NOT NULL,
  description TEXT,
  value DECIMAL(12,2),
  date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_opportunity_id (opportunity_id),
  CONSTRAINT fk_quotations_opportunity
    FOREIGN KEY (opportunity_id)
    REFERENCES opportunities_coordinator(opportunity_id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT
) ENGINE=InnoDB;

    `);

    /* ===============================
       QUOTATION FOLLOW-UPS TABLE
       =============================== */
    await db.execute(`
      CREATE TABLE IF NOT EXISTS quotation_followups (
        id INT AUTO_INCREMENT PRIMARY KEY,

        opportunity_id VARCHAR(20) NOT NULL,   -- 🔑 FK

        clientResponse VARCHAR(50),
        lastFollowup DATE,
        revisedCost DECIMAL(10,2),
        nextFollowup DATE,
        remarks VARCHAR(255),
        status VARCHAR(50),
        poReceived ENUM('Yes','No'),
        reason VARCHAR(255),

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        INDEX idx_opportunity_id (opportunity_id),

        CONSTRAINT fk_followups_opportunity
          FOREIGN KEY (opportunity_id)
          REFERENCES opportunities_coordinator(opportunity_id)
          ON UPDATE CASCADE
          ON DELETE CASCADE
      )
    `);

    console.log("✅ Finance schemas created successfully");
  } catch (error) {
    console.error("❌ Error creating finance schemas:", error);
    throw error;
  }
};
