import { useEffect, useState } from 'react';
import api from '../../../api';
import { toast } from '../../../utils/toast';
import { ServicesHeader, ServicesTable, ServicesModal } from './index';

const initialForm = {
  title: '',
  slug: '',
  description: '',
  shortDescription: '',
  isActive: true,
};

export default function ServicesList() {
  const [list, setList] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);

  // API-driven filters
  const [statusFilter, setStatusFilter] = useState('all'); // all | active | inactive
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortKey, setSortKey] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const [counts, setCounts] = useState({ all: 0, active: 0, inactive: 0 });

  const load = () => {
    setLoading(true);
    return api.admin.services
      .list({
        status: statusFilter,
        search: searchQuery.trim() ? searchQuery.trim() : undefined,
        page,
        limit: rowsPerPage,
        sortKey,
        sortDirection,
      })
      .then((res) => {
        // New paginated API response
        if (res && typeof res === 'object' && Array.isArray(res.services)) {
          setList(res.services);
          setTotalRows(Number(res.total || 0));
          setCounts(res.counts || { all: 0, active: 0, inactive: 0 });
          return;
        }

        // Backward compatibility fallback (plain array)
        if (Array.isArray(res)) {
          setList(res);
          setTotalRows(res.length);
          setCounts({
            all: res.length,
            active: res.filter((s) => s.isActive !== false).length,
            inactive: res.filter((s) => s.isActive === false).length,
          });
          return;
        }

        setList([]);
        setTotalRows(0);
        setCounts({ all: 0, active: 0, inactive: 0 });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [statusFilter, searchQuery, page, rowsPerPage, sortKey, sortDirection]);

  const handleStatusFilterChange = (val) => {
    setStatusFilter(val);
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

  const handleRowsPerPageChange = (n) => {
    setRowsPerPage(n);
    setPage(1);
  };

  const openCreate = () => {
    setEditing('new');
    setForm(initialForm);
  };

  const openEdit = (service) => {
    setEditing(service._id);
    setForm({
      title: service.title || '',
      slug: service.slug || '',
      description: service.description || '',
      shortDescription: service.shortDescription || '',
      isActive: service.isActive !== false,
    });
  };

  const save = async () => {
    if (isSaving) return;
    setIsSaving(true);
    const payload = {
      ...form,
      title: form.title?.trim(),
      slug: form.slug?.trim(),
      shortDescription: form.shortDescription?.trim(),
      description: form.description?.trim(),
    };
    if (!payload.slug) {
      payload.slug = payload.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    }
    try {
      if (editing === 'new') {
        await api.admin.services.create(payload);
        toast.success('Service created');
      } else {
        await api.admin.services.update(editing, payload);
        toast.success('Service updated');
      }
      setEditing(null);
      load();
    } catch (e) {
      toast.error(e.message || 'Failed to save service');
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async (id) => {
    try {
      await api.admin.services.delete(id);
      toast.success('Service deleted');
      setEditing(null);
      load();
    } catch (e) {
      toast.error(e.message || 'Failed to delete service');
    }
  };

  return (
    <div className="mx-auto max-w-[1280px]">
      <ServicesHeader onAdd={openCreate} />

      <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <ServicesTable
          services={list}
          onOpenEdit={openEdit}
          onRemove={remove}
          loading={loading}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
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
        <ServicesModal
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
