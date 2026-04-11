import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 dark:bg-gray-900">
      {/* Mobile: overlay sidebar. Desktop: always visible */}
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={() => setSidebarOpen(false)}
      />
      {/* Right side: header (with menu toggle on mobile) + main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader
          sidebarOpen={sidebarOpen}
          onMenuToggle={() => setSidebarOpen((o) => !o)}
        />
        <main className="min-h-0 flex-1 overflow-auto bg-slate-100 dark:bg-gray-900 py-4 px-4 md:py-7 md:px-8">
          <div className="mx-auto max-w-[1280px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
