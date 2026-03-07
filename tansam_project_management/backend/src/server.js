import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { ensureDatabaseExists, connectDB } from "./config/db.js";
import { initSchemas } from "./schema/main.schema.js"; 

const PORT = process.env.PORT;

const startServer = async () => {
  try {
    console.log("DB_HOST:", process.env.DB_HOST);
    console.log("DB_USER:", process.env.DB_USER);
    console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "YES" : "NO");

    await ensureDatabaseExists();
    const db = await connectDB();

    // CREATE ALL TABLES HERE
    await initSchemas(db, {
      admin: true,
      coordinator: true,
      project: true,
      assignTeam: true,
      department: true,
      member: true,
      finance: true,
      projectType: true,
      projectFollowup: true,
      createCeoForecastSchema: true
    });

    app.set("db", db);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("Server startup failed:", err);
    process.exit(1);
  }
};

startServer();
