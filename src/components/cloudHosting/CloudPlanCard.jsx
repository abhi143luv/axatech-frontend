import { Button } from '../common';
import { CloudIbmIcon } from '../icons';

export default function CloudPlanCard({ plan, index = 0 }) {
  return (
    <div
      className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-7 shadow-sm dark:shadow-none transition-all duration-300 hover:border-primary/30 dark:hover:border-secondary/40 hover:shadow-xl hover:shadow-primary/5 dark:hover:shadow-none hover:-translate-y-1 flex flex-col animate-[home-fadeInUp_0.6s_ease-out_both]"
      style={{ animationDelay: `${0.4 + index * 0.08}s` }}
    >
      <span
        className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 dark:bg-secondary/20 text-primary dark:text-secondary mb-4 transition-all duration-200 group-hover:bg-primary/15 dark:group-hover:bg-secondary/30 group-hover:scale-105 shrink-0"
        aria-hidden
      >
        <CloudIbmIcon className="text-2xl" />
      </span>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary dark:group-hover:text-secondary transition-colors duration-200">
        {plan.planName}
      </h3>
      <p className="text-2xl sm:text-3xl font-bold text-primary dark:text-secondary mb-3">
        ₹{plan.price?.toLocaleString()}
        <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">/{plan.period || 'month'}</span>
      </p>
      {plan.description && (
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed flex-1 line-clamp-2">
          {plan.description}
        </p>
      )}
      {plan.features?.length > 0 && (
        <ul className="list-none space-y-2 my-4 shrink-0">
          {plan.features.map((f, i) => (
            <li key={i} className="pl-5 relative text-gray-600 dark:text-gray-400 text-sm before:content-['✓'] before:absolute before:left-0 before:text-secondary dark:before:text-accent">
              {f}
            </li>
          ))}
        </ul>
      )}
      <Button
        to="/contact"
        state={{ enquiryType: 'cloud', cloudPlan: plan._id, planName: plan.planName }}
        variant="primary"
        fullWidth
        className="mt-auto"
      >
        Enquiry
      </Button>
    </div>
  );
}
