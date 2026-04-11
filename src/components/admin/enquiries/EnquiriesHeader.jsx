import { Link } from 'react-router-dom';

export default function EnquiriesHeader({ statusFilter }) {
  return (
    <>
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="m-0 text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
          Enquiries / Leads
        </h1>
      </header>

      <p className="-mt-2 mb-4 text-sm text-slate-500 dark:text-gray-400">
        Update status (New → Contacted → Closed) and add notes.
      </p>

      {/* <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="p-5">
          <div className="mb-4 flex flex-wrap gap-2">
            <Link
              to="/admin/enquiries"
              className={`rounded-lg border px-4 py-2 text-sm font-medium no-underline transition-colors ${
                !statusFilter
                  ? 'border-primary bg-primary text-white dark:border-primary dark:bg-primary dark:text-white'
                  : 'border-gray-200 bg-slate-100 text-slate-500 hover:bg-gray-200 hover:text-slate-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-gray-200'
              }`}
            >
              All
            </Link>
            <Link
              to="/admin/enquiries?status=New"
              className={`rounded-lg border px-4 py-2 text-sm font-medium no-underline transition-colors ${
                statusFilter === 'New'
                  ? 'border-primary bg-primary text-white dark:border-primary dark:bg-primary dark:text-white'
                  : 'border-gray-200 bg-slate-100 text-slate-500 hover:bg-gray-200 hover:text-slate-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-gray-200'
              }`}
            >
              New
            </Link>
            <Link
              to="/admin/enquiries?status=Contacted"
              className={`rounded-lg border px-4 py-2 text-sm font-medium no-underline transition-colors ${
                statusFilter === 'Contacted'
                  ? 'border-primary bg-primary text-white dark:border-primary dark:bg-primary dark:text-white'
                  : 'border-gray-200 bg-slate-100 text-slate-500 hover:bg-gray-200 hover:text-slate-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-gray-200'
              }`}
            >
              Contacted
            </Link>
            <Link
              to="/admin/enquiries?status=Closed"
              className={`rounded-lg border px-4 py-2 text-sm font-medium no-underline transition-colors ${
                statusFilter === 'Closed'
                  ? 'border-primary bg-primary text-white dark:border-primary dark:bg-primary dark:text-white'
                  : 'border-gray-200 bg-slate-100 text-slate-500 hover:bg-gray-200 hover:text-slate-700 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-gray-200'
              }`}
            >
              Closed
            </Link>
          </div>
        </div>
      </div> */}
    </>
  );
}

