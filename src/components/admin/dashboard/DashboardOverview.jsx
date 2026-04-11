import { Link } from 'react-router-dom';
import { HomeContentIcon, ProductsIcon, EnquiriesIcon, CloudPlansIcon } from '../../icons';

const OVERVIEW_ITEMS = [
  {
    title: 'Content',
    description: 'Home page, blogs & services',
    Icon: HomeContentIcon,
    to: '/admin/home',
  },
  {
    title: 'Products & Tally',
    description: 'Add-ons and license plans',
    Icon: ProductsIcon,
    to: '/admin/products',
  },
  {
    title: 'Enquiries',
    description: 'Contact form submissions',
    Icon: EnquiriesIcon,
    to: '/admin/enquiries',
  },
  {
    title: 'Cloud & Categories',
    description: 'Cloud plans and categories',
    Icon: CloudPlansIcon,
    to: '/admin/cloud',
  },
];

export default function DashboardOverview() {
  return (
    <section className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-slate-200 px-5 py-4 text-base font-semibold text-slate-700 dark:border-gray-600 dark:text-gray-200">
        Overview
      </div>
      <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
        {OVERVIEW_ITEMS.map(({ title, description, Icon, to }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col rounded-lg border border-slate-200 bg-slate-50/50 p-4 no-underline text-inherit transition-all duration-200 hover:border-slate-300 hover:bg-slate-100 dark:border-gray-600 dark:bg-gray-700/30 dark:hover:border-gray-500 dark:hover:bg-gray-700/50"
          >
            <Icon className="mb-2 text-2xl text-slate-500 dark:text-secondary" />
            <span className="font-medium text-slate-800 dark:text-white">{title}</span>
            <span className="mt-0.5 text-sm text-slate-500 dark:text-gray-400">{description}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
