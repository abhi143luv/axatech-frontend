import { useState } from 'react';
import { Modal, Input, Dropdown, Checkbox, Upload } from '../../common';
import api from '../../../api';

const CATEGORY_OPTIONS = [
  { value: 'Frontend Technologies', label: 'Frontend Technologies' },
  { value: 'Backend Technologies', label: 'Backend Technologies' },
  { value: 'Database Technologies', label: 'Database Technologies' },
];

export default function TechnologiesModal({ mode = 'create', form, setForm, onSave, onClose }) {
  const [errors, setErrors] = useState({ title: '', description: '', category: '', image: '' });
  const [uploading, setUploading] = useState(false);

  const validate = () => {
    const next = { title: '', description: '', category: '', image: '' };
    const title = (form.title ?? '').trim();
    if (!title) next.title = 'Title is required';
    const description = (form.description ?? '').trim();
    if (!description) next.description = 'Description is required';
    const category = form.category ?? '';
    if (!category || !CATEGORY_OPTIONS.some((o) => o.value === category)) {
      next.category = 'Category is required';
    }
    const image = (form.image ?? '').trim();
    if (!image) next.image = 'Image is required';
    setErrors(next);
    return !next.title && !next.description && !next.category && !next.image;
  };

  const validateField = (field, nextValue) => {
    if (field === 'title') {
      const title = (nextValue !== undefined ? nextValue : form.title ?? '').trim();
      setErrors((prev) => ({ ...prev, title: title ? '' : 'Title is required' }));
    } else if (field === 'description') {
      const description = (nextValue !== undefined ? nextValue : form.description ?? '').trim();
      setErrors((prev) => ({ ...prev, description: description ? '' : 'Description is required' }));
    } else if (field === 'category') {
      const category = nextValue !== undefined ? nextValue : (form.category ?? '');
      const valid = category && CATEGORY_OPTIONS.some((o) => o.value === category);
      setErrors((prev) => ({ ...prev, category: valid ? '' : 'Category is required' }));
    } else if (field === 'image') {
      const image = (nextValue !== undefined ? nextValue : form.image ?? '').trim();
      setErrors((prev) => ({ ...prev, image: image ? '' : 'Image is required' }));
    }
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave?.();
  };

  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleImageUpload = async (file) => {
    if (!file) {
      setForm((f) => ({ ...f, image: '' }));
      clearError('image');
      return;
    }
    setUploading(true);
    try {
      const url = await api.uploadTechnologyImage(file);
      setForm((f) => ({ ...f, image: url }));
      clearError('image');
    } catch (e) {
      setErrors((prev) => ({ ...prev, image: e.message || 'Upload failed' }));
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      title={mode === 'create' ? 'Add Technology' : 'Edit Technology'}
      titleId="technology-modal-title"
      onClose={onClose}
      primaryLabel={mode === 'create' ? 'Create' : 'Update'}
      onPrimary={handleSave}
      size="2xl"
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
              label="Category"
              required
              placeholder="Select category"
              value={form.category}
              onChange={(val) => {
                setForm((f) => ({ ...f, category: val }));
                validateField('category', val);
              }}
              onBlur={() => validateField('category')}
              error={errors.category}
              options={CATEGORY_OPTIONS}
              className="mb-0"
            />
          </div>
        </div>
        <Input
          label="Description"
          required
          type="textarea"
          value={form.description}
          onChange={(e) => {
            setForm((f) => ({ ...f, description: e.target.value }));
            clearError('description');
          }}
          onBlur={() => validateField('description')}
          error={errors.description}
          placeholder="Technology description"
          className="mb-0"
        />
        <Upload
          label="Image"
          accept="image/*"
          required
          existingUrl={form.image}
          onFileChange={(file) => {
            if (file) handleImageUpload(file);
            else {
              setForm((f) => ({ ...f, image: '' }));
              clearError('image');
            }
          }}
          error={errors.image}
          className="mb-0"
        />
        {uploading && <p className="text-sm text-slate-500 dark:text-gray-400">Uploading…</p>}
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
