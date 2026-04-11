/**
 * Reusable pagination: Previous, "Page X of Y", Next.
 * @param {number} page - Current page (1-based)
 * @param {number} totalPages - Total number of pages
 * @param {function(number): void} onPageChange - Called with the new page number (e.g. onPageChange(2))
 * @param {string} [className] - Extra classes for the wrapper
 * @param {string} [previousLabel] - Label for Previous button
 * @param {string} [nextLabel] - Label for Next button
 */
import { Button } from '../common';

export default function Pagination({
  page,
  totalPages,
  onPageChange,
  className = '',
  previousLabel = 'Previous',
  nextLabel = 'Next',
}) {
  if (totalPages <= 1) return null;

  return (
    <div
      className={`flex items-center justify-center gap-4 text-gray-600 dark:text-gray-400 ${className}`.trim()}
      role="navigation"
      aria-label="Pagination"
    >
      <Button
        type="button"
        variant="outline"
        fullWidth={false}
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
        className="px-5 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-primary/30 dark:hover:border-secondary/40 hover:-translate-y-0.5 transition-all duration-200"
      >
        {previousLabel}
      </Button>
      <span className="text-sm font-medium" aria-live="polite">
        Page {page} of {totalPages}
      </span>
      <Button
        type="button"
        variant="outline"
        fullWidth={false}
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
        className="px-5 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-primary/30 dark:hover:border-secondary/40 hover:-translate-y-0.5 transition-all duration-200"
      >
        {nextLabel}
      </Button>
    </div>
  );
}
