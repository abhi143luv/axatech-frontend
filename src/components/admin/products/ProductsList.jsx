import { useEffect, useState } from 'react';
import api from '../../../api';
import { toast } from '../../../utils/toast';
import {
  ProductsHeader,
  ProductsTable,
  ProductsModal,
} from '../../../components/admin/products';

const initialForm = {
  name: '',
  slug: '',
  description: '',
  shortDescription: '',
  category: '',
  demoVideoLink: '',
  images: [],
  featured: false,
  isActive: true,
};

export default function ProductsList() {
  const [data, setData] = useState({ products: [], total: 0 });
  const [counts, setCounts] = useState({ all: 0, featured: 0, active: 0, inactive: 0 });
  const [categoryOptions, setCategoryOptions] = useState([{ value: 'all', label: 'All categories' }]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [imageFiles, setImageFiles] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isSaving, setIsSaving] = useState(false);

  const load = () => {
    setLoading(true);
    const category = categoryFilter !== 'all' ? categoryFilter : undefined;
    const search = searchQuery.trim() ? searchQuery.trim() : undefined;
    return api.admin.products
      .list({
        status: statusFilter,
        category,
        search,
        page,
        limit: rowsPerPage,
        sortKey,
        sortDirection,
      })
      .then((r) => {
        const products = Array.isArray(r?.products) ? r.products : [];
        setData({ products, total: Number(r?.total || 0) });
        setCounts(r?.counts || {
          all: Number(r?.total || 0),
          featured: products.filter((p) => p.featured).length,
          active: products.filter((p) => p.isActive !== false).length,
          inactive: products.filter((p) => p.isActive === false).length,
        });
        const apiCategories = Array.isArray(r?.categories) ? r.categories : [];
        setCategoryOptions([{ value: 'all', label: 'All categories' }, ...apiCategories]);
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    load();
    api.admin.categories.list().then(setCategories).catch(console.error);
  }, [statusFilter, categoryFilter, searchQuery, sortKey, sortDirection, page, rowsPerPage]);

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil((data.total || 0) / rowsPerPage));
    setPage((p) => (p > maxPage ? maxPage : p));
  }, [data.total, rowsPerPage]);

  const handleStatusFilterChange = (val) => {
    setStatusFilter(val);
    setPage(1);
  };
  const handleCategoryFilterChange = (val) => {
    setCategoryFilter(val);
    setPage(1);
  };
  const handleSearchQueryChange = (val) => {
    setSearchQuery(val);
    setPage(1);
  };
  const handleSortChange = (key, direction) => {
    setSortKey(key);
    setSortDirection(direction);
    setPage(1);
  };
  const handleRowsPerPageChange = (newRows) => {
    setRowsPerPage(newRows);
    setPage(1);
  };

  const openCreate = () => {
    setEditing('new');
    setForm(initialForm);
    setImageFiles([]);
  };

  const openEdit = (p) => {
    setEditing(p._id);
    setForm({
      name: p.name,
      slug: p.slug || '',
      description: p.description || '',
      shortDescription: p.shortDescription || '',
      category: p.category?._id || p.category || '',
      demoVideoLink: p.demoVideoLink || '',
      images: Array.isArray(p.images) ? p.images : [],
      featured: !!p.featured,
      isActive: p.isActive !== false,
    });
    setImageFiles([]);
  };

  const save = async () => {
    if (isSaving) return;
    setIsSaving(true);
    const existingFilenames = (form.images || [])
      .map((url) =>
        typeof url === 'string' && url.includes('/uploads/') ? url.replace(/^.*\/uploads\//, '') : url
      )
      .filter(Boolean);
    let newFilenames = [];
    if (imageFiles.length > 0) {
      try {
        newFilenames = await Promise.all(imageFiles.map((f) => api.upload(f)));
      } catch (e) {
        toast.error('Image upload failed: ' + e.message);
        setIsSaving(false);
        return;
      }
    }
    const allImages = [...existingFilenames, ...newFilenames];

    const payload = {
      name: form.name,
      slug: form.slug || undefined,
      description: form.description || undefined,
      shortDescription: form.shortDescription || undefined,
      category: form.category || undefined,
      demoVideoLink: (form.demoVideoLink || '').trim() || null,
      featured: form.featured,
      isActive: form.isActive,
    };
    if (allImages.length > 0) payload.images = allImages;
    try {
      if (editing === 'new') {
        await api.admin.products.create(payload);
        toast.success('Product created');
      } else {
        await api.admin.products.update(editing, payload);
        toast.success('Product updated');
      }
      setEditing(null);
      load();
    } catch (e) {
      toast.error(e.message || 'Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async (idOrIds) => {
    try {
      const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
      if (ids.length === 0) return;
      if (ids.length === 1) {
        await api.admin.products.delete(ids[0]);
        toast.success('Product deleted');
      } else {
        await api.admin.products.deleteBulk(ids);
        toast.success(`${ids.length} products deleted`);
      }
      setEditing(null);
      load();
    } catch (e) {
      toast.error(e.message || 'Failed to delete product(s)');
    }
  };

  const modalOpen = editing === 'new' || (editing && editing !== 'new');
  const modalTitle = editing === 'new' ? 'Add Product' : 'Edit Product';
  const modalMode = editing === 'new' ? 'create' : 'edit';

  return (
    <div className="mx-auto max-w-[1280px]">
      <ProductsHeader onAddProduct={openCreate} />

      <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <ProductsTable
          products={data.products}
          onOpenEdit={openEdit}
          onRemove={remove}
          loading={loading}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={handleCategoryFilterChange}
          categoryOptions={categoryOptions}
          searchQuery={searchQuery}
          onSearchQueryChange={handleSearchQueryChange}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
          page={page}
          rowsPerPage={rowsPerPage}
          totalRows={data.total}
          onPageChange={setPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          counts={counts}
        />
      </div>

      {modalOpen && (
        <ProductsModal
          open
          mode={modalMode}
          title={modalTitle}
          form={form}
          setForm={setForm}
          imageFiles={imageFiles}
          setImageFiles={setImageFiles}
          categories={categories}
          onSave={save}
          onClose={() => setEditing(null)}
          existingImageUrls={editing && editing !== 'new' ? (form.images || []) : []}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}

