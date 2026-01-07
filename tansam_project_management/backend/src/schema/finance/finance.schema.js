CREATE TABLE quotation_followups (
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
);
