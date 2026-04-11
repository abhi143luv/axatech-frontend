import { useEffect, useState } from 'react';
import api from '../../api';
import { PageMeta } from '../../components/common';
import { LicensesHero, LicensesGrid } from '../../components/licenses';
import TssSingleRenewal from './TssSingleRenewal';

export default function TssRenewLicenses() {
  const [plans, setPlans] = useState([]);
  const [type, setType] = useState('single');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.tss(type)
      .then((items) => {
        const mapped = (items || []).map((p) => ({
          ...p,
          planName: p.title,
          enquiryType: 'tss-renewal',
        }));
        setPlans(mapped);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [type]);

  return (
    <>
      <PageMeta
        title="TSS Renewal Pricing - Axatech"
        description="Single User and Multi User TSS renewal pricing. Renew your Tally Software Subscription via enquiry."
      />

      <LicensesHero
        type={type}
        onTypeChange={setType}
        label="Pricing"
        title="TSS Renewal Pricing"
        subtitle="Choose Single User or Multi User TSS renewal plans. Renew via enquiry form."
      />

      <section className="py-20 md:py-24 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-5">
          <LicensesGrid plans={plans} loading={loading} />
        </div>
      </section>

      <TssSingleRenewal />
    </>
  );
}

