// schema/main.schema.js (or separate schema file)

export const createQuotationFollowupsSchema = async (db) => {
  // 💬 QUOTATION FOLLOW-UPS TABLE
  await db.execute(`
    CREATE TABLE IF NOT EXISTS quotation_followups (
      id INT AUTO_INCREMENT PRIMARY KEY,
      project_name VARCHAR(50),
      quoteValue DECIMAL(10,2),
      revisedCost DECIMAL(10,2),
      status VARCHAR(50),
      poReceived ENUM('Yes','No'),
      paymentPhase VARCHAR(255),
      paymentAmount VARCHAR(255),
      paymentReceived VARCHAR(255),
      reason VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 💬 QUOTATIONS TABLE
  await db.execute(`
    CREATE TABLE IF NOT EXISTS quotations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      project_name VARCHAR(50),
      quotationNo VARCHAR(50) NOT NULL,
      clientName VARCHAR(100) NOT NULL,
      clientType VARCHAR(50) NOT NULL,
      workCategory VARCHAR(100) NOT NULL,
      lab VARCHAR(100) NOT NULL,
      description TEXT DEFAULT NULL,
      value DECIMAL(12,2) DEFAULT NULL,
      date DATE DEFAULT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      isGenerated TINYINT(1) DEFAULT 0
    )
  `);

  // 💬 TERMS & CONDITIONS TABLE
  await db.execute(`
    CREATE TABLE IF NOT EXISTS terms_conditions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      content LONGTEXT NOT NULL,
      status ENUM('Active','In-Active') DEFAULT 'In-Active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // 💬 GENERATED QUOTATIONS TABLE
  await db.execute(`
    CREATE TABLE IF NOT EXISTS generated_quotations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      refNo VARCHAR(50),
      date DATE,
      clientName VARCHAR(100),
      kindAttn VARCHAR(100),
      subject VARCHAR(255),
      items LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin CHECK (JSON_VALID(items)),
      terms LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin CHECK (JSON_VALID(terms)),
      signature VARCHAR(255),
      seal VARCHAR(255),
      financeManagerName VARCHAR(100),
      isGenerated TINYINT(1),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      termsContent LONGTEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      quotationId INT,
      FOREIGN KEY (quotationId) REFERENCES quotations(id)
    )
  `);
};