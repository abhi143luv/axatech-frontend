import { Input } from '../../common';

const cardHeaderClass =
  'border-b border-slate-200 px-5 py-4 text-base font-semibold text-slate-700 dark:border-gray-600 dark:text-gray-200';
const cardBodyClass = 'space-y-4 p-5';
const textareaClass =
  'w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-base text-slate-800 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px] resize-y dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:focus:border-secondary dark:focus:ring-secondary/20';

export default function IntroSection({ content, onChange }) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className={cardHeaderClass}>Intro</div>
      <div className={cardBodyClass}>
        <Input
          label="Intro title"
          type="text"
          name="introTitle"
          id="admin-intro-title"
          value={content.introTitle || ''}
          onChange={onChange}
          className="mb-0"
        />
        <div className="mb-0">
          <label htmlFor="admin-intro-text" className="mb-1.5 block font-medium text-slate-600 dark:text-gray-400">
            Intro text
          </label>
          <textarea
            id="admin-intro-text"
            name="introText"
            className={textareaClass}
            value={content.introText || ''}
            onChange={onChange}
            rows={4}
          />
        </div>
      </div>
    </section>
  );
}
