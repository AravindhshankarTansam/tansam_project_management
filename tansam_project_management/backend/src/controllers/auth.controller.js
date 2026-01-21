import bcrypt from "bcrypt";
import { connectDB } from "../config/db.js";

export const login = async (req, res) => {
  try {
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
    let user = null;

    // 🔹 1. Check ADMIN table
    const [adminRows] = await db.execute(
      `SELECT id, email, username, password, role
       FROM users
       WHERE email = ? AND status = 'active'`,
      [email]
    );

    if (adminRows.length > 0) {
      user = adminRows[0];
    }

    // 🔹 2. Check NON-ADMIN table
    if (!user) {
      const [otherRows] = await db.execute(
        `SELECT id, email, name AS username, password, role
         FROM users_admin
         WHERE email = ? AND status = 'active'`,
        [email]
      );

      if (otherRows.length > 0) {
        user = otherRows[0];
      }
    }

    // 🔴 User not found in any table
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 🔐 Password check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 🔁 Role-based routing
    const roleRoutes = {
      ADMIN: "/admin",
      COORDINATOR: "/coordinator",
      "TEAM LEAD": "/tl", 
      FINANCE: "/finance",
      CEO: "/ceo",
      MD: "/ceo",
    };

    return res.json({
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
