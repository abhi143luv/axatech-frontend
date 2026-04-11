import { useEffect, useState } from 'react';
import api from '../../api';
import { PageMeta } from '../../components/common';
import {
  ProductsHero,
  ProductsSidebar,
  ProductsToolbar,
  ProductsGrid,
  ProductsPagination,
} from '../../components/products';

export default function Products() {
  const [data, setData] = useState({ products: [], total: 0, pages: 1 });
  const [categories, setCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  useEffect(() => {
    api.categories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const categoryParam = selectedCategoryIds.length > 0 ? selectedCategoryIds.join(',') : undefined;
    api.products({ page, limit: 12, category: categoryParam, search: appliedSearch || undefined })
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, selectedCategoryIds, appliedSearch]);

  // Keep only IDs that exist in the current page of products
  useEffect(() => {
    setSelectedProductIds((prev) =>
      prev.filter((id) => data.products.some((p) => p._id === id))
    );
  }, [data.products]);

  const doSearch = (e) => {
    e?.preventDefault();
    setPage(1);
    setAppliedSearch(search.trim());
  };

  const clearSearch = () => {
    setSearch('');
    setAppliedSearch('');
    setPage(1);
  };

  return (
    <>
      <PageMeta
        title="Tally Add-ons - Axatech"
        description="Browse Tally add-ons and automation products. Filter by category, search, and request enquiry."
      />

      <ProductsHero />

      <section className="py-20 md:py-24 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
            {/* Left: Categories sidebar (Amazon-style) — hidden on small screens */}
            <div className="hidden lg:block">
              <ProductsSidebar
                categories={categories}
                selectedCategoryIds={selectedCategoryIds}
                onCategoryChange={(ids) => { setSelectedCategoryIds(ids); setPage(1); }}
              />
            </div>
            {/* Right: Search, grid, pagination */}
            <div className="flex-1 min-w-0">
              <ProductsToolbar
                search={search}
                onSearchChange={setSearch}
                onSearchSubmit={doSearch}
                onClearSearch={clearSearch}
                selectedCategoryIds={selectedCategoryIds}
                onCategoryChange={(ids) => { setSelectedCategoryIds(ids); setPage(1); }}
                categories={categories}
                showCategoryDropdown
                selectedProductIds={selectedProductIds}
              />
              <ProductsGrid
                products={data.products}
                loading={loading}
                selectedProductIds={selectedProductIds}
                onToggleProduct={(id, checked) =>
                  setSelectedProductIds((prev) =>
                    checked ? [...prev, id] : prev.filter((x) => x !== id)
                  )
                }
              />
              <ProductsPagination
                page={page}
                pages={data.pages}
                onPageChange={setPage}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
