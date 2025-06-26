const { Worker } = require('@temporalio/worker');
const activities = require('./activities');
const connectDB = require('../config/database');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function run() {
  try {
    console.log('Initializing Temporal worker...');
    
    // Establish MongoDB connection using your existing config
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('Connected to MongoDB successfully');
    
    // Check for CrudCrud API key
    if (!process.env.CRUDCRUD_API_KEY) {
      console.warn('Warning: CRUDCRUD_API_KEY not set in environment variables');
    }
    
    // Create the worker
    const worker = await Worker.create({
      workflowsPath: require.resolve('./workflows'),
      activities,
      taskQueue: 'user-data-task-queue',
    });
    
    console.log('Worker created successfully. Starting worker...');
    console.log('Listening on task queue: user-data-task-queue');
    
    // Start the worker
    await worker.run();
  } catch (error) {
    console.error('Worker initialization error:', error);
    process.exit(1);
  }
}

console.log('Starting Temporal worker process...');
run().catch((err) => {
  console.error('Unhandled error in worker process:', err);
  process.exit(1);
});