import Button from './Button';

/**
 * Reusable confirmation modal: title, message, Confirm and Cancel buttons.
 * @param {boolean} open - Whether the modal is visible
 * @param {function(): void} onClose - Called when user cancels or clicks overlay
 * @param {function(): void} onConfirm - Called when user clicks Confirm (call onClose after if needed)
 * @param {string} [title='Confirm'] - Modal title
 * @param {React.ReactNode} [message] - Body text or custom content
 * @param {string} [confirmLabel='Confirm'] - Confirm button label (e.g. "Delete", "Yes")
 * @param {string} [cancelLabel='Cancel'] - Cancel button label
 * @param {string} [confirmVariant='primary'] - Button variant for confirm: 'primary' | 'error' | etc.
 * @param {string} [className] - Extra classes for the modal panel
 */
export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = 'Confirm',
  message = 'Are you sure you want to continue?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'primary',
  className = '',
}) {
  if (!open) return null;

  const handleConfirm = () => {
    onConfirm?.();
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
      aria-describedby="confirm-modal-desc"
    >
      <div
        className="flex w-full max-w-md flex-col overflow-hidden rounded-xl bg-white shadow-xl dark:bg-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          id="confirm-modal-title"
          className="shrink-0 border-b border-slate-200 px-5 py-4 font-semibold text-slate-800 dark:border-gray-600 dark:text-white"
        >
          {title}
        </div>
        <div id="confirm-modal-desc" className="flex-1 px-5 py-4 text-slate-600 dark:text-gray-300">
          {typeof message === 'string' ? <p className="m-0">{message}</p> : message}
        </div>
        <div className={`flex flex-wrap justify-end gap-2 border-t border-slate-200 px-5 py-4 dark:border-gray-600 ${className}`.trim()}>
          <Button type="button" variant="outline" fullWidth={false} onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button type="button" variant={confirmVariant} fullWidth={false} onClick={handleConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
