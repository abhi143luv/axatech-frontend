import { useEffect, useState } from 'react';
import api from '../../../api';
import {
  DashboardStats,
  DashboardQuickActions,
  DashboardWelcome,
  DashboardOverview,
  DashboardTips,
} from '../../../components/admin/dashboard';
import { Loader } from '../../../components/common';

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ enquiries: 0, newEnquiries: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.admin.enquiries.list(),
      api.admin.enquiries.list({ status: 'New' }),
    ])
      .then(([all, newList]) => {
        setCounts({
          enquiries: all.total ?? (all.enquiries?.length ?? 0),
          newEnquiries: newList.enquiries?.length ?? 0,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loader className="min-h-screen" />;
  }

  return (
    <div className="mx-auto max-w-[1280px]">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="m-0 text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
          Dashboard
        </h1>

      </header>
      <DashboardWelcome />
      <DashboardStats counts={counts} />
      <DashboardQuickActions />
      <DashboardOverview />
      <DashboardTips />
    </div>
  );
}
