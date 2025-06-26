const express = require('express');
const {
  getAllUsers,
  getUserByEmail,
  createOrLoginUser,
  updateUserWithWorkflow,
} = require('../controllers/userController');
 

const router = express.Router();

// Public routes (for development)
router.get('/', getAllUsers);

// Protected routes
router.get('/:email',  getUserByEmail);
router.post('/login',  createOrLoginUser);
router.put('/:email',  updateUserWithWorkflow);

module.exports = router;