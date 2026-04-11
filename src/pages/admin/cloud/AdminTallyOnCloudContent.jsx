import { useEffect, useState } from 'react';
import api from '../../../api';
import { toast } from '../../../utils/toast';
import { Button, Input, Loader, ConfirmModal } from '../../../components/common';

const EMPTY_STATE = {
  metaTitle: '',
  metaDescription: '',
  metaKeywords: '',
  label: '',
  title: '',
  subtitle: '',
  introText: '',
  benefitsTitle: '',
  benefits: [],
  highlights: [],
  idealForText: '',
  ctaText: '',
  ctaPath: '/contact',
};

export default function AdminTallyOnCloudContent() {
  const [content, setContent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    api.admin.tallyOnCloudContent
      .get()
      .then(setContent)
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('highlight_')) {
      const [, indexStr, field] = name.split('_');
      const i = Number(indexStr);
      setContent((c) => ({
        ...c,
        highlights:
          c.highlights?.map((item, j) => (j === i ? { ...item, [field]: value } : item)) || [],
      }));
    } else {
      setContent((c) => ({ ...c, [name]: value }));
    }
  };

  const handleBenefitsChange = (e) => {
    const lines = e.target.value.split('\n').map((l) => l.trim()).filter(Boolean);
    setContent((c) => ({ ...c, benefits: lines }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await api.admin.tallyOnCloudContent.update(content);
      setMessage('Saved successfully.');
      toast.success('Tally on Cloud content saved');
    } catch (err) {
      const msg = err.message || 'Error saving';
      setMessage(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    setConfirmOpen(false);
    setSaving(true);
    setMessage('');
    try {
      await api.admin.tallyOnCloudContent.remove();
      // Recreate empty doc (backend defaults will fill if we pass {}).
      await api.admin.tallyOnCloudContent.create(EMPTY_STATE);
      const fresh = await api.admin.tallyOnCloudContent.get();
      setContent(fresh);
      setMessage('Content reset.');
      toast.success('Tally on Cloud content reset');
    } catch (err) {
      const msg = err.message || 'Error resetting';
      setMessage(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (!content) return <Loader className="min-h-screen" />;

  const benefitsValue = Array.isArray(content.benefits) ? content.benefits.join('\n') : '';

  return (
    <div className="mx-auto max-w-[1280px]">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="m-0 text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
          Tally on Cloud Content
        </h1>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            fullWidth={false}
            disabled={saving}
            onClick={() => setConfirmOpen(true)}
          >
            Reset
          </Button>
          <Button
            type="submit"
            form="admin-tally-cloud-form"
            variant="primary"
            fullWidth={false}
            disabled={saving}
            loading={saving}
            loadingLabel="Saving..."
          >
            Save changes
          </Button>
        </div>
      </header>

      {message && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-100">
          {message}
        </div>
      )}

      <form id="admin-tally-cloud-form" onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-3 text-base font-semibold text-slate-800 dark:text-gray-100">Meta</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Meta title"
              name="metaTitle"
              type="text"
              value={content.metaTitle || ''}
              onChange={handleChange}
            />
            <Input
              label="Meta description"
              name="metaDescription"
              type="text"
              value={content.metaDescription || ''}
              onChange={handleChange}
            />
            <Input
              label="Meta keywords"
              name="metaKeywords"
              type="text"
              value={content.metaKeywords || ''}
              onChange={handleChange}
            />
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-3 text-base font-semibold text-slate-800 dark:text-gray-100">Hero & Intro</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input label="Label" name="label" type="text" value={content.label || ''} onChange={handleChange} />
            <Input label="Title" name="title" type="text" value={content.title || ''} onChange={handleChange} />
            <Input
              label="Subtitle"
              name="subtitle"
              type="text"
              value={content.subtitle || ''}
              onChange={handleChange}
            />
            <Input
              label="Intro text"
              name="introText"
              type="textarea"
              value={content.introText || ''}
              onChange={handleChange}
            />
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-3 text-base font-semibold text-slate-800 dark:text-gray-100">Benefits</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Benefits section title"
              name="benefitsTitle"
              type="text"
              value={content.benefitsTitle || ''}
              onChange={handleChange}
            />
            <Input
              label="Benefits (one per line)"
              name="benefitsText"
              type="textarea"
              value={benefitsValue}
              onChange={handleBenefitsChange}
            />
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-3 text-base font-semibold text-slate-800 dark:text-gray-100">Highlights</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {(content.highlights || []).map((item, i) => (
              <div
                key={i}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-gray-700 dark:bg-gray-900/40"
              >
                <Input
                  label={`Highlight ${i + 1} title`}
                  name={`highlight_${i}_title`}
                  type="text"
                  value={item.title || ''}
                  onChange={handleChange}
                />
                <Input
                  label="Description"
                  name={`highlight_${i}_description`}
                  type="textarea"
                  value={item.description || ''}
                  onChange={handleChange}
                  className="mt-2"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-3 text-base font-semibold text-slate-800 dark:text-gray-100">CTA</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Ideal for text"
              name="idealForText"
              type="text"
              value={content.idealForText || ''}
              onChange={handleChange}
            />
            <Input label="CTA text" name="ctaText" type="text" value={content.ctaText || ''} onChange={handleChange} />
            <Input label="CTA path" name="ctaPath" type="text" value={content.ctaPath || ''} onChange={handleChange} />
          </div>
        </section>
      </form>
      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleReset}
        title="Confirm reset"
        message="Reset Tally on Cloud content?"
        confirmLabel="Reset"
        confirmVariant="error"
      />
    </div>
  );
}

