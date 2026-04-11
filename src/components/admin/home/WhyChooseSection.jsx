import { Input } from '../../common';

const cardHeaderClass =
  'border-b border-slate-200 px-5 py-4 text-base font-semibold text-slate-700 dark:border-gray-600 dark:text-gray-200';

export default function WhyChooseSection({ content, onChange }) {
  const items = content.whyChooseItems || [];
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className={cardHeaderClass}>Why Choose section</div>
      <div className="p-5">
        <div className="mb-4">
          <Input
            label="Section title"
            type="text"
            name="whyChooseTitle"
            id="admin-why-choose-title"
            value={content.whyChooseTitle || ''}
            onChange={onChange}
            className="mb-0"
          />
        </div>
        {items.map((item, i) => (
          <div
            key={i}
            className={i > 0 ? 'mt-5 border-t border-slate-200 pt-5 dark:border-gray-600' : ''}
          >
            <h4 className="mb-3 text-[0.95rem] font-semibold text-slate-600 dark:text-gray-400">
              Item {i + 1}
            </h4>
            <div className="space-y-4">
              <Input
                label="Title"
                type="text"
                name={`whyChoose_${i}_title`}
                id={`admin-why-${i}-title`}
                value={item.title || ''}
                onChange={onChange}
                className="mb-0"
              />
              <Input
                label="Description"
                type="text"
                name={`whyChoose_${i}_description`}
                id={`admin-why-${i}-description`}
                value={item.description || ''}
                onChange={onChange}
                className="mb-0"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
