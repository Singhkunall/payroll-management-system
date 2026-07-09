import express from 'express';
import { addDesignation, getDesignations, deleteDesignation } from '../controllers/designationController.js';

const router = express.Router();

router.post('/add', addDesignation);
router.get('/', getDesignations);
router.delete('/:id', deleteDesignation);

export default router;