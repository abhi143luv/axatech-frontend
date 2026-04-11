import { useAuth } from '../context/AuthContext';
import { Button, PageMeta } from '../components/common';

export default function Dashboard() {
  const { user } = useAuth();
  const initials = (user?.name || 'U')
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <PageMeta title="Profile - Axatech" />
      <section className="min-h-[calc(100vh-120px)] bg-gray-50/80 py-14 dark:bg-gray-900">
        <div className="mx-auto max-w-5xl px-5">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary dark:text-secondary">
              My Account
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Profile
            </h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Manage your account details and contact information.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-base font-semibold text-primary dark:bg-secondary/20 dark:text-secondary">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-gray-900 dark:text-white">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Customer Account</p>
                </div>
              </div>
              <Button to="/contact" variant="primary" fullWidth={false}>
                Submit an enquiry
              </Button>
            </article>

            <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:col-span-2">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Account Details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-200/80 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Email</p>
                  <p className="mt-1 break-all text-sm font-medium text-gray-900 dark:text-gray-100">{user?.email || '-'}</p>
                </div>
                <div className="rounded-xl border border-gray-200/80 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Phone</p>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">{user?.phone || '-'}</p>
                </div>
                <div className="rounded-xl border border-gray-200/80 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900/40 sm:col-span-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Company</p>
                  <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">{user?.company || '-'}</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
