import { useEffect, useState } from 'react';
import api from '../../api';
import { Button, SectionHeader } from '../common';

const DEFAULT_TITLE = 'Tally License Pricing';
const DEFAULT_SUBTITLE =
  'Choose Single User or Multi User plans. Buy Now redirects to enquiry form.';
const FALLBACK_IMG = '/images/banner/TallyLicenes.jpg';

export default function LicensesHero({
  type,
  onTypeChange,
  label = 'Pricing',
  title,
  subtitle,
}) {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api
      .adminHeroBanners({ placement: 'licenses' })
      .then((res) => {
        if (cancelled) return;
        const list = Array.isArray(res) ? res : res?.items ?? [];
        const sorted = [...list].sort(
          (a, b) => (Number(a.sortOrder) || 0) - (Number(b.sortOrder) || 0)
        );
        setBanner(sorted[0] || null);
      })
      .catch(() => {
        if (!cancelled) setBanner(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const displayTitle = title ?? (banner?.title?.trim() || DEFAULT_TITLE);
  const displaySubtitle = subtitle ?? DEFAULT_SUBTITLE;
  const imgSrc = banner?.image?.trim() || FALLBACK_IMG;
  const imgAlt = banner?.title?.trim() || 'Tally license';

  return (
    <section className="hero-gradient-section py-20 md:py-24">
      <div className="max-w-6xl mx-auto px-5">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <SectionHeader
              label={label}
              title={displayTitle}
              subtitle={displaySubtitle}
              position="left"
              as="h1"
              labelClassName="text-white/90 dark:text-white"
              titleClassName="text-white dark:text-white"
              subtitleClassName="mb-8 text-white/90 dark:text-white/90"
            />
            <div className="flex justify-start">
              <div
                className="hero-glass-panel inline-flex p-1.5 gap-5 animate-fadeInUp"
                style={{ animationDelay: '0.32s' }}
              >
                <Button
                  type="button"
                  variant="ghost"
                  fullWidth={false}
                  onClick={() => onTypeChange('single')}
                  className={`min-w-[120px] px-6 py-3 rounded-lg text-sm shadow-md border transition-colors ${
                    type === 'single'
                      ? 'bg-white/25! text-white! border-white/50!'
                      : 'bg-transparent! text-white/90! border-transparent! hover:bg-white/15! hover:text-white!'
                  }`}
                >
                  Single User
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  fullWidth={false}
                  onClick={() => onTypeChange('multi')}
                  className={`min-w-[120px] px-6 py-3 rounded-lg text-sm shadow-md border transition-colors ${
                    type === 'multi'
                      ? 'bg-white/25! text-white! border-white/50!'
                      : 'bg-transparent! text-white/90! border-transparent! hover:bg-white/15! hover:text-white!'
                  }`}
                >
                  Multi User
                </Button>
              </div>
            </div>
          </div>
          <div className="animate-fadeInUp lg:justify-self-end" style={{ animationDelay: '0.2s' }}>
            <img
              src={imgSrc}
              alt={imgAlt}
              className="w-full max-w-[420px] rounded-2xl border border-white/20 shadow-2xl object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
