import { useEffect, useMemo, useState } from 'react';
import api from '../../api';
import { SectionHeader } from '../common';

function normalizeHref(link) {
  if (!link || typeof link !== 'string') return undefined;
  const t = link.trim();
  if (!t) return undefined;
  if (/^https?:\/\//i.test(t) || /^mailto:/i.test(t) || /^tel:/i.test(t)) return t;
  return `https://${t}`;
}

export default function HomeLogoLoop() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await api.homeLogoLoop({
          status: 'active',
          sortKey: 'sortOrder',
          sortDirection: 'asc',
        });
        const list = Array.isArray(response?.items) ? response.items : Array.isArray(response) ? response : [];
        if (mounted) setItems(list);
      } catch (err) {
        console.error('Failed to load home logo loop items', err);
        if (mounted) setItems([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const logos = useMemo(
    () =>
      items
        .filter((item) => typeof item?.image === 'string' && item.image.trim())
        .map((item) => ({
          src: item.image,
          alt: item.name || 'logo',
          title: item.name || 'Logo',
          href: normalizeHref(item.link),
        })),
    [items]
  );

  if (logos.length === 0) return null;

  const doubled = [...logos, ...logos];
  const durationSec = Math.max(16, logos.length * 10);

  return (
    <section className="py-20 md:py-24 bg-gray-50/80 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
      <style>{`
        @keyframes home-logo-marquee {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }
        .home-logo-marquee-track {
          animation-name: home-logo-marquee;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .home-logo-marquee-track {
            animation: none !important;
            transform: translate3d(0, 0, 0) !important;
          }
        }
      `}</style>
      <div className="max-w-6xl mx-auto px-5">
        <SectionHeader
          label="Technology"
          title="Trusted Technologies We Build With"
          subtitle="From frontend to cloud infrastructure, we use reliable tools to deliver secure and scalable business solutions."
          centered={false}
          subtitleClassName="mb-10"
          dataAos="fade-up"
        />

        <div className="relative overflow-hidden py-2" aria-label="Technology partners">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-gray-50/95 to-transparent dark:from-gray-900"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-gray-50/95 to-transparent dark:from-gray-900"
            aria-hidden
          />

          <div
            className="home-logo-marquee-track flex w-max items-center gap-14"
            style={{ animationDuration: `${durationSec}s` }}
          >
            {doubled.map((logo, i) => {
              const inner = (
                <img
                  src={logo.src}
                  alt={logo.alt}
                  title={logo.title}
                  className="max-h-[46px] w-auto max-w-[160px] object-contain opacity-90 transition-opacity duration-200 hover:opacity-100 dark:opacity-80 dark:hover:opacity-100"
                  loading="lazy"
                  decoding="async"
                />
              );
              return (
                <div key={`${logo.src}-${i}`} className="flex h-[52px] shrink-0 items-center justify-center">
                  {logo.href ? (
                    <a
                      href={logo.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center outline-none ring-offset-2 ring-offset-gray-50 focus-visible:ring-2 focus-visible:ring-blue-500 dark:ring-offset-gray-900"
                    >
                      {inner}
                    </a>
                  ) : (
                    inner
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
