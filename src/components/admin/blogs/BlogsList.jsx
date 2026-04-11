import { useEffect, useState } from 'react';
import api from '../../../api';
import { toast } from '../../../utils/toast';
import { BlogsHeader, BlogsTable, BlogsModal } from './index';

const initialForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  author: '',
  published: false,
  metaTitle: '',
  metaDescription: '',
  image: '',
};

export default function BlogsList() {
  const [data, setData] = useState({
    blogs: [],
    total: 0,
    pages: 1,
    counts: { all: 0, published: 0, draft: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);

  // API-driven filters
  const [statusFilter, setStatusFilter] = useState('all'); // all | published | draft
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortKey, setSortKey] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');

  const load = () => {
    setLoading(true);
    return api.admin.blogs
      .list({
        status: statusFilter,
        search: searchQuery.trim() ? searchQuery.trim() : undefined,
        page,
        limit: rowsPerPage,
        sortKey,
        sortDirection,
      })
      .then((res) => {
        if (res && Array.isArray(res.blogs)) {
          setData({
            blogs: res.blogs,
            total: Number(res.total || 0),
            pages: Number(res.pages || 1),
            counts: res.counts || { all: 0, published: 0, draft: 0 },
          });
          return;
        }

        // Fallback for unexpected backend shape
        if (Array.isArray(res)) {
          setData({
            blogs: res,
            total: res.length,
            pages: 1,
            counts: {
              all: res.length,
              published: res.filter((b) => !!b.published).length,
              draft: res.filter((b) => !b.published).length,
            },
          });
          return;
        }

        setData({
          blogs: [],
          total: 0,
          pages: 1,
          counts: { all: 0, published: 0, draft: 0 },
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [statusFilter, searchQuery, page, rowsPerPage, sortKey, sortDirection]);

  const handleStatusFilterChange = (val) => {
    setStatusFilter(val || 'all');
    setPage(1);
  };

  const handleSearchQueryChange = (val) => {
    setSearchQuery(val ?? '');
    setPage(1);
  };

  const handleSortChange = (key, direction) => {
    setSortKey(key);
    setSortDirection(direction);
    setPage(1);
  };

  const handleRowsPerPageChange = (n) => {
    setRowsPerPage(n);
    setPage(1);
  };

  const openCreate = () => {
    setEditing('new');
    setForm(initialForm);
    setImageFile(null);
  };

  const openEdit = (blog) => {
    setEditing(blog._id);
    setForm({
      title: blog.title || '',
      slug: blog.slug || '',
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      author: blog.author || '',
      published: !!blog.published,
      metaTitle: blog.metaTitle || '',
      metaDescription: blog.metaDescription || '',
      image: blog.image ? blog.image.split('/').pop() : '',
    });
    setImageFile(null);
  };

  const save = async () => {
    let imageFilename = form.image;
    if (imageFile) {
      try {
        imageFilename = await api.upload(imageFile);
      } catch (e) {
        toast.error(`Image upload failed: ${e.message}`);
        return;
      }
    }

    const payload = {
      title: form.title?.trim(),
      slug: form.slug?.trim() || undefined,
      excerpt: form.excerpt?.trim() || undefined,
      content: form.content?.trim(),
      author: form.author?.trim() || undefined,
      published: !!form.published,
      metaTitle: form.metaTitle?.trim() || undefined,
      metaDescription: form.metaDescription?.trim() || undefined,
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
    try {
      await api.admin.blogs.delete(id);
      toast.success('Blog post deleted');
      setEditing(null);
      load();
    } catch (e) {
      toast.error(e.message || 'Failed to delete blog post');
    }
  };

  return (
    <div className="mx-auto max-w-[1280px]">
      <BlogsHeader onAdd={openCreate} />

      <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <BlogsTable
          blogs={data.blogs || []}
          onOpenEdit={openEdit}
          onRemove={remove}
          loading={loading}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          searchQuery={searchQuery}
          onSearchQueryChange={handleSearchQueryChange}
          page={page}
          rowsPerPage={rowsPerPage}
          totalRows={data.total}
          onPageChange={setPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
          counts={data.counts}
        />
      </div>

      {editing && (
        <BlogsModal
          mode={editing === 'new' ? 'create' : 'edit'}
          form={form}
          setForm={setForm}
          onSave={save}
          onClose={() => setEditing(null)}
          imageFile={imageFile}
          setImageFile={setImageFile}
        />
      )}
    </div>
  );
}
