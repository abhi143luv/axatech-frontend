import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Dropdown, ThemeToggleButton } from '../common';
import { MenuIcon, UserSecretIcon, CogLoopIcon, LogoutIcon } from '../icons';

const PROFILE_DROPDOWN_LINKS = [
  { to: '/profile', label: 'Settings', Icon: CogLoopIcon },
  { to: '/profile', label: 'Profile', Icon: UserSecretIcon },
];

export default function AdminHeader({ sidebarOpen, onMenuToggle }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="flex shrink-0 items-center justify-between gap-4 bg-slate-100 dark:bg-gray-900 px-4 py-3 md:px-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuToggle}
          className="flex md:hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={sidebarOpen}
        >
          <MenuIcon className="text-2xl" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggleButton />
        <Dropdown
          id="admin-header-profile-menu"
          className="w-auto shrink-0"
          value=""
          onChange={(v) => {
            if (v === '__logout__') {
              handleLogout();
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
          triggerContent={
            <>
              <UserSecretIcon className="text-[25px] shrink-0 text-primary cursor-pointer dark:text-secondary" />
              <span className="hidden text-[0.9375rem] font-semibold text-gray-700 dark:text-gray-200 sm:inline">
                Profile
              </span>
            </>
          }
          triggerClassName="!rounded-lg !border !border-gray-200 !bg-gray-50 !py-2 !px-3 !shadow-none hover:!border-gray-300 hover:!bg-gray-100 dark:!border-gray-600 dark:!bg-gray-700 dark:hover:!border-gray-500 dark:hover:!bg-gray-600 focus-visible:!ring-2 focus-visible:!ring-primary focus-visible:!ring-offset-2 dark:focus-visible:!ring-secondary"
        />
      </div>
    </header>
  );
}
