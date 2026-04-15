import { useEffect, useState } from 'react';
import api from '../../../api';
import { toast } from '../../../utils/toast';
import { CloudHeader, CloudTable, CloudModal } from './index';

const initialForm = {
  planName: '',
  type: 'shared',
  price: '',
  period: 'month',
  description: '',
  features: '',
  isActive: true,
};

export default function CloudList() {
  const [plans, setPlans] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);

  const [statusFilter, setStatusFilter] = useState('all'); // all | active | inactive
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortKey, setSortKey] = useState('planName');
  const [sortDirection, setSortDirection] = useState('asc');
  const [counts, setCounts] = useState({ all: 0, active: 0, inactive: 0 });

  const load = () => {
    setLoading(true);
    return api.admin.cloud
      .list({
        status: statusFilter,
        search: searchQuery.trim() ? searchQuery.trim() : undefined,
        page,
        limit: rowsPerPage,
        sortKey,
        sortDirection,
      })
      .then((res) => {
        if (res && typeof res === 'object' && Array.isArray(res.plans)) {
          setPlans(res.plans);
          setTotalRows(Number(res.total || 0));
          setCounts(res.counts || { all: 0, active: 0, inactive: 0 });
          return;
        }

        // Backward compatibility (plain array)
        if (Array.isArray(res)) {
          setPlans(res);
          setTotalRows(res.length);
          setCounts({
            all: res.length,
            active: res.filter((p) => p.isActive !== false).length,
            inactive: res.filter((p) => p.isActive === false).length,
          });
          return;
        }

        setPlans([]);
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

  const openEdit = (plan) => {
    setEditing(plan._id);
    setForm({
      planName: plan.planName || '',
      type: plan.type || 'shared',
      price: plan.price ?? '',
      period: plan.period || 'month',
      description: plan.description || '',
      features: (plan.features || []).join('\n'),
      isActive: plan.isActive !== false,
    });
  };

  const save = async () => {
    if (isSaving) return;
    setIsSaving(true);
    const payload = {
      planName: form.planName?.trim(),
      type: form.type || 'shared',
      price: Number(form.price),
      period: (form.period || 'month').trim(),
      description: form.description?.trim() || undefined,
      features: form.features
        ? form.features
            .split('\n')
            .map((f) => f.trim())
            .filter(Boolean)
        : [],
      isActive: form.isActive,
    };
    try {
      if (editing === 'new') {
        await api.admin.cloud.create(payload);
        toast.success('Cloud plan created');
      } else {
        await api.admin.cloud.update(editing, payload);
        toast.success('Cloud plan updated');
      }
      setEditing(null);
      load();
    } catch (e) {
      toast.error(e.message || 'Failed to save cloud plan');
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async (id) => {
    try {
      await api.admin.cloud.delete(id);
      toast.success('Cloud plan deleted');
      setEditing(null);
      load();
    } catch (e) {
      toast.error(e.message || 'Failed to delete cloud plan');
    }
  };

  return (
    <div className="mx-auto max-w-[1280px]">
      <CloudHeader onAdd={openCreate} />

      <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <CloudTable
          plans={plans}
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
        <CloudModal
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
