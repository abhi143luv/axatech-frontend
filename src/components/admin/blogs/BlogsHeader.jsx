import { Button } from '../../common';
import { PlusIcon } from '../../icons';

export default function BlogsHeader({ onAdd }) {
  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <h1 className="m-0 text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
        Blogs
      </h1>
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="primary" fullWidth={false} onClick={onAdd} icon={<PlusIcon />}>
          Add Post
        </Button>
      </div>
    </header>
  );
}
