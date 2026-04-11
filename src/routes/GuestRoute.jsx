import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Wraps auth-only routes (login, register, etc.).
 * If the user is already logged in, redirects to home (or admin if admin).
 * Prevents logged-in users from accessing login/register pages.
 */
export default function GuestRoute({ children, redirectTo }) {
  const { user, token, loading, loadUser } = useAuth();

  useEffect(() => {
    if (token && !user) loadUser();
  }, [token, user, loadUser]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-primary dark:border-gray-600 dark:border-t-secondary" aria-hidden />
      </div>
    );
  }

  if (token) {
    const to = redirectTo ?? (user?.role === 'admin' ? '/admin' : '/');
    return <Navigate to={to} replace />;
  }

  return children;
}
