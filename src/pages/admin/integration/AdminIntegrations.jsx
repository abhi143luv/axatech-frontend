import { Link } from 'react-router-dom';

export default function AdminIntegrations() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h1 className="mb-4 text-2xl font-bold tracking-tight text-slate-800 dark:text-white">Integrations</h1>

      <div className="space-y-2">
        <Link
          to="/admin/integration-excel-import-content"
          className="block rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 hover:bg-white dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-100"
        >
          Excel Import Content
        </Link>
        <Link
          to="/admin/integration-third-party-content"
          className="block rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 hover:bg-white dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-100"
        >
          Third Party Content
        </Link>
        <Link
          to="/admin/integration-whatsapp-content"
          className="block rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 hover:bg-white dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-100"
        >
          WhatsApp Content
        </Link>
        <Link
          to="/admin/integration-sms-api-content"
          className="block rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 hover:bg-white dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-100"
        >
          SMS API Content
        </Link>
      </div>
    </section>
  );
}

