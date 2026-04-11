import { useState } from 'react';
import { Modal, Input, Dropdown, Checkbox } from '../../common';

const TYPE_OPTIONS = [
  { value: 'shared', label: 'Shared' },
  { value: 'vps', label: 'VPS' },
];
const VALID_TYPES = new Set(TYPE_OPTIONS.map((option) => option.value));

export default function CloudModal({ mode = 'create', form, setForm, onSave, onClose }) {
  const [errors, setErrors] = useState({ planName: '', type: '', price: '' });

  const validate = () => {
    const next = { planName: '', type: '', price: '' };
    const planName = (form.planName ?? '').trim();
    if (!planName) next.planName = 'Plan name is required';
    const type = (form.type ?? '').trim().toLowerCase();
    if (!type || !VALID_TYPES.has(type)) next.type = 'Type must be Shared or VPS';
    const priceRaw = String(form.price ?? '').trim();
    if (!priceRaw || Number.isNaN(Number(priceRaw)) || !Number.isFinite(Number(priceRaw))) {
      next.price = 'Valid price is required';
    }
    setErrors(next);
    return !next.planName && !next.type && !next.price;
  };

  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateField = (field, nextValue) => {
    if (field === 'planName') {
      const planName = (nextValue !== undefined ? nextValue : form.planName ?? '').trim();
      setErrors((prev) => ({ ...prev, planName: planName ? '' : 'Plan name is required' }));
      return;
    }
    if (field === 'type') {
      const type = String(nextValue !== undefined ? nextValue : form.type ?? '').trim().toLowerCase();
      setErrors((prev) => ({ ...prev, type: type && VALID_TYPES.has(type) ? '' : 'Type must be Shared or VPS' }));
      return;
    }
    if (field === 'price') {
      const priceRaw = String(nextValue !== undefined ? nextValue : form.price ?? '').trim();
      const priceNumber = Number(priceRaw);
      const valid = priceRaw && !Number.isNaN(priceNumber) && Number.isFinite(priceNumber);
      setErrors((prev) => ({ ...prev, price: valid ? '' : 'Valid price is required' }));
    }
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave?.();
  };

  return (
    <Modal
      title={mode === 'create' ? 'Add Cloud Plan' : 'Edit Cloud Plan'}
      titleId="cloud-modal-title"
      onClose={onClose}
      primaryLabel={mode === 'create' ? 'Create plan' : 'Update plan'}
      onPrimary={handleSave}
      size="2xl"
    >
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Plan name"
            required
            type="text"
            value={form.planName}
            onChange={(e) => {
              setForm((f) => ({ ...f, planName: e.target.value }));
              clearError('planName');
            }}
            onBlur={() => validateField('planName')}
            error={errors.planName}
            className="mb-0"
          />
          <Dropdown
            label="Type"
            required
            placeholder="Select"
            value={form.type}
            onChange={(val) => {
              setForm((f) => ({ ...f, type: val }));
              validateField('type', val);
            }}
            onBlur={() => validateField('type')}
            options={TYPE_OPTIONS}
            error={errors.type}
            className="mb-0"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Price (INR)"
            required
            type="number"
            value={form.price}
            onChange={(e) => {
              setForm((f) => ({ ...f, price: e.target.value }));
              clearError('price');
            }}
            onBlur={() => validateField('price')}
            min={0}
            error={errors.price}
            className="mb-0"
          />
          <Input
            label="Period"
            type="text"
            value={form.period}
            onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))}
            placeholder="e.g. month"
            className="mb-0"
          />
        </div>

        <Input
          label="Description"
          type="textarea"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder="Optional description"
          className="mb-0"
        />

        <Input
          label="Features (one per line)"
          type="textarea"
          value={form.features}
          onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))}
          placeholder="Feature one&#10;Feature two"
          className="mb-0"
        />

        <div className="flex flex-col justify-end pb-0.5">
          <span className="mb-2 block text-sm font-medium text-slate-600 dark:text-gray-400">Status</span>
          <Checkbox
            size="md"
            label="Active"
            checked={form.isActive}
            onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
          />
        </div>
      </div>
    </Modal>
  );
}
