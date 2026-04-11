import { useState, useRef, useEffect, useMemo } from 'react';
import { Table, ConfirmModal, Badge } from '../../common';
import { DotsVerticalIcon } from '../../icons';

const STATUS_TABS = [
  { value: 'all', label: 'All', variant: 'neutral', activeVariant: 'neutral' },
  { value: 'active', label: 'Active', variant: 'success', activeVariant: 'success', activeSolid: true },
  { value: 'inactive', label: 'Inactive', variant: 'warning', activeVariant: 'warning', activeSolid: true },
];

function getImageUrl(project) {
  if (!project?.image) return null;
  const img = project.image;
  if (typeof img === 'string' && (img.startsWith('http') || img.startsWith('//'))) return img;
  const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '';
  return base ? `${base}/uploads/${img.replace(/^\/+/, '')}` : `/uploads/${img.replace(/^\/+/, '')}`;
}

export default function ProjectsTable({
  projects = [],
  onOpenEdit,
  onRemove,
  loading = false,
  statusFilter = 'all', // all | active | inactive
  onStatusFilterChange,
  searchQuery = '',
  onSearchQueryChange,
  page = 1,
  rowsPerPage = 5,
  totalRows = 0,
  onPageChange,
  onRowsPerPageChange,
  counts = { all: 0, active: 0, inactive: 0 },
}) {
  const safeSetStatusFilter = (val) => onStatusFilterChange?.(val);
  const safeSetSearchQuery = (val) => onSearchQueryChange?.(val);
  const safeOnPageChange = (next) => onPageChange?.(next);
  const safeOnRowsPerPageChange = (next) => onRowsPerPageChange?.(next);

  const [selectedIds, setSelectedIds] = useState(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [openActionId, setOpenActionId] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const kebabRefs = useRef({});

  const totalFiltered = totalRows;
  const allSelected = projects.length > 0 && projects.every((p) => selectedIds.has(p._id));
  const someSelected = selectedIds.size > 0;

  const activeFilters = useMemo(() => {
    const list = [];

    if (statusFilter !== 'all') {
      const label = STATUS_TABS.find((t) => t.value === statusFilter)?.label ?? statusFilter;
      list.push({
        id: 'status',
        label: 'Status',
        value: label,
        onRemove: () => safeSetStatusFilter('all'),
      });
    }

    if (searchQuery.trim()) {
      list.push({
        id: 'keyword',
        label: 'Keyword',
        value: searchQuery.trim(),
        onRemove: () => safeSetSearchQuery(''),
      });
    }

    return list;
  }, [statusFilter, searchQuery]);

  const handleClearAllFilters = () => {
    safeSetStatusFilter('all');
    safeSetSearchQuery('');
  };

  const handleSelectAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(projects.map((p) => p._id)));
  };

  const handleSelectRow = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkDelete = () => {
    if (!selectedIds.size) return;
    setDeleteConfirm({ ids: [...selectedIds], single: false });
  };

  const handleSingleDelete = (project) => {
    setDeleteConfirm({ ids: [project._id], single: true, title: project.title });
  };

  const confirmRemove = () => {
    if (!deleteConfirm) return;
    onRemove?.(deleteConfirm.ids);
    setDeleteConfirm(null);
    setSelectedIds(new Set());
  };

  const openActionMenu = (e, id) => {
    e.stopPropagation();
    const el = kebabRefs.current[id] || e.currentTarget;
    const rect = el.getBoundingClientRect();
    setMenuPosition({ top: rect.bottom - 45, left: rect.left - 135 });
    setOpenActionId(id);
  };

  const closeMenu = () => setOpenActionId(null);

  const openSingleDeleteConfirm = (project) => {
    closeMenu();
    setDeleteConfirm({ ids: [project._id], single: true, title: project.title });
  };

  const projectForMenu = openActionId ? projects.find((p) => p._id === openActionId) : null;

  // Clear selection/menu when the underlying server results change (filters/page).
  useEffect(() => {
    setSelectedIds(new Set());
    setOpenActionId(null);
    setDeleteConfirm(null);
  }, [projects]);

  return (
    <>
      <div className="border-b border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-800">
        <Table.StatusTabs
          tabs={STATUS_TABS}
          value={statusFilter}
          onChange={safeSetStatusFilter}
          counts={counts}
        />
        <Table.Toolbar>
          <Table.SearchInput
            value={searchQuery}
            // debounceMs={450}
            onChange={(e) => safeSetSearchQuery(e.target.value)}
            ariaLabel="Search projects"
            placeholder="Search projects"
          />
        </Table.Toolbar>
      </div>

      <Table.SelectionBar
        selectedCount={selectedIds.size}
        totalCount={totalFiltered}
        onClearSelection={() => setSelectedIds(new Set())}
        onBulkDelete={handleBulkDelete}
        label="selected"
      />

      <Table.ActiveFilters
        filters={activeFilters}
        resultCount={totalFiltered}
        onClearAll={handleClearAllFilters}
      />

      <Table>
        <Table.Head
          columns={[
            { key: 'image', label: 'Image' },
            { key: 'title', label: 'Title' },
            { key: 'category', label: 'Category' },
            { key: 'isActive', label: 'Active' },
            { key: 'actions', label: 'Actions', align: 'right' },
          ]}
          selectAll={{
            checked: allSelected,
            indeterminate: someSelected && !allSelected,
            onChange: handleSelectAll,
          }}
        />
        <Table.Body>
          {loading ? (
            <Table.LoadingState colSpan={6} />
          ) : projects.length === 0 ? (
            <Table.EmptyState colSpan={6} />
          ) : (
            projects.map((p) => (
              <Table.Row key={p._id}>
                <Table.SelectionCell
                  checked={selectedIds.has(p._id)}
                  onChange={() => handleSelectRow(p._id)}
                  ariaLabel={`Select ${p.title}`}
                />
                <Table.Td>
                  {getImageUrl(p) ? (
                    <img
                      src={getImageUrl(p)}
                      alt=""
                      className="h-10 w-16 rounded-md object-cover bg-slate-100 dark:bg-gray-700"
                    />
                  ) : (
                    <span className="text-slate-400 dark:text-gray-500">—</span>
                  )}
                </Table.Td>
                <Table.Td>{p.title}</Table.Td>
                <Table.Td>{p.category || '—'}</Table.Td>
                <Table.Td>
                  <Badge variant={p.isActive !== false ? 'success' : 'warning'} size="md">
                    {p.isActive !== false ? 'Active' : 'Inactive'}
                  </Badge>
                </Table.Td>
                <Table.Td align="right" className="whitespace-nowrap">
                  <div className="relative flex justify-end">
                    <button
                      ref={(el) => (kebabRefs.current[p._id] = el)}
                      type="button"
                      onClick={(e) => openActionMenu(e, p._id)}
                      aria-label="Open actions"
                      aria-expanded={openActionId === p._id}
                      aria-haspopup="menu"
                      className="inline-flex items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-gray-200"
                    >
                      <DotsVerticalIcon className="text-xl" />
                    </button>
                  </div>
                </Table.Td>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>

      <Table.Pagination
        page={page}
        rowsPerPage={rowsPerPage}
        totalRows={totalFiltered}
        onPageChange={safeOnPageChange}
        onRowsPerPageChange={safeOnRowsPerPageChange}
      />

      <Table.ActionMenu
        open={!!openActionId}
        position={menuPosition}
        onView={projectForMenu ? () => onOpenEdit(projectForMenu) : undefined}
        onEdit={projectForMenu ? () => onOpenEdit(projectForMenu) : undefined}
        onDelete={projectForMenu ? () => openSingleDeleteConfirm(projectForMenu) : undefined}
        onClose={closeMenu}
      />

      {deleteConfirm && (
        <ConfirmModal
          open
          onClose={() => setDeleteConfirm(null)}
          onConfirm={confirmRemove}
          title={deleteConfirm.single ? 'Delete project' : 'Delete projects'}
          message={
            deleteConfirm.single
              ? `Are you sure you want to delete "${deleteConfirm.title}"? This cannot be undone.`
              : `Are you sure you want to delete ${deleteConfirm.ids.length} selected project(s)? This cannot be undone.`
          }
          confirmLabel="Delete"
          cancelLabel="Cancel"
          confirmVariant="error"
        />
      )}
    </>
  );
}
