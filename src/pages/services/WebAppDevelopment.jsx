import { useEffect, useState } from 'react';
import api from '../../api';
import { PageMeta, SectionHeader, Loader, Button } from '../../components/common';
import {
  CodeSquareIcon,
  CogLoopIcon,
  RocketIcon,
  CloudIbmIcon,
  ShieldAltIcon,
  HtmlIcon,
  DataConfigurationIcon,
  JavascriptIcon,
  WhatsappIcon,
} from '../../components/icons';

const HIGHLIGHT_ICONS = [CodeSquareIcon, CogLoopIcon, RocketIcon];
const OFFERING_ICONS = [
  HtmlIcon,
  DataConfigurationIcon,
  JavascriptIcon,
  ShieldAltIcon,
  RocketIcon,
  CloudIbmIcon,
  CogLoopIcon,
  RocketIcon,
  CodeSquareIcon,
  WhatsappIcon,
  RocketIcon,
];

export default function WebAppDevelopment() {
  const [content, setContent] = useState(null);

  useEffect(() => {
    api.webAppDevelopmentContent
      .get()
      .then(setContent)
      .catch(console.error);
  }, []);

  if (!content) return <Loader className="min-h-screen" />;

  const highlights = Array.isArray(content.highlights) ? content.highlights : [];
  const offerings = Array.isArray(content.offerings) ? content.offerings : [];

  return (
    <>
      <PageMeta
        title={content.metaTitle || 'Web & App Development | Axatech'}
        description={
          content.metaDescription ||
          'End-to-end web and app development services by Axatech including frontend, backend, APIs, cloud, ERP, SaaS, and Tally-connected solutions.'
        }
        keywords={content.metaKeywords}
      />

      <section className="bg-linear-to-b from-slate-50 to-white pb-20 dark:from-gray-900 dark:to-gray-900/90">
        <div className="hero-gradient-section py-20">
          <div className="mx-auto max-w-4xl px-5">
          <SectionHeader
            label={content.label || 'Web & App Development'}
            title={content.title || 'Build Digital. Build Smart. Build with Axatech.'}
            subtitle={
              content.subtitle ||
              'From dynamic websites to enterprise-grade mobile apps, Axatech delivers end-to-end digital solutions that are fast, scalable, and built for Indian businesses.'
            }
            centered
            as="h1"
            inverse
            subtitleClassName="mb-0"
          />

          <div className="hero-glass-panel mt-6 rounded-2xl p-5">
            <p className="text-sm font-medium text-white/95">
              {content.introText ||
                'We design and build secure, scalable web and mobile solutions that align with your workflows and growth goals.'}
            </p>
          </div>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-6xl px-5">
          <div className="mb-10 grid gap-4 md:grid-cols-3">
            {highlights.map((item, i) => {
              const Icon = HIGHLIGHT_ICONS[i % HIGHLIGHT_ICONS.length];
              return (
                <article
                  key={`${item.title}-${i}`}
                className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-secondary/20 dark:text-secondary">
                  <Icon className="text-xl" />
                </div>
                  <h2 className="mb-2 text-base font-semibold text-gray-900 dark:text-white">{item.title}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
                </article>
              );
            })}
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {offerings.map((item, i) => {
              const ItemIcon = OFFERING_ICONS[i % OFFERING_ICONS.length];
              const points = Array.isArray(item.points) ? item.points : [];
              return (
                <article
                  key={`${item.label}-${i}`}
                  className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary dark:text-secondary">
                        {item.label}
                      </p>
                      <h3 className="mt-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                        {item.title}
                      </h3>
                    </div>
                    <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-primary dark:bg-gray-700 dark:text-secondary">
                      <ItemIcon className="text-xl" />
                    </div>
                  </div>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    {points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
          <div className="mt-10">
            <Button to={content.ctaPath || '/contact'} fullWidth={false} className="px-6">
              {content.ctaText || 'Talk To Our Team'}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
