import { Button, PageMeta, SectionHeader } from '../../components/common';
import { CheckCircleOutlineIcon, CogLoopIcon, RocketIcon } from '../../components/icons';

const BENEFITS = [
  'Network-wide Tally updates',
  'Connected services including Tally-to-bank, e-Invoice and more',
  'Centralized renewal management through Axatech',
  'Bulk renewal discounts available',
];

const RENEWAL_HIGHLIGHTS = [
  {
    title: 'Organization-Wide Compliance',
    description: 'Keep all users on updated, compliant versions with fewer interruptions across departments.',
    icon: CheckCircleOutlineIcon,
  },
  {
    title: 'Unified Team Operations',
    description: 'Ensure all connected users work on a stable, synchronized platform with smoother collaboration.',
    icon: CogLoopIcon,
  },
  {
    title: 'Scalable Support Framework',
    description: 'Get dependable assistance and renewal planning designed for growing multi-user businesses.',
    icon: RocketIcon,
  },
];

export default function TssMultiRenewal() {
  return (
    <>
      <PageMeta
        title="Multi User TSS Renewal | Axatech"
        description="Renew TSS for your multi-user Tally setup and keep your entire team on the latest compliant version."
      />

      <section className="bg-linear-to-b from-slate-50 to-white py-20 md:py-24 dark:from-gray-900 dark:to-gray-900/90">
        <div className="mx-auto max-w-5xl px-5">
          <SectionHeader
            label="2.2 Multi User TSS Renewal"
            title="Keep Your Team Always Connected"
            subtitle="Renew TSS for your entire team and ensure uninterrupted access to updates, connected services and support."
            centered={false}
            as="h1"
            subtitleClassName="mb-8"
            dataAos="fade-up"
          />

          <div data-aos="fade-up" className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-5 dark:border-secondary/30 dark:bg-secondary/10">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
              Built for teams and enterprises that need continuous updates, centralized control, and reliable Tally performance at scale.
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
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Benefits Included</h2>
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
              state={{ enquiryType: 'tss-renewal', tssType: 'multi-user' }}
              className="px-6"
            >
              Renew Multi User TSS
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
