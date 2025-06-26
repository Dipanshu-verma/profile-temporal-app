import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';
import LoginButton from '../components/LoginButton';
import Loading from '../components/Loading';

const Home: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loading message="Loading application..." />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-gray-900 mb-2">
          Profile Temporal App
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Secure profile management with Auth0 and Temporal workflows
        </p>
        
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Welcome
            </h2>
            <p className="text-gray-600 mb-6">
              Sign in to manage your profile and view workflow status
            </p>
            <LoginButton />
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Features:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Auth0 Authentication</li>
              <li>• Profile Management</li>
              <li>• Temporal Workflow Integration</li>
              <li>• Real-time Updates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;