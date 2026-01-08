import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import projectRoutes from "./routes/project.routes.js";
import assignTeamRoutes from "./routes/assignTeam.routes.js";
import departmentRoutes from "./routes/department.routes.js";
import membersRoutes from "./routes/members.routes.js";
import projectTypeRoutes from "./routes/projectType.routes.js";


const app = express();

/**
 * CORS configuration
 * Frontend: Vite (http://localhost:5173)
 */
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
        "Content-Type",
        "x-user-id",
        "x-user-role",
        ],
    credentials: true, // safe even if not using cookies yet
    
  })
);

// Parse JSON request body
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", projectRoutes);
app.use("/api", assignTeamRoutes);
app.use("/api", departmentRoutes);
app.use("/api", membersRoutes);
app.use("/api", projectTypeRoutes);



export default app;