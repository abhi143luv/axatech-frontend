import { useEffect, useState } from 'react';
import { Modal } from '../../common';
import AdminHeroBannerForm from './AdminHeroBannerForm';

export default function AdminHeroBannerModal({
  open,
  mode = 'create',
  form,
  setForm,
  imageFile,
  onFileChange,
  existingImageUrl,
  onSave,
  onClose,
  isSaving = false,
}) {
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) setErrors({});
  }, [open]);

  const validate = () => {
    const title = (form.title ?? '').trim();
    const image = form.image || imageFile;
    const next = {
      title: title ? '' : 'Title is required',
      image: image ? '' : 'Image is required',
    };
    setErrors(next);
    return !Object.values(next).some(Boolean);
  };

  const handleSave = () => {
    if (isSaving) return;
    if (!validate()) return;
    onSave?.();
  };

  const validateField = (field) => {
    if (field === 'title') {
      const title = (form.title ?? '').trim();
      setErrors((prev) => ({ ...prev, title: title ? '' : 'Title is required' }));
    }
  };

  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <Modal
      open={open}
      title={mode === 'create' ? 'Add hero banner' : 'Edit hero banner'}
      titleId="admin-hero-banner-modal-title"
      onClose={onClose}
      primaryLabel={mode === 'create' ? 'Create' : 'Update'}
      primaryLoading={isSaving}
      primaryLoadingLabel={mode === 'create' ? 'Creating…' : 'Updating…'}
      primaryDisabled={isSaving}
      onPrimary={handleSave}
      size="2xl"
    >
      <AdminHeroBannerForm
        form={form}
        setForm={setForm}
        imageFile={imageFile}
        onFileChange={onFileChange}
        existingImageUrl={existingImageUrl}
        errors={errors}
        onClearError={clearError}
        onValidateField={validateField}
      />
    </Modal>
  );
}
