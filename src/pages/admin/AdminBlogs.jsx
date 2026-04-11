import { useEffect, useState } from 'react';
import api from '../../api';
import { toast } from '../../utils/toast';
import { Button } from '../../components/common';

const inputClass = 'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:focus:border-secondary dark:focus:ring-secondary/20';
const selectClass = inputClass;
const textareaClass = 'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:focus:border-secondary dark:focus:ring-secondary/20 min-h-[80px]';

export default function AdminBlogs() {
  const [data, setData] = useState({ blogs: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', slug: '', excerpt: '', content: '', author: '', published: false, metaTitle: '', metaDescription: '' });
  const [imageFile, setImageFile] = useState(null);

  const load = () => api.admin.blogs.list({ limit: 50 }).then(setData).catch(console.error);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, []);

  const openCreate = () => {
    setEditing('new');
    setForm({ title: '', slug: '', excerpt: '', content: '', author: '', published: false, metaTitle: '', metaDescription: '' });
    setImageFile(null);
  };

  const openEdit = (b) => {
    setEditing(b._id);
    setForm({
      title: b.title,
      slug: b.slug || '',
      excerpt: b.excerpt || '',
      content: b.content || '',
      author: b.author || '',
      published: !!b.published,
      metaTitle: b.metaTitle || '',
      metaDescription: b.metaDescription || '',
      image: b.image ? b.image.split('/').pop() : '',
    });
    setImageFile(null);
  };

  const save = async () => {
    let imageFilename = form.image;
    if (imageFile) {
      try {
        imageFilename = await api.upload(imageFile);
      } catch (e) {
        toast.error('Image upload failed: ' + e.message);
        return;
      }
    }
    const payload = {
      title: form.title,
      slug: form.slug || undefined,
      excerpt: form.excerpt || undefined,
      content: form.content,
      author: form.author || undefined,
      published: form.published,
      metaTitle: form.metaTitle || undefined,
      metaDescription: form.metaDescription || undefined,
    };
    if (imageFilename) payload.image = imageFilename;
    try {
      if (editing === 'new') {
        await api.admin.blogs.create(payload);
        toast.success('Blog post created');
      } else {
        await api.admin.blogs.update(editing, payload);
        toast.success('Blog post updated');
      }
      setEditing(null);
      load();
    } catch (e) {
      toast.error(e.message || 'Failed to save blog post');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this post?')) return;
    try {
      await api.admin.blogs.delete(id);
      toast.success('Blog post deleted');
      setEditing(null);
      load();
    } catch (e) {
      toast.error(e.message || 'Failed to delete blog post');
    }
  };

  const BlogForm = ({ isInline }) => (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4 max-[520px]:grid-cols-1">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-600 dark:text-gray-400">Title</label>
          <input className={inputClass} placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-600 dark:text-gray-400">Slug</label>
          <input className={inputClass} placeholder="Slug" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-600 dark:text-gray-400">Excerpt</label>
        <input className={inputClass} placeholder="Excerpt" value={form.excerpt} onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-600 dark:text-gray-400">Content</label>
        <textarea className={textareaClass} placeholder="Content" value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} rows={6} />
      </div>
      <div className="grid grid-cols-2 gap-4 max-[520px]:grid-cols-1">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-slate-600 dark:text-gray-400">Author</label>
          <input className={inputClass} placeholder="Author" value={form.author} onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))} />
        </div>
        <div className="flex flex-row flex-wrap items-center gap-4">
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-600 dark:text-gray-400">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} className="rounded border-gray-300 text-primary focus:ring-primary/20 dark:border-gray-500 dark:text-secondary" />
            <span>Published</span>
          </label>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-600 dark:text-gray-400">Meta title</label>
        <input className={inputClass} placeholder="Meta title" value={form.metaTitle} onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-600 dark:text-gray-400">Meta description</label>
        <textarea className={textareaClass} placeholder="Meta description" value={form.metaDescription} onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))} rows={2} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-slate-600 dark:text-gray-400">Featured image</label>
        <input type="file" accept="image/*" className="block w-full text-sm text-slate-600 file:mr-2 file:rounded file:border-0 file:bg-primary file:px-3 file:py-1.5 file:font-medium file:text-white dark:text-gray-400" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
      </div>
      <div className="mt-2 flex flex-wrap gap-2 border-t border-gray-200 pt-2 dark:border-gray-600">
        <Button type="button" variant="primary" fullWidth={false} onClick={save}>{editing === 'new' ? 'Create' : 'Save'}</Button>
        <Button type="button" variant="outline" fullWidth={false} onClick={() => setEditing(null)}>Cancel</Button>
        {!isInline && editing !== 'new' && (
          <Button type="button" variant="error" fullWidth={false} onClick={() => remove(editing)}>Delete</Button>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-[1280px]">
        <div className="py-12 px-4 text-center text-base text-slate-500 dark:text-gray-400">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-gray-200 border-t-primary dark:border-gray-600 dark:border-t-secondary" />
          <p>Loading blogs…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1280px]">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="m-0 text-2xl font-bold tracking-tight text-slate-800 dark:text-white">Blogs</h1>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="primary" fullWidth={false} onClick={openCreate}>Add Post</Button>
        </div>
      </header>

      <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm [&_tbody_tr:last-child_td]:border-b-0">
            <thead>
              <tr>
                <th className="border-b border-gray-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-gray-600 dark:bg-gray-700/50 dark:text-slate-400">Title</th>
                <th className="border-b border-gray-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-gray-600 dark:bg-gray-700/50 dark:text-slate-400">Published</th>
                <th className="border-b border-gray-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-gray-600 dark:bg-gray-700/50 dark:text-slate-400">Date</th>
                <th className="whitespace-nowrap border-b border-gray-200 bg-slate-50 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-gray-600 dark:bg-gray-700/50 dark:text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {(data.blogs || []).map((b) => (
                <tr key={b._id} className="transition-colors duration-150 hover:bg-slate-50 dark:hover:bg-gray-700/30">
                  {editing === b._id ? (
                    <td colSpan={4} className="border-b border-slate-100 px-4 py-3.5 align-middle dark:border-gray-600">
                      <div className="py-2">
                        <BlogForm isInline />
                      </div>
                    </td>
                  ) : (
                    <>
                      <td className="border-b border-slate-100 px-4 py-3.5 align-middle text-slate-700 dark:border-gray-600 dark:text-gray-300">{b.title}</td>
                      <td className="border-b border-slate-100 px-4 py-3.5 align-middle dark:border-gray-600">
                        <span className={b.published ? 'inline-block rounded-md bg-success/15 px-2.5 py-1 text-[0.78rem] font-semibold uppercase tracking-wide text-success-dark dark:bg-success/20 dark:text-success-light' : 'inline-block rounded-md bg-slate-100 px-2.5 py-1 text-[0.78rem] font-semibold uppercase tracking-wide text-slate-500 dark:bg-gray-600 dark:text-gray-400'}>{b.published ? 'Yes' : 'No'}</span>
                      </td>
                      <td className="border-b border-slate-100 px-4 py-3.5 align-middle text-slate-700 dark:border-gray-600 dark:text-gray-300">{b.publishedAt ? new Date(b.publishedAt).toLocaleDateString() : '—'}</td>
                      <td className="whitespace-nowrap border-b border-slate-100 px-4 py-3.5 text-right align-middle dark:border-gray-600">
                        <Button type="button" variant="outline" fullWidth={false} onClick={() => openEdit(b)}>Edit</Button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(!data.blogs || data.blogs.length === 0) && (
          <div className="mx-4 mb-4 py-10 text-center text-base text-slate-500 dark:text-gray-400">No blog posts yet. Add one to get started.</div>
        )}
      </div>

      {editing === 'new' && (
        <div className="fixed inset-0 z-1000 flex animate-admin-fadeIn items-center justify-center bg-slate-900/50 p-6" onClick={() => setEditing(null)}>
          <div className="flex max-h-[90vh] w-full max-w-[720px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl animate-admin-slideUp dark:bg-gray-800" onClick={(e) => e.stopPropagation()}>
            <div className="shrink-0 border-b border-gray-200 px-6 py-5 text-lg font-bold text-slate-800 dark:border-gray-600 dark:text-white">Add Blog Post</div>
            <div className="flex-1 overflow-y-auto p-6">
              <BlogForm isInline={false} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
