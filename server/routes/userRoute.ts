import express from 'express';
import {
  getAllUsers,
  getUserByEmail,
  createOrLoginUser,
  updateUserWithWorkflow,
} from '../controllers/userController';

const router = express.Router();

// Public routes (for development)
router.get('/', getAllUsers);

// Protected routes
router.get('/:email', getUserByEmail);
router.post('/login', createOrLoginUser);
router.put('/:email', updateUserWithWorkflow);

export default router;