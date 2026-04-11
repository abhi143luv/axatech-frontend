import LicenseCard from './LicenseCard';
import { Loader } from '../common';

export default function LicensesGrid({ plans, loading }) {
  if (loading) {
    return <Loader className="min-h-[40vh]" />;
  }
  if (!plans?.length) {
    return (
      <div className="text-center py-16 px-5 animate-fadeInUp">
        <p className="text-gray-500 dark:text-gray-400 text-base max-w-md mx-auto">
          No plans available for this type. Check back later.
        </p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8">
      {plans.map((plan, index) => (
        <LicenseCard key={plan._id} plan={plan} index={index} />
      ))}
    </div>
  );
}
