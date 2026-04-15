import { useState } from 'react';
import { Modal, Input, Dropdown, Checkbox } from '../../common';

const textareaClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-secondary dark:focus:ring-secondary/20 min-h-[80px] resize-y';

export default function LicensesModal({ mode = 'create', form, setForm, onSave, onClose, isSaving = false }) {
  const [errors, setErrors] = useState({ planName: '', type: '', price: '' });

  const validate = () => {
    const next = { planName: '', type: '', price: '' };
    // planName: required (matches LicensePlan schema)
    const planName = (form.planName ?? '').trim();
    if (!planName) next.planName = 'Plan name is required';
    // type: required, enum ['single', 'multi'] (matches LicensePlan schema)
    const type = form.type ?? '';
    if (!type || !['single', 'multi'].includes(type)) next.type = 'Type is required (Single or Multi)';
    // price: required, number >= 0 (matches LicensePlan schema)
    const priceNum = Number(form.price);
    if (form.price === '' || form.price == null || isNaN(priceNum) || priceNum < 0) {
      next.price = 'Price is required and must be 0 or greater';
    }
    setErrors(next);
    return !next.planName && !next.type && !next.price;
  };

  /** Validate a single field (for on-blur / on-touch validation). nextValue overrides current form value for that field (e.g. when validating on change). */
  const validateField = (field, nextValue) => {
    if (field === 'planName') {
      const planName = (nextValue !== undefined ? nextValue : form.planName ?? '').trim();
      setErrors((prev) => ({ ...prev, planName: planName ? '' : 'Plan name is required' }));
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
    if (isSaving) return;
    if (!validate()) return;
    onSave?.();
  };

  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <Modal
      title={mode === 'create' ? 'Add Tally Plan' : 'Edit Tally Plan'}
      titleId="license-modal-title"
      onClose={onClose}
      primaryLabel={mode === 'create' ? 'Create plan' : 'Update plan'}
      primaryLoading={isSaving}
      primaryLoadingLabel={mode === 'create' ? 'Creating plan...' : 'Updating plan...'}
      primaryDisabled={isSaving}
      onPrimary={handleSave}
      size="3xl"
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
              <div className="mb-0">
                <Dropdown
                  label="Type"
                  required
                  placeholder="Select type"
                  value={form.type}
                  onChange={(val) => {
                    setForm((f) => ({ ...f, type: val }));
                    // Re-validate on change (same as Input: error clears when valid, shows when invalid)
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
