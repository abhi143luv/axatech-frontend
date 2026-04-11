import { Toaster as SonnerToaster } from 'sonner';
import { useTheme } from '../../context/ThemeContext';

/**
 * App-wide toast container.
 * Styled to match compact card toasts with icon badge + rounded close control.
 */
const baseToast =
  'group rounded-2xl border border-slate-200 !dark:bg-gray-800 bg-white !py-1 !px-2 !shadow-[0_6px_20px_rgba(2,6,23,0.08)] !dark:shadow-[0_6px_20px_rgba(255,255,255)';

export default function Toaster() {
  const { theme } = useTheme();

  return (
    <SonnerToaster
      position="top-right"
      theme={theme === 'dark' ? 'dark' : 'light'}
      richColors
      closeButton
      toastOptions={{
        duration: 4000,
        classNames: {
          toast: `${baseToast}`,
          content: 'gap-3',
          title: 'text-[13px] !font-semibold leading-6 text-slate-800 dark:text-gray-100',
          description: 'text-sm text-slate-500 dark:text-gray-400',
          icon: 'rounded-xl p-2',
          closeButton:
            '!h-5 !w-5 !rounded-full !right-0 !left-auto !border !border-slate-200 !bg-white !text-slate-500 !shadow-none hover:!bg-slate-100 dark:!border-gray-600 dark:!bg-gray-800 dark:!text-gray-300 dark:hover:!bg-gray-700 !top-14px',
          success: `${baseToast} toast-variant-success`,
          error: `${baseToast} toast-variant-error`,
          warning: `${baseToast} toast-variant-warning`,
          info: `${baseToast} toast-variant-info`,
          loading: `${baseToast} toast-variant-info`,
        },
      }}
    />
  );
}
