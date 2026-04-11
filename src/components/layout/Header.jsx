import { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';
import api from '../../api';
import { PUBLIC_NAV, withCloseMenu } from '../routes';
import { HEADER_CONTAINER } from './headerSection/headerConstants';
import HeaderTopBar from './headerSection/HeaderTopBar';
import HeaderLogoBar from './headerSection/HeaderLogoBar';
import HeaderDesktopNav from './headerSection/HeaderDesktopNav';
import HeaderMobileDrawer from './headerSection/HeaderMobileDrawer';
import './Header.css';

export default function Header({ menuOpen, onMenuToggle, closeMenu, user, logout }) {
  const { theme } = useTheme();
  const [techMenuOpen, setTechMenuOpen] = useState(false);
  const [technologies, setTechnologies] = useState([]);
  /** false = horizontal dropdowns under each nav item; true = portaled flyouts (sidebar-style). */
  const isDesktopLevelCollapsed = false;

  const levelItemsWithClose = useMemo(() => {
    const map = {};
    for (const item of PUBLIC_NAV.items) {
      if (item.type === 'level') {
        map[item.key] = withCloseMenu(item.levelItems, closeMenu);
      } else if (item.type === 'link') {
        const leaf = { label: item.label, to: item.to };
        if (item.end) leaf.navEnd = true;
        map[item.key] = withCloseMenu([leaf], closeMenu);
      }
    }
    return map;
  }, [closeMenu]);

  useEffect(() => {
    api.technologies().then(setTechnologies).catch(() => setTechnologies([]));
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') closeMenu?.();
    };
    if (menuOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [menuOpen, closeMenu]);

  return (
    <header
      data-theme={theme}
      className="sticky top-0 z-8 bg-white dark:bg-gray-900 border-b border-gray-200/80 dark:border-gray-700/80 shadow-sm dark:shadow-none"
    >
      <HeaderTopBar closeMenu={closeMenu} />

      <div className="bg-white dark:bg-gray-900">
        <div className={`${HEADER_CONTAINER} relative flex items-center justify-between gap-6 overflow-visible py-4`}>
          <HeaderLogoBar
            closeMenu={closeMenu}
            menuOpen={menuOpen}
            onMenuToggle={onMenuToggle}
          />

          <HeaderDesktopNav
            publicNav={PUBLIC_NAV}
            levelItemsWithClose={levelItemsWithClose}
            technologies={technologies}
            techMenuOpen={techMenuOpen}
            setTechMenuOpen={setTechMenuOpen}
            closeMenu={closeMenu}
            user={user}
            logout={logout}
            isDesktopLevelCollapsed={isDesktopLevelCollapsed}
          />

          <HeaderMobileDrawer
            menuOpen={menuOpen}
            closeMenu={closeMenu}
            publicNav={PUBLIC_NAV}
            levelItemsWithClose={levelItemsWithClose}
            technologies={technologies}
            user={user}
            logout={logout}
          />
        </div>
      </div>
    </header>
  );
}
