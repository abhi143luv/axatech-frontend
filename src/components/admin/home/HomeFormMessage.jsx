export default function HomeFormMessage({ message }) {
  if (!message) return null;
  const isSuccess = message === 'Saved successfully.';
  return (
    <div
      className={`rounded-lg border px-4 py-3 text-sm ${
        isSuccess
          ? 'border-success-light bg-success-lighter text-success-dark dark:border-success-dark dark:bg-success-darker/30 dark:text-success-light'
          : 'border-error-light bg-error-lighter text-error-dark dark:border-error-dark dark:bg-error-darker/30 dark:text-error-light'
      }`}
    >
      {message}
    </div>
  );
}
