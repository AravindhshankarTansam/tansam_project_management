export const createCeoForecastSchema = async (db) => {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS ceo_forecast (
      id INT AUTO_INCREMENT PRIMARY KEY,

      /* Work Category */
      work_category_id INT NOT NULL,
      work_category_name VARCHAR(100) NOT NULL,

      /* Client */
      client_name VARCHAR(255) NOT NULL,

      /* Values */
      total_value DECIMAL(15,2) NOT NULL,
      confidence INT NOT NULL COMMENT '0, 30, 75, 100',
      realizable_value DECIMAL(15,2) NOT NULL,
      carryover DECIMAL(15,2) NOT NULL,

      /* Financial Year */
      fy VARCHAR(20) NOT NULL COMMENT '2025-26, 2026-27 etc',

      /* Remarks */
      remarks TEXT,

      /* Audit */
      created_by INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

      /* Indexes */
      INDEX idx_work_category (work_category_id),
      INDEX idx_client_name (client_name),
      INDEX idx_fy (fy),

      /* Foreign Keys */
      CONSTRAINT fk_ceo_forecast_work_category
        FOREIGN KEY (work_category_id)
        REFERENCES work_categories(id)
        ON DELETE RESTRICT,

      CONSTRAINT fk_ceo_forecast_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE RESTRICT
    )
  `);
};
