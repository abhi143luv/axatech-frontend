import { useState, useEffect } from 'react';
import { Modal } from '../../common';
import ProjectForm from './ProjectForm';

export default function ProjectsModal({
  open,
  mode = 'create',
  title,
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
    const description = (form.description ?? '').trim();
    const category = (form.category ?? '').trim();
    const image = form.image || imageFile;
    const webLink = (form.webLink ?? '').trim();
    const next = {
      title: title ? '' : 'Title is required',
      description: description ? '' : 'Description is required',
      category: category ? '' : 'Category is required',
      image: image ? '' : 'Image is required',
      webLink: webLink ? '' : 'Web link is required',
    };
    setErrors(next);
    return !Object.values(next).some(Boolean);
  };

  const validateField = (field) => {
    if (field === 'title') {
      const title = (form.title ?? '').trim();
      setErrors((prev) => ({ ...prev, title: title ? '' : 'Title is required' }));
    } else if (field === 'description') {
      const description = (form.description ?? '').trim();
      setErrors((prev) => ({
        ...prev,
        description: description ? '' : 'Description is required',
      }));
    } else if (field === 'category') {
      const category = (form.category ?? '').trim();
      setErrors((prev) => ({ ...prev, category: category ? '' : 'Category is required' }));
    } else if (field === 'webLink') {
      const webLink = (form.webLink ?? '').trim();
      setErrors((prev) => ({ ...prev, webLink: webLink ? '' : 'Web link is required' }));
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
      titleId="projects-modal-title"
      onClose={onClose}
      primaryLabel={mode === 'create' ? 'Create project' : 'Update project'}
      primaryLoading={isSaving}
      primaryLoadingLabel={mode === 'create' ? 'Creating project...' : 'Updating project...'}
      primaryDisabled={isSaving}
      onPrimary={handleSave}
      cancelLabel="Cancel"
      onCancel={onClose}
      size="2xl"
    >
      <ProjectForm
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
