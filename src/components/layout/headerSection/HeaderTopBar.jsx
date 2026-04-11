import { Link } from 'react-router-dom';
import { PhoneIcon, EmailOutlineIcon, DownloadIcon } from '../../icons';
import { HEADER_CONTAINER, utilityLinkClass } from './headerConstants';

export default function HeaderTopBar({ closeMenu }) {
  return (
    <div className="hidden min-[901px]:block bg-gray-50 dark:bg-gray-900 border-b border-gray-200/80 dark:border-gray-700/80">
      <div className={`${HEADER_CONTAINER} flex justify-end items-center py-2 sm:py-2.5`}>
        <div className="flex items-center gap-6 sm:gap-8 flex-wrap justify-end">
          <a href="tel:+918448449099" className={utilityLinkClass}>
            <PhoneIcon className="text-[13px] shrink-0" />
            <span className="hidden sm:inline">+91 7090054701</span>
          </a>
          <a href="mailto:info@axatech.com" className={utilityLinkClass}>
            <EmailOutlineIcon className="text-[13px] shrink-0" />
            <span className="hidden sm:inline">admin@axatech.com</span>
          </a>
          <span className="w-px h-4 bg-gray-300 dark:bg-gray-600 hidden sm:block" aria-hidden />
          <Link to="/contact" className={utilityLinkClass} onClick={closeMenu}>
            Career
          </Link>
          <Link to="/contact" className={utilityLinkClass} onClick={closeMenu}>
            <DownloadIcon className="text-[13px] shrink-0" />
            Download
          </Link>
        </div>
      </div>
    </div>
  );
}
