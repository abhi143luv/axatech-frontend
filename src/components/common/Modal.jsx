import { useId, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Button from './Button';
import { CloseIcon } from '../icons';

/**
 * Reusable admin-style modal: overlay, header with title, scrollable body, optional standard footer.
 * Use for Categories, Licenses, Products modals to avoid repeating structure.
 *
 * @param {boolean} [open=true] - If false, renders null (for controlled usage like ProductsModal).
 * @param {string} title - Modal title (header).
 * @param {'sm'|'md'|'lg'|'xl'|'2xl'} [size='lg'] - Modal width variant: sm, md, lg, xl, 2xl.
 * @param {string} [titleId] - id for the title element (aria-labelledby). Defaults to generated id.
 * @param {function(): void} onClose - Called when Cancel (or other footer) is clicked. Backdrop click does not close the modal.
 * @param {React.ReactNode} children - Body content.
 * @param {string} [cancelLabel='Cancel'] - Cancel button label.
 * @param {function(): void} [onCancel] - Cancel button handler; defaults to onClose.
 * @param {string} [primaryLabel] - Primary button label (e.g. "Create category").
 * @param {function(): void} [onPrimary] - Primary button handler (e.g. handleSave).
 * @param {boolean} [primaryLoading=false] - Shows loading state on primary action.
 * @param {string} [primaryLoadingLabel='Please wait...'] - Loading label for primary action.
 * @param {boolean} [primaryDisabled=false] - Disables primary action.
 * @param {boolean} [showDelete=false] - Whether to show Delete button.
 * @param {string} [deleteLabel='Delete'] - Delete button label.
 * @param {function(): void} [onDelete] - Delete button handler.
 * @param {React.ReactNode} [footer] - Custom footer; if provided, cancel/primary/delete props are ignored.
 */
const sizeClass = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  '8xl': 'max-w-8xl',
  '9xl': 'max-w-9xl',
  '10xl': 'max-w-10xl',
};

export default function Modal({
  open = true,
  title,
  size = 'lg',
  titleId: titleIdProp,
  onClose,
  children,
  cancelLabel = 'Cancel',
  onCancel,
  primaryLabel,
  onPrimary,
  primaryLoading = false,
  primaryLoadingLabel = 'Please wait...',
  primaryDisabled = false,
  showDelete = false,
  deleteLabel = 'Delete',
  onDelete,
  footer,
}) {
  const generatedId = useId();
  const titleId = titleIdProp || `modal-${generatedId.replace(/:/g, '')}`;
  const handleCancel = onCancel ?? onClose;
  const maxWidthClass = sizeClass[size] ?? sizeClass.lg;

  useEffect(() => {
    if (!open) return;
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, [open]);

  if (open === false) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className={`relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800 dark:shadow-none dark:ring-1 dark:ring-gray-700 ${maxWidthClass}`}
      >
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-slate-50/80 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/95">
          <h2 id={titleId} className="text-lg font-semibold text-slate-800 dark:text-white">
            {title}
          </h2>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (primaryLoading) return;
              handleCancel?.();
            }}
            disabled={primaryLoading}
            className={`cursor-pointer flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 ${primaryLoading ? 'cursor-not-allowed opacity-60' : ''}`}
            aria-label="Close modal"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </header>
        <div className={`flex-1 overflow-y-auto px-6 py-5 transition ${primaryLoading ? 'blur-[2px] pointer-events-none select-none' : ''}`}>
          {children}
        </div>
        {footer !== undefined ? (
          footer
        ) : (
          <footer className="shrink-0 flex flex-wrap justify-end gap-3 border-t border-slate-200 bg-slate-50/80 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/95">
            <button
              type="button"
              className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border-2 border-primary bg-transparent px-5 text-base font-semibold text-primary transition-colors hover:bg-primary/5 dark:border-secondary dark:text-secondary dark:hover:bg-secondary/10"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (primaryLoading) return;
                handleCancel?.();
              }}
              disabled={primaryLoading}
            >
              {cancelLabel}
            </button>
            {showDelete && onDelete && (
              <Button type="button" variant="error" fullWidth={false} onClick={onDelete} disabled={primaryLoading}>
                {deleteLabel}
              </Button>
            )}
            {primaryLabel && onPrimary && (
              <Button
                type="button"
                variant="primary"
                fullWidth={false}
                onClick={onPrimary}
                loading={primaryLoading}
                loadingLabel={primaryLoadingLabel}
                disabled={primaryDisabled}
              >
                {primaryLabel}
              </Button>
            )}
          </footer>
        )}
        {primaryLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/40 backdrop-blur-[1px] dark:bg-gray-900/45">
            <div className="inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-white/90 px-4 py-2 text-sm font-medium text-primary shadow-sm dark:border-secondary/30 dark:bg-gray-800/90 dark:text-secondary">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden />
              {primaryLoadingLabel}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
