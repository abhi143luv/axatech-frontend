import { useTheme } from '../../context/ThemeContext';
import { WeatherNightIcon, WeatherSunnyIcon } from '../icons';

/**
 * Icon button that toggles light/dark theme via ThemeContext.
 */
export default function ThemeToggleButton({ className = '', iconClassName = 'text-[20px]' }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-primary transition-all duration-200 hover:bg-primary/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-secondary dark:hover:bg-secondary/20 ${className}`.trim()}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <WeatherSunnyIcon className={iconClassName} />
      ) : (
        <WeatherNightIcon className={iconClassName} />
      )}
    </button>
  );
}
