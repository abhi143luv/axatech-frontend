import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';
import { getUserRoutes, getAuthRoutes, getAdminRoutes } from './routes';
import { Toaster } from './components/common';
import NotFound from './pages/auth/NotFound';

export default function App() {
  const { theme } = useTheme();
  useEffect(() => {
    console.log('Theme:', theme === 'dark' ? 'dark' : 'light');
  }, [theme]);

  return (
    <div className="min-h-screen font-sans antialiased bg-white text-text leading-relaxed dark:bg-gray-900 dark:text-gray-200">
      <Toaster />
      <Routes>
        {getUserRoutes()}
        {getAuthRoutes()}
        {getAdminRoutes()}
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
    </div>
  );
}
