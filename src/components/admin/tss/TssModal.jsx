import { useState } from 'react';
import { Modal, Input, Dropdown, Checkbox } from '../../common';

export default function TssModal({ mode = 'create', form, setForm, onSave, onClose }) {
  const [errors, setErrors] = useState({ title: '', type: '', price: '' });

  const validate = () => {
    const next = { title: '', type: '', price: '' };
    const title = (form.title ?? '').trim();
    if (!title) next.title = 'Title is required';
    const type = form.type ?? '';
    if (!type || !['single', 'multi'].includes(type)) next.type = 'Type is required (Single or Multi)';
    const priceNum = Number(form.price);
    if (form.price === '' || form.price == null || isNaN(priceNum) || priceNum < 0) {
      next.price = 'Price is required and must be 0 or greater';
    }
    setErrors(next);
    return !next.title && !next.type && !next.price;
  };

  const validateField = (field, nextValue) => {
    if (field === 'title') {
      const title = (nextValue !== undefined ? nextValue : form.title ?? '').trim();
      setErrors((prev) => ({ ...prev, title: title ? '' : 'Title is required' }));
    } else if (field === 'type') {
      const type = nextValue !== undefined ? nextValue : (form.type ?? '');
      const valid = type && ['single', 'multi'].includes(type);
      setErrors((prev) => ({ ...prev, type: valid ? '' : 'Type is required (Single or Multi)' }));
    } else if (field === 'price') {
      const raw = nextValue !== undefined ? nextValue : form.price;
      const priceNum = Number(raw);
      const valid = raw !== '' && raw != null && !isNaN(priceNum) && priceNum >= 0;
      setErrors((prev) => ({ ...prev, price: valid ? '' : 'Price is required and must be 0 or greater' }));
    }
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave?.();
  };

  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <Modal
      title={mode === 'create' ? 'Add TSS Plan' : 'Edit TSS Plan'}
      titleId="tss-modal-title"
      onClose={onClose}
      primaryLabel={mode === 'create' ? 'Create TSS plan' : 'Update TSS plan'}
      onPrimary={handleSave}
      size="3xl"
    >
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Title"
            required
            type="text"
            value={form.title}
            onChange={(e) => {
              setForm((f) => ({ ...f, title: e.target.value }));
              clearError('title');
            }}
            onBlur={() => validateField('title')}
            error={errors.title}
            className="mb-0"
          />
          <div className="mb-0">
            <Dropdown
              label="Type"
              required
              placeholder="Select type"
              value={form.type}
              onChange={(val) => {
                setForm((f) => ({ ...f, type: val }));
                validateField('type', val);
              }}
              onBlur={() => validateField('type')}
              error={errors.type}
              options={[
                { value: 'single', label: 'Single' },
                { value: 'multi', label: 'Multi' },
              ]}
              className="mb-0"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Price (₹)"
            required
            type="number"
            value={form.price}
            onChange={(e) => {
              setForm((f) => ({ ...f, price: e.target.value }));
              clearError('price');
            }}
            onBlur={() => validateField('price')}
            error={errors.price}
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
          placeholder="One feature per line"
          className="mb-0"
        />
      </div>
    </Modal>
  );
}

