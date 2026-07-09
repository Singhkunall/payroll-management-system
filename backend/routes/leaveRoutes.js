import express from 'express';
import { getPolicies, addPolicy, deletePolicy } from '../controllers/leaveController.js';
import { applyLeave, getAllLeaves, updateLeaveStatus } from '../controllers/leaveController.js';

const router = express.Router();

router.get('/policies', getPolicies);
router.post('/policies/add', addPolicy);
router.delete('/policies/:id', deletePolicy); 

router.post('/apply', applyLeave); // Employee apply karega
router.get('/all-requests', getAllLeaves); // Admin dekhega
router.put('/status/:id', updateLeaveStatus); // Admin action lega

export default router;
