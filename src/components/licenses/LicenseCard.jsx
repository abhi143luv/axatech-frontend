import { Button } from '../common';
import { CheckMarkIcon } from '../icons';

export default function LicenseCard({ plan, index = 0 }) {
  return (
    <div
      className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-none transition-all duration-300 hover:border-primary/30 dark:hover:border-secondary/40 hover:shadow-xl hover:shadow-primary/5 dark:hover:shadow-none hover:-translate-y-1 animate-fadeInUpSlow"
      style={{ animationDelay: `${0.35 + index * 0.08}s` }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {plan.planName}
        </h2>
        <span className="shrink-0 inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 dark:bg-secondary/20 text-primary dark:text-secondary text-sm font-bold transition-all duration-200 group-hover:bg-primary/15 dark:group-hover:bg-secondary/30 group-hover:scale-105">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <p className="text-2xl sm:text-3xl font-bold text-secondary dark:text-accent mb-4">
        ₹{plan.price?.toLocaleString()}
      </p>
      {plan.description && (
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-5">
          {plan.description}
        </p>
      )}
      {plan.features?.length > 0 && (
        <ul className="list-none my-5 space-y-2">
          {plan.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              <CheckMarkIcon className="text-secondary dark:text-accent shrink-0 mt-0.5 size-4" />
              {f}
            </li>
          ))}
        </ul>
      )}
      <Button
        to="/contact"
        state={{ enquiryType: 'license', licensePlan: plan._id, planName: plan.planName }}
        variant="primary"
        fullWidth
        className="mt-6"
      >
        Buy Now
      </Button>
    </div>
  );
}
