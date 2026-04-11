import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, isAdmin } = useAuth();
  
  if (!user || (!isAdmin)) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
