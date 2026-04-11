import { Input, Dropdown, Checkbox, Upload } from '../../common';
import { CloseIcon } from '../../icons';

const textareaClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-secondary dark:focus:ring-secondary/20 min-h-[80px] resize-y';

export default function ProductForm({
  form,
  setForm,
  imageFiles = [],
  setImageFiles,
  categories = [],
  errors = {},
  onValidateField,
  onClearError,
  existingImageUrls = [],
}) {
  const categoryOptions = categories.map((c) => ({ value: c._id, label: c.name }));

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input
          label="Name"
          required
          type="text"
          value={form.name}
          onChange={(e) => {
            setForm((f) => ({ ...f, name: e.target.value }));
            onClearError?.('name');
          }}
          onBlur={() => onValidateField?.('name')}
          placeholder="Name"
          error={errors.name}
          className="mb-0"
        />
        <Input
          label="Slug"
          required
          type="text"
          value={form.slug}
          onChange={(e) => {
            setForm((f) => ({ ...f, slug: e.target.value }));
            onClearError?.('slug');
          }}
          onBlur={() => onValidateField?.('slug')}
          placeholder="Slug (e.g. my-product)"
          error={errors.slug}
          className="mb-0"
        />
      </div>

      <Input
        label="Short description"
        type="text"
        value={form.shortDescription}
        onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))}
        placeholder="Short description"
        className="mb-0"
      />

      <Input
        label="Description"
        type="textarea"
        value={form.description}
        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        placeholder="Description"
        className="mb-0"
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Dropdown
          label="Category"
          placeholder="No category"
          value={form.category}
          onChange={(v) => {
            setForm((f) => ({ ...f, category: v }));
            onClearError?.('category');
          }}
          options={categoryOptions}
          showPlaceholderOption={true}
          className="mb-0"
        />
        
      <div className="flex flex-wrap items-center gap-6">
        <div className="flex flex-col justify-end pb-0.5">
          <span className="mb-2 block text-sm font-medium text-slate-600 dark:text-gray-400">Featured</span>
          <Checkbox
            size="md"
            label="Featured"
            checked={form.featured}
            onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
          />
        </div>
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
      </div>

      <Input
        label="Demo video (YouTube)"
        type="url"
        value={form.demoVideoLink || ''}
        onChange={(e) => setForm((f) => ({ ...f, demoVideoLink: e.target.value }))}
        placeholder="https://www.youtube.com/watch?v=… or https://youtu.be/…"
        className="mb-0"
      />
      <p className="text-xs text-slate-500 dark:text-gray-400 -mt-2">
        Paste a YouTube watch or share link. Old uploaded video files are no longer used; replace with a link or clear the field.
      </p>

      <div>
        {existingImageUrls.length > 0 && (
          <div className="mb-3">
            <p className="mb-2 text-xs font-medium text-slate-500 dark:text-gray-400">Current images</p>
            <div className="flex flex-wrap gap-3">
              {existingImageUrls.map((url, index) => (
                <div key={url + index} className="relative group">
                  <div className="relative h-24 w-24 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-gray-600 bg-slate-100 dark:bg-gray-700 shrink-0 shadow-sm">
                    <img src={url} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, images: (f.images || []).filter((_, i) => i !== index) }))}
                      aria-label="Remove image"
                      className="absolute top-1 right-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 text-xs"
                    >
                      <CloseIcon className="text-sm" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <Upload
          label="Images"
          accept="image/*"
          multiple
          files={imageFiles}
          onFilesChange={(files) => {
            onClearError?.('images');
            setImageFiles(files);
          }}
        />
      </div>
    </div>
  );
}
