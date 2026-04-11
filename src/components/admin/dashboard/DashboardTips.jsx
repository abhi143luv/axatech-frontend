const TIPS = [
  'Respond to new enquiries from the Enquiries page to keep leads engaged.',
  'Use Home Content to update hero text, features and CTAs on the main site.',
  'Add products and assign categories to keep the Add-ons page organized.',
  'Cloud plans and licenses can be managed from their respective admin sections.',
];

export default function DashboardTips() {
  return (
    <section className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="border-b border-slate-200 px-5 py-4 text-base font-semibold text-slate-700 dark:border-gray-600 dark:text-gray-200">
        Quick tips
      </div>
      <ul className="m-0 list-none space-y-3 p-5">
        {TIPS.map((tip, i) => (
          <li
            key={i}
            className="flex gap-3 text-sm text-slate-600 dark:text-gray-300"
          >
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-success dark:bg-secondary" aria-hidden />
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
