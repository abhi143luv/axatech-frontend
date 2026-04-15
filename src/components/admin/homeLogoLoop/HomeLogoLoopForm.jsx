import { Checkbox, Input, Upload } from '../../common';

export default function HomeLogoLoopForm({
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
        label="Name"
        required
        type="text"
        value={form.name}
        onChange={(e) => {
          setForm((f) => ({ ...f, name: e.target.value }));
          onClearError?.('name');
        }}
        onBlur={() => onValidateField?.('name')}
        placeholder="e.g. React"
        error={errors.name}
      />

      <Input
        label="Link"
        type="url"
        value={form.link}
        onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
        placeholder="https://example.com"
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
