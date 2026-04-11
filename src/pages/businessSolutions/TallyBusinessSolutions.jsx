import { useEffect, useState } from 'react';
import api from '../../api';
import { Button, Loader, PageMeta, SectionHeader } from '../../components/common';
import { CheckCircleOutlineIcon, CogLoopIcon, RocketIcon } from '../../components/icons';

const FALLBACK_ICONS = [CheckCircleOutlineIcon, CogLoopIcon, RocketIcon];

export default function TallyBusinessSolutions() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    api.tallyBusinessSolutionsContent.get().then(setContent).catch(console.error);
  }, []);

  if (!content) return <Loader className="min-h-screen" />;

  const highlights = Array.isArray(content.highlights) ? content.highlights : [];
  const solutions = Array.isArray(content.solutions) ? content.solutions : [];

  return (
    <>
      <PageMeta
        title={content.metaTitle || 'Tally Business Solutions | Axatech'}
        description={
          content.metaDescription ||
          'Tally business solutions including data synchronization, e-invoice, e-way bill, migration, training, and health audits.'
        }
        keywords={content.metaKeywords}
      />

      <section className="bg-linear-to-b from-slate-50 to-white pb-20 md:pb-24 dark:from-gray-900 dark:to-gray-900/90">
        <div className="hero-gradient-section py-20 md:py-24">
          <div className="mx-auto max-w-4xl px-5">
          <SectionHeader
            label={content.pageLabel || 'Tally Services'}
            title={content.pageTitle || 'Advanced Tally Solutions for Growing Businesses'}
            subtitle={
              content.pageSubtitle ||
              'Explore specialized Tally services that improve control, compliance, and operational efficiency.'
            }
            centered
            as="h1"
            inverse
            subtitleClassName="mb-0"
            dataAos="fade-up"
          />

          <div data-aos="fade-up" className="hero-glass-panel mb-6 rounded-2xl p-5">
            <p className="text-sm font-medium text-white/95">
              {content.introText ||
                'End-to-end Tally business services tailored to simplify operations, strengthen compliance, and support sustainable growth.'}
            </p>
          </div>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-5xl px-5">

          <div data-aos="fade-up" className="mb-6 grid gap-4 md:grid-cols-3">
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

          <div data-aos="fade-up" className="space-y-5">
            {solutions.map((item, idx) => (
              <article
                key={`${item.label}-${idx}`}
                className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8"
              >
                <p data-aos="fade-up" className="text-xs sm:text-sm font-semibold uppercase tracking-wide text-primary dark:text-secondary mb-2">
                  {item.label}
                </p>
                <h2 data-aos="fade-up" className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                  {item.title}
                </h2>
                <ul data-aos="fade-up" className="list-disc pl-5 space-y-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  {(item.points || []).map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="mt-8">
            <Button to={content.ctaPath || '/contact'} fullWidth={false} state={{ enquiryType: 'tally-business-solutions' }} className="px-6">
              {content.ctaText || 'Request Consultation'}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
