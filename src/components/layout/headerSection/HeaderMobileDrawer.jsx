import { Link, NavLink } from 'react-router-dom';
import { ShieldAccountIcon, AccountCircleIcon, LogoutIcon, LoginIcon, CartOutlineIcon, CloseIcon } from '../../icons';
import { Button, LevelItem, ThemeToggleButton } from '../../common';
import TechnologiesDropdown from '../TechnologiesDropdown';
import { ADMIN_NAV } from '../../routes';
import { actionBtnBase } from './headerConstants';

export default function HeaderMobileDrawer({
  menuOpen,
  closeMenu,
  publicNav,
  levelItemsWithClose,
  technologies,
  user,
  logout,
}) {
  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 max-[900px]:block hidden"
      style={{ pointerEvents: menuOpen ? 'auto' : 'none' }}
    >
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${menuOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={closeMenu}
        aria-hidden
      />
      <aside
        className={`absolute left-0 top-0 h-full w-[280px] max-w-[85vw] flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-xl transition-[transform] duration-200 ease-out ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex shrink-0 items-center justify-between gap-2 py-4 px-4 border-b border-gray-200 dark:border-gray-700">
          <Link to="/" className="flex items-center gap-2 min-w-0 font-bold text-gray-900 dark:text-white no-underline hover:opacity-80" onClick={closeMenu}>
            <img src="/logo.png" alt="Axatech" className="h-9 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggleButton className="!rounded-lg transition-colors hover:bg-primary/10 dark:hover:bg-secondary/20" />
            <button type="button" onClick={closeMenu} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700" aria-label="Close menu">
              <CloseIcon className="text-xl cursor-pointer" />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <nav data-mobile-nav-scroll className="py-4">
            <p className="mb-2 px-4 text-[0.7rem] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Menu</p>
            <div className="space-y-1 px-3">
              {publicNav.items.map((item) =>
                item.type === 'dropdown' ? (
                  <div key={item.key} className="flex flex-col min-w-0 w-full">
                    <TechnologiesDropdown
                      technologies={technologies}
                      onClose={closeMenu}
                      inline
                    />
                  </div>
                ) : (
                  <div key={item.key} className="flex flex-col min-w-0 w-full">
                    <LevelItem
                      id={`header-${item.key}-mobile`}
                      label={item.label}
                      vertical
                      inFlowNestedVertical
                      defaultOpen={false}
                      items={levelItemsWithClose[item.key]}
                      className="w-full min-w-0"
                      contentClassName={ADMIN_NAV.sidebar.levelContentClass}
                      triggerClassName={`${ADMIN_NAV.sidebar.levelTriggerClass} !justify-start`.trim()}
                    />
                  </div>
                ),
              )}
            </div>
          </nav>
        </div>

        <div className="shrink-0 border-t border-gray-200 dark:border-gray-700 p-4 space-y-2 bg-white dark:bg-gray-900">
          {user ? (
            <>
              {user.role === 'admin' && (
                <NavLink to="/admin" onClick={closeMenu} className={`${actionBtnBase} justify-center text-primary dark:text-gray-200 border border-primary/30 dark:border-secondary/40 hover:bg-primary/10 dark:hover:bg-secondary/20`}>
                  <ShieldAccountIcon className="text-[18px] shrink-0" />
                  Admin
                </NavLink>
              )}
              <Link to="/profile" onClick={closeMenu} className={`${actionBtnBase} justify-center bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600`}>
                <AccountCircleIcon className="text-[22px] shrink-0" />
                Profile
              </Link>
              <button
                type="button"
                onClick={() => { logout(); closeMenu(); }}
                className={`${actionBtnBase} justify-center w-full bg-transparent text-error border-2 border-error/40 hover:bg-error/10`}
              >
                <LogoutIcon className="text-[18px] shrink-0" />
                Logout
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 w-full">
                <Button
                  to="/login"
                  variant="outline"
                  size="sm"
                  icon={<LoginIcon className="text-[18px] shrink-0" />}
                  onClick={closeMenu}
                  className="w-full"
                >
                  Login
                </Button>
                <Button
                  to="/licenses"
                  variant="secondary"
                  size="sm"
                  icon={<CartOutlineIcon className="text-[18px] shrink-0" />}
                  onClick={closeMenu}
                  className="w-full"
                >
                  Buy
                </Button>
              </div>
              <Button
                to="/contact"
                variant="primary"
                size="sm"
                onClick={closeMenu}
                className="w-full"
              >
                Talk To Expert
              </Button>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
