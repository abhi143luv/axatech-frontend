import { SectionHeader } from '../common';

export default function HomeWhyChoose({ whyChooseItems, whyChooseTitle }) {
  if (!whyChooseItems?.length) return null;

  return (
    <section className="py-20 md:py-24 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-5">
        <SectionHeader
          label="Why Us"
          title={whyChooseTitle || 'Why Choose Axatech'}
          subtitle="Trusted by businesses across India for Tally licenses, add-ons, and cloud solutions."
          centered
          subtitleClassName="mb-10"
          dataAos="fade-up"
        />

        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {whyChooseItems.map((item, i) => (
            <div
              key={i}
              className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-7 shadow-sm dark:shadow-none transition-all duration-300 hover:border-primary/30 dark:hover:border-secondary/40 hover:shadow-xl hover:shadow-primary/5 dark:hover:shadow-none hover:-translate-y-1" data-aos="fade-up"
            >
              <span
                className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 dark:bg-secondary/20 text-primary dark:text-secondary text-xl font-bold mb-4 transition-all duration-200 group-hover:bg-primary/15 dark:group-hover:bg-secondary/30 group-hover:scale-105"
                aria-hidden
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white" data-aos="fade-up">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed m-0" data-aos="fade-up">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
