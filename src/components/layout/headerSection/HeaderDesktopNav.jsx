import { useEffect, useMemo, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  ShieldAccountIcon,
  AccountCircleIcon,
  ChevronDownIcon,
  LogoutIcon,
  LoginIcon,
  CartOutlineIcon,
  CogLoopIcon,
} from '../../icons';
import { Button, Dropdown, LevelItem, ThemeToggleButton } from '../../common';
import TechnologiesDropdown from '../TechnologiesDropdown';
import { PROFILE_DROPDOWN_LINKS } from '../../routes';
import { actionBtnBase, getDesktopNavLinkClassName } from './headerConstants';

export default function HeaderDesktopNav({
  publicNav,
  levelItemsWithClose,
  technologies,
  techMenuOpen,
  setTechMenuOpen,
  closeMenu,
  user,
  logout,
  isDesktopLevelCollapsed,
}) {
  const navigate = useNavigate();
  const techMenuLeaveTimerRef = useRef(null);

  useEffect(
    () => () => {
      if (techMenuLeaveTimerRef.current) {
        clearTimeout(techMenuLeaveTimerRef.current);
      }
    },
    []
  );

  const openTechMenu = () => {
    if (techMenuLeaveTimerRef.current) {
      clearTimeout(techMenuLeaveTimerRef.current);
      techMenuLeaveTimerRef.current = null;
    }
    setTechMenuOpen(true);
  };

  const scheduleCloseTechMenu = () => {
    if (techMenuLeaveTimerRef.current) {
      clearTimeout(techMenuLeaveTimerRef.current);
    }
    techMenuLeaveTimerRef.current = setTimeout(() => {
      setTechMenuOpen(false);
      techMenuLeaveTimerRef.current = null;
    }, 200);
  };

  const profileDropdownOptions = useMemo(
    () => [
      ...PROFILE_DROPDOWN_LINKS.map((item) => ({
        value: item.label,
        label: item.label,
        icon: <item.Icon className="text-[20px] shrink-0 opacity-80" />,
      })),
      {
        value: '__logout__',
        label: 'Logout',
        icon: <LogoutIcon className="text-[20px] shrink-0 opacity-80" />,
        optionTone: 'danger',
        dividerBefore: true,
      },
    ],
    [],
  );

  const guestTabletOptions = useMemo(
    () => [
      {
        value: 'login',
        label: 'Login',
        icon: <LoginIcon className="text-[20px] shrink-0 opacity-80" />,
      },
      {
        value: 'licenses',
        label: 'Buy',
        icon: <CartOutlineIcon className="text-[20px] shrink-0 opacity-80" />,
      },
      {
        value: 'contact',
        label: 'Talk To Expert',
      },
    ],
    [],
  );

  const compactGearOptions = useMemo(() => {
    if (!user) return guestTabletOptions;
    const adminOpt =
      user.role === 'admin'
        ? [
            {
              value: '__admin__',
              label: 'Admin',
              icon: <ShieldAccountIcon className="text-[20px] shrink-0 opacity-80" />,
            },
          ]
        : [];
    return [...adminOpt, ...profileDropdownOptions];
  }, [user, guestTabletOptions, profileDropdownOptions]);

  const gearTriggerClass =
    '!rounded-xl !border !p-2.5 !shadow-none bg-gray-50 dark:bg-gray-800 hover:border-primary/40 hover:bg-primary/5 dark:hover:border-secondary/50 dark:hover:bg-secondary/15 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2';

  const handleCompactGearChange = (v) => {
    closeMenu();
    if (!user) {
      if (v === 'login') navigate('/login');
      else if (v === 'licenses') navigate('/licenses');
      else if (v === 'contact') navigate('/contact');
      return;
    }
    if (v === '__logout__') {
      logout();
      return;
    }
    if (v === '__admin__') {
      navigate('/admin');
      return;
    }
    const row = PROFILE_DROPDOWN_LINKS.find((x) => x.label === v);
    if (row) navigate(row.to);
  };

  return (
    <nav className="hidden min-[901px]:flex flex-1 items-center justify-end gap-0.5 overflow-visible">
      <div className="flex items-center gap-0.5">
        {publicNav.items.map((item) =>
          item.type === 'dropdown' ? (
            <div
              key={item.key}
              className="relative w-max max-w-full shrink-0 overflow-visible"
              onMouseEnter={openTechMenu}
              onMouseLeave={scheduleCloseTechMenu}
            >
              <NavLink
                to={item.to}
                end={item.end}
                onClick={closeMenu}
                className={(state) =>
                  `${getDesktopNavLinkClassName(state)} !flex min-w-0 items-center justify-between gap-0.5`.trim()
                }
              >
                <span className="whitespace-nowrap">{item.label}</span>
                <ChevronDownIcon
                  className={`shrink-0 text-base transition-transform duration-200 ${techMenuOpen ? 'rotate-180' : ''}`}
                  aria-hidden
                />
              </NavLink>
              {techMenuOpen && (
                <TechnologiesDropdown
                  technologies={technologies}
                  onClose={() => {
                    if (techMenuLeaveTimerRef.current) {
                      clearTimeout(techMenuLeaveTimerRef.current);
                      techMenuLeaveTimerRef.current = null;
                    }
                    setTechMenuOpen(false);
                    closeMenu();
                  }}
                />
              )}
            </div>
          ) : (
            <div
              key={item.key}
              className={`relative w-max max-w-full shrink-0 ${item.type === 'level' ? item.desktopMinWidth : 'min-w-[72px]'}`}
            >
              <LevelItem
                id={`header-${item.key}-desktop`}
                label={item.label}
                vertical={false}
                collapsed={isDesktopLevelCollapsed}
                openOnHover
                defaultOpen={false}
                items={levelItemsWithClose[item.key]}
                className="w-full min-w-0"
                contentClassName={publicNav.header.levelContentClass}
                triggerClassName={item.type === 'level' ? item.triggerClassName : publicNav.header.levelTriggerClass}
              />
            </div>
          ),
        )}
      </div>
      <div className="hidden xl:flex items-center gap-2.5 ml-4 pl-4 border-l border-gray-200 dark:border-gray-700">
        <ThemeToggleButton />
        {user ? (
          <>
            {user.role === 'admin' && (
              <Button
                to="/admin"
                variant="outline"
                size="lg"
                fullWidth={false}
                icon={<ShieldAccountIcon className="text-[18px] shrink-0" />}
                onClick={closeMenu}
                // className="min-w-28"
              >
                Admin
              </Button>
            )}
            <Dropdown
              id="header-profile-menu"
              className="w-auto shrink-0"
              value=""
              onChange={(v) => {
                closeMenu();
                if (v === '__logout__') {
                  logout();
                  return;
                }
                const row = PROFILE_DROPDOWN_LINKS.find((x) => x.label === v);
                if (row) navigate(row.to);
              }}
              options={profileDropdownOptions}
              showPlaceholderOption={false}
              panelMinWidth={200}
              panelAlign="end"
              triggerAriaLabel="Profile menu"
              triggerContent={(
                <>
                  <AccountCircleIcon className="text-[22px] shrink-0 text-primary dark:text-secondary" />
                  <span className="text-[0.9375rem] font-semibold text-gray-700 dark:text-gray-200">Profile</span>
                </>
              )}
              triggerClassName="!rounded-xl !border !py-2.5 !pl-4 !pr-3 !shadow-none bg-gray-50 dark:bg-gray-800 hover:border-primary/40 hover:bg-primary/5 dark:hover:border-secondary/50 dark:hover:bg-secondary/15 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            />
          </>
        ) : (
          <>
            <Link to="/login" className={`${actionBtnBase} bg-transparent text-primary dark:text-gray-200 border-2 border-primary/40 dark:border-gray-500 hover:bg-primary hover:text-white dark:hover:bg-gray-600 dark:hover:text-white dark:hover:border-gray-600`} onClick={closeMenu}>
              <LoginIcon className="text-[18px] shrink-0" />
              Login
            </Link>
            <Link to="/licenses" className={`${actionBtnBase} bg-secondary text-white border-0 shadow-md shadow-secondary/25 hover:bg-secondary/90 hover:shadow-lg hover:shadow-secondary/30 focus-visible:ring-secondary`} onClick={closeMenu}>
              <CartOutlineIcon className="text-[18px] shrink-0" />
              Buy
            </Link>
            <Link to="/contact" className={`${actionBtnBase} bg-primary text-white border-0 shadow-md shadow-primary/20 hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/25 focus-visible:ring-primary`} onClick={closeMenu}>
              Talk To Expert
            </Link>
          </>
        )}
      </div>

      <div className="flex xl:hidden items-center gap-2.5 ml-4 shrink-0 border-l border-gray-200 pl-4 dark:border-gray-700">
        <ThemeToggleButton />
        <Dropdown
          id="header-compact-gear-menu"
          className="w-auto shrink-0"
          value=""
          onChange={handleCompactGearChange}
          options={compactGearOptions}
          showPlaceholderOption={false}
          panelMinWidth={200}
          panelAlign="end"
          triggerAriaLabel={user ? 'Account menu' : 'Guest menu'}
          triggerContent={
            <CogLoopIcon className="text-[22px] shrink-0 text-primary dark:text-secondary" />
          }
          triggerClassName={gearTriggerClass}
        />
      </div>
    </nav>
  );
}
