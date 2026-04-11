import { useEffect, useState } from 'react';
import api from '../../api';
import { Loader, PageMeta } from '../../components/common';
import { ServicesHero, ServicesGrid } from '../../components/services';

const ITEMS_PER_PAGE = 12;

export default function Services() {
  const [services, setServices] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.services({ page, limit: ITEMS_PER_PAGE })
      .then((res) => {
        const list = Array.isArray(res)
          ? res
          : Array.isArray(res?.services)
            ? res.services
            : [];
        const apiTotalPages = Number(
          res?.pages ?? res?.totalPages ?? res?.pagination?.totalPages ?? 0
        );
        const hasApiPagination = apiTotalPages > 0;
        setTotalPages(
          hasApiPagination ? apiTotalPages : Math.max(1, Math.ceil(list.length / ITEMS_PER_PAGE))
        );
        setServices(
          hasApiPagination
            ? list
            : list.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <>
      <PageMeta
        title="Services - Tally Customization, Cloud, Integration | Axatech"
        description="Tally Customization, Cloud Hosting, WhatsApp, Zoho & Zakya Integration, API & Automation services."
      />

      <ServicesHero
        title="Our Services"
        subtitle="Tally Customization, Cloud Hosting, WhatsApp Integration, Zoho & Zakya, API & Automation."
      />

      <section className="py-20 md:py-24 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-5">
          {loading ? (
            <Loader className="min-h-[50vh]" />
          ) : (
            <ServicesGrid
              services={services}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          )}
        </div>
      </section>
    </>
  );
}
