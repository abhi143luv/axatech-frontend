import { useEffect, useState } from 'react';
import api from '../../../api';
import { toast } from '../../../utils/toast';
import {
  TechnologiesHeader,
  TechnologiesTable,
  TechnologiesModal,
} from './index';

const initialForm = {
  title: '',
  description: '',
  category: '',
  image: '',
  isActive: true,
};

export default function TechnologiesList() {
  const [technologies, setTechnologies] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);

  // API-driven filters + pagination
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortKey, setSortKey] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const [counts, setCounts] = useState({ all: 0, active: 0, inactive: 0 });

  const load = () => {
    setLoading(true);
    return api.admin.technologies
      .list({
        status: statusFilter,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        search: searchQuery.trim() ? searchQuery.trim() : undefined,
        page,
        limit: rowsPerPage,
        sortKey,
        sortDirection,
      })
      .then((res) => {
        if (res && typeof res === 'object' && Array.isArray(res.technologies)) {
          setTechnologies(res.technologies);
          setTotalRows(Number(res.total || 0));
          setCounts(res.counts || { all: 0, active: 0, inactive: 0 });
          return;
        }

        // Backward compatibility fallback (if backend returns a plain array)
        if (Array.isArray(res)) {
          setTechnologies(res);
          setTotalRows(res.length);
          setCounts({
            all: res.length,
            active: res.filter((t) => t.isActive !== false).length,
            inactive: res.filter((t) => t.isActive === false).length,
          });
          return;
        }

        setTechnologies([]);
        setTotalRows(0);
        setCounts({ all: 0, active: 0, inactive: 0 });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [statusFilter, categoryFilter, searchQuery, page, rowsPerPage, sortKey, sortDirection]);

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

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(1);
  };

  const openCreate = () => {
    setEditing('new');
    setForm(initialForm);
  };

  const openEdit = (tech) => {
    setEditing(tech._id);
    setForm({
      title: tech.title || '',
      description: tech.description || '',
      category: tech.category || '',
      image: tech.image || '',
      isActive: tech.isActive !== false,
    });
  };

  const save = async () => {
    if (isSaving) return;
    setIsSaving(true);
    const payload = {
      title: form.title?.trim(),
      description: form.description?.trim(),
      category: form.category,
      image: form.image,
      isActive: form.isActive,
    };
    try {
      if (editing === 'new') {
        await api.admin.technologies.create(payload);
        toast.success('Technology created');
      } else {
        await api.admin.technologies.update(editing, payload);
        toast.success('Technology updated');
      }
      setEditing(null);
      load();
    } catch (e) {
      toast.error(e.message || 'Failed to save technology');
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async (id) => {
    try {
      await api.admin.technologies.delete(id);
      toast.success('Technology deleted');
      load();
      setEditing(null);
    } catch (e) {
      toast.error(e.message || 'Failed to delete technology');
    }
  };

  return (
    <div className="mx-auto max-w-[1280px]">
      <TechnologiesHeader onAdd={openCreate} />

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <TechnologiesTable
          technologies={technologies}
          onOpenEdit={openEdit}
          onRemove={remove}
          loading={loading}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={handleCategoryFilterChange}
          searchQuery={searchQuery}
          onSearchQueryChange={handleSearchQueryChange}
          page={page}
          rowsPerPage={rowsPerPage}
          totalRows={totalRows}
          onPageChange={setPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
          counts={counts}
        />
      </div>

      {editing && (
        <TechnologiesModal
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
