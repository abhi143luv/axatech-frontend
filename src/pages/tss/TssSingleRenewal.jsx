import { Button, PageMeta, SectionHeader } from '../../components/common';
import { CheckCircleOutlineIcon, CogLoopIcon, RocketIcon } from '../../components/icons';

const BENEFITS = [
  'Latest updates including GST, TDS and compliance changes',
  'Remote access features',
  'Priority support from Axatech',
  'Annual renewal at competitive pricing',
];

const RENEWAL_HIGHLIGHTS = [
  {
    title: 'Always Compliance-Ready',
    description: 'Stay aligned with the latest statutory requirements and regulatory updates without disruption.',
    icon: CheckCircleOutlineIcon,
  },
  {
    title: 'Smooth Day-to-Day Operations',
    description: 'Keep billing, accounting, and reporting workflows stable with timely subscription continuity.',
    icon: CogLoopIcon,
  },
  {
    title: 'Faster Support Response',
    description: 'Get dependable priority assistance from the Axatech team whenever you need expert guidance.',
    icon: RocketIcon,
  },
];

export default function TssSingleRenewal() {
  return (
    <>
      <PageMeta
        title="Single User TSS Renewal | Axatech"
        description="Renew your single-user TSS and keep Tally up to date with GST, e-Invoice and compliance updates."
      />

      <section className="bg-linear-to-b from-slate-50 to-white py-20 md:py-24 dark:from-gray-900 dark:to-gray-900/90">
        <div className="mx-auto max-w-5xl px-5">
          <SectionHeader
            label="2.1 Single User TSS Renewal"
            title="Keep Your Tally Always Up to Date"
            subtitle="Renew your single-user Tally license software subscription and continue uninterrupted compliance and support."
            centered={false}
            as="h1"
            subtitleClassName="mb-8"
            dataAos="fade-up"
          />

          <div data-aos="fade-up" className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-5 dark:border-secondary/30 dark:bg-secondary/10">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Perfect for single-user businesses that require uninterrupted compliance, trusted support, and consistent Tally performance.
            </p>
          </div>

          <div data-aos="fade-up" className="grid gap-4 md:grid-cols-3">
            {RENEWAL_HIGHLIGHTS.map((highlight) => {
              const HighlightIcon = highlight.icon;
              return (
                <article
                  key={highlight.title}
                  className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-secondary/20 dark:text-secondary">
                    <HighlightIcon className="text-xl" />
                  </div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">{highlight.title}</h2>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{highlight.description}</p>
                </article>
              );
            })}
          </div>

          <div data-aos="fade-up" className="mt-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
            <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Benefits Included</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
              {BENEFITS.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <Button
              to="/contact"
              fullWidth={false}
              state={{ enquiryType: 'tss-renewal', tssType: 'single-user' }}
              className="px-6"
            >
              Renew Single User TSS
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
