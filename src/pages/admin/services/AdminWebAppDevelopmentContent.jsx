import { useEffect, useState } from 'react';
import api from '../../../api';
import { toast } from '../../../utils/toast';
import { Button, Input, Loader } from '../../../components/common';
import ConfirmModal from '../../../components/common/ConfirmModal';

export default function AdminWebAppDevelopmentContent() {
  const [content, setContent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    api.admin.webAppDevelopmentContent
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
        highlights: c.highlights?.map((item, j) => (j === i ? { ...item, [field]: value } : item)) || [],
      }));
      return;
    }

    if (name.startsWith('offering_')) {
      const [, indexStr, field] = name.split('_');
      const i = Number(indexStr);

      if (field === 'points') {
        const lines = value.split('\n').map((l) => l.trim()).filter(Boolean);
        setContent((c) => ({
          ...c,
          offerings: c.offerings?.map((item, j) => (j === i ? { ...item, points: lines } : item)) || [],
        }));
        return;
      }

      setContent((c) => ({
        ...c,
        offerings: c.offerings?.map((item, j) => (j === i ? { ...item, [field]: value } : item)) || [],
      }));
      return;
    }

    setContent((c) => ({ ...c, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await api.admin.webAppDevelopmentContent.update(content);
      setMessage('Saved successfully.');
      toast.success('Web App Development content saved');
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
      await api.admin.webAppDevelopmentContent.remove();
      // GET recreates server-side defaults (full Web App Development content).
      const fresh = await api.admin.webAppDevelopmentContent.get();
      setContent(fresh);
      setMessage('Content reset to defaults.');
      toast.success('Web App Development content reset');
    } catch (err) {
      const msg = err.message || 'Error resetting';
      setMessage(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (!content) return <Loader className="min-h-screen" />;

  return (
    <div className="mx-auto max-w-[1280px]">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="m-0 text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
          Web App Development Content
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
            form="admin-web-app-development-form"
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

      <form id="admin-web-app-development-form" onSubmit={handleSubmit} className="space-y-6">
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
          <h2 className="mb-3 text-base font-semibold text-slate-800 dark:text-gray-100">Header</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input label="Label" name="label" value={content.label || ''} onChange={handleChange} />
            <Input label="Title" name="title" value={content.title || ''} onChange={handleChange} />
            <Input label="Subtitle" name="subtitle" type="textarea" value={content.subtitle || ''} onChange={handleChange} />
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
          <h2 className="mb-3 text-base font-semibold text-slate-800 dark:text-gray-100">Highlights</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {(content.highlights || []).map((item, i) => (
              <div key={i} className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
                <Input label={`Highlight ${i + 1} title`} name={`highlight_${i}_title`} value={item.title || ''} onChange={handleChange} />
                <Input label="Description" name={`highlight_${i}_description`} type="textarea" value={item.description || ''} onChange={handleChange} className="mt-2" />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-3 text-base font-semibold text-slate-800 dark:text-gray-100">Offerings</h2>
          <div className="space-y-4">
            {(content.offerings || []).map((item, i) => (
              <div key={i} className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-gray-700 dark:bg-gray-900/40">
                <Input label={`Offering ${i + 1} label`} name={`offering_${i}_label`} value={item.label || ''} onChange={handleChange} />
                <Input label="Title" name={`offering_${i}_title`} value={item.title || ''} onChange={handleChange} />
                <Input
                  label="Points (one per line)"
                  name={`offering_${i}_points`}
                  type="textarea"
                  value={Array.isArray(item.points) ? item.points.join('\n') : ''}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>
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

