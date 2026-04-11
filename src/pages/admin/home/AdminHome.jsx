import { useEffect, useState } from 'react';
import api from '../../../api';
import { toast } from '../../../utils/toast';
import { Button, Loader } from '../../../components/common';
import {
  HeroSection,
  IntroSection,
  WhyChooseSection,
  SeoSection,
  HomeFormMessage,
} from '../../../components/admin/home';

export default function AdminHome() {
  const [content, setContent] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.admin.home.get().then(setContent).catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('whyChoose_')) {
      const i = Number(name.split('_')[1]);
      const field = name.split('_')[2];
      setContent((c) => ({
        ...c,
        whyChooseItems: c.whyChooseItems?.map((item, j) => (j === i ? { ...item, [field]: value } : item)) || [],
      }));
    } else {
      setContent((c) => ({ ...c, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await api.admin.home.update(content);
      setMessage('Saved successfully.');
      toast.success('Home content saved');
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

  return (
    <div className="mx-auto max-w-[1280px]">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="m-0 text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
          Home Content
        </h1>
        <div className="flex flex-wrap gap-2">
          <Button
            type="submit"
            form="admin-home-form"
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

      <form id="admin-home-form" onSubmit={handleSubmit} className="space-y-6">
        <HomeFormMessage message={message} />
        <HeroSection content={content} onChange={handleChange} />
        <IntroSection content={content} onChange={handleChange} />
        <WhyChooseSection content={content} onChange={handleChange} />
        <SeoSection content={content} onChange={handleChange} />
      </form>
    </div>
  );
}
