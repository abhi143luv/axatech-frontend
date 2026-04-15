import { useState } from 'react';
import { Modal, Input, Checkbox } from '../../common';

const textareaClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-secondary dark:focus:ring-secondary/20 min-h-[80px] resize-y';

export default function CategoriesModal({ mode = 'create', form, setForm, onSave, onClose, isSaving = false }) {
  const [errors, setErrors] = useState({ name: '' });

  const validate = () => {
    const next = { name: '' };
    const name = (form.name ?? '').trim();
    if (!name) next.name = 'Name is required';
    setErrors(next);
    return !next.name;
  };

  const validateField = (field, nextValue) => {
    if (field === 'name') {
      const name = (nextValue !== undefined ? nextValue : form.name ?? '').trim();
      setErrors((prev) => ({ ...prev, name: name ? '' : 'Name is required' }));
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
      title={mode === 'create' ? 'Add Category' : 'Edit Category'}
      titleId="categories-modal-title"
      onClose={onClose}
      primaryLabel={mode === 'create' ? 'Create category' : 'Update category'}
      primaryLoading={isSaving}
      primaryLoadingLabel={mode === 'create' ? 'Creating category...' : 'Updating category...'}
      primaryDisabled={isSaving}
      onPrimary={handleSave}
      size="2xl"
    >
      <div className="flex flex-col gap-5">
            <Input
              label="Name"
              required
              type="text"
              value={form.name}
              onChange={(e) => {
                setForm((f) => ({ ...f, name: e.target.value }));
                clearError('name');
              }}
              onBlur={() => validateField('name')}
              error={errors.name}
              placeholder="Name"
              className="mb-0"
            />
            <Input
              label="Slug"
              type="text"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              placeholder="Slug (optional – auto-generated from name if blank)"
              className="mb-0"
            />
            <Input
              label="Description"
              type="textarea"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Optional description"
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
