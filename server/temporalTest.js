const { Connection, Client } = require('@temporalio/client');

async function testConnection() {
  try {
    console.log('Attempting to connect to Temporal server with alternative settings...');
    
    // Try alternative connection configuration
    const connection = await Connection.connect({
      address: '127.0.0.1:7233',  // Using IP instead of hostname
      tls: undefined,
      connectionOptions: {
        connectTimeout: 15000,  // Longer timeout (15 seconds)
      }
    });
    
    console.log('Successfully connected to Temporal server!');
    connection.close();
  } catch (error) {
    console.error('Failed to connect to Temporal server:', error);
  }
}

testConnection();