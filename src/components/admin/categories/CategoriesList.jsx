import { useEffect, useState } from 'react';
import api from '../../../api';
import { toast } from '../../../utils/toast';
import {
  CategoriesHeader,
  CategoriesTable,
  CategoriesModal,
} from '../../../components/admin/categories';

const initialForm = {
  name: '',
  slug: '',
  description: '',
  isActive: true,
};

export default function CategoriesList() {
  const [list, setList] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editing, setEditing] = useState(null); // null | 'new' | categoryId
  const [form, setForm] = useState(initialForm);

  const [statusFilter, setStatusFilter] = useState('all'); // all | active | inactive
  const [searchQuery, setSearchQuery] = useState('');

  const loadAll = () => {
    setLoading(true);
    return api.admin.categories
      .list({ status: 'all' })
      .then((r) => setAllCategories(Array.isArray(r) ? r : []))
      .finally(() => setLoading(false));
  };

  const loadFiltered = () => {
    setLoading(true);
    const search = searchQuery.trim() ? searchQuery.trim() : undefined;
    return api.admin.categories
      .list({
        status: statusFilter === 'all' ? 'all' : statusFilter,
        search,
      })
      .then((r) => setList(Array.isArray(r) ? r : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const refresh = () => loadAll().then(loadFiltered).catch(console.error);

  useEffect(() => {
    loadAll()
      .then(loadFiltered)
      .catch(console.error);
  }, []);

  useEffect(() => {
    // Update API data when filters change.
    loadFiltered();
  }, [statusFilter, searchQuery]);

  const counts = {
    all: allCategories.length,
    active: allCategories.filter((c) => c.isActive !== false).length,
    inactive: allCategories.filter((c) => c.isActive === false).length,
  };

  const openCreate = () => {
    setEditing('new');
    setForm(initialForm);
  };

  const openEdit = (cat) => {
    setEditing(cat._id);
    setForm({
      name: cat.name,
      slug: cat.slug || '',
      description: cat.description || '',
      isActive: cat.isActive !== false,
    });
  };

  const save = async () => {
    if (isSaving) return;
    setIsSaving(true);
    const payload = { ...form };
    if (!payload.slug)
      payload.slug = payload.name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    try {
      if (editing === 'new') {
        await api.admin.categories.create(payload);
        toast.success('Category created');
      } else {
        await api.admin.categories.update(editing, payload);
        toast.success('Category updated');
      }
      setEditing(null);
      refresh();
    } catch (e) {
      toast.error(e.message || 'Failed to save category');
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async (id) => {
    try {
      await api.admin.categories.delete(id);
      toast.success('Category deleted');
      setEditing(null);
      refresh();
    } catch (e) {
      toast.error(e.message || 'Failed to delete category');
    }
  };

  return (
    <div className="mx-auto max-w-[1280px]">
      <CategoriesHeader onAddCategory={openCreate} />

      <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <CategoriesTable
          categories={list}
          onOpenEdit={openEdit}
          onRemove={remove}
          loading={loading}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          counts={counts}
        />
      </div>

      {editing && (
        <CategoriesModal
          mode={editing === 'new' ? 'create' : 'edit'}
          form={form}
          setForm={setForm}
          onSave={save}
          onClose={() => setEditing(null)}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}

