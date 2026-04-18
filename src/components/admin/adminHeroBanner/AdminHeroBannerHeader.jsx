import { Button } from '../../common';
import { PlusIcon } from '../../icons';

export default function AdminHeroBannerHeader({ onAdd }) {
  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="m-0 text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
          Hero banners
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-gray-400">
          All CMS hero rows (homepage and licenses/TSS). <strong>Add banner</strong> creates a{' '}
          <strong>homepage</strong> slide. Saving an edit keeps that row’s placement. Sort order controls order on /
          and on licenses/TSS.
        </p>
      </div>
      <Button type="button" variant="primary" fullWidth={false} onClick={onAdd} icon={<PlusIcon />}>
        Add banner
      </Button>
    </header>
  );
}
