import { Input } from '../../common';

const cardHeaderClass =
  'border-b border-slate-200 px-5 py-4 text-base font-semibold text-slate-700 dark:border-gray-600 dark:text-gray-200';
const cardBodyClass = 'space-y-4 p-5';

export default function HeroSection({ content, onChange }) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className={cardHeaderClass}>Hero</div>
      <div className={cardBodyClass}>
        <Input
          label="Hero title"
          type="text"
          name="heroTitle"
          id="admin-hero-title"
          value={content.heroTitle || ''}
          onChange={onChange}
          className="mb-0"
        />
        <Input
          label="Hero subtitle"
          type="text"
          name="heroSubtitle"
          id="admin-hero-subtitle"
          value={content.heroSubtitle || ''}
          onChange={onChange}
          className="mb-0"
        />
      </div>
    </section>
  );
}
