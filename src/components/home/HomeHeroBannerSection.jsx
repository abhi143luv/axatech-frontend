import { useCallback, useEffect, useMemo, useState } from 'react';

const AUTO_MS = 5000;

function resolveImageUrl(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('http')) return trimmed;
  return `/uploads/${trimmed.replace(/^.*[\\/]/, '')}`;
}

/**
 * CMS hero banners as a horizontal carousel (auto-slide when more than one slide).
 * @param {{ _id?: string; image: string; title?: string }[]} slides
 */
export default function HomeHeroBannerSection({ slides = [] }) {
  const valid = useMemo(
    () =>
      slides
        .map((s, i) => ({
          key: s._id || `slide-${i}`,
          src: resolveImageUrl(s.image),
          title: (s.title && String(s.title).trim()) || '',
        }))
        .filter((s) => s.src),
    [slides]
  );

  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [valid.length]);

  const go = useCallback(
    (dir) => {
      if (valid.length <= 1) return;
      setIndex((j) => (j + dir + valid.length) % valid.length);
    },
    [valid.length]
  );

  useEffect(() => {
    if (valid.length <= 1) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }
    const id = window.setInterval(() => {
      setIndex((j) => (j + 1) % valid.length);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [valid.length]);

  if (valid.length === 0) return null;

  const n = valid.length;
  // Percent translateX is relative to the *track* width. Track is n× viewport wide, so each step is (100/n)% of the track.
  const trackWidthPct = n * 100;
  const slideBasisPct = 100 / n;
  const translateXPct = (index * 100) / n;

  return (
    <section
      className="w-full bg-slate-950 dark:bg-black"
      aria-roledescription="carousel"
      aria-label="Promotional banners"
    >
      <div className="relative w-full overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{
            width: `${trackWidthPct}%`,
            transform: `translate3d(-${translateXPct}%, 0, 0)`,
          }}
        >
          {valid.map((slide) => (
            <div
              key={slide.key}
              className="min-w-0 shrink-0 overflow-hidden"
              style={{ flex: `0 0 ${slideBasisPct}%` }}
            >
              <img
                src={slide.src}
                alt={slide.title || 'Promotional banner'}
                className="block h-[clamp(200px,42vw,640px)] w-full max-w-none bg-slate-950 object-cover object-center dark:bg-black"
                loading="lazy"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {valid.length > 1 && (
          <>
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-linear-to-t from-black/70 via-black/25 to-transparent"
              aria-hidden
            />
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-3 top-1/2 z-30 -translate-y-1/2 cursor-pointer rounded-full border border-white/10 bg-black/45 p-2.5 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-black/60 md:left-5"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-3 top-1/2 z-30 -translate-y-1/2 cursor-pointer rounded-full border border-white/10 bg-black/45 p-2.5 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-black/60 md:right-5"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div
              className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-2 shadow-lg backdrop-blur-md md:bottom-5 md:gap-2.5 md:px-4"
              role="tablist"
              aria-label="Banner slides"
            >
              {valid.map((slide, i) => (
                <button
                  key={`dot-${slide.key}`}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Slide ${i + 1} of ${valid.length}`}
                  onClick={() => setIndex(i)}
                  className={`cursor-pointer rounded-full transition-all duration-300 ${
                    i === index
                      ? 'h-2 w-8 bg-primary shadow-sm ring-2 ring-white/25'
                      : 'h-2 w-2 bg-white/45 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function ChevronLeft({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
