import { Input } from '../../common';

const cardHeaderClass =
  'border-b border-slate-200 px-5 py-4 text-base font-semibold text-slate-700 dark:border-gray-600 dark:text-gray-200';
const cardBodyClass = 'space-y-4 p-5';
const textareaClass =
  'w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-base text-slate-800 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px] resize-y dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-secondary dark:focus:ring-secondary/20';

export default function SeoSection({ content, onChange }) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className={cardHeaderClass}>SEO</div>
      <div className={cardBodyClass}>
        <Input
          label="Meta title"
          type="text"
          name="metaTitle"
          id="admin-meta-title"
          value={content.metaTitle || ''}
          onChange={onChange}
          className="mb-0"
        />
        <div className="mb-0">
          <label htmlFor="admin-meta-description" className="mb-1.5 block font-medium text-slate-600 dark:text-gray-400">
            Meta description
          </label>
          <textarea
            id="admin-meta-description"
            name="metaDescription"
            className={textareaClass}
            value={content.metaDescription || ''}
            onChange={onChange}
            rows={3}
          />
        </div>
      </div>
    </section>
  );
}
