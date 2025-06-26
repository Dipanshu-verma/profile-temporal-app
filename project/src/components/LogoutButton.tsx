import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { LogOut } from 'lucide-react';

const LogoutButton: React.FC = () => {
  const { logout } = useAuth0();

  return (
    <button
      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
      className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Sign Out
    </button>
  );
};

export default LogoutButton;