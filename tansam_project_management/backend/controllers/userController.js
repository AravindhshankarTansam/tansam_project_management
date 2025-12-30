import bcrypt from 'bcryptjs';
import { db } from '../utils/db.js';

export const getUsers = async (req, res) => {
  const [rows] = await db.execute('SELECT id, role, username, email, created_at, password FROM users ORDER BY created_at DESC');
  res.json(rows);
};

export const createUser = async (req, res) => {
  const { role, username, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const email = `${username.toLowerCase()}@tansam.com`;
    
    const [result] = await db.execute(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, role]
    );
    
    const [newUser] = await db.execute(
      'SELECT id, role, username, email, created_at FROM users WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(newUser[0]);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ msg: 'Username or email already exists' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};

export const updateUser = async (req, res) => {
  const { role } = req.body;
  await db.execute('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
  res.json({ msg: 'User updated' });
};

export const deleteUser = async (req, res) => {
  await db.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
  res.json({ msg: 'User deleted' });
};
