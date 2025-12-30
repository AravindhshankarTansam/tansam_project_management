import bcrypt from "bcryptjs";
import mysql from "mysql2/promise";

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const conn = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "tansam_project",
    });

    const [users] = await conn.execute(
      "SELECT id, username, email, password, role FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      await conn.end();
      return res.json({ success: false, msg: "Invalid credentials" });
    }

    const user = users[0];
    const match = await bcrypt.compare(password, user.password);

    await conn.end();

    if (!match) {
      return res.json({ success: false, msg: "Invalid credentials" });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};
