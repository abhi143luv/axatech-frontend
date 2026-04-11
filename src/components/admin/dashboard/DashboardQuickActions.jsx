import { Button } from '../../common';
import { HomeContentIcon, EnquiriesIcon, LicensesIcon, ProductsIcon } from '../../icons';

export default function DashboardQuickActions() {
  return (
    <section className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-slate-200 px-5 py-4 text-base font-semibold text-slate-700 dark:border-gray-600 dark:text-gray-200">
        Quick actions
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-3">
          <Button
            to="/admin/home"
            variant="outline"
            fullWidth={false}
            className="min-w-[140px]"
            icon={<HomeContentIcon />}
            iconPosition="left"
          >
            Edit Home Content
          </Button>
          <Button
            to="/admin/enquiries"
            variant="outline"
            fullWidth={false}
            className="min-w-[140px]"
            icon={<EnquiriesIcon />}
            iconPosition="left"
          >
            View Enquiries
          </Button>
          <Button
            to="/admin/licenses"
            variant="outline"
            fullWidth={false}
            className="min-w-[140px]"
            icon={<LicensesIcon />}
            iconPosition="left"
          >
            Tally Plans
          </Button>
          <Button
            to="/admin/products"
            variant="outline"
            fullWidth={false}
            className="min-w-[140px]"
            icon={<ProductsIcon />}
            iconPosition="left"
          >
            Products
          </Button>
        </div>
      </div>
    </section>
  );
}
