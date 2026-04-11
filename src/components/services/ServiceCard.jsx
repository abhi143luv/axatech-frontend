import { Button } from '../common';
import { ArrowRightIcon, CogLoopIcon } from '../icons';

export default function ServiceCard({ service, index = 0 }) {
  return (
    <div
      className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-7 shadow-sm dark:shadow-none transition-all duration-300 hover:border-primary/30 dark:hover:border-secondary/40 hover:shadow-xl hover:shadow-primary/5 dark:hover:shadow-none hover:-translate-y-1 flex flex-col animate-[home-fadeInUp_0.6s_ease-out_both]"
      style={{ animationDelay: `${0.4 + index * 0.08}s` }}
    >
      <span
        className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 dark:bg-secondary/20 text-primary dark:text-secondary text-lg font-bold mb-4 transition-all duration-200 group-hover:bg-primary/15 dark:group-hover:bg-secondary/30 group-hover:scale-105 shrink-0"
        aria-hidden
      >
        <CogLoopIcon className="text-3xl" />
      </span>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary dark:group-hover:text-secondary transition-colors duration-200">
        {service.title}
      </h2>
      <p className="flex-1 text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3 mb-6">
        {service.shortDescription || service.description}
      </p>
      <div className="flex flex-wrap gap-3">
        <Button to={`/services/${service.slug}`} variant="outline" fullWidth={false} className="inline-flex items-center gap-1.5">
          Learn more
          <ArrowRightIcon className="text-lg transition-transform duration-200 group-hover:translate-x-0.5" />
        </Button>
        <Button
          to="/contact"
          state={{ enquiryType: 'service', service: service._id, serviceName: service.title }}
          variant="primary"
          fullWidth={false}
        >
          Enquire
        </Button>
      </div>
    </div>
  );
}
