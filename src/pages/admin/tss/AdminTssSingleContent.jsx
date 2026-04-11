import { useEffect, useState } from 'react';
import api from '../../../api';
import { toast } from '../../../utils/toast';
import { Button, Input, Loader } from '../../../components/common';

export default function AdminTssSingleContent() {
  const [content, setContent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.admin.tssContent.get().then(setContent).catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('singleHighlight_')) {
      const [, indexStr, field] = name.split('_');
      const i = Number(indexStr);
      setContent((c) => ({
        ...c,
        singleHighlights: c.singleHighlights?.map((item, j) =>
          j === i ? { ...item, [field]: value } : item
        ) || [],
      }));
    } else {
      setContent((c) => ({ ...c, [name]: value }));
    }
  };

  const handleBenefitsChange = (e) => {
    const lines = e.target.value.split('\n').map((l) => l.trim()).filter(Boolean);
    setContent((c) => ({ ...c, singleBenefits: lines }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await api.admin.tssContent.update(content);
      setMessage('Saved successfully.');
      toast.success('TSS single renewal content saved');
    } catch (err) {
      const msg = err.message || 'Error saving';
      setMessage(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (!content) {
    return <Loader className="min-h-screen" />;
  }

  const benefitsValue = Array.isArray(content.singleBenefits)
    ? content.singleBenefits.join('\n')
    : '';

  return (
    <div className="mx-auto max-w-[1280px]">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="m-0 text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
          TSS Single Renewal Content
        </h1>
        <div className="flex flex-wrap gap-2">
          <Button
            type="submit"
            form="admin-tss-single-form"
            variant="primary"
            fullWidth={false}
            disabled={saving}
            loading={saving}
            loadingLabel="Saving…"
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

      <form id="admin-tss-single-form" onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-3 text-base font-semibold text-slate-800 dark:text-gray-100">
            Meta
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Meta title"
              name="singleMetaTitle"
              type="text"
              value={content.singleMetaTitle || ''}
              onChange={handleChange}
            />
            <Input
              label="Meta description"
              name="singleMetaDescription"
              type="text"
              value={content.singleMetaDescription || ''}
              onChange={handleChange}
            />
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-3 text-base font-semibold text-slate-800 dark:text-gray-100">
            Hero & Intro
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Label"
              name="singleLabel"
              type="text"
              value={content.singleLabel || ''}
              onChange={handleChange}
            />
            <Input
              label="Title"
              name="singleTitle"
              type="text"
              value={content.singleTitle || ''}
              onChange={handleChange}
            />
            <Input
              label="Subtitle"
              name="singleSubtitle"
              type="text"
              value={content.singleSubtitle || ''}
              onChange={handleChange}
            />
            <Input
              label="Intro text"
              name="singleIntroText"
              type="textarea"
              value={content.singleIntroText || ''}
              onChange={handleChange}
            />
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-3 text-base font-semibold text-slate-800 dark:text-gray-100">
            Benefits
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Benefits section title"
              name="singleBenefitsTitle"
              type="text"
              value={content.singleBenefitsTitle || ''}
              onChange={handleChange}
            />
            <Input
              label="Benefits (one per line)"
              name="singleBenefitsText"
              type="textarea"
              value={benefitsValue}
              onChange={handleBenefitsChange}
            />
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-3 text-base font-semibold text-slate-800 dark:text-gray-100">
            Highlights
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {(content.singleHighlights || []).map((item, i) => (
              <div
                key={i}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-gray-700 dark:bg-gray-900/40"
              >
                <Input
                  label={`Highlight ${i + 1} title`}
                  name={`singleHighlight_${i}_title`}
                  type="text"
                  value={item.title || ''}
                  onChange={handleChange}
                />
                <Input
                  label="Description"
                  name={`singleHighlight_${i}_description`}
                  type="textarea"
                  value={item.description || ''}
                  onChange={handleChange}
                  className="mt-2"
                />
              </div>
            ))}
          </div>
        </section>
      </form>
    </div>
  );
}

