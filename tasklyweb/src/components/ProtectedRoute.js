import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainLayout from './layout/MainLayout';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <MainLayout>{children}</MainLayout>;
};

export default ProtectedRoute; 