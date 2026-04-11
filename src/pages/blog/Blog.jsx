import { useEffect, useState } from 'react';
import api from '../../api';
import { PageMeta } from '../../components/common';
import { BlogHero, BlogGrid } from '../../components/blog';

export default function Blog() {
  const [data, setData] = useState({ blogs: [], total: 0, pages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.blogs({ page, limit: 9 }).then(setData).catch(console.error).finally(() => setLoading(false));
  }, [page]);

  return (
    <>
      <PageMeta
        title="Blog - Axatech"
        description="Axatech blog - Tally, cloud and business solutions updates."
      />

      <BlogHero title="Blog" subtitle="Updates and insights from Axatech." />

      <section className="py-20 md:py-24 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-5">
          <BlogGrid
            blogs={data.blogs}
            loading={loading}
            page={page}
            totalPages={data.pages}
            onPageChange={setPage}
          />
        </div>
      </section>
    </>
  );
}
