import { useEffect, useState } from 'react';
import { Modal } from '../../common';
import HomeLogoLoopForm from './HomeLogoLoopForm';

export default function HomeLogoLoopModal({
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
    const name = (form.name ?? '').trim();
    const image = form.image || imageFile;
    const next = {
      name: name ? '' : 'Name is required',
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
    if (field === 'name') {
      const name = (form.name ?? '').trim();
      setErrors((prev) => ({ ...prev, name: name ? '' : 'Name is required' }));
    }
  };

  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <Modal
      open={open}
      title={mode === 'create' ? 'Add Home Logo Item' : 'Edit Home Logo Item'}
      titleId="home-logo-loop-modal-title"
      onClose={onClose}
      primaryLabel={mode === 'create' ? 'Create item' : 'Update item'}
      primaryLoading={isSaving}
      primaryLoadingLabel={mode === 'create' ? 'Creating item...' : 'Updating item...'}
      primaryDisabled={isSaving}
      onPrimary={handleSave}
      size="2xl"
    >
      <HomeLogoLoopForm
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
