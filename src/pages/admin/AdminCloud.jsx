import { useEffect, useState } from 'react';
import api from '../../api';
import { toast } from '../../utils/toast';
import { Button } from '../../components/common';

const inputClass = 'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:focus:border-secondary dark:focus:ring-secondary/20';
const selectClass = inputClass;
const textareaClass = 'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:focus:border-secondary dark:focus:ring-secondary/20 min-h-[80px]';

export default function AdminCloud() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ planName: '', type: 'shared', price: '', period: 'month', description: '', features: '', isActive: true });

  const load = () => api.admin.cloud.list().then(setPlans).catch(console.error);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditing('new');
    setForm({ planName: '', type: 'shared', price: '', period: 'month', description: '', features: '', isActive: true });
  };

  const openEdit = (p) => {
    setEditing(p._id);
    setForm({
      planName: p.planName,
      type: p.type || 'shared',
      price: p.price ?? '',
      period: p.period || 'month',
      description: p.description || '',
      features: (p.features || []).join('\n'),
      isActive: p.isActive !== false,
    });
  };

  const save = async () => {
    const payload = {
      planName: form.planName,
      type: form.type,
      price: Number(form.price),
      period: form.period,
      description: form.description || undefined,
      features: form.features ? form.features.split('\n').map((f) => f.trim()).filter(Boolean) : [],
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
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this plan?')) return;
    try {
      await api.admin.cloud.delete(id);
      toast.success('Cloud plan deleted');
      setEditing(null);
      load();
    } catch (e) {
      toast.error(e.message || 'Failed to delete cloud plan');
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-[1280px]">
        <div className="py-12 px-4 text-center text-base text-slate-500 dark:text-gray-400">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-primary dark:border-gray-600 dark:border-t-secondary" />
          <p>Loading cloud plans…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1280px]">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="m-0 text-2xl font-bold tracking-tight text-slate-800 dark:text-white">Cloud Plans</h1>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="primary" fullWidth={false} onClick={openCreate}>Add Plan</Button>
        </div>
      </header>

      <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm [&_tbody_tr:last-child_td]:border-b-0">
            <thead>
              <tr>
                <th className="border-b border-gray-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-gray-600 dark:bg-gray-700/50 dark:text-slate-400">Plan</th>
                <th className="border-b border-gray-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-gray-600 dark:bg-gray-700/50 dark:text-slate-400">Type</th>
                <th className="border-b border-gray-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-gray-600 dark:bg-gray-700/50 dark:text-slate-400">Price</th>
                <th className="border-b border-gray-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-gray-600 dark:bg-gray-700/50 dark:text-slate-400">Active</th>
                <th className="whitespace-nowrap border-b border-gray-200 bg-slate-50 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-gray-600 dark:bg-gray-700/50 dark:text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((p) => (
                <tr key={p._id} className="transition-colors duration-150 hover:bg-slate-50 dark:hover:bg-gray-700/30">
                  {editing === p._id ? (
                    <td colSpan={5} className="border-b border-slate-100 px-4 py-3.5 align-middle dark:border-gray-600">
                      <div className="flex flex-wrap items-start gap-3 py-2">
                        <input className={`${inputClass} min-w-[120px] max-w-[200px]`} placeholder="Plan name" value={form.planName} onChange={(e) => setForm((f) => ({ ...f, planName: e.target.value }))} />
                        <select className={`${selectClass} min-w-[120px] max-w-[200px]`} value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
                          <option value="shared">Shared</option>
                          <option value="vps">VPS</option>
                        </select>
                        <input type="number" className={`${inputClass} min-w-[120px] max-w-[200px]`} placeholder="Price" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
                        <input className={`${inputClass} min-w-[120px] max-w-[200px]`} placeholder="Period" value={form.period} onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))} />
                        <textarea className={`${textareaClass} min-h-[60px] min-w-[200px] max-w-[320px]`} placeholder="Features (one per line)" value={form.features} onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))} rows={2} />
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-gray-400">
                          <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} className="rounded border-gray-300 text-primary focus:ring-primary/20 dark:border-gray-500 dark:text-secondary" />
                          Active
                        </label>
                        <div className="flex w-full flex-wrap gap-2 border-t border-dashed border-gray-200 pt-2 dark:border-gray-600">
                          <Button type="button" variant="primary" fullWidth={false} onClick={save}>Save</Button>
                          <Button type="button" variant="outline" fullWidth={false} onClick={() => setEditing(null)}>Cancel</Button>
                          <Button type="button" variant="error" fullWidth={false} onClick={() => remove(p._id)}>Delete</Button>
                        </div>
                      </div>
                    </td>
                  ) : (
                    <>
                      <td className="border-b border-slate-100 px-4 py-3.5 align-middle text-slate-700 dark:border-gray-600 dark:text-gray-300">{p.planName}</td>
                      <td className="border-b border-slate-100 px-4 py-3.5 align-middle text-slate-700 dark:border-gray-600 dark:text-gray-300">{p.type}</td>
                      <td className="border-b border-slate-100 px-4 py-3.5 align-middle text-slate-700 dark:border-gray-600 dark:text-gray-300">₹{p.price?.toLocaleString()}/{p.period || 'month'}</td>
                      <td className="border-b border-slate-100 px-4 py-3.5 align-middle dark:border-gray-600">
                        <span className={p.isActive !== false ? 'inline-block rounded-md bg-success/15 px-2.5 py-1 text-[0.78rem] font-semibold uppercase tracking-wide text-success-dark dark:bg-success/20 dark:text-success-light' : 'inline-block rounded-md bg-slate-100 px-2.5 py-1 text-[0.78rem] font-semibold uppercase tracking-wide text-slate-500 dark:bg-gray-600 dark:text-gray-400'}>{p.isActive !== false ? 'Yes' : 'No'}</span>
                      </td>
                      <td className="whitespace-nowrap border-b border-slate-100 px-4 py-3.5 text-right align-middle dark:border-gray-600">
                        <Button type="button" variant="outline" fullWidth={false} onClick={() => openEdit(p)}>Edit</Button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {plans.length === 0 && (
          <div className="mx-4 mb-4 py-10 text-center text-base text-slate-500 dark:text-gray-400">No cloud plans yet. Add one to get started.</div>
        )}
      </div>

      {editing === 'new' && (
        <div className="fixed inset-0 z-1000 flex animate-admin-fadeIn items-center justify-center bg-slate-900/50 p-6" onClick={() => setEditing(null)}>
          <div className="flex max-h-[90vh] w-full max-w-[560px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl animate-admin-slideUp dark:bg-gray-800" onClick={(e) => e.stopPropagation()}>
            <div className="shrink-0 border-b border-gray-200 px-6 py-5 text-lg font-bold text-slate-800 dark:border-gray-600 dark:text-white">Add Cloud Plan</div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4 max-[520px]:grid-cols-1">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-600 dark:text-gray-400">Plan name</label>
                    <input className={inputClass} value={form.planName} onChange={(e) => setForm((f) => ({ ...f, planName: e.target.value }))} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-600 dark:text-gray-400">Type</label>
                    <select className={selectClass} value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
                      <option value="shared">Shared</option>
                      <option value="vps">VPS</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 max-[520px]:grid-cols-1">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-600 dark:text-gray-400">Price (₹)</label>
                    <input type="number" className={inputClass} value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-600 dark:text-gray-400">Period</label>
                    <input className={inputClass} placeholder="e.g. month" value={form.period} onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))} />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-600 dark:text-gray-400">Features (one per line)</label>
                  <textarea className={textareaClass} value={form.features} onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))} rows={3} />
                </div>
                <div className="flex flex-row flex-wrap items-center gap-4">
                  <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-600 dark:text-gray-400">
                    <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} className="rounded border-gray-300 text-primary focus:ring-primary/20 dark:border-gray-500 dark:text-secondary" />
                    <span>Active</span>
                  </label>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 border-t border-gray-200 pt-2 dark:border-gray-600">
                  <Button type="button" variant="primary" fullWidth={false} onClick={save}>Create</Button>
                  <Button type="button" variant="outline" fullWidth={false} onClick={() => setEditing(null)}>Cancel</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
