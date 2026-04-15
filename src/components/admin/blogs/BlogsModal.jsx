import { useState } from 'react';
import { Modal, Input, Checkbox } from '../../common';

export default function BlogsModal({
  mode = 'create',
  form,
  setForm,
  onSave,
  onClose,
  imageFile,
  setImageFile,
  isSaving = false,
}) {
  const [errors, setErrors] = useState({ title: '', content: '' });

  const validate = () => {
    const next = { title: '', content: '' };
    const title = (form.title ?? '').trim();
    const content = (form.content ?? '').trim();
    if (!title) next.title = 'Title is required';
    if (!content) next.content = 'Content is required';
    setErrors(next);
    return !next.title && !next.content;
  };

  const validateField = (field, nextValue) => {
    if (field === 'title') {
      const title = (nextValue !== undefined ? nextValue : form.title ?? '').trim();
      setErrors((prev) => ({ ...prev, title: title ? '' : 'Title is required' }));
    } else if (field === 'content') {
      const content = (nextValue !== undefined ? nextValue : form.content ?? '').trim();
      setErrors((prev) => ({ ...prev, content: content ? '' : 'Content is required' }));
    }
  };

  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSave = () => {
    if (isSaving) return;
    if (!validate()) return;
    onSave?.();
  };

  return (
    <Modal
      title={mode === 'create' ? 'Add Blog Post' : 'Edit Blog Post'}
      titleId="blogs-modal-title"
      onClose={onClose}
      primaryLabel={mode === 'create' ? 'Create post' : 'Update post'}
      primaryLoading={isSaving}
      primaryLoadingLabel={mode === 'create' ? 'Creating post...' : 'Updating post...'}
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
            placeholder="Optional"
            className="mb-0"
          />
        </div>

        <Input
          label="Excerpt"
          type="text"
          value={form.excerpt}
          onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
          placeholder="Optional excerpt"
          className="mb-0"
        />

        <Input
          label="Content"
          required
          type="textarea"
          value={form.content}
          onChange={(e) => {
            setForm((f) => ({ ...f, content: e.target.value }));
            clearError('content');
          }}
          onBlur={() => validateField('content')}
          error={errors.content}
          className="mb-0"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Author"
            type="text"
            value={form.author}
            onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
            placeholder="Optional"
            className="mb-0"
          />
          <div className="flex flex-col justify-end pb-0.5">
            <span className="mb-2 block text-sm font-medium text-slate-600 dark:text-gray-400">Status</span>
            <Checkbox
              size="md"
              label="Published"
              checked={!!form.published}
              onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
            />
          </div>
        </div>

        <Input
          label="Meta title"
          type="text"
          value={form.metaTitle}
          onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))}
          placeholder="Optional"
          className="mb-0"
        />

        <Input
          label="Meta description"
          type="textarea"
          value={form.metaDescription}
          onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))}
          placeholder="Optional"
          className="mb-0"
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Featured image</label>
          <input
            type="file"
            accept="image/*"
            className="block w-full text-sm text-slate-600 file:mr-2 file:rounded file:border-0 file:bg-primary file:px-3 file:py-1.5 file:font-medium file:text-white dark:text-gray-400"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
          {(imageFile || form.image) && (
            <p className="text-xs text-slate-500 dark:text-gray-400">
              Selected: {imageFile?.name || form.image}
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}
