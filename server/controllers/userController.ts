import { Request, Response } from 'express';
import User from '../models/User';
import { Connection, Client } from '@temporalio/client';
import axios from 'axios';

interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  city?: string;
  pincode?: string;
}

// Get all users (for development)
const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-__v');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user by email
const getUserByEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email }).select('-__v');
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create or login user
const createOrLoginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, firstName, lastName } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    
    if (user) {
      // User exists, return existing user
      res.json({ message: 'User logged in successfully', user });
      return;
    }
    
    // Create new user
    user = new User({
      email,
      firstName,
      lastName,
    });
    
    await user.save();
    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('Error creating/logging in user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user with Temporal workflow - waiting for completion
const updateUserWithWorkflow = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.params;
    const updateData = req.body;
    
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    console.log('Connecting to Temporal...');
    
    // Connect to Temporal
    const connection = await Connection.connect({
      address: '127.0.0.1:7233',
      tls: undefined,
      connectionOptions: {
        connectTimeout: 15000,
      }
    });
    
    console.log('Connected to Temporal server');
    
    const client = new Client({
      connection,
    });
    
    // Prepare workflow data
    const workflowId = `save-user-data-${email}-${Date.now()}`;
    const userData: UserData = { 
      email: user.email,
      firstName: updateData.firstName || user.firstName,
      lastName: updateData.lastName || user.lastName,
      phoneNumber: updateData.phoneNumber || user.phoneNumber || '',
      city: updateData.city || user.city || '',
      pincode: updateData.pincode || user.pincode || ''
    };
    
    console.log('Starting and WAITING for workflow completion with ID:', workflowId);
    
    // Execute the workflow and wait for completion
    const result = await client.workflow.execute('saveUserDataWorkflow', {
      args: [userData],
      taskQueue: 'user-data-task-queue',
      workflowId,
    });
    
    console.log('Workflow completed with result:', result);
    
    // Close connection
    await connection.close();
    
    res.json({ 
      message: 'User updated successfully and synced to external service.',
      user: result.user,
      crudCrudResult: result.crudCrudResult
    });
    
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
};

export {
  getAllUsers,
  getUserByEmail,
  createOrLoginUser,
  updateUserWithWorkflow,
};