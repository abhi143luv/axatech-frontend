import { useState } from 'react';
import { Modal, Input, Checkbox } from '../../common';

export default function ServicesModal({ mode = 'create', form, setForm, onSave, onClose, isSaving = false }) {
  const [errors, setErrors] = useState({ title: '' });

  const validate = () => {
    const next = { title: '' };
    const title = (form.title ?? '').trim();
    if (!title) next.title = 'Title is required';
    setErrors(next);
    return !next.title;
  };

  const validateField = (field, nextValue) => {
    if (field === 'title') {
      const title = (nextValue !== undefined ? nextValue : form.title ?? '').trim();
      setErrors((prev) => ({ ...prev, title: title ? '' : 'Title is required' }));
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
      title={mode === 'create' ? 'Add Service' : 'Edit Service'}
      titleId="services-modal-title"
      onClose={onClose}
      primaryLabel={mode === 'create' ? 'Create service' : 'Update service'}
      primaryLoading={isSaving}
      primaryLoadingLabel={mode === 'create' ? 'Creating service...' : 'Updating service...'}
      primaryDisabled={isSaving}
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
          <Input
            label="Slug"
            type="text"
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            placeholder="Slug (optional - auto-generated from title if blank)"
            className="mb-0"
          />
        </div>
        <Input
          label="Short description"
          type="textarea"
          value={form.shortDescription}
          onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))}
          placeholder="Optional short description"
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
