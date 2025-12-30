import express from 'express';
import { login } from '../controllers/AuthController.js';
import { getUsers, createUser, updateUser, deleteUser } from '../controllers/userController.js';
import { getRoles, createRole, updateRole, deleteRole } from '../controllers/roleController.js';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '../controllers/deptController.js';

const router = express.Router();

// Auth
router.post('/api/auth/login', login);

// Users
router.get('/api/users', getUsers);
router.post('/api/users', createUser);
router.put('/api/users/:id', updateUser);
router.delete('/api/users/:id', deleteUser);

// Roles
router.get('/api/roles', getRoles);
router.post('/api/roles', createRole);
router.put('/api/roles/:id', updateRole);
router.delete('/api/roles/:id', deleteRole);

// Departments
router.get('/api/departments', getDepartments);
router.post('/api/departments', createDepartment);
router.put('/api/departments/:id', updateDepartment);
router.delete('/api/departments/:id', deleteDepartment);

export default router;
