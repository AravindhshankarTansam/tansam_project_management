import { db } from '../utils/db.js';

export const getDepartments = async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM departments ORDER BY name');
  res.json(rows);
};

export const createDepartment = async (req, res) => {
  const { name, head } = req.body;
  const [result] = await db.execute(
    'INSERT INTO departments (name, head) VALUES (?, ?)',
    [name, head || null]
  );
  const [newDept] = await db.execute('SELECT * FROM departments WHERE id = ?', [result.insertId]);
  res.status(201).json(newDept[0]);
};

export const updateDepartment = async (req, res) => {
  const { name, head } = req.body;
  await db.execute(
    'UPDATE departments SET name = ?, head = ? WHERE id = ?',
    [name, head || null, req.params.id]
  );
  res.json({ msg: 'Department updated' });
};

export const deleteDepartment = async (req, res) => {
  await db.execute('DELETE FROM departments WHERE id = ?', [req.params.id]);
  res.json({ msg: 'Department deleted' });
};
