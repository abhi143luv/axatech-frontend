import { Link } from 'react-router-dom';
import { ThemeToggleButton } from '../../common';

export default function HeaderLogoBar({ closeMenu, menuOpen, onMenuToggle }) {
  return (
    <>
      <Link
        to="/"
        className="flex items-center gap-2 shrink-0 no-underline transition-opacity duration-200 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
        onClick={closeMenu}
      >
        <img src="/logo.png" alt="Axatech" className="h-11 sm:h-[50px] w-auto object-contain" />
      </Link>

      <div className="flex items-center gap-2">
        <ThemeToggleButton className="flex min-[901px]:hidden" />

        <button
          type="button"
          className="header-hamburger-btn flex min-[901px]:hidden items-center justify-center w-11 h-11 rounded-xl p-0 border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 cursor-pointer text-primary dark:text-secondary transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={onMenuToggle}
        >
          <svg className="header-hamburger-svg" viewBox="0 0 32 32" aria-hidden>
            <path
              className="header-hamburger-line header-hamburger-line-top-bottom"
              d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
            />
            <path className="header-hamburger-line" d="M7 16 27 16" />
          </svg>
        </button>
      </div>
    </>
  );
}
