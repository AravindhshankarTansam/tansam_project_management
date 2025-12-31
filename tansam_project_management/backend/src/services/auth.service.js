const db = require("../config/db");
const bcrypt = require("bcrypt");

exports.validateUser = async (email, password) => {
  const [rows] = await db.query(`
    SELECT u.id, u.email, u.password, r.name as role
    FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE u.email = ?
  `, [email]);

  if (!rows.length) return null;

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password);

  return match ? user : null;
};
