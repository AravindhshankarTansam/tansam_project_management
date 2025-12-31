import bcrypt from "bcrypt";
import { connectDB } from "../config/db.js";

export const login = async (req, res) => {
  try {
    // 👇 SAFETY CHECK
    if (!req.body) {
      return res.status(400).json({
        message: "Request body missing. Use application/json",
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const db = await connectDB();

    const [rows] = await db.execute(
      "SELECT id, email, username, password, role FROM users WHERE email = ? AND status = 'active'",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const roleRoutes = {
      ADMIN: "/admin",
      COORDINATOR: "/coordinator",
      TL: "/tl",
      FINANCE: "/finance",
      CEO: "/ceo",
    };

    res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      route: roleRoutes[user.role] || "/",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
