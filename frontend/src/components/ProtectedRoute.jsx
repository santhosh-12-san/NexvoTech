import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Cpu } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Cpu className="w-12 h-12 text-cyan-400 animate-pulse glow-cyan" />
            <div className="absolute inset-0 rounded-full border-2 border-cyan-500/40 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-cyan-300 font-mono text-sm tracking-wider">VERIFYING QUANTUM CREDENTIALS...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
