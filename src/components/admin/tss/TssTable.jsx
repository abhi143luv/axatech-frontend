import { useState, useRef, useMemo } from 'react';
import { Table, ConfirmModal, Badge } from '../../common';
import { DotsVerticalIcon } from '../../icons';

export default function TssTable({
  items,
  onOpenEdit,
  onRemove,
  loading = false,
  statusFilter = 'all',
  onStatusFilterChange,
  typeFilter = 'all',
  onTypeFilterChange,
  searchQuery = '',
  onSearchQueryChange,
  sortKey = 'title',
  sortDirection = 'asc',
  onSortChange,
  page = 1,
  rowsPerPage = 5,
  totalRows = 0,
  onPageChange,
  onRowsPerPageChange,
  counts = { all: 0, active: 0, inactive: 0 },
  typeOptions = [{ value: 'all', label: 'All types' }],
}) {
  const safeSetStatusFilter = (val) => onStatusFilterChange?.(val);
  const safeSetTypeFilter = (val) => onTypeFilterChange?.(val);
  const safeSetSearchQuery = (val) => onSearchQueryChange?.(val);
  const safeOnSortChange = (key, dir) => onSortChange?.(key, dir);
  const safeOnPageChange = (nextPage) => onPageChange?.(nextPage);
  const safeOnRowsPerPageChange = (nextRowsPerPage) => onRowsPerPageChange?.(nextRowsPerPage);

  const [selectedIds, setSelectedIds] = useState(new Set());
  const [openActionId, setOpenActionId] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const kebabRefs = useRef({});

  const statusTabs = useMemo(() => {
    const tabs = [
      { value: 'all', label: 'All', variant: 'neutral', activeVariant: 'neutral' },
      { value: 'active', label: 'Active', variant: 'success', activeVariant: 'success', activeSolid: true },
      { value: 'inactive', label: 'Inactive', variant: 'warning', activeVariant: 'warning', activeSolid: true },
    ];
    return tabs;
  }, []);

  const totalFiltered = totalRows;

  const activeFilters = useMemo(() => {
    const list = [];
    if (statusFilter !== 'all') {
      const label = statusTabs.find((t) => t.value === statusFilter)?.label ?? statusFilter;
      list.push({
        id: 'status',
        label: 'Status',
        value: label,
        onRemove: () => safeSetStatusFilter('all'),
      });
    }
    if (typeFilter !== 'all') {
      const label = typeOptions.find((t) => t.value === typeFilter)?.label ?? typeFilter;
      list.push({
        id: 'type',
        label: 'Type',
        value: label,
        onRemove: () => safeSetTypeFilter('all'),
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
  }, [statusFilter, typeFilter, searchQuery, statusTabs, typeOptions]);

  const handleClearAllFilters = () => {
    safeSetStatusFilter('all');
    safeSetTypeFilter('all');
    safeSetSearchQuery('');
  };

  const handleSort = (key) => {
    const nextDirection = sortKey === key ? (sortDirection === 'asc' ? 'desc' : 'asc') : 'asc';
    safeOnSortChange(key, nextDirection);
  };

  const allSelected = items.length > 0 && items.every((p) => selectedIds.has(p._id));
  const someSelected = selectedIds.size > 0;

  const handleSelectAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(items.map((p) => p._id)));
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

  const openSingleDeleteConfirm = (plan) => {
    closeMenu();
    setDeleteConfirm({ type: 'single', id: plan._id, title: plan.title });
  };

  const handleBulkDelete = () => {
    if (!selectedIds.size) return;
    setDeleteConfirm({ type: 'bulk', ids: [...selectedIds] });
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === 'single') {
      onRemove(deleteConfirm.id);
    } else {
      deleteConfirm.ids.forEach((id) => onRemove(id));
      setSelectedIds(new Set());
    }
    setDeleteConfirm(null);
  };

  const closeDeleteConfirm = () => setDeleteConfirm(null);

  const planForMenu = openActionId ? items.find((p) => p._id === openActionId) : null;

  return (
    <>
      <div className="border-b border-slate-200 dark:border-gray-600 bg-white dark:bg-gray-800">
        <Table.StatusTabs
          tabs={statusTabs}
          value={statusFilter}
          onChange={safeSetStatusFilter}
          counts={counts}
        />
        <Table.Toolbar>
          <Table.ToolbarDropdown
            value={typeFilter}
            onChange={safeSetTypeFilter}
            options={typeOptions}
            showPlaceholderOption={false}
          />
          <Table.SearchInput
            value={searchQuery}
            onChange={(e) => safeSetSearchQuery(e.target.value)}
            ariaLabel="Search TSS plans"
            placeholder="Search TSS plans"
          />
          <button
            type="button"
            aria-label="More options"
            className="inline-flex items-center justify-center rounded-lg p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-gray-200"
          >
            <DotsVerticalIcon className="text-xl" />
          </button>
        </Table.Toolbar>
      </div>

      <Table.ActiveFilters
        filters={activeFilters}
        resultCount={totalFiltered}
        onClearAll={handleClearAllFilters}
      />

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
              { key: 'type', label: 'Type', sortable: true },
              { key: 'price', label: 'Price', sortable: true },
              { key: 'isActive', label: 'Active', sortable: true },
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
            <Table.LoadingState colSpan={6} />
          ) : items.length === 0 ? (
            <Table.EmptyState colSpan={6} />
          ) : (
            items.map((p) => (
              <Table.Row key={p._id}>
                <Table.SelectionCell
                  checked={selectedIds.has(p._id)}
                  onChange={() => handleSelectRow(p._id)}
                  ariaLabel={`Select ${p.title}`}
                />
                <Table.Td>{p.title}</Table.Td>
                <Table.Td>{p.type}</Table.Td>
                <Table.Td>₹{p.price?.toLocaleString()}</Table.Td>
                <Table.Td>
                  <Badge variant={p.isActive !== false ? 'success' : 'warning'}>
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
        onEdit={planForMenu ? () => onOpenEdit(planForMenu) : undefined}
        onDelete={planForMenu ? () => openSingleDeleteConfirm(planForMenu) : undefined}
        onClose={closeMenu}
      />

      <ConfirmModal
        open={!!deleteConfirm}
        onClose={closeDeleteConfirm}
        onConfirm={handleConfirmDelete}
        title="Delete TSS plan"
        message={
          deleteConfirm?.type === 'single'
            ? `Are you sure you want to delete "${deleteConfirm.title}"? This cannot be undone.`
            : deleteConfirm?.type === 'bulk'
              ? `Are you sure you want to delete ${deleteConfirm.ids.length} selected plan(s)? This cannot be undone.`
              : ''
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmVariant="error"
      />
    </>
  );
}

