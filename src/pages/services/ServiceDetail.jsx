import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';
import { Loader, PageMeta } from '../../components/common';
import { ServiceDetailContent } from '../../components/services';

export default function ServiceDetail() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    api.service(slug).then(setService).catch(() => setService(null)).finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <Loader className="min-h-screen" />;
  }
  if (!service) {
    return (
      <div className="container py-16 text-center text-gray-600 dark:text-gray-400">
        Service not found.
      </div>
    );
  }

  return (
    <>
      <PageMeta title={`${service.title} - Axatech`} description={service.shortDescription || service.description} />

      <ServiceDetailContent service={service} />
    </>
  );
}
