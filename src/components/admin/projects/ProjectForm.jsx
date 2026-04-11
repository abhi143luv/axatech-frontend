import { Input, Upload, Checkbox } from '../../common';

const inputClass =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:focus:border-secondary dark:focus:ring-secondary/20';
const textareaClass = inputClass + ' min-h-[80px] resize-y';

export default function ProjectForm({
  form,
  setForm,
  imageFile,
  onFileChange,
  existingImageUrl,
  errors = {},
  onClearError,
  onValidateField,
}) {
  const keyFeaturesText = (form.keyFeatures || []).join('\n');
  const setKeyFeaturesText = (text) =>
    setForm((f) => ({
      ...f,
      keyFeatures: text
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
    }));

  return (
    <div className="flex flex-col gap-4">
      <Input
        label="Title"
        required
        type="text"
        value={form.title}
        onChange={(e) => {
          setForm((f) => ({ ...f, title: e.target.value }));
          onClearError?.('title');
        }}
        onBlur={() => onValidateField?.('title')}
        placeholder="Project title"
        error={errors.title}
      />
      <Input
        label="Description"
        required
        type="textarea"
        value={form.description}
        onChange={(e) => {
          setForm((f) => ({ ...f, description: e.target.value }));
          onClearError?.('description');
        }}
        onBlur={() => onValidateField?.('description')}
        placeholder="Project description"
        error={errors.description}
      />
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-gray-400">
          Key features (one per line)
        </label>
        <textarea
          className={textareaClass}
          placeholder="Feature 1&#10;Feature 2&#10;..."
          value={keyFeaturesText}
          onChange={(e) => setKeyFeaturesText(e.target.value)}
          rows={4}
        />
      </div>
      <Input
        label="Category"
        required
        type="text"
        value={form.category}
        onChange={(e) => {
          setForm((f) => ({ ...f, category: e.target.value }));
          onClearError?.('category');
        }}
        onBlur={() => onValidateField?.('category')}
        placeholder="e.g. Marketing Automation"
        error={errors.category}
      />
      <Upload
        label="Image"
        required
        accept="image/*"
        file={imageFile}
        onFileChange={(file) => {
          onClearError?.('image');
          onFileChange?.(file);
        }}
        existingUrl={existingImageUrl}
        error={errors.image}
      />
      <Input
        label="Web link"
        required
        type="url"
        value={form.webLink}
        onChange={(e) => {
          setForm((f) => ({ ...f, webLink: e.target.value }));
          onClearError?.('webLink');
        }}
        onBlur={() => onValidateField?.('webLink')}
        placeholder="https://..."
        error={errors.webLink}
      />
      <div className="flex flex-wrap items-center gap-6">
        <Checkbox
          label="Active"
          checked={form.isActive}
          onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
        />
        {/* <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600 dark:text-gray-400">Sort order</label>
          <input
            type="number"
            className={inputClass + ' w-24'}
            value={form.sortOrder}
            onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
          />
        </div> */}
      </div>
    </div>
  );
}
