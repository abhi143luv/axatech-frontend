import { useEffect, useMemo, useRef, useState } from 'react';
import { Table, ConfirmModal, Badge } from '../../common';
import { DotsVerticalIcon } from '../../icons';

const STATUS_TABS = [
  { value: 'all', label: 'All', variant: 'neutral', activeVariant: 'neutral' },
  { value: 'published', label: 'Published', variant: 'success', activeVariant: 'success', activeSolid: true },
  { value: 'draft', label: 'Draft', variant: 'warning', activeVariant: 'warning', activeSolid: true },
];

export default function BlogsTable({
  blogs = [],
  onOpenEdit,
  onRemove,
  loading = false,
  statusFilter = 'all',
  onStatusFilterChange,
  searchQuery = '',
  onSearchQueryChange,
  page = 1,
  rowsPerPage = 5,
  totalRows = 0,
  onPageChange,
  onRowsPerPageChange,
  sortKey = 'title',
  sortDirection = 'asc',
  onSortChange,
  counts = { all: 0, published: 0, draft: 0 },
}) {
  const safeSetStatusFilter = (val) => onStatusFilterChange?.(val);
  const safeSetSearchQuery = (val) => onSearchQueryChange?.(val);
  const safeOnPageChange = (next) => onPageChange?.(next);
  const safeOnRowsPerPageChange = (next) => onRowsPerPageChange?.(next);

  const [openActionId, setOpenActionId] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const kebabRefs = useRef({});

  const totalFiltered = totalRows;

  const activeFilters = useMemo(() => {
    const list = [];
    if (statusFilter !== 'all') {
      const label =
        STATUS_TABS.find((t) => t.value === statusFilter)?.label ?? statusFilter;
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

  const handleSort = (key) => {
    if (typeof onSortChange !== 'function') return;
    const nextDirection =
      sortKey === key ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'asc';
    onSortChange(key, nextDirection);
  };

  useEffect(() => {
    setSelectedIds(new Set());
    setOpenActionId(null);
    setDeleteConfirm(null);
  }, [blogs]);

  const allSelected = blogs.length > 0 && blogs.every((b) => selectedIds.has(b._id));
  const someSelected = selectedIds.size > 0;

  const handleSelectAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(blogs.map((b) => b._id)));
  };

  const handleSelectRow = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const openActionMenu = (e, id) => {
    e.stopPropagation();
    const el = kebabRefs.current[id] || e.currentTarget;
    const rect = el.getBoundingClientRect();
    setMenuPosition({ top: rect.bottom - 45, left: rect.left - 135 });
    setOpenActionId(id);
  };

  const closeMenu = () => setOpenActionId(null);

  const openSingleDeleteConfirm = (blog) => {
    closeMenu();
    setDeleteConfirm({ type: 'single', id: blog._id, title: blog.title });
  };

  const handleBulkDelete = () => {
    if (!selectedIds.size) return;
    setDeleteConfirm({ type: 'bulk', ids: [...selectedIds] });
  };

  const confirmRemove = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === 'single') {
      onRemove?.(deleteConfirm.id);
    } else {
      deleteConfirm.ids.forEach((id) => onRemove?.(id));
      setSelectedIds(new Set());
    }
    setDeleteConfirm(null);
  };

  const blogForMenu = openActionId ? blogs.find((b) => b._id === openActionId) : null;

  return (
    <>
      <div className="border-b border-slate-200 bg-white dark:border-gray-600 dark:bg-gray-800">
        <Table.StatusTabs tabs={STATUS_TABS} value={statusFilter} onChange={safeSetStatusFilter} counts={counts} />
        <Table.Toolbar>
          <Table.SearchInput
            value={searchQuery}
            debounceMs={500}
            onChange={(e) => safeSetSearchQuery(e?.target?.value ?? '')}
            ariaLabel="Search blogs"
            placeholder="Search blogs"
          />
        </Table.Toolbar>
      </div>

      <Table.ActiveFilters filters={activeFilters} resultCount={totalFiltered} onClearAll={handleClearAllFilters} />

      <Table.SelectionBar
        selectedCount={selectedIds.size}
        totalCount={totalFiltered}
        onClearSelection={() => setSelectedIds(new Set())}
        onBulkDelete={handleBulkDelete}
        label="selected"
      />

      <Table>
        {selectedIds.size === 0 && (
          <Table.Head
            columns={[
              { key: 'title', label: 'Title', sortable: true },
              { key: 'published', label: 'Published', sortable: true },
              { key: 'publishedAt', label: 'Date', sortable: true },
              { key: 'actions', label: 'Actions', align: 'right' },
            ]}
            selectAll={{
              checked: allSelected,
              indeterminate: someSelected && !allSelected,
              onChange: handleSelectAll,
            }}
            sortState={{ key: sortKey, direction: sortDirection }}
            onSort={handleSort}
          />
        )}

        <Table.Body>
          {loading ? (
            <Table.LoadingState colSpan={5} />
          ) : blogs.length === 0 ? (
            <Table.EmptyState colSpan={5} />
          ) : (
            blogs.map((b) => (
              <Table.Row key={b._id}>
                <Table.SelectionCell
                  checked={selectedIds.has(b._id)}
                  onChange={() => handleSelectRow(b._id)}
                  ariaLabel={`Select ${b.title}`}
                />
                <Table.Td>{b.title}</Table.Td>
                <Table.Td>
                  <Badge variant={b.published ? 'success' : 'warning'} size="md">
                    {b.published ? 'Published' : 'Draft'}
                  </Badge>
                </Table.Td>
                <Table.Td>{b.publishedAt ? new Date(b.publishedAt).toLocaleDateString() : '—'}</Table.Td>
                <Table.Td align="right" className="whitespace-nowrap">
                  <div className="relative flex justify-end">
                    <button
                      ref={(el) => (kebabRefs.current[b._id] = el)}
                      type="button"
                      onClick={(e) => openActionMenu(e, b._id)}
                      aria-label="Open actions"
                      aria-expanded={openActionId === b._id}
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
        onEdit={blogForMenu ? () => onOpenEdit(blogForMenu) : undefined}
        onDelete={blogForMenu ? () => openSingleDeleteConfirm(blogForMenu) : undefined}
        onClose={closeMenu}
      />

      <ConfirmModal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={confirmRemove}
        title="Delete blog post"
        message={
          deleteConfirm?.type === 'single'
            ? `Are you sure you want to delete "${deleteConfirm.title}"? This cannot be undone.`
            : deleteConfirm?.type === 'bulk'
              ? `Are you sure you want to delete ${deleteConfirm.ids.length} selected post(s)? This cannot be undone.`
              : ''
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmVariant="error"
      />
    </>
  );
}
