import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import Home from './pages/Home';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

const domain = import.meta.env.VITE_AUTH0_DOMAIN || '';
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || '';

function App() {
  if (!domain || !clientId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h1>
          <p className="text-red-500">
            Please set VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID in your .env file
          </p>
        </div>
      </div>
    );
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE ,
        scope: "openid profile email",
        cacheLocation: "localstorage",

      }}
    >
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </Auth0Provider>
  );
}

export default App;