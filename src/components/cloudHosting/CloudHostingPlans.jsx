import CloudPlanCard from './CloudPlanCard';
import { Loader } from '../common';

export default function CloudHostingPlans({
  shared = [],
  vps = [],
  loading = false,
  type = 'shared',
}) {
  const showShared = type === 'shared';
  const showVps = type === 'vps';

  if (loading) {
    return <Loader className="min-h-[40vh]" />;
  }
  if ((showShared && shared.length === 0) || (showVps && vps.length === 0)) {
    return (
      <div className="text-center py-16 px-5">
        <p className="text-gray-500 dark:text-gray-400 text-base max-w-md mx-auto">
          No plans available for this selection. Contact us for cloud hosting options.
        </p>
      </div>
    );
  }
  return (
    <>
      {showShared && shared.length > 0 && (
        <div className="mb-12 last:mb-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 animate-[home-fadeInUp_0.5s_ease-out_0.2s_both]">
            Shared Server Plans
          </h2>
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {shared.map((plan, i) => (
              <CloudPlanCard key={plan._id} plan={plan} index={i} />
            ))}
          </div>
        </div>
      )}
      {showVps && vps.length > 0 && (
        <div className="mb-12 last:mb-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 animate-[home-fadeInUp_0.5s_ease-out_0.2s_both]">
            VPS Server Plans
          </h2>
          <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {vps.map((plan, i) => (
              <CloudPlanCard key={plan._id} plan={plan} index={i} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
