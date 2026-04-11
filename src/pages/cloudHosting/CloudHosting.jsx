import { useEffect, useState } from 'react';
import api from '../../api';
import { PageMeta } from '../../components/common';
import { CloudHostingHero, CloudHostingPlans } from '../../components/cloudHosting';

export default function CloudHosting() {
  const [shared, setShared] = useState([]);
  const [vps, setVps] = useState([]);
  const [type, setType] = useState('shared');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.cloud('shared'), api.cloud('vps')])
      .then(([s, v]) => { setShared(s); setVps(v); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <PageMeta
        title="Cloud Hosting - Shared & VPS Plans | Axatech"
        description="Tally cloud hosting: Shared and VPS server plans. Enquiry for pricing."
      />

      <CloudHostingHero
        title="Cloud Hosting"
        subtitle="Choose Shared Server or VPS Server plans based on your team size, performance needs, and business growth goals."
        type={type}
        onTypeChange={setType}
      />

      <section className="py-20 md:py-24 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-5">
          <CloudHostingPlans shared={shared} vps={vps} loading={loading} type={type} />
        </div>
      </section>
    </>
  );
}
