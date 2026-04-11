import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <Header
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((open) => !open)}
        closeMenu={closeMenu}
        user={user}
        logout={logout}
      />
      <main className="min-h-[calc(100vh-140px)] bg-white dark:bg-gray-900">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
