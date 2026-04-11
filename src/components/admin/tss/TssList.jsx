import { useEffect, useState } from 'react';
import api from '../../../api';
import { toast } from '../../../utils/toast';
import TssHeader from './TssHeader';
import TssTable from './TssTable';
import TssModal from './TssModal';

const initialForm = {
  title: '',
  type: '',
  price: '',
  description: '',
  features: '',
  isActive: true,
};

export default function TssList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortKey, setSortKey] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);

  const [counts, setCounts] = useState({ all: 0, active: 0, inactive: 0 });
  const [typeOptions, setTypeOptions] = useState([{ value: 'all', label: 'All types' }]);

  const load = () => {
    setLoading(true);
    const type = typeFilter !== 'all' ? typeFilter : undefined;
    const search = searchQuery.trim() ? searchQuery.trim() : undefined;

    return api.admin.tss
      .list({
        status: statusFilter,
        type,
        page,
        limit: rowsPerPage,
        search,
        sortKey,
        sortDirection,
      })
      .then((res) => {
        if (Array.isArray(res)) {
          const total = res.length;
          const start = (page - 1) * rowsPerPage;
          const end = start + rowsPerPage;
          setItems(res.slice(start, end));
          setTotalRows(total);
          setCounts({
            all: total,
            active: res.filter((p) => p.isActive !== false).length,
            inactive: res.filter((p) => p.isActive === false).length,
          });
          const distinctTypes = Array.from(new Set(res.map((p) => p.type || 'single')));
          distinctTypes.sort((a, b) => String(a).localeCompare(String(b)));
          setTypeOptions([
            { value: 'all', label: 'All types' },
            ...distinctTypes.map((t) => ({
              value: t,
              label: t === 'single' ? 'Single' : t === 'multi' ? 'Multi' : t,
            })),
          ]);
          return;
        }

        const list = res?.items ?? res?.plans ?? res?.licenses ?? [];
        setItems(list);
        setTotalRows(res?.total ?? list.length);

        if (res?.counts) setCounts(res.counts);
        else {
          setCounts({
            all: res?.total ?? list.length,
            active: list.filter((p) => p.isActive !== false).length,
            inactive: list.filter((p) => p.isActive === false).length,
          });
        }

        const types = Array.isArray(res?.types) ? res.types : [];
        setTypeOptions([
          { value: 'all', label: 'All types' },
          ...types.map((t) => ({
            value: t,
            label: t === 'single' ? 'Single' : t === 'multi' ? 'Multi' : t,
          })),
        ]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [statusFilter, typeFilter, searchQuery, sortKey, sortDirection, page, rowsPerPage]);

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(totalRows / rowsPerPage));
    setPage((p) => (p > maxPage ? maxPage : p));
  }, [totalRows, rowsPerPage]);

  const handleStatusFilterChange = (val) => {
    setStatusFilter(val);
    setPage(1);
  };

  const handleTypeFilterChange = (val) => {
    setTypeFilter(val);
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
  };

  const openEdit = (plan) => {
    setEditing(plan._id);
    setForm({
      title: plan.title,
      type: plan.type || 'single',
      price: plan.price ?? '',
      description: plan.description || '',
      features: (plan.features || []).join('\n'),
      isActive: plan.isActive !== false,
    });
  };

  const save = async () => {
    const payload = {
      title: form.title,
      type: form.type,
      price: Number(form.price),
      // Send empty string so backend actually clears description when user deletes it
      description: form.description ?? '',
      features: form.features
        ? form.features.split('\n').map((f) => f.trim()).filter(Boolean)
        : [],
      isActive: form.isActive,
    };
    try {
      if (editing === 'new') {
        await api.admin.tss.create(payload);
        toast.success('TSS plan created');
      } else {
        await api.admin.tss.update(editing, payload);
        toast.success('TSS plan updated');
      }
      setEditing(null);
      load();
    } catch (e) {
      toast.error(e.message || 'Failed to save TSS plan');
    }
  };

  const remove = async (id) => {
    try {
      await api.admin.tss.delete(id);
      toast.success('TSS plan deleted');
      load();
      setEditing(null);
    } catch (e) {
      toast.error(e.message || 'Failed to delete TSS plan');
    }
  };

  return (
    <div className="mx-auto max-w-[1280px]">
      <TssHeader onAddPlan={openCreate} />

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <TssTable
          items={items}
          onOpenEdit={openEdit}
          onRemove={remove}
          loading={loading}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          typeFilter={typeFilter}
          onTypeFilterChange={handleTypeFilterChange}
          searchQuery={searchQuery}
          onSearchQueryChange={handleSearchQueryChange}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
          page={page}
          rowsPerPage={rowsPerPage}
          totalRows={totalRows}
          onPageChange={setPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          counts={counts}
          typeOptions={typeOptions}
        />
      </div>

      {editing && (
        <TssModal
          mode={editing === 'new' ? 'create' : 'edit'}
          form={form}
          setForm={setForm}
          onSave={save}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

