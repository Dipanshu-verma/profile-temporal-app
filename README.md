# Profile Management Application with Temporal Integration

A full-stack application that allows users to log in via OIDC (OAuth), view and edit their profile information, with changes synchronized to an external API using Temporal workflow orchestration.

## 📋 Features

- **OAuth Authentication**: Secure login using identity federation (OIDC)
- **Profile Management**: View and edit personal information
- **Real-time Database Updates**: Immediate persistence to MongoDB
- **Delayed External Sync**: Updates to external API (crudcrud.com) with a 10-second delay using Temporal workflows
- **Responsive UI**: Modern, mobile-friendly interface

## 🖼️ Screenshots

### Home Page
![Home Page](./assets/signin.png)
*Landing page with login option*

### Continue with Google Page
![Continue with Google](./assets/authLogin.png)
*OAuth authentication flow*

### Profile Page
![Profile Page](./assets//profile.png)
*User profile with editable fields*

### Temporal Workflow UI - Running
![Temporal Workflow Running](./assets/workflowHome.png)
*Temporal UI showing a running workflow*

### Temporal Workflow UI - Completed
![Temporal Workflow Completed](./assets//workflowDetail.png)
*Temporal UI showing a completed workflow*

## 🔧 Technology Stack

### Frontend
- React.js
- React Router
- Auth0 for authentication
- Tailwind CSS for styling
- Axios for API calls

### Backend
- Node.js & Express
- MongoDB with Mongoose
- Temporal.io for workflow orchestration
- Auth0 for identity federation

## 🏗️ Architecture

The application follows a modern web architecture:

1. **Frontend**: React SPA with client-side routing
2. **API Layer**: Express.js REST API
3. **Database**: MongoDB for persistent storage
4. **Workflow Engine**: Temporal.io for managing delayed external updates
5. **External Integration**: crudcrud.com as the external API

## 🌊 Workflow Explanation

When a user updates their profile:

1. Data is immediately saved to MongoDB
2. A Temporal workflow is initiated
3. The workflow waits for 10 seconds
4. After the delay, the workflow updates the external API (crudcrud.com)

This demonstrates the power of Temporal for handling time-based operations and ensuring reliable execution of sequential tasks.

## 🚀 Installation and Setup

### Prerequisites
- Node.js (v14+)
- MongoDB instance
- Temporal server
- Auth0 account
- crudcrud.com API key

# Backend Environment Variables
PORT=5000
MONGODB_URI=your_mongodb_connection_string
AUTH0_DOMAIN=your_auth0_domain
AUTH0_AUDIENCE=your_auth0_audience
CRUDCRUD_API_KEY=your_crudcrud_api_key
TEMPORAL_ADDRESS=localhost:7233
Create .env file in the client directory with the following variables:
# Frontend Environment Variables
VITE_AUTH0_DOMAIN=your_auth0_domain
VITE_AUTH0_CLIENT_ID=your_auth0_client_id
VITE_AUTH0_AUDIENCE=your_auth0_audience
VITE_API_BASE_URL=http://localhost:5000


### Installation

1. Clone the repository
```bash
git clone https://github.com/Dipanshu-verma/profile-temporal-app.git
cd profile-temporal-app