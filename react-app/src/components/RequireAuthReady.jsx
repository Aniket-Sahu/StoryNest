import React from 'react';
import { useAuth } from '../hooks/useAuth';

const RequireAuthReady = ({ children }) => {
  const { loading, user } = useAuth();
  if (loading) {
    return <div>Loading authentication...</div>;
  }
  if (!user) {
    return <div>Please log in to view this page.</div>;
  }
  return <>{children}</>;
};

export default RequireAuthReady;
