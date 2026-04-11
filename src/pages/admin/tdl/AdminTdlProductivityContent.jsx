import { useEffect, useState } from 'react';
import api from '../../../api';
import { toast } from '../../../utils/toast';
import { Button, Input, Loader, ConfirmModal } from '../../../components/common';

const DEFAULT_CREATE_BODY = {};

export default function AdminTdlProductivityContent() {
  const [content, setContent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    api.admin.tdlProductivityContent
      .get()
      .then(setContent)
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith('pillar_')) {
      const [, indexStr, field] = name.split('_');
      const i = Number(indexStr);

      setContent((c) => ({
        ...c,
        productivityPillars:
          c.productivityPillars?.map((item, j) => (j === i ? { ...item, [field]: value } : item)) ||
          [],
      }));
      return;
    }

    setContent((c) => ({ ...c, [name]: value }));
  };

  const handlePointsChange = (e) => {
    const lines = e.target.value
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    setContent((c) => ({ ...c, points: lines }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await api.admin.tdlProductivityContent.update(content);
      setMessage('Saved successfully.');
      toast.success('Tdl productivity content saved');
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
      await api.admin.tdlProductivityContent.remove();
      const fresh = await api.admin.tdlProductivityContent.create(DEFAULT_CREATE_BODY);
      setContent(fresh);
      setMessage('Content reset to defaults.');
      toast.success('Tdl productivity content reset');
    } catch (err) {
      const msg = err.message || 'Error resetting';
      setMessage(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (!content) return <Loader className="min-h-screen" />;

  const pointsValue = Array.isArray(content.points) ? content.points.join('\n') : '';

  return (
    <div className="mx-auto max-w-[1280px]">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="m-0 text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
          TDL Productivity Content
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
            form="admin-tdl-productivity-form"
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

      <form
        id="admin-tdl-productivity-form"
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-3 text-base font-semibold text-slate-800 dark:text-gray-100">Meta</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input label="Meta title" name="metaTitle" value={content.metaTitle || ''} onChange={handleChange} />
            <Input
              label="Meta description"
              name="metaDescription"
              value={content.metaDescription || ''}
              onChange={handleChange}
            />
            <Input
              label="Meta keywords"
              name="metaKeywords"
              value={content.metaKeywords || ''}
              onChange={handleChange}
            />
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-3 text-base font-semibold text-slate-800 dark:text-gray-100">Hero & Intro</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input label="Label" name="label" value={content.label || ''} onChange={handleChange} />
            <Input label="Title" name="title" value={content.title || ''} onChange={handleChange} />
            <Input
              label="Subtitle"
              name="subtitle"
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
          <h2 className="mb-3 text-base font-semibold text-slate-800 dark:text-gray-100">Productivity Pillars</h2>
          <div className="space-y-4">
            {(content.productivityPillars || []).map((pillar, i) => (
              <div
                key={i}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-gray-700 dark:bg-gray-900/40"
              >
                <Input
                  label={`Pillar ${i + 1} title`}
                  name={`pillar_${i}_title`}
                  value={pillar.title || ''}
                  onChange={handleChange}
                />
                <Input
                  label="Description"
                  name={`pillar_${i}_description`}
                  type="textarea"
                  value={pillar.description || ''}
                  onChange={handleChange}
                  className="mt-2"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-3 text-base font-semibold text-slate-800 dark:text-gray-100">Key Features</h2>
          <Input
            label="Points (one per line)"
            name="pointsText"
            type="textarea"
            value={pointsValue}
            onChange={handlePointsChange}
          />
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-3 text-base font-semibold text-slate-800 dark:text-gray-100">CTA</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input label="CTA text" name="ctaText" value={content.ctaText || ''} onChange={handleChange} />
            <Input label="CTA path" name="ctaPath" value={content.ctaPath || ''} onChange={handleChange} />
          </div>
        </section>
      </form>
      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleReset}
        title="Confirm reset"
        message="Delete current content and recreate with defaults?"
        confirmLabel="Reset"
        confirmVariant="error"
      />
    </div>
  );
}

