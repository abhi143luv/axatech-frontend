export const HEADER_CONTAINER = 'w-full max-w-[1200px] mx-auto px-5';

export const utilityLinkClass =
  'inline-flex items-center gap-2 text-[0.8125rem] font-medium text-gray-600 dark:text-gray-400 no-underline transition-colors duration-200 hover:text-primary dark:hover:text-secondary [&>span]:opacity-80';

export const actionBtnBase =
  'inline-flex items-center justify-center gap-2 min-w-[7rem] text-[0.9375rem] font-semibold py-2.5 px-5 rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 max-[900px]:w-full max-[900px]:py-3';

export const getDesktopNavLinkClassName = ({ isActive }) =>
  `block text-[0.9375rem] font-medium px-3 py-2.5 rounded-lg transition-all duration-200 whitespace-nowrap max-[900px]:py-3 max-[900px]:px-4 max-[900px]:text-base max-[900px]:rounded-xl ${isActive
    ? 'bg-info-lighter text-info-dark dark:bg-info/20 dark:text-info-light dark:font-semibold max-[900px]:bg-primary/20 max-[900px]:dark:bg-secondary/25 max-[900px]:border-l-4 max-[900px]:border-primary max-[900px]:dark:border-secondary max-[900px]:pl-[calc(1rem-4px)]'
    : 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/5 dark:hover:text-secondary dark:hover:bg-secondary/15 max-[900px]:hover:bg-primary/10 max-[900px]:dark:hover:bg-secondary/15'
  }`;
