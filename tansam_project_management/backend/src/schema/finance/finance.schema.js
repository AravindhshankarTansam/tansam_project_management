// 💬 QUOTATION FOLLOW-UPS TABLE
export const createQuotationFollowupsSchema = async (db) => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS quotation_followups (
      id INT AUTO_INCREMENT PRIMARY KEY,
      project_name VARCHAR(50),
      clientResponse VARCHAR(50),
      lastFollowup DATE,
      revisedCost DECIMAL(10,2),
      nextFollowup DATE,
      remarks VARCHAR(255),
      status VARCHAR(50),
      poReceived ENUM('Yes','No'),
      paymentPhase VARCHAR(255),
       paymentAmount VARCHAR(255),
        paymentReceived VARCHAR(255),
      reason VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
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
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  // 💬 TERMS & CONDITIONS TABLE

  await db.execute(`
    CREATE TABLE IF NOT EXISTS terms_conditions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      content LONGTEXT NOT NULL,
      status ENUM('Active','In-Active') DEFAULT 'In-Active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
    )
  `);

// schema/main.schema.js (or separate schema file)

  await db.execute(`
    CREATE TABLE IF NOT EXISTS generated_quotations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      refNo VARCHAR(50),
      date DATE,
      clientName VARCHAR(100),
      kindAttn VARCHAR(100),
      subject VARCHAR(255),
      items JSON,
      terms JSON,
      signature VARCHAR(255),
      seal VARCHAR(255),
      financeManagerName VARCHAR(100),
      isGenerated TINYINT(1),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);


};
