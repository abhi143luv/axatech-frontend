import { Checkbox, Input, Upload } from '../../common';

export default function AdminHeroBannerForm({
  form,
  setForm,
  imageFile,
  onFileChange,
  existingImageUrl,
  errors = {},
  onClearError,
  onValidateField,
}) {
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
        placeholder="e.g. Spring offer"
        error={errors.title}
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Sort Order"
          type="number"
          value={form.sortOrder}
          onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
          placeholder="0"
        />
        <div className="flex flex-col justify-end pb-0.5">
          <span className="mb-2 block text-sm font-medium text-slate-600 dark:text-gray-400">Status</span>
          <Checkbox
            label="Active"
            checked={form.isActive}
            onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
          />
        </div>
      </div>
    </div>
  );
}
