import { useEffect, useState } from 'react';
import api from '../../api';
import { PageMeta } from '../../components/common';
import { TechnologiesHero, TechnologiesByCategory } from '../../components/technologies';

export default function Technologies() {
  const [technologies, setTechnologies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.technologies().then(setTechnologies).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageMeta
        title="Technologies We Work With | Axatech"
        description="Frontend, Backend and Database technologies we work with."
      />

      <TechnologiesHero title="Technologies We Work With" />

      <section className="py-16 md:py-20 bg-linear-to-b from-gray-50/90 to-white dark:from-gray-900 dark:to-gray-900/95 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-5">
          <TechnologiesByCategory technologies={technologies} loading={loading} />
        </div>
      </section>
    </>
  );
}
