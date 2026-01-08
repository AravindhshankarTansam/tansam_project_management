// backend/src/schema/finance.schema.js

export const createFinanceSchemas = async (db) => {
  // 🔹 QUOTATIONS TABLE
  await db.execute(`
    CREATE TABLE IF NOT EXISTS quotations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      project_name VARCHAR(150) NOT NULL,
      quotationNo VARCHAR(50) NOT NULL,
      clientName VARCHAR(100) NOT NULL,
      clientType VARCHAR(50) NOT NULL,
      workCategory VARCHAR(100) NOT NULL,
      lab VARCHAR(100) NOT NULL,
      description TEXT,
      value DECIMAL(12,2),
      date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // 🔹 QUOTATION FOLLOW-UPS TABLE
  await db.execute(`
    CREATE TABLE IF NOT EXISTS quotation_followups (
      id INT AUTO_INCREMENT PRIMARY KEY,
      project_name VARCHAR(150) NOT NULL,
      clientResponse VARCHAR(50),
      lastFollowup DATE,
      revisedCost DECIMAL(10,2),
      nextFollowup DATE,
      remarks VARCHAR(255),
      status VARCHAR(50),
      poReceived ENUM('Yes','No') DEFAULT 'No',
      paymentPhase VARCHAR(50),
      paymentAmount DECIMAL(10,2),
      paymentReceived ENUM('Yes','No') DEFAULT 'No',
      reason VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
};
