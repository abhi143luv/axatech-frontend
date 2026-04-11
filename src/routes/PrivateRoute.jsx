import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children, adminOnly }) {
  const { user, token, loading, loadUser } = useAuth();

  useEffect(() => {
    if (token && !user) loadUser();
  }, [token, user, loadUser]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
        Loading...
      </div>
    );
  }
  if (!token) return <Navigate to="/login" replace />;
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/profile" replace />;
  return children;
}
