import { useEffect, useState } from 'react';
import api from '../../../api';
import { toast } from '../../../utils/toast';
import {
  ProjectsHeader,
  ProjectsTable,
  ProjectsModal,
} from '../../../components/admin/projects';

const initialForm = {
  title: '',
  description: '',
  keyFeatures: [],
  category: '',
  image: '',
  webLink: '',
  isActive: true,
  sortOrder: 0,
};

function getImageUrl(imageValue) {
  if (!imageValue || typeof imageValue !== 'string') return null;
  if (imageValue.startsWith('http') || imageValue.startsWith('//')) return imageValue;
  const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '';
  return base ? `${base}/uploads/${imageValue.replace(/^\/+/, '')}` : `/uploads/${imageValue.replace(/^\/+/, '')}`;
}

export default function ProjectList() {
  const [list, setList] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null);

  const [statusFilter, setStatusFilter] = useState('all'); // all | active | inactive
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [counts, setCounts] = useState({ all: 0, active: 0, inactive: 0 });

  const load = () => {
    setLoading(true);
    return api.admin.projects
      .list({
        status: statusFilter,
        search: searchQuery.trim() ? searchQuery.trim() : undefined,
        page,
        limit: rowsPerPage,
      })
      .then((res) => {
        // New API shape with pagination metadata
        if (res && typeof res === 'object' && Array.isArray(res.projects)) {
          setList(res.projects);
          setTotalRows(Number(res.total || 0));
          setCounts(res.counts || { all: 0, active: 0, inactive: 0 });
          return;
        }

        // Backward compatibility (old backend returned array)
        if (Array.isArray(res)) {
          const total = res.length;
          const start = (page - 1) * rowsPerPage;
          const end = start + rowsPerPage;
          setList(res.slice(start, end));
          setTotalRows(total);
          setCounts({
            all: total,
            active: res.filter((p) => p.isActive !== false).length,
            inactive: res.filter((p) => p.isActive === false).length,
          });
        } else {
          setList([]);
          setTotalRows(0);
          setCounts({ all: 0, active: 0, inactive: 0 });
        }
      })
      .catch(console.error)
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    load();
  }, [statusFilter, searchQuery, page, rowsPerPage]);

  const handleStatusFilterChange = (val) => {
    setStatusFilter(val);
    setPage(1);
  };

  const handleSearchQueryChange = (val) => {
    setSearchQuery(val);
    setPage(1);
  };

  const openCreate = () => {
    setEditing('new');
    setForm(initialForm);
    setImageFile(null);
  };

  const openEdit = (p) => {
    setEditing(p._id);
    setForm({
      title: p.title || '',
      description: p.description || '',
      keyFeatures: Array.isArray(p.keyFeatures) ? [...p.keyFeatures] : [],
      category: p.category || '',
      image: p.image || '',
      webLink: p.webLink || '',
      isActive: p.isActive !== false,
      sortOrder: p.sortOrder ?? 0,
    });
    setImageFile(null);
  };

  const save = async () => {
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      keyFeatures: form.keyFeatures || [],
      category: form.category.trim(),
      webLink: form.webLink.trim(),
      isActive: form.isActive,
      sortOrder: Number(form.sortOrder) || 0,
    };
    let imagePath = form.image;
    if (imageFile) {
      try {
        imagePath = await api.uploadProjectImage(imageFile);
      } catch (e) {
        toast.error('Image upload failed: ' + e.message);
        return;
      }
    }
    if (imagePath) payload.image = imagePath;

    try {
      if (editing === 'new') {
        await api.admin.projects.create(payload);
        toast.success('Project created');
      } else {
        await api.admin.projects.update(editing, payload);
        toast.success('Project updated');
      }
      setEditing(null);
      load();
    } catch (e) {
      toast.error(e.message || 'Failed to save project');
    }
  };

  const remove = async (idOrIds) => {
    const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    if (ids.length === 0) return;
    try {
      if (ids.length === 1) {
        await api.admin.projects.delete(ids[0]);
        toast.success('Project deleted');
      } else {
        await api.admin.projects.deleteBulk(ids);
        toast.success(`${ids.length} projects deleted`);
      }
      setEditing(null);
      load();
    } catch (e) {
      toast.error(e.message || 'Failed to delete project(s)');
    }
  };



  const modalOpen = editing === 'new' || (editing != null && editing !== 'new');
  const isEdit = editing != null && editing !== 'new';
  const existingImageUrl = isEdit && form.image ? getImageUrl(form.image) : null;

  return (
    <div className="mx-auto max-w-[1280px]">
      <ProjectsHeader onAddProject={openCreate} />

      <div className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <ProjectsTable
          projects={list}
          onOpenEdit={openEdit}
          onRemove={remove}
          loading={loading}
          statusFilter={statusFilter}
          onStatusFilterChange={handleStatusFilterChange}
          searchQuery={searchQuery}
          onSearchQueryChange={handleSearchQueryChange}
          page={page}
          rowsPerPage={rowsPerPage}
          totalRows={totalRows}
          onPageChange={setPage}
          onRowsPerPageChange={(n) => {
            setRowsPerPage(n);
            setPage(1);
          }}
          counts={counts}
        />
      </div>

      {modalOpen && (
        <ProjectsModal
          open
          mode={editing === 'new' ? 'create' : 'edit'}
          title={editing === 'new' ? 'Add Project' : 'Edit Project'}
          form={form}
          setForm={setForm}
          imageFile={imageFile}
          onFileChange={setImageFile}
          existingImageUrl={existingImageUrl}
          onSave={save}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}

