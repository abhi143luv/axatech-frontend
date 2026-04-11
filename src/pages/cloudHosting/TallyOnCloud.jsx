import { useEffect, useState } from 'react';
import api from '../../api';
import { Button, Loader, PageMeta, SectionHeader } from '../../components/common';
import { CheckCircleOutlineIcon, CogLoopIcon, RocketIcon } from '../../components/icons';

const FALLBACK_ICONS = [CheckCircleOutlineIcon, CogLoopIcon, RocketIcon];

export default function TallyOnCloud() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    api.tallyOnCloudContent
      .get()
      .then(setContent)
      .catch(console.error);
  }, []);

  if (!content) return <Loader className="min-h-screen" />;

  const highlights = Array.isArray(content.highlights) ? content.highlights : [];
  const benefits = Array.isArray(content.benefits) ? content.benefits : [];

  return (
    <>
      <PageMeta
        title={content.metaTitle || 'Tally on Cloud | Axatech'}
        description={content.metaDescription || 'Run your existing Tally license securely on cloud and access it from anywhere.'}
        keywords={content.metaKeywords}
      />

      <section className="bg-linear-to-b from-slate-50 to-white pb-20 md:pb-24 dark:from-gray-900 dark:to-gray-900/90">
        <div className="hero-gradient-section py-20 md:py-24">
          <div className="mx-auto max-w-4xl px-5">
          <SectionHeader
            label={content.label || '3.1 Tally on Cloud'}
            title={content.title || 'Access Tally Anytime, Anywhere - Securely'}
            subtitle={
              content.subtitle ||
              'Run your existing Tally license on a managed cloud environment with uninterrupted access from any location.'
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
                'Best suited for organizations that need secure remote access, reliable uptime, and smooth multi-branch Tally operations.'}
            </p>
          </div>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-5xl px-5">

          <div data-aos="fade-up" className="grid gap-4 md:grid-cols-3">
            {highlights.map((highlight, idx) => {
              const HighlightIcon = FALLBACK_ICONS[idx % FALLBACK_ICONS.length];
              return (
                <article
                  key={`${highlight.title}-${idx}`}
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
            <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">{content.benefitsTitle || 'What You Get'}</h2>
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-gray-600 dark:text-gray-300">
              {benefits.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-5 text-sm sm:text-base text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Ideal for:</span> {content.idealForText || 'Businesses with remote teams or multiple branches.'}
            </p>
          </div>

          <div className="mt-8">
            <Button
              to={content.ctaPath || '/contact'}
              fullWidth={false}
              state={{ enquiryType: 'cloud', cloudMode: 'tally-on-cloud' }}
              className="px-6"
            >
              {content.ctaText || 'Start Tally on Cloud'}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
