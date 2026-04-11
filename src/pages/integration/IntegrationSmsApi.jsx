import { useEffect, useState } from 'react';
import api from '../../api';
import { Button, Loader, PageMeta, SectionHeader } from '../../components/common';
import { CheckCircleOutlineIcon, CogLoopIcon, RocketIcon } from '../../components/icons';

const FALLBACK_ICONS = [RocketIcon, CheckCircleOutlineIcon, CogLoopIcon];

export default function IntegrationSmsApi() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    api.integrationSmsApiContent
      .get()
      .then(setContent)
      .catch(console.error);
  }, []);

  if (!content) return <Loader className="min-h-screen" />;

  const highlights = Array.isArray(content.highlights) ? content.highlights : [];
  const points = Array.isArray(content.points) ? content.points : [];

  return (
    <>
      <PageMeta
        title={content.metaTitle || 'SMS API Integration | Axatech'}
        description={content.metaDescription || 'Automate customer notifications from Tally with SMS API integrations.'}
        keywords={content.metaKeywords}
      />
      <section className="bg-linear-to-b from-slate-50 to-white pb-20 md:pb-24 dark:from-gray-900 dark:to-gray-900/90">
        <div className="hero-gradient-section py-20 md:py-24">
          <div className="mx-auto max-w-4xl px-5">
          <SectionHeader
            label={content.label || '6.4 SMS API Integration'}
            title={content.title || 'Automated SMS Notifications from Tally'}
            subtitle={content.subtitle || 'Keep customers informed with reliable SMS alerts and reminders.'}
            centered
            as="h1"
            inverse
            subtitleClassName="mb-0"
            dataAos="fade-up"
          />

          <div data-aos="fade-up" className="hero-glass-panel mb-6 rounded-2xl p-5">
            <p className="text-sm font-medium text-white/95">
              {content.introText ||
                'Great for businesses that depend on timely billing, collections, and customer confirmation updates.'}
            </p>
          </div>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-5xl px-5">

          <div data-aos="fade-up" className="grid gap-4 md:grid-cols-3">
            {highlights.map((item, idx) => {
              const ItemIcon = FALLBACK_ICONS[idx % FALLBACK_ICONS.length];
              return (
                <article
                  key={`${item.title}-${idx}`}
                  className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-secondary/20 dark:text-secondary">
                    <ItemIcon className="text-xl" />
                  </div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">{item.title}</h2>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                </article>
              );
            })}
          </div>

          <div data-aos="fade-up" className="mt-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8">
            <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Key Features</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
              {points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          <div className="mt-8">
            <Button
              to={content.ctaPath || '/contact'}
              fullWidth={false}
              state={{ enquiryType: 'integration', integrationType: 'sms-api' }}
              className="px-6"
            >
              {content.ctaText || 'Setup SMS API Integration'}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
