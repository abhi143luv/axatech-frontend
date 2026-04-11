/**
 * Reusable badge/chip for status, counts, or labels.
 * @param {React.ReactNode} [children] - Badge content
 * @param {'success' | 'warning' | 'error' | 'info' | 'neutral'} [variant] - Preset color variant
 * @param {boolean} [solid] - Use solid (darker) style for the variant (e.g. for active tab)
 * @param {'sm' | 'md'} [size='md'] - Badge size
 * @param {string} [className] - Extra classes (merged with base and variant)
 */
export default function Badge({ children, variant, solid = false, size = 'md', className = '' }) {
  const baseClass =
    'inline-flex items-center justify-center rounded-md font-semibold';
  const sizeClass =
    size === 'sm'
      ? 'h-6 min-w-[24px] px-2 text-xs'
      : 'px-2.5 py-1 text-xs';

  const variantClass = (() => {
    if (!variant) return '';
    if (solid) {
      return variant === 'success'
        ? 'bg-success-dark text-white dark:bg-success-dark dark:text-white'
        : variant === 'warning'
          ? 'bg-warning text-black dark:bg-warning dark:text-black'
          : variant === 'error'
            ? 'bg-error-dark text-white dark:bg-error-dark dark:text-white'
            : variant === 'info'
              ? 'bg-info-dark text-white dark:bg-info-dark dark:text-white'
              : variant === 'neutral'
                ? 'bg-slate-700 text-white dark:bg-slate-600 dark:text-white'
                : '';
    }
    return variant === 'success'
      ? 'bg-success-lighter text-success-dark dark:bg-success/10 dark:text-success'
      : variant === 'warning'
        ? 'bg-warning-lighter text-warning-dark dark:bg-warning-light/20 dark:text-warning'
        : variant === 'error'
          ? 'bg-error-light/30 text-error-dark dark:text-error'
          : variant === 'info'
            ? 'bg-info-lighter text-info-dark dark:bg-info/30 dark:text-info-light'
            : variant === 'neutral'
              ? 'bg-slate-700 text-white dark:bg-slate-600 dark:text-white'
              : '';
  })();

  const combined = [baseClass, sizeClass, variantClass, className]
    .filter(Boolean)
    .join(' ')
    .trim();

  return <span className={combined}>{children}</span>;
}
