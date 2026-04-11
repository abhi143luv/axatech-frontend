import { Button, SectionHeader } from '../common';
import { FormatListBulletedIcon } from '../icons';

export default function HomeLicenseHighlights({ licenses }) {
  if (!licenses?.length) return null;

  return (
    <section className="py-20 md:py-24 bg-gray-50/80 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-5">
        <SectionHeader
          label="Pricing"
          title="License Pricing Highlights"
          subtitle="Choose the right Tally license for your business. Transparent pricing, no hidden fees."
          centered={false}
          subtitleClassName="mb-10"
          dataAos="fade-up"
        />

        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {licenses.slice(0, 3).map((plan, i) => (
            <div
              key={plan._id}
              className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-7 shadow-sm dark:shadow-none transition-all duration-300 hover:border-primary/30 dark:hover:border-secondary/40 hover:shadow-xl hover:shadow-primary/5 dark:hover:shadow-none hover:-translate-y-1" data-aos="fade-up"
            >
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white" data-aos="fade-up">
                {plan.planName}
              </h3>
              <p className="text-2xl sm:text-3xl font-bold text-primary dark:text-secondary mb-3" data-aos="fade-up">
                ₹{plan.price?.toLocaleString()}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-1">/ license</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 min-h-10 line-clamp-2" data-aos="fade-up">
                {plan.description}
              </p>
              <Button to="/licenses" variant="primary" fullWidth>
                View Plan
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center" data-aos="fade-up">
          <Button to="/licenses" variant="outline" fullWidth={false} className="inline-flex items-center justify-center gap-2">
            <FormatListBulletedIcon className="text-[20px] shrink-0" />
            All Tally Plans
          </Button>
        </div>
      </div>
    </section>
  );
}
