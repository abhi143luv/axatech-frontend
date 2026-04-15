import { useMemo, useRef, useState } from 'react';
import { Badge, ConfirmModal, Table } from '../../common';
import { DotsVerticalIcon } from '../../icons';

const STATUS_TABS = [
  { value: 'all', label: 'All', variant: 'neutral', activeVariant: 'neutral' },
  { value: 'active', label: 'Active', variant: 'success', activeVariant: 'success', activeSolid: true },
  { value: 'inactive', label: 'Inactive', variant: 'warning', activeVariant: 'warning', activeSolid: true },
];

export default function HomeLogoLoopTable({
  items = [],
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
  counts = { all: 0, active: 0, inactive: 0 },
  onOpenEdit,
  onRemove,
}) {
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [openActionId, setOpenActionId] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const kebabRefs = useRef({});

  const allSelected = items.length > 0 && items.every((i) => selectedIds.has(i._id));
  const someSelected = selectedIds.size > 0;

  const activeFilters = useMemo(() => {
    const list = [];
    if (statusFilter !== 'all') {
      const label = STATUS_TABS.find((t) => t.value === statusFilter)?.label ?? statusFilter;
      list.push({
        id: 'status',
        label: 'Status',
        value: label,
        onRemove: () => onStatusFilterChange?.('all'),
      });
    }
    if (searchQuery.trim()) {
      list.push({
        id: 'keyword',
        label: 'Keyword',
        value: searchQuery.trim(),
        onRemove: () => onSearchQueryChange?.(''),
      });
    }
    return list;
  }, [statusFilter, searchQuery, onStatusFilterChange, onSearchQueryChange]);

  const handleSelectAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(items.map((i) => i._id)));
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
  const itemForMenu = openActionId ? items.find((i) => i._id === openActionId) : null;

  const handleBulkDelete = () => {
    if (!selectedIds.size) return;
    setDeleteConfirm({ ids: [...selectedIds], single: false });
  };

  const openSingleDeleteConfirm = (item) => {
    closeMenu();
    setDeleteConfirm({ ids: [item._id], single: true, title: item.name });
  };

  const confirmRemove = () => {
    if (!deleteConfirm) return;
    onRemove?.(deleteConfirm.ids);
    setDeleteConfirm(null);
    setSelectedIds(new Set());
  };

  return (
    <>
      <div className="border-b border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-800">
        <Table.StatusTabs tabs={STATUS_TABS} value={statusFilter} onChange={onStatusFilterChange} counts={counts} />
        <Table.Toolbar>
          <Table.SearchInput
            value={searchQuery}
            onChange={(e) => onSearchQueryChange?.(e.target.value)}
            ariaLabel="Search logo items"
            placeholder="Search logo items"
          />
        </Table.Toolbar>
      </div>

      <Table.SelectionBar
        selectedCount={selectedIds.size}
        totalCount={totalRows}
        onClearSelection={() => setSelectedIds(new Set())}
        onBulkDelete={handleBulkDelete}
        label="selected"
      />

      <Table.ActiveFilters
        filters={activeFilters}
        resultCount={totalRows}
        onClearAll={() => {
          onStatusFilterChange?.('all');
          onSearchQueryChange?.('');
        }}
      />

      <Table>
        <Table.Head
          columns={[
            { key: 'image', label: 'Image' },
            { key: 'name', label: 'Name' },
            { key: 'link', label: 'Link' },
            { key: 'sortOrder', label: 'Order' },
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
            <Table.LoadingState colSpan={7} />
          ) : items.length === 0 ? (
            <Table.EmptyState colSpan={7} />
          ) : (
            items.map((item) => (
              <Table.Row key={item._id}>
                <Table.SelectionCell
                  checked={selectedIds.has(item._id)}
                  onChange={() => handleSelectRow(item._id)}
                  ariaLabel={`Select ${item.name}`}
                />
                <Table.Td>
                  {item.image ? (
                    <img
                      src={item.image}
                      alt=""
                      className="h-10 w-16 rounded-md object-cover bg-slate-100 dark:bg-gray-700"
                    />
                  ) : (
                    <span className="text-slate-400 dark:text-gray-500">—</span>
                  )}
                </Table.Td>
                <Table.Td>{item.name}</Table.Td>
                <Table.Td>
                  {item.link ? (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-primary dark:text-secondary underline underline-offset-2"
                    >
                      Open
                    </a>
                  ) : (
                    '—'
                  )}
                </Table.Td>
                <Table.Td>{item.sortOrder ?? 0}</Table.Td>
                <Table.Td>
                  <Badge variant={item.isActive !== false ? 'success' : 'warning'} size="md">
                    {item.isActive !== false ? 'Active' : 'Inactive'}
                  </Badge>
                </Table.Td>
                <Table.Td align="right" className="whitespace-nowrap">
                  <div className="relative flex justify-end">
                    <button
                      ref={(el) => (kebabRefs.current[item._id] = el)}
                      type="button"
                      onClick={(e) => openActionMenu(e, item._id)}
                      aria-label="Open actions"
                      aria-expanded={openActionId === item._id}
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
        totalRows={totalRows}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />

      <Table.ActionMenu
        open={!!openActionId}
        position={menuPosition}
        onView={itemForMenu ? () => onOpenEdit?.(itemForMenu) : undefined}
        onEdit={itemForMenu ? () => onOpenEdit?.(itemForMenu) : undefined}
        onDelete={itemForMenu ? () => openSingleDeleteConfirm(itemForMenu) : undefined}
        onClose={closeMenu}
      />

      {deleteConfirm && (
        <ConfirmModal
          open
          onClose={() => setDeleteConfirm(null)}
          onConfirm={confirmRemove}
          title={deleteConfirm.single ? 'Delete logo item' : 'Delete logo items'}
          message={
            deleteConfirm.single
              ? `Are you sure you want to delete "${deleteConfirm.title}"? This cannot be undone.`
              : `Are you sure you want to delete ${deleteConfirm.ids.length} selected logo item(s)? This cannot be undone.`
          }
          confirmLabel="Delete"
          cancelLabel="Cancel"
          confirmVariant="error"
        />
      )}
    </>
  );
}
