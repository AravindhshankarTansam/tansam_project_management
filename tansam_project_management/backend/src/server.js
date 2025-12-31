import dotenv from "dotenv";
dotenv.config(); // 🔥 MUST be first

import app from "./app.js";
import { ensureDatabaseExists, connectDB } from "./config/db.js";

const PORT = process.env.PORT;

const startServer = async () => {
  try {
    // 🔍 TEMP DEBUG (remove later)
    console.log("DB_HOST:", process.env.DB_HOST);
    console.log("DB_USER:", process.env.DB_USER);
    console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "YES" : "NO");

    await ensureDatabaseExists();
    const db = await connectDB();
    app.set("db", db);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server startup failed:", err);
    process.exit(1);
  }
};

startServer();
