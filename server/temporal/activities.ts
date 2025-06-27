import User from '../models/User';
import axios from 'axios';

interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  city?: string;
  pincode?: string;
  updatedAt?: string;
}

// Activity to save user data to MongoDB
async function saveUserToDatabase(userData: UserData): Promise<any> {
  try {
    console.log('Saving user to database:', userData.email);
    
    const updatedUser = await User.findOneAndUpdate(
      { email: userData.email },
      {
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber || '',
        city: userData.city || '',
        pincode: userData.pincode || '',
      },
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      throw new Error('User not found');
    }
    
    console.log('User successfully saved to database');
    return updatedUser.toObject();
  } catch (error) {
    console.error('Error saving user to database:', error);
    throw error;
  }
}

// Activity to sync data to CrudCrud
async function syncToCrudCrud(userData: UserData): Promise<any> {
  try {
    console.log('Syncing data to CrudCrud for:', userData.email);
    
    const crudCrudData: UserData = {
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phoneNumber: userData.phoneNumber,
      city: userData.city,
      pincode: userData.pincode,
      updatedAt: new Date().toISOString(),
    };
    
    // Get CrudCrud API key from environment variables
    const apiKey = process.env.CRUDCRUD_API_KEY;
    if (!apiKey) {
      throw new Error('CRUDCRUD_API_KEY not set in environment variables');
    }
    
    const crudCrudUrl = `https://crudcrud.com/api/${apiKey}/users`;
    
    console.log(`Making request to: ${crudCrudUrl}`);
    const response = await axios.post(crudCrudUrl, crudCrudData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Data successfully synced to CrudCrud:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error syncing to CrudCrud:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    throw new Error(`Failed to sync to CrudCrud: ${error.message}`);
  }
}

export {
  saveUserToDatabase,
  syncToCrudCrud,
};