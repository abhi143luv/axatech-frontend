import { useEffect, useState } from 'react';
import api from '../../../api';
import { toast } from '../../../utils/toast';
import AdminHeroBannerHeader from './AdminHeroBannerHeader';
import AdminHeroBannerModal from './AdminHeroBannerModal';
import AdminHeroBannerTable from './AdminHeroBannerTable';

const initialForm = {
  title: '',
  image: '',
  sortOrder: 0,
  isActive: true,
};

export default function AdminHeroBannerList() {
  const [items, setItems] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [placementForEdit, setPlacementForEdit] = useState('home');
  const [imageFile, setImageFile] = useState(null);

  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [counts, setCounts] = useState({ all: 0, active: 0, inactive: 0 });

  const load = () => {
    setLoading(true);
    return api.admin.adminHeroBanners
      .list({
        status: statusFilter,
        search: searchQuery.trim() ? searchQuery.trim() : undefined,
        page,
        limit: rowsPerPage,
        sortKey: 'sortOrder',
        sortDirection: 'asc',
      })
      .then((res) => {
        const list = Array.isArray(res?.items) ? res.items : Array.isArray(res) ? res : [];
        setItems(list);
        setTotalRows(Number(res?.total || list.length || 0));
        setCounts(
          res?.counts || {
            all: list.length,
            active: list.filter((i) => i.isActive !== false).length,
            inactive: list.filter((i) => i.isActive === false).length,
          }
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [statusFilter, searchQuery, page, rowsPerPage]);

  const openCreate = () => {
    setEditing('new');
    setForm(initialForm);
    setPlacementForEdit('home');
    setImageFile(null);
  };

  const openEdit = (item) => {
    setEditing(item._id);
    setPlacementForEdit(item.placement === 'home' ? 'home' : 'licenses');
    setForm({
      title: item.title || '',
      image: item.image || '',
      sortOrder: item.sortOrder ?? 0,
      isActive: item.isActive !== false,
    });
    setImageFile(null);
  };

  const save = async () => {
    if (isSaving) return;
    setIsSaving(true);

    let imagePath = form.image;
    if (imageFile) {
      try {
        imagePath = await api.uploadAdminHeroImage(imageFile);
      } catch (e) {
        toast.error('Image upload failed: ' + e.message);
        setIsSaving(false);
        return;
      }
    }

    const payload = {
      title: form.title?.trim(),
      image: imagePath,
      placement: editing === 'new' ? 'home' : placementForEdit,
      sortOrder: Number(form.sortOrder) || 0,
      isActive: form.isActive,
    };

    try {
      if (editing === 'new') {
        await api.admin.adminHeroBanners.create(payload);
        toast.success('Banner created');
      } else {
        await api.admin.adminHeroBanners.update(editing, payload);
        toast.success('Banner updated');
      }
      setEditing(null);
      load();
    } catch (e) {
      toast.error(e.message || 'Failed to save banner');
    } finally {
      setIsSaving(false);
    }
  };

  const remove = async (idOrIds) => {
    const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    if (ids.length === 0) return;
    try {
      if (ids.length === 1) {
        await api.admin.adminHeroBanners.delete(ids[0]);
        toast.success('Banner deleted');
      } else {
        await api.admin.adminHeroBanners.deleteBulk(ids);
        toast.success(`${ids.length} banners deleted`);
      }
      setEditing(null);
      load();
    } catch (e) {
      toast.error(e.message || 'Failed to delete banner(s)');
    }
  };

  const modalOpen = editing === 'new' || (editing && editing !== 'new');

  return (
    <div className="mx-auto max-w-[1280px]">
      <AdminHeroBannerHeader onAdd={openCreate} />

      <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <AdminHeroBannerTable
          items={items}
          loading={loading}
          statusFilter={statusFilter}
          onStatusFilterChange={(value) => {
            setStatusFilter(value);
            setPage(1);
          }}
          searchQuery={searchQuery}
          onSearchQueryChange={(value) => {
            setSearchQuery(value);
            setPage(1);
          }}
          page={page}
          rowsPerPage={rowsPerPage}
          totalRows={totalRows}
          onPageChange={setPage}
          onRowsPerPageChange={(next) => {
            setRowsPerPage(next);
            setPage(1);
          }}
          counts={counts}
          onOpenEdit={openEdit}
          onRemove={remove}
        />
      </div>

      {modalOpen && (
        <AdminHeroBannerModal
          open
          mode={editing === 'new' ? 'create' : 'edit'}
          form={form}
          setForm={setForm}
          imageFile={imageFile}
          onFileChange={setImageFile}
          existingImageUrl={editing && editing !== 'new' ? form.image : null}
          onSave={save}
          onClose={() => setEditing(null)}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}
