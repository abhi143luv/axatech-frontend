import { Button, Dropdown, Input, Modal } from '../../common';

const STATUS_OPTIONS = [
  { value: 'New', label: 'New' },
  { value: 'Contacted', label: 'Contacted' },
  { value: 'Closed', label: 'Closed' },
];

export default function EnquiryDetailModal({
  open,
  detail,
  status,
  adminNotes,
  saving,
  onClose,
  onStatusChange,
  onAdminNotesChange,
  onUpdate,
}) {
  if (!open || !detail) return null;

  const footer = (
    <footer className="shrink-0 flex flex-wrap justify-end gap-3 border-t border-slate-200 bg-slate-50/80 px-6 py-4 dark:border-gray-700 dark:bg-gray-800/95">
      <button
        type="button"
        className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border-2 border-primary bg-transparent px-5 text-base font-semibold text-primary transition-colors hover:bg-primary/5 dark:border-secondary dark:text-secondary dark:hover:bg-secondary/10"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClose?.();
        }}
      >
        Close
      </button>
      <Button
        type="button"
        variant="primary"
        fullWidth={false}
        onClick={onUpdate}
        disabled={saving}
        loading={saving}
        loadingLabel="Saving…"
      >
        Update
      </Button>
    </footer>
  );

  return (
    <Modal
      open={open}
      title="Enquiry details"
      titleId="enquiry-modal-title"
      onClose={onClose}
      size="lg"
      footer={footer}
    >
      <dl className="mb-4 grid grid-cols-[100px_1fr] gap-x-4 gap-y-1.5 text-sm">
        <dt className="font-medium text-slate-500 dark:text-gray-400">
          Type
        </dt>
        <dd className="m-0 text-slate-700 dark:text-gray-300">
          {detail.type}
        </dd>
        <dt className="font-medium text-slate-500 dark:text-gray-400">
          Name
        </dt>
        <dd className="m-0 text-slate-700 dark:text-gray-300">
          {detail.name}
        </dd>
        <dt className="font-medium text-slate-500 dark:text-gray-400">
          Email
        </dt>
        <dd className="m-0 text-slate-700 dark:text-gray-300">
          {detail.email}
        </dd>
        {detail.phone && (
          <>
            <dt className="font-medium text-slate-500 dark:text-gray-400">
              Phone
            </dt>
            <dd className="m-0 text-slate-700 dark:text-gray-300">
              {detail.phone}
            </dd>
          </>
        )}
        {detail.company && (
          <>
            <dt className="font-medium text-slate-500 dark:text-gray-400">
              Company
            </dt>
            <dd className="m-0 text-slate-700 dark:text-gray-300">
              {detail.company}
            </dd>
          </>
        )}
        {detail.message && (
          <>
            <dt className="font-medium text-slate-500 dark:text-gray-400">
              Message
            </dt>
            <dd className="m-0 text-slate-700 dark:text-gray-300">
              {detail.message}
            </dd>
          </>
        )}
        {Array.isArray(detail.products) && detail.products.length > 0 && (
          <>
            <dt className="font-medium text-slate-500 dark:text-gray-400">
              Products
            </dt>
            <dd className="m-0 text-slate-700 dark:text-gray-300">
              {detail.products
                .map((p) => p?.name)
                .filter(Boolean)
                .join(', ')}
            </dd>
          </>
        )}
        {detail.service && (
          <>
            <dt className="font-medium text-slate-500 dark:text-gray-400">
              Service
            </dt>
            <dd className="m-0 text-slate-700 dark:text-gray-300">
              {detail.service.title}
            </dd>
          </>
        )}
        {detail.licensePlan && (
          <>
            <dt className="font-medium text-slate-500 dark:text-gray-400">
              License
            </dt>
            <dd className="m-0 text-slate-700 dark:text-gray-300">
              {detail.licensePlan.planName}
            </dd>
          </>
        )}
        {detail.cloudPlan && (
          <>
            <dt className="font-medium text-slate-500 dark:text-gray-400">
              Cloud plan
            </dt>
            <dd className="m-0 text-slate-700 dark:text-gray-300">
              {detail.cloudPlan.planName}
            </dd>
          </>
        )}
        <dt className="font-medium text-slate-500 dark:text-gray-400">
          Created
        </dt>
        <dd className="m-0 text-slate-700 dark:text-gray-300">
          {new Date(detail.createdAt).toLocaleString()}
        </dd>
      </dl>

      <hr className="my-4 border-0 border-t border-gray-200 dark:border-gray-600" />

      <div className="flex flex-col gap-4">
        <Dropdown
          label="Status"
          value={status}
          onChange={onStatusChange}
          options={STATUS_OPTIONS}
          showPlaceholderOption={false}
          className="w-full"
        />
        <Input
          label="Admin notes"
          type="textarea"
          value={adminNotes}
          onChange={(e) => onAdminNotesChange(e.target.value)}
          placeholder="Add notes (optional)"
          className="mb-0"
        />
      </div>
    </Modal>
  );
}

