import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { LogIn } from 'lucide-react';

const LoginButton: React.FC = () => {
  const { loginWithRedirect, isLoading } = useAuth0();

  return (
    <button
      onClick={() => loginWithRedirect()}
      disabled={isLoading}
      className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <LogIn className="w-4 h-4 mr-2" />
      {isLoading ? 'Signing In...' : 'Sign In with Auth0'}
    </button>
  );
};

export default LoginButton;