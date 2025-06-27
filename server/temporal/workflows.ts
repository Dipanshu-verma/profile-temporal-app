import { proxyActivities, sleep } from '@temporalio/workflow';

interface UserData {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  city?: string;
  pincode?: string;
}

interface WorkflowResult {
  success: boolean;
  message: string;
  user: any;
  crudCrudResult: any;
}

// Import activities with increased timeout
const { saveUserToDatabase, syncToCrudCrud } = proxyActivities({
  startToCloseTimeout: '1 minute', // Increased timeout
  retry: {
    maximumAttempts: 3, // Retry up to 3 times
  }
});

// Main workflow for saving user data
async function saveUserDataWorkflow(userData: UserData): Promise<WorkflowResult> {
  console.log('Starting saveUserDataWorkflow for:', userData.email);
  
  try {
    // First, save to database immediately
    const savedUser = await saveUserToDatabase(userData);
    console.log('User saved to database:', savedUser.email);
    
    // Wait for 10 seconds as required
    console.log('Waiting 10 seconds before syncing to CrudCrud...');
    await sleep('10 seconds');
    
    // Then sync to CrudCrud
    const crudCrudResult = await syncToCrudCrud(savedUser);
    console.log('Data synced to CrudCrud:', crudCrudResult);
    
    return {
      success: true,
      message: 'User data saved and synced successfully',
      user: savedUser,
      crudCrudResult,
    };
  } catch (error) {
    console.error('Workflow error:', error);
    throw error;
  }
}

export {
  saveUserDataWorkflow,
};