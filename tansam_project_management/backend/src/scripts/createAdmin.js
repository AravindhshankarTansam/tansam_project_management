import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
import { ensureDatabaseExists, connectDB } from "../config/db.js";

const createAdmin = async () => {
  try {
    console.log("🚀 Creating ADMIN user...");

    await ensureDatabaseExists();
    const db = await connectDB();

    const {
      ADMIN_EMAIL,
      ADMIN_USERNAME,
      ADMIN_PASSWORD,
      ADMIN_FULLNAME,
      ADMIN_MOBILE,
    } = process.env;

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_USERNAME) {
      console.error("❌ Missing ADMIN env variables");
      process.exit(1);
    }

    // Ensure users table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        username VARCHAR(100) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check existing admin
    const [rows] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [ADMIN_EMAIL]
    );

    if (rows.length) {
      console.log("✅ ADMIN already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    await db.execute(
      `INSERT INTO users (email, username, password, role, status)
       VALUES (?, ?, ?, 'ADMIN', 'active')`,
      [
        ADMIN_EMAIL,
        ADMIN_USERNAME,
        hashedPassword,
      ]
    );

    console.log("🎉 ADMIN created successfully");
    process.exit(0);

  } catch (err) {
    console.error("❌ ADMIN creation failed:", err);
    process.exit(1);
  }
    
};

createAdmin();
