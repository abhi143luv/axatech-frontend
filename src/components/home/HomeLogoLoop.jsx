import { useEffect, useMemo, useState } from 'react';
import api from '../../api';
import LogoLoop from '../common/LogoLoop';
import { SectionHeader } from '../common';

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
          href: item.link || undefined,
        })),
    [items]
  );

  if (logos.length === 0) return null;

  return (
    <section className="py-20 md:py-24 bg-gray-50/80 dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-5">
        <SectionHeader
          label="Technology"
          title="Trusted Technologies We Build With"
          subtitle="From frontend to cloud infrastructure, we use reliable tools to deliver secure and scalable business solutions."
          centered={false}
          subtitleClassName="mb-10"
          dataAos="fade-up"
        />

        <LogoLoop
          logos={logos}
          speed={100}
          direction="left"
          logoHeight={46}
          gap={56}
          hoverSpeed={0}
          scaleOnHover
          fadeOut
          ariaLabel="Technology partners"
          className="py-2 [--logoloop-fadeColorAuto:#f8fafc] dark:[--logoloop-fadeColorAuto:#111827]"
        />
      </div>
    </section>
  );
}
