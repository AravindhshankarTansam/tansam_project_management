// 💬 QUOTATION FOLLOW-UPS TABLE
export const createQuotationFollowupsSchema = async (db) => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS quotation_followups (
      id INT AUTO_INCREMENT PRIMARY KEY,
      clientResponse VARCHAR(50),
      lastFollowup DATE,
      revisedCost DECIMAL(10,2),
      nextFollowup DATE,
      remarks VARCHAR(255),
      status VARCHAR(50),
      poReceived ENUM('Yes','No'),
      reason VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
    await db.execute(`
    CREATE TABLE IF NOT EXISTS quotations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      quotationNo VARCHAR(50) NOT NULL,
      clientName VARCHAR(100) NOT NULL,
      clientType VARCHAR(50) NOT NULL,
      workCategory VARCHAR(100) NOT NULL,
      lab VARCHAR(100) NOT NULL,
      description TEXT DEFAULT NULL,
      value DECIMAL(12,2) DEFAULT NULL,
      date DATE DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
    )
  `);
};
