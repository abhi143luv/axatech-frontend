import { Button } from '../../common';
import { OpenInNewIcon, DashboardDuoIcon } from '../../icons';

export default function DashboardWelcome() {
  return (
    <section className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-6 dark:border-gray-700 dark:from-gray-800 dark:to-gray-800/80">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-secondary/20 dark:text-secondary">
            <DashboardDuoIcon className="text-3xl" />
          </div>
          <div>
            <h2 className="m-0 text-lg font-semibold text-slate-800 dark:text-white">
              Welcome to Admin
            </h2>
            <p className="m-0 mt-1 text-sm text-slate-500 dark:text-gray-400">
              Manage your content, enquiries, products and more from here.
            </p>
          </div>
        </div>
        <Button
          to="/"
          variant="outline"
          size="sm"
          fullWidth={false}
          icon={<OpenInNewIcon className="text-lg" />}
          iconPosition="left"
          className="shrink-0"
        >
          View site
        </Button>
      </div>
    </section>
  );
}
