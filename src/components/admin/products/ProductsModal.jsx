import { useState, useEffect } from 'react';
import { Modal } from '../../common';
import ProductForm from './ProductForm';

export default function ProductsModal({
  open,
  mode = 'create',
  title,
  form,
  setForm,
  imageFiles,
  setImageFiles,
  categories = [],
  onSave,
  onClose,
  onDelete,
  existingImageUrls = [],
  isSaving = false,
}) {
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) setErrors({});
  }, [open]);

  const validate = () => {
    const name = (form.name ?? '').trim();
    const slug = (form.slug ?? '').trim();
    const next = {
      name: name ? '' : 'Name is required',
      slug: slug ? '' : 'Slug is required',
    };
    setErrors(next);
    return !Object.values(next).some(Boolean);
  };

  const validateField = (field) => {
    if (field === 'name') {
      const name = (form.name ?? '').trim();
      setErrors((prev) => ({ ...prev, name: name ? '' : 'Name is required' }));
    } else if (field === 'slug') {
      const slug = (form.slug ?? '').trim();
      setErrors((prev) => ({ ...prev, slug: slug ? '' : 'Slug is required' }));
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
      open={open}
      title={title}
      titleId="products-modal-title"
      onClose={onClose}
      primaryLabel={mode === 'create' ? 'Create product' : 'Update product'}
      primaryLoading={isSaving}
      primaryLoadingLabel={mode === 'create' ? 'Creating...' : 'Updating...'}
      primaryDisabled={isSaving}
      onPrimary={handleSave}
      showDelete={mode === 'edit' && !!onDelete}
      onDelete={onDelete}
      size="3xl"
    >
      {isSaving && (
        <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-primary dark:border-secondary/30 dark:bg-secondary/10 dark:text-secondary">
          Please wait, product is being saved...
        </div>
      )}
      <ProductForm
        form={form}
        setForm={setForm}
        imageFiles={imageFiles}
        setImageFiles={setImageFiles}
        categories={categories}
        errors={errors}
        onValidateField={validateField}
        onClearError={clearError}
        existingImageUrls={existingImageUrls}
      />
    </Modal>
  );
}
