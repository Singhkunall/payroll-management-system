import express from 'express';
import { addDepartment, getDepartments, deleteDepartment } from '../controllers/departmentController.js';

const router = express.Router();

router.post('/add', addDepartment);
router.get('/', getDepartments);
router.delete('/:id', deleteDepartment);

export default router;