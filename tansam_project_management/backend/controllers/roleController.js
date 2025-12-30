import { db } from '../utils/db.js';

export const getRoles = async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM roles ORDER BY name');
  res.json(rows);
};

export const createRole = async (req, res) => {
  const { name } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO roles (name, permissions) VALUES (?, ?)',
      [name, JSON.stringify(['view', 'edit'])]
    );
    const [newRole] = await db.execute('SELECT * FROM roles WHERE id = ?', [result.insertId]);
    res.status(201).json(newRole[0]);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ msg: 'Role name already exists' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};

export const updateRole = async (req, res) => {
  const { name } = req.body;
  await db.execute('UPDATE roles SET name = ? WHERE id = ?', [name, req.params.id]);
  res.json({ msg: 'Role updated' });
};

export const deleteRole = async (req, res) => {
  await db.execute('DELETE FROM roles WHERE id = ?', [req.params.id]);
  res.json({ msg: 'Role deleted' });
};
