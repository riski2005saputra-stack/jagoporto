import React, { useState } from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CustomerLogin from '../pages/CustomerLogin';

// 1. ADMIN MASTER PROTECTED ROUTE
export function AdminProtectedRoute({ children }) {
  const { isMasterLoggedIn } = useAuth();

  if (!isMasterLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return children ? children : <Outlet />;
}

// 2. CUSTOMER EDITOR PROTECTED GATEWAY
export function CustomerProtectedRoute({ children }) {
  const { customerId } = useParams();
  const { isCustomerAuthorized } = useAuth();
  const [, setRefresh] = useState(0);

  const isAuthorized = isCustomerAuthorized(customerId);

  if (!isAuthorized) {
    return <CustomerLogin onSuccess={() => setRefresh((p) => p + 1)} />;
  }

  return children ? children : <Outlet />;
}
